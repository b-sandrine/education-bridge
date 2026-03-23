import Progress from '../models/Progress.js';
import Course from '../models/Course.js';
import { NotFoundError } from '../utils/errors.js';

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

    return progress;
  }

  static async getUserProgress(userId) {
    const progressList = await Progress.findByUserId(userId);
    return progressList;
  }

  static async getCourseProgress(userId, courseId) {
    const progress = await Progress.findByUserAndCourse(userId, courseId);
    if (!progress) {
      throw new NotFoundError('Progress not found');
    }
    return progress;
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
}

export default ProgressService;
