package com.internhub.matching.controller;

import com.internhub.matching.dto.*;
import com.internhub.matching.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<AuthResponse> registerStudent(@RequestBody StudentRegisterRequest req) {
        return ResponseEntity.ok(authService.registerStudent(req));
    }

    @PostMapping("/register/recruiter")
    public ResponseEntity<AuthResponse> registerRecruiter(@RequestBody RecruiterRegisterRequest req) {
        return ResponseEntity.ok(authService.registerRecruiter(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
