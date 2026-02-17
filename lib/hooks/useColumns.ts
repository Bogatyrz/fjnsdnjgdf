"use client";

import { useState, useEffect, useCallback } from "react";
import { Column } from "@/lib/types";
import { mockColumns } from "@/lib/data/mock-data";

// Local state for mock data
let columnsState = [...mockColumns];
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Query hooks
export function useAllColumns() {
  const [columns, setColumns] = useState<Column[]>(columnsState);

  useEffect(() => {
    const listener = () => setColumns([...columnsState]);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return columns.sort((a, b) => a.order - b.order);
}

export function useColumnById(columnId: string) {
  const columns = useAllColumns();
  return columns.find(c => c.id === columnId);
}

export function useDailyBaseColumn() {
  const columns = useAllColumns();
  return columns.find(c => c.type === "daily");
}

// Mutation hooks
export function useCreateColumn() {
  return useCallback(async (args: {
    title: string;
    color?: string;
    type?: "daily" | "custom";
  }) => {
    // Check if Daily BASE already exists
    if (args.type === "daily") {
      const hasDaily = columnsState.some(c => c.type === "daily");
      if (hasDaily) {
        throw new Error("Daily BASE column already exists");
      }
    }

    const maxOrder = columnsState.length > 0 
      ? Math.max(...columnsState.map(c => c.order)) 
      : -1;

    const newColumn: Column = {
      id: `col_${Date.now()}`,
      title: args.title,
      order: maxOrder + 1,
      type: args.type || "custom",
      locked: args.type === "daily",
      color: args.color || "#64748b",
      createdAt: Date.now(),
      createdBy: "user_1",
    };

    columnsState = [...columnsState, newColumn];
    notifyListeners();
    return newColumn.id;
  }, []);
}

export function useUpdateColumn() {
  return useCallback(async (args: {
    columnId: string;
    title?: string;
    color?: string;
    order?: number;
  }) => {
    const column = columnsState.find(c => c.id === args.columnId);
    if (!column) return false;

    // Don't allow modifying locked Daily BASE properties
    const updates: Partial<Column> = {};
    if (args.order !== undefined) updates.order = args.order;
    if (!column.locked) {
      if (args.title) updates.title = args.title;
      if (args.color) updates.color = args.color;
    }

    columnsState = columnsState.map(c => 
      c.id === args.columnId ? { ...c, ...updates } : c
    );
    notifyListeners();
    return true;
  }, []);
}

export function useDeleteColumn() {
  return useCallback(async (args: { columnId: string }) => {
    const column = columnsState.find(c => c.id === args.columnId);
    if (!column) return false;
    if (column.locked) {
      throw new Error("Cannot delete locked column");
    }

    columnsState = columnsState.filter(c => c.id !== args.columnId);
    notifyListeners();
    return true;
  }, []);
}

export function useReorderColumn() {
  return useCallback(async (args: { columnId: string; newOrder: number }) => {
    columnsState = columnsState.map(c => 
      c.id === args.columnId ? { ...c, order: args.newOrder } : c
    );
    notifyListeners();
    return true;
  }, []);
}

export function useResetDailyBase() {
  return useCallback(async () => {
    const dailyBase = columnsState.find(c => c.type === "daily");
    if (!dailyBase) return false;

    // Move incomplete tasks to backlog
    // Note: backlog column lookup is prepared for future implementation
    // const backlog = columnsState.find(c => c.title.toLowerCase().includes("todo"));

    // In a real app, we'd also archive/delete tasks here
    // For now, just return true to indicate success

    notifyListeners();
    return true;
  }, []);
}
