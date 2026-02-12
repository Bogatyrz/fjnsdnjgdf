"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { X, Trophy, Sparkles, Zap, Target } from "lucide-react";

// Google Drive meme image IDs (replace with actual IDs)
const MEME_IMAGES = {
  success: [
    "1aBcD123EfGhIjKlMnOp", // Placeholder - replace with actual Google Drive file IDs
    "2bCdE234FgHiJkLmNoPq",
    "3cDeF345GhIjKlMnOpQr",
  ],
  streak: [
    "4dEfG456HiJkLmNoPqRs",
    "5eFgH567IjKlMnOpQrSt",
  ],
  boss: [
    "6fGhI678JkLmNoPqRsTu",
    "7gHiJ789KlMnOpQrStUv",
  ],
};

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  streak?: number;
  totalCompleted?: number;
  mode?: "default" | "meme";
}

export function CelebrationModal({
  isOpen,
  onClose,
  taskTitle,
  streak = 0,
  totalCompleted = 0,
  mode = "default",
}: CelebrationModalProps) {
  const [showMeme, setShowMeme] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState<string | null>(null);

  // Trigger confetti
  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#ec4899", "#10b981"];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
    }, 100);
  }, []);

  // Select random meme based on context
  const selectMeme = useCallback(() => {
    let category: keyof typeof MEME_IMAGES = "success";
    
    if (streak >= 7) {
      category = "boss";
    } else if (streak >= 3) {
      category = "streak";
    }

    const images = MEME_IMAGES[category];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }, [streak]);

  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
      
      if (mode === "meme") {
        setTimeout(() => {
          setSelectedMeme(selectMeme());
          setShowMeme(true);
        }, 500);
      }
    } else {
      setShowMeme(false);
      setSelectedMeme(null);
    }
  }, [isOpen, mode, selectMeme, triggerConfetti]);

  // Get celebration message
  const getCelebrationMessage = () => {
    if (streak >= 7) return "🔥 You're on fire! 🔥";
    if (streak >= 3) return "💪 Keep the streak going!";
    if (totalCompleted >= 10) return "🏆 Task Master!";
    return "✨ Task Completed! ✨";
  };

  // Get Google Drive image URL
  const getMemeUrl = (fileId: string) => {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md"
          >
            <div className="glass-card rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="relative p-8 text-center bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold gradient-text"
                >
                  {getCelebrationMessage()}
                </motion.h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Task Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <p className="text-foreground-muted text-sm mb-2">You completed</p>
                  <p className="text-lg font-semibold">{taskTitle}</p>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-2xl font-bold text-amber-400">{streak}</span>
                    </div>
                    <p className="text-xs text-foreground-muted">Day Streak</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-green-400" />
                      <span className="text-2xl font-bold text-green-400">{totalCompleted}</span>
                    </div>
                    <p className="text-xs text-foreground-muted">Total Done</p>
                  </div>
                </motion.div>

                {/* Meme Image (if meme mode) */}
                <AnimatePresence>
                  {showMeme && selectedMeme && mode === "meme" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="rounded-xl overflow-hidden"
                    >
                      <img
                        src={getMemeUrl(selectedMeme)}
                        alt="Celebration meme"
                        className="w-full h-auto"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-3"
                >
                  <button
                    onClick={onClose}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Awesome!
                  </button>
                </motion.div>

                {/* Meme mode toggle hint */}
                <p className="text-xs text-center text-foreground-muted">
                  {mode === "meme" 
                    ? "Meme mode is ON 🎭" 
                    : "Tip: Enable meme mode in settings for extra fun!"}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
