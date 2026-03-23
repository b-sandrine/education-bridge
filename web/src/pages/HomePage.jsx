import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAppStore';
import { Card, Button } from '../components/CommonComponents';

export const HomePage = () => {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Welcome to EduBridge</h1>
          <p className="text-xl mb-8">
            Empowering women and vulnerable children with access to quality education
          </p>

          {token ? (
            <Link to="/dashboard">
              <Button variant="primary" className="bg-white text-blue-600 hover:bg-gray-100">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <h3 className="text-2xl font-bold mb-2">📚 Rich Content</h3>
            <p className="text-gray-600">Curriculum-aligned learning materials for all levels</p>
          </Card>

          <Card className="text-center">
            <h3 className="text-2xl font-bold mb-2">🤖 AI Assistant</h3>
            <p className="text-gray-600">Get instant answers to your learning questions</p>
          </Card>

          <Card className="text-center">
            <h3 className="text-2xl font-bold mb-2">📱 Multi-Platform</h3>
            <p className="text-gray-600">Learn via web, mobile, or USSD on any device</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
