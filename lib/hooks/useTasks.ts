"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Query hooks
export function useAllTasks() {
  return useQuery(api.tasks.getAll);
}

export function useTasksByColumn(columnId: Id<"columns">) {
  return useQuery(api.tasks.getByColumn, { columnId });
}

export function useTodayTasks() {
  return useQuery(api.tasks.getTodayTasks);
}

export function useTaskById(taskId: Id<"tasks">) {
  return useQuery(api.tasks.getById, { taskId });
}

export function useTasksByStatus(status: "todo" | "in_progress" | "done") {
  return useQuery(api.tasks.getByStatus, { status });
}

export function useTasksByAssignee(assigneeId: Id<"users">) {
  return useQuery(api.tasks.getByAssignee, { assigneeId });
}

export function useOverdueTasks() {
  return useQuery(api.tasks.getOverdue);
}

// Mutation hooks
export function useCreateTask() {
  return useMutation(api.tasks.create);
}

export function useUpdateTask() {
  return useMutation(api.tasks.update);
}

export function useMoveTask() {
  return useMutation(api.tasks.move);
}

export function useDeleteTask() {
  return useMutation(api.tasks.remove);
}

export function useReorderTask() {
  return useMutation(api.tasks.reorder);
}

export function useHandleRecurrence() {
  return useMutation(api.tasks.handleRecurrence);
}

export function useMarkTaskDone() {
  return useMutation(api.tasks.markDone);
}

export function useSkipTask() {
  return useMutation(api.tasks.skipTask);
}
