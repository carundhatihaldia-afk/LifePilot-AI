import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroInput } from './components/HeroInput';
import { PlanView } from './components/PlanView';
import { TaskPlanner } from './components/TaskPlanner';
import { Dashboard } from './components/Dashboard';
import { FollowUpChat } from './components/FollowUpChat';
import { HistoryModal } from './components/HistoryModal';
import {
  SolutionPlan,
  TaskItem,
  ChatMessage,
  CategoryType,
  ActionStep,
} from './types';
import {
  loadStoredTasks,
  saveStoredTasks,
  loadCurrentPlan,
  saveCurrentPlan,
  loadSavedPlans,
  loadChatMessages,
  saveChatMessages,
  loadTheme,
  saveTheme,
  clearAllData,
  DEFAULT_SAMPLE_TASKS,
} from './utils/storage';
import { Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'solver' | 'plan' | 'tasks' | 'dashboard'>('solver');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Study');
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadStoredTasks());
  const [currentPlan, setCurrentPlan] = useState<SolutionPlan | null>(() => loadCurrentPlan());
  const [savedPlans, setSavedPlans] = useState<SolutionPlan[]>(() => loadSavedPlans());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadChatMessages());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Sync theme to document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Sync tasks to localStorage
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  // Sync current plan to localStorage
  useEffect(() => {
    saveCurrentPlan(currentPlan);
    if (currentPlan) {
      setSavedPlans(loadSavedPlans());
    }
  }, [currentPlan]);

  // Sync chat messages to localStorage
  useEffect(() => {
    saveChatMessages(chatMessages);
  }, [chatMessages]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Submit problem to AI
  const handleSolveProblem = async (problem: string, category: CategoryType) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate solution');
      }

      setCurrentPlan(data);
      setChatMessages([]);
      setActiveTab('plan');
    } catch (err: any) {
      console.error('Error generating plan:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Follow-up consultation with Gemini
  const handleSendMessage = async (query: string) => {
    if (!currentPlan) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...chatMessages, userMessage];
    setChatMessages(newHistory);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: currentPlan.problem,
          category: currentPlan.category,
          plan: currentPlan,
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          question: query,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process follow-up.');
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
        suggestedTasks: data.suggestedTasks,
        updatedNextAction: data.updatedNextAction,
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Follow-up error:', err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Sorry, I encountered an issue: ${err.message || 'Could not connect to the assistant.'}`,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Add individual step to tasks
  const handleAddStepToTasks = (step: ActionStep, category: CategoryType) => {
    const existingIndex = tasks.findIndex(
      (t) => t.name.toLowerCase().trim() === step.name.toLowerCase().trim()
    );

    if (existingIndex >= 0) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      planId: currentPlan?.id,
      name: step.name,
      description: step.description,
      priority: step.priority,
      estimatedTime: step.estimatedTime,
      suggestedDeadline: step.suggestedDeadline,
      category,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  // Add all steps to tasks
  const handleAddAllStepsToTasks = (steps: ActionStep[], category: CategoryType) => {
    const existingNames = new Set(tasks.map((t) => t.name.toLowerCase().trim()));
    const newItems: TaskItem[] = [];

    steps.forEach((step, idx) => {
      if (!existingNames.has(step.name.toLowerCase().trim())) {
        newItems.push({
          id: `task-${Date.now()}-${idx}`,
          planId: currentPlan?.id,
          name: step.name,
          description: step.description,
          priority: step.priority,
          estimatedTime: step.estimatedTime,
          suggestedDeadline: step.suggestedDeadline,
          category,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }
    });

    if (newItems.length > 0) {
      setTasks((prev) => [...newItems, ...prev]);
    }
  };

  // Toggle task status
  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isComplete = t.status === 'completed';
          return {
            ...t,
            status: isComplete ? 'pending' : 'completed',
            completedAt: isComplete ? undefined : new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Add custom task
  const handleAddCustomTask = (task: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const newTask: TaskItem = {
      ...task,
      id: `task-custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => t.status !== 'completed'));
  };

  // Reset demo
  const handleResetDemo = () => {
    if (window.confirm('Reset application to sample demo state?')) {
      clearAllData();
      setTasks(DEFAULT_SAMPLE_TASKS);
      setCurrentPlan(null);
      setChatMessages([]);
      setActiveTab('solver');
    }
  };

  // Select historical plan
  const handleSelectPlan = (plan: SolutionPlan) => {
    setCurrentPlan(plan);
    setChatMessages([]);
    setActiveTab('plan');
  };

  const existingTaskNames = new Set(tasks.map((t) => t.name.toLowerCase().trim()));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tasks={tasks}
        currentPlan={currentPlan}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'solver' && (
          <HeroInput
            onSolveProblem={handleSolveProblem}
            isLoading={isLoading}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            error={error}
          />
        )}

        {activeTab === 'plan' && (
          <div className="space-y-8">
            {currentPlan ? (
              <>
                <PlanView
                  plan={currentPlan}
                  onAddStepToTasks={handleAddStepToTasks}
                  onAddAllStepsToTasks={handleAddAllStepsToTasks}
                  existingTaskNames={existingTaskNames}
                  onNavigateToTasks={() => setActiveTab('tasks')}
                />

                <FollowUpChat
                  plan={currentPlan}
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  isLoading={isChatLoading}
                  onApplySuggestedTasks={handleAddAllStepsToTasks}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                <Sparkles className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No Active Plan Yet
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
                  Describe an everyday problem in the solver to generate your personalized action plan.
                </p>
                <button
                  onClick={() => setActiveTab('solver')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xs transition-colors"
                >
                  <span>Go to Problem Solver</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <TaskPlanner
            tasks={tasks}
            onToggleTaskStatus={handleToggleTaskStatus}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddCustomTask}
            onClearCompleted={handleClearCompleted}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            onToggleTaskStatus={handleToggleTaskStatus}
            onNavigateToTasks={() => setActiveTab('tasks')}
            onNavigateToSolver={() => setActiveTab('solver')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">LifePilot AI</span>
            <span>·</span>
            <span>HackNowa Global Hackathon 2026</span>
            <span>·</span>
            <span>AI for Everyday Life</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedPlans={savedPlans}
        onSelectPlan={handleSelectPlan}
        onClearHistory={() => {
          localStorage.removeItem('lifepilot_saved_plans');
          setSavedPlans([]);
        }}
      />
    </div>
  );
}
