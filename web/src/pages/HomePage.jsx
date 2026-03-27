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
  faArrowRight,
  faCheckCircle,
  faLightbulb,
  faGraduationCap,
  faHeartHand,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

// Public Home Page (Before Login)
const PublicHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">Welcome to EduBridge</h1>
          <p className="text-2xl font-light mb-8 text-blue-100">
            Empowering women and vulnerable children with quality education
          </p>
          <div className="space-x-4 flex justify-center flex-wrap gap-4">
            <Link to="/login">
              <Button variant="primary" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faArrowRight} />
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold transition">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">About EduBridge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg mb-6 text-blue-100 leading-relaxed">
                EduBridge is a comprehensive digital learning platform designed specifically to bridge the educational gap for women and vulnerable children in underserved communities. We believe that quality education is a fundamental right, not a privilege.
              </p>
              <p className="text-lg mb-6 text-blue-100 leading-relaxed">
                By combining modern technology, expert-curated content, and AI-powered tutoring, EduBridge provides accessible, affordable, and effective learning opportunities to students regardless of their geographic location or socioeconomic status.
              </p>
            </div>
            <Card className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Our Mission</h3>
              <p className="text-blue-50 text-lg leading-relaxed">
                To democratize education and create pathways for success for marginalized communities through innovative technology and human-centered design.
              </p>
            </Card>
          </div>
        </div>

        {/* The Idea Behind */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">The Idea Behind EduBridge</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-8">
              <div className="text-4xl mb-4 text-yellow-300">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-blue-50">Leveraging cutting-edge technology including AI tutors, multi-platform access, and interactive learning modules to create engaging educational experiences.</p>
            </Card>
            <Card className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-8">
              <div className="text-4xl mb-4 text-pink-300">
                <FontAwesomeIcon icon={faHeartHand} />
              </div>
              <h3 className="text-xl font-bold mb-4">Equity</h3>
              <p className="text-blue-50">Ensuring equal access to quality education regardless of background, income, or location. USSD support for offline-first communities included.</p>
            </Card>
            <Card className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-8">
              <div className="text-4xl mb-4 text-green-300">
                <FontAwesomeIcon icon={faGlobe} />
              </div>
              <h3 className="text-xl font-bold mb-4">Empowerment</h3>
              <p className="text-blue-50">Equipping students with knowledge, skills, and confidence needed to succeed in education and their careers.</p>
            </Card>
          </div>
        </div>

        {/* Why Choose EduBridge */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">Why EduBridge Ensures Your Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-400 text-blue-600">
                  <FontAwesomeIcon icon={faBook} className="text-xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Comprehensive Curriculum</h4>
                <p className="text-blue-100">Carefully curated, curriculum-aligned content covering multiple subjects and levels from beginner to advanced.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-400 text-blue-600">
                  <FontAwesomeIcon icon={faRobot} className="text-xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">AI-Powered Tutoring</h4>
                <p className="text-blue-100">Get instant personalized help with unlimited AI tutor conversations that learn from your learning patterns.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-400 text-blue-600">
                  <FontAwesomeIcon icon={faChartLine} className="text-xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Progress Tracking</h4>
                <p className="text-blue-100">Monitor your learning journey with detailed analytics and insights to stay motivated and on track.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-400 text-blue-600">
                  <FontAwesomeIcon icon={faCertificate} className="text-xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Certifications</h4>
                <p className="text-blue-100">Earn recognized certificates upon completion that you can share to demonstrate your achievements.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-400 text-blue-600">
                  <FontAwesomeIcon icon={faMobileAlt} className="text-xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Multi-Platform Access</h4>
                <p className="text-blue-100">Learn on web, mobile, or USSD. Study anytime, anywhere with offline support for low-bandwidth areas.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-400 text-blue-600">
                  <FontAwesomeIcon icon={faUsers} className="text-xl" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Community Support</h4>
                <p className="text-blue-100">Connect with fellow learners, ask questions to instructors, and grow together in a supportive community.</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="mb-20 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-12 border border-white border-opacity-20">
          <h2 className="text-4xl font-bold mb-12 text-center">How to Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-yellow-400 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h4 className="text-xl font-bold mb-3">Create Account</h4>
              <p className="text-blue-100">Sign up with your email and choose your role (Student, Educator, or Admin).</p>
            </div>
            <div className="text-center">
              <div className="bg-green-400 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h4 className="text-xl font-bold mb-3">Browse Courses</h4>
              <p className="text-blue-100">Explore our catalog of courses and choose topics that match your learning goals.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-400 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h4 className="text-xl font-bold mb-3">Start Learning</h4>
              <p className="text-blue-100">Enroll in courses, watch lessons, and use the AI tutor for personalized guidance.</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-400 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h4 className="text-xl font-bold mb-3">Get Certified</h4>
              <p className="text-blue-100">Complete courses and earn certificates to showcase your achievements.</p>
            </div>
          </div>
        </div>

        {/* Creator/Organization */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-8">About the Creator</h2>
          <Card className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-12 max-w-3xl mx-auto">
            <div className="text-5xl mb-6 text-blue-300 flex justify-center">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <h3 className="text-3xl font-bold mb-4">EduBridge Organization</h3>
            <p className="text-lg text-blue-50 leading-relaxed mb-6">
              EduBridge is built by a dedicated team of educators, technologists, and social impact advocates committed to transforming education in underserved communities. Our organization collaborates with educational institutions, NGOs, and community leaders to ensure our platform meets real needs and creates lasting impact.
            </p>
            <p className="text-lg text-blue-50 leading-relaxed">
              We operate on principles of accessibility, quality, and sustainability, ensuring that every feature we build serves our mission to empower learners worldwide.
            </p>
          </Card>
        </div>

        {/* CTA Footer */}
        <div className="text-center py-12 border-t border-white border-opacity-20">
          <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Education?</h3>
          <p className="text-xl mb-8 text-blue-100">Join thousands of learners already achieving their goals on EduBridge</p>
          <Link to="/register">
            <Button variant="primary" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold inline-block">
              Start Your Free Journey Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Dashboard Home Page (After Login)
const LoggedInHomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6 w-full ml-0">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-xl text-gray-600">Continue your learning journey and achieve your goals</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-4xl mb-4">
              <FontAwesomeIcon icon={faBook} />
            </div>
            <p className="text-sm opacity-90 mb-2">Courses Enrolled</p>
            <p className="text-3xl font-bold">5</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-4xl mb-4">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <p className="text-sm opacity-90 mb-2">Completed</p>
            <p className="text-3xl font-bold">2</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-4xl mb-4">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <p className="text-sm opacity-90 mb-2">AI Conversations</p>
            <p className="text-3xl font-bold">24</p>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link to="/courses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-white border-2 border-blue-200 hover:border-blue-400">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Browse Courses</h3>
                  <p className="text-gray-600">Explore new learning opportunities and expand your skills</p>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="text-2xl text-blue-600" />
              </div>
            </Card>
          </Link>
          <Link to="/ai-tutor">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-white border-2 border-purple-200 hover:border-purple-400">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Tutor</h3>
                  <p className="text-gray-600">Get personalized help with unlimited AI-powered tutoring sessions</p>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="text-2xl text-purple-600" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Featured Courses */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Continue Your Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="mb-4 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                <FontAwesomeIcon icon={faBook} className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Course {i}</h3>
              <p className="text-gray-600 text-sm mb-4">Progress: {i * 20}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${i * 20}%` }}></div>
              </div>
              <Button variant="primary" className="w-full">Continue</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HomePage = () => {
  const { token } = useAuth();

  return token ? <LoggedInHomePage /> : <PublicHomePage />;
};
