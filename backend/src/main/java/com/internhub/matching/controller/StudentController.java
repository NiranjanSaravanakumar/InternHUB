package com.internhub.matching.controller;

import com.internhub.matching.dto.MatchResultDTO;
import com.internhub.matching.dto.StudentProfileRequest;
import com.internhub.matching.entity.JobApplication;
import com.internhub.matching.entity.StudentProfile;
import com.internhub.matching.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<StudentProfile> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(studentService.getOrCreateProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentProfile> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody StudentProfileRequest req) {
        return ResponseEntity.ok(studentService.updateProfile(userDetails.getUsername(), req));
    }

    @PostMapping("/profile/resume")
    public ResponseEntity<Map<String, String>> uploadResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        String path = studentService.uploadResume(userDetails.getUsername(), file);
        return ResponseEntity.ok(Map.of("message", "Resume uploaded successfully", "path", path));
    }

    @GetMapping("/matches")
    public ResponseEntity<List<MatchResultDTO>> getMatches(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(studentService.getMatchedInternships(userDetails.getUsername()));
    }

    @PostMapping("/apply/{internshipId}")
    public ResponseEntity<Map<String, String>> applyForInternship(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long internshipId) {
        studentService.applyForInternship(userDetails.getUsername(), internshipId);
        return ResponseEntity.ok(Map.of("message", "Application submitted successfully!"));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplication>> getMyApplications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(studentService.getMyApplications(userDetails.getUsername()));
    }
}
