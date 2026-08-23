package com.internhub.matching.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

/**
 * Stores student-specific matching data.
 * skills is stored as a comma-separated TEXT field (e.g. "Java,React,MySQL").
 * Use StudentProfile.getSkillList() / setSkillList() for List<String> convenience.
 */
@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(name = "college_name", nullable = false, length = 200)
    private String collegeName;

    @Column(nullable = false, length = 100)
    private String degree;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(name = "passout_year", nullable = false)
    private Integer passoutYear;

    @Column(nullable = false)
    private Double cgpa;

    /**
     * Comma-separated skill list stored as TEXT.
     * e.g. "Java,React,Spring Boot,MySQL"
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String skills;

    @Column(name = "preferred_domain", nullable = false, length = 100)
    private String preferredDomain;

    @Builder.Default
    @Column(name = "experience_months")
    private Integer experienceMonths = 0;

    @Column(name = "preferred_location", nullable = false, length = 100)
    private String preferredLocation;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    // ── Convenience helpers ──────────────────────────────────────────────

    /** Returns skills as a List<String> parsed from the comma-separated TEXT field. */
    @Transient
    public java.util.List<String> getSkillList() {
        if (skills == null || skills.isBlank()) return new java.util.ArrayList<>();
        return java.util.Arrays.stream(skills.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(java.util.stream.Collectors.toList());
    }

    /** Sets skills from a List<String> into the comma-separated TEXT field. */
    @Transient
    public void setSkillList(java.util.List<String> skillList) {
        this.skills = skillList == null ? "" : String.join(",", skillList);
    }
}
