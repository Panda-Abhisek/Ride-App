package com.panda.ride.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/api/home")
    public String hello() {
        return "Hello to Ride";
    }
}
