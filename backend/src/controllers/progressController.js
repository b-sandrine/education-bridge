import ProgressService from '../services/ProgressService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const startCourse = asyncHandler(async (req, res) => {
  // User can only start courses for themselves; educators/admins can manage courses but not progress data
  const progress = await ProgressService.startCourse(req.user.id, req.params.courseId);
  res.status(201).json({
    status: 'success',
    data: progress,
  });
});

export const updateProgress = asyncHandler(async (req, res) => {
  // User can only update their own progress
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
  // User can only retrieve their own progress
  const progressList = await ProgressService.getUserProgress(req.user.id);
  res.status(200).json({
    status: 'success',
    data: progressList,
  });
});

export const getCourseProgress = asyncHandler(async (req, res) => {
  // User can only retrieve their own progress for a course
  const progress = await ProgressService.getCourseProgress(req.user.id, req.params.courseId);
  res.status(200).json({
    status: 'success',
    data: progress,
  });
});

export const completeCourse = asyncHandler(async (req, res) => {
  // User can only mark their own courses as complete
  const progress = await ProgressService.completeCourse(req.user.id, req.params.courseId);
  res.status(200).json({
    status: 'success',
    data: progress,
  });
});

export const completeLessonAndCheckCourse = asyncHandler(async (req, res) => {
  // User completes a lesson - auto-completes course if all lessons are done
  const progress = await ProgressService.completeLessonAndCheckCourse(
    req.user.id,
    req.params.courseId,
    req.params.lessonId
  );
  res.status(200).json({
    status: 'success',
    message: progress.status === 'completed' ? 'Course completed!' : 'Lesson completed',
    data: progress,
  });
});

// Educator endpoints for tracking student progress
export const getStudentsInCourse = asyncHandler(async (req, res) => {
  // Educators can only view students in their own courses; admins can view all
  const studentsProgress = await ProgressService.getStudentsInCourse(
    req.params.courseId,
    req.user.id,
    req.user.role
  );
  res.status(200).json({
    status: 'success',
    data: studentsProgress,
  });
});

export const getStudentCourseProgress = asyncHandler(async (req, res) => {
  // Educators can only view student progress in their own courses; admins can view all
  const progress = await ProgressService.getStudentCourseProgress(
    req.params.courseId,
    req.params.studentId,
    req.user.id,
    req.user.role
  );
  res.status(200).json({
    status: 'success',
    data: progress,
  });
});

export const getCourseAnalytics = asyncHandler(async (req, res) => {
  // Educators can only view analytics for their own courses; admins can view all
  const analytics = await ProgressService.getCourseAnalytics(
    req.params.courseId,
    req.user.id,
    req.user.role
  );
  res.status(200).json({
    status: 'success',
    data: analytics,
  });
});
