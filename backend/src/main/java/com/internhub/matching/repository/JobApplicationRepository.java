package com.internhub.matching.repository;

import com.internhub.matching.entity.JobApplication;
import com.internhub.matching.entity.Internship;
import com.internhub.matching.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByStudent(User student);
    List<JobApplication> findByInternship(Internship internship);
    Optional<JobApplication> findByStudentAndInternship(User student, Internship internship);
    boolean existsByStudentAndInternship(User student, Internship internship);
}
