import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("member")),
    createdAt: v.number(),
  })
    .index("by_email", ["email"]),

  columns: defineTable({
    title: v.string(),
    order: v.number(),
    type: v.union(v.literal("daily"), v.literal("custom")),
    locked: v.optional(v.boolean()),
    color: v.optional(v.string()),
    createdAt: v.number(),
    createdBy: v.string(),
  })
    .index("by_order", ["order"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    columnId: v.id("columns"),
    assigneeId: v.optional(v.id("users")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")),
    tags: v.optional(v.array(v.string())),
    order: v.number(),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    createdBy: v.string(),
  })
    .index("by_column", ["columnId"])
    .index("by_assignee", ["assigneeId"])
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"]),

  taskHistory: defineTable({
    taskId: v.id("tasks"),
    action: v.union(
      v.literal("created"),
      v.literal("moved"),
      v.literal("updated"),
      v.literal("deleted")
    ),
    fromColumnId: v.optional(v.id("columns")),
    toColumnId: v.optional(v.id("columns")),
    performedBy: v.id("users"),
    performedAt: v.number(),
    metadata: v.optional(v.string()),
  })
    .index("by_task", ["taskId"])
    .index("by_performed_at", ["performedAt"]),

  analytics: defineTable({
    date: v.string(),
    tasksCreated: v.number(),
    tasksCompleted: v.number(),
    tasksMoved: v.number(),
    avgCompletionTime: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_date", ["date"]),
});
