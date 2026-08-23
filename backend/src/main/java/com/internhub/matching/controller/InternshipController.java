package com.internhub.matching.controller;

import com.internhub.matching.entity.Internship;
import com.internhub.matching.repository.InternshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
public class InternshipController {

    private final InternshipRepository internshipRepository;

    /**
     * Public endpoint — returns all active internships.
     * Supports optional query filters: domain, location, minStipend
     */
    @GetMapping
    public ResponseEntity<List<Internship>> getAllInternships(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minStipend) {

        List<Internship> internships = internshipRepository.findByActiveTrue();

        if (domain != null && !domain.isEmpty()) {
            internships = internships.stream()
                    .filter(i -> i.getDomain() != null && i.getDomain().equalsIgnoreCase(domain))
                    .collect(Collectors.toList());
        }
        if (location != null && !location.isEmpty()) {
            internships = internships.stream()
                    .filter(i -> i.getLocation() != null && i.getLocation().equalsIgnoreCase(location))
                    .collect(Collectors.toList());
        }
        if (minStipend != null) {
            internships = internships.stream()
                    .filter(i -> i.getStipend() != null && i.getStipend() >= minStipend)
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Internship> getInternship(@PathVariable Long id) {
        return internshipRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
