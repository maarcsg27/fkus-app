import React, { useState } from 'react';
import { FKUSProvider, useFKUS } from './context/FKUSContext';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
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

const MainContent: React.FC<{ showMobileFrame: boolean; setShowMobileFrame: (val: boolean) => void }> = ({
  showMobileFrame,
  setShowMobileFrame,
}) => {
  const { 
    activeTab, 
    isGoalFormOpen, 
    setIsGoalFormOpen, 
    isRoutineFormOpen, 
    setIsRoutineFormOpen,
    routineToEdit 
  } = useFKUS();

  return (
    <div className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-start items-center ${showMobileFrame ? 'p-0 sm:py-6 sm:px-4' : ''}`}>
      {/* Mobile Frame Container */}
      <div 
        className={`w-full flex flex-col bg-neutral-950 relative overflow-hidden transition-all duration-300 ${
          showMobileFrame 
            ? 'max-w-md sm:rounded-[36px] sm:border sm:border-neutral-800 sm:shadow-2xl mobile-device-wrapper min-h-screen sm:min-h-[850px] sm:max-h-[92vh]' 
            : 'max-w-2xl min-h-screen'
        }`}
      >
        {/* Header with 3 dots in top right */}
        <TopHeader showMobileFrame={showMobileFrame} setShowMobileFrame={setShowMobileFrame} />

        {/* Scrollable Active View */}
        <main className="flex-1 overflow-y-auto px-4 py-3">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'goals' && <GoalsView />}
          {activeTab === 'more' && <MoreView />}
        </main>

        {/* Centered Bottom Navigation (2 items | + | 2 items) */}
        <BottomNav />

        {/* Global Modals */}
        <QuickCreateMenu />
        <QuickAddModal />
        <TaskDetailModal />
        
        {/* Global Goal & Routine Modals triggered from QuickCreateMenu */}
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
    </div>
  );
};

export function App() {
  const [showMobileFrame, setShowMobileFrame] = useState(true);

  return (
    <FKUSProvider>
      <MainContent showMobileFrame={showMobileFrame} setShowMobileFrame={setShowMobileFrame} />
    </FKUSProvider>
  );
}

export default App;
