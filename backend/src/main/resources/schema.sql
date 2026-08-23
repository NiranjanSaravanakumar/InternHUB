-- ─────────────────────────────────────────────────────────────────────────
-- InternHUB Database Schema
-- Run this script ONCE to set up the entire database structure.
-- MySQL 8.0+
-- ─────────────────────────────────────────────────────────────────────────

-- Create the database (if you haven't already)
CREATE DATABASE IF NOT EXISTS internhub_db;
USE internhub_db;

-- ─────────────────────────────────────────────────────────────────────────
-- 1. Base Users Table
--    Handles both Students (STUDENT) and Recruiters (RECRUITER) for login.
--    Personal/professional details live in the profile tables below.
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(150)                   NOT NULL,
    email      VARCHAR(150)                   NOT NULL UNIQUE,
    password   VARCHAR(255)                   NOT NULL,
    phone_number VARCHAR(20)                  NOT NULL,
    address    TEXT,
    role       ENUM('STUDENT', 'RECRUITER')   NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────
-- 2. Student Profiles Table
--    One-to-one with users. Stores academic + matching algorithm inputs.
--    skills → comma-separated text (e.g. "Java,React,MySQL")
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_profiles (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT         NOT NULL UNIQUE,
    dob                 DATE           NOT NULL,
    college_name        VARCHAR(200)   NOT NULL,
    degree              VARCHAR(100)   NOT NULL,
    department          VARCHAR(100)   NOT NULL,
    passout_year        INT            NOT NULL,
    cgpa                DECIMAL(3, 2)  NOT NULL,
    skills              TEXT           NOT NULL,     -- comma-separated: "Java,React,MySQL"
    preferred_domain    VARCHAR(100)   NOT NULL,
    experience_months   INT            DEFAULT 0,
    preferred_location  VARCHAR(100)   NOT NULL,
    resume_url          VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────
-- 3. Recruiter Profiles Table
--    One-to-one with users. Stores company/role context for recruiters.
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recruiter_profiles (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT         NOT NULL UNIQUE,
    company_name  VARCHAR(150)   NOT NULL,
    employee_role VARCHAR(100)   NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────
-- 4. Internships Table
--    Created by Recruiters. required_skills is comma-separated text.
--    stipend is stored as DECIMAL for precision.
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS internships (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id    BIGINT          NOT NULL,
    company_name    VARCHAR(150)    NOT NULL,
    role            VARCHAR(150)    NOT NULL,
    required_skills TEXT            NOT NULL,     -- comma-separated: "React,Spring Boot"
    minimum_cgpa    DECIMAL(3, 2)   NOT NULL,
    domain          VARCHAR(100)    NOT NULL,
    location        VARCHAR(100)    NOT NULL,     -- city name or "Remote"
    stipend         DECIMAL(10, 2)  NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────
-- 5. Applications Table
--    Tracks which student applied to which internship.
--    match_percentage is cached from the algorithm at apply time.
--    UNIQUE KEY prevents double-applications.
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    internship_id    BIGINT         NOT NULL,
    student_id       BIGINT         NOT NULL,
    match_percentage DECIMAL(5, 2)  NOT NULL,
    status           ENUM('APPLIED', 'REVIEWED', 'SHORTLISTED', 'REJECTED') DEFAULT 'APPLIED',
    applied_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id)    REFERENCES users(id)       ON DELETE CASCADE,
    UNIQUE KEY unique_application (internship_id, student_id)
);
