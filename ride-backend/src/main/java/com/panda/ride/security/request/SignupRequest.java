package com.panda.ride.security.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {

    @NotBlank(message= "Email is Required")
    @Email(message = "Email should be valid")
    private String email;

    private String userName;

    private String password;

    private String mobile;

    private Set<String> role;

}
