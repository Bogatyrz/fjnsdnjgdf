"use client";

import { useState } from "react";
import { X, Calendar, Tag, User, Flag } from "lucide-react";
import { Priority, CreateTaskForm } from "@/lib/types";
import { mockColumns, mockUsers } from "@/lib/data/mock-data";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultColumnId?: string;
}

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "#10b981" },
  { value: "medium", label: "Medium", color: "#f59e0b" },
  { value: "high", label: "High", color: "#ef4444" },
];

export function CreateTaskModal({ isOpen, onClose, defaultColumnId }: CreateTaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskForm>({
    title: "",
    description: "",
    columnId: defaultColumnId || "col_daily",
    priority: "medium",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle task creation (would connect to Convex here)
    console.log("Creating task:", formData);
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 modal-overlay" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-card rounded-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              className="input-glass"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details..."
              rows={3}
              className="input-glass resize-none"
            />
          </div>

          {/* Column & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
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
                    {col.title}
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
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p.value })}
                    className={`
                      flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                      ${
                        formData.priority === p.value
                          ? "text-white"
                          : "bg-white/5 text-foreground-muted hover:bg-white/10"
                      }
                    `}
                    style={{
                      backgroundColor:
                        formData.priority === p.value ? `${p.color}40` : undefined,
                      borderColor: formData.priority === p.value ? p.color : undefined,
                      border: "1px solid",
                      borderColor: formData.priority === p.value ? `${p.color}60` : "transparent",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Assignee
              </span>
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                  ?
                </div>
                Unassigned
              </button>
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-purple-500/20 hover:border-purple-500/30 transition-all text-sm border border-transparent"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs">
                    {user.avatar}
                  </div>
                  {user.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
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
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Tags
              </span>
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
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
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
