import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AppShell
} from "@/components/portal/AppShell";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  Building2,
  WalletCards,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Award,
  Settings,
  Globe2,
  BarChart3,
  UserCheck,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/portal/Stats";
import { dataStore, JobRecord, ApplicationRecord } from "@/lib/data-store";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/portal/LanguageSwitcher";
import { Brand } from "@/components/portal/Brand";

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
  { month: "May", workers: 1400, jobs: 450, hires: 310 },
  { month: "Jun", workers: 2100, jobs: 620, hires: 480 },
  { month: "Jul", workers: 3200, jobs: 890, hires: 710 },
  { month: "Aug", workers: 4500, jobs: 1200, hires: 940 },
  { month: "Sep", workers: 5800, jobs: 1650, hires: 1320 },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "employers" | "jobs" | "payroll" | "settings"
  >("overview");

  // Data states
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");

  // Seed User Accounts for Admin View
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: "usr-1", name: "Rahul S. Deshmukh", role: "Worker", mobile: "+91 98220 11223", city: "Pune", trade: "Senior Electrician", status: "Verified" },
    { id: "usr-2", name: "Priya V. Sharma", role: "Worker", mobile: "+91 98334 44556", city: "Mumbai", trade: "Civil Site Supervisor", status: "Verified" },
    { id: "usr-3", name: "L&T Construction Ltd", role: "Employer", mobile: "+91 98990 00111", city: "Mumbai", trade: "Infrastructure", status: "Verified" },
    { id: "usr-4", name: "Nexa Motors Assembly", role: "Employer", mobile: "+91 97665 12345", city: "Chakan, Pune", trade: "Automobile Factory", status: "Pending Verification" },
    { id: "usr-5", name: "Amit K. Patil", role: "Worker", mobile: "+91 98112 33445", city: "Nashik", trade: "CNC Machine Operator", status: "Verified" },
  ]);

  useEffect(() => {
    setJobs(dataStore.getAllJobs());
  }, []);

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

  const handleVerifyUser = (userId: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "Verified" } : u))
    );
    toast.success("Account status updated to Verified!");
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const filteredUsers = registeredUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.trade.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.city.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F8FC]">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#DCE5F0] bg-[#063B78] text-white shadow-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Brand className="h-12 brightness-0 invert" />
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-[#FFC400]">
              <ShieldCheck className="size-4" /> ॲडमिन डॅशबोर्ड (Super Admin Control)
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher showCurrent={true} />
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white hover:text-[#063B78] font-extrabold text-xs"
            >
              <Link to="/home">🌐 मुख्य वेबसाईट (Main Site)</Link>
            </Button>
            <Button
              onClick={() => {
                window.localStorage.removeItem("realjob-user");
                toast.info("Logged out from Admin Dashboard");
                navigate({ to: "/" });
              }}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs"
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
              कामकूट, नवीन नोकऱ्या, कामगार पडताळणी, पेरोल आणि प्लॅटफॉर्म अहवाल नियंत्रण करा.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setActiveTab("jobs")}
              className="btn-yellow text-xs font-black px-4 py-2"
            >
              <Plus className="size-4 mr-1" /> नवीन जॉब मंजुरी (Manage Jobs)
            </Button>
          </div>
        </div>

        {/* Tab Buttons Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-[#DCE5F0]">
          {[
            { id: "overview", label: "📊 सारांश (Overview)", icon: BarChart3 },
            { id: "jobs", label: "💼 नोकरी पोस्टिंग्स (Jobs)", icon: BriefcaseBusiness },
            { id: "users", label: "👥 कामगार & मालक (Users)", icon: Users },
            { id: "employers", label: "🏢 कंपन्या (Employers)", icon: Building2 },
            { id: "payroll", label: "💳 पेरोल / E-Salary", icon: WalletCards },
            { id: "settings", label: "⚙️ सेटिंग्ज (Settings)", icon: Settings },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? "bg-[#063B78] text-white shadow-md"
                  : "bg-white text-[#5B6B7F] border border-[#DCE5F0] hover:bg-[#EBF1F8] hover:text-[#063B78]"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Stat Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="एकूण कामगार (Total Workers)"
                value="12,850+"
                change="+18% या महिन्यात"
                icon={Users}
              />
              <StatCard
                label="सक्रिय नोकऱ्या (Active Jobs)"
                value={jobs.length.toString()}
                change="थेट प्लॅटफॉर्मवर"
                icon={BriefcaseBusiness}
              />
              <StatCard
                label="सत्यापित कंपन्या (Verified Employers)"
                value="1,420+"
                change="100% Verified"
                icon={Building2}
              />
              <StatCard
                label="एकूण पेरोल (Total E-Salary)"
                value="₹1.48 Cr"
                change="Direct HR Transfer"
                icon={WalletCards}
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

              {/* Pending Approvals & Quick Controls */}
              <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-black text-[#10233F]">
                    प्रलंबित पडताळणी (Pending Verifications)
                  </h2>
                  <p className="text-xs font-semibold text-[#5B6B7F]">
                    नवीन कंपनी व कामगार प्रोफाईल पडताळणी
                  </p>
                </div>

                <div className="space-y-4">
                  {registeredUsers
                    .filter((u) => u.status === "Pending Verification")
                    .map((u) => (
                      <div
                        key={u.id}
                        className="p-4 rounded-xl bg-[#F5F8FC] border border-[#DCE5F0] flex items-center justify-between"
                      >
                        <div>
                          <strong className="block text-sm font-black text-[#10233F]">{u.name}</strong>
                          <span className="text-xs font-semibold text-[#5B6B7F]">{u.trade} • {u.city}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleVerifyUser(u.id)}
                          className="btn-yellow text-xs font-black"
                        >
                          मंजूर करा (Verify)
                        </Button>
                      </div>
                    ))}
                  {registeredUsers.filter((u) => u.status === "Pending Verification").length === 0 && (
                    <div className="p-6 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                      ✓ सर्व प्रोफाईल पडताळलेले आहेत! (All profiles verified)
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#DCE5F0] space-y-3">
                  <h3 className="text-xs font-black uppercase text-[#10233F]">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setActiveTab("jobs")}
                      variant="outline"
                      className="border-[#063B78] text-[#063B78] font-bold text-xs"
                    >
                      जॉब लिस्ट पहा
                    </Button>
                    <Button
                      onClick={() => setActiveTab("users")}
                      variant="outline"
                      className="border-[#063B78] text-[#063B78] font-bold text-xs"
                    >
                      युजर लिस्ट पहा
                    </Button>
                  </div>
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
                  एकूण {jobs.length} नोकऱ्या उपलब्ध आहेत. स्थिती बदला किंवा डिलीट करा.
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
                            variant="outline"
                            onClick={() => handleToggleJobStatus(j.id, j.status)}
                            className="font-extrabold text-[11px] border-[#063B78] text-[#063B78]"
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
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USERS CONTROL */}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#10233F]">
                  नोकरी शोधक कामगार & मालक खाते नियंत्रण (User Database)
                </h2>
                <p className="text-xs font-semibold text-[#5B6B7F]">
                  सत्यापित कामगार आणि एम्प्लॉयर प्रोफाईल लिस्ट
                </p>
              </div>

              <div className="w-full sm:w-72 relative">
                <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
                <Input
                  placeholder="नाव / स्किल / शहर शोधा..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 text-xs font-bold"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#DCE5F0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#063B78] text-white font-black uppercase">
                  <tr>
                    <th className="p-3.5">नाव (Name)</th>
                    <th className="p-3.5">प्रकार (Role)</th>
                    <th className="p-3.5">मोबाइल (Contact)</th>
                    <th className="p-3.5">ट्रेड / व्यवसाय (Trade / Industry)</th>
                    <th className="p-3.5">शहर (Location)</th>
                    <th className="p-3.5">पडताळणी (Status)</th>
                    <th className="p-3.5 text-right">कृती (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F0] font-semibold text-[#10233F]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F5F8FC]">
                      <td className="p-3.5 font-black text-[#063B78]">{u.name}</td>
                      <td className="p-3.5">
                        <Badge variant="outline" className="font-bold">{u.role}</Badge>
                      </td>
                      <td className="p-3.5 font-bold">{u.mobile}</td>
                      <td className="p-3.5 text-[#125BB5]">{u.trade}</td>
                      <td className="p-3.5">{u.city}</td>
                      <td className="p-3.5">
                        <Badge
                          className={
                            u.status === "Verified"
                              ? "bg-emerald-600 text-white font-bold"
                              : "bg-amber-500 text-white font-bold"
                          }
                        >
                          {u.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        {u.status !== "Verified" ? (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyUser(u.id)}
                            className="btn-yellow font-black text-[11px]"
                          >
                            सत्यापित करा
                          </Button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-bold">✓ Approved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: EMPLOYERS */}
        {activeTab === "employers" && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
            <h2 className="text-xl font-black text-[#10233F]">
              सत्यापित कारखाने & बांधकाम कंपन्या (Registered Hirers & Factories)
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "L&T Construction Ltd", industry: "Infrastructure & Heavy Engineering", jobs: 12, hires: 145, status: "Verified" },
                { name: "Tata Motors Manufacturing", industry: "Automobile Factory", jobs: 8, hires: 92, status: "Verified" },
                { name: "JSW Steel Plant", industry: "Manufacturing & Metallurgy", jobs: 15, hires: 210, status: "Verified" },
                { name: "Nexa Assembly Ltd", industry: "Industrial Engineering", jobs: 4, hires: 35, status: "Pending Audit" },
              ].map((emp) => (
                <div key={emp.name} className="p-5 rounded-2xl border border-[#DCE5F0] bg-[#F5F8FC] flex items-center justify-between">
                  <div>
                    <strong className="block text-base font-black text-[#10233F]">{emp.name}</strong>
                    <span className="text-xs font-semibold text-[#125BB5] block">{emp.industry}</span>
                    <div className="mt-2 text-xs font-bold text-[#5B6B7F]">
                      Active Jobs: {emp.jobs} • Total Hires: {emp.hires}
                    </div>
                  </div>
                  <Badge className="bg-[#063B78] text-white font-bold">{emp.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PAYROLL */}
        {activeTab === "payroll" && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-[#10233F]">
                  ई-पगार & पेरोल व्यवस्थापन (E-Salary & Direct Payments)
                </h2>
                <p className="text-xs font-semibold text-[#5B6B7F]">
                  Direct HR Payroll audit and digital payslip history
                </p>
              </div>
              <Button className="btn-yellow text-xs font-black">
                + नवीन पेरोल जोडा
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#EBF1F8] border border-[#B8D3F2]">
                <p className="text-xs font-bold text-[#5B6B7F]">एकूण पेरोल</p>
                <strong className="text-lg font-black text-[#063B78]">₹1,48,50,000</strong>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-800">यशस्वी वाटप</p>
                <strong className="text-lg font-black text-emerald-900">100% Verified</strong>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-xs font-bold text-blue-800">कमिशन दर</p>
                <strong className="text-lg font-black text-blue-900">0% (Zero)</strong>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <p className="text-xs font-bold text-purple-800">पेस्लिप्स</p>
                <strong className="text-lg font-black text-purple-900">Instant PDF</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
            <h2 className="text-xl font-black text-[#10233F]">
              सिस्टम सेटिंग्ज (Platform System Configuration)
            </h2>

            <div className="space-y-4 max-w-xl">
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#DCE5F0]">
                <div>
                  <strong className="block text-sm font-bold text-[#10233F]">बहुभाषिक मोड (Multi-language Support)</strong>
                  <span className="text-xs font-semibold text-[#5B6B7F]">मराठी, हिंदी आणि इंग्रजी भाषा सक्रिय</span>
                </div>
                <Badge className="bg-emerald-600 text-white">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-[#DCE5F0]">
                <div>
                  <strong className="block text-sm font-bold text-[#10233F]">थेट फोन कॉल परवानगी (Direct Call Connectivity)</strong>
                  <span className="text-xs font-semibold text-[#5B6B7F]">मध्यस्थांशिवाय थेट संपर्क</span>
                </div>
                <Badge className="bg-emerald-600 text-white">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-[#DCE5F0]">
                <div>
                  <strong className="block text-sm font-bold text-[#10233F]">Zero Commission Policy</strong>
                  <span className="text-xs font-semibold text-[#5B6B7F]">कामगार आणि मालकांसाठी ०% कमिशन नियम</span>
                </div>
                <Badge className="bg-emerald-600 text-white">Enforced</Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
