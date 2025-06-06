import React from 'react';
import { ProjectSummary } from '../components/dashboard/ProjectSummary';
import { TaskProgress } from '../components/dashboard/TaskProgress';
import KeyMetrics from '../components/dashboard/KeyMetrics';
import { ResourceAllocation } from '../components/dashboard/ResourceAllocation';
import { useProject } from '../context/ProjectContext';
import { Bell, Calendar, Layers, TrendingUp, Anchor, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentProject } = useProject();
  
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-wave from-teal-300 via-navy-300 to-amber-300 flex items-center justify-center shadow-soft">
              <Anchor size={36} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">開始您的專案之旅</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">選擇或創建一個專案以啟動您的專業管理體驗</p>
          <button className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-navy-500 text-white rounded-full font-medium shadow-soft hover:from-teal-600 hover:to-navy-600 transition-colors">
            創建新專案
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 mb-1">專案概覽</h1>
          <p className="text-slate-500">掌握專案狀態、進度和關鍵指標</p>
        </div>
        
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button className="btn-outline">
            <Layers size={16} className="mr-2" />
            專案報告
          </button>
          <button className="btn-primary">
            <Bell size={16} className="mr-2" />
            設定提醒
          </button>
        </div>
      </div>
      
      <ProjectSummary />
      <KeyMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8">
          <TaskProgress />
        </div>
        
        <div className="lg:col-span-4">
          <div className="card mb-6">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-medium font-display text-slate-800">今日概要</h3>
              <span className="text-xs font-medium bg-teal-50 text-teal-700 rounded-full px-2.5 py-1">
                {new Date().toLocaleDateString('zh-TW', { weekday: 'short' })}
              </span>
            </div>
            
            <div className="p-5 space-y-4">
              {currentProject.tasks
                .filter(task => task.status === 'in-progress')
                .slice(0, 3)
                .map(task => (
                  <div key={task.id} className="card-gradient p-3 hover:translate-y-[-2px] transition-all">
                    <h4 className="font-medium text-sm text-slate-800 mb-1">{task.name}</h4>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Calendar size={13} className="text-slate-400 mr-1" />
                        <span className="text-xs text-slate-500">{new Date(task.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-slate-100 rounded-full h-1 mr-2 w-16">
                          <div className="bg-teal-500 h-1 rounded-full" style={{ width: `${task.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-slate-700">{task.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
                
              {currentProject.tasks.filter(task => task.status === 'in-progress').length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500">沒有進行中的任務</p>
                </div>
              )}
              
              <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-navy-600 text-sm font-medium flex items-center justify-center transition-colors">
                查看所有任務
                <ArrowRight size={14} className="ml-2" />
              </button>
            </div>
          </div>
          
          <div className="card bg-gradient-soft from-navy-50 to-slate-50">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center mb-1">
                <TrendingUp size={18} className="text-navy-500 mr-2" />
                <h2 className="font-display text-slate-800">績效指標</h2>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600">任務完成率</span>
                  <span className="text-sm font-medium text-slate-800">
                    {Math.round((currentProject.tasks.filter(t => t.status === 'completed').length / currentProject.tasks.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-teal-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.round((currentProject.tasks.filter(t => t.status === 'completed').length / currentProject.tasks.length) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600">里程碑達成率</span>
                  <span className="text-sm font-medium text-slate-800">
                    {Math.round((currentProject.milestones.filter(m => m.status === 'reached').length / currentProject.milestones.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-navy-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.round((currentProject.milestones.filter(m => m.status === 'reached').length / currentProject.milestones.length) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600">團隊產能</span>
                  <span className="text-sm font-medium text-slate-800">75%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-amber-500 h-1.5 rounded-full" 
                    style={{ width: `75%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ResourceAllocation />
    </div>
  );
};