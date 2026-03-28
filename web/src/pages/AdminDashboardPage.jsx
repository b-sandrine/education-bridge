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
  faExclamationCircle,
  faEdit,
  faShield,
  faUserCheck,
  faUserSlash,
  faUserTie
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

// Color scheme
const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A'
};

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
          // Generate mock data for demo
          setEnrollmentData([
            { name: 'Week 1', enrolled: 45, completed: 12 },
            { name: 'Week 2', enrolled: 52, completed: 25 },
            { name: 'Week 3', enrolled: 68, completed: 38 },
            { name: 'Week 4', enrolled: 75, completed: 52 }
          ]);
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
    <div className="min-h-screen py-12 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3" style={{ color: colors.primary }}>
          <FontAwesomeIcon icon={faShield} />
          Admin Dashboard
        </h1>
        <p className="text-gray-600">System administration, analytics, and platform control</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 border-b-2 flex-wrap" style={{ borderColor: colors.primary }}>
        {['overview', 'courses', 'users', 'enrollments', 'queries'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSearchTerm('');
            }}
            className="px-6 py-3 font-semibold transition-all border-b-2 uppercase text-sm"
            style={{
              borderBottomColor: activeTab === tab ? colors.accent : 'transparent',
              color: activeTab === tab ? colors.accent : colors.text,
              backgroundColor: activeTab === tab ? `${colors.accent}10` : 'transparent'
            }}
          >
            <FontAwesomeIcon 
              icon={tab === 'courses' ? faBook : tab === 'queries' ? faEnvelope : tab === 'overview' ? faChartBar : faUsers}
              className="mr-2"
            />
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab with Charts */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-5 mb-8">
            <Card className="border-2 p-6 hover:shadow-lg transition-shadow" style={{ borderColor: colors.primary }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Courses</p>
                  <p className="text-3xl font-bold" style={{ color: colors.primary }}>{courses.length}</p>
                </div>
                <FontAwesomeIcon icon={faBook} className="text-4xl" style={{ color: colors.accent, opacity: 0.3 }} />
              </div>
            </Card>
            <Card className="border-2 p-6 hover:shadow-lg transition-shadow" style={{ borderColor: colors.accent }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Users</p>
                  <p className="text-3xl font-bold" style={{ color: colors.accent }}>{users.length}</p>
                </div>
                <FontAwesomeIcon icon={faUsers} className="text-4xl" style={{ color: colors.accent, opacity: 0.3 }} />
              </div>
            </Card>
            <Card className="border-2 p-6 hover:shadow-lg transition-shadow" style={{ borderColor: colors.primary }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Students</p>
                  <p className="text-3xl font-bold" style={{ color: colors.primary }}>{studentCount}</p>
                </div>
                <FontAwesomeIcon icon={faUserCheck} className="text-4xl" style={{ color: colors.accent, opacity: 0.3 }} />
              </div>
            </Card>
            <Card className="border-2 p-6 hover:shadow-lg transition-shadow" style={{ borderColor: colors.accent }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Educators</p>
                  <p className="text-3xl font-bold" style={{ color: colors.accent }}>{educatorCount}</p>
                </div>
                <FontAwesomeIcon icon={faUserTie} className="text-4xl" style={{ color: colors.accent, opacity: 0.3 }} />
              </div>
            </Card>
            <Card className="border-2 p-6 hover:shadow-lg transition-shadow" style={{ borderColor: colors.primary }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Admins</p>
                  <p className="text-3xl font-bold" style={{ color: colors.primary }}>{adminCount}</p>
                </div>
                <FontAwesomeIcon icon={faShield} className="text-4xl" style={{ color: colors.accent, opacity: 0.3 }} />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* User Role Distribution */}
            <Card className="border-2 p-6" style={{ borderColor: colors.primary }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
                <FontAwesomeIcon icon={faPieChart} />
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
                    <Tooltip contentStyle={{ backgroundColor: colors.background, border: `2px solid ${colors.primary}` }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-12">No user data available</p>
              )}
            </Card>

            {/* Enrollment Trend */}
            <Card className="border-2 p-6" style={{ borderColor: colors.primary }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
                <FontAwesomeIcon icon={faChartLine} />
                Enrollment Trend
              </h3>
              {enrollmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={`${colors.primary}30`} />
                    <XAxis dataKey="name" tick={{ fill: colors.text }} />
                    <YAxis tick={{ fill: colors.text }} />
                    <Tooltip contentStyle={{ backgroundColor: colors.background, border: `2px solid ${colors.primary}` }} />
                    <Legend />
                    <Line type="monotone" dataKey="enrolled" stroke={colors.primary} strokeWidth={2} name="Enrolled" />
                    <Line type="monotone" dataKey="completed" stroke={colors.accent} strokeWidth={2} name="Completed" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-12">No enrollment data available</p>
              )}
            </Card>
          </div>

          {/* Course Level Distribution */}
          <Card className="border-2 p-6" style={{ borderColor: colors.primary }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
              <FontAwesomeIcon icon={faChartBar} />
              Courses by Level
            </h3>
            {courseLevelData.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseLevelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={`${colors.primary}30`} />
                  <XAxis dataKey="level" tick={{ fill: colors.text }} />
                  <YAxis tick={{ fill: colors.text }} />
                  <Tooltip contentStyle={{ backgroundColor: colors.background, border: `2px solid ${colors.primary}` }} />
                  <Bar dataKey="count" fill={colors.accent} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No course data available</p>
            )}
          </Card>
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
              className="px-4 py-2 border-2 rounded-lg"
              style={{ borderColor: colors.primary }}
            />
          </div>

          {loading ? (
            <Card className="text-center py-12 border-2" style={{ borderColor: colors.primary }}>
              <p className="text-gray-600">Loading courses...</p>
            </Card>
          ) : filteredCourses.length === 0 ? (
            <Card className="text-center py-12 border-2" style={{ borderColor: colors.primary }}>
              <p className="text-gray-600">No courses found</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.primary}` }}>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.primary }}>Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.primary }}>Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.primary }}>Level</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.primary }}>Duration</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold" style={{ color: colors.primary }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50" style={{ borderBottom: `1px solid ${colors.background}` }}>
                      <td className="px-6 py-4 text-sm" style={{ color: colors.text }}>{course.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{course.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{course.level}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{course.duration_weeks} weeks</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-sm px-3 py-1 text-white rounded"
                          style={{ backgroundColor: '#dc2626' }}
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-1" />
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
              className="px-4 py-2 border-2 rounded-lg"
              style={{ borderColor: colors.primary }}
            />
          </div>

          {loading ? (
            <Card className="text-center py-12 border-2" style={{ borderColor: colors.primary }}>
              <p className="text-gray-600">Loading users...</p>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card className="text-center py-12 border-2" style={{ borderColor: colors.primary }}>
              <p className="text-gray-600">No users found</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.primary}` }}>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.primary }}>Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.primary }}>Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.primary }}>Role</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold" style={{ color: colors.primary }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50" style={{ borderBottom: `1px solid ${colors.background}` }}>
                      <td className="px-6 py-4 text-sm" style={{ color: colors.text }}>{u.firstName} {u.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{
                            backgroundColor: u.role === 'educator' ? colors.primary : u.role === 'admin' ? colors.accent : '#10b981'
                          }}
                        >
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            className="text-sm px-2 py-1 border-2 rounded"
                            style={{ borderColor: colors.primary }}
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
                              className="text-sm px-3 py-1 text-white rounded"
                              style={{ backgroundColor: '#dc2626' }}
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-1" />
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

      {/* Enrollments Tab - Placeholder */}
      {activeTab === 'enrollments' && (
        <Card className="border-2 p-8 text-center" style={{ borderColor: colors.primary }}>
          <FontAwesomeIcon icon={faUsers} className="text-5xl mb-4" style={{ color: colors.accent }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>Course Enrollments</h3>
          <p className="text-gray-600">Manage student enrollments in courses</p>
          <p className="text-gray-500 text-sm mt-4">Enrollment management feature coming soon</p>
        </Card>
      )}

      {/* Queries Tab */}
      {activeTab === 'queries' && (
        <div>
          {loading ? (
            <Card className="text-center py-12 border-2" style={{ borderColor: colors.primary }}>
              <p className="text-gray-600">Loading queries...</p>
            </Card>
          ) : queries.length === 0 ? (
            <Card className="text-center py-12 border-2" style={{ borderColor: colors.primary }}>
              <FontAwesomeIcon icon={faEnvelope} className="text-5xl mb-4" style={{ color: colors.accent }} />
              <p className="text-gray-600">No student queries yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {queries.map((query) => (
                <Card key={query.id} className="border-2 p-6 hover:shadow-lg transition-shadow" style={{ borderColor: colors.primary }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-lg font-bold" style={{ color: colors.primary }}>{query.subject}</p>
                      <p className="text-sm text-gray-600">
                        From: {query.student_first_name} {query.student_last_name} ({query.student_email})
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon 
                        icon={query.status === 'resolved' ? faCheckCircle : faExclamationCircle}
                        style={{ color: query.status === 'resolved' ? colors.accent : colors.primary }}
                      />
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor: query.status === 'resolved' ? colors.accent : colors.primary
                        }}
                      >
                        {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 p-4 rounded" style={{ backgroundColor: colors.background }}>{query.message}</p>
                  {query.response && (
                    <div className="mb-4 p-4 rounded border-l-4" style={{ backgroundColor: `${colors.accent}15`, borderLeftColor: colors.accent }}>
                      <p className="text-sm font-semibold mb-1" style={{ color: colors.accent }}>Your Response:</p>
                      <p className="text-gray-700">{query.response}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
