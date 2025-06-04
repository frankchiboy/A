import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import CostDialog from '../components/modals/CostDialog';
import { Plus, Edit } from 'lucide-react';

const CostsView: React.FC = () => {
  const { currentProject } = useProject();
  const [dialog, setDialog] = useState<{ mode: 'create' | 'edit'; id?: string } | null>(null);

  if (!currentProject) {
    return <div className="p-6 text-slate-500">請先選擇專案</div>;
  }

  const openNew = () => setDialog({ mode: 'create' });
  const openEdit = (id: string) => setDialog({ mode: 'edit', id });
  const close = () => setDialog(null);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">成本紀錄</h1>
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
            <th className="px-3 py-2 text-left">日期</th>
            <th className="px-3 py-2 text-left">金額</th>
            <th className="px-3 py-2 text-left">類別</th>
            <th className="px-3 py-2 text-left">狀態</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {currentProject.costs.map(cost => (
            <tr key={cost.id} className="border-b last:border-0">
              <td className="px-3 py-2">{cost.date}</td>
              <td className="px-3 py-2">{cost.amount} {cost.currency}</td>
              <td className="px-3 py-2">{cost.category}</td>
              <td className="px-3 py-2">{cost.status}</td>
              <td className="px-3 py-2 text-right">
                <button onClick={() => openEdit(cost.id)} className="text-slate-500 hover:text-slate-700">
                  <Edit size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {dialog && (
        <CostDialog
          isOpen={true}
          onClose={close}
          costId={dialog.id}
          mode={dialog.mode}
        />
      )}
    </div>
  );
};

export default CostsView;
