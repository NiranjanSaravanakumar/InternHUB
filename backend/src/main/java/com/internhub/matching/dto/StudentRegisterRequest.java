package com.internhub.matching.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentRegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String collegeName;
    private String degree;
    private String department;
    private Integer passoutYear;
}
