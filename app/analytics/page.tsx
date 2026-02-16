"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  Flame,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
} from "lucide-react";
import { 
  useDashboardStats, 
  useWeeklyData, 
  usePriorityDistribution, 
  useStatusDistribution,
  useTeamStats 
} from "@/lib/hooks/useAnalytics";

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
  value: string | number | React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
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
      <motion.h3 
        className="text-3xl font-bold mb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {value}
      </motion.h3>
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
        <motion.span 
          className="font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {value}
        </motion.span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("7d");
  
  // Convex queries
  const stats = useDashboardStats();
  const weeklyData = useWeeklyData();
  const priorityDist = usePriorityDistribution();
  const statusDist = useStatusDistribution();
  const teamData = useTeamStats();

  // Calculate stats from Convex data
  const dashboardStats = useMemo(() => {
    if (!stats) return null;
    return {
      totalTasks: stats.totalTasks,
      completionRate: stats.completionRate,
      avgCompletionTime: 2.3, // Placeholder
      streak: stats.streak,
    };
  }, [stats]);

  const priorityStats = useMemo(() => {
    if (!priorityDist) return { high: 0, medium: 0, low: 0, total: 0 };
    const total = priorityDist.high + priorityDist.medium + priorityDist.low;
    return { ...priorityDist, total };
  }, [priorityDist]);

  const statusStats = useMemo(() => {
    if (!statusDist) return { todo: 0, in_progress: 0, done: 0, total: 0 };
    const total = statusDist.todo + statusDist.in_progress + statusDist.done;
    return { ...statusDist, total };
  }, [statusDist]);

  if (!dashboardStats || !weeklyData || !priorityStats || !statusStats) {
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
          value={dashboardStats.totalTasks}
          change="+12%"
          trend="up"
          icon={CheckCircle2}
          color="#8b5cf6"
        />
        <StatCard
          title="Completion Rate"
          value={`${dashboardStats.completionRate}%`}
          change="+5%"
          trend="up"
          icon={Target}
          color="#10b981"
        />
        <StatCard
          title="Avg. Time"
          value={`${dashboardStats.avgCompletionTime} days`}
          change="-8%"
          trend="up"
          icon={Clock}
          color="#3b82f6"
        />
        <StatCard
          title="Active Streak"
          value={`${dashboardStats.streak} days`}
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
              {weeklyData?.map((data, index) => (
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
                      animate={{ height: `${Math.min((data.completed / 8) * 100, 100)}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className="flex-1 bg-purple-500/60 rounded-t-lg hover:bg-purple-500 transition-colors cursor-pointer group relative"
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background-secondary px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      >
                        {data.completed}
                      </motion.div>
                    </motion.div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min((data.created / 8) * 100, 100)}%` }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                      className="flex-1 bg-blue-500/60 rounded-t-lg hover:bg-blue-500 transition-colors cursor-pointer group relative"
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background-secondary px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      >
                        {data.created}
                      </motion.div>
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
              value={priorityStats.high}
              color="#ef4444"
              max={priorityStats.total || 1}
            />
            <ProgressBar
              label="Medium Priority"
              value={priorityStats.medium}
              color="#f59e0b"
              max={priorityStats.total || 1}
            />
            <ProgressBar
              label="Low Priority"
              value={priorityStats.low}
              color="#10b981"
              max={priorityStats.total || 1}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
              <p className="text-2xl font-bold text-red-400">{priorityStats.high}</p>
              <p className="text-xs text-foreground-muted">High</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
              <p className="text-2xl font-bold text-amber-400">{priorityStats.medium}</p>
              <p className="text-xs text-foreground-muted">Medium</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
              <p className="text-2xl font-bold text-green-400">{priorityStats.low}</p>
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
                  animate={{ strokeDasharray: `${(statusStats.todo / (statusStats.total || 1)) * 251} 251` }}
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
                  animate={{ strokeDasharray: `${(statusStats.in_progress / (statusStats.total || 1)) * 251} 251` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDashoffset={-(statusStats.todo / (statusStats.total || 1)) * 251}
                  strokeLinecap="round"
                />
                <motion.circle
                  initial={{ strokeDasharray: "0 251" }}
                  animate={{ strokeDasharray: `${(statusStats.done / (statusStats.total || 1)) * 251} 251` }}
                  transition={{ duration: 1, delay: 0.9 }}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDashoffset={-((statusStats.todo + statusStats.in_progress) / (statusStats.total || 1)) * 251}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                >
                  {statusStats.total}
                </motion.span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <motion.div 
                className="flex items-center justify-between"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-sm">To Do</span>
                </div>
                <span className="font-medium">{statusStats.todo}</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-between"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">In Progress</span>
                </div>
                <span className="font-medium">{statusStats.in_progress}</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-between"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Done</span>
                </div>
                <span className="font-medium">{statusStats.done}</span>
              </motion.div>
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
            {teamData?.map((member, index) => (
              <motion.div
                key={member.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4"
              >
                <motion.div 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-medium"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  {member.avatar}
                </motion.div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{member.name}</span>
                    <span className="text-sm text-foreground-muted">
                      {member.completedTasks}/{member.totalTasks}
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
                <motion.span 
                  className="text-sm font-medium text-foreground-muted w-12 text-right"
                  whileHover={{ scale: 1.2, color: "#8b5cf6" }}
                >
                  {member.completionRate}%
                </motion.span>
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
            { label: "Tasks Completed", value: stats?.tasksCompleted || 0, change: "+12%", positive: true },
            { label: "Avg. per Day", value: stats?.avgTasksPerDay?.toFixed(1) || "0.0", change: "+0.5", positive: true },
            { label: "Completion Rate", value: `${stats?.completionRate || 0}%`, change: "+5%", positive: true },
            { label: "Total Active", value: stats?.totalTasks || 0, change: "Active", positive: true },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="glass rounded-xl p-4 text-center"
            >
              <motion.p 
                className="text-2xl font-bold mb-1"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
              >
                {stat.value}
              </motion.p>
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
