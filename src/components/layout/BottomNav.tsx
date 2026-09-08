import React from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { ActiveTab } from '../../types';
import { Home, Calendar, CheckSquare, Target, Plus, LucideIcon } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsCreateMenuOpen, overdueTasks, todayTasks } = useFKUS();

  const pendingTodayCount = todayTasks.filter(t => t.status === 'pending').length;
  const overdueCount = overdueTasks.length;

  const leftNavItems: { id: ActiveTab; label: string; icon: LucideIcon; badge?: number }[] = [
    { id: 'home', label: 'Hoy', icon: Home, badge: pendingTodayCount > 0 ? pendingTodayCount : undefined },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
  ];

  const rightNavItems: { id: ActiveTab; label: string; icon: LucideIcon; badge?: number }[] = [
    { id: 'tasks', label: 'Tareas', icon: CheckSquare, badge: overdueCount > 0 ? overdueCount : undefined },
    { id: 'goals', label: 'Objetivos', icon: Target },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto bg-black/95 backdrop-blur-md border-t border-neutral-800/80 px-2 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 items-center">
        {/* Left 2 items (Hoy, Calendario) */}
        {leftNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-red-500 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon size={21} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Center Floating Plus (+) Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => setIsCreateMenuOpen(true)}
            aria-label="Añadir tarea, objetivo o rutina"
            className="w-13 h-13 -mt-6 bg-gradient-to-tr from-red-600 to-rose-500 text-white rounded-2xl shadow-lg shadow-red-600/35 flex items-center justify-center active:scale-95 hover:scale-105 hover:brightness-110 transition-transform duration-150 border-2 border-black focus:outline-none"
            style={{ width: '3.25rem', height: '3.25rem' }}
          >
            <Plus size={28} strokeWidth={2.8} />
          </button>
        </div>

        {/* Right 2 items (Tareas, Objetivos) */}
        {rightNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-red-500 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon size={21} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
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
  );
};
