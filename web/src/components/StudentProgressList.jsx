import React, { useEffect, useState } from 'react';
import { progressAPI, contentAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { Card, Button } from './CommonComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const StudentProgressList = ({ courseId, courseLessons = [], canRemoveStudent = false }) => {
  const { showError, showSuccess } = useNotification();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    fetchStudentsProgress();
    fetchAnalytics();
  }, [courseId]);

  const fetchStudentsProgress = async () => {
    try {
      setLoading(true);
      const response = await progressAPI.getStudentsInCourse(courseId);
      setStudents(response.data.data || []);
    } catch (error) {
      showError('Failed to load students progress');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await progressAPI.getCourseAnalytics(courseId);
      setAnalytics(response.data.data);
    } catch (error) {
      // Analytics fetch failed, but not critical
    }
  };

  const handleViewStudentDetails = async (student) => {
    try {
      const response = await progressAPI.getStudentCourseProgress(courseId, student.user_id);
      setStudentDetails(response.data.data);
      setSelectedStudent(student);
    } catch (error) {
      showError('Failed to load student details');
    }
  };

  const handleRemoveStudent = async (studentId, studentName) => {
    if (!window.confirm(`Remove ${studentName} from this course?`)) return;

    try {
      await contentAPI.removeStudent(courseId, studentId);
      showSuccess('Student removed from course successfully!');
      fetchStudentsProgress();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to remove student');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (lessonsCompleted) => {
    if (courseLessons.length === 0) return 0;
    return Math.round((lessonsCompleted / courseLessons.length) * 100);
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">Loading student progress...</div>
      </Card>
    );
  }

  if (selectedStudent && studentDetails) {
    return (
      <div className="space-y-4">
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedStudent(null);
            setStudentDetails(null);
          }}
          className="mb-4"
        >
          ← Back to All Students
        </Button>

        <Card>
          <h3 className="text-2xl font-bold mb-6">{selectedStudent.first_name} {selectedStudent.last_name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-semibold">{selectedStudent.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <p className={`font-semibold px-3 py-1 rounded inline-block text-sm ${getStatusColor(studentDetails?.status)}`}>
                {studentDetails?.status || 'not_started'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Score</p>
              <p className="font-semibold">{studentDetails?.score || 0}%</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-2">Progress: {studentDetails?.lessons_completed || 0} / {courseLessons.length} lessons</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{
                  width: `${getProgressPercentage(studentDetails?.lessons_completed || 0)}%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Lesson Progress</h4>
            <div className="space-y-2">
              {courseLessons.map((lesson, idx) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Lesson {lesson.lesson_order}: {lesson.title}</span>
                  <div className={`px-3 py-1 rounded text-xs font-semibold ${
                    idx < (studentDetails?.lessons_completed || 0)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {idx < (studentDetails?.lessons_completed || 0) ? '✓ Done' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {analytics && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-3xl font-bold">{analytics.totalStudents}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600">{analytics.completionRate}%</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Avg Progress</p>
              <p className="text-3xl font-bold text-blue-600">{analytics.averageProgress}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Avg Score</p>
              <p className="text-3xl font-bold text-indigo-600">{analytics.averageScore}%</p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-xl font-bold mb-4">Students ({students.length})</h3>
        
        {students.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No students enrolled yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Progress</th>
                  <th className="text-left py-3 px-4 font-semibold">Score</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Action</th>
                  {canRemoveStudent && (
                    <th className="text-center py-3 px-4 font-semibold">Remove</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{student.first_name} {student.last_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{student.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${getProgressPercentage(student.lessons_completed)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {student.lessons_completed}/{courseLessons.length}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{student.score || 0}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(student.status)}`}>
                        {student.status === 'in_progress' ? 'In Progress' : 'Completed'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleViewStudentDetails(student)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        View Details
                      </button>
                    </td>
                    {canRemoveStudent && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleRemoveStudent(student.user_id, `${student.first_name} ${student.last_name}`)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm flex items-center justify-center gap-1"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
