package com.internhub.matching.service;

import com.internhub.matching.dto.ApplicantDTO;
import com.internhub.matching.dto.InternshipRequest;
import com.internhub.matching.entity.Internship;
import com.internhub.matching.entity.JobApplication;
import com.internhub.matching.entity.StudentProfile;
import com.internhub.matching.entity.User;
import com.internhub.matching.exception.AppException;
import com.internhub.matching.repository.InternshipRepository;
import com.internhub.matching.repository.JobApplicationRepository;
import com.internhub.matching.repository.StudentProfileRepository;
import com.internhub.matching.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecruiterService {

    private final UserRepository userRepository;
    private final InternshipRepository internshipRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final StudentProfileRepository studentProfileRepository;

    public Internship postInternship(String email, InternshipRequest req) {
        User recruiter = getUserByEmail(email);
        Internship internship = Internship.builder()
                .title(req.getTitle())
                .company(req.getCompany() != null ? req.getCompany() : recruiter.getCompanyName())
                .description(req.getDescription())
                .requiredSkills(req.getRequiredSkills())
                .minCgpa(req.getMinCgpa())
                .domain(req.getDomain())
                .location(req.getLocation())
                .stipend(req.getStipend())
                .durationMonths(req.getDurationMonths())
                .recruiter(recruiter)
                .active(true)
                .build();
        return internshipRepository.save(internship);
    }

    public List<Internship> getMyInternships(String email) {
        User recruiter = getUserByEmail(email);
        return internshipRepository.findByRecruiter(recruiter);
    }

    public void deleteInternship(String email, Long internshipId) {
        User recruiter = getUserByEmail(email);
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));
        if (!internship.getRecruiter().getId().equals(recruiter.getId())) {
            throw new AppException("Not authorized to delete this internship", HttpStatus.FORBIDDEN);
        }
        internshipRepository.delete(internship);
    }

    public List<ApplicantDTO> getApplicants(String email, Long internshipId) {
        User recruiter = getUserByEmail(email);
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));
        if (!internship.getRecruiter().getId().equals(recruiter.getId())) {
            throw new AppException("Not authorized to view applicants for this posting", HttpStatus.FORBIDDEN);
        }
        return jobApplicationRepository.findByInternship(internship).stream()
                .map(app -> mapToApplicantDTO(app))
                .collect(Collectors.toList());
    }

    private ApplicantDTO mapToApplicantDTO(JobApplication app) {
        User student = app.getStudent();
        StudentProfile profile = studentProfileRepository.findByUser(student).orElse(null);
        return ApplicantDTO.builder()
                .applicationId(app.getId())
                .studentId(student.getId())
                .studentName(student.getName())
                .studentEmail(student.getEmail())
                .studentPhone(student.getPhone())
                .collegeName(student.getCollegeName())
                .degree(student.getDegree())
                .department(student.getDepartment())
                .passoutYear(student.getPassoutYear())
                .cgpa(profile != null ? profile.getCgpa() : null)
                .matchScore(app.getMatchScore())
                .preferredDomain(profile != null ? profile.getPreferredDomain() : null)
                .preferredLocation(profile != null ? profile.getPreferredLocation() : null)
                .skills(profile != null ? profile.getSkills() : null)
                .resumeFilePath(student.getResumeFilePath())
                .appliedAt(app.getAppliedAt())
                .status(app.getStatus())
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }
}
