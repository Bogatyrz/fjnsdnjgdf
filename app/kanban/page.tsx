"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Plus, Filter, MoreHorizontal, Sparkles, Loader2 } from "lucide-react";
import { CreateColumnModal } from "@/components/modals/CreateColumnModal";
import { useCreateColumn } from "@/lib/hooks/useColumns";

export default function KanbanPage() {
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{
    priority?: string;
    assignee?: string;
    dueDate?: string;
  }>({});

  const createColumn = useCreateColumn();

  const handleCreateColumn = async (column: { title: string; color: string; type: "daily" | "custom" }) => {
    try {
      await createColumn({
        title: column.title,
        color: column.color,
        type: column.type,
      });
      setIsCreateColumnOpen(false);
    } catch (error) {
      console.error("Failed to create column:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            Kanban Board
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.5 }}
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
            </motion.span>
          </h1>
          <p className="text-foreground-muted">
            Drag and drop tasks to organize your workflow
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterOpen(!filterOpen)}
            className={`
              btn-secondary flex items-center gap-2
              ${Object.keys(activeFilter).length > 0 ? "border-purple-500/50" : ""}
            `}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {Object.keys(activeFilter).length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 rounded-full bg-purple-400"
              />
            )}
          </motion.button>

          {/* More Options */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </motion.button>

          {/* Add Column */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateColumnOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              <Plus className="w-4 h-4" />
            </motion.div>
            <span className="hidden sm:inline">Column</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filter Bar (collapsible) */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="glass-card rounded-xl p-4 mb-4"
            >
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="text-xs text-foreground-muted mb-1 block">Priority</label>
                  <select
                    value={activeFilter.priority || ""}
                    onChange={(e) => setActiveFilter({ ...activeFilter, priority: e.target.value || undefined })}
                    className="input-glass text-sm py-2"
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-foreground-muted mb-1 block">Assignee</label>
                  <select
                    value={activeFilter.assignee || ""}
                    onChange={(e) => setActiveFilter({ ...activeFilter, assignee: e.target.value || undefined })}
                    className="input-glass text-sm py-2"
                  >
                    <option value="">All Assignees</option>
                    <option value="user_1">Alex Rivera</option>
                    <option value="user_2">Sarah Chen</option>
                    <option value="user_3">Jordan Smith</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-foreground-muted mb-1 block">Due Date</label>
                  <select
                    value={activeFilter.dueDate || ""}
                    onChange={(e) => setActiveFilter({ ...activeFilter, dueDate: e.target.value || undefined })}
                    className="input-glass text-sm py-2"
                  >
                    <option value="">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div className="ml-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveFilter({})}
                    className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                  >
                    Clear filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>

      {/* Create Column Modal */}
      <CreateColumnModal
        isOpen={isCreateColumnOpen}
        onClose={() => setIsCreateColumnOpen(false)}
        onCreate={handleCreateColumn}
      />
    </motion.div>
  );
}
