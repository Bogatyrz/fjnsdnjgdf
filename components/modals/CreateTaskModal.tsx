"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag, User, Flag, Repeat, Loader2 } from "lucide-react";
import { Priority, CreateTaskForm } from "@/lib/types";
import { mockColumns, mockUsers } from "@/lib/data/mock-data";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultColumnId?: string;
  onCreate?: (task: CreateTaskForm & { recurrence?: "daily" | "weekly" | "monthly" | null }) => void;
}

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "#10b981" },
  { value: "medium", label: "Medium", color: "#f59e0b" },
  { value: "high", label: "High", color: "#ef4444" },
];

const recurrenceOptions = [
  { value: null, label: "No repeat", icon: X },
  { value: "daily", label: "Daily", icon: Repeat },
  { value: "weekly", label: "Weekly", icon: Calendar },
  { value: "monthly", label: "Monthly", icon: Calendar },
];

export function CreateTaskModal({ isOpen, onClose, defaultColumnId, onCreate }: CreateTaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskForm>({
    title: "",
    description: "",
    columnId: defaultColumnId || "col_daily",
    priority: "medium",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [recurrence, setRecurrence] = useState<"daily" | "weekly" | "monthly" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      if (onCreate) {
        await onCreate({ ...formData, recurrence });
      }
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        columnId: defaultColumnId || "col_daily",
        priority: "medium",
        tags: [],
      });
      setRecurrence(null);
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
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
          className="relative w-full max-w-lg glass-card rounded-2xl max-h-[90vh] overflow-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-background/80 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">Create New Task</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What needs to be done?"
                className="input-glass"
                required
                autoFocus
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add more details..."
                rows={3}
                className="input-glass resize-none"
              />
            </motion.div>

            {/* Column & Priority Row */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {/* Column Select */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-1">
                    <Flag className="w-4 h-4" />
                    Column
                  </span>
                </label>
                <select
                  value={formData.columnId}
                  onChange={(e) => setFormData({ ...formData, columnId: e.target.value })}
                  className="input-glass"
                >
                  {mockColumns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title} {col.locked ? "🔒" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Select */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-1">
                    <Flag className="w-4 h-4" />
                    Priority
                  </span>
                </label>
                <div className="flex gap-2">
                  {priorities.map((p) => (
                    <motion.button
                      key={p.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData({ ...formData, priority: p.value })}
                      className={`
                        flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                        ${formData.priority === p.value
                          ? "text-white shadow-lg"
                          : "bg-white/5 text-foreground-muted hover:bg-white/10"
                        }
                      `}
                      style={{
                        backgroundColor:
                          formData.priority === p.value ? `${p.color}40` : undefined,
                        borderColor: formData.priority === p.value ? p.color : undefined,
                        border: "1px solid",
                        borderColor: formData.priority === p.value ? `${p.color}60` : "transparent",
                        boxShadow: formData.priority === p.value ? `0 0 20px ${p.color}40` : undefined,
                      }}
                    >
                      {p.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recurrence */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-1">
                  <Repeat className="w-4 h-4" />
                  Repeat
                </span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {recurrenceOptions.map((option) => (
                  <motion.button
                    key={option.label}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRecurrence(option.value as typeof recurrence)}
                    className={`
                      flex flex-col items-center gap-1 p-3 rounded-xl text-sm transition-all
                      ${recurrence === option.value
                        ? "bg-purple-500/20 border border-purple-500/50 text-purple-400"
                        : "glass-hover border border-transparent"
                      }
                    `}
                  >
                    <option.icon className="w-4 h-4" />
                    <span className="text-xs">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Assignee */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Assignee
                </span>
              </label>
              <div className="flex gap-2 flex-wrap">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                    ?
                  </div>
                  Unassigned
                </motion.button>
                {mockUsers.map((user) => (
                  <motion.button
                    key={user.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-purple-500/20 hover:border-purple-500/30 transition-all text-sm border border-transparent"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs">
                      {user.avatar}
                    </div>
                    {user.name.split(" ")[0]}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Due Date */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due Date
                </span>
              </label>
              <input
                type="date"
                className="input-glass"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: e.target.valueAsDate || undefined,
                  })
                }
              />
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium mb-2">
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Tags
                </span>
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                <AnimatePresence>
                  {formData.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="input-glass flex-1"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addTag}
                  className="btn-secondary"
                >
                  Add
                </motion.button>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex justify-end gap-3 pt-4 border-t border-white/10"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center gap-2"
                disabled={!formData.title.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
