-- Adaptive Learning Platform - Complete Database Schema
-- PostgreSQL 15
-- Version: 2.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Base users table (both students and admins)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
    mode VARCHAR(20) CHECK (mode IN ('vtu', 'general')),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Students table (extends users)
CREATE TABLE students (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    usn VARCHAR(20) UNIQUE NOT NULL,
    semester INT NOT NULL,
    branch VARCHAR(10) NOT NULL,
    section VARCHAR(5) NOT NULL,
    scheme VARCHAR(10) NOT NULL DEFAULT '22',
    selected_subjects JSONB,
    exam_timeline JSONB,
    daily_study_hours INT DEFAULT 4,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_students_usn ON students(usn);
CREATE INDEX idx_students_branch_section ON students(branch, section);

-- Teachers/Admins table (extends users)
CREATE TABLE admins (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(50),
    assigned_subjects JSONB,
    assigned_sections JSONB,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admins_employee_id ON admins(employee_id);

-- ============================================================================
-- SUBJECTS & TOPICS
-- ============================================================================

-- Subjects table
CREATE TABLE subjects (
    subject_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    semester INT NOT NULL,
    scheme VARCHAR(10) NOT NULL,
    credits INT,
    syllabus_pdf_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subjects_code ON subjects(subject_code);
CREATE INDEX idx_subjects_semester ON subjects(semester);

-- Topics table (modules and sub-topics)
CREATE TABLE topics (
    topic_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES subjects(subject_id) ON DELETE CASCADE,
    module_number INT NOT NULL,
    topic_name VARCHAR(255) NOT NULL,
    parent_topic_id UUID REFERENCES topics(topic_id),
    dependencies JSONB,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    estimated_hours FLOAT,
    course_outcomes JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_topics_subject ON topics(subject_id);
CREATE INDEX idx_topics_module ON topics(module_number);

-- Study materials table
CREATE TABLE study_materials (
    material_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES subjects(subject_id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(topic_id),
    material_type VARCHAR(50) CHECK (material_type IN ('notes', 'textbook', 'pyq', 'model_paper', 'video', 'other')),
    title VARCHAR(255) NOT NULL,
    file_url TEXT,
    content_text TEXT,
    uploaded_by UUID REFERENCES users(user_id),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_materials_subject ON study_materials(subject_id);
CREATE INDEX idx_materials_type ON study_materials(material_type);

-- ============================================================================
-- LEARNING STATE TRACKING
-- ============================================================================

-- Learning states table (Bayesian + Forgetting Curve)
CREATE TABLE learning_states (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(topic_id) ON DELETE CASCADE,
    mastery_level FLOAT DEFAULT 0.0 CHECK (mastery_level >= 0 AND mastery_level <= 1),
    confidence_score FLOAT DEFAULT 0.0 CHECK (confidence_score >= 0 AND confidence_score <= 1),
    last_studied TIMESTAMP,
    study_count INT DEFAULT 0,
    quiz_scores JSONB,
    forgetting_rate FLOAT DEFAULT 0.3,
    next_revision_due TIMESTAMP,
    total_time_spent INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, topic_id)
);

CREATE INDEX idx_learning_states_user ON learning_states(user_id);
CREATE INDEX idx_learning_states_mastery ON learning_states(mastery_level);
CREATE INDEX idx_learning_states_revision ON learning_states(next_revision_due);

-- Study sessions table
CREATE TABLE study_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(topic_id),
    session_type VARCHAR(50) CHECK (session_type IN ('reading', 'quiz', 'flashcard', 'diagram', 'code_practice', 'video')),
    duration_minutes INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    satisfaction_rating INT CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    notes TEXT,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_sessions_topic ON study_sessions(topic_id);
CREATE INDEX idx_sessions_date ON study_sessions(started_at);

-- ============================================================================
-- ASSESSMENTS & TESTS
-- ============================================================================

-- Tests table
CREATE TABLE tests (
    test_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID REFERENCES users(user_id),
    subject_code VARCHAR(20) REFERENCES subjects(subject_code),
    module_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    question_pool JSONB NOT NULL,
    questions_per_student INT DEFAULT 10,
    time_limit_minutes INT NOT NULL,
    marks_per_question FLOAT DEFAULT 1.0,
    total_marks FLOAT,
    due_date TIMESTAMP NOT NULL,
    assigned_branches JSONB,
    assigned_sections JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    allow_review BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tests_subject ON tests(subject_code);
CREATE INDEX idx_tests_module ON tests(module_number);
CREATE INDEX idx_tests_due_date ON tests(due_date);
CREATE INDEX idx_tests_active ON tests(is_active);

-- Test submissions table
CREATE TABLE test_submissions (
    submission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES tests(test_id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    assigned_questions JSONB NOT NULL,
    student_answers JSONB,
    score FLOAT,
    percentage FLOAT,
    time_taken INT,
    tab_switch_count INT DEFAULT 0,
    copy_paste_attempts INT DEFAULT 0,
    auto_submitted BOOLEAN DEFAULT FALSE,
    flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    started_at TIMESTAMP,
    submitted_at TIMESTAMP,
    graded_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'auto_submitted', 'graded')),
    UNIQUE(test_id, student_id)
);

CREATE INDEX idx_submissions_test ON test_submissions(test_id);
CREATE INDEX idx_submissions_student ON test_submissions(student_id);
CREATE INDEX idx_submissions_status ON test_submissions(status);
CREATE INDEX idx_submissions_flagged ON test_submissions(flagged);

-- Anti-cheat violations log
CREATE TABLE anti_cheat_violations (
    violation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES test_submissions(submission_id) ON DELETE CASCADE,
    violation_type VARCHAR(50) CHECK (violation_type IN ('tab_switch', 'copy_paste', 'right_click', 'keyboard_shortcut', 'suspicious_timing')),
    violation_count INT DEFAULT 1,
    details JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_violations_submission ON anti_cheat_violations(submission_id);
CREATE INDEX idx_violations_type ON anti_cheat_violations(violation_type);

-- ============================================================================
-- CODE JOURNAL
-- ============================================================================

-- Code journal entries table
CREATE TABLE code_journal (
    entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    code_content TEXT,
    notes_markdown TEXT,
    language VARCHAR(50) NOT NULL,
    tags JSONB,
    subject_id UUID REFERENCES subjects(subject_id),
    topic_id UUID REFERENCES topics(topic_id),
    is_public BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_journal_user ON code_journal(user_id);
CREATE INDEX idx_journal_language ON code_journal(language);
CREATE INDEX idx_journal_tags ON code_journal USING GIN (tags);
CREATE INDEX idx_journal_created ON code_journal(created_at);

-- Code journal statistics (for gamification)
CREATE TABLE code_journal_stats (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    total_entries INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_entry_date DATE,
    languages_used JSONB,
    total_coding_minutes INT DEFAULT 0,
    achievements JSONB,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

-- Notifications table
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(user_id),
    type VARCHAR(50) CHECK (type IN ('test_assigned', 'test_reminder', 'result_published', 'system', 'announcement')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ============================================================================
-- STUDY PLANNER & SCHEDULE
-- ============================================================================

-- Study plans table (generated by RL scheduler)
CREATE TABLE study_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    topics JSONB NOT NULL,
    total_duration_minutes INT,
    completed BOOLEAN DEFAULT FALSE,
    completion_percentage FLOAT DEFAULT 0.0,
    generated_by VARCHAR(50) DEFAULT 'rl_scheduler',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, plan_date)
);

CREATE INDEX idx_plans_user ON study_plans(user_id);
CREATE INDEX idx_plans_date ON study_plans(plan_date);

-- RL model states (for DQN training)
CREATE TABLE rl_model_states (
    state_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    state_vector JSONB NOT NULL,
    action_taken JSONB,
    reward FLOAT,
    next_state_vector JSONB,
    episode_number INT,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rl_states_user ON rl_model_states(user_id);
CREATE INDEX idx_rl_states_episode ON rl_model_states(episode_number);

-- ============================================================================
-- ANALYTICS & LOGS
-- ============================================================================

-- Activity logs table
CREATE TABLE activity_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_user ON activity_logs(user_id);
CREATE INDEX idx_logs_type ON activity_logs(activity_type);
CREATE INDEX idx_logs_timestamp ON activity_logs(timestamp);

-- System settings table
CREATE TABLE system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_states_updated_at BEFORE UPDATE ON learning_states
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_journal_updated_at BEFORE UPDATE ON code_journal
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate total marks for a test
CREATE OR REPLACE FUNCTION calculate_test_total_marks()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_marks = NEW.questions_per_student * NEW.marks_per_question;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_test_marks BEFORE INSERT OR UPDATE ON tests
    FOR EACH ROW EXECUTE FUNCTION calculate_test_total_marks();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Student performance summary
CREATE VIEW student_performance_summary AS
SELECT 
    s.user_id,
    s.usn,
    u.name,
    s.branch,
    s.section,
    AVG(ls.mastery_level) as overall_mastery,
    COUNT(DISTINCT ss.session_id) as total_sessions,
    SUM(ss.duration_minutes) as total_study_minutes,
    AVG(ts.score) as average_test_score,
    COUNT(DISTINCT ts.test_id) as tests_completed
FROM students s
JOIN users u ON s.user_id = u.user_id
LEFT JOIN learning_states ls ON s.user_id = ls.user_id
LEFT JOIN study_sessions ss ON s.user_id = ss.user_id
LEFT JOIN test_submissions ts ON s.user_id = ts.student_id AND ts.status = 'graded'
GROUP BY s.user_id, s.usn, u.name, s.branch, s.section;

-- View: Active tests with submission counts
CREATE VIEW active_tests_summary AS
SELECT 
    t.test_id,
    t.title,
    t.subject_code,
    t.module_number,
    t.due_date,
    t.time_limit_minutes,
    COUNT(ts.submission_id) as total_submissions,
    COUNT(CASE WHEN ts.status = 'graded' THEN 1 END) as graded_submissions,
    AVG(ts.score) as average_score,
    COUNT(CASE WHEN ts.flagged = TRUE THEN 1 END) as flagged_submissions
FROM tests t
LEFT JOIN test_submissions ts ON t.test_id = ts.test_id
WHERE t.is_active = TRUE
GROUP BY t.test_id, t.title, t.subject_code, t.module_number, t.due_date, t.time_limit_minutes;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('max_tab_switches', '3', 'Maximum allowed tab switches before auto-submission'),
('session_timeout_minutes', '1440', 'Session timeout in minutes (24 hours)'),
('email_notifications_enabled', 'true', 'Enable email notifications'),
('rl_model_version', '"v1.0"', 'Current RL model version'),
('default_study_hours', '4', 'Default daily study hours for new students');

-- Schema version
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('schema_version', '"2.0"', 'Database schema version');

COMMENT ON DATABASE postgres IS 'Adaptive Learning Platform Database - Version 2.0';
