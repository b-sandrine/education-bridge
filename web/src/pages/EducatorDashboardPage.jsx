import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Alert } from '../components/CommonComponents';
import { CourseForm } from '../components/CourseForm';
import { contentAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';

export const EducatorDashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentAPI.getAllCourses({ educatorId: user?.id });
      setCourses(response.data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch courses';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (formData) => {
    try {
      await contentAPI.createCourse(formData);
      showSuccess('Course created successfully!');
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create course';
      showError(message);
      throw err;
    }
  };

  const handleUpdateCourse = async (formData) => {
    try {
      await contentAPI.updateCourse(editingCourse.id, formData);
      showSuccess('Course updated successfully!');
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update course';
      showError(message);
      throw err;
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await contentAPI.deleteCourse(courseId);
      showSuccess('Course deleted successfully!');
      fetchCourses();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete course';
      showError(message);
    }
  };

  if (showForm || editingCourse) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <CourseForm
            initialData={editingCourse}
            onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
            onCancel={() => {
              setShowForm(false);
              setEditingCourse(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Educator Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}! Manage your courses here.</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4 flex-wrap">
            <Card className="bg-white px-6 py-4">
              <p className="text-gray-600 text-sm">Total Courses</p>
              <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
            </Card>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            + Create New Course
          </Button>
        </div>

        {loading ? (
          <Card className="text-center py-12">
            <p className="text-gray-600">Loading your courses...</p>
          </Card>
        ) : courses.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
            >
              Create Your First Course
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3 flex-grow">{course.description}</p>
                
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Category:</span> {course.category}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Level:</span>{' '}
                    <span className="capitalize">{course.level}</span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Duration:</span> {course.duration_weeks} weeks
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    onClick={() => setEditingCourse(course)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
