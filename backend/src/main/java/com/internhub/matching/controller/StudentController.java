package com.internhub.matching.controller;

import com.internhub.matching.dto.AssessmentSubmitRequest;
import com.internhub.matching.dto.MatchResultDTO;
import com.internhub.matching.dto.StudentProfileRequest;
import com.internhub.matching.entity.Application;
import com.internhub.matching.entity.StudentProfile;
import com.internhub.matching.entity.User;
import com.internhub.matching.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    /** GET /api/student/profile */
    @GetMapping("/profile")
    public ResponseEntity<StudentProfile> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getProfile(user));
    }

    /** PUT /api/student/profile */
    @PutMapping("/profile")
    public ResponseEntity<StudentProfile> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody StudentProfileRequest req) {
        return ResponseEntity.ok(studentService.updateProfile(user, req));
    }

    /** POST /api/student/profile/resume (multipart) */
    @PostMapping("/profile/resume")
    public ResponseEntity<Map<String, String>> uploadResume(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        studentService.uploadResume(user, file);
        return ResponseEntity.ok(Map.of("message", "Resume uploaded successfully"));
    }

    /** GET /api/student/matches */
    @GetMapping("/matches")
    public ResponseEntity<List<MatchResultDTO>> getMatches(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getMatches(user));
    }

    /** POST /api/student/apply/{internshipId} */
    @PostMapping("/apply/{internshipId}")
    public ResponseEntity<Map<String, String>> apply(
            @AuthenticationPrincipal User user,
            @PathVariable Long internshipId,
            @RequestBody(required = false) AssessmentSubmitRequest req) {
        Integer score = req != null ? req.getAssessmentScore() : null;
        studentService.apply(user, internshipId, score);
        return ResponseEntity.ok(Map.of("message", "Application submitted successfully"));
    }

    /** GET /api/student/applications */
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentService.getMyApplications(user));
    }
}
