import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import pool from '../config/database.js';

class ContentService {
  static async createCourse(courseData) {
    const course = await Course.create(courseData);
    return course;
  }

  static async getCourse(id) {
    const course = await Course.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const lessons = await Lesson.findByCourseId(id);
    return {
      ...course,
      lessons,
    };
  }

  static async getAllCourses(filters) {
    const courses = await Course.findAll(filters);
    return courses;
  }

  static async updateCourse(id, courseData, requestingUserId, userRole) {
    const course = await Course.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Verify ownership: educators can only edit their own courses, admins can edit any
    if (userRole === 'educator' && course.educator_id !== requestingUserId) {
      throw new ForbiddenError('You can only edit your own courses');
    }

    const updatedCourse = await Course.update(id, courseData);
    return updatedCourse;
  }

  static async deleteCourse(id, requestingUserId, userRole) {
    const course = await Course.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Verify ownership: educators can only delete their own courses, admins can delete any
    if (userRole === 'educator' && course.educator_id !== requestingUserId) {
      throw new ForbiddenError('You can only delete your own courses');
    }

    await Course.delete(id);
  }

  static async createLesson(lessonData, requestingUserId, userRole) {
    // Verify that the course exists and the user is authorized to create lessons for it
    const course = await Course.findById(lessonData.courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (userRole === 'educator' && course.educator_id !== requestingUserId) {
      throw new ForbiddenError('You can only create lessons for your own courses');
    }

    const lesson = await Lesson.create(lessonData);
    return lesson;
  }

  static async getLesson(id) {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }
    return lesson;
  }

  static async getCourseLessons(courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const lessons = await Lesson.findByCourseId(courseId);
    return lessons;
  }

  static async updateLesson(id, lessonData, requestingUserId, userRole) {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    // Verify course ownership
    const course = await Course.findById(lesson.course_id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (userRole === 'educator' && course.educator_id !== requestingUserId) {
      throw new ForbiddenError('You can only edit lessons in your own courses');
    }

    const updatedLesson = await Lesson.update(id, lessonData);
    return updatedLesson;
  }

  static async deleteLesson(id, requestingUserId, userRole) {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    // Verify course ownership
    const course = await Course.findById(lesson.course_id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (userRole === 'educator' && course.educator_id !== requestingUserId) {
      throw new ForbiddenError('You can only delete lessons in your own courses');
    }

    await Lesson.delete(id);
  }

  // Enrollment methods
  static async enrollStudent(courseId, studentId) {
    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check if student is already enrolled
    const existingEnrollment = await pool.query(
      'SELECT * FROM progress WHERE user_id = $1 AND course_id = $2',
      [studentId, courseId]
    );

    if (existingEnrollment.rows.length > 0) {
      throw new Error('Student is already enrolled in this course');
    }

    // Create enrollment record
    const { v4: uuidv4 } = await import('uuid');
    const id = uuidv4();
    
    const query = `
      INSERT INTO progress (id, user_id, course_id, lessons_completed, score, status, created_at, updated_at)
      VALUES ($1, $2, $3, 0, 0, 'in_progress', NOW(), NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, studentId, courseId]);
    return result.rows[0];
  }

  static async removeStudent(courseId, studentId) {
    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Remove enrollment record
    const query = 'DELETE FROM progress WHERE user_id = $1 AND course_id = $2';
    const result = await pool.query(query, [studentId, courseId]);

    if (result.rowCount === 0) {
      throw new NotFoundError('Student enrollment not found');
    }
  }

  static async getCourseStudents(courseId) {
    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const query = `
      SELECT u.id, u.first_name, u.last_name, u.email, p.status, p.lessons_completed, p.score
      FROM users u
      INNER JOIN progress p ON u.id = p.user_id
      WHERE p.course_id = $1
      ORDER BY u.first_name, u.last_name
    `;

    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async getUnenrolledStudents(courseId) {
    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const query = `
      SELECT u.id, u.first_name, u.last_name, u.email
      FROM users u
      WHERE u.role = 'student'
      AND u.id NOT IN (
        SELECT user_id FROM progress WHERE course_id = $1
      )
      ORDER BY u.first_name, u.last_name
    `;

    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async getEnrollmentStats() {
    const query = `
      SELECT 
        COUNT(DISTINCT p.course_id) as total_enrollments,
        COUNT(DISTINCT p.user_id) as unique_students,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_enrollments
      FROM progress p
    `;

    const result = await pool.query(query);
    return result.rows[0] || {
      total_enrollments: 0,
      unique_students: 0,
      completed_enrollments: 0
    };
  }
}

export default ContentService;
