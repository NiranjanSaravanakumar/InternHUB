package com.internhub.matching.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * Used for POST /api/recruiter/internships
 */
@Data
public class InternshipRequest {
    private String companyName;
    private String role;              // Job title (e.g. "React / Java Developer")
    private List<String> requiredSkills;  // sent as list, stored as comma-separated TEXT
    private BigDecimal minimumCgpa;
    private String domain;
    private String location;          // City name or "Remote"
    private BigDecimal stipend;
}
