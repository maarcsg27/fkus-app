import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Task, Category, Routine, Goal, ActiveTab, Subtask } from '../types';
import { INITIAL_CATEGORIES, INITIAL_GOALS, INITIAL_ROUTINES, INITIAL_TASKS } from '../data/initialData';
import { checkIsOverdue, getTodayString, getTomorrowString } from '../utils/dateUtils';
import confetti from 'canvas-confetti';
import { addDays, format } from 'date-fns';
import { useAuth } from './AuthContext';
import { dbService } from '../services/dbService';

interface FKUSContextType {
  tasks: Task[];
  categories: Category[];
  routines: Routine[];
  goals: Goal[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDataLoading: boolean;
  
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
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
  clearAllData: () => void;
  loadSampleData: () => void;
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const FKUSContext = createContext<FKUSContextType | undefined>(undefined);

export const FKUSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.id || 'guest_user';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
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

  const isInitialLoad = useRef(true);

  // Load user data whenever current user changes
  useEffect(() => {
    let isCancelled = false;
    setIsDataLoading(true);

    const loadData = async () => {
      try {
        const data = await dbService.loadUserData(currentUserId);
        if (!isCancelled) {
          setTasks(data.tasks);
          setCategories(data.categories.length > 0 ? data.categories : INITIAL_CATEGORIES);
          setRoutines(data.routines);
          setGoals(data.goals);
        }
      } catch (err) {
        console.warn('Error loading user data from dbService:', err);
      } finally {
        if (!isCancelled) {
          setIsDataLoading(false);
          isInitialLoad.current = false;
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [currentUserId]);

  // Sync to database and storage on state changes (avoid overwriting during initial load)
  useEffect(() => {
    if (isInitialLoad.current || isDataLoading) return;
    dbService.saveTasks(currentUserId, tasks);
  }, [tasks, currentUserId, isDataLoading]);

  useEffect(() => {
    if (isInitialLoad.current || isDataLoading) return;
    dbService.saveCategories(currentUserId, categories);
  }, [categories, currentUserId, isDataLoading]);

  useEffect(() => {
    if (isInitialLoad.current || isDataLoading) return;
    dbService.saveRoutines(currentUserId, routines);
  }, [routines, currentUserId, isDataLoading]);

  useEffect(() => {
    if (isInitialLoad.current || isDataLoading) return;
    dbService.saveGoals(currentUserId, goals);
  }, [goals, currentUserId, isDataLoading]);

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
      const newStatus = t.status === 'completed' ? 'pending' : 'completed';
      
      if (newStatus === 'completed') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#ef4444', '#dc2626', '#b91c1c', '#ffffff']
        });
      }

      return {
        ...t,
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
      };
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  const duplicateTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;

    const copy: Task = {
      ...target,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${target.title} (Copia)`,
      status: 'pending',
      completedAt: undefined,
      createdAt: getTodayString(),
      subtasks: target.subtasks.map(s => ({
        ...s,
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        completed: false
      }))
    };

    setTasks(prev => [copy, ...prev]);
  };

  const quickRescheduleTask = (id: string, option: 'today' | 'tomorrow' | 'this_week' | 'date', customDate?: string) => {
    const today = new Date();
    let newDate = getTodayString();

    if (option === 'tomorrow') {
      newDate = getTomorrowString();
    } else if (option === 'this_week') {
      newDate = format(addDays(today, 3), 'yyyy-MM-dd');
    } else if (option === 'date' && customDate) {
      newDate = customDate;
    }

    updateTask(id, { date: newDate });
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
      };
    }));
  };

  const addSubtask = (taskId: string, title: string) => {
    const newSubtask: Subtask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      taskId,
      title: title.trim(),
      completed: false,
    };

    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: [...t.subtasks, newSubtask]
      };
    }));
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.filter(st => st.id !== subtaskId)
      };
    }));
  };

  // Category methods
  const addCategory = (catData: Omit<Category, 'id'>): Category => {
    const newCategory: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...catData,
      isCustom: true,
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Routine methods
  const addRoutine = (routineData: Omit<Routine, 'id'>): Routine => {
    const newRoutine: Routine = {
      id: `routine-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...routineData,
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

  const toggleRoutineStep = (routineId: string, stepId: string) => {
    console.log('Toggled step:', stepId, 'in routine:', routineId);
  };

  // Goal methods
  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>): Goal => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...goalData,
      createdAt: getTodayString(),
    };
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setTasks(prev => prev.map(t => t.goalId === id ? { ...t, goalId: undefined } : t));
    if (selectedGoalId === id) setSelectedGoalId(null);
  };

  const linkTaskToGoal = (taskId: string, goalId: string | undefined) => {
    updateTask(taskId, { goalId });
  };

  // Filtered views
  const todayStr = getTodayString();

  const todayTasks = tasks.filter(t => t.date === todayStr);
  const overdueTasks = tasks.filter(t => checkIsOverdue(t.date, t.status));
  const inboxTasks = tasks.filter(t => !t.date && t.status !== 'completed' && t.status !== 'cancelled');
  const upcomingTasks = tasks.filter(t => t.date && t.date > todayStr && t.status !== 'completed' && t.status !== 'cancelled');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const featuredGoal = goals.length > 0 ? goals[0] : null;

  // Data management
  const clearAllData = () => {
    setTasks([]);
    setRoutines([]);
    setGoals([]);
    setCategories(INITIAL_CATEGORIES);
    dbService.clearUserData(currentUserId);
  };

  const loadSampleData = () => {
    setTasks(INITIAL_TASKS);
    setCategories(INITIAL_CATEGORIES);
    setRoutines(INITIAL_ROUTINES);
    setGoals(INITIAL_GOALS);
  };

  const resetToDefaults = () => {
    clearAllData();
  };

  const exportDataJSON = (): string => {
    return JSON.stringify({
      version: '2.0',
      exportedAt: new Date().toISOString(),
      tasks,
      categories,
      routines,
      goals,
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
        isDataLoading,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
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
        clearAllData,
        loadSampleData,
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
