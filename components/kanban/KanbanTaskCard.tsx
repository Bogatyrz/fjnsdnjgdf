"use client";

import { useState } from "react";
import { Task, Priority, TaskStatus } from "@/lib/types";
import { Calendar, MessageSquare, Paperclip, Clock } from "lucide-react";

interface KanbanTaskCardProps {
  task: Task;
  index: number;
  columnId: string;
  onDragStart: (task: Task, sourceColumnId: string) => void;
  onDragEnd: () => void;
  onClick: () => void;
}

const priorityConfig: Record<Priority, { color: string; bg: string; label: string }> = {
  low: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.15)",
    label: "Low",
  },
  medium: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.15)",
    label: "Medium",
  },
  high: {
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.15)",
    label: "High",
  },
};

const statusConfig: Record<TaskStatus, { label: string; icon: React.ReactNode }> = {
  todo: { label: "To Do", icon: null },
  in_progress: { label: "In Progress", icon: <Clock className="w-3 h-3" /> },
  done: { label: "Done", icon: null },
};

export function KanbanTaskCard({
  task,
  index,
  columnId,
  onDragStart,
  onDragEnd,
  onClick,
}: KanbanTaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(task, columnId);
    e.dataTransfer.effectAllowed = "move";
    // Set a custom drag image if needed
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  const priority = priorityConfig[task.priority];
  const isOverdue = task.dueDate && task.dueDate < Date.now();
  const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={`
        glass rounded-xl p-3 cursor-pointer group
        hover:scale-[1.02] hover:bg-white/5
        transition-all duration-200
        ${isDragging ? "dragging" : ""}
      `}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Priority & Tags */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: priority.bg,
            color: priority.color,
          }}
        >
          {priority.label}
        </span>

        {task.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-xs text-foreground-muted bg-white/5 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}

        {task.tags && task.tags.length > 2 && (
          <span className="text-xs text-foreground-muted">
            +{task.tags.length - 2}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
        {task.title}
      </h4>

      {/* Description Preview */}
      {task.description && (
        <p className="text-xs text-foreground-muted line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Left: Due Date & Status */}
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-xs ${
                isOverdue
                  ? "text-red-400"
                  : isDueToday
                  ? "text-amber-400"
                  : "text-foreground-muted"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {task.status === "in_progress" && (
            <div className="flex items-center gap-1 text-xs text-blue-400">
              <Clock className="w-3 h-3" />
              <span>Active</span>
            </div>
          )}
        </div>

        {/* Right: Assignee & Meta */}
        <div className="flex items-center gap-2">
          {/* Meta counts (placeholder) */}
          <div className="flex items-center gap-1.5 text-foreground-muted">
            <MessageSquare className="w-3 h-3" />
            <span className="text-xs">2</span>
          </div>

          {/* Assignee Avatar */}
          {task.assignee ? (
            <div
              className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-medium"
              title={task.assignee.name}
            >
              {task.assignee.avatar}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-foreground-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
