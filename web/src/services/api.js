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
};

// Progress endpoints
export const progressAPI = {
  startCourse: (courseId) => apiClient.post(`/progress/courses/${courseId}/start`),
  updateProgress: (courseId, data) => apiClient.put(`/progress/courses/${courseId}/update`, data),
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

export default apiClient;
