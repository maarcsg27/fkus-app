import React, { useState } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { getTodayString } from '../../utils/dateUtils';

export const CalendarMonthView: React.FC = () => {
  const { tasks, setSelectedTaskId, getCategoryById, toggleTaskStatus } = useFKUS();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const todayStr = getTodayString();
  const selectedDayStr = format(selectedDay, 'yyyy-MM-dd');

  const selectedDayTasks = tasks.filter(t => t.date === selectedDayStr && t.status !== 'cancelled');

  return (
    <div className="space-y-4">
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-white capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setCurrentMonth(new Date());
              setSelectedDay(new Date());
            }}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] font-semibold uppercase text-neutral-400">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mié</span>
        <span>Jue</span>
        <span>Vie</span>
        <span>Sáb</span>
        <span>Dom</span>
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 gap-1 bg-neutral-900/90 p-2 rounded-2xl border border-neutral-800">
        {days.map((d) => {
          const dStr = format(d, 'yyyy-MM-dd');
          const isSelected = isSameDay(d, selectedDay);
          const isCurrentMonth = isSameMonth(d, currentMonth);
          const isToday = dStr === todayStr;
          const dayTasks = tasks.filter(t => t.date === dStr && t.status !== 'cancelled');

          return (
            <button
              key={dStr}
              onClick={() => setSelectedDay(d)}
              className={`min-h-[50px] p-1 flex flex-col items-center justify-start rounded-xl transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-emerald-500 to-teal-500 text-neutral-950 font-bold shadow-md'
                  : isToday
                    ? 'bg-neutral-800 text-emerald-400 font-bold border border-emerald-500/40'
                    : isCurrentMonth
                      ? 'text-neutral-200 hover:bg-neutral-800/60'
                      : 'text-neutral-600 hover:bg-neutral-800/30'
              }`}
            >
              <span className="text-xs">{format(d, 'd')}</span>
              
              {/* Task indicators */}
              <div className="flex flex-wrap gap-0.5 justify-center mt-1 max-w-full">
                {dayTasks.slice(0, 3).map((t, idx) => {
                  const cat = getCategoryById(t.categoryId);
                  return (
                    <span 
                      key={idx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ 
                        backgroundColor: isSelected 
                          ? '#0a0a0a' 
                          : cat?.color || '#22c55e' 
                      }}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Task List */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Tareas del {format(selectedDay, "d 'de' MMMM", { locale: es })}
        </h4>

        {selectedDayTasks.length === 0 ? (
          <p className="text-xs text-neutral-500 py-3 text-center bg-neutral-900/40 rounded-xl">
            Sin tareas en este día.
          </p>
        ) : (
          <div className="space-y-2">
            {selectedDayTasks.map(t => {
              const cat = getCategoryById(t.categoryId);
              const isDone = t.status === 'completed';

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskStatus(t.id);
                      }}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                        isDone ? 'bg-emerald-500 border-emerald-500 text-neutral-950' : 'border-neutral-600'
                      }`}
                    >
                      {isDone && <Check size={12} strokeWidth={3} />}
                    </button>
                    <span className={`text-xs truncate ${isDone ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                      {t.title}
                    </span>
                  </div>
                  {t.time && <span className="text-[11px] text-emerald-400 font-mono">{t.time}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
