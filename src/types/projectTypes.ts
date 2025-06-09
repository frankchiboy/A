export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  tasks: Task[];
  resources: Resource[];
  milestones: Milestone[];
  teams: Team[];
  costs: CostRecord[];
  risks: Risk[];
  budget: Budget;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number; // in days
  progress: number; // percentage
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string[]; // resource IDs
  dependencies: string[]; // task IDs
  milestoneId?: string;
  isMilestone: boolean;
  notes: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'human' | 'material' | 'equipment';
  email?: string;
  phone?: string;
  role?: string;
  skills?: string[];
  cost: number; // per hour for human, per unit for others
  availability: Availability[];
  utilization: number; // percentage
  teamId?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  dayOfWeek: number; // 0-6, where 0 is Sunday
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  date: string;
  status: 'upcoming' | 'reached' | 'missed';
  taskIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: string[]; // resource IDs
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  total: number;
  spent: number;
  remaining: number;
  currency: string;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  actual: number;
}

export interface CostRecord {
  id: string;
  taskId: string;
  amount: number;
  category: string;
  currency: string;
  date: string;
  invoiceId: string;
  status: 'pending' | 'paid';
  note: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string; // resource ID
  uploadedAt: string;
}

export interface Risk {
  id: string;
  name: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'identified' | 'mitigated' | 'occurred';
  mitigation: string;
  owner: string; // resource ID
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  taskCompletion: number;
  upcomingMilestones: number;
  resourceUtilization: number;
  budgetStatus: {
    percentage: number;
    status: 'under' | 'on-track' | 'over';
  };
  risksCount: {
    low: number;
    medium: number;
    high: number;
  };
}

export type ProjectStateName =
  | 'UNINITIALIZED'
  | 'UNTITLED'
  | 'EDITING'
  | 'DIRTY'
  | 'SAVED'
  | 'CLOSING';

export interface ProjectState {
  currentState: ProjectStateName;
  hasUnsavedChanges: boolean;
  isUntitled: boolean;
  lastModified: string;
  autosaveTimer: 'active' | 'inactive';
  openedFrom: 'manual' | 'recovery' | 'template' | null;
}

export interface UndoItem {
  type: string;
  targetId: string;
  beforeState: unknown;
  afterState: unknown;
}