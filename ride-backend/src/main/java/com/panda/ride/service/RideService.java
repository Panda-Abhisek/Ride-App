package com.panda.ride.service;

import com.panda.ride.dto.RideDTO;
import com.panda.ride.exception.DriverException;
import com.panda.ride.exception.RideException;
import com.panda.ride.model.Driver;
import com.panda.ride.model.Ride;
import com.panda.ride.model.User;
import com.panda.ride.security.request.RideRequest;

import java.util.List;

public interface RideService {
	public Ride requestRide(RideRequest rideRequest, User user) throws DriverException;
	
	public Ride createRideRequest(User user, Driver nearesDriver,
			double picupLatitude,double pickupLongitude,
			double destinationLatitude,double destinationLongitude,
			String pickupArea,String destinationArea);
	
	public void acceptRide(Integer rideId) throws RideException;
	
	public void declineRide(Integer rideId, Long driverId) throws RideException;
	
	public void startRide(Integer rideId,int opt) throws RideException;
	
	public void completeRide(Integer rideId) throws RideException;
	
	public void cancleRide(Integer rideId) throws RideException;
	
	public Ride findRideById(Integer rideId) throws RideException;

	List<RideDTO> getAllRides();

//	void sendNotificationToDriver(Driver nearestDriver, Ride ride);
}
