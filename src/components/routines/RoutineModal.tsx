import React, { useState, useEffect } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { Routine, RoutineStep, RecurrenceType } from '../../types';
import { X, Plus, Trash2, Clock, Check, ChevronDown } from 'lucide-react';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineToEdit?: Routine | null;
}

export const RoutineModal: React.FC<RoutineModalProps> = ({ isOpen, onClose, routineToEdit }) => {
  const { categories, addRoutine, updateRoutine } = useFKUS();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('07:00');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-personal');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [steps, setSteps] = useState<RoutineStep[]>([
    { id: '1', title: 'Levantarse y beber agua', durationMinutes: 10 },
    { id: '2', title: 'Desayunar saludable', durationMinutes: 20 },
  ]);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDuration, setNewStepDuration] = useState<number | undefined>(15);

  useEffect(() => {
    if (routineToEdit) {
      setTitle(routineToEdit.title);
      setDescription(routineToEdit.description || '');
      setTime(routineToEdit.time || '07:00');
      setCategoryId(routineToEdit.categoryId);
      setRecurrenceType(routineToEdit.recurrence.type);
      setSteps(routineToEdit.steps);
    } else {
      setTitle('');
      setDescription('');
      setTime('07:00');
      setCategoryId(categories[0]?.id || 'cat-personal');
      setRecurrenceType('daily');
      setSteps([
        { id: '1', title: 'Paso 1', durationMinutes: 10 },
      ]);
    }
  }, [routineToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;
    setSteps([
      ...steps,
      {
        id: `step-${Date.now()}`,
        title: newStepTitle.trim(),
        durationMinutes: newStepDuration
      }
    ]);
    setNewStepTitle('');
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) return;

    if (routineToEdit) {
      updateRoutine(routineToEdit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        time,
        categoryId,
        recurrence: { type: recurrenceType },
        steps,
      });
    } else {
      addRoutine({
        title: title.trim(),
        description: description.trim() || undefined,
        time,
        categoryId,
        isActive: true,
        recurrence: { type: recurrenceType },
        steps,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800">
          <h3 className="text-sm font-bold text-white">
            {routineToEdit ? 'Editar Rutina' : 'Nueva Rutina'}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
              Nombre de la rutina
            </label>
            <input
              type="text"
              placeholder="ej. Rutina de mañana o Rutina gimnasio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Hora de inicio
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="bg-neutral-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Frecuencia
              </label>
              <select
                value={recurrenceType}
                onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="daily">Todos los días</option>
                <option value="weekdays">Lunes a Viernes</option>
                <option value="weekly">Semanal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
              Descripción opcional
            </label>
            <input
              type="text"
              placeholder="ej. Despertar con energía antes de trabajar"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Steps */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Acciones de la Rutina ({steps.length})
            </label>

            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div key={step.id || idx} className="flex items-center gap-2 bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800">
                  <span className="text-emerald-400 font-mono text-xs font-bold w-4">
                    {idx + 1}.
                  </span>
                  <span className="flex-1 text-xs text-neutral-200 truncate">{step.title}</span>
                  {step.durationMinutes && (
                    <span className="text-[10px] text-neutral-500 font-mono">{step.durationMinutes}m</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(step.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new step */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Nueva acción (ej. Calentamiento, Desayunar...)"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                min="1"
                step="5"
                placeholder="Min"
                value={newStepDuration || ''}
                onChange={(e) => setNewStepDuration(e.target.value ? Number(e.target.value) : undefined)}
                className="w-16 bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-2 text-xs text-white text-center focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-xl"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
          >
            Guardar Rutina
          </button>
        </div>
      </div>
    </div>
  );
};
