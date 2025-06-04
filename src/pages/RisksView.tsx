import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import RiskDialog from '../components/modals/RiskDialog';
import { Plus, Edit } from 'lucide-react';

const RisksView: React.FC = () => {
  const { currentProject } = useProject();
  const [dialog, setDialog] = useState<{ mode: 'create' | 'edit'; id?: string } | null>(null);

  if (!currentProject) return <div className="p-6 text-slate-500">請先選擇專案</div>;

  const openNew = () => setDialog({ mode: 'create' });
  const openEdit = (id: string) => setDialog({ mode: 'edit', id });
  const close = () => setDialog(null);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">風險紀錄</h1>
        <button
          onClick={openNew}
          className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm flex items-center"
        >
          <Plus size={16} className="mr-1" /> 新增
        </button>
      </div>
      <table className="min-w-full bg-white rounded-xl shadow-sm overflow-hidden text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left">標題</th>
            <th className="px-3 py-2 text-left">機率</th>
            <th className="px-3 py-2 text-left">影響</th>
            <th className="px-3 py-2 text-left">狀態</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {currentProject.risks.map(risk => (
            <tr key={risk.id} className="border-b last:border-0">
              <td className="px-3 py-2">{risk.name}</td>
              <td className="px-3 py-2">{risk.probability}</td>
              <td className="px-3 py-2">{risk.impact}</td>
              <td className="px-3 py-2">{risk.status}</td>
              <td className="px-3 py-2 text-right">
                <button onClick={() => openEdit(risk.id)} className="text-slate-500 hover:text-slate-700">
                  <Edit size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {dialog && (
        <RiskDialog
          isOpen={true}
          onClose={close}
          riskId={dialog.id}
          mode={dialog.mode}
        />
      )}
    </div>
  );
};

export default RisksView;
