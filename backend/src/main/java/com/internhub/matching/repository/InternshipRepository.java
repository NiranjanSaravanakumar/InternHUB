package com.internhub.matching.repository;

import com.internhub.matching.entity.Internship;
import com.internhub.matching.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByActiveTrue();
    List<Internship> findByRecruiterAndActiveTrue(User recruiter);
    List<Internship> findByRecruiter(User recruiter);
}
