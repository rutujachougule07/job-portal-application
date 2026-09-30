import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Briefcase, Heart, FileText, User, Bell, Settings,
  Search, Key, Shield, Lock, CheckCircle2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/user/settings")({
  component: UserSettingsPage,
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

function UserSettingsPage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/user/login" });
    else if (user?.role !== "user") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "user") return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <DashboardLayout navItems={userNav} title="Account Settings" roleLabel="Worker">
      <div className="max-w-2xl space-y-6">
        {/* Account Settings */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 space-y-4">
          <h3 className="font-black text-[#10233F] text-sm flex items-center gap-2">
            <Lock className="size-4 text-[#063B78]" /> Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="w-full h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#063B78] text-white font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[#082F63] transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Notifications Preferences */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 space-y-4">
          <h3 className="font-black text-[#10233F] text-sm flex items-center gap-2">
            <Bell className="size-4 text-[#063B78]" /> Notification Preferences
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] cursor-pointer">
              <div>
                <p className="text-xs font-bold text-[#10233F]">Email Notifications</p>
                <p className="text-[10px] text-[#5B6B7F]">Receive email alerts when application status changes</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="size-4 accent-[#063B78] rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] cursor-pointer">
              <div>
                <p className="text-xs font-bold text-[#10233F]">SMS Notifications</p>
                <p className="text-[10px] text-[#5B6B7F]">Receive WhatsApp & SMS job interview updates</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="size-4 accent-[#063B78] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
