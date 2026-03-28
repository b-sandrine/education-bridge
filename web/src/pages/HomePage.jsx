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
  faHeart,
  faGlobe,
  faEnvelope,
  faPhone,
  faGamepad,
  faTrophy,
  faStar,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook as faFacebookBrand,
  faTwitter as faTwitterBrand,
  faLinkedin as faLinkedinBrand,
  faInstagram as faInstagramBrand
} from '@fortawesome/free-brands-svg-icons';

// Color System
const colors = {
  primary: '#1E3A8A', // Deep Blue
  accent: '#F97316',  // Warm Orange
  background: '#F8FAFC', // Light Gray
  text: '#0F172A',    // Dark Gray
};


// Footer Component
const Footer = () => {
  return (
    <footer className="bg-white border-t-2" style={{ borderColor: colors.primary }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: colors.primary }}>
              <FontAwesomeIcon icon={faGraduationCap} />
              EduBridge
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
              Making every child curious, engaged, and capable through interactive and intelligent education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6" style={{ color: colors.primary }}>Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/courses" className="text-sm hover:opacity-70 transition" style={{ color: colors.text }}>Browse Courses</Link></li>
              <li><Link to="/ai-tutor" className="text-sm hover:opacity-70 transition" style={{ color: colors.text }}>AI Tutor</Link></li>
              <li><a href="#about" className="text-sm hover:opacity-70 transition" style={{ color: colors.text }}>About Us</a></li>
              <li><a href="#contact" className="text-sm hover:opacity-70 transition" style={{ color: colors.text }}>Contact Support</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-6" style={{ color: colors.primary }}>Resources</h4>
            <ul className="space-y-3">
              <li><a href="#help" className="text-sm hover:opacity-70 transition" style={{ color: colors.text }}>Help Center</a></li>
              <li><a href="#faq" className="text-sm hover:opacity-70 transition" style={{ color: colors.text }}>FAQ</a></li>
              <li><a href="#privacy" className="text-sm hover:opacity-70 transition" style={{ color: colors.text }}>Privacy Policy</a></li>
              <li><a href="#terms" className="text-sm hover:opacity-70 transition" style={{ color: colors.text }}>Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-bold mb-6" style={{ color: colors.primary }}>Connect With Us</h4>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <FontAwesomeIcon icon={faEnvelope} style={{ color: colors.accent }} />
                <span style={{ color: colors.text }}>support@edubridge.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FontAwesomeIcon icon={faPhone} style={{ color: colors.accent }} />
                <span style={{ color: colors.text }}>+1 (555) 123-4567</span>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#facebook" className="p-2 rounded-full w-10 h-10 flex items-center justify-center text-white transition hover:scale-110" style={{ backgroundColor: colors.primary }}>
                <FontAwesomeIcon icon={faFacebookBrand} size="lg" />
              </a>
              <a href="#twitter" className="p-2 rounded-full w-10 h-10 flex items-center justify-center text-white transition hover:scale-110" style={{ backgroundColor: colors.primary }}>
                <FontAwesomeIcon icon={faTwitterBrand} size="lg" />
              </a>
              <a href="#linkedin" className="p-2 rounded-full w-10 h-10 flex items-center justify-center text-white transition hover:scale-110" style={{ backgroundColor: colors.primary }}>
                <FontAwesomeIcon icon={faLinkedinBrand} size="lg" />
              </a>
              <a href="#instagram" className="p-2 rounded-full w-10 h-10 flex items-center justify-center text-white transition hover:scale-110" style={{ backgroundColor: colors.primary }}>
                <FontAwesomeIcon icon={faInstagramBrand} size="lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
            <div className="text-sm" style={{ color: colors.text }}>
              <p>&copy; 2024 EduBridge. All rights reserved.</p>
            </div>
            <div className="text-center text-sm" style={{ color: colors.text }}>
              <p>Making education accessible to every child</p>
            </div>
            <div className="text-right text-sm" style={{ color: colors.text }}>
              <p>Built with <span style={{ color: colors.accent }}>♥</span> for learners everywhere</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


// Public Home Page (Before Login)
const PublicHomePage = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Hero Section */}
      <div className="px-4 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Mission Statement */}
          <div className="mb-8">
            <p className="text-lg font-semibold" style={{ color: colors.accent }}>OUR MISSION</p>
            <h1 className="text-5xl lg:text-7xl font-bold mt-4 mb-6 leading-tight" style={{ color: colors.primary }}>
              Make Every Child Curious, Engaged, and Capable
            </h1>
            <p className="text-2xl max-w-3xl mx-auto mb-12 leading-relaxed" style={{ color: colors.text }}>
              A tech-enabled learning platform that transforms education through interactive games, AI-powered assistance, and intelligent progress tracking.
            </p>
          </div>

          {/* Hero CTA */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register">
              <Button 
                variant="primary" 
                className="px-8 py-4 text-lg font-bold text-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 inline-flex items-center gap-2"
                style={{ backgroundColor: colors.accent }}
              >
                <FontAwesomeIcon icon={faStar} />
                Start Learning Now
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="secondary" 
                className="px-8 py-4 text-lg font-bold rounded-lg border-2 transition hover:shadow-lg inline-flex items-center gap-2"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section - 3 Steps */}
      <div className="px-4 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: colors.primary }}>How It Works</h2>
          <p className="text-center text-lg mb-16" style={{ color: colors.text }}>Simple, engaging, and effective learning in 3 steps</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <FontAwesomeIcon icon={faGamepad} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Learn Through Games</h3>
              <p style={{ color: colors.text }}>
                Engage with interactive games, quizzes, and stories. Learning feels like playing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Track Progress</h3>
              <p style={{ color: colors.text }}>
                Visual badges, levels, and charts show your growth. Stay motivated with real achievements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Grow Skills</h3>
              <p style={{ color: colors.text }}>
                Build real knowledge and capabilities. Develop skills for education and future success.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: colors.primary }}>Core Features</h2>
          <p className="text-center text-lg mb-16" style={{ color: colors.text }}>Everything you need for amazing learning</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-2 p-8 hover:shadow-xl transition" style={{ borderColor: colors.accent }}>
              <div className="text-4xl mb-4" style={{ color: colors.accent }}>
                <FontAwesomeIcon icon={faGamepad} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Interactive Learning</h3>
              <p style={{ color: colors.text }}>
                Games, quizzes, and stories designed to make learning fun and addictive. Every lesson is an adventure.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 p-8 hover:shadow-xl transition" style={{ borderColor: colors.accent }}>
              <div className="text-4xl mb-4" style={{ color: colors.accent }}>
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>AI-Powered Assistance</h3>
              <p style={{ color: colors.text }}>
                Get instant help from our AI assistant. It explains concepts simply and answers questions any time.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 p-8 hover:shadow-xl transition" style={{ borderColor: colors.accent }}>
              <div className="text-4xl mb-4" style={{ color: colors.accent }}>
                <FontAwesomeIcon icon={faTrophy} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>Achievements System</h3>
              <p style={{ color: colors.text }}>
                Earn badges, reach levels, and celebrate milestones. Real achievements that motivate progress.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="px-4 py-20" style={{ backgroundColor: colors.primary, color: 'white' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why This Matters</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Impact 1 */}
            <div className="text-center">
              <div className="text-5xl mb-4 opacity-80">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Unlock Potential</h3>
              <p className="text-lg opacity-90">
                Every child has untapped potential. We make it easy to discover and develop it.
              </p>
            </div>

            {/* Impact 2 */}
            <div className="text-center">
              <div className="text-5xl mb-4 opacity-80">
                <FontAwesomeIcon icon={faFire} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Build Curiosity</h3>
              <p className="text-lg opacity-90">
                Curious minds drive learning. Our platform sparks that natural desire to explore and understand.
              </p>
            </div>

            {/* Impact 3 */}
            <div className="text-center">
              <div className="text-5xl mb-4 opacity-80">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Future Skills</h3>
              <p className="text-lg opacity-90">
                Develop problem-solving, creativity, and critical thinking. Skills for tomorrow's world.
              </p>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="mt-16 pt-16 border-t border-white border-opacity-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <p className="text-5xl font-bold mb-2">10K+</p>
                <p className="text-lg opacity-90">Active Learners</p>
              </div>
              <div>
                <p className="text-5xl font-bold mb-2">500+</p>
                <p className="text-lg opacity-90">Learning Modules</p>
              </div>
              <div>
                <p className="text-5xl font-bold mb-2">95%</p>
                <p className="text-lg opacity-90">Engagement Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6" style={{ color: colors.primary }}>Ready to Start?</h2>
          <p className="text-xl mb-12" style={{ color: colors.text }}>
            Join thousands of children discovering the joy of learning
          </p>
          <Link to="/register">
            <Button 
              variant="primary" 
              className="px-10 py-4 text-lg font-bold text-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 inline-flex items-center gap-2"
              style={{ backgroundColor: colors.accent }}
            >
              <FontAwesomeIcon icon={faStar} />
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Dashboard Home Page (After Login)
const LoggedInHomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12 px-6 w-full ml-0" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2" style={{ color: colors.primary }}>Welcome back, {user?.firstName}!</h1>
          <p className="text-xl" style={{ color: colors.text }}>Continue your learning journey and achieve your goals</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-white shadow-lg" style={{ backgroundColor: colors.primary }}>
            <div className="text-4xl mb-4">
              <FontAwesomeIcon icon={faBook} />
            </div>
            <p className="text-sm opacity-90 mb-2">Courses Enrolled</p>
            <p className="text-3xl font-bold">5</p>
          </Card>
          <Card className="text-white shadow-lg" style={{ backgroundColor: colors.accent }}>
            <div className="text-4xl mb-4">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <p className="text-sm opacity-90 mb-2">Completed</p>
            <p className="text-3xl font-bold">2</p>
          </Card>
          <Card className="text-white shadow-lg" style={{ backgroundColor: colors.primary }}>
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
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-white border-2" style={{ borderColor: colors.primary }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>Browse Courses</h3>
                  <p style={{ color: colors.text }}>Explore new learning opportunities and expand your skills</p>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="text-2xl" style={{ color: colors.primary }} />
              </div>
            </Card>
          </Link>
          <Link to="/ai-tutor">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-white border-2" style={{ borderColor: colors.accent }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>AI Tutor</h3>
                  <p style={{ color: colors.text }}>Get personalized help with unlimited AI-powered tutoring sessions</p>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="text-2xl" style={{ color: colors.accent }} />
              </div>
            </Card>
          </Link>
        </div>

        {/* Featured Courses */}
        <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>Continue Your Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="hover:shadow-lg transition-shadow bg-white" style={{ borderLeft: `4px solid ${colors.accent}` }}>
              <div className="mb-4 h-32 rounded flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                <FontAwesomeIcon icon={faBook} className="text-3xl" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Course {i}</h3>
              <p className="text-sm mb-4" style={{ color: colors.text }}>Progress: {i * 20}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="h-2 rounded-full" style={{ width: `${i * 20}%`, backgroundColor: colors.accent }}></div>
              </div>
              <Button 
                variant="primary" 
                className="w-full text-white font-bold rounded"
                style={{ backgroundColor: colors.primary }}
              >
                Continue
              </Button>
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
