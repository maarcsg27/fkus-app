import React from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { formatDateSpanish, getTodayString, getDaysRemaining } from '../../utils/dateUtils';
import { TaskItem } from '../tasks/TaskItem';
import { RoutineExpandableItem } from '../routines/RoutineExpandableItem';
import { OverdueSection } from '../tasks/OverdueSection';
import { 
  Target, 
  Clock, 
  Plus, 
  Inbox, 
  ArrowRight,
  CheckCircle2,
  Zap
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    todayTasks, 
    inboxTasks, 
    routines,
    featuredGoal, 
    setIsQuickAddOpen, 
    setSelectedGoalId,
    setActiveTab,
    selectedCategoryIdFilter,
  } = useFKUS();

  const todayStr = getTodayString();
  const dateFormatted = formatDateSpanish(todayStr);

  // Filter tasks if category filter is active
  const filteredTodayTasks = selectedCategoryIdFilter
    ? todayTasks.filter(t => t.categoryId === selectedCategoryIdFilter)
    : todayTasks;

  // Filter routines applicable to today
  const dayOfWeekNumber = new Date().getDay();
  const todayRoutines = routines.filter(r => {
    if (!r.isActive) return false;
    if (selectedCategoryIdFilter && r.categoryId !== selectedCategoryIdFilter) return false;
    if (r.recurrence.type === 'daily') return true;
    if (r.recurrence.type === 'weekdays') return dayOfWeekNumber >= 1 && dayOfWeekNumber <= 5;
    if (r.recurrence.daysOfWeek) return r.recurrence.daysOfWeek.includes(dayOfWeekNumber);
    return false;
  });

  // Sort today's tasks chronologically
  const sortedTodayTasks = [...filteredTodayTasks].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  // Pending count
  const pendingCount = filteredTodayTasks.filter(t => t.status === 'pending').length;

  const goalCountdown = featuredGoal ? getDaysRemaining(featuredGoal.targetDate) : null;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-150">
      {/* Dynamic Date & Greeting Header */}
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

      {/* Main Responsive Content Grid (Desktop: 2 Columns, Mobile/Tablet: Stacked/Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Timed Activities & Tasks (7 Cols on Desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Clock size={13} className="text-red-500" />
              <span>Actividades y Tareas de Hoy ({filteredTodayTasks.length})</span>
            </h2>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1"
            >
              <Plus size={13} />
              <span>Añadir</span>
            </button>
          </div>

          {filteredTodayTasks.length === 0 ? (
            <div className="text-center py-10 bg-neutral-950 rounded-2xl border border-neutral-900 p-4">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-neutral-400 flex items-center justify-center mx-auto mb-2.5">
                <CheckCircle2 size={22} className="text-red-500" />
              </div>
              <p className="text-sm font-bold text-neutral-200">No hay tareas para hoy</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                Añade cualquier cosa que tengas que hacer o revisa tus notas pendientes.
              </p>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="mt-3 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-red-600/20"
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

        {/* Right Column: Featured Goal, Today's Routines & Inbox (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Featured Goal Reminder Banner (#16) */}
          {featuredGoal && goalCountdown && (
            <div 
              onClick={() => setSelectedGoalId(featuredGoal.id)}
              className="p-4 rounded-2xl bg-neutral-950 border border-red-500/30 cursor-pointer hover:border-red-500/60 transition-all shadow-subtle group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Target size={18} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-0.5">
                      <span className="text-[10.5px] uppercase font-black tracking-wider text-red-400">
                        🎯 Objetivo Principal
                      </span>
                      <span className="text-[10px] text-red-300 font-bold bg-red-500/15 px-2 py-0.2 rounded-full border border-red-500/20">
                        {goalCountdown.label}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                      {featuredGoal.title}
                    </h3>
                    {featuredGoal.description && (
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                        {featuredGoal.description}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-neutral-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all text-xs font-bold">
                  →
                </span>
              </div>
            </div>
          )}

          {/* Routines for Today (Desplegables) */}
          {todayRoutines.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Zap size={13} className="text-red-500" />
                  <span>Rutinas del Día ({todayRoutines.length})</span>
                </h2>
              </div>

              <div className="space-y-2">
                {todayRoutines.map(routine => (
                  <RoutineExpandableItem key={routine.id} routine={routine} />
                ))}
              </div>
            </div>
          )}

          {/* Inbox / Pendientes Importantes */}
          {inboxTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Inbox size={13} className="text-red-400" />
                  <span>Pendientes en Inbox ({inboxTasks.length})</span>
                </h2>

                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs text-red-400 hover:text-red-300 font-bold inline-flex items-center gap-1"
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
      </div>
    </div>
  );
};
