"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, Clock, AlertTriangle, Calendar, ArrowRight } from "lucide-react";
import { Task } from "@/lib/types";

interface TaskActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onConfirm: (reason?: string) => void;
}

// Done Modal
export function DoneModal({ isOpen, onClose, task, onConfirm }: TaskActionModalProps) {
  const [recurrence, setRecurrence] = useState<"none" | "daily" | "weekly" | "monthly">("none");

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 modal-overlay" onClick={onClose} />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md glass-card rounded-2xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Mark as Done
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-foreground-muted mb-6">
              Great job completing <span className="text-foreground font-medium">{task.title}</span>!
            </p>

            {/* Recurrence Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Repeat this task?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "none", label: "Just once", icon: CheckCircle },
                  { value: "daily", label: "Daily", icon: Calendar },
                  { value: "weekly", label: "Weekly", icon: Calendar },
                  { value: "monthly", label: "Monthly", icon: Calendar },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRecurrence(option.value as typeof recurrence)}
                    className={`
                      flex items-center gap-2 p-3 rounded-xl text-sm transition-all
                      ${recurrence === option.value
                        ? "bg-green-500/20 border border-green-500/50 text-green-400"
                        : "glass-hover border border-transparent"
                      }
                    `}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => onConfirm(recurrence)}
                className="flex-1 btn-primary bg-gradient-to-r from-green-500 to-emerald-500"
              >
                Complete Task
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Not Today Modal
export function NotTodayModal({ isOpen, onClose, task, onConfirm }: TaskActionModalProps) {
  const [reason, setReason] = useState("");
  const [postponeTo, setPostponeTo] = useState<"tomorrow" | "next_week" | "custom">("tomorrow");

  if (!isOpen || !task) return null;

  const handleConfirm = () => {
    const reasonText = reason || `Postponed to ${postponeTo}`;
    onConfirm(reasonText);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 modal-overlay" onClick={onClose} />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md glass-card rounded-2xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-400" />
                Not Today
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-foreground-muted mb-6">
              Moving <span className="text-foreground font-medium">{task.title}</span> to another time.
            </p>

            {/* Postpone Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">When should we reschedule?</label>
              <div className="space-y-2">
                {[
                  { value: "tomorrow", label: "Tomorrow", sublabel: "Same time, next day" },
                  { value: "next_week", label: "Next Week", sublabel: "Give yourself a break" },
                  { value: "custom", label: "Custom Date", sublabel: "Pick a specific date" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPostponeTo(option.value as typeof postponeTo)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl text-left transition-all
                      ${postponeTo === option.value
                        ? "bg-amber-500/20 border border-amber-500/50"
                        : "glass-hover border border-transparent"
                      }
                    `}
                  >
                    <div>
                      <span className="font-medium">{option.label}</span>
                      <p className="text-xs text-foreground-muted">{option.sublabel}</p>
                    </div>
                    {postponeTo === option.value && (
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Reason (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why are you postponing this task?"
                rows={2}
                className="input-glass resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 btn-primary bg-gradient-to-r from-amber-500 to-orange-500"
              >
                Reschedule
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Failure/Snooze Modal
export function FailureModal({ isOpen, onClose, task, onConfirm }: TaskActionModalProps) {
  const [reason, setReason] = useState("");
  const [feeling, setFeeling] = useState<"overwhelmed" | "blocked" | "unmotivated" | "other">("overwhelmed");

  if (!isOpen || !task) return null;

  const encouragements: Record<typeof feeling, string> = {
    overwhelmed: "It's okay to feel overwhelmed. Break this task into smaller pieces!",
    blocked: "Being blocked happens to everyone. Can you identify what's blocking you?",
    unmotivated: "Motivation comes and goes. Try working on it for just 5 minutes!",
    other: "Every setback is a setup for a comeback. You've got this!",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 modal-overlay" onClick={onClose} />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md glass-card rounded-2xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                Having Trouble?
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Encouragement */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-foreground">{encouragements[feeling]}</p>
            </div>

            {/* How are you feeling? */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">What's going on?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "overwhelmed", label: "Overwhelmed", emoji: "😰" },
                  { value: "blocked", label: "Blocked", emoji: "🚧" },
                  { value: "unmotivated", label: "Unmotivated", emoji: "😴" },
                  { value: "other", label: "Something else", emoji: "🤔" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFeeling(option.value as typeof feeling)}
                    className={`
                      flex items-center gap-2 p-3 rounded-xl text-sm transition-all
                      ${feeling === option.value
                        ? "bg-red-500/20 border border-red-500/50"
                        : "glass-hover border border-transparent"
                      }
                    `}
                  >
                    <span>{option.emoji}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">What's blocking you?</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the challenge you're facing..."
                rows={3}
                className="input-glass resize-none"
              />
            </div>

            {/* Suggestions based on feeling */}
            <div className="mb-6 space-y-2">
              <p className="text-sm font-medium">Suggestions:</p>
              {feeling === "overwhelmed" && (
                <ul className="text-sm text-foreground-muted space-y-1 list-disc list-inside">
                  <li>Break the task into smaller subtasks</li>
                  <li>Focus on just the first step</li>
                  <li>Take a 10-minute break and come back</li>
                </ul>
              )}
              {feeling === "blocked" && (
                <ul className="text-sm text-foreground-muted space-y-1 list-disc list-inside">
                  <li>Ask a teammate for help</li>
                  <li>Move to a different task temporarily</li>
                  <li>Document the blocker and move on</li>
                </ul>
              )}
              {feeling === "unmotivated" && (
                <ul className="text-sm text-foreground-muted space-y-1 list-disc list-inside">
                  <li>Use the 5-minute rule: just start for 5 minutes</li>
                  <li>Remind yourself why this task matters</li>
                  <li>Reward yourself after completion</li>
                </ul>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 btn-secondary">
                Keep Trying
              </button>
              <button
                onClick={() => onConfirm(reason)}
                className="flex-1 btn-primary bg-gradient-to-r from-slate-500 to-slate-600"
              >
                <XCircle className="w-4 h-4 inline mr-2" />
                Skip for Now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
