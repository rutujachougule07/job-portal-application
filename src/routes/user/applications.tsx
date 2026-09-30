import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, User, Bell, Settings, Heart, Search, Filter, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, StatusBadge, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore, ApplicationRecord } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/user/applications")({
  component: UserApplicationsPage,
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

const STATUS_FILTERS = ["All", "Applied", "Viewed", "Shortlisted", "Interview", "Selected", "Rejected"];

function UserApplicationsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/user/login" });
    else if (user?.role !== "user") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "user") return null;

  const allApps: ApplicationRecord[] = dataStore.getApplicationsByJobSeeker(user.id);
  const filtered = filter === "All" ? allApps : allApps.filter((a: ApplicationRecord) => a.status === filter);

  const statusProgress: Record<string, number> = {
    Applied: 10, Viewed: 25, Shortlisted: 50, Interview: 75, Selected: 100, Rejected: 0,
  };

  return (
    <DashboardLayout navItems={userNav} title="My Applications" roleLabel="Worker">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
              filter === s ? "bg-[#063B78] text-white" : "bg-white border border-[#DCE5F0] text-[#5B6B7F] hover:bg-[#F5F8FC]"
            }`}>
            {s}
            {s !== "All" && (
              <span className="ml-1.5 opacity-60">({allApps.filter((a: ApplicationRecord) => a.status === s).length})</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-12 text-center">
          <Briefcase className="size-12 text-[#DCE5F0] mx-auto mb-3" />
          <h3 className="font-black text-[#10233F] text-base">No Applications Found</h3>
          <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
            {filter === "All" ? "You haven't applied to any jobs yet." : `No applications with status "${filter}".`}
          </p>
          <Link to="/jobs" className="inline-block mt-4 bg-[#063B78] text-white font-black text-xs px-6 py-2.5 rounded-xl hover:bg-[#082F63] transition-all">
            Browse Jobs →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app: ApplicationRecord) => (
            <div key={app.id} className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-[#063B78] text-white font-black text-sm flex items-center justify-center shrink-0">
                  {app.companyName?.charAt(0) || "J"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-[#10233F] text-sm">{app.jobTitle}</h3>
                      <p className="text-xs font-semibold text-[#5B6B7F]">{app.companyName} · {app.location}</p>
                      <p className="text-[10px] font-semibold text-[#5B6B7F] mt-1">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  {/* Progress bar */}
                  {app.status !== "Rejected" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] font-black text-[#5B6B7F] mb-1.5">
                        {["Applied", "Viewed", "Shortlisted", "Interview", "Selected"].map((s) => (
                          <span key={s} className={app.status === s ? "text-[#063B78]" : ""}>{s}</span>
                        ))}
                      </div>
                      <div className="h-1.5 bg-[#EBF1F8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#063B78] to-[#FFC400] rounded-full transition-all"
                          style={{ width: `${statusProgress[app.status] || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {app.status === "Rejected" && (
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600">
                      ✗ Application not shortlisted. Keep trying!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
