import React from 'react';
import {
  TaskItem,
  CategoryType,
} from '../types';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ListTodo,
  ShieldAlert,
  Flame,
  Zap,
} from 'lucide-react';

interface DashboardProps {
  tasks: TaskItem[];
  onToggleTaskStatus: (taskId: string) => void;
  onNavigateToTasks: () => void;
  onNavigateToSolver: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  onToggleTaskStatus,
  onNavigateToTasks,
  onNavigateToSolver,
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(
    (t) => t.priority === 'High' && t.status !== 'completed'
  ).length;

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Next up high priority task
  const nextTask = tasks.find(
    (t) => t.status !== 'completed' && t.priority === 'High'
  ) || tasks.find((t) => t.status !== 'completed');

  // Breakdown by category
  const categoryCounts: Record<string, { total: number; completed: number }> = {};
  tasks.forEach((t) => {
    if (!categoryCounts[t.category]) {
      categoryCounts[t.category] = { total: 0, completed: 0 };
    }
    categoryCounts[t.category].total += 1;
    if (t.status === 'completed') {
      categoryCounts[t.category].completed += 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
            <ListTodo className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalTasks}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across all categories</p>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {pendingTasks}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Requires your focus</p>
        </div>

        {/* High Priority Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">High Priority</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {highPriorityTasks}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Critical high leverage</p>
        </div>

        {/* Completed & Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Progress</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {progressPercent}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Row: Next Up Task & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Up Focus Spotlight (2 cols on large) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Next Priority Action Item
                </h3>
              </div>
              <button
                onClick={onNavigateToTasks}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1"
              >
                <span>View All Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nextTask ? (
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 dark:bg-indigo-950/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {nextTask.priority} Priority
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{nextTask.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Est. {nextTask.estimatedTime}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {nextTask.name}
                    </h4>
                    {nextTask.description && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {nextTask.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleTaskStatus(nextTask.id)}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Now</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  All tasks completed! Fantastic job!
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Have another problem or challenge? LifePilot AI is ready to help.
                </p>
                <button
                  onClick={onNavigateToSolver}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Solve Another Problem</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Life Momentum tip */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Momentum rule: Completing one small task cuts cognitive friction by 50%.</span>
            </span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
              {completedTasks}/{totalTasks} Done
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Category Breakdown
          </h3>

          <div className="space-y-3">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-xs text-slate-400">No categorized tasks yet.</p>
            ) : (
              Object.entries(categoryCounts).map(([cat, counts]) => {
                const percent = Math.round((counts.completed / counts.total) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {cat}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {counts.completed}/{counts.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
