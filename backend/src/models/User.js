import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';
import pool from '../config/database.js';

class User {
  static async create(userData) {
    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    const id = uuidv4();
    const query = `
      INSERT INTO users (id, first_name, last_name, email, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [
      id,
      userData.firstName,
      userData.lastName,
      userData.email,
      hashedPassword,
      userData.role || 'student',
    ]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(role = null) {
    let query = 'SELECT * FROM users WHERE 1=1';
    const values = [];
    if (role) {
      query += ' AND role = $1';
      values.push(role);
    }
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, userData) {
    const updates = [];
    const values = [id];
    let paramIndex = 2;

    if (userData.firstName) {
      updates.push(`first_name = $${paramIndex}`);
      values.push(userData.firstName);
      paramIndex++;
    }
    if (userData.lastName) {
      updates.push(`last_name = $${paramIndex}`);
      values.push(userData.lastName);
      paramIndex++;
    }
    if (userData.role) {
      updates.push(`role = $${paramIndex}`);
      values.push(userData.role);
      paramIndex++;
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = NOW()`);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcryptjs.compare(plainPassword, hashedPassword);
  }
}

export default User;
