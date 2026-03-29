# Quick Start Guide - Role-Based Implementation

## 🚀 Getting Started in 5 Minutes

### Step 1: Backend Setup
```bash
cd backend

# Install dependencies (if needed)
npm install

# Start the server
npm start
```

Your backend is now running at `http://localhost:3000`

### Step 2: Frontend Setup
```bash
cd ../web

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

Your frontend is now running at `http://localhost:5173`

---

## 🧪 Testing the New Features

### For Students - Test Achievement System

1. **Login as Student**
   - Navigate to http://localhost:5173
   - Use student credentials (demo@example.com / password)

2. **View Achievements**
   - Go to Dashboard
   - Scroll down to "Your Achievements" section
   - Click tabs to view badges and leaderboard

3. **View Analytics**
   - Go to a course detail page
   - Look for "Progress Analytics" or similar
   - View weak areas, recommendations, etc.

### For Teachers - Test Intervention Tools

1. **Login as Educator**
   - Use educator credentials
   - Go to Educator Dashboard

2. **Access Student Support**
   - Click "Student Support" tab (💚 icon)
   - See at-risk students listed
   - Try filtering by score threshold

3. **Create Assignment**
   - Click "Assign Practice" on any student
   - Fill in topic, description, due date
   - Submit

### For Admins - Test All Features

1. **Login as Admin**
   - Use admin credentials
   - Access all student and educator features
   - Can perform special actions like resetting streaks

---

## 📖 API Endpoint Testing

### Using Postman or cURL

**Get Student Achievements**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/gamification/achievements?studentId=STUDENT_ID
```

**Get Weak Areas**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/learner-analytics/weak-areas/COURSE_ID
```

**Get At-Risk Students**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/grading/at-risk/COURSE_ID?threshold=60
```

---

## 🔍 Project File Map

### Find Key Files Quickly

**Backend Entry**: `backend/src/server.js`
- Lines 15-21: New route imports
- Lines 81-89: Route registrations

**Frontend Main Page**: `web/src/pages/DashboardPage.jsx`
- Line 13: StudentGamification import
- Lines 65-73: Gamification section

**Educator Dashboard**: `web/src/pages/EducatorDashboardPage.jsx`
- Line 10: StudentInterventionTools import
- Line 34: New tab added
- Lines 310-328: Tab navigation updated
- Lines 458-465: Interventions content

**New Services**:
- `backend/src/services/GamificationService.js` - Badge system
- `backend/src/services/LearnerAnalyticsService.js` - Analytics
- `backend/src/controllers/gradingController.js` - Teacher tools

---

## 🐛 Troubleshooting

### Issue: Components not loading
**Solution**: 
- Check browser console for errors
- Verify API endpoints are registered in server.js
- Check that routes are properly imported

### Issue: "Cannot find module" error
**Solution**:
- Run `npm install` in backend directory
- Run `npm install` in web directory
- Clear node_modules and cache: `rm -rf node_modules && npm install`

### Issue: Database error
**Solution**:
- Verify DATABASE_URL in .env
- Run database migrations for new tables
- Check that PostgreSQL is running

### Issue: API 401 Unauthorized
**Solution**:
- Make sure token is being sent in requests
- Check token is valid and not expired
- Verify authorization middleware in routes

### Issue: CORS errors
**Solution**:
- Check CORS_ORIGIN in backend .env
- Set to `http://localhost:5173` for development
- Verify it matches your frontend URL

---

## 📝 Making Changes

### Adding a New Badge Type

**File**: `backend/src/services/GamificationService.js`, line 30-50

```javascript
BADGE_TYPES = {
  // ... existing badges ...
  YourNewBadge: {
    name: 'Your New Badge',
    description: 'Description of badge',
    icon: '🆕',
    points: 300,
    criteria: 'Criteria for earning'
  }
};
```

### Modifying Weak Area Threshold

**File**: `backend/src/services/LearnerAnalyticsService.js`, line ~50

Change the threshold (currently 70):
```javascript
if (avgScore < 70) {  // Change 70 to your threshold
  weakAreas.push({...});
}
```

### Adding New Analytics Visualization

**File**: `web/src/pages/StudentAnalyticsPage.jsx`

Add a new section before the closing div:
```javascript
{/* Your New Visualization */}
<div className="bg-white rounded-lg border border-gray-200 p-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">Your Title</h2>
  {/* Add your component here */}
</div>
```

---

## 🔗 Important Links

**Documentation**:
- `ROLE_IMPLEMENTATION_SUMMARY.md` - Complete technical reference
- `FEATURE_USAGE_GUIDE.md` - User guide for all roles
- `IMPLEMENTATION_CHECKLIST.md` - Feature verification

**Configuration**:
- Backend: `backend/.env`
- Frontend: `.env.local` or Vite config
- Database connection in `backend/src/config/database.js`

**API Documentation**:
- OpenAPI Spec: `http://localhost:3000/api-docs`
- Swagger UI: `http://localhost:3000/api-docs`

---

## 💾 Database Essentials

### Create New Tables (if needed)
```sql
-- See database/schema.sql for complete schema
-- Tables created: student_interventions, targeted_assignments, educator_feedback
-- Extended: quiz_answers with feedback fields
```

### Reset Database
```bash
cd backend
# Backup first!
npm run db:reset
```

### View Database
```bash
psql
\c education_bridge_db
\dt  -- List all tables
SELECT * FROM students LIMIT 5;  -- Query data
```

---

## 🎯 Next Steps

1. **Run the system**
   ```bash
   cd backend && npm start &
   cd web && npm run dev
   ```

2. **Test each role**
   - Login as student → View achievements
   - Login as educator → Use intervention tools
   - Login as admin → Access all features

3. **Create test data**
   - Enroll students in courses
   - Create quizzes
   - Complete lessons
   - Take quizzes to generate analytics

4. **Review documentation**
   - Check FEATURE_USAGE_GUIDE.md
   - Review API endpoints
   - Study role permissions

5. **Deploy when ready**
   - Follow IMPLEMENTATION_CHECKLIST.md
   - Run database migrations
   - Set environment variables
   - Deploy to production

---

## 📚 Learning Resources

### Understanding the Architecture

**Frontend Data Flow**:
```
Component → API Client → Backend → Database
```

**Role-Based Flow**:
```
User Login → Get Role → Apply Permissions → Show Features
```

**Gamification Flow**:
```
Student Action → Service Checks Criteria → Badge Earned → Points Added
```

---

## 🚨 Important Notes

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Features limited by user role
3. **Database**: New tables must be created before use
4. **Caching**: Leaderboard data can be cached (5-min TTL)
5. **Performance**: Add indexes on frequently queried columns

---

## ✅ Pre-Deployment Checklist

- [ ] All endpoints tested with correct role
- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Authentication working
- [ ] UI components displaying correctly
- [ ] Error handling working
- [ ] Performance acceptable
- [ ] Security checks passed

---

## 💬 Need Help?

**Check these files first:**
1. `FEATURE_USAGE_GUIDE.md` - Feature documentation
2. `PROJECT_STRUCTURE.md` - File organization
3. Component source code - Inline comments
4. API source code - Clear function names

**Common Issues:**
- See "Troubleshooting" section above
- Check console logs for errors
- Review .env configuration
- Verify database connection

---

## 🎉 You're Ready!

Your role-based education platform is set up and ready to use.

**Start with:**
1. Run backend: `cd backend && npm start`
2. Run frontend: `cd web && npm run dev`
3. Login with test credentials
4. Explore the new features
5. Refer to documentation as needed

Happy coding! 🚀
