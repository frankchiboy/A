import React from 'react';
import { useProject } from '../context/ProjectContext';
import { BarChart, FileText, TrendingUp } from 'lucide-react';

const ReportsView: React.FC = () => {
  const { currentProject } = useProject();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <FileText size={48} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">沒有可用的報告</h2>
          <p className="text-slate-500">請選擇或創建一個專案以查看報告</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">專案報告</h1>
        <p className="text-slate-500">查看專案的詳細統計和分析報告</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart className="text-purple-500" size={24} />
            </div>
            <span className="text-sm font-medium text-purple-500 bg-purple-50 px-2 py-1 rounded">
              本月
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">任務完成率</h3>
          <p className="text-3xl font-bold text-slate-800">
            {Math.round((currentProject.tasks.filter(t => t.status === 'completed').length / currentProject.tasks.length) * 100)}%
          </p>
          <p className="text-sm text-slate-500 mt-1">較上月提升 5%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="text-emerald-500" size={24} />
            </div>
            <span className="text-sm font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
              本週
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">團隊生產力</h3>
          <p className="text-3xl font-bold text-slate-800">85%</p>
          <p className="text-sm text-slate-500 mt-1">維持穩定水平</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <FileText className="text-amber-500" size={24} />
            </div>
            <span className="text-sm font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded">
              總計
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">已完成任務</h3>
          <p className="text-3xl font-bold text-slate-800">
            {currentProject.tasks.filter(t => t.status === 'completed').length}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            共 {currentProject.tasks.length} 個任務
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">詳細報告</h2>
          <p className="text-slate-500 text-sm">專案進度和資源分配的詳細分析</p>
        </div>
        
        <div className="p-6">
          <p className="text-slate-500 text-center py-8">
            詳細報告功能正在開發中...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;