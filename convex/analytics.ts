import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get all analytics data
 */
export const getAll = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const analytics = await ctx.db.query("analytics").collect();
    return analytics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
});

/**
 * Get analytics for date range
 */
export const getByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const allAnalytics = await ctx.db.query("analytics").collect();
    
    return allAnalytics
      .filter((a) => a.date >= args.startDate && a.date <= args.endDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
});

/**
 * Get analytics for today
 */
export const getToday = query({
  args: {},
  returns: v.union(v.null(), v.any()),
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    
    const analytics = await ctx.db
      .query("analytics")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();
    
    return analytics[0] || null;
  },
});

/**
 * Get dashboard stats
 */
export const getDashboardStats = query({
  args: {},
  returns: v.object({
    totalTasks: v.number(),
    tasksCompleted: v.number(),
    tasksInProgress: v.number(),
    tasksPending: v.number(),
    completionRate: v.number(),
    avgTasksPerDay: v.number(),
    todayCompleted: v.number(),
    todayCreated: v.number(),
    streak: v.number(),
  }),
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    const analytics = await ctx.db.query("analytics").collect();
    
    const totalTasks = tasks.length;
    const tasksCompleted = tasks.filter((t) => t.status === "done").length;
    const tasksInProgress = tasks.filter((t) => t.status === "in_progress").length;
    const tasksPending = tasks.filter((t) => t.status === "todo").length;
    const completionRate = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
    
    // Calculate average tasks per day
    const totalDays = analytics.length || 1;
    const avgTasksPerDay = Math.round((tasksCompleted / totalDays) * 10) / 10;
    
    // Today's stats
    const today = new Date().toISOString().split("T")[0];
    const todayStats = analytics.find((a) => a.date === today);
    const todayCompleted = todayStats?.tasksCompleted || 0;
    const todayCreated = todayStats?.tasksCreated || 0;
    
    // Calculate streak (consecutive days with completed tasks)
    let streak = 0;
    const sortedAnalytics = analytics.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (const day of sortedAnalytics) {
      if (day.tasksCompleted > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return {
      totalTasks,
      tasksCompleted,
      tasksInProgress,
      tasksPending,
      completionRate,
      avgTasksPerDay,
      todayCompleted,
      todayCreated,
      streak,
    };
  },
});

/**
 * Get weekly analytics data
 */
export const getWeeklyData = query({
  args: {},
  returns: v.array(v.object({
    day: v.string(),
    completed: v.number(),
    created: v.number(),
  })),
  handler: async (ctx) => {
    const analytics = await ctx.db.query("analytics").collect();
    
    // Get last 7 days
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = days[date.getDay()];
      
      const dayStats = analytics.find((a) => a.date === dateStr);
      
      result.push({
        day: dayName,
        completed: dayStats?.tasksCompleted || 0,
        created: dayStats?.tasksCreated || 0,
      });
    }
    
    return result;
  },
});

/**
 * Get priority distribution
 */
export const getPriorityDistribution = query({
  args: {},
  returns: v.object({
    high: v.number(),
    medium: v.number(),
    low: v.number(),
  }),
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    
    return {
      high: tasks.filter((t) => t.priority === "high").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      low: tasks.filter((t) => t.priority === "low").length,
    };
  },
});

/**
 * Get status distribution
 */
export const getStatusDistribution = query({
  args: {},
  returns: v.object({
    todo: v.number(),
    in_progress: v.number(),
    done: v.number(),
  }),
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    
    return {
      todo: tasks.filter((t) => t.status === "todo").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  },
});

/**
 * Get team productivity stats
 */
export const getTeamStats = query({
  args: {},
  returns: v.array(v.object({
    userId: v.string(),
    name: v.string(),
    avatar: v.string(),
    totalTasks: v.number(),
    completedTasks: v.number(),
    completionRate: v.number(),
  })),
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const tasks = await ctx.db.query("tasks").collect();
    
    return users.map((user) => {
      const userTasks = tasks.filter((t) => t.assigneeId === user._id);
      const completed = userTasks.filter((t) => t.status === "done").length;
      const total = userTasks.length;
      
      return {
        userId: user._id,
        name: user.name,
        avatar: user.avatar || user.name.charAt(0),
        totalTasks: total,
        completedTasks: completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  },
});

/**
 * Get completion time statistics
 */
export const getCompletionStats = query({
  args: {},
  returns: v.object({
    avgCompletionTime: v.number(),
    fastestCompletion: v.number(),
    slowestCompletion: v.number(),
  }),
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    const completedTasks = tasks.filter((t) => t.status === "done" && t.dueDate);
    
    if (completedTasks.length === 0) {
      return {
        avgCompletionTime: 0,
        fastestCompletion: 0,
        slowestCompletion: 0,
      };
    }
    
    const completionTimes = completedTasks.map((t) => {
      const created = t.createdAt;
      const due = t.dueDate || Date.now();
      return (due - created) / (1000 * 60 * 60 * 24); // in days
    });
    
    const avg = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;
    
    return {
      avgCompletionTime: Math.round(avg * 10) / 10,
      fastestCompletion: Math.round(Math.min(...completionTimes) * 10) / 10,
      slowestCompletion: Math.round(Math.max(...completionTimes) * 10) / 10,
    };
  },
});
