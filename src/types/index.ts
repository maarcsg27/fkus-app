export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'completed' | 'cancelled';

export type RecurrenceType = 
  | 'none'
  | 'daily'
  | 'weekdays'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'yearly'
  | 'custom';

export interface RecurrenceConfig {
  type: RecurrenceType;
  interval?: number; // e.g., every 2 weeks
  daysOfWeek?: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  dayOfMonth?: number; // 1-31
  endDate?: string; // YYYY-MM-DD
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind / Hex color
  isCustom?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  durationMinutes?: number;
  categoryId: string;
  priority: Priority;
  status: TaskStatus;
  recurrence?: RecurrenceConfig;
  reminderMinutesBefore?: number; // e.g., 15, 30, 60, 1440 (1 day)
  goalId?: string;
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
}

export interface RoutineStep {
  id: string;
  title: string;
  timeOffsetMinutes?: number; // Offset from start time
  durationMinutes?: number;
  notes?: string;
}

export interface Routine {
  id: string;
  title: string;
  description?: string;
  time?: string; // HH:mm
  categoryId: string;
  steps: RoutineStep[];
  recurrence: RecurrenceConfig;
  isActive: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate: string; // YYYY-MM-DD
  categoryId: string;
  priority: Priority;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
}

export type ActiveTab = 'home' | 'calendar' | 'tasks' | 'goals' | 'more';
