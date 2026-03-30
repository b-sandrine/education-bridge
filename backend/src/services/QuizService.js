import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

class QuizService {
  // ===== QUIZ CRUD =====
  
  static async createQuiz(quizData, userId, userRole) {
    const { lessonId, title, description, passingScore, timeLimitMinutes, shuffleQuestions, questions = [] } = quizData;

    // Verify lesson exists and user has permission
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    const course = await Course.findById(lesson.course_id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (userRole === 'educator' && course.educator_id !== userId) {
      throw new ForbiddenError('You can only create quizzes for your own courses');
    }

    const quizId = uuidv4();
    const query = `
      INSERT INTO quizzes (id, lesson_id, title, description, passing_score, time_limit_minutes, shuffle_questions, question_count, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await pool.query(query, [
      quizId,
      lessonId,
      title,
      description || null,
      passingScore || 70,
      timeLimitMinutes || null,
      shuffleQuestions || false,
      questions.length,
      userId,
    ]);

    // Save each question
    if (Array.isArray(questions) && questions.length > 0) {
      for (let order = 0; order < questions.length; order++) {
        const q = questions[order];
        const questionId = uuidv4();
        const questionQuery = `
          INSERT INTO quiz_questions (id, quiz_id, question_text, question_type, options, correct_answer, points, question_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `;
        
        await pool.query(questionQuery, [
          questionId,
          quizId,
          q.questionText || q.question_text,
          q.questionType || q.question_type || 'multiple_choice',
          q.options ? JSON.stringify(q.options) : null,
          q.correctAnswer || q.correct_answer,
          q.points || 1,
          order + 1,
        ]);
      }
    }

    return result.rows[0];
  }

  static async getQuiz(quizId) {
    const query = `
      SELECT q.*, 
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count
      FROM quizzes q
      WHERE q.id = $1
    `;
    const result = await pool.query(query, [quizId]);
    if (result.rows.length === 0) {
      throw new NotFoundError('Quiz not found');
    }

    const quiz = result.rows[0];

    // Fetch associated questions
    const questionsQuery = `
      SELECT * FROM quiz_questions
      WHERE quiz_id = $1
      ORDER BY question_order ASC
    `;
    const questionsResult = await pool.query(questionsQuery, [quizId]);
    quiz.questions = questionsResult.rows.map(q => {
      let parsedOptions = null;
      if (q.options) {
        try {
          parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
        } catch (e) {
          console.error('Error parsing options:', q.options, e);
          parsedOptions = q.options;
        }
      }
      return {
        ...q,
        options: parsedOptions,
        question_text: q.question_text,
        question_type: q.question_type,
        correct_answer: q.correct_answer,
      };
    });

    return quiz;
  }

  static async getLessonQuiz(lessonId) {
    const query = `
      SELECT q.*,
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count
      FROM quizzes q
      WHERE q.lesson_id = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [lessonId]);
    return result.rows[0] || null;
  }

  static async getAllQuizzes(filters) {
    let query = `
      SELECT q.*,
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count
      FROM quizzes q
      WHERE 1=1
    `;
    const params = [];
    const paramCount = 1;

    if (filters.lessonId) {
      query += ` AND q.lesson_id = $${paramCount}`;
      params.push(filters.lessonId);
    }

    if (filters.courseId) {
      query += `
        AND q.lesson_id IN (
          SELECT id FROM lessons WHERE course_id = $${paramCount + params.length}
        )
      `;
      params.push(filters.courseId);
    }

    if (filters.educatorId) {
      query += `
        AND q.lesson_id IN (
          SELECT l.id FROM lessons l
          JOIN courses c ON l.course_id = c.id
          WHERE c.educator_id = $${paramCount + params.length}
        )
      `;
      params.push(filters.educatorId);
    }

    query += ' ORDER BY q.created_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async updateQuiz(quizId, quizData, userId, userRole) {
    const quiz = await this.getQuiz(quizId);
    const lesson = await Lesson.findById(quiz.lesson_id);
    const course = await Course.findById(lesson.course_id);

    if (userRole === 'educator' && course.educator_id !== userId) {
      throw new ForbiddenError('You can only update your own quizzes');
    }

    const { title, description, passingScore, timeLimitMinutes, shuffleQuestions, questions } = quizData;
    
    const query = `
      UPDATE quizzes
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        passing_score = COALESCE($3, passing_score),
        time_limit_minutes = COALESCE($4, time_limit_minutes),
        shuffle_questions = COALESCE($5, shuffle_questions),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const result = await pool.query(query, [
      title,
      description,
      passingScore,
      timeLimitMinutes,
      shuffleQuestions,
      quizId,
    ]);

    // If questions are provided, update them
    if (Array.isArray(questions) && questions.length > 0) {
      // Delete existing questions
      await pool.query('DELETE FROM quiz_questions WHERE quiz_id = $1', [quizId]);

      // Create new questions
      for (let order = 0; order < questions.length; order++) {
        const q = questions[order];
        const questionId = q.id || uuidv4();
        const questionQuery = `
          INSERT INTO quiz_questions (id, quiz_id, question_text, question_type, options, correct_answer, points, question_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `;
        
        await pool.query(questionQuery, [
          questionId,
          quizId,
          q.questionText || q.question_text,
          q.questionType || q.question_type || 'multiple_choice',
          q.options ? JSON.stringify(q.options) : null,
          q.correctAnswer || q.correct_answer,
          q.points || 1,
          order + 1,
        ]);
      }

      // Update question count
      await pool.query(
        'UPDATE quizzes SET question_count = $1 WHERE id = $2',
        [questions.length, quizId]
      );
    }

    return result.rows[0];
  }

  static async deleteQuiz(quizId, userId, userRole) {
    const quiz = await this.getQuiz(quizId);
    const lesson = await Lesson.findById(quiz.lesson_id);
    const course = await Course.findById(lesson.course_id);

    if (userRole === 'educator' && course.educator_id !== userId) {
      throw new ForbiddenError('You can only delete your own quizzes');
    }

    const query = 'DELETE FROM quizzes WHERE id = $1';
    await pool.query(query, [quizId]);
  }

  // ===== QUIZ QUESTIONS =====

  static async createQuizQuestion(questionData, userId, userRole) {
    const { quizId, questionText, questionType, options, correctAnswer, points } = questionData;

    // Verify quiz exists and user has permission
    const quiz = await this.getQuiz(quizId);
    const lesson = await Lesson.findById(quiz.lesson_id);
    const course = await Course.findById(lesson.course_id);

    if (userRole === 'educator' && course.educator_id !== userId) {
      throw new ForbiddenError('You can only add questions to your own quizzes');
    }

    if (!['multiple_choice', 'true_false', 'short_answer', 'essay'].includes(questionType)) {
      throw new ValidationError('Invalid question type');
    }

    const questionId = uuidv4();
    const query = `
      INSERT INTO quiz_questions (id, quiz_id, question_text, question_type, options, correct_answer, points, question_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    // Get next order
    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(question_order), 0) + 1 as next_order FROM quiz_questions WHERE quiz_id = $1',
      [quizId]
    );
    const nextOrder = orderResult.rows[0].next_order;

    const result = await pool.query(query, [
      questionId,
      quizId,
      questionText,
      questionType,
      options ? JSON.stringify(options) : null,
      correctAnswer,
      points || 1,
      nextOrder,
    ]);

    // Update question count in quiz
    await pool.query(
      'UPDATE quizzes SET question_count = question_count + 1 WHERE id = $1',
      [quizId]
    );

    return result.rows[0];
  }

  static async updateQuizQuestion(questionId, questionData, userId, userRole) {
    // Get question and verify permissions
    const getQuery = 'SELECT * FROM quiz_questions WHERE id = $1';
    const questionResult = await pool.query(getQuery, [questionId]);
    
    if (questionResult.rows.length === 0) {
      throw new NotFoundError('Question not found');
    }

    const question = questionResult.rows[0];
    const quiz = await this.getQuiz(question.quiz_id);
    const lesson = await Lesson.findById(quiz.lesson_id);
    const course = await Course.findById(lesson.course_id);

    if (userRole === 'educator' && course.educator_id !== userId) {
      throw new ForbiddenError('You can only update questions in your own quizzes');
    }

    const { questionText, questionType, options, correctAnswer, points } = questionData;
    
    const updateQuery = `
      UPDATE quiz_questions
      SET
        question_text = COALESCE($1, question_text),
        question_type = COALESCE($2, question_type),
        options = COALESCE($3, options),
        correct_answer = COALESCE($4, correct_answer),
        points = COALESCE($5, points),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      questionText,
      questionType,
      options ? JSON.stringify(options) : null,
      correctAnswer,
      points,
      questionId,
    ]);

    return result.rows[0];
  }

  static async deleteQuizQuestion(questionId, userId, userRole) {
    const getQuery = 'SELECT * FROM quiz_questions WHERE id = $1';
    const questionResult = await pool.query(getQuery, [questionId]);
    
    if (questionResult.rows.length === 0) {
      throw new NotFoundError('Question not found');
    }

    const question = questionResult.rows[0];
    const quiz = await this.getQuiz(question.quiz_id);
    const lesson = await Lesson.findById(quiz.lesson_id);
    const course = await Course.findById(lesson.course_id);

    if (userRole === 'educator' && course.educator_id !== userId) {
      throw new ForbiddenError('You can only delete questions from your own quizzes');
    }

    const deleteQuery = 'DELETE FROM quiz_questions WHERE id = $1';
    await pool.query(deleteQuery, [questionId]);

    // Update question count
    await pool.query(
      'UPDATE quizzes SET question_count = question_count - 1 WHERE id = $1',
      [question.quiz_id]
    );
  }

  static async getQuizQuestions(quizId) {
    const query = `
      SELECT * FROM quiz_questions
      WHERE quiz_id = $1
      ORDER BY question_order ASC
    `;
    const result = await pool.query(query, [quizId]);
    return result.rows;
  }

  // ===== QUIZ ATTEMPTS =====

  static async submitQuizAttempt(quizId, attemptData, studentId) {
    const { answers, timeTakenSeconds } = attemptData;

    const quiz = await this.getQuiz(quizId);
    const questions = await this.getQuizQuestions(quizId);

    // Calculate score
    let score = 0;
    let maxScore = 0;
    const answerDetails = [];

    for (const question of questions) {
      maxScore += question.points;
      const studentAnswer = answers[question.id];
      let isCorrect = false;

      if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        isCorrect = studentAnswer === question.correct_answer;
        if (isCorrect) {
          score += question.points;
        }
      } else if (question.question_type === 'short_answer') {
        // Simple string comparison (can be improved with fuzzy matching)
        isCorrect = studentAnswer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
        if (isCorrect) {
          score += question.points;
        }
      }
      // For essays, instructor must manually grade

      answerDetails.push({
        questionId: question.id,
        studentAnswer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
      });
    }

    const percentageScore = (score / maxScore) * 100;
    const passed = percentageScore >= quiz.passing_score;
    const attemptId = uuidv4();

    const query = `
      INSERT INTO quiz_attempts 
      (id, quiz_id, student_id, score, max_score, percentage_score, time_taken_seconds, passed, answers, attempt_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, (
        SELECT COALESCE(MAX(attempt_number), 0) + 1 FROM quiz_attempts WHERE quiz_id = $2 AND student_id = $3
      ))
      RETURNING *
    `;

    const result = await pool.query(query, [
      attemptId,
      quizId,
      studentId,
      score,
      maxScore,
      Math.round(percentageScore),
      timeTakenSeconds,
      passed,
      JSON.stringify(answerDetails),
    ]);

    // Update lesson progress with quiz score
    const lesson = await Lesson.findById(quiz.lesson_id);
    await pool.query(
      `UPDATE progress 
       SET quiz_score = $1 
       WHERE user_id = $2 AND lesson_id = $3`,
      [Math.round(percentageScore), studentId, lesson.id]
    );

    return result.rows[0];
  }

  static async getQuizAttempts(quizId, studentId) {
    const query = `
      SELECT * FROM quiz_attempts
      WHERE quiz_id = $1 AND student_id = $2
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [quizId, studentId]);
    return result.rows;
  }

  static async getQuizAttempt(attemptId, studentId) {
    const query = `
      SELECT * FROM quiz_attempts
      WHERE id = $1 AND student_id = $2
    `;
    const result = await pool.query(query, [attemptId, studentId]);
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Quiz attempt not found');
    }

    return result.rows[0];
  }

  static async getStudentQuizPerformance(courseId, studentId) {
    const query = `
      SELECT 
        q.id,
        q.title,
        l.id as lesson_id,
        l.title as lesson_title,
        qa.score,
        qa.max_score,
        qa.percentage_score,
        qa.passed,
        qa.created_at as attempt_date,
        COUNT(*) OVER (PARTITION BY q.id) as total_attempts
      FROM quizzes q
      JOIN lessons l ON q.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = $1
      WHERE c.id = $2
      ORDER BY l.lesson_order, qa.created_at DESC
    `;
    
    const result = await pool.query(query, [studentId, courseId]);
    return result.rows;
  }

  // ===== EDUCATOR ANALYTICS =====

  static async getCourseQuizzesAnalytics(courseId, userId, userRole) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (userRole === 'educator' && course.educator_id !== userId) {
      throw new ForbiddenError('You can only view analytics for your own courses');
    }

    const query = `
      SELECT 
        q.id,
        q.title,
        l.title as lesson_title,
        COUNT(DISTINCT qa.student_id) as student_attempts,
        ROUND(AVG(qa.percentage_score)) as avg_score,
        COUNT(CASE WHEN qa.passed = true THEN 1 END) as students_passed,
        COUNT(CASE WHEN qa.passed = false THEN 1 END) as students_failed
      FROM quizzes q
      JOIN lessons l ON q.lesson_id = l.id
      LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
      WHERE l.course_id = $1
      GROUP BY q.id, q.title, l.title
      ORDER BY l.lesson_order, q.created_at
    `;

    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async getQuizResults(quizId, userId, userRole) {
    const quiz = await this.getQuiz(quizId);
    const lesson = await Lesson.findById(quiz.lesson_id);
    const course = await Course.findById(lesson.course_id);

    if (userRole === 'educator' && course.educator_id !== userId) {
      throw new ForbiddenError('You can only view results for your own quizzes');
    }

    const query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        qa.score,
        qa.max_score,
        qa.percentage_score,
        qa.passed,
        qa.time_taken_seconds,
        qa.attempt_number,
        qa.created_at
      FROM quiz_attempts qa
      JOIN users u ON qa.student_id = u.id
      WHERE qa.quiz_id = $1
      ORDER BY qa.attempt_number DESC, qa.created_at DESC
    `;

    const result = await pool.query(query, [quizId]);
    return result.rows;
  }
}

export default QuizService;
