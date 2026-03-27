import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth, useContent } from '../hooks/useAppStore';
import { useNotification } from '../hooks/useNotification';
import { Card, Button } from '../components/CommonComponents';
import { contentAPI } from '../services/api';
import { fetchCoursesSuccess } from '../store/contentSlice';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faGraduationCap, 
  faArrowRight,
  faTimes,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons';

export const CoursesPage = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { courses, loading } = useContent();
  const { showError } = useNotification();
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await contentAPI.getAllCourses({});
        dispatch(fetchCoursesSuccess(response.data.data));
      } catch (error) {
        showError('Failed to load courses');
      }
    };

    fetchCourses();
  }, []);

  const truncateDescription = (description, length = 120) => {
    if (!description) return '';
    return description.length > length ? description.substring(0, length) + '...' : description;
  };

  if (loading) return <div className="text-center py-8">Loading courses...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-6 w-full ml-0">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-gray-900">
          <FontAwesomeIcon icon={faBook} className="text-blue-600" />
          Available Courses
        </h1>
        <p className="text-gray-600">Explore our collection of educational courses</p>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-600 text-lg">No courses available yet. Check back soon!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
                <div className="flex gap-2">
                  <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {course.level}
                  </span>
                  <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-1 p-4">
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                  {truncateDescription(course.description, 120)}
                </p>

                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500 w-4" />
                    <span>{course.duration_weeks} weeks</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors font-medium text-sm"
                >
                  View Details
                </button>
                <Link to={`/courses/${course.id}`} className="block">
                  <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                    <span>Enroll</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full max-h-96 overflow-y-auto rounded-lg">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {selectedCourse.level}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {selectedCourse.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedCourse.duration_weeks}</p>
                  <p className="text-xs text-gray-600">weeks</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="text-2xl font-bold text-purple-600 capitalize">{selectedCourse.level}</p>
                </div>
              </div>

              {selectedCourse.content && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Content</h3>
                  <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded">
                    {selectedCourse.content}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setSelectedCourse(null)}
                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors font-medium"
              >
                Close
              </button>
              <Link to={`/courses/${selectedCourse.id}`} className="flex-1">
                <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                  <span>Enroll Now</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
