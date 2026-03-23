import { menuTexts } from '../utils/menuTexts.js';
import { getSession, createSession, deleteSession } from '../utils/sessionManager.js';
import { contentAPI, authAPI, progressAPI, chatbotAPI } from '../services/apiService.js';

export const handleUSSDRequest = async (phoneNumber, userInput, language = 'en') => {
  // Get or create session
  let session = getSession(phoneNumber);
  
  if (!session) {
    session = createSession(phoneNumber, language);
  }

  // Check if session is expired
  if (session.isExpired()) {
    deleteSession(phoneNumber);
    session = createSession(phoneNumber, language);
  }

  // Process the user input and determine next state
  let response = '';
  const input = userInput?.trim().toLowerCase() || '';

  try {
    switch (session.state) {
      case 'mainMenu':
        response = await handleMainMenu(session, input, language);
        break;

      case 'loginChoice':
        response = await handleLoginChoice(session, input, language);
        break;

      case 'registerPhone':
        response = await handleRegisterPhone(session, input, language);
        break;

      case 'registerPassword':
        response = await handleRegisterPassword(session, input, language);
        break;

      case 'coursesMenu':
        response = await handleCoursesMenu(session, input, language);
        break;

      case 'courseDetails':
        response = await handleCourseDetails(session, input, language);
        break;

      case 'progressMenu':
        response = await handleProgressMenu(session, input, language);
        break;

      case 'chatbotQuestion':
        response = await handleChatbotQuestion(session, input, language);
        break;

      default:
        response = menuTexts[language].mainMenu;
        session.navigateTo('mainMenu');
    }
  } catch (error) {
    console.error('USSD handler error:', error);
    response = menuTexts[language].errorMessage;
    session.navigateTo('mainMenu');
  }

  return response;
};

const handleMainMenu = async (session, input, language) => {
  const menus = menuTexts[language];

  if (input === '1') {
    session.navigateTo('loginChoice');
    return `${menus.loginMenu}\nType 'B' to go back`;
  } else if (input === '2') {
    session.data.courses = await contentAPI.getCourses(language);
    session.navigateTo('coursesMenu');
    return menus.coursesMenu;
  } else if (input === '3') {
    if (session.data.userId) {
      const progress = await progressAPI.getUserProgress(session.data.userId);
      const progressText = progress
        .map((p) => `Course: ${p.course_id.substring(0, 8)} - ${p.lessons_completed} lessons`)
        .join('\n');
      session.navigateTo('progressMenu');
      return menus.progressMenu.replace('{progress}', progressText || 'No courses started yet');
    } else {
      return 'Please login first.\n' + menus.mainMenu;
    }
  } else if (input === '4') {
    if (session.data.userId) {
      session.navigateTo('chatbotQuestion');
      return menus.chatbotMenu;
    } else {
      return 'Please login first.\n' + menus.mainMenu;
    }
  } else if (input === '0') {
    deleteSession(session.phoneNumber);
    return 'Thank you for using EduBridge. Goodbye!';
  }

  return menus.mainMenu;
};

const handleLoginChoice = async (session, input, language) => {
  const menus = menuTexts[language];

  if (input === '1') {
    session.navigateTo('registerPhone');
    return language === 'en'
      ? 'Enter your phone number (digits only):'
      : 'Andika numero yitwa (imibare yonyine):';
  } else if (input === '2') {
    if (session.data.phone) {
      session.navigateTo('registerPassword');
      return language === 'en'
        ? 'Enter your password:'
        : 'Andika ijambo-poreoni:';
    }
    return 'Please enter phone first.';
  } else if (input === 'b' || input === '0') {
    session.navigateTo('mainMenu');
    return menus.mainMenu;
  }

  return `${menus.loginMenu}\nType 'B' to go back`;
};

const handleRegisterPhone = async (session, input, language) => {
  if (input && input.length >= 7) {
    session.data.phone = input;
    session.navigateTo('registerPassword');
    return language === 'en'
      ? 'Create a password (min 8 characters):'
      : 'Krira ijambo-poreoni (imibare 8 ubworyo):';
  }

  return language === 'en'
    ? 'Invalid phone number. Please try again:'
    : 'Numero itaturutse. Mwigeze:';
};

const handleRegisterPassword = async (session, input, language) => {
  const menus = menuTexts[language];

  if (input && input.length >= 8) {
    const user = await authAPI.registerUSSD(session.data.phone, input);
    if (user) {
      session.data.userId = user.id;
      session.data.token = user.token;
      session.navigateTo('mainMenu');
      return `${menus.successMessage.replace('Success!', 'Registration Successful!')}`;
    }
  }

  return language === 'en'
    ? 'Password too short (min 8). Please try again:'
    : 'Ijambo-poreoni gito. Mwigeze:';
};

const handleCoursesMenu = async (session, input, language) => {
  const menus = menuTexts[language];
  const courseIdx = parseInt(input) - 1;

  if (courseIdx >= 0 && courseIdx < session.data.courses.length) {
    const course = session.data.courses[courseIdx];
    session.data.selectedCourse = course;
    session.navigateTo('courseDetails');
    return `${course.title}\n${course.description.substring(0, 100)}...\n\n1. View Details\n0. Back`;
  } else if (input === '0') {
    session.navigateTo('mainMenu');
    return menus.mainMenu;
  }

  return menus.coursesMenu;
};

const handleCourseDetails = async (session, input, language) => {
  const menus = menuTexts[language];

  if (input === '1') {
    const course = session.data.selectedCourse;
    return `${course.title}\nLevel: ${course.level}\nDuration: ${course.duration_weeks} weeks\n\n1. Enroll\n0. Back`;
  } else if (input === '0') {
    session.navigateTo('coursesMenu');
    return menus.coursesMenu;
  }

  return `${session.data.selectedCourse.title}\n1. View Details\n0. Back`;
};

const handleProgressMenu = async (session, input, language) => {
  const menus = menuTexts[language];

  if (input === '0') {
    session.navigateTo('mainMenu');
    return menus.mainMenu;
  }

  return menus.progressMenu.replace('{progress}', 'Your courses loaded');
};

const handleChatbotQuestion = async (session, input, language) => {
  if (!input) return menuTexts[language].chatbotMenu;

  const response = await chatbotAPI.askQuestion(input, session.data.selectedCourse?.id);
  
  // Truncate response to fit USSD limit (160 chars typical)
  const maxLength = 150;
  const truncatedResponse = response.length > maxLength 
    ? response.substring(0, maxLength) + '...' 
    : response;

  session.navigateTo('mainMenu');
  return `Answer: ${truncatedResponse}\n\n${menuTexts[language].mainMenu}`;
};
