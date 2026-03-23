import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

class Course {
  static async create(courseData) {
    const id = uuidv4();
    const query = `
      INSERT INTO courses (id, title, description, category, level, content, duration_weeks, educator_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [
      id,
      courseData.title,
      courseData.description,
      courseData.category,
      courseData.level || 'beginner',
      courseData.content,
      courseData.durationWeeks,
      courseData.educatorId,
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM courses WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM courses WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.category) {
      query += ` AND category = $${paramIndex}`;
      values.push(filters.category);
      paramIndex++;
    }
    if (filters.level) {
      query += ` AND level = $${paramIndex}`;
      values.push(filters.level);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, courseData) {
    const updates = [];
    const values = [id];
    let paramIndex = 2;

    if (courseData.title) {
      updates.push(`title = $${paramIndex}`);
      values.push(courseData.title);
      paramIndex++;
    }
    if (courseData.description) {
      updates.push(`description = $${paramIndex}`);
      values.push(courseData.description);
      paramIndex++;
    }
    if (courseData.content) {
      updates.push(`content = $${paramIndex}`);
      values.push(courseData.content);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = NOW()`);
    const query = `UPDATE courses SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM courses WHERE id = $1';
    await pool.query(query, [id]);
  }
}

export default Course;
