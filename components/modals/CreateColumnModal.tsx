"use client";

import { useState } from "react";
import { X, Palette } from "lucide-react";

interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function CreateColumnModal({ isOpen, onClose }: CreateColumnModalProps) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#8b5cf6");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Handle column creation (would connect to Convex here)
    console.log("Creating column:", { title, color: selectedColor });
    onClose();
    setTitle("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 modal-overlay" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card rounded-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Create New Column</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
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
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              <span className="flex items-center gap-1">
                <Palette className="w-4 h-4" />
                Color Theme
              </span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`
                    w-10 h-10 rounded-xl transition-all
                    ${selectedColor === color.value ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"}
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
            <p className="text-xs text-foreground-muted mt-2">
              Selected: {colorOptions.find((c) => c.value === selectedColor)?.label}
            </p>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium mb-2">Preview</label>
            <div
              className="glass rounded-xl p-4 border-l-4"
              style={{ borderLeftColor: selectedColor }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="font-medium">{title || "Column Title"}</span>
                <span className="text-xs text-foreground-muted bg-white/5 px-2 py-0.5 rounded-full">
                  0
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-white/5 rounded-lg" />
                <div className="h-8 bg-white/5 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="glass rounded-xl p-4 bg-amber-500/5 border-amber-500/20">
            <p className="text-sm text-foreground-muted">
              <strong className="text-amber-400">Note:</strong> The &quot;Daily BASE&quot; column is a special
              locked column that resets daily. Only one Daily BASE column can exist.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!title.trim()}>
              Create Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
