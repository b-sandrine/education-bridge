# EduBridge Project - Getting Started

Welcome to EduBridge! This document will help you get started with the project.

## 📋 Project Overview

EduBridge is a multi-platform learning system designed to empower women and vulnerable children in Rwanda with access to quality education through:

- **Web Application** - For desktop/laptop access
- **Mobile Application** - For Android smartphones
- **USSD Interface** - For basic phones via SMS
- **AI-Powered Chatbot** - For curriculum-aligned Q&A support

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Redis 6+
- Git

### 2. Clone & Install

```bash
# Clone repository
git clone https://github.com/sandrine/education-bridge.git
cd education-bridge

# Install backend dependencies
cd backend
npm install

# Install web dependencies
cd ../web
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

### 3. Set Up Database

```bash
# Create PostgreSQL database
createdb edubridge_dev

# Run schema
psql -d edubridge_dev -f ../database/schema.sql
```

### 4. Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your settings

# Web
cd ../web
cp .env.example .env.local

# Mobile
cd ../mobile
cp .env.example .env
```

### 5. Start Development

```bash
# Terminal 1 - Backend API
cd backend
npm run dev
# Runs on http://localhost:3000

# Terminal 2 - Web Frontend
cd web
npm run dev
# Runs on http://localhost:3001

# Terminal 3 - Mobile (optional)
cd mobile
npm start
# Choose android/ios/web
```

## 📁 Project Structure

```
education-bridge/
├── backend/              # Node.js/Express API
│   ├── src/
│   └── package.json
├── web/                  # React web app
│   ├── src/
│   └── package.json
├── mobile/               # React Native app
│   ├── src/
│   └── package.json
├── ussd/                 # USSD gateway
│   ├── src/
│   └── package.json
├── database/             # Database schemas
│   ├── schema.sql
│   └── migrations/
├── docs/                 # Documentation
│   ├── SRS.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
└── README.md
```

## 📚 Documentation

### Essential Reading (Start Here)

1. **[Main README](./README.md)** - Project overview
2. **[SRS Document](./docs/SRS.md)** - Complete requirements
3. **[Architecture](./docs/ARCHITECTURE.md)** - System design

### Implementation Guides

- **[Backend README](./backend/README.md)** - API setup
- **[Web README](./web/README.md)** - Frontend setup
- **[Mobile README](./mobile/README.md)** - Mobile app setup
- **[Database README](./database/README.md)** - Database setup
- **[API Documentation](./docs/API.md)** - API endpoints

### Operations

- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

## 🛠️ Development

### Running Tests

```bash
# Backend
cd backend
npm test

# Web
cd web
npm test

# Mobile
cd mobile
npm test
```

### Code Quality

```bash
# Lint check
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking (web/backend)
npm run type-check
```

## 🗄️ Database

### Initial Setup

```bash
# Start PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Start PostgreSQL service

# Create database
createdb edubridge_dev

# Load schema
psql -d edubridge_dev -f database/schema.sql
```

### Useful Queries

```bash
# Connect to database
psql edubridge_dev

# Check tables
\dt

# View schema
\d users

# Run SQL file
\i database/schema.sql
```

## 🔐 Security

### Environment Variables

Never commit `.env` files containing secrets:

```bash
# Generate strong JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Never share or commit:
JWT_SECRET
DB_PASSWORD
API_KEYS
```

### HTTPS & SSL

Development uses HTTP. Production requires HTTPS with valid SSL certificates.

## 🚢 Deployment

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

### Quick Deployment Steps

1. Set up cloud infrastructure (AWS/Azure/GCP)
2. Configure PostgreSQL database
3. Set up Redis cache
4. Build and deploy backend
5. Build and deploy frontend
6. Configure DNS
7. Set up monitoring

## 📊 Architecture Overview

```
Clients
├── Web Browser (React)
├── Mobile App (React Native)
└── SMS/USSD (Text-based)
        ↓
    API Gateway (Load Balancer)
        ↓
    Backend Services (Node.js)
        ├── Auth Service
        ├── Course Service
        ├── Progress Service
        ├── Chat Service
        └── Admin Service
        ↓
    Data Layer
    ├── PostgreSQL (Primary DB)
    ├── Redis (Cache)
    └── S3 (File Storage)
        ↓
    External Services
    ├── AI Service
    ├── Email Service
    └── SMS Service
```

## 🎓 Key Features

### Phase 1 (MVP)
- ✅ User registration and auth
- ✅ Course browsing
- ✅ Lesson viewing
- ✅ Progress tracking
- ✅ Simple chatbot

### Phase 2
- AI-enhanced chatbot
- Quiz/assessment system
- Gamification (points, badges)
- Educator dashboard

### Phase 3
- USSD SMS access
- Advanced analytics
- Mobile app enhancements
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/awesome-feature`
3. Commit changes: `git commit -m 'Add awesome feature'`
4. Push to branch: `git push origin feature/awesome-feature`
5. Open pull request

See [Contributing Guide](./CONTRIBUTING.md) for detailed guidelines.

## 🐛 Bug Reports

Found a bug? Please open an issue with:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable
- Environment details (OS, browser, etc.)

## ❓ Common Issues

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Connection Error

```bash
# Check PostgreSQL is running
psql --version
psql -U postgres -d postgres -c "SELECT 1"

# Check connection string in .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=edubridge_dev
```

### Module Not Found

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

- **Email**: support@edubridge.rw
- **GitHub Issues**: [Report issues](../../issues)
- **Documentation**: See `/docs` folder
- **Community**: [Discord/Slack channels]

## 📅 Timeline

- **Phase 1 (MVP)**: January - March 2026
- **Phase 2 (Enhancement)**: April - June 2026
- **Phase 3 (Scale)**: July - December 2026

## 🎯 Success Metrics

- 1,000+ students enrolled by June 2026
- 90%+ daily active user rate
- 85%+ course completion rate
- 4.5+ average course rating
- < 100ms API response time

## 📖 Additional Resources

- [Agile Methodology](https://agilemanifesto.org/)
- [RESTful API Design](https://restfulapi.net/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🎓 Learning Paths

### For Backend Developers

1. Read [Backend README](./backend/README.md)
2. Review [Architecture](./docs/ARCHITECTURE.md)
3. Check [API Documentation](./docs/API.md)
4. Set up local backend
5. Run tests
6. Create first feature

### For Frontend Developers

1. Read [Web README](./web/README.md)
2. Understand [SRS](./docs/SRS.md)
3. Check [API Documentation](./docs/API.md)
4. Set up local frontend
5. Review component structure
6. Create first component

### For DevOps Engineers

1. Read [Deployment Guide](./docs/DEPLOYMENT.md)
2. Review [Architecture](./docs/ARCHITECTURE.md)
3. Set up AWS account
4. Configure infrastructure
5. Implement monitoring
6. Test deployment

## ✅ Pre-Commit Checklist

Before pushing code:

- [ ] Tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] No console.log statements (except errors)
- [ ] Comments added for complex code
- [ ] Commits are meaningful
- [ ] Branch is up-to-date with main
- [ ] All .env secrets are in .gitignore

## 🚀 Next Steps

1. **Set up your development environment** following Quick Start above
2. **Read the SRS document** to understand requirements
3. **Review the architecture** to understand design
4. **Pick an issue** to work on from GitHub Issues
5. **Follow contributing guidelines** and submit PR

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

---

## 🙏 Thank You

Thank you for contributing to EduBridge. Together, we're empowering women and vulnerable children through technology and education.

**Questions?** Don't hesitate to ask in discussions or email the team.

**Last Updated**: 2026-01-25  
**Status**: Ready for Development  
**Version**: 1.0.0 (Planning Phase)
