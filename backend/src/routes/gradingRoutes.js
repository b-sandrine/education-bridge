import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as gradingController from '../controllers/gradingController.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Essay grading routes
router.get('/essays/:quizId', authorize('educator', 'admin'), gradingController.getEssayResponses);
router.post('/grade/:responseId', authorize('educator', 'admin'), gradingController.gradeResponse);

// Quiz analytics routes
router.get('/quiz-stats/:quizId', authorize('educator', 'admin'), gradingController.getQuizStatistics);
router.get('/question-analysis/:quizId', authorize('educator', 'admin'), gradingController.getQuestionAnalysis);

// Intervention routes
router.post('/interventions', authorize('educator', 'admin'), gradingController.flagStudentForIntervention);
router.get('/at-risk/:courseId', authorize('educator', 'admin'), gradingController.getAtRiskStudents);
router.post('/targeted-assignments', authorize('educator', 'admin'), gradingController.createTargetedAssignment);

// Class analytics routes
router.get('/class-progress/:courseId', authorize('educator', 'admin'), gradingController.getClassProgressOverview);

// Feedback routes
router.post('/feedback/:studentId', authorize('educator', 'admin'), gradingController.submitStudentFeedback);

export default router;
