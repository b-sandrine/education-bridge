import Progress from '../models/Progress.js';
import Course from '../models/Course.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

class ProgressService {
  static async startCourse(userId, courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    let progress = await Progress.findByUserAndCourse(userId, courseId);
    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        lessonsCompleted: 0,
        score: 0,
        status: 'in_progress',
      });
    }

    return progress;
  }

  static async updateProgress(userId, courseId, lessonsCompleted, score) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Validate lessons_completed is not greater than total lessons
    const totalLessons = course.lessons?.length || 0;
    if (lessonsCompleted > totalLessons) {
      throw new Error(`lessons_completed (${lessonsCompleted}) cannot exceed total lessons (${totalLessons})`);
    }

    let progress = await Progress.findByUserAndCourse(userId, courseId);
    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        lessonsCompleted,
        score,
        status: 'in_progress',
      });
    } else {
      progress = await Progress.update(progress.id, {
        lessonsCompleted,
        score,
      });
    }

    // Auto-complete course if all lessons are completed
    if (lessonsCompleted >= totalLessons && progress.status !== 'completed') {
      progress = await Progress.update(progress.id, {
        status: 'completed',
      });
    }

    return progress;
  }

  static async getUserProgress(userId) {
    const progressList = await Progress.findByUserId(userId);
    return progressList;
  }

  static async getCourseProgress(userId, courseId) {
    const progress = await Progress.findByUserAndCourse(userId, courseId);
    // Return null if no progress found - this is not an error, just means user hasn't started the course
    return progress || null;
  }

  static async completeCourse(userId, courseId) {
    let progress = await Progress.findByUserAndCourse(userId, courseId);
    if (!progress) {
      throw new NotFoundError('Progress not found');
    }

    progress = await Progress.update(progress.id, {
      status: 'completed',
    });

    return progress;
  }

  // Complete a lesson and auto-complete course if all lessons done
  static async completeLessonAndCheckCourse(userId, courseId, lessonId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    let progress = await Progress.findByUserAndCourse(userId, courseId);
    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        lessonsCompleted: 1,
        score: 0,
        status: 'in_progress',
      });
    } else if (progress.lessons_completed < (course.lessons?.length || 0)) {
      // Only increment if we haven't reached the max
      progress = await Progress.update(progress.id, {
        lessonsCompleted: progress.lessons_completed + 1,
      });
    }

    // Auto-complete course if all lessons are now completed
    const totalLessons = course.lessons?.length || 0;
    if (progress && progress.lessons_completed >= totalLessons && progress.status !== 'completed') {
      progress = await Progress.update(progress.id, {
        status: 'completed',
      });
    }

    return progress;
  }

  // Educator progress tracking - get all students in a course
  static async getStudentsInCourse(courseId, requestingUserId, userRole) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Authorization: only educator who created the course or admin can view
    if (userRole === 'educator' && course.educator_id !== requestingUserId) {
      throw new ForbiddenError('You can only view students in your own courses');
    }

    // Get all students enrolled in this course
    const studentsProgress = await Progress.findByCourseId(courseId);
    return studentsProgress;
  }

  // Educator progress tracking - get specific student's progress in a course
  static async getStudentCourseProgress(courseId, studentId, requestingUserId, userRole) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Authorization: only educator who created the course or admin can view
    if (userRole === 'educator' && course.educator_id !== requestingUserId) {
      throw new ForbiddenError('You can only view students in your own courses');
    }

    const progress = await Progress.findByUserAndCourse(studentId, courseId);
    return progress || null;
  }

  // Educator analytics - get course progress statistics
  static async getCourseAnalytics(courseId, requestingUserId, userRole) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Authorization: only educator who created the course or admin can view
    if (userRole === 'educator' && course.educator_id !== requestingUserId) {
      throw new ForbiddenError('You can only view analytics for your own courses');
    }

    const studentsProgress = await Progress.findByCourseId(courseId);
    
    // Calculate analytics
    const totalStudents = studentsProgress.length;
    const completedStudents = studentsProgress.filter((p) => p.status === 'completed').length;
    const averageProgress = totalStudents > 0
      ? Math.round((studentsProgress.reduce((sum, p) => sum + (p.lessons_completed || 0), 0) / totalStudents) * 100) / 100
      : 0;
    const averageScore = totalStudents > 0
      ? Math.round((studentsProgress.reduce((sum, p) => sum + (p.score || 0), 0) / totalStudents) * 100) / 100
      : 0;

    return {
      courseId,
      courseName: course.title,
      totalStudents,
      completedStudents,
      inProgressStudents: totalStudents - completedStudents,
      completionRate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
      averageProgress,
      averageScore,
      studentsProgress,
    };
  }
}

export default ProgressService;
