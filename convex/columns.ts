import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Get all columns sorted by order
 */
export const getAll = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const columns = await ctx.db.query("columns").collect();
    return columns.sort((a, b) => a.order - b.order);
  },
});

/**
 * Get column by ID
 */
export const getById = query({
  args: { columnId: v.id("columns") },
  returns: v.union(v.null(), v.any()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.columnId);
  },
});

/**
 * Get Daily BASE column
 */
export const getDailyBase = query({
  args: {},
  returns: v.union(v.null(), v.any()),
  handler: async (ctx) => {
    const columns = await ctx.db.query("columns").collect();
    return columns.find((col) => col.type === "daily") || null;
  },
});

/**
 * Create a new column
 */
export const create = mutation({
  args: {
    title: v.string(),
    color: v.optional(v.string()),
    type: v.optional(v.union(v.literal("daily"), v.literal("custom"))),
  },
  returns: v.id("columns"),
  handler: async (ctx, args) => {
    const createdBy = "user_1";
    
    // Check if Daily BASE already exists
    if (args.type === "daily") {
      const existingDaily = await ctx.db.query("columns").collect();
      const hasDaily = existingDaily.some((col) => col.type === "daily");
      if (hasDaily) {
        throw new Error("Daily BASE column already exists");
      }
    }
    
    // Get max order
    const columns = await ctx.db.query("columns").collect();
    const maxOrder = columns.length > 0 ? Math.max(...columns.map((c) => c.order)) : -1;
    
    const columnId = await ctx.db.insert("columns", {
      title: args.title,
      order: maxOrder + 1,
      type: args.type || "custom",
      locked: args.type === "daily",
      color: args.color || "#64748b",
      createdAt: Date.now(),
      createdBy,
    });
    
    return columnId;
  },
});

/**
 * Update a column
 */
export const update = mutation({
  args: {
    columnId: v.id("columns"),
    title: v.optional(v.string()),
    color: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { columnId, ...updates } = args;
    
    const column = await ctx.db.get(columnId);
    if (!column) return false;
    
    // Don't allow modifying locked Daily BASE properties
    if (column.locked) {
      if (updates.order !== undefined && updates.order !== column.order) {
        // Allow order change for Daily BASE
      }
      // Don't allow changing title or color of locked column
      delete (updates as Record<string, unknown>).title;
      delete (updates as Record<string, unknown>).color;
    }
    
    await ctx.db.patch(columnId, updates);
    return true;
  },
});

/**
 * Delete a column
 */
export const remove = mutation({
  args: { columnId: v.id("columns") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const column = await ctx.db.get(args.columnId);
    if (!column) return false;
    
    // Don't allow deleting locked columns
    if (column.locked) {
      throw new Error("Cannot delete locked column");
    }
    
    // Move all tasks to backlog or delete them
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();
    
    // Delete or move tasks
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }
    
    await ctx.db.delete(args.columnId);
    return true;
  },
});

/**
 * Reorder columns
 */
export const reorder = mutation({
  args: {
    columnId: v.id("columns"),
    newOrder: v.number(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.columnId, { order: args.newOrder });
    return true;
  },
});

/**
 * Reset Daily BASE column (clear all tasks and recreate daily ones)
 */
export const resetDailyBase = mutation({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const createdBy = "user_1";
    
    // Find Daily BASE column
    const columns = await ctx.db.query("columns").collect();
    const dailyBase = columns.find((col) => col.type === "daily");
    
    if (!dailyBase) return false;
    
    // Get all tasks in Daily BASE
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_column", (q) => q.eq("columnId", dailyBase._id))
      .collect();
    
    // Archive completed tasks, move incomplete to backlog
    for (const task of tasks) {
      if (task.status === "done") {
        // Archive - could move to a separate archive table
        await ctx.db.delete(task._id);
      } else {
        // Find or create a backlog column
        const backlogColumn = columns.find((col) => 
          col.title.toLowerCase().includes("backlog") || 
          col.title.toLowerCase().includes("todo")
        );
        
        if (backlogColumn) {
          await ctx.db.patch(task._id, {
            columnId: backlogColumn._id,
            status: "todo",
          });
        }
      }
    }
    
    return true;
  },
});
