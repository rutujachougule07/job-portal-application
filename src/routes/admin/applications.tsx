import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, Users, BarChart2, Settings, Search, CheckCircle2, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, StatusBadge, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore, ApplicationStatus, ApplicationRecord } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/applications")({
  component: AdminApplicationsPage,
});

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/admin/applications", icon: <FileText className="size-4" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="size-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

const STATUSES: ApplicationStatus[] = ["Applied", "Viewed", "Shortlisted", "Interview", "Selected", "Rejected"];

function AdminApplicationsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState<ApplicationRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadApps = () => {
    setApps(dataStore.getAllApplications());
  };

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
    else if (user?.role === "user") navigate({ to: "/unauthorized" });
    else {
      loadApps();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role === "user") return null;

  const filtered = apps.filter((a) => {
    const matchesSearch =
      a.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      a.candidateEmail?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: ApplicationStatus) => {
    dataStore.updateApplicationStatus(id, status);
    toast.success(`Candidate status updated to "${status}"`);
    loadApps();
  };

  return (
    <DashboardLayout navItems={adminNav} title="Applications & Candidates" roleLabel="Admin">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
          <input
            type="text"
            placeholder="Search by candidate name, job title, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#5B6B7F]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-bold text-[#10233F] focus:outline-none focus:border-[#063B78]"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-[#DCE5F0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DCE5F0] bg-[#F5F8FC]">
                {["Candidate", "Job Applied For", "Company", "Applied Date", "Current Status", "Update Status"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-black uppercase tracking-wide text-[#5B6B7F] px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-xs font-semibold text-[#5B6B7F]">
                    No candidate applications match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F5F8FC] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-[#063B78] text-white font-black text-xs flex items-center justify-center shrink-0">
                          {app.candidateName?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#10233F]">{app.candidateName}</p>
                          <p className="text-[10px] font-semibold text-[#5B6B7F]">{app.candidateEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-[#10233F]">{app.jobTitle}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#5B6B7F]">{app.companyName}</td>
                    <td className="px-4 py-3 text-[10px] font-semibold text-[#5B6B7F]">{app.appliedDate}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                        className="h-8 px-2 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] text-xs font-black text-[#10233F] focus:outline-none focus:border-[#063B78] cursor-pointer"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
