import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { NotFoundError } from '../utils/errors.js';

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

  static async updateCourse(id, courseData) {
    const course = await Course.update(id, courseData);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return course;
  }

  static async deleteCourse(id) {
    await Course.delete(id);
  }

  static async createLesson(lessonData) {
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

  static async updateLesson(id, lessonData) {
    const lesson = await Lesson.update(id, lessonData);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }
    return lesson;
  }

  static async deleteLesson(id) {
    await Lesson.delete(id);
  }
}

export default ContentService;
