# Swagger/OpenAPI Setup Guide

This guide helps you set up and view Swagger documentation for the EduBridge API.

## Option 1: Use Swagger UI Online

1. Visit [Swagger UI Editor](https://editor.swagger.io)
2. Copy the content from `backend/openapi.yaml`
3. Paste it into the Swagger UI
4. Documentation is instantly available

## Option 2: Host Swagger UI Locally

### Prerequisites
- Node.js 14+
- npm

### Installation

```bash
cd backend
npm install swagger-ui-express
```

### Update server.js

Add the following code to your `backend/src/server.js`:

```javascript
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load OpenAPI specification
const openApiFile = fs.readFileSync(path.join(__dirname, '..', 'openapi.yaml'), 'utf8');
const openApiSpec = YAML.parse(openApiFile);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  swaggerOptions: {
    url: '/api/openapi.json',
  }
}));

// Serve OpenAPI JSON
app.get('/api/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(openApiSpec);
});
```

### Install YAML parser

```bash
npm install yaml
```

### Run the server

```bash
npm run dev
```

### Access Swagger UI

Visit: `http://localhost:3000/api-docs`

## Option 3: Use Docker

Create `backend/Dockerfile.swagger`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

Build and run:

```bash
docker build -f Dockerfile.swagger -t edubridge-api .
docker run -p 3000:3000 edubridge-api
```

Then visit: `http://localhost:3000/api-docs`

## Option 4: Use ReDoc

ReDoc is another popular alternative to Swagger UI:

```bash
npm install redoc-express
```

Add to `server.js`:

```javascript
import redoc from 'redoc-express';

app.use('/redoc', redoc({
  title: 'EduBridge API Documentation',
  specUrl: '/api/openapi.json',
}));
```

Visit: `http://localhost:3000/redoc`

## API Documentation Structure

The OpenAPI spec includes:

### Servers
- Development: `http://localhost:3000/api`
- Production: `https://api.edubridge.com`

### Authentication
- JWT Bearer Token
- Obtain token from `/auth/login` endpoint
- Include in header: `Authorization: Bearer <token>`

### Endpoints

#### Authentication (5 endpoints)
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login and get token
- `GET /auth/profile` - Get user profile

#### Content (9 endpoints)
- `GET /content/courses` - List courses
- `POST /content/courses` - Create course
- `GET /content/courses/{id}` - Get course details
- `PUT /content/courses/{id}` - Update course
- `DELETE /content/courses/{id}` - Delete course
- `POST /content/lessons` - Create lesson
- `GET /content/lessons/{id}` - Get lesson
- `PUT /content/lessons/{id}` - Update lesson
- `DELETE /content/lessons/{id}` - Delete lesson
- `GET /content/courses/{id}/lessons` - Get course lessons

#### Progress (5 endpoints)
- `POST /progress/courses/{id}/start` - Enroll in course
- `PUT /progress/courses/{id}/update` - Update progress
- `GET /progress/progress` - Get all progress
- `GET /progress/courses/{id}/progress` - Get course progress
- `POST /progress/courses/{id}/complete` - Complete course

#### Chatbot (1 endpoint)
- `POST /chatbot/ask` - Ask AI question

## Testing Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get user profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"

# Get all courses
curl -X GET http://localhost:3000/api/content/courses

# Get courses by category
curl -X GET "http://localhost:3000/api/content/courses?category=Mathematics&level=beginner"
```

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import API: `File > Import > Raw text`
3. Paste the contents of `openapi.yaml`
4. Use Postman to test endpoints

### Using Swagger UI

1. Access Swagger UI at `/api-docs`
2. Click "Try it out" on any endpoint
3. Fill in required parameters
4. Click "Execute"
5. View response

## Response Format

All responses follow a standard format:

### Success Response

```json
{
  "status": "success",
  "data": {
    // endpoint-specific data
  }
}
```

### Error Response

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error description"
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## Authentication

### Getting a Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Using Token in Requests

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3000/api/auth/profile
```

## Limitations

- Token expires after 7 days
- Rate limit: 100 requests per 15 minutes per IP
- Maximum request body size: 10MB
- Some endpoints require specific roles

## Troubleshooting

### Swagger UI not loading

1. Check server is running: `curl http://localhost:3000/api/health`
2. Verify openapi.yaml is valid YAML
3. Check browser console for errors

### "Unauthorized" error

1. Ensure you have a valid token
2. Check token format in Authorization header
3. Verify token hasn't expired
4. Token should be: `Authorization: Bearer <token>`

### CORS errors

1. Check CORS_ORIGIN in .env
2. Default allows all origins (*)
3. Update CORS_ORIGIN for production

## Documentation Files

- `openapi.yaml` - OpenAPI 3.0 specification
- `SWAGGER_SETUP.md` - This file
- `API.md` - Additional API documentation
- Code comments in source files

## Further Reading

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [Swagger Editor](https://editor.swagger.io/)
