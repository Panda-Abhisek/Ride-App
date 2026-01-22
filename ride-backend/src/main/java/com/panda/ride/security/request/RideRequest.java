package com.panda.ride.security.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RideRequest {
	
	private double pickupLongitude;
	private double pickupLatitude;
	private double destinationLongitude;
	private double destinationLatitude;
	private String pickupArea;
	private String destinationArea;

}
