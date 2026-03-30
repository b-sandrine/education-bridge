# Role-Based Access Control - Quick Reference

**Updated:** March 29, 2026

## Role Hierarchy

```
┌─────────────────┐
│  ADMIN          │  (Full system access)
│  role='admin'   │
└────────┬────────┘
         │
         ├─── Can do everything EDUCATOR can do
         ├─── Can do everything STUDENT can do
         └─── Plus admin-specific actions
         
┌─────────────────┐
│  EDUCATOR       │  (Course & class management)
│  role='educator'│
└────────┬────────┘
         │
         └─── Can do everything STUDENT can do
              (minus grading/admin functions)
         
┌─────────────────┐
│  STUDENT        │  (Limited learning access)
│  role='student' │
└─────────────────┘
```

---

## Permission Matrix

### Authentication & User Management

| Action | Student | Educator | Admin |
|--------|---------|----------|-------|
| Register (new user) | ✅ | ✅ | ❌ (admin secret) |
| Login | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Change user role | ❌ | ❌ | ✅ |
| Delete user | ❌ | ❌ | ✅ |
| Create admin account | ❌ | ❌ | ✅ (with secret key) |

**Location:** [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js)

---

### Content Management (Courses & Lessons)

| Action | Student | Educator | Admin |
|--------|---------|----------|-------|
| Browse all courses | ✅ | ✅ | ✅ |
| View course details | ✅ | ✅ | ✅ |
| **Create** course | ❌ | ✅ | ✅ |
| **Edit** own course | ❌ | ✅ (own only) | ✅ (all) |
| **Delete** own course | ❌ | ✅ (own only) | ✅ (all) |
| View course lessons | ✅ | ✅ | ✅ |
| **Create** lesson | ❌ | ✅ | ✅ |
| **Edit** lesson | ❌ | ✅ (in own course) | ✅ (all) |
| **Delete** lesson | ❌ | ✅ (in own course) | ✅ (all) |
| View enrolled students | ❌ | ✅ (own courses) | ✅ (all) |
| Enroll student in course | ❌ | ❌ | ✅ |
| Remove student from course | ❌ | ❌ | ✅ |

**Location:** [backend/src/routes/contentRoutes.js](backend/src/routes/contentRoutes.js)

---

### Learning & Progress Tracking

| Action | Student | Educator | Admin |
|--------|---------|----------|-------|
| Start course | ✅ | ❌ | ❌ |
| Update own progress | ✅ | ❌ | ❌ |
| View own progress | ✅ | ❌ | ❌ |
| Mark course complete | ✅ | ❌ | ❌ |
| **View class students progress** | ❌ | ✅ (own courses) | ✅ (all) |
| **View individual student details** | ❌ | ✅ (own courses) | ✅ (all) |
| **Generate course analytics** | ❌ | ✅ (own courses) | ✅ (all) |

**Location:** [backend/src/routes/progressRoutes.js](backend/src/routes/progressRoutes.js)

---

### Quizzes & Assessments

| Action | Student | Educator | Admin |
|--------|---------|----------|-------|
| View available quizzes | ✅ | ✅ | ✅ |
| Take quiz | ✅ | ✅ | ✅ |
| Submit quiz attempt | ✅ | ✅ | ✅ |
| View own quiz attempts | ✅ | ✅ | ✅ |
| **Create quiz** | ❌ | ✅ | ✅ |
| **Edit** quiz | ❌ | ✅ (own) | ✅ (all) |
| **Delete** quiz | ❌ | ✅ (own) | ✅ (all) |
| **Add questions** to quiz | ❌ | ✅ | ✅ |
| **Edit questions** | ❌ | ✅ (own) | ✅ (all) |
| **View class quiz analytics** | ❌ | ✅ (own courses) | ✅ (all) |
| **View quiz results** | ❌ | ✅ (own quizzes) | ✅ (all) |

**Location:** [backend/src/routes/quizRoutes.js](backend/src/routes/quizRoutes.js)

---

### AI Learning Assistant

| Action | Student | Educator | Admin |
|--------|---------|----------|-------|
| Create conversation | ✅ | ✅ | ✅ |
| Send message | ✅ | ✅ | ✅ |
| View conversations | ✅ (own) | ✅ (own) | ✅ (own) |
| Delete conversation | ✅ (own) | ✅ (own) | ✅ (all) |
| Get learning profile | ✅ | ✅ | ✅ |

**Location:** [backend/src/routes/aiRoutes.js](backend/src/routes/aiRoutes.js)

---

### Support & Queries

| Action | Student | Educator | Admin |
|--------|---------|----------|-------|
| Submit query | ✅ | ❌ | ❌ |
| View own queries | ✅ | ❌ | ❌ |
| Delete own query | ✅ | ❌ | ❌ |
| **View all queries** | ❌ | ❌ | ✅ |
| **View query details** | ❌ | ❌ | ✅ |
| **Respond to query** | ❌ | ❌ | ✅ |

**Location:** [backend/src/routes/queryRoutes.js](backend/src/routes/queryRoutes.js)

---

## API Endpoint Security Patterns

### Pattern 1: Public Access
```javascript
router.get('/courses', contentController.getAllCourses);
// ✅ Anyone can view course list (authenticated or not, depending on endpoint)
```

### Pattern 2: Authenticated Only
```javascript
router.post('/ai/conversations', authenticate, aiController.createConversation);
// ✅ Must have valid JWT token
// ✅ All authenticated roles allowed (student, educator, admin)
```

### Pattern 3: Role-Restricted (Single Role)
```javascript
router.post('/queries', authenticate, authorize('student'), queryController.createQuery);
// ✅ Must be authenticated
// ✅ ONLY student role allowed
```

### Pattern 4: Role-Restricted (Multiple Roles)
```javascript
router.post('/courses', authenticate, authorize('educator', 'admin'), contentController.createCourse);
// ✅ Must be authenticated
// ✅ Educator OR Admin role allowed
```

### Pattern 5: Role with Additional Logic
```javascript
// In controller: Only allow educators to see their own courses
export const getStudentsInCourse = asyncHandler(async (req, res) => {
  // Backend logic checks if educator owns the course
  const studentsProgress = await ProgressService.getStudentsInCourse(
    req.params.courseId,
    req.user.id,      // ← Current user ID
    req.user.role     // ← Admins bypass ownership check
  );
  // ✅ Educators see ONLY their students
  // ✅ Admins see ALL students
});
```

---

## How Middleware Authorization Works

### Location: [backend/src/middleware/auth.js](backend/src/middleware/auth.js)

```javascript
// Step 1: Extract JWT from Authorization header
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Expected format: "Bearer <token>"
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role   // ← Role is attached here
  };
  next();
};

// Step 2: Check if user's role matches allowed roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
};
```

### Usage in Routes
```javascript
// Only admins can update user role
router.put(
  '/users/:userId/role',
  authenticate,              // Step 1: Verify JWT
  authorize('admin'),        // Step 2: Verify role is 'admin'
  authController.updateUserRole
);
```

---

## Database Enforcement

### Constraint in Users Table

**Location:** [database/schema.sql](database/schema.sql#L16-L17)

```sql
role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'educator', 'admin'))
```

**Impact:**
- Database will reject any role value besides these 3
- Ensures data integrity at database level (defense-in-depth)

### Soft Deletions

Some tables support soft deletes:

```sql
deleted_at TIMESTAMP -- Soft delete
```

**Example:** [database/schema.sql](database/schema.sql#L35-L36)

This allows:
- Preserve historical data
- Restore deleted records
- Maintain referential integrity

---

## Role-Based Feature Availability

### What Each Role Can CREATE

| Resource | Student | Educator | Admin |
|----------|---------|----------|-------|
| Course | ❌ | ✅ | ✅ |
| Lesson | ❌ | ✅ | ✅ |
| Quiz | ❌ | ✅ | ✅ |
| Quiz Question | ❌ | ✅ | ✅ |
| AI Conversation | ✅ | ✅ | ✅ |
| Query/Support | ✅ | ❌ | ❌ |

### What Each Role Can VIEW

| Resource | Student | Educator | Admin |
|----------|---------|----------|-------|
| Own profile | ✅ | ✅ | ✅ |
| All users | ❌ | ❌ | ✅ |
| Own courses | ✅ | ✅ | ✅ |
| All courses | ✅ | ✅ | ✅ |
| Class students (educator's) | ❌ | ✅ | ✅ |
| Student performance | ❌ | ✅ (own class) | ✅ (all) |
| All queries | ❌ | ❌ | ✅ |

---

## Real-World Scenarios

### Scenario 1: Teacher Creating Course & Assigning Quiz

```
1. Teacher logs in → JWT token with role='educator'
2. POST /api/content/courses
   - Middleware: authenticate ✅ (token valid)
   - Middleware: authorize('educator', 'admin') ✅ (role is educator)
   - Controller: Creates course with educator_id = teacher's ID
   
3. POST /api/content/lessons
   - Middleware checks pass ✅
   - Controller: Creates lesson linked to course
   
4. POST /api/quiz/quizzes
   - Middleware checks pass ✅
   - Controller: Creates quiz for lesson
   
5. POST /api/quiz/quizzes/:id/questions
   - Middleware checks pass ✅
   - Controller: Adds MCQ, true/false, short answer questions
```

### Scenario 2: Student Taking Quiz

```
1. Student logs in → JWT token with role='student'
2. GET /api/quiz/quizzes/:id
   - No auth check (public quiz viewing)
   - Returns quiz structure and questions
   
3. POST /api/quiz/quizzes/:id/submit
   - Middleware: authenticate ✅ (token valid)
   - Middleware: authorize('student') ✅ (role is student)
   - Controller: Records attempt, grades MCQs, stores score
   - Database: Inserts row in quiz_attempts table
```

### Scenario 3: Admin Changing User Roles

```
1. Admin logs in → JWT token with role='admin'
2. GET /api/auth/users
   - Middleware: authenticate ✅
   - Middleware: authorize('admin') ✅
   - Returns list of all users
   
3. PUT /api/auth/users/:userId/role
   - Middleware checks pass ✅
   - Controller: Updates user's role in database
   - Can change student → educator, etc.
```

### Scenario 4: Teacher Trying to Delete Another Teacher's Course

```
1. Teacher A logs in → JWT with ID = 'abc123'
2. DELETE /api/content/courses/:courseId
   - Middleware: authenticate ✅
   - Middleware: authorize('educator', 'admin') ✅
   - Controller: Checks if course.created_by_id == 'abc123'
   - Result: ❌ Forbidden (course created by Teacher B)
   
⚠️ Authorization happens at TWO levels:
   - Middleware: Role check (educator or admin?)
   - Controller: Ownership check (own course only?)
```

---

## Security Notes

### ✅ What's Secure

1. **JWT Token expiration:** 7 days (set in [backend/src/middleware/auth.js](backend/src/middleware/auth.js))
2. **Password hashing:** bcryptjs with 10 salt rounds ([backend/src/models/User.js](backend/src/models/User.js))
3. **Authorization middleware:** Applied to all protected routes
4. **Database constraints:** Role validation at DB level

### ⚠️ What Needs Attention

1. **No HTTPS enforcement** in code (must be configured at server/proxy level)
2. **No rate limiting** on login endpoints
3. **No CORS configuration** shown
4. **JWT_SECRET** should not be default value in production
5. **No refresh token** logic (tokens don't auto-renew)
6. **Admin secret** for creating admins is basic protection

---

## Testing Checklist

### Test Case 1: Student Permissions
- [ ] Student can login ✅
- [ ] Student can view courses ✅
- [ ] Student cannot create courses ❌
- [ ] Student cannot modify quiz ❌
- [ ] Student can submit quiz ✅
- [ ] Student can view own progress ✅
- [ ] Student cannot view other students' progress ❌

### Test Case 2: Educator Permissions
- [ ] Educator can create course ✅
- [ ] Educator can only edit own courses (not others) ⚠️
- [ ] Educator can view own class analytics ✅
- [ ] Educator cannot delete other educators' courses ⚠️
- [ ] Educator cannot change user roles ❌

### Test Case 3: Admin Permissions
- [ ] Admin can create/edit all courses ✅
- [ ] Admin can change user roles ✅
- [ ] Admin can delete any user ✅
- [ ] Admin can view all analytics ✅
- [ ] Admin can respond to all queries ✅

---

## References

- JWT Implementation: [backend/src/middleware/auth.js](backend/src/middleware/auth.js)
- Role Enforcement: [backend/src/middleware/auth.js](backend/src/middleware/auth.js#L16-L26)
- Routes with Role Guards: [backend/src/routes/](backend/src/routes/)
- Database Schema: [database/schema.sql](database/schema.sql)

---

## CORS Testing

Tested with:

```
fetch('https://education-bridge-vnjp.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('✓ Works:', d))
  .catch(e => console.error('✗ CORS Error:', e))
```

