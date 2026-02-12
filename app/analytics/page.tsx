"use client";

import { mockAnalytics, mockData } from "@/lib/data/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";

// Simple chart components since we can't install recharts
// We'll create visual representations instead

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ElementType;
}) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}
        >
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div
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
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-foreground-muted">{title}</p>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  color,
  max = 100,
}: {
  label: string;
  value: number;
  color: string;
  max?: number;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground-muted">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { tasks, analytics } = mockData;

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100) || 0;

  const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;
  const mediumPriorityTasks = tasks.filter((t) => t.priority === "medium").length;
  const lowPriorityTasks = tasks.filter((t) => t.priority === "low").length;

  const todoTasks = tasks.filter((t) => t.status === "todo").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;

  // Mock chart data
  const weeklyData = [
    { day: "Mon", completed: 4, created: 3 },
    { day: "Tue", completed: 6, created: 5 },
    { day: "Wed", completed: 3, created: 4 },
    { day: "Thu", completed: 7, created: 2 },
    { day: "Fri", completed: 5, created: 6 },
    { day: "Sat", completed: 2, created: 1 },
    { day: "Sun", completed: 3, created: 2 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics</h1>
          <p className="text-foreground-muted">
            Track your productivity and team performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input-glass text-sm py-2">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          change="+12%"
          trend="up"
          icon={CheckCircle2}
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          change="+5%"
          trend="up"
          icon={Target}
        />
        <StatCard
          title="Avg. Time"
          value="2.3 days"
          change="-8%"
          trend="up"
          icon={Clock}
        />
        <StatCard
          title="Active Tasks"
          value={inProgressTasks}
          icon={Calendar}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Over Time Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Tasks Over Time</h3>
          <div className="h-64 relative">
            {/* Custom Bar Chart */}
            <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
              {weeklyData.map((data, index) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 h-48 items-end">
                    <div
                      className="flex-1 bg-purple-500/60 rounded-t-lg transition-all duration-500 hover:bg-purple-500"
                      style={{ height: `${(data.completed / 8) * 100}%` }}
                      title={`Completed: ${data.completed}`}
                    />
                    <div
                      className="flex-1 bg-blue-500/60 rounded-t-lg transition-all duration-500 hover:bg-blue-500"
                      style={{ height: `${(data.created / 8) * 100}%` }}
                      title={`Created: ${data.created}`}
                    />
                  </div>
                  <span className="text-xs text-foreground-muted">{data.day}</span>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="absolute top-0 right-0 flex items-center gap-4">
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
        </div>

        {/* Priority Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Priority Distribution</h3>
          <div className="space-y-6">
            <ProgressBar
              label="High Priority"
              value={highPriorityTasks}
              color="#ef4444"
              max={totalTasks}
            />
            <ProgressBar
              label="Medium Priority"
              value={mediumPriorityTasks}
              color="#f59e0b"
              max={totalTasks}
            />
            <ProgressBar
              label="Low Priority"
              value={lowPriorityTasks}
              color="#10b981"
              max={totalTasks}
            />
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-400">{highPriorityTasks}</p>
              <p className="text-xs text-foreground-muted">High</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{mediumPriorityTasks}</p>
              <p className="text-xs text-foreground-muted">Medium</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{lowPriorityTasks}</p>
              <p className="text-xs text-foreground-muted">Low</p>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Status Breakdown</h3>
          <div className="flex items-center gap-8">
            {/* Donut Chart */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />
                {/* Todo segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="12"
                  strokeDasharray={`${(todoTasks / totalTasks) * 251} 251`}
                  strokeLinecap="round"
                />
                {/* In Progress segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray={`${(inProgressTasks / totalTasks) * 251} 251`}
                  strokeDashoffset={-(todoTasks / totalTasks) * 251}
                  strokeLinecap="round"
                />
                {/* Done segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${(completedTasks / totalTasks) * 251} 251`}
                  strokeDashoffset={-((todoTasks + inProgressTasks) / totalTasks) * 251}
                  strokeLinecap="round"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{totalTasks}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-sm">To Do</span>
                </div>
                <span className="font-medium">{todoTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">In Progress</span>
                </div>
                <span className="font-medium">{inProgressTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Done</span>
                </div>
                <span className="font-medium">{completedTasks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Activity */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Team Activity</h3>
          <div className="space-y-4">
            {mockData.users.map((user) => {
              const userTasks = tasks.filter((t) => t.assigneeId === user.id);
              const completed = userTasks.filter((t) => t.status === "done").length;
              const total = userTasks.length;

              return (
                <div key={user.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-medium">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">{user.name}</span>
                      <span className="text-sm text-foreground-muted">
                        {completed}/{total} tasks
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
