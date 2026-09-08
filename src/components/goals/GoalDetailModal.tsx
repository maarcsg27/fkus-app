import React, { useState } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { IconRenderer } from '../common/IconRenderer';
import { getDaysRemaining, formatDateSpanish } from '../../utils/dateUtils';
import { 
  X, 
  Calendar, 
  Check, 
  Clock, 
  Trash2, 
  Edit3,
  ListTodo
} from 'lucide-react';
import { GoalFormModal } from './GoalFormModal';

export const GoalDetailModal: React.FC = () => {
  const { 
    selectedGoalId, 
    setSelectedGoalId, 
    goals, 
    tasks, 
    addTask, 
    toggleTaskStatus, 
    deleteGoal,
    getCategoryById,
    getGoalStats,
    setSelectedTaskId
  } = useFKUS();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newLinkedTaskTitle, setNewLinkedTaskTitle] = useState('');

  const goal = goals.find(g => g.id === selectedGoalId);

  if (!selectedGoalId || !goal) return null;

  const category = getCategoryById(goal.categoryId);
  const countdown = getDaysRemaining(goal.targetDate);
  const stats = getGoalStats(goal.id);
  const relatedTasks = tasks.filter(t => t.goalId === goal.id);

  const handleCreateLinkedTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newLinkedTaskTitle.trim()) return;

    addTask({
      title: newLinkedTaskTitle.trim(),
      categoryId: goal.categoryId,
      goalId: goal.id,
      priority: goal.priority,
      status: 'pending',
    });

    setNewLinkedTaskTitle('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-xs font-black uppercase tracking-wider text-red-500">
                Objetivo Estratégico
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsEditOpen(true)}
                className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                title="Editar objetivo"
              >
                <Edit3 size={14} />
              </button>

              <button
                onClick={() => deleteGoal(goal.id)}
                className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 flex items-center justify-center transition-colors"
                title="Eliminar objetivo"
              >
                <Trash2 size={14} />
              </button>

              <button
                onClick={() => setSelectedGoalId(null)}
                className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {/* Title and Category */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {category && (
                  <span 
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                  >
                    <IconRenderer name={category.icon} size={11} color={category.color} />
                    {category.name}
                  </span>
                )}
                
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                  <Clock size={11} />
                  {countdown.label}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {goal.title}
              </h2>
            </div>

            {/* Description & Target Date */}
            {goal.description && (
              <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800/80">
                {goal.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <span className="inline-flex items-center gap-1">
                <Calendar size={13} className="text-neutral-500" />
                Fecha objetivo: <strong className="text-neutral-200">{formatDateSpanish(goal.targetDate)}</strong>
              </span>
            </div>

            {/* Activity Status Bar (No fake %, just clean counts) */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10.5px] uppercase font-bold tracking-wider text-neutral-400 block mb-0.5">
                  Actividad conectada
                </span>
                <div className="text-sm font-bold text-white">
                  <span className="text-red-500 font-bold">{stats.completed}</span> completadas
                  <span className="text-neutral-600 mx-1.5">·</span>
                  <span className="text-neutral-300">{stats.pending}</span> pendientes
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 font-medium text-right">
                Total: {stats.total} tareas
              </div>
            </div>

            {/* Notes */}
            {goal.notes && (
              <div>
                <label className="text-[10.5px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                  Notas de enfoque
                </label>
                <p className="text-xs text-neutral-300 bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/60 italic">
                  "{goal.notes}"
                </p>
              </div>
            )}

            {/* Linked Tasks List */}
            <div className="pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ListTodo size={14} className="text-red-500" />
                  <span>Tareas vinculadas a este objetivo</span>
                </label>
              </div>

              {/* Quick inline task creator */}
              <form onSubmit={handleCreateLinkedTask} className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Añadir nueva tarea para acercarte a este objetivo..."
                  value={newLinkedTaskTitle}
                  onChange={(e) => setNewLinkedTaskTitle(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={!newLinkedTaskTitle.trim()}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs disabled:opacity-40 transition-colors shrink-0"
                >
                  + Añadir
                </button>
              </form>

              {/* Tasks List */}
              {relatedTasks.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20">
                  <p className="text-xs text-neutral-400">
                    Aún no hay tareas vinculadas.
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    ¿Qué pequeña acción puedes hacer hoy para acercarte a este objetivo?
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {relatedTasks.map((t) => {
                    const isDone = t.status === 'completed';
                    return (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isDone 
                            ? 'bg-neutral-900/40 border-neutral-800/40 opacity-75' 
                            : 'bg-neutral-900 border-neutral-800'
                        }`}
                      >
                        <div 
                          onClick={() => toggleTaskStatus(t.id)}
                          className="flex items-center space-x-2.5 flex-1 cursor-pointer"
                        >
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                            isDone 
                              ? 'bg-red-600 border-red-600 text-white' 
                              : 'border-neutral-700 hover:border-red-500'
                          }`}>
                            {isDone && <Check size={12} strokeWidth={3} />}
                          </div>

                          <span className={`text-xs font-medium ${
                            isDone ? 'line-through text-neutral-500' : 'text-neutral-200'
                          }`}>
                            {t.title}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {isDone ? (
                            <span className="text-[10.5px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                              ✓ Tarea completada
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedGoalId(null);
                                setSelectedTaskId(t.id);
                              }}
                              className="text-[10.5px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-neutral-800"
                            >
                              Ver
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end">
            <button
              onClick={() => setSelectedGoalId(null)}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditOpen && (
        <GoalFormModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          goalToEdit={goal}
        />
      )}
    </>
  );
};
