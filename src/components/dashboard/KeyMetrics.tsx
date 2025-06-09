import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { TrendingUp, Clock, Users, AlertCircle } from 'lucide-react';
import { getDashboardMetrics } from '../../utils/projectUtils';

export const KeyMetrics: React.FC = () => {
  const { currentProject } = useProject();
  if (!currentProject) return null;

  const metrics = getDashboardMetrics(currentProject);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="card p-4 flex items-center">
        <TrendingUp size={20} className="text-teal-600 mr-3" />
        <div>
          <p className="text-sm text-slate-600">任務完成率</p>
          <p className="text-lg font-medium text-slate-800">{metrics.taskCompletion}%</p>
        </div>
      </div>
      <div className="card p-4 flex items-center">
        <Clock size={20} className="text-navy-600 mr-3" />
        <div>
          <p className="text-sm text-slate-600">即將里程碑</p>
          <p className="text-lg font-medium text-slate-800">{metrics.upcomingMilestones}</p>
        </div>
      </div>
      <div className="card p-4 flex items-center">
        <Users size={20} className="text-amber-600 mr-3" />
        <div>
          <p className="text-sm text-slate-600">平均利用率</p>
          <p className="text-lg font-medium text-slate-800">{metrics.resourceUtilization}%</p>
        </div>
      </div>
      <div className="card p-4 flex items-center">
        <AlertCircle size={20} className="text-rose-600 mr-3" />
        <div>
          <p className="text-sm text-slate-600">高風險</p>
          <p className="text-lg font-medium text-slate-800">{metrics.risksCount.high}</p>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;
