import { useState, useEffect } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import {
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  TrendingUp,
  UserCheck,
  Users,
  WalletCards,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { AppShell } from "./AppShell";
import { JobCard, jobs } from "./JobCard";
import { StatCard } from "./Stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { dataStore, ApplicationRecord, ApplicationStatus, JobRecord } from "@/lib/data-store";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

const chart = [
  { m: "Apr", a: 48, b: 18 },
  { m: "May", a: 62, b: 27 },
  { m: "Jun", a: 56, b: 31 },
  { m: "Jul", a: 82, b: 39 },
  { m: "Aug", a: 91, b: 47 },
  { m: "Sep", a: 118, b: 58 },
];

export function SeekerDashboard() {
  const currentUser = dataStore.getCurrentUser();
  const seekerId = currentUser?.email || "candidate@realjob.com";
  const userApps = dataStore.getJobSeekerApplications(seekerId);
  const recommended = dataStore.getRecommendedJobs(["React", "Civil", "Mechanical"]);

  return (
    <AppShell role="user" eyebrow={`Welcome, ${currentUser?.fullName || "Candidate"}`} title="Your Career Dashboard">
      <div className="rounded-lg bg-primary p-6 text-primary-foreground sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase text-accent">Discover your next move</p>
        <h2 className="mt-2 font-display text-3xl font-black">Find your next opportunity</h2>
        <div className="mt-6 flex gap-2 rounded-md bg-primary-foreground p-2">
          <Search className="ml-2 mt-3 size-4 text-muted-foreground" />
          <Input placeholder="Job title, skill or company" className="h-10 border-0 text-foreground shadow-none" />
          <Button asChild>
            <Link to="/jobs">Search</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="My Applications" value={userApps.length.toString()} change="Real-time status tracking" icon={FileText} />
        <StatCard label="Profile Views" value="86" change="18% this month" icon={TrendingUp} />
        <StatCard label="Active Interviews" value={userApps.filter((a) => a.status === "Interview").length.toString()} change="Scheduled by HR" icon={CalendarCheck2} />
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-black text-[#10233F]">Recommended for you</h2>
            <Button asChild variant="link">
              <Link to="/jobs">View all</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recommended.slice(0, 3).map((j: any) => (
              <JobCard
                key={j.id}
                job={{
                  id: j.id,
                  title: j.title,
                  company: j.company,
                  location: j.location,
                  salary: j.salary,
                  experience: j.experience,
                  type: j.jobType || j.type || "Full Time",
                  workMode: (j.workMode as any) || "On-site",
                  posted: j.postedAgo || j.posted || "Recently",
                  initials: j.initials || j.company?.slice(0, 2).toUpperCase() || "CO",
                  category: j.category,
                  featured: j.featured,
                  openings: j.vacancies,
                }}
              />
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#10233F]">Profile strength</h3>
              <strong className="text-primary">85%</strong>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-4/5 rounded-full bg-accent" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Add two recent trade skills to appear in top employer searches.</p>
            <Button variant="outline" className="mt-4 w-full border-[#063B78] text-[#063B78] font-bold">Complete profile</Button>
          </div>

          <div className="salary-panel p-5 rounded-xl">
            <p className="text-xs font-bold uppercase text-accent">Real Job Verification</p>
            <p className="mt-3 font-display text-2xl text-primary-foreground font-black">100% Direct HR</p>
            <p className="text-xs text-primary-foreground/75 mt-1">Zero agency commission · Verified employers</p>
            <Button variant="champagne" className="mt-5 w-full font-bold">View verified status</Button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

export function ApplicationsPage() {
  const currentUser = dataStore.getCurrentUser();
  const seekerId = currentUser?.email || "candidate@realjob.com";

  const [filter, setFilter] = useState<string>("All");
  const [apps, setApps] = useState<ApplicationRecord[]>([]);

  useEffect(() => {
    let list = dataStore.getJobSeekerApplications(seekerId);
    if (list.length === 0) {
      // Provide initial candidate seed applications if none created yet
      list = [
        {
          id: "app-demo1",
          jobId: "job-it1",
          employerId: "TCS",
          jobSeekerId: seekerId,
          candidateName: currentUser?.fullName || "Rutuja Pawar",
          candidateEmail: seekerId,
          candidateMobile: "+91 98220 11223",
          jobTitle: "Full Stack Software Developer",
          companyName: "TCS",
          location: "Pune, Maharashtra",
          salary: "₹50,000–80,000 / month",
          resume: "Rutuja_Pawar_Resume.pdf",
          appliedDate: "Sep 22, 2026",
          status: "Shortlisted",
        },
        {
          id: "app-demo2",
          jobId: "job-c1",
          employerId: "L&T Construction",
          jobSeekerId: seekerId,
          candidateName: currentUser?.fullName || "Rutuja Pawar",
          candidateEmail: seekerId,
          candidateMobile: "+91 98220 11223",
          jobTitle: "Civil Engineer - Site Operations",
          companyName: "L&T Construction",
          location: "Mumbai, Maharashtra",
          salary: "₹35,000–50,000 / month",
          resume: "Rutuja_Pawar_Resume.pdf",
          appliedDate: "Sep 19, 2026",
          status: "Applied",
        },
      ];
    }
    setApps(list);
  }, [seekerId]);

  const filteredApps = apps.filter((a) => {
    if (filter === "All") return true;
    return a.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "Shortlisted":
        return <Badge className="bg-amber-500 text-white font-bold">{status}</Badge>;
      case "Interview":
        return <Badge className="bg-purple-600 text-white font-bold">{status}</Badge>;
      case "Selected":
        return <Badge className="bg-emerald-600 text-white font-bold">{status}</Badge>;
      case "Rejected":
        return <Badge className="bg-red-500 text-white font-bold">{status}</Badge>;
      case "Viewed":
        return <Badge className="bg-blue-600 text-white font-bold">{status}</Badge>;
      default:
        return <Badge variant="secondary" className="font-bold">{status}</Badge>;
    }
  };

  return (
    <AppShell role="user" eyebrow="Career Progress" title="My Applications">
      <div className="flex flex-wrap gap-2">
        {["All", "Applied", "Viewed", "Shortlisted", "Interview", "Selected", "Rejected"].map((x) => (
          <Button
            key={x}
            onClick={() => setFilter(x)}
            variant={filter === x ? "default" : "outline"}
            size="sm"
            className="font-bold text-xs"
          >
            {x} {x === "All" ? `(${apps.length})` : `(${apps.filter((a) => a.status.toLowerCase() === x.toLowerCase()).length})`}
          </Button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-4 border-b border-border bg-secondary px-5 py-3 text-xs font-black uppercase text-muted-foreground sm:grid">
          <span>Job Role & Title</span>
          <span>Company & Location</span>
          <span>Status</span>
          <span>Applied Date</span>
        </div>

        {filteredApps.length === 0 ? (
          <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
            No applications found for category "{filter}". Apply for jobs to track status here!
          </div>
        ) : (
          filteredApps.map((a) => (
            <div
              key={a.id}
              className="grid gap-2 border-b border-border px-5 py-4 last:border-0 sm:grid-cols-[1.4fr_1fr_0.8fr_0.8fr] sm:items-center hover:bg-secondary/30 transition-colors"
            >
              <div>
                <strong className="block text-sm text-[#10233F]">{a.jobTitle}</strong>
                <span className="text-xs font-semibold text-[#125BB5]">{a.salary}</span>
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                <span className="block text-[#10233F] font-bold">{a.companyName}</span>
                <span className="text-xs">{a.location}</span>
              </div>
              <div>{getStatusBadge(a.status)}</div>
              <span className="text-xs font-bold text-muted-foreground">{a.appliedDate}</span>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}

export function SalaryPage({ role = "user" }: { role?: "user" | "admin" }) {
  return (
    <AppShell role={role} eyebrow="September 2026" title={role === "admin" ? "Payroll & E-Salary" : "My E-Salary"}>
      <div className="salary-panel p-6 sm:p-8 rounded-2xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-xs font-bold uppercase text-accent">Net Salary</p>
            <h2 className="mt-2 font-display text-5xl text-primary-foreground font-black">₹28,500</h2>
            <p className="mt-2 text-sm text-primary-foreground/60">Direct HR Salary Record · September 2026</p>
          </div>
          <Button variant="champagne"><FileText /> Download Payslip</Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["Basic Pay", "₹20,000"], ["Allowances", "₹7,500"], ["Performance Bonus", "₹2,000"], ["PF Deductions", "−₹1,000"]].map(([a, b]) => (
            <div key={a} className="rounded-md bg-primary-foreground/5 p-4">
              <p className="text-xs text-primary-foreground/55">{a}</p>
              <strong className="mt-1 block text-primary-foreground">{b}</strong>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function EmployerDashboard() {
  const currentUser = dataStore.getCurrentUser();
  const empName = currentUser?.fullName || currentUser?.email || "L&T Construction";

  const empJobs = dataStore.getEmployerJobs(empName);
  const empApps = dataStore.getEmployerApplications(empName);

  const shortlistedCount = empApps.filter((a) => a.status === "Shortlisted" || a.status === "Selected").length;

  return (
    <AppShell role="admin" eyebrow={empName} title="Employer Recruitment Overview">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-2xl border border-border shadow-xs">
        <div>
          <h2 className="text-xl font-black text-[#10233F]">Recruitment Dashboard ({empName})</h2>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">Manage your posted jobs and candidate applications</p>
        </div>
        <Button asChild className="btn-yellow font-black text-xs px-6 py-3 h-11 shadow-sm">
          <Link to="/post-job">+ Post New Job • नवीन नोकरी पोस्ट करा</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Jobs" value={empJobs.length.toString()} change="Live on portal" icon={BriefcaseBusiness} />
        <StatCard label="Total Applications" value={empApps.length.toString()} change="Direct Candidate Submissions" icon={FileText} />
        <StatCard label="Shortlisted" value={shortlistedCount.toString()} change="Ready for Interview" icon={UserCheck} />
        <StatCard label="Selected Hires" value={empApps.filter((a) => a.status === "Selected").length.toString()} change="Hired Candidate Count" icon={Users} />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div>
            <h2 className="font-display text-xl font-black text-[#10233F]">Applications Trend</h2>
            <p className="text-sm font-semibold text-muted-foreground">Candidate response metrics</p>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="burg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" axisLine={false} tickLine={false} />
                <Tooltip />
                <Area dataKey="a" stroke="var(--chart-1)" fill="url(#burg)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <h2 className="font-display text-xl font-black text-[#10233F]">Hiring Pipeline</h2>
          <div className="mt-6 space-y-5">
            {[
              ["Applied", empApps.length, "100%"],
              ["Shortlisted", empApps.filter((a) => a.status === "Shortlisted").length, "35%"],
              ["Interview Scheduled", empApps.filter((a) => a.status === "Interview").length, "15%"],
              ["Selected", empApps.filter((a) => a.status === "Selected").length, "5%"],
            ].map(([a, b, c]) => (
              <div key={a as string}>
                <div className="flex justify-between text-sm font-bold">
                  <span>{a}</span>
                  <strong>{b as number}</strong>
                </div>
                <div className="mt-2 h-2 rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: c as string }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <RecentCandidates employerName={empName} />
    </AppShell>
  );
}

function RecentCandidates({ employerName }: { employerName: string }) {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  useEffect(() => {
    const list = dataStore.getEmployerApplications(employerName);
    setApplications(list);
  }, [employerName]);

  const updateStatus = (appId: string, newStatus: ApplicationStatus) => {
    dataStore.updateApplicationStatus(appId, newStatus);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    toast.success(`Application status updated to ${newStatus}!`);
  };

  return (
    <section className="mt-7 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="font-display text-xl font-black text-[#10233F]">Received Applications for My Jobs</h2>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">Manage candidate profiles & update recruitment status</p>
        </div>
        <Button asChild variant="outline" size="sm" className="font-bold text-xs">
          <Link to="/employer/applicants">View All Candidates</Link>
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
          No candidate applications received yet for your posted jobs.
        </div>
      ) : (
        applications.map((app) => (
          <div
            key={app.id}
            className="flex flex-wrap items-center gap-4 border-b border-border p-4 last:border-0 hover:bg-secondary/20 transition-colors"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-[#063B78] font-black text-white text-base">
              {app.candidateName.substring(0, 2).toUpperCase()}
            </span>

            <div className="min-w-44 flex-1">
              <strong className="block text-sm font-black text-[#10233F]">{app.candidateName}</strong>
              <span className="text-xs font-bold text-[#125BB5] block">{app.jobTitle}</span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                📱 {app.candidateMobile} • ✉️ {app.candidateEmail}
              </span>
            </div>

            <div className="text-xs font-bold text-muted-foreground">
              Applied: {app.appliedDate}
            </div>

            {/* Status Update Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-extrabold text-[#10233F]">Status:</label>
              <select
                value={app.status}
                onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                className="h-9 rounded-xl border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F] shadow-2xs focus:ring-1 focus:ring-[#063B78]"
              >
                <option value="Applied">Applied</option>
                <option value="Viewed">Viewed</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info(`Viewing resume: ${app.resume}`)}
              className="font-bold text-xs border-[#063B78] text-[#063B78]"
            >
              📄 Resume
            </Button>
          </div>
        ))
      )}
    </section>
  );
}

export function GenericAdminPage({ role, title }: { role: "admin" | "super"; title: string }) {
  const currentUser = dataStore.getCurrentUser();
  const empName = (currentUser as any)?.companyName || currentUser?.fullName || "L&T Construction";

  return (
    <AppShell role={role} eyebrow={empName} title={title}>
      {title === "Applicants" ? (
        <RecentCandidates employerName={empName} />
      ) : title === "Manage Jobs" ? (
        <ManageEmployerJobs employerName={empName} />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#063B78] text-white">
            <WalletCards className="size-6" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-black text-[#10233F]">{title}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-muted-foreground">
            Search, filters, application routing and candidate status management are fully active for {empName}.
          </p>
          <Button asChild className="mt-6 btn-yellow font-black text-xs">
            <Link to="/post-job">+ Create New Job</Link>
          </Button>
        </div>
      )}
    </AppShell>
  );
}

function ManageEmployerJobs({ employerName }: { employerName: string }) {
  const [jobsList, setJobsList] = useState<JobRecord[]>([]);

  useEffect(() => {
    setJobsList(dataStore.getEmployerJobs(employerName));
  }, [employerName]);

  const toggleStatus = (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Closed" : "Active";
    dataStore.updateJob(jobId, { status: newStatus as any });
    setJobsList((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus as any } : j))
    );
    toast.success(`Job status updated to ${newStatus}!`);
  };

  const deleteJob = (jobId: string) => {
    dataStore.deleteJob(jobId);
    setJobsList((prev) => prev.filter((j) => j.id !== jobId));
    toast.success("Job listing removed!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#10233F]">Jobs Posted by {employerName}</h2>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">Manage job status, vacancies and postings</p>
        </div>
        <Button asChild className="btn-yellow font-black text-xs">
          <Link to="/post-job">+ Post New Job</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="hidden grid-cols-[1.5fr_1fr_0.8fr_0.8fr_1fr] gap-4 border-b border-border bg-secondary px-5 py-3 text-xs font-black uppercase text-muted-foreground sm:grid">
          <span>Job Title & Category</span>
          <span>Location & Salary</span>
          <span>Vacancies</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {jobsList.length === 0 ? (
          <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
            No jobs posted yet. Click "+ Post New Job" to list your open vacancies!
          </div>
        ) : (
          jobsList.map((j) => (
            <div
              key={j.id}
              className="grid gap-3 border-b border-border px-5 py-4 last:border-0 sm:grid-cols-[1.5fr_1fr_0.8fr_0.8fr_1fr] sm:items-center hover:bg-secondary/20 transition-colors"
            >
              <div>
                <strong className="block text-sm font-black text-[#10233F]">{j.title}</strong>
                <span className="text-xs font-bold text-[#125BB5]">{j.category}</span>
              </div>
              <div className="text-xs font-semibold">
                <span className="block text-[#10233F] font-bold">{j.location}</span>
                <span className="text-muted-foreground">{j.salary}</span>
              </div>
              <div className="text-xs font-black text-[#063B78]">
                {j.vacancies || 10} Openings
              </div>
              <div>
                <Badge className={j.status === "Active" ? "bg-emerald-600 text-white font-bold" : "bg-gray-500 text-white font-bold"}>
                  {j.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleStatus(j.id, j.status)}
                  className="font-bold text-xs"
                >
                  {j.status === "Active" ? "Close Job" : "Reopen Job"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteJob(j.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export const ControlDashboard = GenericAdminPage;
