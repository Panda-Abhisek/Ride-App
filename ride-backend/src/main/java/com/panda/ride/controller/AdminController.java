package com.panda.ride.controller;

import com.panda.ride.dto.DriverDTO;
import com.panda.ride.dto.RideDTO;
import com.panda.ride.dto.UserDTO;
import com.panda.ride.service.DriverService;
import com.panda.ride.service.RideService;
import com.panda.ride.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final DriverService driverService;
    private final RideService rideService;

    @GetMapping("/get/riders")
    public ResponseEntity<List<UserDTO>> getAllUsersHandler() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/get/drivers")
    public ResponseEntity<List<DriverDTO>> getAllDriversHandler() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @GetMapping("/get/rides")
    public ResponseEntity<List<RideDTO>> getAllRidesHandler() {
        return ResponseEntity.ok(rideService.getAllRides());
    }
}
