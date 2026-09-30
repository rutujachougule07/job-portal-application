import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, Briefcase, FileText, Users, BarChart2, Settings, Plus,
  Edit2, Trash2, Eye, CheckCircle2, XCircle, X
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, StatusBadge, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore, JobRecord } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/jobs")({
  component: AdminJobsPage,
});

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/admin/applications", icon: <FileText className="size-4" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="size-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

function AdminJobsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobRecord | null>(null);

  const [form, setForm] = useState({
    title: "",
    company: "",
    category: "IT & Software",
    location: "Pune, Maharashtra",
    salary: "₹50,000 - ₹80,000 / Month",
    jobType: "Full Time" as any,
    workMode: "On-site" as any,
    vacancies: 2,
    description: "",
    requiredSkills: "React, TypeScript, Node.js",
  });

  const loadJobs = () => {
    setJobs(dataStore.getAllJobs());
  };

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
    else if (user?.role === "user") navigate({ to: "/unauthorized" });
    else {
      loadJobs();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role === "user") return null;

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingJob(null);
    setForm({
      title: "",
      company: user?.name ? `${user.name} Corp` : "TechCorp",
      category: "IT & Software",
      location: "Pune, Maharashtra",
      salary: "₹40,000 - ₹70,000 / Month",
      jobType: "Full Time",
      workMode: "On-site",
      vacancies: 3,
      description: "Responsible for core development, quality execution, and team deliverables.",
      requiredSkills: "React, Node.js, Communication",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (job: JobRecord) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      company: job.company,
      category: job.category,
      location: job.location,
      salary: job.salary,
      jobType: job.jobType,
      workMode: job.workMode || "On-site",
      vacancies: job.vacancies || 1,
      description: job.description || "",
      requiredSkills: (job.requiredSkills || []).join(", "),
    });
    setShowModal(true);
  };

  const handleToggleStatus = (job: JobRecord) => {
    const nextStatus = job.status === "Active" ? "Closed" : "Active";
    dataStore.updateJob(job.id, { status: nextStatus });
    toast.success(`Job status changed to ${nextStatus}`);
    loadJobs();
  };

  const handleDelete = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      dataStore.deleteJob(jobId);
      toast.success("Job deleted successfully.");
      loadJobs();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingJob) {
      dataStore.updateJob(editingJob.id, {
        title: form.title,
        company: form.company,
        category: form.category,
        location: form.location,
        salary: form.salary,
        jobType: form.jobType,
        workMode: form.workMode,
        vacancies: form.vacancies,
        description: form.description,
        requiredSkills: skillsArray,
      });
      toast.success("Job posting updated!");
    } else {
      dataStore.createJob({
        employerId: user?.id || "admin-001",
        title: form.title,
        company: form.company,
        category: form.category,
        subcategory: "General",
        description: form.description,
        responsibilities: [
          "Execute project tasks according to specifications.",
          "Maintain daily progress documentation.",
        ],
        requiredSkills: skillsArray,
        qualification: "Bachelor's Degree / Diploma",
        experience: "2-4 Years",
        salary: form.salary,
        salaryType: "Monthly",
        location: form.location,
        jobType: form.jobType,
        workMode: form.workMode,
        vacancies: Number(form.vacancies),
        benefits: ["Health Insurance", "Overtime Allowance"],
        status: "Active",
      });
      toast.success("New job posted successfully!");
    }

    setShowModal(false);
    loadJobs();
  };

  return (
    <DashboardLayout navItems={adminNav} title="Job Management" roleLabel="Admin">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <input
          type="text"
          placeholder="Search jobs by title, company, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-md h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78] focus:ring-2 focus:ring-[#063B78]/20 transition-all"
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#FFC400] text-[#082F63] font-black text-xs px-4 py-2.5 rounded-xl hover:bg-yellow-300 transition-all shrink-0 shadow-xs"
        >
          <Plus className="size-4" /> Post New Job
        </button>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-[#DCE5F0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DCE5F0] bg-[#F5F8FC]">
                {["Job Title", "Company", "Category", "Location", "Vacancies", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-black uppercase tracking-wide text-[#5B6B7F] px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-xs font-semibold text-[#5B6B7F]">
                    No jobs found. Click "Post New Job" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-[#F5F8FC] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-black text-[#10233F]">{job.title}</p>
                      <p className="text-[10px] font-semibold text-[#5B6B7F]">{job.salary}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#5B6B7F]">{job.company}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#5B6B7F]">{job.category}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#5B6B7F]">{job.location}</td>
                    <td className="px-4 py-3 text-xs font-black text-[#063B78]">{job.vacancies || 1}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className="cursor-pointer"
                        title="Click to toggle Active/Closed status"
                      >
                        <StatusBadge status={job.status} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          to="/jobs/$jobId"
                          params={{ jobId: job.id }}
                          className="p-1.5 rounded-lg text-[#063B78] hover:bg-[#EBF1F8] transition-colors"
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(job)}
                          className="p-1.5 rounded-lg text-[#5B6B7F] hover:bg-[#EBF1F8] transition-colors"
                          title="Edit Job"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post / Edit Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
              <h3 className="font-black text-[#10233F] text-sm">
                {editingJob ? "Edit Job Posting" : "Post a New Job"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#5B6B7F] hover:text-[#10233F]">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  >
                    {["IT & Software", "Engineering", "Sales & Marketing", "Human Resources", "Construction", "Healthcare & Medical", "Finance & Accounting"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Pune, Maharashtra"
                    className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Salary Range *</label>
                  <input
                    type="text"
                    required
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    placeholder="e.g. ₹50,000 - ₹80,000 / Month"
                    className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Type</label>
                  <select
                    value={form.jobType}
                    onChange={(e) => setForm({ ...form, jobType: e.target.value as any })}
                    className="w-full h-10 px-2 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  >
                    {["Full Time", "Part Time", "Contract", "Internship"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Work Mode</label>
                  <select
                    value={form.workMode}
                    onChange={(e) => setForm({ ...form, workMode: e.target.value as any })}
                    className="w-full h-10 px-2 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  >
                    {["On-site", "Work From Home", "Hybrid"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Vacancies</label>
                  <input
                    type="number"
                    min={1}
                    value={form.vacancies}
                    onChange={(e) => setForm({ ...form, vacancies: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={form.requiredSkills}
                  onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                  placeholder="e.g. React, TypeScript, Node.js"
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCE5F0] text-xs font-bold text-[#5B6B7F] hover:bg-[#F5F8FC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#063B78] text-white text-xs font-black hover:bg-[#082F63] transition-colors"
                >
                  {editingJob ? "Save Changes" : "Publish Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
