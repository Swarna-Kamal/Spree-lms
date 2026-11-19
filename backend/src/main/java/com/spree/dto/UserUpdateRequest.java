package com.spree.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String roleName;
    private Boolean isActive;
}
