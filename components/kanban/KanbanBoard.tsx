"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Task, Column, DragItem } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { TaskDetailsModal } from "../modals/TaskDetailsModal";
import { CelebrationModal } from "../modals/CelebrationModal";
import { DoneModal, NotTodayModal, FailureModal } from "../modals/TaskActionModals";
import { mockColumns, mockTasks, mockUsers, getUserById } from "@/lib/data/mock-data";
import { Lock, AlertCircle } from "lucide-react";

// Strict mode drag drop context wrapper
function StrictModeDroppable({ children, ...props }: React.ComponentProps<typeof Droppable>) {
  return (
    <Droppable {...props}>
      {(provided, snapshot) => children(provided, snapshot)}
    </Droppable>
  );
}

export function KanbanBoard() {
  const [columns] = useState<Column[]>(mockColumns.sort((a, b) => a.order - b.order));
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [celebrationTask, setCelebrationTask] = useState<Task | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: "done" | "not_today" | "failure" | null;
    task: Task | null;
  }>({ type: null, task: null });
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [memeMode] = useState(true); // Could be loaded from user settings

  // Get Daily BASE column
  const dailyBaseColumn = useMemo(() => 
    columns.find((col) => col.type === "daily" && col.locked),
    [columns]
  );

  // Handle drag end
  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a droppable
    if (!destination) return;

    // Dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    const sourceColumn = columns.find((c) => c.id === source.droppableId);
    const destColumn = columns.find((c) => c.id === destination.droppableId);

    // Check Daily BASE restrictions
    if (destColumn?.type === "daily" && destColumn?.locked) {
      // Allow dropping into Daily BASE, but warn if not from allowed columns
      if (sourceColumn?.type !== "daily") {
        setShowWarning("Moving to Daily BASE - this will be your focus for today!");
        setTimeout(() => setShowWarning(null), 3000);
      }
    }

    // Prevent dragging OUT of Daily BASE if locked (optional restriction)
    if (sourceColumn?.type === "daily" && sourceColumn?.locked) {
      // Allow dragging out, but maybe show a confirmation
    }

    // Update task
    const newStatus = getStatusFromColumn(destination.droppableId);
    
    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggableId
          ? {
              ...t,
              columnId: destination.droppableId,
              status: newStatus,
              order: destination.index,
            }
          : t
      )
    );

    // If moved to Done column, show celebration
    if (destination.droppableId === "col_done" && source.droppableId !== "col_done") {
      setTimeout(() => {
        setCelebrationTask(task);
      }, 300);
    }
  }, [tasks, columns]);

  const getStatusFromColumn = (columnId: string): Task["status"] => {
    switch (columnId) {
      case "col_done":
        return "done";
      case "col_progress":
        return "in_progress";
      default:
        return "todo";
    }
  };

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(null);
  }, []);

  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTask(null);
  }, []);

  // Task action handlers
  const handleTaskDone = useCallback((task: Task) => {
    setActionModal({ type: "done", task });
  }, []);

  const handleTaskNotToday = useCallback((task: Task) => {
    setActionModal({ type: "not_today", task });
  }, []);

  const handleTaskFailure = useCallback((task: Task) => {
    setActionModal({ type: "failure", task });
  }, []);

  const handleDoneConfirm = useCallback((recurrence?: string) => {
    if (actionModal.task) {
      // Update task status
      setTasks((prev) =>
        prev.map((t) =>
          t.id === actionModal.task!.id
            ? { ...t, status: "done", columnId: "col_done" }
            : t
        )
      );
      
      // Show celebration
      setCelebrationTask(actionModal.task);
      setActionModal({ type: null, task: null });
    }
  }, [actionModal.task]);

  const handleNotTodayConfirm = useCallback((reason?: string) => {
    if (actionModal.task) {
      // Move task to backlog or update due date
      setTasks((prev) =>
        prev.map((t) =>
          t.id === actionModal.task!.id
            ? { ...t, dueDate: Date.now() + 86400000 } // Tomorrow
            : t
        )
      );
      setActionModal({ type: null, task: null });
    }
  }, [actionModal.task]);

  const handleFailureConfirm = useCallback((reason?: string) => {
    if (actionModal.task) {
      // Keep task in current state but log the issue
      setActionModal({ type: null, task: null });
    }
  }, [actionModal.task]);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
          {columns.map((column, columnIndex) => {
            const columnTasks = tasks
              .filter((task) => task.columnId === column.id)
              .sort((a, b) => a.order - b.order)
              .map((task) => ({
                ...task,
                assignee: task.assigneeId ? getUserById(task.assigneeId) : undefined,
              }));

            const isDailyBase = column.type === "daily" && column.locked;

            return (
              <StrictModeDroppable droppableId={column.id} key={column.id}>
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: columnIndex * 0.1 }}
                    className={`
                      shrink-0 w-72 flex flex-col max-h-full rounded-2xl
                      ${isDailyBase ? "column-daily-base ring-2 ring-purple-500/30" : "glass-card"}
                      ${snapshot.isDraggingOver ? "ring-2 ring-purple-500/50 bg-purple-500/5" : ""}
                      transition-all duration-200
                    `}
                  >
                    {/* Column Header */}
                    <div
                      className={`
                        p-4 border-b border-white/10 flex items-center justify-between
                        ${isDailyBase ? "rounded-t-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10" : ""}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: column.color || "#64748b" }}
                        />
                        <h3 className="font-semibold">{column.title}</h3>
                        <span className="text-xs text-foreground-muted bg-white/5 px-2 py-0.5 rounded-full">
                          {columnTasks.length}
                        </span>
                        {isDailyBase && (
                          <div
                            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400"
                            title="Daily BASE column - resets daily"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tasks Container */}
                    <div className="flex-1 p-3 space-y-2 overflow-y-auto min-h-[100px]">
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                          isDragDisabled={false}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                            >
                              <KanbanTaskCard
                                task={task}
                                index={index}
                                columnId={column.id}
                                onClick={() => handleTaskClick(task)}
                                isDragging={snapshot.isDragging}
                                onDone={() => handleTaskDone(task)}
                                onNotToday={() => handleTaskNotToday(task)}
                                onFailure={() => handleTaskFailure(task)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty State */}
                      {columnTasks.length === 0 && (
                        <div className="text-center py-8 text-foreground-muted text-sm">
                          <p>No tasks yet</p>
                          <p className="text-xs mt-1">Drag tasks here</p>
                        </div>
                      )}
                    </div>

                    {/* Add Task Button */}
                    <div className="p-3 border-t border-white/10">
                      <button
                        className={`
                          w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                          text-sm font-medium transition-all
                          ${isDailyBase
                            ? "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                            : "glass-hover text-foreground-muted hover:text-foreground"
                          }
                        `}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Task
                      </button>
                    </div>
                  </motion.div>
                )}
              </StrictModeDroppable>
            );
          })}

          {/* Add Column Placeholder */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: columns.length * 0.1 }}
            className="shrink-0 w-72 h-full min-h-[200px] rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center group"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-2 group-hover:bg-white/10 transition-colors">
                <svg
                  className="w-6 h-6 text-foreground-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm text-foreground-muted">Add Column</span>
            </div>
          </motion.button>
        </div>
      </DragDropContext>

      {/* Warning Toast */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="glass-card rounded-xl px-6 py-3 flex items-center gap-3 bg-amber-500/10 border-amber-500/30">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span className="text-sm">{showWarning}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={!!celebrationTask}
        onClose={() => setCelebrationTask(null)}
        taskTitle={celebrationTask?.title || ""}
        streak={3} // Would come from analytics
        totalCompleted={12}
        mode={memeMode ? "meme" : "default"}
      />

      {/* Action Modals */}
      <DoneModal
        isOpen={actionModal.type === "done"}
        onClose={() => setActionModal({ type: null, task: null })}
        task={actionModal.task}
        onConfirm={handleDoneConfirm}
      />

      <NotTodayModal
        isOpen={actionModal.type === "not_today"}
        onClose={() => setActionModal({ type: null, task: null })}
        task={actionModal.task}
        onConfirm={handleNotTodayConfirm}
      />

      <FailureModal
        isOpen={actionModal.type === "failure"}
        onClose={() => setActionModal({ type: null, task: null })}
        task={actionModal.task}
        onConfirm={handleFailureConfirm}
      />
    </>
  );
}
