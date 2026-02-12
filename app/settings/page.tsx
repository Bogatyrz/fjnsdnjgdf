"use client";

import { useState } from "react";
import {
  Bell,
  Moon,
  Globe,
  Shield,
  User,
  Palette,
  Zap,
  Save,
} from "lucide-react";

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
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-foreground-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Toggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-foreground-muted">{description}</p>}
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`
          w-12 h-6 rounded-full transition-colors relative
          ${checked ? "bg-purple-500" : "bg-white/10"}
        `}
      >
        <span
          className={`
            absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
            ${checked ? "left-7" : "left-1"}
          `}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-foreground-muted">
          Manage your account and application preferences
        </p>
      </div>

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
              <button className="text-sm text-purple-400 hover:text-purple-300">
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
            <button className="text-red-400 hover:text-red-300 text-sm">
              Delete Account
            </button>
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
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between py-2"
              >
                <span className="font-medium">{integration.name}</span>
                <button
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
                </button>
              </div>
            ))}
          </div>
        </SettingSection>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-white/10">
        <button className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
