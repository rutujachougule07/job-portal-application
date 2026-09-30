/**
 * Shared dashboard layout used by User, Admin, and Super Admin.
 * Pass navItems and role color to customize per-role sidebar.
 */
import { useState, ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Briefcase, LogOut, Menu, X, ChevronRight, Bell
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
  accentColor?: string; // hex or tailwind class
  roleLabel: string;
}

export function DashboardLayout({
  children,
  navItems,
  title,
  roleLabel,
  accentColor = "#063B78",
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate({ to: "/" });
  };

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex">
      {/* ── Mobile overlay ───────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#10233F] flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 shrink-0">
          <div className="size-9 rounded-xl bg-[#FFC400] flex items-center justify-center">
            <Briefcase className="size-5 text-[#082F63]" />
          </div>
          <div>
            <span className="text-white font-black text-sm">REAL JOB</span>
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">{roleLabel}</p>
          </div>
          <button className="ml-auto lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="size-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group
                  ${active
                    ? "bg-[#FFC400] text-[#082F63]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span className="size-5 flex items-center justify-center shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-[#082F63]/20 text-[#082F63]" : "bg-white/20 text-white"}`}>
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`size-4 transition-transform ${active ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-xl bg-[#FFC400] flex items-center justify-center font-black text-[#082F63] text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-black truncate">{user?.name}</p>
              <p className="text-white/40 text-[10px] font-semibold truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs font-bold transition-all"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#DCE5F0] flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-xl text-[#5B6B7F] hover:bg-[#F5F8FC]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <h1 className="text-sm font-black text-[#10233F] flex-1">{title}</h1>

          <button className="relative p-2 rounded-xl text-[#5B6B7F] hover:bg-[#F5F8FC]">
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-[#063B78] flex items-center justify-center font-black text-white text-xs">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-xs font-black text-[#10233F] hidden sm:block">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Stat card helper ─────────────────────────────────────────────────────────
export function StatCard({
  title, value, icon, color = "blue", sub
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: "blue" | "yellow" | "green" | "red" | "purple";
  sub?: string;
}) {
  const colors = {
    blue: "bg-[#063B78]/10 text-[#063B78]",
    yellow: "bg-[#FFC400]/20 text-[#082F63]",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 flex items-center gap-4 shadow-sm">
      <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-[#5B6B7F]">{title}</p>
        <p className="text-2xl font-black text-[#10233F] leading-none mt-0.5">{value}</p>
        {sub && <p className="text-[10px] font-semibold text-[#5B6B7F] mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Applied: "bg-blue-100 text-blue-700",
    Viewed: "bg-gray-100 text-gray-600",
    Shortlisted: "bg-[#FFC400]/20 text-[#082F63]",
    Interview: "bg-purple-100 text-purple-700",
    Selected: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Active: "bg-green-100 text-green-700",
    Closed: "bg-gray-100 text-gray-600",
    Draft: "bg-yellow-100 text-yellow-700",
    Paused: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
