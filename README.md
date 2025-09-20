# Alert Reporter App

A React Native mobile application for reporting and tracking emergency alerts and incidents in your community.

## Features

- **User Authentication**: Secure login and registration system
- **Report Alerts**: Submit detailed incident reports with location and severity
- **View Active Alerts**: Stay informed about current emergencies in your area
- **Interactive Map**: Visualize alerts on a map interface
- **My Reports**: Track your submitted reports and their status
- **Profile Management**: Update your account information and preferences

## Project Structure

```
AlertReporterApp/
├── src/
│   ├── screens/           # Screen components
│   │   ├── LoginScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── MapScreen.js
│   │   ├── MyReportsScreen.js
│   │   ├── AlertsScreen.js
│   │   ├── ManageProfileScreen.js
│   │   └── ReportAlertScreen.js
│   ├── navigation/        # Navigation configuration
│   │   └── AppNavigator.js
│   ├── components/        # Reusable components
│   │   ├── LoadingSpinner.js
│   │   └── ErrorMessage.js
│   └── services/          # API service functions
│       ├── authService.js
│       └── alertService.js
├── App.js                 # Main app entry point
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AlertReporterApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/emulator**
   - For Android: `npm run android`
   - For iOS: `npm run ios`
   - For Web: `npm run web`

### Running the App

1. **Using Expo Go App** (Recommended for development)
   - Install Expo Go on your mobile device
   - Scan the QR code displayed in the terminal
   - The app will load on your device

2. **Using Android Emulator**
   - Start Android Studio and create/start an emulator
   - Run `npm run android`

3. **Using iOS Simulator** (macOS only)
   - Run `npm run ios`

## Configuration

### API Configuration

Update the API base URL in the service files:

1. Open `src/services/authService.js`
2. Replace `https://your-api-endpoint.com/api` with your actual API endpoint
3. Do the same for `src/services/alertService.js`

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
API_BASE_URL=https://your-api-endpoint.com/api
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## Development Guidelines

### Code Style

- Use functional components with React Hooks
- Follow consistent naming conventions (camelCase for variables, PascalCase for components)
- Add comments for complex logic and component props
- Use TypeScript for better type safety (optional but recommended)

### Component Structure

Each screen component should:
- Handle its own state management
- Include proper error handling
- Show loading states during API calls
- Be responsive and accessible

### API Integration

- All API calls are centralized in the `services/` directory
- Use async/await for API calls
- Handle errors gracefully with user-friendly messages
- Store authentication tokens securely using AsyncStorage

## Testing

### Manual Testing Checklist

- [ ] User can register a new account
- [ ] User can login with valid credentials
- [ ] User can navigate between all tabs
- [ ] User can submit a new alert report
- [ ] User can view their submitted reports
- [ ] User can view active alerts
- [ ] User can update their profile
- [ ] User can logout successfully

### Running Tests

```bash
# Run unit tests (when implemented)
npm test

# Run linting
npm run lint
```

## Deployment

### Building for Production

1. **Android APK**
   ```bash
   expo build:android
   ```

2. **iOS IPA**
   ```bash
   expo build:ios
   ```

3. **Web Build**
   ```bash
   npm run build:web
   ```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues**
   - Clean and rebuild: `cd android && ./gradlew clean && cd ..`
   - Check Android SDK and build tools versions

3. **iOS build issues**
   - Clean build folder in Xcode
   - Update CocoaPods: `cd ios && pod install && cd ..`

4. **Navigation issues**
   - Ensure all required navigation dependencies are installed
   - Check React Navigation version compatibility

### Getting Help

- Check the [React Native documentation](https://reactnative.dev/docs/getting-started)
- Visit [Expo documentation](https://docs.expo.dev/)
- Review [React Navigation documentation](https://reactnavigation.org/docs/getting-started)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication
  - Alert reporting
  - Basic navigation and UI
  - Profile management

## Future Enhancements

- [ ] Push notifications for emergency alerts
- [ ] Real-time chat for incident coordination
- [ ] Photo/video attachment for reports
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Advanced map features (clustering, filters)
- [ ] Integration with emergency services APIs"# MobileApplication" 
