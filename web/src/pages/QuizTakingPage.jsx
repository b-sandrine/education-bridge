import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAppStore';
import { useNotification } from '../hooks/useNotification';
import { quizAPI } from '../services/api';
import { Card, Button, Alert } from '../components/CommonComponents';
import { QuizTaker } from '../components/QuizTaker';
import { QuizAnalytics } from '../components/QuizAnalytics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// Color scheme
const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A'
};

export const QuizTakingPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [attemptResults, setAttemptResults] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const quizResponse = await quizAPI.getQuiz(quizId);
      setQuiz(quizResponse.data.data);

      const questionsResponse = await quizAPI.getQuizQuestions(quizId);
      setQuestions(questionsResponse.data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load quiz';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleSubmitQuiz = async (answers) => {
    try {
      const submitData = {
        student_id: user?.id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: parseInt(questionId),
          student_answer: answer,
        }))
      };

      const response = await quizAPI.submitQuizAttempt(quizId, submitData);
      setAttemptResults(response.data.data);
      showSuccess('Quiz submitted successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit quiz';
      showError(message);
      throw err;
    }
  };

  const handleRetakeQuiz = () => {
    setQuizStarted(false);
    setAttemptResults(null);
  };

  const handleBackToCourse = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-6 w-full ml-0 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Card className="text-center py-12 border-2" style={{ borderColor: colors.primary }}>
          <p style={{ color: colors.primary }} className="font-semibold">Loading quiz...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          <Button variant="secondary" onClick={handleBackToCourse} className="mb-6">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </Button>
          <Alert type="error" message={error} />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          <Button variant="secondary" onClick={handleBackToCourse} className="mb-6">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </Button>
          <Card className="border-2 text-center py-12" style={{ borderColor: colors.primary }}>
            <p className="text-gray-600">Quiz not found</p>
          </Card>
        </div>
      </div>
    );
  }

  // Show results if quiz has been submitted
  if (attemptResults) {
    return (
      <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          <Button variant="secondary" onClick={handleBackToCourse} className="mb-6">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </Button>
          <QuizAnalytics 
            results={attemptResults}
            quiz={quiz}
            onRetake={handleRetakeQuiz}
          />
        </div>
      </div>
    );
  }

  // Show quiz start screen or quiz taker
  if (!quizStarted) {
    return (
      <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
        <div className="max-w-2xl mx-auto">
          <Button variant="secondary" onClick={handleBackToCourse} className="mb-6">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </Button>

          <Card className="border-2" style={{ borderColor: colors.primary }}>
            <div className="flex items-center gap-4 mb-6">
              <FontAwesomeIcon icon={faQuestionCircle} className="text-5xl" style={{ color: colors.accent }} />
              <div>
                <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>{quiz.title}</h1>
                <p className="text-gray-600 mt-2">{quiz.description}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <span className="text-gray-600 text-sm font-semibold">Questions</span>
                  <p className="text-3xl font-bold" style={{ color: colors.primary }}>{questions.length}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm font-semibold">Passing Score</span>
                  <p className="text-3xl font-bold" style={{ color: colors.accent }}>{quiz.passing_score}%</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm font-semibold">Time Limit</span>
                  <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                    {quiz.time_limit_minutes ? `${quiz.time_limit_minutes}m` : 'None'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm font-semibold">Total Points</span>
                  <p className="text-3xl font-bold" style={{ color: colors.accent }}>
                    {questions.reduce((sum, q) => sum + (q.points || 1), 0)}
                  </p>
                </div>
              </div>

              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                <p className="text-sm text-gray-700">
                  <strong>Instructions:</strong> Answer all questions within the time limit. You must score at least {quiz.passing_score}% to pass the quiz.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleStartQuiz}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                Start Quiz
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show the quiz taker
  return (
    <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        <QuizTaker
          quiz={quiz}
          questions={questions}
          onSubmit={handleSubmitQuiz}
          onCancel={handleBackToCourse}
        />
      </div>
    </div>
  );
};
