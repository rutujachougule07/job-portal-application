import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, User, Bell, Settings, Heart, Search, Trash2, MapPin, DollarSign, FileCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/user/saved-jobs")({
  component: SavedJobsPage,
});

const userNav: NavItem[] = [
  { label: "Dashboard", href: "/user/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Browse Jobs", href: "/jobs", icon: <Search className="size-4" /> },
  { label: "My Applications", href: "/user/applications", icon: <FileText className="size-4" /> },
  { label: "Saved Jobs", href: "/user/saved-jobs", icon: <Heart className="size-4" /> },
  { label: "My Profile", href: "/user/profile", icon: <User className="size-4" /> },
  { label: "My Resume", href: "/user/resume", icon: <FileCheck className="size-4" /> },
  { label: "Notifications", href: "/user/notifications", icon: <Bell className="size-4" /> },
  { label: "Settings", href: "/user/settings", icon: <Settings className="size-4" /> },
];

function SavedJobsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [savedRecords, setSavedRecords] = useState<any[]>([]);

  const loadSavedJobs = () => {
    if (!user) return;
    const records = dataStore.getSavedJobs(user.id);
    setSavedRecords(records);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/user/login" });
    else if (user?.role !== "user") navigate({ to: "/unauthorized" });
    else loadSavedJobs();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "user") return null;

  const allJobs = dataStore.getAllJobs();

  const handleUnsave = (jobId: string) => {
    dataStore.removeSavedJob(user.id, jobId);
    toast.success("Job removed from saved list.");
    loadSavedJobs();
  };

  const savedJobs = savedRecords.map((s) => allJobs.find((j) => j.id === s.jobId)).filter(Boolean);

  return (
    <DashboardLayout navItems={userNav} title="Saved Jobs" roleLabel="Worker">
      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-12 text-center">
          <Heart className="size-12 text-[#DCE5F0] mx-auto mb-3" />
          <h3 className="font-black text-[#10233F] text-base">No Saved Jobs</h3>
          <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
            Save jobs while browsing to quickly apply or compare them later.
          </p>
          <Link
            to="/jobs"
            className="inline-block mt-4 bg-[#063B78] text-white font-black text-xs px-6 py-2.5 rounded-xl hover:bg-[#082F63] transition-all"
          >
            Browse Jobs →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map((job: any) => (
            <div key={job.id} className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs flex flex-col hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="size-10 rounded-xl bg-[#063B78] text-white font-black text-sm flex items-center justify-center shrink-0">
                  {job.initials || job.company?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[#10233F] text-sm truncate">{job.title}</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F] truncate">{job.company}</p>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B6B7F]">
                  <MapPin className="size-3.5 text-[#063B78]" /> {job.location}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B6B7F]">
                  <DollarSign className="size-3.5 text-green-600" /> {job.salary}
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <Link
                  to="/jobs/$jobId"
                  params={{ jobId: job.id }}
                  className="flex-1 text-center bg-[#063B78] text-white font-black text-xs py-2.5 rounded-xl hover:bg-[#082F63] transition-all"
                >
                  View Details & Apply
                </Link>
                <button
                  onClick={() => handleUnsave(job.id)}
                  className="p-2 rounded-xl border border-[#DCE5F0] text-red-500 hover:bg-red-50 transition-all"
                  title="Remove from saved jobs"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
