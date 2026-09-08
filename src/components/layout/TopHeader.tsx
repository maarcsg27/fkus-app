import React from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { Search, Filter, X, MoreHorizontal } from 'lucide-react';
import { IconRenderer } from '../common/IconRenderer';

interface TopHeaderProps {
  showMobileFrame: boolean;
  setShowMobileFrame: (val: boolean) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ showMobileFrame, setShowMobileFrame }) => {
  const { 
    categories, 
    selectedCategoryIdFilter, 
    setSelectedCategoryIdFilter, 
    setIsSearchOpen,
    activeTab,
    setActiveTab 
  } = useFKUS();

  const activeCategory = categories.find(c => c.id === selectedCategoryIdFilter);

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-neutral-950 font-black text-base shadow-sm">
            F
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-wider text-white">FKUS</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-normal tracking-tight hidden sm:block">
              Apúntalo. Organízalo. Hazlo.
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Active Category Filter Badge */}
          {activeCategory && (
            <button
              onClick={() => setSelectedCategoryIdFilter(null)}
              className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            >
              <IconRenderer name={activeCategory.icon} size={12} color={activeCategory.color} />
              <span className="font-medium max-w-[80px] truncate">{activeCategory.name}</span>
              <X size={12} />
            </button>
          )}

          {/* Quick Category Filter Selector */}
          <div className="relative group">
            <button
              className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              title="Filtrar por categoría"
            >
              <Filter size={15} />
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-48 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Categorías
              </div>
              <button
                onClick={() => setSelectedCategoryIdFilter(null)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-800 transition-colors ${
                  !selectedCategoryIdFilter ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-neutral-300'
                }`}
              >
                <span>Todas</span>
                {!selectedCategoryIdFilter && <span className="text-[10px]">✓</span>}
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryIdFilter(c.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-neutral-800 transition-colors ${
                    selectedCategoryIdFilter === c.id ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-neutral-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="truncate flex-1">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            title="Buscar (Tareas, Rutinas, Objetivos)"
          >
            <Search size={15} />
          </button>

          {/* Más / Ajustes Button (Moved to Top Right) */}
          <button
            onClick={() => setActiveTab(activeTab === 'more' ? 'home' : 'more')}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
              activeTab === 'more'
                ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="Más / Ajustes / Categorías"
          >
            <MoreHorizontal size={17} />
          </button>

          {/* Desktop Preview Frame Toggle */}
          <button
            onClick={() => setShowMobileFrame(!showMobileFrame)}
            className="hidden lg:flex items-center text-[11px] font-medium px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Cambiar entre vista móvil y pantalla completa"
          >
            {showMobileFrame ? 'Expandir' : 'Móvil'}
          </button>
        </div>
      </div>
    </header>
  );
};
