# Quiz & Exam Feature Guide

## Overview

The Education Bridge platform now includes a comprehensive quiz and exam system that allows educators to create assessments and track student performance. This feature supports multiple question types, automated scoring, and detailed analytics.

---

## Features

### For Educators

✅ **Quiz Creation**
- Create quizzes with custom titles and descriptions
- Set passing scores and time limits
- Mix different question types
- Shuffle questions for added security
- Edit and delete quizzes

✅ **Question Management**
- Multiple Choice Questions
- True/False Questions
- Short Answer Questions (auto-graded)
- Essay Questions (manual grading)
- Set points per question
- Reorder questions

✅ **Analytics & Reporting**
- View class-wide quiz performance
- See individual student scores
- Track student progress trends
- Export results to CSV
- Identify common problem areas

### For Students

✅ **Quiz Taking**
- Intuitive quiz interface
- Timer with warnings
- Question navigation
- Progress tracking
- Immediate feedback

✅ **Results & Feedback**
- See final score and percentage
- Review all answers
- Understand correct solutions
- Track progress over multiple attempts

---

## Architecture

### Database Tables

All quiz data is stored in the following tables:

- `quizzes` - Quiz metadata (title, passing_score, time_limit, etc.)
- `quiz_questions` - Individual questions with options and answers
- `quiz_attempts` - Student quiz submissions and scores
- `progress` - Extended to track quiz_score per lesson

### API Endpoints

#### Quiz Management (Educator/Admin)
```
POST   /api/quiz/quizzes                    - Create quiz
GET    /api/quiz/quizzes                    - List quizzes (with filters)
GET    /api/quiz/quizzes/:id                - Get quiz details
PUT    /api/quiz/quizzes/:id                - Update quiz
DELETE /api/quiz/quizzes/:id                - Delete quiz
GET    /api/quiz/lessons/:lessonId/quiz     - Get quiz for a lesson
```

#### Question Management (Educator/Admin)
```
POST   /api/quiz/quizzes/:id/questions      - Create question
GET    /api/quiz/quizzes/:quizId/questions  - Get all questions
PUT    /api/quiz/questions/:questionId      - Update question
DELETE /api/quiz/questions/:questionId      - Delete question
```

#### Quiz Taking (Student)
```
POST   /api/quiz/quizzes/:quizId/submit     - Submit quiz attempt
GET    /api/quiz/quizzes/:quizId/attempts   - Get my attempts
GET    /api/quiz/attempts/:attemptId        - Get specific attempt
```

#### Analytics (Educator/Admin)
```
GET    /api/quiz/courses/:courseId/quizzes-analytics          - Course-wide analytics
GET    /api/quiz/quizzes/:quizId/results                      - Quiz results
GET    /api/quiz/courses/:courseId/quiz-performance (Student) - Student performance
```

---

## How to Use

### Step 1: Access Quiz Feature (Educator)

1. Login as an educator
2. Go to **Educator Dashboard**
3. Select your course
4. Go to **Manage Lessons**
5. Click on a lesson
6. Click **Create Quiz** (button to be added to lesson detail page)

### Step 2: Create a Quiz

1. **Fill Quiz Settings:**
   - **Quiz Title**: e.g., "Python Basics Quiz"
   - **Description**: Instructions for students (optional)
   - **Passing Score**: Set minimum percentage (default: 70%)
   - **Time Limit**: Set duration or leave empty for no limit
   - **Shuffle Questions**: Toggle for randomized order

2. **Add Questions:**
   - Click **Add Question**
   - Enter question text
   - Select question type
   - Set points value
   - Add options/answers

### Step 3: Question Types

#### Multiple Choice
```
Format: 
  Question: "What is 2+2?"
  Options: ["3", "4", "5", "6"]
  Correct Answer: "4" (index 1)
  Points: 1-5
```

#### True/False
```
Format:
  Question: "Python is a programming language"
  Options: ["True", "False"]
  Correct Answer: "True"
  Points: 1-5
```

#### Short Answer
```
Format:
  Question: "What is the capital of France?"
  Correct Answer: "Paris"
  Notes: Auto-graded with string comparison
  Points: 1-5
```

#### Essay
```
Format:
  Question: "Explain the water cycle"
  Sample Answer: (for reference)
  Notes: Requires manual grading
  Points: 5-20
```

### Step 4: Student Takes Quiz

1. Student navigates to course
2. Clicks on lesson with quiz
3. Clicks **Take Quiz**
4. Completes quiz before time limit
5. Submits quiz
6. Reviews answers and results

### Step 5: View Analytics

1. Go back to **Class Analytics**
2. Select your course
3. View **Quiz Performance** tab
4. See:
   - Average scores
   - Pass/fail breakdown
   - Score distribution chart
   - Individual student attempts
5. Click **Export CSV** for reporting

---

## Integration Points

### In LessonForm Component

Add to lesson management:
```jsx
// In your lesson form, add:
<div>
  {lesson.id && <Button onClick={() => navigate(`/lesson/${lesson.id}/quiz`)}>
    Create/Edit Quiz
  </Button>}
</div>
```

### In CourseDetailPage Component

When displaying a lesson:
```jsx
{lesson.has_quiz && (
  <Button onClick={() => openQuizTaker()}>
    📝 Take Quiz
  </Button>
)}
```

### In EducatorDashboardPage

Add to analytics section:
```jsx
// New tab for quiz analytics
<EducatorQuizAnalytics courseId={courseId} quizzes={quizzes} />
```

---

## Usage Examples

### Example 1: Creating a Python Quiz

**Quiz Title:** Python Fundamentals Quiz

**Question 1 (Multiple Choice)** - 2 points
- Text: "What keyword is used to define a function in Python?"
- Options: ["def", "func", "function", "define"]
- Answer: "def"

**Question 2 (True/False)** - 1 point
- Text: "Python is a compiled language"
- Answer: "False"

**Question 3 (Short Answer)** - 2 points
- Text: "What is the output of print(5 * 3)?"
- Answer: "15"

**Question 4 (Essay)** - 5 points
- Text: "Explain the difference between lists and tuples in Python"
- Sample: "Lists are mutable and use [], tuples are immutable and use ()"

**Quiz Settings:**
- Passing Score: 70%
- Time Limit: 30 minutes
- Total Points: 10

### Example 2: Viewing Student Performance

1. After students complete quizzes
2. Go to **Class Analytics** > **Quiz Performance**
3. See dashboard showing:
   - Average class score: 78%
   - 18/20 students passed (90%)
   - Score range: 45% - 98%

4. Click on specific quiz to see:
   - Individual student scores in table
   - Export button for CSV report
   - Score distribution chart

---

## Grading & Scoring

### Automatic Grading
- **Multiple Choice**: Exact match to correct answer
- **True/False**: Exact match to True/False
- **Short Answer**: Case-insensitive string comparison

### Manual Grading (Essays)
- Essays marked with **"Manual Grading Required"** badge
- Educators can review student essays
- Points can be manually adjusted in future update

### Score Calculation
```
Percentage = (Points Earned / Total Points) * 100
Passed = Percentage >= Passing Score
```

---

## Best Practices

### For Educators

1. **Question Design**
   - Keep questions clear and concise
   - Avoid ambiguous options
   - Mix question types to vary assessment
   - Use appropriate difficulty levels

2. **Quiz Setup**
   - Set realistic time limits (avg: 1-2 min per question)
   - Set passing scores aligned with learning objectives (60-80%)
   - Enable shuffling for high-stakes assessments
   - Provide clear instructions in description

3. **Review & Analytics**
   - Review questions students struggle with
   - Identify topics needing reteaching
   - Track progress over multiple attempts
   - Use data to improve content

### For Students

1. **Before Quiz**
   - Review lesson content
   - Check time limit
   - Find quiet environment
   - Have paper ready if needed

2. **During Quiz**
   - Read questions carefully
   - Answer all questions (if required)
   - Use time limit wisely
   - Review answers before submitting

3. **After Quiz**
   - Review results immediately
   - Read explanations for missed items
   - Ask educator questions about difficult concepts
   - Retake if allowed

---

## Frontend Component Integration

### QuizBuilder Component
Used by educators to create/edit quizzes

```jsx
import { QuizBuilder } from '@/components/QuizBuilder';

<QuizBuilder
  lesson={currentLesson}
  onSave={handleSaveQuiz}
  onCancel={handleCancel}
  initialQuiz={existingQuiz}
/>
```

### QuizTaker Component
Used by students to take quizzes

```jsx
import { QuizTaker } from '@/components/QuizTaker';

<QuizTaker
  quiz={quizData}
  questions={questionsList}
  onSubmit={handleSubmitQuiz}
  onCancel={handleCancel}
  onAttemptComplete={handleComplete}
/>
```

### QuizAnalytics Component
Used by educators to view results

```jsx
import { QuizAnalytics } from '@/components/QuizAnalytics';

<QuizAnalytics
  quiz={selectedQuiz}
  courseId={courseId}
  onBack={handleBack}
/>
```

---

## API Usage Examples

### Create a Quiz
```bash
POST /api/quiz/quizzes
{
  "lessonId": "lesson-123",
  "title": "Python Basics",
  "description": "Test your Python knowledge",
  "passingScore": 70,
  "timeLimitMinutes": 30,
  "shuffleQuestions": true,
  "questions": []
}
```

### Add a Question
```bash
POST /api/quiz/quizzes/quiz-456/questions
{
  "questionText": "What is 2+2?",
  "questionType": "multiple_choice",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": "1",
  "points": 2
}
```

### Submit Quiz Attempt
```bash
POST /api/quiz/quizzes/quiz-456/submit
{
  "answers": {
    "question-1": "4",
    "question-2": "true",
    "question-3": "Paris"
  },
  "timeTakenSeconds": 1245
}
```

### Get Quiz Analytics
```bash
GET /api/quiz/quizzes/quiz-456/results
```

Response includes all student attempts with scores, time taken, and pass/fail status.

---

## Known Limitations & Future Enhancements

### Current Limitations
- Short answer grading is exact string match (no fuzzy matching)
- Essays cannot be auto-graded in UI yet
- No plagiarism detection
- No question bank/question reuse system

### Planned Enhancements
- [ ] Question bank with reusable questions across courses
- [ ] Fuzzy matching for short answer questions
- [ ] Manual essay grading interface
- [ ] Question difficulty rating
- [ ] Time analytics (avg time per question)
- [ ] Question effectiveness analysis
- [ ] Adaptive quizzing based on performance
- [ ] Mobile-optimized quiz taking
- [ ] Peer review for essay questions

---

## Troubleshooting

### Quiz doesn't appear in lesson
- Verify quiz was created with correct lesson ID
- Check that lesson exists in database
- Clear browser cache and reload

### Student can't take quiz
- Verify student is enrolled in course
- Check quiz has questions added
- Ensure student hasn't exceeded attempt limit (if set)

### Scores not saving
- Check API is running and accessible
- Verify student is authenticated
- Check browser console for errors
- Ensure quiz passing score is valid

### Analytics not loading
- Verify quiz has student attempts
- Check educator has permission for course
- Refresh page or clear cache
- Check browser network tab for failed requests

---

## Support

For issues or questions:
1. Check this guide first
2. Review error messages in browser console
3. Check API logs on backend
4. Contact system administrator

---

**Version:** 1.0  
**Last Updated:** March 2026  
**Status:** Beta (Production Ready)
