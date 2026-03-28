# Education Bridge - System Testing Guide

## Overview
This guide will help you set up the system with sample data and test all features end-to-end.

## Current Status
- ✅ All features implemented and styled
- ✅ API endpoints configured
- ✅ Database schema created
- ✅ Navigation and routing working
- ⏳ **NEEDED**: Sample data for testing

## Prerequisites

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Create .env file with your configuration

# The backend will auto-initialize the database on startup
npm start  # Runs on http://localhost:3000
```

### Frontend Setup
```bash
cd web
npm install
npm run dev  # Runs on http://localhost:5173
```

---

## Part 1: Create Admin Account

### Step 1: Generate Admin Secret Key
```bash
openssl rand -hex 32
```
Output: `abc123def456...` (copy this)

### Step 2: Add to Backend .env
```env
ADMIN_SECRET_KEY=abc123def456...
```

### Step 3: Create Admin Account
```bash
cd backend
node scripts/create-admin.js
```

**Prompts will ask for:**
- Email: `admin@edubridge.com`
- First Name: `Admin`
- Last Name: `User`
- Password: `Admin@123456`

---

## Part 2: Create Test Users

### Create Educator User (POST Request)

**Using curl:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Educator",
    "email": "educator@edubridge.com",
    "password": "Educator@123456",
    "role": "educator"
  }'
```

**Response includes token - save it for next requests**

### Create Student Users (Repeat 3x)

**Student 1:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Student",
    "email": "john@edubridge.com",
    "password": "Student@123456",
    "role": "student"
  }'
```

**Student 2:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Learner",
    "email": "sarah@edubridge.com",
    "password": "Student@123456",
    "role": "student"
  }'
```

**Student 3:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ahmed",
    "lastName": "Scholar",
    "email": "ahmed@edubridge.com",
    "password": "Student@123456",
    "role": "student"
  }'
```

---

## Part 3: Create Course & Lessons

### Step 1: Get Educator Token
Login as educator first to get token (we'll use it for course creation)

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "educator@edubridge.com",
    "password": "Educator@123456"
  }'
```

**Extract the `token` from response (it's in `data.token`)**

### Step 2: Create Course
```bash
curl -X POST http://localhost:3000/api/content/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_EDUCATOR_TOKEN" \
  -d '{
    "title": "Introduction to Python",
    "description": "Learn Python programming basics for beginners",
    "category": "Programming",
    "level": "beginner",
    "content": "This course teaches Python fundamentals including variables, loops, functions, and more.",
    "duration_weeks": 8
  }'
```

**Save the returned `id` - you'll need it for lessons**

### Step 3: Create Lessons (Create 3)

**Lesson 1:**
```bash
curl -X POST http://localhost:3000/api/content/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_EDUCATOR_TOKEN" \
  -d '{
    "courseId": "COURSE_ID_FROM_STEP_2",
    "title": "Getting Started with Python",
    "content": "## Introduction\n\nPython is a high-level programming language known for its simplicity and readability.\n\n### Key Topics:\n1. Installing Python\n2. Setting up your first IDE\n3. Writing your first program\n\n### Exercise:\nWrite a program that prints 'Hello, World!'",
    "lesson_order": 1,
    "video_url": "https://example.com/lesson1.mp4"
  }'
```

**Lesson 2:**
```bash
curl -X POST http://localhost:3000/api/content/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_EDUCATOR_TOKEN" \
  -d '{
    "courseId": "COURSE_ID_FROM_STEP_2",
    "title": "Variables and Data Types",
    "content": "## Understanding Variables\n\nVariables are containers for storing data values.\n\n### Data Types in Python:\n- Integers (int): 42, -10\n- Strings (str): \"Hello\", \"World\"\n- Floats (float): 3.14, -2.5\n- Booleans (bool): True, False\n\n### Example:\n```python\nname = \"John\"  # String\nage = 25       # Integer\nheight = 5.9   # Float\n```",
    "lesson_order": 2,
    "video_url": "https://example.com/lesson2.mp4"
  }'
```

**Lesson 3:**
```bash
curl -X POST http://localhost:3000/api/content/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_EDUCATOR_TOKEN" \
  -d '{
    "courseId": "COURSE_ID_FROM_STEP_2",
    "title": "Control Flow: If Statements",
    "content": "## Conditional Statements\n\nConditional statements allow your program to make decisions.\n\n### If Statement Structure:\n```python\nif condition:\n    # Execute if condition is true\nelif condition2:\n    # Execute if condition2 is true\nelse:\n    # Execute if no conditions are true\n```\n\n### Example:\n```python\nage = 18\nif age >= 18:\n    print(\"You are an adult\")\nelse:\n    print(\"You are a minor\")\n```",
    "lesson_order": 3,
    "video_url": "https://example.com/lesson3.mp4"
  }'
```

---

## Part 4: Enroll Students in Course

Get a student token first, then enroll them:

**Student Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@edubridge.com",
    "password": "Student@123456"
  }'
```

**Enroll Student (repeat for each student with their token):**
```bash
curl -X POST http://localhost:3000/api/progress/enroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -d '{
    "courseId": "COURSE_ID_FROM_PART_3_STEP_2"
  }'
```

---

## Part 5: Test Complete Flows

### Flow 1: Student User Journey

**Step 1:** Go to http://localhost:5173/login

**Step 2:** Login as Student
- Email: `john@edubridge.com`
- Password: `Student@123456`

**Step 3:** You should see:
- ✅ Student Dashboard with enrolled courses
- ✅ Course cards showing progress
- ✅ Stats cards (Total, In Progress, Completed)

**Step 4:** Click "Continue Learning" on a course

**Step 5:** You should see:
- ✅ Course title and description
- ✅ Lesson list on the right
- ✅ Click a lesson to view content
- ✅ Lesson video player
- ✅ AI Tutor chatbot interface at bottom

**Step 6:** Try the AI Tutor
- Click in the chat box
- Ask a question about the course
- You should get AI-generated responses

### Flow 2: Educator Dashboard

**Step 1:** Login as Educator
- Email: `educator@edubridge.com`
- Password: `Educator@123456`

**Step 2:** Should see:
- ✅ Educator Dashboard
- ✅ "My Courses" tab with your created course
- ✅ "Class Analytics" tab

**Step 3:** Click "Manage Lessons"
- Should see created lessons
- Can edit/delete lessons
- Can add more lessons

**Step 4:** Go to "Class Analytics" tab
- Should see real student data (not mock)
- Student names, progress, scores
- Performance chart

**Step 5:** Click on a student to view details
- Student profile
- Progress trends (chart)
- Lesson breakdown
- Summary statistics

### Flow 3: Admin Dashboard

**Step 1:** Login as Admin
- Email: `admin@edubridge.com`
- Password: `Admin@123456`

**Step 2:** Should see Admin Dashboard with 5 tabs:
- ✅ **Overview**: System statistics and charts
- ✅ **Courses**: List of all courses with delete option
- ✅ **Users**: User management interface
- ✅ **Enrollments**: Enrollment management
- ✅ **Queries**: Student help requests

**Step 3:** Check each tab functions

---

## Troubleshooting

### Issue: "Cannot find students" in Educator Dashboard

**Solution:** 
- Make sure students are enrolled in the course
- Refresh the page (Ctrl+R)
- Check browser console (F12) for error messages

### Issue: Lessons not showing in Course Detail Page

**Solution:**
- Verify lessons were created with the correct `courseId`
- Check that lessons have `lesson_order` set (1, 2, 3...)
- Make sure the course ID in the URL matches

### Issue: "401 Unauthorized" when creating content

**Solution:**
- Make sure Authorization token is included: `Authorization: Bearer TOKEN`
- Token might have expired - get a new token by logging in again
- Verify the token is for an educator or admin role

### Issue: Students see an empty course list

**Solution:**
- Verify student is enrolled (POST to `/api/progress/enroll`)
- Check that `progress` table has record for student
- Refresh the page

---

## Database Queries for Verification

If you want to check the database directly (using psql):

```sql
-- See all users
SELECT id, first_name, last_name, email, role FROM users;

-- See all courses
SELECT id, title, educator_id, category FROM courses;

-- See all lessons
SELECT id, course_id, title, lesson_order FROM lessons;

-- See all enrollments
SELECT p.id, u.email, c.title, p.status, p.lessons_completed 
FROM progress p 
JOIN users u ON p.user_id = u.id 
JOIN courses c ON p.course_id = c.id;
```

---

## Key API Endpoints Summary

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/auth/register` | POST | Create user | None |
| `/api/auth/login` | POST | Login user | None |
| `/api/content/courses` | POST | Create course | Educator/Admin |
| `/api/content/courses` | GET | Get all courses | Any |
| `/api/content/courses/:id` | GET | Get course with lessons | Any |
| `/api/content/lessons` | POST | Create lesson | Educator/Admin |
| `/api/content/courses/:courseId/students` | GET | Get enrolled students | Educator/Admin |
| `/api/progress/enroll` | POST | Enroll student | Student |
| `/api/progress/user` | GET | Get student's progress | Student |
| `/api/content/courses/:id/lessons/:lessonId` | PUT | Update lesson | Educator/Admin |

---

## Next Steps After Testing

1. **Verify all flows work** - Test each user role and feature
2. **Check performance** - Monitor API response times
3. **Test error cases** - Try invalid inputs, unauthorized access
4. **Deploy** - Follow deployment guide in `/docs/DEPLOYMENT.md`

---

## Support

For issues or questions:
- Check API documentation: http://localhost:3000/api-docs
- Review error logs in backend console
- Check browser console (F12) for frontend errors
