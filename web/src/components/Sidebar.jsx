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
  faEnvelope,
  faRobot,
  faQuestionCircle,
  faHeartbeat,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

export const Sidebar = () => {
  const { user, token } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [expandedSubmenu, setExpandedSubmenu] = useState('educator'); // Track which submenu is expanded

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
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-50 md:relative md:z-0 ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
        } md:translate-x-0 ${isDesktopOpen ? 'md:w-64' : 'md:w-20'} overflow-y-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          {isDesktopOpen && (
            <Link to="/" className="text-xl font-bold text-blue-600 flex-1 hidden md:block">
              EduBridge
            </Link>
          )}
          <button
            onClick={() => {
              const newMobileState = !isMobileOpen;
              setIsMobileOpen(newMobileState);
            }}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
            title={isMobileOpen ? 'Collapse' : 'Expand'}
          >
            {isMobileOpen ? '◀' : '▶'}
          </button>
          <button
            onClick={() => setIsDesktopOpen(!isDesktopOpen)}
            className="hidden md:block p-2 hover:bg-gray-100 rounded ml-auto"
            title={isDesktopOpen ? 'Collapse' : 'Expand'}
          >
            {isDesktopOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* User Profile Section */}
        {isMobileOpen && isDesktopOpen && (
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <Link to="/profile" className="hover:opacity-80">
              <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
              <div className="mt-2">
                <span className={`text-xs font-bold px-2 py-1 rounded inline-block ${
                  user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user?.role === 'educator' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text- overflow-y-auto flex-1green-800'
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
          <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isDesktopOpen ? 'text-center' : ''}`}>
            {isDesktopOpen ? 'Main' : ''}
          </p>
          <Link to="/" className={getLinkClass('/')}>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faHome} className="w-5" />
              {isDesktopOpen && <span>Home</span>}
            </span>
          </Link>
          <Link to="/courses" className={getLinkClass('/courses')}>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBook} className="w-5" />
              {isDesktopOpen && <span>Courses</span>}
            </span>
          </Link>

          {token && (
            <>
              {/* Separator */}
              <div className="my-2 border-t border-gray-200" />

              {/* Role-Based Links */}
              {user?.role === 'student' && (
                <>
                  <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isDesktopOpen ? 'text-center' : ''}`}>
                    {isDesktopOpen ? 'Student' : ''}
                  </p>
                  <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartBar} className="w-5" />
                      {isDesktopOpen && <span>Dashboard</span>}
                    </span>
                  </Link>
                  <Link to="/queries" className={getLinkClass('/queries')}>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} className="w-5" />
                      {isDesktopOpen && <span>My Queries</span>}
                    </span>
                  </Link>
                  <Link to="/ai-tutor" className={getLinkClass('/ai-tutor')}>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faRobot} className="w-5" />
                      {isDesktopOpen && <span>AI Tutor</span>}
                    </span>
                  </Link>
                </>
              )}

              {user?.role === 'educator' && (
                <>
                  <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isDesktopOpen ? 'text-center' : ''}`}>
                    {isDesktopOpen ? 'Educator' : ''}
                  </p>
                  
                  {/* Educator Dashboard with submenu */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setExpandedSubmenu(expandedSubmenu === 'educator' ? null : 'educator')}
                      className="flex items-center gap-2 w-full px-4 py-2 rounded transition-colors text-left text-gray-700 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faGraduationCap} className="w-5" />
                      {isDesktopOpen && (
                        <>
                          <span className="flex-1">Dashboard</span>
                          <FontAwesomeIcon icon={expandedSubmenu === 'educator' ? faChevronUp : faChevronDown} className="w-4" />
                        </>
                      )}
                    </button>

                    {/* Submenu - Only show when expanded and screen space allows */}
                    {expandedSubmenu === 'educator' && isDesktopOpen && (
                      <div className="ml-4 space-y-1 border-l-2 border-gray-300 pl-2">
                        <Link to="/educator-dashboard" className={getLinkClass('/educator-dashboard')}>
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faBook} className="w-4 text-xs" />
                            <span className="text-sm">My Courses</span>
                          </span>
                        </Link>
                        <Link to="/educator-dashboard?tab=quizzes" className={getLinkClass('/educator-dashboard')}>
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faQuestionCircle} className="w-4 text-xs" />
                            <span className="text-sm">Quizzes</span>
                          </span>
                        </Link>
                        <Link to="/educator-dashboard?tab=analytics" className={getLinkClass('/educator-dashboard')}>
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faChartBar} className="w-4 text-xs" />
                            <span className="text-sm">Analytics</span>
                          </span>
                        </Link>
                        <Link to="/educator-dashboard?tab=interventions" className={getLinkClass('/educator-dashboard')}>
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faHeartbeat} className="w-4 text-xs" />
                            <span className="text-sm">Student Support</span>
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isDesktopOpen ? 'text-center' : ''}`}>
                    {isDesktopOpen ? 'Admin' : ''}
                  </p>
                  <Link to="/admin-dashboard" className={getLinkClass('/admin-dashboard')}>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCog} className="w-5" />
                      {isDesktopOpen && <span>Admin Panel</span>}
                    </span>
                  </Link>
                </>
              )}

              {/* Account Section */}
              <div className="my-2 border-t border-gray-200" />
              <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isDesktopOpen ? 'text-center' : ''}`}>
                {isDesktopOpen ? 'Account' : ''}
              </p>
              <Link to="/profile" className={getLinkClass('/profile')}>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="w-5" />
                  {isDesktopOpen && <span>Profile</span>}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 rounded transition-colors text-left w-full text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
                  {isDesktopOpen && <span>Logout</span>}
                </span>
              </button>
            </>
          )}

          {!token && (
            <>
              <div className="my-2 border-t border-gray-200" />
              <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isDesktopOpen ? 'text-center' : ''}`}>
                {isDesktopOpen ? 'Auth' : ''}
              </p>
              <Link to="/login" className={getLinkClass('/login')}>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faLock} className="w-5" />
                  {isDesktopOpen && <span>Login</span>}
                </span>
              </Link>
              <Link to="/register" className={getLinkClass('/register')}>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="w-5" />
                  {isDesktopOpen && <span>Register</span>}
                </span>
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};
