import React from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { Search, Filter, X, MoreHorizontal, Monitor, Tablet, Smartphone } from 'lucide-react';
import { IconRenderer } from '../common/IconRenderer';

interface TopHeaderProps {
  deviceMode: 'auto' | 'desktop' | 'tablet' | 'mobile';
  setDeviceMode: (mode: 'auto' | 'desktop' | 'tablet' | 'mobile') => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ deviceMode, setDeviceMode }) => {
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
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-base shadow-sm shadow-red-600/20 group-hover:scale-105 transition-transform">
            F
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-base tracking-wider text-white">FKUS</span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-normal tracking-tight hidden sm:block">
              Apúntalo. Organízalo. Hazlo.
            </p>
          </div>
        </div>

        {/* Center / Search bar on tablet & desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full py-1.5 px-3 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-between text-xs transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search size={14} className="text-red-500" />
              <span>Buscar tareas, rutinas u objetivos...</span>
            </span>
            <kbd className="text-[10px] bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800 text-neutral-500 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Active Category Filter Badge */}
          {activeCategory && (
            <button
              onClick={() => setSelectedCategoryIdFilter(null)}
              className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400"
            >
              <IconRenderer name={activeCategory.icon} size={12} color={activeCategory.color} />
              <span className="font-medium max-w-[80px] truncate">{activeCategory.name}</span>
              <X size={12} />
            </button>
          )}

          {/* Quick Category Filter Selector */}
          <div className="relative group">
            <button
              className="w-8 h-8 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-colors"
              title="Filtrar por categoría"
            >
              <Filter size={15} />
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-48 py-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Categorías
              </div>
              <button
                onClick={() => setSelectedCategoryIdFilter(null)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-900 transition-colors ${
                  !selectedCategoryIdFilter ? 'text-red-400 font-bold bg-red-500/10' : 'text-neutral-300'
                }`}
              >
                <span>Todas</span>
                {!selectedCategoryIdFilter && <span className="text-[10px]">✓</span>}
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryIdFilter(c.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-neutral-900 transition-colors ${
                    selectedCategoryIdFilter === c.id ? 'text-red-400 font-bold bg-red-500/10' : 'text-neutral-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="truncate flex-1">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Trigger for Mobile */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 flex md:hidden items-center justify-center transition-colors"
            title="Buscar (Tareas, Rutinas, Objetivos)"
          >
            <Search size={15} />
          </button>

          {/* Más / Ajustes Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'more' ? 'home' : 'more')}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
              activeTab === 'more'
                ? 'bg-red-600 text-white border-red-500 shadow-sm shadow-red-600/30'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
            title="Más / Ajustes / Categorías"
          >
            <MoreHorizontal size={17} />
          </button>

          {/* Device Switcher Quick Selector (Escritorio / Tablet / Móvil) */}
          <div className="hidden sm:flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5">
            <button
              onClick={() => setDeviceMode('auto')}
              className={`px-2 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
                deviceMode === 'auto' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Automático (Responsive)"
            >
              Auto
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1 rounded-lg text-xs transition-all ${
                deviceMode === 'desktop' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Vista Ordenador / Escritorio"
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1 rounded-lg text-xs transition-all ${
                deviceMode === 'tablet' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Vista Tablet"
            >
              <Tablet size={14} />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1 rounded-lg text-xs transition-all ${
                deviceMode === 'mobile' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Vista Móvil"
            >
              <Smartphone size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
