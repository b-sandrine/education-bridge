import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as gamificationController from '../controllers/gamificationController.js';

const router = express.Router();

// Student endpoints
router.get('/achievements', authenticate, gamificationController.getStudentAchievements);
router.get('/stats', authenticate, gamificationController.getGamificationStats);
router.get('/streak', authenticate, gamificationController.getCurrentStreak);

// Leaderboard (accessible by all)
router.get('/courses/:courseId/leaderboard', authenticate, gamificationController.getLeaderboard);

// Admin/Educator endpoints
router.post('/points', authenticate, authorize('admin', 'educator'), gamificationController.addPoints);
router.post('/badges', authenticate, authorize('admin', 'educator'), gamificationController.awardBadge);

export default router;
