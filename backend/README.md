# EduBridge Backend API

Node.js/Express.js backend server for the EduBridge multi-platform learning system.

## Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- Redis 6+
- npm or yarn

### Installation

1. **Clone and setup**
```bash
cd backend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Setup database**
```bash
npm run migrate
npm run seed  # Optional: Load sample data
```

4. **Start development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── models/          # Data models & queries
│   ├── middleware/      # Auth, validation, error handling
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions
│   ├── database/        # DB migrations & seeds
│   ├── handlers/        # Error handlers
│   ├── validators/      # Input validation schemas
│   └── server.js        # Application entry point
├── tests/               # Unit and integration tests
├── docs/                # API documentation
├── docker/
│   └── Dockerfile
├── .env.example         # Environment variables template
├── package.json
└── .eslintrc.json
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Request password reset

### Courses
- `GET /api/v1/courses` - List all courses
- `GET /api/v1/courses/:courseId` - Get course details
- `POST /api/v1/courses` - Create course (educator/admin)
- `PUT /api/v1/courses/:courseId` - Update course
- `DELETE /api/v1/courses/:courseId` - Delete course

### Lessons
- `GET /api/v1/courses/:courseId/lessons` - Get course lessons
- `GET /api/v1/lessons/:lessonId` - Get lesson details
- `POST /api/v1/lessons` - Create lesson (educator)
- `PUT /api/v1/lessons/:lessonId` - Update lesson
- `DELETE /api/v1/lessons/:lessonId` - Delete lesson

### Progress
- `GET /api/v1/students/:studentId/progress` - Get student progress
- `GET /api/v1/students/:studentId/progress/:lessonId` - Get specific progress
- `POST /api/v1/progress/update` - Update progress
- `GET /api/v1/students/:studentId/reports` - Get progress reports

### AI Chatbot
- `POST /api/v1/chat/ask` - Ask a question
- `GET /api/v1/chat/history/:studentId` - Get chat history
- `POST /api/v1/chat/rate-response` - Rate response

### Enrollments
- `GET /api/v1/enrollments` - Get user enrollments
- `POST /api/v1/enrollments` - Enroll in course
- `PUT /api/v1/enrollments/:enrollmentId` - Update enrollment
- `DELETE /api/v1/enrollments/:enrollmentId` - Drop course

### Users
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/users/:userId` - Get user info (admin)
- `PUT /api/v1/users/:userId` - Update user (admin)

### Admin
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/reports` - System analytics
- `POST /api/v1/admin/users/:userId/role` - Change user role

### USSD
- `POST /api/v1/ussd/send` - Send USSD response
- `GET /api/v1/ussd/history/:phoneNumber` - USSD history

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**Headers required:**
```
Authorization: Bearer <jwt_token>
```

**Token format:**
- Access token expires in 7 days
- Refresh token expires in 30 days
- Include refresh token to get new access token

## Request/Response Format

### Request Example
```json
{
  "method": "POST",
  "url": "/api/v1/auth/login",
  "body": {
    "email": "user@example.com",
    "password": "secure_password"
  }
}
```

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "student"
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "details": null
  }
}
```

## Environment Variables

See `.env.example` for all available variables. Critical ones:

- `DB_*` - PostgreSQL connection details
- `REDIS_*` - Redis cache configuration
- `JWT_*` - JWT token secrets
- `AI_*` - AI service configuration
- `TWILIO_*` - SMS service configuration
- `AWS_*` - File storage configuration

## Database Migrations

### Create a new migration
```bash
node scripts/create-migration.js migration_name
```

### Run pending migrations
```bash
npm run migrate
```

### Rollback last migration
```bash
node scripts/rollback-migration.js
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Linting & Formatting

```bash
# Lint code
npm run lint

# Format code with Prettier
npx prettier --write src/
```

## Docker

### Build image
```bash
npm run docker:build
```

### Run container
```bash
npm run docker:run
```

## Error Handling

The API uses standardized error codes:

- `VALIDATION_ERROR` - Input validation failed
- `INVALID_CREDENTIALS` - Authentication failed
- `UNAUTHORIZED` - User not authorized
- `FORBIDDEN` - Access forbidden
- `NOT_FOUND` - Resource not found
- `SERVER_ERROR` - Internal server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- Default: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes
- Custom limits per endpoint available

## Security Features

- ✅ HTTPS/TLS encryption
- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt (salt rounds: 12)
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Rate limiting
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Child data protection compliance

## Performance Optimization

- Redis caching for frequently accessed data
- Database connection pooling
- Query optimization with indexes
- Async/await for non-blocking operations
- Compression middleware for response bodies
- CDN integration for static content

## Logging

Logs are written to:
- Console (development)
- `/logs/app.log` (production)
- Winston logger with daily rotation

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
NODE_ENV=production npm start
```

### With PM2
```bash
pm2 start src/server.js --name "edubridge-api"
pm2 save
pm2 startup
```

## API Documentation

Full API documentation available at [API_DOCS.md](./docs/API.md)

Swagger UI available at `/api-docs`

## Contributing

1. Follow the code style (ESLint configured)
2. Write tests for new features
3. Update API documentation
4. Use meaningful commit messages

## Support

For issues or questions:
- Email: support@edubridge.rw
- GitHub Issues: [Repository]
- Documentation: [Wiki]

## License

MIT License - See LICENSE file for details

---

**Last Updated**: 2026-01-25
**Status**: Under Development
