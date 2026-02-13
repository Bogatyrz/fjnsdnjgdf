"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Task, Priority, TaskStatus } from "@/lib/types";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface KanbanTaskCardProps {
  task: Task;
  index: number;
  columnId: string;
  onClick: () => void;
  isDragging?: boolean;
  onDone?: () => void;
  onNotToday?: () => void;
  onFailure?: () => void;
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
  done: { label: "Done", icon: <CheckCircle className="w-3 h-3" /> },
};

export function KanbanTaskCard({
  task,
  index,
  columnId,
  onClick,
  isDragging,
  onDone,
  onNotToday,
  onFailure,
}: KanbanTaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  const priority = priorityConfig[task.priority];
  const isOverdue = task.dueDate && task.dueDate < Date.now();
  const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();
  const isDailyBase = columnId === "col_daily";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onClick}
      className={`
        glass rounded-xl p-3 cursor-pointer group relative
        hover:scale-[1.02] hover:bg-white/5
        transition-all duration-200
        ${isDragging ? "opacity-50 rotate-2" : ""}
        ${isOverdue ? "border-l-2 border-l-red-500" : ""}
        ${isDailyBase ? "bg-purple-500/5" : ""}
      `}
    >
      {/* Priority Indicator Bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
        style={{ backgroundColor: priority.color }}
      />

      {/* Quick Actions Overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: showActions ? 1 : 0 }}
        className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 z-10"
      >
        {onDone && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDone();
            }}
            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
            title="Mark as Done"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        )}
        {onNotToday && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNotToday();
            }}
            className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
            title="Not Today"
          >
            <Clock className="w-5 h-5" />
          </button>
        )}
        {onFailure && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFailure();
            }}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            title="Having Trouble"
          >
            <AlertCircle className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="p-2 rounded-lg bg-white/10 text-foreground hover:bg-white/20 transition-colors"
          title="Open Details"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </motion.div>

      {/* Content */}
      <div className="pl-3">
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

          {/* Right: Assignee */}
          <div className="flex items-center gap-2">
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

        {/* Recurrence Indicator */}
        {task.recurrence && (
          <div className="mt-2 flex items-center gap-1 text-xs text-purple-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="capitalize">{task.recurrence}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
