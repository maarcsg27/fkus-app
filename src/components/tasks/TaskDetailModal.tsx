import React, { useState, useEffect } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { Priority, RecurrenceType } from '../../types';
import { 
  X, 
  Check, 
  Trash2, 
  Copy, 
  ListChecks,
  AlertCircle
} from 'lucide-react';
import { checkIsOverdue } from '../../utils/dateUtils';

export const TaskDetailModal: React.FC = () => {
  const { 
    selectedTaskId, 
    setSelectedTaskId, 
    tasks, 
    updateTask, 
    deleteTask, 
    duplicateTask, 
    toggleTaskStatus,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    categories, 
    goals 
  } = useFKUS();

  const task = tasks.find(t => t.id === selectedTaskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [goalId, setGoalId] = useState<string>('');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDate(task.date || '');
      setTime(task.time || '');
      setDurationMinutes(task.durationMinutes);
      setCategoryId(task.categoryId);
      setPriority(task.priority);
      setGoalId(task.goalId || '');
      setRecurrenceType(task.recurrence?.type || 'none');
      setNewSubtaskTitle('');
    }
  }, [task]);

  if (!selectedTaskId || !task) return null;

  const isCompleted = task.status === 'completed';
  const isOverdue = checkIsOverdue(task.date, task.status);

  const handleSave = () => {
    if (!title.trim()) return;

    updateTask(task.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      date: date || undefined,
      time: time.trim() || undefined,
      durationMinutes: durationMinutes || undefined,
      categoryId: categoryId || categories[0]?.id || 'cat-personal',
      priority,
      goalId: goalId || undefined,
      recurrence: recurrenceType !== 'none' ? { type: recurrenceType } : { type: 'none' },
    });

    setSelectedTaskId(null);
  };

  const handleAddSub = () => {
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header with Complete button and Actions */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleTaskStatus(task.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                isCompleted 
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30' 
                  : 'bg-neutral-900 text-neutral-300 hover:bg-red-600/20 hover:text-red-400'
              }`}
            >
              <Check size={14} strokeWidth={2.5} />
              <span>{isCompleted ? 'Completada' : 'Marcar hecha'}</span>
            </button>

            {isOverdue && !isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20">
                <AlertCircle size={12} />
                Atrasada
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                duplicateTask(task.id);
                setSelectedTaskId(null);
              }}
              title="Duplicar tarea"
              className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <Copy size={14} />
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              title="Eliminar tarea"
              className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 flex items-center justify-center transition-colors"
            >
              <Trash2 size={14} />
            </button>

            <button
              onClick={() => setSelectedTaskId(null)}
              className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Title Edit */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la tarea"
              className="w-full text-lg font-black bg-transparent text-white border-b border-neutral-800 pb-2 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Quick Date, Time & Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Hora
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Duración (min)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                placeholder="ej. 30"
                value={durationMinutes || ''}
                onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-neutral-950">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="low">Baja</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          {/* Recurrence & Goal Linked */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Repetición
              </label>
              <select
                value={recurrenceType}
                onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="none">Una sola vez (Puntual)</option>
                <option value="daily">Todos los días</option>
                <option value="weekdays">Lunes a Viernes</option>
                <option value="weekly">Cada semana</option>
                <option value="monthly">Mensualmente</option>
                <option value="yearly">Anualmente</option>
              </select>
            </div>

            <div>
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Objetivo Relacionado
              </label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="">-- Sin objetivo --</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id} className="bg-neutral-950">
                    🎯 {g.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1 uppercase tracking-wider">
              Notas adicionales
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Preguntar si tienen disponible el parachoques delantero y cuánto cuesta pintarlo..."
              className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500 leading-relaxed"
            />
          </div>

          {/* Checklist / Subtareas */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[10.5px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks size={13} className="text-red-500" />
                <span>Checklist / Pasos ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</span>
              </label>
            </div>

            {task.subtasks.length > 0 && (
              <div className="space-y-1.5">
                {task.subtasks.map((st) => (
                  <div 
                    key={st.id} 
                    className="flex items-center justify-between bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-800 group"
                  >
                    <div 
                      onClick={() => toggleSubtask(task.id, st.id)}
                      className="flex items-center space-x-2.5 flex-1 cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        st.completed 
                          ? 'bg-red-600 border-red-600 text-white' 
                          : 'border-neutral-700 hover:border-red-500'
                      }`}>
                        {st.completed && <Check size={11} strokeWidth={3} />}
                      </div>
                      <span className={`text-xs ${st.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                        {st.title}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteSubtask(task.id, st.id)}
                      className="text-neutral-500 hover:text-red-400 p-1 opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Añadir paso al checklist..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSub();
                  }
                }}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={handleAddSub}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white rounded-xl transition-colors"
              >
                + Añadir
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setSelectedTaskId(null)}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs shadow-md hover:brightness-110 active:scale-98 transition-all"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
