import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Seed the database with initial data
 * Run this mutation to populate the database with default columns and sample data
 */
export const seedDatabase = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx) => {
    try {
      // Check if columns already exist
      const existingColumns = await ctx.db.query("columns").collect();
      if (existingColumns.length > 0) {
        return {
          success: false,
          message: "Database already seeded. Delete existing data first.",
        };
      }

      // Create default user
      const userId = await ctx.db.insert("users", {
        name: "Alex Rivera",
        email: "alex@vibetasker.com",
        avatar: "AR",
        role: "admin",
        createdAt: Date.now(),
      });

      // Create default columns
      const dailyBaseId = await ctx.db.insert("columns", {
        title: "Daily BASE",
        order: 0,
        type: "daily",
        locked: true,
        color: "#8b5cf6",
        createdAt: Date.now(),
        createdBy: userId,
      });

      const todoId = await ctx.db.insert("columns", {
        title: "To Do",
        order: 1,
        type: "custom",
        locked: false,
        color: "#64748b",
        createdAt: Date.now(),
        createdBy: userId,
      });

      const progressId = await ctx.db.insert("columns", {
        title: "In Progress",
        order: 2,
        type: "custom",
        locked: false,
        color: "#3b82f6",
        createdAt: Date.now(),
        createdBy: userId,
      });

      const reviewId = await ctx.db.insert("columns", {
        title: "Review",
        order: 3,
        type: "custom",
        locked: false,
        color: "#f59e0b",
        createdAt: Date.now(),
        createdBy: userId,
      });

      const doneId = await ctx.db.insert("columns", {
        title: "Done",
        order: 4,
        type: "custom",
        locked: false,
        color: "#10b981",
        createdAt: Date.now(),
        createdBy: userId,
      });

      // Create sample tasks
      const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
      const nextWeek = Date.now() + 7 * 24 * 60 * 60 * 1000;

      // Daily BASE tasks
      await ctx.db.insert("tasks", {
        title: "Morning standup",
        description: "Daily team sync",
        columnId: dailyBaseId,
        assigneeId: userId,
        priority: "high",
        status: "todo",
        tags: ["daily", "meeting"],
        order: 0,
        dueDate: tomorrow,
        createdAt: Date.now(),
        createdBy: userId,
        recurrence: "daily",
      });

      await ctx.db.insert("tasks", {
        title: "Code review",
        description: "Review PRs from team",
        columnId: dailyBaseId,
        assigneeId: userId,
        priority: "medium",
        status: "todo",
        tags: ["daily", "dev"],
        order: 1,
        dueDate: tomorrow,
        createdAt: Date.now(),
        createdBy: userId,
        recurrence: "daily",
      });

      await ctx.db.insert("tasks", {
        title: "Email cleanup",
        description: "Clear inbox",
        columnId: dailyBaseId,
        assigneeId: userId,
        priority: "low",
        status: "done",
        tags: ["daily"],
        order: 2,
        dueDate: tomorrow,
        createdAt: Date.now(),
        createdBy: userId,
        recurrence: "daily",
      });

      // To Do tasks
      await ctx.db.insert("tasks", {
        title: "Design system update",
        description: "Update component library",
        columnId: todoId,
        assigneeId: userId,
        priority: "high",
        status: "todo",
        tags: ["design", "system"],
        order: 0,
        dueDate: nextWeek,
        createdAt: Date.now(),
        createdBy: userId,
      });

      await ctx.db.insert("tasks", {
        title: "API documentation",
        description: "Document new endpoints",
        columnId: todoId,
        assigneeId: userId,
        priority: "medium",
        status: "todo",
        tags: ["docs", "api"],
        order: 1,
        dueDate: nextWeek,
        createdAt: Date.now(),
        createdBy: userId,
      });

      // In Progress tasks
      await ctx.db.insert("tasks", {
        title: "Feature: Dark mode",
        description: "Implement dark theme toggle",
        columnId: progressId,
        assigneeId: userId,
        priority: "high",
        status: "in_progress",
        tags: ["feature", "ui"],
        order: 0,
        dueDate: nextWeek,
        createdAt: Date.now(),
        createdBy: userId,
      });

      // Done tasks
      await ctx.db.insert("tasks", {
        title: "Setup CI/CD",
        description: "Configure GitHub Actions",
        columnId: doneId,
        assigneeId: userId,
        priority: "medium",
        status: "done",
        tags: ["devops"],
        order: 0,
        dueDate: Date.now() - 86400000,
        createdAt: Date.now() - 86400000 * 7,
        createdBy: userId,
      });

      // Create initial analytics
      const today = new Date().toISOString().split("T")[0];
      await ctx.db.insert("analytics", {
        date: today,
        tasksCreated: 7,
        tasksCompleted: 1,
        tasksMoved: 5,
        updatedAt: Date.now(),
      });

      return {
        success: true,
        message: "Database seeded successfully with default columns and tasks!",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to seed database: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

/**
 * Clear all data from the database
 */
export const clearDatabase = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx) => {
    try {
      // Delete all tasks
      const tasks = await ctx.db.query("tasks").collect();
      for (const task of tasks) {
        await ctx.db.delete(task._id);
      }

      // Delete all columns
      const columns = await ctx.db.query("columns").collect();
      for (const column of columns) {
        await ctx.db.delete(column._id);
      }

      // Delete all users
      const users = await ctx.db.query("users").collect();
      for (const user of users) {
        await ctx.db.delete(user._id);
      }

      // Delete all analytics
      const analytics = await ctx.db.query("analytics").collect();
      for (const analytic of analytics) {
        await ctx.db.delete(analytic._id);
      }

      // Delete all task history
      const history = await ctx.db.query("taskHistory").collect();
      for (const item of history) {
        await ctx.db.delete(item._id);
      }

      return {
        success: true,
        message: "Database cleared successfully!",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to clear database: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});
