package com.internhub.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResultDTO {
    // Internship details
    private Long internshipId;
    private String title;
    private String company;
    private String domain;
    private String location;
    private Integer stipend;
    private Integer durationMonths;
    private String description;
    private List<String> requiredSkills;
    private Double minCgpa;

    // Matching breakdown
    private Double matchScore;         // 0-100 aggregate
    private Double skillScore;         // 0-50 contribution
    private Double domainScore;        // 0-20 contribution
    private Double cgpaScore;          // 0-15 contribution
    private Double locationScore;      // 0-15 contribution
    private List<String> matchedSkills;
    private List<String> missingSkills;

    // Application status
    private Boolean alreadyApplied;
    private Long recruiterUserId;
}
