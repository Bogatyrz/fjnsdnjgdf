"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { mockAnalytics, mockData } from "@/lib/data/mock-data";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  Flame,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          whileHover={{ rotate: 10 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
        {change && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
              trend === "up"
                ? "bg-green-500/15 text-green-400"
                : trend === "down"
                ? "bg-red-500/15 text-red-400"
                : "bg-white/5 text-foreground-muted"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend === "down" ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            {change}
          </motion.div>
        )}
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-foreground-muted">{title}</p>
    </motion.div>
  );
}

function ProgressBar({
  label,
  value,
  color,
  max = 100,
  animated = true,
}: {
  label: string;
  value: number;
  color: string;
  max?: number;
  animated?: boolean;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground-muted">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function AnimatedNumber({ value, duration = 2 }: { value: number; duration?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.span>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("7d");
  const { tasks, analytics, users } = mockData;

  // Calculate stats with animations
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "done").length;
    const completionRate = Math.round((completedTasks / totalTasks) * 100) || 0;
    const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;
    const mediumPriorityTasks = tasks.filter((t) => t.priority === "medium").length;
    const lowPriorityTasks = tasks.filter((t) => t.priority === "low").length;
    const todoTasks = tasks.filter((t) => t.status === "todo").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
    const avgCompletionTime = 2.3;
    const streak = 3;

    return {
      totalTasks,
      completedTasks,
      completionRate,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      todoTasks,
      inProgressTasks,
      avgCompletionTime,
      streak,
    };
  }, [tasks]);

  // Weekly chart data
  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, index) => ({
      day,
      completed: [4, 6, 3, 7, 5, 2, 3][index],
      created: [3, 5, 4, 2, 6, 1, 2][index],
    }));
  }, []);

  // Team productivity data
  const teamData = useMemo(() => {
    return users.map((user) => {
      const userTasks = tasks.filter((t) => t.assigneeId === user.id);
      const completed = userTasks.filter((t) => t.status === "done").length;
      const total = userTasks.length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        user,
        completed,
        total,
        completionRate,
      };
    });
  }, [users, tasks]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics</h1>
          <p className="text-foreground-muted">
            Track your productivity and team performance
          </p>
        </div>
        <motion.select
          whileHover={{ scale: 1.02 }}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
          className="input-glass text-sm py-2 w-40"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="all">All Time</option>
        </motion.select>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={<AnimatedNumber value={stats.totalTasks} />}
          change="+12%"
          trend="up"
          icon={CheckCircle2}
          color="#8b5cf6"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          change="+5%"
          trend="up"
          icon={Target}
          color="#10b981"
        />
        <StatCard
          title="Avg. Time"
          value={`${stats.avgCompletionTime} days`}
          change="-8%"
          trend="up"
          icon={Clock}
          color="#3b82f6"
        />
        <StatCard
          title="Active Streak"
          value={`${stats.streak} days`}
          change="Best!"
          trend="up"
          icon={Flame}
          color="#f59e0b"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Over Time Chart */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Tasks Over Time
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-xs text-foreground-muted">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-xs text-foreground-muted">Created</span>
              </div>
            </div>
          </div>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
              {weeklyData.map((data, index) => (
                <motion.div
                  key={data.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex gap-1 h-48 items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.completed / 8) * 100}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className="flex-1 bg-purple-500/60 rounded-t-lg hover:bg-purple-500 transition-colors cursor-pointer group relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background-secondary px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.completed}
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.created / 8) * 100}%` }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                      className="flex-1 bg-blue-500/60 rounded-t-lg hover:bg-blue-500 transition-colors cursor-pointer group relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background-secondary px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.created}
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-xs text-foreground-muted">{data.day}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-400" />
            Priority Distribution
          </h3>
          <div className="space-y-6">
            <ProgressBar
              label="High Priority"
              value={stats.highPriorityTasks}
              color="#ef4444"
              max={stats.totalTasks}
            />
            <ProgressBar
              label="Medium Priority"
              value={stats.mediumPriorityTasks}
              color="#f59e0b"
              max={stats.totalTasks}
            />
            <ProgressBar
              label="Low Priority"
              value={stats.lowPriorityTasks}
              color="#10b981"
              max={stats.totalTasks}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-2xl font-bold text-red-400">{stats.highPriorityTasks}</p>
              <p className="text-xs text-foreground-muted">High</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-2xl font-bold text-amber-400">{stats.mediumPriorityTasks}</p>
              <p className="text-xs text-foreground-muted">Medium</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <p className="text-2xl font-bold text-green-400">{stats.lowPriorityTasks}</p>
              <p className="text-xs text-foreground-muted">Low</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Status Breakdown */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Status Breakdown
          </h3>
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />
                <motion.circle
                  initial={{ strokeDasharray: "0 251" }}
                  animate={{ strokeDasharray: `${(stats.todoTasks / stats.totalTasks) * 251} 251` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <motion.circle
                  initial={{ strokeDasharray: "0 251" }}
                  animate={{ strokeDasharray: `${(stats.inProgressTasks / stats.totalTasks) * 251} 251` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDashoffset={-(stats.todoTasks / stats.totalTasks) * 251}
                  strokeLinecap="round"
                />
                <motion.circle
                  initial={{ strokeDasharray: "0 251" }}
                  animate={{ strokeDasharray: `${(stats.completedTasks / stats.totalTasks) * 251} 251` }}
                  transition={{ duration: 1, delay: 0.9 }}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDashoffset={-((stats.todoTasks + stats.inProgressTasks) / stats.totalTasks) * 251}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{stats.totalTasks}</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-sm">To Do</span>
                </div>
                <span className="font-medium">{stats.todoTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">In Progress</span>
                </div>
                <span className="font-medium">{stats.inProgressTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Done</span>
                </div>
                <span className="font-medium">{stats.completedTasks}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Activity */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Team Productivity
          </h3>
          <div className="space-y-4">
            {teamData.map((member, index) => (
              <motion.div
                key={member.user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-medium">
                  {member.user.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{member.user.name}</span>
                    <span className="text-sm text-foreground-muted">
                      {member.completed}/{member.total}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${member.completionRate}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground-muted w-12 text-right">
                  {member.completionRate}%
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Summary */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Weekly Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Tasks Completed", value: 24, change: "+12%", positive: true },
            { label: "Avg. per Day", value: 3.4, change: "+0.5", positive: true },
            { label: "Completion Rate", value: "87%", change: "+5%", positive: true },
            { label: "Overdue Tasks", value: 2, change: "-3", positive: true },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-xl p-4 text-center"
            >
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-foreground-muted mb-2">{stat.label}</p>
              <span className={`text-xs ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                {stat.change}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
