# 📈 Habit Tracker Pro

A premium, high-fidelity habit tracking mobile application built with **React Native** and **Expo**. This app features a modern design system, real-time statistics, and robust data management, designed to help users build and maintain life-changing habits.

![Habit Tracker Banner](./assets/banner.png)

## 🚀 Key Features

### 💎 Core Experience
- **Personalized Habit Tracking**: Create, manage, and track daily habits with a highly intuitive UI.
- **Dynamic Streaks**: Real-time calculation of current and longest streaks to maintain momentum.
- **Habit Library**: Choose from curated templates or create your own custom routines.

### 📊 Advanced Analytics
- **Visual Heatmaps**: Track consistency over months with interactive heatmaps.
- **History & Calendar**: Dedicated history screen with detailed completion logs.
- **Milestone Tracking**: Automatic calculation of milestones to celebrate your progress.

### 🔐 Security & Integration
- **Dual Authentication**: Secure login via **Firebase Email/Password** and **Google Sign-In**.
- **Real-time Sync**: Data is synced instantly across devices using Cloud Firestore.
- **Profile Management**: Custom profile pictures (efficiently handled) and account customization.

### 🛠️ Technical Excellence
- **Data Export**: Export your entire habit history as JSON using `expo-sharing`.
- **Smart Notifications**: Integrated reminders to keep you on track.
- **Version Sync**: Automatic versioning synced directly from GitHub git tags.

## 📱 App Workflow

1.  **Onboarding**: Secure registration and Google integration for a seamless start.
2.  **The Hub**: A dashboard displaying active habits, current streaks, and daily progress at a glance.
3.  **Engagement**: Daily interactions to mark habits, triggering real-time streak updates.
4.  **Deep Dive**: Access the Statistics screen for visual heatmaps and long-term consistency analysis.
5.  **Management**: Use the Habit Library to evolve your routines and Settings to manage your data.

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 54](https://expo.dev/) / React Native
- **Backend**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **UI Components**: [Lucide Icons](https://lucide.dev/), [Google Fonts (Inter & Lexend)](https://fonts.google.com/)
- **Navigation**: React Navigation 7 (Native Stack & Bottom Tabs)
- **State**: React Context API for global theme and user state.

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components (Modals, Habit Cards)
├── config/       # Firebase and global configurations
├── context/      # Auth and Theme context providers
├── hooks/        # Custom React hooks for habits and auth
├── navigation/   # Tab and Stack navigation logic
├── screens/      # All 10+ core application screens
├── theme/        # Unified design system and color palettes
└── utils/        # Helper functions for dates, streaks, and exports
```

## 📦 Installation & Setup

### 1. Clone & Install
```bash
git clone https://github.com/Makz09/habit-tracker-app.git
cd habit-tracker-app
npm install
```

### 2. Firebase Configuration
- Create a Firebase project and enable **Authentication** (Email & Google) and **Firestore**.
- Copy your credentials into `src/config/firebase.js`.
- Deploy rules using `firestore.rules`.

### 3. Native Build (Android)
This project is optimized for Windows development:
- **NDK Version**: Forced to `26.3.11579264` for stability.
- **Build Command**:
  ```bash
  npx expo run:android
  ```

## 🏷️ Versioning
The app uses an automated versioning system. To update the UI version:
1. Create a tag: `git tag v1.x.x`
2. Push tags: `git push --tags`
3. The `prestart` hook will automatically sync `app.json`.

---
Developed with ❤️ by [Makz09](https://github.com/Makz09)
