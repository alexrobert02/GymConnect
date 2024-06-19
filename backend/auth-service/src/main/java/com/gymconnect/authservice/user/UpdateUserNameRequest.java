package com.gymconnect.authservice.user;

import lombok.Data;

@Data
public class UpdateUserNameRequest {
    private String firstName;
    private String lastName;
}
