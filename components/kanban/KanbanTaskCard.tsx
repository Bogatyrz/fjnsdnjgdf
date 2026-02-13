"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Task, Priority, TaskStatus } from "@/lib/types";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, MoreHorizontal } from "lucide-react";

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
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.2,
        layout: { duration: 0.2 }
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.15 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        glass rounded-xl p-3 cursor-pointer group relative
        transition-colors duration-200
        ${isDragging ? "opacity-50 rotate-2" : ""}
        ${isOverdue ? "border-l-2 border-l-red-500" : ""}
        ${isDailyBase ? "bg-purple-500/5 hover:bg-purple-500/10" : "hover:bg-white/5"}
      `}
    >
      {/* Priority Indicator Bar */}
      <motion.div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
        style={{ backgroundColor: priority.color }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: index * 0.05 + 0.1 }}
      />

      {/* Quick Actions Overlay */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: showActions ? 1 : 0,
          y: showActions ? 0 : 10
        }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {onDone && (
          <motion.button
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDone();
            }}
            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
            title="Mark as Done"
          >
            <CheckCircle className="w-5 h-5" />
          </motion.button>
        )}
        {onNotToday && (
          <motion.button
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onNotToday();
            }}
            className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
            title="Not Today"
          >
            <Clock className="w-5 h-5" />
          </motion.button>
        )}
        {onFailure && (
          <motion.button
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onFailure();
            }}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            title="Having Trouble"
          >
            <AlertCircle className="w-5 h-5" />
          </motion.button>
        )}
        <motion.button
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="p-2 rounded-lg bg-white/10 text-foreground hover:bg-white/20 transition-colors"
          title="Open Details"
        >
          <MoreHorizontal className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Content */}
      <div className="pl-3">
        {/* Priority & Tags */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.1 }}
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: priority.bg,
              color: priority.color,
            }}
          >
            {priority.label}
          </motion.span>

          {task.tags?.slice(0, 2).map((tag, tagIndex) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.15 + tagIndex * 0.05 }}
              className="text-xs text-foreground-muted bg-white/5 px-2 py-0.5 rounded-full"
            >
              {tag}
            </motion.span>
          ))}

          {task.tags && task.tags.length > 2 && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-foreground-muted"
            >
              +{task.tags.length - 2}
            </motion.span>
          )}
        </div>

        {/* Title */}
        <motion.h4 
          className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          {task.title}
        </motion.h4>

        {/* Description Preview */}
        {task.description && (
          <motion.p 
            className="text-xs text-foreground-muted line-clamp-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.15 }}
          >
            {task.description}
          </motion.p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Left: Due Date & Status */}
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
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
              </motion.div>
            )}

            {task.status === "in_progress" && (
              <motion.div 
                className="flex items-center gap-1 text-xs text-blue-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Clock className="w-3 h-3" />
                <span>Active</span>
              </motion.div>
            )}
          </div>

          {/* Right: Assignee */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.25 }}
          >
            {task.assignee ? (
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-medium"
                title={task.assignee.name}
                whileHover={{ scale: 1.2 }}
              >
                {task.assignee.avatar}
              </motion.div>
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
          </motion.div>
        </div>

        {/* Recurrence Indicator */}
        {task.recurrence && (
          <motion.div 
            className="mt-2 flex items-center gap-1 text-xs text-purple-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.3 }}
          >
            <motion.svg 
              className="w-3 h-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </motion.svg>
            <span className="capitalize">{task.recurrence}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
