import React, { useState, useEffect } from 'react';
import { FKUSProvider, useFKUS } from './context/FKUSContext';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { SidebarNav } from './components/layout/SidebarNav';
import { HomeView } from './components/views/HomeView';
import { CalendarView } from './components/views/CalendarView';
import { TasksView } from './components/views/TasksView';
import { GoalsView } from './components/views/GoalsView';
import { MoreView } from './components/views/MoreView';
import { QuickCreateMenu } from './components/common/QuickCreateMenu';
import { QuickAddModal } from './components/tasks/QuickAddModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { GoalFormModal } from './components/goals/GoalFormModal';
import { RoutineModal } from './components/routines/RoutineModal';
import { GlobalSearchView } from './components/views/GlobalSearchView';

export type DeviceMode = 'auto' | 'desktop' | 'tablet' | 'mobile';

const MainContent: React.FC<{ 
  deviceMode: DeviceMode; 
  setDeviceMode: (val: DeviceMode) => void 
}> = ({
  deviceMode,
  setDeviceMode,
}) => {
  const { 
    activeTab, 
    isGoalFormOpen, 
    setIsGoalFormOpen, 
    isRoutineFormOpen, 
    setIsRoutineFormOpen,
    routineToEdit,
    setIsSearchOpen,
    setIsCreateMenuOpen
  } = useFKUS();

  // Global keyboard shortcuts (Cmd/Ctrl + K for search, N for new item)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  // Determine layout based on deviceMode
  const isForcedDesktop = deviceMode === 'desktop';
  const isForcedTablet = deviceMode === 'tablet';
  const isForcedMobile = deviceMode === 'mobile';
  const isAuto = deviceMode === 'auto';

  return (
    <div className={`min-h-screen bg-black text-neutral-100 flex flex-col justify-start items-center ${
      isForcedTablet ? 'py-6 px-4 bg-neutral-950' : isForcedMobile ? 'py-6 px-4 bg-neutral-950' : ''
    }`}>
      {/* Outer Container depending on Mode */}
      <div 
        className={`w-full flex transition-all duration-300 ${
          isForcedMobile
            ? 'max-w-md min-h-[860px] rounded-[40px] border border-neutral-800 shadow-2xl overflow-hidden bg-neutral-950 flex-col relative'
            : isForcedTablet
              ? 'max-w-3xl min-h-[900px] rounded-[32px] border border-neutral-800 shadow-2xl overflow-hidden bg-neutral-950 flex-col relative'
              : 'min-h-screen flex-row'
        }`}
      >
        {/* Desktop Sidebar (Rendered on Desktop or forced desktop) */}
        {(isForcedDesktop || (isAuto && !isForcedTablet && !isForcedMobile)) && (
          <div className={isForcedDesktop ? 'block' : 'hidden lg:block'}>
            <SidebarNav deviceMode={deviceMode} setDeviceMode={setDeviceMode} />
          </div>
        )}

        {/* Main Work Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-black relative">
          {/* Top Header */}
          <TopHeader deviceMode={deviceMode} setDeviceMode={setDeviceMode} />

          {/* Scrollable Active View Area */}
          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'tasks' && <TasksView />}
            {activeTab === 'goals' && <GoalsView />}
            {activeTab === 'more' && <MoreView />}
          </main>

          {/* Mobile Bottom Navigation (Shown on mobile/tablet or when forced) */}
          {(isForcedMobile || isForcedTablet || isAuto) && (
            <div className={isForcedMobile || isForcedTablet ? 'block' : 'lg:hidden'}>
              <BottomNav />
            </div>
          )}
        </div>
      </div>

      {/* Global Modals & Overlays */}
      <QuickCreateMenu />
      <QuickAddModal />
      <TaskDetailModal />
      
      {/* Global Goal & Routine Modals */}
      {isGoalFormOpen && (
        <GoalFormModal
          isOpen={isGoalFormOpen}
          onClose={() => setIsGoalFormOpen(false)}
        />
      )}

      {isRoutineFormOpen && (
        <RoutineModal
          isOpen={isRoutineFormOpen}
          onClose={() => setIsRoutineFormOpen(false)}
          routineToEdit={routineToEdit}
        />
      )}

      <GlobalSearchView />
    </div>
  );
};

export function App() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('auto');

  return (
    <FKUSProvider>
      <MainContent deviceMode={deviceMode} setDeviceMode={setDeviceMode} />
    </FKUSProvider>
  );
}

export default App;

