import React, { useEffect, useState } from 'react';
import { useAuth, useProgress } from '../hooks/useAppStore';
import { progressAPI, contentAPI, quizAPI } from '../services/api';
import { useDispatch } from 'react-redux';
import { useNotification } from '../hooks/useNotification';
import { fetchProgressSuccess } from '../store/progressSlice';
import { Card } from '../components/CommonComponents';
import { calculateProgress } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCheckCircle, faClock, faGraduationCap, faArrowRight, faStar, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import StudentGamification from '../components/StudentGamification';

// Color scheme
const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A'
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const { userProgress } = useProgress();
  const dispatch = useDispatch();
  const { showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [coursesData, setCoursesData] = useState({});
  const [quizzesData, setQuizzesData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch student progress
        const progressResponse = await progressAPI.getUserProgress();
        dispatch(fetchProgressSuccess(progressResponse.data.data));

        // Fetch all courses to get course details
        const coursesResponse = await contentAPI.getAllCourses();
        const courses = coursesResponse.data.data || [];
        
        // Map courses by ID for quick lookup
        const courseMap = {};
        courses.forEach(course => {
          courseMap[course.id] = course;
        });

        // Fetch quizzes for each course
        const quizzesMap = {};
        for (const course of courses) {
          try {
            const quizzesResponse = await quizAPI.getAllQuizzes({ courseId: course.id });
            quizzesMap[course.id] = (quizzesResponse.data.data || []).length;
          } catch (err) {
            console.warn(`Failed to fetch quizzes for course ${course.id}:`, err);
            quizzesMap[course.id] = 0;
          }
        }
        setQuizzesData(quizzesMap);
        setCoursesData(courseMap);
      } catch (error) {
        console.error('Failed to load data:', error);
        showError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12" style={{ backgroundColor: colors.background }}>
        <p style={{ color: colors.primary }} className="font-semibold">Loading your dashboard...</p>
      </div>
    );
  }

  const completedCourses = userProgress.filter(p => p.status === 'completed').length;
  const inProgressCourses = userProgress.filter(p => p.status === 'in_progress').length;

  return (
    <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
            <FontAwesomeIcon icon={faGraduationCap} className="mr-3" />
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-600">Track your learning progress and continue your courses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2" style={{ borderColor: colors.primary, backgroundColor: `${colors.primary}10` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1 font-semibold">Total Courses</p>
                <p className="text-4xl font-bold" style={{ color: colors.primary }}>{userProgress.length}</p>
              </div>
              <FontAwesomeIcon icon={faBook} className="text-5xl" style={{ color: colors.accent, opacity: 0.2 }} />
            </div>
          </Card>

          <Card className="border-2" style={{ borderColor: colors.accent, backgroundColor: `${colors.accent}10` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1 font-semibold">In Progress</p>
                <p className="text-4xl font-bold" style={{ color: colors.accent }}>{inProgressCourses}</p>
              </div>
              <FontAwesomeIcon icon={faClock} className="text-5xl" style={{ color: colors.accent, opacity: 0.2 }} />
            </div>
          </Card>

          <Card className="border-2" style={{ borderColor: colors.primary, backgroundColor: `${colors.primary}10` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1 font-semibold">Completed</p>
                <p className="text-4xl font-bold" style={{ color: colors.primary }}>{completedCourses}</p>
              </div>
              <FontAwesomeIcon icon={faCheckCircle} className="text-5xl" style={{ color: colors.accent, opacity: 0.2 }} />
            </div>
          </Card>
        </div>

        {/* Gamification Section */}
        {userProgress.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>
              🏆 Your Achievements
            </h2>
            <StudentGamification 
              studentId={user?.id} 
              courseId={userProgress[0]?.course_id}
            />
          </div>
        )}

        {/* Your Courses Section */}
        <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>
          <FontAwesomeIcon icon={faBook} className="mr-2" />
          Your Courses
        </h2>

        {userProgress.length === 0 ? (
          <Card className="border-2 text-center py-12" style={{ borderColor: colors.primary }}>
            <FontAwesomeIcon icon={faBook} className="text-5xl mb-4" style={{ color: colors.accent, opacity: 0.5 }} />
            <p className="text-gray-600 mb-4">No courses yet. Start learning!</p>
            <Link
              to="/courses"
              className="inline-block px-6 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: colors.accent }}
            >
              Browse Courses
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProgress.map((progress) => {
              const course = coursesData[progress.course_id];
              
              return (
                <Link key={progress.id} to={`/courses/${progress.course_id}`}>
                  <Card className="border-2 h-full flex flex-col hover:shadow-lg transition-all cursor-pointer" style={{ borderColor: colors.primary }}>
                    {/* Course Header */}
                    <div cla className="flex justify-between">
                          <div>
                            <span className="text-gray-600">Category:</span>
                            <span className="ml-2 font-semibold" style={{ color: colors.primary }}>{course.category}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Quizzes:</span>
                            <span className="ml-2 font-semibold" style={{ color: colors.accent }}>
                              <FontAwesomeIcon icon={faQuestionCircle} className="mr-1" />
                              {quizzesData[progress.course_id] || 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <span className="text-gray-600">Level:</span>
                            <span className="ml-2 font-semibold capitalize" style={{ color: colors.accent }}>{course.level}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Lessons:</span>
                            <span className="ml-2 font-semibold" style={{ color: colors.primary }}>
                              <FontAwesomeIcon icon={faBook} className="mr-1" />
                              {course.lessons?.length || 0}
                            </span>
                          </div>
                      </div>

                    {/* Course Metadata */}
                    {course && (
                      <div className="space-y-2 text-sm mb-4 p-3 rounded" style={{ backgroundColor: colors.background }}>
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <span className="ml-2 font-semibold" style={{ color: colors.primary }}>{course.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Level:</span>
                          <span className="ml-2 font-semibold capitalize" style={{ color: colors.accent }}>{course.level}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="ml-2 font-semibold" style={{ color: colors.primary }}>{course.duration_weeks} weeks</span>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{
                          backgroundColor: progress.status === 'completed' ? colors.accent : colors.primary
                        }}
                      >
                        <FontAwesomeIcon icon={progress.status === 'completed' ? faCheckCircle : faClock} className="mr-1" />
                        {progress.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                      {progress.status === 'completed' && (
                        <span className="text-yellow-500">
                          <FontAwesomeIcon icon={faStar} />
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="flex-1 mt-auto">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold" style={{ color: colors.text }}>
                          {progress.lessons_completed} of {course?.lessons?.length || 0} lessons completed
                        </p>
                        <p className="text-sm font-bold" style={{ color: colors.accent }}>
                          {course?.lessons?.length ? Math.round((progress.lessons_completed / course.lessons.length) * 100) : 0}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{
                            width: `${course?.lessons?.length ? Math.round((progress.lessons_completed / course.lessons.length) * 100) : 0}%`,
                            backgroundColor: colors.accent
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.primary }}>
                      <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-md" style={{ backgroundColor: colors.primary }}>
                        {progress.status === 'completed' ? (
                          <>
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Review Course
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faArrowRight} />
                            Continue Learning
                          </>
                        )}
                      </button>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
