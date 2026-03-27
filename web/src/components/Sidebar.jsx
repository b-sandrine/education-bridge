import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAppStore';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faBook, 
  faChartBar, 
  faGraduationCap, 
  faCog, 
  faUser, 
  faSignOutAlt,
  faLock,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

export const Sidebar = () => {
  const { user, token } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const getLinkClass = (path) => {
    const baseClass = 'block px-4 py-2 rounded transition-colors text-left w-full';
    return isActive(path)
      ? `${baseClass} bg-blue-600 text-white font-semibold`
      : `${baseClass} text-gray-700 hover:bg-gray-100`;
  };

  if (!token) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
        } md:relative md:translate-x-0 md:w-64 overflow-y-auto`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isOpen && (
            <Link to="/" className="text-xl font-bold text-blue-600 flex-1">
              EduBridge
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
            title={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* User Profile Section */}
        {isOpen && (
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <Link to="/profile" className="hover:opacity-80">
              <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
              <div className="mt-2">
                <span className={`text-xs font-bold px-2 py-1 rounded inline-block ${
                  user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user?.role === 'educator' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {/* Public Links */}
          <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen ? 'text-center' : ''}`}>
            {isOpen ? 'Main' : ''}
          </p>
          <Link to="/" className={getLinkClass('/')}>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faHome} className="w-5" />
              {isOpen && <span>Home</span>}
            </span>
          </Link>
          <Link to="/courses" className={getLinkClass('/courses')}>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBook} className="w-5" />
              {isOpen && <span>Courses</span>}
            </span>
          </Link>

          {token && (
            <>
              {/* Separator */}
              <div className="my-2 border-t border-gray-200" />

              {/* Role-Based Links */}
              {user?.role === 'student' && (
                <>
                  <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen ? 'text-center' : ''}`}>
                    {isOpen ? 'Student' : ''}
                  </p>
                  <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartBar} className="w-5" />
                      {isOpen && <span>Dashboard</span>}
                    </span>
                  </Link>
                  <Link to="/queries" className={getLinkClass('/queries')}>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} className="w-5" />
                      {isOpen && <span>My Queries</span>}
                    </span>
                  </Link>
                </>
              )}

              {user?.role === 'educator' && (
                <>
                  <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen ? 'text-center' : ''}`}>
                    {isOpen ? 'Educator' : ''}
                  </p>
                  <Link to="/educator-dashboard" className={getLinkClass('/educator-dashboard')}>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="w-5" />
                      {isOpen && <span>My Courses</span>}
                    </span>
                  </Link>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen ? 'text-center' : ''}`}>
                    {isOpen ? 'Admin' : ''}
                  </p>
                  <Link to="/admin-dashboard" className={getLinkClass('/admin-dashboard')}>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCog} className="w-5" />
                      {isOpen && <span>Admin Panel</span>}
                    </span>
                  </Link>
                </>
              )}

              {/* Account Section */}
              <div className="my-2 border-t border-gray-200" />
              <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen ? 'text-center' : ''}`}>
                {isOpen ? 'Account' : ''}
              </p>
              <Link to="/profile" className={getLinkClass('/profile')}>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="w-5" />
                  {isOpen && <span>Profile</span>}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 rounded transition-colors text-left w-full text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
                  {isOpen && <span>Logout</span>}
                </span>
              </button>
            </>
          )}

          {!token && (
            <>
              <div className="my-2 border-t border-gray-200" />
              <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen ? 'text-center' : ''}`}>
                {isOpen ? 'Auth' : ''}
              </p>
              <Link to="/login" className={getLinkClass('/login')}>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faLock} className="w-5" />
                  {isOpen && <span>Login</span>}
                </span>
              </Link>
              <Link to="/register" className={getLinkClass('/register')}>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="w-5" />
                  {isOpen && <span>Register</span>}
                </span>
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Spacer for content */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
};
