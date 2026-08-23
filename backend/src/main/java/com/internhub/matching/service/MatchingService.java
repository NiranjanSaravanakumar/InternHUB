package com.internhub.matching.service;

import com.internhub.matching.dto.MatchResultDTO;
import com.internhub.matching.entity.Internship;
import com.internhub.matching.entity.StudentProfile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Core algorithm — 4 weighted parameters.
 *
 * Skill Match    → 50%
 * Domain Match   → 20%
 * CGPA Match     → 15%
 * Location Match → 15%
 *
 * Skills are comma-separated TEXTs in both StudentProfile and Internship.
 * The helper getSkillList() is used to parse them into Lists.
 */
@Service
public class MatchingService {

    public MatchResultDTO computeMatch(StudentProfile student, Internship internship) {

        List<String> studentSkills  = normalise(student.getSkillList());
        List<String> requiredSkills = normalise(internship.getSkillList());

        // ── 1. Skill Score (50%) ────────────────────────────────────────
        List<String> matched = new ArrayList<>(studentSkills);
        matched.retainAll(requiredSkills);

        List<String> missing = new ArrayList<>(requiredSkills);
        missing.removeAll(studentSkills);

        double skillScore = requiredSkills.isEmpty() ? 50.0
                : ((double) matched.size() / requiredSkills.size()) * 50.0;

        // ── 2. Domain Score (20%) ───────────────────────────────────────
        double domainScore = 0;
        if (student.getPreferredDomain() != null && internship.getDomain() != null &&
                student.getPreferredDomain().equalsIgnoreCase(internship.getDomain())) {
            domainScore = 20.0;
        }

        // ── 3. CGPA Score (15%) ─────────────────────────────────────────
        double cgpaScore = 0;
        double minimumCgpa = internship.getMinimumCgpa() != null
                ? internship.getMinimumCgpa().doubleValue() : 0;
        if (student.getCgpa() != null && student.getCgpa() >= minimumCgpa) {
            cgpaScore = 15.0;
        }

        // ── 4. Location Score (15%) ─────────────────────────────────────
        double locationScore = 0;
        String studentLoc   = student.getPreferredLocation();
        String internshipLoc = internship.getLocation();
        if (studentLoc != null && internshipLoc != null) {
            if (studentLoc.equalsIgnoreCase("Any")
                    || studentLoc.equalsIgnoreCase(internshipLoc)
                    || internshipLoc.equalsIgnoreCase("Remote")) {
                locationScore = 15.0;
            }
        }

        double totalScore = skillScore + domainScore + cgpaScore + locationScore;

        return MatchResultDTO.builder()
                .internshipId(internship.getId())
                .companyName(internship.getCompanyName())
                .role(internship.getRole())
                .domain(internship.getDomain())
                .location(internship.getLocation())
                .stipend(internship.getStipend())
                .minimumCgpa(internship.getMinimumCgpa())
                .requiredSkills(internship.getSkillList())
                .matchScore(Math.round(totalScore * 100.0) / 100.0)
                .skillScore(Math.round(skillScore * 100.0) / 100.0)
                .domainScore(domainScore)
                .cgpaScore(cgpaScore)
                .locationScore(locationScore)
                .matchedSkills(matched)
                .missingSkills(missing)
                .alreadyApplied(false)
                .build();
    }

    /** Lowercases and trims each skill for case-insensitive comparison. */
    private List<String> normalise(List<String> skills) {
        List<String> result = new ArrayList<>();
        for (String s : skills) {
            result.add(s.toLowerCase().trim());
        }
        return result;
    }
}
