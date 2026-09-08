import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Category, Routine, Goal, ActiveTab, Subtask } from '../types';
import { INITIAL_CATEGORIES, INITIAL_GOALS, INITIAL_ROUTINES, INITIAL_TASKS } from '../data/initialData';
import { checkIsOverdue, getTodayString, getTomorrowString } from '../utils/dateUtils';
import confetti from 'canvas-confetti';
import { addDays } from 'date-fns';

interface FKUSContextType {
  tasks: Task[];
  categories: Category[];
  routines: Routine[];
  goals: Goal[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Modals & Selection
  isCreateMenuOpen: boolean;
  setIsCreateMenuOpen: (open: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isGoalFormOpen: boolean;
  setIsGoalFormOpen: (open: boolean) => void;
  isRoutineFormOpen: boolean;
  setIsRoutineFormOpen: (open: boolean) => void;
  routineToEdit: Routine | null;
  setRoutineToEdit: (r: Routine | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedGoalId: string | null;
  setSelectedGoalId: (id: string | null) => void;
  selectedRoutineId: string | null;
  setSelectedRoutineId: (id: string | null) => void;
  isCategoryModalOpen: boolean;
  setIsCategoryModalOpen: (open: boolean) => void;
  isStatsModalOpen: boolean;
  setIsStatsModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  selectedCategoryIdFilter: string | null;
  setSelectedCategoryIdFilter: (id: string | null) => void;

  // Task Actions
  addTask: (taskData: Partial<Task> & { title: string }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  quickRescheduleTask: (id: string, option: 'today' | 'tomorrow' | 'this_week' | 'date', customDate?: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Category Actions
  addCategory: (cat: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Routine Actions
  addRoutine: (routine: Omit<Routine, 'id'>) => Routine;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  toggleRoutineStep: (routineId: string, stepId: string) => void;

  // Goal Actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  linkTaskToGoal: (taskId: string, goalId: string | undefined) => void;

  // Computed Helpers
  todayTasks: Task[];
  overdueTasks: Task[];
  inboxTasks: Task[];
  upcomingTasks: Task[];
  completedTasks: Task[];
  featuredGoal: Goal | null;
  getCategoryById: (id: string) => Category | undefined;
  getGoalById: (id: string) => Goal | undefined;
  getGoalStats: (goalId: string) => { completed: number; pending: number; total: number };
  
  // Data management
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const FKUSContext = createContext<FKUSContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'fkus_tasks_v1',
  CATEGORIES: 'fkus_categories_v1',
  ROUTINES: 'fkus_routines_v1',
  GOALS: 'fkus_goals_v1',
};

export const FKUSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    return saved ? JSON.parse(saved) : INITIAL_ROUTINES;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [isRoutineFormOpen, setIsRoutineFormOpen] = useState(false);
  const [routineToEdit, setRoutineToEdit] = useState<Routine | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategoryIdFilter, setSelectedCategoryIdFilter] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  // Helpers
  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getGoalById = (id: string) => goals.find(g => g.id === id);

  const getGoalStats = (goalId: string) => {
    const related = tasks.filter(t => t.goalId === goalId);
    const completed = related.filter(t => t.status === 'completed').length;
    const pending = related.filter(t => t.status === 'pending').length;
    return { completed, pending, total: related.length };
  };

  // Task methods
  const addTask = (taskData: Partial<Task> & { title: string }): Task => {
    const defaultCat = categories[0]?.id || 'cat-personal';
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: taskData.title.trim(),
      description: taskData.description || '',
      date: taskData.date,
      time: taskData.time,
      durationMinutes: taskData.durationMinutes,
      categoryId: taskData.categoryId || defaultCat,
      priority: taskData.priority || 'normal',
      status: 'pending',
      recurrence: taskData.recurrence || { type: 'none' },
      reminderMinutesBefore: taskData.reminderMinutesBefore,
      goalId: taskData.goalId,
      subtasks: taskData.subtasks || [],
      createdAt: getTodayString(),
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
      
      if (nextStatus === 'completed') {
        // Trigger celebratory confetti in red & white palette
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.85 },
            colors: ['#ef4444', '#dc2626', '#ffffff', '#7f1d1d']
          });
        } catch {
          // ignore
        }
      }

      return {
        ...t,
        status: nextStatus,
        completedAt: nextStatus === 'completed' ? getTodayString() : undefined
      };
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  const duplicateTask = (id: string) => {
    const original = tasks.find(t => t.id === id);
    if (!original) return;
    const duplicated: Task = {
      ...original,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${original.title} (copia)`,
      status: 'pending',
      completedAt: undefined,
      createdAt: getTodayString(),
      subtasks: original.subtasks.map(s => ({ ...s, id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, completed: false }))
    };
    setTasks(prev => [duplicated, ...prev]);
  };

  const quickRescheduleTask = (id: string, option: 'today' | 'tomorrow' | 'this_week' | 'date', customDate?: string) => {
    let newDate: string | undefined = undefined;
    const today = new Date();
    
    if (option === 'today') {
      newDate = getTodayString();
    } else if (option === 'tomorrow') {
      newDate = getTomorrowString();
    } else if (option === 'this_week') {
      // 3 days from now
      newDate = addDays(today, 3).toISOString().slice(0, 10);
    } else if (option === 'date' && customDate) {
      newDate = customDate;
    }

    if (newDate) {
      updateTask(id, { date: newDate });
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s)
      };
    }));
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      taskId,
      title: title.trim(),
      completed: false
    };
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: [...t.subtasks, newSub] };
    }));
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: t.subtasks.filter(s => s.id !== subtaskId) };
    }));
  };

  // Categories
  const addCategory = (cat: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...cat,
      id: `cat-custom-${Date.now()}`,
      isCustom: true,
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Default fallback for tasks with deleted category
    const fallbackId = categories.find(c => c.id !== id)?.id || 'cat-personal';
    setTasks(prev => prev.map(t => t.categoryId === id ? { ...t, categoryId: fallbackId } : t));
  };

  // Routines
  const addRoutine = (routine: Omit<Routine, 'id'>): Routine => {
    const newRoutine: Routine = {
      ...routine,
      id: `routine-${Date.now()}`,
    };
    setRoutines(prev => [...prev, newRoutine]);
    return newRoutine;
  };

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
    if (selectedRoutineId === id) setSelectedRoutineId(null);
  };

  const toggleRoutineStep = (_routineId: string, _stepId: string) => {
    // Visual or step check logic can be added if needed
  };

  // Goals
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>): Goal => {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}`,
      createdAt: getTodayString(),
    };
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    // Unlink tasks
    setTasks(prev => prev.map(t => t.goalId === id ? { ...t, goalId: undefined } : t));
    if (selectedGoalId === id) setSelectedGoalId(null);
  };

  const linkTaskToGoal = (taskId: string, goalId: string | undefined) => {
    updateTask(taskId, { goalId });
  };

  // Computed Collections
  const today = getTodayString();

  const todayTasks = tasks.filter(t => t.date === today && t.status !== 'cancelled');
  
  const overdueTasks = tasks.filter(t => checkIsOverdue(t.date, t.status));

  const inboxTasks = tasks.filter(t => !t.date && t.status === 'pending');

  const upcomingTasks = tasks.filter(t => t.date && t.date > today && t.status === 'pending');

  const completedTasks = tasks.filter(t => t.status === 'completed');

  const featuredGoal = goals.length > 0 ? goals[0] : null;

  const resetToDefaults = () => {
    setTasks(INITIAL_TASKS);
    setCategories(INITIAL_CATEGORIES);
    setRoutines(INITIAL_ROUTINES);
    setGoals(INITIAL_GOALS);
  };

  const exportDataJSON = () => {
    return JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks,
      categories,
      routines,
      goals
    }, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.routines)) setRoutines(data.routines);
      if (Array.isArray(data.goals)) setGoals(data.goals);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <FKUSContext.Provider
      value={{
        tasks,
        categories,
        routines,
        goals,
        activeTab,
        setActiveTab,
        isCreateMenuOpen,
        setIsCreateMenuOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isGoalFormOpen,
        setIsGoalFormOpen,
        isRoutineFormOpen,
        setIsRoutineFormOpen,
        routineToEdit,
        setRoutineToEdit,
        selectedTaskId,
        setSelectedTaskId,
        selectedGoalId,
        setSelectedGoalId,
        selectedRoutineId,
        setSelectedRoutineId,
        isCategoryModalOpen,
        setIsCategoryModalOpen,
        isStatsModalOpen,
        setIsStatsModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        selectedCategoryIdFilter,
        setSelectedCategoryIdFilter,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        duplicateTask,
        quickRescheduleTask,
        toggleSubtask,
        addSubtask,
        deleteSubtask,
        addCategory,
        updateCategory,
        deleteCategory,
        addRoutine,
        updateRoutine,
        deleteRoutine,
        toggleRoutineStep,
        addGoal,
        updateGoal,
        deleteGoal,
        linkTaskToGoal,
        todayTasks,
        overdueTasks,
        inboxTasks,
        upcomingTasks,
        completedTasks,
        featuredGoal,
        getCategoryById,
        getGoalById,
        getGoalStats,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </FKUSContext.Provider>
  );
};

export const useFKUS = () => {
  const context = useContext(FKUSContext);
  if (!context) {
    throw new Error('useFKUS must be used within a FKUSProvider');
  }
  return context;
};
