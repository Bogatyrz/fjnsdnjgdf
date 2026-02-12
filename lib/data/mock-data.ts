import { MockData, User, Column, Task, TaskHistory, Analytics } from "@/lib/types";

export const mockUsers: User[] = [
  {
    id: "user_1",
    name: "Alex Rivera",
    email: "alex@vibetasker.com",
    avatar: "AR",
    role: "admin",
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "user_2",
    name: "Sarah Chen",
    email: "sarah@vibetasker.com",
    avatar: "SC",
    role: "member",
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: "user_3",
    name: "Jordan Smith",
    email: "jordan@vibetasker.com",
    avatar: "JS",
    role: "member",
    createdAt: Date.now() - 86400000 * 10,
  },
];

export const mockColumns: Column[] = [
  {
    id: "col_daily",
    title: "Daily BASE",
    order: 0,
    type: "daily",
    locked: true,
    color: "#8b5cf6",
    createdAt: Date.now() - 86400000 * 30,
    createdBy: "system",
  },
  {
    id: "col_todo",
    title: "To Do",
    order: 1,
    type: "custom",
    color: "#64748b",
    createdAt: Date.now() - 86400000 * 25,
    createdBy: "user_1",
  },
  {
    id: "col_progress",
    title: "In Progress",
    order: 2,
    type: "custom",
    color: "#3b82f6",
    createdAt: Date.now() - 86400000 * 25,
    createdBy: "user_1",
  },
  {
    id: "col_review",
    title: "Review",
    order: 3,
    type: "custom",
    color: "#f59e0b",
    createdAt: Date.now() - 86400000 * 20,
    createdBy: "user_1",
  },
  {
    id: "col_done",
    title: "Done",
    order: 4,
    type: "custom",
    color: "#10b981",
    createdAt: Date.now() - 86400000 * 25,
    createdBy: "user_1",
  },
];

export const mockTasks: Task[] = [
  // Daily BASE column tasks
  {
    id: "task_1",
    title: "Morning standup",
    description: "Daily team sync",
    columnId: "col_daily",
    assigneeId: "user_1",
    priority: "high",
    status: "in_progress",
    tags: ["daily", "meeting"],
    order: 0,
    dueDate: Date.now() + 86400000,
    createdAt: Date.now() - 86400000,
    createdBy: "user_1",
  },
  {
    id: "task_2",
    title: "Code review",
    description: "Review PRs from team",
    columnId: "col_daily",
    assigneeId: "user_1",
    priority: "medium",
    status: "todo",
    tags: ["daily", "dev"],
    order: 1,
    dueDate: Date.now() + 86400000,
    createdAt: Date.now() - 86400000,
    createdBy: "user_1",
  },
  {
    id: "task_3",
    title: "Email cleanup",
    description: "Clear inbox",
    columnId: "col_daily",
    assigneeId: "user_2",
    priority: "low",
    status: "done",
    tags: ["daily"],
    order: 2,
    dueDate: Date.now() + 86400000,
    createdAt: Date.now() - 86400000,
    createdBy: "user_2",
  },
  // To Do column
  {
    id: "task_4",
    title: "Design system update",
    description: "Update component library",
    columnId: "col_todo",
    assigneeId: "user_2",
    priority: "high",
    status: "todo",
    tags: ["design", "system"],
    order: 0,
    dueDate: Date.now() + 172800000,
    createdAt: Date.now() - 86400000 * 2,
    createdBy: "user_1",
  },
  {
    id: "task_5",
    title: "API documentation",
    description: "Document new endpoints",
    columnId: "col_todo",
    assigneeId: "user_3",
    priority: "medium",
    status: "todo",
    tags: ["docs", "api"],
    order: 1,
    dueDate: Date.now() + 259200000,
    createdAt: Date.now() - 86400000 * 3,
    createdBy: "user_1",
  },
  // In Progress column
  {
    id: "task_6",
    title: "Feature: Dark mode",
    description: "Implement dark theme toggle",
    columnId: "col_progress",
    assigneeId: "user_1",
    priority: "high",
    status: "in_progress",
    tags: ["feature", "ui"],
    order: 0,
    dueDate: Date.now() + 432000000,
    createdAt: Date.now() - 86400000 * 5,
    createdBy: "user_1",
  },
  {
    id: "task_7",
    title: "Database migration",
    description: "Migrate to new schema",
    columnId: "col_progress",
    assigneeId: "user_3",
    priority: "high",
    status: "in_progress",
    tags: ["backend", "db"],
    order: 1,
    dueDate: Date.now() + 345600000,
    createdAt: Date.now() - 86400000 * 4,
    createdBy: "user_1",
  },
  // Review column
  {
    id: "task_8",
    title: "User testing results",
    description: "Analyze feedback from beta",
    columnId: "col_review",
    assigneeId: "user_2",
    priority: "medium",
    status: "in_progress",
    tags: ["research", "ux"],
    order: 0,
    dueDate: Date.now() + 86400000,
    createdAt: Date.now() - 86400000 * 6,
    createdBy: "user_2",
  },
  // Done column
  {
    id: "task_9",
    title: "Setup CI/CD",
    description: "Configure GitHub Actions",
    columnId: "col_done",
    assigneeId: "user_3",
    priority: "medium",
    status: "done",
    tags: ["devops"],
    order: 0,
    dueDate: Date.now() - 86400000,
    createdAt: Date.now() - 86400000 * 10,
    createdBy: "user_1",
  },
  {
    id: "task_10",
    title: "Logo redesign",
    description: "New brand identity",
    columnId: "col_done",
    assigneeId: "user_2",
    priority: "low",
    status: "done",
    tags: ["design", "branding"],
    order: 1,
    dueDate: Date.now() - 86400000 * 2,
    createdAt: Date.now() - 86400000 * 12,
    createdBy: "user_2",
  },
];

export const mockTaskHistory: TaskHistory[] = [
  {
    id: "hist_1",
    taskId: "task_6",
    action: "moved",
    fromColumnId: "col_todo",
    toColumnId: "col_progress",
    performedBy: "user_1",
    performedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "hist_2",
    taskId: "task_9",
    action: "moved",
    fromColumnId: "col_progress",
    toColumnId: "col_done",
    performedBy: "user_3",
    performedAt: Date.now() - 86400000,
  },
  {
    id: "hist_3",
    taskId: "task_10",
    action: "moved",
    fromColumnId: "col_review",
    toColumnId: "col_done",
    performedBy: "user_2",
    performedAt: Date.now() - 86400000 * 2,
  },
];

export const mockAnalytics: Analytics[] = [
  {
    id: "an_1",
    date: new Date().toISOString().split("T")[0],
    tasksCreated: 3,
    tasksCompleted: 2,
    tasksMoved: 8,
    avgCompletionTime: 2.5,
    updatedAt: Date.now(),
  },
  {
    id: "an_2",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    tasksCreated: 2,
    tasksCompleted: 4,
    tasksMoved: 12,
    avgCompletionTime: 1.8,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "an_3",
    date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
    tasksCreated: 5,
    tasksCompleted: 3,
    tasksMoved: 10,
    avgCompletionTime: 2.1,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "an_4",
    date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
    tasksCreated: 4,
    tasksCompleted: 3,
    tasksMoved: 9,
    avgCompletionTime: 2.3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: "an_5",
    date: new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0],
    tasksCreated: 3,
    tasksCompleted: 5,
    tasksMoved: 11,
    avgCompletionTime: 1.9,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: "an_6",
    date: new Date(Date.now() - 86400000 * 5).toISOString().split("T")[0],
    tasksCreated: 6,
    tasksCompleted: 4,
    tasksMoved: 14,
    avgCompletionTime: 2.0,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: "an_7",
    date: new Date(Date.now() - 86400000 * 6).toISOString().split("T")[0],
    tasksCreated: 2,
    tasksCompleted: 3,
    tasksMoved: 7,
    avgCompletionTime: 2.4,
    updatedAt: Date.now() - 86400000 * 6,
  },
];

export const mockData: MockData = {
  users: mockUsers,
  columns: mockColumns,
  tasks: mockTasks,
  taskHistory: mockTaskHistory,
  analytics: mockAnalytics,
};

// Helper functions
export function getTasksByColumn(columnId: string): Task[] {
  return mockTasks.filter((task) => task.columnId === columnId).sort((a, b) => a.order - b.order);
}

export function getColumnById(columnId: string): Column | undefined {
  return mockColumns.find((col) => col.id === columnId);
}

export function getUserById(userId: string): User | undefined {
  return mockUsers.find((user) => user.id === userId);
}

export function getDailyBaseColumn(): Column {
  return mockColumns.find((col) => col.type === "daily")!;
}
