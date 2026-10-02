import { useState, useEffect, Fragment } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  FileText,
  Sparkles,
  Zap,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Package,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/portal/Stats";
import { dataStore, DataStoreManager, JobRecord, ApplicationRecord } from "@/lib/data-store";
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
      { title: "Employer Portal & Control Dashboard — REAL JOB" },
      { name: "description", content: "Employer dashboard, job control panel, candidate application manager, and hiring portal." },
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



function formatWaNumber(phone: string): string {
  const raw = (phone || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "919822011223";
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return digits.length >= 10 ? digits : `91${digits}`;
}

function formatCallNumber(phone: string): string {
  const raw = (phone || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "+919822011223";
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  return raw.startsWith("+") ? raw : `+${digits}`;
}

function AdminDashboardPage() {
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

  // Package & Credits states
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("plan-100");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessingPackage, setIsProcessingPackage] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);

  // User Accounts for Admin View (Live Dynamic Data)
  const [registeredUsers, setRegisteredUsers] = useState<
    Array<{ id: string; name: string; role: string; mobile: string; city: string; trade: string; status: string; createdAt?: string | undefined }>
  >([]);
  const currentUser = dataStore.getCurrentUser();
  const isSuperAdmin = currentUser?.email?.toLowerCase() === "supera@gmail.com" || currentUser?.email?.toLowerCase() === "superadmin";
  const empIdentifier = currentUser?.fullName || currentUser?.email || "admin-001";

  const refreshCredits = () => {
    if (currentUser?.id) {
      setUserCredits(dataStore.getUserJobCredits(currentUser.id));
    }
  };

  const loadAllData = () => {
    if (isSuperAdmin) {
      setJobs(dataStore.getAllJobs());
      setApplications(dataStore.getAllApplications());
    } else {
      setJobs(dataStore.getEmployerJobs(empIdentifier));
      setApplications(dataStore.getEmployerApplications(empIdentifier));
    }
    const reg = dataStore.getRegisteredUsers();
    setRegisteredUsers(reg.map(u => ({
      id: u.id,
      name: u.fullName,
      role: u.role,
      mobile: u.mobile || "N/A",
      city: "Maharashtra",
      trade: u.role === "worker" ? "Worker" : u.role === "employer" ? "Employer" : "Admin",
      status: "Verified",
      createdAt: u.createdAt || undefined
    })));
    refreshCredits();
  };

  useEffect(() => {
    loadAllData();
  }, [empIdentifier]);

  const handleUpdateAppStatus = (appId: string, status: any) => {
    dataStore.updateApplicationStatus(appId, status);
    loadAllData();
    toast.success(`Application status updated to '${status}'!`);
  };

  // Job creation and edit form state
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState({
    title: "", company: "REAL JOB Platform", category: "", subcategory: "", location: "",
    salaryMin: "", salaryMax: "", salaryType: "Monthly",
    jobType: "Full Time", workMode: "On-site", vacancies: "5",
    education: "", experience: "", skills: "", description: "",
    responsibilities: "", benefits: "", status: "Active",
  });
  const setJ = (k: string, v: any) => setJobForm(p => ({ ...p, [k]: v }));

  const handleAddNewJobClick = () => {
    // Check if user has active credits or is super admin
    const credits = currentUser?.id ? dataStore.getUserJobCredits(currentUser.id) : 0;
    if (!isSuperAdmin && credits <= 0) {
      toast.info("Please select a Job Package to post new jobs.");
      setShowPackageModal(true);
      return;
    }

    setEditingJobId(null);
    setJobForm({
      title: "", company: currentUser?.fullName || "REAL JOB Platform", category: "", subcategory: "", location: "",
      salaryMin: "", salaryMax: "", salaryType: "Monthly",
      jobType: "Full Time", workMode: "On-site", vacancies: "5",
      education: "", experience: "", skills: "", description: "",
      responsibilities: "", benefits: "", status: "Active",
    });
    setShowJobForm(true);
  };

  const activeJobPackages = dataStore.getJobPackages();

  const handleActivatePackage = () => {
    if (!currentUser) {
      toast.error("User session expired. Please login again.");
      return;
    }
    const selectedPlan = activeJobPackages.find((p) => p.id === selectedPlanId) || activeJobPackages[0]!;
    const userId = currentUser.id || currentUser.email || "admin-001";

    setIsProcessingPackage(true);
    setTimeout(() => {
      dataStore.addPackagePurchase({
        userId: userId,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        price: selectedPlan.price,
        jobCount: selectedPlan.jobCount,
        paymentMethod: paymentMethod.toUpperCase(),
      });

      setIsProcessingPackage(false);
      setShowPackageModal(false);
      refreshCredits();

      toast.success(`🎉 ${selectedPlan.name} activated! You now have ${selectedPlan.jobCount} Job Credits.`);

      // Open Post New Job form immediately
      setEditingJobId(null);
      setJobForm({
        title: "", company: currentUser?.fullName || "REAL JOB Platform", category: "", subcategory: "", location: "",
        salaryMin: "", salaryMax: "", salaryType: "Monthly",
        jobType: "Full Time", workMode: "On-site", vacancies: "5",
        education: "", experience: "", skills: "", description: "",
        responsibilities: "", benefits: "", status: "Active",
      });
      setShowJobForm(true);
    }, 1000);
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
      subcategory: job.subcategory || "",
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
        company: jobForm.company || currentUser?.fullName || "Company",
        category: jobForm.category || "General",
        subcategory: jobForm.subcategory || "",
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
      toast.success("✅ Job posting updated successfully!");
    } else {
      const empId = currentUser?.email || currentUser?.fullName || currentUser?.id || "admin-001";
      const compName = jobForm.company || currentUser?.fullName || "Company";
      dataStore.createJob({
        employerId: empId,
        title: jobForm.title,
        company: compName,
        category: jobForm.category || "General",
        subcategory: jobForm.subcategory || "",
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
        approvalStatus: "pending",
      });

      if (!isSuperAdmin && currentUser?.id) {
        dataStore.consumeJobCredit(currentUser.id);
        refreshCredits();
      }

      toast.success("🎉 New job posted successfully!");
    }
    setShowJobForm(false);
    setEditingJobId(null);
    loadAllData();
  };

  const handleToggleJobStatus = (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Closed" : "Active";
    dataStore.updateJob(jobId, { status: nextStatus as any });
    loadAllData();
    toast.success(`Job status updated to ${nextStatus}!`);
  };

  const handleDeleteJob = (jobId: string) => {
    dataStore.deleteJob(jobId);
    loadAllData();
    toast.success("Job posting removed!");
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const activeSelectedPlan = activeJobPackages.find((p) => p.id === selectedPlanId) || activeJobPackages[0]!;

  // ── FULL PAGE: Add / Edit Job Form ──
  if (showJobForm) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F0F4FA] overflow-y-auto flex flex-col font-sans">
        {/* Top Sticky Bar */}
        <div className="bg-[#021D3D] text-white px-6 py-4 flex items-center justify-between border-b border-[#0A4F9E] sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJobForm(false)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-base font-black text-white">
              {editingJobId ? "✏️ Edit Job Posting" : "💼 Post New Job"}
            </h1>
          </div>
          <span className="text-xs font-bold text-[#FFC400] bg-white/10 px-3 py-1 rounded-full">
            Direct Hiring (Zero Commission)
          </span>
        </div>

        {/* Form Container */}
        <div className="max-w-5xl w-full mx-auto p-4 sm:p-8 flex-1">
          <form onSubmit={handlePublishJob} className="space-y-6 pb-12">
            {/* Section 1 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">1</span>
                <h2 className="text-sm font-black text-[#10233F]">Basic Job Details</h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Title *</label>
                  <Input
                    required
                    value={jobForm.title}
                    onChange={(e) => setJ("title", e.target.value)}
                    placeholder="e.g. Senior Software Engineer / Store Manager"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Company Name *</label>
                  <Input
                    required
                    value={jobForm.company}
                    onChange={(e) => setJ("company", e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Category *</label>
                  <Input
                    required
                    value={jobForm.category}
                    onChange={(e) => setJ("category", e.target.value)}
                    placeholder="e.g. Information Technology / Retail"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Location *</label>
                  <Input
                    required
                    value={jobForm.location}
                    onChange={(e) => setJ("location", e.target.value)}
                    placeholder="e.g. Mumbai, Pune, Hybrid"
                    className="text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">2</span>
                <h2 className="text-sm font-black text-[#10233F]">Salary & Work Mode</h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Min Salary (₹)</label>
                  <Input
                    type="number"
                    value={jobForm.salaryMin}
                    onChange={(e) => setJ("salaryMin", e.target.value)}
                    placeholder="e.g. 25000"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Max Salary (₹)</label>
                  <Input
                    type="number"
                    value={jobForm.salaryMax}
                    onChange={(e) => setJ("salaryMax", e.target.value)}
                    placeholder="e.g. 45000"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Salary Period</label>
                  <select
                    value={jobForm.salaryType}
                    onChange={(e) => setJ("salaryType", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Daily">Daily Wage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Type</label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJ("jobType", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F]"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Work Mode</label>
                  <select
                    value={jobForm.workMode}
                    onChange={(e) => setJ("workMode", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F]"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Work From Home">Work From Home</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Vacancies</label>
                  <Input
                    type="number"
                    value={jobForm.vacancies}
                    onChange={(e) => setJ("vacancies", e.target.value)}
                    placeholder="5"
                    className="text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">3</span>
                <h2 className="text-sm font-black text-[#10233F]">Job Description & Requirements</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={jobForm.description}
                    onChange={(e) => setJ("description", e.target.value)}
                    placeholder="Enter detailed job description, duties, and candidate expectations..."
                    className="w-full p-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Required Qualification</label>
                    <Input
                      value={jobForm.education}
                      onChange={(e) => setJ("education", e.target.value)}
                      placeholder="e.g. Graduate / B.E. / Any Degree"
                      className="text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Required Experience</label>
                    <Input
                      value={jobForm.experience}
                      onChange={(e) => setJ("experience", e.target.value)}
                      placeholder="e.g. 1 - 3 Years"
                      className="text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] px-6 py-4 flex items-center justify-between sticky bottom-0 shadow-lg">
              <p className="text-[10px] text-[#9DAEC5] font-semibold">* Required fields must be filled before submitting</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowJobForm(false)} className="px-5 py-2.5 rounded-xl border border-[#DCE5F0] text-xs font-bold text-[#5B6B7F] hover:bg-[#F5F8FC] transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#063B78] to-[#0A4F9E] text-white font-black text-xs hover:opacity-90 transition-all shadow-md shadow-[#063B78]/20 flex items-center gap-1.5">
                  {editingJobId ? "✦ Update Job Posting" : "✦ Publish Job"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans">

      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#021D3D] via-[#063B78] to-[#0A4F9E] text-white shadow-xl">
        <div className="h-0.5 w-full bg-gradient-to-r from-[#FFC400] via-[#FFD84D] to-[#FFA500]" />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center size-10 rounded-xl bg-white shadow-md shrink-0">
              <span className="text-[9px] font-black text-[#063B78] leading-none">REAL</span>
              <span className="text-[9px] font-black text-[#FFC400] leading-none">JOB</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-black text-white leading-tight">REAL JOB</div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FFC400]">
                <ShieldCheck className="size-3" />
                Employer Control Portal
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-white/20 mx-2" />

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black text-white">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Employer Account
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Job Credits Indicator */}
            {!isSuperAdmin && (
              <div className="flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 px-3 py-1 rounded-xl text-xs font-extrabold text-amber-300">
                <Zap className="size-3.5 fill-current text-amber-400" />
                <span>Credits: {userCredits >= 999 ? "Unlimited" : userCredits}</span>
                <button
                  onClick={() => setShowPackageModal(true)}
                  className="ml-1 bg-amber-400 hover:bg-amber-500 text-[#063B78] px-2 py-0.5 rounded text-[10px] font-black transition-all"
                >
                  + Add
                </button>
              </div>
            )}

            <Button
              onClick={() => {
                window.localStorage.removeItem("realjob-user");
                dataStore.setCurrentUser(null);
                toast.info("Logged out successfully");
                window.location.href = "/";
              }}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs h-8 px-3 rounded-lg shadow-md"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin Header Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#063B78]/10 px-3.5 py-1 text-xs font-black text-[#063B78] mb-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              {currentUser?.fullName ? `Employer Account: ${currentUser.fullName}` : `REAL JOB PLATFORM ONLINE`}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10233F]">
              {currentUser?.fullName ? `${currentUser.fullName} - Dashboard` : "Employer Control Dashboard"}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5B6B7F] mt-1">
              Email: <span className="font-bold text-[#063B78]">{currentUser?.email}</span> | Manage job postings, candidate verification, and applications.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleAddNewJobClick}
              className="btn-yellow text-xs font-black px-5 py-2.5 shadow-md"
            >
              <Plus className="size-4 mr-1.5" /> + Post New Job
            </Button>
          </div>
        </div>

        {/* Tab Buttons Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-3 border-b border-[#DCE5F0]">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "jobs", label: "Job Listings", icon: BriefcaseBusiness },
            { id: "applications", label: `Job Applications (${applications.length})`, icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${activeTab === t.id
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
                label={isSuperAdmin ? "Total Registered Candidates" : "Candidates Applied to Your Jobs"}
                value={
                  isSuperAdmin
                    ? registeredUsers.filter((u) => u.role === "worker").length.toString()
                    : new Set(applications.map((a) => a.jobSeekerId || a.candidateEmail)).size.toString()
                }
                change={isSuperAdmin ? "Verified Platform Candidates" : "Unique Applicants"}
                icon={Users}
              />
              <StatCard
                label="Active Job Listings"
                value={jobs.filter((j) => j.status === "Active").length.toString()}
                change={isSuperAdmin ? "Platform Total" : "Your Active Jobs"}
                icon={BriefcaseBusiness}
              />
              <StatCard
                label="Total Applications Received"
                value={applications.length.toString()}
                change={isSuperAdmin ? "Platform Total" : "Applications for Your Jobs"}
                icon={FileText}
              />
            </div>

            {/* Platform Analytics Chart */}
            {/* Recent Job Applicants Panel (Visible for 5 Days) */}
            <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-[#10233F] flex items-center gap-2">
                      <span>📩 Candidates Who Applied To Your Jobs</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full">
                        Last 5 Days Window
                      </span>
                    </h2>
                    <p className="text-xs font-semibold text-[#5B6B7F] mt-0.5">
                      Candidates who applied to your posted jobs are displayed here for up to 5 days.
                    </p>
                  </div>
                  <Badge className="bg-[#063B78] text-white font-bold text-xs">
                    {applications.length} Total Applications
                  </Badge>
                </div>

                {/* List of Applicants from Last 5 Days */}
                {(() => {
                  const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
                  const recentApps = applications.filter((app) => {
                    let ts = 0;
                    if (app.appliedDate) {
                      const parsed = Date.parse(app.appliedDate);
                      if (!isNaN(parsed)) ts = parsed;
                    }
                    if (!ts && app.id?.startsWith("app-")) {
                      const parsedTs = Number(app.id.replace("app-", ""));
                      if (!isNaN(parsedTs)) ts = parsedTs;
                    }
                    if (!ts) return true;
                    return Date.now() - ts <= FIVE_DAYS_MS;
                  });

                  if (recentApps.length === 0) {
                    return (
                      <div className="py-10 text-center border-2 border-dashed border-[#E0E8F5] rounded-xl bg-[#F8FAFF] my-2">
                        <FileText className="size-10 text-[#A0AEC0] mx-auto mb-2" />
                        <p className="text-sm font-bold text-[#10233F]">No candidate applications received in the last 5 days</p>
                        <p className="text-xs font-medium text-[#5B6B7F] mt-1">
                          When candidates apply to your posted jobs, they will automatically appear here for 5 days.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3 my-2 max-h-[300px] overflow-y-auto pr-1">
                      {recentApps.map((app) => (
                        <div
                          key={app.id}
                          className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] hover:bg-[#F0F4FA] transition-all flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-[#063B78] text-white font-black text-sm flex items-center justify-center shrink-0">
                              {(app.candidateName || "C").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-[#10233F]">{app.candidateName}</h4>
                              <p className="text-[11px] font-semibold text-[#5B6B7F]">
                                💼 Applied for: <span className="font-bold text-[#063B78]">{app.jobTitle}</span> | 📞 {app.candidateMobile || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Applied: {app.appliedDate || "Recent"} (5 Days Active)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
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
                  All Platform Job Listings
                </h2>
                <p className="text-xs font-semibold text-[#5B6B7F]">
                  Total {jobs.length} job listings available. Manage or update job posts.
                </p>
              </div>

              <div className="w-full sm:w-72 relative">
                <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
                <Input
                  placeholder="Search job title, company, or location..."
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
                    <th className="p-3.5">Job Title</th>
                    <th className="p-3.5">Company</th>
                    <th className="p-3.5">Location & Salary</th>
                    <th className="p-3.5">Vacancies</th>
                    <th className="p-3.5">Approval</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
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
                        {j.approvalStatus === "rejected" ? (
                          <Badge className="bg-red-600 text-white font-bold">❌ Rejected</Badge>
                        ) : j.approvalStatus === "approved" || !j.approvalStatus ? (
                          <Badge className="bg-emerald-600 text-white font-bold">✅ Approved</Badge>
                        ) : (
                          <Badge className="bg-amber-500 text-white font-bold">⏳ Pending Approval</Badge>
                        )}
                      </td>
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
                            View Applications ({applications.filter((a) => a.jobId === j.id).length})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditJobClick(j)}
                            className="font-extrabold text-[11px] border-[#063B78] text-[#063B78] hover:bg-[#F0F5FF]"
                          >
                            <Edit className="size-3.5 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleJobStatus(j.id, j.status)}
                            className="font-extrabold text-[11px] border-gray-400 text-gray-700"
                          >
                            {j.status === "Active" ? "Close Job" : "Activate Job"}
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
                      <td colSpan={7} className="p-8 text-center text-xs font-bold text-[#5B6B7F] bg-[#F8FAFF]">
                        No job listings posted yet.
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
                  Job Applications & Applicants
                </h2>
                <p className="text-xs font-semibold text-[#5B6B7F]">
                  Total {applications.length} candidates applied. Contact candidates directly or update application status.
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
                    ✕ Show All Applications
                  </Button>
                )}
                <div className="w-full sm:w-64 relative">
                  <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
                  <Input
                    placeholder="Search candidate name, job, or phone..."
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
                    <th className="p-3.5">Candidate Name</th>
                    <th className="p-3.5">Applied Job</th>
                    <th className="p-3.5">Direct Contact</th>
                    <th className="p-3.5">Applied Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Details</th>
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
                                href={`tel:${formatCallNumber(a.candidateMobile)}`}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-all flex items-center gap-1"
                              >
                                📞 Call Candidate
                              </a>
                              <a
                                href={`https://wa.me/${formatWaNumber(a.candidateMobile)}?text=${encodeURIComponent(`Hello ${a.candidateName}, regarding your application for ${a.jobTitle}.`)}`}
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
                          <td className="p-3.5 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedApp(expandedApp === a.id ? null : a.id)}
                              className="text-[10px] h-7 px-3 border-[#063B78] text-[#063B78] hover:bg-[#063B78] hover:text-white"
                            >
                              {expandedApp === a.id ? "Hide Details" : "View Details"}
                            </Button>
                          </td>
                        </tr>
                        {expandedApp === a.id && (
                          <tr className="bg-[#F8FAFC]">
                            <td colSpan={6} className="p-4 border-t border-[#DCE5F0]">
                              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                                <h4 className="font-bold text-[#10233F] mb-4 border-b pb-2 flex items-center gap-2">
                                  <FileText className="size-4 text-[#063B78]" />
                                  Candidate Application Details
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
                                    <div className="text-sm font-semibold text-[#5B6B7F]">No additional application details provided.</div>
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
                      <td colSpan={6} className="p-8 text-center text-xs font-bold text-[#5B6B7F] bg-[#F8FAFF]">
                        No job applications received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── JOB PACKAGE SELECTION & CHECKOUT MODAL (ENGLISH) ── */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPackageModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-extrabold text-xl p-2 rounded-full hover:bg-slate-100"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-50 text-[#063B78]">
                <Package className="size-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#063B78]">
                  Activate Job Posting Package
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  You need an active job posting package to post new job listings.
                </p>
              </div>
            </div>

            {/* Package Selector Cards */}
            <div className="space-y-3 my-5">
              {activeJobPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPlanId(pkg.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedPlanId === pkg.id
                      ? "border-[#063B78] bg-blue-50/60 ring-2 ring-[#063B78]/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlanId === pkg.id ? "border-[#063B78] bg-[#063B78] text-white" : "border-slate-300"
                    }`}>
                      {selectedPlanId === pkg.id && <Check className="size-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#063B78]">{pkg.name}</span>
                        {pkg.badge && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            pkg.popular ? "bg-[#063B78] text-amber-300" : "bg-amber-100 text-amber-800"
                          }`}>
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{pkg.description || `${pkg.jobCount >= 999 ? "Unlimited Job Postings" : `${pkg.jobCount} Job Posting Credits`}`}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-[#063B78]">₹{pkg.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Plan Summary */}
            <div className="bg-[#F4F7FB] p-4 rounded-2xl border border-[#DCE5F0] my-4 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500">Selected Plan</p>
                <p className="text-sm font-extrabold text-[#063B78]">{activeSelectedPlan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">Total Amount</p>
                <p className="text-2xl font-black text-emerald-700">₹{activeSelectedPlan.price}</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 my-4">
              <Label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Select Payment Method
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "upi"
                      ? "border-[#063B78] bg-blue-50/70 text-[#063B78] ring-2 ring-[#063B78]/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Smartphone className="size-5" />
                  <span>UPI / GPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "card"
                      ? "border-[#063B78] bg-blue-50/70 text-[#063B78] ring-2 ring-[#063B78]/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="size-5" />
                  <span>Debit / Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "netbanking"
                      ? "border-[#063B78] bg-blue-50/70 text-[#063B78] ring-2 ring-[#063B78]/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Building2 className="size-5" />
                  <span>NetBanking</span>
                </button>
              </div>

              {paymentMethod === "upi" && (
                <div className="pt-2">
                  <Label className="text-xs font-bold text-slate-600 mb-1 block">
                    Enter UPI ID (or pay via PhonePe / GPay)
                  </Label>
                  <Input
                    placeholder="e.g. 9876543210@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="h-11 rounded-xl text-sm font-semibold border-slate-300"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowPackageModal(false)}
                className="flex-1 py-6 rounded-2xl font-bold border-slate-300"
              >
                Cancel
              </Button>
              <Button
                disabled={isProcessingPackage}
                onClick={handleActivatePackage}
                className="flex-1 py-6 rounded-2xl font-black bg-[#063B78] hover:bg-[#082F63] text-white shadow-lg"
              >
                {isProcessingPackage ? (
                  <span>Activating...</span>
                ) : (
                  <span>Pay ₹{activeSelectedPlan.price} & Post Job</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
