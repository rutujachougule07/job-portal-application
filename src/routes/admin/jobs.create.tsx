import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, Users, BarChart2, Settings, ArrowLeft, Save, Plus, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/jobs/create")({
  component: AdminPostJobPage,
});

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Post New Job", href: "/admin/jobs/create", icon: <Plus className="size-4" /> },
  { label: "Applications", href: "/admin/applications", icon: <FileText className="size-4" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="size-4" /> },
  { label: "Interviews", href: "/admin/interviews", icon: <Calendar className="size-4" /> },
  { label: "Company Profile", href: "/admin/company-profile", icon: <Briefcase className="size-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

function AdminPostJobPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: user?.name ? `${user.name} Corp` : "TechCorp Solutions",
    category: "IT & Software",
    subcategory: "Software Development",
    location: "Pune, Maharashtra",
    jobType: "Full Time" as any,
    workMode: "On-site" as any,
    salaryMin: "600000",
    salaryMax: "1200000",
    salaryType: "Yearly" as any,
    education: "B.Tech / B.E. / MCA",
    experience: "2-4 Years",
    skills: "React, Node.js, TypeScript, PostgreSQL",
    languages: "English, Hindi",
    description: "Looking for an enthusiastic engineer to build scalable web applications.",
    responsibilities: "Develop web UI components, write tests, coordinate with product team.",
    requirements: "2+ years hands-on experience in TypeScript, React, and API design.",
    benefits: "Health Insurance, Performance Bonus, Flexible Leave Policy",
    vacancies: 3,
    status: "Active" as any,
  });

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
    else if (user?.role === "user") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role === "user") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsList = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
    const respList = form.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean);
    const benList = form.benefits.split(",").map((s) => s.trim()).filter(Boolean);

    dataStore.createJob({
      employerId: user?.id || "admin-001",
      title: form.title,
      company: form.company,
      category: form.category,
      subcategory: form.subcategory,
      description: form.description,
      responsibilities: respList.length ? respList : [form.responsibilities],
      requiredSkills: skillsList,
      qualification: form.education,
      experience: form.experience,
      salary: `₹${Number(form.salaryMin).toLocaleString("en-IN")} - ₹${Number(form.salaryMax).toLocaleString("en-IN")} / Year`,
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
      salaryType: form.salaryType,
      location: form.location,
      jobType: form.jobType,
      workMode: form.workMode,
      vacancies: Number(form.vacancies),
      benefits: benList,
      status: form.status,
    });

    toast.success("Job posted successfully! Visible live on Browse Jobs catalog.");
    navigate({ to: "/admin/jobs" });
  };

  return (
    <DashboardLayout navItems={adminNav} title="Post a New Job Opening" roleLabel="Admin">
      <div className="max-w-3xl space-y-6">
        <button
          onClick={() => navigate({ to: "/admin/jobs" })}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B6B7F] hover:text-[#10233F]"
        >
          <ArrowLeft className="size-4" /> Back to Manage Jobs
        </button>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#DCE5F0] p-6 space-y-6 shadow-xs">
          <h3 className="font-black text-[#10233F] text-sm border-b border-[#DCE5F0] pb-3 flex items-center gap-2">
            <Plus className="size-4 text-[#063B78]" /> Job Creation & Publishing Form
          </h3>

          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#063B78]">1. Basic Information</h4>
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Developer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
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
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Category *</label>
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

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Type *</label>
                <select
                  value={form.jobType}
                  onChange={(e) => setForm({ ...form, jobType: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                >
                  {["Full Time", "Part Time", "Internship", "Contract", "Freelance"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Work Mode *</label>
                <select
                  value={form.workMode}
                  onChange={(e) => setForm({ ...form, workMode: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                >
                  {["On-site", "Work From Home", "Hybrid"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Salary & Requirements */}
          <div className="space-y-4 border-t border-[#DCE5F0] pt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#063B78]">2. Compensation & Qualifications</h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Min Salary (Annual ₹)</label>
                <input
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Max Salary (Annual ₹)</label>
                <input
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Vacancies</label>
                <input
                  type="number"
                  value={form.vacancies}
                  onChange={(e) => setForm({ ...form, vacancies: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Required Education</label>
                <input
                  type="text"
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Experience Required</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Required Skills (comma separated)</label>
              <input
                type="text"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 border-t border-[#DCE5F0] pt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#063B78]">3. Job Description & Responsibilities</h4>
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Key Responsibilities (one per line)</label>
              <textarea
                rows={3}
                value={form.responsibilities}
                onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Perks & Benefits (comma separated)</label>
              <input
                type="text"
                value={form.benefits}
                onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#DCE5F0] pt-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/admin/jobs" })}
              className="px-4 py-2.5 rounded-xl border border-[#DCE5F0] text-xs font-bold text-[#5B6B7F]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#063B78] text-white font-black text-xs hover:bg-[#082F63] transition-colors shadow-xs"
            >
              <Save className="size-4" /> Publish Job
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
