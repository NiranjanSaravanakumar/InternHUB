package com.internhub.matching.dto;

import lombok.Data;

/**
 * Used for POST /api/auth/register/recruiter
 * Captures both User and RecruiterProfile fields in one request.
 */
@Data
public class RecruiterRegisterRequest {

    // ── User fields ──────────────────────────────────────────────────────
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;

    // ── RecruiterProfile fields ──────────────────────────────────────────
    private String companyName;
    private String employeeRole;   // e.g. "HR Manager", "CTO", "Tech Lead"
}
