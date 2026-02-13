"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  Plus,
  Calendar,
  Command,
  Sparkles,
  Loader2,
} from "lucide-react";
import { CreateTaskModal } from "./modals/CreateTaskModal";
import { useCreateTask } from "@/lib/hooks/useTasks";
import { useAllColumns } from "@/lib/hooks/useColumns";
import { CreateTaskForm } from "@/lib/types";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function Topbar({ onMenuClick, sidebarOpen }: TopbarProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Task 'Design Review' is due today", time: "2h ago", unread: true },
    { id: 2, text: "Sarah completed 'API Documentation'", time: "4h ago", unread: true },
    { id: 3, text: "New team member joined", time: "1d ago", unread: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Convex
  const createTask = useCreateTask();
  const columns = useAllColumns();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleCreateTask = async (taskData: CreateTaskForm & { recurrence?: string | null }) => {
    try {
      // Find Daily BASE column as default
      const dailyBaseColumn = columns?.find(c => c.type === "daily");
      const targetColumnId = taskData.columnId || dailyBaseColumn?._id;

      if (!targetColumnId) {
        console.error("No column found for task");
        return;
      }

      await createTask({
        title: taskData.title,
        description: taskData.description,
        columnId: targetColumnId,
        priority: taskData.priority,
        dueDate: taskData.dueDate?.getTime(),
        tags: taskData.tags,
        assigneeId: taskData.assigneeId as any,
      });
      
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-16 glass-panel border-b-0 border-l-0 border-r-0 flex items-center justify-between px-4 lg:px-6"
      >
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="w-5 h-5 text-foreground-muted" />
          </motion.button>

          {/* Search Bar */}
          <motion.div
            animate={{
              width: searchFocused ? 320 : 256,
              boxShadow: searchFocused
                ? "0 0 0 2px rgba(139, 92, 246, 0.3)"
                : "none",
            }}
            className="hidden md:flex items-center gap-2 glass rounded-lg px-3 py-2"
          >
            <Search className="w-4 h-4 text-foreground-subtle" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground-subtle w-full"
            />
            <motion.kbd
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 text-xs text-foreground-muted"
            >
              <Command className="w-3 h-3" />
              <span>K</span>
            </motion.kbd>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Date Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:flex items-center gap-2 text-sm text-foreground-muted"
          >
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </motion.div>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground-muted" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 rounded-full bg-pink-500/50"
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`
                          p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer
                          ${notification.unread ? "bg-purple-500/5" : ""}
                        `}
                      >
                        <p className="text-sm">{notification.text}</p>
                        <p className="text-xs text-foreground-muted mt-1">{notification.time}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-white/10">
                    <button className="w-full text-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Create Task Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
            >
              <Plus className="w-4 h-4" />
            </motion.div>
            <span className="hidden sm:inline">New Task</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </>
  );
}
