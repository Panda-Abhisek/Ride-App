package com.panda.ride.service;

import com.panda.ride.dto.UserDTO;
import com.panda.ride.exception.UserException;
import com.panda.ride.model.Ride;
import com.panda.ride.model.User;

import java.util.List;

public interface UserService {
	
	public User createUser(User user) throws UserException;
	
	public User getReqUserProfile() throws UserException;
	
	public User findUserById(Integer Id) throws UserException;
	
	public User findUserByEmail(String email) throws UserException;
	
	public User findUserByToken(String token) throws UserException;
	
	public List<Ride> completedRids(Integer userId) throws UserException;
	
	List<UserDTO> getAllUsers();
}
