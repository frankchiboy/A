import React from 'react';
import { Users, TrendingUp, ArrowRight, Briefcase } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const ResourceAllocation: React.FC = () => {
  const { currentProject } = useProject();
  
  if (!currentProject) return null;
  
  // 計算資源利用率統計
  const averageUtilization = currentProject.resources.length > 0
    ? Math.round(currentProject.resources.reduce((sum, res) => sum + res.utilization, 0) / currentProject.resources.length)
    : 0;
  
  // 找出利用率最高和最低的資源
  const sortedByUtilization = [...currentProject.resources].sort((a, b) => b.utilization - a.utilization);
  const highestUtilized = sortedByUtilization[0];
  const lowestUtilized = sortedByUtilization[sortedByUtilization.length - 1];
  
  // 依角色分組資源
  const resourcesByRole = currentProject.resources.reduce((acc: Record<string, number>, resource) => {
    const role = resource.role || '未指定';
    if (!acc[role]) {
      acc[role] = 0;
    }
    acc[role]++;
    return acc;
  }, {});
  
  // 獲取團隊資訊
  const getTeamName = (teamId?: string) => {
    if (!teamId) return '未分配';
    const team = currentProject.teams.find(t => t.id === teamId);
    return team ? team.name : '未分配';
  };

  return (
    <div className="card mb-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 xl:w-2/5">
          <div className="relative h-full bg-[url('https://images.pexels.com/photos/5989925/pexels-photo-5989925.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 to-navy-800/80 backdrop-blur-sm"></div>
            <div className="relative z-10 p-6 h-full flex flex-col">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md mr-3">
                    <Users size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display text-white">資源分配</h2>
                    <p className="text-sm text-white/70">團隊資源使用情況和分配</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-white text-sm">整體資源利用率</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    averageUtilization > 90 ? 'bg-amber-200/20 text-amber-200' :
                    averageUtilization > 75 ? 'bg-amber-200/20 text-amber-200' :
                    averageUtilization > 60 ? 'bg-teal-200/20 text-teal-200' :
                    'bg-white/10 text-white'
                  }`}>
                    {averageUtilization}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
                  <div 
                    className={`h-1.5 rounded-full ${
                      averageUtilization > 90 ? 'bg-amber-400' :
                      averageUtilization > 75 ? 'bg-amber-400' :
                      averageUtilization > 60 ? 'bg-teal-400' :
                      'bg-navy-400'
                    }`}
                    style={{ width: `${averageUtilization}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <h3 className="font-medium text-white text-sm mb-3">團隊資源分配</h3>
                <div className="space-y-3">
                  {currentProject.teams.map(team => {
                    const teamResources = currentProject.resources.filter(r => r.teamId === team.id);
                    const teamAverageUtilization = teamResources.length > 0
                      ? Math.round(teamResources.reduce((sum, res) => sum + res.utilization, 0) / teamResources.length)
                      : 0;
                    
                    return (
                      <div key={team.id} className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3">
                          <Users size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium text-xs text-white truncate">{team.name}</h4>
                            <div className="flex items-center">
                              <span className="text-xs text-white/70 mr-2">{teamAverageUtilization}%</span>
                              <span className="text-[10px] text-white/50">{teamResources.length}</span>
                            </div>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${
                                teamAverageUtilization > 90 ? 'bg-amber-400' :
                                teamAverageUtilization > 75 ? 'bg-amber-400' :
                                teamAverageUtilization > 60 ? 'bg-teal-400' :
                                'bg-navy-400'
                              }`}
                              style={{ width: `${teamAverageUtilization}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-auto pt-6">
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm flex items-center justify-center transition-colors">
                  <span>查看詳情</span>
                  <ArrowRight size={14} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/2 xl:w-3/5">
          <div className="p-6">
            <h3 className="font-medium text-slate-800 mb-4 font-display">資源利用率</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card-gradient p-4">
                <div className="flex justify-between mb-1">
                  <h4 className="text-sm font-medium text-slate-700">高利用率資源</h4>
                  <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">Top 5</span>
                </div>
                <div className="mt-2 space-y-3">
                  {sortedByUtilization.slice(0, 3).map(resource => (
                    <div key={resource.id} className="flex items-center">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3 shadow-soft">
                        <img 
                          src={resource.avatar || "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100"}
                          alt={resource.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-teal-400 border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium text-slate-700">{resource.name}</p>
                          <span className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">{resource.utilization}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                          <div className="bg-teal-500 h-1 rounded-full" style={{ width: `${resource.utilization}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card-gradient p-4">
                <div className="flex justify-between mb-1">
                  <h4 className="text-sm font-medium text-slate-700">低利用率資源</h4>
                  <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Bottom 3</span>
                </div>
                <div className="mt-2 space-y-3">
                  {sortedByUtilization.slice(-3).reverse().map(resource => (
                    <div key={resource.id} className="flex items-center">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3 shadow-soft">
                        <img 
                          src={resource.avatar || "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100"}
                          alt={resource.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-amber-400 border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium text-slate-700">{resource.name}</p>
                          <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">{resource.utilization}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                          <div className="bg-amber-400 h-1 rounded-full" style={{ width: `${resource.utilization}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <h3 className="font-medium text-slate-800 mb-4 font-display">角色分佈</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 mb-6">
              {Object.entries(resourcesByRole).map(([role, count], index) => (
                <div key={role} className="card-gradient p-4">
                  <div className="flex items-center mb-2">
                    <div className={`p-2 rounded-lg mr-3 ${
                      index % 3 === 0 ? 'bg-teal-50 text-teal-700' :
                      index % 3 === 1 ? 'bg-navy-50 text-navy-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-slate-700">{role}</h4>
                      <p className="text-lg font-medium text-slate-800">{count}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <span>資源佔比:</span>
                    <span className="ml-auto font-medium text-slate-700">
                      {Math.round((count / currentProject.resources.length) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="font-medium text-slate-800 mb-4 font-display">資源熱點圖</h3>
            <div className="card-gradient p-4 h-40 flex items-center justify-center">
              <p className="text-sm text-slate-500">資源熱點圖視覺化 - 開發中</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};