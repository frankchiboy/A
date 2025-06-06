import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Project, Task, Resource, ProjectState, CostRecord, Risk, UndoItem } from '../types/projectTypes';
import { sampleProject } from '../data/sampleProject';
import { createEmptyProject, calculateProjectProgress } from '../utils/projectUtils';
import {
  saveAutoSnapshot,
  updateRecentProjects,
  loadSnapshot,
  getSnapshotsList,
  deleteSnapshot,
  loadProjectFromFile,
  saveProjectToFile,
  getLatestSnapshot,
  createProjectPackage,
} from '../utils/fileSystem';
import { transition } from '../utils/stateMachine';

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project) => void;
  createProject: (name?: string) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void;
  deleteResource: (resourceId: string) => void;
  addCost: (cost: CostRecord) => void;
  updateCost: (cost: CostRecord) => void;
  deleteCost: (id: string) => void;
  addRisk: (risk: Risk) => void;
  updateRisk: (risk: Risk) => void;
  deleteRisk: (id: string) => void;
  saveProject: () => void;
  exportProjectFile: (fileName: string) => Promise<void>;
  openProjectFile: (file: File) => Promise<void>;
  restoreSnapshot: (name: string) => Promise<void>;
  listSnapshots: () => { id: string; name: string; projectId: string; createdAt: string; type: string }[];
  removeSnapshot: (name: string) => void;
  initializeFromLatestSnapshot: () => Promise<void>;
  projectState: ProjectState;
  setProjectState: (state: ProjectState) => void;
  undoStack: UndoItem[];
  redoStack: UndoItem[];
  pushUndo: (item: UndoItem) => void;
  undo: () => void;
  redo: () => void;
}

const AUTO_SAVE_INTERVAL = 10 * 60 * 1000; // 10分鐘

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([sampleProject]);
  const [currentProject, setCurrentProject] = useState<Project | null>(sampleProject);
  const [undoStack, setUndoStack] = useState<UndoItem[]>([]);
  const [redoStack, setRedoStack] = useState<UndoItem[]>([]);
  const [projectState, setProjectState] = useState<ProjectState>({
    currentState: 'UNTITLED',
    hasUnsavedChanges: false,
    isUntitled: true,
    lastModified: new Date().toISOString(),
    autosaveTimer: 'active',
    openedFrom: null
  });

  // 初始化自動儲存
  useEffect(() => {
    if (projectState.autosaveTimer === 'active' && currentProject) {
      const timer = setInterval(() => {
        if (projectState.hasUnsavedChanges) {
          saveAutoSnapshot({
            manifest: {
              project_uuid: currentProject.id,
              file_version: '1.0.0',
              created_platform: 'Web',
              created_with_version: '1.0.0',
              created_at: currentProject.createdAt,
              updated_at: new Date().toISOString()
            },
            project: currentProject,
            tasks: currentProject.tasks,
            resources: currentProject.resources,
            milestones: currentProject.milestones,
            teams: currentProject.teams,
            budget: currentProject.budget,
            attachments: []
          });
          console.log('自動儲存快照完成');
        }
      }, AUTO_SAVE_INTERVAL);

      return () => clearInterval(timer);
    }
  }, [currentProject, projectState.autosaveTimer, projectState.hasUnsavedChanges]);

  // 建立新專案
  const createProject = useCallback((name?: string) => {
    const newProject = createEmptyProject(name);
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    setProjectState(prev => transition(prev, 'initialize'));
    
    // 清空 undo/redo 堆疊
    setUndoStack([]);
    setRedoStack([]);
    
    // 更新最近專案列表
    updateRecentProjects({
      fileName: newProject.name,
      filePath: '',
      projectUUID: newProject.id,
      isTemporary: true
    });
  }, []);

  // 更新專案
  const updateProject = useCallback((updatedProject: Project) => {
    const now = new Date().toISOString();
    
    // 計算專案進度
    const progress = calculateProjectProgress(updatedProject.tasks);
    
    const finalProject = {
      ...updatedProject,
      progress,
      updatedAt: now
    };
    
    setProjects(prev => prev.map(p => p.id === finalProject.id ? finalProject : p));
    setCurrentProject(finalProject);
    
    // 更新狀態為已修改
    setProjectState(prev => transition(prev, 'edit'));
  }, []);

  // 刪除專案
  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    
    if (currentProject?.id === projectId) {
      // 選擇另一個專案或創建新專案
      const remainingProjects = projects.filter(p => p.id !== projectId);
      if (remainingProjects.length > 0) {
        setCurrentProject(remainingProjects[0]);
      } else {
        createProject();
      }
    }
  }, [currentProject, projects, createProject]);

  // 新增任務
  const addTask = useCallback((task: Task) => {
    if (!currentProject) return;
    
    // 保存舊狀態用於 undo
    pushUndo({
      type: 'add-task',
      targetId: task.id,
      beforeState: null,
      afterState: task
    });
    
    const updatedProject = {
      ...currentProject,
      tasks: [...currentProject.tasks, task]
    };
    
    updateProject(updatedProject);
  }, [currentProject, updateProject, pushUndo]);

  // 更新任務
  const updateTask = useCallback((updatedTask: Task) => {
    if (!currentProject) return;
    
    // 保存舊狀態用於 undo
    const oldTask = currentProject.tasks.find(t => t.id === updatedTask.id);
    if (oldTask) {
      pushUndo({
        type: 'update-task',
        targetId: updatedTask.id,
        beforeState: oldTask,
        afterState: updatedTask
      });
    }
    
    const updatedProject = {
      ...currentProject,
      tasks: currentProject.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    };
    
    updateProject(updatedProject);
  }, [currentProject, updateProject, pushUndo]);

  // 刪除任務
  const deleteTask = useCallback((taskId: string) => {
    if (!currentProject) return;
    
    // 保存舊狀態用於 undo
    const oldTask = currentProject.tasks.find(t => t.id === taskId);
    if (oldTask) {
      pushUndo({
        type: 'delete-task',
        targetId: taskId,
        beforeState: oldTask,
        afterState: null
      });
    }
    
    const updatedProject = {
      ...currentProject,
      tasks: currentProject.tasks.filter(t => t.id !== taskId)
    };
    
    updateProject(updatedProject);
  }, [currentProject, updateProject, pushUndo]);

  // 新增資源
  const addResource = useCallback((resource: Resource) => {
    if (!currentProject) return;
    
    // 保存舊狀態用於 undo
    pushUndo({
      type: 'add-resource',
      targetId: resource.id,
      beforeState: null,
      afterState: resource
    });
    
    const updatedProject = {
      ...currentProject,
      resources: [...currentProject.resources, resource]
    };
    
    updateProject(updatedProject);
  }, [currentProject, updateProject, pushUndo]);

  // 更新資源
  const updateResource = useCallback((updatedResource: Resource) => {
    if (!currentProject) return;
    
    // 保存舊狀態用於 undo
    const oldResource = currentProject.resources.find(r => r.id === updatedResource.id);
    if (oldResource) {
      pushUndo({
        type: 'update-resource',
        targetId: updatedResource.id,
        beforeState: oldResource,
        afterState: updatedResource
      });
    }
    
    const updatedProject = {
      ...currentProject,
      resources: currentProject.resources.map(r => r.id === updatedResource.id ? updatedResource : r)
    };
    
    updateProject(updatedProject);
  }, [currentProject, updateProject, pushUndo]);

  // 刪除資源
  const deleteResource = useCallback((resourceId: string) => {
    if (!currentProject) return;
    
    // 保存舊狀態用於 undo
    const oldResource = currentProject.resources.find(r => r.id === resourceId);
    if (oldResource) {
      pushUndo({
        type: 'delete-resource',
        targetId: resourceId,
        beforeState: oldResource,
        afterState: null
      });
    }
    
    const updatedProject = {
      ...currentProject,
      resources: currentProject.resources.filter(r => r.id !== resourceId)
    };
    
    updateProject(updatedProject);
  }, [currentProject, updateProject, pushUndo]);

  // 新增成本紀錄
  const addCost = useCallback((cost: CostRecord) => {
    if (!currentProject) return;
    const updatedProject = {
      ...currentProject,
      costs: [...currentProject.costs, cost]
    };
    updateProject(updatedProject);
  }, [currentProject, updateProject]);

  const updateCost = useCallback((cost: CostRecord) => {
    if (!currentProject) return;
    const updatedProject = {
      ...currentProject,
      costs: currentProject.costs.map(c => c.id === cost.id ? cost : c)
    };
    updateProject(updatedProject);
  }, [currentProject, updateProject]);

  const deleteCost = useCallback((id: string) => {
    if (!currentProject) return;
    const updatedProject = {
      ...currentProject,
      costs: currentProject.costs.filter(c => c.id !== id)
    };
    updateProject(updatedProject);
  }, [currentProject, updateProject]);

  // 風險紀錄
  const addRisk = useCallback((risk: Risk) => {
    if (!currentProject) return;
    const updatedProject = {
      ...currentProject,
      risks: [...currentProject.risks, risk]
    };
    updateProject(updatedProject);
  }, [currentProject, updateProject]);

  const updateRisk = useCallback((risk: Risk) => {
    if (!currentProject) return;
    const updatedProject = {
      ...currentProject,
      risks: currentProject.risks.map(r => r.id === risk.id ? risk : r)
    };
    updateProject(updatedProject);
  }, [currentProject, updateProject]);

  const deleteRisk = useCallback((id: string) => {
    if (!currentProject) return;
    const updatedProject = {
      ...currentProject,
      risks: currentProject.risks.filter(r => r.id !== id)
    };
    updateProject(updatedProject);
  }, [currentProject, updateProject]);

  // 儲存專案
  const saveProject = useCallback(() => {
    if (!currentProject) return;
    
    // 儲存快照
    saveAutoSnapshot({
      manifest: {
        project_uuid: currentProject.id,
        file_version: '1.0.0',
        created_platform: 'Web',
        created_with_version: '1.0.0',
        created_at: currentProject.createdAt,
        updated_at: new Date().toISOString()
      },
      project: currentProject,
      tasks: currentProject.tasks,
      resources: currentProject.resources,
      milestones: currentProject.milestones,
      teams: currentProject.teams,
      budget: currentProject.budget,
      attachments: []
    });
    
    // 更新狀態為已儲存
    setProjectState(prev => transition(prev, 'save'));
    
    // 清空 undo/redo 堆疊
    setUndoStack([]);
    setRedoStack([]);
    
    // 更新最近專案列表
    updateRecentProjects({
      fileName: currentProject.name,
      filePath: '',
      projectUUID: currentProject.id,
      isTemporary: false
    });
  }, [currentProject]);

  // 匯出專案為 .mpproj
  const exportProjectFile = useCallback(async (fileName: string) => {
    if (!currentProject) return;
    await saveProjectToFile(createProjectPackage(currentProject), fileName);
    setProjectState(prev => transition(prev, 'save'));
  }, [currentProject]);

  // 讀取 .mpproj 檔案
  const openProjectFile = useCallback(async (file: File) => {
    const pkg = await loadProjectFromFile(file);
    setCurrentProject(pkg.project);
    setProjects(prev => {
      const other = prev.filter(p => p.id !== pkg.project.id);
      return [...other, pkg.project];
    });
    setProjectState(prev => transition(prev, 'save'));
    updateRecentProjects({
      fileName: pkg.project.name,
      filePath: file.name,
      projectUUID: pkg.project.id,
      isTemporary: false,
    });
  }, []);

  // 從快照還原專案
  const restoreSnapshot = useCallback(async (name: string) => {
    const pkg = await loadSnapshot(name);
    if (!pkg) return;
    setCurrentProject(pkg.project);
    setProjects(prev => {
      const other = prev.filter(p => p.id !== pkg.project.id);
      return [...other, pkg.project];
    });
    setProjectState(prev => transition(prev, 'restoreSnapshot'));
    updateRecentProjects({
      fileName: pkg.project.name,
      filePath: '',
      projectUUID: pkg.project.id,
      isTemporary: false,
    });
  }, []);

  const listSnapshots = useCallback(() => {
    return getSnapshotsList();
  }, []);

  const removeSnapshot = useCallback((name: string) => {
    deleteSnapshot(name);
  }, []);

  const initializeFromLatestSnapshot = useCallback(async () => {
    const latest = getLatestSnapshot();
    if (latest) {
      await restoreSnapshot(latest.name);
    } else {
      createProject();
    }
  }, [restoreSnapshot, createProject]);

  // 在啟動時嘗試從最近快照還原專案
  useEffect(() => {
    initializeFromLatestSnapshot();
    // 僅在初始化階段執行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Undo/Redo 相關函數
  const pushUndo = useCallback((item: UndoItem) => {
    setUndoStack(prev => [...prev.slice(0, 49), item]); // 限制堆疊大小為 50
    setRedoStack([]); // 清空 redo 堆疊
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0 || !currentProject) return;
    
    const lastAction = undoStack[undoStack.length - 1];
    
    // 從 undo 堆疊中移除最後一個操作
    setUndoStack(prev => prev.slice(0, -1));
    
    // 添加到 redo 堆疊
    setRedoStack(prev => [...prev, lastAction]);
    
    // 根據操作類型執行還原
    switch (lastAction.type) {
      case 'add-task':
        // 刪除添加的任務
        updateProject({
          ...currentProject,
          tasks: currentProject.tasks.filter(t => t.id !== lastAction.targetId)
        });
        break;
        
      case 'update-task':
        // 還原任務到更新前的狀態
        updateProject({
          ...currentProject,
          tasks: currentProject.tasks.map(t => 
            t.id === lastAction.targetId ? lastAction.beforeState : t
          )
        });
        break;
        
      case 'delete-task':
        // 還原被刪除的任務
        updateProject({
          ...currentProject,
          tasks: [...currentProject.tasks, lastAction.beforeState]
        });
        break;
        
      case 'add-resource':
        // 刪除添加的資源
        updateProject({
          ...currentProject,
          resources: currentProject.resources.filter(r => r.id !== lastAction.targetId)
        });
        break;
        
      case 'update-resource':
        // 還原資源到更新前的狀態
        updateProject({
          ...currentProject,
          resources: currentProject.resources.map(r => 
            r.id === lastAction.targetId ? lastAction.beforeState : r
          )
        });
        break;
        
      case 'delete-resource':
        // 還原被刪除的資源
        updateProject({
          ...currentProject,
          resources: [...currentProject.resources, lastAction.beforeState]
        });
        break;
    }
  }, [undoStack, currentProject, updateProject]);

  const redo = useCallback(() => {
    if (redoStack.length === 0 || !currentProject) return;
    
    const lastAction = redoStack[redoStack.length - 1];
    
    // 從 redo 堆疊中移除最後一個操作
    setRedoStack(prev => prev.slice(0, -1));
    
    // 添加到 undo 堆疊
    setUndoStack(prev => [...prev, lastAction]);
    
    // 根據操作類型執行重做
    switch (lastAction.type) {
      case 'add-task':
        // 重新添加任務
        updateProject({
          ...currentProject,
          tasks: [...currentProject.tasks, lastAction.afterState]
        });
        break;
        
      case 'update-task':
        // 重新更新任務
        updateProject({
          ...currentProject,
          tasks: currentProject.tasks.map(t => 
            t.id === lastAction.targetId ? lastAction.afterState : t
          )
        });
        break;
        
      case 'delete-task':
        // 重新刪除任務
        updateProject({
          ...currentProject,
          tasks: currentProject.tasks.filter(t => t.id !== lastAction.targetId)
        });
        break;
        
      case 'add-resource':
        // 重新添加資源
        updateProject({
          ...currentProject,
          resources: [...currentProject.resources, lastAction.afterState]
        });
        break;
        
      case 'update-resource':
        // 重新更新資源
        updateProject({
          ...currentProject,
          resources: currentProject.resources.map(r => 
            r.id === lastAction.targetId ? lastAction.afterState : r
          )
        });
        break;
        
      case 'delete-resource':
        // 重新刪除資源
        updateProject({
          ...currentProject,
          resources: currentProject.resources.filter(r => r.id !== lastAction.targetId)
        });
        break;
    }
  }, [redoStack, currentProject, updateProject]);

  return (
    <ProjectContext.Provider value={{
      currentProject,
      projects,
      setCurrentProject,
      createProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      addResource,
      updateResource,
      deleteResource,
      addCost,
      updateCost,
      deleteCost,
      addRisk,
      updateRisk,
      deleteRisk,
      saveProject,
      exportProjectFile,
      openProjectFile,
      restoreSnapshot,
      listSnapshots,
      removeSnapshot,
      initializeFromLatestSnapshot,
      projectState,
      setProjectState,
      undoStack,
      redoStack,
      pushUndo,
      undo,
      redo
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};