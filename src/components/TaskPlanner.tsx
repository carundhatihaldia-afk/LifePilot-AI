import React, { useState } from 'react';
import {
  TaskItem,
  PriorityType,
  CategoryType,
  TaskStatus,
} from '../types';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Trash2,
  Plus,
  Filter,
  CheckCheck,
  Sparkles,
  ArrowUpDown,
  Tag,
  AlertCircle,
} from 'lucide-react';

interface TaskPlannerProps {
  tasks: TaskItem[];
  onToggleTaskStatus: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  onClearCompleted: () => void;
}

const CATEGORIES: CategoryType[] = [
  'Study',
  'Work',
  'Personal',
  'Finance',
  'Health & Fitness',
  'Household',
  'Community',
  'Other',
];

export const TaskPlanner: React.FC<TaskPlannerProps> = ({
  tasks,
  onToggleTaskStatus,
  onDeleteTask,
  onAddTask,
  onClearCompleted,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'high'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New task form state
  const [newName, setNewName] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityType>('Medium');
  const [newEstimatedTime, setNewEstimatedTime] = useState('30 mins');
  const [newDeadline, setNewDeadline] = useState('Today');
  const [newCategory, setNewCategory] = useState<CategoryType>('Personal');

  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (filterStatus === 'pending' && task.status === 'completed') return false;
    if (filterStatus === 'completed' && task.status !== 'completed') return false;
    if (filterStatus === 'high' && task.priority !== 'High') return false;

    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddTask({
      name: newName.trim(),
      priority: newPriority,
      estimatedTime: newEstimatedTime || '30 mins',
      suggestedDeadline: newDeadline || 'Today',
      category: newCategory,
      status: 'pending',
    });

    setNewName('');
    setIsAdding(false);
  };

  const getPriorityBadgeClass = (priority: PriorityType) => {
    switch (priority) {
      case 'High':
        return 'text-rose-600 dark:text-rose-400 font-semibold';
      case 'Medium':
        return 'text-amber-600 dark:text-amber-400 font-medium';
      case 'Low':
      default:
        return 'text-blue-600 dark:text-blue-400 font-medium';
    }
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = tasks.filter((t) => t.status !== 'completed').length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Smart Task Planner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Turn your strategic plan into daily progress · {pendingCount} pending, {completedCount} completed
          </p>
        </div>

        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Clear Completed
            </button>
          )}

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Add Task Quick Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-indigo-200 dark:border-indigo-900 space-y-3"
        >
          <div className="font-semibold text-xs text-indigo-700 dark:text-indigo-300">
            Create Custom Action Item
          </div>

          <div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="What needs to be done? (e.g. Schedule meeting with study partner)"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as PriorityType)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Est. Time</label>
              <input
                type="text"
                value={newEstimatedTime}
                onChange={(e) => setNewEstimatedTime(e.target.value)}
                placeholder="e.g. 20 mins"
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Deadline</label>
              <input
                type="text"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                placeholder="e.g. Today"
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 mb-4">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === 'completed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilterStatus('high')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === 'high'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            High Priority
          </button>
        </div>

        {/* Category selector filter */}
        <div className="flex items-center gap-2 text-xs">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <CheckCheck className="w-8 h-8 mx-auto mb-2 opacity-50 text-indigo-400" />
            <p className="text-sm font-medium">No tasks found matching your filter</p>
            <p className="text-xs mt-1">
              Add tasks above or generate an action plan from the Problem Solver.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            return (
              <div
                key={task.id}
                className={`group flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-50/60 dark:bg-slate-800/20 border-slate-200/60 dark:border-slate-800 opacity-75'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  {/* Completion Checkbox */}
                  <button
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none shrink-0"
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold tracking-tight transition-all ${
                        isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.name}
                    </p>

                    {task.description && (
                      <p
                        className={`text-xs mt-0.5 ${
                          isCompleted
                            ? 'text-slate-400 dark:text-slate-500'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Metadata line (no static pill capsules, clean typographic separators) */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span className={getPriorityBadgeClass(task.priority)}>
                        {task.priority} Priority
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{task.estimatedTime}</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{task.suggestedDeadline}</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-sans">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onDeleteTask(task.id)}
                  title="Delete task"
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
