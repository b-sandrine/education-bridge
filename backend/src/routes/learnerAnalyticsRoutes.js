import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as learnerAnalyticsController from '../controllers/learnerAnalyticsController.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Student analytics routes
router.get('/weak-areas/:courseId', authorize('student'), learnerAnalyticsController.getWeakAreas);
router.get('/topic-mastery/:courseId', authorize('student'), learnerAnalyticsController.getTopicMastery);
router.get('/learning-patterns/:courseId', authorize('student'), learnerAnalyticsController.getLearningPatterns);
router.get('/recommendations/:courseId', authorize('student'), learnerAnalyticsController.getRecommendations);
router.get('/exam-readiness/:courseId', authorize('student'), learnerAnalyticsController.getExamReadiness);
router.get('/adaptive-difficulty/:courseId', authorize('student'), learnerAnalyticsController.getAdaptiveDifficulty);
router.get('/learning-velocity/:courseId', authorize('student'), learnerAnalyticsController.getLearningVelocity);

export default router;
