package com.panda.ride.service.impl;


import com.panda.ride.dto.DriverDTO;
import com.panda.ride.dto.UserDTO;
import com.panda.ride.exception.DriverException;
import com.panda.ride.model.*;
import com.panda.ride.repository.*;
import com.panda.ride.security.jwt.JwtUtils;
import com.panda.ride.security.request.DriversSignupRequest;
import com.panda.ride.service.Calculaters;
import com.panda.ride.service.DriverService;
import com.panda.ride.util.AuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DriverServiceImplementation implements DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private Calculaters distanceCalculator;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtil;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private AuthUtil authUtil;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<Driver> getAvailableDrivers(double pickupLatitude, double pickupLongitude, double radius, Ride ride) {
        List<Driver> allDrivers = driverRepository.findAll();
        System.out.println("Total drivers in system: " + allDrivers.size());
        List<Driver> availableDriver = new ArrayList<>();

        for (Driver driver : allDrivers) {
            if (driver.getCurrentRide() != null && driver.getCurrentRide().getStatus() != RideStatus.COMPLETED) {
                continue;
            }
            if (ride.getDeclinedDrivers().contains(driver.getId())) {
                System.out.println("its containes");
                continue;
            }

            double driverLatitude = driver.getLatitude();
            double driverLongitude = driver.getLongitude();
            System.out.println("Driver ID: " + driver.getId() + " at (" + driverLatitude + ", " + driverLongitude + ")");
            double distance = distanceCalculator.calculateDistance(driverLatitude, driverLongitude, pickupLatitude, pickupLongitude);
            System.out.println("Driver ID: " + driver.getId() + ", Distance: " + distance);
			if(distance<=radius) {
                availableDriver.add(driver);
			}
        }
        System.out.println("Available drivers within radius " + radius + ": " + availableDriver.size());
        return availableDriver;
    }

    @Override
    public Driver findNearestDriver(List<Driver> availableDrivers, double pickupLatitude, double pickupLongitude) {

        double min = Double.MAX_VALUE;
        Driver nearestDriver = null;

        for (Driver driver : availableDrivers) {
            double driverLatitude = driver.getLatitude();
            double driverLongitude = driver.getLongitude();
            System.out.println("Checking driver ID: " + driver.getId() + " at (" + driverLatitude + ", " + driverLongitude + ")");
            double distance = distanceCalculator.calculateDistance(pickupLatitude, pickupLongitude, driverLatitude, driverLongitude);
            System.out.println("Driver ID: " + driver.getId() + ", Distance: " + distance);
            if (min > distance) {
                min = distance;
                nearestDriver = driver;
            }
        }
        System.out.println("Nearest driver found: " + (nearestDriver != null ? nearestDriver.getId() : "null"));
        return nearestDriver;
    }

    @Override
    public Driver registerDriver(DriversSignupRequest driversSignupRequest) {

        License license = driversSignupRequest.getLicense();
        Vehicle vehicle = driversSignupRequest.getVehicle();

        License createdLicense = new License();

        createdLicense.setLicenseState(license.getLicenseState());
        createdLicense.setLicenseNumber(license.getLicenseNumber());
        createdLicense.setLicenseExpirationDate(license.getLicenseExpirationDate());
        createdLicense.setId(license.getId());

        License savedLicense = licenseRepository.save(createdLicense);

        Vehicle createdVehicle = new Vehicle();

        createdVehicle.setCapacity(vehicle.getCapacity());
        createdVehicle.setColor(vehicle.getColor());
        createdVehicle.setId(vehicle.getId());
        createdVehicle.setLicensePlate(vehicle.getLicensePlate());
        createdVehicle.setMake(vehicle.getMake());
        createdVehicle.setModel(vehicle.getModel());
        createdVehicle.setYear(vehicle.getYear());

        Vehicle savedVehicle = vehicleRepository.save(createdVehicle);

        Driver driver = new Driver();

        String encodedPassword = passwordEncoder.encode(driversSignupRequest.getPassword());

        driver.setEmail(driversSignupRequest.getEmail());
        driver.setUserName(driversSignupRequest.getName());
        driver.setMobile(driversSignupRequest.getMobile());
        driver.setPassword(encodedPassword);
        driver.setLicense(savedLicense);
        driver.setVehicle(savedVehicle);

        driver.setLatitude(driversSignupRequest.getLatitude());
        driver.setLongitude(driversSignupRequest.getLongitude());

        Set<String> strRoles = driversSignupRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role driverRole = roleRepository.findByRoleName(AppRole.ROLE_DRIVER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(driverRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    default:
                        Role driverRole = roleRepository.findByRoleName(AppRole.ROLE_DRIVER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(driverRole);
                }
            });
        }

        driver.setRoles(roles);

        Driver createdDriver = driverRepository.save(driver);

        savedLicense.setDriver(createdDriver);
        savedVehicle.setDriver(createdDriver);

        licenseRepository.save(savedLicense);
        vehicleRepository.save(savedVehicle);

        return createdDriver;
    }

    @Override
    public Driver getReqDriverProfile(HttpServletRequest request) throws DriverException {
        System.out.println("In getReqDriverProfile method");
        String jwt = jwtUtil.getJwtFromCookies(request);
        String email = jwtUtil.getEmailFromJwtToken(jwt);
        String username = jwtUtil.getUserNameFromJwtToken(jwt);
        System.out.println("username & email from token : " + username + email);
        Driver driver = driverRepository.findByUserNameOrEmail(username, email).orElseThrow(
                () -> new DriverException("driver not exist with email " + email)
        );
        System.out.println("driver found : " + driver);
        return driver;
    }

    @Override
    public Ride getDriversCurrentRide(Integer driverId) throws DriverException {
        Driver driver = findDriverById(driverId);
        return driver.getCurrentRide();
    }

    @Override
    public List<Ride> getAllocatedRides(Integer driverId) throws DriverException {
        List<Ride> allocatedRides = driverRepository.getAllocatedRides(driverId);
        return allocatedRides;
    }

    @Override
    public Driver findDriverById(Integer driverId) throws DriverException {
        Optional<Driver> opt = driverRepository.findById(driverId);
        if (opt.isPresent()) {
            return opt.get();
        }
        throw new DriverException("driver not exist with id " + driverId);
    }

    @Override
    public List<Ride> completedRids(Integer driverId) throws DriverException {
        List<Ride> completedRides = driverRepository.getCompletedRides(driverId);
        return completedRides;
    }

    @Override
    public DriverDTO findDriverByToken(String jwt) {
        String email = jwtUtil.getEmailFromJwtToken(jwt);
        if(email==null) {
            throw new BadCredentialsException("invalid token recived");
        }
        Optional<Driver> driver = driverRepository.findByEmail(email);
        if(driver.isEmpty()) {
            return null;
        }
        System.out.println("driver found by token : " + driver);
        return modelMapper.map(driver, DriverDTO.class);
    }

    @Override
    public List<DriverDTO> getAllDrivers() {
        List<DriverDTO> driverDTOs = driverRepository.findAll().stream()
                .map(driver -> modelMapper.map(driver, DriverDTO.class))
                .toList();
        if(driverDTOs.isEmpty()) {
            return null;
        }
        return driverDTOs;
    }

}
