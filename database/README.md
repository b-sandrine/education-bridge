# EduBridge Database

Database schemas, migrations, and seed data for the EduBridge system.

## Setup

### 1. Create Database

```bash
createdb edubridge_dev
```

Or using PostgreSQL client:

```sql
CREATE DATABASE edubridge_dev;
```

### 2. Run Schema

```bash
psql -U postgres -d edubridge_dev -f schema.sql
```

### 3. Run Migrations

```bash
# From backend directory
npm run migrate
```

## Files

### `schema.sql`
Complete database schema including:
- User tables (users, students, educators)
- Course tables (courses, lessons, enrollments)
- Progress tracking
- Quizzes and assessments
- Chat interactions
- Achievements
- USSD sessions
- Admin logs
- Views and triggers

### `migrations/`
Database migration files:
- `001_initial_schema.sql`
- `002_add_indexes.sql`
- `003_add_views.sql`
- Additional migrations as needed

### Seeds (Optional)
Sample data for development:
- `seeds/users.sql` - Sample users
- `seeds/courses.sql` - Sample courses
- `seeds/lessons.sql` - Sample lessons

## Tables Overview

### Core Tables

**users**
- All system users (students, educators, admins)
- Columns: id, email, password_hash, role, etc.

**students**
- Student-specific data
- References: users (id)
- Columns: date_of_birth, guardian_name, grade_level, etc.

**educators**
- Educator-specific data
- References: users (id)
- Columns: subject_specializations, qualification, etc.

**courses**
- Learning courses
- References: educators (created_by_id)
- Columns: title, subject, grade_level, etc.

**lessons**
- Lessons within courses
- References: courses (course_id)
- Columns: title, content, duration_minutes, etc.

**enrollments**
- Student enrollments in courses
- References: students, courses
- Columns: enrollment_status, progress_percentage, etc.

**progress**
- Tracks student progress through lessons
- References: students, lessons, enrollments
- Columns: completion_percentage, score, etc.

**quizzes** & **quiz_questions**
- Quiz assessments
- References: lessons
- Columns: passing_score, time_limit, etc.

**chat_interactions**
- AI chatbot interactions
- References: students, lessons, courses
- Columns: question, answer, helpful_rating, etc.

**achievements**
- Badges and achievements
- Columns: title, criteria_type, etc.

**student_achievements**
- Links students to earned achievements
- References: students, achievements

**ussd_sessions** & **ussd_logs**
- USSD interactions tracking
- Columns: phone_number, session_state, etc.

**activity_logs**
- System activity audit logs
- References: users
- Columns: action, resource_type, details, etc.

## Views

### `student_progress_summary`
Aggregated view of student progress:
```sql
SELECT student_id, courses_enrolled, courses_completed, 
       avg_progress, total_points, achievements_earned
FROM student_progress_summary
```

### `leaderboard`
Student rankings by points:
```sql
SELECT id, first_name, last_name, total_points, 
       achievements, rank
FROM leaderboard
LIMIT 100
```

### `course_analytics`
Course performance metrics:
```sql
SELECT course_id, title, total_enrollments, 
       completion_rate, avg_rating
FROM course_analytics
```

## Connection

### PostgreSQL CLI
```bash
psql -h localhost -U postgres -d edubridge_dev
```

### From Backend
```javascript
// connections are handled by the backend pool
// See backend/src/config/database.js
```

### Environment Variables
Set in backend `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=edubridge_dev
DB_USER=postgres
DB_PASSWORD=your_password
```

## Common Queries

### Get student with progress
```sql
SELECT 
  s.id, u.first_name, u.last_name, u.email,
  COUNT(DISTINCT e.id) as courses_enrolled,
  AVG(e.progress_percentage) as avg_progress
FROM students s
JOIN users u ON s.id = u.id
LEFT JOIN enrollments e ON s.id = e.student_id
WHERE s.id = 'student-uuid'
GROUP BY s.id, u.first_name, u.last_name, u.email
```

### Get course with enrollment count
```sql
SELECT 
  c.id, c.title, c.subject,
  COUNT(e.id) as enrollments,
  ROUND(100.0 * COUNT(CASE WHEN e.enrollment_status = 'completed' THEN 1 END) / COUNT(e.id), 2) as completion_rate
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
WHERE c.is_published = true
GROUP BY c.id, c.title, c.subject
ORDER BY enrollments DESC
```

### Get chat analytics
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_questions,
  COUNT(DISTINCT student_id) as unique_students,
  AVG(CAST(helpful_rating AS NUMERIC)) as avg_rating
FROM chat_interactions
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC
```

## Backup & Restore

### Backup Database
```bash
pg_dump -U postgres edubridge_dev > backup_`date +%Y%m%d_%H%M%S`.sql
```

### Restore Database
```bash
psql -U postgres edubridge_new < backup.sql
```

## Performance Indexes

Key indexes created for performance:
- `idx_users_email` - Email lookup
- `idx_users_role` - Role filtering
- `idx_courses_subject` - Subject filtering
- `idx_courses_grade_level` - Grade filtering
- `idx_enrollments_student_id` - Student queries
- `idx_progress_student_id` - Progress lookups
- `idx_chat_interactions_created_at` - Time-based queries

## Maintenance

### Vacuum and Analyze
```sql
VACUUM ANALYZE;
```

### Check Index Health
```sql
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Monitor Table Sizes
```sql
SELECT 
  schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### Connection Issues
```bash
# Test connection
psql -h localhost -U postgres -c "SELECT version();"

# Check PostgreSQL status
sudo systemctl status postgresql
```

### Permission Issues
```sql
-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

### Transaction Issues
```sql
-- View active transactions
SELECT pid, query, state FROM pg_stat_activity WHERE state != 'idle';

-- Kill stuck transaction
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE query ~ 'YOUR_QUERY';
```

## Documentation

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Schema Diagram](./schema-diagram.md)
- [Database Design](./DESIGN.md)

## Support

For database issues:
- Check logs: `docker logs edubridge-db`
- Enable query logging in PostgreSQL
- Contact: db-support@edubridge.rw

---

**Last Updated**: 2026-01-25
**Status**: Ready for Development
