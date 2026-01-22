package com.panda.ride.controller;

import com.panda.ride.config.AppConstants;
import com.panda.ride.dto.AuthenticationResult;
import com.panda.ride.security.request.DriversSignupRequest;
import com.panda.ride.security.request.LoginRequest;
import com.panda.ride.security.request.SignupRequest;
import com.panda.ride.security.response.MessageResponse;
import com.panda.ride.security.response.UserInfoResponse;
import com.panda.ride.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Autowired
    AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        AuthenticationResult result = authService.login(loginRequest);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                result.getJwtCookie().toString())
                .body(result.getResponse());
    }

    @PostMapping("/user/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return authService.register(signUpRequest);
    }

    @PostMapping("/driver/signup")
    public ResponseEntity<?> registerDriver(@Valid @RequestBody DriversSignupRequest driversSignupRequest) {
        return authService.register(driversSignupRequest);
    }

    @GetMapping("/username")
    public ResponseEntity<?> currentUserName(Authentication authentication){
        if (authentication != null)
            return new ResponseEntity<>(authentication.getName(), HttpStatus.OK);
        else
            throw new UsernameNotFoundException("User not logged in");
    }

    @GetMapping("/user")
    public ResponseEntity<UserInfoResponse> getUserDetails(Authentication authentication){
        UserInfoResponse currentUserDetails = authService.getCurrentUserDetails(authentication);
//        System.out.println("Current User Details: " + currentUserDetails);
        return ResponseEntity.ok().body(authService.getCurrentUserDetails(authentication));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signoutUser(){
        ResponseCookie cookie = authService.logoutUser();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                        cookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }

    @GetMapping("/drivers")
    public ResponseEntity<?> getAllDrivers(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber) {

        Sort sortByAndOrder = Sort.by(AppConstants.SORT_DRIVERS_BY).descending();
        Pageable pageDetails = PageRequest.of(pageNumber ,
                Integer.parseInt(AppConstants.PAGE_SIZE), sortByAndOrder);

        return ResponseEntity.ok(authService.getAllDrivers(pageDetails));
    }

}