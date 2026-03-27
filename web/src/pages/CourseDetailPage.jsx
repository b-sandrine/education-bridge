import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contentAPI, progressAPI } from '../services/api';
import { useAuth } from '../hooks/useAppStore';
import { useNotification } from '../hooks/useNotification';
import { Card, Button } from '../components/CommonComponents';
import { ChatbotInterface } from '../components/ChatbotInterface';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const courseResponse = await contentAPI.getCourse(id);
        setCourse(courseResponse.data.data);
        setLessons(courseResponse.data.data.lessons || []);

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

  if (loading) return <div className="text-center py-8">Loading course...</div>;
  if (!course) return <div className="text-center py-8 text-red-600">Course not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-6 w-full ml-0">
      <Card>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <span className="text-gray-600">Category:</span>
            <p className="font-semibold">{course.category}</p>
          </div>
          <div>
            <span className="text-gray-600">Level:</span>
            <p className="font-semibold">{course.level}</p>
          </div>
          <div>
            <span className="text-gray-600">Duration:</span>
            <p className="font-semibold">{course.duration_weeks} weeks</p>
          </div>
        </div>

        {!progress && token && (
          <Button variant="primary" onClick={handleStartCourse} className="mb-6">
            Start Course
          </Button>
        )}

        {progress && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <p className="text-sm text-gray-600">Progress: {progress.lessons_completed} lessons completed</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(progress.lessons_completed / lessons.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="md:col-span-2">
          {selectedLesson && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">{selectedLesson.title}</h2>
              <div className="prose max-w-none mb-6">{selectedLesson.content}</div>
              {selectedLesson.video_url && (
                <div className="mb-6">
                  <video controls className="w-full rounded">
                    <source src={selectedLesson.video_url} type="video/mp4" />
                  </video>
                </div>
              )}
            </Card>
          )}
          {!selectedLesson && (
            <Card>
              <p className="text-gray-600 text-center py-8">Select a lesson to begin</p>
            </Card>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="text-xl font-bold mb-4">Lessons</h3>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedLesson?.id === lesson.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Lesson {lesson.lesson_order}: {lesson.title}
                </button>
              ))}
            </div>
          </Card>

          {token && <ChatbotInterface courseId={id} courseTitle={course?.title} courseDescription={course?.description} />}
        </div>
      </div>
    </div>
  );
};
