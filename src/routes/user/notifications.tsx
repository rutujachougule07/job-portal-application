import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, Briefcase, Heart, FileText, User, Bell, Settings,
  Search, CheckCircle2, Info, Clock, Trash2, Check
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/user/notifications")({
  component: UserNotificationsPage,
});

const userNav: NavItem[] = [
  { label: "Dashboard", href: "/user/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Browse Jobs", href: "/jobs", icon: <Search className="size-4" /> },
  { label: "My Applications", href: "/user/applications", icon: <FileText className="size-4" /> },
  { label: "Saved Jobs", href: "/user/saved-jobs", icon: <Heart className="size-4" /> },
  { label: "My Profile", href: "/user/profile", icon: <User className="size-4" /> },
  { label: "Notifications", href: "/user/notifications", icon: <Bell className="size-4" /> },
  { label: "Settings", href: "/user/settings", icon: <Settings className="size-4" /> },
];

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "application" | "interview" | "recommendation";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Application Shortlisted!",
    message: "L&T Construction shortlisted your application for Site Civil Engineer.",
    time: "2 hours ago",
    read: false,
    type: "application",
  },
  {
    id: "notif-2",
    title: "Interview Scheduled",
    message: "TechNova Solutions scheduled a technical interview for Senior Full Stack Developer on Oct 2, 2026 at 11:00 AM.",
    time: "1 day ago",
    read: false,
    type: "interview",
  },
  {
    id: "notif-3",
    title: "New Job Match Found",
    message: "3 new React / TypeScript developer openings match your profile preferences.",
    time: "2 days ago",
    read: true,
    type: "recommendation",
  },
];

function UserNotificationsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/user/login" });
    else if (user?.role !== "user") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "user") return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.info("Cleared all notifications.");
  };

  return (
    <DashboardLayout navItems={userNav} title="Notifications" roleLabel="Worker">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-[#10233F]">Notifications</h2>
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
            <p className="text-sm font-bold text-[#10233F]">No notifications yet</p>
            <p className="text-xs font-semibold text-[#5B6B7F] mt-1">We'll alert you when employers update your application status.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                n.read ? "bg-white border-[#DCE5F0]" : "bg-[#F5F8FC] border-[#063B78]/30 shadow-xs"
              }`}
            >
              <div
                className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === "application"
                    ? "bg-[#FFC400]/20 text-[#082F63]"
                    : n.type === "interview"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {n.type === "application" && <Briefcase className="size-5" />}
                {n.type === "interview" && <Clock className="size-5" />}
                {n.type === "recommendation" && <Info className="size-5" />}
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
