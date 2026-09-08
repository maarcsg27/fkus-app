import React, { useState } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { formatDateSpanish, getTodayString } from '../../utils/dateUtils';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Plus, Check } from 'lucide-react';

export const CalendarDayView: React.FC = () => {
  const { 
    tasks, 
    routines, 
    getCategoryById, 
    toggleTaskStatus, 
    setSelectedTaskId, 
    setIsQuickAddOpen 
  } = useFKUS();

  const [currentDate, setCurrentDate] = useState(new Date());
  const currentDateStr = format(currentDate, 'yyyy-MM-dd');
  const todayStr = getTodayString();

  const dayTasks = tasks.filter(t => t.date === currentDateStr && t.status !== 'cancelled');

  // Generate 24-hour slots or key active hours (07:00 to 22:00)
  const hours = Array.from({ length: 16 }, (_, i) => {
    const h = i + 7;
    return `${h.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="space-y-4">
      {/* Day Navigator */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-base font-bold text-white capitalize">
            {formatDateSpanish(currentDateStr)}
          </h3>
          <p className="text-[11px] text-neutral-400">
            {currentDateStr === todayStr ? 'Día de hoy' : 'Planificación del día'}
          </p>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrentDate(subDays(currentDate, 1))}
            className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentDate(addDays(currentDate, 1))}
            className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Hourly Timeline */}
      <div className="space-y-2 bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800/80">
        {hours.map((hourStr) => {
          const hourNum = parseInt(hourStr.split(':')[0], 10);
          
          // Find tasks that match this hour
          const matchingTasks = dayTasks.filter(t => {
            if (!t.time) return false;
            const taskHour = parseInt(t.time.split(':')[0], 10);
            return taskHour === hourNum;
          });

          // Find routines matching this hour
          const matchingRoutines = routines.filter(r => {
            if (!r.time || !r.isActive) return false;
            const routineHour = parseInt(r.time.split(':')[0], 10);
            return routineHour === hourNum;
          });

          return (
            <div key={hourStr} className="flex items-start gap-3 min-h-[44px] py-1 border-b border-neutral-800/40">
              {/* Hour Label */}
              <div className="w-12 text-[11px] font-mono font-medium text-neutral-500 pt-1 shrink-0">
                {hourStr}
              </div>

              {/* Slot Items */}
              <div className="flex-1 space-y-1.5">
                {matchingRoutines.map(r => (
                  <div key={r.id} className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                    <span className="font-semibold">⚡ {r.title} ({r.time})</span>
                    <span className="text-[10px] text-emerald-400/70">Rutina</span>
                  </div>
                ))}

                {matchingTasks.map(t => {
                  const cat = getCategoryById(t.categoryId);
                  const isDone = t.status === 'completed';
                  return (
                    <div 
                      key={t.id}
                      onClick={() => setSelectedTaskId(t.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer ${
                        isDone ? 'bg-neutral-950/40 border-neutral-800/40 opacity-70' : 'bg-neutral-900 border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskStatus(t.id);
                          }}
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isDone ? 'bg-emerald-500 border-emerald-500 text-neutral-950' : 'border-neutral-600'
                          }`}
                        >
                          {isDone && <Check size={10} strokeWidth={3} />}
                        </button>
                        <span className={`text-xs truncate ${isDone ? 'line-through text-neutral-500' : 'text-white'}`}>
                          {t.title}
                        </span>
                      </div>
                      {cat && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                          {cat.name}
                        </span>
                      )}
                    </div>
                  );
                })}

                {matchingTasks.length === 0 && matchingRoutines.length === 0 && (
                  <div className="h-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
