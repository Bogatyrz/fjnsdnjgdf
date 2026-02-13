"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  AlertCircle,
  Calendar,
  Target,
  Zap,
  Flame,
} from "lucide-react";
import { mockData, getTasksByColumn, getDailyBaseColumn } from "@/lib/data/mock-data";
import { Task } from "@/lib/types";
import { CelebrationModal } from "@/components/modals/CelebrationModal";
import { DoneModal, NotTodayModal, FailureModal } from "@/components/modals/TaskActionModals";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  color: string;
  delay?: number;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-2xl p-6"
    >
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
        <motion.div
          whileHover={{ rotate: 10 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      </div>
    </motion.div>
  );
}

interface TaskItemProps {
  task: Task;
  onDone: (task: Task) => void;
  onNotToday: (task: Task) => void;
  onFailure: (task: Task) => void;
  delay?: number;
}

function TodayTaskItem({ task, onDone, onNotToday, onFailure, delay = 0 }: TaskItemProps) {
  const priorityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  const isOverdue = task.dueDate && task.dueDate < Date.now();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass rounded-xl p-4 group hover:bg-white/5 transition-all"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-2 h-12 rounded-full"
          style={{ backgroundColor: priorityColors[task.priority] }}
        />
        
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{task.title}</p>
          <p className="text-sm text-foreground-muted truncate">
            {task.description || "No description"}
          </p>
        </div>

        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-400" : "text-foreground-muted"}`}>
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDone(task)}
            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
            title="Done"
          >
            <CheckCircle2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNotToday(task)}
            className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
            title="Not Today"
          >
            <Clock className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFailure(task)}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            title="Having Trouble"
          >
            <AlertCircle className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { tasks, taskHistory } = mockData;
  const dailyBaseColumn = getDailyBaseColumn();
  const dailyTasks = getTasksByColumn(dailyBaseColumn.id);

  // State for modals
  const [celebrationTask, setCelebrationTask] = useState<Task | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: "done" | "not_today" | "failure" | null;
    task: Task | null;
  }>({ type: null, task: null });

  // Calculate stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const pending = tasks.filter((t) => t.status === "todo").length;
    const completionRate = Math.round((completed / total) * 100) || 0;
    const streak = 3; // Would come from analytics
    
    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate,
      streak,
    };
  }, [tasks]);

  // Get today's tasks (Daily BASE + due today)
  const todayTasks = useMemo(() => {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);
    
    return tasks.filter((task) => {
      const isDueToday = task.dueDate && task.dueDate >= startOfDay && task.dueDate <= endOfDay;
      const isDailyBase = task.columnId === "col_daily";
      const isNotDone = task.status !== "done";
      
      return (isDueToday || isDailyBase) && isNotDone;
    }).sort((a, b) => {
      // High priority first
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }, [tasks]);

  // Handlers
  const handleTaskDone = (task: Task) => {
    setActionModal({ type: "done", task });
  };

  const handleTaskNotToday = (task: Task) => {
    setActionModal({ type: "not_today", task });
  };

  const handleTaskFailure = (task: Task) => {
    setActionModal({ type: "failure", task });
  };

  const handleDoneConfirm = () => {
    if (actionModal.task) {
      setCelebrationTask(actionModal.task);
      setActionModal({ type: null, task: null });
    }
  };

  const handleNotTodayConfirm = () => {
    setActionModal({ type: null, task: null });
  };

  const handleFailureConfirm = () => {
    setActionModal({ type: null, task: null });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-foreground-muted">
          Welcome back! Here&apos;s what&apos;s happening with your tasks.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          change="+12%"
          changeType="positive"
          icon={ListTodo}
          color="#8b5cf6"
          delay={0.1}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          change={`${stats.completionRate}%`}
          changeType="positive"
          icon={CheckCircle2}
          color="#10b981"
          delay={0.2}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          change="Active"
          changeType="neutral"
          icon={Clock}
          color="#3b82f6"
          delay={0.3}
        />
        <StatCard
          title="Streak"
          value={`${stats.streak} days`}
          change="Keep it up!"
          changeType="positive"
          icon={Flame}
          color="#f59e0b"
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Today&apos;s Focus
              <span className="text-sm font-normal text-foreground-muted">
                ({todayTasks.length} tasks)
              </span>
            </h2>
            <button className="btn-secondary text-sm">
              <Target className="w-4 h-4 inline mr-2" />
              Focus Mode
            </button>
          </div>

          <div className="space-y-2">
            {todayTasks.length > 0 ? (
              todayTasks.map((task, index) => (
                <TodayTaskItem
                  key={task.id}
                  task={task}
                  onDone={handleTaskDone}
                  onNotToday={handleTaskNotToday}
                  onFailure={handleTaskFailure}
                  delay={0.1 * index}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-foreground-muted mb-2">All caught up!</p>
                <p className="text-sm text-foreground-muted">
                  You have no tasks due today. Enjoy your day!
                </p>
              </motion.div>
            )}
          </div>

          {/* Progress Bar */}
          {todayTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground-muted">Daily Progress</span>
                <span className="font-medium">
                  {tasks.filter((t) => t.status === "done" && t.columnId === "col_daily").length} / {todayTasks.length}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(tasks.filter((t) => t.status === "done" && t.columnId === "col_daily").length / todayTasks.length) * 100}%` }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-muted">Tasks Today</span>
                <span className="font-medium">{todayTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-muted">Completed</span>
                <span className="font-medium text-green-400">
                  {tasks.filter((t) => t.status === "done").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-muted">Overdue</span>
                <span className="font-medium text-red-400">
                  {tasks.filter((t) => t.dueDate && t.dueDate < Date.now() && t.status !== "done").length}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <div className="glass-card rounded-2xl p-4 space-y-4">
              {taskHistory.slice(0, 5).map((history, index) => {
                const task = tasks.find((t) => t.id === history.taskId);
                const user = mockData.users.find((u) => u.id === history.performedBy);
                return (
                  <motion.div
                    key={history.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex gap-3"
                  >
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
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <CelebrationModal
        isOpen={!!celebrationTask}
        onClose={() => setCelebrationTask(null)}
        taskTitle={celebrationTask?.title || ""}
        streak={stats.streak}
        totalCompleted={stats.completed}
        mode="meme"
      />

      <DoneModal
        isOpen={actionModal.type === "done"}
        onClose={() => setActionModal({ type: null, task: null })}
        task={actionModal.task}
        onConfirm={handleDoneConfirm}
      />

      <NotTodayModal
        isOpen={actionModal.type === "not_today"}
        onClose={() => setActionModal({ type: null, task: null })}
        task={actionModal.task}
        onConfirm={handleNotTodayConfirm}
      />

      <FailureModal
        isOpen={actionModal.type === "failure"}
        onClose={() => setActionModal({ type: null, task: null })}
        task={actionModal.task}
        onConfirm={handleFailureConfirm}
      />
    </div>
  );
}
