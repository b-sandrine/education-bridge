import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentAPI, progressAPI, quizAPI } from '../services/api';
import { useAuth } from '../hooks/useAppStore';
import { useNotification } from '../hooks/useNotification';
import { Card, Button } from '../components/CommonComponents';
import { ChatbotInterface } from '../components/ChatbotInterface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCheckCircle, faLock, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// Color scheme
const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A'
};

export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' or 'quizzes'

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const courseResponse = await contentAPI.getCourse(id);
        setCourse(courseResponse.data.data);
        setLessons(courseResponse.data.data.lessons || []);

        // Fetch quizzes for the course
        try {
          const quizzesResponse = await quizAPI.getAllQuizzes({ courseId: id });
          setQuizzes(quizzesResponse.data.data || []);
        } catch (err) {
          console.warn('Failed to fetch quizzes:', err);
          setQuizzes([]);
        }

        if (token) {
          try {
            const progressResponse = await progressAPI.getCourseProgress(id);
            setProgress(progressResponse.data.data);
          } catch (progressError) {
            // If progress doesn't exist, that's fine - user hasn't started course yet
            setProgress(null);
          }
        }
      } catch (error) {
        showError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, token]);

  const handleStartCourse = async () => {
    try {
      const response = await progressAPI.startCourse(id);
      setProgress(response.data.data);
      showSuccess('Course started!');
    } catch (error) {
      showError('Failed to start course');
    }
  };

  if (loading) return <div className="text-center py-8" style={{ color: colors.text }}>Loading course...</div>;
  if (!course) return <div className="text-center py-8" style={{ color: colors.accent }}>Course not found</div>;

  return (
    <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
      <Card className="border-2" style={{ borderColor: colors.primary }}>
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faBook} className="text-2xl" style={{ color: colors.accent }} />
            <h1 className="text-4xl font-bold" style={{ color: colors.primary }}>{course.title}</h1>
          </div>
          <p className="text-gray-600 mb-6">{course.description}</p>

        <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: `${colors.background}` }}>
          <div>
            <span className="text-gray-600 text-sm">Category:</span>
            <p className="font-semibold" style={{ color: colors.primary }}>{course.category}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Level:</span>
            <p className="font-semibold" style={{ color: colors.primary }}>{course.level}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Duration:</span>
            <p className="font-semibold" style={{ color: colors.primary }}>{course.duration_weeks} weeks</p>
          </div>
        </div>

        {!progress && token && (
          <Button variant="primary" onClick={handleStartCourse} className="mb-6 px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg text-white"
            style={{ backgroundColor: colors.accent }}>
            Start Course
          </Button>
        )}

        {progress && (
          <div className="border-2 rounded-lg p-4 mb-6" style={{ borderColor: colors.primary, backgroundColor: `${colors.primary}15` }}>
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faCheckCircle} style={{ color: colors.accent }} />
              <p className="text-sm font-semibold" style={{ color: colors.primary }}>Progress: {progress.lessons_completed} of {lessons.length} lessons completed</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${(progress.lessons_completed / lessons.length) * 100}%`,
                  backgroundColor: colors.accent
                }}
              ></div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="md:col-span-2">
          {selectedLesson && (
            <Card className="border-2" style={{ borderColor: colors.primary }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>{selectedLesson.title}</h2>
              <div className="prose max-w-none mb-6 text-gray-700">{selectedLesson.content}</div>
              {selectedLesson.video_url && (
                <div className="mb-6 rounded-lg overflow-hidden border-2" style={{ borderColor: colors.accent }}>
                  <video controls className="w-full" style={{ backgroundColor: '#000' }}>
                    <source src={selectedLesson.video_url} type="video/mp4" />
                  </video>
                </div>
              )}
            </Card>
          )}
          {!selectedLesson && (
            <Card className="border-2 text-center py-12" style={{ borderColor: colors.primary, backgroundColor: `${colors.primary}08` }}>
              <FontAwesomeIcon icon={faBook} className="text-4xl mb-4" style={{ color: colors.accent }} />
              <p className="text-gray-600">Select a lesson to begin</p>
            </Card>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-2" style={{ borderColor: colors.primary }}>
            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b-2 flex-wrap" style={{ borderColor: colors.primary }}>
              <button
                onClick={() => setActiveTab('lessons')}
                className="px-4 py-2 font-semibold transition-all border-b-2 uppercase text-sm"
                style={{
                  borderBottomColor: activeTab === 'lessons' ? colors.accent : 'transparent',
                  color: activeTab === 'lessons' ? colors.accent : colors.text,
                  backgroundColor: activeTab === 'lessons' ? `${colors.accent}10` : 'transparent'
                }}
              >
                <FontAwesomeIcon icon={faBook} className="mr-2" />
                Lessons ({lessons.length})
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className="px-4 py-2 font-semibold transition-all border-b-2 uppercase text-sm"
                style={{
                  borderBottomColor: activeTab === 'quizzes' ? colors.accent : 'transparent',
                  color: activeTab === 'quizzes' ? colors.accent : colors.text,
                  backgroundColor: activeTab === 'quizzes' ? `${colors.accent}10` : 'transparent'
                }}
              >
                <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                Quizzes ({quizzes.length})
              </button>
            </div>

            {/* Lessons Tab */}
            {activeTab === 'lessons' && (
              <div className="space-y-2">
                {lessons.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No lessons available</p>
                ) : (
                  lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left p-3 rounded-lg transition-all font-semibold border-2 ${
                        selectedLesson?.id === lesson.id
                          ? 'text-white shadow-lg'
                          : 'hover:shadow-md'
                      }`}
                      style={{
                        backgroundColor: selectedLesson?.id === lesson.id ? colors.primary : colors.background,
                        borderColor: selectedLesson?.id === lesson.id ? colors.accent : colors.primary,
                        color: selectedLesson?.id === lesson.id ? 'white' : colors.text
                      }}
                    >
                      <FontAwesomeIcon icon={faBook} className="mr-2" />
                      Lesson {lesson.lesson_order}: {lesson.title}
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
              <div className="space-y-2">
                {quizzes.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No quizzes available for this course</p>
                ) : (
                  quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-3 rounded-lg border-2 transition-all hover:shadow-md"
                      style={{
                        borderColor: colors.primary,
                        backgroundColor: colors.background
                      }}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-grow">
                          <h4 className="font-semibold" style={{ color: colors.primary }}>
                            <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                            {quiz.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">{quiz.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-600">
                            <span>Q: {quiz.questions?.length || 0}</span>
                            <span>Pass: {quiz.passing_score}%</span>
                            {quiz.time_limit_minutes && <span>Time: {quiz.time_limit_minutes}m</span>}
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          onClick={() => navigate(`/quizzes/${quiz.id}`)}
                          className="text-sm px-3 py-2 rounded-lg font-semibold text-white whitespace-nowrap transition-all hover:shadow-lg"
                          style={{ backgroundColor: colors.accent }}
                        >
                          <FontAwesomeIcon icon={faQuestionCircle} className="mr-1" />
                          Take Quiz
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>

          {token && <ChatbotInterface courseId={id} courseTitle={course?.title} courseDescription={course?.description} />}
        </div>
      </div>
    </div>
  );
};
