# 📈 Habit Tracker Pro

A premium, high-fidelity habit tracking mobile application built with **React Native** and **Expo**. This app features a modern design system, real-time social statistics, an intelligent icon mapping engine, and robust data management, designed to help users build and maintain life-changing habits.

![Habit Tracker Banner](./assets/banner.png)

## 🚀 Key Features

### 💎 Core Experience
- **Personalized Habit Tracking**: Create, manage, and track daily habits with a highly intuitive UI featuring dynamic progress circles.
- **Intelligent Icon Engine**: The app features a highly sophisticated regex-based icon mapping utility. It analyzes your custom habit names (from "Drink Water" to "Side Hustle" to "Takbo Malala") and automatically assigns the perfect icon and vibrant color palette.
- **Smart Reminders**: Integrated notification system triggering early at 8:00 AM to keep you on track.
- **Habit Library**: Explore focus areas dynamically populated by real community data, or pick from personalized recommendations.

### 📊 Advanced Analytics & Milestones
- **Visual Heatmaps**: Track consistency over months with interactive heatmaps.
- **History Timeline**: A beautifully designed vertical timeline logging all daily activities and streaks.
- **Trophies & Badges**: Unlock prestigious milestones (e.g., *Consistency King/Queen*, *Weekend Warrior*, *Early Bird*) as you progress, displayed proudly on your profile.

### 🌍 Social & Community
- **Global Leaderboard**: View rankings across the entire app community sorted by total habit completions.
- **Popular Categories**: The "Explore by focus area" dynamically aggregates and ranks the top categories actively being used by the global community.
- **Community Habits**: Add habits that are trending among other users with one tap.

### 🔐 Security & Integration
- **Dual Authentication**: Secure login via **Firebase Email/Password** and **Google Sign-In**.
- **Real-time Sync**: Data is synced instantly across devices using Cloud Firestore.
- **Profile Management**: Custom profile pictures and editable personal information.

### 🛠️ Technical Excellence
- **Data Export**: Export your entire habit history as JSON using `expo-sharing`.
- **Version Sync**: Automatic versioning synced directly from GitHub git tags via pre-build scripts.

## 📱 App Workflow

1.  **Onboarding**: Secure registration and Google integration for a seamless start.
2.  **The Hub**: A dashboard displaying a weekly calendar (Sunday -> Saturday), active habits, current streaks, and daily progress at a glance.
3.  **Engagement**: Daily interactions to mark habits, triggering real-time streak updates and milestone unlocking.
4.  **Deep Dive**: Access the Statistics screen for visual heatmaps, or jump into the Global Leaderboard to see how you rank.
5.  **Management**: Use the Habit Library to evolve your routines and Settings to manage your data and export history.

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 54](https://expo.dev/) / React Native
- **Backend**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **UI Components**: [Lucide React Native](https://lucide.dev/), [Google Fonts (Inter & Lexend)](https://fonts.google.com/)
- **Navigation**: React Navigation 7 (Native Stack & Bottom Tabs)
- **State**: React Context API for global state management (Auth, Habits).

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components (Modals, Habit Cards, Timeline Nodes)
├── config/       # Firebase and global configurations
├── context/      # Auth and Habit context providers handling real-time snapshots
├── hooks/        # Custom React hooks
├── navigation/   # Tab and Stack navigation logic (AppNavigator)
├── screens/      # All core screens (Dashboard, Leaderboard, History, Library, etc.)
├── theme/        # Unified design system and color palettes
└── utils/        # Intelligent Icon Mapper, Dates, Streaks, and Export helpers
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
This project is optimized for Android development:
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
