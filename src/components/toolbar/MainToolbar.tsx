import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { 
  Save, 
  FolderOpen, 
  FilePlus, 
  Undo2, 
  Redo2, 
  PlusCircle, 
  UserPlus,
  Calendar,
  Settings,
  HelpCircle,
  FileDown
} from 'lucide-react';
import { FileDialog } from '../modals/FileDialog';
import { TaskDialog } from '../modals/TaskDialog';
import { ResourceDialog } from '../modals/ResourceDialog';

export const MainToolbar: React.FC = () => {
  const { 
    currentProject, 
    projectState, 
    saveProject, 
    undo, 
    redo, 
    undoStack, 
    redoStack 
  } = useProject();
  
  const [dialogOpen, setDialogOpen] = useState<{
    file?: 'save' | 'open' | 'new' | 'confirmClose';
    task?: 'create' | 'edit';
    resource?: 'create' | 'edit';
  }>({});
  
  const openFileDialog = (type: 'save' | 'open' | 'new' | 'confirmClose') => {
    setDialogOpen({ file: type });
  };
  
  const openTaskDialog = (mode: 'create' | 'edit') => {
    setDialogOpen({ task: mode });
  };

  const openResourceDialog = (mode: 'create' | 'edit') => {
    setDialogOpen({ resource: mode });
  };
  
  const closeAllDialogs = () => {
    setDialogOpen({});
  };
  
  return (
    <>
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openFileDialog('new')}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title="建立新專案"
          >
            <FilePlus size={20} />
          </button>
          <button
            onClick={() => openFileDialog('open')}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title="開啟專案"
          >
            <FolderOpen size={20} />
          </button>
          <button
            onClick={() => {
              if (projectState.hasUnsavedChanges) {
                openFileDialog('save');
              } else {
                saveProject();
              }
            }}
            className={`p-1.5 rounded-lg ${
              projectState.hasUnsavedChanges
                ? 'text-teal-600 hover:bg-teal-50'
                : 'text-slate-700 hover:bg-slate-100'
            } transition-colors`}
            title="儲存專案"
          >
            <Save size={20} />
          </button>
          
          <div className="h-6 border-r border-slate-200 mx-1"></div>
          
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className={`p-1.5 rounded-lg transition-colors ${
              undoStack.length === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="復原"
          >
            <Undo2 size={20} />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className={`p-1.5 rounded-lg transition-colors ${
              redoStack.length === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="重做"
          >
            <Redo2 size={20} />
          </button>
          
          <div className="h-6 border-r border-slate-200 mx-1"></div>
          
          <button
            onClick={() => openTaskDialog('create')}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title="新增任務"
          >
            <PlusCircle size={20} />
          </button>
          <button
            onClick={() => openResourceDialog('create')}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title="新增資源"
          >
            <UserPlus size={20} />
          </button>
          
          <div className="h-6 border-r border-slate-200 mx-1"></div>
          
          <button
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title="日曆檢視"
          >
            <Calendar size={20} />
          </button>
          <button
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title="設定"
          >
            <Settings size={20} />
          </button>
        </div>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center">
          {projectState.hasUnsavedChanges && (
            <span className="text-xs text-amber-600 mr-2">
              ⦿ 未儲存的變更
            </span>
          )}
          <div className="bg-slate-100 px-3 py-1 rounded-lg text-sm text-slate-700 flex items-center gap-2">
            <FileDown size={16} className="text-slate-500" />
            <span className="truncate max-w-xs">
              {currentProject?.name || 'Untitled Project'}
            </span>
          </div>
          <button
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors ml-2"
            title="幫助"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
      
      {/* 對話框 */}
      {dialogOpen.file && (
        <FileDialog 
          isOpen={!!dialogOpen.file} 
          onClose={closeAllDialogs} 
          dialogType={dialogOpen.file} 
        />
      )}
      
      {dialogOpen.task && (
        <TaskDialog 
          isOpen={!!dialogOpen.task} 
          onClose={closeAllDialogs} 
          mode={dialogOpen.task} 
        />
      )}
      
      {dialogOpen.resource && (
        <ResourceDialog 
          isOpen={!!dialogOpen.resource} 
          onClose={closeAllDialogs} 
          mode={dialogOpen.resource} 
        />
      )}
    </>
  );
};