import React from 'react';
import { 
  LayoutDashboard, 
  GanttChart, 
  CheckSquare, 
  Users, 
  BarChart4, 
  Settings, 
  PlusCircle,
  Anchor,
  Menu,
  X
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const [expanded, setExpanded] = React.useState(true);
  const { currentProject } = useProject();

  const navItems = [
    { id: 'dashboard', label: '儀表板', icon: <LayoutDashboard size={20} /> },
    { id: 'gantt', label: '甘特圖', icon: <GanttChart size={20} /> },
    { id: 'tasks', label: '任務', icon: <CheckSquare size={20} /> },
    { id: 'resources', label: '資源', icon: <Users size={20} /> },
    { id: 'reports', label: '報告', icon: <BarChart4 size={20} /> },
    { id: 'settings', label: '設定', icon: <Settings size={20} /> },
  ];

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`h-screen transition-all duration-300 ease-in-out flex flex-col ${expanded ? 'w-64' : 'w-20'}`}>
      <div className="relative z-10 flex items-center h-16 px-4 border-b border-slate-100 bg-white">
        <div className="flex items-center">
          <div className="rounded-xl bg-gradient-wave from-teal-400 via-teal-500 to-navy-500 p-2 mr-2 shadow-soft">
            <Anchor size={expanded ? 24 : 20} className="text-white" />
          </div>
          {expanded && <h1 className="text-xl font-display font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-navy-600">ProjectCraft</h1>}
        </div>
        <button 
          onClick={toggleSidebar} 
          className="ml-auto p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
        >
          {expanded ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      
      <div className="relative z-10 mt-6 px-3">
        {expanded && (
          <div className="flex items-center mb-4 px-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">我的專案</h2>
            <button className="ml-auto p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400">
              <PlusCircle size={14} />
            </button>
          </div>
        )}
        
        {expanded && currentProject && (
          <div className="mb-6">
            <div className="relative bg-gradient-soft from-white to-slate-50 rounded-xl p-3 mb-2 shadow-soft overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-navy-500" style={{ width: `${currentProject.progress}%` }}></div>
              <h3 className="font-medium text-sm mb-1 truncate text-slate-800">{currentProject.name}</h3>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">進度</span>
                <span className="font-medium text-teal-600">{currentProject.progress}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <nav className="relative z-10 flex-1 px-3 mt-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                  currentView === item.id
                    ? 'bg-gradient-soft from-navy-50 via-teal-50 to-navy-50 text-navy-700 font-medium shadow-soft'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <span className={`${expanded ? 'mr-3' : 'mx-auto'} ${currentView === item.id ? 'text-teal-600' : 'text-slate-400'}`}>{item.icon}</span>
                {expanded && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="relative z-10 mt-auto p-4 border-t border-slate-100">
        {expanded ? (
          <div className="flex items-center bg-gradient-soft from-white to-slate-50 p-2 rounded-xl shadow-soft">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-slate-100 border-2 border-white shadow-soft">
              <img 
                src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100" 
                alt="User avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Alex Chen</p>
              <p className="text-xs text-slate-400">專案經理</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-soft">
              <img 
                src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100" 
                alt="User avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};