import React from 'react';
import { SolutionPlan } from '../types';
import {
  X,
  History,
  Trash2,
  Calendar,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: SolutionPlan[];
  onSelectPlan: (plan: SolutionPlan) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedPlans,
  onSelectPlan,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-xl max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Saved Action Plans
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {savedPlans.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No plans saved yet</p>
              <p className="text-xs mt-1">Generated plans are saved here automatically.</p>
            </div>
          ) : (
            savedPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => {
                  onSelectPlan(plan);
                  onClose();
                }}
                className="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {plan.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                      <span aria-hidden="true">·</span>
                      <span>{plan.actionSteps.length} tasks</span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {plan.problem}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {savedPlans.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">{savedPlans.length} plans stored</span>
            <button
              onClick={onClearHistory}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
