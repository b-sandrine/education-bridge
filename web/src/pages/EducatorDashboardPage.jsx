import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Alert } from '../components/CommonComponents';
import { CourseForm } from '../components/CourseForm';
import { LessonForm } from '../components/LessonForm';
import { contentAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';

export const EducatorDashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [error, setError] = useState(null);
  const [managingLessons, setManagingLessons] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (user?.id) {
      fetchCourses();
    }
  }, [user?.id]);

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

  const fetchLessons = async (courseId) => {
    try {
      const response = await contentAPI.getCourseLessons(courseId);
      setLessons(response.data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch lessons';
      showError(message);
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

  const handleCreateLesson = async (formData) => {
    try {
      await contentAPI.createLesson(formData);
      showSuccess('Lesson created successfully!');
      setShowLessonForm(false);
      fetchLessons(managingLessons.id);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create lesson';
      showError(message);
      throw err;
    }
  };

  const handleUpdateLesson = async (formData) => {
    try {
      await contentAPI.updateLesson(editingLesson.id, formData);
      showSuccess('Lesson updated successfully!');
      setEditingLesson(null);
      fetchLessons(managingLessons.id);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update lesson';
      showError(message);
      throw err;
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;

    try {
      await contentAPI.deleteLesson(lessonId);
      showSuccess('Lesson deleted successfully!');
      fetchLessons(managingLessons.id);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete lesson';
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

  if (showLessonForm || editingLesson) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <LessonForm
            courseId={managingLessons.id}
            initialData={editingLesson}
            onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson}
            onCancel={() => {
              setShowLessonForm(false);
              setEditingLesson(null);
            }}
          />
        </div>
      </div>
    );
  }

  if (managingLessons) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Lessons</h1>
              <p className="text-gray-600">Course: {managingLessons.title}</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowLessonForm(true)}
            >
              + Add Lesson
            </Button>
          </div>

          {lessons.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600 mb-4">No lessons yet. Create your first lesson!</p>
              <Button
                variant="primary"
                onClick={() => setShowLessonForm(true)}
              >
                Add First Lesson
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Lesson {lesson.lesson_order}: {lesson.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{lesson.content.substring(0, 100)}...</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setEditingLesson(lesson)}
                        className="text-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Button
            variant="secondary"
            onClick={() => {
              setManagingLessons(null);
              setLessons([]);
            }}
            className="mt-6"
          >
            Back to Courses
          </Button>
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

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setManagingLessons(course);
                      fetchLessons(course.id);
                    }}
                    className="w-full"
                  >
                    Manage Lessons
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/educator-dashboard/courses/${course.id}/students`)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    View Student Progress
                  </Button>
                  <div className="flex gap-2">
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
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
