import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faClock,
  faFlag,
  faArrowLeft,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { Button, Card } from './CommonComponents';
import { useNotification } from '../hooks/useNotification';

const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A',
};

export const QuizTaker = ({ quiz, questions, onSubmit, onCancel, onAttemptComplete }) => {
  const { showError, showSuccess } = useNotification();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.time_limit_minutes ? quiz.time_limit_minutes * 60 : null);
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  // Timer effect
  useEffect(() => {
    if (!timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    // Validate that all questions are answered
    const unansweredQuestions = questions.filter(
      (q) => !answers[q.id] || answers[q.id] === ''
    );

    if (unansweredQuestions.length > 0) {
      const confirmed = window.confirm(
        `You have ${unansweredQuestions.length} unanswered question(s). Submit anyway?`
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    try {
      const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);
      const result = await onSubmit({
        answers,
        timeTakenSeconds,
      });

      setQuizResults(result);
      setShowResults(true);

      if (onAttemptComplete) {
        onAttemptComplete(result);
      }
    } catch (error) {
      showError('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const answeredCount = Object.keys(answers).filter((key) => answers[key]).length;

  // Results View
  if (showResults && quizResults) {
    const passed = quizResults.passed;
    return (
      <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <Card className="border-4 mb-8 text-center py-12" style={{ borderColor: passed ? '#10b981' : '#ef4444' }}>
            <div className="flex justify-center mb-4">
              <FontAwesomeIcon
                icon={passed ? faCheckCircle : faTimesCircle}
                className="text-6xl"
                style={{ color: passed ? '#10b981' : '#ef4444' }}
              />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: colors.primary }}>
              {passed ? 'Quiz Passed!' : 'Quiz Not Passed'}
            </h1>
            <p className="text-2xl font-semibold mb-2" style={{ color: colors.accent }}>
              Score: {quizResults.percentage_score}%
            </p>
            <p className="text-gray-600">
              {quizResults.score} out of {quizResults.max_score} points
            </p>
            {quiz.passing_score && (
              <p className="text-gray-500 text-sm mt-2">Passing Score: {quiz.passing_score}%</p>
            )}
          </Card>

          {/* Detailed Results */}
          <Card className="border-2 mb-8" style={{ borderColor: colors.primary }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
              Review Your Answers
            </h2>

            <div className="space-y-6">
              {questions.map((question, index) => {
                const studentAnswer = answers[question.id];
                const answerDetail = JSON.parse(quizResults.answers || '[]').find(
                  (a) => a.questionId === question.id
                );
                const isCorrect = answerDetail?.isCorrect;

                return (
                  <div
                    key={question.id}
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      borderLeftColor: isCorrect ? '#10b981' : '#ef4444',
                      backgroundColor: isCorrect ? '#ecfdf520' : '#fef2f220',
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <FontAwesomeIcon
                        icon={isCorrect ? faCheckCircle : faTimesCircle}
                        style={{ color: isCorrect ? '#10b981' : '#ef4444', marginTop: '4px' }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: colors.primary }}>
                          Question {index + 1}: {question.question_text}
                        </p>
                      </div>
                    </div>

                    {question.question_type === 'multiple_choice' && (
                      <div className="ml-8 space-y-2 text-sm">
                        <p>
                          <span className="text-gray-600">Your answer:</span>{' '}
                          <span className="font-semibold">{question.options[parseInt(studentAnswer)]}</span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="text-gray-600">Correct answer:</span>{' '}
                            <span className="font-semibold text-green-600">
                              {question.options[parseInt(question.correct_answer)]}
                            </span>
                          </p>
                        )}
                      </div>
                    )}

                    {question.question_type === 'true_false' && (
                      <div className="ml-8 space-y-2 text-sm">
                        <p>
                          <span className="text-gray-600">Your answer:</span>{' '}
                          <span className="font-semibold">{studentAnswer}</span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="text-gray-600">Correct answer:</span>{' '}
                            <span className="font-semibold text-green-600">{question.correct_answer}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {question.question_type === 'short_answer' && (
                      <div className="ml-8 space-y-2 text-sm">
                        <p>
                          <span className="text-gray-600">Your answer:</span>{' '}
                          <span className="font-semibold">{studentAnswer}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">Expected:</span>{' '}
                          <span className="font-semibold">{question.correct_answer}</span>
                        </p>
                      </div>
                    )}

                    {question.question_type === 'essay' && (
                      <div className="ml-8 text-sm">
                        <p className="text-yellow-600 font-semibold mb-2">
                          ⚠️ This answer requires manual grading by your instructor
                        </p>
                        <p>
                          <span className="text-gray-600">Your answer:</span>
                        </p>
                        <p className="italic text-gray-600 mt-2">{studentAnswer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={onCancel}
              className="px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: '#6B7280' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Taking View
  return (
    <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="border-2 mb-6" style={{ borderColor: colors.primary }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
                {quiz.title}
              </h1>
              {quiz.description && <p className="text-gray-600 mt-2">{quiz.description}</p>}
            </div>
            {timeRemaining !== null && (
              <div
                className="text-center px-6 py-4 rounded-lg"
                style={{
                  backgroundColor: timeRemaining < 300 ? '#fee2e220' : `${colors.accent}20`,
                  borderLeft: `4px solid ${timeRemaining < 300 ? '#ef4444' : colors.accent}`,
                }}
              >
                <FontAwesomeIcon icon={faClock} className="mr-2" style={{ color: colors.accent }} />
                <p className="text-lg font-bold" style={{ color: timeRemaining < 300 ? '#ef4444' : colors.primary }}>
                  {formatTime(timeRemaining)}
                </p>
                <p className="text-xs text-gray-600">Remaining</p>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-semibold">
              Question {currentQuestionIndex + 1} of {questions.length} ({answeredCount} answered)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  backgroundColor: colors.accent,
                }}
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question */}
          <div className="lg:col-span-3">
            <Card className="border-2" style={{ borderColor: colors.primary }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: colors.primary }}>
                {currentQuestion.question_text}
              </h2>

              {/* Multiple Choice */}
              {currentQuestion.question_type === 'multiple_choice' && (
                <div className="space-y-3 mb-6">
                  {currentQuestion.options?.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2"
                      style={{
                        borderColor:
                          answers[currentQuestion.id] === index.toString() ? colors.accent : '#E5E7EB',
                        backgroundColor:
                          answers[currentQuestion.id] === index.toString()
                            ? `${colors.accent}15`
                            : 'transparent',
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={index}
                        checked={answers[currentQuestion.id] === index.toString()}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-5 h-5"
                      />
                      <span className="flex-1" style={{ color: colors.text }}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* True/False */}
              {currentQuestion.question_type === 'true_false' && (
                <div className="space-y-3 mb-6">
                  {['True', 'False'].map((value) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2"
                      style={{
                        borderColor: answers[currentQuestion.id] === value ? colors.accent : '#E5E7EB',
                        backgroundColor:
                          answers[currentQuestion.id] === value ? `${colors.accent}15` : 'transparent',
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={value}
                        checked={answers[currentQuestion.id] === value}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-5 h-5"
                      />
                      <span style={{ color: colors.text }}>{value}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Short Answer / Essay */}
              {(currentQuestion.question_type === 'short_answer' || currentQuestion.question_type === 'essay') && (
                <div className="mb-6">
                  <textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder={
                      currentQuestion.question_type === 'essay'
                        ? 'Write your answer here (minimum 5 sentences)...'
                        : 'Write your answer here...'
                    }
                    rows={currentQuestion.question_type === 'essay' ? 6 : 3}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none resize-none"
                    style={{ borderColor: colors.primary }}
                  />
                  {currentQuestion.question_type === 'essay' && (
                    <p className="text-xs text-orange-600 mt-2">
                      ⚠️ Essays will be manually graded by your instructor.
                    </p>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-6 border-t" style={{ borderColor: colors.primary }}>
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                  style={{ backgroundColor: '#6B7280', color: 'white' }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  Previous
                </Button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    {submitting ? 'Submitting...' : 'Submit'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <FontAwesomeIcon icon={faFlag} className="mr-2" />
                    Next
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Question Navigation */}
          <div>
            <Card className="border-2 sticky top-8" style={{ borderColor: colors.primary }}>
              <h3 className="font-bold mb-4" style={{ color: colors.primary }}>
                Questions
              </h3>
              <div className="grid grid-cols-4 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleJumpToQuestion(index)}
                    className="p-2 rounded-lg font-semibold transition-all border-2"
                    style={{
                      backgroundColor:
                        currentQuestionIndex === index
                          ? colors.accent
                          : answers[questions[index].id]
                          ? colors.primary + '30'
                          : '#E5E7EB',
                      borderColor: currentQuestionIndex === index ? colors.accent : '#D1D5DB',
                      color: currentQuestionIndex === index ? 'white' : colors.text,
                    }}
                    title={`Question ${index + 1}${answers[questions[index].id] ? ' (Answered)' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
