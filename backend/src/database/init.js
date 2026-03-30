import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const initializeDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schema);
    console.log('Database schema initialized successfully');

    // Run migrations for missing columns
    await runMigrations();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

const runMigrations = async () => {
  try {
    // Add missing columns to quizzes table if they don't exist
    const migrations = [
      `ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS shuffle_questions BOOLEAN DEFAULT false`,
      `ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS question_count INT DEFAULT 0`,
      `ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS percentage_score INT`,
    ];

    for (const migration of migrations) {
      try {
        await pool.query(migration);
      } catch (err) {
        // Column might already exist, continue
        if (err.code !== '42701') { // 42701 is "column already exists" error
          console.warn('Migration warning:', err.message);
        }
      }
    }
    console.log('Database migrations completed');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
};

export default pool;
