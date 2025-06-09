import React from 'react';
import { getRecentProjects } from '../utils/fileSystem';

const RecentProjectsView: React.FC = () => {
  const projects = getRecentProjects();

  if (projects.length === 0) {
    return <div className="p-6 text-slate-500">沒有最近開啟的專案</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">最近開啟的專案</h1>
      <table className="min-w-full bg-white rounded-xl shadow-sm overflow-hidden text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left">名稱</th>
            <th className="px-3 py-2 text-left">路徑</th>
            <th className="px-3 py-2 text-left">最後開啟</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.projectUUID} className="border-b last:border-0">
              <td className="px-3 py-2">{p.fileName}</td>
              <td className="px-3 py-2 truncate max-w-xs">{p.filePath || 'N/A'}</td>
              <td className="px-3 py-2">{new Date(p.openedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentProjectsView;
