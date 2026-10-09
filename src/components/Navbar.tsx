import React from 'react';
import {
  Compass,
  CheckCircle2,
  LayoutDashboard,
  Sparkles,
  Sun,
  Moon,
  RotateCcw,
  BookOpenCheck,
  History,
} from 'lucide-react';
import { TaskItem, SolutionPlan } from '../types';

interface NavbarProps {
  activeTab: 'solver' | 'plan' | 'tasks' | 'dashboard';
  setActiveTab: (tab: 'solver' | 'plan' | 'tasks' | 'dashboard') => void;
  tasks: TaskItem[];
  currentPlan: SolutionPlan | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  tasks,
  currentPlan,
  theme,
  onToggleTheme,
  onOpenHistory,
  onResetDemo,
}) => {
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('solver')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                    LifePilot<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 hidden sm:inline">
                    · HackNowa 2026
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Everyday Life Problem Solver
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('solver')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'solver'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solve Problem</span>
            </button>

            <button
              onClick={() => setActiveTab('plan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all relative ${
                activeTab === 'plan'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>Action Plan</span>
              {currentPlan && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'tasks'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tasks</span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                ({tasks.filter((t) => t.status !== 'completed').length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                {progressPercent}%
              </span>
            </button>
          </nav>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              title="Saved Plans History"
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
            >
              <History className="w-4 h-4" />
              <span className="hidden md:inline">History</span>
            </button>

            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onResetDemo}
              title="Reset sample data"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
