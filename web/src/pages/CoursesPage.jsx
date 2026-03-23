import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth, useContent } from '../hooks/useAppStore';
import { useNotification } from '../hooks/useNotification';
import { Card } from '../components/CommonComponents';
import { contentAPI } from '../services/api';
import { fetchCoursesSuccess } from '../store/contentSlice';
import { Link } from 'react-router-dom';

export const CoursesPage = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { courses, loading } = useContent();
  const { showError } = useNotification();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await contentAPI.getAllCourses({});
        dispatch(fetchCoursesSuccess(response.data.data));
      } catch (error) {
        showError('Failed to load courses');
      }
    };

    fetchCourses();
  }, [dispatch, showError]);

  if (loading) return <div className="text-center py-8">Loading courses...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>

      {courses.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No courses available yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{course.category}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                    {course.level}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
