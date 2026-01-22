package com.panda.ride.security.services;

import com.panda.ride.model.Driver;
import com.panda.ride.model.User;
import com.panda.ride.repository.DriverRepository;
import com.panda.ride.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Try user repo: adjust method names if your repository uses different method names
        Optional<User> userOpt = userRepository.findByUserNameOrEmail(usernameOrEmail, usernameOrEmail);
        if (userOpt.isPresent()) {
            return UserDetailsImpl.build(userOpt.get());
        }

        // Try driver repo
        Optional<Driver> driverOpt = driverRepository.findByUserNameOrEmail(usernameOrEmail, usernameOrEmail);
        if (driverOpt.isPresent()) {
            return UserDetailsImpl.build(driverOpt.get());
        }

        throw new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail);
    }

//    @Override
//    @Transactional
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        List<GrantedAuthority> authorities = new ArrayList<>();
//
//        User user = userRepository.findByEmail(email);
//        if (user != null) {
////            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
//            return UserDetailsImpl.build(user);
//        }
//
//        // Check if the user exists in the driver repository
//        Driver driver = driverRepository.findByEmail(email);
//        if (driver != null) {
////            return new org.springframework.security.core.userdetails.User(driver.getEmail(), driver.getPassword(), authorities);
//            return UserDetailsImpl.build(driver);
//        }
//
//        throw new UsernameNotFoundException("User not found with email: " + email);
//
//    }
}
