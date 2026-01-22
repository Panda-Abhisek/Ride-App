package com.panda.ride.security.response;

import com.panda.ride.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
    private Long id;
    private String jwtToken;
    private String username;
    private List<String> roles;
    private String email;

    public UserInfoResponse(Long id, String username, List<String> roles) {
        this.id = id;
        this.username = username;
        this.roles = roles;
    }

    public static UserInfoResponse build(Long id, String username, List<String> roles) {
        return new UserInfoResponse(id, username, roles);
    }

    public UserInfoResponse(Long id, String username, List<String> roles, String email, String jwtToken) {
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.email = email;
        this.jwtToken = jwtToken;
    }
}


