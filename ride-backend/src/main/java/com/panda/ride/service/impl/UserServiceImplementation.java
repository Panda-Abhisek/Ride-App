package com.panda.ride.service.impl;

import com.panda.ride.dto.UserDTO;
import com.panda.ride.exception.UserException;
import com.panda.ride.model.Ride;
import com.panda.ride.model.User;
import com.panda.ride.repository.UserRepository;
import com.panda.ride.security.jwt.JwtUtils;
import com.panda.ride.service.UserService;
import com.panda.ride.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class UserServiceImplementation implements UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private JwtUtils jwtUtil;

	@Autowired
	private AuthUtil authUtil;
    @Autowired
    private ModelMapper modelMapper;

	@Override
	public User createUser(User user) throws UserException {
		User emailExist = findUserByEmail(user.getEmail());
		if(emailExist!=null)throw new UserException("Email Already Used With Another Account");
		return userRepository.save(user);
	}

	@Override
	public User findUserById(Integer userId) throws UserException {
		Optional<User> opt=userRepository.findById(userId);
		
		if(opt.isPresent()) {
			return opt.get();
		}
		throw new UserException("user not found with id "+userId);
	}

	@Override
	public User findUserByEmail(String email) throws UserException {
		User user=userRepository.findByEmail(email).orElseThrow(() ->
			new UserException("user not found with email "+email));
		return user;
	}

	@Override
	public User getReqUserProfile() throws UserException {
		String email = authUtil.loggedInEmail();
		User user = userRepository.findByEmail(email).orElseThrow(() ->
				new UserException("invalid token ..."));
			return user;
	}

	@Override
	public User findUserByToken(String token) throws UserException {
		String email=jwtUtil.getEmailFromJwtToken(token);
		if(email==null) {
			throw new BadCredentialsException("invalid token recived");
		}
		User user=userRepository.findByEmail(email).orElseThrow(
				() -> new UserException("user not found with email "+email)
		);
		System.out.println("user found by token : "+user);
		return user;
	}

	@Override
	public List<Ride> completedRids(Integer userId) throws UserException {
		List <Ride> completedRides=userRepository.getCompletedRides(userId);
		return completedRides;
	}

	@Override
	public List<UserDTO> getAllUsers() {
		// Mapping User entities to UserDTOs
		List<UserDTO> userDTOs = userRepository.findAll().stream()
				.map(user -> modelMapper.map(user, UserDTO.class))
				.toList();
		if(userDTOs.isEmpty()) {
			return null;
		}
		return userDTOs;
	}

}
