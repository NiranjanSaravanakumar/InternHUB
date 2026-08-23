package com.internhub.matching.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // ── Student-only fields ──────────────────────────────
    private String collegeName;

    private String degree;        // e.g., B.Tech, M.Tech, BCA
    private String department;    // e.g., CSE, IT, ECE
    private Integer passoutYear;  // 2015–2030
    private LocalDate dateOfBirth;
    private String resumeFilePath;

    // ── Recruiter-only fields ────────────────────────────
    private String companyName;
    private String employeeRole;  // e.g., HR Manager, Tech Lead

    public enum Role {
        CANDIDATE, RECRUITER
    }
}
