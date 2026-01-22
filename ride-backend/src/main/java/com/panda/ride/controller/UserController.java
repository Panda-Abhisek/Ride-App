package com.panda.ride.controller;

import com.panda.ride.exception.UserException;
import com.panda.ride.model.Ride;
import com.panda.ride.model.User;
import com.panda.ride.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
	@Autowired
	private UserService userService;
	
	@GetMapping("/{userId}")
	public ResponseEntity<User> findUserByIdHandler(@PathVariable Integer userId)throws UserException {
		System.out.println("find by user id");
		User createdUser = userService.findUserById(userId);
		return new ResponseEntity<User>(createdUser,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/profile")
	public ResponseEntity<User> getReqUserProfileHandler() throws UserException{
		User user = userService.getReqUserProfile();
		return new ResponseEntity<User>(user,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/rides/completed")
	public ResponseEntity<List<Ride>> getcompletedRidesHandler() throws UserException {
		User user = userService.getReqUserProfile();
		List<Ride> rides=userService.completedRids(Math.toIntExact(user.getId()));
		return new ResponseEntity<>(rides,HttpStatus.ACCEPTED);
	}

}
