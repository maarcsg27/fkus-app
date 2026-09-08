import React, { useState } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { GoalCard } from '../goals/GoalCard';
import { GoalFormModal } from '../goals/GoalFormModal';
import { GoalDetailModal } from '../goals/GoalDetailModal';
import { Target, Plus, Sparkles } from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goals, setIsGoalFormOpen } = useFKUS();

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Objetivos
          </h1>
          <p className="text-xs text-neutral-400">
            Tus metas a medio y largo plazo. Conéctalas a tu acción diaria.
          </p>
        </div>

        <button
          onClick={() => setIsGoalFormOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:brightness-110 text-neutral-950 font-bold text-xs inline-flex items-center gap-1 shadow-sm"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Nuevo Objetivo</span>
        </button>
      </div>

      {/* Motivational Prompt Card (#16) */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex items-start space-x-3">
        <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles size={15} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-teal-300">
            El puente entre tus metas y tu día a día
          </h4>
          <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
            Un objetivo no progresa solo. Añade tareas puntuales vinculadas a cada objetivo y avanza paso a paso.
          </p>
        </div>
      </div>

      {/* Goals Grid / List */}
      {goals.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900/40 rounded-2xl border border-neutral-800/60 p-4">
          <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-2">
            <Target size={20} />
          </div>
          <p className="text-sm font-bold text-neutral-200">No hay objetivos activos</p>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Define qué quieres lograr en los próximos meses (un proyecto, un viaje, una carrera...).
          </p>
          <button
            onClick={() => setIsGoalFormOpen(true)}
            className="mt-3 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-xs rounded-xl inline-flex items-center gap-1"
          >
            <Plus size={14} />
            <span>Crear primer objetivo</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {/* Goal Detail Modal */}
      <GoalDetailModal />
    </div>
  );
};
