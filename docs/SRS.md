# Software Requirements Specification (SRS)
## EduBridge Multi-Platform Learning System

**Title**: EduBridge  
**Prepared by**: Sandrine  
**Organization**: Aspire Haven Foundation  
**Date**: 25-01-2026  
**Version**: 1.0

---

## Table of Contents

1. [Introduction](#introduction)
2. [Overall Description](#overall-description)
3. [External Interface Requirements](#external-interface-requirements)
4. [Functional Requirements](#functional-requirements)
5. [Non-Functional Requirements](#non-functional-requirements)
6. [System Architecture](#system-architecture)
7. [Appendix](#appendix)

---

## 1. Introduction

### 1.1 Purpose

The purpose of this Software Requirements Specification (SRS) is to define the functional and non-functional requirements for EduBridge, a multi-platform digital learning system for Release 1.0. This document encompasses the web application, mobile application, USSD interface, and AI-powered learning assistant, providing stakeholders with a clear understanding of system functionality, constraints, and expectations.

### 1.2 Document Conventions

- Functional requirements use the format: **"The system shall..."** for clarity and testability
- Section headers follow a numbered hierarchy for easy reference
- All requirements are of equal priority unless explicitly indicated otherwise
- Standard academic formatting is used for consistency

### 1.3 Intended Audience

This SRS is intended for:
- **Developers** - Understand system behavior and implementation requirements
- **Project Managers** - Organize and monitor development efforts
- **Testers** - Create test cases aligned with system requirements
- **Stakeholders** - Comprehend system goals and capabilities

### 1.4 Product Scope

EduBridge is a multi-platform educational software solution designed to increase women's and vulnerable children's access to high-quality education regardless of financial or technological constraints. The system ensures accessibility for users with smartphones, basic phones, or limited internet connectivity by offering learning materials through:

- Web application
- Mobile application (Android)
- USSD interface (SMS-based)

The platform incorporates an AI-powered chatbot aligned with Rwanda's national school curriculum and promotes inclusive learning, improved engagement, and sustainable educational empowerment.

### 1.5 Problem Statement

**Background Story**: Mahoro, a young mother in the community, struggles to fund her son Mark's education. Despite Mark's academic potential and discipline, his access to schooling remains dependent on chance rather than right. Financial hardships prevent consistent payment of tuition, school supplies, and food.

**Problem**: Due to financial difficulties, inadequate digital infrastructure, and lack of organized learning support, millions of children globally—particularly women and vulnerable children in Rwanda's low-income areas—encounter obstacles to receiving high-quality, continuous education. Many are sent home from school during the academic year due to inability to pay regular tuition and educational costs.

**Solution Hypothesis**: Children's access to high-quality education, engagement in learning, and comprehension of academic concepts will significantly improve if a multi-platform learning system integrated with curriculum-aligned AI assistance is implemented in Rwandan communities. This improvement is anticipated to empower students and caregivers, restoring confidence and hope for a brighter future through education.

---

## 2. Overall Description

### 2.1 Product Perspective

EduBridge is a self-contained, new software product not designed to replace existing platforms but to function as a standalone solution integrating multiple access channels for inclusive education. The system consists of three primary subsystems:

1. **Web Application** - Desktop/laptop access
2. **Mobile Application** - Smartphone access
3. **USSD Interface** - Basic phone access

These are supported by a centralized backend managing user data, learning content, progress tracking, and AI-powered assistance. The modular design allows future integration with national education systems and expansion to additional regions.

### 2.2 Product Functions

**Major Functions**:
- User registration and authentication
- Access to curriculum-aligned learning content
- Student progress tracking and reporting
- AI-powered Q&A support for learners
- USSD-based access for basic mobile phones
- Role-based access control (students, educators, administrators)
- Administrative management of users and learning materials
- Content management and curriculum alignment

### 2.3 User Classes and Characteristics

#### Students
- Primary users of the system
- May have low digital literacy
- Access via web, mobile, or USSD
- Primarily children and young learners
- Target demographic: vulnerable children in low-income communities

#### Educators/Content Managers
- Create and manage learning content
- Moderate to high digital literacy
- Use web or mobile applications
- Responsible for curriculum alignment
- Monitor student engagement and performance

#### Administrators
- Manage system operations and user accounts
- High technical proficiency
- Access advanced system controls and reports
- Ensure system health and security
- Generate analytics and usage reports

### 2.4 Operating Environment

**Hardware**:
- Smartphones (Android)
- Personal computers
- Basic mobile phones (GSM)

**Operating Systems**:
- Android (mobile application)
- Web browsers (Google Chrome, Microsoft Edge, Firefox)
- SMS gateway (for USSD)

**Network**:
- Internet connectivity for web and mobile
- GSM network for USSD access
- Cloud-based server infrastructure

**Backend Requirements**:
- Node.js runtime environment
- PostgreSQL database
- Cloud infrastructure (AWS, Azure, or Google Cloud)

### 2.5 Design and Implementation Constraints

1. Compliance with child data protection and privacy regulations (GDPR, Rwanda DPA)
2. Support for low-bandwidth and low-end devices
3. Integration with telecommunication providers for USSD services
4. Secure authentication and authorization mechanisms
5. Initial localization to Rwandan national curriculum and language
6. Academic submission deadlines
7. Limited budget for external AI services
8. Reliable internet in target regions

### 2.6 User Documentation

The following documentation will be provided:
- User guide for students (simple, accessible language)
- Educator manual (content creation and management)
- Administrator manual (system configuration)
- Online help documentation within the application
- Basic onboarding tutorials
- Video tutorials for complex features

### 2.7 Assumptions and Dependencies

**Assumptions**:
- Users have access to at least a basic mobile phone
- Internet access available for web and mobile users
- National curriculum content is accessible for adaptation
- Users are willing to provide necessary personal information
- Reliable power supply for device charging

**Dependencies**:
- Availability of AI service providers (e.g., OpenAI, Cohere, local alternatives)
- Reliable telecommunications services for USSD functionality
- Cloud infrastructure availability and uptime
- Internet bandwidth sufficiency in target regions
- Educator availability for content creation
- Government support for curriculum access

---

## 3. External Interface Requirements

### 3.1 User Interfaces

**Web Application**:
- Simple and intuitive graphical user interface
- Responsive design for various screen sizes
- Clear navigation and consistent layout
- Dark/light mode options
- Accessibility features (WCAG 2.1 AA compliance)

**Mobile Application**:
- Touch-optimized interface
- Offline content access capability
- Intuitive navigation patterns
- Clear error messages
- Battery-efficient design

**USSD Interface**:
- Text-based menu-driven interface
- Simple numbered options
- Clear, concise messages
- Language support (Kinyarwanda, French, English)
- Maximum message length compliance with USSD standards

### 3.2 Hardware Interfaces

EduBridge interfaces with:
- Smartphones and PCs via standard input/output devices
- Basic mobile phones via GSM networks
- No specialized hardware required
- Standard internet connectivity devices

### 3.3 Software Interfaces

**Database**:
- Relational database (PostgreSQL)
- Stores user profiles, curriculum content, progress data

**AI Services**:
- Integration with external AI providers
- Custom curriculum context integration
- Real-time response capability

**Authentication Services**:
- Secure user credential management
- Session management
- Role-based access control

**Frontend Frameworks**:
- React (web application)
- React Native (mobile application)
- Express.js (backend API)

**Data Exchange**:
- User credentials
- Learning progress
- Chatbot queries and responses
- Content metadata

### 3.4 Communications Interfaces

**Web and Mobile Communication**:
- HTTP/HTTPS protocol
- TLS 1.2 or higher for encryption
- RESTful API architecture
- JSON data format

**USSD Communication**:
- USSD protocol (via telecom provider gateway)
- SMS protocol for notifications
- Standard telecom message formats

**External Service Communication**:
- Secure API calls to AI services
- HTTPS with API key authentication
- Rate limiting and error handling

**Data Transmission Security**:
- Encryption in transit (TLS/SSL)
- Encryption at rest (database)
- Secure token-based authentication

---

## 4. Functional Requirements

### Core Requirement Categories

#### 4.1 User Management

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| FR-1.1 | User Registration | The system shall allow new users to register accounts with email/phone verification |
| FR-1.2 | User Authentication | The system shall authenticate users securely using encrypted passwords |
| FR-1.3 | Profile Management | The system shall allow users to view and update their profile information |
| FR-1.4 | Password Recovery | The system shall provide secure password reset functionality |
| FR-1.5 | Session Management | The system shall maintain secure sessions with automatic timeout |

#### 4.2 Learning Content Management

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| FR-2.1 | Access Learning Content | The system shall display curriculum-aligned learning materials to students |
| FR-2.2 | Content Organization | The system shall organize content into courses and lessons |
| FR-2.3 | Multimedia Support | The system shall support text, images, videos, and interactive content |
| FR-2.4 | Content Search | The system shall provide search functionality for learning materials |
| FR-2.5 | Content Filtering | The system shall allow filtering by grade level, subject, and topic |

#### 4.3 Progress Tracking

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| FR-3.1 | Track Progress | The system shall track student progress through lessons and courses |
| FR-3.2 | Calculate Scores | The system shall calculate and display student scores |
| FR-3.3 | Generate Reports | The system shall generate progress reports for students and educators |
| FR-3.4 | Display Achievements | The system shall display badges and achievements for completed milestones |
| FR-3.5 | Track Engagement | The system shall track time spent and engagement metrics |

#### 4.4 AI-Powered Q&A

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| FR-4.1 | Accept Questions | The system shall accept text-based questions from students |
| FR-4.2 | Process Queries | The system shall process questions with curriculum context |
| FR-4.3 | Generate Responses | The system shall generate curriculum-aligned AI responses |
| FR-4.4 | Display Answers | The system shall display formatted answers in the user interface |
| FR-4.5 | Rate Responses | The system shall allow students to rate answer usefulness |

#### 4.5 USSD Access

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| FR-5.1 | USSD Navigation | The system shall provide menu-driven navigation via USSD |
| FR-5.2 | Content via USSD | The system shall deliver learning content through USSD messages |
| FR-5.3 | Progress via USSD | The system shall provide progress information via USSD |
| FR-5.4 | Q&A via USSD | The system shall support Q&A functionality via USSD |
| FR-5.5 | Session Management | The system shall manage USSD sessions with proper timeouts |

#### 4.6 Role-Based Access

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| FR-6.1 | Student Role | The system shall restrict student access to learning and Q&A features |
| FR-6.2 | Educator Role | The system shall allow educators to create and manage content |
| FR-6.3 | Admin Role | The system shall provide administrators with system management capabilities |
| FR-6.4 | Permission Enforcement | The system shall enforce permissions based on user role |

#### 4.7 Educator Functions

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| FR-7.1 | Create Content | The system shall allow educators to create new learning content |
| FR-7.2 | Edit Content | The system shall allow educators to edit existing content |
| FR-7.3 | Delete Content | The system shall allow educators to delete content with confirmation |
| FR-7.4 | Monitor Students | The system shall allow educators to view student progress and engagement |
| FR-7.5 | Manage Classes | The system shall allow educators to manage student classes/groups |

#### 4.8 Administrative Functions

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| FR-8.1 | Manage Users | The system shall allow administrators to create, edit, and delete user accounts |
| FR-8.2 | Assign Roles | The system shall allow administrators to assign user roles and permissions |
| FR-8.3 | Generate Reports | The system shall allow administrators to generate system analytics |
| FR-8.4 | System Configuration | The system shall provide system configuration settings |
| FR-8.5 | Data Backup | The system shall support automated data backup functionality |

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| NFR-1.1 | Response Time | The system shall respond to user requests within 2 seconds |
| NFR-1.2 | Concurrent Users | The system shall support minimum 1000 concurrent users |
| NFR-1.3 | Content Delivery | The system shall deliver video content with minimal buffering |
| NFR-1.4 | AI Response Time | The system shall provide AI responses within 5 seconds |
| NFR-1.5 | Database Performance | The system shall query database with response times < 500ms |
| NFR-1.6 | Low Bandwidth | The system shall function with bandwidth as low as 2G networks |

### 5.2 Security Requirements

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| NFR-2.1 | Authentication | The system shall use secure authentication mechanisms (bcrypt/scrypt) |
| NFR-2.2 | Encryption | The system shall encrypt data in transit (TLS 1.2+) and at rest |
| NFR-2.3 | Access Control | The system shall implement role-based access control (RBAC) |
| NFR-2.4 | Data Privacy | The system shall comply with GDPR and Rwanda data protection laws |
| NFR-2.5 | Child Safety | The system shall implement child protection measures |
| NFR-2.6 | API Security | The system shall protect APIs with authentication and rate limiting |
| NFR-2.7 | Session Security | The system shall implement secure session management with timeouts |
| NFR-2.8 | Input Validation | The system shall validate all user inputs against injection attacks |

### 5.3 Usability Requirements

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| NFR-3.1 | Low Literacy Support | The system shall be usable by users with low digital literacy |
| NFR-3.2 | Accessibility | The system shall comply with WCAG 2.1 AA accessibility standards |
| NFR-3.3 | Language Support | The system shall support Kinyarwanda, French, and English |
| NFR-3.4 | Intuitive Design | The system shall feature intuitive navigation and clear instructions |
| NFR-3.5 | Error Messages | The system shall provide clear, actionable error messages |
| NFR-3.6 | Help System | The system shall provide integrated help and documentation |

### 5.4 Availability and Reliability

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| NFR-4.1 | Availability | The system shall maintain 99.5% uptime |
| NFR-4.2 | Fault Tolerance | The system shall implement redundancy and failover mechanisms |
| NFR-4.3 | Data Integrity | The system shall maintain data consistency and integrity |
| NFR-4.4 | Disaster Recovery | The system shall implement disaster recovery procedures |
| NFR-4.5 | Backup Frequency | The system shall perform daily automated backups |

### 5.5 Compatibility

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| NFR-5.1 | Web Browsers | The system shall work on Chrome, Firefox, Edge, Safari |
| NFR-5.2 | Android Versions | The system shall support Android 6.0+ |
| NFR-5.3 | Device Types | The system shall work on smartphones, tablets, and desktops |
| NFR-5.4 | Network Types | The system shall support WiFi, 3G, 4G, and USSD networks |

### 5.6 Scalability Requirements

| Req ID | Requirement | Description |
|--------|-------------|-------------|
| NFR-6.1 | Horizontal Scaling | The system shall support horizontal scaling of backend servers |
| NFR-6.2 | Database Scaling | The system shall support database replication and sharding |
| NFR-6.3 | Future Growth | The system shall support expansion to 100,000+ users |
| NFR-6.4 | Content Scaling | The system shall handle growth in content and learning materials |

---

## 6. System Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed diagrams and descriptions:
- Use Case Diagram
- Class Diagram
- Sequence Diagrams
- Deployment Diagram
- Database Schema Diagram

---

## 7. Appendix

### Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **USSD** | Unstructured Supplementary Service Data - SMS-based service for basic phones |
| **AI** | Artificial Intelligence - used for curriculum-aligned chatbot |
| **SRS** | Software Requirements Specification |
| **RBAC** | Role-Based Access Control |
| **MVP** | Minimum Viable Product |
| **API** | Application Programming Interface |
| **TLS** | Transport Layer Security - encryption protocol |
| **WCAG** | Web Content Accessibility Guidelines |
| **GDPR** | General Data Protection Regulation |

### Appendix B: References

- UNESCO (2023). Global Education Monitoring Report: Education and Inequality
- Aspire Haven Foundation Documentation
- Rwanda National Curriculum Framework
- WCAG 2.1 Accessibility Guidelines
- OWASP Top 10 Security Standards

### Appendix C: Revision History

| Name | Date | Reason | Version |
|------|------|--------|---------|
| Sandrine | 23-01-2026 | Initial SRS documentation | 1.0 |

---

*End of Software Requirements Specification*
