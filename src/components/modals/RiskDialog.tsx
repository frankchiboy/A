import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Risk } from '../../types/projectTypes';
import { createRisk } from '../../utils/projectUtils';
import { X, Trash } from 'lucide-react';

interface RiskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  riskId?: string;
  mode: 'create' | 'edit';
}

export const RiskDialog: React.FC<RiskDialogProps> = ({ isOpen, onClose, riskId, mode }) => {
  const { currentProject, addRisk, updateRisk, deleteRisk } = useProject();

  const emptyRisk = createRisk('');
  const [risk, setRisk] = useState<Risk>(emptyRisk);

  useEffect(() => {
    if (isOpen && mode === 'edit' && riskId && currentProject) {
      const existing = currentProject.risks.find(r => r.id === riskId);
      if (existing) setRisk(existing);
    } else if (isOpen && mode === 'create') {
      setRisk(createRisk(''));
    }
  }, [isOpen, mode, riskId, currentProject]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRisk(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (mode === 'create') {
      addRisk(risk);
    } else {
      updateRisk(risk);
    }
    onClose();
  };

  const handleDelete = () => {
    if (mode === 'edit' && riskId) {
      if (window.confirm('確定要刪除此風險嗎？')) {
        deleteRisk(riskId);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-slate-800">
            {mode === 'create' ? '新增風險' : '編輯風險'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">標題</label>
            <input
              name="name"
              value={risk.name}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">描述</label>
            <textarea
              name="description"
              value={risk.description}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">機率</label>
              <select
                name="probability"
                value={risk.probability}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">影響</label>
              <select
                name="impact"
                value={risk.impact}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">緩解計畫</label>
            <textarea
              name="mitigation"
              value={risk.mitigation}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">狀態</label>
            <select
              name="status"
              value={risk.status}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
            >
              <option value="identified">識別</option>
              <option value="mitigated">已緩解</option>
              <option value="occurred">已發生</option>
            </select>
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          {mode === 'edit' && (
            <button
              onClick={handleDelete}
              className="px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm flex items-center gap-1"
            >
              <Trash size={16} /> 刪除
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskDialog;
