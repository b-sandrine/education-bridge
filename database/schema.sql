-- EduBridge Database Schema
-- PostgreSQL
-- Version: 1.0

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Users Table (Abstract)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'educator', 'admin')),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    verification_token_expires_at TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP -- Soft delete
);

-- Create index on email for faster authentication
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================================================
-- STUDENT SPECIFIC
-- ============================================================================

CREATE TABLE students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    school_name VARCHAR(255),
    grade_level INT CHECK (grade_level BETWEEN 1 AND 12),
    learning_style VARCHAR(50), -- visual, auditory, kinesthetic
    learning_preferences JSONB, -- Custom preferences as JSON
    total_points INT DEFAULT 0,
    achievement_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- EDUCATOR SPECIFIC
-- ============================================================================

CREATE TABLE educators (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    subject_specializations TEXT[], -- Array of subjects
    qualification VARCHAR(255),
    experience_years INT,
    bio TEXT,
    certification_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- COURSES & CURRICULUM
-- ============================================================================

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL, -- Math, English, Science, etc.
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
    curriculum_aligned BOOLEAN DEFAULT true,
    total_lessons INT DEFAULT 0,
    created_by_id UUID NOT NULL REFERENCES educators(id) ON DELETE SET NULL,
    duration_hours INT, -- Estimated completion time
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    is_published BOOLEAN DEFAULT false,
    thumbnail_url VARCHAR(500),
    enrollment_count INT DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_ratings INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP -- Soft delete
);

CREATE INDEX idx_courses_subject ON courses(subject);
CREATE INDEX idx_courses_grade_level ON courses(grade_level);
CREATE INDEX idx_courses_created_by_id ON courses(created_by_id);
CREATE INDEX idx_courses_is_published ON courses(is_published);

-- ============================================================================
-- LESSONS
-- ============================================================================

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    content_type VARCHAR(50) CHECK (content_type IN ('text', 'video', 'interactive', 'quiz', 'mixed')),
    video_url VARCHAR(500),
    duration_minutes INT,
    order_index INT NOT NULL,
    learning_objectives TEXT[], -- Array of objectives
    is_published BOOLEAN DEFAULT false,
    average_time_spent_minutes INT DEFAULT 0,
    completion_rate DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_order_index ON lessons(course_id, order_index);

-- ============================================================================
-- LESSON MEDIA
-- ============================================================================

CREATE TABLE lesson_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    file_type VARCHAR(50), -- image, video, pdf, audio
    file_url VARCHAR(500) NOT NULL,
    file_size_mb DECIMAL(10, 2),
    duration_seconds INT, -- For audio/video
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lesson_media_lesson_id ON lesson_media(lesson_id);

-- ============================================================================
-- ENROLLMENTS
-- ============================================================================

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (enrollment_status IN ('active', 'completed', 'dropped', 'paused')),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP,
    total_lessons_completed INT DEFAULT 0,
    course_rating INT,
    course_review TEXT,
    progress_percentage INT DEFAULT 0,
    estimated_completion_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(enrollment_status);

-- ============================================================================
-- STUDENT PROGRESS
-- ============================================================================

CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lessons_completed INT DEFAULT 0,
    score DECIMAL(5, 2) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'paused')),
    completion_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_progress_student_id ON progress(user_id);
CREATE INDEX idx_progress_course_id ON progress(course_id);
CREATE INDEX idx_progress_user_course ON progress(user_id, course_id);

-- ============================================================================
-- QUIZZES & ASSESSMENTS
-- ============================================================================

CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_questions INT,
    passing_score INT DEFAULT 70,
    time_limit_minutes INT,
    show_correct_answers BOOLEAN DEFAULT true,
    shuffle_questions BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_lesson_id ON quizzes(lesson_id);

-- Quiz Questions
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
    order_index INT,
    points INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

-- Quiz Question Options
CREATE TABLE quiz_question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    order_index INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_options_question_id ON quiz_question_options(question_id);

-- Quiz Attempts
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score DECIMAL(5, 2),
    total_time_spent_seconds INT,
    attempt_number INT,
    passed BOOLEAN,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_attempts_student_id ON quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

-- ============================================================================
-- CHATBOT & AI INTERACTIONS
-- ============================================================================

CREATE TABLE chat_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    lesson_context_id UUID REFERENCES lessons(id),
    course_context_id UUID REFERENCES courses(id),
    ai_provider VARCHAR(100), -- openai, cohere, etc.
    response_time_ms INT,
    helpful_rating INT CHECK (helpful_rating IN (1, 2, 3, 4, 5)),
    feedback TEXT,
    flagged_for_review BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_interactions_student_id ON chat_interactions(student_id);
CREATE INDEX idx_chat_interactions_created_at ON chat_interactions(created_at);

-- ============================================================================
-- ACHIEVEMENTS & GAMIFICATION
-- ============================================================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    criteria_type VARCHAR(100), -- course_completion, points_milestone, streak, etc.
    criteria_value INT,
    badge_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Achievements
CREATE TABLE student_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, achievement_id)
);

CREATE INDEX idx_student_achievements_student_id ON student_achievements(student_id);

-- Student Points/Leaderboard
CREATE TABLE student_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    points_earned INT,
    reason VARCHAR(255), -- quiz_completion, lesson_completion, streak, etc.
    reference_id UUID, -- quiz_attempt_id, lesson_id, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_points_student_id ON student_points(student_id);

-- ============================================================================
-- USSD INTERACTIONS
-- ============================================================================

CREATE TABLE ussd_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL,
    student_id UUID REFERENCES students(id),
    session_state VARCHAR(100),
    menu_level VARCHAR(50),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_interaction_at TIMESTAMP,
    ended_at TIMESTAMP
);

CREATE INDEX idx_ussd_sessions_phone_number ON ussd_sessions(phone_number);
CREATE INDEX idx_ussd_sessions_started_at ON ussd_sessions(started_at);

-- USSD Interaction Log
CREATE TABLE ussd_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES ussd_sessions(id),
    phone_number VARCHAR(20) NOT NULL,
    user_input TEXT,
    system_response TEXT,
    interaction_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ussd_logs_session_id ON ussd_logs(session_id);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50), -- achievement, progress, message, announcement
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);

-- ============================================================================
-- FEEDBACK & REVIEWS
-- ============================================================================

CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_type VARCHAR(50), -- course, lesson, system, ai_response
    subject_id UUID, -- course_id, lesson_id, etc.
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ADMIN & SYSTEM
-- ============================================================================

-- Activity Logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================================================
-- CREATE VIEWS
-- ============================================================================

-- Student Progress View
CREATE VIEW student_progress_summary AS
SELECT 
    s.id as student_id,
    u.first_name,
    u.last_name,
    COUNT(DISTINCT e.id) as courses_enrolled,
    COUNT(DISTINCT CASE WHEN e.enrollment_status = 'completed' THEN e.id END) as courses_completed,
    AVG(e.progress_percentage) as avg_progress,
    SUM(sp.points_earned) as total_points,
    COUNT(DISTINCT sa.achievement_id) as achievements_earned
FROM students s
JOIN users u ON s.id = u.id
LEFT JOIN enrollments e ON s.id = e.student_id
LEFT JOIN student_points sp ON s.id = sp.student_id
LEFT JOIN student_achievements sa ON s.id = sa.student_id
GROUP BY s.id, u.first_name, u.last_name;

-- Leaderboard View
CREATE VIEW leaderboard AS
SELECT 
    s.id,
    u.first_name,
    u.last_name,
    SUM(sp.points_earned) as total_points,
    COUNT(DISTINCT sa.achievement_id) as achievements,
    ROW_NUMBER() OVER (ORDER BY SUM(sp.points_earned) DESC) as rank
FROM students s
JOIN users u ON s.id = u.id
LEFT JOIN student_points sp ON s.id = sp.student_id
LEFT JOIN student_achievements sa ON s.id = sa.student_id
GROUP BY s.id, u.first_name, u.last_name;

-- Course Analytics View
CREATE VIEW course_analytics AS
SELECT 
    c.id,
    c.title,
    c.subject,
    COUNT(DISTINCT e.id) as total_enrollments,
    COUNT(DISTINCT CASE WHEN e.enrollment_status = 'completed' THEN e.id END) as completed_enrollments,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN e.enrollment_status = 'completed' THEN e.id END) / COUNT(DISTINCT e.id), 2) as completion_rate,
    AVG(e.course_rating) as avg_rating,
    COUNT(l.id) as total_lessons
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
LEFT JOIN lessons l ON c.id = l.course_id
GROUP BY c.id, c.title, c.subject;

-- ============================================================================
-- CREATE TRIGGERS
-- ============================================================================

-- Update users.updated_at on course update
CREATE OR REPLACE FUNCTION update_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_timestamp();

-- Update courses.updated_at
CREATE TRIGGER trigger_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_users_timestamp();

-- Update enrollments.updated_at
CREATE TRIGGER trigger_enrollments_updated_at
BEFORE UPDATE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_users_timestamp();

-- Update progress.updated_at
CREATE TRIGGER trigger_progress_updated_at
BEFORE UPDATE ON progress
FOR EACH ROW
EXECUTE FUNCTION update_users_timestamp();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- These should be adjusted based on actual user/role setup
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
