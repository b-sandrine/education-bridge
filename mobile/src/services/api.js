import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
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
};

// Content endpoints
export const contentAPI = {
  getAllCourses: (filters) => apiClient.get('/content/courses', { params: filters }),
  getCourse: (id) => apiClient.get(`/content/courses/${id}`),
  getCourseLessons: (courseId) => apiClient.get(`/content/courses/${courseId}/lessons`),
  getLesson: (id) => apiClient.get(`/content/lessons/${id}`),
};

// Progress endpoints
export const progressAPI = {
  startCourse: (courseId) => apiClient.post(`/progress/courses/${courseId}/start`),
  getUserProgress: () => apiClient.get('/progress/progress'),
  getCourseProgress: (courseId) => apiClient.get(`/progress/courses/${courseId}/progress`),
  updateProgress: (courseId, data) => apiClient.put(`/progress/courses/${courseId}/update`, data),
  completeCourse: (courseId) => apiClient.post(`/progress/courses/${courseId}/complete`),
};

// Chatbot endpoints
export const chatbotAPI = {
  askQuestion: (data) => apiClient.post('/chatbot/ask', data),
};

export default apiClient;
