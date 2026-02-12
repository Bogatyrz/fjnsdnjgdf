"use client";

import { useState, useCallback } from "react";
import { mockColumns, mockTasks, getUserById } from "@/lib/data/mock-data";
import { Task, Column, DragItem } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskDetailsModal } from "../modals/TaskDetailsModal";

export function KanbanBoard() {
  const [columns] = useState<Column[]>(mockColumns.sort((a, b) => a.order - b.order));
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDragStart = useCallback((task: Task, sourceColumnId: string) => {
    setDraggedItem({ task, sourceColumnId });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleDrop = useCallback(
    (targetColumnId: string) => {
      if (!draggedItem) return;

      const { task, sourceColumnId } = draggedItem;

      // Prevent dropping into the same column
      if (sourceColumnId === targetColumnId) {
        setDraggedItem(null);
        return;
      }

      // Check if trying to drop into Daily BASE column
      const targetColumn = columns.find((col) => col.id === targetColumnId);
      if (targetColumn?.type === "daily" && targetColumn.locked) {
        // Allow dropping into Daily BASE only from certain columns or with special logic
        // For now, we'll allow it but show a warning toast (could be implemented)
      }

      // Update the task's column
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                columnId: targetColumnId,
                status: getStatusFromColumn(targetColumnId),
              }
            : t
        )
      );

      setDraggedItem(null);
    },
    [draggedItem, columns]
  );

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(null);
  }, []);

  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTask(null);
  }, []);

  const getStatusFromColumn = (columnId: string): Task["status"] => {
    switch (columnId) {
      case "col_done":
        return "done";
      case "col_progress":
        return "in_progress";
      default:
        return "todo";
    }
  };

  return (
    <>
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = tasks
            .filter((task) => task.columnId === column.id)
            .sort((a, b) => a.order - b.order)
            .map((task) => ({
              ...task,
              assignee: task.assigneeId ? getUserById(task.assigneeId) : undefined,
            }));

          const isDailyBase = column.type === "daily" && column.locked;

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onTaskClick={handleTaskClick}
              isDailyBase={isDailyBase}
              isDraggedOver={draggedItem?.task.columnId !== column.id}
            />
          );
        })}

        {/* Add Column Placeholder */}
        <button className="shrink-0 w-72 h-full min-h-[200px] rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center group">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-2 group-hover:bg-white/10 transition-colors">
              <svg
                className="w-6 h-6 text-foreground-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm text-foreground-muted">Add Column</span>
          </div>
        </button>
      </div>

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </>
  );
}
