import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAppStore';
import { Card, Button } from '../components/CommonComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faRobot, 
  faMobileAlt, 
  faChartLine, 
  faUsers, 
  faCertificate,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

export const HomePage = () => {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Welcome to EduBridge</h1>
          <p className="text-xl mb-8">
            Empowering women and vulnerable children with access to quality education
          </p>

          {token ? (
            <Link to="/dashboard">
              <Button variant="primary" className="bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faArrowRight} />
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="primary" className="inline-block bg-white text-blue-600 hover:bg-gray-100">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-blue-600">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-16">
          <Card className="text-center bg-white hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl text-blue-600 mb-4 flex justify-center">
              <FontAwesomeIcon icon={faBook} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Rich Content</h3>
            <p className="text-gray-600">Curriculum-aligned learning materials for all levels</p>
          </Card>

          <Card className="text-center bg-white hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl text-purple-600 mb-4 flex justify-center">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">AI Assistant</h3>
            <p className="text-gray-600">Get instant answers to your learning questions</p>
          </Card>

          <Card className="text-center bg-white hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl text-green-600 mb-4 flex justify-center">
              <FontAwesomeIcon icon={faMobileAlt} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Multi-Platform</h3>
            <p className="text-gray-600">Learn via web, mobile, or USSD on any device</p>
          </Card>
        </div>

        {/* Additional Benefits Section */}
        <div className="bg-white bg-opacity-10 rounded-lg p-12 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose EduBridge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-white flex gap-4">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faChartLine} className="text-3xl text-yellow-300" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Track Progress</h4>
                <p className="text-sm text-gray-100">Monitor learning progress with detailed analytics</p>
              </div>
            </div>

            <div className="text-white flex gap-4">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faUsers} className="text-3xl text-pink-300" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Community Learning</h4>
                <p className="text-sm text-gray-100">Collaborate and learn with other students globally</p>
              </div>
            </div>

            <div className="text-white flex gap-4">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faCertificate} className="text-3xl text-green-300" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Earn Certificates</h4>
                <p className="text-sm text-gray-100">Get recognized certificates upon course completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
