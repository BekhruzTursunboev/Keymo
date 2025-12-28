# Keymo Web

> Turn typing into both a skill-building activity and a health/productivity metric.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)](https://tailwindcss.com/)

A minimalist productivity and health-focused typing application that tracks real-time activity, converts typing into calories burned, and motivates users through gamified challenges and personalized health insights.

---

## ✨ Features

### 🎯 Typing Challenges

- **Speed Mode** - Type as fast as you can
- **Accuracy Mode** - Focus on precision and perfection
- **Endurance Mode** - Sustain your focus over longer sessions
- **Timed Mode** - Challenge yourself with time limits (30s - 10min)
- Custom text from articles, coding exercises, or personal notes
- Real-time WPM, accuracy, and error tracking
- Pause/Resume functionality with keyboard shortcuts

### 📊 Real-Time Activity Dashboard

- Active vs idle time visualization
- Estimated calories burned from keyboard and mouse usage
- Health metrics: focus streaks, total activity time, idle reduction, typing consistency
- Clear graphs showing day/week/month trends
- Interactive charts with Recharts

### 🏆 Typing + Health Score

- Combines typing speed, accuracy, and active time to produce a composite productivity & health score
- See how small improvements impact your overall score
- Visual progress indicators

### 🎮 Gamification & Progress

- Points, badges, streaks for activity and typing improvements
- Level system based on points earned
- Visual rewards for daily/weekly consistency
- Achievement system with unlockable badges
- Leaderboard-ready architecture

### 🎯 Personalized Goals

- Set custom goals (reduce idle time, type X words, maintain accuracy, etc.)
- Track progress with visual indicators
- Deadline management
- Progress tracking over time

### 💡 Health Tips & Feedback

- Contextual tips based on your activity
- Reminders for breaks, hydration, posture, and eye care
- Personalized suggestions to improve your health and productivity

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/keymo-web.git

# Navigate to the directory
cd keymo-web

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety and better developer experience |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Smooth animations and transitions |
| **Zustand** | Lightweight state management |
| **Recharts** | Beautiful and responsive charts |
| **Lucide React** | Modern icon library |
| **date-fns** | Date utility functions |

---

## 📁 Project Structure

```
keymo-web/
├── app/
│   ├── layout.tsx          # Root layout with ActivityTracker
│   ├── page.tsx            # Main page with tab navigation
│   └── globals.css         # Global styles
├── components/
│   ├── ActivityTracker.tsx # Background activity monitoring
│   ├── Dashboard.tsx       # Main dashboard with stats
│   ├── TypingChallenge.tsx # Typing game component
│   ├── StatsOverview.tsx   # Detailed statistics
│   ├── GamificationPanel.tsx # Points, badges, achievements
│   ├── GoalsPanel.tsx      # Goal setting and tracking
│   └── HealthTips.tsx      # Health tips and reminders
├── store/
│   └── activityStore.ts    # Zustand store for state management
├── public/
│   └── logo.png            # Application logo
└── package.json
```

---

## 🎮 How It Works

1. **Activity Tracking** - Automatically tracks keyboard and mouse activity in the background
2. **Idle Detection** - Detects when you're inactive (30-second threshold)
3. **Calorie Estimation** - Calculates estimated calories burned based on keystrokes, mouse movements, and active time
4. **Health Score** - Combines multiple metrics into a single health score (0-100)
5. **Gamification** - Earn points, badges, and achievements as you improve
6. **Goals** - Set and track personal goals to stay motivated

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Toggle shortcuts help |
| `Ctrl/Cmd + Space` | Pause/Resume typing |
| `Ctrl/Cmd + R` | Reset challenge |
| `Ctrl/Cmd + S` | Stop & finish challenge |
| `Esc` | Close modals |

---

## 📊 Key Metrics

- **Active Time** - Time spent actively typing or using mouse
- **Idle Time** - Time spent inactive (no keyboard/mouse input)
- **Calories** - Estimated calories burned (rough calculation)
- **WPM** - Words per minute (from typing challenges)
- **Accuracy** - Typing accuracy percentage
- **Health Score** - Composite score (0-100) based on activity, speed, and accuracy

---

## 🎨 Design Philosophy

Keymo Web features a **minimalist design** with:

- Clean, monochrome color palette (black, white, gray)
- Generous whitespace for better readability
- Subtle borders instead of heavy shadows
- Light typography with proper spacing
- Smooth, subtle animations
- Focus on content over decoration

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Inspired by typing practice platforms like Monkeytype
- Built with modern web technologies for optimal performance
- Designed with user experience and health in mind

---

**Developed with for productivity and wellness**
