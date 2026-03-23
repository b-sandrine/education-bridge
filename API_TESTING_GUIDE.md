# API Testing & Documentation Guide

Complete guide to test, document, and interact with the EduBridge API.

## 🚀 Quick Start

### Fastest Path (2 minutes)

1. **Start the backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Visit Swagger UI**
   - Open: `http://localhost:3000/api-docs`
   - Click "Try it out" on any endpoint
   - Test directly in your browser

## 📖 Documentation Options

### 1. Swagger UI (Interactive) ⭐ Recommended

**Best for**: Visual exploration, quick testing, learning new endpoints

**Setup**:
```bash
cd backend
npm install swagger-ui-express yaml
npm run dev
```

**Access**: `http://localhost:3000/api-docs`

**Features**:
- ✅ Visual endpoint documentation
- ✅ Try endpoints without curl/Postman
- ✅ Automatic request/response examples
- ✅ Schema reference inline
- ✅ Download spec as JSON

**Tip**: Click endpoint to expand, then "Try it out"

### 2. ReDoc (Beautiful Documentation)

**Best for**: Reading-only documentation, sharing with non-developers

**Setup**:
```bash
npm install redoc-express  # in backend
```

Update `server.js`:
```javascript
import redoc from 'redoc-express';
app.use('/redoc', redoc({
  title: 'EduBridge API',
  specUrl: '/api/openapi.json',
}));
```

**Access**: `http://localhost:3000/redoc`

### 3. Swagger UI Online

**Best for**: No local setup needed, sharing link

**Steps**:
1. Go to [Swagger Editor](https://editor.swagger.io)
2. Click "File" → "Import URL"
3. Paste: Raw GitHub link to openapi.yaml
4. Or paste file content directly

### 4. Postman

**Best for**: Advanced testing, collections, environments

**Option A - Import OpenAPI**:
1. Open Postman
2. Click "Import"
3. Paste `backend/openapi.yaml` content
4. Click "Import as APIs"

**Option B - Manual Collection**:
1. Create new collection "EduBridge API"
2. Create requests:
   ```
   POST http://localhost:3000/api/auth/login
   POST http://localhost:3000/api/auth/register
   GET http://localhost:3000/api/content/courses
   ```

### 5. REST Client Extension (VS Code)

**Best for**: Testing while coding

**Install**: VS Code "REST Client" extension

**Create `.http` file**:
```http
### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "student@edubridge.com",
  "password": "password123"
}

### Get Courses
GET http://localhost:3000/api/content/courses?level=beginner
Authorization: Bearer YOUR_TOKEN_HERE

### Get User Profile  
GET http://localhost:3000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

Click "Send Request" above each request

## 🧪 Testing Workflows

### Workflow 1: Learn the API (5 minutes)

1. Start server: `npm run dev`
2. Open Swagger UI: `http://localhost:3000/api-docs`
3. Explore endpoints in this order:
   - `/health` (GET) - Verify server running
   - `/auth/register` (POST) - Create test account
   - `/auth/login` (POST) - Get token
   - `/content/courses` (GET) - Browse courses
   - `/content/lessons/{id}` (GET) - View lesson

### Workflow 2: Full Authentication Flow

#### Step 1: Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "password": "SecurePass123!",
    "role": "student"
  }'
```

Response: `user object + token`

#### Step 2: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecurePass123!"
  }'
```

Response: `{ user, token }`

#### Step 3: Get Profile (using token)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Workflow 3: Course Management (Educator)

#### Create Course
```bash
curl -X POST http://localhost:3000/api/content/courses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Math",
    "description": "Higher level mathematics",
    "category": "Mathematics",
    "level": "intermediate",
    "duration": 12
  }'
```

#### Add Lesson
```bash
curl -X POST http://localhost:3000/api/content/lessons \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "COURSE_UUID",
    "title": "Lesson 1",
    "content": "Lesson content here",
    "order": 1
  }'
```

#### Get Course with Lessons
```bash
curl -X GET http://localhost:3000/api/content/courses/COURSE_UUID/lessons \
  -H "Authorization: Bearer TOKEN"
```

### Workflow 4: Student Progress Tracking

#### Enroll in Course
```bash
curl -X POST http://localhost:3000/api/progress/courses/COURSE_UUID/start \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

#### Update Progress
```bash
curl -X PUT http://localhost:3000/api/progress/courses/COURSE_UUID/update \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentLesson": 3,
    "completedLessons": [1, 2],
    "timeSpent": 120
  }'
```

#### Get Course Progress
```bash
curl -X GET http://localhost:3000/api/progress/courses/COURSE_UUID/progress \
  -H "Authorization: Bearer TOKEN"
```

#### Complete Course
```bash
curl -X POST http://localhost:3000/api/progress/courses/COURSE_UUID/complete \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

### Workflow 5: Chatbot Integration

#### Ask Question
```bash
curl -X POST http://localhost:3000/api/chatbot/ask \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How do I calculate derivatives?",
    "context": "Mathematics course"
  }'
```

## 📊 API Endpoint Summary

### Authentication (5 endpoints)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | None | Create account |
| POST | `/auth/login` | None | Get token |
| GET | `/auth/profile` | JWT | Get user info |
| PUT | `/auth/profile` | JWT | Update profile |
| POST | `/auth/logout` | JWT | Logout |

### Content (10 endpoints)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/content/courses` | None | List courses |
| POST | `/content/courses` | JWT | Create course |
| GET | `/content/courses/{id}` | None | Get course |
| PUT | `/content/courses/{id}` | JWT | Update course |
| DELETE | `/content/courses/{id}` | JWT | Delete course |
| POST | `/content/lessons` | JWT | Create lesson |
| GET | `/content/lessons/{id}` | None | Get lesson |
| PUT | `/content/lessons/{id}` | JWT | Update lesson |
| DELETE | `/content/lessons/{id}` | JWT | Delete lesson |
| GET | `/content/courses/{id}/lessons` | None | Get lessons |

### Progress (5 endpoints)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/progress/courses/{id}/start` | JWT | Enroll course |
| PUT | `/progress/courses/{id}/update` | JWT | Update progress |
| GET | `/progress/progress` | JWT | Get all progress |
| GET | `/progress/courses/{id}/progress` | JWT | Get course progress |
| POST | `/progress/courses/{id}/complete` | JWT | Complete course |

### System
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/health` | None | Health check |

## 🔐 Authentication Details

### Token Format
Obtained from login/register:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFsZXhAZXhhbXBsZS5jb20iLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTcwMzA1NDAwMH0...."
}
```

### Using Token
Add to every authenticated request:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Lifetime
- **Expires**: 7 days (604800 seconds)
- **Refresh**: Not yet implemented (future feature)
- **On Expiration**: Re-login to get new token

## ❌ Error Handling

### Common Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad Request | Missing required field |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Course doesn't exist |
| 409 | Conflict | Email already registered |
| 500 | Server Error | Database connection failed |

### Error Response Format
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed",
  "details": ["Email is required"]
}
```

## 🎯 Common Tasks

### Task: Get Current User Info
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Task: List All Courses
```bash
curl -X GET "http://localhost:3000/api/content/courses?category=Mathematics&level=beginner"
```

### Task: Find Courses by Category
```bash
curl -X GET "http://localhost:3000/api/content/courses?category=Science"
```

### Task: Get Single Course Details
```bash
curl -X GET http://localhost:3000/api/content/courses/COURSE_ID
```

### Task: Get All Lessons in Course
```bash
curl -X GET http://localhost:3000/api/content/courses/COURSE_ID/lessons
```

### Task: Get User's Progress
```bash
curl -X GET http://localhost:3000/api/progress/progress \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Troubleshooting

### Server Not Starting
```bash
# Check port is available
netstat -ano | findstr :3000  # Windows
lsof -i :3000  # Mac/Linux

# Check .env file exists
cat backend/.env

# Clear node_modules
rm -rf backend/node_modules
npm install
```

### "Unauthorized" on Authenticated Endpoints
```bash
# Ensure token format is correct
# Full header: Authorization: Bearer TOKEN_HERE

# Check token hasn't expired (7 days)

# Verify you got token from login/register
```

### "Invalid Request" Errors
```bash
# Check Content-Type header
-H "Content-Type: application/json"

# Validate JSON syntax
# Use VS Code or jsonlint.com to check
```

### CORS Errors
```bash
# If frontend can't reach backend API:
# 1. Ensure backend is running on correct port (3000)
# 2. Check CORS_ORIGIN in .env
# 3. Verify frontend URL matches CORS_ORIGIN
```

## 📚 Additional Resources

- [Full API Documentation](./docs/API.md)
- [OpenAPI Specification](./backend/openapi.yaml)
- [Swagger Setup Guide](./backend/SWAGGER_SETUP.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Database Schema](./database/README.md)

## 🤝 Next Steps

1. **Local Testing**: Use Swagger UI for visual testing
2. **Integration**: Use REST Client or Postman for development
3. **Production**: Deploy API and use live Swagger docs
4. **Monitoring**: Set up logging and API usage tracking

---

**Last Updated**: January 2024  
**OpenAPI Version**: 3.0.0  
**Backend Version**: 1.0.0
