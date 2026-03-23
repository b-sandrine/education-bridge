# EduBridge USSD Gateway

USSD (Unstructured Supplementary Service Data) integration for SMS-based access to EduBridge learning system.

## Overview

Provides text-based (SMS) access to learning content and features for users with basic mobile phones without internet access. Fully integrated with curriculum-aligned courses, progress tracking, and AI chatbot assistance.

## Features Implemented

- ✅ **Multi-language menus** (English, Kinyarwanda, French)
- ✅ **User authentication** via phone + password
- ✅ **Course discovery** with category browsing
- ✅ **Progress tracking** for enrolled courses
- ✅ **AI Chatbot Q&A** with SMS-friendly responses
- ✅ **Session management** with auto-expiration
- ✅ **State machine navigation** for menu control
- ✅ **Integration with backend API**

## API Endpoints Implemented

### src/handlers/ussdHandler.js
- `handleMainMenu()` - Main menu navigation
- `handleLoginChoice()` - Login/Registration flow
- `handleCoursesMenu()` - Browse available courses
- `handleProgressMenu()` - View learning progress
- `handleChatbotQuestion()` - Ask curriculum questions

### src/server.js
- `POST /ussd` - Twilio-compatible endpoint
- `GET /ussd` - Africa's Talking compatible endpoint
- `GET /health` - Health check

## Quick Start

### Prerequisites

- Node.js 16+
- USSD Gateway account (Africa's Talking, Twilio, etc.)
- Backend API running (http://localhost:3000)

### Installation

1. **Navigate to ussd directory**
```bash
cd ussd
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit with your USSD gateway credentials
```

4. **Start server**
```bash
npm start
```

## Features

### Available USSD Features

1. **Access Learning Content**
   ```
   *100#
   → Select Course
   → Select Lesson
   → View Content
   ```

2. **Check Progress**
   ```
   *101#
   → View completion status
   → View scores
   → View certificates
   ```

3. **Ask Questions (AI Chatbot)**
   ```
   *102#
   → Enter question
   → Receive answer
   ```

4. **Enroll in Courses**
   ```
   *103#
   → Choose course
   → Confirm enrollment
   ```

5. **Account Management**
   ```
   *104#
   → View profile
   → Update preferences
   → Change password
   ```

## Architecture

### USSD Flow

```
User → SMS Gateway → USSD Handler → Application Logic → Database
                                   → Response → SMS Gateway → User
```

### Menu Structure

```
Main Menu (*)
├── 1. Learning Content
│   ├── 1. Browse Courses
│   ├── 2. View Lessons
│   └── 3. Read Content
├── 2. Progress & Achievements
│   ├── 1. View Progress
│   ├── 2. View Scores
│   └── 3. View Achievements
├── 3. Ask Question
│   ├── Type question
│   └── Receive answer
├── 4. Account
│   ├── 1. View Profile
│   ├── 2. Preferences
│   └── 3. Logout
└── 0. Exit
```

## Configuration

### Environment Variables

```env
# USSD Gateway
USSD_GATEWAY=africas_talking  # or twilio
USSD_API_KEY=your_api_key
USSD_USERNAME=your_username
USSD_SHORTCODE=100

# API Connection
API_URL=http://localhost:3000/api/v1

# Session Management
SESSION_TIMEOUT=300  # 5 minutes
SESSION_STORE=redis

# SMS Settings
SMS_SENDER_ID=EduBridge
MESSAGE_LIMIT=160  # USSD message length
```

## API Endpoints

```
POST /ussd/callback          # Receive USSD requests
GET  /ussd/sessions/:id      # Get session info
POST /ussd/sessions/:id/end  # End session
POST /ussd/logs              # Log interactions
```

## Message Format

### Request
```json
{
  "sessionId": "unique-session-id",
  "phoneNumber": "+250788000000",
  "userInput": "1",
  "serviceCode": "*100#"
}
```

### Response
```json
{
  "status": "success",
  "message": "Main Menu\n1. Learning Content\n2. Progress\n3. Ask Question\n4. Account\n0. Exit",
  "sessionEnd": false
}
```

## Session Management

Sessions are stored in Redis with automatic cleanup:

```javascript
// Create session
const session = {
  sessionId: xxxx,
  phoneNumber: '+250788...',
  userId: uuid,
  menuLevel: 'main',
  selectedCourse: null,
  createdAt: timestamp
}

// Auto-expire after 5 minutes
Redis.expire(sessionKey, 300)
```

## Content Formatting

### Text Constraints
- Maximum 160 characters per SMS
- Plain text only (no Unicode)
- Menu options numbered 1-9, 0

### Example Message
```
**EduBridge**

Math Lesson 1: Basics

Content continues...

Reply 1 for next, 2 for menu
```

## Integration with Backend

The USSD gateway communicates with the backend API:

```
USSD Request → Validate Phone
              → Fetch User Data
              → Generate Menu/Content
              → Track Interaction
              → Send SMS Response
```

## Security

- **Authentication**: Phone number verification
- **Encryption**: HTTPS for API calls
- **Rate Limiting**: 10 requests per phone per minute
- **Content Validation**: Sanitize all user inputs
- **Logging**: All interactions logged for audit
- **Privacy**: Comply with data protection regulations

## Monitoring

### Metrics
- Active sessions
- Message delivery rate
- Response time
- Error rate
- User retention

### Logging
All interactions logged in `ussd_logs` database table:

```sql
SELECT * FROM ussd_logs 
WHERE created_at > NOW() - INTERVAL 24 HOURS
ORDER BY created_at DESC;
```

## Testing

### Manual Testing
```bash
# Send test USSD
curl -X POST http://localhost:3000/api/v1/ussd/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+250788000000",
    "sessionId": "test123",
    "userInput": "*100#"
  }'
```

### Unit Tests
```bash
npm test
```

## Troubleshooting

### USSD Not Responding
1. Check gateway configuration
2. Verify API connectivity
3. Check session cache
4. Review logs for errors

### Message Truncation
- Respect 160 character limit
- Use abbreviations where possible
- Split long content across messages

### Session Timeout
- Increase `SESSION_TIMEOUT` if needed
- Clear abandoned sessions
- Monitor Redis memory

## Performance Optimization

- Cache frequently accessed content
- Use Redis for session storage
- Batch menu generation
- Optimize database queries
- Implement request queuing

## Supported USSD Gateways

### Africa's Talking
```
API: https://api.sandbox.africastalking.com/ussd
Documentation: https://africastalking.com/ussd
```

### Twilio Messaging
```
API: https://www.twilio.com/docs/ussd
URL: webhooks
```

## Deployment

### Docker
```bash
docker build -t edubridge-ussd .
docker run -p 3002:3002 edubridge-ussd
```

### Systemd (Linux)
```bash
systemctl start edubridge-ussd
systemctl enable edubridge-ussd
```

## Analytics

Track USSD engagement:

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT phone_number) as active_users,
  COUNT(*) as total_interactions,
  AVG(EXTRACT(EPOCH FROM (ended_at - started_at))) as avg_session_length
FROM ussd_sessions
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## Future Enhancements

- [ ] Multi-language USSD menus
- [ ] Offline content delivery
- [ ] Payment integration (for premium content)
- [ ] Voice API support
- [ ] Advanced analytics dashboard
- [ ] A/B testing scenarios
- [ ] Chatbot for USSD (text-to-speech)

## Support

For USSD-specific issues:
- Email: ussd-support@edubridge.rw
- GitHub Issues: [Repository]
- Documentation: [Wiki]

## License

MIT License

---

**Last Updated**: 2026-01-25
**Status**: Under Development
