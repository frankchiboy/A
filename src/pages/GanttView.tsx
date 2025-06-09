import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Calendar, ArrowLeft, ArrowRight, Plus, Filter, ChevronDown } from 'lucide-react';
import { Task } from '../types/projectTypes';

export const GanttView: React.FC = () => {
  const { currentProject } = useProject();
  const [timeScale, setTimeScale] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-slate-500">請先選擇一個專案</p>
        </div>
      </div>
    );
  }
  
  // 計算甘特圖日期範圍
  const calculateDateRange = () => {
    const today = new Date(currentDate);
    const dates: Date[] = [];
    
    if (timeScale === 'day') {
      // 顯示兩週的天
      for (let i = -7; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }
    } else if (timeScale === 'week') {
      // 顯示8週
      for (let i = -4; i < 4; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i * 7);
        dates.push(date);
      }
    } else if (timeScale === 'month') {
      // 顯示6個月
      for (let i = -3; i < 3; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() + i);
        dates.push(date);
      }
    }
    
    return dates;
  };
  
  // 獲取日期範圍
  const dateRange = calculateDateRange();
  
  // 計算項目在甘特圖上的位置和長度
  const calculateTaskPosition = (task: Task) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    // 計算位置相對於日期範圍的起始點
    const startDate = dateRange[0];
    const endDate = dateRange[dateRange.length - 1];
    
    if (timeScale === 'day') {
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const taskStartOffset = (taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const taskDuration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24) + 1; // 加1是為了包括結束日
      
      return {
        left: `${(taskStartOffset / totalDays) * 100}%`,
        width: `${(taskDuration / totalDays) * 100}%`
      };
    } else if (timeScale === 'week') {
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const taskStartOffset = Math.max(0, (taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const taskEndOffset = Math.min(totalDays, (taskEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const taskDuration = taskEndOffset - taskStartOffset;
      
      return {
        left: `${(taskStartOffset / totalDays) * 100}%`,
        width: `${(taskDuration / totalDays) * 100}%`
      };
    } else if (timeScale === 'month') {
      // 計算月份差異
      const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
      const taskStartMonths = Math.max(0, (taskStart.getFullYear() - startDate.getFullYear()) * 12 + (taskStart.getMonth() - startDate.getMonth()));
      const taskEndMonths = Math.min(totalMonths - 1, (taskEnd.getFullYear() - startDate.getFullYear()) * 12 + (taskEnd.getMonth() - startDate.getMonth())) + 1;
      const taskDurationMonths = taskEndMonths - taskStartMonths;
      
      return {
        left: `${(taskStartMonths / totalMonths) * 100}%`,
        width: `${(taskDurationMonths / totalMonths) * 100}%`
      };
    }
    
    return { left: '0%', width: '0%' };
  };
  
  // 格式化日期標籤
  const formatDateLabel = (date: Date) => {
    if (timeScale === 'day') {
      return date.getDate().toString();
    } else if (timeScale === 'week') {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      return date.toLocaleDateString('zh-TW', { month: 'short' });
    }
  };
  
  // 今天的日期
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // 移動甘特圖視圖
  const moveTimeframe = (direction: 'forward' | 'backward') => {
    const newDate = new Date(currentDate);
    
    if (timeScale === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'forward' ? 7 : -7));
    } else if (timeScale === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'forward' ? 28 : -28));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'forward' ? 3 : -3));
    }
    
    setCurrentDate(newDate);
  };
  
  
  // 計算今天在甘特圖中的位置
  const calculateTodayPosition = () => {
    const startDate = dateRange[0];
    const endDate = dateRange[dateRange.length - 1];
    
    if (timeScale === 'day' || timeScale === 'week') {
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const todayOffset = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (todayOffset < 0 || todayOffset > totalDays) {
        return null; // 今天不在可見範圍內
      }
      
      return `${(todayOffset / totalDays) * 100}%`;
    } else if (timeScale === 'month') {
      const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
      const todayMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
      
      if (todayMonths < 0 || todayMonths >= totalMonths) {
        return null; // 今天不在可見範圍內
      }
      
      // 假設每個月在甘特圖中的寬度是相同的
      return `${((todayMonths + (today.getDate() / 30)) / totalMonths) * 100}%`;
    }
    
    return null;
  };
  
  const todayPosition = calculateTodayPosition();

  return (
    <div className="flex flex-col h-full">
      <div className="relative bg-[url('https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 backdrop-blur-[1px] rounded-b-xl"></div>
        
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTimeScale('day')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  timeScale === 'day'
                    ? 'bg-purple-500 text-white font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                日
              </button>
              <button
                onClick={() => setTimeScale('week')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  timeScale === 'week'
                    ? 'bg-purple-500 text-white font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                週
              </button>
              <button
                onClick={() => setTimeScale('month')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  timeScale === 'month'
                    ? 'bg-purple-500 text-white font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                月
              </button>
              
              <div className="h-6 border-r border-white/30 mx-2"></div>
              
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm rounded-lg text-white hover:bg-white/10 transition-colors flex items-center"
              >
                <Calendar size={16} className="mr-1.5" />
                今天
              </button>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => moveTimeframe('backward')}
                  className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
                <button 
                  onClick={() => moveTimeframe('forward')}
                  className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors text-sm flex items-center">
                <Filter size={14} className="mr-1.5" />
                篩選
                <ChevronDown size={14} className="ml-1.5" />
              </button>
              
              <button className="px-4 py-2 bg-white text-purple-700 rounded-lg text-sm flex items-center shadow-sm hover:bg-purple-50 transition-colors">
                <Plus size={14} className="mr-1.5" />
                新增任務
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex border-b border-white/20 pb-2">
              <div className="w-64 flex-shrink-0"></div>
              <div className="flex-1 flex">
                {dateRange.map((date, index) => (
                  <div
                    key={index}
                    className={`flex-1 text-xs text-center font-medium ${
                      date.getTime() === today.getTime() ? 'text-purple-300' : 'text-white/80'
                    }`}
                  >
                    {formatDateLabel(date)}
                    {timeScale === 'day' && (
                      <div className="text-[10px] text-white/60">
                        {date.toLocaleDateString('zh-TW', { weekday: 'short' })}
                      </div>
                    )}
                    {timeScale === 'week' && date.getDate() <= 7 && (
                      <div className="text-[10px] text-white/60">
                        {date.toLocaleDateString('zh-TW', { month: 'short' })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/60 to-slate-100/60 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative min-h-full">
          {/* 今天的垂直線 */}
          {todayPosition && (
            <div
              className="absolute top-0 bottom-0 w-px bg-purple-500 z-10"
              style={{ left: todayPosition }}
            ></div>
          )}
          
          <div className="flex min-h-full">
            {/* 任務名稱列 */}
            <div className="w-64 flex-shrink-0 border-r border-slate-200 bg-white/40 backdrop-blur-sm">
              <div className="sticky top-0 bg-slate-50 border-b border-slate-200 py-2.5 px-4 text-sm font-medium text-slate-800">
                專案任務
              </div>
              <div>
                {currentProject.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`py-2.5 px-4 text-sm border-b border-slate-100 truncate ${
                      task.isMilestone ? 'font-medium text-slate-800' : 'text-slate-600'
                    }`}
                  >
                    {task.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* 甘特圖 */}
            <div className="flex-1 relative bg-white/40 backdrop-blur-sm">
              {/* 網格背景 */}
              <div className="absolute inset-0 grid" style={{ 
                gridTemplateColumns: `repeat(${dateRange.length}, 1fr)`,
                gridTemplateRows: `repeat(${currentProject.tasks.length}, 1fr)` 
              }}>
                {Array.from({ length: dateRange.length * currentProject.tasks.length }).map((_, index) => (
                  <div key={index} className="border-r border-b border-slate-100"></div>
                ))}
              </div>
              
              {/* 任務條 */}
              {currentProject.tasks.map((task, taskIndex) => {
                const { left, width } = calculateTaskPosition(task);
                const isTaskVisible = parseFloat(left) <= 100 && parseFloat(left) + parseFloat(width) >= 0;
                
                if (!isTaskVisible) return null;
                
                return (
                  <div
                    key={task.id}
                    className={`absolute h-8 rounded-md shadow-sm cursor-pointer ${
                      task.isMilestone 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 w-2 transform -translate-x-1' 
                        : task.status === 'completed' 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                          : task.status === 'delayed' 
                            ? 'bg-gradient-to-r from-rose-500 to-red-600' 
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                    }`}
                    style={{
                      top: `${taskIndex * 40 + 4}px`,
                      left,
                      width: task.isMilestone ? '8px' : width,
                    }}
                  >
                    {!task.isMilestone && (
                      <div className="absolute inset-0 flex items-center px-2 overflow-hidden">
                        <div className="text-xs font-medium text-white truncate">
                          {task.name} ({task.progress}%)
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* 任務依賴關係線 */}
              {currentProject.tasks.flatMap(task => {
                if (task.dependencies.length === 0) return null;
                
                return task.dependencies.map(depId => {
                  const dependencyTask = currentProject.tasks.find(t => t.id === depId);
                  if (!dependencyTask) return null;
                  
                  const dependencyTaskIndex = currentProject.tasks.findIndex(t => t.id === depId);
                  const taskIndex = currentProject.tasks.findIndex(t => t.id === task.id);

                  const depPosition = calculateTaskPosition(dependencyTask);
                  const taskPosition = calculateTaskPosition(task);
                  
                  // 檢查任務是否在可見範圍內
                  const isDepVisible = parseFloat(depPosition.left) <= 100 && parseFloat(depPosition.left) + parseFloat(depPosition.width) >= 0;
                  const isTaskVisible = parseFloat(taskPosition.left) <= 100 && parseFloat(taskPosition.left) + parseFloat(taskPosition.width) >= 0;
                  
                  if (!isDepVisible || !isTaskVisible || !dependencyTask) return null;
                  
                  // 計算連線點
                  const startX = parseFloat(depPosition.left) + parseFloat(depPosition.width);
                  const startY = dependencyTaskIndex * 40 + 20;
                  const endX = parseFloat(taskPosition.left);
                  const endY = taskIndex * 40 + 20;
                  
                  // 設計貝塞爾曲線路徑
                  const path = `M${startX}%,${startY} C${startX + 3}%,${startY} ${endX - 3}%,${endY} ${endX}%,${endY}`;
                  
                  return (
                    <svg
                      key={`${task.id}-${depId}`}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ top: 0, left: 0, zIndex: 5 }}
                    >
                      <path
                        d={path}
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="6"
                          markerHeight="6"
                          refX="5"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 6 3, 0 6" fill="#94a3b8" />
                        </marker>
                      </defs>
                    </svg>
                  );
                });
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};