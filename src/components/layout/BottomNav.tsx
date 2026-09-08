import React from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { ActiveTab } from '../../types';
import { Home, Calendar, CheckSquare, Target, MoreHorizontal, Plus, LucideIcon } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsQuickAddOpen, overdueTasks, todayTasks } = useFKUS();

  const pendingTodayCount = todayTasks.filter(t => t.status === 'pending').length;
  const overdueCount = overdueTasks.length;

  const navItems: { id: ActiveTab; label: string; icon: LucideIcon; badge?: number }[] = [
    { id: 'home', label: 'Hoy', icon: Home, badge: pendingTodayCount > 0 ? pendingTodayCount : undefined },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare, badge: overdueCount > 0 ? overdueCount : undefined },
    { id: 'goals', label: 'Objetivos', icon: Target },
    { id: 'more', label: 'Más', icon: MoreHorizontal },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800/80 px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between relative">
        {/* Left 2 items */}
        <div className="flex items-center space-x-1 sm:space-x-4 flex-1 justify-around">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-emerald-400 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="relative">
                  <Icon size={21} className={isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'} />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 bg-emerald-500 text-neutral-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Central Prominent Quick-Add Button */}
        <div className="flex items-center justify-center px-2">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            aria-label="Añadir rápidamente"
            className="w-13 h-13 -mt-6 bg-gradient-to-tr from-emerald-500 to-teal-400 text-neutral-950 rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center active:scale-95 hover:scale-105 transition-transform duration-150 border-2 border-neutral-900 focus:outline-none"
            style={{ width: '3.25rem', height: '3.25rem' }}
          >
            <Plus size={28} strokeWidth={2.8} />
          </button>
        </div>

        {/* Right 3 items */}
        <div className="flex items-center space-x-1 sm:space-x-4 flex-1 justify-around">
          {navItems.slice(2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-emerald-400 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="relative">
                  <Icon size={21} className={isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'} />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 bg-amber-500 text-neutral-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
