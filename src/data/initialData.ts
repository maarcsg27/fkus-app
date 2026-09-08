import { Category, Goal, Routine, Task } from '../types';
import { format, subDays, addDays } from 'date-fns';

const todayStr = format(new Date(), 'yyyy-MM-dd');
const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
const in112DaysStr = format(addDays(new Date(), 112), 'yyyy-MM-dd');
const in114DaysStr = format(addDays(new Date(), 114), 'yyyy-MM-dd');

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-personal', name: 'Personal', icon: 'User', color: '#6366f1' },
  { id: 'cat-work', name: 'Trabajo', icon: 'Briefcase', color: '#3b82f6' },
  { id: 'cat-study', name: 'Estudios', icon: 'GraduationCap', color: '#8b5cf6' },
  { id: 'cat-sport', name: 'Deporte', icon: 'Dumbbell', color: '#10b981' },
  { id: 'cat-health', name: 'Salud', icon: 'Heart', color: '#ef4444' },
  { id: 'cat-leisure', name: 'Ocio', icon: 'Gamepad2', color: '#ec4899' },
  { id: 'cat-shopping', name: 'Compras', icon: 'ShoppingBag', color: '#f59e0b' },
  { id: 'cat-finance', name: 'Finanzas', icon: 'Wallet', color: '#14b8a6' },
  { id: 'cat-projects', name: 'Proyectos', icon: 'Rocket', color: '#f97316' },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Terminar el curso de Ciencia de Datos',
    description: 'Completar los módulos de Machine Learning, BigQuery y presentar el proyecto final antes de fin de año.',
    targetDate: in112DaysStr,
    categoryId: 'cat-study',
    priority: 'high',
    notes: 'Dedicar al menos 1.5 horas al día de estudio enfocado.',
    createdAt: yesterdayStr,
  },
  {
    id: 'goal-2',
    title: 'Crear mi proyecto antes de final de año',
    description: 'Definir el MVP, crear la imagen de marca y conseguir el primer cliente piloto.',
    targetDate: in114DaysStr,
    categoryId: 'cat-projects',
    priority: 'urgent',
    notes: 'No complicar funcionalidades: lanzar rápido y validar con usuarios reales.',
    createdAt: yesterdayStr,
  }
];

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'routine-morning',
    title: 'Rutina de mañana',
    description: 'Despertar con energía y foco antes de iniciar el trabajo.',
    time: '07:00',
    categoryId: 'cat-personal',
    isActive: true,
    recurrence: { type: 'daily' },
    steps: [
      { id: 's1', title: '07:00 — Levantarse y beber agua', durationMinutes: 10 },
      { id: 's2', title: '07:10 — Desayunar saludable y café', durationMinutes: 20 },
      { id: 's3', title: '07:30 — Prepararse / Ducha', durationMinutes: 30 },
      { id: 's4', title: '08:00 — Salir / Iniciar jornada', durationMinutes: 10 },
    ]
  },
  {
    id: 'routine-gym',
    title: 'Rutina gimnasio',
    description: 'Sesión de fuerza y acondicionamiento físico.',
    time: '18:30',
    categoryId: 'cat-sport',
    isActive: true,
    recurrence: { type: 'weekdays', daysOfWeek: [1, 3, 5] },
    steps: [
      { id: 'g1', title: 'Calentamiento y movilidad', durationMinutes: 10 },
      { id: 'g2', title: 'Entrenamiento de fuerza principal', durationMinutes: 45 },
      { id: 'g3', title: 'Cardio moderado', durationMinutes: 20 },
      { id: 'g4', title: 'Estiramientos y relajación', durationMinutes: 15 },
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Estudiar análisis de datos',
    description: 'Avanzar en el tema de consultas optimizadas y visualización.',
    date: todayStr,
    time: '10:00',
    durationMinutes: 90,
    categoryId: 'cat-study',
    priority: 'high',
    status: 'pending',
    recurrence: { type: 'none' },
    reminderMinutesBefore: 15,
    goalId: 'goal-1',
    subtasks: [
      { id: 'sub-1', taskId: 'task-1', title: 'Revisar apuntes de SQL', completed: true },
      { id: 'sub-2', taskId: 'task-1', title: 'Hacer ejercicios prácticos', completed: false },
    ],
    createdAt: todayStr,
  },
  {
    id: 'task-2',
    title: 'Gimnasio',
    description: 'Lunes, miércoles y viernes: sesión de tren superior.',
    date: todayStr,
    time: '18:30',
    durationMinutes: 90,
    categoryId: 'cat-sport',
    priority: 'normal',
    status: 'pending',
    recurrence: { type: 'weekly', daysOfWeek: [1, 3, 5] },
    reminderMinutesBefore: 30,
    subtasks: [],
    createdAt: todayStr,
  },
  {
    id: 'task-3',
    title: 'Llamar al taller',
    description: 'Preguntar si tienen disponible el parachoques delantero y cuánto cuesta pintarlo.',
    date: todayStr,
    time: '20:00',
    durationMinutes: 15,
    categoryId: 'cat-personal',
    priority: 'normal',
    status: 'pending',
    recurrence: { type: 'none' },
    reminderMinutesBefore: 30,
    subtasks: [
      { id: 'sub-3', taskId: 'task-3', title: 'Pedir presupuesto pintura', completed: false },
      { id: 'sub-4', taskId: 'task-3', title: 'Consultar plazo de entrega', completed: false },
    ],
    createdAt: todayStr,
  },
  // Overdue task from yesterday
  {
    id: 'task-overdue-1',
    title: 'Revisar póliza y seguro del coche',
    description: 'Comparar renovación con opciones del mercado.',
    date: yesterdayStr,
    time: '16:00',
    durationMinutes: 30,
    categoryId: 'cat-finance',
    priority: 'high',
    status: 'pending',
    recurrence: { type: 'none' },
    subtasks: [],
    createdAt: yesterdayStr,
  },
  // Inbox / Unscheduled tasks
  {
    id: 'task-inbox-1',
    title: 'Comprar bombilla para habitación',
    description: 'Casquillo E27, luz cálida 2700K',
    categoryId: 'cat-shopping',
    priority: 'low',
    status: 'pending',
    recurrence: { type: 'none' },
    subtasks: [],
    createdAt: todayStr,
  },
  {
    id: 'task-inbox-2',
    title: 'Comprar una estantería',
    description: 'Medir el espacio en el estudio (máx 80cm de ancho)',
    categoryId: 'cat-shopping',
    priority: 'normal',
    status: 'pending',
    recurrence: { type: 'none' },
    subtasks: [],
    createdAt: todayStr,
  },
  // Goal-related tasks
  {
    id: 'task-goal-1',
    title: 'Definir propuesta de valor y nombre del proyecto',
    date: tomorrowStr,
    categoryId: 'cat-projects',
    priority: 'urgent',
    status: 'completed',
    recurrence: { type: 'none' },
    goalId: 'goal-2',
    subtasks: [],
    createdAt: yesterdayStr,
    completedAt: todayStr,
  },
  {
    id: 'task-goal-2',
    title: 'Crear MVP con React y TypeScript',
    date: addDays(new Date(), 2).toISOString().slice(0, 10),
    categoryId: 'cat-projects',
    priority: 'urgent',
    status: 'pending',
    recurrence: { type: 'none' },
    goalId: 'goal-2',
    subtasks: [
      { id: 'sub-g1', taskId: 'task-goal-2', title: 'Diseñar arquitectura de datos', completed: true },
      { id: 'sub-g2', taskId: 'task-goal-2', title: 'Construir vistas principales', completed: true },
      { id: 'sub-g3', taskId: 'task-goal-2', title: 'Integrar filtros y calendario', completed: false },
    ],
    createdAt: todayStr,
  }
];
