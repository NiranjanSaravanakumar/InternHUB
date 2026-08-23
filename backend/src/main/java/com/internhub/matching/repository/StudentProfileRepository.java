package com.internhub.matching.repository;

import com.internhub.matching.entity.StudentProfile;
import com.internhub.matching.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByUserId(Long userId);
}
