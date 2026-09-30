import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, Users, BarChart2, Settings, TrendingUp, CheckCircle2, Eye, UserCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, StatCard, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore } from "@/lib/data-store";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReportsPage,
});

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/admin/applications", icon: <FileText className="size-4" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="size-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

function AdminReportsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
    else if (user?.role === "user") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role === "user") return null;

  const allJobs = dataStore.getAllJobs();
  const allApps = dataStore.getAllApplications();

  const stats = [
    { title: "Total Job Views", value: "2,450", icon: <Eye className="size-5" />, color: "blue" as const },
    { title: "Total Applications", value: allApps.length, icon: <FileText className="size-5" />, color: "yellow" as const },
    { title: "Interviews Conducted", value: allApps.filter((a) => a.status === "Interview").length, icon: <UserCheck className="size-5" />, color: "purple" as const },
    { title: "Hired Candidates", value: allApps.filter((a) => a.status === "Selected").length, icon: <CheckCircle2 className="size-5" />, color: "green" as const },
  ];

  return (
    <DashboardLayout navItems={adminNav} title="Recruitment Analytics & Reports" roleLabel="Admin">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Category Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 space-y-4">
          <h3 className="font-black text-[#10233F] text-sm">Top Performing Job Categories</h3>
          <div className="space-y-3">
            {[
              { category: "IT & Software", jobs: allJobs.filter((j) => j.category === "IT & Software").length, apps: 42, percentage: 85 },
              { category: "Engineering", jobs: allJobs.filter((j) => j.category === "Engineering").length, apps: 28, percentage: 65 },
              { category: "Sales & Marketing", jobs: allJobs.filter((j) => j.category === "Sales & Marketing").length, apps: 19, percentage: 45 },
              { category: "Human Resources", jobs: allJobs.filter((j) => j.category === "Human Resources").length, apps: 15, percentage: 35 },
            ].map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#10233F]">{cat.category}</span>
                  <span className="text-[#5B6B7F]">{cat.apps} Applicants</span>
                </div>
                <div className="h-2 w-full bg-[#F5F8FC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#063B78] rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Funnel */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 space-y-4">
          <h3 className="font-black text-[#10233F] text-sm">Candidate Hiring Funnel</h3>
          <div className="space-y-3">
            {[
              { label: "Applications Received", count: allApps.length || 12, color: "bg-blue-500" },
              { label: "Shortlisted Candidates", count: allApps.filter((a) => a.status === "Shortlisted").length, color: "bg-[#FFC400]" },
              { label: "Scheduled Interviews", count: allApps.filter((a) => a.status === "Interview").length, color: "bg-purple-500" },
              { label: "Selected / Hired", count: allApps.filter((a) => a.status === "Selected").length, color: "bg-green-500" },
            ].map((step) => (
              <div key={step.label} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC]">
                <div className="flex items-center gap-3">
                  <div className={`size-3 rounded-full ${step.color}`} />
                  <span className="text-xs font-bold text-[#10233F]">{step.label}</span>
                </div>
                <span className="text-xs font-black text-[#063B78]">{step.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
