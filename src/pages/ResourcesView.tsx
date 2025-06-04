import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Search, Filter, Plus, ChevronDown, Users, Clock, Briefcase, BarChart, ArrowRight } from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const { currentProject } = useProject();
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
  
  // 依搜尋條件過濾資源
  const filteredResources = currentProject.resources.filter(resource => 
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (resource.role && resource.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (resource.skills && resource.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  
  // 獲取團隊名稱
  const getTeamName = (teamId?: string) => {
    if (!teamId) return '未分配';
    const team = currentProject.teams.find(t => t.id === teamId);
    return team ? team.name : '未分配';
  };
  
  // 獲取指派給資源的任務數量
  const getAssignedTasksCount = (resourceId: string) => {
    return currentProject.tasks.filter(task => task.assignedTo.includes(resourceId)).length;
  };
  
  // 獲取當前進行中的任務數量
  const getCurrentTasksCount = (resourceId: string) => {
    return currentProject.tasks.filter(task => 
      task.assignedTo.includes(resourceId) && 
      task.status === 'in-progress'
    ).length;
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="relative bg-[url('https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-[1px] rounded-b-xl"></div>
        
        <div className="relative z-10 p-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜尋資源..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-64 bg-white/10 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/70"
                />
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              </div>
              
              <button className="px-3 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors text-sm flex items-center">
                <Filter size={14} className="mr-1.5" />
                篩選
                <ChevronDown size={14} className="ml-1.5" />
              </button>
            </div>
            
            <button className="px-4 py-2 bg-white text-purple-700 rounded-lg text-sm flex items-center shadow-sm hover:bg-purple-50 transition-colors">
              <Plus size={14} className="mr-1.5" />
              新增資源
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <div 
              key={resource.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-slate-200"
            >
              <div className="relative bg-[url('https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/70 to-indigo-50/70 backdrop-blur-[1px]"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 mr-3 border-2 border-white shadow-md">
                        {resource.avatar ? (
                          <img 
                            src={resource.avatar} 
                            alt={resource.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg font-medium text-slate-600">
                            {resource.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{resource.name}</h3>
                        <p className="text-sm text-slate-600">{resource.role || '未指定角色'}</p>
                      </div>
                    </div>
                    
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      resource.utilization > 90 ? 'bg-rose-100 text-rose-800' :
                      resource.utilization > 75 ? 'bg-amber-100 text-amber-800' :
                      resource.utilization > 60 ? 'bg-emerald-100 text-emerald-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      利用率 {resource.utilization}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/60 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        resource.utilization > 90 ? 'bg-rose-500' :
                        resource.utilization > 75 ? 'bg-amber-500' :
                        resource.utilization > 60 ? 'bg-emerald-500' :
                        'bg-gradient-to-r from-purple-500 to-indigo-500'
                      }`}
                      style={{ width: `${resource.utilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1.5">
                      <Clock size={14} className="text-slate-500 mr-1.5" />
                      <h4 className="text-xs font-medium text-slate-500 uppercase">工作時數</h4>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">{resource.availability.length * 8}小時/週</p>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1.5">
                      <Briefcase size={14} className="text-slate-500 mr-1.5" />
                      <h4 className="text-xs font-medium text-slate-500 uppercase">任務數量</h4>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">{getAssignedTasksCount(resource.id)}</p>
                  </div>
                </div>
                
                {resource.skills && resource.skills.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-sm font-medium text-slate-800 mb-2">專業技能</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {resource.skills.map((skill, index) => (
                        <span key={index} className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full capitalize">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-slate-800 mb-2">聯絡資訊</h3>
                  <div className="grid grid-cols-1 gap-1">
                    {resource.email && (
                      <div className="text-sm">
                        <span className="text-slate-500">電子郵件:</span>{' '}
                        <span className="text-slate-700">{resource.email}</span>
                      </div>
                    )}
                    {resource.phone && (
                      <div className="text-sm">
                        <span className="text-slate-500">電話:</span>{' '}
                        <span className="text-slate-700">{resource.phone}</span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="text-slate-500">團隊:</span>{' '}
                      <span className="text-slate-700">{getTeamName(resource.teamId)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <div className="flex items-center">
                    <BarChart size={14} className="mr-1.5" />
                    <span>${resource.cost}/小時</span>
                  </div>
                  <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
                    <span>查看詳情</span>
                    <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredResources.length === 0 && (
            <div className="col-span-full flex items-center justify-center bg-white rounded-xl shadow-sm p-12">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <Users size={48} className="text-slate-300" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">沒有找到符合條件的資源</h2>
                <p className="text-slate-500 mb-4">嘗試使用不同的搜尋條件或建立新資源</p>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-sm hover:from-purple-700 hover:to-indigo-700 transition-colors">
                  新增資源
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};