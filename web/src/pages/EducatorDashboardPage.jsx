import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Alert } from '../components/CommonComponents';
import { CourseForm } from '../components/CourseForm';
import { LessonForm } from '../components/LessonForm';
import { EducatorProgressAnalytics } from '../components/EducatorProgressAnalytics';
import { StudentInsights } from '../components/StudentInsights';
import StudentInterventionTools from '../components/StudentInterventionTools';
import { contentAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faBook, faChalkboardUser, faStar, faHeartbeat } from '@fortawesome/free-solid-svg-icons';

// Color scheme
const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A'
};

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
  const [activeTab, setActiveTab] = useState('courses'); // "courses", "analytics", "interventions"
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
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
      const coursesData = response.data.data || [];
      setCourses(coursesData);
      
      // Fetch actual student data from all courses
      await fetchAllStudentsFromCourses(coursesData);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch courses';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudentsFromCourses = async (coursesData) => {
    try {
      const allStudents = {};
      
      // Fetch students from each course and combine (avoiding duplicates)
      for (const course of coursesData) {
        try {
          const studentResponse = await contentAPI.getCourseStudents(course.id);
          const courseStudents = studentResponse.data.data || [];
          
          // Add students, updating if they already exist (to get latest progress)
          courseStudents.forEach(student => {
            allStudents[student.id] = {
              id: student.id,
              firstName: student.first_name,
              lastName: student.last_name,
              email: student.email,
              progress: student.lessons_completed ? Math.round((student.lessons_completed / 10) * 100) : 0,
              score: student.score || 0,
              status: student.status || 'in_progress'
            };
          });
        } catch (courseError) {
          console.warn(`Failed to fetch students for course ${course.id}:`, courseError);
          // Continue with other courses if one fails
        }
      }
      
      // Convert object to array
      setStudents(Object.values(allStudents));
    } catch (err) {
      console.error('Failed to fetch students:', err);
      // Set empty students array if fetch fails, but don't show error
      setStudents([]);
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
      <div className="min-h-screen bg-gray-100 py-12 px-6 w-full ml-0">
        <div className="max-w-2xl mx-auto">
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
      <div className="min-h-screen bg-gray-100 py-12 px-6 w-full ml-0">
        <div className="max-w-2xl mx-auto">
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
      <div className="min-h-screen bg-gray-100 py-12 px-6 w-full ml-0">
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
    <div className="min-h-screen py-12 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>Educator Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName}! Manage your courses and track student progress.</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 border-b-2 flex-wrap" style={{ borderColor: colors.primary }}>
        {['courses', 'analytics', 'interventions'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedStudent(null);
            }}
            className="px-6 py-3 font-semibold transition-all border-b-2 uppercase text-sm"
            style={{
              borderBottomColor: activeTab === tab ? colors.accent : 'transparent',
              color: activeTab === tab ? colors.accent : colors.text,
              backgroundColor: activeTab === tab ? `${colors.accent}10` : 'transparent'
            }}
          >
            <FontAwesomeIcon 
              icon={tab === 'courses' ? faBook : tab === 'analytics' ? faChartBar : faHeartbeat} 
              className="mr-2" 
            />
            {tab === 'courses' ? 'My Courses' : tab === 'analytics' ? 'Class Analytics' : 'Student Support'}
          </button>
        ))}
      </div>

      {/* Student Insights View */}
      {selectedStudent && (
        <div className="mb-6">
          <StudentInsights 
            student={selectedStudent}
            lessons={lessons}
            onBack={() => setSelectedStudent(null)}
          />
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && !selectedStudent && (
        <>
          <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
            <Card className="border-2" style={{ borderColor: colors.primary, backgroundColor: `${colors.primary}10` }}>
              <div className="flex items-center gap-4">
                <FontAwesomeIcon icon={faChalkboardUser} className="text-4xl" style={{ color: colors.accent }} />
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-4xl font-bold" style={{ color: colors.primary }}>{courses.length}</p>
                </div>
              </div>
            </Card>
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: colors.accent }}
            >
              <FontAwesomeIcon icon={faBook} className="mr-2" />
              + Create New Course
            </Button>
          </div>

          {loading ? (
            <Card className="text-center py-12 border-2" style={{ borderColor: colors.primary }}>
              <p className="text-gray-600">Loading your courses...</p>
            </Card>
          ) : courses.length === 0 ? (
            <Card className="text-center py-12 border-2" style={{ borderColor: colors.primary }}>
              <FontAwesomeIcon icon={faBook} className="text-5xl mb-4" style={{ color: colors.accent }} />
              <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
              <Button
                variant="primary"
                onClick={() => setShowForm(true)}
                className="px-6 py-2 rounded-lg font-semibold text-white"
                style={{ backgroundColor: colors.accent }}
              >
                Create Your First Course
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="flex flex-col border-2 hover:shadow-lg transition-shadow" style={{ borderColor: colors.primary }}>
                  <div className="flex items-start gap-2 mb-3">
                    <FontAwesomeIcon icon={faBook} style={{ color: colors.accent, fontSize: '1.25rem' }} />
                    <h3 className="text-lg font-bold" style={{ color: colors.primary }}>{course.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 flex-grow">{course.description}</p>
                  
                  <div className="space-y-2 text-sm mb-4 p-3 rounded" style={{ backgroundColor: colors.background }}>
                    <p className="text-gray-700">
                      <span className="font-semibold" style={{ color: colors.primary }}>Category:</span> {course.category}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold" style={{ color: colors.primary }}>Level:</span>{' '}
                      <span className="capitalize">{course.level}</span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold" style={{ color: colors.primary }}>Duration:</span> {course.duration_weeks} weeks
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: colors.primary }}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setManagingLessons(course);
                        fetchLessons(course.id);
                      }}
                      className="w-full px-4 py-2 rounded-lg font-semibold text-white transition-all"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <FontAwesomeIcon icon={faBook} className="mr-1" />
                      Manage Lessons
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setEditingCourse(course)}
                        className="flex-1 px-3 py-2 rounded-lg font-semibold text-white transition-all text-sm"
                        style={{ backgroundColor: colors.accent }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="flex-1 px-3 py-2 rounded-lg font-semibold text-white transition-all text-sm"
                        style={{ backgroundColor: '#dc2626' }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && !selectedStudent && (
        <EducatorProgressAnalytics 
          students={students} 
          onViewStudentDetails={(student) => {
            setSelectedStudent(student);
            setActiveTab('analytics');
          }}
        />
      )}

      {activeTab === 'interventions' && !selectedStudent && courses.length > 0 && (
        <StudentInterventionTools 
          courseId={courses[0]?.id}
          educatorId={user?.id}
        />
      )}

      {courses.length === 0 && activeTab === 'interventions' && (
        <Card className="text-center py-12" style={{ borderColor: colors.primary, borderWidth: 2 }}>
          <p className="text-gray-600 mb-4">Create a course first to access student support tools</p>
        </Card>
      )}
    </div>
  );
};
