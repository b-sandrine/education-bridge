import ContentService from '../services/ContentService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Course endpoints
export const createCourse = asyncHandler(async (req, res) => {
  const courseData = {
    ...req.body,
    educatorId: req.user.id,
  };
  const course = await ContentService.createCourse(courseData);
  res.status(201).json({
    status: 'success',
    data: course,
  });
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await ContentService.getCourse(req.params.id);
  res.status(200).json({
    status: 'success',
    data: course,
  });
});

export const getAllCourses = asyncHandler(async (req, res) => {
  const filters = {
    category: req.query.category,
    level: req.query.level,
    educatorId: req.query.educatorId,
  };
  const courses = await ContentService.getAllCourses(filters);
  res.status(200).json({
    status: 'success',
    data: courses,
  });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await ContentService.updateCourse(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role
  );
  res.status(200).json({
    status: 'success',
    data: course,
  });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  await ContentService.deleteCourse(
    req.params.id,
    req.user.id,
    req.user.role
  );
  res.status(204).send();
});

// Lesson endpoints
export const createLesson = asyncHandler(async (req, res) => {
  const lesson = await ContentService.createLesson(
    req.body,
    req.user.id,
    req.user.role
  );
  res.status(201).json({
    status: 'success',
    data: lesson,
  });
});

export const getLesson = asyncHandler(async (req, res) => {
  const lesson = await ContentService.getLesson(req.params.id);
  res.status(200).json({
    status: 'success',
    data: lesson,
  });
});

export const getCourseLessons = asyncHandler(async (req, res) => {
  const lessons = await ContentService.getCourseLessons(req.params.courseId);
  res.status(200).json({
    status: 'success',
    data: lessons,
  });
});

export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await ContentService.updateLesson(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role
  );
  res.status(200).json({
    status: 'success',
    data: lesson,
  });
});

export const deleteLesson = asyncHandler(async (req, res) => {
  await ContentService.deleteLesson(
    req.params.id,
    req.user.id,
    req.user.role
  );
  res.status(204).send();
});

