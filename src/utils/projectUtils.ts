import { v4 as uuidv4 } from 'uuid';
import { Project, Task, Resource, Team, Milestone, Budget, BudgetCategory } from '../types/projectTypes';

// 創建新的空白專案
export const createEmptyProject = (name: string = 'Untitled Project'): Project => {
  const today = new Date();
  const endDate = new Date();
  endDate.setMonth(today.getMonth() + 3); // 預設3個月專案期間
  
  return {
    id: uuidv4(),
    name,
    description: '',
    startDate: today.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    status: 'planning',
    progress: 0,
    tasks: [],
    resources: [],
    milestones: [],
    teams: [],
    costs: [],
    risks: [],
    budget: {
      total: 0,
      spent: 0,
      remaining: 0,
      currency: 'TWD',
      categories: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// 創建新任務
export const createTask = (
  projectId: string,
  name: string,
  startDate: string,
  endDate: string,
  parentId?: string
): Task => {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const durationDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  return {
    id: uuidv4(),
    name,
    description: '',
    startDate,
    endDate,
    duration: durationDays,
    progress: 0,
    status: 'not-started',
    priority: 'medium',
    assignedTo: [],
    dependencies: [],
    isMilestone: false,
    notes: '',
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// 創建里程碑
export const createMilestone = (
  name: string,
  date: string,
  description: string = ''
): Milestone => {
  return {
    id: uuidv4(),
    name,
    description,
    date,
    status: 'upcoming',
    taskIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// 創建新資源
export const createResource = (
  name: string,
  type: 'human' | 'material' | 'equipment',
  role?: string
): Resource => {
  // 預設週一至週五工作時間
  const defaultAvailability = [
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }
  ];
  
  return {
    id: uuidv4(),
    name,
    type,
    email: '',
    phone: '',
    role: role || '',
    skills: [],
    cost: 0,
    availability: defaultAvailability,
    utilization: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// 創建新團隊
export const createTeam = (
  name: string,
  description: string = '',
  members: string[] = []
): Team => {
  return {
    id: uuidv4(),
    name,
    description,
    members,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// 創建預算類別
export const createBudgetCategory = (
  name: string,
  planned: number
): BudgetCategory => {
  return {
    id: uuidv4(),
    name,
    planned,
    actual: 0
  };
};

// 初始化專案預算
export const initializeProjectBudget = (total: number, currency: string = 'TWD'): Budget => {
  return {
    total,
    spent: 0,
    remaining: total,
    currency,
    categories: []
  };
};

// 計算任務完成進度
export const calculateProjectProgress = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  
  const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
  return Math.round(totalProgress / tasks.length);
};

// 計算資源利用率
export const calculateResourceUtilization = (resource: Resource, tasks: Task[]): number => {
  const assignedTasks = tasks.filter(task => task.assignedTo.includes(resource.id));
  if (assignedTasks.length === 0) return 0;
  
  // 計算總工作天數
  const totalWorkDays = assignedTasks.reduce((sum, task) => sum + task.duration, 0);
  
  // 計算資源可用工作天數（以30天為一個月）
  const availableDaysPerWeek = resource.availability.length;
  const availableDaysPerMonth = availableDaysPerWeek * 4.3;
  
  // 假設任務平均分配在3個月內
  const utilizationRate = Math.min(100, Math.round((totalWorkDays / (availableDaysPerMonth * 3)) * 100));
  
  return utilizationRate;
};

// 依據任務依賴關係重新排程
export const rescheduleTasksByDependencies = (tasks: Task[]): Task[] => {
  const updatedTasks = [...tasks];
  
  // 按照依賴關係排序
  const sorted = sortTasksByDependencies(updatedTasks);
  
  // 更新任務開始時間
  sorted.forEach(task => {
    if (task.dependencies.length > 0) {
      const dependentTasks = task.dependencies.map(depId => 
        updatedTasks.find(t => t.id === depId)
      ).filter(t => t !== undefined) as Task[];
      
      if (dependentTasks.length > 0) {
        // 找出所有依賴任務的最晚結束日期
        const latestEndDate = new Date(Math.max(
          ...dependentTasks.map(t => new Date(t.endDate).getTime())
        ));
        
        // 設置當前任務的開始日期為依賴任務的結束日期後一天
        const newStartDate = new Date(latestEndDate);
        newStartDate.setDate(newStartDate.getDate() + 1);
        
        // 更新結束日期，保持持續時間不變
        const newEndDate = new Date(newStartDate);
        newEndDate.setDate(newStartDate.getDate() + task.duration - 1);
        
        // 更新任務的日期
        const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          updatedTasks[taskIndex] = {
            ...task,
            startDate: newStartDate.toISOString().split('T')[0],
            endDate: newEndDate.toISOString().split('T')[0]
          };
        }
      }
    }
  });
  
  return updatedTasks;
};

// 按照依賴關係排序任務
export const sortTasksByDependencies = (tasks: Task[]): Task[] => {
  const result: Task[] = [];
  const visited = new Set<string>();
  const temporary = new Set<string>();
  
  // 深度優先搜尋
  const visit = (taskId: string) => {
    if (visited.has(taskId)) return;
    if (temporary.has(taskId)) {
      console.warn('發現循環依賴:', taskId);
      return;
    }
    
    temporary.add(taskId);
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.dependencies.forEach(depId => visit(depId));
      
      visited.add(taskId);
      temporary.delete(taskId);
      result.push(task);
    }
  };
  
  // 處理所有任務
  tasks.forEach(task => {
    if (!visited.has(task.id)) {
      visit(task.id);
    }
  });
  
  return result;
};

// 檢查新增依賴關係是否會導致循環依賴
export const wouldCreateCircularDependency = (
  tasks: Task[],
  taskId: string,
  dependencyId: string
): boolean => {
  // 檢查 dependencyId 是否已經依賴於 taskId（直接或間接）
  const dependencyChain = new Set<string>();
  
  const checkDependencies = (currentTaskId: string): boolean => {
    if (currentTaskId === taskId) return true;
    if (dependencyChain.has(currentTaskId)) return false;
    
    dependencyChain.add(currentTaskId);
    
    const currentTask = tasks.find(t => t.id === currentTaskId);
    if (!currentTask) return false;
    
    for (const depId of currentTask.dependencies) {
      if (checkDependencies(depId)) return true;
    }
    
    return false;
  };
  
  return checkDependencies(dependencyId);
};

// 獲取任務的關鍵路徑
export const getCriticalPath = (tasks: Task[]): string[] => {
  // 按結束日期排序
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  );
  
  if (sortedTasks.length === 0) return [];
  
  // 找出結束最晚的任務
  const lastTask = sortedTasks[0];
  
  // 回溯找出關鍵路徑
  const criticalPathTasks: string[] = [lastTask.id];
  let currentTask = lastTask;
  
  while (currentTask.dependencies.length > 0) {
    // 找出依賴中結束最晚的任務
    const dependencyTasks = currentTask.dependencies.map(depId => 
      tasks.find(t => t.id === depId)
    ).filter(t => t !== undefined) as Task[];
    
    if (dependencyTasks.length === 0) break;
    
    const latestDependency = dependencyTasks.reduce((latest, task) => {
      return new Date(task.endDate) > new Date(latest.endDate) ? task : latest;
    }, dependencyTasks[0]);
    
    criticalPathTasks.unshift(latestDependency.id);
    currentTask = latestDependency;
  }
  
  return criticalPathTasks;
};