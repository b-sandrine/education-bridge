import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Plus, Filter, Search } from 'lucide-react';
import api from '../services/api';

const StudentInterventionTools = ({ courseId, educatorId }) => {
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [thresholdScore, setThresholdScore] = useState(60);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [interventionData, setInterventionData] = useState({
    reason: '',
    priority: 'medium',
  });
  const [assignmentData, setAssignmentData] = useState({
    topic: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchAtRiskStudents();
  }, [courseId, thresholdScore]);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, atRiskStudents]);

  const fetchAtRiskStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/grading/at-risk/${courseId}?threshold=${thresholdScore}`
      );
      setAtRiskStudents(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load at-risk students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    const filtered = atRiskStudents.filter((student) =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleFlagStudent = async (student) => {
    try {
      await api.post('/grading/interventions', {
        studentId: student.id,
        courseId: courseId,
        ...interventionData,
      });

      // Show success and reset
      setInterventionData({ reason: '', priority: 'medium' });
      alert('Student flagged for intervention');
      fetchAtRiskStudents();
    } catch (err) {
      alert('Failed to flag student');
      console.error(err);
    }
  };

  const handleCreateAssignment = async () => {
    if (!selectedStudent || !assignmentData.topic || !assignmentData.dueDate) {
      alert('Please fill all fields');
      return;
    }

    try {
      await api.post('/grading/targeted-assignments', {
        studentId: selectedStudent.id,
        courseId: courseId,
        ...assignmentData,
      });

      setAssignmentData({ topic: '', description: '', dueDate: '' });
      setShowAssignmentForm(false);
      setSelectedStudent(null);
      alert('Assignment created successfully');
    } catch (err) {
      alert('Failed to create assignment');
      console.error(err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Intervention Tools</h2>
        <p className="text-gray-600">Monitor and support students who need additional help</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Score Threshold</label>
            <select
              value={thresholdScore}
              onChange={(e) => setThresholdScore(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={60}>Below 60%</option>
              <option value={70}>Below 70%</option>
              <option value={80}>Below 80%</option>
            </select>
          </div>
        </div>
      </div>

      {/* At-Risk Students List */}
      {filteredStudents.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-900 font-medium">No at-risk students</p>
          <p className="text-gray-600 text-sm mt-1">All students are performing above the threshold</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Student</p>
                  <p className="font-semibold text-gray-900">{student.full_name}</p>
                  <p className="text-xs text-gray-500 mt-1">{student.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Average Score</p>
                  <p className={`text-lg font-bold ${
                    student.average_score >= 70
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {student.average_score}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Quizzes Taken</p>
                  <p className="text-lg font-bold text-gray-900">{student.quizzes_taken}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Failed Attempts</p>
                  <p className="text-lg font-bold text-red-600">{student.failed_attempts}</p>
                </div>
              </div>

              {student.weak_topics && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">Weak Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.weak_topics.split(', ').map((topic, idx) => (
                      <span
                        key={idx}
                        className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowAssignmentForm(true);
                  }}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Assign Practice
                </button>

                <button
                  onClick={() => handleFlagStudent(student)}
                  className="px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Flag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Form Modal */}
      {showAssignmentForm && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Create Practice Assignment for {selectedStudent.full_name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  value={assignmentData.topic}
                  onChange={(e) =>
                    setAssignmentData({ ...assignmentData, topic: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  {selectedStudent.weak_topics &&
                    selectedStudent.weak_topics.split(', ').map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={assignmentData.description}
                  onChange={(e) =>
                    setAssignmentData({ ...assignmentData, description: e.target.value })
                  }
                  placeholder="Describe the assignment..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={assignmentData.dueDate}
                  onChange={(e) =>
                    setAssignmentData({ ...assignmentData, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  onClick={() => {
                    setShowAssignmentForm(false);
                    setSelectedStudent(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAssignment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInterventionTools;
