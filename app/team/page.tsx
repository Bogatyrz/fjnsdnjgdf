"use client";

import { mockUsers } from "@/lib/data/mock-data";
import { User } from "@/lib/types";
import { Mail, Shield, Calendar, MoreHorizontal } from "lucide-react";

function TeamMemberCard({ user }: { user: User }) {
  return (
    <div className="glass-card rounded-2xl p-6 group hover:scale-[1.02] transition-transform">
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
          {user.avatar}
        </div>
        <button className="p-2 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-5 h-5 text-foreground-muted" />
        </button>
      </div>

      <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
      <p className="text-sm text-foreground-muted mb-4">{user.email}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-foreground-muted" />
          <span className="capitalize">{user.role}</span>
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

      <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
        <button className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          Message
        </button>
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Team</h1>
          <p className="text-foreground-muted">
            Manage your team members and their roles
          </p>
        </div>
        <button className="btn-primary">Invite Member</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm text-foreground-muted mb-1">Total Members</p>
          <p className="text-2xl font-bold">{mockUsers.length}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm text-foreground-muted mb-1">Admins</p>
          <p className="text-2xl font-bold">
            {mockUsers.filter((u) => u.role === "admin").length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm text-foreground-muted mb-1">Members</p>
          <p className="text-2xl font-bold">
            {mockUsers.filter((u) => u.role === "member").length}
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUsers.map((user) => (
          <TeamMemberCard key={user.id} user={user} />
        ))}

        {/* Add Member Card */}
        <button className="glass-card rounded-2xl p-6 border-dashed border-2 border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex flex-col items-center justify-center min-h-[280px] group">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
            <svg
              className="w-8 h-8 text-foreground-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-medium text-foreground-muted group-hover:text-foreground transition-colors">
            Invite Team Member
          </span>
        </button>
      </div>
    </div>
  );
}
