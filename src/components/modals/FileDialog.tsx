import React, { useState, useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import { 
  Save, 
  FileUp, 
  FilePlus, 
  FileQuestion, 
  X, 
  AlertTriangle, 
  FileDown, 
  FolderOpen 
} from 'lucide-react';
import { 
  saveProjectToFile, 
  loadProjectFromFile, 
  createProjectPackage, 
  getRecentProjects 
} from '../../utils/fileSystem';

interface FileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dialogType: 'save' | 'open' | 'new' | 'confirmClose';
}

export const FileDialog: React.FC<FileDialogProps> = ({ isOpen, onClose, dialogType }) => {
  const { currentProject, setCurrentProject, createProject, projectState, setProjectState } = useProject();
  const [fileName, setFileName] = useState(currentProject?.name || 'Untitled Project');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recentProjects = getRecentProjects();
  
  if (!isOpen) return null;
  
  const handleSave = async () => {
    if (!currentProject) {
      setError('沒有可儲存的專案');
      return;
    }
    
    try {
      // 更新專案名稱
      const projectToSave = {
        ...currentProject,
        name: fileName
      };
      
      // 創建 mpproj 格式封裝並儲存
      const projectPackage = createProjectPackage(projectToSave);
      await saveProjectToFile(projectPackage, fileName);
      
      // 更新專案狀態
      setProjectState({
        ...projectState,
        currentState: 'SAVED',
        hasUnsavedChanges: false,
        isUntitled: false,
        lastModified: new Date().toISOString()
      });
      
      onClose();
    } catch (err) {
      console.error('儲存失敗:', err);
      setError('儲存專案時發生錯誤');
    }
  };
  
  const handleOpen = async () => {
    if (!selectedFile) {
      // 觸發檔案選擇器
      fileInputRef.current?.click();
      return;
    }
    
    try {
      // 檢查是否有未保存的變更
      if (projectState.hasUnsavedChanges) {
        const confirmResult = window.confirm('您有未儲存的變更，確定要載入新專案嗎？');
        if (!confirmResult) return;
      }
      
      // 載入專案檔案
      const projectPackage = await loadProjectFromFile(selectedFile);
      
      // 更新當前專案
      setCurrentProject({
        ...projectPackage.project,
        tasks: projectPackage.tasks,
        resources: projectPackage.resources,
        milestones: projectPackage.milestones,
        teams: projectPackage.teams,
        budget: projectPackage.budget
      });
      
      // 更新專案狀態
      setProjectState({
        currentState: 'SAVED',
        hasUnsavedChanges: false,
        isUntitled: false,
        lastModified: new Date().toISOString(),
        autosaveTimer: 'active',
        openedFrom: 'manual'
      });
      
      onClose();
    } catch (err) {
      console.error('開啟失敗:', err);
      setError('開啟專案時發生錯誤');
    }
  };
  
  const handleCreateNew = () => {
    // 檢查是否有未保存的變更
    if (projectState.hasUnsavedChanges) {
      const confirmResult = window.confirm('您有未儲存的變更，確定要建立新專案嗎？');
      if (!confirmResult) return;
    }
    
    // 建立新專案
    createProject(fileName);
    onClose();
  };
  
  const handleConfirmClose = (action: 'save' | 'discard' | 'cancel') => {
    if (action === 'save') {
      handleSave();
    } else if (action === 'discard') {
      // 將專案狀態設為已關閉
      setProjectState({
        ...projectState,
        currentState: 'CLOSING',
        hasUnsavedChanges: false
      });
      onClose();
    } else if (action === 'cancel') {
      onClose();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };
  
  const openRecentProject = async (filePath: string, projectUUID: string) => {
    // 這裡通常需要通過檔案系統API開啟檔案
    // 由於 Web 環境限制，這裡只是展示功能，實際應用中需要配合桌面環境的能力
    alert(`將開啟最近專案: ${filePath}`);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
        
        {dialogType === 'save' && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Save size={24} className="text-teal-500 mr-3" />
              <h2 className="text-2xl font-display font-semibold">儲存專案</h2>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">專案名稱</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="輸入專案名稱"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                {error}
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-teal-500 rounded-lg text-white hover:bg-teal-600 flex items-center"
              >
                <Save size={16} className="mr-2" />
                儲存
              </button>
            </div>
          </div>
        )}
        
        {dialogType === 'open' && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <FolderOpen size={24} className="text-amber-500 mr-3" />
              <h2 className="text-2xl font-display font-semibold">開啟專案</h2>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">選擇檔案</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".mpproj,.json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center"
                >
                  <FileUp size={16} className="mr-2" />
                  瀏覽...
                </button>
                <div className="flex-1 truncate">
                  {selectedFile ? selectedFile.name : '未選擇檔案'}
                </div>
              </div>
            </div>
            
            {recentProjects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-2">最近專案</h3>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-200">
                  {recentProjects.map((project, index) => (
                    <div 
                      key={index}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-center"
                      onClick={() => openRecentProject(project.filePath, project.projectUUID)}
                    >
                      <FileDown size={16} className="text-slate-400 mr-2" />
                      <div className="flex-1 truncate">
                        <div className="text-sm font-medium">{project.fileName}</div>
                        <div className="text-xs text-slate-500 truncate">{project.filePath}</div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(project.openedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                {error}
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={handleOpen}
                className="px-4 py-2 bg-teal-500 rounded-lg text-white hover:bg-teal-600 flex items-center"
              >
                <FolderOpen size={16} className="mr-2" />
                開啟
              </button>
            </div>
          </div>
        )}
        
        {dialogType === 'new' && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <FilePlus size={24} className="text-indigo-500 mr-3" />
              <h2 className="text-2xl font-display font-semibold">建立新專案</h2>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">專案名稱</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="輸入專案名稱"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                {error}
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={handleCreateNew}
                className="px-4 py-2 bg-teal-500 rounded-lg text-white hover:bg-teal-600 flex items-center"
              >
                <FilePlus size={16} className="mr-2" />
                建立
              </button>
            </div>
          </div>
        )}
        
        {dialogType === 'confirmClose' && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <AlertTriangle size={24} className="text-amber-500 mr-3" />
              <h2 className="text-2xl font-display font-semibold">未儲存的變更</h2>
            </div>
            
            <p className="mb-6 text-slate-600">
              您的專案 <span className="font-medium">{currentProject?.name}</span> 有未儲存的變更。離開前要儲存變更嗎？
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => handleConfirmClose('discard')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                不儲存
              </button>
              <button 
                onClick={() => handleConfirmClose('cancel')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={() => handleConfirmClose('save')}
                className="px-4 py-2 bg-teal-500 rounded-lg text-white hover:bg-teal-600 flex items-center"
              >
                <Save size={16} className="mr-2" />
                儲存
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};