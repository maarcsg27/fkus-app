import React from 'react';
import { Goal } from '../../types';
import { useFKUS } from '../../context/FKUSContext';
import { IconRenderer } from '../common/IconRenderer';
import { getDaysRemaining } from '../../utils/dateUtils';
import { Target, Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const { getCategoryById, getGoalStats, setSelectedGoalId } = useFKUS();
  const category = getCategoryById(goal.categoryId);
  const countdown = getDaysRemaining(goal.targetDate);
  const stats = getGoalStats(goal.id);

  return (
    <div 
      onClick={() => onClick ? onClick() : setSelectedGoalId(goal.id)}
      className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-teal-500/40 cursor-pointer transition-all duration-150 shadow-subtle hover:shadow-card group"
    >
      {/* Top row: Category & Days remaining */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {category && (
          <span 
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md"
            style={{ backgroundColor: `${category.color}15`, color: category.color }}
          >
            <IconRenderer name={category.icon} size={11} color={category.color} />
            {category.name}
          </span>
        )}

        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
          countdown.isPast
            ? 'text-rose-400 bg-rose-500/15'
            : countdown.days <= 14
              ? 'text-amber-400 bg-amber-500/15'
              : 'text-teal-400 bg-teal-500/10'
        }`}>
          <Clock size={11} />
          {countdown.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors tracking-tight">
        {goal.title}
      </h3>

      {/* Description */}
      {goal.description && (
        <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
          {goal.description}
        </p>
      )}

      {/* Activity Status (Explicitly: X completadas · Y pendientes) */}
      <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <span className="flex items-center gap-1.5 font-medium text-neutral-300">
          <span className="text-emerald-400 font-bold">{stats.completed}</span> completadas
          <span className="text-neutral-600">·</span>
          <span className="text-amber-400 font-bold">{stats.pending}</span> pendientes
        </span>

        <span className="text-[11px] text-teal-400/80 group-hover:text-teal-300 font-medium">
          Ver tareas →
        </span>
      </div>
    </div>
  );
};
