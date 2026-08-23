package com.internhub.matching.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @Builder.Default
    @Column(name = "applied_at")
    private LocalDateTime appliedAt = LocalDateTime.now();

    // Match score cached at application time
    private Double matchScore;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    public enum ApplicationStatus {
        APPLIED, REVIEWED, SHORTLISTED, REJECTED
    }
}
