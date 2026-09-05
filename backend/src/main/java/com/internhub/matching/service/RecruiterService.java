package com.internhub.matching.service;

import com.internhub.matching.dto.ApplicantDTO;
import com.internhub.matching.dto.InternshipRequest;
import com.internhub.matching.entity.*;
import com.internhub.matching.exception.AppException;
import com.internhub.matching.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecruiterService {

    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;

    // ── Post Internship ──────────────────────────────────────────────────

    @Transactional
    public Internship postInternship(User recruiter, InternshipRequest req) {
        RecruiterProfile profile = recruiterProfileRepository.findByUser(recruiter)
                .orElseThrow(() -> new AppException("Recruiter profile not found", HttpStatus.NOT_FOUND));

        Internship internship = new Internship();
        internship.setRecruiter(recruiter);
        internship.setCompanyName(profile.getCompanyName());
        internship.setRole(req.getRole());
        internship.setSkillList(req.getRequiredSkills());   // List → CSV TEXT
        internship.setMinimumCgpa(req.getMinimumCgpa());
        internship.setDomain(req.getDomain());
        internship.setLocation(req.getLocation());
        internship.setStipend(req.getStipend());
        return internshipRepository.save(internship);
    }

    // ── My Internships ───────────────────────────────────────────────────

    public List<Internship> getMyInternships(User recruiter) {
        return internshipRepository.findByRecruiterOrderByCreatedAtDesc(recruiter);
    }

    // ── Delete Internship ────────────────────────────────────────────────

    @Transactional
    public void deleteInternship(User recruiter, Long internshipId) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));

        if (!internship.getRecruiter().getId().equals(recruiter.getId())) {
            throw new AppException("You are not authorised to delete this internship", HttpStatus.FORBIDDEN);
        }

        internshipRepository.delete(internship);
    }

    // ── View Applicants ──────────────────────────────────────────────────

    public List<ApplicantDTO> getApplicants(User recruiter, Long internshipId) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));

        if (!internship.getRecruiter().getId().equals(recruiter.getId())) {
            throw new AppException("Access denied", HttpStatus.FORBIDDEN);
        }

        return applicationRepository
                .findByInternship(internship)
                .stream()
                .map(app -> {
                    User student = app.getStudent();
                    StudentProfile profile = studentProfileRepository
                            .findByUser(student).orElse(null);

                    return ApplicantDTO.builder()
                            .applicationId(app.getId())
                            .matchPercentage(app.getMatchPercentage())
                            .assessmentScore(app.getAssessmentScore())
                            .status(app.getStatus().name())
                            .appliedAt(app.getAppliedAt())
                            .studentId(student.getId())
                            .studentName(student.getName())
                            .studentEmail(student.getEmail())
                            .phoneNumber(student.getPhoneNumber())
                            .cgpa(profile != null ? profile.getCgpa() : null)
                            .skills(profile != null ? profile.getSkillList() : List.of())
                            .preferredDomain(profile != null ? profile.getPreferredDomain() : null)
                            .preferredLocation(profile != null ? profile.getPreferredLocation() : null)
                            .collegeName(profile != null ? profile.getCollegeName() : null)
                            .degree(profile != null ? profile.getDegree() : null)
                            .department(profile != null ? profile.getDepartment() : null)
                            .passoutYear(profile != null ? profile.getPassoutYear() : null)
                            .resumeUrl(profile != null ? profile.getResumeUrl() : null)
                            .build();
                })
                // Sort: highest assessment score first, then highest match %, nulls last
                .sorted(Comparator
                        .<ApplicantDTO, Integer>comparing(
                                dto -> dto.getAssessmentScore() != null ? dto.getAssessmentScore() : -1,
                                Comparator.reverseOrder())
                        .thenComparing(
                                dto -> dto.getMatchPercentage() != null ? dto.getMatchPercentage().doubleValue() : 0.0,
                                Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }
}
