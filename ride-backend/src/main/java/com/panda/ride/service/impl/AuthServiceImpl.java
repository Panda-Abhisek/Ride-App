package com.panda.ride.service.impl;

import com.panda.ride.dto.DriverDTO;
import com.panda.ride.model.AppRole;
import com.panda.ride.model.Driver;
import com.panda.ride.model.Role;
import com.panda.ride.model.User;
import com.panda.ride.dto.AuthenticationResult;
import com.panda.ride.dto.UserResponse;
import com.panda.ride.repository.DriverRepository;
import com.panda.ride.repository.RoleRepository;
import com.panda.ride.repository.UserRepository;
import com.panda.ride.security.jwt.JwtUtils;
import com.panda.ride.security.request.DriversSignupRequest;
import com.panda.ride.security.request.LoginRequest;
import com.panda.ride.security.request.SignupRequest;
import com.panda.ride.security.response.MessageResponse;
import com.panda.ride.security.response.UserInfoResponse;
import com.panda.ride.security.services.UserDetailsImpl;
import com.panda.ride.service.AuthService;
import com.panda.ride.service.DriverService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DriverRepository driverRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    ModelMapper modelMapper;
    @Autowired
    private DriverService driverService;

    @Override
    public AuthenticationResult login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUserName(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        System.out.println("User Details: " + userDetails);
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
        System.out.println("Jwt Cookie: " + jwtCookie);
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),
                userDetails.getUsername(), roles, userDetails.getEmail(), jwtCookie.toString());
        return new AuthenticationResult(response, jwtCookie);
    }

    @Override
    public ResponseEntity<MessageResponse> register(SignupRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUserName())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUserName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getMobile());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_RIDER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_RIDER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @Override
    public ResponseEntity<MessageResponse> register(DriversSignupRequest driversSignupRequest) {
        if (userRepository.existsByUserName(driversSignupRequest.getName())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(driversSignupRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new driver's account
        Driver driver = driverService.registerDriver(driversSignupRequest);

//        Set<String> strRoles = driversSignupRequest.getRole();
//        Set<Role> roles = new HashSet<>();
//
//        if (strRoles == null) {
//            Role driverRole = roleRepository.findByRoleName(AppRole.ROLE_DRIVER)
//                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//            roles.add(driverRole);
//        } else {
//            strRoles.forEach(role -> {
//                switch (role) {
//                    case "admin":
//                        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
//                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//                        roles.add(adminRole);
//
//                        break;
//                    default:
//                        Role driverRole = roleRepository.findByRoleName(AppRole.ROLE_DRIVER)
//                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//                        roles.add(driverRole);
//                }
//            });
//        }
//
//        driver.setRoles(roles);
//        driverRepository.save(driver);
        return ResponseEntity.ok(new MessageResponse("Driver registered successfully!"));
    }

    @Override
    public UserInfoResponse getCurrentUserDetails(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//        System.out.println("User Details: " + userDetails);
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),
                userDetails.getUsername(), roles);
//        System.out.println("User Info Response: " + response);

        return response;
    }

    @Override
    public ResponseCookie logoutUser() {
        return jwtUtils.getCleanJwtCookie();
    }

    @Override
    public UserResponse getAllDrivers(Pageable pageable) {
        Page<Driver> allDrivers = driverRepository.findByRoles_RoleName(AppRole.ROLE_DRIVER, pageable);
        List<DriverDTO> driverDTOS = allDrivers.getContent()
                .stream()
                .map(p -> modelMapper.map(p, DriverDTO.class))
                .collect(Collectors.toList());

        UserResponse response = new UserResponse();
        response.setContent(driverDTOS);
        response.setPageNumber(allDrivers.getNumber());
        response.setPageSize(allDrivers.getSize());
        response.setTotalElements(allDrivers.getTotalElements());
        response.setTotalPages(allDrivers.getTotalPages());
        response.setLastPage(allDrivers.isLast());
        return response;
    }


}