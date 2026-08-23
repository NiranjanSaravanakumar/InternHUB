package com.internhub.matching.dto;

import lombok.Data;
import java.util.List;

@Data
public class InternshipRequest {
    private String title;
    private String company;
    private String description;
    private List<String> requiredSkills;
    private Double minCgpa;
    private String domain;
    private String location;
    private Integer stipend;
    private Integer durationMonths;
}
