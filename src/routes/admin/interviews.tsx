import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, Users, BarChart2, Settings, Calendar, Plus, Video, Phone, MapPin, X, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, StatusBadge, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore, InterviewRecord, ApplicationRecord } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/interviews")({
  component: AdminInterviewsPage,
});

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/admin/applications", icon: <FileText className="size-4" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="size-4" /> },
  { label: "Interviews", href: "/admin/interviews", icon: <Calendar className="size-4" /> },
  { label: "Company Profile", href: "/admin/company-profile", icon: <Briefcase className="size-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

function AdminInterviewsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    applicationId: "",
    interviewDate: "2026-10-05",
    interviewTime: "11:00 AM",
    type: "Online" as "Online" | "Offline" | "Phone",
    meetingLink: "https://meet.google.com/realjob-demo-link",
    interviewer: "Hiring Lead",
    notes: "Technical round covering React state management and problem solving.",
  });

  const loadData = () => {
    setInterviews(dataStore.getInterviews());
    const apps = dataStore.getAllApplications();
    setApplications(apps);
    if (apps.length > 0 && apps[0]?.id && !form.applicationId) {
      setForm((f) => ({ ...f, applicationId: apps[0]?.id || "" }));
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
    else if (user?.role === "user") navigate({ to: "/unauthorized" });
    else loadData();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role === "user") return null;

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = applications.find((a) => a.id === form.applicationId);
    if (!app) {
      toast.error("Please select a candidate application.");
      return;
    }

    dataStore.scheduleInterview({
      applicationId: app.id,
      jobId: app.jobId,
      candidateName: app.candidateName,
      candidateEmail: app.candidateEmail,
      jobTitle: app.jobTitle,
      companyName: app.companyName,
      interviewDate: form.interviewDate,
      interviewTime: form.interviewTime,
      type: form.type,
      meetingLink: form.meetingLink,
      interviewer: form.interviewer,
      notes: form.notes,
    });

    toast.success(`Scheduled ${form.type} interview for ${app.candidateName}! Notification sent.`);
    setShowModal(false);
    loadData();
  };

  return (
    <DashboardLayout navItems={adminNav} title="Interview Scheduling & Management" roleLabel="Admin">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-black text-[#10233F]">Scheduled Interviews ({interviews.length})</h2>
          <p className="text-xs font-semibold text-[#5B6B7F]">Schedule online, offline, or phone interview rounds with shortlisted candidates.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#FFC400] text-[#082F63] font-black text-xs px-4 py-2.5 rounded-xl hover:bg-yellow-300 transition-all shadow-xs shrink-0"
        >
          <Plus className="size-4" /> Schedule New Interview
        </button>
      </div>

      {/* Interviews Table / List */}
      <div className="bg-white rounded-2xl border border-[#DCE5F0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DCE5F0] bg-[#F5F8FC]">
                {["Candidate", "Job Role", "Interview Date & Time", "Type", "Interviewer", "Meeting Details"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-black uppercase tracking-wide text-[#5B6B7F] px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0]">
              {interviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-xs font-semibold text-[#5B6B7F]">
                    No interviews scheduled yet. Click "Schedule New Interview" to arrange candidate rounds.
                  </td>
                </tr>
              ) : (
                interviews.map((int) => (
                  <tr key={int.id} className="hover:bg-[#F5F8FC] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-black text-[#10233F]">{int.candidateName}</p>
                      <p className="text-[10px] font-semibold text-[#5B6B7F]">{int.candidateEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-[#10233F]">{int.jobTitle}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-black text-[#063B78]">{int.interviewDate}</p>
                      <p className="text-[10px] font-semibold text-[#5B6B7F]">{int.interviewTime}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {int.type === "Online" && <Video className="size-3" />}
                        {int.type === "Phone" && <Phone className="size-3" />}
                        {int.type === "Offline" && <MapPin className="size-3" />}
                        {int.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#5B6B7F]">{int.interviewer}</td>
                    <td className="px-4 py-3 text-xs">
                      {int.meetingLink ? (
                        <a
                          href={int.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#063B78] font-bold hover:underline truncate inline-block max-w-[150px]"
                        >
                          Join Link →
                        </a>
                      ) : (
                        <span className="text-[#5B6B7F]">In-person / Call</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
              <h3 className="font-black text-[#10233F] text-sm">Schedule Candidate Interview</h3>
              <button onClick={() => setShowModal(false)} className="text-[#5B6B7F] hover:text-[#10233F]">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Select Candidate Application *</label>
                <select
                  value={form.applicationId}
                  onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                >
                  {applications.length === 0 ? (
                    <option value="">No applications available</option>
                  ) : (
                    applications.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.candidateName} — {a.jobTitle}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.interviewDate}
                    onChange={(e) => setForm({ ...form, interviewDate: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    value={form.interviewTime}
                    onChange={(e) => setForm({ ...form, interviewTime: e.target.value })}
                    placeholder="e.g. 11:00 AM"
                    className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Interview Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                >
                  <option value="Online">Online Video Call (Google Meet / Zoom)</option>
                  <option value="Phone">Phone Screening Round</option>
                  <option value="Offline">In-Person Office Interview</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Meeting Link / Address</label>
                <input
                  type="text"
                  value={form.meetingLink}
                  onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Interviewer Name</label>
                <input
                  type="text"
                  value={form.interviewer}
                  onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCE5F0] text-xs font-bold text-[#5B6B7F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#063B78] text-white text-xs font-black hover:bg-[#082F63] transition-colors"
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
