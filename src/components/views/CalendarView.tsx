import React, { useState } from 'react';
import { CalendarWeekView } from '../calendar/CalendarWeekView';
import { CalendarDayView } from '../calendar/CalendarDayView';
import { CalendarMonthView } from '../calendar/CalendarMonthView';
import { useFKUS } from '../../context/FKUSContext';
import { Plus } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [calendarMode, setCalendarMode] = useState<'week' | 'day' | 'month'>('week');
  const { setIsQuickAddOpen } = useFKUS();

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* View Switcher Bar */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center space-x-1 bg-neutral-950 p-1 rounded-2xl border border-neutral-800">
          <button
            onClick={() => setCalendarMode('week')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              calendarMode === 'week'
                ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Semana
          </button>

          <button
            onClick={() => setCalendarMode('day')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              calendarMode === 'day'
                ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Día
          </button>

          <button
            onClick={() => setCalendarMode('month')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              calendarMode === 'month'
                ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Mes
          </button>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold border border-neutral-800 inline-flex items-center gap-1.5"
        >
          <Plus size={14} className="text-red-500" />
          <span>Planificar</span>
        </button>
      </div>

      {/* Render Active View */}
      {calendarMode === 'week' && <CalendarWeekView />}
      {calendarMode === 'day' && <CalendarDayView />}
      {calendarMode === 'month' && <CalendarMonthView />}
    </div>
  );
};
