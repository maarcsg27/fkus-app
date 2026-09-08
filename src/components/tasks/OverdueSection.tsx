import React, { useState } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { AlertCircle, Calendar, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getRelativeDateLabel } from '../../utils/dateUtils';
import { IconRenderer } from '../common/IconRenderer';

export const OverdueSection: React.FC = () => {
  const { overdueTasks, quickRescheduleTask, toggleTaskStatus, deleteTask, getCategoryById, setSelectedTaskId } = useFKUS();
  const [isExpanded, setIsExpanded] = useState(true);
  const [customDatePickerId, setCustomDatePickerId] = useState<string | null>(null);

  if (overdueTasks.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl bg-neutral-950 border border-red-600/40 p-4 shadow-sm">
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center">
            <AlertCircle size={17} />
          </div>
          <div>
            <h3 className="text-sm font-black text-red-400 flex items-center gap-1.5">
              <span>Tareas Atrasadas</span>
              <span className="text-xs px-2 py-0.2 rounded-full bg-red-500/20 text-red-400 font-black">
                {overdueTasks.length}
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              No dejes que se acumulen. Reprograma o completa en 1 toque.
            </p>
          </div>
        </div>

        <button className="text-neutral-400 hover:text-white p-1">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Task List */}
      {isExpanded && (
        <div className="mt-3.5 space-y-3">
          {overdueTasks.map((task) => {
            const category = getCategoryById(task.categoryId);

            return (
              <div 
                key={task.id}
                className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div 
                    onClick={() => setSelectedTaskId(task.id)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                        {getRelativeDateLabel(task.date)}
                      </span>
                      {category && (
                        <span 
                          className="inline-flex items-center gap-1 text-[10.5px] font-medium px-1.5 py-0.2 rounded"
                          style={{ backgroundColor: `${category.color}15`, color: category.color }}
                        >
                          <IconRenderer name={category.icon} size={10} color={category.color} />
                          {category.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-neutral-100">{task.title}</p>
                  </div>

                  {/* Actions: Complete or Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      title="Marcar completada"
                      className="w-7 h-7 rounded-lg bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition-all"
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      title="Eliminar"
                      className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Quick Reschedule Buttons */}
                <div className="pt-2 border-t border-neutral-800 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10.5px] font-semibold text-neutral-400 mr-1">
                    Mover a:
                  </span>
                  
                  <button
                    onClick={() => quickRescheduleTask(task.id, 'today')}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-colors"
                  >
                    Hoy
                  </button>

                  <button
                    onClick={() => quickRescheduleTask(task.id, 'tomorrow')}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  >
                    Mañana
                  </button>

                  <button
                    onClick={() => quickRescheduleTask(task.id, 'this_week')}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  >
                    Esta semana
                  </button>

                  <button
                    onClick={() => setCustomDatePickerId(customDatePickerId === task.id ? null : task.id)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 inline-flex items-center gap-1 transition-colors"
                  >
                    <Calendar size={11} />
                    Elegir fecha
                  </button>

                  {customDatePickerId === task.id && (
                    <div className="w-full mt-1.5 flex items-center gap-2">
                      <input
                        type="date"
                        defaultValue={task.date}
                        onChange={(e) => {
                          if (e.target.value) {
                            quickRescheduleTask(task.id, 'date', e.target.value);
                            setCustomDatePickerId(null);
                          }
                        }}
                        className="text-xs bg-black border border-neutral-700 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-red-500"
                      />
                      <button
                        onClick={() => setCustomDatePickerId(null)}
                        className="text-xs text-neutral-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
