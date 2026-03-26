import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

class Lesson {
  static async create(lessonData) {
    const id = uuidv4();
    const query = `
      INSERT INTO lessons (id, course_id, title, content, video_url, lesson_order, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [
      id,
      lessonData.courseId,
      lessonData.title,
      lessonData.content,
      lessonData.videoUrl || null,
      lessonData.lessonOrder || 1,
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM lessons WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCourseId(courseId) {
    const query = 'SELECT * FROM lessons WHERE course_id = $1 ORDER BY lesson_order ASC';
    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async update(id, lessonData) {
    const updates = [];
    const values = [id];
    let paramIndex = 2;

    if (lessonData.title) {
      updates.push(`title = $${paramIndex}`);
      values.push(lessonData.title);
      paramIndex++;
    }
    if (lessonData.content) {
      updates.push(`content = $${paramIndex}`);
      values.push(lessonData.content);
      paramIndex++;
    }
    if (lessonData.lessonOrder) {
      updates.push(`lesson_order = $${paramIndex}`);
      values.push(lessonData.lessonOrder);
      paramIndex++;
    }
    if (lessonData.videoUrl !== undefined) {
      updates.push(`video_url = $${paramIndex}`);
      values.push(lessonData.videoUrl);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = NOW()`);
    const query = `UPDATE lessons SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM lessons WHERE id = $1';
    await pool.query(query, [id]);
  }
}

export default Lesson;
