import { SolutionPlan, TaskItem, ChatMessage, CategoryType } from '../types';

const STORAGE_KEYS = {
  CURRENT_PLAN: 'lifepilot_current_plan',
  TASKS: 'lifepilot_tasks',
  CHAT_MESSAGES: 'lifepilot_chat_messages',
  SAVED_PLANS: 'lifepilot_saved_plans',
  THEME: 'lifepilot_theme',
  SELECTED_CATEGORY: 'lifepilot_selected_category',
};

// Default starter tasks to illustrate instant value if first visit
export const DEFAULT_SAMPLE_TASKS: TaskItem[] = [
  {
    id: 'sample-task-1',
    name: 'Review syllabus and mark key exam weightages',
    description: 'Pinpoint which modules contribute to 60%+ of the test marks.',
    priority: 'High',
    estimatedTime: '20 mins',
    suggestedDeadline: 'Today',
    category: 'Study',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'sample-task-2',
    name: 'Create a 10-day active recall study schedule',
    description: 'Allocate 2-hour daily slots focusing strictly on past papers.',
    priority: 'High',
    estimatedTime: '30 mins',
    suggestedDeadline: 'Today',
    category: 'Study',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'sample-task-3',
    name: 'Audit bank statement & list top 3 unnecessary recurring expenses',
    description: 'Find subscriptions or habits that can be canceled immediately.',
    priority: 'Medium',
    estimatedTime: '15 mins',
    suggestedDeadline: 'Tomorrow',
    category: 'Finance',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'sample-task-4',
    name: 'Draft neighborhood flyer for weekend cleanliness drive',
    description: 'Include gathering time (8 AM), equipment checklist, and disposal map.',
    priority: 'Medium',
    estimatedTime: '25 mins',
    suggestedDeadline: 'In 2 days',
    category: 'Community',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export const loadStoredTasks = (): TaskItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return DEFAULT_SAMPLE_TASKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_SAMPLE_TASKS;
  } catch (e) {
    console.error('Failed to load tasks from localStorage', e);
    return DEFAULT_SAMPLE_TASKS;
  }
};

export const saveStoredTasks = (tasks: TaskItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage', e);
  }
};

export const loadCurrentPlan = (): SolutionPlan | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to load current plan', e);
    return null;
  }
};

export const saveCurrentPlan = (plan: SolutionPlan | null) => {
  try {
    if (plan) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, JSON.stringify(plan));
      // Also update saved plans history
      const saved = loadSavedPlans();
      const exists = saved.some((p) => p.id === plan.id);
      if (!exists) {
        const updated = [plan, ...saved].slice(0, 15);
        localStorage.setItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(updated));
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
    }
  } catch (e) {
    console.error('Failed to save current plan', e);
  }
};

export const loadSavedPlans = (): SolutionPlan[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_PLANS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load saved plans', e);
    return [];
  }
};

export const loadChatMessages = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load chat messages', e);
    return [];
  }
};

export const saveChatMessages = (messages: ChatMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save chat messages', e);
  }
};

export const loadTheme = (): 'light' | 'dark' => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
};

export const saveTheme = (theme: 'light' | 'dark') => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {}
};

export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.SAVED_PLANS);
  } catch (e) {
    console.error('Failed to clear data', e);
  }
};
