package com.panda.ride.dto;

import com.panda.ride.model.Role;
import com.panda.ride.model.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverDTO {

	private Integer id;
    private String name;
    private String email;
    private String mobile;
    private double rating;
    private double latitude;
    private double longitude;
    private Set<Role> role;
    private Vehicle vehicle;
     
}
