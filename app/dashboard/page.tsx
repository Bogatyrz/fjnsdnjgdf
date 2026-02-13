"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Loader2,
} from "lucide-react";
import { Task } from "@/lib/types";
import { CelebrationModal } from "@/components/modals/CelebrationModal";
import { DoneModal, NotTodayModal, FailureModal } from "@/components/modals/TaskActionModals";
import { useTodayTasks, useMarkTaskDone, useSkipTask } from "@/lib/hooks/useTasks";
import { useDashboardStats } from "@/lib/hooks/useAnalytics";
import { useAllColumns } from "@/lib/hooks/useColumns";

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
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground-muted mb-1">{title}</p>
          <motion.h3 
            className="text-3xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.h3>
          {change && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
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
            </motion.p>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
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
      whileHover={{ scale: 1.01, x: 4 }}
      className="glass rounded-xl p-4 group hover:bg-white/5 transition-all"
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="w-2 h-12 rounded-full"
          style={{ backgroundColor: priorityColors[task.priority] }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: delay + 0.1 }}
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
        <motion.div 
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ opacity: 0 }}
          whileHover={{ scale: 1.05 }}
        >
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
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  // Convex queries
  const todayTasksData = useTodayTasks();
  const stats = useDashboardStats();
  const columns = useAllColumns();
  
  // Convex mutations
  const markTaskDone = useMarkTaskDone();
  const skipTask = useSkipTask();

  // State
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [celebrationTask, setCelebrationTask] = useState<Task | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: "done" | "not_today" | "failure" | null;
    task: Task | null;
  }>({ type: null, task: null });
  const [memeMode] = useState(true);

  // Sync data
  useEffect(() => {
    if (todayTasksData !== undefined) {
      setTodayTasks(todayTasksData as Task[]);
      setIsLoading(false);
    }
  }, [todayTasksData]);

  // Calculate derived stats
  const dashboardStats = useMemo(() => {
    if (!stats) return null;
    return {
      total: stats.totalTasks,
      completed: stats.tasksCompleted,
      inProgress: stats.tasksInProgress,
      pending: stats.tasksPending,
      completionRate: stats.completionRate,
      streak: stats.streak,
    };
  }, [stats]);

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

  const handleDoneConfirm = async (recurrence?: string) => {
    if (actionModal.task) {
      try {
        await markTaskDone({ taskId: actionModal.task.id as any });
        setCelebrationTask(actionModal.task);
        setActionModal({ type: null, task: null });
      } catch (error) {
        console.error("Failed to complete task:", error);
      }
    }
  };

  const handleNotTodayConfirm = async (reason?: string) => {
    if (actionModal.task) {
      try {
        await skipTask({
          taskId: actionModal.task.id as any,
          reason: reason || "Postponed",
        });
        setActionModal({ type: null, task: null });
      } catch (error) {
        console.error("Failed to skip task:", error);
      }
    }
  };

  const handleFailureConfirm = () => {
    setActionModal({ type: null, task: null });
  };

  // Calculate completed tasks for progress bar
  const completedTodayTasks = useMemo(() => {
    return todayTasks.filter(t => t.status === "done").length;
  }, [todayTasks]);

  const progressPercentage = todayTasks.length > 0 
    ? (completedTodayTasks / todayTasks.length) * 100 
    : 0;

  if (isLoading || !dashboardStats) {
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
          value={dashboardStats.total}
          change="+12%"
          changeType="positive"
          icon={ListTodo}
          color="#8b5cf6"
          delay={0.1}
        />
        <StatCard
          title="Completed"
          value={dashboardStats.completed}
          change={`${dashboardStats.completionRate}%`}
          changeType="positive"
          icon={CheckCircle2}
          color="#10b981"
          delay={0.2}
        />
        <StatCard
          title="In Progress"
          value={dashboardStats.inProgress}
          change="Active"
          changeType="neutral"
          icon={Clock}
          color="#3b82f6"
          delay={0.3}
        />
        <StatCard
          title="Streak"
          value={`${dashboardStats.streak} days`}
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
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-purple-400"
              />
              Today&apos;s Focus
              <motion.span 
                key={todayTasks.length}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-sm font-normal text-foreground-muted"
              >
                ({todayTasks.length} tasks)
              </motion.span>
            </h2>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-sm"
            >
              <Target className="w-4 h-4 inline mr-2" />
              Focus Mode
            </motion.button>
          </div>

          <AnimatePresence mode="popLayout">
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass rounded-xl p-8 text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                    className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <p className="text-foreground-muted mb-2">All caught up!</p>
                  <p className="text-sm text-foreground-muted">
                    You have no tasks due today. Enjoy your day!
                  </p>
                </motion.div>
              )}
            </div>
          </AnimatePresence>

          {/* Progress Bar */}
          {todayTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground-muted">Daily Progress</span>
                <motion.span 
                  key={completedTodayTasks}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="font-medium"
                >
                  {completedTodayTasks} / {todayTasks.length}
                </motion.span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
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
            whileHover={{ scale: 1.01 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <motion.div 
                className="flex justify-between items-center"
                whileHover={{ x: 4 }}
              >
                <span className="text-sm text-foreground-muted">Tasks Today</span>
                <motion.span 
                  key={todayTasks.length}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="font-medium"
                >
                  {todayTasks.length}
                </motion.span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center"
                whileHover={{ x: 4 }}
              >
                <span className="text-sm text-foreground-muted">Completed</span>
                <span className="font-medium text-green-400">
                  {stats?.todayCompleted || 0}
                </span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center"
                whileHover={{ x: 4 }}
              >
                <span className="text-sm text-foreground-muted">Created Today</span>
                <span className="font-medium text-blue-400">
                  {stats?.todayCreated || 0}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-2xl p-6 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10"
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                >
                  <Flame className="w-8 h-8 text-amber-400" />
                </motion.div>
                <div>
                  <p className="text-3xl font-bold">{dashboardStats.streak}</p>
                  <p className="text-sm text-foreground-muted">Day Streak</p>
                </div>
              </div>
              <p className="text-sm text-foreground-muted">
                Keep completing tasks daily to maintain your streak!
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <CelebrationModal
        isOpen={!!celebrationTask}
        onClose={() => setCelebrationTask(null)}
        taskTitle={celebrationTask?.title || ""}
        streak={dashboardStats.streak}
        totalCompleted={dashboardStats.completed}
        mode={memeMode ? "meme" : "default"}
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
