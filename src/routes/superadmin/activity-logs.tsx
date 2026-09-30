import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Users, ShieldCheck, Briefcase, FileText, BarChart2, Settings, Activity } from "lucide-react";
import { useAuth, getActivityLogs } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/superadmin/activity-logs")({
  component: ActivityLogsPage,
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

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-green-100 text-green-700",
  LOGOUT: "bg-gray-100 text-gray-600",
  USER_CREATED: "bg-blue-100 text-blue-700",
  USER_DELETED: "bg-red-100 text-red-700",
  USER_DISABLED: "bg-orange-100 text-orange-700",
  USER_ACTIVATED: "bg-green-100 text-green-700",
};

function ActivityLogsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/superadmin/login" });
    else if (user?.role !== "superadmin") navigate({ to: "/unauthorized" });
    else setLogs(getActivityLogs());
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "superadmin") return null;

  const filtered = logs.filter((l) =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.userName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={superAdminNav} title="Activity Logs" roleLabel="Super Admin">
      <div className="mb-5">
        <input
          type="text" placeholder="Search by action or user..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-sm font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78] transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#DCE5F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DCE5F0] bg-[#F5F8FC]">
                {["Action", "User", "Details", "Timestamp"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-black uppercase tracking-wide text-[#5B6B7F] px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0]">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-xs font-semibold text-[#5B6B7F]">No activity logs found.</td></tr>
              ) : filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#F5F8FC] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black ${ACTION_COLORS[log.action] || "bg-gray-100 text-gray-600"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#10233F]">{log.userName}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#5B6B7F]">{log.details || "—"}</td>
                  <td className="px-4 py-3 text-[10px] font-semibold text-[#5B6B7F]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
