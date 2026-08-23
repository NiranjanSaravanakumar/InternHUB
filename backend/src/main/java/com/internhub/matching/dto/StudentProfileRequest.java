package com.internhub.matching.dto;

import lombok.Data;
import java.util.List;

/**
 * Used for PUT /api/student/profile
 * Updates the matching parameters stored in student_profiles.
 */
@Data
public class StudentProfileRequest {
    private Double cgpa;
    private List<String> skills;         // sent as list, stored as comma-separated TEXT
    private String preferredDomain;
    private Integer experienceMonths;
    private String preferredLocation;
}
