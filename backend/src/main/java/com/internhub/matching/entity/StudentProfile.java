package com.internhub.matching.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

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

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Double cgpa;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill")
    private List<String> skills;

    private String preferredDomain;    // e.g., Full-Stack, Machine Learning, Data Science
    private Integer experienceMonths;  // prior experience in months
    private String preferredLocation;  // e.g., Bengaluru, Remote
}
