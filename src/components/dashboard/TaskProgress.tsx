import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export const TaskProgress: React.FC = () => {
  const { currentProject } = useProject();

  if (!currentProject) {
    return null;
  }

  const tasks = currentProject.tasks;
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  const calculatePercentage = (count: number) => {
    return tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
  };

  return (
    <div className="card mb-6">
      <div className="p-5 border-b border-slate-100">
        <h2 className="font-display font-medium text-slate-800">任務進度追蹤</h2>
        <p className="text-slate-500 text-sm">專案任務完成狀態概覽</p>
      </div>
      
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-gradient">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-teal-100 rounded-lg text-teal-700 mr-3">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">已完成任務</p>
                <p className="text-xl font-medium text-slate-800">{completedTasks.length}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{calculatePercentage(completedTasks.length)}% 的總任務</span>
              <span className="flex items-center text-teal-600">
                <TrendingUp size={14} className="mr-1" />
                +12%
              </span>
            </div>
          </div>
        </div>

        <div className="card-gradient">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-navy-100 rounded-lg text-navy-700 mr-3">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">進行中任務</p>
                <p className="text-xl font-medium text-slate-800">{inProgressTasks.length}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{calculatePercentage(inProgressTasks.length)}% 的總任務</span>
              <span className="flex items-center text-navy-600">
                <TrendingUp size={14} className="mr-1" />
                +5%
              </span>
            </div>
          </div>
        </div>

        <div className="card-gradient">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-500 mr-3">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">待處理任務</p>
                <p className="text-xl font-medium text-slate-800">{pendingTasks.length}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{calculatePercentage(pendingTasks.length)}% 的總任務</span>
              <span className="flex items-center text-slate-600">
                <TrendingUp size={14} className="mr-1" />
                +0%
              </span>
            </div>
          </div>
        </div>

        <div className="card-gradient">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-700 mr-3">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">已延遲任務</p>
                <p className="text-xl font-medium text-slate-800">{tasks.filter(t => t.status === 'delayed').length}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{calculatePercentage(tasks.filter(t => t.status === 'delayed').length)}% 的總任務</span>
              <span className="flex items-center text-amber-600">
                <TrendingUp size={14} className="mr-1" />
                -3%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="w-full bg-slate-100 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-teal-400 to-teal-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${calculatePercentage(completedTasks.length)}%` }}
          ></div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>總進度</span>
          <span className="font-medium text-teal-700">{calculatePercentage(completedTasks.length)}%</span>
        </div>
      </div>
    </div>
  );
};