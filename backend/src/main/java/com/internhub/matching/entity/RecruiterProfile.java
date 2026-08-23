package com.internhub.matching.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Stores recruiter-specific professional data.
 * One-to-one with User (RECRUITER role).
 * Maps to the recruiter_profiles table.
 */
@Entity
@Table(name = "recruiter_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "employee_role", nullable = false, length = 100)
    private String employeeRole;  // e.g. HR Manager, Tech Lead, Founder
}
