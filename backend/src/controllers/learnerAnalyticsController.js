import LearnerAnalyticsService from '../services/LearnerAnalyticsService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get weak areas
export const getWeakAreas = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const weakAreas = await LearnerAnalyticsService.detectWeakAreas(req.user.id, courseId);
  
  res.status(200).json({
    status: 'success',
    data: weakAreas,
  });
});

// Get topic mastery
export const getTopicMastery = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const mastery = await LearnerAnalyticsService.getTopicMastery(req.user.id, courseId);
  
  res.status(200).json({
    status: 'success',
    data: mastery,
  });
});

// Get learning patterns
export const getLearningPatterns = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const patterns = await LearnerAnalyticsService.getLearningPatterns(req.user.id, courseId);
  
  res.status(200).json({
    status: 'success',
    data: patterns,
  });
});

// Get recommendations
export const getRecommendations = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const recommendations = await LearnerAnalyticsService.generateRecommendations(
    req.user.id,
    courseId
  );
  
  res.status(200).json({
    status: 'success',
    data: recommendations,
  });
});

// Get exam readiness score
export const getExamReadiness = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const readiness = await LearnerAnalyticsService.getExamReadinessScore(
    req.user.id,
    courseId
  );
  
  res.status(200).json({
    status: 'success',
    data: readiness,
  });
});

// Get adaptive quiz difficulty
export const getAdaptiveDifficulty = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const difficulty = await LearnerAnalyticsService.getAdaptiveQuizDifficulty(
    req.user.id,
    courseId
  );
  
  res.status(200).json({
    status: 'success',
    data: { difficulty },
  });
});

// Get learning velocity
export const getLearningVelocity = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const velocity = await LearnerAnalyticsService.getLearningVelocity(req.user.id, courseId);
  
  res.status(200).json({
    status: 'success',
    data: velocity,
  });
});
