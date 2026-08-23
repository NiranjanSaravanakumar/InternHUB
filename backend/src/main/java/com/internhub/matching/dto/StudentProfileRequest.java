package com.internhub.matching.dto;

import lombok.Data;
import java.util.List;

@Data
public class StudentProfileRequest {
    private Double cgpa;
    private List<String> skills;
    private String preferredDomain;
    private Integer experienceMonths;
    private String preferredLocation;
}
