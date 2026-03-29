import pool from '../config/database.js';

class LearnerAnalyticsService {
  // Detect weak areas based on quiz performance
  static async detectWeakAreas(studentId, courseId) {
    const query = `
      SELECT 
        qq.question_text,
        qt.question_type,
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN qa.passed = false THEN 1 END) as failed_attempts,
        ROUND((COUNT(CASE WHEN qa.passed = false THEN 1 END)::float / COUNT(*)) * 100) as failure_rate,
        l.title as lesson_title,
        l.id as lesson_id,
        l.course_id
      FROM quiz_questions qq
      JOIN quizzes q ON qq.quiz_id = q.id
      JOIN lessons l ON q.lesson_id = l.id
      JOIN quiz_attempts qa ON q.id = qa.quiz_id
      WHERE qa.student_id = $1 
        AND l.course_id = $2
        AND qa.percentage_score < 70
      GROUP BY qq.id, qq.question_text, qt.question_type, l.title, l.id, l.course_id
      ORDER BY failure_rate DESC
      LIMIT 10
    `;

    const result = await pool.query(query, [studentId, courseId]);
    return result.rows.map((row) => ({
      ...row,
      strength: row.failure_rate < 30 ? 'medium' : row.failure_rate < 60 ? 'weak' : 'critical',
    }));
  }

  // Topic mastery levels
  static async getTopicMastery(studentId, courseId) {
    const topicsQuery = `
      SELECT DISTINCT
        l.category as topic,
        COUNT(DISTINCT qa.quiz_id) as quizzes_taken,
        ROUND(AVG(qa.percentage_score)) as avg_score,
        COUNT(CASE WHEN qa.passed = true THEN 1 END) as quizzes_passed,
        COUNT(CASE WHEN qa.passed = false THEN 1 END) as quizzes_failed,
        CASE 
          WHEN AVG(qa.percentage_score) >= 80 THEN 'Mastery'
          WHEN AVG(qa.percentage_score) >= 60 THEN 'Developing'
          WHEN AVG(qa.percentage_score) >= 40 THEN 'Beginning'
          ELSE 'Foundation'
        END as mastery_level,
        ROUND((COUNT(CASE WHEN qa.passed = true THEN 1 END)::float / COUNT(*)) * 100) as pass_rate
      FROM lessons l
      JOIN quizzes q ON l.id = q.lesson_id
      JOIN quiz_attempts qa ON q.id = qa.quiz_id
      WHERE qa.student_id = $1 AND l.course_id = $2
      GROUP BY l.category
      ORDER BY avg_score DESC
    `;

    const result = await pool.query(topicsQuery, [studentId, courseId]);
    return result.rows;
  }

  // Learning patterns
  static async getLearningPatterns(studentId, courseId) {
    const query = `
      SELECT 
        DATE(p.updated_at) as study_date,
        COUNT(DISTINCT p.lesson_id) as lessons_studied,
        AVG(p.time_spent_seconds) as avg_time_per_lesson,
        ROUND(AVG(qa.percentage_score)) as avg_quiz_score,
        SUM(sp.points) as points_earned
      FROM progress p
      LEFT JOIN quiz_attempts qa ON p.user_id = qa.student_id
      LEFT JOIN student_points sp ON p.user_id = sp.student_id
      WHERE p.user_id = $1 AND p.course_id = $2
      GROUP BY DATE(p.updated_at)
      ORDER BY study_date DESC
      LIMIT 30
    `;

    const result = await pool.query(query, [studentId, courseId]);
    return result.rows;
  }

  // Generate learning recommendations
  static async generateRecommendations(studentId, courseId) {
    const [weakAreas, topicMastery, patterns] = await Promise.all([
      this.detectWeakAreas(studentId, courseId),
      this.getTopicMastery(studentId, courseId),
      this.getLearningPatterns(studentId, courseId),
    ]);

    const recommendations = [];

    // Recommendation 1: Focus on weak areas
    const criticalTopics = topicMastery.filter((t) => t.mastery_level === 'Foundation' || t.mastery_level === 'Beginning');
    if (criticalTopics.length > 0) {
      recommendations.push({
        type: 'weak_area',
        priority: 'high',
        title: `Focus on ${criticalTopics[0].topic}`,
        description: `Your average score in ${criticalTopics[0].topic} is ${criticalTopics[0].avg_score}%. Try reviewing the lessons and taking practice quizzes.`,
        action: 'review_lessons',
        topic: criticalTopics[0].topic,
      });
    }

    // Recommendation 2: Consistency
    const avgDaysStudied = patterns.length > 7 ? patterns.slice(0, 7).length : patterns.length;
    if (avgDaysStudied < 5) {
      recommendations.push({
        type: 'consistency',
        priority: 'medium',
        title: 'Build a study habit',
        description: `You\'ve studied ${avgDaysStudied} days in the last week. Try to study consistently every day to improve faster.`,
        action: 'daily_reminder',
      });
    }

    // Recommendation 3: Practice more
    const recentAvgScore = patterns[0]?.avg_quiz_score || 0;
    if (recentAvgScore < 70) {
      recommendations.push({
        type: 'practice',
        priority: 'high',
        title: 'Take more practice quizzes',
        description: `Your recent quiz average is ${recentAvgScore}%. Take more quizzes to improve and solidify your understanding.`,
        action: 'take_quiz',
      });
    }

    // Recommendation 4: Exam readiness
    const masteredTopics = topicMastery.filter((t) => t.mastery_level === 'Mastery');
    if (masteredTopics.length > 0 && masteredTopics.length === topicMastery.length) {
      recommendations.push({
        type: 'exam_ready',
        priority: 'medium',
        title: 'You\'re ready for the exam!',
        description: 'You\'ve mastered all topics. Take a full practice exam to prepare for the real exam.',
        action: 'exam_simulation',
      });
    }

    return recommendations;
  }

  // Exam readiness score
  static async getExamReadinessScore(studentId, courseId) {
    const topicMastery = await this.getTopicMastery(studentId, courseId);
    
    if (topicMastery.length === 0) {
      return { score: 0, message: 'No data yet' };
    }

    const avgScore = topicMastery.reduce((sum, t) => sum + (t.avg_score || 0), 0) / topicMastery.length;
    const masteredCount = topicMastery.filter((t) => t.mastery_level === 'Mastery').length;
    const masteryPercentage = (masteredCount / topicMastery.length) * 100;

    const readinessScore = Math.round((avgScore * 0.6 + masteryPercentage * 0.4));

    let message = '';
    if (readinessScore >= 80) {
      message = 'Excellent! Ready for exam';
    } else if (readinessScore >= 60) {
      message = 'Good! More practice needed';
    } else if (readinessScore >= 40) {
      message = 'Fair! Focus on weak areas';
    } else {
      message = 'Needs improvement. Keep practicing';
    }

    return { score: readinessScore, message, masteredCount, totalTopics: topicMastery.length };
  }

  // Adaptive quiz difficulty
  static async getAdaptiveQuizDifficulty(studentId, courseId) {
    const recentQuizzes = await pool.query(`
      SELECT AVG(qa.percentage_score) as avg_score
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      JOIN lessons l ON q.lesson_id = l.id
      WHERE qa.student_id = $1 AND l.course_id = $2
      AND qa.created_at >= NOW() - INTERVAL '7 days'
    `, [studentId, courseId]);

    const avgScore = recentQuizzes.rows[0]?.avg_score || 50;

    let difficulty = 'medium';
    if (avgScore >= 80) {
      difficulty = 'hard';
    } else if (avgScore < 40) {
      difficulty = 'easy';
    }

    return difficulty;
  }

  // Get learning velocity (how fast student improves)
  static async getLearningVelocity(studentId, courseId) {
    const query = `
      SELECT 
        qa.created_at,
        qa.percentage_score,
        LAG(qa.percentage_score) OVER (ORDER BY qa.created_at) as prev_score
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      JOIN lessons l ON q.lesson_id = l.id
      WHERE qa.student_id = $1 AND l.course_id = $2
      ORDER BY qa.created_at DESC
      LIMIT 10
    `;

    const result = await pool.query(query, [studentId, courseId]);
    
    if (result.rows.length < 2) {
      return { velocity: 0, trend: 'insufficient_data' };
    }

    let improvements = 0;
    let declines = 0;

    for (let i = 1; i < result.rows.length; i++) {
      const diff = result.rows[i].percentage_score - result.rows[i].prev_score;
      if (diff > 0) improvements++;
      else if (diff < 0) declines++;
    }

    const velocity = improvements - declines;
    const trend = velocity > 0 ? 'improving' : velocity < 0 ? 'declining' : 'stable';

    return { velocity, trend, improvements, declines };
  }
}

export default LearnerAnalyticsService;
