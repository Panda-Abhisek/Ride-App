package com.panda.ride.service;



import com.panda.ride.dto.DriverDTO;
import com.panda.ride.exception.DriverException;
import com.panda.ride.model.Driver;
import com.panda.ride.model.Ride;
import com.panda.ride.security.request.DriversSignupRequest;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface DriverService {
	
	public Driver registerDriver(DriversSignupRequest driverSignupRequest);
	
	public List<Driver> getAvailableDrivers(double pickupLatitude,
											double pickupLongitude, double radius, Ride ride);
	
	public Driver findNearestDriver(List<Driver> availableDrivers,
									double pickupLatitude, double pickupLongitude);
	
	public Driver getReqDriverProfile(HttpServletRequest request) throws DriverException;
	
	public Ride getDriversCurrentRide(Integer driverId) throws DriverException;
	
	public List<Ride> getAllocatedRides(Integer driverId) throws DriverException;
	
	public Driver findDriverById(Integer driverId) throws DriverException;
	
	public List<Ride> completedRids(Integer driverId) throws DriverException;

	DriverDTO findDriverByToken(String jwt);

	List<DriverDTO> getAllDrivers();
}
