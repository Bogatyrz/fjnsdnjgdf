"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag, User, Flag, Clock, MessageSquare, Trash2, Edit2, CheckCircle2, Loader2 } from "lucide-react";
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

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode }> = {
  todo: { label: "To Do", color: "#64748b", icon: <Clock className="w-4 h-4" /> },
  in_progress: { label: "In Progress", color: "#3b82f6", icon: <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /> },
  done: { label: "Done", color: "#10b981", icon: <CheckCircle2 className="w-4 h-4" /> },
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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !task) return null;

  const currentTask = editedTask || task;
  const priority = priorityConfig[currentTask.priority];
  const status = statusConfig[currentTask.status];
  const column = mockColumns.find((c) => c.id === currentTask.columnId);
  const assignee = currentTask.assigneeId
    ? mockUsers.find((u) => u.id === currentTask.assigneeId)
    : null;

  const handleSave = async () => {
    if (editedTask && onUpdate) {
      setIsSaving(true);
      try {
        await onUpdate(editedTask);
        setIsEditing(false);
        setEditedTask(null);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async () => {
    if (onDelete && confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    const updated = { ...currentTask, status: newStatus };
    setEditedTask(updated);
    if (onUpdate) {
      onUpdate(updated);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 modal-overlay"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl glass-card rounded-2xl max-h-[90vh] overflow-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-background/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 rounded-lg text-xs font-medium"
                style={{ backgroundColor: priority.bg, color: priority.color }}
              >
                {priority.label} Priority
              </motion.span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                style={{
                  backgroundColor: `${status.color}20`,
                  color: status.color,
                }}
              >
                {status.icon}
                {status.label}
              </motion.span>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setEditedTask(task);
                      setIsEditing(true);
                    }}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary text-sm py-1.5 px-3 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
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
            </motion.div>

            {/* Quick Status Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex gap-2"
            >
              {(Object.keys(statusConfig) as TaskStatus[]).map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStatusChange(s)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                    ${currentTask.status === s
                      ? "text-white shadow-lg"
                      : "bg-white/5 text-foreground-muted hover:bg-white/10"
                    }
                  `}
                  style={{
                    backgroundColor: currentTask.status === s ? `${statusConfig[s].color}40` : undefined,
                    border: "1px solid",
                    borderColor: currentTask.status === s ? `${statusConfig[s].color}60` : "transparent",
                  }}
                >
                  {statusConfig[s].icon}
                  {statusConfig[s].label}
                </motion.button>
              ))}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
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
            </motion.div>

            {/* Meta Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="grid grid-cols-2 gap-4"
            >
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
                  {column?.locked && (
                    <span className="text-xs text-purple-400">🔒</span>
                  )}
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
                {isEditing ? (
                  <input
                    type="date"
                    className="input-glass text-sm py-1"
                    value={editedTask?.dueDate ? new Date(editedTask.dueDate).toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setEditedTask((prev) =>
                        prev ? { ...prev, dueDate: e.target.valueAsDate?.getTime() } : null
                      )
                    }
                  />
                ) : currentTask.dueDate ? (
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
            </motion.div>

            {/* Tags */}
            {(currentTask.tags && currentTask.tags.length > 0) || isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-foreground-muted mb-2 flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentTask.tags?.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-sm font-medium"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {/* Recurrence */}
            {currentTask.recurrence && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="glass rounded-xl p-4"
              >
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Recurrence
                </label>
                <div className="flex items-center gap-2 text-purple-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="font-medium capitalize">{currentTask.recurrence}</span>
                </div>
              </motion.div>
            )}

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-t border-white/10 pt-6"
            >
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
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary text-sm"
                  >
                    Post Comment
                  </motion.button>
                </div>
              </div>
              <p className="text-sm text-foreground-muted text-center mt-4">
                No comments yet. Be the first to comment!
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
