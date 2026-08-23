package com.internhub.matching.service;

import com.internhub.matching.config.JwtUtil;
import com.internhub.matching.dto.*;
import com.internhub.matching.entity.User;
import com.internhub.matching.exception.AppException;
import com.internhub.matching.repository.StudentProfileRepository;
import com.internhub.matching.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse registerStudent(StudentRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException("Email already registered", HttpStatus.CONFLICT);
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .address(req.getAddress())
                .dateOfBirth(req.getDateOfBirth())
                .collegeName(req.getCollegeName())
                .degree(req.getDegree())
                .department(req.getDepartment())
                .passoutYear(req.getPassoutYear())
                .role(User.Role.CANDIDATE)
                .build();
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .userId(user.getId())
                .profileComplete(false)
                .build();
    }

    public AuthResponse registerRecruiter(RecruiterRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException("Email already registered", HttpStatus.CONFLICT);
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .address(req.getAddress())
                .companyName(req.getCompanyName())
                .employeeRole(req.getEmployeeRole())
                .role(User.Role.RECRUITER)
                .build();
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .userId(user.getId())
                .profileComplete(true)
                .build();
    }

    public AuthResponse login(AuthRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        boolean profileComplete = user.getRole() == User.Role.RECRUITER ||
                studentProfileRepository.findByUser(user).isPresent();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .userId(user.getId())
                .profileComplete(profileComplete)
                .build();
    }
}
