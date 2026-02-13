import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ==================== QUERIES ====================

/**
 * Get all tasks sorted by deadline (auto-sorting)
 */
export const getAll = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    
    // Sort by: 1. Due date (nulls last), 2. Priority (high > medium > low), 3. Order
    return tasks.sort((a, b) => {
      // First sort by due date
      if (a.dueDate && b.dueDate) {
        if (a.dueDate !== b.dueDate) {
          return a.dueDate - b.dueDate;
        }
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }
      
      // Then by priority
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      
      // Finally by order
      return a.order - b.order;
    });
  },
});

/**
 * Get tasks by column ID
 */
export const getByColumn = query({
  args: { columnId: v.id("columns") },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();
    
    // Sort by deadline within column
    return tasks.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate - b.dueDate;
      }
      return a.order - b.order;
    });
  },
});

/**
 * Get tasks for Today (Dashboard)
 */
export const getTodayTasks = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const now = Date.now();
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);
    
    const allTasks = await ctx.db.query("tasks").collect();
    
    // Get tasks that are:
    // 1. Due today
    // 2. In Daily BASE column
    // 3. Not done
    return allTasks.filter((task) => {
      const isDueToday = task.dueDate && task.dueDate >= startOfDay && task.dueDate <= endOfDay;
      const isDailyBase = task.columnId === "col_daily";
      const isNotDone = task.status !== "done";
      
      return (isDueToday || isDailyBase) && isNotDone;
    }).sort((a, b) => {
      // High priority first
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  },
});

/**
 * Get task by ID
 */
export const getById = query({
  args: { taskId: v.id("tasks") },
  returns: v.union(v.null(), v.any()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.taskId);
  },
});

/**
 * Get tasks by status
 */
export const getByStatus = query({
  args: { status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

/**
 * Get tasks by assignee
 */
export const getByAssignee = query({
  args: { assigneeId: v.id("users") },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_assignee", (q) => q.eq("assigneeId", args.assigneeId))
      .collect();
  },
});

/**
 * Get overdue tasks
 */
export const getOverdue = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const now = Date.now();
    const allTasks = await ctx.db.query("tasks").collect();
    
    return allTasks.filter(
      (task) => task.dueDate && task.dueDate < now && task.status !== "done"
    );
  },
});

// ==================== MUTATIONS ====================

/**
 * Create a new task
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    columnId: v.id("columns"),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    status: v.optional(v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done"))),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    assigneeId: v.optional(v.id("users")),
  },
  returns: v.id("tasks"),
  handler: async (ctx, args) => {
    // Get current user (mock for now)
    const createdBy = "user_1";
    
    // Calculate order (append to end of column)
    const columnTasks = await ctx.db
      .query("tasks")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();
    
    const maxOrder = columnTasks.length > 0
      ? Math.max(...columnTasks.map((t) => t.order))
      : -1;
    
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      columnId: args.columnId,
      priority: args.priority,
      status: args.status || "todo",
      dueDate: args.dueDate,
      tags: args.tags || [],
      assigneeId: args.assigneeId,
      order: maxOrder + 1,
      createdAt: Date.now(),
      createdBy,
    });
    
    // Add to history
    await ctx.db.insert("taskHistory", {
      taskId,
      action: "created",
      performedBy: createdBy as Id<"users">,
      performedAt: Date.now(),
    });
    
    // Update analytics
    await updateAnalytics(ctx, "created");
    
    return taskId;
  },
});

/**
 * Update a task
 */
export const update = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    columnId: v.optional(v.id("columns")),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    status: v.optional(v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done"))),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    assigneeId: v.optional(v.union(v.id("users"), v.null())),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { taskId, ...updates } = args;
    const createdBy = "user_1";
    
    // Get existing task
    const existingTask = await ctx.db.get(taskId);
    if (!existingTask) return false;
    
    // Handle column change (move)
    if (updates.columnId && updates.columnId !== existingTask.columnId) {
      await ctx.db.insert("taskHistory", {
        taskId,
        action: "moved",
        fromColumnId: existingTask.columnId,
        toColumnId: updates.columnId,
        performedBy: createdBy as Id<"users">,
        performedAt: Date.now(),
      });
      
      await updateAnalytics(ctx, "moved");
    } else {
      await ctx.db.insert("taskHistory", {
        taskId,
        action: "updated",
        performedBy: createdBy as Id<"users">,
        performedAt: Date.now(),
      });
    }
    
    // Handle status change to done
    if (updates.status === "done" && existingTask.status !== "done") {
      await updateAnalytics(ctx, "completed");
    }
    
    // Clean up null assignee
    const cleanUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }
    
    if (updates.assigneeId === null) {
      cleanUpdates.assigneeId = undefined;
    }
    
    await ctx.db.patch(taskId, cleanUpdates);
    return true;
  },
});

/**
 * Move task to different column (drag & drop)
 */
export const move = mutation({
  args: {
    taskId: v.id("tasks"),
    targetColumnId: v.id("columns"),
    newOrder: v.optional(v.number()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const createdBy = "user_1";
    
    const task = await ctx.db.get(args.taskId);
    if (!task) return false;
    
    // Check if Daily BASE column is locked
    const targetColumn = await ctx.db.get(args.targetColumnId);
    if (targetColumn?.type === "daily" && targetColumn?.locked) {
      // Allow but log - Daily BASE logic handled separately
    }
    
    const updates: Record<string, unknown> = {
      columnId: args.targetColumnId,
    };
    
    // Update status based on column
    if (args.targetColumnId === "col_done") {
      updates.status = "done";
      await updateAnalytics(ctx, "completed");
    } else if (args.targetColumnId === "col_progress") {
      updates.status = "in_progress";
    } else {
      updates.status = "todo";
    }
    
    if (args.newOrder !== undefined) {
      updates.order = args.newOrder;
    }
    
    await ctx.db.patch(args.taskId, updates);
    
    await ctx.db.insert("taskHistory", {
      taskId: args.taskId,
      action: "moved",
      fromColumnId: task.columnId,
      toColumnId: args.targetColumnId,
      performedBy: createdBy as Id<"users">,
      performedAt: Date.now(),
    });
    
    await updateAnalytics(ctx, "moved");
    return true;
  },
});

/**
 * Delete a task
 */
export const remove = mutation({
  args: { taskId: v.id("tasks") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const createdBy = "user_1";
    
    const task = await ctx.db.get(args.taskId);
    if (!task) return false;
    
    await ctx.db.insert("taskHistory", {
      taskId: args.taskId,
      action: "deleted",
      performedBy: createdBy as Id<"users">,
      performedAt: Date.now(),
      metadata: JSON.stringify({ title: task.title }),
    });
    
    await ctx.db.delete(args.taskId);
    return true;
  },
});

/**
 * Reorder tasks within a column
 */
export const reorder = mutation({
  args: {
    taskId: v.id("tasks"),
    newOrder: v.number(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, { order: args.newOrder });
    return true;
  },
});

/**
 * Handle task recurrence
 * Creates a new task based on recurrence rules
 */
export const handleRecurrence = mutation({
  args: {
    taskId: v.id("tasks"),
    recurrenceType: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
  },
  returns: v.union(v.null(), v.id("tasks")),
  handler: async (ctx, args) => {
    const originalTask = await ctx.db.get(args.taskId);
    if (!originalTask) return null;
    
    // Calculate next due date
    const now = Date.now();
    let nextDueDate: number;
    
    switch (args.recurrenceType) {
      case "daily":
        nextDueDate = now + 24 * 60 * 60 * 1000;
        break;
      case "weekly":
        nextDueDate = now + 7 * 24 * 60 * 60 * 1000;
        break;
      case "monthly":
        const date = new Date(now);
        date.setMonth(date.getMonth() + 1);
        nextDueDate = date.getTime();
        break;
      default:
        nextDueDate = now + 24 * 60 * 60 * 1000;
    }
    
    // Create recurring task
    const newTaskId = await ctx.db.insert("tasks", {
      title: originalTask.title,
      description: originalTask.description,
      columnId: originalTask.columnId,
      priority: originalTask.priority,
      status: "todo",
      dueDate: nextDueDate,
      tags: originalTask.tags,
      assigneeId: originalTask.assigneeId,
      order: originalTask.order,
      createdAt: now,
      createdBy: originalTask.createdBy,
    });
    
    await ctx.db.insert("taskHistory", {
      taskId: newTaskId,
      action: "created",
      performedBy: originalTask.createdBy as Id<"users">,
      performedAt: now,
      metadata: JSON.stringify({ recurrenceFrom: args.taskId, type: args.recurrenceType }),
    });
    
    await updateAnalytics(ctx, "created");
    
    return newTaskId;
  },
});

/**
 * Mark task as done with celebration
 */
export const markDone = mutation({
  args: { taskId: v.id("tasks") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const createdBy = "user_1";
    
    const task = await ctx.db.get(args.taskId);
    if (!task) return false;
    
    await ctx.db.patch(args.taskId, { status: "done" });
    
    await ctx.db.insert("taskHistory", {
      taskId: args.taskId,
      action: "updated",
      performedBy: createdBy as Id<"users">,
      performedAt: Date.now(),
      metadata: JSON.stringify({ statusChangedTo: "done" }),
    });
    
    await updateAnalytics(ctx, "completed");
    return true;
  },
});

/**
 * Skip task (mark as "not today")
 */
export const skipTask = mutation({
  args: { 
    taskId: v.id("tasks"),
    reason: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const createdBy = "user_1";
    
    // Move to backlog or postpone
    const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
    
    await ctx.db.patch(args.taskId, {
      dueDate: tomorrow,
      status: "todo",
    });
    
    await ctx.db.insert("taskHistory", {
      taskId: args.taskId,
      action: "updated",
      performedBy: createdBy as Id<"users">,
      performedAt: Date.now(),
      metadata: JSON.stringify({ action: "skipped", reason: args.reason }),
    });
    
    return true;
  },
});

// ==================== HELPERS ====================

async function updateAnalytics(
  ctx: { db: { query: (table: string) => { withIndex: (index: string, fn: (q: { eq: (field: string, value: string) => unknown }) => unknown) => { collect: () => Promise<Array<{ id: string; date: string; tasksCreated: number; tasksCompleted: number; tasksMoved: number; updatedAt: number }>> }; insert: (table: string, data: Record<string, unknown>) => Promise<string>; patch: (id: string, data: Record<string, unknown>) => Promise<void> } },
  type: "created" | "completed" | "moved"
) {
  const today = new Date().toISOString().split("T")[0];
  
  const existing = await ctx.db
    .query("analytics")
    .withIndex("by_date", (q) => q.eq("date", today))
    .collect();
  
  if (existing.length > 0) {
    const analytics = existing[0];
    const updates: Record<string, number> = {};
    
    if (type === "created") {
      updates.tasksCreated = analytics.tasksCreated + 1;
    } else if (type === "completed") {
      updates.tasksCompleted = analytics.tasksCompleted + 1;
    } else if (type === "moved") {
      updates.tasksMoved = analytics.tasksMoved + 1;
    }
    
    updates.updatedAt = Date.now();
    await ctx.db.patch(analytics.id, updates);
  } else {
    await ctx.db.insert("analytics", {
      date: today,
      tasksCreated: type === "created" ? 1 : 0,
      tasksCompleted: type === "completed" ? 1 : 0,
      tasksMoved: type === "moved" ? 1 : 0,
      updatedAt: Date.now(),
    });
  }
}
