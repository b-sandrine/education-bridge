# EduBridge System Architecture

## System Overview

EduBridge is a multi-layered, distributed system designed for accessibility, scalability, and security. The architecture follows a three-tier model with modular subsystems for different access channels.

---

## 1. Architectural Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                               │
├────────────────┬──────────────────┬──────────────┬──────────────┤
│  Web Browser   │  Mobile App      │ USSD Client  │  Tablet App  │
│  (React)       │  (React Native)  │  (SMS)       │  (React)     │
└────────────────┴──────────────────┴──────────────┴──────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌──────────────────┐   ┌──────────────────┐
        │  API Gateway     │   │  USSD Gateway    │
        │  (Load Balancer) │   │  (Telecom)       │
        └──────────────────┘   └──────────────────┘
                │                     │
                └──────────┬──────────┘
                           ▼
        ┌──────────────────────────────────────┐
        │     APPLICATION SERVER LAYER          │
        │     (Node.js/Express Microservices)   │
        ├──────────────────────────────────────┤
        │  • Auth Service                       │
        │  • Content Service                    │
        │  • Progress Service                   │
        │  • Chatbot Service                    │
        │  • User Service                       │
        │  • Admin Service                      │
        └──────────────────────────────────────┘
                           │
        ┌──────────┬───────┴────────┬──────────┐
        ▼          ▼                ▼          ▼
    ┌────────┐ ┌───────┐  ┌──────────────┐ ┌──────────┐
    │Database│ │Cache  │  │File Storage  │ │Log Store │
    │Store   │ │(Redis)│  │(S3/Blob)     │ └──────────┘
    └────────┘ └───────┘  └──────────────┘
        │
    ┌──────────────────────────────────┐
    │   EXTERNAL SERVICES              │
    ├──────────────────────────────────┤
    │  • AI Service (ChatGPT/Claude)   │
    │  • Email Service (SendGrid)      │
    │  • SMS Service (Twilio)          │
    │  • Analytics (Google Analytics)  │
    └──────────────────────────────────┘
```

---

## 2. Layer-by-Layer Architecture

### 2.1 Client Layer

#### Web Application (React)
- **Framework**: React 18+
- **State Management**: Redux or Context API
- **Styling**: Tailwind CSS with Material Design
- **Responsive Design**: Mobile-first approach
- **Offline Support**: Service workers for offline fallback
- **Features**:
  - Dashboard for student progress
  - Learning content browser
  - AI chatbot interface
  - Account management

#### Mobile Application (React Native)
- **Framework**: React Native with Expo or CLI
- **Platform Support**: Android 6.0+, iOS 12.0+
- **Local Storage**: AsyncStorage for offline content
- **Features**:
  - Offline content access
  - Push notifications
  - Camera integration (for document upload)
  - Background sync

#### USSD Interface
- **Protocol**: USSD (via telecom provider gateway)
- **Format**: Text-based menu navigation
- **Languages**: Kinyarwanda, French, English
- **Features**:
  - Content access via SMS
  - Progress check via menu
  - Q&A submission via text
  - Account management basics

### 2.2 API Gateway & Load Balancing

- **Technology**: Nginx or AWS API Gateway
- **Functions**:
  - Request routing to appropriate services
  - Load balancing across server instances
  - Request validation
  - Rate limiting and DDoS protection
  - SSL/TLS termination
  - Request/response logging

### 2.3 Application Server Layer

Built with **Node.js/Express.js** microservices architecture:

#### Core Services

**Authentication Service**
- User registration and login
- JWT token generation and refresh
- Two-factor authentication
- Session management
- Password reset and recovery

```
GET    /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/logout
POST   /api/auth/forgot-password
```

**User Service**
- User profile management
- Role assignment
- User preferences
- Activity tracking

```
GET    /api/users/:userId
PUT    /api/users/:userId
GET    /api/users/:userId/profile
POST   /api/users/:userId/preferences
```

**Content Service**
- Curriculum management
- Lesson management
- Content delivery
- Search and filtering

```
GET    /api/courses
GET    /api/courses/:courseId
GET    /api/courses/:courseId/lessons
POST   /api/courses (educators only)
PUT    /api/courses/:courseId (educators only)
```

**Progress Service**
- Track student progress
- Calculate scores
- Generate reports
- Achievement tracking

```
GET    /api/progress/:studentId
POST   /api/progress/:studentId/update
GET    /api/progress/:studentId/reports
GET    /api/progress/:studentId/achievements
```

**Chatbot Service**
- Process student questions
- Interface with AI service
- Format responses
- Log interactions

```
POST   /api/chat/ask
GET    /api/chat/history/:studentId
POST   /api/chat/rate-response
```

**Admin Service**
- System management
- User administration
- Report generation
- System configuration

```
GET    /api/admin/users
POST   /api/admin/users
DELETE /api/admin/users/:userId
GET    /api/admin/reports
```

### 2.4 Data Layer

#### PostgreSQL Database

**Key Tables**:

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('student', 'educator', 'admin'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  curriculum_grade INT,
  subject VARCHAR(100),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  status ENUM('active', 'completed', 'dropped')
);

-- Progress
CREATE TABLE progress (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES lessons(id),
  completion_percentage INT,
  score DECIMAL(5, 2),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Interactions
CREATE TABLE chat_interactions (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES users(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  helpful_rating INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Redis Cache
- Session storage
- Query result caching
- Leaderboard data
- Real-time notifications

#### File Storage (S3/Azure Blob)
- Learning materials
- User uploads
- Profile images
- Certificates

---

## 3. UML Diagrams

### 3.1 Use Case Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  EduBridge System                       │
│                                                         │
│  ┌──────┐     ┌──────────────────────────────┐        │
│  │      │     │  Register/Login              │        │
│  │      │────►│  Access Learning Content     │        │
│  │      │     │  Ask Questions (AI Chatbot)  │        │
│  │      │     │  Track Progress              │        │
│  │Student     │  USSD Access                 │        │
│  │ Actor│     └──────────────────────────────┘        │
│  │      │     ┌──────────────────────────────┐        │
│  │      │────►│  Create/Update Content       │        │
│  │      │     │  Monitor Student Progress    │        │
│  │      │     │  Manage Curriculum           │        │
│  │      │     └──────────────────────────────┘        │
│  │      │     ┌──────────────────────────────┐        │
│  │      │────►│  Manage System Users         │        │
│  │      │     │  Generate Reports            │        │
│  │      │     │  Configure System            │        │
│  │      │     └──────────────────────────────┘        │
│  └──────┘                                             │
│                                                         │
│  ┌──────────┐  ┌──────────────────────────────┐       │
│  │Educator  │─►│  Manage Content              │       │
│  │ Actor    │  │  Monitor Students            │       │
│  └──────────┘  └──────────────────────────────┘       │
│                                                         │
│  ┌──────────┐  ┌──────────────────────────────┐       │
│  │Admin     │─►│  Manage All System Functions │       │
│  │ Actor    │  │  Access Reports & Analytics  │       │
│  └──────────┘  └──────────────────────────────┘       │
│                                                         │
│  ┌──────────────┐  ┌──────────────────────────┐       │
│  │AI Service    │─►│ Process Questions         │       │
│  │(External)    │  │ Generate Answers          │       │
│  └──────────────┘  └──────────────────────────┘       │
│                                                         │
│  ┌──────────────┐  ┌──────────────────────────┐       │
│  │Telecom/USSD  │─►│ Enable SMS Access         │       │
│  │(External)    │  │ Route USSD Requests       │       │
│  └──────────────┘  └──────────────────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Class Diagram

```
User (Abstract)
├─ id: UUID
├─ email: String
├─ passwordHash: String
├─ name: String
├─ role: Enum
├─ createdAt: DateTime
├─ login(): boolean
└─ logout(): void

├─ Student
│  ├─ enrollments: Enrollment[]
│  ├─ progress: Progress[]
│  ├─ viewContent(): Lesson[]
│  ├─ askQuestion(): ChatResponse
│  └─ trackProgress(): ProgressReport
│
├─ Educator
│  ├─ createdCourses: Course[]
│  ├─ createContent(): Course
│  ├─ updateContent(): Course
│  ├─ deleteContent(): boolean
│  └─ monitorStudents(): Report[]
│
└─ Administrator
   ├─ manageUsers(): User[]
   ├─ generateReports(): Report[]
   ├─ configureSystem(): void
   └─ viewAnalytics(): Analytics[]

Course
├─ id: UUID
├─ title: String
├─ description: String
├─ curriculumGrade: Int
├─ subject: String
├─ createdBy: Educator
├─ lessons: Lesson[]
├─ enrollments: Enrollment[]
├─ addLesson(): Lesson
└─ updateCourse(): void

Lesson
├─ id: UUID
├─ courseId: UUID
├─ title: String
├─ content: String
├─ contentType: Enum
├─ orderIndex: Int
└─ addContent(): void

Enrollment
├─ id: UUID
├─ studentId: UUID
├─ courseId: UUID
├─ enrolledAt: DateTime
├─ status: Enum
└─ completeEnrollment(): void

Progress
├─ id: UUID
├─ studentId: UUID
├─ lessonId: UUID
├─ completionPercentage: Int
├─ score: Float
├─ completedAt: DateTime
└─ updateProgress(): void

ChatbotService
├─ serviceId: UUID
├─ providedBy: String
├─ responseTime: Int
├─ processQuery(question: String): String
└─ formatResponse(answer: String): String

ChatInteraction
├─ id: UUID
├─ studentId: UUID
├─ question: String
├─ answer: String
├─ helpfulRating: Int
└─ logInteraction(): void

USSDSession
├─ sessionId: UUID
├─ phoneNumber: String
├─ startTime: DateTime
├─ startSession(): void
├─ endSession(): void
└─ sendMessage(message: String): void

Achievement
├─ id: UUID
├─ studentId: UUID
├─ title: String
├─ description: String
├─ earnedAt: DateTime
└─ awardAchievement(): void
```

### 3.3 Sequence Diagram - Student Asks Question

```
Student    │    Mobile App    │  Backend    │ Chatbot    │   AI
           │                  │   Server    │  Service   │  Service
           │                  │             │            │
   1. Input│                  │             │            │
      Question                │             │            │
           ├─────────────────►│             │            │
           │                  │ 2. Validate │            │
           │                  │  & Auth     │            │
           │                  │             │            │
           │                  │ 3. Extract  │            │
           │                  │  Context    │            │
           │                  │             │            │
           │                  ├────────────►│            │
           │                  │             │ 4. Add     │
           │                  │             │  Curriculum│
           │                  │             │  Context   │
           │                  │             │            │
           │                  │             ├───────────►│
           │                  │             │            │
           │                  │             │            │ 5. Process
           │                  │             │            │  & Generate
           │                  │             │            │
           │                  │             │◄───────────┤
           │                  │             │   Answer   │
           │                  │             │            │
           │                  │◄────────────┤            │
           │                  │   Answer    │            │
           │                  │             │            │
           │ 6. Display◄──────┤             │            │
           │ Formatted│       │             │            │
           │  Answer  │       │             │            │
           │          │       │             │            │
           │ 7. Rate  │       │             │            │
           │ Answer   ├──────►│             │            │
           │          │       │ 8. Log      │            │
           │          │       │  Interaction│            │
           │          │       │             │            │
```

### 3.4 Deployment Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    CLIENT TIER                           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │  Web Browser │  │  Mobile App  │  │USSD Gateway│  │  │
│  │  │  (React)     │  │  (Android)   │  │  (Telecom)  │  │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                 │                     │
│                   ┌─────┴─────────────────┴────────┐            │
│                   │                                │            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │           NETWORK/GATEWAY TIER                 │ │          │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │   CloudFlare/API Gateway (Load Balancer)        │  │  │
│  │  │   - Request Routing                             │  │  │
│  │  │   - SSL/TLS Termination                         │  │  │
│  │  │   - DDoS Protection                             │  │  │
│  │  │   - Rate Limiting                               │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │      APPLICATION SERVER TIER (Node.js/Express)      │          │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │  │
│  │  │  Auth API   │  │ Content API │  │ Progress API │   │  │
│  │  │  Instance 1 │  │ Instance 1  │  │ Instance 1   │  ┐│  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  ││  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ││  │
│  │  │  Auth API   │  │ Content API │  │ Progress API │  ├┤ Horizontal
│  │  │  Instance 2 │  │ Instance 2  │  │ Instance 2   │  ││ Scaling
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │○  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ││  │
│  │  │  Auth API   │  │ Content API │  │ Progress API │  ││  │
│  │  │  Instance N │  │ Instance N  │  │ Instance N   │  │┘  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘   │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Chatbot Service                                │  │  │
│  │  │  - Question Processing                          │  │  │
│  │  │  - AI Integration                               │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│              │              │           │                      │
│  ┌──────────┴──────────┬───┴───────┬───┴─────────────────────┐     │
│  │                     │           │                         │     │
│  ▼                     ▼           ▼                         ▼     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                  DATA TIER                                │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │                                                            │  │
│  │  ┌──────────────────┐    ┌──────────────────┐           │  │
│  │  │  PostgreSQL DB   │    │  Redis Cache     │           │  │
│  │  │  (Master)        │    │  (Session Store) │           │  │
│  │  ├──────────────────┤    ├──────────────────┤           │  │
│  │  │ - Users          │    │ - Cache Queries  │           │  │
│  │  │ - Courses        │    │ - User Sessions  │           │  │
│  │  │ - Progress       │    │ - Leaderboards   │           │  │
│  │  │ - Interactions   │    │ - Real-time Data │           │  │
│  │  └──────────────────┘    └──────────────────┘           │  │
│  │          │                                               │  │
│  │    ┌─────▼──────────┐                                    │  │
│  │    │  PostgreSQL DB │                                    │  │
│  │    │  (Read Replica)│                                    │  │
│  │    └────────────────┘                                    │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  Cloud Storage (AWS S3 / Azure Blob)            │   │  │
│  │  │  - Learning Materials                           │   │  │
│  │  │  - User Uploads                                 │   │  │
│  │  │  - Certificates                                 │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                      │              │                            │
│  ┌───────────────────┴──────────────┴──────────────────────────┐  │
│  │              EXTERNAL SERVICES TIER                         │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐   ┌──────────────┐    │  │
│  │  │ AI Service   │  │ Email        │   │ SMS Service  │    │  │
│  │  │ (OpenAI/    │  │ (SendGrid)   │   │ (Twilio)     │    │  │
│  │  │  Cohere)     │  │              │   │              │    │  │
│  │  └──────────────┘  └──────────────┘   └──────────────┘    │  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐                        │  │
│  │  │ Analytics    │  │ Logging      │                        │  │
│  │  │ (Mixpanel)   │  │ (DataDog)    │                        │  │
│  │  └──────────────┘  └──────────────┘                        │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└───────────────────────────────────────────────────────────────────┘
```

---

## 4. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend - Web** | React 18, Redux, Tailwind CSS | Web application interface |
| **Frontend - Mobile** | React Native, AsyncStorage | Android & iOS app |
| **Frontend - USSD** | Custom Gateway Integration | SMS-based interface |
| **Backend** | Node.js, Express.js | Application server |
| **Database** | PostgreSQL | Primary data store |
| **Cache** | Redis | Session & query cache |
| **Storage** | AWS S3 or Azure Blob | Content & media storage |
| **API** | REST, GraphQL (optional) | Client-server communication |
| **Auth** | JWT, OAuth 2.0 | User authentication |
| **AI** | OpenAI API / Cohere | Chatbot intelligence |
| **Deployment** | Docker, Kubernetes | Containerization & orchestration |
| **Monitoring** | DataDog, New Relic | System monitoring |
| **Logging** | ELK Stack (Elasticsearch) | Log aggregation |
| **Testing** | Jest, React Testing Library | Test frameworks |
| **CI/CD** | GitHub Actions | Automated deployment |

---

## 5. Data Flow

### 5.1 User Registration Flow

```
User Input → Validation → Hash Password → Save to DB → Send Verification Email → Account Created
```

### 5.2 Content Access Flow

```
Student Request → Auth Check → Query Content → Cache/Store → Format Response → Deliver to Client
```

### 5.3 AI Question Flow

```
Question → Queue → Process with Context → Send to AI → Format Answer → Store → Return to Student
```

### 5.4 USSD Flow

```
SMS Input → Parse USSD → Route Request → Process Query → Format Response → Send SMS → Log
```

---

## 6. Security Architecture

### 6.1 Authentication & Authorization

- **Authentication**: JWT with refresh tokens
- **Password Security**: bcrypt with salt (cost factor 12)
- **Session Management**: Redis-based with 30-minute timeout
- **API Authentication**: Bearer token requirement

### 6.2 Data Protection

- **In Transit**: TLS 1.2+ (HTTPS)
- **At Rest**: AES-256 encryption for sensitive data
- **Database**: Row-level security, encrypted passwords
- **USSD**: Encrypted SMS over secure gateway

### 6.3 Access Control

- **Role-Based**: Student, Educator, Administrator
- **Permission Levels**: Read, Create, Update, Delete
- **Child Protection**: Content filtering, interaction monitoring
- **Data Privacy**: GDPR/Rwanda GDPA compliance

---

## 7. Scalability Strategy

### 7.1 Horizontal Scaling

- Stateless backend services enable easy scaling
- Load balancing across multiple instances
- Auto-scaling groups based on CPU/memory metrics

### 7.2 Database Scaling

- Read replicas for query distribution
- Connection pooling to limit DB connections
- Sharding strategy for future growth (by region/school)

### 7.3 Caching Strategy

- Redis for hot data (sessions, leaderboards)
- CloudFlare CDN for static content
- Query result caching with TTL

---

## 8. Monitoring & Logging

### 8.1 Monitoring

- Real-time system health checks
- Performance metrics (response time, CPU, memory)
- User activity monitoring
- API usage analytics

### 8.2 Logging

- Centralized log aggregation (ELK Stack)
- Error tracking (Sentry)
- Audit logs for sensitive operations
- Performance logs for optimization

---

## 9. Disaster Recovery

### 9.1 Backup Strategy

- Daily automated database backups
- Cross-region backup replication
- Point-in-time recovery capability
- 30-day retention policy

### 9.2 Failover Strategy

- Multi-zone deployment
- Database replication with automatic failover
- DNS-based traffic switching
- 99.5% uptime SLA target

---

## 10. Development Guidelines

### 10.1 API Design

- RESTful endpoints following conventions
- Consistent error response format
- API versioning (v1, v2, etc.)
- Comprehensive API documentation

### 10.2 Code Organization

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── models/          # Data models
│   ├── middleware/      # Auth, validation
│   ├── utils/           # Helper functions
│   ├── config/          # Configuration
│   └── routes/          # API routes
├── tests/               # Test files
├── docker/              # Docker configuration
└── docs/                # API documentation
```

---

*End of Architecture Documentation*
