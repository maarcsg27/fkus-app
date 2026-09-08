import React, { useState, useEffect } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { Goal, Priority } from '../../types';
import { getTodayString } from '../../utils/dateUtils';
import { X, Calendar, Flag, Target, AlignLeft, Check } from 'lucide-react';
import { addDays } from 'date-fns';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: Goal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({ isOpen, onClose, goalToEdit }) => {
  const { categories, addGoal, updateGoal } = useFKUS();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState(addDays(new Date(), 90).toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-projects');
  const [priority, setPriority] = useState<Priority>('high');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description || '');
      setTargetDate(goalToEdit.targetDate);
      setCategoryId(goalToEdit.categoryId);
      setPriority(goalToEdit.priority);
      setNotes(goalToEdit.notes || '');
    } else {
      setTitle('');
      setDescription('');
      setTargetDate(addDays(new Date(), 90).toISOString().slice(0, 10));
      setCategoryId(categories[0]?.id || 'cat-projects');
      setPriority('high');
      setNotes('');
    }
  }, [goalToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;

    if (goalToEdit) {
      updateGoal(goalToEdit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        targetDate,
        categoryId,
        priority,
        notes: notes.trim() || undefined,
      });
    } else {
      addGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        targetDate,
        categoryId,
        priority,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
            <h3 className="text-sm font-bold text-white">
              {goalToEdit ? 'Editar Objetivo' : 'Nuevo Objetivo a Largo Plazo'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
              ¿Qué quieres conseguir?
            </label>
            <input
              type="text"
              placeholder="ej. Crear mi empresa antes de diciembre o Aprender un idioma"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Fecha objetivo
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
                Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-neutral-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
              Descripción o motivación principal
            </label>
            <textarea
              rows={2}
              placeholder="Explica brevemente por qué es importante para ti..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">
              Notas de enfoque / Recordatorio personal
            </label>
            <textarea
              rows={2}
              placeholder="ej. No complicar funcionalidades: lanzar rápido y validar."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </form>

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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-neutral-950 font-bold text-xs shadow-md disabled:opacity-40"
          >
            Guardar Objetivo
          </button>
        </div>
      </div>
    </div>
  );
};
