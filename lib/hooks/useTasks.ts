"use client";

import { useState, useEffect, useCallback } from "react";
import { Task } from "@/lib/types";
import { mockTasks, mockColumns } from "@/lib/data/mock-data";

// Local state for mock data
let tasksState = [...mockTasks];
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Helper to get column name
const getColumnIdByType = (type: string) => {
  const col = mockColumns.find(c => c.type === type);
  return col?.id;
};

// Query hooks
export function useAllTasks() {
  const [tasks, setTasks] = useState<Task[]>(tasksState);

  useEffect(() => {
    const listener = () => setTasks([...tasksState]);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return tasks;
}

export function useTasksByColumn(columnId: string) {
  const tasks = useAllTasks();
  return tasks.filter(t => t.columnId === columnId).sort((a, b) => {
    if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
    return a.order - b.order;
  });
}

export function useTodayTasks() {
  const tasks = useAllTasks();
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const endOfDay = new Date().setHours(23, 59, 59, 999);
  const dailyBaseId = getColumnIdByType("daily");

  return tasks.filter((task) => {
    const isDueToday = task.dueDate && task.dueDate >= startOfDay && task.dueDate <= endOfDay;
    const isDailyBase = task.columnId === dailyBaseId;
    const isNotDone = task.status !== "done";
    return (isDueToday || isDailyBase) && isNotDone;
  }).sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });
}

export function useTaskById(taskId: string) {
  const tasks = useAllTasks();
  return tasks.find(t => t.id === taskId);
}

export function useTasksByStatus(status: "todo" | "in_progress" | "done") {
  const tasks = useAllTasks();
  return tasks.filter(t => t.status === status);
}

export function useOverdueTasks() {
  const tasks = useAllTasks();
  // Calculate current time once to avoid calling during render
  const now = Date.now();
  return tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== "done");
}

// Mutation hooks
export function useCreateTask() {
  return useCallback(async (args: {
    title: string;
    description?: string;
    columnId: string;
    priority: "low" | "medium" | "high";
    status?: "todo" | "in_progress" | "done";
    dueDate?: number;
    tags?: string[];
    assigneeId?: string;
  }) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: args.title,
      description: args.description,
      columnId: args.columnId,
      assigneeId: args.assigneeId,
      priority: args.priority,
      status: args.status || "todo",
      tags: args.tags || [],
      order: tasksState.length,
      dueDate: args.dueDate,
      createdAt: Date.now(),
      createdBy: "user_1",
    };
    tasksState = [...tasksState, newTask];
    notifyListeners();
    return newTask.id;
  }, []);
}

export function useUpdateTask() {
  return useCallback(async (args: {
    taskId: string;
    title?: string;
    description?: string;
    columnId?: string;
    priority?: "low" | "medium" | "high";
    status?: "todo" | "in_progress" | "done";
    dueDate?: number;
    tags?: string[];
    assigneeId?: string | null;
  }) => {
    tasksState = tasksState.map(t => 
      t.id === args.taskId ? { ...t, ...args, assigneeId: args.assigneeId || undefined } : t
    );
    notifyListeners();
    return true;
  }, []);
}

export function useMoveTask() {
  return useCallback(async (args: {
    taskId: string;
    targetColumnId: string;
    newOrder?: number;
  }) => {
    tasksState = tasksState.map(t => {
      if (t.id === args.taskId) {
        const newStatus = args.targetColumnId === getColumnIdByType("done") ? "done" : 
                         args.targetColumnId === "col_progress" ? "in_progress" : "todo";
        return { 
          ...t, 
          columnId: args.targetColumnId, 
          status: newStatus,
          order: args.newOrder ?? t.order 
        };
      }
      return t;
    });
    notifyListeners();
    return true;
  }, []);
}

export function useDeleteTask() {
  return useCallback(async (args: { taskId: string }) => {
    tasksState = tasksState.filter(t => t.id !== args.taskId);
    notifyListeners();
    return true;
  }, []);
}

export function useReorderTask() {
  return useCallback(async (args: { taskId: string; newOrder: number }) => {
    tasksState = tasksState.map(t => 
      t.id === args.taskId ? { ...t, order: args.newOrder } : t
    );
    notifyListeners();
    return true;
  }, []);
}

export function useHandleRecurrence() {
  return useCallback(async (args: {
    taskId: string;
    recurrenceType: "daily" | "weekly" | "monthly";
  }) => {
    const original = tasksState.find(t => t.id === args.taskId);
    if (!original) return null;

    let nextDueDate: number;
    switch (args.recurrenceType) {
      case "daily":
        nextDueDate = Date.now() + 24 * 60 * 60 * 1000;
        break;
      case "weekly":
        nextDueDate = Date.now() + 7 * 24 * 60 * 60 * 1000;
        break;
      case "monthly":
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        nextDueDate = date.getTime();
        break;
    }

    const newTask: Task = {
      ...original,
      id: `task_${Date.now()}`,
      status: "todo",
      dueDate: nextDueDate,
      createdAt: Date.now(),
    };
    tasksState = [...tasksState, newTask];
    notifyListeners();
    return newTask.id;
  }, []);
}

export function useMarkTaskDone() {
  return useCallback(async (args: { taskId: string }) => {
    tasksState = tasksState.map(t => 
      t.id === args.taskId ? { ...t, status: "done" as const } : t
    );
    notifyListeners();
    return true;
  }, []);
}

export function useSkipTask() {
  return useCallback(async (args: { taskId: string; reason?: string }) => {
    const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
    tasksState = tasksState.map(t => 
      t.id === args.taskId ? { ...t, dueDate: tomorrow, status: "todo" as const } : t
    );
    notifyListeners();
    return true;
  }, []);
}
