"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { mockUsers } from "@/lib/data/mock-data";
import { User } from "@/lib/types";
import { Mail, Shield, Calendar, MoreHorizontal, Plus, Crown } from "lucide-react";

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

interface TeamMemberCardProps {
  user: User;
  index: number;
}

function TeamMemberCard({ user, index }: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-card rounded-2xl p-6 group relative overflow-hidden"
    >
      {/* Background gradient on hover */}
      <motion.div
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500"
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold shadow-lg"
          >
            {user.avatar}
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-5 h-5 text-foreground-muted" />
          </motion.button>
        </div>

        <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
        <p className="text-sm text-foreground-muted mb-4">{user.email}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-foreground-muted" />
            <span className="capitalize flex items-center gap-1">
              {user.role}
              {user.role === "admin" && (
                <Crown className="w-3 h-3 text-amber-400" />
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-foreground-muted" />
            <span>
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Message
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  const stats = {
    total: mockUsers.length,
    admins: mockUsers.filter((u) => u.role === "admin").length,
    members: mockUsers.filter((u) => u.role === "member").length,
  };

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
          <h1 className="text-3xl font-bold mb-1">Team</h1>
          <p className="text-foreground-muted">
            Manage your team members and their roles
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Members", value: stats.total, color: "#8b5cf6" },
          { label: "Admins", value: stats.admins, color: "#f59e0b" },
          { label: "Members", value: stats.members, color: "#3b82f6" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-xl p-4"
          >
            <p className="text-sm text-foreground-muted mb-1">{stat.label}</p>
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-2xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>

      {/* Team Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUsers.map((user, index) => (
          <TeamMemberCard key={user.id} user={user} index={index} />
        ))}

        {/* Add Member Card */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-card rounded-2xl p-6 border-dashed border-2 border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex flex-col items-center justify-center min-h-[280px] group"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-8 h-8 text-foreground-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.div>
          <span className="font-medium text-foreground-muted group-hover:text-foreground transition-colors">
            Invite Team Member
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
