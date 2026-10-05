import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { dataStore, JobSeekerProfile } from "@/lib/data-store";
import {
  Briefcase,
  Bookmark,
  User,
  Settings,
  MapPin,
  FileText,
  Building2,
  Calendar,
  TrendingUp,
  Target,
  ChevronDown,
  Search,
  Star,
  ChevronRight,
  Lightbulb,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Edit3,
  Save,
  CheckCircle2,
  Plus,
  X,
  UploadCloud,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserSidebarLayout } from "@/components/portal/UserSidebarLayout";
import { JobCard } from "@/components/portal/JobCard";
import { toast } from "sonner";

// @ts-ignore
export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: search['tab'] as string | undefined,
    }
  },
  component: UserDashboard,
});

function UserDashboard() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const activeTab = search.tab || "overview";

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = dataStore.getCurrentUser("worker");
    if (!currentUser || currentUser.role === "employer" || currentUser.role === "admin") {
      const workerUser = dataStore.getCurrentUser("worker");
      if (workerUser && workerUser.role === "worker") {
        setUser(workerUser);
      } else {
        navigate({ to: "/auth", search: { mode: "login", role: "worker" } });
      }
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  if (!user) return null;

  const applications = dataStore.getJobSeekerApplications(user.id);
  const savedJobRecords = dataStore.getSavedJobs(user.id);
  
  const savedJobsData = savedJobRecords.map(record => {
    const dj = dataStore.getJobById(record.jobId);
    if (!dj) return null;
    return {
      id: dj.id,
      title: dj.title,
      company: dj.company,
      location: dj.location,
      salary: dj.salary,
      experience: dj.experience,
      type: dj.jobType,
      workMode: (dj.workMode as any) || "On-site",
      posted: dj.postedAgo || "Recently",
      initials: dj.initials || dj.company.slice(0, 2).toUpperCase(),
      category: dj.category,
      featured: dj.featured ?? false,
      openings: dj.vacancies ?? 1,
    };
  }).filter(Boolean) as any[];

  return (
    <UserSidebarLayout activeTab={activeTab}>
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Main Left Column (Full Width) */}
          <div className="w-full space-y-6 min-w-0">
            
            {/* Hero Welcome Banner */}
            <div className="relative bg-gradient-to-r from-[#EFF6FF] via-[#F4F8FF] to-[#EBEFFA] rounded-3xl p-6 sm:p-8 border border-blue-100 overflow-hidden shadow-sm">
              
              {/* Floating Banner Illustration / Girl with laptop & bubble */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-4 z-10 pointer-events-none">
                <div className="relative">
                  {/* Floating Speech Bubble */}
                  <div className="absolute -top-3 -left-12 bg-white px-3.5 py-1.5 rounded-2xl shadow-lg border border-blue-50 text-[11px] font-black text-[#10233F] whitespace-nowrap z-20 flex items-center gap-1.5 animate-bounce">
                    <span>Find Your Dream Job !</span>
                  </div>
                  <img 
                    src="/dashboard-hero.png" 
                    alt="Hero Illustration" 
                    className="h-44 object-contain drop-shadow-md"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <div className="relative z-20 max-w-xl">
                <h1 className="text-2xl sm:text-3xl font-black text-[#10233F] tracking-tight">
                  Welcome back, {user.fullName?.split(" ")[0] || user.email?.split("@")[0] || "User"}! 👋
                </h1>
                <p className="text-[#5B6B7F] font-semibold mt-1.5 text-sm">
                  Here is what's happening with your job search today.
                </p>

                {/* 3 Feature Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  {/* Pill 1 */}
                  <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-2xl border border-blue-100/60 flex items-center gap-2.5 shadow-sm">
                    <div className="size-8 rounded-xl bg-blue-100 flex items-center justify-center text-[#125BB5] shrink-0">
                      <Briefcase className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#10233F] truncate">Find Opportunities</p>
                      <p className="text-[10px] font-bold text-gray-400 truncate">Discover the best jobs</p>
                    </div>
                  </div>

                  {/* Pill 2 */}
                  <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-2xl border border-orange-100/60 flex items-center gap-2.5 shadow-sm">
                    <div className="size-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                      <Bookmark className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#10233F] truncate">Save Jobs</p>
                      <p className="text-[10px] font-bold text-gray-400 truncate">Keep track of interests</p>
                    </div>
                  </div>

                  {/* Pill 3 */}
                  <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-2xl border border-emerald-100/60 flex items-center gap-2.5 shadow-sm">
                    <div className="size-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <TrendingUp className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#10233F] truncate">Grow Your Career</p>
                      <p className="text-[10px] font-bold text-gray-400 truncate">Get hired faster</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Stat 1: Applied Jobs */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#DCE5F0] relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="size-10 bg-[#EBF3FF] rounded-xl flex items-center justify-center text-[#125BB5]">
                    <FileText className="size-5" />
                  </div>
                  <span className="text-[11px] font-black text-[#125BB5] bg-[#EBF3FF] px-3 py-1 rounded-full">All time</span>
                </div>
                
                <div className="relative z-10 flex items-end justify-between mt-2">
                  <div>
                    <h3 className="text-xs font-bold text-[#5B6B7F] mb-1">Applied Jobs</h3>
                    <p className="text-3xl font-black text-[#10233F]">{applications.length}</p>
                  </div>
                  <Link to="/dashboard" search={{ tab: "applied" }} className="size-8 rounded-full border border-blue-200 text-[#125BB5] hover:bg-[#125BB5] hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="size-4" />
                  </Link>
                </div>

                {/* Soft Wave SVG Background */}
                <svg className="absolute bottom-0 left-0 w-full h-12 text-[#EBF3FF]/60 pointer-events-none" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,20 Q25,5 50,20 T100,10 L100,30 L0,30 Z" fill="currentColor" />
                </svg>
              </div>
              
              {/* Stat 2: Saved Jobs */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#DCE5F0] relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="size-10 bg-[#FFF4E5] rounded-xl flex items-center justify-center text-[#D97706]">
                    <Bookmark className="size-5" />
                  </div>
                  <span className="text-[11px] font-black text-[#D97706] bg-[#FFF4E5] px-3 py-1 rounded-full">Saved</span>
                </div>
                
                <div className="relative z-10 flex items-end justify-between mt-2">
                  <div>
                    <h3 className="text-xs font-bold text-[#5B6B7F] mb-1">Saved Jobs</h3>
                    <p className="text-3xl font-black text-[#10233F]">{savedJobRecords.length}</p>
                  </div>
                  <Link to="/dashboard" search={{ tab: "saved" }} className="size-8 rounded-full border border-orange-200 text-[#D97706] hover:bg-[#D97706] hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="size-4" />
                  </Link>
                </div>

                {/* Soft Wave SVG Background */}
                <svg className="absolute bottom-0 left-0 w-full h-12 text-[#FFF4E5]/60 pointer-events-none" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,15 Q30,28 60,10 T100,20 L100,30 L0,30 Z" fill="currentColor" />
                </svg>
              </div>

              {/* Stat 3: Profile Views */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#DCE5F0] relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="size-10 bg-[#E8F8F0] rounded-xl flex items-center justify-center text-emerald-600">
                    <User className="size-5" />
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 bg-[#E8F8F0] px-3 py-1 rounded-full">This week</span>
                </div>
                
                <div className="relative z-10 flex items-end justify-between mt-2">
                  <div>
                    <h3 className="text-xs font-bold text-[#5B6B7F] mb-1">Profile Views</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-black text-[#10233F]">{applications.length > 0 ? applications.length * 2 : 0}</p>
                      {/* Micro Bar Chart Graphic */}
                      <div className="flex items-end gap-1 h-6">
                        <div className="w-1.5 h-2 bg-emerald-200 rounded-full"></div>
                        <div className="w-1.5 h-3.5 bg-emerald-300 rounded-full"></div>
                        <div className="w-1.5 h-5 bg-emerald-400 rounded-full"></div>
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <Link to="/dashboard" search={{ tab: "profile" }} className="size-8 rounded-full border border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Inline Search Bar */}
            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-[#DCE5F0] flex flex-col sm:flex-row items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 w-full sm:w-auto h-11">
                <Search className="size-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for jobs, skills, or companies..." 
                  className="w-full bg-transparent border-none focus:outline-none text-xs font-semibold placeholder:text-gray-400 text-[#10233F]"
                />
              </div>
              <div className="w-full sm:w-px h-[1px] sm:h-7 bg-gray-200"></div>
              <div className="flex items-center gap-2.5 px-4 h-11 w-full sm:w-[220px] cursor-pointer hover:bg-gray-50 rounded-xl transition-colors">
                <MapPin className="size-4 text-gray-400 shrink-0" />
                <span className="flex-1 text-xs font-black text-[#10233F] truncate">Pune, Maharashtra</span>
                <ChevronDown className="size-3.5 text-gray-400 shrink-0" />
              </div>
              <Button asChild className="w-full sm:w-auto h-11 px-7 rounded-xl bg-[#051B38] hover:bg-[#092B57] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
                <Link to="/jobs"><Search className="size-3.5" /> Search Jobs</Link>
              </Button>
            </div>

            {/* Recent Applications Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#DCE5F0] overflow-hidden">
              <div className="p-5 border-b border-[#DCE5F0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="size-5 text-[#10233F]" />
                  <h2 className="text-base font-black text-[#10233F]">Recent Applications</h2>
                </div>
                <Link to="/dashboard" search={{ tab: "applied" }} className="text-[#125BB5] font-bold text-xs hover:underline flex items-center gap-1">
                  View All Applications <ChevronRight className="size-3" />
                </Link>
              </div>
              
              {applications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold bg-gray-50/50">
                        <th className="py-3 px-6">Job Title</th>
                        <th className="py-3 px-6">Company</th>
                        <th className="py-3 px-6">Applied Date</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/60 transition-colors font-bold text-[#10233F]">
                          <td className="py-4 px-6 font-black">{app.jobTitle}</td>
                          <td className="py-4 px-6 text-gray-600">{app.companyName}</td>
                          <td className="py-4 px-6 text-gray-500">{app.appliedDate}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black ${
                              app.status === "Selected" ? "bg-emerald-50 text-emerald-800 border border-emerald-300" :
                              app.status === "Shortlisted" ? "bg-amber-50 text-amber-800 border border-amber-300" :
                              app.status === "Interview" ? "bg-purple-50 text-purple-800 border border-purple-300" :
                              app.status === "Viewed" ? "bg-indigo-50 text-indigo-800 border border-indigo-200" :
                              app.status === "Rejected" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                              "bg-[#EBF3FF] text-[#125BB5] border border-blue-100"
                            }`}>
                              {app.status === "Selected" && "✅ Selected / Hired"}
                              {app.status === "Shortlisted" && "⭐ Shortlisted"}
                              {app.status === "Interview" && "📅 Interview"}
                              {app.status === "Viewed" && "👀 Viewed"}
                              {app.status === "Rejected" && "❌ Rejected"}
                              {(!app.status || app.status === "Applied") && "📝 Applied"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="text-gray-400 hover:text-gray-600 p-1">
                              ⋮
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm font-bold text-[#5B6B7F]">अद्याप कोणत्याही नोकरीसाठी अर्ज केलेला नाही (No Applications Yet)</p>
                  <p className="text-xs text-gray-400 mt-1">तुम्ही नोकरीसाठी अर्ज केल्यावर येथे अर्जाची स्थिती दिसेल.</p>
                  <Button asChild className="mt-4 bg-[#063B78] hover:bg-[#082F63] text-white font-bold text-xs px-6 h-9 rounded-xl">
                    <Link to="/jobs">नोकऱ्या शोधा (Find Jobs)</Link>
                  </Button>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {activeTab === "applied" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black text-[#10233F]">Applied Jobs History</h2>
            <span className="text-xs sm:text-sm font-bold text-[#5B6B7F] bg-white px-3 py-1 rounded-full border border-[#DCE5F0]">
              Total Applications: {applications.length}
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-[#DCE5F0] p-4 sm:p-6">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#5B6B7F] font-semibold text-lg">You haven't applied to any jobs yet.</p>
                <Button asChild className="mt-6 bg-[#063B78] hover:bg-[#082F63] text-white font-bold text-xs px-6 h-10 rounded-xl">
                  <Link to="/jobs">Find Jobs to Apply</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="p-5 rounded-2xl border border-[#DCE5F0] bg-white shadow-xs hover:border-[#125BB5] hover:shadow-md transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-[#10233F] text-base sm:text-lg tracking-tight">{app.jobTitle}</h4>
                        <p className="text-xs font-bold text-[#125BB5] mt-0.5">{app.companyName} • {app.location}</p>
                        {app.salary && <p className="text-xs font-semibold text-gray-500 mt-0.5">Salary: {app.salary}</p>}
                      </div>
                      <div className="shrink-0 flex flex-col sm:items-end gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-black ${
                          app.status === "Selected" ? "bg-emerald-50 text-emerald-800 border border-emerald-300" :
                          app.status === "Shortlisted" ? "bg-amber-50 text-amber-800 border border-amber-300" :
                          app.status === "Interview" ? "bg-purple-50 text-purple-800 border border-purple-300" :
                          app.status === "Viewed" ? "bg-indigo-50 text-indigo-800 border border-indigo-200" :
                          app.status === "Rejected" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                          "bg-[#EBF3FF] text-[#125BB5] border border-blue-100"
                        }`}>
                          {app.status === "Selected" && "✅ Selected / Hired"}
                          {app.status === "Shortlisted" && "⭐ Shortlisted"}
                          {app.status === "Interview" && "📅 Interview Scheduled"}
                          {app.status === "Viewed" && "👀 Viewed by HR"}
                          {app.status === "Rejected" && "❌ Application Closed"}
                          {(!app.status || app.status === "Applied") && "📝 Applied"}
                        </span>
                        <p className="text-[11px] font-semibold text-gray-500">Applied on {app.appliedDate}</p>
                      </div>
                    </div>

                    {/* Employer / Admin Reply Message Box */}
                    {app.replyMessage && (
                      <div className="bg-[#F4F8FF] border-l-4 border-[#063B78] p-3.5 rounded-r-xl mt-3 shadow-2xs">
                        <div className="text-xs font-black text-[#063B78] flex items-center justify-between">
                          <span>💬 Reply from Employer / Admin (कंपनीचा संदेश / रिप्लाय):</span>
                          {app.replyDate && <span className="text-[10px] text-gray-500 font-semibold">{app.replyDate}</span>}
                        </div>
                        <p className="text-xs font-bold text-[#10233F] mt-1.5 whitespace-pre-wrap">
                          "{app.replyMessage}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Jobs Tab */}
      {activeTab === "saved" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#10233F]">Saved Jobs</h2>
            <span className="text-sm font-bold text-[#5B6B7F]">{savedJobsData.length} jobs saved</span>
          </div>
          
          {savedJobsData.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-[#DCE5F0] p-12 text-center flex flex-col items-center justify-center">
              <div className="inline-flex items-center justify-center size-20 bg-blue-50 rounded-full mb-5 text-[#063B78]">
                <Bookmark className="size-10" />
              </div>
              <h3 className="text-xl font-black text-[#10233F] mb-3">No Saved Jobs</h3>
              <p className="text-[#5B6B7F] font-medium max-w-md mx-auto mb-6">
                You haven't saved any jobs yet. Browse jobs and click the bookmark icon to save them for later.
              </p>
              <Button asChild className="bg-[#125BB5] hover:bg-[#063B78] text-white font-bold h-11 px-8 rounded-xl shadow-md transition-all">
                <Link to="/jobs"><Search className="size-4 mr-2" /> Browse Jobs</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedJobsData.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <UserProfileSection user={user} />
      )}

      {/* Settings Tab Placeholder */}
      {activeTab === "settings" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h2 className="text-2xl font-black text-[#10233F] capitalize">Settings</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-[#DCE5F0] p-12 text-center flex flex-col items-center justify-center">
            <div className="inline-flex items-center justify-center size-20 bg-blue-50 rounded-full mb-5 text-[#063B78]">
              <Settings className="size-10" />
            </div>
            <h3 className="text-xl font-black text-[#10233F] mb-3">Settings Module</h3>
            <p className="text-[#5B6B7F] font-medium max-w-md mx-auto">
              Configure notifications, account security, and portal preferences here.
            </p>
          </div>
        </div>
      )}
    </UserSidebarLayout>
  );
}

function UserProfileSection({ user }: { user: any }) {
  const [profile, setProfile] = useState<JobSeekerProfile>(() => {
    const existing = dataStore.getJobSeekerProfile(user.id || user.email);
    if (existing) {
      return {
        ...existing,
        fullName: existing.fullName || user.fullName || user.email?.split("@")[0] || "User",
        email: existing.email || user.email || "",
        mobile: existing.mobile || user.mobile || "",
      };
    }
    return {
      id: user.id || `usr-${Date.now()}`,
      email: user.email || "",
      fullName: user.fullName || user.email?.split("@")[0] || "User",
      mobile: user.mobile || "",
      profilePhoto: user.profilePhoto || "",
      currentLocation: "",
      preferredLocation: "",
      education: "",
      skills: [],
      experience: "",
      expectedSalary: "",
      category: "",
      subcategory: "",
      jobType: "Full Time",
      resume: "",
      createdAt: new Date().toISOString()
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");

  useEffect(() => {
    const existing = dataStore.getJobSeekerProfile(user.id || user.email);
    if (existing) {
      setProfile({
        ...existing,
        fullName: existing.fullName || user.fullName || user.email?.split("@")[0] || "User",
        email: existing.email || user.email || "",
        mobile: existing.mobile || user.mobile || "",
      });
    } else {
      const initial: JobSeekerProfile = {
        id: user.id || `usr-${Date.now()}`,
        email: user.email || "",
        fullName: user.fullName || user.email?.split("@")[0] || "User",
        mobile: user.mobile || "",
        profilePhoto: user.profilePhoto || "",
        currentLocation: "",
        preferredLocation: "",
        education: "",
        skills: [],
        experience: "",
        expectedSalary: "",
        category: "",
        subcategory: "",
        jobType: "Full Time",
        resume: "",
        createdAt: new Date().toISOString()
      };
      dataStore.saveJobSeekerProfile(initial);
      setProfile(initial);
    }
  }, [user]);

  const handleSave = () => {
    dataStore.saveJobSeekerProfile(profile);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const addSkill = () => {
    if (newSkillInput.trim() && !profile.skills.includes(newSkillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkillInput.trim()]
      }));
      setNewSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handlePhotoUploadInProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        const updated = { ...profile, profilePhoto: photoUrl };
        setProfile(updated);
        dataStore.saveJobSeekerProfile(updated);
        toast.success("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Resume file size should be less than 10MB");
        return;
      }
      const fileName = file.name;
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileDataUrl = reader.result as string;
        const updated = {
          ...profile,
          resume: fileDataUrl,
          resumeName: fileName
        };
        setProfile(updated);
        dataStore.saveJobSeekerProfile(updated);
        toast.success(`Resume "${fileName}" uploaded successfully!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasResume = Boolean(profile.resume && !profile.resume.includes("_resume.pdf"));
  const resumeDisplayName = profile.resumeName || (hasResume ? (profile.resume?.startsWith("data:") ? "Uploaded_Resume.pdf" : profile.resume) : "No resume uploaded yet");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCE5F0] shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-[#10233F]">My Profile</h2>
          <p className="text-xs font-bold text-[#5B6B7F] mt-1">
            Manage your personal profile, skills, experience, and contact details
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button 
                onClick={() => setIsEditing(false)} 
                variant="outline" 
                className="h-10 px-5 rounded-xl border-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="h-10 px-6 rounded-xl bg-[#063B78] hover:bg-[#082F63] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="size-4" /> Save Changes
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)} 
              className="h-10 px-6 rounded-xl bg-[#063B78] hover:bg-[#082F63] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="size-4" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-bold">Profile updated successfully! All your changes are saved.</p>
        </div>
      )}

      {/* Main Profile Info Card Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE5F0] shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="relative group">
          {profile.profilePhoto || user.profilePhoto ? (
            <img
              src={profile.profilePhoto || user.profilePhoto}
              alt={profile.fullName}
              className="size-24 sm:size-28 rounded-3xl object-cover shadow-xl shrink-0 ring-4 ring-blue-50"
            />
          ) : (
            <div className="size-24 sm:size-28 rounded-3xl bg-gradient-to-br from-[#051B38] to-[#125BB5] text-white flex items-center justify-center font-black text-4xl shadow-xl shrink-0 ring-4 ring-blue-50">
              {profile.fullName?.charAt(0).toUpperCase() || "P"}
            </div>
          )}
          <label className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-[#063B78] text-white cursor-pointer shadow-md hover:bg-[#082F63] transition-colors" title="Upload new photo">
            <UploadCloud className="size-4" />
            <input type="file" accept="image/*" onChange={handlePhotoUploadInProfile} className="hidden" />
          </label>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-2xl font-black text-[#10233F] tracking-tight">{profile.fullName}</h3>
              <p className="text-xs font-bold text-[#125BB5] mt-0.5">{profile.category || "Not Specified"}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#FFC400]/20 text-[#D97706] border border-[#FFC400]/40 self-center md:self-start">
              Verified Candidate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-[#5B6B7F]">
            <div className="flex items-center justify-center md:justify-start gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-gray-100">
              <Mail className="size-4 text-[#125BB5] shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-gray-100">
              <Phone className="size-4 text-emerald-600 shrink-0" />
              <span>{profile.mobile || "Not Specified"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-gray-100">
              <MapPin className="size-4 text-orange-500 shrink-0" />
              <span className="truncate">{profile.currentLocation || "Not Specified"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Personal & Location Info */}
        <div className="bg-white p-6 rounded-3xl border border-[#DCE5F0] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <User className="size-5 text-[#063B78]" />
            <h3 className="text-base font-black text-[#10233F]">Personal & Contact Details</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#5B6B7F] mb-1.5 block">Full Name</label>
              {isEditing ? (
                <Input 
                  value={profile.fullName} 
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="h-11 font-bold text-xs"
                />
              ) : (
                <p className="text-sm font-black text-[#10233F]">{profile.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#5B6B7F] mb-1.5 block">Email Address</label>
                {isEditing ? (
                  <Input 
                    value={profile.email} 
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="h-11 font-bold text-xs"
                  />
                ) : (
                  <p className="text-sm font-bold text-[#10233F]">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-[#5B6B7F] mb-1.5 block">Mobile Number</label>
                {isEditing ? (
                  <Input 
                    value={profile.mobile} 
                    onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                    className="h-11 font-bold text-xs"
                  />
                ) : (
                  <p className="text-sm font-bold text-[#10233F]">{profile.mobile || "Not specified"}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#5B6B7F] mb-1.5 block">Current Location</label>
                {isEditing ? (
                  <Input 
                    value={profile.currentLocation} 
                    onChange={(e) => setProfile({ ...profile, currentLocation: e.target.value })}
                    className="h-11 font-bold text-xs"
                  />
                ) : (
                  <p className="text-sm font-bold text-[#10233F]">{profile.currentLocation || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-[#5B6B7F] mb-1.5 block">Preferred Location</label>
                {isEditing ? (
                  <Input 
                    value={profile.preferredLocation} 
                    onChange={(e) => setProfile({ ...profile, preferredLocation: e.target.value })}
                    className="h-11 font-bold text-xs"
                  />
                ) : (
                  <p className="text-sm font-bold text-[#10233F]">{profile.preferredLocation || "Not specified"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Work & Salary Preferences */}
        <div className="bg-white p-6 rounded-3xl border border-[#DCE5F0] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <Briefcase className="size-5 text-[#063B78]" />
            <h3 className="text-base font-black text-[#10233F]">Professional Preferences</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#5B6B7F] mb-1.5 block">Job Category / Field</label>
                {isEditing ? (
                  <Input 
                    value={profile.category} 
                    onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                    className="h-11 font-bold text-xs"
                  />
                ) : (
                  <p className="text-sm font-black text-[#10233F]">{profile.category || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-[#5B6B7F] mb-1.5 block">Total Experience</label>
                {isEditing ? (
                  <Input 
                    value={profile.experience} 
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    className="h-11 font-bold text-xs"
                  />
                ) : (
                  <p className="text-sm font-bold text-[#10233F]">{profile.experience || "Not specified"}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#5B6B7F] mb-1.5 block">Expected Salary</label>
                {isEditing ? (
                  <Input 
                    value={profile.expectedSalary} 
                    onChange={(e) => setProfile({ ...profile, expectedSalary: e.target.value })}
                    className="h-11 font-bold text-xs"
                  />
                ) : (
                  <p className="text-sm font-bold text-[#10233F]">{profile.expectedSalary || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-[#5B6B7F] mb-1.5 block">Education / Degree</label>
                {isEditing ? (
                  <Input 
                    value={profile.education} 
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    className="h-11 font-bold text-xs"
                  />
                ) : (
                  <p className="text-sm font-bold text-[#10233F]">{profile.education || "Not specified"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Skills Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#DCE5F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Award className="size-5 text-[#063B78]" />
            <h3 className="text-base font-black text-[#10233F]">Key Skills</h3>
          </div>
          <span className="text-xs font-bold text-gray-400">{profile.skills?.length || 0} skills added</span>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {profile.skills?.map((skill, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#EBF3FF] text-[#125BB5] border border-blue-100 shadow-xs">
              {skill}
              {isEditing && (
                <button onClick={() => removeSkill(skill)} className="hover:text-red-600 transition-colors cursor-pointer">
                  <X className="size-3.5" />
                </button>
              )}
            </span>
          ))}
        </div>

        {isEditing && (
          <div className="flex items-center gap-2 pt-2 max-w-md">
            <Input 
              placeholder="Type a new skill (e.g. React, SQL, Driving)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              className="h-10 text-xs font-bold"
            />
            <Button onClick={addSkill} className="h-10 px-4 bg-[#063B78] text-white font-bold text-xs rounded-xl cursor-pointer">
              <Plus className="size-4" /> Add
            </Button>
          </div>
        )}
      </div>

      {/* Resume Attachment Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#DCE5F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-blue-50 text-[#125BB5] flex items-center justify-center shrink-0">
            <FileText className="size-6" />
          </div>
          <div>
            <h4 className="font-black text-sm text-[#10233F]">Uploaded Resume / CV</h4>
            <p className="text-xs font-bold text-gray-500 mt-0.5">{resumeDisplayName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {hasResume && profile.resume && (
            <a
              href={profile.resume}
              download={profile.resumeName || "resume.pdf"}
              target="_blank"
              rel="noreferrer"
              className="h-10 px-4 rounded-xl text-xs font-bold bg-blue-50 text-[#125BB5] hover:bg-blue-100 flex items-center gap-2 transition-colors"
            >
              View / Download Resume
            </a>
          )}
          <label className="h-10 px-5 rounded-xl text-xs font-bold border border-blue-200 text-[#125BB5] hover:bg-blue-50 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer bg-white transition-colors shadow-xs">
            <UploadCloud className="size-4" /> Upload New Resume
            <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleResumeUpload} className="hidden" />
          </label>
        </div>
      </div>

    </div>
  );
}
