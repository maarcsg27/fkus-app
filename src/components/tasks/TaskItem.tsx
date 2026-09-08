import React, { useState } from 'react';
import { Task } from '../../types';
import { useFKUS } from '../../context/FKUSContext';
import { IconRenderer } from '../common/IconRenderer';
import { 
  Check, 
  Clock, 
  Repeat, 
  Target, 
  ListChecks, 
  MoreVertical, 
  Calendar, 
  Trash2, 
  Copy
} from 'lucide-react';
import { checkIsOverdue, getRelativeDateLabel } from '../../utils/dateUtils';

interface TaskItemProps {
  task: Task;
  showDate?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, showDate = false }) => {
  const { 
    toggleTaskStatus, 
    setSelectedTaskId, 
    getCategoryById, 
    getGoalById,
    deleteTask,
    duplicateTask,
    quickRescheduleTask 
  } = useFKUS();

  const [showMenu, setShowMenu] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const category = getCategoryById(task.categoryId);
  const goal = task.goalId ? getGoalById(task.goalId) : null;
  const isOverdue = checkIsOverdue(task.date, task.status);
  const isCompleted = task.status === 'completed';

  const completedSubtasksCount = task.subtasks.filter(s => s.completed).length;

  const priorityColors = {
    low: 'text-neutral-500 bg-neutral-900 border-neutral-800',
    normal: 'text-neutral-400 bg-neutral-900 border-neutral-800',
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    urgent: 'text-red-400 bg-red-600/20 border-red-500/50 font-black'
  };

  return (
    <div 
      className={`group relative flex items-start gap-3 p-3.5 rounded-2xl transition-all duration-150 border ${
        isCompleted 
          ? 'bg-neutral-950/60 border-neutral-900 opacity-65' 
          : isOverdue 
            ? 'bg-neutral-950 border-red-600/40 shadow-sm' 
            : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700 shadow-subtle'
      }`}
    >
      {/* Tactile Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleTaskStatus(task.id);
        }}
        aria-label={isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
        className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 border ${
          isCompleted
            ? 'bg-red-600 border-red-600 text-white scale-95 shadow-sm shadow-red-600/30'
            : isOverdue
              ? 'border-red-500/60 hover:border-red-400 bg-red-500/10'
              : 'border-neutral-700 hover:border-red-500 bg-neutral-900/60 hover:bg-neutral-900'
        }`}
      >
        {isCompleted && <Check size={14} strokeWidth={3.2} />}
      </button>

      {/* Main Content (Opens Detail) */}
      <div 
        onClick={() => setSelectedTaskId(task.id)}
        className="flex-1 min-w-0 cursor-pointer"
      >
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {/* Time Badge */}
          {task.time && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
              isCompleted 
                ? 'text-neutral-500 bg-neutral-900' 
                : isOverdue
                  ? 'text-red-400 bg-red-500/15 border border-red-500/20'
                  : 'text-red-400 bg-red-500/10'
            }`}>
              <Clock size={11} />
              {task.time}
            </span>
          )}

          {/* Date Badge if explicitly shown */}
          {showDate && task.date && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
              isOverdue ? 'text-red-400 bg-red-500/10' : 'text-neutral-400 bg-neutral-900'
            }`}>
              <Calendar size={11} />
              {getRelativeDateLabel(task.date)}
            </span>
          )}

          {/* Category Badge */}
          {category && (
            <span 
              className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-md"
              style={{ 
                backgroundColor: `${category.color}15`, 
                color: category.color 
              }}
            >
              <IconRenderer name={category.icon} size={11} color={category.color} />
              {category.name}
            </span>
          )}

          {/* Priority Pill if high or urgent */}
          {(task.priority === 'high' || task.priority === 'urgent') && (
            <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${priorityColors[task.priority]}`}>
              {task.priority === 'urgent' ? 'Urgente' : 'Alta'}
            </span>
          )}
        </div>

        {/* Task Title */}
        <h4 className={`text-sm font-medium leading-snug tracking-tight break-words ${
          isCompleted 
            ? 'line-through text-neutral-500 font-normal' 
            : 'text-neutral-100 group-hover:text-white'
        }`}>
          {task.title}
        </h4>

        {/* Optional Brief Description or Notes Snippet */}
        {task.description && !isCompleted && (
          <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
            {task.description}
          </p>
        )}

        {/* Extra indicators: Subtasks, Recurrence, Goal */}
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-neutral-400 flex-wrap">
          {task.subtasks.length > 0 && (
            <span className="inline-flex items-center gap-1 text-neutral-400">
              <ListChecks size={12} className="text-neutral-500" />
              {completedSubtasksCount}/{task.subtasks.length}
            </span>
          )}

          {task.recurrence && task.recurrence.type !== 'none' && (
            <span className="inline-flex items-center gap-1 text-red-400/80">
              <Repeat size={11} />
              <span className="text-[10.5px]">Recurrente</span>
            </span>
          )}

          {goal && (
            <span className="inline-flex items-center gap-1 text-neutral-300 truncate max-w-[170px]">
              <Target size={11} className="text-red-500 shrink-0" />
              <span className="truncate">{goal.title}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action / Context Menu */}
      <div className="relative shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
            setShowReschedule(false);
          }}
          aria-label="Opciones de tarea"
          className="w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 flex items-center justify-center transition-colors"
        >
          <MoreVertical size={15} />
        </button>

        {showMenu && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-8 w-44 py-1 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              onClick={() => {
                setShowReschedule(!showReschedule);
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-900 flex items-center gap-2"
            >
              <Calendar size={13} className="text-red-500" />
              <span>Reprogramar...</span>
            </button>

            {showReschedule && (
              <div className="bg-neutral-900/80 py-1 border-y border-neutral-800">
                <button
                  onClick={() => {
                    quickRescheduleTask(task.id, 'today');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-5 py-1 text-[11px] text-neutral-300 hover:text-red-400 hover:bg-neutral-800"
                >
                  • Hoy
                </button>
                <button
                  onClick={() => {
                    quickRescheduleTask(task.id, 'tomorrow');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-5 py-1 text-[11px] text-neutral-300 hover:text-red-400 hover:bg-neutral-800"
                >
                  • Mañana
                </button>
                <button
                  onClick={() => {
                    quickRescheduleTask(task.id, 'this_week');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-5 py-1 text-[11px] text-neutral-300 hover:text-red-400 hover:bg-neutral-800"
                >
                  • Esta semana
                </button>
              </div>
            )}

            <button
              onClick={() => {
                duplicateTask(task.id);
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-900 flex items-center gap-2"
            >
              <Copy size={13} className="text-neutral-400" />
              <span>Duplicar</span>
            </button>

            <button
              onClick={() => {
                deleteTask(task.id);
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
            >
              <Trash2 size={13} />
              <span>Eliminar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
