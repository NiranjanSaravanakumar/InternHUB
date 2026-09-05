package com.internhub.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Returned by GET /api/recruiter/internships/{id}/applicants
 * One entry per Application, enriched with Student and StudentProfile data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantDTO {

    // ── Application Info ─────────────────────────────────────────────────
    private Long applicationId;
    private BigDecimal matchPercentage;   // was matchScore
    private String status;                // APPLIED / REVIEWED / SHORTLISTED / REJECTED
    private LocalDateTime appliedAt;

    // ── Student (User) Info ──────────────────────────────────────────────
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String phoneNumber;

    // ── StudentProfile Info ──────────────────────────────────────────────
    private Double cgpa;
    private List<String> skills;
    private String preferredDomain;
    private String preferredLocation;
    private String collegeName;
    private String degree;
    private String department;
    private Integer passoutYear;
    private String resumeUrl;             // was resumeFilePath
    private Integer assessmentScore;      // AI skill quiz score (0–15), null if not taken
}
