# EduBridge API Documentation

Complete API reference for the EduBridge backend server.

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.edubridge.rw/api/v1
```

## Authentication

All endpoints (except Auth endpoints) require JWT authentication.

### Header Format
```
Authorization: Bearer <access_token>
```

### Getting Tokens

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "student"
    }
  }
}
```

**Refresh Token**
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## Authentication Endpoints

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "dateOfBirth": "2005-01-15",
  "guardianName": "Jane Doe",
  "guardianPhone": "+250788000000"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "newuser@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
}
```

### Login

_See "Getting Tokens" section above_

### Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Forgot Password

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

### Reset Password

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "newPassword": "NewSecurePassword123!"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully"
}
```

## Course Endpoints

### Get All Courses

```http
GET /courses?page=1&limit=20&subject=math&gradeLevel=6
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course-uuid",
        "title": "Basic Mathematics",
        "description": "Introduction to math concepts",
        "subject": "math",
        "gradeLevel": 6,
        "enrollmentCount": 150,
        "averageRating": 4.5,
        "totalLessons": 12,
        "thumbnailUrl": "https://..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### Get Course Details

```http
GET /courses/{courseId}
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "id": "course-uuid",
    "title": "Basic Mathematics",
    "description": "Introduction to math concepts",
    "subject": "math",
    "gradeLevel": 6,
    "createdBy": {
      "id": "educator-uuid",
      "name": "Jane Smith"
    },
    "lessons": [
      {
        "id": "lesson-uuid",
        "title": "Lesson 1: Numbers",
        "duration": 30,
        "contentType": "video"
      }
    ],
    "enrollmentCount": 150,
    "averageRating": 4.5,
    "isEnrolled": true
  }
}
```

### Create Course

```http
POST /courses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Advanced Mathematics",
  "description": "Advanced math for grade 12",
  "subject": "math",
  "gradeLevel": 12,
  "difficultyLevel": "advanced",
  "durationHours": 40
}

Response (201):
{
  "success": true,
  "data": {
    "id": "course-uuid",
    "title": "Advanced Mathematics",
    "subject": "math",
    "gradeLevel": 12,
    "createdBy": "educator-uuid"
  }
}
```

### Update Course

```http
PUT /courses/{courseId}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### Delete Course

```http
DELETE /courses/{courseId}
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "message": "Course deleted successfully"
}
```

## Lesson Endpoints

### Get Course Lessons

```http
GET /courses/{courseId}/lessons
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "lessons": [
      {
        "id": "lesson-uuid",
        "title": "Lesson 1: Numbers",
        "description": "Introduction to numbers",
        "duration": 30,
        "contentType": "video",
        "orderIndex": 1,
        "completionPercentage": 75
      }
    ]
  }
}
```

### Get Lesson Details

```http
GET /lessons/{lessonId}
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "id": "lesson-uuid",
    "title": "Lesson 1: Numbers",
    "content": "Lesson content here...",
    "contentType": "video",
    "videoUrl": "https://...",
    "duration": 30,
    "courseId": "course-uuid",
    "learningObjectives": ["Understand numbers", "Basic operations"],
    "media": [
      {
        "type": "image",
        "url": "https://..."
      }
    ]
  }
}
```

### Create Lesson

```http
POST /lessons
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "courseId": "course-uuid",
  "title": "New Lesson",
  "description": "Lesson description",
  "content": "Lesson content",
  "contentType": "text",
  "duration": 20,
  "orderIndex": 1
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

## Enrollment Endpoints

### Get Student Enrollments

```http
GET /enrollments
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "enrollment-uuid",
        "courseId": "course-uuid",
        "courseName": "Basic Mathematics",
        "enrollmentStatus": "active",
        "enrollmentDate": "2024-01-15",
        "progressPercentage": 45,
        "totalLessons": 12,
        "completedLessons": 5
      }
    ]
  }
}
```

### Enroll in Course

```http
POST /enrollments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "courseId": "course-uuid"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "enrollment-uuid",
    "courseId": "course-uuid",
    "enrollmentStatus": "active",
    "enrollmentDate": "2024-01-20"
  }
}
```

### Drop Course

```http
DELETE /enrollments/{enrollmentId}
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "message": "Course dropped successfully"
}
```

## Progress Endpoints

### Get Student Progress

```http
GET /students/{studentId}/progress
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "studentId": "student-uuid",
    "coursesEnrolled": 5,
    "coursesCompleted": 2,
    "lessonProgress": [
      {
        "lessonId": "lesson-uuid",
        "title": "Lesson 1",
        "completionPercentage": 100,
        "score": 85,
        "dateCompleted": "2024-01-18"
      }
    ],
    "totalPoints": 450,
    "overallProgress": 54
  }
}
```

### Update Progress

```http
POST /progress/update
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "lessonId": "lesson-uuid",
  "enrollmentId": "enrollment-uuid",
  "completionPercentage": 50,
  "timeSpent": 1800,
  "quizScore": 80
}

Response (200):
{
  "success": true,
  "data": {
    "progressId": "progress-uuid",
    "lessonId": "lesson-uuid",
    "completionPercentage": 50,
    "lastUpdated": "2024-01-20T10:30:00Z"
  }
}
```

### Get Progress Reports

```http
GET /students/{studentId}/reports?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "period": "2024-01-01 to 2024-01-31",
    "coursesCompleted": 1,
    "lessonsCompleted": 8,
    "totalTimeSpent": 14400,
    "averageScore": 82,
    "pointsEarned": 120,
    "achievementsEarned": ["First Lesson", "Week Streak"]
  }
}
```

## Chat/Chatbot Endpoints

### Ask Question

```http
POST /chat/ask
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "question": "What is the pythagorean theorem?",
  "courseId": "course-uuid",
  "lessonId": "lesson-uuid"
}

Response (200):
{
  "success": true,
  "data": {
    "interactionId": "chat-uuid",
    "question": "What is the pythagorean theorem?",
    "answer": "The Pythagorean theorem states that...",
    "responsetime": 1250,
    "aiProvider": "openai"
  }
}
```

### Get Chat History

```http
GET /chat/history/{studentId}?limit=20&offset=0
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "interactions": [
      {
        "id": "chat-uuid",
        "question": "What is the pythagorean theorem?",
        "answer": "The Pythagorean theorem states...",
        "rating": 5,
        "createdAt": "2024-01-20T09:30:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "offset": 0
    }
  }
}
```

### Rate Response

```http
POST /chat/rate-response
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "interactionId": "chat-uuid",
  "rating": 5,
  "feedback": "Very helpful answer"
}

Response (200):
{
  "success": true,
  "message": "Response rated successfully"
}
```

## User Profile Endpoints

### Get Current User Profile

```http
GET /users/profile
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "avatarUrl": "https://...",
    "dateOfBirth": "2005-01-15"
  }
}
```

### Update Profile

```http
PUT /users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2005-01-15",
  "avatarUrl": "https://..."
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### Change Password

```http
POST /users/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Admin Endpoints

### Get All Users

```http
GET /admin/users?page=1&limit=50&role=student&search=john
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "student",
        "createdAt": "2024-01-15",
        "isActive": true
      }
    ],
    "pagination": { ... }
  }
}
```

### Get System Reports

```http
GET /admin/reports?reportType=engagement&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "data": {
    "reportType": "engagement",
    "period": "2024-01-01 to 2024-01-31",
    "activeUsers": 245,
    "newEnrollments": 78,
    "coursesCompleted": 12,
    "averageSessionDuration": 1850,
    "topCourses": [
      {
        "courseId": "course-uuid",
        "title": "Basic Mathematics",
        "enrollments": 45,
        "completionRate": 68
      }
    ]
  }
}
```

## USSD Endpoints

### Send USSD Response

```http
POST /ussd/send
Content-Type: application/json

{
  "phoneNumber": "+250788000000",
  "sessionId": "session-uuid",
  "message": "Welcome to EduBridge..."
}

Response (200):
{
  "success": true,
  "message": "USSD message sent"
}
```

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Message |
|------|--------|---------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `INVALID_CREDENTIALS` | 401 | Email or password incorrect |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Access forbidden |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "details": {
      "field": "email"
    }
  }
}
```

## Rate Limiting

Rate limits are applied per endpoint:

- **Public endpoints**: 100 requests/15 minutes per IP
- **Auth endpoints**: 5 requests/15 minutes per IP
- **API endpoints**: 1000 requests/hour per user

Response headers include:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705769400
```

## Pagination

List endpoints support pagination:

```
GET /endpoint?page=1&limit=20&sort=createdAt&order=desc
```

Response includes:

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Filtering & Search

Endpoints support filtering:

```
GET /courses?subject=math&gradeLevel=6&search=basic&sortBy=enrollmentCount
```

## Response Headers

All responses include:

```
Content-Type: application/json
X-Request-ID: unique-request-id
X-API-Version: 1.0.0
Cache-Control: no-cache, no-store, must-revalidate
```

---

**API Version**: 1.0.0  
**Last Updated**: 2026-01-25
