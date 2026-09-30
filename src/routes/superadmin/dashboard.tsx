import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, ShieldCheck, Briefcase, FileText,
  BarChart2, Settings, Activity, Crown, UserCheck, UserX, RefreshCw
} from "lucide-react";
import { useAuth, getAllUsers, saveUsers, getActivityLogs } from "@/lib/auth-context";
import { DashboardLayout, StatCard, StatusBadge, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/superadmin/dashboard")({
  component: SuperAdminDashboardPage,
});

const superAdminNav: NavItem[] = [
  { label: "Dashboard", href: "/superadmin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "User Management", href: "/superadmin/users", icon: <Users className="size-4" /> },
  { label: "Admin Management", href: "/superadmin/admins", icon: <ShieldCheck className="size-4" /> },
  { label: "Job Management", href: "/superadmin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/superadmin/applications", icon: <FileText className="size-4" /> },
  { label: "Activity Logs", href: "/superadmin/activity-logs", icon: <Activity className="size-4" /> },
  { label: "Reports", href: "/superadmin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "System Settings", href: "/superadmin/settings", icon: <Settings className="size-4" /> },
];

function SuperAdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(getAllUsers());
  const [logs, setLogs] = useState(getActivityLogs().slice(0, 10));

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/superadmin/login" });
    else if (user?.role !== "superadmin") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "superadmin") return null;

  const allJobs = dataStore.getActiveJobs();
  const allApps = JSON.parse(localStorage.getItem("realjob_applications") || "[]");
  const regularUsers = users.filter((u) => u.role === "user");
  const admins = users.filter((u) => u.role === "admin");

  const stats = [
    { title: "Total Users", value: regularUsers.length, icon: <Users className="size-5" />, color: "blue" as const },
    { title: "Total Admins", value: admins.length, icon: <ShieldCheck className="size-5" />, color: "purple" as const },
    { title: "Total Jobs", value: allJobs.length, icon: <Briefcase className="size-5" />, color: "yellow" as const },
    { title: "Total Applications", value: allApps.length, icon: <FileText className="size-5" />, color: "green" as const },
  ];

  const handleToggleUser = (id: string, disabled: boolean) => {
    const updated = users.map((u) => u.id === id ? { ...u, disabled: !disabled } : u);
    saveUsers(updated);
    setUsers(updated);
    toast.success(disabled ? "User activated." : "User disabled.");
  };

  return (
    <DashboardLayout navItems={superAdminNav} title="Super Admin Dashboard" roleLabel="Super Admin">
      {/* Crown header */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Crown className="size-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="size-5 text-[#FFC400]" />
            <span className="text-[#FFC400] text-xs font-black uppercase tracking-widest">System Administrator</span>
          </div>
          <h2 className="text-2xl font-black">Welcome, {user?.name}</h2>
          <p className="text-white/60 text-sm font-semibold mt-1">
            You have complete system-level control over all modules.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#10233F] text-sm">Recent Registered Users</h3>
            <Link to="/superadmin/users" className="text-xs font-bold text-[#063B78] hover:underline">Manage All</Link>
          </div>
          <div className="space-y-2">
            {regularUsers.slice(0, 6).map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F8FC]">
                <div className="size-8 rounded-lg bg-[#063B78] text-white font-black text-xs flex items-center justify-center shrink-0">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[#10233F] truncate">{u.name}</p>
                  <p className="text-[10px] font-semibold text-[#5B6B7F] truncate">{u.email}</p>
                </div>
                <button
                  onClick={() => handleToggleUser(u.id, u.disabled)}
                  className={`p-1.5 rounded-lg transition-colors ${u.disabled ? "text-green-600 hover:bg-green-50" : "text-red-500 hover:bg-red-50"}`}
                  title={u.disabled ? "Activate" : "Disable"}
                >
                  {u.disabled ? <UserCheck className="size-4" /> : <UserX className="size-4" />}
                </button>
              </div>
            ))}
            {regularUsers.length === 0 && (
              <p className="text-xs font-semibold text-[#5B6B7F] text-center py-6">No users registered yet.</p>
            )}
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#10233F] text-sm">Recent Activity</h3>
            <Link to="/superadmin/activity-logs" className="text-xs font-bold text-[#063B78] hover:underline">View All</Link>
          </div>
          <div className="space-y-2">
            {logs.slice(0, 6).map((log: any) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#F5F8FC]">
                <div className="size-2 rounded-full bg-[#063B78] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[#10233F]">{log.action}</p>
                  <p className="text-[10px] font-semibold text-[#5B6B7F] truncate">{log.userName} · {new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-xs font-semibold text-[#5B6B7F] text-center py-6">No activity logs yet.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
