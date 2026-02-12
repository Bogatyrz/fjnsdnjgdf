"use client";

import { useState } from "react";
import { X, Calendar, Tag, User, Flag, Clock, MessageSquare, Trash2, Edit2 } from "lucide-react";
import { Task, Priority, TaskStatus } from "@/lib/types";
import { mockColumns, mockUsers } from "@/lib/data/mock-data";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const priorityConfig: Record<Priority, { color: string; bg: string; label: string }> = {
  low: { color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", label: "Low" },
  medium: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", label: "Medium" },
  high: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", label: "High" },
};

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: "To Do", color: "#64748b" },
  in_progress: { label: "In Progress", color: "#3b82f6" },
  done: { label: "Done", color: "#10b981" },
};

export function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  onUpdate,
  onDelete,
}: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  if (!isOpen || !task) return null;

  const currentTask = editedTask || task;
  const priority = priorityConfig[currentTask.priority];
  const status = statusConfig[currentTask.status];
  const column = mockColumns.find((c) => c.id === currentTask.columnId);
  const assignee = currentTask.assigneeId
    ? mockUsers.find((u) => u.id === currentTask.assigneeId)
    : null;

  const handleSave = () => {
    if (editedTask && onUpdate) {
      onUpdate(editedTask);
    }
    setIsEditing(false);
    setEditedTask(null);
  };

  const handleDelete = () => {
    if (onDelete && confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 modal-overlay" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl glass-card rounded-2xl animate-fade-in max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-background/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <span
              className="px-2 py-1 rounded-lg text-xs font-medium"
              style={{ backgroundColor: priority.bg, color: priority.color }}
            >
              {priority.label} Priority
            </span>
            <span
              className="px-2 py-1 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: `${status.color}20`,
                color: status.color,
              }}
            >
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => {
                    setEditedTask(task);
                    setIsEditing(true);
                  }}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleSave}
                className="btn-primary text-sm py-1.5 px-3"
              >
                Save
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editedTask?.title || ""}
                onChange={(e) =>
                  setEditedTask((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                className="input-glass text-xl font-semibold"
              />
            ) : (
              <h2 className="text-2xl font-bold">{currentTask.title}</h2>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-2">
              Description
            </label>
            {isEditing ? (
              <textarea
                value={editedTask?.description || ""}
                onChange={(e) =>
                  setEditedTask((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                rows={4}
                className="input-glass resize-none"
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-foreground-muted">
                {currentTask.description || "No description provided."}
              </p>
            )}
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Column */}
            <div className="glass rounded-xl p-4">
              <label className="block text-sm font-medium text-foreground-muted mb-2">
                Column
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column?.color || "#64748b" }}
                />
                <span className="font-medium">{column?.title || "Unknown"}</span>
              </div>
            </div>

            {/* Assignee */}
            <div className="glass rounded-xl p-4">
              <label className="block text-sm font-medium text-foreground-muted mb-2 flex items-center gap-1">
                <User className="w-4 h-4" />
                Assignee
              </label>
              {assignee ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-medium">
                    {assignee.avatar}
                  </div>
                  <span className="font-medium">{assignee.name}</span>
                </div>
              ) : (
                <span className="text-foreground-muted">Unassigned</span>
              )}
            </div>

            {/* Due Date */}
            <div className="glass rounded-xl p-4">
              <label className="block text-sm font-medium text-foreground-muted mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due Date
              </label>
              {currentTask.dueDate ? (
                <span className="font-medium">
                  {new Date(currentTask.dueDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              ) : (
                <span className="text-foreground-muted">No due date</span>
              )}
            </div>

            {/* Created */}
            <div className="glass rounded-xl p-4">
              <label className="block text-sm font-medium text-foreground-muted mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Created
              </label>
              <span className="font-medium">
                {new Date(currentTask.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Tags */}
          {currentTask.tags && currentTask.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-2 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {currentTask.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section Placeholder */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comments
            </h3>
            <div className="glass rounded-xl p-4">
              <textarea
                placeholder="Add a comment..."
                rows={2}
                className="input-glass resize-none mb-3"
              />
              <div className="flex justify-end">
                <button className="btn-primary text-sm">Post Comment</button>
              </div>
            </div>
            <p className="text-sm text-foreground-muted text-center mt-4">
              No comments yet. Be the first to comment!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
