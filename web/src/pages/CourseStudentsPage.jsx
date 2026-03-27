import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { Card } from '../components/CommonComponents';
import { StudentProgressList } from '../components/StudentProgressList';

export const CourseStudentsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showError } = useNotification();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const courseResponse = await contentAPI.getCourse(courseId);
        setCourse(courseResponse.data.data);
        
        // Fetch lessons
        const lessonsResponse = await contentAPI.getCourseLessons(courseId);
        setLessons(lessonsResponse.data.data || []);
      } catch (error) {
        showError('Failed to load course details');
        navigate('/educator-dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center py-8 text-red-600">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6 w-full ml-0">
      <button
        onClick={() => navigate('/educator-dashboard')}
        className="text-blue-600 hover:text-blue-800 font-semibold mb-6"
      >
        ← Back to Dashboard
      </button>

      <Card className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
      </Card>

      <StudentProgressList courseId={courseId} courseLessons={lessons} />
    </div>
  );
};
