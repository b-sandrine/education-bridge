import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, Target, AlertCircle, BookOpen } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const StudentAnalyticsPage = () => {
  const { courseId } = useParams();
  const [weakAreas, setWeakAreas] = useState([]);
  const [topicMastery, setTopicMastery] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [examReadiness, setExamReadiness] = useState(null);
  const [learningVelocity, setLearningVelocity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [courseId]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [
        weakAreasRes,
        masteryRes,
        recommendationsRes,
        readinessRes,
        velocityRes,
      ] = await Promise.all([
        api.get(`/learner-analytics/weak-areas/${courseId}`),
        api.get(`/learner-analytics/topic-mastery/${courseId}`),
        api.get(`/learner-analytics/recommendations/${courseId}`),
        api.get(`/learner-analytics/exam-readiness/${courseId}`),
        api.get(`/learner-analytics/learning-velocity/${courseId}`),
      ]);

      setWeakAreas(weakAreasRes.data.data || []);
      setTopicMastery(masteryRes.data.data || []);
      setRecommendations(recommendationsRes.data.data || []);
      setExamReadiness(readinessRes.data.data || {});
      setLearningVelocity(velocityRes.data.data || {});
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  const getReadinessColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getReadinessLabel = (score) => {
    if (score >= 80) return 'Ready';
    if (score >= 60) return 'Nearly Ready';
    return 'Needs Preparation';
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed analysis of your progress and performance</p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error loading analytics</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Exam Readiness Card */}
      {examReadiness && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Exam Readiness</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" style={{ overflow: 'visible' }}>
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={getReadinessColor(examReadiness.readiness_score || 0)}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${((examReadiness.readiness_score || 0) / 100) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">
                      {examReadiness.readiness_score || 0}%
                    </p>
                  </div>
                </div>
              </div>
              <p className="font-semibold text-gray-900 text-lg">
                {getReadinessLabel(examReadiness.readiness_score || 0)}
              </p>
              <p className="text-sm text-gray-500 mt-2">For this course</p>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Quizzes Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {examReadiness.quizzes_completed || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {examReadiness.average_score || 0}%
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Learning Velocity</p>
                <p className="text-2xl font-bold text-green-600">
                  {examReadiness.learning_velocity || '0'}%
                </p>
                <p className="text-xs text-gray-500 mt-1">week-over-week improvement</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time to Mastery</p>
                <p className="text-lg font-bold text-gray-900">
                  {examReadiness.estimated_completion_days || 'N/A'} days
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weak Areas */}
      {weakAreas.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            Areas for Improvement
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weakAreas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="avg_score" fill="#ef4444" name="Average Score" />
              <Bar dataKey="target_score" fill="#10b981" name="Target Score" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {weakAreas.map((area, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">{area.topic}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Current Score: <span className="font-bold text-red-600">{area.avg_score}%</span>
                </p>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${area.avg_score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic Mastery */}
      {topicMastery.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Topic Mastery Levels
          </h2>
          <div className="space-y-4">
            {topicMastery.map((topic, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <p className="font-medium text-gray-900">{topic.topic}</p>
                  <p className="text-sm font-semibold text-gray-600">
                    {topic.mastery_percentage}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      topic.mastery_percentage >= 80
                        ? 'bg-green-500'
                        : topic.mastery_percentage >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${topic.mastery_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Personalized Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900">{rec.title}</p>
                    <p className="text-sm text-gray-700 mt-1">{rec.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {rec.topics && rec.topics.map((topic, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors whitespace-nowrap">
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Velocity */}
      {learningVelocity && learningVelocity.trend_data && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Trajectory</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={learningVelocity.trend_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="average_score"
                stroke="#3b82f6"
                name="Average Score"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#10b981"
                name="Trend"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StudentAnalyticsPage;
