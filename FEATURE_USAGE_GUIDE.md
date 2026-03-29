# Feature Usage Guide - Role-Based Implementation

## 🎓 For Students (Learners)

### Viewing Your Achievements
1. Go to **Dashboard** → Scroll to **Your Achievements** section
2. View your current stats:
   - 🔥 **Current Streak** - Days of consecutive learning
   - ⭐ **Total Points** - Accumulated through activities
   - 🏆 **Achievements** - Badges you've unlocked

### Achievement Tabs
- **Achievements Tab**: View all earned badges with dates
- **Leaderboard Tab**: See class rankings and compare with peers

### Understanding Your Analytics
1. Navigate to a course
2. Click **"Progress Analytics"** (if available in course menu)
3. View detailed insights:

**Weak Areas**
- Shows topics where you scored below 70%
- Red bars indicate areas needing improvement
- Focus your study on these topics

**Topic Mastery**
- Green progress bars show competency levels
- Aim to reach 80%+ for mastery
- Performance tracked across all topics

**Exam Readiness**
- Circular gauge shows preparation level
- Green = Ready, Amber = Nearly Ready, Red = Needs Prep
- Based on quizzes completed and average scores

**Learning Recommendations**
- Personalized practice suggestions
- Click "Start" to begin recommended activities
- Topics are prioritized by weakness level

**Learning Trajectory**
- Line chart showing improvement over time
- Green trend line indicates positive growth
- Helps visualize long-term progress

### Badge Types (15 Available)
| Badge | How to Earn | Points |
|-------|-------------|--------|
| 🚀 First Steps | Complete your first lesson | 50 |
| 🔥 Consecutive7Days | Study 7 days in a row | 250 |
| ⭐ Quiz100 | Get 100% on a quiz | 200 |
| 🏆 Top Performer | Earn highest class score | 300 |
| ⚡ Speed Demon | Complete quiz very quickly | 150 |
| 📚 Consistent Learner | Complete 10 lessons | 200 |
| 🎓 Mastery Unlocked | Get 90%+ on a topic | 300 |
| 📈 Rising Star Week | Top improvement this week | 250 |
| 👑 Class Leader | Lead the leaderboard | 500 |
| ✨ Perfection Week | 90%+ on all quizzes this week | 400 |
| 🤝 Helpful Peer | Contribute to peer learning | 150 |
| 🔝 Streak Master | Maintain 30-day streak | 500 |
| 🧠 Adaptive Genius | Master adaptive quizzes | 350 |
| ✅ Completion Master | Complete all course lessons | 400 |
| 🥇 Assessment Champion | Pass all course quizzes | 450 |

---

## 👨‍🏫 For Educators (Teachers)

### Accessing Student Support Tools
1. Go to **Educator Dashboard**
2. Click **"Student Support"** tab (the 💚 icon)
3. Access intervention tools

### Finding At-Risk Students
1. In Student Support tab, use filters:
   - **Search**: Find students by name or email
   - **Score Threshold**: Change from 60%, 70%, or 80%
2. View at-risk student cards showing:
   - Average score (red if struggling)
   - Quizzes taken
   - Failed attempt count
   - Weak topics (in red badges)

### Creating Targeted Assignments
1. Click **"Assign Practice"** button on a student card
2. Modal opens with fields:
   - **Topic**: Select from student's weak areas
   - **Description**: Add assignment instructions
   - **Due Date**: Set deadline
3. Click **"Create Assignment"** to assign

### Flagging Students for Intervention
1. Click **"Flag"** button on student card
2. Select priority level:
   - **High**: Immediate action needed (score < 50%)
   - **Medium**: Regular monitoring needed (50-70%)
   - **Low**: General support available
3. Add reason in text field
4. Student flagged and added to intervention list

### Analyzing Quiz Performance
1. Navigate to a quiz you created
2. Click **Analytics** button
3. View:
   - **Quiz Statistics**: Summary of all attempts
   - **Question Analysis**: Per-question success rates
   - **Performance Distribution**: Score spread across students

### Viewing Class Progress
1. In Student Support tab, see:
   - **Total Students**: Enrolled in course
   - **Active Students**: Have started lessons
   - **Average Completion**: Class progress percentage
   - **Average Quiz Score**: Class performance
   - **Struggling Count**: Students below threshold
   - **Top Performers**: Excellence achievers

### Grading Essay Responses
1. Navigate to a quiz with essay questions
2. Click **Grading** section
3. View ungraded essays:
   - Student name and email
   - Question text
   - Student response
4. Enter grade (0-100) and feedback
5. Optionally add rubric scores for detailed feedback
6. Click **Save Grade**

### Providing Student Feedback
1. Click on a student in the intervention tools
2. Click **"Send Feedback"** button
3. Choose feedback type:
   - **General**: General progress update
   - **Performance**: Quiz/test specific
   - **Intervention**: Support recommendation
   - **Encouragement**: Positive reinforcement
4. Write message
5. Attach files if needed
6. Send to student

---

## 🔐 For Admins

### Admin Dashboard Access
Admins have access to ALL features:
- Student analytics and achievements
- At-risk student detection
- Essay grading tools
- Quiz analytics
- Class progress overviews
- All educator tools

### Additional Admin Functions
1. **Manual Badge Awards**: In Gamification section
   - Award badges to students manually
   - Used for special achievements or make-ups

2. **Global System Analytics**: 
   - View platform-wide performance
   - Compare course metrics
   - Monitor system health

3. **Reset Functions**:
   - Reset student streaks if needed
   - Clear completed interventions
   - Archive historical data

---

## 📊 API Endpoints Quick Reference

### Learner Analytics
```
GET /api/learner-analytics/weak-areas/:courseId
GET /api/learner-analytics/topic-mastery/:courseId
GET /api/learner-analytics/learning-patterns/:courseId
GET /api/learner-analytics/recommendations/:courseId
GET /api/learner-analytics/exam-readiness/:courseId
GET /api/learner-analytics/adaptive-difficulty/:courseId
GET /api/learner-analytics/learning-velocity/:courseId
```

### Gamification
```
GET /api/gamification/achievements?studentId=X
GET /api/gamification/streaks?studentId=X
GET /api/gamification/leaderboard/:courseId
GET /api/gamification/progress/:badgeType
POST /api/gamification/awards (admin only)
DELETE /api/gamification/streaks/:studentId (admin only)
```

### Grading
```
GET /api/grading/essays/:quizId
POST /api/grading/grade/:responseId
GET /api/grading/quiz-stats/:quizId
GET /api/grading/question-analysis/:quizId
POST /api/grading/interventions
GET /api/grading/at-risk/:courseId
POST /api/grading/targeted-assignments
GET /api/grading/class-progress/:courseId
POST /api/grading/feedback/:studentId
```

---

## 🎯 Common Workflows

### Student Workflow
1. Login to Dashboard
2. Enroll in courses
3. Complete lessons
4. Take quizzes
5. Check achievements and badges
6. View analytics to identify weak areas
7. Follow recommendations to improve
8. Earn badges and climb leaderboard

### Educator Workflow
1. Login to Dashboard
2. Create course and add lessons
3. Create quizzes with various question types
4. Monitor student progress
5. Go to Student Support tab
6. Find at-risk students
7. Create targeted assignments
8. Provide feedback
9. Review quiz analytics
10. Grade essays and provide rubric feedback

### Admin Workflow
1. Monitor overall platform health
2. Check system-wide analytics
3. Award badges for special achievements
4. Manage teacher accounts
5. Review high-level reports
6. Handle escalated issues

---

## ⚙️ Configuration & Customization

### Badge Points (Configurable in GamificationService.js)
Modify the `BADGE_TYPES` object to change:
- Point values per badge
- Badge color and icon
- Achievement requirements

### Analytics Thresholds
Default weak area threshold: 70%
- Can be modified in LearnerAnalyticsService.js
- Adjust `getWeakAreas()` method

### At-Risk Student Threshold
Default: 60% score
- Can be changed via API query parameter: `?threshold=70`
- Or hardcoded in gradingController.js

### Leaderboard Display
- Currently shows top 20 by points
- Can be customized in GamificationService.js
- Add filters by course or subject

---

## 🆘 Troubleshooting

### StudentGamification Not Loading
- Verify student has enrolled in a course
- Check browser console for API errors
- Ensure studentId and courseId are passed correctly

### Analytics Show No Data
- Student may need to complete quizzes first
- Check that student is enrolled in course
- Verify quiz data exists in database

### Intervention Tools Not Appearing
- Educator must be logged in
- Must have at least one course created
- Check authorization level (educator+ role)

### Badges Not Updating
- Clear browser cache
- Reload page
- Check that quiz/activity is properly submitted
- Verify GamificationService is running

---

## 📈 Performance Tips

### For Students
- Maintain your streak for extra points
- Focus on weak areas for faster improvement
- Follow recommendations for targeted practice
- Check exam readiness before final assessments

### For Educators
- Review at-risk students weekly
- Create assignments early in the lesson
- Grade essays promptly for better feedback
- Use analytics to identify class patterns

### For System
- Run analytics queries during off-peak hours
- Cache leaderboard data regularly
- Archive old intervention records
- Monitor database performance

---

## 🔒 Security Notes

- All analytics endpoints require authentication
- Role-based access properly enforced
- Student data only visible to student, educator, admin
- Educator data only visible to educator, admin
- Admin access logged for audit trail

---

## 📱 Mobile Support

All features are responsive and mobile-friendly:
- Touch-friendly buttons
- Readable charts and analytics
- Mobile-optimized forms
- Responsive leaderboards

---

For additional help, contact your administrator or refer to the main documentation in README.md
