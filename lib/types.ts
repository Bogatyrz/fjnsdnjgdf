// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member";
  createdAt: number;
}

// Column Types
export interface Column {
  id: string;
  title: string;
  order: number;
  type: "daily" | "custom";
  locked?: boolean;
  color?: string;
  createdAt: number;
  createdBy: string;
}

// Task Types
export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";
export type RecurrenceType = "daily" | "weekly" | "monthly";

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  assigneeId?: string;
  assignee?: User;
  priority: Priority;
  status: TaskStatus;
  tags?: string[];
  order: number;
  dueDate?: number;
  createdAt: number;
  createdBy: string;
  // Recurrence support
  recurrence?: RecurrenceType | null;
  // Streak tracking
  streak?: number;
  lastCompletedAt?: number;
}

// Task History Types
export type TaskAction = "created" | "moved" | "updated" | "deleted";

export interface TaskHistory {
  id: string;
  taskId: string;
  action: TaskAction;
  fromColumnId?: string;
  toColumnId?: string;
  performedBy: string;
  performer?: User;
  performedAt: number;
  metadata?: string;
}

// Analytics Types
export interface Analytics {
  id: string;
  date: string;
  tasksCreated: number;
  tasksCompleted: number;
  tasksMoved: number;
  avgCompletionTime?: number;
  updatedAt: number;
}

// Dashboard Types
export interface DashboardStats {
  totalTasks: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksPending: number;
  completionRate: number;
  avgTasksPerDay: number;
  todayCompleted: number;
  todayCreated: number;
  streak: number;
}

// Kanban Types
export interface KanbanColumn extends Column {
  tasks: Task[];
}

export interface DragItem {
  task: Task;
  sourceColumnId: string;
}

// Modal Types
export type ModalType = "task" | "column" | "confirm" | "done" | "not_today" | "failure" | "celebration" | null;

export interface ModalState {
  isOpen: boolean;
  type: ModalType;
  data?: unknown;
}

// Form Types
export interface CreateTaskForm {
  title: string;
  description: string;
  columnId: string;
  priority: Priority;
  dueDate?: Date;
  tags: string[];
  assigneeId?: string;
  recurrence?: RecurrenceType | null;
}

export interface CreateColumnForm {
  title: string;
  color?: string;
  type?: "daily" | "custom";
}

// Filter Types
export interface TaskFilters {
  priority?: Priority[];
  status?: TaskStatus[];
  assignee?: string[];
  tags?: string[];
  dueDate?: "today" | "week" | "overdue" | null;
}

// Theme Types
export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  glassEffect: boolean;
  animations: boolean;
  memeMode: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Mock Data Types
export interface MockData {
  users: User[];
  columns: Column[];
  tasks: Task[];
  taskHistory: TaskHistory[];
  analytics: Analytics[];
}

// User Settings
export interface UserSettings {
  userId: string;
  memeMode: boolean;
  confettiEnabled: boolean;
  selectedMemeImages: string[];
  theme: ThemeConfig;
  updatedAt: number;
}
