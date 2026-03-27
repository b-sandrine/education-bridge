import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Input, Alert } from '../components/CommonComponents';
import { contentAPI, queryAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope,
  faCheckCircle,
  faClock,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

export const StudentQueriesPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('submit');
  const [myQueries, setMyQueries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    courseId: '',
  });

  useEffect(() => {
    if (activeTab === 'submit') {
      fetchCourses();
    } else {
      fetchMyQueries();
    }
  }, [activeTab]);

  const fetchCourses = async () => {
    try {
      const response = await contentAPI.getAllCourses();
      setCourses(response.data.data || []);
    } catch (err) {
      showError('Failed to load courses');
    }
  };

  const fetchMyQueries = async () => {
    try {
      setLoading(true);
      const response = await queryAPI.getMyQueries();
      setMyQueries(response.data.data || []);
    } catch (err) {
      showError('Failed to load queries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      showError('Please fill in both subject and message');
      return;
    }

    try {
      setSubmitting(true);
      await queryAPI.createQuery({
        subject: formData.subject,
        message: formData.message,
        courseId: formData.courseId || null,
      });
      showSuccess('Query submitted successfully!');
      setFormData({ subject: '', message: '', courseId: '' });
      fetchMyQueries();
      setActiveTab('my-queries');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit query');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return faCheckCircle;
      default:
        return faClock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
            Help & Support
          </h1>
          <p className="text-gray-600">Submit your queries and get support from admins</p>
        </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8">
        {['submit', 'my-queries'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-md font-medium transition ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab === 'submit' ? 'Submit Query' : 'My Queries'}
          </button>
        ))}
      </div>

      {/* Submit Query Tab */}
      {activeTab === 'submit' && (
        <Card className="p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Query</h2>
          
          <form onSubmit={handleSubmitQuery} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course (Optional)
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <Input
                type="text"
                placeholder="e.g., Question about Module 2"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                placeholder="Describe your query in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faEnvelope} />
              {submitting ? 'Submitting...' : 'Submit Query'}
            </Button>
          </form>
        </Card>
      )}

      {/* My Queries Tab */}
      {activeTab === 'my-queries' && (
        <div>
          {loading ? (
            <Card className="text-center py-12">
              <p className="text-gray-600">Loading your queries...</p>
            </Card>
          ) : myQueries.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600 mb-4">No queries yet</p>
              <Button
                variant="primary"
                onClick={() => setActiveTab('submit')}
                className="inline-flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faEnvelope} />
                Submit Your First Query
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {myQueries.map((query) => (
                <Card key={query.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-lg font-bold text-gray-900">{query.subject}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Submitted: {new Date(query.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon 
                        icon={getStatusIcon(query.status)}
                        className={query.status === 'resolved' ? 'text-green-600' : 'text-orange-600'}
                      />
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(query.status)}`}>
                        {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 bg-gray-50 p-4 rounded">{query.message}</p>

                  {query.response && (
                    <div className="mb-4 bg-blue-50 p-4 rounded border-l-4 border-blue-600">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Admin Response:</p>
                      <p className="text-gray-700">{query.response}</p>
                      {query.resolved_at && (
                        <p className="text-xs text-blue-600 mt-2">
                          Resolved: {new Date(query.resolved_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {!query.response && (
                    <div className="p-4 bg-orange-50 rounded text-sm text-orange-800">
                      Waiting for admin response...
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};
