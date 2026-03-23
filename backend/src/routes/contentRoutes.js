import express from 'express';
import * as contentController from '../controllers/contentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { courseSchema, lessonSchema } from '../utils/validators.js';

const router = express.Router();

// Course routes
router.post(
  '/courses',
  authenticate,
  authorize('educator', 'admin'),
  validateRequest(courseSchema),
  contentController.createCourse
);
router.get('/courses', contentController.getAllCourses);
router.get('/courses/:id', contentController.getCourse);
router.put(
  '/courses/:id',
  authenticate,
  authorize('educator', 'admin'),
  contentController.updateCourse
);
router.delete(
  '/courses/:id',
  authenticate,
  authorize('educator', 'admin'),
  contentController.deleteCourse
);

// Lesson routes
router.post(
  '/lessons',
  authenticate,
  authorize('educator', 'admin'),
  validateRequest(lessonSchema),
  contentController.createLesson
);
router.get('/lessons/:id', contentController.getLesson);
router.get('/courses/:courseId/lessons', contentController.getCourseLessons);
router.put(
  '/lessons/:id',
  authenticate,
  authorize('educator', 'admin'),
  contentController.updateLesson
);
router.delete(
  '/lessons/:id',
  authenticate,
  authorize('educator', 'admin'),
  contentController.deleteLesson
);

export default router;
