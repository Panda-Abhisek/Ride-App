package com.panda.ride.service.impl;

import com.panda.ride.dto.RideDTO;
import com.panda.ride.exception.DriverException;
import com.panda.ride.exception.RideException;
import com.panda.ride.model.*;
import com.panda.ride.repository.DriverRepository;
import com.panda.ride.repository.RideRepository;
import com.panda.ride.security.request.RideRequest;
import com.panda.ride.service.Calculaters;
import com.panda.ride.service.DriverService;
import com.panda.ride.service.RideService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class RideServiceImplementation implements RideService {
	
	@Autowired
	private DriverService driverService;
	
	@Autowired
	private RideRepository rideRepository;
	
	@Autowired
	private Calculaters calculaters;
	
	@Autowired
	private DriverRepository driverRepository;

    @Autowired
    private ModelMapper modelMapper;

	@Override
	public Ride requestRide(RideRequest rideRequest, User user) throws DriverException {
		
		double pickupLatitude = rideRequest.getPickupLatitude();
		double pickupLongitude = rideRequest.getPickupLongitude();
		double destinationLatitude = rideRequest.getDestinationLatitude();
		double destinationLongitude = rideRequest.getDestinationLongitude();
		String pickupArea = rideRequest.getPickupArea();
		String destinationArea = rideRequest.getDestinationArea();
		
		Ride existingRide = new Ride();
		
		List<Driver> availableDrivers = driverService.getAvailableDrivers(pickupLatitude,
				pickupLongitude, 5, existingRide);
//		System.out.println(" available drivers size " + availableDrivers.size());
//		for(Driver d : availableDrivers) {
//			System.out.println(" available driver id " + d.getId());
//		}
		
		Driver nearestDriver = driverService.findNearestDriver(availableDrivers, pickupLatitude, pickupLongitude);
//		System.out.println(" nearest driver id " + (nearestDriver != null ? nearestDriver.getId() : "null"));

		if(nearestDriver == null) {
			System.out.println("Nearest driver is null, throwing exception");
			throw new DriverException("Driver not available");
		}
		
//		System.out.println(" duration ----- before ride ");
		
        Ride ride = createRideRequest(user, nearestDriver,
				pickupLatitude, pickupLongitude,
        		destinationLatitude, destinationLongitude,
        		pickupArea,destinationArea
        		);

//        System.out.println(" duration ----- after ride ")
        return ride;
	}

	@Override
	public Ride createRideRequest(User user, Driver nearesDriver, double pickupLatitude, 
			double pickupLongitude,double destinationLatitude, double destinationLongitude,
			String pickupArea,String destinationArea) {
		
		Ride ride=new Ride();

		ride.setDriver(nearesDriver);
		ride.setUser(user);
		ride.setPickupLatitude(pickupLatitude);
		ride.setPickupLongitude(pickupLongitude);
		ride.setDestinationLatitude(destinationLatitude);
		ride.setDestinationLongitude(destinationLongitude);
		ride.setStatus(RideStatus.REQUESTED);
		ride.setPickupArea(pickupArea);
		ride.setDestinationArea(destinationArea);
		
//		System.out.println(" ----- a - " + pickupLatitude);
		return rideRepository.save(ride);
	}

	@Override
	public void acceptRide(Integer rideId) throws RideException {
		Ride ride=findRideById(rideId);
		ride.setStatus(RideStatus.ACCEPTED);
		
		Driver driver = ride.getDriver();
		driver.setCurrentRide(ride);
		
        Random random = new Random();
        int otp = random.nextInt(9000) + 1000;
        ride.setOtp(otp);
        
		driverRepository.save(driver);
		rideRepository.save(ride);
	}

	@Override
	public void startRide(Integer rideId,int otp) throws RideException {
		Ride ride=findRideById(rideId);
		
		if(otp!=ride.getOtp()) {
			throw new RideException("please provide a valid otp");
		}
		
		ride.setStatus(RideStatus.STARTED);
		ride.setStartTime(LocalDateTime.now());
		rideRepository.save(ride);
	}

	@Override
	public void completeRide(Integer rideId) throws RideException {
//		System.out.println("In complete ride service implementation");
		Ride ride = findRideById(rideId);
//		System.out.println("Ride found: " + ride);
		ride.setStatus(RideStatus.COMPLETED);
		ride.setEndTime(LocalDateTime.now());;
		
		double distance = calculaters.calculateDistance(ride.getDestinationLatitude(), ride.getDestinationLongitude(), ride.getPickupLatitude(), ride.getPickupLongitude());
		
		LocalDateTime start = ride.getStartTime();
		LocalDateTime end = ride.getEndTime();
		Duration duration = Duration.between(start, end);
		long milliSecond = duration.toMillis();

//		System.out.println("duration ------- "+ milliSecond);
		double fare = calculaters.calculateFare(distance);
		
		ride.setDistance(Math.round(distance * 100.0) / 100.0);
		ride.setFare((int) Math.round(fare));
		ride.setDuration(milliSecond);
		ride.setEndTime(LocalDateTime.now());

		Driver driver = ride.getDriver();
		driver.getRides().add(ride);
		driver.setCurrentRide(null);
		
		Integer driversRevenue = (int) (driver.getTotalRevenue() + Math.round(fare*0.8)) ;
		driver.setTotalRevenue(driversRevenue);
		
//		System.out.println("drivers revenue -- " + driversRevenue);
		
		driverRepository.save(driver);
		rideRepository.save(ride);
	}
	
	@Override
	public void cancleRide(Integer rideId) throws RideException {
		Ride ride=findRideById(rideId);
		ride.setStatus(RideStatus.CANCELLED);
		rideRepository.save(ride);
	}

	@Override
	public Ride findRideById(Integer rideId) throws RideException {
//		System.out.println("Inside find ride by id method");
//		System.out.println("Finding ride with id: " + rideId);
		Optional<Ride> ride = rideRepository.findById(rideId);
//		System.out.println("Ride found with driver: --------  "+ride);
		if(ride.isPresent()) {
			return ride.get();
		}
		throw new RideException("ride not exist with id "+rideId);
	}

	@Override
	public List<RideDTO> getAllRides() {
		List<RideDTO> rideDTOS = rideRepository.findAll().stream()
				.map(ride -> modelMapper.map(ride, RideDTO.class))
				.toList();
		if(rideDTOS.isEmpty()) {
			return null;
		}
		return rideDTOS;
	}

	@Override
	public void declineRide(Integer rideId, Long driverId) throws RideException {
		
		Ride ride =findRideById(rideId);
		System.out.println(ride.getId());
		
		ride.getDeclinedDrivers().add(Math.toIntExact(driverId));
		
		System.out.println(ride.getId()+" - "+ride.getDeclinedDrivers());
		
		List<Driver> availableDrivers=driverService.getAvailableDrivers(ride.getPickupLatitude(), 
				ride.getPickupLongitude(), 5,ride);
		
		Driver nearestDriver=driverService.findNearestDriver(availableDrivers, ride.getPickupLatitude(), 
				ride.getPickupLongitude());
		
		ride.setDriver(nearestDriver);
		
		rideRepository.save(ride);
	}
}
