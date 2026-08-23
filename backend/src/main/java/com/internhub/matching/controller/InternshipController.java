package com.internhub.matching.controller;

import com.internhub.matching.entity.Internship;
import com.internhub.matching.repository.InternshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
public class InternshipController {

    private final InternshipRepository internshipRepository;

    /** GET /api/internships — public listing */
    @GetMapping
    public ResponseEntity<List<Internship>> listAll(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String location) {

        if (domain != null || location != null) {
            String d = domain != null ? domain : "";
            String l = location != null ? location : "";
            return ResponseEntity.ok(
                internshipRepository
                    .findByDomainContainingIgnoreCaseOrLocationContainingIgnoreCase(d, l)
            );
        }

        return ResponseEntity.ok(internshipRepository.findAll());
    }

    /** GET /api/internships/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Internship> getById(@PathVariable Long id) {
        return internshipRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
