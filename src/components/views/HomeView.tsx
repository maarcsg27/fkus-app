import React from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { formatDateSpanish, getTodayString, getTomorrowString } from '../../utils/dateUtils';
import { TaskItem } from '../tasks/TaskItem';
import { GoalCard } from '../goals/GoalCard';
import { RoutineExpandableItem } from '../routines/RoutineExpandableItem';
import { SwipeDeckSlider } from '../common/SwipeDeckSlider';
import { Routine, Task } from '../../types';
import { addDays, format } from 'date-fns';
import { 
  Target, 
  Clock, 
  AlertCircle, 
  CalendarDays, 
  Inbox, 
  ArrowRight,
  CheckCircle2,
  Plus,
  Sparkles,
  Zap
} from 'lucide-react';

interface DayActivityItem {
  type: 'routine' | 'task';
  id: string;
  time?: string;
  routine?: Routine;
  task?: Task;
}

export const HomeView: React.FC = () => {
  const { 
    todayTasks, 
    overdueTasks,
    inboxTasks, 
    tasks,
    routines,
    goals, 
    setIsQuickAddOpen, 
    setIsGoalFormOpen,
    setActiveTab,
    selectedCategoryIdFilter,
  } = useFKUS();

  const todayDate = new Date();
  const todayStr = getTodayString();
  const dateFormatted = formatDateSpanish(todayStr);

  const tomorrowDate = addDays(todayDate, 1);
  const tomorrowStr = getTomorrowString();
  const tomorrowFormatted = formatDateSpanish(tomorrowStr);

  // 1. FILTER GOALS
  const filteredGoals = selectedCategoryIdFilter
    ? goals.filter(g => g.categoryId === selectedCategoryIdFilter)
    : goals;

  // 2. FILTER OVERDUE TASKS
  const filteredOverdueTasks = selectedCategoryIdFilter
    ? overdueTasks.filter(t => t.categoryId === selectedCategoryIdFilter)
    : overdueTasks;

  // 3. TODAY'S ACTIVITIES (Routines + Tasks)
  const todayDayOfWeek = todayDate.getDay();
  const todayRoutines = routines.filter(r => {
    if (!r.isActive) return false;
    if (selectedCategoryIdFilter && r.categoryId !== selectedCategoryIdFilter) return false;
    if (r.recurrence.type === 'daily') return true;
    if (r.recurrence.type === 'weekdays') return todayDayOfWeek >= 1 && todayDayOfWeek <= 5;
    if (r.recurrence.daysOfWeek) return r.recurrence.daysOfWeek.includes(todayDayOfWeek);
    return false;
  });

  const filteredTodayTasks = selectedCategoryIdFilter
    ? todayTasks.filter(t => t.categoryId === selectedCategoryIdFilter && t.status !== 'cancelled')
    : todayTasks.filter(t => t.status !== 'cancelled');

  const todayActivities: DayActivityItem[] = [
    ...todayRoutines.map(r => ({ type: 'routine' as const, id: `r-${r.id}`, time: r.time, routine: r })),
    ...filteredTodayTasks.map(t => ({ type: 'task' as const, id: `t-${t.id}`, time: t.time, task: t })),
  ].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  // 4. TOMORROW'S ACTIVITIES (Routines + Tasks)
  const tomorrowDayOfWeek = tomorrowDate.getDay();
  const tomorrowRoutines = routines.filter(r => {
    if (!r.isActive) return false;
    if (selectedCategoryIdFilter && r.categoryId !== selectedCategoryIdFilter) return false;
    if (r.recurrence.type === 'daily') return true;
    if (r.recurrence.type === 'weekdays') return tomorrowDayOfWeek >= 1 && tomorrowDayOfWeek <= 5;
    if (r.recurrence.daysOfWeek) return r.recurrence.daysOfWeek.includes(tomorrowDayOfWeek);
    return false;
  });

  const tomorrowTasks = tasks.filter(t => {
    if (t.date !== tomorrowStr || t.status === 'cancelled') return false;
    if (selectedCategoryIdFilter && t.categoryId !== selectedCategoryIdFilter) return false;
    return true;
  });

  const tomorrowActivities: DayActivityItem[] = [
    ...tomorrowRoutines.map(r => ({ type: 'routine' as const, id: `r-tom-${r.id}`, time: r.time, routine: r })),
    ...tomorrowTasks.map(t => ({ type: 'task' as const, id: `t-tom-${t.id}`, time: t.time, task: t })),
  ].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  const pendingTodayCount = filteredTodayTasks.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-150 max-w-4xl mx-auto">
      {/* Header Greeting */}
      <div className="pt-2 px-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-widest text-red-500 capitalize">
              {dateFormatted}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              Hoy
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
              {pendingTodayCount === 0 ? '✨ Todo al día' : `${pendingTodayCount} pendientes hoy`}
            </span>
          </div>
        </div>
      </div>

      {/* 1º PANEL DESLIZANTE: OBJETIVOS (SI HAY) */}
      {filteredGoals.length > 0 && (
        <SwipeDeckSlider
          title="Objetivos Estratégicos"
          icon={<Target size={16} />}
          badge={`${filteredGoals.length} ${filteredGoals.length === 1 ? 'meta' : 'metas'}`}
          items={filteredGoals}
          onAdd={() => setIsGoalFormOpen(true)}
          addLabel="Nuevo"
          renderItem={(goal) => (
            <GoalCard goal={goal} />
          )}
        />
      )}

      {/* 2º PANEL DESLIZANTE: TAREAS ANTERIORES NO COMPLETADAS (ATRASADAS) */}
      {filteredOverdueTasks.length > 0 && (
        <SwipeDeckSlider
          title="Tareas Atrasadas de Días Anteriores"
          icon={<AlertCircle size={16} className="text-red-500 animate-pulse" />}
          badge={`${filteredOverdueTasks.length} ${filteredOverdueTasks.length === 1 ? 'atrasada' : 'atrasadas'}`}
          badgeColor="text-red-400 bg-red-600/20 border border-red-500/40 font-bold"
          items={filteredOverdueTasks}
          renderItem={(task) => (
            <TaskItem task={task} showDate />
          )}
        />
      )}

      {/* 3º PANEL DESLIZANTE: DÍA ACTUAL (HOY) */}
      <SwipeDeckSlider
        title={`Actividades de Hoy (${dateFormatted})`}
        icon={<Clock size={16} />}
        badge={todayActivities.length > 0 ? `${todayActivities.length} ${todayActivities.length === 1 ? 'actividad' : 'actividades'}` : undefined}
        items={todayActivities}
        onAdd={() => setIsQuickAddOpen(true)}
        addLabel="Añadir"
        emptyState={
          <div className="text-center py-10 bg-neutral-950 rounded-2xl border border-neutral-900 p-4">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-neutral-400 flex items-center justify-center mx-auto mb-2.5">
              <CheckCircle2 size={22} className="text-red-500" />
            </div>
            <p className="text-sm font-bold text-neutral-200">No hay actividades para hoy</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              Añade cualquier cosa que tengas que hacer hoy o dicta una nota de voz con el botón '+'.
            </p>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-red-600/20"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Añadir tarea para hoy</span>
            </button>
          </div>
        }
        renderItem={(item) => (
          item.type === 'routine' && item.routine ? (
            <RoutineExpandableItem routine={item.routine} defaultExpanded={false} />
          ) : item.task ? (
            <TaskItem task={item.task} />
          ) : null
        )}
      />

      {/* 4º PANEL DESLIZANTE: MAÑANA */}
      {tomorrowActivities.length > 0 && (
        <SwipeDeckSlider
          title={`Planificado para Mañana (${tomorrowFormatted})`}
          icon={<CalendarDays size={16} />}
          badge={`${tomorrowActivities.length} ${tomorrowActivities.length === 1 ? 'actividad' : 'actividades'}`}
          badgeColor="text-neutral-300 bg-neutral-900 border border-neutral-800"
          items={tomorrowActivities}
          onAdd={() => setIsQuickAddOpen(true)}
          addLabel="Añadir"
          renderItem={(item) => (
            item.type === 'routine' && item.routine ? (
              <RoutineExpandableItem routine={item.routine} defaultExpanded={false} />
            ) : item.task ? (
              <TaskItem task={item.task} showDate={false} />
            ) : null
          )}
        />
      )}

      {/* INBOX RÁPIDO (SECCIÓN COMPACTA INFERIOR SI HAY PENDIENTES SIN FECHA) */}
      {inboxTasks.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-neutral-900">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Inbox size={13} className="text-red-400" />
              <span>Bandeja de Entrada Inbox ({inboxTasks.length})</span>
            </h2>

            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-red-400 hover:text-red-300 font-bold inline-flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2.5">
            {inboxTasks.slice(0, 2).map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
