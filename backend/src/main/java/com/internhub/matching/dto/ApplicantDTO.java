package com.internhub.matching.dto;

import com.internhub.matching.entity.JobApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantDTO {
    private Long applicationId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String collegeName;
    private String degree;
    private String department;
    private Integer passoutYear;
    private Double cgpa;
    private Double matchScore;
    private String preferredDomain;
    private String preferredLocation;
    private java.util.List<String> skills;
    private String resumeFilePath;
    private LocalDateTime appliedAt;
    private JobApplication.ApplicationStatus status;
}
