# EduBridge Web Frontend

React-based web application for the EduBridge multi-platform learning system.

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running (see [backend README](../backend/README.md))

### Installation

1. **Navigate to web directory**
```bash
cd web
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Project Structure

```
web/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── common/       # Common UI components
│   │   ├── layout/       # Layout components
│   │   ├── forms/        # Form components
│   │   └── dashboard/    # Dashboard components
│   ├── pages/            # Page components (route pages)
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Student dashboard
│   │   ├── courses/      # Course pages
│   │   ├── lessons/      # Lesson pages
│   │   ├── admin/        # Admin pages
│   │   └── educator/     # Educator pages
│   ├── services/         # API services
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── users.js
│   │   ├── progress.js
│   │   └── chat.js
│   ├── store/            # Redux store
│   │   ├── slices/       # Redux slices
│   │   └── index.js
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── styles/           # Global styles
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── tests/                # Test files
├── public/               # Static assets
├── vite.config.js        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json
├── .eslintrc.json
├── .prettierrc
└── README.md
```

## Features

### Authentication
- User registration and login
- JWT token management
- Password reset functionality
- Role-based access control

### Student Features
- Browse available courses
- Enroll in courses
- View lessons and content
- Track learning progress
- Ask questions to AI chatbot
- View achievements and badges
- Leaderboard

### Educator Features
- Create and manage courses
- Create lessons and content
- Monitor student progress
- View analytics and reports
- Manage student enrollments

### Admin Features
- User management
- System administration
- Analytics dashboards
- Content moderation
- Reporting

## Component Architecture

### Common Components
```
- Button
- Input
- Modal
- Card
- Badge
- Spinner
- Toast/Notification
- Breadcrumb
```

### Layout Components
```
- Navbar
- Sidebar
- Footer
- MainLayout
- DashboardLayout
```

### Feature Components
```
- CourseCard
- LessonViewer
- ChatBot
- ProgressBar
- StudentProfile
- EnrollmentForm
```

## State Management

Using Redux Toolkit for state management:

### Store Structure
```
store/
├── slices/
│   ├── authSlice.js      # Auth state
│   ├── userSlice.js      # User profile
│   ├── coursesSlice.js   # Courses data
│   ├── progressSlice.js  # Progress data
│   └── uiSlice.js        # UI state
└── index.js
```

## Styling

- **Framework**: Tailwind CSS
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Built-in support

## Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check for linting errors
npm run lint:fix     # Fix linting errors
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

## API Integration

All API calls are centralized in `/services`:

```javascript
// Example: Fetch courses
import { courseService } from '@services/courses'

const courses = await courseService.getAllCourses()
const course = await courseService.getCourseById(courseId)
```

## Routing

Using React Router for navigation:

```javascript
/                    # Home/Dashboard
/auth/login          # Login page
/auth/register       # Registration page
/courses             # Courses listing
/courses/:id         # Course details
/courses/:id/lessons/:lessonId # Lesson viewer
/dashboard           # Student dashboard
/progress            # Progress tracking
/chat                # AI Chatbot
/admin               # Admin panel
/admin/users         # User management
/admin/reports       # Analytics reports
/educator/courses    # Educator courses
/educator/analytics  # Educator analytics
/profile             # User profile
```

## Environment Configuration

Create `.env.local` based on `.env.example`:

```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=EduBridge
VITE_APP_VERSION=1.0.0
VITE_LOG_LEVEL=debug
```

## Authentication Flow

1. User submits login/registration
2. API returns JWT token (access + refresh)
3. Token stored in Redux and localStorage
4. All requests include Authorization header
5. Token refresh on expiration (automatic)
6. Logout clears tokens and redirects to home

## Performance Optimization

- Code splitting with lazy loading
- React.memo for component optimization
- useCallback for function memoization
- Redux selector optimization
- Image optimization and lazy loading
- CSS-in-JS for critical styles

## Browser Support

- Chrome latest
- Firefox latest
- Safari latest
- Edge latest
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

Unit and integration tests using Vitest:

```bash
# Watch mode
npm run test -- --watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

## Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Semantic HTML
- Focus management

## Deployment

### Development Build
```bash
npm run build
npm run preview
```

### Production Build
```bash
NODE_ENV=production npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

## Troubleshooting

### Port already in use
```bash
npm run dev -- --port 3002
```

### Clear cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build issues
```bash
npm run type-check
npm run lint:fix
npm run build
```

## Contributing

1. Create a new branch for features
2. Follow code style guidelines
3. Write tests for new components
4. Update documentation
5. Submit pull request

## Code Style

- ESLint configuration enforced
- Prettier for code formatting
- Husky for pre-commit hooks
- Conventional commit messages

## Performance Targets

- Page load: < 3 seconds
- Time to interactive: < 5 seconds
- Lighthouse score: > 90
- Core Web Vitals: Green

## Support

For issues or questions:
- GitHub Issues: [Repository]
- Email: support@edubridge.rw
- Documentation: [Wiki]

## License

MIT License - See LICENSE file for details

---

**Last Updated**: 2026-01-25
**Status**: Under Development
