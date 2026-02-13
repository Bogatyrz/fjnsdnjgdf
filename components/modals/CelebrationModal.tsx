"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { X, Trophy, Sparkles, Zap, Target, PartyPopper } from "lucide-react";

// Google Drive meme image IDs - these are placeholder IDs
// Replace with actual Google Drive file IDs that are publicly shared
const MEME_IMAGES = {
  success: [
    "1aBcD123EfGhIjKlMnOp", // Replace with actual Google Drive file IDs
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

// Fallback emoji celebrations when images aren't available
const EMOJI_CELEBRATIONS = {
  success: ["🎉", "✨", "🌟", "🎊", "🏆"],
  streak: ["🔥", "💪", "⚡", "🚀", "⭐"],
  boss: ["👑", "🎯", "🏅", "💎", "🌟"],
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
  const [imageError, setImageError] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState<string[]>([]);

  // Trigger confetti with multiple bursts
  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#ec4899", "#10b981"];

    // Continuous confetti
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

    // Big burst from center
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors,
        startVelocity: 60,
      });
    }, 100);

    // Side bursts
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 30,
        spread: 50,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 80,
        angle: 150,
        spread: 50,
        origin: { x: 1, y: 0.7 },
        colors,
      });
    }, 400);

    // Final burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.8 },
        colors,
        scalar: 1.2,
      });
    }, 800);
  }, []);

  // Select random meme/celebration based on context
  const selectCelebration = useCallback(() => {
    let category: keyof typeof MEME_IMAGES = "success";
    
    if (streak >= 7) {
      category = "boss";
    } else if (streak >= 3) {
      category = "streak";
    }

    // Generate floating emojis
    const emojis = EMOJI_CELEBRATIONS[category];
    const shuffled = [...emojis].sort(() => 0.5 - Math.random());
    setCelebrationEmojis(shuffled.slice(0, 5));

    // Select meme image
    const images = MEME_IMAGES[category];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }, [streak]);

  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
      setImageError(false);
      
      if (mode === "meme") {
        setTimeout(() => {
          setSelectedMeme(selectCelebration());
          setShowMeme(true);
        }, 500);
      }
    } else {
      setShowMeme(false);
      setSelectedMeme(null);
      setCelebrationEmojis([]);
    }
  }, [isOpen, mode, selectCelebration, triggerConfetti]);

  // Get celebration message
  const getCelebrationMessage = () => {
    if (streak >= 7) return "🔥 You're on fire! Legendary streak! 🔥";
    if (streak >= 3) return "💪 Keep the streak going! You're crushing it!";
    if (totalCompleted >= 10) return "🏆 Task Master! Incredible work!";
    if (totalCompleted >= 5) return "⭐ You're on a roll! Keep it up!";
    return "✨ Task Completed! Great job! ✨";
  };

  // Get Google Drive image URL
  const getMemeUrl = (fileId: string) => {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

          {/* Floating Emojis */}
          <AnimatePresence>
            {celebrationEmojis.map((emoji, index) => (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  y: 100, 
                  x: (index - 2) * 60,
                  scale: 0 
                }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  y: [-50, -150, -200],
                  x: (index - 2) * 60 + (Math.random() - 0.5) * 40,
                  scale: [0, 1.5, 1],
                  rotate: [0, 20, -20, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="absolute bottom-1/2 text-4xl pointer-events-none"
              >
                {emoji}
              </motion.div>
            ))}
          </AnimatePresence>

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
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: 1 }}
                  >
                    <Trophy className="w-10 h-10 text-white" />
                  </motion.div>
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
                  <motion.p 
                    className="text-lg font-semibold"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    &ldquo;{taskTitle}&rdquo;
                  </motion.p>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <motion.div 
                    className="glass rounded-xl p-4 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Zap className="w-4 h-4 text-amber-400" />
                      </motion.div>
                      <span className="text-2xl font-bold text-amber-400">{streak}</span>
                    </div>
                    <p className="text-xs text-foreground-muted">Day Streak</p>
                  </motion.div>
                  <motion.div 
                    className="glass rounded-xl p-4 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-green-400" />
                      <span className="text-2xl font-bold text-green-400">{totalCompleted}</span>
                    </div>
                    <p className="text-xs text-foreground-muted">Total Done</p>
                  </motion.div>
                </motion.div>

                {/* Meme Image (if meme mode) */}
                <AnimatePresence>
                  {showMeme && selectedMeme && mode === "meme" && !imageError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="rounded-xl overflow-hidden"
                    >
                      <img
                        src={getMemeUrl(selectedMeme)}
                        alt="Celebration meme"
                        className="w-full h-auto max-h-48 object-contain"
                        onError={() => setImageError(true)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Fallback when image fails or no meme mode */}
                {(imageError || mode !== "meme") && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center gap-2 text-4xl"
                  >
                    {celebrationEmojis.slice(0, 3).map((emoji, index) => (
                      <motion.span
                        key={index}
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1.5, 
                          delay: index * 0.2 
                        }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-3"
                >
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    Awesome!
                  </motion.button>
                </motion.div>

                {/* Meme mode toggle hint */}
                <motion.p 
                  className="text-xs text-center text-foreground-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {mode === "meme" 
                    ? "🎭 Meme mode is ON - Keep up the great work!" 
                    : "💡 Tip: Enable meme mode in settings for extra fun!"}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
