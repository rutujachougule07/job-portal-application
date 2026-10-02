import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { dataStore } from "@/lib/data-store";
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
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserSidebarLayout } from "@/components/portal/UserSidebarLayout";
import { JobCard } from "@/components/portal/JobCard";

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
    const currentUser = dataStore.getCurrentUser();
    if (!currentUser) {
      navigate({ to: "/auth", search: { mode: "login", role: "worker" } });
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
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Main Left Column */}
          <div className="flex-1 space-y-6 min-w-0">
            
            {/* Hero Welcome Banner */}
            <div className="relative bg-[#F4F9FF] rounded-3xl p-8 sm:p-10 border border-blue-50 overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-[50%] h-full hidden lg:block">
                {/* Background decorative blob */}
                <div className="absolute inset-0 bg-gradient-to-l from-[#F4F9FF] to-transparent z-10"></div>
                <img src="/dashboard-hero.png" alt="Dashboard Illustration" className="absolute bottom-0 right-4 h-64 object-contain z-0 drop-shadow-2xl" />
              </div>
              
              <div className="relative z-20 max-w-xl">
                <h1 className="text-3xl sm:text-4xl font-black text-[#10233F] tracking-tight">
                  Welcome back, {user.fullName?.split(" ")[0]}! 👋
                </h1>
                <p className="text-[#5B6B7F] font-semibold mt-2 text-base">Here is what's happening with your job search today.</p>
              </div>
            </div>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Stat 1 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#DCE5F0] relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-50/50 rounded-full mix-blend-multiply"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="size-12 bg-[#F0F6FF] rounded-2xl flex items-center justify-center text-[#125BB5]">
                    <FileText className="size-6" />
                  </div>
                  <span className="text-[11px] font-bold text-[#125BB5] bg-[#F0F6FF] px-2.5 py-1 rounded-full border border-blue-100">All time</span>
                </div>
                <div className="relative z-10">
                  <p className="text-4xl font-black text-[#10233F]">{applications.length}</p>
                  <p className="text-sm font-bold text-[#5B6B7F] mt-1">Applied Jobs</p>
                </div>
              </div>
              
              {/* Stat 2 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#DCE5F0] relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-50/50 rounded-full mix-blend-multiply"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="size-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                    <Bookmark className="size-6" />
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">Saved</span>
                </div>
                <div className="relative z-10">
                  <p className="text-4xl font-black text-[#10233F]">{savedJobRecords.length}</p>
                  <p className="text-sm font-bold text-[#5B6B7F] mt-1">Saved Jobs</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#DCE5F0] relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-end mb-6 relative z-10">
                  <div className="size-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <User className="size-6" />
                  </div>
                </div>
                <div className="relative z-10 text-center -mt-2">
                  <p className="text-4xl font-black text-[#10233F]">12</p>
                  <p className="text-sm font-bold text-[#5B6B7F] mt-1">Profile Views</p>
                </div>
              </div>
            </div>

            {/* Inline Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-[#DCE5F0] flex flex-col sm:flex-row items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 w-full sm:w-auto h-12">
                <Search className="size-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for jobs, skills, or companies..." 
                  className="w-full bg-transparent border-none focus:outline-none text-sm font-semibold placeholder:text-gray-400 text-[#10233F]"
                />
              </div>
              <div className="w-full sm:w-px h-[1px] sm:h-8 bg-gray-200"></div>
              <div className="flex items-center gap-3 px-4 h-12 w-full sm:w-[220px] cursor-pointer hover:bg-gray-50 rounded-xl transition-colors">
                <MapPin className="size-5 text-gray-400" />
                <span className="flex-1 text-sm font-semibold text-[#10233F] truncate">Pune, Maharashtra</span>
                <ChevronDown className="size-4 text-gray-400" />
              </div>
              <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#063B78] hover:bg-[#082F63] text-white font-bold text-sm shadow-md transition-all">
                Search Jobs
              </Button>
            </div>

            {/* Recent Applications Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#DCE5F0] overflow-hidden">
              <div className="p-6 border-b border-[#DCE5F0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-[#10233F]" />
                  <h2 className="text-lg font-black text-[#10233F]">Recent Applications</h2>
                </div>
                <Link to="/dashboard" search={{ tab: "applied" }} className="text-[#125BB5] font-bold text-xs hover:underline flex items-center gap-1">
                  View All Applications <ChevronRight className="size-3" />
                </Link>
              </div>
              
              <div className="p-0">
                <div className="grid grid-cols-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-[#5B6B7F] tracking-wide">
                  <div className="col-span-1">Job Title</div>
                  <div className="col-span-1 text-center">Company</div>
                  <div className="col-span-1 text-center">Applied Date</div>
                  <div className="col-span-1 text-center">Status</div>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="size-20 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto mb-5 relative">
                      <FileText className="size-8 text-[#125BB5]" />
                      <Search className="size-6 text-[#FFC400] absolute -bottom-1 -right-1 drop-shadow-md" />
                    </div>
                    <h3 className="text-lg font-black text-[#10233F]">No applications yet</h3>
                    <p className="text-sm font-semibold text-[#5B6B7F] mt-2 mb-6 max-w-xs mx-auto">
                      You haven't applied to any jobs yet. Browse our job listings and take the next step in your career.
                    </p>
                    <Button asChild className="bg-[#125BB5] hover:bg-[#063B78] text-white font-bold h-11 px-8 rounded-xl shadow-md transition-all">
                      <Link to="/jobs"><Search className="size-4 mr-2" /> Browse Jobs</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {applications.slice(0, 4).map((app) => (
                      <div key={app.id} className="grid grid-cols-4 items-center px-6 py-5 hover:bg-[#F8FAFC] transition-colors group">
                        <div className="col-span-1 font-black text-sm text-[#10233F] truncate pr-4">
                          {app.jobTitle}
                        </div>
                        <div className="col-span-1 text-center font-bold text-sm text-[#5B6B7F] truncate px-2">
                          {app.companyName}
                        </div>
                        <div className="col-span-1 text-center font-bold text-sm text-[#5B6B7F] px-2">
                          {app.appliedDate}
                        </div>
                        <div className="col-span-1 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-[#EBF1F8] text-[#063B78] border border-[#B8D3F2]">
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            
            {/* Recommended Jobs */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#DCE5F0] overflow-hidden">
              <div className="p-5 border-b border-[#DCE5F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-5 text-[#FFC400] fill-[#FFC400]" />
                  <h2 className="text-base font-black text-[#10233F]">Recommended Jobs</h2>
                </div>
                <Link to="/jobs" className="text-[#125BB5] font-bold text-[11px] hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="p-5 space-y-4">
                {[
                  { title: "Frontend Developer", company: "TCS", location: "Pune, Maharashtra", time: "2 days ago", logo: "tcs" },
                  { title: "Software Engineer", company: "Infosys", location: "Pune, Maharashtra", time: "3 days ago", logo: "infosys" },
                  { title: "Web Developer", company: "Wipro", location: "Pune, Maharashtra", time: "5 days ago", logo: "wipro" },
                  { title: "React Developer", company: "Accenture", location: "Pune, Maharashtra", time: "1 week ago", logo: "accenture" }
                ].map((job, idx) => (
                  <div key={idx} className="flex gap-4 items-start group cursor-pointer">
                    <div className="size-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-black text-[#10233F] text-lg shrink-0 group-hover:border-[#125BB5] transition-colors shadow-sm overflow-hidden p-1">
                      {/* Temporary initials if logos not available */}
                      <span className="text-xs uppercase bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-600">{job.logo.substring(0,3)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm text-[#10233F] truncate group-hover:text-[#125BB5] transition-colors">{job.title}</h4>
                      <p className="text-[11px] font-bold text-[#5B6B7F] mt-0.5">{job.company}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500">
                          <MapPin className="size-3" /> {job.location}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">{job.time}</p>
                    </div>
                    <Bookmark className="size-4 text-gray-300 hover:text-[#FFC400] hover:fill-[#FFC400] cursor-pointer transition-colors shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Career Tips */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#DCE5F0] overflow-hidden">
              <div className="p-5 border-b border-[#DCE5F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="size-5 text-[#D97706] fill-[#D97706]/20" />
                  <h2 className="text-base font-black text-[#10233F]">Career Tips</h2>
                </div>
                <Link to="/dashboard" search={{ tab: "overview" }} className="text-[#125BB5] font-bold text-[11px] hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="p-5">
                <div className="flex gap-4 items-start">
                  <div className="size-10 bg-orange-50 rounded-full flex items-center justify-center shrink-0 border border-orange-100">
                    <Target className="size-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-[#10233F]">Keep your profile updated</h4>
                    <p className="text-[11px] font-semibold text-[#5B6B7F] mt-1 leading-relaxed">
                      A complete profile can 3x your chances of getting hired.
                    </p>
                    <div className="flex gap-1 mt-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-200"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === "applied" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h2 className="text-3xl font-black text-[#10233F]">Applied Jobs History</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-[#DCE5F0] p-6 sm:p-8">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#5B6B7F] font-semibold text-lg">You haven't applied to any jobs yet.</p>
                <Button asChild className="mt-6 bg-[#063B78] hover:bg-[#082F63] text-white">
                  <Link to="/jobs">Find Jobs to Apply</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:border-[#B8D3F2] hover:shadow-sm transition-all">
                      <div className="flex-1">
                        <h4 className="font-black text-[#10233F] text-lg">{app.jobTitle}</h4>
                        <p className="text-sm font-semibold text-[#5B6B7F] mt-1">{app.companyName} • {app.location}</p>
                      </div>
                      <div className="shrink-0 flex flex-col sm:items-end gap-2">
                        <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-black bg-[#EBF1F8] text-[#063B78] border border-[#B8D3F2]">
                          Status: {app.status}
                        </span>
                        <p className="text-xs font-semibold text-gray-500">Applied on {app.appliedDate}</p>
                      </div>
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

      {/* Placeholder for other tabs */}
      {(activeTab === "profile" || activeTab === "settings") && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h2 className="text-3xl font-black text-[#10233F] capitalize">{activeTab}</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-[#DCE5F0] p-12 text-center flex flex-col items-center justify-center">
            <div className="inline-flex items-center justify-center size-20 bg-blue-50 rounded-full mb-5 text-[#063B78]">
              <Settings className="size-10" />
            </div>
            <h3 className="text-xl font-black text-[#10233F] mb-3">Module Coming Soon</h3>
            <p className="text-[#5B6B7F] font-medium max-w-md mx-auto">
              The <span className="capitalize font-bold text-[#10233F]">{activeTab}</span> section is currently under development. Our team is working hard to bring you these features soon.
            </p>
          </div>
        </div>
      )}
    </UserSidebarLayout>
  );
}
