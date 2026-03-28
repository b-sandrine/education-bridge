import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faSave,
  faArrowLeft,
  faQuestionCircle,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Card } from './CommonComponents';
import { useNotification } from '../hooks/useNotification';

const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A',
};

export const QuizBuilder = ({ lesson, onSave, onCancel, initialQuiz = null }) => {
  const { showSuccess, showError } = useNotification();
  const [quizTitle, setQuizTitle] = useState(initialQuiz?.title || '');
  const [quizDescription, setQuizDescription] = useState(initialQuiz?.description || '');
  const [passingScore, setPassingScore] = useState(initialQuiz?.passing_score || 70);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(initialQuiz?.time_limit_minutes || null);
  const [shuffleQuestions, setShuffleQuestions] = useState(initialQuiz?.shuffle_questions || false);
  const [questions, setQuestions] = useState(initialQuiz?.questions || []);
  const [loading, setLoading] = useState(false);

  // Add new question
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      questionText: '',
      questionType: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  // Update question
  const updateQuestion = (questionId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    );
  };

  // Update question option
  const updateQuestionOption = (questionId, optionIndex, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = [...q.options];
          updatedOptions[optionIndex] = value;
          return { ...q, options: updatedOptions };
        }
        return q;
      })
    );
  };

  // Delete question
  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  // Handle save
  const handleSave = async () => {
    if (!quizTitle.trim()) {
      showError('Quiz title is required');
      return;
    }

    if (questions.length === 0) {
      showError('Add at least one question');
      return;
    }

    let allValid = true;
    for (const q of questions) {
      if (!q.questionText.trim()) {
        showError('All questions must have text');
        allValid = false;
        break;
      }
      if (!q.correctAnswer) {
        showError('All questions must have a correct answer');
        allValid = false;
        break;
      }
    }

    if (!allValid) return;

    setLoading(true);
    try {
      const quizData = {
        lessonId: lesson.id,
        title: quizTitle,
        description: quizDescription,
        passingScore,
        timeLimitMinutes,
        shuffleQuestions,
        questions,
      };

      await onSave(quizData);
      showSuccess('Quiz saved successfully!');
    } catch (error) {
      showError('Failed to save quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
              <FontAwesomeIcon icon={faQuestionCircle} className="mr-3" />
              {initialQuiz ? 'Edit Quiz' : 'Create New Quiz'}
            </h1>
            <p className="text-gray-600">Lesson: {lesson.title}</p>
          </div>
          <Button
            variant="secondary"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#6B7280', color: 'white' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Cancel
          </Button>
        </div>

        {/* Quiz Settings */}
        <Card className="border-2 mb-8" style={{ borderColor: colors.primary }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
            Quiz Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Quiz Title *
              </label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="e.g., Python Basics Quiz"
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                style={{
                  borderColor: colors.primary,
                  focusBorderColor: colors.accent,
                }}
              />
            </div>

            {/* Passing Score */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Passing Score (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: colors.primary }}
              />
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Time Limit (minutes, leave empty for no limit)
              </label>
              <input
                type="number"
                min="1"
                value={timeLimitMinutes || ''}
                onChange={(e) => setTimeLimitMinutes(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="e.g., 30"
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: colors.primary }}
              />
            </div>

            {/* Shuffle */}
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold" style={{ color: colors.text }}>
                  Shuffle questions for each student
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
              Description (Optional)
            </label>
            <textarea
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              placeholder="Add instructions or context for students..."
              rows="3"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none resize-none"
              style={{ borderColor: colors.primary }}
            />
          </div>
        </Card>

        {/* Questions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>
              Questions ({questions.length})
            </h2>
            <Button
              onClick={addQuestion}
              className="px-4 py-2 rounded-lg text-white font-semibold"
              style={{ backgroundColor: colors.accent }}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Question
            </Button>
          </div>

          {questions.length === 0 ? (
            <Card className="text-center py-12 border-2" style={{ borderColor: colors.primary }}>
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="text-5xl mb-4"
                style={{ color: colors.accent, opacity: 0.5 }}
              />
              <p className="text-gray-600 mb-4">No questions yet. Add one to get started!</p>
              <Button
                onClick={addQuestion}
                className="px-4 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: colors.accent }}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add First Question
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <Card
                  key={question.id}
                  className="border-2"
                  style={{ borderColor: colors.primary }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
                      Question {index + 1}
                    </h3>
                    <Button
                      onClick={() => deleteQuestion(question.id)}
                      className="px-3 py-1 rounded-lg text-white text-sm"
                      style={{ backgroundColor: '#dc2626' }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      Delete
                    </Button>
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                      Question Text *
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                      placeholder="Enter the question..."
                      rows="2"
                      className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none resize-none"
                      style={{ borderColor: colors.primary }}
                    />
                  </div>

                  {/* Question Type and Points */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                        Question Type *
                      </label>
                      <select
                        value={question.questionType}
                        onChange={(e) => updateQuestion(question.id, 'questionType', e.target.value)}
                        className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                        style={{ borderColor: colors.primary }}
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True/False</option>
                        <option value="short_answer">Short Answer</option>
                        <option value="essay">Essay</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                        Points *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                        style={{ borderColor: colors.primary }}
                      />
                    </div>
                  </div>

                  {/* Options */}
                  {(question.questionType === 'multiple_choice' || question.questionType === 'true_false') && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-3" style={{ color: colors.text }}>
                        {question.questionType === 'true_false' ? 'Answer' : 'Options'} *
                      </label>
                      <div className="space-y-2">
                        {question.questionType === 'true_false' ? (
                          <>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === 'true'}
                                onChange={() => updateQuestion(question.id, 'correctAnswer', 'true')}
                                className="w-4 h-4"
                              />
                              <span>True</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === 'false'}
                                onChange={() => updateQuestion(question.id, 'correctAnswer', 'false')}
                                className="w-4 h-4"
                              />
                              <span>False</span>
                            </label>
                          </>
                        ) : (
                          question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-3 items-center">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === optionIndex.toString()}
                                onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex.toString())}
                                className="w-4 h-4"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="flex-1 px-3 py-2 border rounded-lg"
                                style={{ borderColor: colors.primary }}
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Short Answer / Essay */}
                  {(question.questionType === 'short_answer' || question.questionType === 'essay') && (
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>
                        {question.questionType === 'essay' ? 'Sample Answer (for reference)' : 'Correct Answer'} *
                      </label>
                      <textarea
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                        placeholder={
                          question.questionType === 'essay'
                            ? 'Enter a sample answer...'
                            : 'Enter the correct answer...'
                        }
                        rows="2"
                        className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none resize-none"
                        style={{ borderColor: colors.primary }}
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-4 justify-end">
          <Button
            onClick={onCancel}
            className="px-6 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: '#6B7280', color: 'white' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
            style={{ backgroundColor: colors.accent }}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {loading ? 'Saving...' : 'Save Quiz'}
          </Button>
        </div>
      </div>
    </div>
  );
};
