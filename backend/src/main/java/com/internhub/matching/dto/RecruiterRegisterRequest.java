package com.internhub.matching.dto;

import lombok.Data;

@Data
public class RecruiterRegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String companyName;
    private String employeeRole;
}
