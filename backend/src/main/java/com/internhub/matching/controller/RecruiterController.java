package com.internhub.matching.controller;

import com.internhub.matching.dto.ApplicantDTO;
import com.internhub.matching.dto.InternshipRequest;
import com.internhub.matching.entity.Internship;
import com.internhub.matching.service.RecruiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterService recruiterService;

    @PostMapping("/internships")
    public ResponseEntity<Internship> postInternship(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody InternshipRequest req) {
        return ResponseEntity.ok(recruiterService.postInternship(userDetails.getUsername(), req));
    }

    @GetMapping("/internships")
    public ResponseEntity<List<Internship>> getMyInternships(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recruiterService.getMyInternships(userDetails.getUsername()));
    }

    @DeleteMapping("/internships/{id}")
    public ResponseEntity<Map<String, String>> deleteInternship(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        recruiterService.deleteInternship(userDetails.getUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Internship deleted successfully"));
    }

    @GetMapping("/internships/{id}/applicants")
    public ResponseEntity<List<ApplicantDTO>> getApplicants(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(recruiterService.getApplicants(userDetails.getUsername(), id));
    }
}
