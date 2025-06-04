import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Calendar, Clock, Users, CheckSquare, List, Grid, Filter, Search, Plus, ArrowUpDown, Bookmark, MoreHorizontal, ChevronDown } from 'lucide-react';
import { Task } from '../types/projectTypes';

export const TasksView: React.FC = () => {
  const { currentProject } = useProject();
  const [viewType, setViewType] = useState<'list' | 'board'>('board');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-slate-500">請先選擇一個專案</p>
        </div>
      </div>
    );
  }
  
  // 過濾任務
  const getFilteredTasks = (): Task[] => {
    let filtered = [...currentProject.tasks];
    
    // 依狀態過濾
    if (filterStatus) {
      filtered = filtered.filter(task => task.status === filterStatus);
    }
    
    // 依搜尋條件過濾
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  const filteredTasks = getFilteredTasks();
  
  // 依狀態分組任務
  const getStatusGroups = () => {
    const groups: Record<string, Task[]> = {
      'not-started': [],
      'in-progress': [],
      'delayed': [],
      'completed': []
    };
    
    filteredTasks.forEach(task => {
      groups[task.status].push(task);
    });
    
    return groups;
  };
  
  const tasksByStatus = getStatusGroups();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-slate-500';
      case 'in-progress': return 'bg-navy-500';
      case 'delayed': return 'bg-amber-500';
      case 'completed': return 'bg-teal-500';
      default: return 'bg-slate-500';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'not-started': return '未開始';
      case 'in-progress': return '進行中';
      case 'delayed': return '已延遲';
      case 'completed': return '已完成';
      default: return status;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-slate-100 text-slate-800';
      case 'in-progress': return 'bg-navy-100 text-navy-800';
      case 'delayed': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-teal-100 text-teal-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-slate-100 text-slate-800';
      case 'medium': return 'bg-navy-100 text-navy-800';
      case 'high': return 'bg-amber-100 text-amber-800';
      case 'urgent': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };
  
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      case 'urgent': return '緊急';
      default: return priority;
    }
  };
  
  // 獲取資源名稱
  const getResourceName = (resourceId: string) => {
    const resource = currentProject.resources.find(r => r.id === resourceId);
    return resource ? resource.name : '未分配';
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-display font-bold text-slate-800 mr-3">任務管理</h1>
            <div className="flex items-center justify-center rounded-full bg-teal-50 w-6 h-6 text-xs font-medium text-teal-700">
              {filteredTasks.length}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="搜尋任務..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 bg-white border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-300 transition-colors shadow-soft"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
            
            <div className="flex items-center space-x-1 border border-slate-100 rounded-full overflow-hidden bg-white shadow-soft">
              <button
                onClick={() => setViewType('board')}
                className={`p-2 ${
                  viewType === 'board' 
                    ? 'bg-teal-50 text-teal-700' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                } transition-colors`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 ${
                  viewType === 'list' 
                    ? 'bg-teal-50 text-teal-700' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                } transition-colors`}
              >
                <List size={16} />
              </button>
            </div>
            
            <button className="px-3 py-2 bg-white border border-slate-100 rounded-full text-slate-500 hover:bg-slate-50 transition-colors text-sm flex items-center shadow-soft">
              <Filter size={14} className="mr-1.5" />
              篩選
              <ChevronDown size={14} className="ml-1.5" />
            </button>
            
            <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-navy-500 hover:from-teal-600 hover:to-navy-600 text-white rounded-full text-sm flex items-center shadow-soft">
              <Plus size={14} className="mr-1.5" />
              新增任務
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => setFilterStatus(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-soft transition-colors ${
              filterStatus === null ? 'bg-navy-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            全部
          </button>
          <button 
            onClick={() => setFilterStatus('not-started')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-soft transition-colors ${
              filterStatus === 'not-started' ? 'bg-slate-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            未開始
          </button>
          <button 
            onClick={() => setFilterStatus('in-progress')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-soft transition-colors ${
              filterStatus === 'in-progress' ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            進行中
          </button>
          <button 
            onClick={() => setFilterStatus('delayed')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-soft transition-colors ${
              filterStatus === 'delayed' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            已延遲
          </button>
          <button 
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-soft transition-colors ${
              filterStatus === 'completed' ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            已完成
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto px-6 pb-6">
        {viewType === 'board' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full max-h-full">
            {Object.entries(tasksByStatus).map(([status, tasks]) => (
              <div 
                key={status}
                className="flex flex-col card max-h-full"
              >
                <div className="p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mr-2`}></div>
                      <h3 className="font-medium text-slate-800">{getStatusText(status)}</h3>
                    </div>
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-xs text-slate-600 font-medium">
                      {tasks.length}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  {tasks.length > 0 ? (
                    tasks.map(task => (
                      <div 
                        key={task.id}
                        className="card-gradient p-4 hover:translate-y-[-2px] transition-all"
                      >
                        <div className="flex items-start mb-2">
                          {task.isMilestone && (
                            <div className="p-1 mr-1 rounded bg-amber-100">
                              <Bookmark size={12} className="text-amber-600" />
                            </div>
                          )}
                          <h4 className="text-sm font-medium text-slate-800 flex-1">{task.name}</h4>
                          <button className="text-slate-400 hover:text-slate-600">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                        
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">進度</span>
                            <span className="font-medium text-slate-700">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${
                                status === 'delayed' ? 'bg-amber-500' : 
                                task.progress > 75 ? 'bg-teal-500' : 
                                'bg-navy-500'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-slate-500">
                            <Clock size={12} className="mr-1" />
                            <span>{new Date(task.endDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                              {getPriorityText(task.priority)}
                            </span>
                            
                            <div className="flex -space-x-1">
                              {task.assignedTo.slice(0, 2).map(resourceId => {
                                const resource = currentProject.resources.find(r => r.id === resourceId);
                                return (
                                  <div key={resourceId} className="w-5 h-5 rounded-full border-2 border-white overflow-hidden shadow-soft">
                                    {resource?.avatar ? (
                                      <img 
                                        src={resource.avatar} 
                                        alt={resource.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[8px] font-medium text-slate-600">
                                        {resource?.name.charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              {task.assignedTo.length > 2 && (
                                <div className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-medium text-slate-600 shadow-soft">
                                  +{task.assignedTo.length - 2}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center py-6 text-center">
                      <p className="text-sm text-slate-500">沒有任務</p>
                    </div>
                  )}
                </div>
                
                <div className="p-3 border-t border-slate-100">
                  <button className="w-full py-2 text-sm text-teal-600 hover:text-teal-800 flex items-center justify-center bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
                    <Plus size={14} className="mr-1" />
                    新增任務
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider sticky top-0 z-10 bg-slate-50">
                      <div className="flex items-center">
                        <CheckSquare size={14} className="mr-2" />
                        任務名稱
                        <ArrowUpDown size={14} className="ml-1 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider sticky top-0 z-10 bg-slate-50">
                      <div className="flex items-center">
                        狀態
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider sticky top-0 z-10 bg-slate-50">
                      <div className="flex items-center">
                        優先級
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider sticky top-0 z-10 bg-slate-50">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2" />
                        截止日期
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider sticky top-0 z-10 bg-slate-50">
                      <div className="flex items-center">
                        <Users size={14} className="mr-2" />
                        指派給
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider sticky top-0 z-10 bg-slate-50">
                      <div className="flex items-center">
                        進度
                      </div>
                    </th>
                    <th className="px-6 py-3 sticky top-0 z-10 bg-slate-50"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-start">
                            {task.isMilestone && (
                              <div className="p-1 mr-2 rounded bg-amber-100">
                                <Bookmark size={12} className="text-amber-600" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-slate-800">{task.name}</div>
                              <div className="text-xs text-slate-500 truncate max-w-xs">{task.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityText(task.priority)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-600">{new Date(task.endDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex -space-x-1">
                            {task.assignedTo.slice(0, 3).map(resourceId => {
                              const resource = currentProject.resources.find(r => r.id === resourceId);
                              return (
                                <div key={resourceId} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-soft" title={resource?.name}>
                                  {resource?.avatar ? (
                                    <img 
                                      src={resource.avatar} 
                                      alt={resource.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                                      {resource?.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {task.assignedTo.length > 3 && (
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 shadow-soft">
                                +{task.assignedTo.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mr-2">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  task.status === 'delayed' ? 'bg-amber-500' : 
                                  task.progress > 75 ? 'bg-teal-500' : 
                                  'bg-navy-500'
                                }`}
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-slate-700">{task.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-full px-3 py-1 text-xs transition-colors">編輯</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <p className="text-slate-500">沒有找到符合條件的任務</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};