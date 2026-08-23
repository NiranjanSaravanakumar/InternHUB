package com.internhub.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

/**
 * Returned by GET /api/student/matches
 * Contains the internship details + computed match breakdown.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResultDTO {

    // ── Internship Info ──────────────────────────────────────────────────
    private Long internshipId;
    private String companyName;
    private String role;           // Job title
    private String domain;
    private String location;
    private BigDecimal stipend;
    private BigDecimal minimumCgpa;
    private List<String> requiredSkills;

    // ── Match Breakdown ──────────────────────────────────────────────────
    private double matchScore;         // 0–100 aggregate
    private double skillScore;         // 0–50
    private double domainScore;        // 0–20
    private double cgpaScore;          // 0–15
    private double locationScore;      // 0–15

    private List<String> matchedSkills;
    private List<String> missingSkills;

    // ── Application State ────────────────────────────────────────────────
    private boolean alreadyApplied;
}
