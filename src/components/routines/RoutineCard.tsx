import React, { useState } from 'react';
import { Routine } from '../../types';
import { useFKUS } from '../../context/FKUSContext';
import { IconRenderer } from '../common/IconRenderer';
import { Clock, Repeat, ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react';

interface RoutineCardProps {
  routine: Routine;
  onEdit?: (routine: Routine) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onEdit }) => {
  const { getCategoryById, deleteRoutine, setSelectedRoutineId } = useFKUS();
  const [isExpanded, setIsExpanded] = useState(false);
  const category = getCategoryById(routine.categoryId);

  return (
    <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-700 transition-all shadow-subtle">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {routine.time && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <Clock size={11} />
                {routine.time}
              </span>
            )}

            {category && (
              <span 
                className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-md"
                style={{ backgroundColor: `${category.color}15`, color: category.color }}
              >
                <IconRenderer name={category.icon} size={11} color={category.color} />
                {category.name}
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-neutral-400 bg-neutral-800/70 px-2 py-0.5 rounded-md">
              <Repeat size={10} />
              {routine.recurrence.type === 'daily' 
                ? 'Diaria' 
                : routine.recurrence.type === 'weekdays' 
                  ? 'L - V' 
                  : 'Recurrente'}
            </span>
          </div>

          <h4 className="text-sm font-bold text-neutral-100">{routine.title}</h4>
          {routine.description && (
            <p className="text-xs text-neutral-400 mt-0.5">{routine.description}</p>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => onEdit ? onEdit(routine) : setSelectedRoutineId(routine.id)}
            className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            title="Editar rutina"
          >
            <Edit3 size={13} />
          </button>

          <button
            onClick={() => deleteRoutine(routine.id)}
            className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 flex items-center justify-center transition-colors"
            title="Eliminar rutina"
          >
            <Trash2 size={13} />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Routine Steps Preview */}
      <div className="mt-3 pt-3 border-t border-neutral-800/60">
        <div className="space-y-1.5">
          {routine.steps.slice(0, isExpanded ? undefined : 3).map((step, idx) => (
            <div key={step.id || idx} className="flex items-center space-x-2 text-xs text-neutral-300">
              <span className="text-emerald-400 font-mono text-[11px] shrink-0">→</span>
              <span className="truncate flex-1">{step.title}</span>
              {step.durationMinutes && (
                <span className="text-[10px] text-neutral-500 font-mono">{step.durationMinutes}m</span>
              )}
            </div>
          ))}

          {!isExpanded && routine.steps.length > 3 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-[11px] text-emerald-400/80 hover:text-emerald-300 pt-0.5 block"
            >
              +{routine.steps.length - 3} pasos más...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
