import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

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
}

export default ContentService;
