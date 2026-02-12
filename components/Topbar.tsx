"use client";

import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Plus,
  Calendar,
  Command,
} from "lucide-react";
import { CreateTaskModal } from "./modals/CreateTaskModal";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function Topbar({ onMenuClick, sidebarOpen }: TopbarProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <header className="h-16 glass-panel border-b-0 border-l-0 border-r-0 flex items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="w-5 h-5 text-foreground-muted" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 glass rounded-lg px-3 py-2 w-80">
            <Search className="w-4 h-4 text-foreground-subtle" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground-subtle w-full"
            />
            <kbd className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 text-xs text-foreground-muted">
              <Command className="w-3 h-3" />
              <span>K</span>
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Date Display */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-foreground-muted">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Bell className="w-5 h-5 text-foreground-muted" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          </button>

          {/* Create Task Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </header>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
