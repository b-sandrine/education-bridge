# Database Schema: Role-Based Data Model

**Location:** [database/schema.sql](database/schema.sql)  
**Database:** PostgreSQL  
**Version:** 1.0

---

## Entity Relationship Diagram (Logical)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION LAYER                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐                                               │
│  │      USERS           │  ← Core identity table (all roles)            │
│  ├──────────────────────┤                                               │
│  │ id (UUID)            │                                               │
│  │ email (UNIQUE)       │  ✅ Used for login                           │
│  │ password_hash        │  ✅ Encrypted                                 │
│  │ first_name           │                                               │
│  │ last_name            │                                               │
│  │ role (ENUM) ←────────┼──> ['student', 'educator', 'admin']         │
│  │ is_active            │  ✅ Soft delete support                      │
│  │ is_verified          │  ⚠️ Not yet implemented                      │
│  │ last_login_at        │  ⚠️ Not yet tracked                          │
│  │ created_at           │                                               │
│  └──────────────────────┘                                               │
│         ▲         │          │                                           │
│         │         │          │                                           │
│    ┌────┴────┬────┴───┐     └─────┐                                     │
│    │         │        │           │                                     │
│    │1:1      │1:1     │1:0        │                                     │
│    │         │        │           │                                     │
│    ▼         ▼        ▼           │                                     │
│ (if student)(if educator)        │                                     │
│                              1:N (admin can create admins)              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                       STUDENT-ONLY ROLE DATA                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐                                               │
│  │     STUDENTS         │  ← Extended student profile                   │
│  ├──────────────────────┤                                               │
│  │ id (FK to users.id)  │                                               │
│  │ date_of_birth        │                                               │
│  │ guardian_name        │  ✅ For parent communication                  │
│  │ guardian_phone       │                                               │
│  │ school_name          │  ⚠️ No school entity (needed for multi-org)  │
│  │ grade_level (1-12)   │  ✅ REB alignment                             │
│  │ learning_style       │  ⚠️ Schema ready, not used                    │
│  │ learning_preferences │  (JSONB)                                      │
│  │ total_points         │  ⚠️ For gamification (not computed)          │
│  │ achievement_count    │  ⚠️ For gamification (not computed)          │
│  └──────────────────────┘                                               │
│         ▲                                                                │
│         │ 1:N                                                            │
│         │ (One student has many enrollments)                            │
│         │                                                                │
│         │                            + More tables below                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      EDUCATOR-ONLY ROLE DATA                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐                                               │
│  │    EDUCATORS         │  ← Extended educator profile                  │
│  ├──────────────────────┤                                               │
│  │ id (FK to users.id)  │                                               │
│  │ subject_specializ.[] │  ✅ Array of subjects                         │
│  │ qualification        │  ✅ Degree/certification                      │
│  │ experience_years     │  ✅ Years of experience                       │
│  │ bio                  │  ✅ Profile description                       │
│  │ certification_number │  ✅ For school records                        │
│  └──────────────────────┘                                               │
│         ▲                                                                │
│         │ 1:N                                                            │
│         │ (One educator creates many courses)                           │
│         │                                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Content & Curriculum Layer

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COURSE MANAGEMENT (EDUCATOR)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐                                               │
│  │      COURSES         │  ← Created by educator                        │
│  ├──────────────────────┤                                               │
│  │ id (UUID)            │                                               │
│  │ title                │  ✅ E.g., "Math S2"                           │
│  │ description          │  ✅ Curriculum details                        │
│  │ subject              │  ✅ Math, English, Science, etc.              │
│  │ grade_level          │  ✅ REB grade 1-12                            │
│  │ created_by_id ────────────┬─> FK to educators.id                     │
│  │ difficulty_level     │  ✅ beginner|intermediate|advanced            │
│  │ is_published         │  ✅ Draft/live toggle                         │
│  │ total_lessons        │  ✅ Count (denormalized)                      │
│  │ enrollment_count     │  ✅ Current students                          │
│  │ average_rating       │  ⚠️ For reviews (not collected)              │
│  │ duration_hours       │  ✅ Estimated completion time                 │
│  │ thumbnail_url        │  ⚠️ Course cover image (not used)            │
│  │ created_at           │                                               │
│  └──────────────────────┘                                               │
│         ▲                                                                │
│         │ 1:N                                                            │
│         │ (One course has many lessons)                                 │
│         │                                                                │
│  ┌──────▼──────────────────────┐                                        │
│  │      LESSONS                 │  ← Lessons within course              │
│  ├──────────────────────────────┤                                        │
│  │ id (UUID)                    │                                        │
│  │ course_id (FK) ──────────────────┬─> To courses.id                   │
│  │ title                        │  ✅ E.g., "Fractions Intro"          │
│  │ description                  │                                        │
│  │ content (TEXT)               │  ✅ Can be HTML with embedded MD      │
│  │ content_type                 │  ✅ text|video|interactive|quiz|mixed │
│  │ video_url                    │  ✅ YouTube/Vimeo link               │
│  │ duration_minutes             │  ✅ Expected duration                  │
│  │ order_index                  │  ✅ Sequence: 1,2,3...               │
│  │ learning_objectives[]        │  ✅ Aligned to REB                    │
│  │ is_published                 │  ✅ Draft or live                     │
│  │ average_time_spent_minutes   │  ✅ Actual time (computed)            │
│  │ completion_rate              │  ✅ % of students who completed       │
│  │ created_at                   │                                        │
│  └──────────────────────────────┘                                        │
│         ▲            │                                                    │
│         │        1:N │                                                    │
│    ┌────┘            │                                                    │
│    │         ┌───────▼─────────┐                                        │
│    │         │  LESSON_MEDIA    │  ← Files attached to lessons          │
│    │         ├──────────────────┤                                        │
│    │         │ id (UUID)        │                                        │
│    │         │ lesson_id (FK)   │  FK to lessons.id                      │
│    │         │ file_type        │  image|video|pdf|audio                │
│    │         │ file_url         │  S3/CDN URL                            │
│    │         │ file_size_mb     │  For quota management                  │
│    │         │ duration_seconds │  For video/audio                       │
│    │         └──────────────────┘                                        │
│    │            (supports multiple files)                               │
│    │                                                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Enrollment & Progress Layer

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  STUDENT ENROLLMENT (ADMIN CONTROLS)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────┐                                   │
│  │       ENROLLMENTS                 │  ← Links students to courses      │
│  ├──────────────────────────────────┤                                   │
│  │ id (UUID)                        │                                   │
│  │ student_id (FK) ──────────┬──────────> To students.id                │
│  │ course_id (FK) ───────────┼──────────> To courses.id                 │
│  │ UNIQUE(student_id, course_id)    │  ✅ One enrollment per pair      │
│  │ enrollment_status                │  ✅ active|completed|dropped     │
│  │ enrollment_date                  │  ✅ When enrolled                 │
│  │ total_lessons_completed          │  ✅ Progress count                │
│  │ progress_percentage              │  ✅ 0-100%                        │
│  │ completion_date                  │  ✅ When course finished          │
│  │ estimated_completion_date        │  ✅ Predicted end date            │
│  │ course_rating                    │  ⚠️ Feedback (1-5 stars)         │
│  │ course_review                    │  ⚠️ Student comment               │
│  │ created_at                       │                                   │
│  └──────────────────────────────────┘                                   │
│         ▲                  │                                              │
│         │              1:N │                                              │
│    ┌────┘                  │                                              │
│    │              ┌────────▼───────────┐                                │
│    │              │    PROGRESS        │  ← Lesson-level tracking       │
│    │              ├────────────────────┤                                │
│    │              │ id (UUID)          │                                │
│    │              │ student_id (FK)    │  To students.id                 │
│    │              │ lesson_id (FK)     │  To lessons.id                  │
│    │              │ enrollment_id (FK) │  To enrollments.id              │
│    │              │ UNIQUE(student,    │  ✅ One progress per pair      │
│    │              │        lesson)     │                                │
│    │              │                    │                                │
│    │              │ completion_percent │  ✅ 0-100%                     │
│    │              │ time_spent_seconds │  ✅ How long student spent     │
│    │              │ quiz_score         │  ✅ Decimal (85.5)             │
│    │              │ quiz_attempts      │  ✅ Count (1,2,3..)            │
│    │              │ is_completed       │  ✅ Boolean                    │
│    │              │ completion_date    │  ✅ When done                  │
│    │              │ notes              │  ⚠️ Teacher notes              │
│    │              │ created_at         │                                │
│    │              └────────────────────┘                                │
│    │                  (for each lesson in course)                       │
│    │                                                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Assessment & Grading Layer

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   QUIZ MANAGEMENT (EDUCATOR CREATES)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────┐                                       │
│  │       QUIZZES                 │  ← Quiz for a lesson                │
│  ├──────────────────────────────┤                                       │
│  │ id (UUID)                    │                                       │
│  │ lesson_id (FK) ─────────┬────────> To lessons.id                     │
│  │ title                    │  E.g., "Fractions Quiz 1"                │
│  │ description              │  Quiz instructions                       │
│  │ total_questions          │  ✅ Count of questions                   │
│  │ passing_score            │  ✅ E.g., 70 (out of 100)               │
│  │ time_limit_minutes       │  ⚠️ Timed quizzes not used              │
│  │ show_correct_answers     │  ✅ Show answers after completion       │
│  │ shuffle_questions        │  ⚠️ Randomization not used              │
│  │ created_at               │                                          │
│  └──────────────────────────┘                                          │
│         ▲             │                                                  │
│         │         1:N │                                                  │
│    ┌────┘             │                                                  │
│    │         ┌────────▼──────────────┐                                 │
│    │         │  QUIZ_QUESTIONS       │  ← Questions in quiz            │
│    │         ├───────────────────────┤                                 │
│    │         │ id (UUID)             │                                 │
│    │         │ quiz_id (FK)          │  To quizzes.id                   │
│    │         │ question_text         │  ✅ The actual question         │
│    │         │ question_type         │  ✅ multiple_choice|true_false  │
│    │         │                       │     |short_answer|essay          │
│    │         │ order_index           │  ✅ Question sequence            │
│    │         │ points                │  ✅ Question worth (1-5 pts)    │
│    │         │ created_at            │                                 │
│    │         └────────────┬──────────┘                                 │
│    │                  1:N │                                             │
│    │              ┌───────▼──────────────────┐                         │
│    │              │  QUIZ_QUESTION_OPTIONS   │  ← MCQ choices          │
│    │              ├──────────────────────────┤                         │
│    │              │ id (UUID)                │                         │
│    │              │ question_id (FK)         │  To questions.id         │
│    │              │ option_text              │  E.g., "25/100"         │
│    │              │ is_correct               │  ✅ TRUE for right answer│
│    │              │ order_index              │  ✅ A,B,C,D order       │
│    │              │ created_at               │                         │
│    │              └──────────────────────────┘                         │
│    │                                                                     │
│    │  (Only for multiple_choice questions)                             │
│    │                                                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      STUDENT QUIZ ATTEMPTS                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────┐                                       │
│  │     QUIZ_ATTEMPTS            │  ← Student's quiz submission         │
│  ├──────────────────────────────┤                                       │
│  │ id (UUID)                    │                                       │
│  │ student_id (FK) ─────────────────> To students.id                    │
│  │ quiz_id (FK) ────────────────────> To quizzes.id                     │
│  │ score                        │  ✅ Points earned (decimal)           │
│  │ total_time_spent_seconds     │  ✅ How long to complete              │
│  │ attempt_number               │  ✅ 1st, 2nd, 3rd attempt            │
│  │ passed                       │  ✅ Score >= passing_score?          │
│  │ submitted_at                 │  ✅ When student finished             │
│  │ created_at                   │                                       │
│  └──────────────────────────────┘                                       │
│                                                                          │
│  ✅ Records every quiz submission                                        │
│  ✅ Allows multiple attempts (student can retake)                        │
│  ✅ Educator can see all attempts per student                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## AI & Learning Support Layer

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AI TUTOR INTERACTIONS (STUDENT)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────┐                                 │
│  │     CHAT_INTERACTIONS              │  ← AI tutor logs                │
│  ├────────────────────────────────────┤                                 │
│  │ id (UUID)                          │                                 │
│  │ student_id (FK) ──────────────┬────────> To students.id              │
│  │ question (TEXT)                │  Student's question                 │
│  │ answer (TEXT)                  │  AI's response                      │
│  │ lesson_context_id (FK) ────────────> To lessons.id (nullable)        │
│  │ course_context_id (FK) ────────────> To courses.id (nullable)        │
│  │                                │  ✅ AI knows lesson context         │
│  │ ai_provider                    │  e.g., 'openai', 'cohere'          │
│  │ response_time_ms               │  How fast was response              │
│  │ helpful_rating                 │  1-5 stars (student feedback)       │
│  │ feedback (TEXT)                │  "Too complex", etc.                │
│  │ flagged_for_review             │  ⚠️ For moderation                 │
│  │ created_at                     │  Timestamp                          │
│  └────────────────────────────────────┘                                 │
│                                                                          │
│  ✅ Tracks every AI conversation                                         │
│  ✅ Context-aware (knows lesson + course)                               │
│  ✅ Can see patterns in what students ask                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Gamification Layer (Schema Ready, Not Activated)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   ACHIEVEMENTS & MOTIVATION SYSTEM                      │
├─────────────────────────────────────────────────────────────────────────┤
│  ⚠️  SCHEMA EXISTS BUT NO BACKEND/FRONTEND LOGIC                         │
│                                                                          │
│  ┌──────────────────────────┐                                           │
│  │    ACHIEVEMENTS          │  ← Badge definitions                      │
│  ├──────────────────────────┤                                           │
│  │ id (UUID)                │                                           │
│  │ title                    │  E.g., "Mathematician"                   │
│  │ description              │  "Complete 5 math lessons"                │
│  │ icon_url                 │  Badge image                              │
│  │ criteria_type            │  course_completion|points|streak          │
│  │ criteria_value           │  5 lessons, 100 points, etc.             │
│  │ badge_color              │  Gold, Silver, Bronze                     │
│  └──────────────────────────┘                                           │
│         ▲                                                                │
│         │                                                                │
│         │                                                                │
│  ┌──────┴────────────────────────┐                                      │
│  │  STUDENT_ACHIEVEMENTS          │  ← When student earns badge        │
│  ├────────────────────────────────┤                                     │
│  │ id (UUID)                      │                                     │
│  │ student_id (FK)                │  To students.id                      │
│  │ achievement_id (FK)            │  To achievements.id                  │
│  │ UNIQUE(student, achievement)   │  Can't earn same badge twice        │
│  │ earned_at                      │  When achieved                       │
│  └────────────────────────────────┘                                     │
│                                                                          │
│  ┌────────────────────────────────┐                                     │
│  │    STUDENT_POINTS              │  ← Points ledger                    │
│  ├────────────────────────────────┤                                     │
│  │ id (UUID)                      │                                     │
│  │ student_id (FK)                │  To students.id                      │
│  │ points_earned                  │  +10, +50, etc.                     │
│  │ reason                         │  quiz_completion, streak            │
│  │ reference_id                   │  Link to quiz, lesson, etc.         │
│  │ created_at                     │  When earned                         │
│  └────────────────────────────────┘                                     │
│                                                                          │
│  ❌ NOT USED                                                             │
│  - No points calculation in quiz submission                             │
│  - No badge awarding when course completes                             │
│  - No leaderboard query                                                 │
│  - No UI to display badges/points                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Support & Feedback Layer

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     STUDENT SUPPORT SYSTEM (ADMIN)                      │
├─────────────────────────────────────────────────────────────────────────┤
│  ✅ IN USE                                                               │
│                                                                          │
│  Queries are managed in-memory (API state) not in database yet          │
│  Admin can view and respond in AdminDashboardPage.jsx                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      USER FEEDBACK & RATINGS                            │
├─────────────────────────────────────────────────────────────────────────┤
│  ⚠️  SCHEMA EXISTS BUT NOT USED                                          │
│                                                                          │
│  ┌──────────────────────────────┐                                       │
│  │      FEEDBACK                 │  ← Course/lesson feedback            │
│  ├──────────────────────────────┤                                       │
│  │ id (UUID)                    │                                       │
│  │ feedback_type                │  course|lesson|system|ai              │
│  │ subject_id                   │  course_id or lesson_id               │
│  │ student_id (FK)              │  To students.id                        │
│  │ rating (1-5)                 │  Star rating                          │
│  │ comment                      │  Text feedback                        │
│  │ is_resolved                  │  Admin follow-up                      │
│  │ created_at                   │                                       │
│  └──────────────────────────────┘                                       │
│                                                                          │
│  ❌ NOT COLLECTED                                                        │
│  - No feedback forms in UI                                              │
│  - No admin dashboard for feedback                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Admin & System Layer

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ACTIVITY AUDIT TRAIL (IN SCHEMA)                     │
├─────────────────────────────────────────────────────────────────────────┤
│  ⚠️  SCHEMA EXISTS BUT NOT LOGGED                                        │
│                                                                          │
│  ┌──────────────────────────────┐                                       │
│  │     ACTIVITY_LOGS             │  ← System audit trail                │
│  ├──────────────────────────────┤                                       │
│  │ id (UUID)                    │                                       │
│  │ user_id (FK)                 │  Who did it?                          │
│  │ action                       │  "created_course", etc.               │
│  │ resource_type                │  "course", "lesson"                   │
│  │ resource_id                  │  Which resource?                      │
│  │ details (JSONB)              │  Full action details                  │
│  │ ip_address                   │  For security tracking                │
│  │ user_agent                   │  Browser info                         │
│  │ created_at                   │  When it happened                     │
│  └──────────────────────────────┘                                       │
│                                                                          │
│  ❌ NOT IMPLEMENTED                                                      │
│  - No logging on create/update/delete                                   │
│  - No admin dashboard to view logs                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## USSD/Mobile Layer (Schema Ready, No Integration)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   USSD SESSIONS (SMS-BASED LEARNING)                    │
├─────────────────────────────────────────────────────────────────────────┤
│  ⚠️  SCHEMA EXISTS BUT NOT INTEGRATED WITH SYSTEM                        │
│                                                                          │
│  ┌──────────────────────────────────┐                                   │
│  │      USSD_SESSIONS               │  ← SMS menu session                │
│  ├──────────────────────────────────┤                                   │
│  │ id (UUID)                        │                                   │
│  │ phone_number                     │  Student's phone                   │
│  │ student_id (FK) [optional]       │  Link to student account           │
│  │ session_state                    │  Current menu state                │
│  │ menu_level                       │  1 - Main menu, 2 - Lessons       │
│  │ started_at                       │  When session began                │
│  │ last_interaction_at              │  For timeout                       │
│  │ ended_at                         │  Session closed                    │
│  └──────────────────────────────────┘                                   │
│         ▲                                                                │
│         │ 1:N                                                             │
│         │ (One session has many interactions)                           │
│         │                                                                │
│  ┌──────┴────────────────────────┐                                      │
│  │     USSD_LOGS                 │  ← Each SMS message                 │
│  ├───────────────────────────────┤                                      │
│  │ id (UUID)                     │                                      │
│  │ session_id (FK)               │  To ussd_sessions.id                 │
│  │ phone_number                  │  Redundant (for safety)              │
│  │ user_input                    │  "1" or "2" (menu choice)            │
│  │ system_response               │  Message sent to phone               │
│  │ interaction_type              │  menu_selection|quiz|lesson          │
│  │ created_at                    │                                      │
│  └───────────────────────────────┘                                      │
│                                                                          │
│  ❌ NOT IMPLEMENTED                                                      │
│  - No USSD gateway integration (Telit, Huawei, etc.)                    │
│  - No SMS handling                                                       │
│  - No USSD menu UI/logic                                                │
│  - Data models exist, system doesn't use them                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Notifications System (Schema Ready, Not Used)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    USER NOTIFICATIONS (IN SCHEMA)                       │
├─────────────────────────────────────────────────────────────────────────┤
│  ⚠️  SCHEMA EXISTS BUT NO SENDING LOGIC                                  │
│                                                                          │
│  ┌──────────────────────────────┐                                       │
│  │      NOTIFICATIONS            │  ← User notifications                │
│  ├──────────────────────────────┤                                       │
│  │ id (UUID)                    │                                       │
│  │ user_id (FK) ────────────────────> To users.id                       │
│  │ title                        │  Notification heading                 │
│  │ message                      │  Full message text                    │
│  │ notification_type            │  achievement|progress|message         │
│  │                              │  |announcement                        │
│  │ is_read                      │  Unread = false                       │
│  │ action_url                   │  Link (e.g., /courses/123)            │
│  │ created_at                   │  When notif sent                      │
│  │ read_at                      │  When user read it                    │
│  └──────────────────────────────┘                                       │
│                                                                          │
│  ❌ NOT IMPLEMENTED                                                      │
│  - No notifications on course completion                                │
│  - No quiz result notifications                                         │
│  - No achievement earned notifications                                  │
│  - No UI to display notifications                                       │
│  - No email notification gateway                                        │
│  - No SMS notification gateway                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Summary: Data by Role

### What STUDENTS Can Generate
- `progress` records (lessons completed)
- `quiz_attempts` records (quiz submissions)
- `chat_interactions` records (tutoring questions)
- `enrollments` records (when admin enrolls them)

### What EDUCATORS Can Generate
- `courses` records (create courses)
- `lessons` records (create lessons)
- `quizzes` records (create quizzes)
- `quiz_questions` & `quiz_question_options` records

### What ADMINS Can Generate
- Change any `users.role`
- Create `users` (especially role='admin')
- Create `enrollments`, modify/delete any content
- View all queries and respond

---

## Performance Indexes Applied

```sql
✅ Authentication Speed
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

✅ Content Discovery
CREATE INDEX idx_courses_subject ON courses(subject);
CREATE INDEX idx_courses_grade_level ON courses(grade_level);
CREATE INDEX idx_courses_created_by_id ON courses(created_by_id);

✅ Progress Tracking
CREATE INDEX idx_progress_student_id ON progress(student_id);
CREATE INDEX idx_progress_lesson_id ON progress(lesson_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);

✅ Quiz Analytics
CREATE INDEX idx_quiz_attempts_student_id ON quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

✅ Soft Deletes
CREATE INDEX idx_users_is_active ON users(is_active);
```

---

## Data Constraints for Integrity

```sql
Primary Keys: All tables have UUID primary keys
Foreign Keys: All relationships properly constrained
Unique Constraints:
  - users.email (no duplicate emails)
  - enrollments(student_id, course_id) (one enrollment per pair)
  - progress(student_id, lesson_id) (one progress per pair)
  - student_achievements(student_id, achievement_id) (earn badge once)

Check Constraints:
  - users.role IN ('student', 'educator', 'admin')
  - enrollments.enrollment_status IN ('active', 'completed', 'dropped', 'paused')
  - lessons.content_type IN ('text', 'video', 'interactive', 'quiz', 'mixed')
  - quiz_questions.question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')
  - courses.difficulty_level IN ('beginner', 'intermediate', 'advanced')
  - students.grade_level BETWEEN 1 AND 12
  - quizzes.passing_score can be 0-100
```

---

## Foreign Key Cascades

```sql
CRITICAL: ON DELETE CASCADE

users → students: Delete student profile if user deleted
users → educators: Delete educator profile if user deleted
courses → lessons: Delete all lessons if course deleted
lessons → lesson_media: Delete all media if lesson deleted
lessons → quizzes: Delete all quizzes if lesson deleted
quizzes → quiz_questions: Delete all questions if quiz deleted
quizzes → quiz_attempts: Delete all attempts if quiz deleted

SAFE: ON DELETE SET NULL
courses.created_by_id: If educator deleted, course stays but creator NULL
feedback.student_id: If student deleted, feedback stays (historical)
```

---

## Soft Delete Support

Tables with `deleted_at` timestamp:
- `users` - Can recover deleted accounts
- `courses` - Can recover deleted courses
- `lessons` - Can recover deleted lessons

**Implementation Note:** Current code doesn't use soft deletes, just hard deletes.

