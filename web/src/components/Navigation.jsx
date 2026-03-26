import React from 'react';
import { useAuth } from '../hooks/useAppStore';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          EduBridge
        </Link>

        <div className="text-sm">
          {user && <span>{user?.firstName} - {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</span>}
        </div>
      </div>
    </nav>
  );
};
