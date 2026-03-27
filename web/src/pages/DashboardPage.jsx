import React, { useEffect, useState } from 'react';
import { useAuth, useProgress } from '../hooks/useAppStore';
import { progressAPI } from '../services/api';
import { useDispatch } from 'react-redux';
import { useNotification } from '../hooks/useNotification';
import { fetchProgressSuccess } from '../store/progressSlice';
import { Card } from '../components/CommonComponents';
import { calculateProgress } from '../utils/helpers';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { userProgress } = useProgress();
  const dispatch = useDispatch();
  const { showError } = useNotification();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await progressAPI.getUserProgress();
        dispatch(fetchProgressSuccess(response.data.data));
      } catch (error) {
        showError('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;

  const completedCourses = userProgress.filter(p => p.status === 'completed').length;
  const inProgressCourses = userProgress.filter(p => p.status === 'in_progress').length;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6 w-full ml-0">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.firstName}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Total Courses</p>
            <p className="text-4xl font-bold text-blue-600">{userProgress.length}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">In Progress</p>
            <p className="text-4xl font-bold text-yellow-600">{inProgressCourses}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Completed</p>
            <p className="text-4xl font-bold text-green-600">{completedCourses}</p>
          </div>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Courses</h2>

      {userProgress.length === 0 ? (
        <Card>
          <p className="text-gray-600 text-center py-8">
            No courses yet.{' '}
            <Link to="/courses" className="text-blue-600 hover:underline">
              Browse courses
            </Link>
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {userProgress.map((progress) => (
            <Link key={progress.id} to={`/courses/${progress.course_id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Course ID: {progress.course_id.substring(0, 8)}</h3>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      progress.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {progress.status}
                  </span>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Progress: {progress.lessons_completed} lessons completed</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${calculateProgress(progress.lessons_completed, 10)}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
