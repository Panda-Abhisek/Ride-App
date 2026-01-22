package com.panda.ride.security.request;


import com.panda.ride.model.License;
import com.panda.ride.model.Vehicle;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriversSignupRequest {
	private String name;
	private String email;
	private String mobile;
	private String password;
	private double latitude;
	private double longitude;
	
	@OneToOne(mappedBy = "driver")
	private License license;
	
	@OneToOne(mappedBy="driver")
	private Vehicle vehicle;

	private Set<String> role;
}
