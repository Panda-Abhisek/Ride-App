package com.panda.ride.controller;

import com.panda.ride.dto.DriverDTO;
import com.panda.ride.dto.RideDTO;
import com.panda.ride.exception.DriverException;
import com.panda.ride.exception.RideException;
import com.panda.ride.exception.UserException;
import com.panda.ride.model.Driver;
import com.panda.ride.model.Ride;
import com.panda.ride.model.User;
import com.panda.ride.security.jwt.JwtUtils;
import com.panda.ride.security.request.RideRequest;
import com.panda.ride.security.request.StartRideRequest;
import com.panda.ride.security.response.MessageResponse;
import com.panda.ride.service.DriverService;
import com.panda.ride.service.RideService;
import com.panda.ride.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rides")
public class RideController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private RideService rideService;
	
	@Autowired
	private DriverService driverService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JwtUtils jwtUtils;

	@PostMapping("/request")
	public ResponseEntity<RideDTO> userRequestRideHandler(@RequestBody RideRequest rideRequest, HttpServletRequest request) throws UserException, DriverException{

		String valueJwt = jwtUtils.getJwtFromCookies(request);
		System.out.println("Value Jwt: " + valueJwt);

		User user = userService.findUserByToken(valueJwt);
		Ride ride = rideService.requestRide(rideRequest, user);

		RideDTO rideDto = modelMapper.map(ride, RideDTO.class);
		return new ResponseEntity<>(rideDto,HttpStatus.ACCEPTED);
	}
	
	@PutMapping("/{rideId}/accept")
	public ResponseEntity<MessageResponse> acceptRideHandler(@PathVariable Integer rideId) throws UserException, RideException{
		rideService.acceptRide(rideId);
		MessageResponse res=new MessageResponse("Ride Accepted By Driver");
		return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
	}
	
	@PutMapping("/{rideId}/decline")
	public ResponseEntity<MessageResponse> declineRideHandler(@PathVariable Integer rideId, HttpServletRequest request)
			throws UserException, RideException, DriverException {
		Driver driver = driverService.getReqDriverProfile(request);
		rideService.declineRide(rideId, driver.getId());
		MessageResponse res=new MessageResponse("Ride decline By Driver");
		return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
	}
	
	@PutMapping("/{rideId}/start")
	public ResponseEntity<MessageResponse> rideStartHandler(@PathVariable Integer rideId, @RequestBody StartRideRequest req) throws UserException, RideException{
		rideService.startRide(rideId,req.getOtp());
		MessageResponse res=new MessageResponse("Ride is started");
		return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
	}

	@PutMapping("/{rideId}/complete")
	public ResponseEntity<MessageResponse> rideCompleteHandler(@PathVariable Integer rideId) throws UserException, RideException{
//		System.out.println("In complete ride handler");
//		System.out.println("Ride ID: " + rideId);
		rideService.completeRide(rideId);
		MessageResponse res = new MessageResponse("Ride Is Completed Thank You For Booking Cab");
		return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/{rideId}")
	public ResponseEntity<RideDTO> findRideByIdHandler(@PathVariable Integer rideId, HttpServletRequest request) throws UserException, RideException, DriverException {
		String jwt = jwtUtils.getJwtFromCookies(request);
//		User user =userService.findUserByToken(jwt);
		DriverDTO driver = driverService.findDriverByToken(jwt);
		if(driver==null) {
			User user =userService.findUserByToken(jwt);
		}
		Ride ride =rideService.findRideById(rideId);

		RideDTO rideDto = modelMapper.map(ride, RideDTO.class);
		return new ResponseEntity<RideDTO>(rideDto,HttpStatus.ACCEPTED);
	}

//	complete all ride apis
}
