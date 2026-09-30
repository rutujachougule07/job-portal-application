import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, Briefcase, Heart, FileText, User, Bell, Settings,
  Search, TrendingUp, CheckCircle2, Clock, XCircle, Star
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, StatCard, StatusBadge, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore } from "@/lib/data-store";
import { useEffect } from "react";

export const Route = createFileRoute("/user/dashboard")({
  component: UserDashboardPage,
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

function UserDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/user/login" });
    else if (user?.role !== "user") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "user") return null;

  const allApps = dataStore.getJobSeekerApplications(user.id) || [];
  const savedJobs = dataStore.getSavedJobs(user.id) || [];
  const activeJobs = dataStore.getActiveJobs().slice(0, 6);

  const statusCount = (s: string) => allApps.filter((a) => a.status === s).length;

  const stats = [
    { title: "Total Applied", value: allApps.length, icon: <Briefcase className="size-5" />, color: "blue" as const },
    { title: "Shortlisted", value: statusCount("Shortlisted"), icon: <Star className="size-5" />, color: "yellow" as const },
    { title: "Interview", value: statusCount("Interview"), icon: <Clock className="size-5" />, color: "purple" as const },
    { title: "Saved Jobs", value: savedJobs.length, icon: <Heart className="size-5" />, color: "green" as const },
  ];

  return (
    <DashboardLayout navItems={userNav} title="My Dashboard" roleLabel="Worker">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#063B78] to-[#125BB5] rounded-2xl p-6 text-white mb-6">
        <h2 className="text-xl font-black">Welcome back, {user.name}! 👋</h2>
        <p className="text-white/70 text-sm font-semibold mt-1">
          You have <span className="text-[#FFC400] font-black">{allApps.length}</span> application{allApps.length !== 1 ? "s" : ""} in progress.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/jobs" className="inline-flex items-center gap-2 bg-[#FFC400] text-[#082F63] font-black text-xs px-4 py-2 rounded-xl hover:bg-yellow-300 transition-all">
            <Search className="size-3.5" /> Browse Jobs
          </Link>
          <Link to="/user/applications" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
            My Applications →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Recent Applications */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#10233F] text-sm">Recent Applications</h3>
            <Link to="/user/applications" className="text-xs font-bold text-[#063B78] hover:underline">View All</Link>
          </div>
          {allApps.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="size-10 text-[#DCE5F0] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#5B6B7F]">No applications yet.</p>
              <Link to="/jobs" className="text-xs font-black text-[#063B78] hover:underline mt-1 inline-block">Browse Jobs →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {allApps.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F8FC]">
                  <div className="size-9 rounded-lg bg-[#063B78] text-white font-black text-xs flex items-center justify-center shrink-0">
                    {app.companyName?.charAt(0) || "J"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#10233F] truncate">{app.jobTitle}</p>
                    <p className="text-[10px] font-semibold text-[#5B6B7F] truncate">{app.companyName}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Jobs */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#10233F] text-sm">Latest Jobs For You</h3>
            <Link to="/jobs" className="text-xs font-bold text-[#063B78] hover:underline">View All</Link>
          </div>
          {activeJobs.length === 0 ? (
            <p className="text-xs font-semibold text-[#5B6B7F] text-center py-8">No jobs available right now.</p>
          ) : (
            <div className="space-y-3">
              {activeJobs.map((job) => (
                <Link key={job.id} to="/jobs/$jobId" params={{ jobId: job.id }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F8FC] hover:bg-[#EBF1F8] transition-colors group">
                  <div className="size-9 rounded-lg bg-[#063B78]/10 text-[#063B78] font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-[#FFC400] group-hover:text-[#082F63] transition-colors">
                    {job.initials || job.company?.charAt(0) || "J"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#10233F] truncate">{job.title}</p>
                    <p className="text-[10px] font-semibold text-[#5B6B7F] truncate">{job.company} · {job.location}</p>
                  </div>
                  <span className="text-[10px] font-black text-[#063B78] bg-[#EBF1F8] px-2 py-0.5 rounded-full shrink-0">{job.salary?.split(" ")[0]}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
