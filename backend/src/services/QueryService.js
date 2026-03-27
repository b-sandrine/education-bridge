import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

class QueryService {
  static async createQuery(queryData, studentId) {
    const id = uuidv4();
    const query = `
      INSERT INTO student_queries (id, student_id, subject, message, course_id, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, 'open', NOW(), NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      id,
      studentId,
      queryData.subject,
      queryData.message,
      queryData.courseId || null,
    ]);
    
    return result.rows[0];
  }

  static async getStudentQueries(studentId) {
    const query = `
      SELECT sq.*, u.first_name, u. last_name
      FROM student_queries sq
      LEFT JOIN users u ON sq.admin_id = u.id
      WHERE sq.student_id = $1
      ORDER BY sq.created_at DESC
    `;
    
    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  static async getAdminQueries(filters = {}) {
    let query = `
      SELECT sq.*, 
        u.first_name as student_first_name, u.last_name as student_last_name, u.email as student_email,
        a.first_name as admin_first_name, a.last_name as admin_last_name
      FROM student_queries sq
      INNER JOIN users u ON sq.student_id = u.id
      LEFT JOIN users a ON sq.admin_id = a.id
      WHERE 1=1
    `;
    
    const values = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND sq.status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }

    query += ' ORDER BY sq.created_at DESC';
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getQueryById(id) {
    const query = `
      SELECT sq.*, 
        u.first_name as student_first_name, u.last_name as student_last_name, u.email as student_email,
        a.first_name as admin_first_name, a.last_name as admin_last_name
      FROM student_queries sq
      INNER JOIN users u ON sq.student_id = u.id
      LEFT JOIN users a ON sq.admin_id = a.id
      WHERE sq.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Query not found');
    }
    
    return result.rows[0];
  }

  static async respondToQuery(id, adminId, response, status = 'resolved') {
    const query = `
      UPDATE student_queries 
      SET response = $1, admin_id = $2, status = $3, updated_at = NOW(), resolved_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    
    const result = await pool.query(query, [response, adminId, status, id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Query not found');
    }
    
    return result.rows[0];
  }

  static async updateQueryStatus(id, status) {
    const validStatuses = ['open', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const query = `
      UPDATE student_queries 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Query not found');
    }
    
    return result.rows[0];
  }

  static async deleteQuery(id, studentId) {
    const query = `
      DELETE FROM student_queries
      WHERE id = $1 AND student_id = $2
    `;
    
    const result = await pool.query(query, [id, studentId]);
    
    if (result.rowCount === 0) {
      throw new NotFoundError('Query not found or unauthorized');
    }
  }
}

export default QueryService;
