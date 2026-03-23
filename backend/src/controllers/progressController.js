import ProgressService from '../services/ProgressService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const startCourse = asyncHandler(async (req, res) => {
  const progress = await ProgressService.startCourse(req.user.id, req.params.courseId);
  res.status(201).json({
    status: 'success',
    data: progress,
  });
});

export const updateProgress = asyncHandler(async (req, res) => {
  const { lessonsCompleted, score } = req.body;
  const progress = await ProgressService.updateProgress(
    req.user.id,
    req.params.courseId,
    lessonsCompleted,
    score
  );
  res.status(200).json({
    status: 'success',
    data: progress,
  });
});

export const getUserProgress = asyncHandler(async (req, res) => {
  const progressList = await ProgressService.getUserProgress(req.user.id);
  res.status(200).json({
    status: 'success',
    data: progressList,
  });
});

export const getCourseProgress = asyncHandler(async (req, res) => {
  const progress = await ProgressService.getCourseProgress(req.user.id, req.params.courseId);
  res.status(200).json({
    status: 'success',
    data: progress,
  });
});

export const completeCourse = asyncHandler(async (req, res) => {
  const progress = await ProgressService.completeCourse(req.user.id, req.params.courseId);
  res.status(200).json({
    status: 'success',
    data: progress,
  });
});
