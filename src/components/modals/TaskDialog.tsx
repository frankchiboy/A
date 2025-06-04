import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Flag, 
  X, 
  Users, 
  Link, 
  Trash, 
  AlignLeft, 
  PlusCircle, 
  FileUp, 
  Edit 
} from 'lucide-react';
import { Task, Resource } from '../../types/projectTypes';
import { createTask } from '../../utils/projectUtils';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
  mode: 'create' | 'edit';
}

export const TaskDialog: React.FC<TaskDialogProps> = ({ 
  isOpen, 
  onClose, 
  taskId, 
  mode 
}) => {
  const { currentProject, addTask, updateTask, deleteTask } = useProject();
  
  const emptyTask = createTask(
    currentProject?.id || '', 
    '', 
    new Date().toISOString().split('T')[0], 
    new Date().toISOString().split('T')[0]
  );
  
  const [task, setTask] = useState<Task>(emptyTask);
  const [assignedResources, setAssignedResources] = useState<string[]>([]);
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [tab, setTab] = useState<'details' | 'resources' | 'dependencies'>('details');
  
  // 當對話框開啟時或任務ID變更時，初始化表單數據
  useEffect(() => {
    if (isOpen && mode === 'edit' && taskId && currentProject) {
      const existingTask = currentProject.tasks.find(t => t.id === taskId);
      if (existingTask) {
        setTask(existingTask);
        setAssignedResources(existingTask.assignedTo);
        setDependencies(existingTask.dependencies);
      }
    } else if (isOpen && mode === 'create') {
      setTask(emptyTask);
      setAssignedResources([]);
      setDependencies([]);
    }
  }, [isOpen, taskId, mode, currentProject, emptyTask]);
  
  if (!isOpen || !currentProject) return null;
  
  const handleClose = () => {
    setTask(emptyTask);
    setAssignedResources([]);
    setDependencies([]);
    onClose();
  };
  
  const handleSave = () => {
    if (!task.name.trim()) {
      alert('請輸入任務名稱');
      return;
    }
    
    // 更新指派資源和依賴關係
    const updatedTask = {
      ...task,
      assignedTo: assignedResources,
      dependencies
    };
    
    if (mode === 'create') {
      addTask(updatedTask);
    } else {
      updateTask(updatedTask);
    }
    
    handleClose();
  };
  
  const handleDelete = () => {
    if (mode === 'edit' && taskId) {
      if (window.confirm('確定要刪除此任務嗎？')) {
        deleteTask(taskId);
        handleClose();
      }
    }
  };
  
  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
      // 如果更改了日期，重新計算工期
      const startDate = name === 'startDate' ? new Date(value) : new Date(task.startDate);
      const endDate = name === 'endDate' ? new Date(value) : new Date(task.endDate);
      
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      setTask({
        ...task,
        [name]: value,
        duration: durationDays >= 1 ? durationDays : 1
      });
    } else if (name === 'duration') {
      // 如果更改了工期，更新結束日期
      const startDate = new Date(task.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + parseInt(value) - 1);
      
      setTask({
        ...task,
        duration: parseInt(value),
        endDate: endDate.toISOString().split('T')[0]
      });
    } else if (name === 'isMilestone') {
      // 里程碑轉換
      setTask({
        ...task,
        isMilestone: (e.target as HTMLInputElement).checked
      });
    } else {
      setTask({
        ...task,
        [name]: value
      });
    }
  };
  
  const toggleResourceAssignment = (resourceId: string) => {
    if (assignedResources.includes(resourceId)) {
      setAssignedResources(assignedResources.filter(id => id !== resourceId));
    } else {
      setAssignedResources([...assignedResources, resourceId]);
    }
  };
  
  const toggleDependency = (taskId: string) => {
    if (dependencies.includes(taskId)) {
      setDependencies(dependencies.filter(id => id !== taskId));
    } else {
      setDependencies([...dependencies, taskId]);
    }
  };
  
  const getResourceName = (resourceId: string) => {
    const resource = currentProject.resources.find(r => r.id === resourceId);
    return resource ? resource.name : '未知資源';
  };
  
  const getTaskName = (taskId: string) => {
    const task = currentProject.tasks.find(t => t.id === taskId);
    return task ? task.name : '未知任務';
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
              {mode === 'create' ? '建立任務' : '編輯任務'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setTab('details')}
            className={`px-4 py-3 text-sm font-medium ${
              tab === 'details' 
                ? 'text-teal-600 border-b-2 border-teal-500' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <CheckSquare size={16} className="inline mr-1.5" />
            任務詳情
          </button>
          <button
            onClick={() => setTab('resources')}
            className={`px-4 py-3 text-sm font-medium ${
              tab === 'resources' 
                ? 'text-teal-600 border-b-2 border-teal-500' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Users size={16} className="inline mr-1.5" />
            資源分配
          </button>
          <button
            onClick={() => setTab('dependencies')}
            className={`px-4 py-3 text-sm font-medium ${
              tab === 'dependencies' 
                ? 'text-teal-600 border-b-2 border-teal-500' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Link size={16} className="inline mr-1.5" />
            任務依賴
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  任務名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={task.name}
                  onChange={handleTaskChange}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="輸入任務名稱"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  任務描述
                </label>
                <textarea
                  name="description"
                  value={task.description}
                  onChange={handleTaskChange}
                  rows={4}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="輸入任務描述"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isMilestone"
                  id="isMilestone"
                  checked={task.isMilestone}
                  onChange={handleTaskChange}
                  className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="isMilestone" className="text-sm font-medium text-slate-700">
                  標記為里程碑
                </label>
                <Flag size={16} className="text-amber-500" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Calendar size={16} className="inline mr-1.5" />
                    開始日期
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={task.startDate}
                    onChange={handleTaskChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Calendar size={16} className="inline mr-1.5" />
                    結束日期
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={task.endDate}
                    onChange={handleTaskChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Clock size={16} className="inline mr-1.5" />
                    工期 (天)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={task.duration}
                    onChange={handleTaskChange}
                    min="1"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    進度 (%)
                  </label>
                  <input
                    type="number"
                    name="progress"
                    value={task.progress}
                    onChange={handleTaskChange}
                    min="0"
                    max="100"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    任務狀態
                  </label>
                  <select
                    name="status"
                    value={task.status}
                    onChange={handleTaskChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="not-started">未開始</option>
                    <option value="in-progress">進行中</option>
                    <option value="completed">已完成</option>
                    <option value="delayed">已延遲</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    優先級
                  </label>
                  <select
                    name="priority"
                    value={task.priority}
                    onChange={handleTaskChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                    <option value="urgent">緊急</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <AlignLeft size={16} className="inline mr-1.5" />
                  備註
                </label>
                <textarea
                  name="notes"
                  value={task.notes}
                  onChange={handleTaskChange}
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="輸入備註"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  附件
                </label>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center">
                    <FileUp size={16} className="mr-2" />
                    上傳檔案
                  </button>
                  <span className="text-sm text-slate-500">
                    目前附件數量: {task.attachments.length}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {tab === 'resources' && (
            <div>
              <h3 className="text-lg font-medium text-slate-800 mb-4">資源分配</h3>
              <p className="text-sm text-slate-500 mb-4">選擇負責此任務的人員或資源</p>
              
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 max-h-96 overflow-y-auto">
                {currentProject.resources.length > 0 ? (
                  currentProject.resources.map(resource => (
                    <div key={resource.id} className="p-3 flex items-center">
                      <input
                        type="checkbox"
                        id={`resource-${resource.id}`}
                        checked={assignedResources.includes(resource.id)}
                        onChange={() => toggleResourceAssignment(resource.id)}
                        className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 mr-3"
                      />
                      <label 
                        htmlFor={`resource-${resource.id}`}
                        className="flex-1 flex items-center"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                          {resource.avatar ? (
                            <img 
                              src={resource.avatar} 
                              alt={resource.name} 
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium text-slate-700">
                              {resource.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-800">{resource.name}</h4>
                          <p className="text-xs text-slate-500">{resource.role || '無角色'}</p>
                        </div>
                      </label>
                      <div className="text-sm text-slate-600">
                        {resource.utilization}% 使用率
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    沒有可用的資源。請先建立資源。
                  </div>
                )}
              </div>
              
              {assignedResources.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">已選擇的資源</h4>
                  <div className="flex flex-wrap gap-2">
                    {assignedResources.map(resourceId => (
                      <div 
                        key={resourceId}
                        className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm flex items-center"
                      >
                        {getResourceName(resourceId)}
                        <button 
                          onClick={() => toggleResourceAssignment(resourceId)}
                          className="ml-2 text-teal-500 hover:text-teal-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {tab === 'dependencies' && (
            <div>
              <h3 className="text-lg font-medium text-slate-800 mb-4">任務依賴</h3>
              <p className="text-sm text-slate-500 mb-4">選擇此任務依賴的前置任務</p>
              
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 max-h-96 overflow-y-auto">
                {currentProject.tasks
                  .filter(t => t.id !== task.id) // 排除自己
                  .length > 0 ? (
                  currentProject.tasks
                    .filter(t => t.id !== task.id)
                    .map(otherTask => (
                      <div key={otherTask.id} className="p-3 flex items-center">
                        <input
                          type="checkbox"
                          id={`dependency-${otherTask.id}`}
                          checked={dependencies.includes(otherTask.id)}
                          onChange={() => toggleDependency(otherTask.id)}
                          className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 mr-3"
                        />
                        <label 
                          htmlFor={`dependency-${otherTask.id}`}
                          className="flex-1"
                        >
                          <h4 className="text-sm font-medium text-slate-800">{otherTask.name}</h4>
                          <div className="flex items-center text-xs text-slate-500 mt-1">
                            <Calendar size={12} className="mr-1" />
                            {new Date(otherTask.endDate).toLocaleDateString()}
                            <span className="mx-2">|</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              otherTask.status === 'completed' ? 'bg-teal-100 text-teal-800' :
                              otherTask.status === 'in-progress' ? 'bg-navy-100 text-navy-800' :
                              otherTask.status === 'delayed' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {otherTask.status === 'completed' ? '已完成' :
                               otherTask.status === 'in-progress' ? '進行中' :
                               otherTask.status === 'delayed' ? '已延遲' :
                               '未開始'}
                            </span>
                          </div>
                        </label>
                      </div>
                    ))
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    沒有可用的其他任務作為依賴。
                  </div>
                )}
              </div>
              
              {dependencies.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">已選擇的依賴任務</h4>
                  <div className="flex flex-wrap gap-2">
                    {dependencies.map(depId => (
                      <div 
                        key={depId}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm flex items-center"
                      >
                        {getTaskName(depId)}
                        <button 
                          onClick={() => toggleDependency(depId)}
                          className="ml-2 text-indigo-500 hover:text-indigo-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-200 flex justify-between">
          <div>
            {mode === 'edit' && (
              <button 
                onClick={handleDelete}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center"
              >
                <Trash size={16} className="mr-2" />
                刪除任務
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
              {mode === 'create' ? '建立任務' : '儲存變更'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};