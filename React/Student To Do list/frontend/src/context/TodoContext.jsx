import { createContext, useContext, useReducer, useEffect } from 'react';
import { format, startOfDay } from 'date-fns';

const TodoContext = createContext();

// Initial state
const initialState = {
  todos: [],
  completedDates: {}, // { '2026-01-11': 3 } - date: count of completed tasks
  timerSettings: {
    workDuration: 25, // minutes
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  },
  theme: 'dark',
  stats: {
    totalCompleted: 0,
    totalCreated: 0,
    currentStreak: 0,
    longestStreak: 0,
  },
};

// Load state from localStorage
const loadState = () => {
  try {
    const savedState = localStorage.getItem('studentTodoState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return initialState;
};

// Save state to localStorage
const saveState = (state) => {
  try {
    localStorage.setItem('studentTodoState', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

// Action types
const ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  EDIT_TODO: 'EDIT_TODO',
  SET_PRIORITY: 'SET_PRIORITY',
  UPDATE_TIMER_SETTINGS: 'UPDATE_TIMER_SETTINGS',
  TOGGLE_THEME: 'TOGGLE_THEME',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
};

// Calculate streak from completedDates
const calculateStreak = (completedDates) => {
  const today = startOfDay(new Date());
  let currentStreak = 0;
  let checkDate = today;

  while (true) {
    const dateKey = format(checkDate, 'yyyy-MM-dd');
    if (completedDates[dateKey] && completedDates[dateKey] > 0) {
      currentStreak++;
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return currentStreak;
};

// Reducer
const todoReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case ACTIONS.ADD_TODO: {
      const newTodo = {
        id: Date.now(),
        text: action.payload.text,
        completed: false,
        priority: action.payload.priority || 'medium',
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      newState = {
        ...state,
        todos: [newTodo, ...state.todos],
        stats: {
          ...state.stats,
          totalCreated: state.stats.totalCreated + 1,
        },
      };
      break;
    }

    case ACTIONS.TOGGLE_TODO: {
      const todoIndex = state.todos.findIndex((t) => t.id === action.payload.id);
      if (todoIndex === -1) return state;

      const todo = state.todos[todoIndex];
      const isCompleting = !todo.completed;
      const today = format(new Date(), 'yyyy-MM-dd');

      const updatedTodos = [...state.todos];
      updatedTodos[todoIndex] = {
        ...todo,
        completed: isCompleting,
        completedAt: isCompleting ? new Date().toISOString() : null,
      };

      const newCompletedDates = { ...state.completedDates };
      if (isCompleting) {
        newCompletedDates[today] = (newCompletedDates[today] || 0) + 1;
      } else {
        newCompletedDates[today] = Math.max((newCompletedDates[today] || 0) - 1, 0);
      }

      const currentStreak = calculateStreak(newCompletedDates);

      newState = {
        ...state,
        todos: updatedTodos,
        completedDates: newCompletedDates,
        stats: {
          ...state.stats,
          totalCompleted: isCompleting
            ? state.stats.totalCompleted + 1
            : state.stats.totalCompleted - 1,
          currentStreak,
          longestStreak: Math.max(state.stats.longestStreak, currentStreak),
        },
      };
      break;
    }

    case ACTIONS.DELETE_TODO: {
      newState = {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload.id),
      };
      break;
    }

    case ACTIONS.EDIT_TODO: {
      newState = {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, text: action.payload.text } : t
        ),
      };
      break;
    }

    case ACTIONS.SET_PRIORITY: {
      newState = {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, priority: action.payload.priority } : t
        ),
      };
      break;
    }

    case ACTIONS.UPDATE_TIMER_SETTINGS: {
      newState = {
        ...state,
        timerSettings: {
          ...state.timerSettings,
          ...action.payload,
        },
      };
      break;
    }

    case ACTIONS.TOGGLE_THEME: {
      newState = {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark',
      };
      break;
    }

    case ACTIONS.CLEAR_COMPLETED: {
      newState = {
        ...state,
        todos: state.todos.filter((t) => !t.completed),
      };
      break;
    }

    default:
      return state;
  }

  saveState(newState);
  return newState;
};

// Provider component
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, null, loadState);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Actions
  const addTodo = (text, priority = 'medium') => {
    if (text.trim()) {
      dispatch({ type: ACTIONS.ADD_TODO, payload: { text: text.trim(), priority } });
    }
  };

  const toggleTodo = (id) => {
    dispatch({ type: ACTIONS.TOGGLE_TODO, payload: { id } });
  };

  const deleteTodo = (id) => {
    dispatch({ type: ACTIONS.DELETE_TODO, payload: { id } });
  };

  const editTodo = (id, text) => {
    dispatch({ type: ACTIONS.EDIT_TODO, payload: { id, text } });
  };

  const setPriority = (id, priority) => {
    dispatch({ type: ACTIONS.SET_PRIORITY, payload: { id, priority } });
  };

  const updateTimerSettings = (settings) => {
    dispatch({ type: ACTIONS.UPDATE_TIMER_SETTINGS, payload: settings });
  };

  const toggleTheme = () => {
    dispatch({ type: ACTIONS.TOGGLE_THEME });
  };

  const clearCompleted = () => {
    dispatch({ type: ACTIONS.CLEAR_COMPLETED });
  };

  const value = {
    todos: state.todos,
    completedDates: state.completedDates,
    timerSettings: state.timerSettings,
    theme: state.theme,
    stats: state.stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setPriority,
    updateTimerSettings,
    toggleTheme,
    clearCompleted,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

// Custom hook to use the context
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext;
