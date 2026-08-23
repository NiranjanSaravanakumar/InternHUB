package com.internhub.matching.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Maps to the internships table.
 * required_skills stored as comma-separated TEXT (e.g. "Java,React,Spring Boot").
 * Use getSkillList() / setSkillList() for List<String> convenience.
 */
@Entity
@Table(name = "internships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    /** Job title / role name (e.g. "React / Java Developer") */
    @Column(nullable = false, length = 150)
    private String role;

    /**
     * Comma-separated required skills stored as TEXT.
     * e.g. "Java,Spring Boot,MySQL,React"
     */
    @Column(name = "required_skills", nullable = false, columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(name = "minimum_cgpa", nullable = false, precision = 3, scale = 2)
    private BigDecimal minimumCgpa;

    @Column(nullable = false, length = 100)
    private String domain;

    /** City name or "Remote" */
    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal stipend;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ── Convenience helpers ──────────────────────────────────────────────

    @Transient
    public java.util.List<String> getSkillList() {
        if (requiredSkills == null || requiredSkills.isBlank()) return new java.util.ArrayList<>();
        return java.util.Arrays.stream(requiredSkills.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(java.util.stream.Collectors.toList());
    }

    @Transient
    public void setSkillList(java.util.List<String> skillList) {
        this.requiredSkills = skillList == null ? "" : String.join(",", skillList);
    }
}
