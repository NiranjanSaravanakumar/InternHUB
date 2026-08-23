package com.internhub.matching.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

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

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "internship_skills", joinColumns = @JoinColumn(name = "internship_id"))
    @Column(name = "skill")
    private List<String> requiredSkills;

    private Double minCgpa;

    private String domain;    // e.g., Full-Stack, Machine Learning, Data Science

    private String location;  // city name or "Remote"

    private Integer stipend;  // monthly in INR

    private Integer durationMonths;

    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private User recruiter;

    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
