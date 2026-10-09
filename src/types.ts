export type CategoryType =
  | 'Study'
  | 'Work'
  | 'Personal'
  | 'Finance'
  | 'Health & Fitness'
  | 'Household'
  | 'Community'
  | 'Other';

export type PriorityType = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface ActionStep {
  id: string;
  name: string;
  description: string;
  priority: PriorityType;
  estimatedTime: string;
  suggestedDeadline: string;
}

export interface PotentialObstacle {
  obstacle: string;
  solution: string;
}

export interface SolutionPlan {
  id: string;
  problem: string;
  category: CategoryType;
  createdAt: string;
  problemUnderstanding: string;
  keyPriorities: string[];
  actionSteps: ActionStep[];
  suggestedTimeline: string;
  usefulTips: string[];
  potentialObstacles: PotentialObstacle[];
  simpleNextAction: string;
  summary: string;
}

export interface TaskItem {
  id: string;
  planId?: string;
  name: string;
  description?: string;
  priority: PriorityType;
  estimatedTime: string;
  suggestedDeadline: string;
  category: CategoryType;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedTasks?: ActionStep[];
  updatedNextAction?: string;
}

export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  progressPercentage: number;
}
