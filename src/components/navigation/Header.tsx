import React, { useState } from 'react';
import { Search, Bell, Calendar, Plus, ChevronDown, Expand } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

interface HeaderProps {
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentProject } = useProject();
  
  // View title mapping
  const viewTitles: Record<string, string> = {
    dashboard: '儀表板',
    gantt: '甘特圖',
    tasks: '任務',
    resources: '資源',
    costs: '成本',
    risks: '風險',
    snapshots: '備份',
    recent: '最近',
    reports: '報告',
    settings: '設定',
  };

  return (
    <header className="bg-white border-b border-slate-100 py-3 px-6 flex items-center justify-between shadow-soft">
      <div className="flex items-center">
        <h1 className="text-xl font-display text-slate-800">{viewTitles[currentView] || '儀表板'}</h1>
        {currentProject && (
          <div className="ml-4 flex items-center">
            <div className="w-1 h-1 rounded-full bg-slate-300 mx-3"></div>
            <span className="text-slate-500">{currentProject.name}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜尋..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-300 transition-colors"
          />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        </div>
        
        <button className="p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-teal-500 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>
        
        <button className="p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-teal-500 transition-colors">
          <Calendar size={20} />
        </button>
        
        <button className="ml-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-navy-500 hover:from-teal-600 hover:to-navy-600 text-white rounded-full text-sm font-medium flex items-center transition-colors shadow-soft">
          <Plus size={16} className="mr-1.5" />
          <span>新建</span>
        </button>
        
        <div className="h-6 border-r border-slate-200 mx-2"></div>
        
        <button className="flex items-center text-slate-700 hover:bg-slate-50 p-2 rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border-2 border-white shadow-soft">
            <img 
              src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100" 
              alt="User avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium text-sm mr-1">Alex Chen</span>
          <ChevronDown size={14} />
        </button>
        
        <button className="p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <Expand size={20} />
        </button>
      </div>
    </header>
  );
};