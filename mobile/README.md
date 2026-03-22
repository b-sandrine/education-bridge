# EduBridge Mobile App

React Native mobile application for the EduBridge multi-platform learning system. Runs on Android and iOS with Expo.

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI
- Backend API running (see [backend README](../backend/README.md))

### Installation

1. **Navigate to mobile directory**
```bash
cd mobile
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Expo CLI globally** (if not already installed)
```bash
npm install -g expo-cli
```

4. **Start development server**
```bash
npm start
```

5. **Run on device or emulator**

**Android Emulator:**
```bash
npm run android
```

**iOS Simulator** (macOS only):
```bash
npm run ios
```

**Web Browser:**
```bash
npm run web
```

## Project Structure

```
mobile/
├── src/
│   ├── screens/          # Screen components
│   │   ├── auth/         # Auth screens
│   │   ├── home/         # Home screens
│   │   ├── courses/      # Course screens
│   │   ├── lessons/      # Lesson screens
│   │   ├── profile/      # Profile screens
│   │   ├── chat/         # Chat screens
│   │   └── admin/        # Admin screens
│   ├── components/       # Reusable components
│   ├── navigation/       # React Navigation setup
│   ├── services/         # API services
│   ├── store/            # Redux store
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── App.tsx           # Root component
├── assets/               # Images, fonts, icons
├── tests/                # Test files
├── app.json              # Expo configuration
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Features

### Authentication
- User registration and login
- Biometric authentication (fingerprint/face)
- Offline authentication token storage

### Student Features
- Browse courses (offline available)
- Enroll in courses
- View lessons and content
- Offline content sync
- Track learning progress
- AI chatbot for questions
- View achievements and points
- Push notifications for reminders

### Educator Features
- Create and manage courses
- Monitor student progress
- View analytics

### Connectivity
- **Offline First**: Content cached locally
- **Background Sync**: Sync when online
- **USSD Fallback**: SMS-based features (in development)
- **Low-bandwidth Mode**: Reduced image quality

## Navigation Structure

```
├── RootNavigator
│   ├── AuthStack (when logged out)
│   │   ├── LoginScreen
│   │   ├── RegisterScreen
│   │   └── ForgotPasswordScreen
│   └── AppStack (when logged in)
│       ├── HomeTabs
│       │   ├── HomeScreen
│       │   ├── CoursesScreen
│       │   ├── ChatScreen
│       │   └── ProfileScreen
│       ├── CourseDetailsStack
│       │   ├── CourseDetailsScreen
│       │   └── LessonViewerScreen
│       ├── AdminStack (admin only)
│       │   ├── AdminDashboardScreen
│       │   └── UserManagementScreen
│       └── SettingsStack
│           ├── SettingsScreen
│           └── PreferencesScreen
```

## Available Scripts

```bash
# Development
npm start               # Start Expo dev server
npm run android        # Run on Android emulator
npm run ios           # Run on iOS simulator
npm run web           # Run on web browser

# Building
npm run build:android # Build Android APK/AAB
npm run build:ios     # Build iOS app
npm run build:web     # Build web version

# Testing & Quality
npm test              # Run tests
npm run test:watch    # Watch mode
npm run lint          # Check linting
npm run type-check    # TypeScript check

# Publishing
eas submit            # Submit to app stores
```

## API Integration

All API calls are in `/services`:

```javascript
import { authService } from '@services/auth'
import { courseService } from '@services/courses'

// Login
const user = await authService.login(email, password)

// Fetch courses
const courses = await courseService.getAllCourses()
```

## Offline Support

Using AsyncStorage for persistent data:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage'

// Save data
await AsyncStorage.setItem('key', value)

// Retrieve data
const value = await AsyncStorage.getItem('key')
```

## Push Notifications

```javascript
import * as Notifications from 'expo-notifications'

// Request permission
const { granted } = await Notifications.requestPermissionsAsync()

// Handle notification
Notifications.addNotificationResponseReceivedListener(response => {
  // Handle notification tap
})
```

## Camera & Image Access

```javascript
import * as ImagePicker from 'expo-image-picker'

const image = await ImagePicker.launchImageLibraryAsync()
```

## Performance Optimization

- Lazy loading of screens
- Image optimization and caching
- FlatList virtualization for long lists
- Memoization of components
- Background task optimization

## Styling

- React Native StyleSheet
- Platform-specific styles
- Responsive design utilities
- Dark mode support

## Testing

Unit tests with Jest and React Native Testing Library:

```bash
npm test -- --coverage
```

## Environment Configuration

Create `.env` based on `.env.example`:

```
EXPO_PUBLIC_API_URL=http://your-api-url/api
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## Device Permissions

Required permissions in `app.json`:

- Camera (for document upload)
- Photo Library (for image selection)
- Notifications (for reminders)
- File System (for offline content)

## Building for Production

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

### Web
```bash
npm run build:web
```

## Deployment

### EAS Build (Recommended)
```bash
eas build --platform android
eas build --platform ios
eas build --platform web
```

### Submit to App Stores
```bash
eas submit --platform android
eas submit --platform ios
```

## Troubleshooting

### Clear Expo cache
```bash
expo start -c
```

### Clear node_modules
```bash
rm -rf node_modules
npm install
```

### Reset Android emulator
```bash
$ANDROID_SDK_ROOT/emulator/emulator -avd YourAVDName -wipe-data
```

### Port already in use
```bash
expo start --port 19001
```

## Browser Compatibility

- Chrome/Chromium
- Firefox
- Safari
- Mobile Firefox
- Mobile Safari

## Known Issues

- Offline sync may have delays
- Video playback limited in web version
- USSD features work only on physical devices

## Contributing

1. Create feature branch
2. Follow code style
3. Write tests
4. Update documentation
5. Submit pull request

## Support

For issues:
- Email: support@edubridge.rw
- GitHub Issues: [Repository]
- Documentation: [Wiki]

## License

MIT License - See LICENSE file for details

---

**Last Updated**: 2026-01-25
**Status**: Under Development
