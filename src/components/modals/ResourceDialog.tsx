import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { 
  User, 
  X, 
  Trash, 
  Edit, 
  PlusCircle, 
  Briefcase, 
  Mail, 
  Phone, 
  Tag, 
  DollarSign, 
  Calendar 
} from 'lucide-react';
import { Resource, Availability } from '../../types/projectTypes';
import { createResource } from '../../utils/projectUtils';

interface ResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId?: string;
  mode: 'create' | 'edit';
}

export const ResourceDialog: React.FC<ResourceDialogProps> = ({ 
  isOpen, 
  onClose, 
  resourceId, 
  mode 
}) => {
  const { currentProject, addResource, updateResource, deleteResource } = useProject();
  
  const emptyResource = createResource('', 'human');
  
  const [resource, setResource] = useState<Resource>(emptyResource);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [availability, setAvailability] = useState<Availability[]>([]);
  
  // 當對話框開啟時或資源ID變更時，初始化表單數據
  useEffect(() => {
    if (isOpen && mode === 'edit' && resourceId && currentProject) {
      const existingResource = currentProject.resources.find(r => r.id === resourceId);
      if (existingResource) {
        setResource(existingResource);
        setSkills(existingResource.skills || []);
        setAvailability(existingResource.availability || []);
      }
    } else if (isOpen && mode === 'create') {
      setResource(emptyResource);
      setSkills([]);
      setAvailability([
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }
      ]);
    }
  }, [isOpen, resourceId, mode, currentProject, emptyResource]);
  
  if (!isOpen || !currentProject) return null;
  
  const handleClose = () => {
    setResource(emptyResource);
    setSkills([]);
    setNewSkill('');
    onClose();
  };
  
  const handleSave = () => {
    if (!resource.name.trim()) {
      alert('請輸入資源名稱');
      return;
    }
    
    // 更新技能與可用時間
    const updatedResource = {
      ...resource,
      skills,
      availability
    };
    
    if (mode === 'create') {
      addResource(updatedResource);
    } else {
      updateResource(updatedResource);
    }
    
    handleClose();
  };
  
  const handleDelete = () => {
    if (mode === 'edit' && resourceId) {
      if (window.confirm('確定要刪除此資源嗎？')) {
        deleteResource(resourceId);
        handleClose();
      }
    }
  };
  
  const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cost') {
      setResource({
        ...resource,
        [name]: parseFloat(value) || 0
      });
    } else {
      setResource({
        ...resource,
        [name]: value
      });
    }
  };
  
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  const toggleAvailabilityDay = (day: number) => {
    if (availability.some(a => a.dayOfWeek === day)) {
      setAvailability(availability.filter(a => a.dayOfWeek !== day));
    } else {
      setAvailability([
        ...availability,
        { dayOfWeek: day, startTime: '09:00', endTime: '17:00' }
      ]);
    }
  };
  
  const updateAvailabilityTime = (day: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(availability.map(a => {
      if (a.dayOfWeek === day) {
        return { ...a, [field]: value };
      }
      return a;
    }));
  };
  
  const getWeekdayName = (day: number): string => {
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    return weekdays[day];
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center">
            {mode === 'create' ? (
              <PlusCircle size={24} className="text-teal-500 mr-3" />
            ) : (
              <Edit size={24} className="text-teal-500 mr-3" />
            )}
            <h2 className="text-2xl font-display font-semibold">
              {mode === 'create' ? '建立資源' : '編輯資源'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                資源名稱 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                    {resource.avatar ? (
                      <img 
                        src={resource.avatar} 
                        alt={resource.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User size={24} className="text-slate-400" />
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  name="name"
                  value={resource.name}
                  onChange={handleResourceChange}
                  className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="輸入資源名稱"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  資源類型
                </label>
                <select
                  name="type"
                  value={resource.type}
                  onChange={handleResourceChange}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="human">人力資源</option>
                  <option value="material">物料資源</option>
                  <option value="equipment">設備資源</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Briefcase size={16} className="inline mr-1.5" />
                  角色
                </label>
                <input
                  type="text"
                  name="role"
                  value={resource.role || ''}
                  onChange={handleResourceChange}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="輸入職位或角色"
                />
              </div>
            </div>
            
            {resource.type === 'human' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Mail size={16} className="inline mr-1.5" />
                    電子郵件
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={resource.email || ''}
                    onChange={handleResourceChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="輸入電子郵件"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Phone size={16} className="inline mr-1.5" />
                    電話
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={resource.phone || ''}
                    onChange={handleResourceChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="輸入電話號碼"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <DollarSign size={16} className="inline mr-1.5" />
                費率 (每小時)
              </label>
              <input
                type="number"
                name="cost"
                value={resource.cost}
                onChange={handleResourceChange}
                min="0"
                step="0.01"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="輸入費率"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Tag size={16} className="inline mr-1.5" />
                技能標籤
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="輸入技能標籤"
                />
                <button
                  onClick={addSkill}
                  className="ml-2 p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
              
              {skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-teal-500 hover:text-teal-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1.5" />
                可用時間
              </label>
              
              <div className="space-y-4 border border-slate-200 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleAvailabilityDay(day)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        availability.some(a => a.dayOfWeek === day)
                          ? 'bg-teal-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {getWeekdayName(day)}
                    </button>
                  ))}
                </div>
                
                {availability.length > 0 && (
                  <div className="space-y-3">
                    {availability
                      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                      .map(avail => (
                        <div 
                          key={avail.dayOfWeek}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="w-12 text-sm font-medium text-slate-700">
                            {getWeekdayName(avail.dayOfWeek)}
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-slate-500 mb-1 block">開始時間</label>
                              <input
                                type="time"
                                value={avail.startTime}
                                onChange={(e) => updateAvailabilityTime(avail.dayOfWeek, 'startTime', e.target.value)}
                                className="w-full p-1.5 border border-slate-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-slate-500 mb-1 block">結束時間</label>
                              <input
                                type="time"
                                value={avail.endTime}
                                onChange={(e) => updateAvailabilityTime(avail.dayOfWeek, 'endTime', e.target.value)}
                                className="w-full p-1.5 border border-slate-300 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => toggleAvailabilityDay(avail.dayOfWeek)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-200 flex justify-between">
          <div>
            {mode === 'edit' && (
              <button 
                onClick={handleDelete}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center"
              >
                <Trash size={16} className="mr-2" />
                刪除資源
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              取消
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-teal-500 rounded-lg text-white hover:bg-teal-600"
            >
              {mode === 'create' ? '建立資源' : '儲存變更'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};