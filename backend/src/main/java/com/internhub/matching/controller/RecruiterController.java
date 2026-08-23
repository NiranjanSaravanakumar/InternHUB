package com.internhub.matching.controller;

import com.internhub.matching.dto.ApplicantDTO;
import com.internhub.matching.dto.InternshipRequest;
import com.internhub.matching.entity.Internship;
import com.internhub.matching.entity.User;
import com.internhub.matching.service.RecruiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterService recruiterService;

    /** POST /api/recruiter/internships */
    @PostMapping("/internships")
    public ResponseEntity<Internship> postInternship(
            @AuthenticationPrincipal User user,
            @RequestBody InternshipRequest req) {
        return ResponseEntity.ok(recruiterService.postInternship(user, req));
    }

    /** GET /api/recruiter/internships */
    @GetMapping("/internships")
    public ResponseEntity<List<Internship>> getMyInternships(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(recruiterService.getMyInternships(user));
    }

    /** DELETE /api/recruiter/internships/{id} */
    @DeleteMapping("/internships/{id}")
    public ResponseEntity<Map<String, String>> deleteInternship(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        recruiterService.deleteInternship(user, id);
        return ResponseEntity.ok(Map.of("message", "Internship deleted successfully"));
    }

    /** GET /api/recruiter/internships/{id}/applicants */
    @GetMapping("/internships/{id}/applicants")
    public ResponseEntity<List<ApplicantDTO>> getApplicants(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(recruiterService.getApplicants(user, id));
    }
}
