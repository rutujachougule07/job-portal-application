import { useState, useEffect, Fragment } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  Building2,
  WalletCards,
  Plus,
  Trash2,
  Edit,
  Search,
  BarChart3,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/portal/Stats";
import { dataStore, JobRecord, ApplicationRecord } from "@/lib/data-store";
import { toast } from "sonner";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal & Control Dashboard — REAL JOB" },
      { name: "description", content: "Platform administration, user management, employer verification and job control panel." },
    ],
  }),
  component: AdminDashboardPage,
});

const monthlyAnalytics = [
  { month: "May", workers: 0, jobs: 0, hires: 0 },
  { month: "Jun", workers: 0, jobs: 0, hires: 0 },
  { month: "Jul", workers: 0, jobs: 0, hires: 0 },
  { month: "Aug", workers: 0, jobs: 0, hires: 0 },
  { month: "Sep", workers: 0, jobs: 0, hires: 0 },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "applications">("overview");

  // Data states
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [appSearch, setAppSearch] = useState("");
  const [filterJobId, setFilterJobId] = useState<string | null>(null);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  // User Accounts for Admin View (Live Dynamic Data)
  const [registeredUsers, setRegisteredUsers] = useState<
    Array<{ id: string; name: string; role: string; mobile: string; city: string; trade: string; status: string }>
  >([]);

  const loadAllData = () => {
    setJobs(dataStore.getAllJobs());
    setApplications(dataStore.getAllApplications());
    const reg = dataStore.getRegisteredUsers();
    setRegisteredUsers(reg.map(u => ({
      id: u.id,
      name: u.fullName,
      role: u.role,
      mobile: u.mobile || "N/A",
      city: "Maharashtra",
      trade: u.role === "worker" ? "Worker" : u.role === "employer" ? "Employer" : "Admin",
      status: "Verified"
    })));
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleUpdateAppStatus = (appId: string, status: any) => {
    dataStore.updateApplicationStatus(appId, status);
    setApplications(dataStore.getAllApplications());
    toast.success(`अर्जाची स्थिती '${status}' वर बदलली!`);
  };

  // Job creation and edit form state
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState({
    title: "", company: "REAL JOB Platform", category: "", location: "",
    salaryMin: "", salaryMax: "", salaryType: "Monthly",
    jobType: "Full Time", workMode: "On-site", vacancies: "5",
    education: "", experience: "", skills: "", description: "",
    responsibilities: "", benefits: "", status: "Active",
  });
  const setJ = (k: string, v: any) => setJobForm(p => ({ ...p, [k]: v }));

  const handleAddNewJobClick = () => {
    setEditingJobId(null);
    setJobForm({
      title: "", company: "REAL JOB Platform", category: "", location: "",
      salaryMin: "", salaryMax: "", salaryType: "Monthly",
      jobType: "Full Time", workMode: "On-site", vacancies: "5",
      education: "", experience: "", skills: "", description: "",
      responsibilities: "", benefits: "", status: "Active",
    });
    setShowJobForm(true);
  };

  const handleEditJobClick = (job: JobRecord) => {
    setEditingJobId(job.id);
    let sMin = job.salaryMin ? String(job.salaryMin) : "";
    let sMax = job.salaryMax ? String(job.salaryMax) : "";
    if (!sMin && !sMax && job.salary) {
      const numbers = job.salary.match(/\d[\d,]*/g);
      if (numbers && numbers.length >= 2 && numbers[0] && numbers[1]) {
        sMin = numbers[0].replace(/,/g, "");
        sMax = numbers[1].replace(/,/g, "");
      }
    }
    setJobForm({
      title: job.title || "",
      company: job.company || "",
      category: job.category || "",
      location: job.location || "",
      salaryMin: sMin,
      salaryMax: sMax,
      salaryType: job.salaryType || "Monthly",
      jobType: job.jobType || "Full Time",
      workMode: job.workMode || "On-site",
      vacancies: job.vacancies ? String(job.vacancies) : "5",
      education: job.qualification || "",
      experience: job.experience || "",
      skills: (job.requiredSkills || []).join(", "),
      description: job.description || "",
      responsibilities: (job.responsibilities || []).join("\n"),
      benefits: (job.benefits || []).join(", "),
      status: job.status || "Active",
    });
    setShowJobForm(true);
  };

  const handlePublishJob = (e: React.FormEvent) => {
    e.preventDefault();
    const salaryText = jobForm.salaryMin && jobForm.salaryMax
      ? `₹${Number(jobForm.salaryMin).toLocaleString("en-IN")} - ₹${Number(jobForm.salaryMax).toLocaleString("en-IN")} / ${jobForm.salaryType === "Monthly" ? "Month" : "Year"}`
      : "Salary on Interview";

    if (editingJobId) {
      dataStore.updateJob(editingJobId, {
        title: jobForm.title,
        company: jobForm.company,
        category: jobForm.category || "General",
        description: jobForm.description,
        qualification: jobForm.education,
        experience: jobForm.experience,
        salary: salaryText,
        salaryMin: Number(jobForm.salaryMin) || 0,
        salaryMax: Number(jobForm.salaryMax) || 0,
        salaryType: jobForm.salaryType as any,
        location: jobForm.location,
        jobType: jobForm.jobType as any,
        workMode: jobForm.workMode as any,
        vacancies: Number(jobForm.vacancies) || 1,
        status: jobForm.status as any,
      });
      toast.success("✅ नोकरीची माहिती यशस्वीरित्या अद्ययावत (Updated) झाली!");
    } else {
      dataStore.createJob({
        employerId: "admin-001",
        title: jobForm.title,
        company: jobForm.company,
        category: jobForm.category || "General",
        subcategory: "",
        description: jobForm.description,
        responsibilities: [],
        requiredSkills: [],
        qualification: jobForm.education,
        experience: jobForm.experience,
        salary: salaryText,
        salaryMin: Number(jobForm.salaryMin) || 0,
        salaryMax: Number(jobForm.salaryMax) || 0,
        salaryType: jobForm.salaryType as any,
        location: jobForm.location,
        jobType: jobForm.jobType as any,
        workMode: jobForm.workMode as any,
        vacancies: Number(jobForm.vacancies) || 1,
        benefits: [],
        status: jobForm.status as any,
      });
      toast.success("✅ नवीन नोकरी यशस्वीरित्या प्रकाशित झाली!");
    }
    setShowJobForm(false);
    setEditingJobId(null);
    setJobs(dataStore.getAllJobs());
  };

  const handleToggleJobStatus = (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Closed" : "Active";
    dataStore.updateJob(jobId, { status: nextStatus as any });
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: nextStatus as any } : j))
    );
    toast.success(`Job status updated to ${nextStatus}!`);
  };

  const handleDeleteJob = (jobId: string) => {
    dataStore.deleteJob(jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    toast.success("Job posting removed by Admin!");
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase())
  );

  // ── FULL PAGE: Add / Edit Job Form ──
  if (showJobForm) {
    const today = new Date().toISOString().split("T")[0];
    return (
      <div className="fixed inset-0 z-50 bg-[#F0F4FA] overflow-y-auto flex flex-col">
        {/* Top Sticky Bar */}
        <div className="bg-[#021D3D] text-white px-6 py-4 flex items-center justify-between border-b border-[#0A4F9E] sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJobForm(false)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-1"
            >
              ← मागे जा (Back)
            </button>
            <h1 className="text-base font-black text-white">
              {editingJobId ? "✏️ नोकरीची माहिती संपादीत करा (Edit Job Posting)" : "💼 नवीन नोकरी पोस्ट करा (Post New Job)"}
            </h1>
          </div>
          <span className="text-xs font-bold text-[#FFC400] bg-white/10 px-3 py-1 rounded-full">
            100% नि:शुल्क व थेट नोकरी (Zero Commission)
          </span>
        </div>

        {/* Form Container */}
        <div className="max-w-5xl w-full mx-auto p-4 sm:p-8 flex-1">
          {/* Form Header Steps Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#E0E8F5] shadow-sm mb-6">
            <div className="flex items-center justify-between text-xs font-black text-[#063B78]">
              <span className="flex items-center gap-1.5"><span className="size-5 rounded-full bg-[#063B78] text-white flex items-center justify-center text-[10px]">1</span> Basic Details</span>
              <span className="text-[#9DAEC5]">—</span>
              <span className="flex items-center gap-1.5"><span className="size-5 rounded-full bg-[#063B78] text-white flex items-center justify-center text-[10px]">2</span> Requirements</span>
              <span className="text-[#9DAEC5]">—</span>
              <span className="flex items-center gap-1.5"><span className="size-5 rounded-full bg-[#063B78] text-white flex items-center justify-center text-[10px]">3</span> Salary & Work</span>
              <span className="text-[#9DAEC5]">—</span>
              <span className="flex items-center gap-1.5"><span className="size-5 rounded-full bg-[#063B78] text-white flex items-center justify-center text-[10px]">4</span> Preferences</span>
              <span className="text-[#9DAEC5]">—</span>
              <span className="flex items-center gap-1.5"><span className="size-5 rounded-full bg-[#063B78] text-white flex items-center justify-center text-[10px]">5</span> Application</span>
            </div>
          </div>

          <form onSubmit={handlePublishJob} className="space-y-6 pb-12">
            {/* Section 1 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">1</span>
                <h2 className="text-sm font-black text-[#10233F]">Basic Job Details</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Company Name *</label>
                    <input required value={jobForm.company} onChange={e => setJ("company", e.target.value)} placeholder="e.g. Tata Motors / Real Job Platform" className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Job Title *</label>
                    <input required value={jobForm.title} onChange={e => setJ("title", e.target.value)} placeholder="e.g. Senior CNC Machine Operator" className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Category *</label>
                    <select required value={jobForm.category} onChange={e => setJ("category", e.target.value)} className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]">
                      <option value="">Select Category</option>
                      <option>Manufacturing & Industrial</option>
                      <option>Construction & Building</option>
                      <option>Healthcare & Nursing</option>
                      <option>Logistics & Transport</option>
                      <option>Engineering & Technical</option>
                      <option>Retail & Sales</option>
                      <option>Hotel & Hospitality</option>
                      <option>Security & Services</option>
                      <option>General Worker</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Location (City/District) *</label>
                    <input required value={jobForm.location} onChange={e => setJ("location", e.target.value)} placeholder="e.g. Chakan, Pune / MIDC Kolhapur" className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Job Description *</label>
                  <textarea required rows={3} value={jobForm.description} onChange={e => setJ("description", e.target.value)} placeholder="Describe main duties, responsibilities, work schedule, shift timings..." className="w-full p-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">2</span>
                <h2 className="text-sm font-black text-[#10233F]">Candidate Requirements</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Education Required *</label>
                    <select value={jobForm.education} onChange={e => setJ("education", e.target.value)} className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]">
                      <option value="">Select Education</option>
                      <option>10th Pass</option><option>12th Pass</option><option>ITI Diploma</option>
                      <option>Polytechnic Diploma</option><option>Graduate / BE / B.Tech</option><option>Post Graduate</option>
                      <option>No Formal Education Required</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Experience Required *</label>
                    <select value={jobForm.experience} onChange={e => setJ("experience", e.target.value)} className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]">
                      <option value="">Select Experience</option>
                      <option>Fresher (0 Years)</option><option>1 - 2 Years</option><option>3 - 5 Years</option>
                      <option>5 - 8 Years</option><option>8+ Years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">3</span>
                <h2 className="text-sm font-black text-[#10233F]">Salary & Work Details</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Min Salary (₹)</label>
                    <input type="number" value={jobForm.salaryMin} onChange={e => setJ("salaryMin", e.target.value)} placeholder="e.g. 18000" className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Max Salary (₹)</label>
                    <input type="number" value={jobForm.salaryMax} onChange={e => setJ("salaryMax", e.target.value)} placeholder="e.g. 25000" className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Salary Period</label>
                    <select value={jobForm.salaryType} onChange={e => setJ("salaryType", e.target.value)} className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]">
                      <option value="Monthly">Per Month (दरमहा)</option>
                      <option value="Daily">Per Day (दररोज)</option>
                      <option value="Yearly">Per Year (वार्षिक)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Job Type *</label>
                    <select value={jobForm.jobType} onChange={e => setJ("jobType", e.target.value)} className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]">
                      <option>Full Time</option><option>Part Time</option><option>Contract</option>
                      <option>Daily Wage</option><option>Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Work Mode *</label>
                    <select value={jobForm.workMode} onChange={e => setJ("workMode", e.target.value)} className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]">
                      <option>On-site</option><option>Work From Home</option><option>Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">No. of Openings *</label>
                    <input required type="number" min="1" value={jobForm.vacancies} onChange={e => setJ("vacancies", e.target.value)} className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">4</span>
                <h2 className="text-sm font-black text-[#10233F]">Preferences & Benefits</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Gender Preference</label>
                    <select value={(jobForm as any).genderPreference || "Any"} onChange={e => setJ("genderPreference", e.target.value)} className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]">
                      <option value="Any">Any (पुरुष व महिला दोन्ही)</option>
                      <option value="Male">Male Only (केवळ पुरुष)</option>
                      <option value="Female">Female Only (केवळ महिला)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Age Limit (Optional)</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={(jobForm as any).ageMin || ""} onChange={e => setJ("ageMin", e.target.value)} placeholder="Min Age" className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold focus:outline-none focus:border-[#063B78]" />
                      <span className="text-[#9DAEC5] font-bold shrink-0">–</span>
                      <input type="number" value={(jobForm as any).ageMax || ""} onChange={e => setJ("ageMax", e.target.value)} placeholder="Max Age" className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold focus:outline-none focus:border-[#063B78]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Languages Required</label>
                    <input value={(jobForm as any).languages || ""} onChange={e => setJ("languages", e.target.value)} placeholder="e.g. English, Hindi, Marathi" className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">5</span>
                <h2 className="text-sm font-black text-[#10233F]">Application Details</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Application Deadline *</label>
                    <input required type="date" min={today} value={(jobForm as any).deadline || ""} onChange={e => setJ("deadline", e.target.value)} className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Application Method *</label>
                    <select value={(jobForm as any).applicationMethod || ""} onChange={e => setJ("applicationMethod", e.target.value)} className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]">
                      <option value="">Select Method</option>
                      <option>Apply via Portal</option><option>Apply via WhatsApp</option>
                      <option>Walk-in Interview</option><option>Call to Apply</option><option>Email CV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Recruiter Email *</label>
                    <input type="email" value={(jobForm as any).recruiterEmail || ""} onChange={e => setJ("recruiterEmail", e.target.value)} placeholder="e.g. recruiter@company.com" className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5B6B7F] uppercase mb-1.5">Recruiter Phone (Optional)</label>
                    <input type="tel" value={(jobForm as any).recruiterPhone || ""} onChange={e => setJ("recruiterPhone", e.target.value)} placeholder="e.g. 98765 43210" className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] px-6 py-4 flex items-center justify-between sticky bottom-0 shadow-lg">
              <p className="text-[10px] text-[#9DAEC5] font-semibold">* Required fields must be filled before submitting</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowJobForm(false)} className="px-5 py-2.5 rounded-xl border border-[#DCE5F0] text-xs font-bold text-[#5B6B7F] hover:bg-[#F5F8FC] transition-all">
                  रद्द करा (Cancel)
                </button>
                <button type="submit" className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#063B78] to-[#0A4F9E] text-white font-black text-xs hover:opacity-90 transition-all shadow-md shadow-[#063B78]/20 flex items-center gap-1.5">
                  {editingJobId ? "✦ माहिती अद्ययावत करा (Update Job)" : "✦ नोकरी प्रकाशित करा (Publish Job)"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FA]">

      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#021D3D] via-[#063B78] to-[#0A4F9E] text-white shadow-xl">
        {/* Gold accent top line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#FFC400] via-[#FFD84D] to-[#FFA500]" />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3">
            {/* Logo box */}
            <div className="flex flex-col items-center justify-center size-10 rounded-xl bg-white shadow-md shrink-0">
              <span className="text-[9px] font-black text-[#063B78] leading-none">REAL</span>
              <span className="text-[9px] font-black text-[#FFC400] leading-none">JOB</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-black text-white leading-tight">REAL JOB</div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FFC400]">
                <ShieldCheck className="size-3" />
                ॲडमिन कंट्रोल पोर्टल
              </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-8 bg-white/20 mx-2" />

            {/* Platform status badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black text-white">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Super Admin Control
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:flex border border-white/30 text-white hover:bg-white/15 font-bold text-xs h-8 px-3 rounded-lg"
            >
              <Link to="/home">🌐 मुख्य साईट</Link>
            </Button>
            <Button
              onClick={() => {
                window.localStorage.removeItem("realjob-user");
                toast.info("Logged out from Admin Dashboard");
                navigate({ to: "/" });
              }}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs h-8 px-3 rounded-lg shadow-md"
            >
              लॉग आउट
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin Header Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#063B78]/10 px-3 py-1 text-xs font-black text-[#063B78] mb-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              REAL JOB PLATFORM SYSTEM ONLINE
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10233F]">
              ॲडमिन कंट्रोल सेंटर (Admin Control Dashboard)
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5B6B7F] mt-1">
              कामकूट, नवीन नोकऱ्या, कामगार पडताळणी आणि अर्ज व्यवस्थापन नियंत्रण करा.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleAddNewJobClick}
              className="btn-yellow text-xs font-black px-4 py-2"
            >
              <Plus className="size-4 mr-1" /> नवीन जॉब जोडा (Add New Job)
            </Button>
          </div>
        </div>

        {/* Tab Buttons Navigation - ONLY 3 TABS */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-3 border-b border-[#DCE5F0]">
          {[
            { id: "overview", label: "सारांश (Overview)", icon: BarChart3 },
            { id: "jobs", label: "नोकरी पोस्टिंग्स (Jobs)", icon: BriefcaseBusiness },
            { id: "applications", label: `अर्ज आलेले कामगार (${applications.length})`, icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                activeTab === t.id
                  ? "bg-[#063B78] text-white shadow-md shadow-[#063B78]/20"
                  : "bg-white text-[#5B6B7F] border border-[#DCE5F0] hover:bg-[#EBF1F8] hover:text-[#063B78]"
              }`}
            >
              <t.icon className="size-4 shrink-0" />
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Stat Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                label="एकूण नोंदणीकृत कामगार (Total Registered Workers)"
                value={registeredUsers.filter((u) => u.role === "worker").length.toString()}
                change="थेट नोंदणीकृत कामगार"
                icon={Users}
              />
              <StatCard
                label="सक्रिय नोकऱ्या (Active Jobs)"
                value={jobs.filter((j) => j.status === "Active").length.toString()}
                change="थेट प्लॅटफॉर्मवर"
                icon={BriefcaseBusiness}
              />
              <StatCard
                label="एकूण आलेले अर्ज (Total Applications)"
                value={applications.length.toString()}
                change="थेट कामगारांचे अर्ज"
                icon={FileText}
              />
            </div>

            {/* Platform Analytics Chart */}
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-[#10233F]">
                      प्लॅटफॉर्म वाढ आणि नोकरी अर्ज (Platform Growth & Applications)
                    </h2>
                    <p className="text-xs font-semibold text-[#5B6B7F]">
                      महिनानिहाय कामगार नोंदणी आणि भरती डेटा
                    </p>
                  </div>
                  <Badge className="bg-[#063B78] text-white font-bold">2026 Live</Badge>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyAnalytics}>
                      <defs>
                        <linearGradient id="colorWorkers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#063B78" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#063B78" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFC400" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#FFC400" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="workers" stroke="#063B78" fillOpacity={1} fill="url(#colorWorkers)" name="Workers" />
                      <Area type="monotone" dataKey="jobs" stroke="#FFC400" fillOpacity={1} fill="url(#colorJobs)" name="Jobs" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm space-y-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#10233F]">
                    त्वरित कृती (Quick Controls)
                  </h2>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                    जॉब लिस्ट व अर्जांचे नियंत्रण करण्यासाठी खालील बटन्स वापरा.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleAddNewJobClick}
                    className="w-full btn-yellow text-xs font-black py-3"
                  >
                    + नवीन जॉब पोस्ट करा (Post New Job)
                  </Button>
                  <Button
                    onClick={() => setActiveTab("jobs")}
                    variant="outline"
                    className="w-full border-[#063B78] text-[#063B78] font-bold text-xs py-3"
                  >
                    💼 सर्व जॉब पोस्टिंग्स नियंत्रण
                  </Button>
                  <Button
                    onClick={() => setActiveTab("applications")}
                    variant="outline"
                    className="w-full border-[#063B78] text-[#063B78] font-bold text-xs py-3"
                  >
                    📄 आलेले सर्व कामगार अर्ज पहा ({applications.length})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JOBS CONTROL */}
        {activeTab === "jobs" && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#10233F]">
                  नोकरी पोस्टिंग्स नियंत्रण (All Platform Job Listings)
                </h2>
                <p className="text-xs font-semibold text-[#5B6B7F]">
                  एकूण {jobs.length} नोकऱ्या उपलब्ध आहेत. माहिती अपडेट करा किंवा डिलीट करा.
                </p>
              </div>

              <div className="w-full sm:w-72 relative">
                <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
                <Input
                  placeholder="नोकरी / कंपनी / शहर शोधा..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="pl-9 text-xs font-bold"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#DCE5F0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#063B78] text-white font-black uppercase">
                  <tr>
                    <th className="p-3.5">नोकरी शीर्षक (Title)</th>
                    <th className="p-3.5">कंपनी (Company)</th>
                    <th className="p-3.5">ठिकाण & पगार (Location & Salary)</th>
                    <th className="p-3.5">जागा (Vacancies)</th>
                    <th className="p-3.5">स्थिती (Status)</th>
                    <th className="p-3.5 text-right">कृती (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F0] font-semibold text-[#10233F]">
                  {filteredJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-[#F5F8FC]">
                      <td className="p-3.5">
                        <strong className="block font-black text-[#063B78]">{j.title}</strong>
                        <span className="text-[11px] text-[#5B6B7F]">{j.category}</span>
                      </td>
                      <td className="p-3.5 font-bold">{j.company}</td>
                      <td className="p-3.5">
                        <div>{j.location}</div>
                        <div className="text-[#125BB5] font-bold">{j.salary}</div>
                      </td>
                      <td className="p-3.5 font-black text-[#063B78]">{j.vacancies || 5} Openings</td>
                      <td className="p-3.5">
                        <Badge
                          className={
                            j.status === "Active"
                              ? "bg-emerald-600 text-white font-bold"
                              : "bg-gray-500 text-white font-bold"
                          }
                        >
                          {j.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setFilterJobId(j.id);
                              setActiveTab("applications");
                            }}
                            className="bg-[#063B78] text-white font-extrabold text-[11px] hover:bg-[#0A4F9E]"
                          >
                            <Users className="size-3.5 mr-1" />
                            अर्ज पहा ({applications.filter((a) => a.jobId === j.id).length})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditJobClick(j)}
                            className="font-extrabold text-[11px] border-[#063B78] text-[#063B78] hover:bg-[#F0F5FF]"
                          >
                            <Edit className="size-3.5 mr-1" /> एडिट (Edit)
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleJobStatus(j.id, j.status)}
                            className="font-extrabold text-[11px] border-gray-400 text-gray-700"
                          >
                            {j.status === "Active" ? "बंद करा (Close)" : "सुरू करा (Activate)"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteJob(j.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredJobs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-xs font-bold text-[#5B6B7F] bg-[#F8FAFF]">
                        अद्याप एकही नोकरी पोस्ट केलेली नाही. (No jobs posted yet)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATIONS */}
        {activeTab === "applications" && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#10233F]">
                  नोकरीसाठी आलेले अर्ज (Job Applications & Applicants)
                </h2>
                <p className="text-xs font-semibold text-[#5B6B7F]">
                  एकूण {applications.length} कामगारांनी नोकरीसाठी अर्ज केले आहेत. थेट संपर्क करा किंवा स्थिती बदला.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {filterJobId && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFilterJobId(null)}
                    className="text-xs font-bold border-[#063B78] text-[#063B78]"
                  >
                    ✕ सर्व जॉब्जचे अर्ज दाखवा
                  </Button>
                )}
                <div className="w-full sm:w-64 relative">
                  <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
                  <Input
                    placeholder="उमेदवार नाव / नोकरी / संपर्क शोधा..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="pl-9 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#DCE5F0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#063B78] text-white font-black uppercase">
                  <tr>
                    <th className="p-3.5">उमेदवार नाव (Applicant Name)</th>
                    <th className="p-3.5">अर्ज केलेली नोकरी (Applied Job)</th>
                    <th className="p-3.5">संपर्क पर्याय (Direct Contact)</th>
                    <th className="p-3.5">अर्जाची तारीख (Applied Date)</th>
                    <th className="p-3.5">सध्याची स्थिती (Status)</th>
                    <th className="p-3.5">संपर्क क्र. (Mobile)</th>
                    <th className="p-3.5 text-right">तपशील (Details)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F0] font-semibold text-[#10233F]">
                  {applications
                    .filter((a) => !filterJobId || a.jobId === filterJobId)
                    .filter(
                      (a) =>
                        a.candidateName.toLowerCase().includes(appSearch.toLowerCase()) ||
                        a.jobTitle.toLowerCase().includes(appSearch.toLowerCase()) ||
                        a.candidateMobile.toLowerCase().includes(appSearch.toLowerCase())
                    )
                    .map((a) => (
                      <Fragment key={a.id}>
                        <tr className="hover:bg-[#F5F8FC]">
                          <td className="p-3.5 font-black text-[#063B78]">
                            <div>{a.candidateName}</div>
                            <div className="text-[11px] text-[#5B6B7F] font-normal">{a.candidateEmail}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-[#10233F]">{a.jobTitle}</div>
                            <div className="text-[11px] text-[#125BB5]">{a.companyName || "Company"} • {a.location}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${a.candidateMobile}`}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-all flex items-center gap-1"
                              >
                                📞 कॉल करा
                              </a>
                              <a
                                href={`https://wa.me/${a.candidateMobile.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-green-600 text-white font-bold text-[10px] hover:bg-green-700 transition-all flex items-center gap-1"
                              >
                                💬 WhatsApp
                              </a>
                            </div>
                          </td>
                          <td className="p-3.5 text-[#5B6B7F] font-bold">{a.appliedDate}</td>
                          <td className="p-3.5">
                            <select
                              value={a.status}
                              onChange={(e) => handleUpdateAppStatus(a.id, e.target.value as any)}
                              className="h-8 px-2 rounded-lg border border-[#DCE5F0] text-xs font-black focus:outline-none focus:border-[#063B78]"
                            >
                              <option value="Applied">📝 Applied</option>
                              <option value="Viewed">👀 Viewed</option>
                              <option value="Shortlisted">⭐ Shortlisted</option>
                              <option value="Interview">📅 Interview Scheduled</option>
                              <option value="Selected">✅ Selected / Hired</option>
                              <option value="Rejected">❌ Rejected</option>
                            </select>
                          </td>
                          <td className="p-3.5 font-bold text-[#063B78]">
                            {a.candidateMobile}
                          </td>
                          <td className="p-3.5 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedApp(expandedApp === a.id ? null : a.id)}
                              className="text-[10px] h-7 px-3 border-[#063B78] text-[#063B78] hover:bg-[#063B78] hover:text-white"
                            >
                              {expandedApp === a.id ? "बंद करा" : "सविस्तर पहा"}
                            </Button>
                          </td>
                        </tr>
                        {expandedApp === a.id && (
                          <tr className="bg-[#F8FAFC]">
                            <td colSpan={7} className="p-4 border-t border-[#DCE5F0]">
                              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                                 <h4 className="font-bold text-[#10233F] mb-4 border-b pb-2 flex items-center gap-2">
                                   <FileText className="size-4 text-[#063B78]" />
                                   उमेदवाराची सविस्तर माहिती (Candidate Details)
                                 </h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                   {a.fieldValues && Object.entries(a.fieldValues).map(([key, value]) => (
                                      <div key={key} className="text-xs bg-[#F5F8FC] p-3 rounded-lg border border-[#DCE5F0]">
                                        <div className="font-bold text-[#5B6B7F] capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div> 
                                        <div className="font-black text-[#10233F]">{value as string}</div>
                                      </div>
                                   ))}
                                   {a.customAnswers && Object.entries(a.customAnswers).map(([key, value]) => (
                                      <div key={key} className="text-xs bg-[#F5F8FC] p-3 rounded-lg border border-[#DCE5F0]">
                                        <div className="font-bold text-[#5B6B7F] capitalize mb-1">{key}</div> 
                                        <div className="font-black text-[#10233F]">{value as string}</div>
                                      </div>
                                   ))}
                                   {(!a.fieldValues && !a.customAnswers) && (
                                     <div className="text-sm font-semibold text-[#5B6B7F]">अधिक माहिती उपलब्ध नाही.</div>
                                   )}
                                 </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs font-bold text-[#5B6B7F] bg-[#F8FAFF]">
                        अद्याप कोणत्याही कामगाराने अर्ज केलेला नाही (No job applications received yet)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
