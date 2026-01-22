package com.panda.ride.controller;

import com.panda.ride.exception.UserException;
import com.panda.ride.model.Driver;
import com.panda.ride.model.User;
import com.panda.ride.repository.DriverRepository;
import com.panda.ride.repository.UserRepository;
import com.panda.ride.security.jwt.JwtUtils;
import com.panda.ride.security.response.MessageResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	
	@Autowired
	private JwtUtils jwtUtil;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private DriverRepository driverRepository;
	
	@GetMapping({"/api","/"})
	public ResponseEntity<MessageResponse> homeController(){
		MessageResponse res = new MessageResponse("welcome to cab booking api");
		return new ResponseEntity<MessageResponse>(res,HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/api/profile")
	public ResponseEntity<?> userProfileHandler(HttpServletRequest request) throws UserException {
		String jwt = jwtUtil.getJwtFromCookies(request);
		System.out.println("jwt - " + jwt);
		String email = jwtUtil.getEmailFromJwtToken(jwt);
		if(email == null) {
			throw new BadCredentialsException("invalid token recived");
		}
		
		Driver driver = driverRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("Driver not found with this email: " + email));
		if(driver != null) {
			return new ResponseEntity<Driver>(driver,HttpStatus.ACCEPTED);
		}
		
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with this email: " + email));
		if(user != null) {
			System.out.println("user - " + user.getEmail());
			return new ResponseEntity<User>(user,HttpStatus.ACCEPTED);
		}
		
		throw new UserException("user not found with email " + email);
	}

}
