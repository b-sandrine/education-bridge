import express from 'express';
import * as progressController from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/courses/:courseId/start', authenticate, progressController.startCourse);
router.put('/courses/:courseId/update', authenticate, progressController.updateProgress);
router.get('/progress', authenticate, progressController.getUserProgress);
router.get('/courses/:courseId/progress', authenticate, progressController.getCourseProgress);
router.post('/courses/:courseId/complete', authenticate, progressController.completeCourse);

// Educator endpoints for tracking student progress
router.get('/educator/courses/:courseId/students', authenticate, authorize('educator', 'admin'), progressController.getStudentsInCourse);
router.get('/educator/courses/:courseId/students/:studentId', authenticate, authorize('educator', 'admin'), progressController.getStudentCourseProgress);
router.get('/educator/courses/:courseId/analytics', authenticate, authorize('educator', 'admin'), progressController.getCourseAnalytics);

export default router;
