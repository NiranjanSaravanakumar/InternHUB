package com.internhub.matching.dto;

import lombok.Data;

/**
 * Used for POST /api/auth/register/student
 * Captures both User and StudentProfile fields in one request.
 */
@Data
public class StudentRegisterRequest {

    // ── User fields ──────────────────────────────────────────────────────
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;

    // ── StudentProfile fields ────────────────────────────────────────────
    private String dateOfBirth;      // ISO date: "2002-08-15"
    private String collegeName;
    private String degree;
    private String department;
    private Integer passoutYear;
}
