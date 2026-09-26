import { Task, Category, Routine, Goal } from '../types';
import { db, isFirebaseConfigured } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { INITIAL_CATEGORIES } from '../data/initialData';

interface UserDataPayload {
  tasks: Task[];
  categories: Category[];
  routines: Routine[];
  goals: Goal[];
  updatedAt: string;
}

const getUserKey = (userId: string, type: 'tasks' | 'categories' | 'routines' | 'goals') => 
  `fkus_db_${userId}_${type}_v1`;

export const dbService = {
  /**
   * Load all data for a specific user ID
   */
  async loadUserData(userId: string): Promise<{
    tasks: Task[];
    categories: Category[];
    routines: Routine[];
    goals: Goal[];
  }> {
    // 1. Try local storage cache first for instant UI response
    let localTasks: Task[] = [];
    let localCategories: Category[] = INITIAL_CATEGORIES;
    let localRoutines: Routine[] = [];
    let localGoals: Goal[] = [];

    try {
      const rawT = localStorage.getItem(getUserKey(userId, 'tasks'));
      if (rawT) localTasks = JSON.parse(rawT);

      const rawC = localStorage.getItem(getUserKey(userId, 'categories'));
      if (rawC) localCategories = JSON.parse(rawC);

      const rawR = localStorage.getItem(getUserKey(userId, 'routines'));
      if (rawR) localRoutines = JSON.parse(rawR);

      const rawG = localStorage.getItem(getUserKey(userId, 'goals'));
      if (rawG) localGoals = JSON.parse(rawG);
    } catch (e) {
      console.warn('Error reading local user data cache:', e);
    }

    // 2. If Firebase Firestore is configured, fetch latest remote data
    if (isFirebaseConfigured && db && userId) {
      try {
        const userDocRef = doc(db, 'userData', userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const remote = docSnap.data() as UserDataPayload;
          const mergedTasks = remote.tasks || [];
          const mergedCategories = remote.categories && remote.categories.length > 0 ? remote.categories : INITIAL_CATEGORIES;
          const mergedRoutines = remote.routines || [];
          const mergedGoals = remote.goals || [];

          // Update local cache
          localStorage.setItem(getUserKey(userId, 'tasks'), JSON.stringify(mergedTasks));
          localStorage.setItem(getUserKey(userId, 'categories'), JSON.stringify(mergedCategories));
          localStorage.setItem(getUserKey(userId, 'routines'), JSON.stringify(mergedRoutines));
          localStorage.setItem(getUserKey(userId, 'goals'), JSON.stringify(mergedGoals));

          return {
            tasks: mergedTasks,
            categories: mergedCategories,
            routines: mergedRoutines,
            goals: mergedGoals,
          };
        }
      } catch (err) {
        console.warn('Could not fetch remote user data from Firestore, using local cache:', err);
      }
    }

    return {
      tasks: localTasks,
      categories: localCategories,
      routines: localRoutines,
      goals: localGoals,
    };
  },

  /**
   * Save tasks for a user
   */
  async saveTasks(userId: string, tasks: Task[]): Promise<void> {
    try {
      localStorage.setItem(getUserKey(userId, 'tasks'), JSON.stringify(tasks));
      if (isFirebaseConfigured && db && userId) {
        await setDoc(doc(db, 'userData', userId), { tasks, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (e) {
      console.warn('Error saving tasks to dbService:', e);
    }
  },

  /**
   * Save categories for a user
   */
  async saveCategories(userId: string, categories: Category[]): Promise<void> {
    try {
      localStorage.setItem(getUserKey(userId, 'categories'), JSON.stringify(categories));
      if (isFirebaseConfigured && db && userId) {
        await setDoc(doc(db, 'userData', userId), { categories, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (e) {
      console.warn('Error saving categories to dbService:', e);
    }
  },

  /**
   * Save routines for a user
   */
  async saveRoutines(userId: string, routines: Routine[]): Promise<void> {
    try {
      localStorage.setItem(getUserKey(userId, 'routines'), JSON.stringify(routines));
      if (isFirebaseConfigured && db && userId) {
        await setDoc(doc(db, 'userData', userId), { routines, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (e) {
      console.warn('Error saving routines to dbService:', e);
    }
  },

  /**
   * Save goals for a user
   */
  async saveGoals(userId: string, goals: Goal[]): Promise<void> {
    try {
      localStorage.setItem(getUserKey(userId, 'goals'), JSON.stringify(goals));
      if (isFirebaseConfigured && db && userId) {
        await setDoc(doc(db, 'userData', userId), { goals, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (e) {
      console.warn('Error saving goals to dbService:', e);
    }
  },

  /**
   * Clear all stored data for this user ID
   */
  async clearUserData(userId: string): Promise<void> {
    localStorage.removeItem(getUserKey(userId, 'tasks'));
    localStorage.removeItem(getUserKey(userId, 'categories'));
    localStorage.removeItem(getUserKey(userId, 'routines'));
    localStorage.removeItem(getUserKey(userId, 'goals'));

    if (isFirebaseConfigured && db && userId) {
      try {
        await setDoc(doc(db, 'userData', userId), {
          tasks: [],
          categories: INITIAL_CATEGORIES,
          routines: [],
          goals: [],
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Error clearing remote user data in Firestore:', e);
      }
    }
  },
};
