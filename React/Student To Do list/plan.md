# Student To-Do List Application

## 📋 Project Overview

A comprehensive task management application designed for students to track their progress, manage tasks with priorities, focus using a Pomodoro timer, and visualize their productivity through charts and streak tracking.

---

## 🎯 Core Features

### 1. Task Management (To-Do List)
- **Add Tasks**: Create new tasks with text description
- **Complete Tasks**: Mark tasks as completed with checkbox
- **Delete Tasks**: Remove tasks from the list
- **Edit Tasks**: Modify existing task text
- **Priority Levels**: 
  - 🔴 High (Red)
  - 🟡 Medium (Yellow)
  - 🟢 Low (Green)
- **Filter Tasks**: View all, active, or completed tasks
- **Clear Completed**: Remove all completed tasks at once

### 2. Pomodoro Timer
- **Work Sessions**: Customizable work duration (default: 25 min)
- **Short Break**: Customizable short break (default: 5 min)
- **Long Break**: Customizable long break (default: 15 min)
- **Session Counter**: Track completed work sessions
- **Auto-switch**: Automatically switch between work/break modes
- **Audio Notification**: Sound alert when timer completes
- **Timer Controls**: Start, Pause, Reset buttons
- **Visual Progress**: Circular progress indicator

### 3. Progress Visualization (Charts)
- **Weekly Bar Chart**: Tasks completed per day (last 7 days)
- **Monthly Line Chart**: Tasks completed over the month
- **Priority Distribution**: Pie chart showing task distribution by priority
- **Statistics Dashboard**:
  - Total tasks created
  - Total tasks completed
  - Completion rate percentage
  - Current streak days
  - Longest streak days

### 4. Activity Streak Calendar (GitHub-style Grid)
- **365-Day Grid**: Display last year of activity
- **Intensity Colors**: 
  - No activity: Gray
  - 1-2 tasks: Light green
  - 3-4 tasks: Medium green
  - 5+ tasks: Dark green
- **Hover Tooltip**: Show date and task count on hover
- **Current Streak**: Display consecutive days with completed tasks
- **Longest Streak**: Track personal best streak

### 5. Theme Toggle
- **Dark Mode**: Dark background with light text
- **Light Mode**: Light background with dark text
- **Persistent**: Remember user's theme preference

---

## 🏗️ Technical Architecture

### Frontend (React + Vite)
```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── TodoList/
│   │   │   ├── TodoList.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   ├── AddTodo.jsx
│   │   │   └── TodoFilters.jsx
│   │   ├── Timer/
│   │   │   ├── PomodoroTimer.jsx
│   │   │   ├── TimerControls.jsx
│   │   │   └── TimerSettings.jsx
│   │   └── Stats/
│   │       ├── ProgressChart.jsx
│   │       ├── StreakCalendar.jsx
│   │       └── StatsCards.jsx
│   ├── hooks/
│   │   ├── useTimer.js
│   │   └── useApi.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── variables.css
│   │   ├── components.css
│   │   └── themes.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

### Backend (FastAPI + SQLite)
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── todo.py
│   │   ├── streak.py
│   │   └── settings.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── todo.py
│   │   ├── streak.py
│   │   └── settings.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── todos.py
│   │   ├── stats.py
│   │   └── settings.py
│   └── services/
│       ├── __init__.py
│       └── streak_service.py
├── requirements.txt
└── run.py
```

---

## 🗄️ Database Schema (SQLite)

### Tables

#### todos
| Column       | Type      | Description                    |
|--------------|-----------|--------------------------------|
| id           | INTEGER   | Primary key, auto-increment    |
| text         | TEXT      | Task description               |
| completed    | BOOLEAN   | Task completion status         |
| priority     | TEXT      | 'high', 'medium', 'low'        |
| created_at   | DATETIME  | Task creation timestamp        |
| completed_at | DATETIME  | Task completion timestamp      |

#### daily_stats
| Column          | Type     | Description                    |
|-----------------|----------|--------------------------------|
| id              | INTEGER  | Primary key, auto-increment    |
| date            | DATE     | Unique date                    |
| tasks_completed | INTEGER  | Number of tasks completed      |
| tasks_created   | INTEGER  | Number of tasks created        |

#### user_settings
| Column              | Type    | Description                    |
|---------------------|---------|--------------------------------|
| id                  | INTEGER | Primary key                    |
| work_duration       | INTEGER | Work session minutes           |
| short_break         | INTEGER | Short break minutes            |
| long_break          | INTEGER | Long break minutes             |
| theme               | TEXT    | 'dark' or 'light'              |
| current_streak      | INTEGER | Current consecutive days       |
| longest_streak      | INTEGER | Best streak record             |

---

## 🔌 API Endpoints

### Todos
| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | /api/todos         | Get all todos            |
| POST   | /api/todos         | Create a new todo        |
| PUT    | /api/todos/{id}    | Update a todo            |
| DELETE | /api/todos/{id}    | Delete a todo            |
| PATCH  | /api/todos/{id}/toggle | Toggle todo completion |
| DELETE | /api/todos/completed | Clear all completed     |

### Stats
| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| GET    | /api/stats            | Get overall statistics     |
| GET    | /api/stats/weekly     | Get weekly chart data      |
| GET    | /api/stats/monthly    | Get monthly chart data     |
| GET    | /api/stats/streaks    | Get streak calendar data   |

### Settings
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /api/settings    | Get user settings        |
| PUT    | /api/settings    | Update user settings     |

---

## 🎨 UI/UX Design

### Color Scheme

#### Dark Theme
- Background: #1a1a2e
- Card Background: #16213e
- Primary: #0f3460
- Accent: #e94560
- Text: #eaeaea
- Text Muted: #a0a0a0

#### Light Theme
- Background: #f5f5f5
- Card Background: #ffffff
- Primary: #2196f3
- Accent: #ff4081
- Text: #212121
- Text Muted: #757575

#### Priority Colors
- High: #ef4444 (Red)
- Medium: #f59e0b (Yellow/Amber)
- Low: #22c55e (Green)

#### Streak Grid Colors
- Level 0: #161b22 (dark) / #ebedf0 (light)
- Level 1: #0e4429 (dark) / #9be9a8 (light)
- Level 2: #006d32 (dark) / #40c463 (light)
- Level 3: #26a641 (dark) / #30a14e (light)
- Level 4: #39d353 (dark) / #216e39 (light)

---

## 📦 Dependencies

### Frontend
```json
{
  "dependencies": {
    "react": "^19.x",
    "react-dom": "^19.x",
    "recharts": "^2.x",
    "date-fns": "^3.x",
    "react-icons": "^5.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.x",
    "vite": "^7.x"
  }
}
```

### Backend
```
fastapi==0.109.0
uvicorn==0.27.0
sqlalchemy==2.0.25
pydantic==2.5.3
python-dotenv==1.0.0
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### Installation

#### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Running the Application
1. Start backend server: `http://localhost:8000`
2. Start frontend dev server: `http://localhost:5173`
3. API documentation: `http://localhost:8000/docs`

---

## 📝 User Stories

1. **As a student**, I want to add tasks with different priority levels so I can focus on what's important.
2. **As a student**, I want to use a Pomodoro timer so I can study in focused intervals.
3. **As a student**, I want to see my progress in charts so I can track my productivity.
4. **As a student**, I want to see a streak calendar so I can maintain daily study habits.
5. **As a student**, I want to toggle between dark and light themes for comfortable viewing.
6. **As a student**, I want to customize timer durations to match my study preferences.

---

## ✅ Acceptance Criteria

- [ ] User can add, edit, delete, and complete tasks
- [ ] Tasks can be assigned high, medium, or low priority
- [ ] Pomodoro timer works with customizable durations
- [ ] Progress charts display weekly and monthly data
- [ ] Streak calendar shows 365 days of activity
- [ ] Theme toggle persists user preference
- [ ] All data persists in SQLite database
- [ ] API handles all CRUD operations
- [ ] Responsive design works on mobile and desktop

---

## 🔮 Future Enhancements

- User authentication (multiple users)
- Task categories/tags
- Due dates and reminders
- Export data to CSV
- Sync across devices
- Mobile app (React Native)
- Task sharing/collaboration
