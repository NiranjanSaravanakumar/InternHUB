package com.internhub.matching.service;

import com.internhub.matching.dto.*;
import com.internhub.matching.entity.*;
import com.internhub.matching.exception.AppException;
import com.internhub.matching.repository.*;
import com.internhub.matching.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ── Student Registration ─────────────────────────────────────────────

    @Transactional
    public AuthResponse registerStudent(StudentRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException("Email is already registered", HttpStatus.CONFLICT);
        }

        // 1. Create User row
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phoneNumber(req.getPhoneNumber())
                .address(req.getAddress())
                .role(User.Role.STUDENT)
                .build();
        user = userRepository.save(user);

        // 2. Create a minimal StudentProfile row (matching fields filled later via /profile)
        LocalDate dob = (req.getDateOfBirth() != null && !req.getDateOfBirth().isBlank())
                ? LocalDate.parse(req.getDateOfBirth())
                : null;
        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .dob(dob)
                .collegeName(req.getCollegeName() != null ? req.getCollegeName() : "")
                .degree(req.getDegree() != null ? req.getDegree() : "")
                .department(req.getDepartment() != null ? req.getDepartment() : "")
                .passoutYear(req.getPassoutYear())
                // matching fields — empty until student completes profile
                .cgpa(0.0)
                .skills("")
                .preferredDomain("")
                .preferredLocation("")
                .experienceMonths(0)
                .build();
        studentProfileRepository.save(profile);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(token, user, false);
    }

    // ── Recruiter Registration ───────────────────────────────────────────

    @Transactional
    public AuthResponse registerRecruiter(RecruiterRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException("Email is already registered", HttpStatus.CONFLICT);
        }

        // 1. Create User row
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phoneNumber(req.getPhoneNumber())
                .address(req.getAddress())
                .role(User.Role.RECRUITER)
                .build();
        user = userRepository.save(user);

        // 2. Create RecruiterProfile row
        RecruiterProfile rp = RecruiterProfile.builder()
                .user(user)
                .companyName(req.getCompanyName())
                .employeeRole(req.getEmployeeRole())
                .build();
        recruiterProfileRepository.save(rp);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(token, user, true);
    }

    // ── Login (both roles) ───────────────────────────────────────────────

    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        boolean profileComplete = false;
        if (user.getRole() == User.Role.STUDENT) {
            profileComplete = studentProfileRepository.findByUser(user)
                    .map(p -> p.getCgpa() != null && p.getCgpa() > 0
                              && p.getSkills() != null && !p.getSkills().isBlank()
                              && p.getPreferredDomain() != null && !p.getPreferredDomain().isBlank())
                    .orElse(false);
        } else {
            profileComplete = true;
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(token, user, profileComplete);
    }

    // ── Helper ───────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(String token, User user, boolean profileComplete) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .profileComplete(profileComplete)
                .build();
    }
}
