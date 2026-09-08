import React from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { X, CheckCircle2, Clock, AlertCircle, BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { IconRenderer } from '../common/IconRenderer';

export const StatsModal: React.FC = () => {
  const { 
    isStatsModalOpen, 
    setIsStatsModalOpen, 
    tasks, 
    completedTasks, 
    overdueTasks, 
    inboxTasks,
    categories,
    getCategoryById 
  } = useFKUS();

  if (!isStatsModalOpen) return null;

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  // Count by category
  const categoryCounts = categories.map(cat => {
    const count = tasks.filter(t => t.categoryId === cat.id).length;
    const completed = tasks.filter(t => t.categoryId === cat.id && t.status === 'completed').length;
    return { ...cat, count, completed };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <BarChart3 size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Estadísticas de Acción</h3>
          </div>
          <button
            onClick={() => setIsStatsModalOpen(false)}
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10.5px] uppercase font-bold text-neutral-400 block mb-1">
                Completadas
              </span>
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={20} className="text-emerald-400" />
                <span className="text-2xl font-black text-white">{completedTasks.length}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10.5px] uppercase font-bold text-neutral-400 block mb-1">
                Pendientes
              </span>
              <div className="flex items-center space-x-2">
                <Clock size={20} className="text-amber-400" />
                <span className="text-2xl font-black text-white">{pendingTasks.length}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10.5px] uppercase font-bold text-neutral-400 block mb-1">
                Atrasadas
              </span>
              <div className="flex items-center space-x-2">
                <AlertCircle size={20} className="text-rose-400" />
                <span className="text-2xl font-black text-white">{overdueTasks.length}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10.5px] uppercase font-bold text-neutral-400 block mb-1">
                En Inbox
              </span>
              <div className="flex items-center space-x-2">
                <TrendingUp size={20} className="text-teal-400" />
                <span className="text-2xl font-black text-white">{inboxTasks.length}</span>
              </div>
            </div>
          </div>

          {/* Categories Usage Breakdown */}
          <div className="space-y-2 pt-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Categorías más utilizadas
            </h4>

            <div className="space-y-2">
              {categoryCounts.filter(c => c.count > 0).map(cat => (
                <div key={cat.id} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <IconRenderer name={cat.icon} size={14} color={cat.color} />
                    <span className="text-neutral-200 font-medium">{cat.name}</span>
                  </div>
                  <span className="text-neutral-400 font-mono text-[11px]">
                    {cat.completed} hechas / {cat.count} total
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Philosophy Note */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-neutral-300">
            <span className="font-bold text-emerald-400 block mb-0.5">Regla de oro de FKUS:</span>
            "El éxito de la aplicación no se mide por cuánto tiempo pasas dentro de ella, sino por cuántas cosas consigues hacer gracias a ella."
          </div>
        </div>
      </div>
    </div>
  );
};
