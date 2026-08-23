package com.internhub.matching.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Maps to the applications table.
 * Tracks which student applied to which internship.
 * UNIQUE constraint on (internship_id, student_id) prevents double-apply.
 */
@Entity
@Table(
    name = "applications",
    uniqueConstraints = {
        @UniqueConstraint(name = "unique_application", columnNames = {"internship_id", "student_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    /** Flat fields exposed in JSON instead of full nested objects */
    @JsonProperty("internshipId")
    public Long getInternshipId() { return internship != null ? internship.getId() : null; }

    @JsonProperty("internshipRole")
    public String getInternshipRole() { return internship != null ? internship.getRole() : null; }

    @JsonProperty("companyName")
    public String getCompanyName() { return internship != null ? internship.getCompanyName() : null; }

    @JsonProperty("studentId")
    public Long getStudentId() { return student != null ? student.getId() : null; }

    @JsonProperty("studentName")
    public String getStudentName() { return student != null ? student.getName() : null; }

    /** Cached match score at time of application (0.00 – 100.00) */
    @Column(name = "match_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal matchPercentage;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.APPLIED;

    @Builder.Default
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt = LocalDateTime.now();

    public enum Status {
        APPLIED, REVIEWED, SHORTLISTED, REJECTED
    }
}
