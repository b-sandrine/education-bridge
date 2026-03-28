import QuizService from '../services/QuizService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Quiz CRUD operations
export const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await QuizService.createQuiz(
    req.body,
    req.user.id,
    req.user.role
  );
  res.status(201).json({
    status: 'success',
    data: quiz,
  });
});

export const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await QuizService.getQuiz(req.params.id);
  res.status(200).json({
    status: 'success',
    data: quiz,
  });
});

export const getLessonQuiz = asyncHandler(async (req, res) => {
  const quiz = await QuizService.getLessonQuiz(req.params.lessonId);
  res.status(200).json({
    status: 'success',
    data: quiz,
  });
});

export const getAllQuizzes = asyncHandler(async (req, res) => {
  const filters = {
    lessonId: req.query.lessonId,
    courseId: req.query.courseId,
    educatorId: req.query.educatorId,
  };
  const quizzes = await QuizService.getAllQuizzes(filters);
  res.status(200).json({
    status: 'success',
    data: quizzes,
  });
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await QuizService.updateQuiz(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role
  );
  res.status(200).json({
    status: 'success',
    data: quiz,
  });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  await QuizService.deleteQuiz(
    req.params.id,
    req.user.id,
    req.user.role
  );
  res.status(204).send();
});

// Quiz Questions
export const createQuizQuestion = asyncHandler(async (req, res) => {
  const question = await QuizService.createQuizQuestion(
    req.body,
    req.user.id,
    req.user.role
  );
  res.status(201).json({
    status: 'success',
    data: question,
  });
});

export const updateQuizQuestion = asyncHandler(async (req, res) => {
  const question = await QuizService.updateQuizQuestion(
    req.params.questionId,
    req.body,
    req.user.id,
    req.user.role
  );
  res.status(200).json({
    status: 'success',
    data: question,
  });
});

export const deleteQuizQuestion = asyncHandler(async (req, res) => {
  await QuizService.deleteQuizQuestion(
    req.params.questionId,
    req.user.id,
    req.user.role
  );
  res.status(204).send();
});

export const getQuizQuestions = asyncHandler(async (req, res) => {
  const questions = await QuizService.getQuizQuestions(req.params.quizId);
  res.status(200).json({
    status: 'success',
    data: questions,
  });
});

// Quiz Attempts
export const submitQuizAttempt = asyncHandler(async (req, res) => {
  const attempt = await QuizService.submitQuizAttempt(
    req.params.quizId,
    req.body,
    req.user.id
  );
  res.status(201).json({
    status: 'success',
    data: attempt,
  });
});

export const getQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizService.getQuizAttempts(
    req.params.quizId,
    req.user.id
  );
  res.status(200).json({
    status: 'success',
    data: attempts,
  });
});

export const getQuizAttempt = asyncHandler(async (req, res) => {
  const attempt = await QuizService.getQuizAttempt(
    req.params.attemptId,
    req.user.id
  );
  res.status(200).json({
    status: 'success',
    data: attempt,
  });
});

export const getStudentQuizPerformance = asyncHandler(async (req, res) => {
  const performance = await QuizService.getStudentQuizPerformance(
    req.params.courseId,
    req.user.id
  );
  res.status(200).json({
    status: 'success',
    data: performance,
  });
});

// Educator Analytics
export const getCourseQuizzesAnalytics = asyncHandler(async (req, res) => {
  const analytics = await QuizService.getCourseQuizzesAnalytics(
    req.params.courseId,
    req.user.id,
    req.user.role
  );
  res.status(200).json({
    status: 'success',
    data: analytics,
  });
});

export const getQuizResults = asyncHandler(async (req, res) => {
  const results = await QuizService.getQuizResults(
    req.params.quizId,
    req.user.id,
    req.user.role
  );
  res.status(200).json({
    status: 'success',
    data: results,
  });
});
