"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  BarChart3,
  Settings,
  Users,
  X,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: KanbanSquare, label: "Kanban Board", href: "/kanban" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 glass-panel
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20 xl:w-64"}
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className={`font-semibold text-lg gradient-text ${!isOpen && "lg:hidden xl:block"}`}>
              VibeTasker
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 group
                  ${isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30"
                    : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                  }
                `}
              >
                <item.icon
                  className={`
                    w-5 h-5 transition-colors
                    ${isActive ? "text-purple-400" : "group-hover:text-purple-400"}
                  `}
                />
                <span className={`font-medium ${!isOpen && "lg:hidden xl:block"}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Daily BASE Indicator */}
        <div className={`p-4 border-t border-white/10 ${!isOpen && "lg:hidden xl:block"}`}>
          <div className="glass-card rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-foreground-muted">Daily BASE</span>
            </div>
            <p className="text-sm font-medium">3 tasks today</p>
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-medium">
              AR
            </div>
            <div className={`text-left ${!isOpen && "lg:hidden xl:block"}`}>
              <p className="text-sm font-medium">Alex Rivera</p>
              <p className="text-xs text-foreground-muted">Admin</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
