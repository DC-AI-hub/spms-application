package com.spms.backend.controller.dto.sys;


import com.spms.backend.repository.entities.idm.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class LoginInfo {
    private String username;
    private String email;
    private List<Role> roles;
    private String firstName;
    private String lastName;
    private String userType;


}
