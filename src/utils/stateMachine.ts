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

export type ProjectAction =
  | 'initialize'
  | 'edit'
  | 'save'
  | 'saveAs'
  | 'close'
  | 'discard'
  | 'restoreSnapshot';

export function transition(
  state: ProjectState,
  action: ProjectAction
): ProjectState {
  const now = new Date().toISOString();
  switch (action) {
    case 'initialize':
      return {
        ...state,
        currentState: 'UNTITLED',
        hasUnsavedChanges: true,
        isUntitled: true,
        lastModified: now,
        openedFrom: 'manual',
      };
    case 'edit':
      return {
        ...state,
        currentState: 'DIRTY',
        hasUnsavedChanges: true,
        lastModified: now,
      };
    case 'save':
    case 'saveAs':
      return {
        ...state,
        currentState: 'SAVED',
        hasUnsavedChanges: false,
        isUntitled: false,
        lastModified: now,
      };
    case 'close':
      return { ...state, currentState: 'CLOSING' };
    case 'discard':
      return {
        ...state,
        currentState: state.isUntitled ? 'UNTITLED' : 'UNINITIALIZED',
        hasUnsavedChanges: false,
      };
    case 'restoreSnapshot':
      return {
        ...state,
        currentState: 'EDITING',
        hasUnsavedChanges: true,
        isUntitled: false,
        openedFrom: 'recovery',
        lastModified: now,
      };
    default:
      return state;
  }
}

export function getCurrentState(state: ProjectState): ProjectStateName {
  return state.currentState;
}

export function isSaveRequired(state: ProjectState): boolean {
  return state.hasUnsavedChanges;
}
