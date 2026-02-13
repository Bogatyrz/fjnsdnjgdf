"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Query hooks
export function useAllColumns() {
  return useQuery(api.columns.getAll);
}

export function useColumnById(columnId: Id<"columns">) {
  return useQuery(api.columns.getById, { columnId });
}

export function useDailyBaseColumn() {
  return useQuery(api.columns.getDailyBase);
}

// Mutation hooks
export function useCreateColumn() {
  return useMutation(api.columns.create);
}

export function useUpdateColumn() {
  return useMutation(api.columns.update);
}

export function useDeleteColumn() {
  return useMutation(api.columns.remove);
}

export function useReorderColumn() {
  return useMutation(api.columns.reorder);
}

export function useResetDailyBase() {
  return useMutation(api.columns.resetDailyBase);
}
