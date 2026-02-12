"use client";

import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { mockData, getTasksByColumn, getDailyBaseColumn } from "@/lib/data/mock-data";
import { Task } from "@/lib/types";

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground-muted mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
          {change && (
            <p
              className={`text-sm mt-1 flex items-center gap-1 ${
                changeType === "positive"
                  ? "text-green-400"
                  : changeType === "negative"
                  ? "text-red-400"
                  : "text-foreground-muted"
              }`}
            >
              {changeType === "positive" && <TrendingUp className="w-3 h-3" />}
              {changeType === "negative" && <TrendingUp className="w-3 h-3 rotate-180" />}
              {change}
            </p>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  const priorityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  return (
    <div className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: priorityColors[task.priority] }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{task.title}</p>
        <p className="text-sm text-foreground-muted truncate">
          {task.description || "No description"}
        </p>
      </div>
      {task.dueDate && (
        <div className="flex items-center gap-1 text-xs text-foreground-muted">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { tasks } = mockData;
  const dailyBaseColumn = getDailyBaseColumn();
  const dailyTasks = getTasksByColumn(dailyBaseColumn.id);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    pending: tasks.filter((t) => t.status === "todo").length,
  };

  const completionRate = Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-foreground-muted">
          Welcome back! Here&apos;s what&apos;s happening with your tasks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          change="+12%"
          changeType="positive"
          icon={ListTodo}
          color="#8b5cf6"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          change={`${completionRate}%`}
          changeType="positive"
          icon={CheckCircle2}
          color="#10b981"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          change="Active"
          changeType="neutral"
          icon={Clock}
          color="#3b82f6"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={AlertCircle}
          color="#f59e0b"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily BASE Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Daily BASE Tasks
            </h2>
            <button className="btn-secondary text-sm">View All</button>
          </div>
          <div className="space-y-2">
            {dailyTasks.length > 0 ? (
              dailyTasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-foreground-muted">No daily tasks yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="glass-card rounded-2xl p-4 space-y-4">
            {mockData.taskHistory.slice(0, 5).map((history, index) => {
              const task = tasks.find((t) => t.id === history.taskId);
              const user = mockData.users.find((u) => u.id === history.performedBy);
              return (
                <div key={history.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-medium shrink-0">
                    {user?.avatar || "U"}
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{user?.name}</span>{" "}
                      {history.action === "moved" ? "moved" : history.action}{" "}
                      <span className="font-medium text-purple-400">{task?.title}</span>
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {new Date(history.performedAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "New Task", color: "#8b5cf6" },
            { label: "New Column", color: "#3b82f6" },
            { label: "Invite Team", color: "#10b981" },
            { label: "View Analytics", color: "#f59e0b" },
          ].map((action) => (
            <button
              key={action.label}
              className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-colors group"
            >
              <div
                className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${action.color}20`, color: action.color }}
              >
                <PlusIcon />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
