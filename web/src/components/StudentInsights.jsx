import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/CommonComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faUser,
  faEnvelope,
  faChartLine,
  faCheckCircle,
  faStar,
  faBook,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Color scheme
const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A'
};

export const StudentInsights = ({ student, lessons = [], onBack }) => {
  const [lessonProgress, setLessonProgress] = useState([]);

  useEffect(() => {
    if (lessons && lessons.length > 0) {
      // Simulate lesson completion data
      const progress = lessons.map((lesson, idx) => ({
        lessonId: lesson.id,
        title: lesson.title,
        status: idx < Math.floor(lessons.length * (student.progress || 0) / 100) ? 'completed' : 'in-progress',
        completionDate: idx < Math.floor(lessons.length * (student.progress || 0) / 100) 
          ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          : 'Not started',
        score: idx < Math.floor(lessons.length * (student.progress || 0) / 100)
          ? Math.floor(Math.random() * 40 + 60)
          : 0
      }));
      setLessonProgress(progress);
    }
  }, [lessons, student]);

  const completedLessons = lessonProgress.filter(l => l.status === 'completed').length;
  const performanceData = [
    { day: 'Week 1', score: 65 },
    { day: 'Week 2', score: 72 },
    { day: 'Week 3', score: 68 },
    { day: 'Week 4', score: 78 },
    { day: 'Week 5', score: 85 }
  ];

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="secondary"
          onClick={onBack}
          className="px-4 py-2 text-sm rounded font-semibold"
          style={{ backgroundColor: colors.background, color: colors.primary, border: `2px solid ${colors.primary}` }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </Button>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2" style={{ borderColor: colors.primary }}>
          <div className="flex items-start gap-4">
            <div className="text-4xl" style={{ color: colors.accent }}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Student Profile</p>
              <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
                {student.firstName} {student.lastName || ''}
              </h3>
              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <FontAwesomeIcon icon={faEnvelope} />
                {student.email}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-2" style={{ borderColor: colors.accent }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
              <p className="text-3xl font-bold" style={{ color: colors.accent }}>
                {student.progress || 0}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${student.progress || 0}%`,
                    backgroundColor: colors.accent
                  }}
                ></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Overall Score</p>
              <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                {student.score || 0}
              </p>
              <p className="text-xs text-gray-600 mt-3">out of 100</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Over Time */}
      <Card className="border-2" style={{ borderColor: colors.primary }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
          <FontAwesomeIcon icon={faChartLine} className="mr-2" />
          Performance Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${colors.primary}30`} />
            <XAxis dataKey="day" tick={{ fill: colors.text }} />
            <YAxis tick={{ fill: colors.text }} />
            <Tooltip 
              contentStyle={{ backgroundColor: colors.background, border: `2px solid ${colors.primary}` }}
              labelStyle={{ color: colors.text }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke={colors.accent} 
              dot={{ fill: colors.primary, r: 5 }}
              strokeWidth={2}
              name="Weekly Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Lesson by Lesson Breakdown */}
      <Card className="border-2" style={{ borderColor: colors.primary }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
          <FontAwesomeIcon icon={faBook} className="mr-2" />
          Lesson-by-Lesson Breakdown ({completedLessons}/{lessonProgress.length})
        </h3>
        <div className="space-y-3">
          {lessonProgress.map((lesson, idx) => (
            <div key={lesson.lessonId || idx} className="p-3 rounded-lg border-2" style={{ borderColor: lesson.status === 'completed' ? colors.accent : colors.primary, backgroundColor: lesson.status === 'completed' ? `${colors.accent}10` : colors.background }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <FontAwesomeIcon 
                    icon={lesson.status === 'completed' ? faCheckCircle : faBook}
                    style={{
                      color: lesson.status === 'completed' ? colors.accent : colors.primary,
                      fontSize: '1.25rem'
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: colors.text }}>
                      Lesson {idx + 1}: {lesson.title}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <FontAwesomeIcon icon={faCalendar} />
                      {lesson.completionDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{
                      backgroundColor: lesson.status === 'completed' ? colors.accent : colors.primary
                    }}
                  >
                    {lesson.status === 'completed' ? `${lesson.score}%` : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 text-center" style={{ borderColor: colors.accent }}>
          <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3" style={{ color: colors.accent }} />
          <p className="text-sm text-gray-600">Lessons Completed</p>
          <p className="text-3xl font-bold" style={{ color: colors.accent }}>{completedLessons}</p>
        </Card>

        <Card className="border-2 text-center" style={{ borderColor: colors.primary }}>
          <FontAwesomeIcon icon={faStar} className="text-4xl mb-3" style={{ color: colors.primary }} />
          <p className="text-sm text-gray-600">Avg. Lesson Score</p>
          <p className="text-3xl font-bold" style={{ color: colors.primary }}>
            {lessonProgress.length > 0 
              ? Math.round(lessonProgress.reduce((sum, l) => sum + l.score, 0) / completedLessons || 0)
              : 0}%
          </p>
        </Card>

        <Card className="border-2 text-center" style={{ borderColor: colors.accent }}>
          <FontAwesomeIcon icon={faChartLine} className="text-4xl mb-3" style={{ color: colors.accent }} />
          <p className="text-sm text-gray-600">Remaining Lessons</p>
          <p className="text-3xl font-bold" style={{ color: colors.accent }}>{lessonProgress.length - completedLessons}</p>
        </Card>
      </div>
    </div>
  );
};
