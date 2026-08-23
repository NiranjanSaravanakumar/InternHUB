package com.internhub.matching.repository;

import com.internhub.matching.entity.Application;
import com.internhub.matching.entity.Internship;
import com.internhub.matching.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudent(User student);

    List<Application> findByInternship(Internship internship);

    List<Application> findByInternshipOrderByMatchPercentageDesc(Internship internship);

    Optional<Application> findByInternshipAndStudent(Internship internship, User student);

    boolean existsByInternshipAndStudent(Internship internship, User student);
}
