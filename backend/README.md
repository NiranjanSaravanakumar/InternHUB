<div align="center">

# ⚙️ InternHUB — Backend

### Spring Boot 3 · MySQL · JWT Security · AI Assessment

[![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)](https://java.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green?logo=springboot)](https://spring.io)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-green?logo=springsecurity)](https://spring.io/projects/spring-security)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)](https://mysql.com)
[![Lombok](https://img.shields.io/badge/Lombok-✓-red)](https://projectlombok.org)

</div>

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/internhub/matching/
│   │   │   ├── InternshipMatchingApplication.java   ← Entry point
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java    ← RBAC, CORS, filter chain
│   │   │   │   ├── JwtAuthFilter.java     ← Per-request Bearer token validation
│   │   │   │   └── JwtUtil.java           ← Token generate / extract / validate
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java        ← /api/auth/**
│   │   │   │   ├── StudentController.java     ← /api/student/**
│   │   │   │   ├── RecruiterController.java   ← /api/recruiter/**
│   │   │   │   └── InternshipController.java  ← /api/internships (public)
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── AuthRequest.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── StudentRegisterRequest.java
│   │   │   │   ├── RecruiterRegisterRequest.java
│   │   │   │   ├── StudentProfileRequest.java
│   │   │   │   ├── InternshipRequest.java
│   │   │   │   ├── MatchResultDTO.java         ← Score + per-param breakdown
│   │   │   │   ├── ApplicantDTO.java            ← Includes assessmentScore ★
│   │   │   │   └── AssessmentSubmitRequest.java ← NEW: carries quiz score on apply ★
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── User.java              ← STUDENT + RECRUITER (single table)
│   │   │   │   ├── StudentProfile.java    ← CGPA, skills, domain, location
│   │   │   │   ├── Internship.java        ← Job posting entity
│   │   │   │   ├── RecruiterProfile.java  ← Company name + role
│   │   │   │   └── Application.java       ← Student ↔ Internship with match% + assessmentScore ★
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── StudentProfileRepository.java
│   │   │   │   ├── InternshipRepository.java
│   │   │   │   ├── ApplicationRepository.java
│   │   │   │   └── RecruiterProfileRepository.java
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java        ← Register, login, BCrypt, JWT
│   │   │   │   ├── MatchingService.java    ← 4-parameter weighted algorithm ⭐
│   │   │   │   ├── StudentService.java     ← Profile, matches, apply (with score) ★
│   │   │   │   └── RecruiterService.java   ← Post/manage internships; sort by assessmentScore ★
│   │   │   │
│   │   │   └── exception/
│   │   │       ├── AppException.java            ← Custom exception with HttpStatus
│   │   │       └── GlobalExceptionHandler.java  ← @RestControllerAdvice
│   │   │
│   │   └── resources/
│   │       ├── application.properties   ← DB, JWT, CORS, upload config
│   │       └── schema.sql               ← Reference DDL (Hibernate auto-applies)
│   │
│   └── test/
│       └── java/com/internhub/matching/
│           └── InternshipMatchingApplicationTests.java
│
├── .mvn/wrapper/
├── mvnw                                ← Unix Maven wrapper
├── mvnw.cmd                            ← Windows Maven wrapper
├── pom.xml
├── .gitignore
└── README.md
```

> ★ = modified or added as part of the AI Skill Assessment feature

---

## ⚡ Getting Started

### Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Java JDK | 17+ | `java -version` |
| MySQL | 8.0+ | `mysql --version` |

> **No Maven installation needed** — the `mvnw.cmd` wrapper auto-downloads Maven 3.9.6 on first run.

### 1 — Create the Database

```sql
-- In MySQL client or MySQL Workbench
CREATE DATABASE internhub_db;
```

### 2 — Configure Application Properties

Edit [`src/main/resources/application.properties`](./src/main/resources/application.properties):

```properties
# ── Change these to match your MySQL setup ──
spring.datasource.url=jdbc:mysql://localhost:3306/internhub_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# ── Optional: change JWT secret ──
app.jwt.secret=InternHUBSuperSecretKey...
app.jwt.expiration=86400000      # 24 hours in ms
```

### 3 — Run the Application

```powershell
# Windows (PowerShell)
.\mvnw.cmd spring-boot:run

# Linux / Mac
./mvnw spring-boot:run
```

→ Server starts at **http://localhost:8080**

> 💡 First run downloads ~50 MB of Maven dependencies. Subsequent runs are fast.

### 4 — Stopping the Application

Press `Ctrl + C` in its terminal window. To forcefully kill port 8080:

```powershell
# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess -Force
```

*(Or: `npx kill-port 8080`)*

---

## 🗄️ Database Schema

Tables are **auto-created/altered by Hibernate** on startup (`ddl-auto=update`). No SQL scripts needed — including the new `assessment_score` column.

| Table | Description |
|-------|-------------|
| `users` | All users (students + recruiters) with `role` column |
| `student_profiles` | Matching data: CGPA, skills (CSV), domain, location, resume URL |
| `recruiter_profiles` | Company name and employee role |
| `internships` | Job postings with required skills (CSV), min CGPA, stipend |
| `applications` | Student ↔ Internship with `match_percentage` + **`assessment_score`** (0–15) |

---

## 🧮 Matching Algorithm — `MatchingService.java`

```java
// Weights
Skill Match    → 50% = (matchedSkills / requiredSkills) × 50
Domain Match   → 20% = exact string match (case-insensitive)
CGPA Match     → 15% = studentCGPA >= minCGPA ? 15 : 0
Location Match → 15% = city match OR either side is "Remote"

Total = skillScore + domainScore + cgpaScore + locationScore  // 0–100
```

Returns a `MatchResultDTO` with:
- Aggregate `matchScore`
- Per-parameter scores (`skillScore`, `domainScore`, `cgpaScore`, `locationScore`)
- `matchedSkills` and `missingSkills` lists

---

## 🧠 AI Assessment Integration

When a student applies, the frontend:
1. Calls **Groq API** (`llama3-8b-8192`) to generate 15 MCQs for the internship's required skills
2. Student completes the quiz (10-minute timer)
3. Score is calculated client-side
4. Frontend POSTs to `/api/student/apply/{id}` with `{ "assessmentScore": 12 }` in the body

The backend persists it on the `Application` entity. Recruiters see applicants sorted by `assessmentScore DESC`.

---

## 📡 REST API Endpoints

### Auth — `/api/auth` (Public)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/register/student` | `StudentRegisterRequest` | `AuthResponse` (JWT) |
| `POST` | `/register/recruiter` | `RecruiterRegisterRequest` | `AuthResponse` (JWT) |
| `POST` | `/login` | `{ email, password }` | `AuthResponse` (JWT) |

### Student — `/api/student` (Role: `STUDENT`)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/profile` | — | Get student matching profile |
| `PUT` | `/profile` | `StudentProfileRequest` | Update CGPA, skills, domain, location |
| `POST` | `/profile/resume` | `multipart/form-data` | Upload resume file |
| `GET` | `/matches` | — | Get all internships ranked by match % |
| `POST` | `/apply/{internshipId}` | `{ assessmentScore?: number }` | Apply — score persisted |
| `GET` | `/applications` | — | List my applications |

### Recruiter — `/api/recruiter` (Role: `RECRUITER`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/internships` | Post a new internship |
| `GET` | `/internships` | List my postings |
| `DELETE` | `/internships/{id}` | Delete a posting |
| `GET` | `/internships/{id}/applicants` | View applicants — **sorted by assessmentScore DESC** |

### Internships — `/api/internships` (Public)

| Method | Endpoint | Description |
|--------|----------| ------------|
| `GET` | `/` | List all internships |
| `GET` | `/{id}` | Get single internship |

---

## 🔐 Security Architecture

```
Request → JwtAuthFilter (OncePerRequestFilter)
                ↓
        Extract Bearer token
                ↓
        JwtUtil.extractEmail()
                ↓
        UserDetailsService.loadUserByUsername()
                ↓
        JwtUtil.isTokenValid()
                ↓
        SecurityContextHolder.setAuthentication()
                ↓
        SecurityConfig RBAC rules
        (/api/student/**  → ROLE_STUDENT)
        (/api/recruiter/** → ROLE_RECRUITER)
```

**Error Responses** (standardized via `GlobalExceptionHandler`):
```json
{
  "timestamp": "2026-09-05T10:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid email or password"
}
```

---

## 📦 Maven Dependencies (`pom.xml`)

| Dependency | Version | Purpose |
|-----------|---------|---------|
| `spring-boot-starter-web` | 3.2.5 | REST controllers |
| `spring-boot-starter-security` | 3.2.5 | RBAC + filter chain |
| `spring-boot-starter-data-jpa` | 3.2.5 | ORM + repositories |
| `spring-boot-starter-validation` | 3.2.5 | Bean validation |
| `mysql-connector-j` | latest | MySQL JDBC driver |
| `jjwt-api` / `jjwt-impl` / `jjwt-jackson` | 0.11.5 | JWT creation & validation |
| `lombok` | latest | Boilerplate reduction |

---

## 🏗️ Build for Production

```bash
# Package as executable JAR
.\mvnw.cmd package -DskipTests

# Run the JAR
java -jar target/matching-1.0.0.jar
```

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| `Access denied for user 'root'@'localhost'` | Wrong MySQL password in `application.properties` |
| `Communications link failure` | MySQL not running or wrong port (default: 3306) |
| `Port 8080 already in use` | Change `server.port=8081` in properties |
| `Could not autowire JwtAuthFilter` | Circular dependency — ensure `@Lazy` or check bean config |
