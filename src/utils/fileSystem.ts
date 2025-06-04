import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { Project, Task, Resource, Milestone, Team, Budget, CostRecord, Risk } from '../types/projectTypes';

// 專案檔案結構類型
export interface ProjectPackage {
  manifest: ProjectManifest;
  project: Project;
  tasks: Task[];
  resources: Resource[];
  milestones: Milestone[];
  teams: Team[];
  costs: CostRecord[];
  risks: Risk[];
  budget: Budget;
  attachments: Attachment[];
}

// 檔案封裝資訊
export interface ProjectManifest {
  project_uuid: string;
  file_version: string;
  created_platform: 'Windows' | 'macOS' | 'Linux' | 'Web';
  created_with_version: string;
  created_at: string;
  updated_at: string;
}

// 檔案附件
export interface Attachment {
  id: string;
  name: string;
  file: Blob | null;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface SnapshotEntry {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  type: string;
}

// 獲取當前平台
const getPlatform = (): 'Windows' | 'macOS' | 'Linux' | 'Web' => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('win') !== -1) return 'Windows';
  if (userAgent.indexOf('mac') !== -1) return 'macOS';
  if (userAgent.indexOf('linux') !== -1) return 'Linux';
  return 'Web';
};

// 建立新的專案封裝
export const createProjectPackage = (project: Project): ProjectPackage => {
  return {
    manifest: {
      project_uuid: project.id || uuidv4(),
      file_version: '1.0.0',
      created_platform: getPlatform(),
      created_with_version: '1.0.0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    project,
    tasks: project.tasks || [],
    resources: project.resources || [],
    milestones: project.milestones || [],
    teams: project.teams || [],
    costs: project.costs || [],
    risks: project.risks || [],
    budget: project.budget || {
      total: 0,
      spent: 0,
      remaining: 0,
      currency: 'TWD',
      categories: []
    },
    attachments: []
  };
};

// 儲存專案為 .mpproj 檔案
export const saveProjectToFile = async (projectPackage: ProjectPackage, fileName: string): Promise<void> => {
  try {
    const zip = new JSZip();
    
    // 更新最後修改時間
    projectPackage.manifest.updated_at = new Date().toISOString();
    
    // 將各個 JSON 檔案加入 zip
    zip.file('manifest.json', JSON.stringify(projectPackage.manifest, null, 2));
    zip.file('project.json', JSON.stringify(projectPackage.project, null, 2));
    zip.file('tasks.json', JSON.stringify(projectPackage.tasks, null, 2));
    zip.file('resources.json', JSON.stringify(projectPackage.resources, null, 2));
    zip.file('milestones.json', JSON.stringify(projectPackage.milestones, null, 2));
    zip.file('teams.json', JSON.stringify(projectPackage.teams, null, 2));
    zip.file('budget.json', JSON.stringify(projectPackage.budget, null, 2));
    zip.file('costs.json', JSON.stringify(projectPackage.costs, null, 2));
    zip.file('risklog.json', JSON.stringify(projectPackage.risks, null, 2));
    
    // 附件資料夾
    const attachments = zip.folder('attachments');
    for (const attachment of projectPackage.attachments) {
      if (attachment.file) {
        attachments?.file(attachment.name, attachment.file);
      }
    }
    
    // 生成 zip 檔案並下載
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${fileName}.mpproj`);
    
    // 儲存自動備份到本地
    saveAutoSnapshot(projectPackage);
    
    return Promise.resolve();
  } catch (error) {
    console.error('儲存專案檔案失敗:', error);
    return Promise.reject(error);
  }
};

// 從 .mpproj 檔案載入專案
export const loadProjectFromFile = async (file: File): Promise<ProjectPackage> => {
  try {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);
    
    // 解析各個 JSON 檔案
    const manifestJson = await zipContent.file('manifest.json')?.async('text') || '{}';
    const projectJson = await zipContent.file('project.json')?.async('text') || '{}';
    const tasksJson = await zipContent.file('tasks.json')?.async('text') || '[]';
    const resourcesJson = await zipContent.file('resources.json')?.async('text') || '[]';
    const milestonesJson = await zipContent.file('milestones.json')?.async('text') || '[]';
    const teamsJson = await zipContent.file('teams.json')?.async('text') || '[]';
    const budgetJson = await zipContent.file('budget.json')?.async('text') || '{}';
    const costsJson = await zipContent.file('costs.json')?.async('text') || '[]';
    const risksJson = await zipContent.file('risklog.json')?.async('text') || '[]';
    
    // 解析附件
    const attachments: Attachment[] = [];
    const attachmentsFolder = zipContent.folder('attachments');
    if (attachmentsFolder) {
      const attachmentFiles = Object.keys(attachmentsFolder.files).filter(
        path => !path.endsWith('/')
      );
      
      for (const path of attachmentFiles) {
        const fileName = path.split('/').pop() || '';
        const fileData = await attachmentsFolder.file(fileName)?.async('blob');
        if (fileData) {
          attachments.push({
            id: uuidv4(),
            name: fileName,
            file: fileData,
            type: fileData.type,
            size: fileData.size,
            uploadedBy: '',
            uploadedAt: new Date().toISOString()
          });
        }
      }
    }
    
    return {
      manifest: JSON.parse(manifestJson),
      project: JSON.parse(projectJson),
      tasks: JSON.parse(tasksJson),
      resources: JSON.parse(resourcesJson),
      milestones: JSON.parse(milestonesJson),
      teams: JSON.parse(teamsJson),
      costs: JSON.parse(costsJson),
      risks: JSON.parse(risksJson),
      budget: JSON.parse(budgetJson),
      attachments
    };
  } catch (error) {
    console.error('載入專案檔案失敗:', error);
    return Promise.reject(error);
  }
};

// 儲存自動快照
export const saveAutoSnapshot = async (projectPackage: ProjectPackage): Promise<void> => {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const snapshotName = `${projectPackage.project.name || 'Untitled'}_${timestamp}`;
    
    // 存到 localStorage 備份索引
    const snapshotsIndexKey = 'project_snap_index';
    const snapshotsIndex = JSON.parse(localStorage.getItem(snapshotsIndexKey) || '[]');
    
    // 新增當前快照到索引
    snapshotsIndex.push({
      id: uuidv4(),
      name: snapshotName,
      projectId: projectPackage.project.id,
      createdAt: timestamp,
      type: 'Auto'
    });
    
    // 限制快照數量（保留最近50個）
    if (snapshotsIndex.length > 50) {
      snapshotsIndex.shift();
    }
    
    localStorage.setItem(snapshotsIndexKey, JSON.stringify(snapshotsIndex));
    
    // 壓縮專案並儲存到 localStorage
    const zip = new JSZip();
    zip.file('manifest.json', JSON.stringify(projectPackage.manifest, null, 2));
    zip.file('project.json', JSON.stringify(projectPackage.project, null, 2));
    zip.file('tasks.json', JSON.stringify(projectPackage.tasks, null, 2));
    zip.file('resources.json', JSON.stringify(projectPackage.resources, null, 2));
    zip.file('milestones.json', JSON.stringify(projectPackage.milestones, null, 2));
    zip.file('teams.json', JSON.stringify(projectPackage.teams, null, 2));
    zip.file('budget.json', JSON.stringify(projectPackage.budget, null, 2));
    
    const content = await zip.generateAsync({ type: 'base64' });
    localStorage.setItem(`snapshot_${snapshotName}`, content);
    
    return Promise.resolve();
  } catch (error) {
    console.error('儲存快照失敗:', error);
    return Promise.reject(error);
  }
};

// 獲取快照列表
export const getSnapshotsList = (): SnapshotEntry[] => {
  const snapshotsIndexKey = 'project_snap_index';
  return JSON.parse(localStorage.getItem(snapshotsIndexKey) || '[]');
};

// 載入快照
export const loadSnapshot = async (snapshotName: string): Promise<ProjectPackage | null> => {
  try {
    const snapshotData = localStorage.getItem(`snapshot_${snapshotName}`);
    if (!snapshotData) return null;
    
    const zip = new JSZip();
    await zip.loadAsync(snapshotData, { base64: true });
    
    const manifestJson = await zip.file('manifest.json')?.async('text') || '{}';
    const projectJson = await zip.file('project.json')?.async('text') || '{}';
    const tasksJson = await zip.file('tasks.json')?.async('text') || '[]';
    const resourcesJson = await zip.file('resources.json')?.async('text') || '[]';
    const milestonesJson = await zip.file('milestones.json')?.async('text') || '[]';
    const teamsJson = await zip.file('teams.json')?.async('text') || '[]';
    const budgetJson = await zip.file('budget.json')?.async('text') || '{}';
    const costsJson = await zip.file('costs.json')?.async('text') || '[]';
    const risksJson = await zip.file('risklog.json')?.async('text') || '[]';
    
    return {
      manifest: JSON.parse(manifestJson),
      project: JSON.parse(projectJson),
      tasks: JSON.parse(tasksJson),
      resources: JSON.parse(resourcesJson),
      milestones: JSON.parse(milestonesJson),
      teams: JSON.parse(teamsJson),
      costs: JSON.parse(costsJson),
      risks: JSON.parse(risksJson),
      budget: JSON.parse(budgetJson),
      attachments: []
    };
  } catch (error) {
    console.error('載入快照失敗:', error);
    return null;
  }
};

// 刪除快照
export const deleteSnapshot = (snapshotName: string): void => {
  try {
    const snapshotsIndexKey = 'project_snap_index';
    const snapshotsIndex = JSON.parse(localStorage.getItem(snapshotsIndexKey) || '[]');
    
    // 從索引中移除
    const updatedIndex = (snapshotsIndex as SnapshotEntry[]).filter((snap: SnapshotEntry) => snap.name !== snapshotName);
    localStorage.setItem(snapshotsIndexKey, JSON.stringify(updatedIndex));
    
    // 從 localStorage 中移除快照資料
    localStorage.removeItem(`snapshot_${snapshotName}`);
  } catch (error) {
    console.error('刪除快照失敗:', error);
  }
};

// 儲存最近專案列表
export const saveRecentProjects = (projects: { fileName: string; filePath: string; openedAt: string; projectUUID: string; isTemporary: boolean }[]): void => {
  localStorage.setItem('recent_projects', JSON.stringify(projects));
};

// 獲取最近專案列表
export const getRecentProjects = (): { fileName: string; filePath: string; openedAt: string; projectUUID: string; isTemporary: boolean }[] => {
  return JSON.parse(localStorage.getItem('recent_projects') || '[]');
};

// 更新最近專案列表
export const updateRecentProjects = (project: { fileName: string; filePath: string; projectUUID: string; isTemporary: boolean }): void => {
  const recentProjects = getRecentProjects();
  
  // 查找是否已存在相同 UUID 的專案
  const existingIndex = recentProjects.findIndex(p => p.projectUUID === project.projectUUID);
  
  if (existingIndex !== -1) {
    // 更新現有記錄
    recentProjects[existingIndex] = {
      ...project,
      openedAt: new Date().toISOString()
    };
  } else {
    // 新增記錄
    recentProjects.unshift({
      ...project,
      openedAt: new Date().toISOString()
    });
    
    // 限制最多保留 10 筆記錄
    if (recentProjects.length > 10) {
      recentProjects.pop();
    }
  }
  
  // 儲存更新後的列表
  saveRecentProjects(recentProjects);
};

// 取得最新的快照（依建立時間排序）
export const getLatestSnapshot = (): SnapshotEntry | null => {
  const list = getSnapshotsList();
  if (list.length === 0) return null;
  const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return sorted[0];
};