import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAppStore';
import { useNotification } from '../hooks/useNotification';
import { contentAPI, quizAPI } from '../services/api';
import { Button, Card, Alert } from '../components/CommonComponents';
import { QuizBuilder } from '../components/QuizBuilder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBook, faPlus, faEdit, faTrash, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// Color scheme
const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A'
};

export const QuizManagementPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseAndQuizzes();
  }, [courseId]);

  const fetchCourseAndQuizzes = async () => {
    try {
      setLoading(true);
      const courseResponse = await contentAPI.getCourse(courseId);
      setCourse(courseResponse.data.data);

      const quizzesResponse = await quizAPI.getAllQuizzes({ courseId });
      setQuizzes(quizzesResponse.data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load course and quizzes';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (formData) => {
    try {
      const quizData = {
        ...formData,
        course_id: courseId
      };
      await quizAPI.createQuiz(quizData);
      showSuccess('Quiz created successfully!');
      setShowForm(false);
      fetchCourseAndQuizzes();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create quiz';
      showError(message);
      throw err;
    }
  };

  const handleUpdateQuiz = async (formData) => {
    try {
      await quizAPI.updateQuiz(editingQuiz.id, formData);
      showSuccess('Quiz updated successfully!');
      setEditingQuiz(null);
      fetchCourseAndQuizzes();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update quiz';
      showError(message);
      throw err;
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await quizAPI.deleteQuiz(quizId);
      showSuccess('Quiz deleted successfully!');
      fetchCourseAndQuizzes();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete quiz';
      showError(message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12" style={{ backgroundColor: colors.background }}>
        <p style={{ color: colors.primary }} className="font-semibold">Loading course quizzes...</p>
      </div>
    );
  }

  if (showForm || editingQuiz) {
    return (
      <div className="min-h-screen py-12 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
        <div className="max-w-2xl mx-auto">
          <Button
            variant="secondary"
            onClick={() => {
              setShowForm(false);
              setEditingQuiz(null);
            }}
            className="mb-6"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Quizzes
          </Button>
          <QuizBuilder
            lesson={course}
            initialQuiz={editingQuiz}
            onSave={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
            onCancel={() => {
              setShowForm(false);
              setEditingQuiz(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="secondary"
              onClick={() => navigate('/educator-dashboard')}
              className="mb-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold" style={{ color: colors.primary }}>
              <FontAwesomeIcon icon={faQuestionCircle} className="mr-3" />
              Manage Quizzes
            </h1>
            {course && (
              <p className="text-gray-600 mt-2">
                <FontAwesomeIcon icon={faBook} className="mr-2" />
                Course: {course.title}
              </p>
            )}
          </div>
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
            style={{ backgroundColor: colors.accent }}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Quiz
          </Button>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        {/* Quizzes List */}
        {quizzes.length === 0 ? (
          <Card className="border-2 text-center py-12" style={{ borderColor: colors.primary }}>
            <FontAwesomeIcon icon={faQuestionCircle} className="text-5xl mb-4" style={{ color: colors.accent, opacity: 0.5 }} />
            <p className="text-gray-600 mb-4">No quizzes created yet for this course.</p>
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
              className="px-6 py-2 rounded-lg font-semibold text-white"
              style={{ backgroundColor: colors.accent }}
            >
              Create Your First Quiz
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="flex flex-col border-2 hover:shadow-lg transition-shadow" style={{ borderColor: colors.primary }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold" style={{ color: colors.primary }}>{quiz.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{quiz.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setEditingQuiz(quiz)}
                      className="text-sm"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="text-sm"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                  <div>
                    <span className="text-gray-600 text-xs font-semibold">Questions</span>
                    <p className="text-2xl font-bold" style={{ color: colors.primary }}>{quiz.questions?.length || 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-semibold">Passing Score</span>
                    <p className="text-2xl font-bold" style={{ color: colors.accent }}>{quiz.passing_score}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-semibold">Time Limit</span>
                    <p className="text-2xl font-bold" style={{ color: colors.primary }}>{quiz.time_limit_minutes ? `${quiz.time_limit_minutes} min` : 'None'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-semibold">Attempts</span>
                    <p className="text-2xl font-bold" style={{ color: colors.accent }}>0</p>
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
