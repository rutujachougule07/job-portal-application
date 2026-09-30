import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, Briefcase, FileText, Users, BarChart2,
  Settings, Plus, Eye, Edit2, Trash2, CheckCircle2, PauseCircle, XCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, StatCard, StatusBadge, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardPage,
});

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/admin/applications", icon: <FileText className="size-4" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="size-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
    else if (user?.role === "user") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role === "user") return null;

  const allJobs = dataStore.getActiveJobs();
  const allApps = dataStore.getAllApplications ? dataStore.getAllApplications() : 
    JSON.parse(localStorage.getItem("realjob_applications") || "[]");

  const stats = [
    { title: "Total Jobs", value: allJobs.length, icon: <Briefcase className="size-5" />, color: "blue" as const },
    { title: "Total Applications", value: allApps.length, icon: <FileText className="size-5" />, color: "yellow" as const },
    { title: "Shortlisted", value: allApps.filter((a: any) => a.status === "Shortlisted").length, icon: <CheckCircle2 className="size-5" />, color: "green" as const },
    { title: "Pending Review", value: allApps.filter((a: any) => a.status === "Applied").length, icon: <PauseCircle className="size-5" />, color: "purple" as const },
  ];

  const recentApps = allApps.slice(0, 8);
  const recentJobs = allJobs.slice(0, 6);

  return (
    <DashboardLayout navItems={adminNav} title="Admin Dashboard" roleLabel="Admin">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#10233F] to-[#063B78] rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black">Admin Panel — {user?.name}</h2>
            <p className="text-white/70 text-sm font-semibold mt-1">
              {allApps.length} total applications · {allJobs.length} active jobs
            </p>
          </div>
          <Link to="/admin/jobs"
            className="hidden sm:inline-flex items-center gap-2 bg-[#FFC400] text-[#082F63] font-black text-xs px-4 py-2.5 rounded-xl hover:bg-yellow-300 transition-all">
            <Plus className="size-4" /> Post New Job
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#10233F] text-sm">Recent Applications</h3>
            <Link to="/admin/applications" className="text-xs font-bold text-[#063B78] hover:underline">View All</Link>
          </div>
          {recentApps.length === 0 ? (
            <p className="text-xs font-semibold text-[#5B6B7F] text-center py-8">No applications yet.</p>
          ) : (
            <div className="space-y-2">
              {recentApps.map((app: any) => (
                <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F8FC]">
                  <div className="size-8 rounded-lg bg-[#063B78] text-white font-black text-xs flex items-center justify-center shrink-0">
                    {app.candidateName?.charAt(0) || "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#10233F] truncate">{app.candidateName}</p>
                    <p className="text-[10px] font-semibold text-[#5B6B7F] truncate">{app.jobTitle}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#10233F] text-sm">Active Job Listings</h3>
            <Link to="/admin/jobs" className="text-xs font-bold text-[#063B78] hover:underline">Manage</Link>
          </div>
          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs font-semibold text-[#5B6B7F]">No jobs posted yet.</p>
              <Link to="/admin/jobs" className="text-xs font-black text-[#063B78] hover:underline mt-1 inline-block">Post a Job →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F8FC]">
                  <div className="size-8 rounded-lg bg-[#FFC400]/20 text-[#082F63] font-black text-xs flex items-center justify-center shrink-0">
                    {job.initials || job.company?.charAt(0) || "J"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#10233F] truncate">{job.title}</p>
                    <p className="text-[10px] font-semibold text-[#5B6B7F] truncate">{job.company} · {job.location}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
