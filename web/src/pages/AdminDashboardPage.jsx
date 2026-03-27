import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Input, Alert } from '../components/CommonComponents';
import { contentAPI, authAPI, queryAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar, 
  faBook, 
  faUsers, 
  faChartLine, 
  faTrash, 
  faPlus,
  faMinusCircle,
  faPieChart,
  faEnvelope,
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const AdminDashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [queries, setQueries] = useState([]);
  const [unenrolledStudents, setUnenrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'courses' || activeTab === 'overview') {
        const coursesResponse = await contentAPI.getAllCourses();
        setCourses(coursesResponse.data.data || []);
      }

      if (activeTab === 'users' || activeTab === 'overview') {
        try {
          const usersResponse = await authAPI.getAllUsers();
          setUsers(usersResponse.data.data || []);
        } catch (err) {
          const message = err.response?.data?.message || 'Failed to fetch users';
          showError(message);
          setUsers([]);
        }
      }

      // Fetch enrollment data for charts
      if (activeTab === 'overview') {
        try {
          const enrollResponse = await contentAPI.getEnrollmentStats();
          setEnrollmentData(enrollResponse.data.data || []);
        } catch (err) {
          console.log('Enrollment stats not available');
        }
      }

      // Fetch student queries
      if (activeTab === 'queries') {
        try {
          const queriesResponse = await queryAPI.getAdminQueries();
          setQueries(queriesResponse.data.data || []);
        } catch (err) {
          const message = err.response?.data?.message || 'Failed to fetch queries';
          showError(message);
          setQueries([]);
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch data';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnenrolledStudents = async (courseId) => {
    try {
      const response = await contentAPI.getUnenrolledStudents(courseId);
      setUnenrolledStudents(response.data.data || []);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch unenrolled students');
      setUnenrolledStudents([]);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await contentAPI.deleteCourse(courseId);
      showSuccess('Course deleted successfully!');
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}?`)) return;

    try {
      await authAPI.updateUserRole(userId, newRole);
      showSuccess('User role updated successfully!');
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user ${userName}? This action cannot be undone.`)) return;

    try {
      await authAPI.deleteUser(userId);
      showSuccess('User deleted successfully!');
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleEnrollStudent = async () => {
    if (!selectedStudent || !selectedCourse) {
      showError('Please select both a student and a course');
      return;
    }

    try {
      await contentAPI.enrollStudent(selectedCourse, selectedStudent);
      showSuccess('Student enrolled in course successfully!');
      setShowEnrollModal(false);
      setSelectedStudent(null);
      setUnenrolledStudents([]);
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to enroll student');
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedStudent(null);
    fetchUnenrolledStudents(courseId);
  };

  const handleRespondToQuery = async (id, response) => {
    try {
      await queryAPI.respondToQuery(id, { response, status: 'resolved' });
      showSuccess('Query responded to successfully!');
      setSelectedQuery(null);
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to respond to query');
    }
  };

  const handleRemoveStudent = async (courseId, studentId, studentName) => {
    if (!window.confirm(`Remove ${studentName} from this course?`)) return;

    try {
      await contentAPI.removeStudent(courseId, studentId);
      showSuccess('Student removed from course successfully!');
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to remove student');
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter students only
  const students = users.filter((u) => u.role === 'student');

  const studentCount = users.filter((u) => u.role === 'student').length;
  const educatorCount = users.filter((u) => u.role === 'educator').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  // Prepare chart data
  const userRoleData = [
    { name: 'Students', value: studentCount, fill: '#10b981' },
    { name: 'Educators', value: educatorCount, fill: '#3b82f6' },
    { name: 'Admins', value: adminCount, fill: '#ef4444' },
  ].filter(item => item.value > 0);

  const courseLevelData = [
    { level: 'Beginner', count: courses.filter(c => c.level === 'beginner').length },
    { level: 'Intermediate', count: courses.filter(c => c.level === 'intermediate').length },
    { level: 'Advanced', count: courses.filter(c => c.level === 'advanced').length },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-6 w-full ml-0">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FontAwesomeIcon icon={faChartBar} className="text-red-600" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600">System administration and monitoring</p>
      </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {['overview', 'courses', 'users', 'enrollments', 'queries'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchTerm('');
              }}
              className={`px-4 py-2 rounded-md font-medium transition flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon 
                icon={tab === 'courses' ? faBook : tab === 'queries' ? faEnvelope : faUsers} 
              />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab with Charts */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-5 mb-8">
              <Card className="bg-white px-6 py-4 hover:shadow-lg transition-shadow">
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
              </Card>
              <Card className="bg-white px-6 py-4 hover:shadow-lg transition-shadow">
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-600">{users.length}</p>
              </Card>
              <Card className="bg-white px-6 py-4 hover:shadow-lg transition-shadow">
                <p className="text-gray-600 text-sm">Students</p>
                <p className="text-3xl font-bold text-green-600">{studentCount}</p>
              </Card>
              <Card className="bg-white px-6 py-4 hover:shadow-lg transition-shadow">
                <p className="text-gray-600 text-sm">Educators</p>
                <p className="text-3xl font-bold text-blue-600">{educatorCount}</p>
              </Card>
              <Card className="bg-white px-6 py-4 hover:shadow-lg transition-shadow">
                <p className="text-gray-600 text-sm">Admins</p>
                <p className="text-3xl font-bold text-red-600">{adminCount}</p>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              {/* User Role Distribution */}
              <Card className="bg-white p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPieChart} className="text-purple-600" />
                  User Distribution
                </h3>
                {userRoleData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userRoleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">No user data available</p>
                )}
              </Card>

              {/* Course Level Distribution */}
              <Card className="bg-white p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartLine} className="text-green-600" />
                  Courses by Level
                </h3>
                {courseLevelData.some(d => d.count > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={courseLevelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">No course data available</p>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search courses by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <Card className="text-center py-12">
                <p className="text-gray-600">Loading courses...</p>
              </Card>
            ) : filteredCourses.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600">No courses found</p>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg overflow-hidden shadow">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{course.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{course.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                          {course.level}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {course.duration_weeks} weeks
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-sm flex items-center gap-1 justify-end"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <Card className="text-center py-12">
                <p className="text-gray-600">Loading users...</p>
              </Card>
            ) : filteredUsers.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600">No users found</p>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg overflow-hidden shadow">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Role
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              u.role === 'educator'
                                ? 'bg-blue-100 text-blue-800'
                                : u.role === 'admin'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                              className="text-sm px-2 py-1 border border-gray-300 rounded"
                              disabled={user.id === u.id}
                              title={user.id === u.id ? 'Cannot change your own role' : ''}
                            >
                              <option value="student">Student</option>
                              <option value="educator">Educator</option>
                              <option value="admin">Admin</option>
                            </select>
                            {user.id !== u.id && (
                              <Button
                                variant="danger"
                                onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}
                                className="text-sm flex items-center gap-1"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                                Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Enrollments Tab */}
        {activeTab === 'enrollments' && (
          <div>
            <div className="mb-6">
              <Button
                variant="primary"
                onClick={() => {
                  setShowEnrollModal(true);
                  setSelectedCourse(null);
                  setSelectedStudent(null);
                  setUnenrolledStudents([]);
                }}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} />
                Enroll Students
              </Button>
            </div>

            {loading ? (
              <Card className="text-center py-12">
                <p className="text-gray-600">Loading enrollments...</p>
              </Card>
            ) : courses.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600">No courses available</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                    <div className="space-y-2 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Category:</span>
                        <span className="ml-2 text-gray-600">{course.category}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Level:</span>
                        <span className="ml-2 text-gray-600 capitalize">{course.level}</span>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => handleCourseSelect(course.id)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      Enroll Students
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Queries Tab */}
        {activeTab === 'queries' && (
          <div>
            {loading ? (
              <Card className="text-center py-12">
                <p className="text-gray-600">Loading queries...</p>
              </Card>
            ) : queries.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600">No student queries yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {queries.map((query) => (
                  <Card key={query.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{query.subject}</p>
                        <p className="text-sm text-gray-600">
                          From: {query.student_first_name} {query.student_last_name} ({query.student_email})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon 
                          icon={query.status === 'resolved' ? faCheckCircle : faExclamationCircle}
                          className={query.status === 'resolved' ? 'text-green-600' : 'text-orange-600'}
                        />
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          query.status === 'resolved' 
                            ? 'bg-green-100 text-green-800'
                            : query.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 bg-gray-50 p-4 rounded">{query.message}</p>
                    {query.response && (
                      <div className="mb-4 bg-green-50 p-4 rounded border-l-4 border-green-600">
                        <p className="text-sm font-semibold text-green-900 mb-1">Your Response:</p>
                        <p className="text-gray-700">{query.response}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => setSelectedQuery(query)}
                        className="flex-1"
                      >
                        {query.response ? 'View Details' : 'Respond'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="text-blue-600" />
              Enroll Student in Course
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course
                </label>
                <select
                  value={selectedCourse || ''}
                  onChange={(e) => handleCourseSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a course...</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCourse && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Unenrolled Student
                  </label>
                  {unenrolledStudents.length === 0 ? (
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                      All students are already enrolled in this course
                    </p>
                  ) : (
                    <select
                      value={selectedStudent || ''}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a student...</option>
                      {unenrolledStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.first_name} {student.last_name} ({student.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedStudent(null);
                  setSelectedCourse(null);
                  setUnenrolledStudents([]);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleEnrollStudent}
                disabled={!selectedStudent || !selectedCourse || unenrolledStudents.length === 0}
                className="flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faPlus} />
                Enroll
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Query Response Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedQuery.subject}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  From: {selectedQuery.student_first_name} {selectedQuery.student_last_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuery(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Message:</p>
              <p className="text-gray-700 bg-gray-50 p-4 rounded">{selectedQuery.message}</p>
            </div>

            {!selectedQuery.response && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  id="queryResponse"
                  placeholder="Type your response here..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {selectedQuery.response && (
              <div className="mb-6 bg-green-50 p-4 rounded border-l-4 border-green-600">
                <p className="text-sm font-semibold text-green-900 mb-1">Your Response:</p>
                <p className="text-gray-700">{selectedQuery.response}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedQuery(null)}
                className="flex-1"
              >
                Close
              </Button>
              {!selectedQuery.response && (
                <Button
                  variant="primary"
                  onClick={() => {
                    const responseText = document.getElementById('queryResponse').value;
                    if (!responseText.trim()) {
                      showError('Please enter a response');
                      return;
                    }
                    handleRespondToQuery(selectedQuery.id, responseText);
                  }}
                  className="flex-1"
                >
                  Send Response
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
