import React from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { ActiveTab } from '../../types';
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  Target, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';

interface SidebarNavProps {
  deviceMode: 'auto' | 'desktop' | 'tablet' | 'mobile';
  setDeviceMode: (mode: 'auto' | 'desktop' | 'tablet' | 'mobile') => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ deviceMode, setDeviceMode }) => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsCreateMenuOpen, 
    setIsSearchOpen,
    categories,
    selectedCategoryIdFilter,
    setSelectedCategoryIdFilter,
    todayTasks,
    overdueTasks,
    goals
  } = useFKUS();

  const pendingTodayCount = todayTasks.filter(t => t.status === 'pending').length;
  const overdueCount = overdueTasks.length;
  const activeGoalsCount = goals.length;

  const navItems: { id: ActiveTab; label: string; icon: any; badge?: number; badgeColor?: string }[] = [
    { id: 'home', label: 'Hoy', icon: Home, badge: pendingTodayCount > 0 ? pendingTodayCount : undefined, badgeColor: 'bg-neutral-800 text-neutral-300' },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'tasks', label: 'Tareas y Rutinas', icon: CheckSquare, badge: overdueCount > 0 ? overdueCount : undefined, badgeColor: 'bg-red-600 text-white' },
    { id: 'goals', label: 'Objetivos', icon: Target, badge: activeGoalsCount > 0 ? activeGoalsCount : undefined, badgeColor: 'bg-neutral-800 text-neutral-400' },
    { id: 'more', label: 'Más y Ajustes', icon: MoreHorizontal },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-black border-r border-neutral-800/80 flex flex-col justify-between p-4 select-none shrink-0 z-20 overflow-y-auto">
      {/* Top section: Brand & Main action */}
      <div className="space-y-5">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group px-2 py-1"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform">
            F
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-lg tracking-wider text-white">FKUS</span>
              <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-medium tracking-tight">
              Apúntalo. Organízalo. Hazlo.
            </p>
          </div>
        </div>

        {/* Big Create Action Button */}
        <button
          onClick={() => setIsCreateMenuOpen(true)}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 active:scale-98 text-white font-black text-sm shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all duration-150"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Añadir Nuevo</span>
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-between text-xs transition-colors"
        >
          <span className="flex items-center gap-2">
            <Search size={14} />
            <span>Buscar todo...</span>
          </span>
          <kbd className="text-[10px] bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800 text-neutral-500 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Main Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={17} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-black/30 text-white' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Direct Category Filters Section */}
        <div className="pt-2 border-t border-neutral-900 space-y-1">
          <div className="flex items-center justify-between px-2 text-[10.5px] uppercase font-bold text-neutral-500 tracking-wider">
            <span>Categorías</span>
            {selectedCategoryIdFilter && (
              <button 
                onClick={() => setSelectedCategoryIdFilter(null)}
                className="text-[10px] text-red-400 hover:underline capitalize"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategoryIdFilter(null)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                !selectedCategoryIdFilter 
                  ? 'text-red-400 font-bold bg-red-500/10' 
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <span>Todas las actividades</span>
              {!selectedCategoryIdFilter && <span className="text-[10px]">✓</span>}
            </button>

            {categories.map((c) => {
              const isSelected = selectedCategoryIdFilter === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryIdFilter(isSelected ? null : c.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    isSelected 
                      ? 'text-red-400 font-bold bg-red-500/10' 
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: c.color }} 
                    />
                    <span className="truncate">{c.name}</span>
                  </div>
                  {isSelected && <span className="text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom section: Device preview mode & philosophy */}
      <div className="pt-3 border-t border-neutral-900 space-y-3">
        {/* Device Mode Switcher */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider px-1">
            Vista del Dispositivo
          </div>
          <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-[11px]">
            <button
              onClick={() => setDeviceMode('auto')}
              className={`py-1 rounded-lg flex items-center justify-center transition-all ${
                deviceMode === 'auto' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Automático (Responsive)"
            >
              Auto
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`py-1 rounded-lg flex items-center justify-center transition-all ${
                deviceMode === 'desktop' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Escritorio / PC"
            >
              <Monitor size={13} />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`py-1 rounded-lg flex items-center justify-center transition-all ${
                deviceMode === 'tablet' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Tablet / iPad"
            >
              <Tablet size={13} />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`py-1 rounded-lg flex items-center justify-center transition-all ${
                deviceMode === 'mobile' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Móvil / Smartphone"
            >
              <Smartphone size={13} />
            </button>
          </div>
        </div>

        {/* Philosophy Badge */}
        <div className="px-3 py-2 rounded-xl bg-neutral-900/50 border border-neutral-900 text-center">
          <p className="text-[11px] font-bold text-neutral-300">
            "Apúntalo. Organízalo. Hazlo."
          </p>
        </div>
      </div>
    </aside>
  );
};
