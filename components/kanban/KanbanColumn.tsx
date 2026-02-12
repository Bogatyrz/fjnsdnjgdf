"use client";

import { useState, useCallback } from "react";
import { Task, Column } from "@/lib/types";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { Plus, Lock, MoreHorizontal } from "lucide-react";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDragStart: (task: Task, sourceColumnId: string) => void;
  onDragEnd: () => void;
  onDrop: (targetColumnId: string) => void;
  onTaskClick: (task: Task) => void;
  isDailyBase: boolean;
  isDraggedOver: boolean;
}

export function KanbanColumn({
  column,
  tasks,
  onDragStart,
  onDragEnd,
  onDrop,
  onTaskClick,
  isDailyBase,
  isDraggedOver,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      onDrop(column.id);
    },
    [column.id, onDrop]
  );

  return (
    <div
      className={`
        shrink-0 w-72 flex flex-col max-h-full rounded-2xl
        ${isDailyBase ? "column-daily-base" : "glass-card"}
        ${isDragOver && isDraggedOver ? "drag-over ring-2 ring-purple-500/50" : ""}
        transition-all duration-200
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div
        className={`
          column-header p-4 border-b border-white/10 flex items-center justify-between
          ${isDailyBase ? "rounded-t-2xl" : ""}
        `}
      >
        <div className="flex items-center gap-2">
          {/* Color Indicator */}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color || "#64748b" }}
          />

          {/* Title */}
          <h3 className="font-semibold">{column.title}</h3>

          {/* Task Count */}
          <span className="text-xs text-foreground-muted bg-white/5 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>

          {/* Daily Base Lock Indicator */}
          {isDailyBase && (
            <div
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400"
              title="Daily BASE column is locked and resets daily"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Locked</span>
            </div>
          )}
        </div>

        {/* Column Actions */}
        {!isDailyBase && (
          <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="w-4 h-4 text-foreground-muted" />
          </button>
        )}
      </div>

      {/* Tasks Container */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {tasks.map((task, index) => (
          <KanbanTaskCard
            key={task.id}
            task={task}
            index={index}
            columnId={column.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={() => onTaskClick(task)}
          />
        ))}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-foreground-muted text-sm">
            <p>No tasks yet</p>
            <p className="text-xs mt-1">Drag tasks here or create new ones</p>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-3 border-t border-white/10">
        <button
          className={`
            w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
            text-sm font-medium transition-all
            ${
              isDailyBase
                ? "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                : "glass-hover text-foreground-muted hover:text-foreground"
            }
          `}
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>
    </div>
  );
}
