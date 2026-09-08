import React, { useState, useEffect, useRef } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { Priority, RecurrenceType } from '../../types';
import { getTodayString, getTomorrowString } from '../../utils/dateUtils';
import { 
  X, 
  Calendar, 
  Clock, 
  AlignLeft, 
  Plus, 
  Check, 
  ChevronDown,
  Inbox
} from 'lucide-react';

export const QuickAddModal: React.FC = () => {
  const { 
    isQuickAddOpen, 
    setIsQuickAddOpen, 
    addTask, 
    categories, 
    goals
  } = useFKUS();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<string | undefined>(getTodayString());
  const [time, setTime] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [goalId, setGoalId] = useState<string>('');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [subtasks, setSubtasks] = useState<{ id: string; taskId: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  
  // Expandable sections
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isQuickAddOpen) {
      setTitle('');
      setDescription('');
      setDate(getTodayString());
      setTime('');
      setDurationMinutes(undefined);
      setCategoryId(categories[0]?.id || 'cat-personal');
      setPriority('normal');
      setGoalId('');
      setRecurrenceType('none');
      setSubtasks([]);
      setNewSubtaskTitle('');
      setShowAdvanced(false);
      setShowSubtasks(false);

      // Focus input immediately
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isQuickAddOpen, categories]);

  if (!isQuickAddOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      date: date || undefined,
      time: time.trim() || undefined,
      durationMinutes: durationMinutes || undefined,
      categoryId: categoryId || categories[0]?.id || 'cat-personal',
      priority,
      goalId: goalId || undefined,
      recurrence: recurrenceType !== 'none' ? { type: recurrenceType } : { type: 'none' },
      subtasks,
    });

    setIsQuickAddOpen(false);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `temp-${Date.now()}`,
        taskId: '',
        title: newSubtaskTitle.trim(),
        completed: false
      }
    ]);
    setNewSubtaskTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-neutral-800/80">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <h3 className="text-sm font-bold text-neutral-200">Nueva Tarea</h3>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="w-7 h-7 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Main Title Input (Fast capture) */}
          <div>
            <input
              ref={inputRef}
              type="text"
              placeholder="¿Qué tienes que hacer? (ej. Llamar al taller)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-base sm:text-lg font-medium bg-neutral-900/90 border border-neutral-800 rounded-2xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>

          {/* Quick Date Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setDate(getTodayString())}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                date === getTodayString()
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Hoy
            </button>

            <button
              type="button"
              onClick={() => setDate(getTomorrowString())}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                date === getTomorrowString()
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Mañana
            </button>

            <button
              type="button"
              onClick={() => setDate(undefined)}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 inline-flex items-center gap-1 transition-colors ${
                date === undefined
                  ? 'bg-neutral-800 text-red-400 border border-red-500/30 font-bold'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              <Inbox size={12} />
              Inbox (Sin fecha)
            </button>

            <div className="relative shrink-0">
              <input
                type="date"
                value={date || ''}
                onChange={(e) => setDate(e.target.value || undefined)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              />
              <span className={`px-3 py-1.5 rounded-xl font-bold inline-flex items-center gap-1 shrink-0 ${
                date && date !== getTodayString() && date !== getTomorrowString()
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
              }`}>
                <Calendar size={12} />
                {date && date !== getTodayString() && date !== getTomorrowString() ? date : 'Otra fecha'}
              </span>
            </div>
          </div>

          {/* Quick Row: Time & Category */}
          <div className="grid grid-cols-2 gap-3">
            {/* Time Input */}
            <div className="flex items-center bg-neutral-900/70 border border-neutral-800 rounded-xl px-3 py-2">
              <Clock size={15} className="text-neutral-500 mr-2 shrink-0" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Hora opcional"
                className="w-full bg-transparent text-xs text-white focus:outline-none placeholder:text-neutral-500"
              />
            </div>

            {/* Category Selector */}
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full appearance-none bg-neutral-900/70 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 pr-7"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-neutral-950 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Priority Selector */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 block mb-1.5 uppercase tracking-wider">
              Prioridad
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'normal', 'high', 'urgent'] as Priority[]).map((p) => {
                const labels: Record<Priority, string> = {
                  low: 'Baja',
                  normal: 'Normal',
                  high: 'Alta',
                  urgent: 'Urgente'
                };
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                      isSelected
                        ? p === 'urgent'
                          ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                          : p === 'high'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-neutral-800 text-red-400 border border-red-500/30'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goal Linker */}
          {goals.length > 0 && (
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 block mb-1.5 uppercase tracking-wider">
                Vincular a un Objetivo (Opcional)
              </label>
              <div className="relative">
                <select
                  value={goalId}
                  onChange={(e) => setGoalId(e.target.value)}
                  className="w-full appearance-none bg-neutral-900/70 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 pr-7"
                >
                  <option value="" className="bg-neutral-950 text-neutral-400">
                    -- Ningún objetivo vinculado --
                  </option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id} className="bg-neutral-950 text-white">
                      🎯 {g.title}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
          )}

          {/* Toggle Advanced / Notes / Checklist */}
          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-red-400 hover:text-red-300 font-bold inline-flex items-center gap-1"
            >
              <AlignLeft size={13} />
              <span>{showAdvanced ? 'Ocultar notas y extras' : '+ Añadir notas / duración'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="text-xs text-neutral-300 hover:text-white font-bold inline-flex items-center gap-1"
            >
              <Plus size={13} />
              <span>{showSubtasks ? 'Ocultar checklist' : '+ Subtareas'}</span>
            </button>
          </div>

          {/* Advanced Details: Notes & Recurrence */}
          {showAdvanced && (
            <div className="space-y-3 pt-2 animate-in fade-in duration-150">
              {/* Notes */}
              <div>
                <textarea
                  rows={2}
                  placeholder="Notas adicionales (ej. preguntar precio del parachoques...)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Recurrence & Duration Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                    Repetición
                  </label>
                  <select
                    value={recurrenceType}
                    onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="none">Una sola vez</option>
                    <option value="daily">Todos los días</option>
                    <option value="weekdays">Lunes a Viernes</option>
                    <option value="weekly">Cada semana</option>
                    <option value="monthly">Mensualmente</option>
                    <option value="yearly">Anualmente</option>
                  </select>
                </div>

                <div>
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
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Subtasks / Checklist builder */}
          {showSubtasks && (
            <div className="space-y-2 pt-2 animate-in fade-in duration-150">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Checklist / Subtareas
              </label>

              {subtasks.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {subtasks.map((st, idx) => (
                    <div key={st.id} className="flex items-center justify-between bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-xs">
                      <span className="text-neutral-200 truncate">{st.title}</span>
                      <button
                        type="button"
                        onClick={() => setSubtasks(subtasks.filter((_, i) => i !== idx))}
                        className="text-neutral-500 hover:text-red-400"
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
                  placeholder="Añadir paso (ej. Reservar hotel)"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-950 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsQuickAddOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={() => handleSave()}
            disabled={!title.trim()}
            className={`flex-1 py-2.5 px-5 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all ${
              title.trim()
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:brightness-110 shadow-red-600/30 active:scale-98'
                : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
            }`}
          >
            <Check size={16} strokeWidth={2.8} />
            <span>Guardar Tarea</span>
          </button>
        </div>
      </div>
    </div>
  );
};
