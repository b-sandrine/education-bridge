import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './store';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CourseStudentsPage } from './pages/CourseStudentsPage';
import { EducatorDashboardPage } from './pages/EducatorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StudentQueriesPage } from './pages/StudentQueriesPage';
import { AITutorPage } from './pages/AITutorPage';
import { QuizManagementPage } from './pages/QuizManagementPage';
import { QuizTakingPage } from './pages/QuizTakingPage';
import { authAPI } from './services/api';
import { loginSuccess } from './store/authSlice';

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" />;
};

const RoleProtectedRoute = ({ children, requiredRole }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Load user profile if token exists but user data is not loaded
    if (token && !user) {
      authAPI
        .getProfile()
        .then((response) => {
          const userData = response.data.data;
          dispatch(
            loginSuccess({
              user: userData,
              token,
            })
          );
        })
        .catch(() => {
          // If profile fetch fails, user will be logged out by auth middleware
        });
    }
  }, [token, user, dispatch]);

  return (
    <>
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navigation />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<RoleProtectedRoute requiredRole="student"><DashboardPage /></RoleProtectedRoute>} />
              <Route path="/queries" element={<RoleProtectedRoute requiredRole="student"><StudentQueriesPage /></RoleProtectedRoute>} />
              <Route path="/ai-tutor" element={<RoleProtectedRoute requiredRole="student"><AITutorPage /></RoleProtectedRoute>} />
              <Route path="/educator-dashboard" element={<RoleProtectedRoute requiredRole="educator"><EducatorDashboardPage /></RoleProtectedRoute>} />
              <Route path="/educator-dashboard/courses/:courseId/students" element={<RoleProtectedRoute requiredRole="educator"><CourseStudentsPage /></RoleProtectedRoute>} />
              <Route path="/educator-dashboard/courses/:courseId/quizzes" element={<RoleProtectedRoute requiredRole="educator"><QuizManagementPage /></RoleProtectedRoute>} />
              <Route path="/admin-dashboard" element={<RoleProtectedRoute requiredRole="admin"><AdminDashboardPage /></RoleProtectedRoute>} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/quizzes/:quizId" element={<ProtectedRoute><QuizTakingPage /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
