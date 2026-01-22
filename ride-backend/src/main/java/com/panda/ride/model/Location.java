package com.panda.ride.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(name = "latitude", nullable = false)
    private Double latitude;
 
    @Column(name = "longitude", nullable = false)
    private Double longitude;

	@Override
	public String toString() {
		return "Location [id=" + id + ", latitude=" + latitude + ", longitude=" + longitude + "]";
	}
    
}
