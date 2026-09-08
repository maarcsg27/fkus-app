import React, { useState } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { TaskItem } from '../tasks/TaskItem';
import { RoutineCard } from '../routines/RoutineCard';
import { Routine } from '../../types';
import { 
  Inbox, 
  Calendar, 
  CheckSquare, 
  Repeat, 
  Zap, 
  AlertCircle, 
  History, 
  Plus,
  LucideIcon
} from 'lucide-react';
import { OverdueSection } from '../tasks/OverdueSection';

type TaskTab = 'inbox' | 'today' | 'all' | 'recurrent' | 'routines' | 'overdue' | 'history';

export const TasksView: React.FC = () => {
  const { 
    tasks, 
    routines, 
    todayTasks, 
    overdueTasks, 
    inboxTasks, 
    completedTasks, 
    setIsQuickAddOpen,
    setIsRoutineFormOpen,
    setRoutineToEdit,
    selectedCategoryIdFilter,
  } = useFKUS();

  const [activeSubTab, setActiveSubTab] = useState<TaskTab>('inbox');

  // Filter tasks by category if active
  const filterByCat = (taskList: typeof tasks) => {
    if (!selectedCategoryIdFilter) return taskList;
    return taskList.filter(t => t.categoryId === selectedCategoryIdFilter);
  };

  const recurrentTasks = tasks.filter(t => t.recurrence && t.recurrence.type !== 'none' && t.status !== 'cancelled');
  const activeAllTasks = tasks.filter(t => t.status === 'pending');

  const tabs: { id: TaskTab; label: string; count?: number; icon: LucideIcon }[] = [
    { id: 'inbox', label: 'Inbox', count: inboxTasks.length, icon: Inbox },
    { id: 'today', label: 'Hoy', count: todayTasks.filter(t => t.status === 'pending').length, icon: Calendar },
    { id: 'all', label: 'Todas', count: activeAllTasks.length, icon: CheckSquare },
    { id: 'recurrent', label: 'Recurrentes', count: recurrentTasks.length, icon: Repeat },
    { id: 'routines', label: 'Rutinas', count: routines.length, icon: Zap },
    { id: 'overdue', label: 'Atrasadas', count: overdueTasks.length, icon: AlertCircle },
    { id: 'history', label: 'Historial', count: completedTasks.length, icon: History },
  ];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* Header with Title and Add Buttons */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Tareas y Rutinas
          </h1>
          <p className="text-xs text-neutral-400">
            {activeSubTab === 'inbox' && 'Bandeja de entrada: vacía tu mente y organízalas cuando quieras.'}
            {activeSubTab === 'today' && 'Tareas programadas para ejecutarse hoy.'}
            {activeSubTab === 'all' && 'Todas tus tareas pendientes activas.'}
            {activeSubTab === 'recurrent' && 'Actividades periódicas automatizadas.'}
            {activeSubTab === 'routines' && 'Secuencias de hábitos y actividades agrupadas.'}
            {activeSubTab === 'overdue' && 'Tareas de días pasados que no se llegaron a completar.'}
            {activeSubTab === 'history' && 'Registro de tareas ya realizadas.'}
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          {activeSubTab === 'routines' ? (
            <button
              onClick={() => {
                setRoutineToEdit(null);
                setIsRoutineFormOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-1 shadow-sm"
            >
              <Plus size={14} />
              <span>Nueva Rutina</span>
            </button>
          ) : (
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-1 shadow-sm"
            >
              <Plus size={14} />
              <span>Nueva Tarea</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtabs horizontal strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 inline-flex items-center gap-1.5 transition-all ${
                isSelected
                  ? tab.id === 'overdue' && tab.count && tab.count > 0
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected 
                    ? 'bg-black/20 text-current' 
                    : tab.id === 'overdue' 
                      ? 'bg-rose-500/20 text-rose-400' 
                      : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content depending on subtab */}
      <div className="space-y-3 pt-1">
        {/* INBOX */}
        {activeSubTab === 'inbox' && (
          <div>
            {filterByCat(inboxTasks).length === 0 ? (
              <div className="text-center py-12 bg-neutral-900/40 rounded-2xl border border-neutral-800/60 p-4">
                <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-2">
                  <Inbox size={20} />
                </div>
                <p className="text-sm font-bold text-neutral-200">Inbox limpio</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  ¿Tienes algo en la cabeza? Pulsa '+' para apuntarlo rápidamente sin necesidad de ponerle fecha ahora.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filterByCat(inboxTasks).map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TODAY */}
        {activeSubTab === 'today' && (
          <div className="space-y-2.5">
            {filterByCat(todayTasks).length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-8 bg-neutral-900/40 rounded-xl">
                No hay tareas para hoy.
              </p>
            ) : (
              filterByCat(todayTasks).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            )}
          </div>
        )}

        {/* ALL ACTIVE */}
        {activeSubTab === 'all' && (
          <div className="space-y-2.5">
            {filterByCat(activeAllTasks).length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-8 bg-neutral-900/40 rounded-xl">
                No hay tareas pendientes activas.
              </p>
            ) : (
              filterByCat(activeAllTasks).map((task) => (
                <TaskItem key={task.id} task={task} showDate />
              ))
            )}
          </div>
        )}

        {/* RECURRENT */}
        {activeSubTab === 'recurrent' && (
          <div className="space-y-2.5">
            {filterByCat(recurrentTasks).length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-8 bg-neutral-900/40 rounded-xl">
                No tienes tareas recurrentes creadas.
              </p>
            ) : (
              filterByCat(recurrentTasks).map((task) => (
                <TaskItem key={task.id} task={task} showDate />
              ))
            )}
          </div>
        )}

        {/* ROUTINES */}
        {activeSubTab === 'routines' && (
          <div className="space-y-3">
            {routines.length === 0 ? (
              <div className="text-center py-10 bg-neutral-900/40 rounded-2xl border border-neutral-800/60">
                <p className="text-xs text-neutral-400">No hay rutinas creadas.</p>
                <button
                  onClick={() => {
                    setRoutineToEdit(null);
                    setIsRoutineFormOpen(true);
                  }}
                  className="mt-3 px-4 py-2 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-xl"
                >
                  + Crear primera rutina
                </button>
              </div>
            ) : (
              routines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  onEdit={(r) => {
                    setRoutineToEdit(r);
                    setIsRoutineFormOpen(true);
                  }}
                />
              ))
            )}
          </div>
        )}

        {/* OVERDUE */}
        {activeSubTab === 'overdue' && (
          <div>
            <OverdueSection />
            {overdueTasks.length === 0 && (
              <div className="text-center py-10 bg-neutral-900/40 rounded-2xl border border-neutral-800/60">
                <p className="text-xs text-emerald-400 font-bold">¡Estupendo! No tienes tareas atrasadas.</p>
              </div>
            )}
          </div>
        )}

        {/* HISTORY */}
        {activeSubTab === 'history' && (
          <div className="space-y-2.5">
            {filterByCat(completedTasks).length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-8 bg-neutral-900/40 rounded-xl">
                Aún no has completado tareas.
              </p>
            ) : (
              filterByCat(completedTasks).map((task) => (
                <TaskItem key={task.id} task={task} showDate />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
