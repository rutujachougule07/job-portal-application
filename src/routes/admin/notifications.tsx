import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, Users, BarChart2, Settings, Bell, Check, Trash2, Info, UserCheck, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotificationsPage,
});

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/admin/applications", icon: <FileText className="size-4" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="size-4" /> },
  { label: "Interviews", href: "/admin/interviews", icon: <Calendar className="size-4" /> },
  { label: "Company Profile", href: "/admin/company-profile", icon: <Briefcase className="size-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "Notifications", href: "/admin/notifications", icon: <Bell className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

const INITIAL_ADMIN_NOTIFS = [
  {
    id: "anotif-1",
    title: "New Application Received!",
    message: "A candidate submitted an application for Senior Full Stack Developer position.",
    time: "10 mins ago",
    read: false,
    type: "application",
  },
  {
    id: "anotif-2",
    title: "Interview Scheduled",
    message: "Interview round confirmed for Site Civil Engineer position on Oct 5, 2026.",
    time: "1 hour ago",
    read: false,
    type: "interview",
  },
  {
    id: "anotif-3",
    title: "Application Deadline Approaching",
    message: "Digital Marketing Specialist job posting deadline expires in 3 days.",
    time: "1 day ago",
    read: true,
    type: "alert",
  },
];

function AdminNotificationsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_ADMIN_NOTIFS);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
    else if (user?.role === "user") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role === "user") return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.info("Cleared all recruiter notifications.");
  };

  return (
    <DashboardLayout navItems={adminNav} title="Recruiter Notifications" roleLabel="Admin">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-black text-[#10233F]">Notifications & Alerts ({notifications.length})</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#063B78] hover:bg-[#EBF1F8] px-3 py-1.5 rounded-lg transition-colors"
          >
            <Check className="size-3.5" /> Mark all read
          </button>
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 className="size-3.5" /> Clear all
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#DCE5F0] p-12 text-center">
            <Bell className="size-12 text-[#DCE5F0] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#10233F]">No new notifications</p>
            <p className="text-xs font-semibold text-[#5B6B7F] mt-1">You will be notified when job seekers submit applications or interview updates occur.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                n.read ? "bg-white border-[#DCE5F0]" : "bg-[#F5F8FC] border-[#063B78]/30 shadow-xs"
              }`}
            >
              <div className="size-10 rounded-xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center shrink-0">
                <Bell className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black text-[#10233F]">{n.title}</p>
                  <span className="text-[10px] font-semibold text-[#5B6B7F]">{n.time}</span>
                </div>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-1">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
