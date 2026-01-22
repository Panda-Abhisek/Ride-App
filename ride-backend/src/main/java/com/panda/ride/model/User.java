package com.panda.ride.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Column(unique = true)
	private String userName;

	private String email;
	
	@Column(unique = true)
	private String mobile;
	
	private String password;
	
//	private String profilePicture;

//	@ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
	@ManyToMany(fetch = FetchType.EAGER)
	private Set<Role> roles;

//	@Override
//	public String toString() {
//		return "User [id=" + id + ", userName=" + userName + ", email=" + email + ", mobile=" + mobile + ", password="
//				+ password + ", profilePicture=" + profilePicture + "]";
//	}

	public User(String userName, String email, String password) {
		this.userName = userName;
		this.email = email;
		this.password = password;
	}

	public User(String userName, String email, String password, String mobile) {
		this.userName = userName;
		this.email = email;
		this.password = password;
		this.mobile = mobile;
	}

	@Override
	public String toString() {
		return "User{" +
				"id=" + id +
				", userName='" + userName + '\'' +
				", email='" + email + '\'' +
				", mobile='" + mobile + '\'' +
				", password='" + password + '\'' +
				", roles=" + roles +
				'}';
	}
}
