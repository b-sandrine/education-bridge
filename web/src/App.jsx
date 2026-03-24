import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './store';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { EducatorDashboardPage } from './pages/EducatorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const ProtectedRoute = ({ component: Component }) => {
  const token = localStorage.getItem('token');
  return token ? Component : <Navigate to="/login" />;
};

const RoleProtectedRoute = ({ component: Component, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = useSelector((state) => state.auth.user);
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return Component;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={ProtectedRoute({ component: <DashboardPage /> })} />
          <Route path="/educator-dashboard" element={ProtectedRoute({ component: <EducatorDashboardPage /> })} />
          <Route path="/admin-dashboard" element={ProtectedRoute({ component: <AdminDashboardPage /> })} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </Router>
    </Provider>
  );
}

export default App;
