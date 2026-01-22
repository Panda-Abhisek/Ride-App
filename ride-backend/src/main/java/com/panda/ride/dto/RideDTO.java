package com.panda.ride.dto;

import com.panda.ride.model.RideStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RideDTO {
	
	    private Integer id;
	    private UserDTO user;
	    private DriverDTO driver;
	    private double pickupLatitude;
	    private double pickupLongitude;
	    private double destinationLatitude;
	    private double destinationLongitude;
		private String pickupArea;
		private String destinationArea;
	    private double distance;
	    private long duration;
	    private RideStatus status;
	    private LocalDateTime startTime;
	    private LocalDateTime endTime;
	    private double fare;
//	    private PaymentDetails paymentDetails;
	    private int otp;

}
