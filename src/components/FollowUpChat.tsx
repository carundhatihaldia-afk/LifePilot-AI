import React, { useState } from 'react';
import {
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ListPlus,
  Zap,
} from 'lucide-react';
import { ChatMessage, SolutionPlan, ActionStep, CategoryType } from '../types';

interface FollowUpChatProps {
  plan: SolutionPlan;
  messages: ChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  isLoading: boolean;
  onApplySuggestedTasks?: (tasks: ActionStep[], category: CategoryType) => void;
}

const QUICK_PROMPTS = [
  'Make this plan easier.',
  'Reduce this to 3 steps.',
  'Give me a one-day version.',
  'What should I do first?',
  'I completed the first task. What next?',
];

export const FollowUpChat: React.FC<FollowUpChatProps> = ({
  plan,
  messages,
  onSendMessage,
  isLoading,
  onApplySuggestedTasks,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const query = input;
    setInput('');
    onSendMessage(query);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI Plan Assistant & Follow-Up
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Refine your plan, adjust difficulty, or ask questions with full context
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
          Quick Refinements
        </span>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickPrompt(prompt)}
              className="text-xs bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Message History */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 mb-4">
        {messages.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            Have questions or want a shorter breakdown? Pick a prompt above or type your question below.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                  {msg.content}
                </div>

                {/* If assistant suggested revised tasks */}
                {msg.suggestedTasks && msg.suggestedTasks.length > 0 && onApplySuggestedTasks && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        Revised Action Steps ({msg.suggestedTasks.length})
                      </span>
                      <button
                        onClick={() => onApplySuggestedTasks(msg.suggestedTasks!, plan.category)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <ListPlus className="w-3 h-3" />
                        <span>Update My Task Planner</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {msg.suggestedTasks.map((t, idx) => (
                        <div
                          key={idx}
                          className="text-xs p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                        >
                          <span className="font-medium text-slate-900 dark:text-white truncate">
                            {idx + 1}. {t.name}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 shrink-0">
                            {t.estimatedTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.updatedNextAction && (
                  <div className="mt-2.5 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      <strong>Next step: </strong>
                      {msg.updatedNextAction}
                    </span>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 text-sm items-center text-slate-500 dark:text-slate-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span className="text-xs">LifePilot AI is formulating an answer...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up (e.g. 'Can I do this in 2 days?' or 'What if I hit a roadblock?')..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};
