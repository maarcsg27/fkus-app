import React from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { CheckSquare, Target, Zap, X, Plus } from 'lucide-react';

export const QuickCreateMenu: React.FC = () => {
  const { 
    isCreateMenuOpen, 
    setIsCreateMenuOpen, 
    setIsQuickAddOpen, 
    setIsGoalFormOpen, 
    setIsRoutineFormOpen,
    setRoutineToEdit 
  } = useFKUS();

  if (!isCreateMenuOpen) return null;

  const handleSelectTask = () => {
    setIsCreateMenuOpen(false);
    setIsQuickAddOpen(true);
  };

  const handleSelectGoal = () => {
    setIsCreateMenuOpen(false);
    setIsGoalFormOpen(true);
  };

  const handleSelectRoutine = () => {
    setIsCreateMenuOpen(false);
    setRoutineToEdit(null);
    setIsRoutineFormOpen(true);
  };

  return (
    <div 
      onClick={() => setIsCreateMenuOpen(false)}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Plus size={15} strokeWidth={2.8} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">¿Qué deseas crear?</h3>
          </div>
          <button
            onClick={() => setIsCreateMenuOpen(false)}
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* 3 Options */}
        <div className="space-y-2.5">
          {/* 1. Tarea */}
          <button
            onClick={handleSelectTask}
            className="w-full p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-900/90 flex items-center space-x-3.5 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckSquare size={20} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Nueva Tarea
                </h4>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">
                  Rápido
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Para hoy, una fecha concreta o guardar en Inbox.
              </p>
            </div>
          </button>

          {/* 2. Objetivo */}
          <button
            onClick={handleSelectGoal}
            className="w-full p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-teal-500/50 hover:bg-neutral-900/90 flex items-center space-x-3.5 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Target size={20} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                  Nuevo Objetivo
                </h4>
                <span className="text-[10px] bg-teal-500/10 text-teal-400 px-1.5 py-0.2 rounded font-semibold">
                  Largo plazo
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Metas con fecha límite y tareas conectadas.
              </p>
            </div>
          </button>

          {/* 3. Rutina */}
          <button
            onClick={handleSelectRoutine}
            className="w-full p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-900/90 flex items-center space-x-3.5 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Zap size={20} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Nueva Rutina
                </h4>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded font-semibold">
                  Hábitos
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Secuencia de acciones con horario y repetición.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
