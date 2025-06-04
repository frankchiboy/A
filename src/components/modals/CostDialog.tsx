import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { CostRecord } from '../../types/projectTypes';
import { createCostRecord } from '../../utils/projectUtils';
import { X, Trash } from 'lucide-react';

interface CostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  costId?: string;
  mode: 'create' | 'edit';
}

export const CostDialog: React.FC<CostDialogProps> = ({
  isOpen,
  onClose,
  costId,
  mode
}) => {
  const { currentProject, addCost, updateCost, deleteCost } = useProject();

  const emptyCost = createCostRecord('');
  const [cost, setCost] = useState<CostRecord>(emptyCost);

  useEffect(() => {
    if (isOpen && mode === 'edit' && costId && currentProject) {
      const existing = currentProject.costs.find(c => c.id === costId);
      if (existing) {
        setCost(existing);
      }
    } else if (isOpen && mode === 'create') {
      setCost(createCostRecord(''));
    }
  }, [isOpen, mode, costId, currentProject]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCost(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (mode === 'create') {
      addCost(cost);
    } else {
      updateCost(cost);
    }
    onClose();
  };

  const handleDelete = () => {
    if (mode === 'edit' && costId) {
      if (window.confirm('確定要刪除這筆成本紀錄嗎？')) {
        deleteCost(costId);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-slate-800">
            {mode === 'create' ? '新增成本' : '編輯成本'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">金額</label>
            <input
              type="number"
              name="amount"
              value={cost.amount}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">類別</label>
              <input
                name="category"
                value={cost.category}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">幣別</label>
              <input
                name="currency"
                value={cost.currency}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">日期</label>
            <input
              type="date"
              name="date"
              value={cost.date}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">發票/單號</label>
            <input
              name="invoiceId"
              value={cost.invoiceId}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">狀態</label>
            <select
              name="status"
              value={cost.status}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
            >
              <option value="pending">待處理</option>
              <option value="paid">已付款</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">備註</label>
            <textarea
              name="note"
              value={cost.note}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
            />
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

export default CostDialog;
