"use client";

import { useMemo } from "react";
import { mockAnalytics } from "@/lib/data/mock-data";
import { useAllTasks } from "./useTasks";

// Query hooks - using mock data
export function useAllAnalytics() {
  return mockAnalytics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function useAnalyticsByDateRange(startDate: string, endDate: string) {
  const analytics = useAllAnalytics();
  return analytics.filter(a => a.date >= startDate && a.date <= endDate);
}

export function useTodayAnalytics() {
  const analytics = useAllAnalytics();
  const today = new Date().toISOString().split("T")[0];
  return analytics.find(a => a.date === today) || null;
}

export function useDashboardStats() {
  const tasks = useAllTasks();
  
  return useMemo(() => {
    const totalTasks = tasks.length;
    const tasksCompleted = tasks.filter((t) => t.status === "done").length;
    const tasksInProgress = tasks.filter((t) => t.status === "in_progress").length;
    const tasksPending = tasks.filter((t) => t.status === "todo").length;
    const completionRate = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
    
    // Calculate average tasks per day (mock)
    const totalDays = mockAnalytics.length || 1;
    const avgTasksPerDay = Math.round((tasksCompleted / totalDays) * 10) / 10;
    
    // Today's stats
    const today = new Date().toISOString().split("T")[0];
    const todayStats = mockAnalytics.find((a) => a.date === today);
    const todayCompleted = todayStats?.tasksCompleted || 0;
    const todayCreated = todayStats?.tasksCreated || 0;
    
    // Calculate streak (consecutive days with completed tasks)
    let streak = 0;
    const sortedAnalytics = [...mockAnalytics].sort((a, b) => 
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
  }, [tasks]);
}

export function useWeeklyData() {
  return useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = days[date.getDay()];
      
      const dayStats = mockAnalytics.find((a) => a.date === dateStr);
      
      result.push({
        day: dayName,
        completed: dayStats?.tasksCompleted || 0,
        created: dayStats?.tasksCreated || 0,
      });
    }
    
    return result;
  }, []);
}

export function usePriorityDistribution() {
  const tasks = useAllTasks();
  
  return useMemo(() => ({
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  }), [tasks]);
}

export function useStatusDistribution() {
  const tasks = useAllTasks();
  
  return useMemo(() => ({
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  }), [tasks]);
}

export function useTeamStats() {
  const tasks = useAllTasks();
  
  return useMemo(() => {
    // Mock users for team stats
    const users = [
      { id: "user_1", name: "Alex Rivera", avatar: "AR" },
      { id: "user_2", name: "Sarah Chen", avatar: "SC" },
      { id: "user_3", name: "Jordan Smith", avatar: "JS" },
    ];
    
    return users.map((user) => {
      const userTasks = tasks.filter((t) => t.assigneeId === user.id);
      const completed = userTasks.filter((t) => t.status === "done").length;
      const total = userTasks.length;
      
      return {
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        totalTasks: total,
        completedTasks: completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  }, [tasks]);
}

export function useCompletionStats() {
  const tasks = useAllTasks();

  // Calculate current time outside useMemo to avoid impure function call during render
  const now = Date.now();

  return useMemo(() => {
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
      const due = t.dueDate || now;
      return (due - created) / (1000 * 60 * 60 * 24); // in days
    });

    const avg = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;

    return {
      avgCompletionTime: Math.round(avg * 10) / 10,
      fastestCompletion: Math.round(Math.min(...completionTimes) * 10) / 10,
      slowestCompletion: Math.round(Math.max(...completionTimes) * 10) / 10,
    };
  }, [tasks, now]);
}
