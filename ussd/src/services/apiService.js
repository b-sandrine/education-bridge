import axios from 'axios';

const API_BASE_URL = process.env.USSD_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Content API calls
export const contentAPI = {
  getCourses: async (language = 'en') => {
    try {
      const response = await apiClient.get('/content/courses');
      return response.data.data.slice(0, 4); // Limit to 4 for USSD menu
    } catch (error) {
      console.error('Failed to get courses:', error);
      return [];
    }
  },

  getCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/content/courses/${courseId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get course:', error);
      return null;
    }
  },

  getCourseLessons: async (courseId) => {
    try {
      const response = await apiClient.get(`/content/courses/${courseId}/lessons`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get lessons:', error);
      return [];
    }
  },
};

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data.data;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  },

  registerUSSD: async (phoneNumber, password) => {
    try {
      const response = await apiClient.post('/auth/register', {
        firstName: phoneNumber,
        lastName: 'USSD User',
        email: `ussd_${phoneNumber}@edubridge.local`,
        password: password,
        role: 'student',
      });
      return response.data.data;
    } catch (error) {
      console.error('Registration failed:', error);
      return null;
    }
  },
};

// Progress API calls
export const progressAPI = {
  getUserProgress: async (userId) => {
    try {
      const response = await apiClient.get('/progress/progress');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get progress:', error);
      return [];
    }
  },
};

// Chatbot API calls
export const chatbotAPI = {
  askQuestion: async (message, courseId = null) => {
    try {
      const response = await chatbotAPI.askQuestion({
        message,
        courseId,
        language: 'en',
      });
      return response.data.data.response;
    } catch (error) {
      console.error('Chatbot error:', error);
      return 'Sorry, I could not process your question. Please try again.';
    }
  },
};
