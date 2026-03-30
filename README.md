# EduBridge - Multi-Platform Learning System

A technology-driven solution to empower women and vulnerable children with access to high-quality, inclusive, and structured education.

## Project Overview

EduBridge is a multi-platform educational system designed to address financial barriers, inadequate digital infrastructure, and lack of organized learning support in Rwanda's low-income communities. The system provides access to curriculum-aligned learning through:

- **Web Application** - Modern web interface for desktop/laptop users
- **Mobile Application** - Android app for smartphone users
- **USSD Interface** - SMS-based access for basic phone users
- **AI-Powered Learning Assistant** - Curriculum-aligned question-answering support

## Video Submission
Video link: https://www.loom.com/share/22d32ec9e1ba436a92bc076a34343741

## Project Structure

```
education-bridge/
├── docs/                      # Documentation and SRS
├── backend/                   # Node.js/Express server
│   └── src/
├── web/                       # React web application
│   └── src/
├── mobile/                    # React Native mobile app
│   └── src/
├── ussd/                      # USSD gateway integration
│   └── src/
├── database/                  # Database schemas and migrations
│   └── migrations/
└── README.md
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **Web Frontend**: React
- **Mobile Frontend**: React Native
- **Database**: PostgreSQL
- **USSD Gateway**: Integration layer for telecom providers
- **AI Service**: Curriculum-aligned chatbot integration
- **Deployment**: Cloud infrastructure (AWS/Azure/GCP)

## Key Features

1. **User Management**
   - Student registration and authentication
   - Educator content management
   - Administrator system controls

2. **Learning Content**
   - Curriculum-aligned materials
   - Structured lessons and courses
   - Progress tracking

3. **AI Support**
   - Chatbot Q&A functionality
   - Curriculum-contextual answers
   - Multi-language support

4. **Accessibility**
   - Web, mobile, and USSD access
   - Low-bandwidth support
   - Inclusive design for low digital literacy users

## Functional Requirements

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| FR-1 | User Registration | System shall allow users to register accounts |
| FR-2 | User Authentication | System shall authenticate users securely |
| FR-3 | Learning Content Access | System shall allow students to view learning materials |
| FR-4 | Progress Tracking | System shall track and display student progress |
| FR-5 | AI Chatbot | System shall provide AI question-answering support |
| FR-6 | USSD Access | System shall provide learning access via USSD |
| FR-7 | Role Management | System shall support multiple user roles |

## Non-Functional Requirements

| Requirement | ID | Description |
|-------------|----|----|
| Security | NFR-1 | Protect user data through authentication and encryption |
| Performance | NFR-2 | Support concurrent users without degradation |
| Usability | NFR-4 | Easy to use for low digital literacy users |
| Availability | NFR-5 | 24/7 system availability |
| Compatibility | NFR-6 | Operate across web, mobile, and USSD |
| Scalability | NFR-7 | Support future expansions |

## Development Approach

EduBridge uses **Agile methodology** for development:
- Continuous feedback from target users
- Incremental releases with regular testing
- Risk reduction through iterative development
- Flexibility to adapt to evolving user needs

## Getting Started

### Prerequisites (All Projects)

Before starting, ensure you have installed:

- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/)
- **Redis 6+** - [Download](https://redis.io/) (Optional but recommended)
- **Git** - [Download](https://git-scm.com/)

### Quick Start - Run All Projects

#### 1. Clone Repository

```bash
git clone https://github.com/your-repo/education-bridge.git
cd education-bridge
```

#### 2. Database Setup

```bash
# Create PostgreSQL database
createdb edubridge_dev

# OR using psql
psql -U postgres
CREATE DATABASE edubridge_dev;
\q
```

#### 3. Backend Setup & Run

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set your database credentials

# Run migrations
npm run migrate

# (Optional) Seed sample data
npm run seed

# Start backend (runs on http://localhost:3000)
npm run dev
```

**Backend will be available at:** `http://localhost:3000`
**API Documentation:** `http://localhost:3000/api-docs`

#### 4. Web Frontend Setup & Run

Open a **new terminal** in the project root:

```bash
cd web

# Install dependencies
npm install

# Start development server (runs on http://localhost:3001)
npm run dev
```

**Frontend will be available at:** `http://localhost:3001`

#### 5. USSD Integration Setup & Run

Open a **new terminal** in the project root:

```bash
cd ussd

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your USSD gateway credentials (Twilio, Africa's Talking, etc.)

# Start USSD server (runs on http://localhost:3002)
npm run dev
```

**USSD Server will be available at:** `http://localhost:3002`

#### 6. Mobile App Setup & Run

Open a **new terminal** in the project root:

```bash
cd mobile

# Install dependencies
npm install
# or with Expo CLI (recommended)
npm install -g expo-cli

# Option A: Run on Expo Go (easiest)
expo start
# Scan the QR code with Expo Go app on your phone

# Option B: Run on Android Emulator
npm run android

# Option C: Run on iOS Simulator (macOS only)
npm run ios
```

### Summary - All Services Running

Once all commands are completed, you should have:

| Service | URL | Port | Terminal |
|---------|-----|------|----------|
| **Backend API** | `http://localhost:3000` | 3000 | Terminal 1 |
| **Web Frontend** | `http://localhost:3001` | 3001 | Terminal 2 |
| **USSD Gateway** | `http://localhost:3002` | 3002 | Terminal 3 |
| **Mobile App** | Expo/Emulator | - | Terminal 4 |
| **Database** | PostgreSQL | 5432 | System |
| **Redis** (optional) | localhost | 6379 | System |

### Environment Variables

Each project needs `.env` configuration. Copy from `.env.example`:

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=edubridge_dev
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
JWT_SECRET=your_jwt_secret_key
AI_API_KEY=your_google_api_key
SENDGRID_API_KEY=your_sendgrid_key
```

**Web** (`web/.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

**USSD** (`ussd/.env`):
```env
NODE_ENV=development
PORT=3002
USSD_GATEWAY=twilio  # or africastakling
USSD_GATEWAY_API_KEY=your_key
BACKEND_URL=http://localhost:3000/api
```

**Mobile** (`mobile/.env` if using):
```env
REACT_APP_API_URL=http://localhost:3000/api
EXPO_MANIFEST_URL=http://localhost:3000
```

### Individual Project Documentation

See individual README files for detailed setup:
- [Backend Setup](backend/README.md)
- [Web Frontend Setup](web/README.md)
- [Mobile App Setup](mobile/README.md) (Create if needed)
- [USSD Integration](ussd/README.md)
- [Database Setup](database/README.md)

## Documentation

Detailed documentation is available in the `docs/` folder:
- [SRS Document](docs/SRS.md)
- [Architecture Documentation](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [User Guides](docs/)

## Common Commands

### Backend Commands
```bash
cd backend

npm run dev          # Start development server with hot reload
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed sample data
npm run test         # Run tests
npm run lint         # Run linter
npm run build        # Build for production
npm run migrate:create  # Create new migration
```

### Web Frontend Commands
```bash
cd web

npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run test:ui      # Run tests with UI
```

### USSD Commands
```bash
cd ussd

npm run dev          # Start development server
npm run start        # Start production server
npm run test         # Run tests
npm run logs         # View logs
```

### Mobile Commands
```bash
cd mobile

npm run dev          # Start Expo dev server
npm run android      # Build and run on Android
npm run ios          # Build and run on iOS (macOS only)
npm run eject        # Eject from Expo (use with caution)
npm run test         # Run tests
```

## Useful Development Scripts

### Start All Services at Once (macOS/Linux)
```bash
# Create a tmux session or use GNU parallel

# Option 1: Using tmux
tmux new-session -d -s edubridge
tmux new-window -t edubridge -n backend
tmux send-keys -t edubridge:backend 'cd backend && npm run dev' Enter

tmux new-window -t edubridge -n web
tmux send-keys -t edubridge:web 'cd web && npm run dev' Enter

tmux new-window -t edubridge -n ussd
tmux send-keys -t edubridge:ussd 'cd ussd && npm run dev' Enter

# View
tmux attach-session -t edubridge
```

### Windows (PowerShell)
```powershell
# Start each in separate PowerShell window

# Terminal 1
cd backend; npm run dev

# Terminal 2
cd web; npm run dev

# Terminal 3
cd ussd; npm run dev
```

## Troubleshooting

### Backend Issues

**Error: Port 3000 already in use**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 npm run dev
```

**Error: Database connection refused**
```bash
# Check PostgreSQL is running
psql --version

# Start PostgreSQL service
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Check Services app
```

**Error: Redis connection failed**
```bash
# Start Redis server
redis-server

# Or if using Docker
docker run -d -p 6379:6379 redis:latest
```

### Frontend Issues

**Error: Cannot find module**
```bash
cd web
rm -rf node_modules package-lock.json
npm install
```

**Error: Port 3001 already in use**
```bash
# Change port in vite.config.js or use:
PORT=3002 npm run dev
```

### USSD Issues

**Error: Cannot connect to backend**
```bash
# Verify backend is running at http://localhost:3000
curl http://localhost:3000/api/health

# Check USSD_GATEWAY_API_KEY in .env
# Check backend URL in .env
```

### Mobile Issues

**Error: Expo not found**
```bash
npm install -g expo-cli
expo --version
```

**Error: Device not found for Android emulator**
```bash
# Start Android emulator first
# or use Expo Go app on physical device
expo start --mobile
```

## Testing the System

### 1. Test Backend API
```bash
# Health check
curl http://localhost:3000/api/health

# Create test user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 2. Test Frontend Connection
```bash
# Open browser at http://localhost:3001
# Login with test credentials created above
# Navigate through courses and lessons
```

### 3. Test USSD
```bash
# Send test USSD request
curl -X POST http://localhost:3002/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "msisdn=256701234567&sessionId=test123&text=1"
```

### 4. Test Mobile
```bash
# Start Expo dev server
cd mobile && expo start

# Scan QR code with Expo Go app
# Or run on emulator: press 'a' (Android) or 'i' (iOS)
```

## Database Management

### Backup Database
```bash
# PostgreSQL backup
pg_dump edubridge_dev > backup_$(date +%Y%m%d).sql

# Restore from backup
psql edubridge_dev < backup_20260330.sql
```

### View Database
```bash
# Connect to database
psql edubridge_dev

# List tables
\dt

# View specific table
SELECT * FROM users LIMIT 10;

# Exit
\q
```

## Performance Tips

1. **Enable Redis caching** - Improves API response times
2. **Use production build** - `npm run build`
3. **Implement pagination** - Load data in chunks
4. **Monitor database queries** - Check slow queries
5. **Use CDN** - For static assets in production
6. **Enable gzip compression** - In Nginx/Apache

## API Rate Limiting

The API has rate limiting enabled:
- **15 minutes window:** 100 requests per IP
- **Useful for:** Preventing abuse, managing traffic

To test rate limiting:
```bash
# Rapid requests will get 429 Too Many Requests
for i in {1..150}; do curl http://localhost:3000/api/health; done
```

## Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] JWT secret keys are strong (32+ characters)
- [ ] Database passwords are strong
- [ ] CORS_ORIGIN is restricted (not `*`)
- [ ] Admin secret key is set
- [ ] SSL/HTTPS enabled in production
- [ ] API keys not committed to Git
- [ ] Database has regular backups
- [ ] Rate limiting is enabled
- [ ] Input validation on all endpoints

## Production Deployment

### Deploy to Vercel + Render

See detailed guide in [DEPLOYMENT.md](docs/DEPLOYMENT.md)

**Quick Summary:**
1. **Frontend on Vercel** - Auto-deploys from Git
2. **Backend on Render** - Auto-deploys from Git
3. **Database** - PostgreSQL on Render/AWS RDS
4. **Cache** - Redis on Render/AWS ElastiCache

```bash
# Deploy frontend
vercel --prod

# Deploy backend
git push origin main  # Auto-deploys on Render
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Team

- **Project Lead**: Sandrine
- **Organization**: Aspire Haven Foundation
- **Mission**: Empower women and vulnerable children through education

## License

[To be determined]

## Contact

For questions or feedback, contact: [contact information]

---

## Quick Reference

**Project URLs (Development)**
- Backend: http://localhost:3000
- Frontend: http://localhost:3001
- USSD: http://localhost:3002
- API Docs: http://localhost:3000/api-docs
- Database: localhost:5432

**Default Credentials (Development)**
- Admin Email: admin@edubridge.local
- Admin Password: admin123 (change this!)

**Important Files**
- Backend config: `backend/.env`
- Frontend config: `web/.env`
- USSD config: `ussd/.env`
- Database schema: `database/schema.sql`
- API routes: `backend/src/routes/`
- React pages: `web/src/pages/`
