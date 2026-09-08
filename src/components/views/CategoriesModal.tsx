import React, { useState } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { IconRenderer } from '../common/IconRenderer';
import { X, Plus, Trash2, Edit2, Tag } from 'lucide-react';
import { Category } from '../../types';

const AVAILABLE_ICONS = [
  'User', 'Briefcase', 'GraduationCap', 'Dumbbell', 'Heart', 
  'Gamepad2', 'ShoppingBag', 'Wallet', 'Rocket', 'BookOpen', 
  'Coffee', 'Home', 'Music', 'Smile', 'Plane', 'Folder', 'Code'
];

const AVAILABLE_COLORS = [
  '#ef4444', '#dc2626', '#b91c1c', '#f43f5e', '#e11d48',
  '#f97316', '#eab308', '#a855f7', '#3b82f6', '#06b6d4', '#71717a'
];

export const CategoriesModal: React.FC = () => {
  const { 
    isCategoryModalOpen, 
    setIsCategoryModalOpen, 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory 
  } = useFKUS();

  const [isCreating, setIsCreating] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Tag');
  const [color, setColor] = useState('#ef4444');

  if (!isCategoryModalOpen) return null;

  const startCreate = () => {
    setIsCreating(true);
    setEditingCatId(null);
    setName('');
    setIcon('Tag');
    setColor('#ef4444');
  };

  const startEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setIsCreating(false);
    setName(cat.name);
    setIcon(cat.icon);
    setColor(cat.color);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingCatId) {
      updateCategory(editingCatId, {
        name: name.trim(),
        icon,
        color
      });
      setEditingCatId(null);
    } else {
      addCategory({
        name: name.trim(),
        icon,
        color
      });
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <Tag size={16} className="text-red-500" />
            <h3 className="text-sm font-bold text-white">Gestionar Categorías</h3>
          </div>
          <button
            onClick={() => setIsCategoryModalOpen(false)}
            className="w-7 h-7 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Create / Edit Form Area */}
          {(isCreating || editingCatId) ? (
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                {editingCatId ? 'Editar Categoría' : 'Nueva Categoría'}
              </h4>

              <div>
                <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="ej. Proyectos o Finanzas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-medium"
                />
              </div>

              {/* Color picker */}
              <div>
                <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVAILABLE_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon picker */}
              <div>
                <label className="text-[10.5px] font-semibold text-neutral-400 block mb-1">Icono</label>
                <div className="flex items-center gap-2 flex-wrap max-h-24 overflow-y-auto p-1 bg-neutral-950 rounded-xl border border-neutral-800">
                  {AVAILABLE_ICONS.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`p-2 rounded-lg transition-colors ${
                        icon === ic ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <IconRenderer name={ic} size={15} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCatId(null);
                  }}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="px-4 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl disabled:opacity-40"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={startCreate}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-neutral-800 hover:border-red-500 text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus size={15} />
              <span>Añadir nueva categoría</span>
            </button>
          )}

          {/* Categories List */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Categorías actuales ({categories.length})
            </h4>

            {categories.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${c.color}20`, color: c.color }}
                  >
                    <IconRenderer name={c.icon} size={16} color={c.color} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{c.name}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{c.color}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => startEdit(c)}
                    className="w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center"
                  >
                    <Edit2 size={13} />
                  </button>

                  {categories.length > 1 && (
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="w-7 h-7 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
