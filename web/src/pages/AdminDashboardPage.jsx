import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Input, Alert } from '../components/CommonComponents';
import { contentAPI, authAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';

export const AdminDashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');

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
          // Note: This would need a dedicated endpoint for all users
          // For now, we'll just set an empty array
          setUsers([]);
        } catch (err) {
          setUsers([]);
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

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentCount = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
  const educatorCount = users.filter((u) => u.role === 'educator').length;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System administration and monitoring</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {['overview', 'courses', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchTerm('');
              }}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="bg-white px-6 py-4">
              <p className="text-gray-600 text-sm">Total Courses</p>
              <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
            </Card>
            <Card className="bg-white px-6 py-4">
              <p className="text-gray-600 text-sm">Total Educators</p>
              <p className="text-3xl font-bold text-green-600">{educatorCount}</p>
            </Card>
            <Card className="bg-white px-6 py-4">
              <p className="text-gray-600 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-purple-600">{users.length}</p>
            </Card>
            <Card className="bg-white px-6 py-4">
              <p className="text-gray-600 text-sm">Total Enrollments</p>
              <p className="text-3xl font-bold text-orange-600">{studentCount}</p>
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
                            className="text-sm"
                          >
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
                          <Button variant="secondary" className="text-sm" disabled>
                            View
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
      </div>
    </div>
  );
};
