import React from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { formatDateSpanish, getTodayString, getDaysRemaining } from '../../utils/dateUtils';
import { TaskItem } from '../tasks/TaskItem';
import { OverdueSection } from '../tasks/OverdueSection';
import { IconRenderer } from '../common/IconRenderer';
import { 
  Sparkles, 
  Target, 
  Clock, 
  Calendar, 
  Plus, 
  Inbox, 
  ArrowRight,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { Task } from '../../types';

export const HomeView: React.FC = () => {
  const { 
    todayTasks, 
    inboxTasks, 
    routines, 
    goals, 
    featuredGoal, 
    setIsQuickAddOpen, 
    setSelectedGoalId,
    setActiveTab,
    selectedCategoryIdFilter,
    getCategoryById
  } = useFKUS();

  const todayStr = getTodayString();
  const dateFormatted = formatDateSpanish(todayStr);

  // Filter tasks if category filter is active
  const filteredTodayTasks = selectedCategoryIdFilter
    ? todayTasks.filter(t => t.categoryId === selectedCategoryIdFilter)
    : todayTasks;

  // Sort today's tasks chronologically
  const sortedTodayTasks = [...filteredTodayTasks].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  // Split into timed activities and untimed tasks
  const timedActivities = sortedTodayTasks.filter(t => t.time);
  const untimedTasks = sortedTodayTasks.filter(t => !t.time);

  // Pending count
  const pendingCount = filteredTodayTasks.filter(t => t.status === 'pending').length;
  const completedCount = filteredTodayTasks.filter(t => t.status === 'completed').length;

  const goalCountdown = featuredGoal ? getDaysRemaining(featuredGoal.targetDate) : null;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-150">
      {/* Dynamic Date & Greeting Header */}
      <div className="pt-2 px-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold tracking-widest text-emerald-400 capitalize">
              {dateFormatted}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              Hoy
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
              {pendingCount === 0 ? '✨ Todo al día' : `${pendingCount} pendientes`}
            </span>
          </div>
        </div>

        <p className="text-xs text-neutral-400 mt-1">
          {pendingCount > 0 
            ? `Tienes ${pendingCount} tareas programadas para hoy. Apúntalo, organízalo y hazlo.` 
            : 'Has completado todas tus tareas de hoy. ¡Excelente trabajo!'}
        </p>
      </div>

      {/* Overdue Tasks Banner (if any) */}
      <OverdueSection />

      {/* Featured Goal Reminder Banner (#16 Recordatorio de objetivos) */}
      {featuredGoal && goalCountdown && (
        <div 
          onClick={() => setSelectedGoalId(featuredGoal.id)}
          className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/60 to-emerald-950/40 border border-teal-500/30 cursor-pointer hover:border-teal-400/60 transition-all shadow-sm group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                <Target size={18} />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <span className="text-[10.5px] uppercase font-bold tracking-wider text-teal-400">
                    🎯 No olvides tu objetivo
                  </span>
                  <span className="text-[10px] text-teal-300/80 font-semibold bg-teal-500/10 px-2 py-0.2 rounded-full">
                    {goalCountdown.label}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-teal-200 transition-colors">
                  {featuredGoal.title}
                </h3>
                {featuredGoal.description && (
                  <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                    {featuredGoal.description}
                  </p>
                )}
              </div>
            </div>

            <span className="text-neutral-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all text-xs font-semibold">
              →
            </span>
          </div>
        </div>
      )}

      {/* "Hoy" — Main Timed Activities and Tasks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Clock size={13} className="text-emerald-400" />
            <span>Actividades del día ({filteredTodayTasks.length})</span>
          </h2>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
          >
            <Plus size={13} />
            <span>Añadir</span>
          </button>
        </div>

        {filteredTodayTasks.length === 0 ? (
          <div className="text-center py-10 bg-neutral-900/40 rounded-2xl border border-neutral-800/60 p-4">
            <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-2.5">
              <CheckCircle2 size={22} className="text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-neutral-200">No hay tareas para hoy</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              Añade cualquier cosa que tengas que hacer o revisa tus notas pendientes.
            </p>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Añadir tarea rápida</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedTodayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Inbox / Pendientes Importantes (Section 6 & 4) */}
      {inboxTasks.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Inbox size={13} className="text-amber-400" />
              <span>Pendientes en Inbox ({inboxTasks.length})</span>
            </h2>

            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
            >
              <span>Organizar</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2.5">
            {inboxTasks.slice(0, 3).map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
