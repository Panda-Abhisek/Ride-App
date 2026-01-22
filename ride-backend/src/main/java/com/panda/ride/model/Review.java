package com.panda.ride.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	@ManyToOne
	private User user;
	
	@ManyToOne
	private Driver driver;
	
	private Integer rating;
	
	private String comment;

	@Override
	public String toString() {
		return "Review [id=" + id + ", user=" + user + ", driver=" + driver + ", rating=" + rating + ", comment="
				+ comment + "]";
	}

}
