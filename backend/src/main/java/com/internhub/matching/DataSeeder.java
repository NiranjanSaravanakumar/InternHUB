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
 * Seeded data:
 *   - 5 Student users  + StudentProfile entities
 *   - 5 Recruiter users + RecruiterProfile entities
 *   - 15 Internship listings (3 per recruiter)
 *
 * Password format: &lt;FirstName&gt;123!  (BCrypt-hashed before saving)
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
            log.info("[DataSeeder] Database already seeded — skipping.");
            return;
        }

        log.info("[DataSeeder] Empty database detected. Seeding test data...");

        // ── 1. STUDENTS ──────────────────────────────────────────────────────
        User niranjan = createUser("Niranjan Kumar",  "niranjan.test@student.com",  "Niranjan123!",
                "9876543210", "Bengaluru, Karnataka", User.Role.STUDENT);
        User alice    = createUser("Alice Dev",       "alice.dev@student.com",      "Alice123!",
                "9123456780", "Chennai, Tamil Nadu",  User.Role.STUDENT);
        User bob      = createUser("Bob UI",          "bob.ui@student.com",         "Bob123!",
                "9234567891", "Remote",               User.Role.STUDENT);
        User charlie  = createUser("Charlie Cloud",   "charlie.cloud@student.com",  "Charlie123!",
                "9345678902", "Hyderabad, Telangana", User.Role.STUDENT);
        User diana    = createUser("Diana Fullstack", "diana.fullstack@student.com","Diana123!",
                "9456789013", "Pune, Maharashtra",   User.Role.STUDENT);

        // ── 2. STUDENT PROFILES ──────────────────────────────────────────────
        studentProfileRepository.save(StudentProfile.builder()
                .user(niranjan)
                .dob(LocalDate.of(2004, 3, 15))
                .collegeName("RV College of Engineering")
                .degree("B.Tech")
                .department("Information Technology")
                .passoutYear(2026)
                .cgpa(8.5)
                .skills("Java,Spring Boot,React,Data Structures,Algorithms,MySQL,Git,REST APIs")
                .preferredDomain("Backend Development")
                .experienceMonths(3)
                .preferredLocation("Bengaluru")
                .resumeUrl(null)
                .build());

        studentProfileRepository.save(StudentProfile.builder()
                .user(alice)
                .dob(LocalDate.of(2003, 7, 22))
                .collegeName("Anna University")
                .degree("B.E.")
                .department("Computer Science")
                .passoutYear(2025)
                .cgpa(7.8)
                .skills("Python,Machine Learning,TensorFlow,SQL,Pandas,Numpy,Scikit-learn,AI")
                .preferredDomain("Data Science")
                .experienceMonths(6)
                .preferredLocation("Chennai")
                .resumeUrl(null)
                .build());

        studentProfileRepository.save(StudentProfile.builder()
                .user(bob)
                .dob(LocalDate.of(2004, 11, 5))
                .collegeName("NIT Trichy")
                .degree("B.Tech")
                .department("Computer Science")
                .passoutYear(2026)
                .cgpa(9.2)
                .skills("Figma,UI/UX Design,HTML,CSS,JavaScript,Adobe XD,Prototyping,User Research")
                .preferredDomain("UI/UX Design")
                .experienceMonths(2)
                .preferredLocation("Remote")
                .resumeUrl(null)
                .build());

        studentProfileRepository.save(StudentProfile.builder()
                .user(charlie)
                .dob(LocalDate.of(2003, 1, 30))
                .collegeName("BITS Pilani")
                .degree("B.E.")
                .department("Information Technology")
                .passoutYear(2025)
                .cgpa(8.0)
                .skills("AWS,Docker,Kubernetes,Linux,Terraform,CI/CD,Jenkins,Bash,DevOps")
                .preferredDomain("Cloud & DevOps")
                .experienceMonths(4)
                .preferredLocation("Hyderabad")
                .resumeUrl(null)
                .build());

        studentProfileRepository.save(StudentProfile.builder()
                .user(diana)
                .dob(LocalDate.of(2002, 9, 18))
                .collegeName("Symbiosis Institute of Technology")
                .degree("MCA")
                .department("Computer Applications")
                .passoutYear(2025)
                .cgpa(8.8)
                .skills("React,Node.js,Express,MongoDB,JavaScript,HTML,CSS,MERN Stack,REST APIs")
                .preferredDomain("Full Stack Development")
                .experienceMonths(8)
                .preferredLocation("Pune")
                .resumeUrl(null)
                .build());

        log.info("[DataSeeder] Created 5 students with profiles.");

        // ── 3. RECRUITERS ────────────────────────────────────────────────────
        User john  = createUser("John Tech",   "john@technova.com",      "John123!",
                "8001112223", "Bengaluru, Karnataka", User.Role.RECRUITER);
        User mike  = createUser("Mike Data",   "mike@datacorp.com",      "Mike123!",
                "8002223334", "Chennai, Tamil Nadu",  User.Role.RECRUITER);
        User sarah = createUser("Sarah Cloud", "sarah@cloudsync.com",    "Sarah123!",
                "8003334445", "Hyderabad, Telangana", User.Role.RECRUITER);
        User emma  = createUser("Emma Design", "emma@designstudio.com",  "Emma123!",
                "8004445556", "Remote",               User.Role.RECRUITER);
        User david = createUser("David Fin",   "david@fintechplus.com",  "David123!",
                "8005556667", "Pune, Maharashtra",    User.Role.RECRUITER);

        // ── 4. RECRUITER PROFILES ────────────────────────────────────────────
        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(john).companyName("TechNova Solutions").employeeRole("Tech Lead").build());

        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(mike).companyName("DataCorp Analytics").employeeRole("Data Science Manager").build());

        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(sarah).companyName("CloudSync Technologies").employeeRole("HR Manager").build());

        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(emma).companyName("DesignStudio Creative").employeeRole("Head of Design").build());

        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(david).companyName("FinTechPlus").employeeRole("Engineering Manager").build());

        log.info("[DataSeeder] Created 5 recruiters with profiles.");

        // ── 5. INTERNSHIPS (3 per recruiter) ─────────────────────────────────

        // -- TechNova (John) --
        saveInternship(john, "TechNova Solutions", "Java Backend Intern",
                "Java,Spring Boot,MySQL,REST APIs,Hibernate",
                7.5, "Backend Development", "Bengaluru", 20000);

        saveInternship(john, "TechNova Solutions", "React Frontend Intern",
                "React,JavaScript,HTML,CSS,Redux,TypeScript",
                7.0, "Frontend Development", "Bengaluru", 18000);

        saveInternship(john, "TechNova Solutions", "Full Stack Developer Intern",
                "Java,Spring Boot,React,MySQL,Git,REST APIs,Data Structures",
                8.0, "Full Stack Development", "Bengaluru", 25000);

        // -- DataCorp (Mike) --
        saveInternship(mike, "DataCorp Analytics", "Data Science Intern",
                "Python,Machine Learning,Pandas,SQL,Scikit-learn,Statistics,AI",
                7.5, "Data Science", "Chennai", 22000);

        saveInternship(mike, "DataCorp Analytics", "Python Developer Intern",
                "Python,Django,REST APIs,PostgreSQL,Git,OOP",
                7.0, "Backend Development", "Chennai", 18000);

        saveInternship(mike, "DataCorp Analytics", "ML Engineer Intern",
                "Python,TensorFlow,AI,Deep Learning,Machine Learning,Numpy,PyTorch",
                8.0, "Machine Learning", "Remote", 28000);

        // -- CloudSync (Sarah) --
        saveInternship(sarah, "CloudSync Technologies", "DevOps Intern",
                "Docker,Kubernetes,Linux,CI/CD,Jenkins,Bash,AWS,Git",
                7.0, "DevOps", "Hyderabad", 20000);

        saveInternship(sarah, "CloudSync Technologies", "Cloud Architect Intern",
                "AWS,Terraform,Docker,Kubernetes,Cloud Architecture,Security,IAM",
                7.8, "Cloud Computing", "Hyderabad", 25000);

        saveInternship(sarah, "CloudSync Technologies", "SRE Intern",
                "Linux,Python,Monitoring,Grafana,Prometheus,Bash,AWS,On-call",
                7.5, "Site Reliability Engineering", "Remote", 22000);

        // -- DesignStudio (Emma) --
        saveInternship(emma, "DesignStudio Creative", "UI/UX Design Intern",
                "Figma,Adobe XD,UI/UX Design,Prototyping,User Research,HTML,CSS",
                6.5, "UI/UX Design", "Remote", 15000);

        saveInternship(emma, "DesignStudio Creative", "Product Design Intern",
                "Figma,Product Thinking,Wireframing,Prototyping,User Research,Design Systems",
                7.0, "Product Design", "Remote", 16000);

        saveInternship(emma, "DesignStudio Creative", "Graphic Designer Intern",
                "Adobe Illustrator,Photoshop,Canva,Visual Design,Branding,Typography",
                6.0, "Graphic Design", "Remote", 12000);

        // -- FinTechPlus (David) --
        saveInternship(david, "FinTechPlus", "Spring Boot Developer Intern",
                "Java,Spring Boot,Spring Security,JWT,MySQL,Data Structures,REST APIs",
                8.0, "Backend Development", "Pune", 28000);

        saveInternship(david, "FinTechPlus", "Security Intern",
                "Java,Spring Security,OWASP,Cryptography,REST APIs,Penetration Testing",
                7.5, "Cybersecurity", "Pune", 20000);

        saveInternship(david, "FinTechPlus", "QA Automation Intern",
                "Java,Selenium,JUnit,TestNG,API Testing,Postman,Maven,Git",
                7.0, "QA / Testing", "Pune", 16000);

        log.info("[DataSeeder] Created 15 internships (3 per recruiter).");
        log.info("[DataSeeder] Database seeding complete! Ready for testing.");
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private User createUser(String name, String email, String rawPassword,
                            String phone, String address, User.Role role) {
        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .phoneNumber(phone)
                .address(address)
                .role(role)
                .createdAt(LocalDateTime.now())
                .build();
        return userRepository.save(user);
    }

    private void saveInternship(User recruiter, String company, String role,
                                String skills, double minCgpa,
                                String domain, String location, int stipend) {
        internshipRepository.save(Internship.builder()
                .recruiter(recruiter)
                .companyName(company)
                .role(role)
                .requiredSkills(skills)
                .minimumCgpa(BigDecimal.valueOf(minCgpa))
                .domain(domain)
                .location(location)
                .stipend(BigDecimal.valueOf(stipend))
                .createdAt(LocalDateTime.now())
                .build());
    }
}
