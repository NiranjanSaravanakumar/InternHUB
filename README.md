# 🚀 InternHUB — Internship Skill Matching Platform

> **AI-Powered matching between students and internship opportunities.**  
> Built with **React 19 + Vite** (frontend) and **Spring Boot 3 + MySQL** (backend).

---

## 📁 Project Structure

```
internship-skill-matching/
├── frontend/    # React 19 + Vite application (port 5173)
└── backend/     # Spring Boot 3 + MySQL REST API (port 8080)
```

---

## ⚡ Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

## 🗄️ Database Setup

1. Start MySQL and run:
```sql
CREATE DATABASE internhub_db;
```

2. Update **`backend/src/main/resources/application.properties`** with your credentials:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

> Tables are created automatically via `spring.jpa.hibernate.ddl-auto=update`

---

## 🔧 Backend Setup (Spring Boot)

```powershell
cd backend

# Windows — uses Maven Wrapper (auto-downloads Maven 3.9.6)
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**

### API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register/student` | Public |
| POST | `/api/auth/register/recruiter` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/internships` | Public |
| GET/PUT | `/api/student/profile` | CANDIDATE |
| GET | `/api/student/matches` | CANDIDATE |
| POST | `/api/student/apply/{id}` | CANDIDATE |
| GET | `/api/student/applications` | CANDIDATE |
| POST | `/api/recruiter/internships` | RECRUITER |
| GET | `/api/recruiter/internships` | RECRUITER |
| GET | `/api/recruiter/internships/{id}/applicants` | RECRUITER |

---

## 🎨 Frontend Setup (React + Vite)

```powershell
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**

### Available Routes

| Route | Page | Role |
|-------|------|------|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/register/student` | Student Registration (2-step) | Public |
| `/register/recruiter` | Recruiter Registration | Public |
| `/student/dashboard` | Match Dashboard | Student |
| `/student/profile` | Profile Setup | Student |
| `/student/applications` | My Applications | Student |
| `/recruiter/dashboard` | Recruiter Dashboard | Recruiter |
| `/recruiter/post` | Post Internship | Recruiter |
| `/recruiter/applicants/:id` | View Applicants | Recruiter |

---

## 🧮 Matching Algorithm

The core algorithm scores each student-internship pair across 4 weighted parameters:

| Parameter | Weight | Logic |
|-----------|--------|-------|
| **Skill Match** | 50% | `(matched skills / required skills) × 50` |
| **Domain Match** | 20% | Exact match = 20, else 0 |
| **CGPA Match** | 15% | Student CGPA ≥ Min CGPA = 15, else 0 |
| **Location Match** | 15% | City match or "Remote" = 15, else 0 |

**Example:** Student with React, Spring Boot skills applying to a Full-Stack Bengaluru role:
- Skill Match: 4/4 = 50
- Domain Match: Full-Stack = 20
- CGPA: 8.5 ≥ 8.0 = 15
- Location: Bengaluru = 15
- **Total: 100% Match**

---

## 🎨 Design System

Follows the **60-30-10 Color Rule**:

| Share | Colors | Usage |
|-------|--------|-------|
| 60% | `#FFFFFF`, `#FFF7ED` | Backgrounds |
| 30% | `#111827`, `#6B7280`, `#E5E7EB` | Text, borders |
| 10% | `#F97316`, `#EA580C`, `#FFEDD5` | CTAs, badges |

Typography: **Plus Jakarta Sans** (Google Fonts)

---

## 🔐 Security

- **JWT** tokens (HS256, 24h expiry) issued on login/register
- **BCrypt** password hashing
- **Spring Security RBAC** — `ROLE_CANDIDATE` and `ROLE_RECRUITER`
- CORS configured for `http://localhost:5173`

---

## 📦 Tech Stack

### Frontend
- React 19 + Vite 8
- React Router v6
- Axios (with JWT interceptor)
- React Hot Toast
- Lucide React Icons

### Backend
- Spring Boot 3.2.5
- Spring Security + JWT (JJWT 0.11)
- Spring Data JPA + Hibernate
- MySQL 8
- Lombok

---

## 🚀 Production Build

```powershell
# Frontend
cd frontend && npm run build

# Backend
cd backend && .\mvnw.cmd package
java -jar target/matching-1.0.0.jar
```
