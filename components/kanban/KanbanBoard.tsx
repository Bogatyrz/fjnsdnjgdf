"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Task, Column } from "@/lib/types";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { TaskDetailsModal } from "../modals/TaskDetailsModal";
import { CelebrationModal } from "../modals/CelebrationModal";
import { DoneModal, NotTodayModal, FailureModal } from "../modals/TaskActionModals";
import { CreateTaskModal } from "../modals/CreateTaskModal";
import { Lock, AlertCircle, Plus, Loader2 } from "lucide-react";
import { useAllTasks, useMoveTask, useUpdateTask, useDeleteTask, useMarkTaskDone, useSkipTask, useHandleRecurrence, useCreateTask } from "@/lib/hooks/useTasks";
import { useAllColumns } from "@/lib/hooks/useColumns";
import { useDashboardStats } from "@/lib/hooks/useAnalytics";

// Strict mode drag drop context wrapper
function StrictModeDroppable({ children, ...props }: React.ComponentProps<typeof Droppable>) {
  return (
    <Droppable {...props}>
      {(provided, snapshot) => children(provided, snapshot)}
    </Droppable>
  );
}

export function KanbanBoard() {
  // Convex queries
  const columnsData = useAllColumns();
  const tasksData = useAllTasks();
  const stats = useDashboardStats();
  
  // Convex mutations
  const moveTask = useMoveTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const markTaskDone = useMarkTaskDone();
  const skipTask = useSkipTask();
  const handleRecurrence = useHandleRecurrence();
  const createTask = useCreateTask();

  // Local state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [celebrationTask, setCelebrationTask] = useState<Task | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: "done" | "not_today" | "failure" | null;
    task: Task | null;
  }>({ type: null, task: null });
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [memeMode, setMemeMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskColumnId, setCreateTaskColumnId] = useState<string>("");

  // Sync Convex data with local state
  useEffect(() => {
    if (tasksData !== undefined) {
      setTasks(tasksData as Task[]);
      setIsLoading(false);
    }
  }, [tasksData]);

  useEffect(() => {
    if (columnsData !== undefined) {
      setColumns((columnsData as Column[]).sort((a, b) => a.order - b.order));
    }
  }, [columnsData]);

  // Get Daily BASE column
  const dailyBaseColumn = useMemo(() => 
    columns.find((col) => col.type === "daily" && col.locked),
    [columns]
  );

  // Handle drag end
  const handleDragEnd = useCallback(async (result: DropResult) => {
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

    // Check Daily BASE restrictions - prevent dragging OUT of Daily BASE if locked
    if (sourceColumn?.type === "daily" && sourceColumn?.locked && destination.droppableId !== source.droppableId) {
      setShowWarning("Daily BASE column is locked - tasks cannot be moved out!");
      setTimeout(() => setShowWarning(null), 3000);
      return;
    }

    // Check if trying to drop into Daily BASE
    if (destColumn?.type === "daily" && destColumn?.locked) {
      setShowWarning("Task moved to Daily BASE - this is today's focus!");
      setTimeout(() => setShowWarning(null), 3000);
    }

    // Optimistically update local state
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

    // Call Convex mutation
    try {
      await moveTask({
        taskId: draggableId as any,
        targetColumnId: destination.droppableId as any,
        newOrder: destination.index,
      });

      // If moved to Done column, show celebration
      if (destination.droppableId === "col_done" && source.droppableId !== "col_done") {
        setTimeout(() => {
          setCelebrationTask(task);
        }, 300);
      }
    } catch (error) {
      console.error("Failed to move task:", error);
      // Revert on error
      setTasks(tasksData as Task[]);
    }
  }, [tasks, columns, moveTask, tasksData]);

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

  const handleTaskUpdate = useCallback(async (updatedTask: Task) => {
    try {
      await updateTask({
        taskId: updatedTask.id as any,
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        status: updatedTask.status,
        dueDate: updatedTask.dueDate,
        tags: updatedTask.tags,
        columnId: updatedTask.columnId as any,
        assigneeId: updatedTask.assigneeId as any,
      });
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }, [updateTask]);

  const handleTaskDelete = useCallback(async (taskId: string) => {
    try {
      await deleteTask({ taskId: taskId as any });
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }, [deleteTask]);

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

  const handleDoneConfirm = useCallback(async (recurrence?: string) => {
    if (actionModal.task) {
      try {
        // Mark task as done
        await markTaskDone({ taskId: actionModal.task.id as any });
        
        // Handle recurrence if selected
        if (recurrence && recurrence !== "none") {
          await handleRecurrence({
            taskId: actionModal.task.id as any,
            recurrenceType: recurrence as "daily" | "weekly" | "monthly",
          });
        }
        
        // Show celebration
        setCelebrationTask(actionModal.task);
        setActionModal({ type: null, task: null });
      } catch (error) {
        console.error("Failed to complete task:", error);
      }
    }
  }, [actionModal.task, markTaskDone, handleRecurrence]);

  const handleNotTodayConfirm = useCallback(async (reason?: string) => {
    if (actionModal.task) {
      try {
        await skipTask({
          taskId: actionModal.task.id as any,
          reason: reason || "Postponed",
        });
        setActionModal({ type: null, task: null });
      } catch (error) {
        console.error("Failed to skip task:", error);
      }
    }
  }, [actionModal.task, skipTask]);

  const handleFailureConfirm = useCallback(async (reason?: string) => {
    if (actionModal.task) {
      // Keep task in current state but could log the issue
      setActionModal({ type: null, task: null });
    }
  }, [actionModal.task]);

  const handleCreateTask = useCallback(async (taskData: {
    title: string;
    description: string;
    columnId: string;
    priority: "low" | "medium" | "high";
    dueDate?: Date;
    tags: string[];
    assigneeId?: string;
    recurrence?: "daily" | "weekly" | "monthly" | null;
  }) => {
    try {
      await createTask({
        title: taskData.title,
        description: taskData.description,
        columnId: taskData.columnId,
        priority: taskData.priority,
        dueDate: taskData.dueDate?.getTime(),
        tags: taskData.tags,
        assigneeId: taskData.assigneeId,
      });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }, [createTask]);

  const openCreateTaskModal = useCallback((columnId: string) => {
    setCreateTaskColumnId(columnId);
    setIsCreateTaskOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
          {columns.map((column, columnIndex) => {
            const columnTasks = tasks
              .filter((task) => task.columnId === column.id)
              .sort((a, b) => {
                // Auto-sort by deadline within column
                if (a.dueDate && b.dueDate) {
                  return a.dueDate - b.dueDate;
                }
                return a.order - b.order;
              });

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
                        <motion.span 
                          key={columnTasks.length}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-xs text-foreground-muted bg-white/5 px-2 py-0.5 rounded-full"
                        >
                          {columnTasks.length}
                        </motion.span>
                        {isDailyBase && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400"
                            title="Daily BASE column - resets daily"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Tasks Container */}
                    <div className="flex-1 p-3 space-y-2 overflow-y-auto min-h-[100px]">
                      <AnimatePresence mode="popLayout">
                        {columnTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                            isDragDisabled={isDailyBase && column.locked}
                          >
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
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
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}

                      {/* Empty State */}
                      <AnimatePresence>
                        {columnTasks.length === 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-8 text-foreground-muted text-sm"
                          >
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="text-2xl mb-2"
                            >
                              📝
                            </motion.div>
                            <p>No tasks yet</p>
                            <p className="text-xs mt-1">Drag tasks here</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Add Task Button */}
                    <div className="p-3 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openCreateTaskModal(column.id)}
                        className={`
                          w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                          text-sm font-medium transition-all
                          ${isDailyBase
                            ? "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                            : "glass-hover text-foreground-muted hover:text-foreground"
                          }
                        `}
                      >
                        <Plus className="w-4 h-4" />
                        Add Task
                      </motion.button>
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
            whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.98 }}
            className="shrink-0 w-72 h-full min-h-[200px] rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center group"
          >
            <div className="text-center">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-2 group-hover:bg-white/10 transition-colors"
                whileHover={{ rotate: 90 }}
              >
                <Plus className="w-6 h-6 text-foreground-muted" />
              </motion.div>
              <span className="text-sm text-foreground-muted">Add Column</span>
            </div>
          </motion.button>
        </div>
      </DragDropContext>

      {/* Warning Toast */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50"
          >
            <motion.div 
              className="glass-card rounded-xl px-6 py-3 flex items-center gap-3 bg-amber-500/10 border-amber-500/30"
              animate={{ x: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span className="text-sm">{showWarning}</span>
            </motion.div>
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
        streak={stats?.streak || 0}
        totalCompleted={stats?.tasksCompleted || 0}
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

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        defaultColumnId={createTaskColumnId}
        onCreate={handleCreateTask}
      />
    </>
  );
}
