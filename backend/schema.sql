-- ============================================================
-- MULTI-TENANT WHITE-LABELED LMS PORTAL DATABASE SCHEMA (MySQL)
-- Supports Institute (B2C Paid) and Corporate (B2B Employee Training)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `lms_portal_db`;
USE `lms_portal_db`;

-- 1. TENANTS (White-label organization accounts)
CREATE TABLE IF NOT EXISTS `tenants` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('INSTITUTE', 'CORPORATE') NOT NULL DEFAULT 'INSTITUTE',
  `slug` VARCHAR(50) UNIQUE NOT NULL,
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `primary_color` VARCHAR(20) DEFAULT '#4F46E5',
  `secondary_color` VARCHAR(20) DEFAULT '#06B6D4',
  `domain` VARCHAR(150) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS (Multi-role accounts per tenant or Super Admin)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'CORPORATE_ADMIN', 'INSTRUCTOR', 'LEARNER', 'EMPLOYEE') NOT NULL,
  `department` VARCHAR(100) DEFAULT NULL, -- For Corporate Employees/Managers
  `job_title` VARCHAR(100) DEFAULT NULL,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE SET NULL
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT 'BookOpen',
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
);

-- 4. COURSES
CREATE TABLE IF NOT EXISTS `courses` (
  `id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) NOT NULL,
  `instructor_id` VARCHAR(36) NOT NULL,
  `category_id` VARCHAR(36) DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `subtitle` VARCHAR(300) DEFAULT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `thumbnail` VARCHAR(500) DEFAULT NULL,
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `is_enterprise_eligible` TINYINT(1) DEFAULT 1,
  `level` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') DEFAULT 'BEGINNER',
  `published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

-- 5. COURSE MODULES & LESSONS
CREATE TABLE IF NOT EXISTS `modules` (
  `id` VARCHAR(36) PRIMARY KEY,
  `course_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `sort_order` INT DEFAULT 1,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `lessons` (
  `id` VARCHAR(36) PRIMARY KEY,
  `module_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `video_url` VARCHAR(500) DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `duration_mins` INT DEFAULT 10,
  `sort_order` INT DEFAULT 1,
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE
);

-- 6. B2C ENROLLMENTS (Paid/Free Courses for Institute Learners)
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `course_id` VARCHAR(36) NOT NULL,
  `status` ENUM('ACTIVE', 'COMPLETED') DEFAULT 'ACTIVE',
  `progress_percentage` INT DEFAULT 0,
  `completed_lessons_json` JSON DEFAULT NULL,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
);

-- 7. B2B CORPORATE TRAINING ASSIGNMENTS
CREATE TABLE IF NOT EXISTS `corporate_assignments` (
  `id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) NOT NULL,
  `assigned_by_user_id` VARCHAR(36) NOT NULL,
  `assigned_to_user_id` VARCHAR(36) NOT NULL,
  `course_id` VARCHAR(36) NOT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `due_date` DATE NOT NULL,
  `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'NOT_STARTED',
  `progress_percentage` INT DEFAULT 0,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
);

-- 8. PAYMENT TRANSACTIONS (Institute Sales Revenue & Gateway Logs)
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `course_id` VARCHAR(36) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'USD',
  `gateway` ENUM('STRIPE', 'RAZORPAY', 'PAYPAL') DEFAULT 'STRIPE',
  `transaction_ref` VARCHAR(100) NOT NULL,
  `status` ENUM('SUCCESS', 'FAILED', 'PENDING') DEFAULT 'SUCCESS',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
);

-- 9. CERTIFICATES
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `course_id` VARCHAR(36) NOT NULL,
  `certificate_code` VARCHAR(50) UNIQUE NOT NULL,
  `issued_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
);
