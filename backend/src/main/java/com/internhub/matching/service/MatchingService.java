package com.internhub.matching.service;

import com.internhub.matching.dto.MatchResultDTO;
import com.internhub.matching.entity.Internship;
import com.internhub.matching.entity.StudentProfile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Core recommendation engine.
 *
 * Weights:
 *   Skill Match    → 50%
 *   Domain Match   → 20%
 *   CGPA Match     → 15%
 *   Location Match → 15%
 */
@Service
public class MatchingService {

    public MatchResultDTO calculate(StudentProfile student, Internship internship, boolean alreadyApplied) {
        double skillScore    = calculateSkillScore(student, internship);
        double domainScore   = calculateDomainScore(student, internship);
        double cgpaScore     = calculateCgpaScore(student, internship);
        double locationScore = calculateLocationScore(student, internship);

        double totalScore = skillScore + domainScore + cgpaScore + locationScore;

        List<String> matchedSkills = getMatchedSkills(student, internship);
        List<String> missingSkills = getMissingSkills(student, internship);

        return MatchResultDTO.builder()
                .internshipId(internship.getId())
                .title(internship.getTitle())
                .company(internship.getCompany())
                .domain(internship.getDomain())
                .location(internship.getLocation())
                .stipend(internship.getStipend())
                .durationMonths(internship.getDurationMonths())
                .description(internship.getDescription())
                .requiredSkills(internship.getRequiredSkills())
                .minCgpa(internship.getMinCgpa())
                .matchScore(Math.round(totalScore * 10.0) / 10.0)
                .skillScore(skillScore)
                .domainScore(domainScore)
                .cgpaScore(cgpaScore)
                .locationScore(locationScore)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .alreadyApplied(alreadyApplied)
                .recruiterUserId(internship.getRecruiter() != null ? internship.getRecruiter().getId() : null)
                .build();
    }

    /**
     * Skill Match → weight 50%
     * Score = (number of student skills that match required skills / total required skills) × 50
     */
    private double calculateSkillScore(StudentProfile student, Internship internship) {
        if (internship.getRequiredSkills() == null || internship.getRequiredSkills().isEmpty()) {
            return 50.0; // no requirements = full skill score
        }
        if (student.getSkills() == null || student.getSkills().isEmpty()) {
            return 0.0;
        }
        long matchCount = internship.getRequiredSkills().stream()
                .filter(required -> student.getSkills().stream()
                        .anyMatch(skill -> skill.trim().equalsIgnoreCase(required.trim())))
                .count();
        return ((double) matchCount / internship.getRequiredSkills().size()) * 50.0;
    }

    /**
     * Domain Match → weight 20%
     * Exact string match (case-insensitive) = 20, else 0
     */
    private double calculateDomainScore(StudentProfile student, Internship internship) {
        if (student.getPreferredDomain() == null || internship.getDomain() == null) return 0.0;
        return student.getPreferredDomain().trim().equalsIgnoreCase(internship.getDomain().trim()) ? 20.0 : 0.0;
    }

    /**
     * CGPA Match → weight 15%
     * Student CGPA >= Min CGPA → 15, else 0 (hard cutoff)
     */
    private double calculateCgpaScore(StudentProfile student, Internship internship) {
        if (internship.getMinCgpa() == null || internship.getMinCgpa() == 0) return 15.0;
        if (student.getCgpa() == null) return 0.0;
        return student.getCgpa() >= internship.getMinCgpa() ? 15.0 : 0.0;
    }

    /**
     * Location Match → weight 15%
     * Exact city match (case-insensitive) OR either side is "Remote" → 15, else 0
     */
    private double calculateLocationScore(StudentProfile student, Internship internship) {
        if (student.getPreferredLocation() == null || internship.getLocation() == null) return 0.0;
        String studentLoc = student.getPreferredLocation().trim().toLowerCase();
        String internLoc  = internship.getLocation().trim().toLowerCase();
        if (studentLoc.equals(internLoc)) return 15.0;
        if (studentLoc.equals("remote") || internLoc.equals("remote")) return 15.0;
        return 0.0;
    }

    private List<String> getMatchedSkills(StudentProfile student, Internship internship) {
        List<String> matched = new ArrayList<>();
        if (student.getSkills() == null || internship.getRequiredSkills() == null) return matched;
        for (String required : internship.getRequiredSkills()) {
            student.getSkills().stream()
                    .filter(s -> s.trim().equalsIgnoreCase(required.trim()))
                    .findFirst()
                    .ifPresent(s -> matched.add(required));
        }
        return matched;
    }

    private List<String> getMissingSkills(StudentProfile student, Internship internship) {
        List<String> missing = new ArrayList<>();
        if (internship.getRequiredSkills() == null) return missing;
        if (student.getSkills() == null) return new ArrayList<>(internship.getRequiredSkills());
        for (String required : internship.getRequiredSkills()) {
            boolean found = student.getSkills().stream()
                    .anyMatch(s -> s.trim().equalsIgnoreCase(required.trim()));
            if (!found) missing.add(required);
        }
        return missing;
    }
}
