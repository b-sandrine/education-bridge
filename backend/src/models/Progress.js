import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

class Progress {
  static async create(progressData) {
    const id = uuidv4();
    const query = `
      INSERT INTO progress (id, user_id, course_id, lessons_completed, score, status, completion_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [
      id,
      progressData.userId,
      progressData.courseId,
      progressData.lessonsCompleted || 0,
      progressData.score || 0,
      progressData.status || 'in_progress',
      progressData.status === 'completed' ? new Date() : null,
    ]);
    return result.rows[0];
  }

  static async findByUserAndCourse(userId, courseId) {
    const query = 'SELECT * FROM progress WHERE user_id = $1 AND course_id = $2';
    const result = await pool.query(query, [userId, courseId]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM progress WHERE user_id = $1 ORDER BY updated_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findByCourseId(courseId) {
    const query = `
      SELECT p.*, u.first_name, u.last_name, u.email 
      FROM progress p
      JOIN users u ON p.user_id = u.id
      WHERE p.course_id = $1
      ORDER BY u.first_name ASC
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async update(id, progressData) {
    const updates = [];
    const values = [id];
    let paramIndex = 2;

    if (progressData.lessonsCompleted !== undefined) {
      updates.push(`lessons_completed = $${paramIndex}`);
      values.push(progressData.lessonsCompleted);
      paramIndex++;
    }
    if (progressData.score !== undefined) {
      updates.push(`score = $${paramIndex}`);
      values.push(progressData.score);
      paramIndex++;
    }
    if (progressData.status) {
      updates.push(`status = $${paramIndex}`);
      values.push(progressData.status);
      paramIndex++;
      
      // Set completion_date when status changes to 'completed'
      if (progressData.status === 'completed') {
        updates.push(`completion_date = $${paramIndex}`);
        values.push(new Date());
        paramIndex++;
      }
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = NOW()`);
    const query = `UPDATE progress SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export default Progress;
