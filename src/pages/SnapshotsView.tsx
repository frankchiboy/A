import React from 'react';
import { useProject } from '../context/ProjectContext';
import { loadSnapshot, saveProjectToFile } from '../utils/fileSystem';
import { RotateCcw, Download, Trash } from 'lucide-react';

const SnapshotsView: React.FC = () => {
  const { listSnapshots, restoreSnapshot, removeSnapshot, currentProject } = useProject();
  const snapshots = listSnapshots();

  if (!currentProject) {
    return <div className="p-6 text-slate-500">請先選擇專案</div>;
  }

  const handleRestore = async (name: string) => {
    await restoreSnapshot(name);
  };

  const handleExport = async (name: string) => {
    const pkg = await loadSnapshot(name);
    if (pkg) {
      await saveProjectToFile(pkg, name);
    }
  };

  const handleDelete = (name: string) => {
    if (window.confirm('確定要刪除此快照嗎？')) {
      removeSnapshot(name);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">快照管理</h1>
      <table className="min-w-full bg-white rounded-xl shadow-sm overflow-hidden text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left">名稱</th>
            <th className="px-3 py-2 text-left">建立時間</th>
            <th className="px-3 py-2 text-left">類型</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map(s => (
            <tr key={s.id} className="border-b last:border-0">
              <td className="px-3 py-2">{s.name}</td>
              <td className="px-3 py-2">{new Date(s.createdAt).toLocaleString()}</td>
              <td className="px-3 py-2">{s.type}</td>
              <td className="px-3 py-2 flex justify-end gap-2">
                <button onClick={() => handleRestore(s.name)} className="text-slate-500 hover:text-teal-600">
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => handleExport(s.name)} className="text-slate-500 hover:text-slate-700">
                  <Download size={16} />
                </button>
                <button onClick={() => handleDelete(s.name)} className="text-slate-500 hover:text-red-600">
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SnapshotsView;
