import GamificationService from '../services/GamificationService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get student achievements
export const getStudentAchievements = asyncHandler(async (req, res) => {
  const achievements = await GamificationService.getStudentAchievements(req.user.id);
  res.status(200).json({
    status: 'success',
    data: achievements,
  });
});

// Get gamification stats
export const getGamificationStats = asyncHandler(async (req, res) => {
  const stats = await GamificationService.getGamificationStats(req.user.id);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

// Get class leaderboard
export const getLeaderboard = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const limit = req.query.limit || 10;

  const leaderboard = await GamificationService.getLeaderboard(courseId, parseInt(limit));
  res.status(200).json({
    status: 'success',
    data: leaderboard,
  });
});

// Add points (admin/educator)
export const addPoints = asyncHandler(async (req, res) => {
  const { studentId, points, reason } = req.body;
  
  const point = await GamificationService.addPoints(studentId, points, reason);
  res.status(201).json({
    status: 'success',
    data: point,
  });
});

// Get current streak
export const getCurrentStreak = asyncHandler(async (req, res) => {
  const streak = await GamificationService.getCurrentStreak(req.user.id);
  res.status(200).json({
    status: 'success',
    data: { currentStreak: streak },
  });
});

// Award badge manually
export const awardBadge = asyncHandler(async (req, res) => {
  const { studentId, badgeId } = req.body;
  
  const badge = await GamificationService.awardBadge(studentId, badgeId);
  res.status(201).json({
    status: 'success',
    data: badge,
  });
});
