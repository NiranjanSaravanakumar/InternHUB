package com.internhub.matching;

import com.internhub.matching.entity.*;
import com.internhub.matching.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Automatically seeds the database with realistic test data on first startup.
 * Runs only when the users table is completely empty.
 *
 * Password format: FirstName123!  (BCrypt-hashed before saving)
 *
 * Seeded entities:
 *   5 Student users + StudentProfile entities
 *   5 Recruiter users + RecruiterProfile entities
 *   15 Internship listings (3 per recruiter), skills aligned to students
 *       so the matching algorithm produces high-percentage results
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository             userRepository;
    private final StudentProfileRepository   studentProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final InternshipRepository       internshipRepository;
    private final PasswordEncoder            passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("[DataSeeder] Database already has data - skipping seed.");
            return;
        }

        log.info("[DataSeeder] Empty database detected. Seeding test data...");
        seedStudents();
        seedRecruiters();
        log.info("[DataSeeder] Database seeding complete! 5 students, 5 recruiters, 15 internships ready.");
    }

    // =========================================================================
    // STUDENTS
    // =========================================================================

    private void seedStudents() {
        // Student 1: Niranjan
        User niranjan = createUser("Niranjan", "niranjan@student.com", "Niranjan123!",
                "9876543210", "Bengaluru, Karnataka", User.Role.STUDENT);
        studentProfileRepository.save(StudentProfile.builder()
                .user(niranjan)
                .dob(LocalDate.of(2004, 3, 15))
                .collegeName("RV College of Engineering")
                .degree("B.Tech").department("Information Technology")
                .passoutYear(2026).cgpa(8.5)
                .skills("Java,Spring Boot,React,Data Structures,Algorithms,MySQL,Git,REST APIs,Hibernate")
                .preferredDomain("Full-Stack").experienceMonths(3)
                .preferredLocation("Bengaluru").resumeUrl(null).build());

        // Student 2: Alice
        User alice = createUser("Alice", "alice@student.com", "Alice123!",
                "9123456780", "Chennai, Tamil Nadu", User.Role.STUDENT);
        studentProfileRepository.save(StudentProfile.builder()
                .user(alice)
                .dob(LocalDate.of(2003, 7, 22))
                .collegeName("Anna University")
                .degree("B.E.").department("Computer Science")
                .passoutYear(2025).cgpa(7.8)
                .skills("Python,Machine Learning,SQL,Pandas,NumPy,Scikit-learn,TensorFlow,AI,Statistics")
                .preferredDomain("Data Science").experienceMonths(6)
                .preferredLocation("Chennai").resumeUrl(null).build());

        // Student 3: Bob
        User bob = createUser("Bob", "bob@student.com", "Bob123!",
                "9234567891", "Remote", User.Role.STUDENT);
        studentProfileRepository.save(StudentProfile.builder()
                .user(bob)
                .dob(LocalDate.of(2004, 11, 5))
                .collegeName("NIT Trichy")
                .degree("B.Tech").department("Computer Science")
                .passoutYear(2026).cgpa(9.2)
                .skills("Figma,UI/UX,HTML,CSS,JavaScript,Adobe XD,Prototyping,User Research,Design Systems")
                .preferredDomain("Design").experienceMonths(2)
                .preferredLocation("Remote").resumeUrl(null).build());

        // Student 4: Charlie
        User charlie = createUser("Charlie", "charlie@student.com", "Charlie123!",
                "9345678902", "Hyderabad, Telangana", User.Role.STUDENT);
        studentProfileRepository.save(StudentProfile.builder()
                .user(charlie)
                .dob(LocalDate.of(2003, 1, 30))
                .collegeName("BITS Pilani")
                .degree("B.E.").department("Information Technology")
                .passoutYear(2025).cgpa(8.0)
                .skills("AWS,Docker,Kubernetes,Linux,Terraform,CI/CD,Jenkins,Bash,DevOps,Git")
                .preferredDomain("Cloud").experienceMonths(4)
                .preferredLocation("Hyderabad").resumeUrl(null).build());

        // Student 5: Diana
        User diana = createUser("Diana", "diana@student.com", "Diana123!",
                "9456789013", "Pune, Maharashtra", User.Role.STUDENT);
        studentProfileRepository.save(StudentProfile.builder()
                .user(diana)
                .dob(LocalDate.of(2002, 9, 18))
                .collegeName("Symbiosis Institute of Technology")
                .degree("MCA").department("Computer Applications")
                .passoutYear(2025).cgpa(8.8)
                .skills("Node.js,Express,MongoDB,React,JavaScript,HTML,CSS,REST APIs,Git,MERN Stack")
                .preferredDomain("Web Dev").experienceMonths(8)
                .preferredLocation("Pune").resumeUrl(null).build());

        log.info("[DataSeeder] Created 5 students with profiles.");
    }

    // =========================================================================
    // RECRUITERS + INTERNSHIPS
    // =========================================================================

    private void seedRecruiters() {
        // Recruiter 1: John @ TechNova Solutions
        User john = createUser("John", "john@technova.com", "John123!",
                "8001112223", "Bengaluru, Karnataka", User.Role.RECRUITER);
        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(john).companyName("TechNova Solutions").employeeRole("Tech Lead").build());
        saveInternship(john, "TechNova Solutions", "Java Backend Intern",
                "Java,Spring Boot,MySQL,REST APIs,Hibernate", 7.5, "Backend Development", "Bengaluru", 20000);
        saveInternship(john, "TechNova Solutions", "React Frontend Intern",
                "React,JavaScript,HTML,CSS,Git", 7.0, "Frontend Development", "Bengaluru", 18000);
        saveInternship(john, "TechNova Solutions", "Full Stack Developer Intern",
                "Java,Spring Boot,React,MySQL,Git,REST APIs,Data Structures", 8.0, "Full-Stack", "Bengaluru", 25000);

        // Recruiter 2: Mike @ DataCorp Analytics
        User mike = createUser("Mike", "mike@datacorp.com", "Mike123!",
                "8002223334", "Chennai, Tamil Nadu", User.Role.RECRUITER);
        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(mike).companyName("DataCorp Analytics").employeeRole("Data Science Manager").build());
        saveInternship(mike, "DataCorp Analytics", "Data Science Intern",
                "Python,Machine Learning,Pandas,SQL,Scikit-learn,Statistics,AI", 7.5, "Data Science", "Chennai", 22000);
        saveInternship(mike, "DataCorp Analytics", "Python Developer Intern",
                "Python,SQL,Git,REST APIs", 7.0, "Backend Development", "Chennai", 18000);
        saveInternship(mike, "DataCorp Analytics", "ML Engineer Intern",
                "Python,TensorFlow,AI,Machine Learning,NumPy,Statistics", 7.5, "Data Science", "Chennai", 28000);

        // Recruiter 3: Sarah @ CloudSync Technologies
        User sarah = createUser("Sarah", "sarah@cloudsync.com", "Sarah123!",
                "8003334445", "Hyderabad, Telangana", User.Role.RECRUITER);
        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(sarah).companyName("CloudSync Technologies").employeeRole("HR Manager").build());
        saveInternship(sarah, "CloudSync Technologies", "DevOps Intern",
                "Docker,Kubernetes,Linux,CI/CD,Jenkins,Bash,AWS,Git", 7.0, "DevOps", "Hyderabad", 20000);
        saveInternship(sarah, "CloudSync Technologies", "Cloud Architect Intern",
                "AWS,Terraform,Docker,Kubernetes,Linux,DevOps", 7.5, "Cloud", "Hyderabad", 25000);
        saveInternship(sarah, "CloudSync Technologies", "SRE Intern",
                "Linux,Bash,AWS,Docker,Git,CI/CD", 7.5, "Cloud", "Hyderabad", 22000);

        // Recruiter 4: Emma @ DesignStudio Creative
        User emma = createUser("Emma", "emma@designstudio.com", "Emma123!",
                "8004445556", "Remote", User.Role.RECRUITER);
        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(emma).companyName("DesignStudio Creative").employeeRole("Head of Design").build());
        saveInternship(emma, "DesignStudio Creative", "UI/UX Design Intern",
                "Figma,UI/UX,HTML,CSS,Prototyping,User Research", 6.5, "Design", "Remote", 15000);
        saveInternship(emma, "DesignStudio Creative", "Product Design Intern",
                "Figma,Design Systems,Prototyping,User Research,Adobe XD", 7.0, "Design", "Remote", 16000);
        saveInternship(emma, "DesignStudio Creative", "Graphic Designer Intern",
                "HTML,CSS,JavaScript,Adobe XD,Figma,UI/UX", 6.0, "Design", "Remote", 12000);

        // Recruiter 5: David @ FinTechPlus
        User david = createUser("David", "david@fintechplus.com", "David123!",
                "8005556667", "Pune, Maharashtra", User.Role.RECRUITER);
        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(david).companyName("FinTechPlus").employeeRole("Engineering Manager").build());
        saveInternship(david, "FinTechPlus", "Spring Boot Developer Intern",
                "Java,Spring Boot,MySQL,REST APIs,Git", 7.5, "Web Dev", "Pune", 28000);
        saveInternship(david, "FinTechPlus", "Full Stack Web Developer Intern",
                "Node.js,Express,MongoDB,React,JavaScript,REST APIs,Git", 8.0, "Web Dev", "Pune", 25000);
        saveInternship(david, "FinTechPlus", "QA Automation Intern",
                "JavaScript,Node.js,REST APIs,Git,MongoDB,HTML,CSS", 7.0, "Web Dev", "Pune", 16000);

        log.info("[DataSeeder] Created 5 recruiters with 15 internships.");
    }

    // =========================================================================
    // PRIVATE HELPERS
    // =========================================================================

    private User createUser(String name, String email, String rawPassword,
                            String phone, String address, User.Role role) {
        return userRepository.save(User.builder()
                .name(name).email(email)
                .password(passwordEncoder.encode(rawPassword))
                .phoneNumber(phone).address(address).role(role)
                .createdAt(LocalDateTime.now()).build());
    }

    private void saveInternship(User recruiter, String company, String role,
                                String skills, double minCgpa,
                                String domain, String location, int stipend) {
        internshipRepository.save(Internship.builder()
                .recruiter(recruiter).companyName(company).role(role)
                .requiredSkills(skills).minimumCgpa(BigDecimal.valueOf(minCgpa))
                .domain(domain).location(location).stipend(BigDecimal.valueOf(stipend))
                .createdAt(LocalDateTime.now()).build());
    }
}
