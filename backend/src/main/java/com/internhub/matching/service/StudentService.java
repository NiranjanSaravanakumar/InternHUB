package com.internhub.matching.service;

import com.internhub.matching.dto.MatchResultDTO;
import com.internhub.matching.dto.StudentProfileRequest;
import com.internhub.matching.entity.*;
import com.internhub.matching.exception.AppException;
import com.internhub.matching.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final MatchingService matchingService;

    private static final String UPLOAD_DIR = "uploads/resumes/";

    // ── Get Profile ──────────────────────────────────────────────────────

    public StudentProfile getProfile(User user) {
        return studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException("Student profile not found", HttpStatus.NOT_FOUND));
    }

    // ── Update Matching Profile ──────────────────────────────────────────

    @Transactional
    public StudentProfile updateProfile(User user, StudentProfileRequest req) {
        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException("Student profile not found", HttpStatus.NOT_FOUND));

        if (req.getCgpa() != null)              profile.setCgpa(req.getCgpa());
        if (req.getPreferredDomain() != null)   profile.setPreferredDomain(req.getPreferredDomain());
        if (req.getPreferredLocation() != null) profile.setPreferredLocation(req.getPreferredLocation());
        if (req.getExperienceMonths() != null)  profile.setExperienceMonths(req.getExperienceMonths());
        if (req.getSkills() != null)            profile.setSkillList(req.getSkills()); // List → CSV TEXT

        return studentProfileRepository.save(profile);
    }

    // ── Resume Upload ────────────────────────────────────────────────────

    @Transactional
    public void uploadResume(User user, MultipartFile file) {
        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException("Student profile not found", HttpStatus.NOT_FOUND));
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            Files.createDirectories(uploadPath);
            String filename = user.getId() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), uploadPath.resolve(filename),
                    StandardCopyOption.REPLACE_EXISTING);
            profile.setResumeUrl(UPLOAD_DIR + filename);
            studentProfileRepository.save(profile);
        } catch (IOException e) {
            throw new AppException("Failed to upload resume: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ── Get Matches ──────────────────────────────────────────────────────

    public List<MatchResultDTO> getMatches(User user) {
        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException("Please complete your profile first", HttpStatus.BAD_REQUEST));

        // Collect internships the student has already applied to
        Set<Long> appliedIds = applicationRepository.findByStudent(user).stream()
                .map(a -> a.getInternship().getId())
                .collect(Collectors.toSet());

        return internshipRepository.findAll().stream()
                .map(internship -> {
                    MatchResultDTO dto = matchingService.computeMatch(profile, internship);
                    dto.setAlreadyApplied(appliedIds.contains(internship.getId()));
                    return dto;
                })
                .sorted(Comparator.comparingDouble(MatchResultDTO::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    // ── Apply ────────────────────────────────────────────────────────────

    @Transactional
    public void apply(User user, Long internshipId, Integer assessmentScore) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));

        if (applicationRepository.existsByInternshipAndStudent(internship, user)) {
            throw new AppException("You have already applied to this internship", HttpStatus.CONFLICT);
        }

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException("Complete your profile before applying", HttpStatus.BAD_REQUEST));

        MatchResultDTO match = matchingService.computeMatch(profile, internship);

        Application application = Application.builder()
                .internship(internship)
                .student(user)
                .matchPercentage(BigDecimal.valueOf(match.getMatchScore()))
                .assessmentScore(assessmentScore)
                .status(Application.Status.APPLIED)
                .build();

        applicationRepository.save(application);
    }

    // ── My Applications ──────────────────────────────────────────────────

    public List<Application> getMyApplications(User user) {
        return applicationRepository.findByStudent(user);
    }
}
