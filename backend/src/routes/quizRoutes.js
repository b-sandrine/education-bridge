import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as quizController from '../controllers/quizController.js';

const router = express.Router();

// Quiz Management (Educator/Admin)
router.post(
  '/quizzes',
  authenticate,
  authorize('educator', 'admin'),
  quizController.createQuiz
);

router.get('/quizzes', quizController.getAllQuizzes);

router.get('/quizzes/:id', quizController.getQuiz);

router.get('/lessons/:lessonId/quiz', quizController.getLessonQuiz);

router.put(
  '/quizzes/:id',
  authenticate,
  authorize('educator', 'admin'),
  quizController.updateQuiz
);

router.delete(
  '/quizzes/:id',
  authenticate,
  authorize('educator', 'admin'),
  quizController.deleteQuiz
);

// Quiz Questions (Educator/Admin)
router.post(
  '/quizzes/:id/questions',
  authenticate,
  authorize('educator', 'admin'),
  quizController.createQuizQuestion
);

router.get('/quizzes/:quizId/questions', quizController.getQuizQuestions);

router.put(
  '/questions/:questionId',
  authenticate,
  authorize('educator', 'admin'),
  quizController.updateQuizQuestion
);

router.delete(
  '/questions/:questionId',
  authenticate,
  authorize('educator', 'admin'),
  quizController.deleteQuizQuestion
);

// Quiz Attempts (Student)
router.post(
  '/quizzes/:quizId/submit',
  authenticate,
  authorize('student'),
  quizController.submitQuizAttempt
);

router.get(
  '/quizzes/:quizId/attempts',
  authenticate,
  authorize('student'),
  quizController.getQuizAttempts
);

router.get(
  '/attempts/:attemptId',
  authenticate,
  quizController.getQuizAttempt
);

// Student Performance (Student)
router.get(
  '/courses/:courseId/quiz-performance',
  authenticate,
  authorize('student'),
  quizController.getStudentQuizPerformance
);

// Analytics (Educator/Admin)
router.get(
  '/courses/:courseId/quizzes-analytics',
  authenticate,
  authorize('educator', 'admin'),
  quizController.getCourseQuizzesAnalytics
);

router.get(
  '/quizzes/:quizId/results',
  authenticate,
  authorize('educator', 'admin'),
  quizController.getQuizResults
);

export default router;
