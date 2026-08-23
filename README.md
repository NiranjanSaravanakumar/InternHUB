<div align="center">

# 🚀 InternHUB

### Internship Skill Matching Platform

**An AI-powered full-stack web application that matches students with internships using a weighted 4-parameter algorithm.**

[![Java](https://img.shields.io/badge/Java-17-orange?logo=java)](https://java.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)](https://vite.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)](https://mysql.com)

</div>

---

## 📌 Overview

**InternHUB** bridges the gap between students seeking internships and companies looking for qualified talent. Instead of generic job boards, InternHUB uses a **proprietary matching algorithm** to compute a precise **Match Percentage** between a student's profile and every internship posting — surfacing only the most relevant opportunities.

---

## 🏗️ Project Structure

```
InternHUB/
├── .gitignore              ← Root gitignore (covers frontend + backend)
├── README.md               ← This file
│
├── frontend/               ← React 19 + Vite (port 5173)
│   ├── src/
│   │   ├── components/     ← Navbar, InternshipCard, FilterSidebar
│   │   ├── context/        ← AuthContext (JWT state management)
│   │   ├── pages/          ← Landing, Auth, Student, Recruiter pages
│   │   └── services/       ← Axios API wrappers with JWT interceptor
│   ├── .env                ← VITE_API_URL=http://localhost:8080/api
│   └── README.md
│
└── backend/                ← Spring Boot 3 + MySQL (port 8080)
    ├── src/main/java/com/internhub/matching/
    │   ├── config/         ← SecurityConfig, JwtAuthFilter, JwtUtil
    │   ├── controller/     ← REST endpoints (Auth, Student, Recruiter)
    │   ├── dto/            ← Request/Response data transfer objects
    │   ├── entity/         ← JPA entities (User, Internship, etc.)
    │   ├── repository/     ← Spring Data JPA interfaces
    │   ├── service/        ← Business logic + MatchingService
    │   └── exception/      ← GlobalExceptionHandler
    ├── src/main/resources/
    │   └── application.properties
    ├── mvnw / mvnw.cmd     ← Maven Wrapper (no mvn install needed)
    └── README.md
```

---

## 🧮 Matching Algorithm

| Parameter | Weight | Logic |
|-----------|:------:|-------|
| **Skill Match** | 50% | `(matched skills ÷ required skills) × 50` |
| **Domain Match** | 20% | Exact match = 20, else 0 |
| **CGPA Match** | 15% | Student CGPA ≥ Min CGPA = 15, else 0 |
| **Location Match** | 15% | City match or "Remote" = 15, else 0 |

**Example:** Student with React + Spring Boot applying for a Full-Stack Bengaluru role (Min CGPA 8.0, CGPA 8.5):
```
Skill: 4/4 × 50 = 50 | Domain: 20 | CGPA: 15 | Location: 15
                                          Total = 95% Match ✅
```

---

## 👥 User Roles

| Role | Can Do |
|------|--------|
| **Candidate (Student)** | Register → Build profile (CGPA, skills, domain, location) → View matches → Apply |
| **Recruiter (Company)** | Register → Post internships → View ranked applicants with match score |

---

## ⚡ Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Java | 17+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

### 1 — Database

```sql
CREATE DATABASE internhub_db;
```

### 2 — Backend

```bash
cd backend

# Update MySQL password first:
# backend/src/main/resources/application.properties
#   spring.datasource.password=YOUR_PASSWORD

# Windows
.\mvnw.cmd spring-boot:run

# Linux / Mac
./mvnw spring-boot:run
```
→ API running at **http://localhost:8080**

### 3 — Frontend

```bash
cd frontend
npm install
npm run dev
```
→ App running at **http://localhost:5173**

### 4 — Stopping the Application

To stop the servers normally, press `Ctrl + C` in their respective terminal windows. 

If a server is stuck running in the background and you need to forcefully free up the port, run these commands in a new terminal:

```powershell
# Windows (PowerShell) - Kill Backend (Port 8080)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess -Force

# Windows (PowerShell) - Kill Frontend (Port 5173)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess -Force
```

*(Alternatively, if you have Node installed, you can just run `npx kill-port 8080` and `npx kill-port 5173` on any OS).*

---

## 🔐 Security

- **JWT (HS256)** — 24-hour tokens, issued at login/register
- **BCrypt** — Password hashing with salt
- **Spring Security RBAC** — `ROLE_CANDIDATE` & `ROLE_RECRUITER`
- **CORS** — Configured for `http://localhost:5173`
- **Stateless sessions** — No server-side session storage

---

## 🎨 Design System (60-30-10 Rule)

| Share | Color | Hex | Usage |
|-------|-------|-----|-------|
| 60% | White / Soft Orange | `#FFFFFF` / `#FFF7ED` | Backgrounds |
| 30% | Dark / Medium / Light Gray | `#111827` / `#6B7280` / `#E5E7EB` | Text & borders |
| 10% | Primary / Dark / Light Orange | `#F97316` / `#EA580C` / `#FFEDD5` | CTAs & badges |

Typography: **Plus Jakarta Sans** (Google Fonts)

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/student` | — | Register student |
| POST | `/api/auth/register/recruiter` | — | Register recruiter |
| POST | `/api/auth/login` | — | Login (any role) |
| GET | `/api/internships` | — | List all active internships |
| GET/PUT | `/api/student/profile` | CANDIDATE | Get/update matching profile |
| GET | `/api/student/matches` | CANDIDATE | Get ranked internship matches |
| POST | `/api/student/apply/{id}` | CANDIDATE | Apply for internship |
| GET | `/api/student/applications` | CANDIDATE | My applications |
| POST | `/api/recruiter/internships` | RECRUITER | Post internship |
| GET | `/api/recruiter/internships` | RECRUITER | My postings |
| GET | `/api/recruiter/internships/{id}/applicants` | RECRUITER | View applicants |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + Vite 8 |
| State Management | Context API + localStorage |
| HTTP Client | Axios (JWT interceptor) |
| Routing | React Router v6 |
| UI | Vanilla CSS (no Tailwind) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Backend Framework | Spring Boot 3.2.5 |
| Security | Spring Security + JJWT 0.11 |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL 8 |
| Build | Maven Wrapper 3.9.6 |
| Boilerplate reduction | Lombok |

---

## 📦 Production Build

```bash
# Frontend
cd frontend && npm run build    # outputs to frontend/dist/

# Backend
cd backend && .\mvnw.cmd package
java -jar target/matching-1.0.0.jar
```

---

<div align="center">
Built with ❤️ · InternHUB · 2025
</div>
