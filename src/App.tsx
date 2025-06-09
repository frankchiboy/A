import React, { useState, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';

const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const GanttView = lazy(() => import('./pages/GanttView').then(module => ({ default: module.GanttView })));
const TasksView = lazy(() => import('./pages/TasksView').then(module => ({ default: module.TasksView })));
const ResourcesView = lazy(() => import('./pages/ResourcesView').then(module => ({ default: module.ResourcesView })));
const CostsView = lazy(() => import('./pages/CostsView').then(module => ({ default: module.default }))); 
const RisksView = lazy(() => import('./pages/RisksView').then(module => ({ default: module.default }))); 
const SnapshotsView = lazy(() => import('./pages/SnapshotsView').then(module => ({ default: module.default })));
const RecentProjectsView = lazy(() => import('./pages/RecentProjectsView').then(module => ({ default: module.default })));
const ReportsView = lazy(() => import('./pages/ReportsView'));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const WelcomeOverlay = lazy(() => import('./components/overlays/WelcomeOverlay'));

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showWelcome, setShowWelcome] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'gantt':
        return <GanttView />;
      case 'tasks':
        return <TasksView />;
      case 'resources':
        return <ResourcesView />;
      case 'costs':
        return <CostsView />;
      case 'risks':
        return <RisksView />;
      case 'snapshots':
        return <SnapshotsView />;
      case 'recent':
        return <RecentProjectsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <ProjectProvider>
        <div className="flex h-screen overflow-hidden bg-[#FEFEFE]">
          <div className="fixed inset-0 bg-noise opacity-40"></div>
          <div className="relative z-10 flex w-full">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header currentView={currentView} />
              <main className="flex-1 overflow-auto p-0 relative bg-slate-50/50">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="relative flex flex-col items-center">
                      <div className="h-16 w-16 rounded-full bg-gradient-soft from-amber-300 to-amber-500 animate-pulse mb-4"></div>
                      <div className="h-2 w-32 bg-slate-200 rounded-full mb-3"></div>
                      <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                      <div className="absolute inset-0 bg-gradient-radial from-white via-transparent to-transparent opacity-70"></div>
                    </div>
                  </div>
                }>
                  {renderView()}
                </Suspense>
              </main>
            </div>
            {showWelcome && (
              <Suspense fallback={
                <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-wave from-amber-300 via-teal-300 to-navy-300 animate-spin"></div>
                </div>
              }>
                <WelcomeOverlay onClose={() => setShowWelcome(false)} />
              </Suspense>
            )}
          </div>
        </div>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;