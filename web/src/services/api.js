import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),
  
  // Admin user management
  getAllUsers: (role) => apiClient.get('/auth/users', { params: role ? { role } : {} }),
  getUsersByRole: (role) => apiClient.get('/auth/users', { params: { role } }),
  updateUserRole: (userId, role) => apiClient.put(`/auth/users/${userId}/role`, { role }),
  deleteUser: (userId) => apiClient.delete(`/auth/users/${userId}`),
};

// Content endpoints
export const contentAPI = {
  getAllCourses: (filters) => apiClient.get('/content/courses', { params: filters }),
  getCourse: (id) => apiClient.get(`/content/courses/${id}`),
  createCourse: (data) => apiClient.post('/content/courses', data),
  updateCourse: (id, data) => apiClient.put(`/content/courses/${id}`, data),
  deleteCourse: (id) => apiClient.delete(`/content/courses/${id}`),
  
  getLesson: (id) => apiClient.get(`/content/lessons/${id}`),
  getCourseLessons: (courseId) => apiClient.get(`/content/courses/${courseId}/lessons`),
  createLesson: (data) => apiClient.post('/content/lessons', data),
  updateLesson: (id, data) => apiClient.put(`/content/lessons/${id}`, data),
  deleteLesson: (id) => apiClient.delete(`/content/lessons/${id}`),
  
  // Student enrollment
  enrollStudent: (courseId, studentId) => apiClient.post(`/content/courses/${courseId}/enroll`, { studentId }),
  removeStudent: (courseId, studentId) => apiClient.post(`/content/courses/${courseId}/remove-student`, { studentId }),
  getEnrollmentStats: () => apiClient.get('/content/enrollment-stats'),
  getCourseStudents: (courseId) => apiClient.get(`/content/courses/${courseId}/students`),
  getUnenrolledStudents: (courseId) => apiClient.get(`/content/courses/${courseId}/unenrolled-students`),
};

// Progress endpoints
export const progressAPI = {
  startCourse: (courseId) => apiClient.post(`/progress/courses/${courseId}/start`),
  updateProgress: (courseId, data) => apiClient.put(`/progress/courses/${courseId}/update`, data),
  completeLessonAndCheckCourse: (courseId, lessonId) => apiClient.post(`/progress/courses/${courseId}/lessons/${lessonId}/complete`),
  getUserProgress: () => apiClient.get('/progress/progress'),
  getCourseProgress: (courseId) => apiClient.get(`/progress/courses/${courseId}/progress`),
  completeCourse: (courseId) => apiClient.post(`/progress/courses/${courseId}/complete`),
  
  // Educator progress tracking
  getStudentsInCourse: (courseId) => apiClient.get(`/progress/educator/courses/${courseId}/students`),
  getStudentCourseProgress: (courseId, studentId) => apiClient.get(`/progress/educator/courses/${courseId}/students/${studentId}`),
  getCourseAnalytics: (courseId) => apiClient.get(`/progress/educator/courses/${courseId}/analytics`),
};

// Chatbot endpoints
export const chatbotAPI = {
  askQuestion: (data) => apiClient.post('/chatbot/ask', data),
};

// AI Learning Companion endpoints
export const aiAPI = {
  // Conversation management
  createConversation: (data) => apiClient.post('/ai/conversations', data),
  getConversations: (limit) => apiClient.get('/ai/conversations', { params: { limit } }),
  getConversation: (conversationId) => apiClient.get(`/ai/conversations/${conversationId}`),
  updateConversationTitle: (conversationId, title) => apiClient.put(`/ai/conversations/${conversationId}`, { title }),
  deleteConversation: (conversationId) => apiClient.delete(`/ai/conversations/${conversationId}`),
  
  // Messaging
  sendMessage: (conversationId, message, courseContext) => apiClient.post(
    `/ai/conversations/${conversationId}/messages`,
    { message, courseContext }
  ),
  
  // Learning profile
  getLearningProfile: () => apiClient.get('/ai/learning-profile'),
};

// Query endpoints
export const queryAPI = {
  // Student endpoints
  createQuery: (data) => apiClient.post('/queries', data),
  getMyQueries: () => apiClient.get('/queries'),
  deleteQuery: (id) => apiClient.delete(`/queries/${id}`),
  
  // Admin endpoints
  getAdminQueries: (filters) => apiClient.get('/admin/queries', { params: filters }),
  getQueryById: (id) => apiClient.get(`/admin/queries/${id}`),
  respondToQuery: (id, data) => apiClient.put(`/admin/queries/${id}/respond`, data),
  updateQueryStatus: (id, status) => apiClient.put(`/admin/queries/${id}/status`, { status }),
};

// Quiz endpoints
export const quizAPI = {
  // Quiz CRUD
  createQuiz: (data) => apiClient.post('/quiz/quizzes', data),
  getQuiz: (quizId) => apiClient.get(`/quiz/quizzes/${quizId}`),
  getAllQuizzes: (filters) => apiClient.get('/quiz/quizzes', { params: filters }),
  getLessonQuiz: (lessonId) => apiClient.get(`/quiz/lessons/${lessonId}/quiz`),
  updateQuiz: (quizId, data) => apiClient.put(`/quiz/quizzes/${quizId}`, data),
  deleteQuiz: (quizId) => apiClient.delete(`/quiz/quizzes/${quizId}`),
  
  // Quiz Questions
  getQuizQuestions: (quizId) => apiClient.get(`/quiz/quizzes/${quizId}/questions`),
  createQuizQuestion: (quizId, data) => apiClient.post(`/quiz/quizzes/${quizId}/questions`, data),
  updateQuizQuestion: (questionId, data) => apiClient.put(`/quiz/questions/${questionId}`, data),
  deleteQuizQuestion: (questionId) => apiClient.delete(`/quiz/questions/${questionId}`),
  
  // Quiz Attempts
  submitQuizAttempt: (quizId, data) => apiClient.post(`/quiz/quizzes/${quizId}/submit`, data),
  getQuizAttempts: (quizId) => apiClient.get(`/quiz/quizzes/${quizId}/attempts`),
  getQuizAttempt: (attemptId) => apiClient.get(`/quiz/attempts/${attemptId}`),
  
  // Student Performance
  getStudentQuizPerformance: (courseId) => apiClient.get(`/quiz/courses/${courseId}/quiz-performance`),
  
  // Analytics
  getCourseQuizzesAnalytics: (courseId) => apiClient.get(`/quiz/courses/${courseId}/quizzes-analytics`),
  getQuizResults: (quizId) => apiClient.get(`/quiz/quizzes/${quizId}/results`),
};

// Grading endpoints (Educator tools)
export const gradingAPI = {
  // Essay grading
  getEssayResponses: (quizId, status) => apiClient.get(`/grading/essays/${quizId}`, { params: { status } }),
  gradeResponse: (responseId, data) => apiClient.post(`/grading/grade/${responseId}`, data),
  
  // Quiz analytics
  getQuizStatistics: (quizId) => apiClient.get(`/grading/quiz-stats/${quizId}`),
  getQuestionAnalysis: (quizId) => apiClient.get(`/grading/question-analysis/${quizId}`),
  
  // Student interventions
  flagStudentForIntervention: (data) => apiClient.post('/grading/interventions', data),
  getAtRiskStudents: (courseId, threshold) => apiClient.get(`/grading/at-risk/${courseId}`, { params: { threshold } }),
  
  // Targeted assignments
  createTargetedAssignment: (data) => apiClient.post('/grading/targeted-assignments', data),
  
  // Class analytics
  getClassProgressOverview: (courseId) => apiClient.get(`/grading/class-progress/${courseId}`),
  
  // Feedback
  submitStudentFeedback: (studentId, data) => apiClient.post(`/grading/feedback/${studentId}`, data),
};

// Learner analytics endpoints (Student analytics)
export const learnerAnalyticsAPI = {
  getWeakAreas: (courseId) => apiClient.get(`/learner-analytics/weak-areas/${courseId}`),
  getTopicMastery: (courseId) => apiClient.get(`/learner-analytics/topic-mastery/${courseId}`),
  getLearningPatterns: (courseId) => apiClient.get(`/learner-analytics/learning-patterns/${courseId}`),
  getRecommendations: (courseId) => apiClient.get(`/learner-analytics/recommendations/${courseId}`),
  getExamReadiness: (courseId) => apiClient.get(`/learner-analytics/exam-readiness/${courseId}`),
  getAdaptiveDifficulty: (courseId) => apiClient.get(`/learner-analytics/adaptive-difficulty/${courseId}`),
  getLearningVelocity: (courseId) => apiClient.get(`/learner-analytics/learning-velocity/${courseId}`),
};

// Gamification endpoints
export const gamificationAPI = {
  getStudentAchievements: (studentId) => apiClient.get('/gamification/achievements', { params: { studentId } }),
  getStudentStreaks: (studentId) => apiClient.get('/gamification/streak'),
  getLeaderboard: (courseId) => apiClient.get(`/gamification/courses/${courseId}/leaderboard`),
  getAchievementProgress: (badgeType) => apiClient.get(`/gamification/progress/${badgeType}`),
  unlockBadge: (data) => apiClient.post('/gamification/awards', data),
  resetStreaks: (studentId) => apiClient.delete(`/gamification/streaks/${studentId}`),
  getBadgeDetails: (badgeType) => apiClient.get(`/gamification/badges/${badgeType}`),
};

export default apiClient;
