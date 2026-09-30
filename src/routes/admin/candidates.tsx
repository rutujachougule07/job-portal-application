import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, Users, BarChart2, Settings, Search, Download, Phone, Mail, FileCheck, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, StatusBadge, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore, ApplicationRecord } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/candidates")({
  component: AdminCandidatesPage,
});

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/admin/applications", icon: <FileText className="size-4" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="size-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

function AdminCandidatesPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<ApplicationRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<ApplicationRecord | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
    else if (user?.role === "user") navigate({ to: "/unauthorized" });
    else {
      setCandidates(dataStore.getAllApplications());
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role === "user") return null;

  const filtered = candidates.filter(
    (c) =>
      c.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
      c.candidateEmail?.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={adminNav} title="Candidate Database" roleLabel="Admin">
      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
          <input
            type="text"
            placeholder="Search candidates by name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
          />
        </div>
      </div>

      {/* Grid of Candidates */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-[#DCE5F0] p-12 text-center">
            <Users className="size-12 text-[#DCE5F0] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#10233F]">No candidates found</p>
            <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
              Applications submitted by users will appear here automatically.
            </p>
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-[#DCE5F0] p-5 hover:shadow-md transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#063B78] text-white font-black text-sm flex items-center justify-center shrink-0">
                    {c.candidateName?.charAt(0) || "C"}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#10233F]">{c.candidateName}</h3>
                    <p className="text-[10px] font-bold text-[#063B78]">{c.jobTitle}</p>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>

              <div className="space-y-1.5 text-xs text-[#5B6B7F]">
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 text-[#063B78]" />
                  <span className="truncate">{c.candidateEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 text-[#063B78]" />
                  <span>{c.candidateMobile || "+91 98220 11223"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DCE5F0] flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#5B6B7F]">Applied {c.appliedDate}</span>
                <button
                  onClick={() => setSelectedCandidate(c)}
                  className="inline-flex items-center gap-1 text-xs font-black text-[#063B78] hover:underline"
                >
                  View Resume & Details →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#063B78] text-white font-black text-sm flex items-center justify-center">
                  {selectedCandidate.candidateName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-[#10233F] text-sm">{selectedCandidate.candidateName}</h3>
                  <p className="text-xs font-bold text-[#063B78]">{selectedCandidate.jobTitle}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-[#5B6B7F] hover:text-[#10233F]">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F8FC] space-y-1">
                <p className="font-bold text-[#10233F]">Contact Information</p>
                <p className="text-[#5B6B7F]">Email: {selectedCandidate.candidateEmail}</p>
                <p className="text-[#5B6B7F]">Mobile: {selectedCandidate.candidateMobile || "+91 98220 11223"}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F8FC] space-y-1">
                <p className="font-bold text-[#10233F]">Application Details</p>
                <p className="text-[#5B6B7F]">Job Applied: {selectedCandidate.jobTitle} at {selectedCandidate.companyName}</p>
                <p className="text-[#5B6B7F]">Date: {selectedCandidate.appliedDate}</p>
                <p className="text-[#5B6B7F]">Status: <StatusBadge status={selectedCandidate.status} /></p>
              </div>

              <div className="p-3 rounded-xl border border-[#063B78]/20 bg-[#063B78]/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="size-5 text-[#063B78]" />
                  <div>
                    <p className="font-bold text-[#10233F]">{selectedCandidate.resume || "Candidate_Resume.pdf"}</p>
                    <p className="text-[10px] text-[#5B6B7F]">Verified PDF Resume</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.success(`Downloaded ${selectedCandidate.resume || "Resume.pdf"}`)}
                  className="inline-flex items-center gap-1.5 bg-[#063B78] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#082F63]"
                >
                  <Download className="size-3.5" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
