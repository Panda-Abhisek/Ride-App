package com.panda.ride.controller;

import com.panda.ride.exception.DriverException;
import com.panda.ride.model.Driver;
import com.panda.ride.model.Ride;
import com.panda.ride.security.jwt.JwtUtils;
import com.panda.ride.service.DriverService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {
	
	@Autowired
	private DriverService driverService;
    @Autowired
    private JwtUtils jwtUtils;

	@GetMapping("/profile")
	public ResponseEntity<Driver> getReqDriverProfileHandler(HttpServletRequest request) throws DriverException {
		Driver driver = driverService.getReqDriverProfile(request);
		return new ResponseEntity<Driver>(driver,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/{driverId}/current_ride")
	public ResponseEntity<Ride> getDriversCurrentRideHandler(@PathVariable Integer driverId) throws DriverException{
		Ride ride=driverService.getDriversCurrentRide(driverId);
		return new ResponseEntity<Ride>(ride,HttpStatus.ACCEPTED);
	}

	@GetMapping("/{driverId}/allocated")
	public ResponseEntity<List<Ride>> getAllocatedRidesHandler(@PathVariable Integer driverId) throws DriverException{
		List<Ride> rides=driverService.getAllocatedRides(driverId);
		return new ResponseEntity<>(rides,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/rides/completed")
	public ResponseEntity<List<Ride>> getcompletedRidesHandler(HttpServletRequest request) throws DriverException{
		System.out.println("Inside completed rides handler");
		Driver driver = driverService.getReqDriverProfile(request);
		System.out.println("Driver id: " + driver.getId());
		List<Ride> rides=driverService.completedRids(Math.toIntExact(driver.getId()));
		return new ResponseEntity<>(rides,HttpStatus.ACCEPTED);
	}

}
