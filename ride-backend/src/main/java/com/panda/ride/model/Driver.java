package com.panda.ride.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "drivers")
public class Driver {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String userName;
	private String email;
	private String mobile;
	private double rating;
	private double latitude;
	private double longitude;

	@ManyToMany(fetch = FetchType.LAZY)
	private Set<Role> roles;
	
	private String password;
	
	@OneToOne(mappedBy = "driver", cascade = CascadeType.ALL)
	private License license;
	
	@JsonIgnore
	@OneToMany(mappedBy = "driver", cascade = CascadeType.ALL,orphanRemoval = true)
	private List<Ride> rides;
	
	@OneToOne(mappedBy="driver",cascade = CascadeType.ALL, orphanRemoval = true)
	private Vehicle vehicle;
	
	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL)
	private Ride currentRide;
	
	private Integer totalRevenue=0;

	public Driver(String userName, String email, String password) {
		this.userName = userName;
		this.email = email;
		this.password = password;
	}

	@Override
	public String toString() {
		return "Driver [id=" + id + ", driverName=" + userName + ", email=" + email + ", mobile=" + mobile + ", rating=" + rating
				+ ", latitude=" + latitude + ", longitude=" + longitude + "]";
	}
	
	
}
