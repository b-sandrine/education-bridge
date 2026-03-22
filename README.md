# EduBridge - Multi-Platform Learning System

A technology-driven solution to empower women and vulnerable children with access to high-quality, inclusive, and structured education.

## Project Overview

EduBridge is a multi-platform educational system designed to address financial barriers, inadequate digital infrastructure, and lack of organized learning support in Rwanda's low-income communities. The system provides access to curriculum-aligned learning through:

- **Web Application** - Modern web interface for desktop/laptop users
- **Mobile Application** - Android app for smartphone users
- **USSD Interface** - SMS-based access for basic phone users
- **AI-Powered Learning Assistant** - Curriculum-aligned question-answering support

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

See individual README files in each subsystem:
- [Backend Setup](backend/README.md)
- [Web Frontend Setup](web/README.md)
- [Mobile App Setup](mobile/README.md)
- [USSD Integration](ussd/README.md)
- [Database Setup](database/README.md)

## Documentation

Detailed documentation is available in the `docs/` folder:
- [SRS Document](docs/SRS.md)
- [Architecture Documentation](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [User Guides](docs/)

## Team

- **Project Lead**: Sandrine
- **Organization**: Aspire Haven Foundation
- **Mission**: Empower women and vulnerable children through education

## License

[To be determined]

## Contact

For questions or feedback, contact: [contact information]
