"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Moon,
  Globe,
  Shield,
  User,
  Palette,
  Zap,
  Save,
  Sparkles,
  PartyPopper,
  Image,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function SettingSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.005 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start gap-4 mb-6">
        <motion.div
          whileHover={{ rotate: 10 }}
          className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0"
        >
          <Icon className="w-5 h-5 text-purple-400" />
        </motion.div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-foreground-muted">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function Toggle({
  label,
  description,
  defaultChecked = false,
  onChange,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-foreground-muted">{description}</p>}
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const newValue = !checked;
          setChecked(newValue);
          onChange?.(newValue);
        }}
        className={`
          w-12 h-6 rounded-full transition-colors relative
          ${checked ? "bg-purple-500" : "bg-white/10"}
        `}
      >
        <motion.span
          animate={{ x: checked ? 24 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white"
        />
      </motion.button>
    </div>
  );
}

// Meme image options
const memeImages = [
  { id: "1", name: "Success Kid", preview: "👶" },
  { id: "2", name: "Doge", preview: "🐕" },
  { id: "3", name: "Pepe", preview: "🐸" },
  { id: "4", name: "Cat Thumbs Up", preview: "👍" },
];

export default function SettingsPage() {
  const [memeMode, setMemeMode] = useState(true);
  const [confettiEnabled, setConfettiEnabled] = useState(true);
  const [selectedMemes, setSelectedMemes] = useState<string[]>(["1", "2"]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const toggleMeme = (id: string) => {
    setSelectedMemes((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-foreground-muted">
          Manage your account and application preferences
        </p>
      </motion.div>

      {/* Settings Grid */}
      <div className="space-y-6">
        {/* Appearance */}
        <SettingSection
          title="Appearance"
          description="Customize how VibeTasker looks and feels"
          icon={Palette}
        >
          <div className="space-y-4">
            <Toggle
              label="Dark Mode"
              description="Always use dark theme"
              defaultChecked={true}
            />
            <div className="border-t border-white/10" />
            <Toggle
              label="Glassmorphism Effects"
              description="Enable frosted glass UI effects"
              defaultChecked={true}
            />
            <div className="border-t border-white/10" />
            <Toggle
              label="Animations"
              description="Enable smooth transitions and animations"
              defaultChecked={true}
            />
          </div>
        </SettingSection>

        {/* Celebration & Meme Mode */}
        <SettingSection
          title="Celebration & Memes"
          description="Customize your task completion celebrations"
          icon={PartyPopper}
        >
          <div className="space-y-4">
            <Toggle
              label="Meme Mode"
              description="Show celebration memes when completing tasks"
              defaultChecked={memeMode}
              onChange={setMemeMode}
            />
            <div className="border-t border-white/10" />
            <Toggle
              label="Confetti Effects"
              description="Celebrate with confetti on task completion"
              defaultChecked={confettiEnabled}
              onChange={setConfettiEnabled}
            />
            
            {/* Meme Selection */}
            {memeMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pt-4"
              >
                <label className="block text-sm font-medium mb-3">
                  <span className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Select Meme Images
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {memeImages.map((meme) => (
                    <motion.button
                      key={meme.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleMeme(meme.id)}
                      className={`
                        p-4 rounded-xl text-center transition-all
                        ${selectedMemes.includes(meme.id)
                          ? "bg-purple-500/20 border-2 border-purple-500/50"
                          : "glass-hover border-2 border-transparent"
                        }
                      `}
                    >
                      <div className="text-3xl mb-2">{meme.preview}</div>
                      <div className="text-xs text-foreground-muted">{meme.name}</div>
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-foreground-muted mt-2">
                  Selected memes will be shown randomly when you complete tasks
                </p>
              </motion.div>
            )}
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection
          title="Notifications"
          description="Configure when and how you receive updates"
          icon={Bell}
        >
          <div className="space-y-4">
            <Toggle
              label="Task Assignments"
              description="Notify when you&apos;re assigned to a task"
              defaultChecked={true}
            />
            <div className="border-t border-white/10" />
            <Toggle
              label="Due Date Reminders"
              description="Get reminded before tasks are due"
              defaultChecked={true}
            />
            <div className="border-t border-white/10" />
            <Toggle
              label="Team Updates"
              description="Notifications about team activity"
            />
            <div className="border-t border-white/10" />
            <Toggle
              label="Email Notifications"
              description="Receive updates via email"
            />
          </div>
        </SettingSection>

        {/* Account */}
        <SettingSection
          title="Account"
          description="Manage your account information"
          icon={User}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                defaultValue="Alex Rivera"
                className="input-glass"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue="alex@vibetasker.com"
                className="input-glass"
              />
            </div>
            <div className="pt-2">
              <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </SettingSection>

        {/* Privacy */}
        <SettingSection
          title="Privacy & Security"
          description="Control your privacy and security settings"
          icon={Shield}
        >
          <div className="space-y-4">
            <Toggle
              label="Two-Factor Authentication"
              description="Add an extra layer of security"
            />
            <div className="border-t border-white/10" />
            <Toggle
              label="Activity Status"
              description="Show when you&apos;re active"
              defaultChecked={true}
            />
            <div className="border-t border-white/10" />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete Account
            </motion.button>
          </div>
        </SettingSection>

        {/* Language */}
        <SettingSection
          title="Language & Region"
          description="Set your preferred language and timezone"
          icon={Globe}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select className="input-glass">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select className="input-glass">
                <option>UTC-08:00 Pacific Time</option>
                <option>UTC-05:00 Eastern Time</option>
                <option>UTC+00:00 London</option>
                <option>UTC+01:00 Berlin</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* Integrations */}
        <SettingSection
          title="Integrations"
          description="Connect with other tools and services"
          icon={Zap}
        >
          <div className="space-y-3">
            {[
              { name: "Slack", connected: true },
              { name: "GitHub", connected: false },
              { name: "Google Calendar", connected: true },
              { name: "Notion", connected: false },
            ].map((integration) => (
              <motion.div
                key={integration.name}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between py-2"
              >
                <span className="font-medium">{integration.name}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      integration.connected
                        ? "bg-green-500/15 text-green-400"
                        : "bg-white/5 text-foreground-muted hover:bg-white/10"
                    }
                  `}
                >
                  {integration.connected ? "Connected" : "Connect"}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </SettingSection>
      </div>

      {/* Save Button */}
      <motion.div
        variants={itemVariants}
        className="flex justify-end pt-6 border-t border-white/10"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
