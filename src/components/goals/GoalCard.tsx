import React from 'react';
import { Goal } from '../../types';
import { useFKUS } from '../../context/FKUSContext';
import { IconRenderer } from '../common/IconRenderer';
import { getDaysRemaining } from '../../utils/dateUtils';
import { Clock } from 'lucide-react';

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
      className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 hover:border-red-500/50 cursor-pointer transition-all duration-150 shadow-subtle hover:shadow-card group"
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

        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
          countdown.isPast
            ? 'text-red-400 bg-red-500/15 border border-red-500/20'
            : countdown.days <= 14
              ? 'text-rose-400 bg-rose-500/15 border border-rose-500/20'
              : 'text-red-400 bg-neutral-900 border border-neutral-800'
        }`}>
          <Clock size={11} />
          {countdown.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-black text-white group-hover:text-red-400 transition-colors tracking-tight">
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
          <span className="text-red-500 font-bold">{stats.completed}</span> completadas
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400 font-medium">{stats.pending} pendientes</span>
        </span>

        <span className="text-[11px] text-red-400 font-bold group-hover:underline">
          Ver tareas →
        </span>
      </div>
    </div>
  );
};
