"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, Lock, Loader2 } from "lucide-react";

interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (column: { title: string; color: string; type: "daily" | "custom" }) => void;
}

const colorOptions = [
  { value: "#64748b", label: "Slate" },
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#84cc16", label: "Lime" },
  { value: "#10b981", label: "Green" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#d946ef", label: "Fuchsia" },
  { value: "#f43f5e", label: "Rose" },
  { value: "#ec4899", label: "Pink" },
];

export function CreateColumnModal({ isOpen, onClose, onCreate }: CreateColumnModalProps) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#8b5cf6");
  const [columnType, setColumnType] = useState<"daily" | "custom">("custom");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onCreate) {
        await onCreate({
          title: title.trim(),
          color: selectedColor,
          type: columnType,
        });
      }
      setTitle("");
      setSelectedColor("#8b5cf6");
      setColumnType("custom");
      onClose();
    } catch (error) {
      console.error("Failed to create column:", error);
    } finally {
      setIsSubmitting(false);
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
          className="relative w-full max-w-md glass-card rounded-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold">Create New Column</h2>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium mb-2">Column Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., In Review, Testing, Archive"
                className="input-glass"
                autoFocus
                required
              />
            </motion.div>

            {/* Column Type */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-medium mb-3">Column Type</label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setColumnType("custom")}
                  className={`
                    p-4 rounded-xl text-left transition-all
                    ${columnType === "custom"
                      ? "bg-purple-500/20 border border-purple-500/50"
                      : "glass-hover border border-transparent"
                    }
                  `}
                >
                  <div className="font-medium mb-1">Custom Column</div>
                  <div className="text-xs text-foreground-muted">Regular kanban column</div>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setColumnType("daily")}
                  className={`
                    p-4 rounded-xl text-left transition-all relative
                    ${columnType === "daily"
                      ? "bg-amber-500/20 border border-amber-500/50"
                      : "glass-hover border border-transparent"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="font-medium">Daily BASE</span>
                  </div>
                  <div className="text-xs text-foreground-muted">Resets daily, locked</div>
                </motion.button>
              </div>
            </motion.div>

            {/* Color Selection */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-3">
                <span className="flex items-center gap-1">
                  <Palette className="w-4 h-4" />
                  Color Theme
                </span>
              </label>
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.map((color, index) => (
                  <motion.button
                    key={color.value}
                    type="button"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + index * 0.03 }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(color.value)}
                    className={`
                      w-10 h-10 rounded-xl transition-all
                      ${selectedColor === color.value 
                        ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110" 
                        : "hover:scale-105"
                      }
                    `}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
              <p className="text-xs text-foreground-muted mt-2">
                Selected: {colorOptions.find((c) => c.value === selectedColor)?.label}
              </p>
            </motion.div>

            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium mb-2">Preview</label>
              <motion.div
                animate={{
                  borderColor: selectedColor,
                  boxShadow: `0 0 20px ${selectedColor}20`,
                }}
                className="glass rounded-xl p-4 border-l-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <motion.div
                    animate={{ backgroundColor: selectedColor }}
                    className="w-3 h-3 rounded-full"
                  />
                  <span className="font-medium">{title || "Column Title"}</span>
                  <span className="text-xs text-foreground-muted bg-white/5 px-2 py-0.5 rounded-full">
                    0
                  </span>
                  {columnType === "daily" && (
                    <span className="text-xs text-amber-400">🔒</span>
                  )}
                </div>
                <div className="space-y-2">
                  <motion.div
                    animate={{ backgroundColor: `${selectedColor}20` }}
                    className="h-8 rounded-lg"
                  />
                  <motion.div
                    animate={{ backgroundColor: `${selectedColor}10` }}
                    className="h-8 rounded-lg"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Note */}
            {columnType === "daily" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-xl p-4 bg-amber-500/5 border-amber-500/20"
              >
                <p className="text-sm text-foreground-muted">
                  <strong className="text-amber-400">Note:</strong> The &quot;Daily BASE&quot; column is a special
                  locked column that resets daily. Only one Daily BASE column can exist.
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
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
                disabled={!title.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Column"
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
