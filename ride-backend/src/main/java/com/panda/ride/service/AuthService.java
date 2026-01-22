package com.panda.ride.service;

import com.panda.ride.dto.AuthenticationResult;
import com.panda.ride.dto.UserResponse;
import com.panda.ride.security.request.DriversSignupRequest;
import com.panda.ride.security.request.LoginRequest;
import com.panda.ride.security.request.SignupRequest;
import com.panda.ride.security.response.MessageResponse;
import com.panda.ride.security.response.UserInfoResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

public interface AuthService {

    AuthenticationResult login(LoginRequest loginRequest);

    ResponseEntity<MessageResponse> register(SignupRequest signUpRequest);

    ResponseEntity<MessageResponse> register(DriversSignupRequest driversSignupRequest);

    UserInfoResponse getCurrentUserDetails(Authentication authentication);

    ResponseCookie logoutUser();

    UserResponse getAllDrivers(Pageable pageable);
}