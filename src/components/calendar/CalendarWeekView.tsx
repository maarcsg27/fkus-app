import React, { useState } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { getWeekDays, getTodayString, formatDateSpanish } from '../../utils/dateUtils';
import { format, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Plus
} from 'lucide-react';

export const CalendarWeekView: React.FC = () => {
  const { 
    tasks, 
    routines, 
    toggleTaskStatus, 
    setSelectedTaskId, 
    setIsQuickAddOpen,
    getCategoryById 
  } = useFKUS();

  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const weekDays = getWeekDays(currentWeekDate);
  const selectedDayStr = format(selectedDay, 'yyyy-MM-dd');
  const todayStr = getTodayString();

  // Filter tasks for selected day
  const dayTasks = tasks.filter(t => t.date === selectedDayStr && t.status !== 'cancelled');
  
  // Sort tasks by time
  const sortedDayTasks = [...dayTasks].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  // Filter routines applicable to selected day
  const dayOfWeekNumber = selectedDay.getDay();
  const activeRoutinesForDay = routines.filter(r => {
    if (!r.isActive) return false;
    if (r.recurrence.type === 'daily') return true;
    if (r.recurrence.type === 'weekdays') return dayOfWeekNumber >= 1 && dayOfWeekNumber <= 5;
    if (r.recurrence.daysOfWeek) return r.recurrence.daysOfWeek.includes(dayOfWeekNumber);
    return false;
  });

  return (
    <div className="space-y-4">
      {/* Week Navigator Bar */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-base font-bold text-white capitalize">
            {format(currentWeekDate, "MMMM yyyy", { locale: es })}
          </h3>
          <p className="text-[11px] text-neutral-400">
            Semana del {format(weekDays[0], "d 'de' MMM", { locale: es })} al {format(weekDays[6], "d 'de' MMM", { locale: es })}
          </p>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setCurrentWeekDate(new Date());
              setSelectedDay(new Date());
            }}
            className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrentWeekDate(subWeeks(currentWeekDate, 1))}
            className="w-7 h-7 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center border border-neutral-800"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentWeekDate(addWeeks(currentWeekDate, 1))}
            className="w-7 h-7 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center border border-neutral-800"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Week Strip (7 Days) */}
      <div className="grid grid-cols-7 gap-1.5 bg-neutral-950 p-2 rounded-2xl border border-neutral-800/80">
        {weekDays.map((d) => {
          const dStr = format(d, 'yyyy-MM-dd');
          const isSelected = isSameDay(d, selectedDay);
          const isToday = dStr === todayStr;
          const dayTasksCount = tasks.filter(t => t.date === dStr && t.status !== 'cancelled').length;
          const hasPending = tasks.some(t => t.date === dStr && t.status === 'pending');

          return (
            <button
              key={dStr}
              onClick={() => setSelectedDay(d)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-150 ${
                isSelected
                  ? 'bg-gradient-to-b from-red-600 to-rose-600 text-white font-black shadow-md shadow-red-600/30 scale-102'
                  : isToday
                    ? 'bg-neutral-900 text-red-400 font-bold border border-red-500/40'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
              }`}
            >
              <span className="text-[10px] uppercase font-semibold">
                {format(d, 'EEE', { locale: es }).slice(0, 3)}
              </span>
              <span className="text-sm font-black my-0.5">
                {format(d, 'd')}
              </span>
              
              {/* Task dot count */}
              <div className="h-1.5 flex items-center justify-center mt-0.5">
                {dayTasksCount > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isSelected 
                      ? 'bg-white' 
                      : hasPending 
                        ? 'bg-red-500' 
                        : 'bg-neutral-600'
                  }`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Agenda */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Agenda — {formatDateSpanish(selectedDayStr)}
          </h4>
          <span className="text-xs text-neutral-500">
            {sortedDayTasks.length} actividades
          </span>
        </div>

        {/* Routines for this day */}
        {activeRoutinesForDay.length > 0 && (
          <div className="space-y-2">
            {activeRoutinesForDay.map(r => {
              const cat = getCategoryById(r.categoryId);
              return (
                <div 
                  key={r.id}
                  className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-red-400 font-bold font-mono">{r.time}</span>
                    <span className="font-bold text-neutral-200">{r.title}</span>
                    {cat && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                        {cat.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-md border border-neutral-800">
                    Rutina
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Tasks List */}
        {sortedDayTasks.length === 0 && activeRoutinesForDay.length === 0 ? (
          <div className="text-center py-10 bg-neutral-950 rounded-2xl border border-neutral-900">
            <p className="text-xs text-neutral-400">No hay tareas programadas para este día.</p>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="mt-3 text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1"
            >
              <Plus size={13} />
              Añadir tarea en esta fecha
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedDayTasks.map((t) => {
              const cat = getCategoryById(t.categoryId);
              const isDone = t.status === 'completed';

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isDone 
                      ? 'bg-neutral-950/60 border-neutral-900 opacity-70' 
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskStatus(t.id);
                      }}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                        isDone ? 'bg-red-600 border-red-600 text-white' : 'border-neutral-700 hover:border-red-500'
                      }`}
                    >
                      {isDone && <Check size={12} strokeWidth={3} />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        {t.time && (
                          <span className="text-[11px] font-bold text-red-400 font-mono">
                            {t.time}
                          </span>
                        )}
                        {cat && (
                          <span 
                            className="text-[10px] font-medium px-1.5 py-0.2 rounded"
                            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                          >
                            {cat.name}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-medium truncate ${isDone ? 'line-through text-neutral-500' : 'text-neutral-100'}`}>
                        {t.title}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-neutral-500 shrink-0">
                    {t.durationMinutes ? `${t.durationMinutes} min` : '→'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
