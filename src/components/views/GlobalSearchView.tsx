import React, { useState, useEffect, useRef } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { Search, X, CheckSquare, Zap, Target, Tag, ArrowRight } from 'lucide-react';
import { IconRenderer } from '../common/IconRenderer';

export const GlobalSearchView: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    tasks, 
    routines, 
    goals, 
    categories,
    setSelectedTaskId,
    setSelectedGoalId,
    setSelectedRoutineId,
    setSelectedCategoryIdFilter,
    setActiveTab,
    getCategoryById 
  } = useFKUS();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingTasks = q 
    ? tasks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.subtasks.some(s => s.title.toLowerCase().includes(q))
      )
    : [];

  const matchingRoutines = q
    ? routines.filter(r => 
        r.title.toLowerCase().includes(q) || 
        (r.description && r.description.toLowerCase().includes(q)) ||
        r.steps.some(s => s.title.toLowerCase().includes(q))
      )
    : [];

  const matchingGoals = q
    ? goals.filter(g =>
        g.title.toLowerCase().includes(g.title.toLowerCase().includes(q) ? q : '') ||
        g.title.toLowerCase().includes(q) ||
        (g.description && g.description.toLowerCase().includes(q)) ||
        (g.notes && g.notes.toLowerCase().includes(q))
      )
    : [];

  const matchingCategories = q
    ? categories.filter(c => c.name.toLowerCase().includes(q))
    : [];

  const totalResults = matchingTasks.length + matchingRoutines.length + matchingGoals.length + matchingCategories.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mt-6"
      >
        {/* Search Input Header */}
        <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-neutral-800 bg-neutral-950/80">
          <Search size={18} className="text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar tareas, notas, rutinas, objetivos... (ej. taller)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-neutral-500 hover:text-neutral-300"
            >
              Borrar
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {!q ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              Escribe algo para buscar en todo tu centro de organización.
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              No se encontraron resultados para "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tasks Results */}
              {matchingTasks.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <CheckSquare size={12} className="text-emerald-400" />
                    <span>Tareas ({matchingTasks.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {matchingTasks.map(t => {
                      const cat = getCategoryById(t.categoryId);
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            setSelectedTaskId(t.id);
                            setIsSearchOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-emerald-500/50 flex items-center justify-between cursor-pointer text-xs"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-neutral-200 block truncate">{t.title}</span>
                            {t.description && (
                              <span className="text-[11px] text-neutral-500 block truncate">{t.description}</span>
                            )}
                          </div>
                          {cat && (
                            <span className="text-[10px] px-2 py-0.5 rounded ml-2 shrink-0" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                              {cat.name}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Goals Results */}
              {matchingGoals.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Target size={12} className="text-teal-400" />
                    <span>Objetivos ({matchingGoals.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {matchingGoals.map(g => (
                      <div
                        key={g.id}
                        onClick={() => {
                          setSelectedGoalId(g.id);
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-teal-500/50 flex items-center justify-between cursor-pointer text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-teal-300 block truncate">{g.title}</span>
                          {g.description && (
                            <span className="text-[11px] text-neutral-500 block truncate">{g.description}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400 ml-2 shrink-0">🎯 Objetivo</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Routines Results */}
              {matchingRoutines.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Zap size={12} className="text-amber-400" />
                    <span>Rutinas ({matchingRoutines.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {matchingRoutines.map(r => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setActiveTab('tasks');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/50 flex items-center justify-between cursor-pointer text-xs"
                      >
                        <span className="font-medium text-neutral-200 truncate">{r.title}</span>
                        <span className="text-[10px] text-amber-400/80 ml-2">⚡ Rutina</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Results */}
              {matchingCategories.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Tag size={12} className="text-blue-400" />
                    <span>Categorías ({matchingCategories.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchingCategories.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCategoryIdFilter(c.id);
                          setIsSearchOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                        style={{ backgroundColor: `${c.color}20`, color: c.color }}
                      >
                        <IconRenderer name={c.icon} size={13} color={c.color} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
