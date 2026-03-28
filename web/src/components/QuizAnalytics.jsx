import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faBarChart,
  faUsers,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { Card, Button } from './CommonComponents';
import { quizAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A',
};

export const QuizAnalytics = ({ quiz, courseId, onBack }) => {
  const { showError } = useNotification();
  const [analytics, setAnalytics] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, [quiz.id, courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, resultsRes] = await Promise.all([
        quizAPI.getCourseQuizzesAnalytics(courseId),
        quizAPI.getQuizResults(quiz.id),
      ]);

      // Filter analytics for current quiz
      const quizAnalytics = analyticsRes.data.data?.find((a) => a.id === quiz.id);
      setAnalytics(quizAnalytics);

      setQuizResults(resultsRes.data.data || []);
    } catch (error) {
      showError('Failed to load quiz analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!quizResults || quizResults.length === 0) {
      showError('No results to export');
      return;
    }

    const headers = ['Student Name', 'Email', 'Score', 'Max Score', 'Percentage', 'Status', 'Time (sec)', 'Date'];
    const rows = quizResults.map((r) => [
      `${r.first_name} ${r.last_name}`,
      r.email,
      r.score,
      r.max_score,
      `${r.percentage_score}%`,
      r.passed ? 'Passed' : 'Failed',
      r.time_taken_seconds,
      new Date(r.created_at).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `${quiz.title}-results.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="text-center py-12" style={{ color: colors.primary }}>
        Loading analytics...
      </div>
    );
  }

  const studentAttempts = quizResults.length;
  const passedCount = quizResults.filter((r) => r.passed).length;
  const avgScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((sum, r) => sum + r.percentage_score, 0) / quizResults.length)
    : 0;

  // Prepare chart data
  const scoreDistribution = [
    { range: '0-20%', count: quizResults.filter((r) => r.percentage_score < 20).length },
    { range: '20-40%', count: quizResults.filter((r) => r.percentage_score >= 20 && r.percentage_score < 40).length },
    { range: '40-60%', count: quizResults.filter((r) => r.percentage_score >= 40 && r.percentage_score < 60).length },
    { range: '60-80%', count: quizResults.filter((r) => r.percentage_score >= 60 && r.percentage_score < 80).length },
    { range: '80-100%', count: quizResults.filter((r) => r.percentage_score >= 80).length },
  ];

  return (
    <div className="min-h-screen py-8 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
              <FontAwesomeIcon icon={faChartBar} className="mr-3" />
              Quiz Analytics
            </h1>
            <p className="text-gray-600">{quiz.title}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-lg text-white font-semibold"
              style={{ backgroundColor: colors.accent }}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={onBack}
              className="px-4 py-2 rounded-lg font-semibold"
              style={{ backgroundColor: '#6B7280', color: 'white' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2" style={{ borderColor: colors.primary, backgroundColor: `${colors.primary}10` }}>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-4xl"
                style={{ color: colors.accent, opacity: 0.7 }}
              />
              <div>
                <p className="text-gray-600 text-sm font-semibold">Attempts</p>
                <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                  {studentAttempts}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-2" style={{ borderColor: '#10b981', backgroundColor: '#ecfdf515' }}>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-4xl" style={{ color: '#10b981' }} />
              <div>
                <p className="text-gray-600 text-sm font-semibold">Passed</p>
                <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                  {passedCount}
                  <span className="text-sm text-gray-500 ml-2">
                    ({studentAttempts > 0 ? Math.round((passedCount / studentAttempts) * 100) : 0}%)
                  </span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-2" style={{ borderColor: '#ef4444', backgroundColor: '#fee2e215' }}>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faTimesCircle} className="text-4xl" style={{ color: '#ef4444' }} />
              <div>
                <p className="text-gray-600 text-sm font-semibold">Failed</p>
                <p className="text-3xl font-bold" style={{ color: '#ef4444' }}>
                  {studentAttempts - passedCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-2" style={{ borderColor: colors.accent, backgroundColor: `${colors.accent}10` }}>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faBarChart}
                className="text-4xl"
                style={{ color: colors.accent, opacity: 0.7 }}
              />
              <div>
                <p className="text-gray-600 text-sm font-semibold">Avg Score</p>
                <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                  {avgScore}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Distribution */}
          <Card className="border-2" style={{ borderColor: colors.primary }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: colors.primary }}>
              Score Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={colors.accent} radius={[8, 8, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pass/Fail Breakdown */}
          <Card className="border-2" style={{ borderColor: colors.primary }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: colors.primary }}>
              Pass/Fail Breakdown
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#10b981' }} />
                    <span className="font-semibold">Passed</span>
                  </span>
                  <span className="font-bold" style={{ color: '#10b981' }}>
                    {passedCount} ({studentAttempts > 0 ? Math.round((passedCount / studentAttempts) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${studentAttempts > 0 ? (passedCount / studentAttempts) * 100 : 0}%`,
                      backgroundColor: '#10b981',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#ef4444' }} />
                    <span className="font-semibold">Failed</span>
                  </span>
                  <span className="font-bold" style={{ color: '#ef4444' }}>
                    {studentAttempts - passedCount} (
                    {studentAttempts > 0 ? Math.round(((studentAttempts - passedCount) / studentAttempts) * 100) : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${
                        studentAttempts > 0 ? ((studentAttempts - passedCount) / studentAttempts) * 100 : 0
                      }%`,
                      backgroundColor: '#ef4444',
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Table */}
        <Card className="border-2" style={{ borderColor: colors.primary }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: colors.primary }}>
            Student Results ({quizResults.length})
          </h2>

          {quizResults.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No results yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.primary}` }}>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: colors.primary }}>
                      Student
                    </th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: colors.primary }}>
                      Score
                    </th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: colors.primary }}>
                      Percentage
                    </th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: colors.primary }}>
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: colors.primary }}>
                      Time (min)
                    </th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: colors.primary }}>
                      Attempt
                    </th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: colors.primary }}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((result, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: `1px solid ${colors.background}`,
                        backgroundColor: index % 2 === 0 ? 'transparent' : `${colors.background}50`,
                      }}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold">{result.first_name} {result.last_name}</p>
                          <p className="text-xs text-gray-500">{result.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {result.score}/{result.max_score}
                      </td>
                      <td className="py-3 px-4 font-semibold" style={{ color: colors.accent }}>
                        {result.percentage_score}%
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold text-white"
                          style={{
                            backgroundColor: result.passed ? '#10b981' : '#ef4444',
                          }}
                        >
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {Math.round(result.time_taken_seconds / 60)}
                      </td>
                      <td className="py-3 px-4">#{result.attempt_number}</td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {new Date(result.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QuizAnalytics;
