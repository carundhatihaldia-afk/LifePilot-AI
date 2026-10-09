import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Briefcase,
  User,
  DollarSign,
  HeartPulse,
  Home,
  Users,
  Layers,
  HelpCircle,
  Loader2,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { CategoryType } from '../types';

interface HeroInputProps {
  onSolveProblem: (problem: string, category: CategoryType) => Promise<void>;
  isLoading: boolean;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  error: string | null;
}

const CATEGORIES: { label: CategoryType; icon: React.FC<{ className?: string }> }[] = [
  { label: 'Study', icon: GraduationCap },
  { label: 'Work', icon: Briefcase },
  { label: 'Personal', icon: User },
  { label: 'Finance', icon: DollarSign },
  { label: 'Health & Fitness', icon: HeartPulse },
  { label: 'Household', icon: Home },
  { label: 'Community', icon: Users },
  { label: 'Other', icon: Layers },
];

const QUICK_EXAMPLES: { text: string; category: CategoryType; tag: string }[] = [
  {
    text: "I have an exam in 10 days and don't know how to organize my study.",
    category: 'Study',
    tag: 'Exam Prep',
  },
  {
    text: 'I have many household tasks and keep forgetting them.',
    category: 'Household',
    tag: 'Home Chores',
  },
  {
    text: 'I need to plan my monthly expenses and cut down impulsive spending.',
    category: 'Finance',
    tag: 'Budgeting',
  },
  {
    text: 'I have a busy day tomorrow and need to organize everything without burning out.',
    category: 'Personal',
    tag: 'Daily Schedule',
  },
  {
    text: 'I need to prepare for an important job interview in 4 days.',
    category: 'Work',
    tag: 'Interview Prep',
  },
  {
    text: 'Our community needs to organize a cleanliness and tree-planting drive this weekend.',
    category: 'Community',
    tag: 'Community Drive',
  },
  {
    text: "I have several conflicting tasks and don't know which one to do first.",
    category: 'Personal',
    tag: 'Prioritization',
  },
];

const LOADING_MESSAGES = [
  'Understanding your situation and core friction points...',
  'Extracting the top high-leverage priorities...',
  'Structuring step-by-step action items and timeline...',
  'Pinpointing obstacles, pro tips, and immediate next micro-action...',
];

export const HeroInput: React.FC<HeroInputProps> = ({
  onSolveProblem,
  isLoading,
  selectedCategory,
  setSelectedCategory,
  error,
}) => {
  const [problemText, setProblemText] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim() || isLoading) return;
    onSolveProblem(problemText, selectedCategory);
  };

  const handleSelectExample = (example: typeof QUICK_EXAMPLES[0]) => {
    setProblemText(example.text);
    setSelectedCategory(example.category);
  };

  return (
    <div className="py-6 sm:py-10">
      {/* Hackathon Badge & Hero Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>HackNowa Global Hackathon 2026 · AI for Everyday Life</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Turn Daily Overwhelm Into a <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Clear Action Plan</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Describe any practical problem or responsibility in natural language. LifePilot AI analyzes the situation, extracts the top priorities, and outputs a concrete step-by-step game plan you can track to completion.
        </p>
      </div>

      {/* Main Solver Card */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-7">
        <form onSubmit={handleSubmit}>
          {/* Category Selector Tabs */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Select Everyday Category
              </span>
              <span className="text-xs text-slate-400">Helps AI tailor the action strategy</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map(({ label, icon: Icon }) => {
                const isSelected = selectedCategory === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedCategory(label)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left border ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem Input Box */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="problem-input" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Describe Your Problem Or Responsibility
              </label>
              <span className="text-xs text-slate-400">
                {problemText.length > 0 ? `${problemText.length} chars` : 'Natural plain English'}
              </span>
            </div>

            <div className="relative">
              <textarea
                id="problem-input"
                rows={4}
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="Example: I have an exam in 10 days and don't know how to organize my study, or our community needs to organize a cleanliness drive this weekend..."
                className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y min-h-[110px]"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <p className="font-semibold">Unable to generate plan</p>
                <p className="mt-0.5 opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="mb-5 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    AI Strategic Reasoning in Progress
                  </p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5 animate-pulse">
                    {LOADING_MESSAGES[loadingStep]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Direct solution without generic motivational fluff</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !problemText.trim()}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                !problemText.trim() || isLoading
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-200 dark:shadow-none hover:shadow-md cursor-pointer'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Solving Your Problem...</span>
                </>
              ) : (
                <>
                  <span>Solve My Problem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Help / Clickable Examples */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Quick Help: Try Common Everyday Scenarios
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_EXAMPLES.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectExample(example)}
                className="text-left text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg border border-slate-200/80 dark:border-slate-700/80 transition-all flex items-center gap-2"
              >
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {example.tag}:
                </span>
                <span className="truncate max-w-[240px] sm:max-w-[320px]">{example.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
