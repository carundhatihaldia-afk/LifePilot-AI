import React, { useState } from 'react';
import {
  SolutionPlan,
  ActionStep,
  TaskItem,
  CategoryType,
} from '../types';
import {
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Zap,
  ArrowRight,
  ListPlus,
  Copy,
  Check,
  Share2,
  BookmarkPlus,
  Sparkles,
} from 'lucide-react';

interface PlanViewProps {
  plan: SolutionPlan;
  onAddStepToTasks: (step: ActionStep, category: CategoryType) => void;
  onAddAllStepsToTasks: (steps: ActionStep[], category: CategoryType) => void;
  existingTaskNames: Set<string>;
  onNavigateToTasks: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  plan,
  onAddStepToTasks,
  onAddAllStepsToTasks,
  existingTaskNames,
  onNavigateToTasks,
}) => {
  const [copied, setCopied] = useState(false);

  const allAdded = plan.actionSteps.every((step) =>
    existingTaskNames.has(step.name.toLowerCase().trim())
  );

  const handleCopyPlan = () => {
    const formatted = `### LifePilot AI Action Plan: ${plan.problem}
Category: ${plan.category}
Generated: ${new Date(plan.createdAt).toLocaleDateString()}

#### Problem Understanding
${plan.problemUnderstanding}

#### Key Priorities
${plan.keyPriorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

#### Immediate Next Micro-Action (Do this in 3-5 mins)
${plan.simpleNextAction}

#### Step-by-Step Action Plan
${plan.actionSteps
  .map(
    (s, i) =>
      `Step ${i + 1}: ${s.name} [${s.priority} Priority · ${s.estimatedTime} · Deadline: ${s.suggestedDeadline}]\n${s.description}`
  )
  .join('\n\n')}

#### Suggested Timeline
${plan.suggestedTimeline}

#### Pro Tips
${plan.usefulTips.map((t) => `- ${t}`).join('\n')}

#### Potential Obstacles & Solutions
${plan.potentialObstacles
  .map((o) => `* Obstacle: ${o.obstacle}\n  Solution: ${o.solution}`)
  .join('\n\n')}
`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getPriorityBadgeClass = (priority: string) => {
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

  return (
    <div className="space-y-6">
      {/* Top Banner / Problem Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{plan.category}</span>
              <span aria-hidden="true">·</span>
              <span>Generated {new Date(plan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span aria-hidden="true">·</span>
              <span>{plan.actionSteps.length} Action Steps</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              "{plan.problem}"
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyPlan}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Plan Copied!' : 'Copy Plan'}</span>
            </button>

            <button
              onClick={() => onAddAllStepsToTasks(plan.actionSteps, plan.category)}
              disabled={allAdded}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                allAdded
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-200 dark:shadow-none cursor-pointer'
              }`}
            >
              {allAdded ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>All Added to Tasks</span>
                </>
              ) : (
                <>
                  <ListPlus className="w-3.5 h-3.5" />
                  <span>Convert Plan to Tasks</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Diagnostic Problem Understanding */}
        <div className="pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            AI Diagnosis & Situation Breakdown
          </h3>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
            {plan.problemUnderstanding}
          </p>
        </div>
      </div>

      {/* Simple Next Action (Break Inertia) - High Priority Visual Anchor */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-indigo-800/50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 text-amber-400">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Immediate Micro-Action · Break Inertia Now
              </span>
              <span className="text-[11px] font-mono text-emerald-400">3-5 mins</span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-white mt-1 leading-snug">
              {plan.simpleNextAction}
            </p>
            <p className="text-xs text-indigo-200/80 mt-2">
              Start with this micro-step right away. Taking physical action dissolves resistance faster than overthinking.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Key Priorities & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Priorities */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Key Strategic Priorities
            </h3>
          </div>
          <ul className="space-y-2.5">
            {plan.keyPriorities.map((priority, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium">{priority}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Suggested Timeline
            </h3>
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-line leading-relaxed">
            {plan.suggestedTimeline}
          </div>
        </div>
      </div>

      {/* Step-by-Step Action Plan */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Step-by-Step Action Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Concrete sequential tasks with estimated execution times and deadlines
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddAllStepsToTasks(plan.actionSteps, plan.category)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Add All to Task Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-3.5">
          {plan.actionSteps.map((step, index) => {
            const isAdded = existingTaskNames.has(step.name.toLowerCase().trim());
            return (
              <div
                key={step.id || index}
                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                        {step.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Metadata row without static pill boxes */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        <span className={getPriorityBadgeClass(step.priority)}>
                          {step.priority} Priority
                        </span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{step.estimatedTime}</span>
                        </span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{step.suggestedDeadline}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => onAddStepToTasks(step, plan.category)}
                      disabled={isAdded}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isAdded
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 cursor-default'
                          : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 cursor-pointer'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3 h-3" />
                          <span>+ Add Task</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Pro Tips & Potential Obstacles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pro Tips */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Useful Practical Tips
            </h3>
          </div>
          <ul className="space-y-2.5">
            {plan.usefulTips.map((tip, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 leading-relaxed"
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Potential Obstacles & Solutions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Potential Obstacles & Countermeasures
            </h3>
          </div>
          <div className="space-y-3">
            {plan.potentialObstacles.map((item, idx) => (
              <div
                key={idx}
                className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60"
              >
                <p className="font-semibold text-rose-600 dark:text-rose-400">
                  Obstacle: {item.obstacle}
                </p>
                <p className="text-slate-700 dark:text-slate-300 mt-1">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Countermeasure: </span>
                  {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
