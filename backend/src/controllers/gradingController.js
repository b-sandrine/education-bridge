import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../middleware/errorHandler.js';
import QuizService from '../services/QuizService.js';
import LearnerAnalyticsService from '../services/LearnerAnalyticsService.js';

// Get essay responses for grading
export const getEssayResponses = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { status } = req.query;

  let query = `
    SELECT 
      qa.id,
      qa.quiz_id,
      qa.student_id,
      qa.question_id,
      qa.response,
      qa.score,
      qa.graded_at,
      qa.graded_by,
      s.full_name as student_name,
      qq.question_text,
      qq.question_type
    FROM quiz_answers qa
    JOIN students s ON qa.student_id = s.id
    JOIN quiz_questions qq ON qa.question_id = qq.id
    WHERE qa.quiz_id = $1 AND qq.question_type IN ('essay', 'short_answer')
  `;

  const params = [quizId];

  if (status === 'ungraded') {
    query += ' AND qa.score IS NULL';
  } else if (status === 'graded') {
    query += ' AND qa.score IS NOT NULL';
  }

  query += ' ORDER BY qa.created_at DESC';

  const result = await pool.query(query, params);

  res.status(200).json({
    status: 'success',
    data: result.rows,
    total: result.rows.length,
  });
});

// Grade essay response
export const gradeResponse = asyncHandler(async (req, res) => {
  const { responseId } = req.params;
  const { score, feedback, rubricScores } = req.body;

  // Validate score
  if (score < 0 || score > 100) {
    return res.status(400).json({
      status: 'error',
      message: 'Score must be between 0 and 100',
    });
  }

  const result = await pool.query(
    `UPDATE quiz_answers 
     SET score = $1, feedback = $2, rubric_scores = $3, graded_at = NOW(), graded_by = $4
     WHERE id = $5
     RETURNING *`,
    [score, feedback, JSON.stringify(rubricScores), req.user.id, responseId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'Response not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: result.rows[0],
  });
});

// Get quiz statistics for educator
export const getQuizStatistics = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const statsQuery = `
    SELECT 
      COUNT(DISTINCT student_id) as total_attempts,
      AVG(score) as average_score,
      MIN(score) as lowest_score,
      MAX(score) as highest_score,
      STDDEV(score) as score_std_dev,
      COUNT(CASE WHEN score >= 80 THEN 1 END) as passed_students,
      COUNT(CASE WHEN score < 80 THEN 1 END) as failed_students,
      ROUND(AVG(time_spent_minutes)) as avg_time_minutes,
      COUNT(CASE WHEN is_submitted = true THEN 1 END) as submitted_count,
      COUNT(CASE WHEN is_submitted = false THEN 1 END) as incomplete_count
    FROM quiz_attempts
    WHERE quiz_id = $1
  `;

  const detailedQuery = `
    SELECT 
      score,
      COUNT(*) as count
    FROM quiz_attempts
    WHERE quiz_id = $1
    GROUP BY score
    ORDER BY score DESC
  `;

  const [stats, distribution] = await Promise.all([
    pool.query(statsQuery, [quizId]),
    pool.query(detailedQuery, [quizId]),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      summary: stats.rows[0],
      distribution: distribution.rows,
    },
  });
});

// Get per-question analysis
export const getQuestionAnalysis = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const analysis = await pool.query(
    `
    SELECT 
      qq.id,
      qq.question_text,
      qq.question_type,
      qq.correct_answer,
      COUNT(DISTINCT qa.student_id) as total_responses,
      COUNT(CASE WHEN qa.is_correct = true THEN 1 END) as correct_count,
      ROUND(100.0 * COUNT(CASE WHEN qa.is_correct = true THEN 1 END) / 
            NULLIF(COUNT(DISTINCT qa.student_id), 0), 2) as success_rate,
      COUNT(CASE WHEN qa.time_spent_seconds > 300 THEN 1 END) as slow_responders
    FROM quiz_questions qq
    LEFT JOIN quiz_answers qa ON qq.id = qa.question_id
    WHERE qq.quiz_id = $1
    GROUP BY qq.id, qq.question_text, qq.question_type, qq.correct_answer
    ORDER BY success_rate ASC
    `,
    [quizId]
  );

  res.status(200).json({
    status: 'success',
    data: analysis.rows,
  });
});

// Flag struggling student
export const flagStudentForIntervention = asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.body;
  const { reason, priority } = req.body;

  const interventionId = uuidv4();

  const result = await pool.query(
    `INSERT INTO student_interventions 
     (id, student_id, course_id, educator_id, reason, priority, created_at, status)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'active')
     RETURNING *`,
    [interventionId, studentId, courseId, req.user.id, reason, priority]
  );

  res.status(201).json({
    status: 'success',
    data: result.rows[0],
  });
});

// Get at-risk students
export const getAtRiskStudents = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { threshold = 60 } = req.query;

  const atRiskQuery = `
    SELECT 
      u.id,
      u.first_name || ' ' || u.last_name as full_name,
      u.email,
      COUNT(DISTINCT qa.quiz_id) as quizzes_taken,
      ROUND(AVG(COALESCE(qa.percentage_score, 0))::numeric, 2) as average_score,
      STRING_AGG(DISTINCT COALESCE(qq.topic, 'General'), ', ') as weak_topics,
      COUNT(CASE WHEN COALESCE(qa.percentage_score, 0) < $1 THEN 1 END) as failed_attempts
    FROM users u
    LEFT JOIN progress p ON u.id = p.user_id AND p.course_id = $2
    LEFT JOIN quiz_attempts qa ON u.id = qa.student_id AND qa.course_id = $2
    LEFT JOIN quiz_questions qq ON qa.quiz_id = qq.quiz_id
    WHERE u.role = 'student' AND p.course_id = $2
    GROUP BY u.id, u.first_name, u.last_name, u.email
    HAVING ROUND(AVG(COALESCE(qa.percentage_score, 0))::numeric, 2) < $1 OR COUNT(CASE WHEN COALESCE(qa.percentage_score, 0) < $1 THEN 1 END) > 0
    ORDER BY ROUND(AVG(COALESCE(qa.percentage_score, 0))::numeric, 2) ASC
  `;

  const result = await pool.query(atRiskQuery, [threshold, courseId]);

  res.status(200).json({
    status: 'success',
    data: result.rows,
    count: result.rows.length,
  });
});

// Create targeted assignment
export const createTargetedAssignment = asyncHandler(async (req, res) => {
  const { studentId, courseId, lessonId, topic } = req.body;
  const { description, dueDate } = req.body;

  const assignmentId = uuidv4();

  const result = await pool.query(
    `INSERT INTO targeted_assignments 
     (id, student_id, course_id, lesson_id, topic, educator_id, description, due_date, created_at, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), 'active')
     RETURNING *`,
    [assignmentId, studentId, courseId, lessonId, topic, req.user.id, description, dueDate]
  );

  res.status(201).json({
    status: 'success',
    data: result.rows[0],
  });
});

// Get class progress overview
export const getClassProgressOverview = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const overviewQuery = `
    SELECT 
      e.course_id,
      COUNT(DISTINCT e.student_id) as total_students,
      COUNT(DISTINCT CASE WHEN p.completed_lessons > 0 THEN e.student_id END) as active_students,
      ROUND(AVG(p.completion_percentage)::numeric, 2) as avg_completion,
      ROUND(AVG(qa.score)::numeric, 2) as avg_quiz_score,
      COUNT(DISTINCT CASE WHEN qa.score < 60 THEN qa.student_id END) as struggling_count,
      COUNT(DISTINCT CASE WHEN qa.score >= 80 THEN qa.student_id END) as top_performers
    FROM enrollments e
    LEFT JOIN progress p ON e.student_id = p.student_id AND e.course_id = p.course_id
    LEFT JOIN quiz_attempts qa ON e.student_id = qa.student_id AND e.course_id = qa.course_id
    WHERE e.course_id = $1
    GROUP BY e.course_id
  `;

  const peerComparisonQuery = `
    SELECT 
      s.id,
      s.full_name,
      ROUND(AVG(qa.score)::numeric, 2) as avg_score,
      ROUND(AVG(p.completion_percentage)::numeric, 2) as completion_percentage,
      COUNT(DISTINCT qa.quiz_id) as quizzes_taken
    FROM students s
    JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN progress p ON s.id = p.student_id AND e.course_id = p.course_id
    LEFT JOIN quiz_attempts qa ON s.id = qa.student_id AND e.course_id = qa.course_id
    WHERE e.course_id = $1
    GROUP BY s.id, s.full_name
    ORDER BY avg_score DESC
  `;

  const [overview, peerComparison] = await Promise.all([
    pool.query(overviewQuery, [courseId]),
    pool.query(peerComparisonQuery, [courseId]),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      overview: overview.rows[0],
      peerComparison: peerComparison.rows,
    },
  });
});

// Submit feedback to student
export const submitStudentFeedback = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { feedbackType, message, attachments } = req.body;

  const feedbackId = uuidv4();

  const result = await pool.query(
    `INSERT INTO educator_feedback 
     (id, student_id, educator_id, feedback_type, message, attachments, created_at, is_read)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), false)
     RETURNING *`,
    [feedbackId, studentId, req.user.id, feedbackType, message, JSON.stringify(attachments)]
  );

  res.status(201).json({
    status: 'success',
    data: result.rows[0],
  });
});
