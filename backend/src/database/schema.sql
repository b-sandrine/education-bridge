-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'educator', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  content TEXT NOT NULL,
  duration_weeks INT NOT NULL,
  educator_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  video_url VARCHAR(500),
  lesson_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  lessons_completed INT DEFAULT 0,
  score DECIMAL(5, 2) DEFAULT 0,
  status VARCHAR(50) NOT NULL CHECK (status IN ('in_progress', 'completed', 'paused')) DEFAULT 'in_progress',
  completion_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Chatbot interactions table
CREATE TABLE IF NOT EXISTS chatbot_interactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  course_id UUID REFERENCES courses(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Queries table
CREATE TABLE IF NOT EXISTS student_queries (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id),
  admin_id UUID REFERENCES users(id),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  course_id UUID REFERENCES courses(id),
  status VARCHAR(50) NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved')) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

-- AI Conversations table (stores conversation sessions)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  topic VARCHAR(100),
  learning_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Chat Messages table (stores full conversation history)
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id),
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  message_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gamification: Student Achievements (Badges)
CREATE TABLE IF NOT EXISTS student_achievements (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type VARCHAR(100) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  course_id UUID REFERENCES courses(id),
  points_awarded INT DEFAULT 0
);

-- Gamification: Student Streaks
CREATE TABLE IF NOT EXISTS student_streaks (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  streak_start_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id)
);

-- Gamification: Student Points (Transaction Log)
CREATE TABLE IF NOT EXISTS student_points (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INT NOT NULL,
  reason VARCHAR(255),
  weekly_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  passing_score INT DEFAULT 60,
  time_limit_minutes INT,
  shuffle_questions BOOLEAN DEFAULT false,
  question_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50),
  topic VARCHAR(100),
  options JSONB,
  correct_answer TEXT,
  points INT DEFAULT 1,
  order_index INT,
  question_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  score INT,
  max_score INT DEFAULT 0,
  percentage_score INT,
  time_spent_minutes INT,
  time_taken_seconds INT,
  passed BOOLEAN DEFAULT false,
  answers JSONB,
  attempt_number INT DEFAULT 1,
  is_submitted BOOLEAN DEFAULT false,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz answers table
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  quiz_attempt_id UUID REFERENCES quiz_attempts(id),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  response TEXT,
  score INT,
  is_correct BOOLEAN,
  time_spent_seconds INT,
  feedback TEXT,
  rubric_scores JSONB,
  graded_at TIMESTAMP,
  graded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Interventions
CREATE TABLE IF NOT EXISTS student_interventions (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  educator_id UUID NOT NULL REFERENCES users(id),
  reason TEXT,
  priority VARCHAR(50) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active'
);

-- Targeted Assignments
CREATE TABLE IF NOT EXISTS targeted_assignments (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  topic VARCHAR(255),
  educator_id UUID NOT NULL REFERENCES users(id),
  description TEXT,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active'
);

-- Educator Feedback
CREATE TABLE IF NOT EXISTS educator_feedback (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  educator_id UUID NOT NULL REFERENCES users(id),
  feedback_type VARCHAR(50),
  message TEXT,
  attachments JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_student ON ai_conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_course ON ai_conversations(course_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_conversation ON ai_chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_student ON ai_chat_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_student_queries_student ON student_queries(student_id);
CREATE INDEX IF NOT EXISTS idx_student_queries_admin ON student_queries(admin_id);
CREATE INDEX IF NOT EXISTS idx_student_queries_status ON student_queries(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_interactions_user ON chatbot_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_id ON progress(course_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_user_id ON chatbot_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_student_queries_student_id ON student_queries(student_id);
CREATE INDEX IF NOT EXISTS idx_student_queries_admin_id ON student_queries(admin_id);
CREATE INDEX IF NOT EXISTS idx_student_queries_status ON student_queries(status);
CREATE INDEX IF NOT EXISTS idx_student_achievements_student ON student_achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_student_achievements_badge_type ON student_achievements(badge_type);
CREATE INDEX IF NOT EXISTS idx_student_streaks_student ON student_streaks(student_id);
CREATE INDEX IF NOT EXISTS idx_student_points_student ON student_points(student_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_student ON quiz_answers(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question ON quiz_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_student_interventions_student ON student_interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_interventions_educator ON student_interventions(educator_id);
CREATE INDEX IF NOT EXISTS idx_targeted_assignments_student ON targeted_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_targeted_assignments_educator ON targeted_assignments(educator_id);
CREATE INDEX IF NOT EXISTS idx_educator_feedback_student ON educator_feedback(student_id);
CREATE INDEX IF NOT EXISTS idx_educator_feedback_educator ON educator_feedback(educator_id);
