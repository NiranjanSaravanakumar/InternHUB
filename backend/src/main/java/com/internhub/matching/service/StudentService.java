package com.internhub.matching.service;

import com.internhub.matching.dto.*;
import com.internhub.matching.entity.*;
import com.internhub.matching.exception.AppException;
import com.internhub.matching.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final InternshipRepository internshipRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final MatchingService matchingService;

    public StudentProfile getOrCreateProfile(String email) {
        User user = getUserByEmail(email);
        return studentProfileRepository.findByUser(user)
                .orElse(StudentProfile.builder().user(user).build());
    }

    public StudentProfile updateProfile(String email, StudentProfileRequest req) {
        User user = getUserByEmail(email);
        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElse(StudentProfile.builder().user(user).build());
        profile.setCgpa(req.getCgpa());
        profile.setSkills(req.getSkills());
        profile.setPreferredDomain(req.getPreferredDomain());
        profile.setExperienceMonths(req.getExperienceMonths());
        profile.setPreferredLocation(req.getPreferredLocation());
        return studentProfileRepository.save(profile);
    }

    public String uploadResume(String email, MultipartFile file) {
        User user = getUserByEmail(email);
        try {
            Path uploadDir = Paths.get("uploads/resumes");
            Files.createDirectories(uploadDir);
            String filename = "resume_" + user.getId() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            user.setResumeFilePath(filePath.toString());
            userRepository.save(user);
            return filePath.toString();
        } catch (IOException e) {
            throw new AppException("Failed to upload resume: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public List<MatchResultDTO> getMatchedInternships(String email) {
        User user = getUserByEmail(email);
        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException("Please complete your profile first", HttpStatus.BAD_REQUEST));

        List<Internship> internships = internshipRepository.findByActiveTrue();
        return internships.stream()
                .map(internship -> {
                    boolean applied = jobApplicationRepository.existsByStudentAndInternship(user, internship);
                    return matchingService.calculate(profile, internship, applied);
                })
                .sorted(Comparator.comparingDouble(MatchResultDTO::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    public void applyForInternship(String email, Long internshipId) {
        User user = getUserByEmail(email);
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));
        if (jobApplicationRepository.existsByStudentAndInternship(user, internship)) {
            throw new AppException("You have already applied for this internship", HttpStatus.CONFLICT);
        }
        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException("Please complete your profile first", HttpStatus.BAD_REQUEST));

        MatchResultDTO match = matchingService.calculate(profile, internship, false);
        JobApplication application = JobApplication.builder()
                .student(user)
                .internship(internship)
                .matchScore(match.getMatchScore())
                .build();
        jobApplicationRepository.save(application);
    }

    public List<JobApplication> getMyApplications(String email) {
        User user = getUserByEmail(email);
        return jobApplicationRepository.findByStudent(user);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }
}
