"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Plus, Filter, MoreHorizontal } from "lucide-react";
import { CreateColumnModal } from "@/components/modals/CreateColumnModal";

export default function KanbanPage() {
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Kanban Board</h1>
          <p className="text-foreground-muted">
            Drag and drop tasks to organize your workflow
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>

          {/* More Options */}
          <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* Add Column */}
          <button
            onClick={() => setIsCreateColumnOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Column</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (collapsible) */}
      {filterOpen && (
        <div className="glass-card rounded-xl p-4 mb-4 animate-fade-in">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-xs text-foreground-muted mb-1 block">Priority</label>
              <select className="input-glass text-sm py-2">
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-foreground-muted mb-1 block">Assignee</label>
              <select className="input-glass text-sm py-2">
                <option value="">All Assignees</option>
                <option value="user_1">Alex Rivera</option>
                <option value="user_2">Sarah Chen</option>
                <option value="user_3">Jordan Smith</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-foreground-muted mb-1 block">Due Date</label>
              <select className="input-glass text-sm py-2">
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>

      {/* Create Column Modal */}
      <CreateColumnModal
        isOpen={isCreateColumnOpen}
        onClose={() => setIsCreateColumnOpen(false)}
      />
    </div>
  );
}
