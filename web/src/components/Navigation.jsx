import React from 'react';
import { useAuth } from '../hooks/useAppStore';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export const Navigation = () => {
  const { user, token } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          EduBridge
        </Link>

        <div className="flex items-center space-x-4">
          {token ? (
            <>
              {user?.role === 'student' && (
                <>
                  <Link to="/dashboard" className="hover:text-blue-100">
                    Dashboard
                  </Link>
                  <Link to="/courses" className="hover:text-blue-100">
                    Courses
                  </Link>
                </>
              )}
              {user?.role === 'educator' && (
                <>
                  <Link to="/educator-dashboard" className="hover:text-blue-100">
                    My Courses
                  </Link>
                  <Link to="/courses" className="hover:text-blue-100">
                    Browse Courses
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link to="/admin-dashboard" className="hover:text-blue-100">
                    Admin Panel
                  </Link>
                  <Link to="/educator-dashboard" className="hover:text-blue-100">
                    Manage Courses
                  </Link>
                </>
              )}
              <Link to="/profile" className="hover:text-blue-100 flex items-center space-x-1">
                <span className="text-sm">{user?.firstName}</span>
              </Link>
              <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-100">
                Login
              </Link>
              <Link to="/register" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
