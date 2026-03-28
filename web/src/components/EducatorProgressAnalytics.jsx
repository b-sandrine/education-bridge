import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/CommonComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar, 
  faUsers, 
  faCheckCircle, 
  faChartLine,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import {
  BarChart,
  Bar,
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

export const EducatorProgressAnalytics = ({ students, onViewStudentDetails }) => {
  const [analyticsData, setAnalyticsData] = useState({
    totalStudents: 0,
    completionRate: 0,
    averageProgress: 0,
    averageScore: 0,
    chartData: []
  });

  useEffect(() => {
    if (students && students.length > 0) {
      calculateAnalytics();
    }
  }, [students]);

  const calculateAnalytics = () => {
    const totalStudents = students.length;
    const completedCount = students.filter(s => s.status === 'completed').length;
    const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;
    
    const totalProgress = students.reduce((sum, s) => sum + (s.progress || 0), 0);
    const averageProgress = totalStudents > 0 ? Math.round(totalProgress / totalStudents) : 0;
    
    const totalScore = students.reduce((sum, s) => sum + (s.score || 0), 0);
    const averageScore = totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;

    // Sort students by progress for chart
    const sortedStudents = [...students].sort((a, b) => (b.progress || 0) - (a.progress || 0));
    const chartData = sortedStudents.slice(0, 10).map(s => ({
      name: s.firstName || s.name,
      progress: s.progress || 0,
      score: s.score || 0
    }));

    setAnalyticsData({
      totalStudents,
      completionRate,
      averageProgress,
      averageScore,
      chartData
    });
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2" style={{ borderColor: colors.primary }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                {analyticsData.totalStudents}
              </p>
            </div>
            <FontAwesomeIcon icon={faUsers} className="text-4xl" style={{ color: colors.accent, opacity: 0.3 }} />
          </div>
        </Card>

        <Card className="border-2" style={{ borderColor: colors.accent }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold" style={{ color: colors.accent }}>
                {analyticsData.completionRate}%
              </p>
            </div>
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl" style={{ color: colors.accent, opacity: 0.3 }} />
          </div>
        </Card>

        <Card className="border-2" style={{ borderColor: colors.primary }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Progress</p>
              <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                {analyticsData.averageProgress}%
              </p>
            </div>
            <FontAwesomeIcon icon={faChartLine} className="text-4xl" style={{ color: colors.accent, opacity: 0.3 }} />
          </div>
        </Card>

        <Card className="border-2" style={{ borderColor: colors.accent }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Score</p>
              <p className="text-3xl font-bold" style={{ color: colors.accent }}>
                {analyticsData.averageScore}
              </p>
            </div>
            <FontAwesomeIcon icon={faChartBar} className="text-4xl" style={{ color: colors.accent, opacity: 0.3 }} />
          </div>
        </Card>
      </div>

      {/* Progress Chart */}
      {analyticsData.chartData.length > 0 && (
        <Card className="border-2" style={{ borderColor: colors.primary }}>
          <h3 className="text-xl font-bold mb-6" style={{ color: colors.primary }}>
            <FontAwesomeIcon icon={faChartBar} className="mr-2" />
            Student Performance Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={`${colors.primary}30`} />
              <XAxis dataKey="name" tick={{ fill: colors.text }} />
              <YAxis tick={{ fill: colors.text }} />
              <Tooltip 
                contentStyle={{ backgroundColor: colors.background, border: `2px solid ${colors.primary}` }}
                labelStyle={{ color: colors.text }}
              />
              <Legend />
              <Bar dataKey="progress" fill={colors.primary} name="Progress %" />
              <Bar dataKey="score" fill={colors.accent} name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Student List */}
      <Card className="border-2" style={{ borderColor: colors.primary }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
          Student List
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.primary}` }}>
                <th className="text-left p-3" style={{ color: colors.primary }}>Name</th>
                <th className="text-left p-3" style={{ color: colors.primary }}>Email</th>
                <th className="text-left p-3" style={{ color: colors.primary }}>Progress</th>
                <th className="text-left p-3" style={{ color: colors.primary }}>Score</th>
                <th className="text-left p-3" style={{ color: colors.primary }}>Status</th>
                <th className="text-left p-3" style={{ color: colors.primary }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.totalStudents > 0 ? (
                [...new Array(analyticsData.totalStudents)].map((_, idx) => {
                  const student = idx < analyticsData.chartData.length ? analyticsData.chartData[idx] : null;
                  const fullStudent = student ? students.find(s => s.firstName === student.name || s.name === student.name) : null;
                  
                  if (!fullStudent) return null;
                  
                  return (
                    <tr key={fullStudent.id || idx} style={{ borderBottom: `1px solid ${colors.background}` }} className="hover:bg-gray-50">
                      <td className="p-3" style={{ color: colors.text }}>{fullStudent.firstName || fullStudent.name}</td>
                      <td className="p-3 text-gray-600">{fullStudent.email}</td>
                      <td className="p-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${fullStudent.progress || 0}%`,
                              backgroundColor: colors.accent
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold" style={{ color: colors.primary }}>{fullStudent.score || 0}</td>
                      <td className="p-3">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                          style={{
                            backgroundColor: fullStudent.status === 'completed' ? colors.accent : colors.primary
                          }}
                        >
                          {fullStudent.status || 'In Progress'}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="primary"
                          onClick={() => onViewStudentDetails && onViewStudentDetails(fullStudent)}
                          className="text-sm px-3 py-1 text-white rounded"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-600">
                    No students enrolled yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
