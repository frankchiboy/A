import React from 'react';
import { Clock, CalendarDays, Users, CircleDollarSign, AlertTriangle } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const ProjectSummary: React.FC = () => {
  const { currentProject } = useProject();
  
  if (!currentProject) return null;
  
  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(currentProject.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate budget percentage
  const budgetPercentage = Math.round((currentProject.budget.spent / currentProject.budget.total) * 100);
  
  // Calculate task statuses
  const totalTasks = currentProject.tasks.length;
  const completedTasks = currentProject.tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = currentProject.tasks.filter(task => task.status === 'in-progress').length;
  const notStartedTasks = currentProject.tasks.filter(task => task.status === 'not-started').length;
  const delayedTasks = currentProject.tasks.filter(task => task.status === 'delayed').length;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentProject.budget.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* Project Overview Card */}
      <div className="lg:col-span-8">
        <div className="card overflow-hidden">
          <div className="relative h-36 bg-[url('https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-soft from-navy-900/50 to-teal-900/50 backdrop-blur-sm"></div>
            
            <div className="absolute inset-0 p-6">
              <h2 className="text-2xl font-display font-bold text-white mb-1">{currentProject.name}</h2>
              <p className="text-white/80 text-sm mb-4">{currentProject.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-2">
                      <Clock size={18} className="text-amber-200" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70">天數剩餘</p>
                      <p className="text-lg font-medium text-white">{daysRemaining}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center mr-2">
                      <CalendarDays size={18} className="text-teal-200" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70">專案進度</p>
                      <p className="text-lg font-medium text-white">{currentProject.progress}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-navy-500/20 flex items-center justify-center mr-2">
                      <Users size={18} className="text-navy-200" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70">團隊成員</p>
                      <p className="text-lg font-medium text-white">{currentProject.resources.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-2">
                      <CircleDollarSign size={18} className="text-amber-200" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70">預算使用</p>
                      <p className="text-lg font-medium text-white">{budgetPercentage}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium text-slate-800">整體進度</h3>
                <div className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">{currentProject.progress}%</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-teal-400 to-teal-600 h-1.5 rounded-full" 
                  style={{ width: `${currentProject.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-800 mb-4">任務狀態</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div>
                        <span className="text-sm text-slate-600">已完成</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-800 mr-2">{completedTasks}</span>
                        <span className="text-xs text-slate-500">({Math.round((completedTasks / totalTasks) * 100)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div 
                        className="bg-teal-500 h-1.5 rounded-full" 
                        style={{ width: `${Math.round((completedTasks / totalTasks) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-navy-500 mr-2"></div>
                        <span className="text-sm text-slate-600">進行中</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-800 mr-2">{inProgressTasks}</span>
                        <span className="text-xs text-slate-500">({Math.round((inProgressTasks / totalTasks) * 100)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div 
                        className="bg-navy-500 h-1.5 rounded-full" 
                        style={{ width: `${Math.round((inProgressTasks / totalTasks) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-slate-400 mr-2"></div>
                        <span className="text-sm text-slate-600">尚未開始</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-800 mr-2">{notStartedTasks}</span>
                        <span className="text-xs text-slate-500">({Math.round((notStartedTasks / totalTasks) * 100)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div 
                        className="bg-slate-400 h-1.5 rounded-full" 
                        style={{ width: `${Math.round((notStartedTasks / totalTasks) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        <span className="text-sm text-slate-600">已延遲</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-800 mr-2">{delayedTasks}</span>
                        <span className="text-xs text-slate-500">({Math.round((delayedTasks / totalTasks) * 100)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div 
                        className="bg-amber-500 h-1.5 rounded-full" 
                        style={{ width: `${Math.round((delayedTasks / totalTasks) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-800 mb-4">預算使用</h3>
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">已用</span>
                    <span className="font-medium text-slate-800">{formatCurrency(currentProject.budget.spent)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">總預算</span>
                    <span className="font-medium text-slate-800">{formatCurrency(currentProject.budget.total)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        budgetPercentage > 90 ? 'bg-amber-500' : 
                        budgetPercentage > 70 ? 'bg-amber-400' : 
                        'bg-teal-500'
                      }`}
                      style={{ width: `${budgetPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-slate-500">已使用 {budgetPercentage}%</span>
                    <span className="text-slate-500">剩餘 {formatCurrency(currentProject.budget.remaining)}</span>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-amber-50 rounded-xl">
                  <div className="mr-3 p-2 bg-amber-100 rounded-lg text-amber-700">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800">開發部門預算即將超支</p>
                    <p className="text-xs text-amber-600">建議審查開支計劃</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Milestones & Teams */}
      <div className="lg:col-span-4">
        <div className="card mb-6">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-medium font-display text-slate-800">即將到來的里程碑</h3>
          </div>
          
          <div className="p-5 space-y-3">
            {currentProject.milestones
              .filter(milestone => milestone.status === 'upcoming')
              .slice(0, 3)
              .map(milestone => (
                <div key={milestone.id} className="card-gradient p-4 hover:translate-y-[-2px] transition-all">
                  <h4 className="font-medium text-sm text-slate-800 mb-1">{milestone.name}</h4>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-1">{milestone.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CalendarDays size={13} className="text-slate-400 mr-1" />
                      <span className="text-xs text-slate-500">{new Date(milestone.date).toLocaleDateString()}</span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-teal-50 text-teal-700">
                      即將到來
                    </span>
                  </div>
                </div>
              ))}
              
            {currentProject.milestones.filter(milestone => milestone.status === 'upcoming').length === 0 && (
              <div className="p-4 border border-slate-100 rounded-xl text-center">
                <p className="text-sm text-slate-500">沒有即將到來的里程碑</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-medium font-display text-slate-800">專案團隊</h3>
          </div>
          
          <div className="p-5 space-y-3">
            {currentProject.teams.slice(0, 3).map(team => (
              <div key={team.id} className="card-gradient p-3 flex justify-between items-center hover:translate-y-[-2px] transition-all">
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    {currentProject.resources
                      .filter(resource => team.members.includes(resource.id))
                      .slice(0, 3)
                      .map(resource => (
                        <div key={resource.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-soft">
                          <img 
                            src={resource.avatar || `https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100`} 
                            alt={resource.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    {team.members.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-soft from-navy-100 to-navy-200 flex items-center justify-center text-xs font-medium text-navy-600 shadow-soft">
                        +{team.members.length - 3}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-slate-800">{team.name}</h4>
                    <p className="text-xs text-slate-500">{team.members.length} 成員</p>
                  </div>
                </div>
                <button className="text-teal-600 text-xs font-medium hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-full px-2.5 py-1 transition-colors">查看</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};