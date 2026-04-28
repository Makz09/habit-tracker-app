# Habit Tracker Application

A premium, high-fidelity habit tracking mobile application built with **React Native** and **Expo**. This app features a modern design system, real-time statistics, and robust data management, designed to help users build and maintain life-changing habits.

![Habit Tracker Banner](https://raw.githubusercontent.com/Makz09/habit-tracker-app/main/assets/banner.png) *(Note: Replace with actual banner or screenshot after upload)*

## 🚀 Key Features

- **Personalized Habit Tracking**: Create, manage, and track daily habits with ease.
- **Dynamic Streaks**: Real-time calculation of current and longest streaks to keep you motivated.
- **Advanced Statistics**: 
  - Visual heatmaps for habit consistency.
  - Milestone tracking to celebrate progress.
  - In-depth habit analytics and history.
- **Secure Authentication**: Firebase-powered Login and Registration.
- **Profile Management**: Custom profile pictures (stored efficiently as Base64 in Firestore) and account details management.
- **Data Privacy & Export**: Export your habit data as JSON for backup or sharing using `expo-sharing`.
- **Premium UI/UX**: 
  - Modern, uniform design across all 10+ screens.
  - Custom branded splash screen and icons.
  - Pull-to-refresh functionality for seamless updates.
- **Automated Versioning**: Version numbers are automatically synced from GitHub git tags.

## 🔄 App Workflow & Process

1. **User Onboarding**: Secure registration and login flow using Firebase Authentication.
2. **Dashboard Overview**: The main hub displaying active habits, current streaks, and daily progress at a glance.
3. **Habit Creation & Management**: Users can create custom habits or choose from predefined templates in the Habit Library.
4. **Daily Tracking**: Users interact with the app daily to mark habits as complete, which updates their streaks and historical data in real-time.
5. **Analytics & Insights**: A dedicated statistics screen provides visual heatmaps, completion rates, and milestone tracking to visualize long-term consistency.
6. **Profile & Settings**: Users can manage their account details, set a custom profile picture (stored as Base64 in Firestore), and export their tracking data.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54) / React Native
- **Backend**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **State Management**: React Context API
- **Navigation**: React Navigation (Native Stack & Bottom Tabs)
- **Styling**: Vanilla StyleSheet with a unified Design System

## 📦 Installation & Setup

### Prerequisites

- Node.js (Latest LTS)
- Expo Go app on your mobile device (for testing)
- Android Studio / Xcode (for native builds)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Makz09/habit-tracker-app.git
   cd habit-tracker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
   - **Authentication**: Enable **Email/Password** sign-in method under `Authentication > Sign-in method`.
   - **Firestore Database**: Create a Firestore Database.
     - Update the Security Rules using the contents of the `firestore.rules` file.
     - Note: Composite indexes might be required for some queries. You can deploy them using the `firestore.indexes.json` file or simply click the links generated in the console logs when an index error occurs.
   - **Firebase Storage**: Enable Storage (optional, if you plan to move away from Base64 image storage).
   - **Credentials**: Register a Web App in your Firebase project settings and replace the `firebaseConfig` object in `src/config/firebase.js` with your own project credentials.

4. **Run the application**
   ```bash
   npx expo start
   ```
   Scan the QR code with your Expo Go app.

## 🤖 Native Android Build

This project includes custom configurations to ensure stability on Windows environments:
- **Forced NDK 26.3.11579264**: Resolves C++ linker issues common with NDK 27 on Windows.
- **SDK Pathing**: Pre-configured `local.properties` handling.

To build the Android APK/AAB:
```bash
npx expo run:android
```

## 🏷️ Version Syncing

The app uses a custom script to sync the version displayed in the UI with your GitHub tags.
- To update the version:
  ```bash
  git tag v1.x.x
  git push --tags
  npm start
  ```
The `prestart` hook will automatically update `app.json` with the latest tag version.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Developed with ❤️ by [Makz09](https://github.com/Makz09)
