#!/usr/bin/env node

/**
 * Sample Data Generator for Education Bridge
 * Run this after the backend is running to populate the database with test data
 * 
 * Usage: node scripts/generate-sample-data.js
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.BACKEND_URL || 'http://localhost:3000/api';
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;

// Sample data
const samplesData = {
  admin: {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@edubridge.com',
    password: 'Admin@123456',
  },
  educator: {
    firstName: 'Dr. Jane',
    lastName: 'Smith',
    email: 'jane.smith@edubridge.com',
    password: 'Educator@123456',
  },
  students: [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@edubridge.com',
      password: 'Student@123456',
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@edubridge.com',
      password: 'Student@123456',
    },
    {
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'ahmed.hassan@edubridge.com',
      password: 'Student@123456',
    },
    {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@edubridge.com',
      password: 'Student@123456',
    },
  ],
};

const coursesData = [
  {
    title: 'Introduction to Python Programming',
    description: 'Learn Python basics including variables, loops, functions, and data structures. Perfect for beginners!',
    category: 'Programming',
    level: 'beginner',
    content: 'Complete guide to Python programming',
    duration_weeks: 8,
    lessons: [
      {
        title: 'Getting Started with Python',
        content: '# Introduction to Python\n\nPython is a powerful, beginner-friendly programming language.\n\n## Topics:\n- Installing Python\n- Setting up your IDE\n- Writing your first program\n\n## Exercise: Write a program that prints "Hello, Python!"',
        lesson_order: 1,
      },
      {
        title: 'Variables and Data Types',
        content: '# Variables and Data Types\n\n## Variables\nVariables store data values.\n\n## Data Types\n- **Integers**: 42, -10\n- **Strings**: "Hello"\n- **Floats**: 3.14\n- **Booleans**: True, False\n- **Lists**: [1, 2, 3]\n\n## Example:\n```python\nname = "Alice"\nage = 25\nheight = 5.7\nis_student = True\n```',
        lesson_order: 2,
      },
      {
        title: 'Control Flow: If Statements',
        content: '# Control Flow\n\n## If Statements\nMake decisions in your code.\n\n```python\nif age >= 18:\n    print("You are an adult")\nelif age >= 13:\n    print("You are a teenager")\nelse:\n    print("You are a child")\n```\n\n## Exercise: Create a program that checks if a number is positive, negative, or zero.',
        lesson_order: 3,
      },
      {
        title: 'Loops: For and While',
        content: '# Loops\n\n## For Loop\nRepeat code for each item in a collection.\n\n```python\nfor i in range(5):\n    print(i)\n```\n\n## While Loop\nRepeat code while a condition is true.\n\n```python\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n```',
        lesson_order: 4,
      },
      {
        title: 'Functions and Modules',
        content: '# Functions and Modules\n\n## Creating Functions\n\n```python\ndef greet(name):\n    return f"Hello, {name}!"\n```\n\n## Using Modules\n\n```python\nimport math\nprint(math.sqrt(16))  # Output: 4.0\n```',
        lesson_order: 5,
      },
    ],
  },
  {
    title: 'Web Development Fundamentals',
    description: 'Master HTML, CSS, and JavaScript to build responsive websites. Learn front-end development basics.',
    category: 'Web Development',
    level: 'beginner',
    content: 'Complete web development course',
    duration_weeks: 10,
    lessons: [
      {
        title: 'Introduction to HTML',
        content: '# HTML Basics\n\n## What is HTML?\nHTML (HyperText Markup Language) is the standard markup language for web pages.\n\n## Basic Structure\n```html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Welcome!</h1>\n    <p>This is a paragraph.</p>\n</body>\n</html>\n```',
        lesson_order: 1,
      },
      {
        title: 'CSS Styling',
        content: '# CSS Styling\n\n## Adding Styles\n\n```css\nbody {\n    background-color: #f0f0f0;\n    font-family: Arial, sans-serif;\n}\n\nh1 {\n    color: #1E3A8A;\n    text-align: center;\n}\n```\n\n## Colors and Layouts',
        lesson_order: 2,
      },
      {
        title: 'JavaScript Basics',
        content: '# JavaScript Fundamentals\n\n## Variables and Types\n\n```javascript\nlet name = "John";\nlet age = 25;\nlet isActive = true;\n```\n\n## Functions\n\n```javascript\nfunction add(a, b) {\n    return a + b;\n}\n```',
        lesson_order: 3,
      },
    ],
  },
];

// Utility functions
const createUser = async (userData, adminSecret = null) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    if (adminSecret) {
      config.headers['X-Admin-Secret'] = adminSecret;
    }

    const response = await axios.post(`${API_URL}/auth/register`, userData, config);
    console.log(`✓ Created user: ${userData.email}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log(`⊘ User already exists: ${userData.email}`);
      // Try to login to get token
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: userData.email,
        password: userData.password,
      });
      return loginResponse.data.data;
    }
    console.error(`✗ Failed to create user ${userData.email}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

const createCourse = async (courseData, token) => {
  try {
    const { lessons, ...course } = courseData;
    const response = await axios.post(`${API_URL}/content/courses`, course, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✓ Created course: ${courseData.title}`);
    return response.data.data;
  } catch (error) {
    console.error(`✗ Failed to create course ${courseData.title}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

const createLesson = async (courseId, lessonData, token) => {
  try {
    const response = await axios.post(`${API_URL}/content/lessons`, {
      courseId,
      ...lessonData,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`  ✓ Created lesson: ${lessonData.title}`);
    return response.data.data;
  } catch (error) {
    console.error(`  ✗ Failed to create lesson ${lessonData.title}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

const enrollStudent = async (courseId, token) => {
  try {
    await axios.post(`${API_URL}/progress/enroll`, {
      courseId,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 409) {
      // Already enrolled, that's fine
      return true;
    }
    console.error(`  ✗ Failed to enroll student:`, error.response?.data?.message || error.message);
    return false;
  }
};

// Main execution
const generateSampleData = async () => {
  try {
    console.log('\n🚀 Starting Education Bridge Sample Data Generation\n');
    console.log(`API URL: ${API_URL}\n`);

    // Create Admin
    console.log('📝 Creating Admin Account...');
    const adminData = await createUser(samplesData.admin, ADMIN_SECRET);
    const adminToken = adminData.token || adminData.access_token;

    // Create Educator
    console.log('\n📝 Creating Educator...');
    const educatorData = await createUser(
      { ...samplesData.educator, role: 'educator' },
      ADMIN_SECRET
    );
    const educatorToken = educatorData.token || educatorData.access_token;

    // Create Students
    console.log('\n📝 Creating Students...');
    const studentTokens = [];
    for (const studentData of samplesData.students) {
      const user = await createUser(
        { ...studentData, role: 'student' },
        ADMIN_SECRET
      );
      studentTokens.push(user.token || user.access_token);
    }

    // Create Courses with Lessons
    console.log('\n📚 Creating Courses and Lessons...');
    const createdCourses = [];
    for (const courseData of coursesData) {
      const course = await createCourse(courseData, educatorToken);
      createdCourses.push(course);

      // Create lessons for this course
      for (const lessonData of courseData.lessons) {
        await createLesson(course.id, lessonData, educatorToken);
      }
    }

    // Enroll students in courses
    console.log('\n📋 Enrolling Students in Courses...');
    for (let i = 0; i < studentTokens.length; i++) {
      console.log(`\n  Student ${i + 1}:`);
      for (const course of createdCourses) {
        const enrolled = await enrollStudent(course.id, studentTokens[i]);
        if (enrolled) {
          console.log(`    ✓ Enrolled in: ${course.title}`);
        }
      }
    }

    console.log('\n✅ Sample data generation completed!\n');
    console.log('📧 Test Accounts Created:');
    console.log(`\n  Admin:\n    Email: ${samplesData.admin.email}\n    Password: ${samplesData.admin.password}`);
    console.log(`\n  Educator:\n    Email: ${samplesData.educator.email}\n    Password: ${samplesData.educator.password}`);
    console.log('\n  Students:');
    samplesData.students.forEach((student, index) => {
      console.log(`    ${index + 1}. ${student.email} / ${student.password}`);
    });

    console.log('\n🚀 Ready to test! Visit http://localhost:5173 and login with any of the accounts above.\n');
  } catch (error) {
    console.error('\n❌ Error generating sample data:', error.message);
    process.exit(1);
  }
};

// Run the generator
generateSampleData();
