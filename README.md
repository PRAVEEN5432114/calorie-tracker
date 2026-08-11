# FitTrack 2.0 🥗🏃

**Your Premium Indian Nutrition & Fitness Platform**

FitTrack is a privacy-first, offline-capable Progressive Web Application (PWA) designed specifically for Indian users to track calories, macronutrients, hydration, exercise, and progress. It uses local storage and does not require a backend, meaning your data stays securely on your device.

---

## 🌟 Major Features

### 🍛 India-First Food Database
A comprehensive, built-in database covering South Indian (Idli, Dosa, Pongal), North Indian (Dal Makhani, Paneer, Parathas), street food, snacks, desserts, and standard proteins/vegetables. All items include macros (Protein, Carbs, Fat, Fiber).

### 📊 Comprehensive Macro & Calorie Tracking
Calculates your BMR and TDEE based on the Mifflin-St Jeor equation. Adjusts targets automatically based on your specific goals (Lose Weight, Build Muscle, Gain Weight). Tracks real-time progress on a visually stunning dashboard.

### 💪 Exercise & Workout Tracking
Uses MET (Metabolic Equivalent of Task) values to accurately estimate calories burned for a wide variety of activities including Gym Workouts, Yoga, Cricket, Badminton, and daily lifestyle activities.

### 💧 Hydration & Progress
Track your 3L daily water intake with quick-add buttons. Monitor your weight and track daily log streaks (🔥) and hydration streaks (💧).

### 🤖 FitTrack Coach
Rule-based intelligent insights on your dashboard that analyze your remaining calories and macros, suggesting whether you need more protein or should close out your calorie target.

### 📱 PWA & Offline Support
Installable directly to your phone's home screen. Fully functional completely offline. No internet connection is needed to search foods, log workouts, or view your dashboard!

---

## 🛠️ Technology Stack
- **Frontend Core:** Pure HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Data Persistence:** Versioned `localStorage` with migration logic.
- **PWA:** Custom `manifest.json` and `service-worker.js` with asset caching.
- **Icons & Typography:** Google Fonts (Outfit), Ionicons.

---

## 🚀 Deployment (GitHub Pages)

FitTrack is designed to be hosted 100% for free on GitHub Pages.

1. **Create Repository:** Create a new empty repository on GitHub.
2. **Upload Files:** Upload this entire directory.
3. **Enable Pages:** Go to Settings > Pages > Deploy from branch `main`.
4. **Live Link:** Your site will be live at `https://USERNAME.github.io/REPO-NAME/`.

> **Note:** All assets use relative paths (`./`) to ensure perfect compatibility with GitHub Pages subpath routing.

---

## 🔒 Privacy & Backup
- **Privacy-First:** FitTrack does not use external databases, analytics trackers, or telemetry.
- **Backup/Restore:** Go to Settings to securely download a JSON backup of your data.
