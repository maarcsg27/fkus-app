import React, { useState } from 'react';
import { Routine } from '../../types';
import { useFKUS } from '../../context/FKUSContext';
import { IconRenderer } from '../common/IconRenderer';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Check, 
  Zap, 
  ListChecks
} from 'lucide-react';

interface RoutineExpandableItemProps {
  routine: Routine;
  defaultExpanded?: boolean;
}

export const RoutineExpandableItem: React.FC<RoutineExpandableItemProps> = ({ 
  routine, 
  defaultExpanded = false 
}) => {
  const { getCategoryById } = useFKUS();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [completedStepIds, setCompletedStepIds] = useState<Record<string, boolean>>({});

  const category = getCategoryById(routine.categoryId);
  const totalSteps = routine.steps.length;
  const completedCount = Object.values(completedStepIds).filter(Boolean).length;

  const toggleStep = (stepId: string) => {
    setCompletedStepIds(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isExpanded 
        ? 'bg-neutral-950 border-red-500/40 shadow-card' 
        : 'bg-neutral-950 border-neutral-800/90 hover:border-neutral-700'
    }`}>
      {/* Routine Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 flex items-center justify-between gap-2.5 cursor-pointer select-none group"
      >
        <div className="flex items-center space-x-2.5 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
          {/* Time Badge */}
          {routine.time && (
            <span className="text-[11px] font-black text-red-500 font-mono bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20 shrink-0">
              {routine.time}
            </span>
          )}

          {/* Title */}
          <span className="font-bold text-xs sm:text-sm text-neutral-100 group-hover:text-white truncate">
            {routine.title}
          </span>

          {/* Category Pill */}
          {category && (
            <span 
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 inline-flex items-center gap-1"
              style={{ backgroundColor: `${category.color}15`, color: category.color }}
            >
              <IconRenderer name={category.icon} size={10} color={category.color} />
              {category.name}
            </span>
          )}
        </div>

        {/* Right Actions & Expand Chevron */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10.5px] font-semibold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-lg">
            {totalSteps} {totalSteps === 1 ? 'paso' : 'pasos'}
          </span>

          <div className={`w-6 h-6 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-white transition-transform duration-200 ${
            isExpanded ? 'rotate-180 text-red-400 bg-red-500/10' : ''
          }`}>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Expandable Steps Section */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-neutral-800/80 bg-neutral-900/30 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Subtitle / Progress */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-neutral-500 flex items-center gap-1">
              <ListChecks size={12} className="text-red-500" />
              Pasos de la rutina
            </span>
            {completedCount > 0 && (
              <span className="text-red-400 font-bold text-[10.5px]">
                {completedCount}/{totalSteps} completados
              </span>
            )}
          </div>

          {/* Steps List */}
          <div className="space-y-1.5">
            {routine.steps.map((step, idx) => {
              const isStepDone = !!completedStepIds[step.id];
              return (
                <div 
                  key={step.id || idx}
                  onClick={() => toggleStep(step.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isStepDone 
                      ? 'bg-neutral-950/40 border-neutral-800/40 opacity-60' 
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                    {/* Step Checkbox */}
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      isStepDone 
                        ? 'bg-red-600 border-red-600 text-white' 
                        : 'border-neutral-700 hover:border-red-500'
                    }`}>
                      {isStepDone && <Check size={10} strokeWidth={3} />}
                    </div>

                    <span className="text-[11px] font-mono font-bold text-red-500/80 shrink-0">
                      {idx + 1}.
                    </span>

                    <span className={`text-xs font-medium truncate ${
                      isStepDone ? 'line-through text-neutral-500' : 'text-neutral-200'
                    }`}>
                      {step.title}
                    </span>
                  </div>

                  {step.durationMinutes && (
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 ml-2 shrink-0">
                      {step.durationMinutes}m
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
