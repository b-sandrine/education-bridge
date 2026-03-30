import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

class GamificationService {
  // Badge Types
  static BADGE_TYPES = {
    FIRST_LESSON: { id: 'first_lesson', name: 'First Steps', icon: '🚀' },
    FIVE_LESSONS: { id: 'five_lessons', name: 'Getting Started', icon: '📚' },
    TEN_LESSONS: { id: 'ten_lessons', name: 'Problem Solver', icon: '💪' },
    COMPLETE_COURSE: { id: 'complete_course', name: 'Course Master', icon: '🏆' },
    PERFECT_QUIZ: { id: 'perfect_quiz', name: 'Perfect Score', icon: '⭐' },
    SEVEN_DAY_STREAK: { id: 'seven_day_streak', name: '7-Day Streak', icon: '🔥' },
    THIRTY_DAY_STREAK: { id: 'thirty_day_streak', name: 'Learning Machine', icon: '🤖' },
    HELPFUL_QUESTIONS: { id: 'helpful_questions', name: 'Curious Mind', icon: '🧠' },
    TOP_PERFORMER: { id: 'top_performer', name: 'Top Performer', icon: '👑' },
  };

  // Check and award badges
  static async checkAndAwardBadges(studentId, context = {}) {
    const awardedBadges = [];

    try {
      // Check for first lesson
      if (context.lessonsCompleted === 1) {
        const badge = await this.awardBadge(studentId, 'first_lesson');
        if (badge) awardedBadges.push(badge);
      }

      // Check for 5 lessons
      if (context.lessonsCompleted === 5) {
        const badge = await this.awardBadge(studentId, 'five_lessons');
        if (badge) awardedBadges.push(badge);
      }

      // Check for 10 lessons
      if (context.lessonsCompleted === 10) {
        const badge = await this.awardBadge(studentId, 'ten_lessons');
        if (badge) awardedBadges.push(badge);
      }

      // Check for perfect quiz score
      if (context.quizScore === 100) {
        const badge = await this.awardBadge(studentId, 'perfect_quiz');
        if (badge) awardedBadges.push(badge);
      }

      // Check for course completion
      if (context.courseCompleted) {
        const badge = await this.awardBadge(studentId, 'complete_course');
        if (badge) awardedBadges.push(badge);
      }

      // Check for streaks
      const currentStreak = await this.getCurrentStreak(studentId);
      if (currentStreak === 7) {
        const badge = await this.awardBadge(studentId, 'seven_day_streak');
        if (badge) awardedBadges.push(badge);
      }
      if (currentStreak === 30) {
        const badge = await this.awardBadge(studentId, 'thirty_day_streak');
        if (badge) awardedBadges.push(badge);
      }

      return awardedBadges;
    } catch (error) {
      console.error('Error awarding badges:', error);
      return [];
    }
  }

  static async awardBadge(studentId, badgeId) {
    // Check if already awarded
    const checkQuery = `
      SELECT * FROM student_achievements 
      WHERE student_id = $1 AND badge_type = $2
    `;
    const checkResult = await pool.query(checkQuery, [studentId, badgeId]);

    if (checkResult.rows.length > 0) {
      return null; // Already awarded
    }

    const achievementId = uuidv4();
    const query = `
      INSERT INTO student_achievements (id, student_id, badge_type, earned_at, points_awarded)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [achievementId, studentId, badgeId, 10]);
    return result.rows[0];
  }

  // Streak Management
  static async updateStreak(studentId) {
    const today = new Date().toISOString().split('T')[0];

    // Get last activity date
    const lastActivityQuery = `
      SELECT DATE(updated_at) as last_activity_date
      FROM progress
      WHERE user_id = $1
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    const lastActivityResult = await pool.query(lastActivityQuery, [studentId]);
    const lastActivityDate = lastActivityResult.rows[0]?.last_activity_date;

    // Get current streak
    const streakQuery = `
      SELECT current_streak, last_activity_date
      FROM student_streaks
      WHERE student_id = $1
    `;

    const streakResult = await pool.query(streakQuery, [studentId]);
    let currentStreak = streakResult.rows[0]?.current_streak || 0;
    const lastStreakDate = streakResult.rows[0]?.last_activity_date;

    const lastDate = lastStreakDate ? new Date(lastStreakDate) : null;
    const todayDate = new Date(today);
    const yesterday = new Date(todayDate);
    yesterday.setDate(yesterday.getDate() - 1);

    // Determine streak
    if (lastDate) {
      const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      if (daysDiff === 0) {
        // Same day, streak continues
        // Do nothing
      } else if (daysDiff === 1) {
        // Next day, continue streak
        currentStreak += 1;
      } else {
        // Break in streak
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    // Update or insert streak
    const upsertQuery = `
      INSERT INTO student_streaks (student_id, current_streak, last_activity_date)
      VALUES ($1, $2, $3)
      ON CONFLICT (student_id) DO UPDATE
      SET current_streak = $2, last_activity_date = $3
      RETURNING *
    `;

    const result = await pool.query(upsertQuery, [studentId, currentStreak, today]);
    return result.rows[0];
  }

  static async getCurrentStreak(studentId) {
    const query = `
      SELECT current_streak FROM student_streaks WHERE student_id = $1
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows[0]?.current_streak || 0;
  }

  // Points System
  static async addPoints(studentId, points, reason) {
    const query = `
      INSERT INTO student_points (id, student_id, points, reason)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [uuidv4(), studentId, points, reason]);
    return result.rows[0];
  }

  static async getStudentPoints(studentId) {
    const query = `
      SELECT COALESCE(SUM(points), 0) as total_points
      FROM student_points
      WHERE student_id = $1
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows[0].total_points;
  }

  // Leaderboard
  static async getLeaderboard(courseId, limit = 10) {
    const query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        COALESCE(SUM(sp.points), 0) as total_points,
        COUNT(DISTINCT sa.id) as badge_count,
        AVG(qa.percentage_score) as avg_score,
        ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(sp.points), 0) DESC) as rank
      FROM users u
      LEFT JOIN progress p ON u.id = p.user_id
      LEFT JOIN student_points sp ON u.id = sp.student_id
      LEFT JOIN student_achievements sa ON u.id = sa.student_id
      LEFT JOIN quizzes q ON p.course_id = $1
      LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND u.id = qa.student_id
      WHERE p.course_id = $1 AND u.role = 'student'
      GROUP BY u.id, u.first_name, u.last_name, u.email
      ORDER BY total_points DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [courseId, limit]);
    return result.rows;
  }

  // Get student achievements
  static async getStudentAchievements(studentId) {
    const query = `
      SELECT sa.*, u.first_name, u.last_name
      FROM student_achievements sa
      JOIN users u ON sa.student_id = u.id
      WHERE sa.student_id = $1
      ORDER BY sa.earned_at DESC
    `;

    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  // Get gamification stats
  static async getGamificationStats(studentId) {
    try {
      const [pointsResult, streakResult, achievementsResult] = await Promise.all([
        pool.query(`SELECT COALESCE(SUM(points), 0) as total_points FROM student_points WHERE student_id = $1`, [studentId]),
        pool.query(`SELECT current_streak FROM student_streaks WHERE student_id = $1`, [studentId]),
        pool.query(`SELECT COUNT(*) as badge_count FROM student_achievements WHERE student_id = $1`, [studentId]),
      ]);

      return {
        totalPoints: parseInt(pointsResult.rows[0].total_points),
        currentStreak: streakResult.rows[0]?.current_streak || 0,
        badgeCount: parseInt(achievementsResult.rows[0].badge_count),
      };
    } catch (error) {
      console.error('Error fetching gamification stats:', error);
      return { totalPoints: 0, currentStreak: 0, badgeCount: 0 };
    }
  }
}

export default GamificationService;
