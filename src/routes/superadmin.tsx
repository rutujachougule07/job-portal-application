import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ShieldAlert,
  Users,
  Settings,
  Activity,
  Server,
  Database,
  Key,
  Globe,
  Bell,
  LogOut,
  BarChart3,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Check,
  X,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Phone,
  Mail,
  UserCheck,
  BadgeCheck,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/portal/LanguageSwitcher";
import { dataStore, JobRecord, ApplicationRecord, JobPackagePlan, PackageTransaction } from "@/lib/data-store";

export const Route = createFileRoute("/superadmin")({
  head: () => ({
    meta: [
      { title: "Super Admin Control — REAL JOB" },
      { name: "description", content: "Super Administrator Control Panel" },
    ],
  }),
  component: SuperAdminPage,
});

function SuperAdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Dynamic Packages & Purchases State
  const [dynamicPackages, setDynamicPackages] = useState<JobPackagePlan[]>(() => dataStore.getJobPackages());
  const [packagePurchases, setPackagePurchases] = useState<PackageTransaction[]>(() => dataStore.getAllPackagePurchases());

  const handleSavePackages = () => {
    dataStore.saveJobPackages(dynamicPackages);
    toast.success("✅ Job Packages updated! Employer dashboard now uses your live pricing.");
  };

  // CMS State
  const [heroTitle, setHeroTitle] = useState("Welcome to the\nREAL JOB Portal!");
  const [heroSubtitle, setHeroSubtitle] = useState("Right Person • Right Job • Right Opportunity");
  const [heroImages, setHeroImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80"
  ]);
  const [metrics, setMetrics] = useState([
    { value: "10,000+", label: "Verified Workers" },
    { value: "5,000+", label: "Live Job Openings" },
    { value: "2,200+", label: "Employers" },
    { value: "0%", label: "Zero Commission" },
  ]);
  const [aboutData, setAboutData] = useState({
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
    title: "About Our Company",
    description: "REAL JOB is a reliable employment portal that connects job seekers with trusted companies. We focus on creating real opportunities, building successful careers, and supporting growth for individuals and businesses across India."
  });
  const [categories, setCategories] = useState([
    { label: "Factory Worker", iconName: "Factory", theme: "blue" },
    { label: "Construction", iconName: "HardHat", theme: "yellow" },
    { label: "Technical Staff", iconName: "Wrench", theme: "purple" },
    { label: "Transport & Logistics", iconName: "Truck", theme: "green" },
    { label: "Electrician", iconName: "Zap", theme: "orange" },
    { label: "Security Guard", iconName: "Shield", theme: "red" },
    { label: "Office Staff", iconName: "Briefcase", theme: "blue" }
  ]);

  useEffect(() => {
    const savedTitle = localStorage.getItem("cms_heroTitle");
    const savedSubtitle = localStorage.getItem("cms_heroSubtitle");
    const savedImages = localStorage.getItem("cms_heroImages");
    const savedMetrics = localStorage.getItem("cms_metrics");
    const savedAbout = localStorage.getItem("cms_aboutData");
    const savedCategories = localStorage.getItem("cms_categories");
    
    if (savedTitle) setHeroTitle(savedTitle);
    if (savedSubtitle) setHeroSubtitle(savedSubtitle);
    if (savedImages) setHeroImages(JSON.parse(savedImages));
    if (savedMetrics) setMetrics(JSON.parse(savedMetrics));
    if (savedAbout) setAboutData(JSON.parse(savedAbout));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  const [allJobs, setAllJobs] = useState<JobRecord[]>([]);
  const [approvalFilter, setApprovalFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  // Users & Applications State
  const [allUsers, setAllUsers] = useState<Array<{ id: string; email: string; mobile?: string; role: any; fullName: string; createdAt?: string }>>([]);
  const [allApplications, setAllApplications] = useState<ApplicationRecord[]>([]);

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | "worker" | "employer">("all");

  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState<string>("all");

  const refreshData = () => {
    setAllJobs(dataStore.getAllJobs());
    setAllUsers(dataStore.getRegisteredUserAccounts());
    setAllApplications(dataStore.getAllApplications());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const handleApproveJob = (jobId: string) => {
    dataStore.updateJobApprovalStatus(jobId, "approved");
    toast.success("✅ Job Approved Successfully! Now live on portal.");
    refreshData();
  };

  const handleRejectJob = (jobId: string) => {
    dataStore.updateJobApprovalStatus(jobId, "rejected");
    toast.error("❌ Job Posting Rejected.");
    refreshData();
  };

  const handleDeleteJob = (jobId: string) => {
    dataStore.deleteJob(jobId);
    toast.success("🗑️ Job deleted permanently.");
    refreshData();
  };

  const handleDeleteUser = (userId: string) => {
    dataStore.deleteRegisteredUser(userId);
    toast.success("🗑️ User account deleted.");
    refreshData();
  };

  const handleDeleteAllUsers = () => {
    if (window.confirm("Are you sure you want to delete ALL registered users?")) {
      dataStore.deleteAllRegisteredUsers();
      toast.success("🗑️ All registered users deleted successfully!");
      refreshData();
    }
  };

  const handleDeleteApplication = (appId: string) => {
    dataStore.deleteApplication(appId);
    toast.success("🗑️ Application deleted.");
    refreshData();
  };

  const handleDeletePackagePurchase = (txId: string) => {
    dataStore.deletePackagePurchase(txId);
    setPackagePurchases(dataStore.getAllPackagePurchases());
    toast.success("🗑️ Package purchase transaction deleted!");
  };

  const handleClearPackagePurchases = () => {
    if (window.confirm("Are you sure you want to clear all package purchase history?")) {
      dataStore.clearPackagePurchases();
      setPackagePurchases([]);
      toast.success("🗑️ Package purchase history cleared!");
    }
  };

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to remove ALL admin data (Jobs, Applications, Users, Packages)?")) {
      dataStore.clearAllAdminData();
      setPackagePurchases([]);
      toast.success("✅ All admin data removed successfully!");
      refreshData();
    }
  };

  const pendingJobsCount = allJobs.filter((j) => j.approvalStatus === "pending").length;
  const approvedJobsCount = allJobs.filter((j) => j.approvalStatus === "approved" || !j.approvalStatus).length;
  const rejectedJobsCount = allJobs.filter((j) => j.approvalStatus === "rejected").length;

  const displayedJobs = allJobs.filter((j) => {
    if (approvalFilter === "pending") return j.approvalStatus === "pending";
    if (approvalFilter === "approved") return j.approvalStatus === "approved" || !j.approvalStatus;
    if (approvalFilter === "rejected") return j.approvalStatus === "rejected";
    return true;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800; // reduced max width
          const MAX_HEIGHT = 600; // reduced max height
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL("image/webp", 0.5); // WebP format for much better compression
          setHeroImages(prev => [...prev, compressedBase64]);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAboutImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setAboutData(prev => ({ ...prev, image: compressedBase64 }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCMS = () => {
    try {
      localStorage.setItem("cms_heroTitle", heroTitle);
      localStorage.setItem("cms_heroSubtitle", heroSubtitle);
      localStorage.setItem("cms_metrics", JSON.stringify(metrics));
      localStorage.setItem("cms_aboutData", JSON.stringify(aboutData));
      localStorage.setItem("cms_categories", JSON.stringify(categories));
      localStorage.setItem("cms_heroImages", JSON.stringify(heroImages));
      
      toast.success("Landing page content updated successfully!");
    } catch (e) {
      console.error("Failed to save CMS data:", e);
      toast.error("Failed to save! If you uploaded new images, they might be too large (Browser limit is 5MB). Please try uploading smaller images.");
    }
  };

  const [loginBusy, setLoginBusy] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginBusy(true);

    const SUPERADMIN_EMAIL = "supera@gmail.com";
    const enteredEmail = username.trim().toLowerCase();

    if (enteredEmail !== SUPERADMIN_EMAIL && enteredEmail !== "superadmin") {
      toast.error("❌ Access Denied! Only the Super Admin can access this panel.");
      setLoginBusy(false);
      return;
    }

    const emailToUse = SUPERADMIN_EMAIL;

    try {
      const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import("firebase/auth");
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, emailToUse, password);
      } catch (signInErr: any) {
        const errCode = signInErr?.code || "";
        if ((errCode === "auth/user-not-found" || errCode === "auth/invalid-credential") && password === "supera123") {
          try {
            await createUserWithEmailAndPassword(auth, emailToUse, password);
          } catch {
            // If creation fails, still allow supera123
          }
        } else {
          throw signInErr;
        }
      }
      setIsAuthenticated(true);
      toast.success("✅ Welcome, Super Administrator!");
    } catch (err: any) {
      if (password === "supera123") {
        setIsAuthenticated(true);
        toast.success("✅ Welcome, Super Administrator!");
      } else {
        const code = err?.code || "";
        if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
          toast.error("❌ चुकीचा पासवर्ड! Superadmin password is 'supera123'.");
        } else if (code === "auth/user-not-found") {
          toast.error("❌ User not found.");
        } else if (code === "auth/too-many-requests") {
          toast.error("⚠️ Too many attempts. Please try again later.");
        } else {
          toast.error(`Login Failed: ${err?.message || "Unknown error"}`);
        }
      }
    } finally {
      setLoginBusy(false);
    }
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
    toast.success("Superadmin logged out.");
    navigate({ to: "/", hash: "main", replace: true });
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const stats = [
    { label: "Total Users", value: "24,592", trend: "+12%", color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Active Jobs", value: "8,143", trend: "+5%", color: "text-emerald-500", bg: "bg-emerald-100" },
    { label: "Total Revenue", value: "₹4.2M", trend: "+18%", color: "text-purple-500", bg: "bg-purple-100" },
    { label: "System Health", value: "99.9%", trend: "Stable", color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#021D3D] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-[#0A4F9E]/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500 border border-[#0A4F9E]/20">
          <div className="p-8 text-center bg-gradient-to-b from-[#F8FAFF] to-white border-b border-[#E0E8F5]">
            <div className="size-16 bg-gradient-to-br from-[#D4AF37] to-[#F1C40F] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 mx-auto mb-5 border-[3px] border-white">
              <ShieldAlert className="size-8 text-[#021D3D]" />
            </div>
            <h1 className="text-2xl font-black text-[#063B78] tracking-tight">System Root Login</h1>
            <p className="text-sm font-semibold text-[#5B6B7F] mt-1">Superadmin Access Only</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-[11px] font-black text-[#5B6B7F] uppercase tracking-wider mb-2">Admin Username</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#9DAEC5] group-focus-within:text-[#063B78] transition-colors" />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl text-sm font-semibold text-[#063B78] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] focus:bg-white transition-all"
                  placeholder="supera@gmail.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black text-[#5B6B7F] uppercase tracking-wider mb-2">Secure Password</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#9DAEC5] group-focus-within:text-[#063B78] transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl text-sm font-semibold text-[#063B78] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] focus:bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Button type="submit" disabled={loginBusy} className="w-full h-12 bg-gradient-to-r from-[#063B78] to-[#0A4F9E] hover:from-[#0A4F9E] hover:to-[#063B78] text-white font-black rounded-xl text-sm shadow-lg shadow-[#063B78]/20 transition-all active:scale-95 border-b-[3px] border-[#021D3D] disabled:opacity-50">
                {loginBusy ? "Authenticating..." : "Authenticate & Access"}
              </Button>
            </div>
          </form>
          
          <div className="p-4 text-center bg-[#F8FAFF] text-[10px] uppercase font-black text-[#9DAEC5] tracking-widest border-t border-[#E0E8F5]">
            Protected by REAL JOB Security
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FA] flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#021D3D] text-white flex flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 bg-gradient-to-br from-[#D4AF37] to-[#F1C40F] rounded-xl flex items-center justify-center shadow-lg border-[2px] border-white/10">
              <ShieldAlert className="size-5 text-[#021D3D]" />
            </div>
            <div>
              <h1 className="font-black text-lg leading-none tracking-tight">SUPERADMIN</h1>
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">Master Control</span>
            </div>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard Overview", icon: BarChart3 },
            { id: "job-approvals", label: "Job Approvals", icon: CheckCircle2, count: pendingJobsCount },
            { id: "users-directory", label: "Registered Users", icon: Users, count: allUsers.length },
            { id: "job-applications", label: "Job Applications", icon: FileText, count: allApplications.length },
            { id: "packages", label: "Job Packages & Pricing", icon: IndianRupee },
            { id: "landing-page", label: "Landing Page", icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-[#D4AF37] text-[#021D3D] shadow-md shadow-[#D4AF37]/20"
                  : "text-[#9DAEC5] hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="size-4" />
                {item.label}
              </div>
              {item.count ? (
                <span className="px-2 py-0.5 text-[11px] font-black rounded-full bg-amber-500 text-white animate-pulse">
                  {item.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#9DAEC5] hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-[#E0E8F5] flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-[#063B78] capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DAEC5]" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="w-64 h-10 pl-10 pr-4 rounded-full bg-[#F8FAFF] border border-[#DCE5F0] text-sm font-semibold focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all text-[#063B78]"
              />
            </div>
            <div className="size-10 bg-[#F8FAFF] border border-[#DCE5F0] rounded-full flex items-center justify-center relative cursor-pointer hover:bg-gray-100 transition-colors">
              <Bell className="size-5 text-[#5B6B7F]" />
              <span className="absolute top-2 right-2 size-2 bg-[#D4AF37] rounded-full border border-white"></span>
            </div>
            <LanguageSwitcher />
            <div className="flex items-center gap-3 pl-4 border-l border-[#E0E8F5] cursor-pointer">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-[#063B78]">System Root</div>
                <div className="text-[10px] font-bold text-[#D4AF37]">Super Administrator</div>
              </div>
              <div className="size-10 bg-gradient-to-br from-[#063B78] to-[#0A4F9E] rounded-xl flex items-center justify-center text-white font-black shadow-md border-b-[2px] border-[#021D3D]">
                SR
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E0E8F5] flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                      <p className="text-xs font-bold text-[#5B6B7F] uppercase tracking-wider mb-2">{stat.label}</p>
                      <h3 className="text-3xl font-black text-[#063B78]">{stat.value}</h3>
                      <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> {stat.trend} this month
                      </p>
                    </div>
                    <div className={`size-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                      <Activity className="size-6" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Server Status Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E0E8F5] shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-[#063B78]">System Performance Map</h3>
                    <Button variant="outline" size="sm" className="text-xs font-bold border-[#DCE5F0] text-[#063B78] hover:bg-[#F8FAFF]">View Detailed Logs</Button>
                  </div>
                  <div className="h-64 bg-[#F8FAFF] rounded-xl border border-[#DCE5F0] flex flex-col items-center justify-center text-[#9DAEC5]">
                    <Activity className="size-12 mb-3 text-[#DCE5F0]" />
                    <p className="font-bold text-sm text-[#5B6B7F]">All systems operational.</p>
                    <p className="text-xs mt-1">Live metrics graph placeholder.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-black text-[#063B78]">Active Admin Accounts</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#063B78]">
                        {allUsers.filter(u => u.role === "admin").length} Registered
                      </span>
                    </div>

                    <div className="space-y-3">
                      {allUsers.filter(u => u.role === "admin").length === 0 ? (
                        <div className="p-4 text-center border border-dashed border-[#E0E8F5] rounded-xl text-xs text-[#5B6B7F] font-semibold bg-[#F8FAFF]">
                          No secondary admin accounts registered.
                        </div>
                      ) : (
                        allUsers.filter(u => u.role === "admin").map((admin) => (
                          <div key={admin.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFF] border border-[#E0E8F5]">
                            <div className="flex items-center gap-3">
                              <div className="size-9 bg-[#063B78] text-white rounded-full flex items-center justify-center font-black text-xs">
                                {admin.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-xs text-[#063B78]">{admin.fullName}</p>
                                <p className="text-[10px] text-[#5B6B7F]">{admin.email}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                              Active
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E0E8F5] mt-4 space-y-2">
                    <Button 
                      onClick={handleClearAllData}
                      variant="outline"
                      className="w-full text-xs font-bold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-3.5 mr-1.5" /> Clear All Data In Admin
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "job-approvals" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stat Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setApprovalFilter("pending")}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    approvalFilter === "pending"
                      ? "bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/20"
                      : "bg-white border-[#E0E8F5] text-[#063B78] hover:bg-[#F8FAFF]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider opacity-90">⏳ Pending Approval</span>
                    <Clock className="size-5" />
                  </div>
                  <div className="text-3xl font-black">{pendingJobsCount}</div>
                  <p className="text-xs mt-1 opacity-80">Jobs awaiting approval</p>
                </button>

                <button
                  onClick={() => setApprovalFilter("approved")}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    approvalFilter === "approved"
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-lg shadow-emerald-600/20"
                      : "bg-white border-[#E0E8F5] text-[#063B78] hover:bg-[#F8FAFF]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider opacity-90">✅ Approved Jobs</span>
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div className="text-3xl font-black">{approvedJobsCount}</div>
                  <p className="text-xs mt-1 opacity-80">Jobs live on portal</p>
                </button>

                <button
                  onClick={() => setApprovalFilter("rejected")}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    approvalFilter === "rejected"
                      ? "bg-red-600 text-white border-red-700 shadow-lg shadow-red-600/20"
                      : "bg-white border-[#E0E8F5] text-[#063B78] hover:bg-[#F8FAFF]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider opacity-90">❌ Rejected Jobs</span>
                    <XCircle className="size-5" />
                  </div>
                  <div className="text-3xl font-black">{rejectedJobsCount}</div>
                  <p className="text-xs mt-1 opacity-80">Rejected job postings</p>
                </button>
              </div>

              {/* Header & Filter Pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border border-[#E0E8F5] shadow-sm gap-3">
                <h3 className="text-lg font-black text-[#063B78]">Job Moderation Queue</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: "pending", label: `Pending (${pendingJobsCount})` },
                    { id: "approved", label: `Approved (${approvedJobsCount})` },
                    { id: "rejected", label: `Rejected (${rejectedJobsCount})` },
                    { id: "all", label: `All Jobs (${allJobs.length})` },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setApprovalFilter(btn.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        approvalFilter === btn.id
                          ? "bg-[#063B78] text-white shadow-sm"
                          : "bg-[#F8FAFF] text-[#5B6B7F] hover:bg-[#E0E8F5]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-4">
                {displayedJobs.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 border border-[#E0E8F5] text-center">
                    <CheckCircle2 className="size-12 mx-auto text-[#9DAEC5] mb-3" />
                    <h4 className="text-base font-black text-[#063B78]">No jobs found</h4>
                    <p className="text-xs text-[#5B6B7F] mt-1">There are currently no job postings under this filter.</p>
                  </div>
                ) : (
                  displayedJobs.map((j) => (
                    <div key={j.id} className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm p-6 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-black text-[#063B78]">{j.title}</h3>
                            {j.approvalStatus === "rejected" ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1">
                                ❌ Rejected
                              </span>
                            ) : j.approvalStatus === "approved" || !j.approvalStatus ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">
                                ✅ Approved (Live on Portal)
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 animate-pulse">
                                ⏳ Pending Super Admin Approval
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full bg-[#F8FAFF] border border-[#DCE5F0] text-[#063B78] text-xs font-bold">
                              {j.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-bold text-[#5B6B7F] flex-wrap pt-1">
                            <span className="flex items-center gap-1 text-[#063B78]"><Building2 className="size-3.5" /> {j.company}</span>
                            <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200"><UserCheck className="size-3.5" /> Job Poster: <strong>{j.employerId || j.company}</strong></span>
                            <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {j.location}</span>
                            <span className="flex items-center gap-1 text-emerald-700"><IndianRupee className="size-3.5" /> {j.salary}</span>
                            <span className="flex items-center gap-1"><Briefcase className="size-3.5" /> {j.jobType} ({j.vacancies || 1} Vacancies)</span>
                            <span className="flex items-center gap-1"><Clock className="size-3.5" /> {j.postedAgo}</span>
                          </div>

                          <p className="text-xs text-[#5B6B7F] line-clamp-2 pt-2 bg-[#F8FAFF] p-3 rounded-xl border border-[#E0E8F5]">
                            {j.description}
                          </p>

                          <button
                            onClick={() => setExpandedJobId(expandedJobId === j.id ? null : j.id)}
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#063B78] hover:text-[#0A4F9E] hover:underline"
                          >
                            <Eye className="size-3.5 text-[#063B78]" />
                            {expandedJobId === j.id ? "Hide Submission Details" : "View All Submission Details"}
                            {expandedJobId === j.id ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row md:flex-col items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-[#E0E8F5] pt-4 md:pt-0 md:pl-6 min-w-[170px]">
                          {j.approvalStatus !== "approved" && (
                            <Button
                              onClick={() => handleApproveJob(j.id)}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-10 shadow-sm"
                            >
                              <Check className="size-4 mr-1" />
                              Approve Job
                            </Button>
                          )}
                          {j.approvalStatus !== "rejected" && (
                            <Button
                              variant="outline"
                              onClick={() => handleRejectJob(j.id)}
                              className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 font-bold text-xs h-9"
                            >
                              <X className="size-4 mr-1" />
                              Reject Job
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => handleDeleteJob(j.id)}
                            className="w-full border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs h-9"
                          >
                            <Trash2 className="size-3.5 mr-1" />
                            Delete Job
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Full Details Drawer */}
                      {expandedJobId === j.id && (
                        <div className="mt-4 pt-4 border-t border-[#E0E8F5] space-y-4 animate-in fade-in duration-300">
                          <h4 className="text-xs font-black uppercase tracking-wider text-[#063B78] flex items-center gap-1.5">
                            <Eye className="size-4 text-[#063B78]" /> Full Job Posting Inspection Data
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-[#F8FAFF] p-4 rounded-xl border border-[#DCE5F0] text-xs">
                            <div>
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">Job Title</span>
                              <span className="font-bold text-[#063B78]">{j.title}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">Job Poster Name / Account</span>
                              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block">{j.employerId || j.company}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">Company Name</span>
                              <span className="font-bold text-[#063B78]">{j.company}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">Category & Subcategory</span>
                              <span className="font-bold text-[#063B78]">{j.category} {j.subcategory ? `• ${j.subcategory}` : ""}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">Location / City</span>
                              <span className="font-bold text-[#063B78]">{j.location}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">Salary Package</span>
                              <span className="font-bold text-emerald-700">{j.salary} ({j.salaryType || "Monthly"})</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">Vacancies</span>
                              <span className="font-bold text-[#063B78]">{j.vacancies || 1} Openings</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">Experience Required</span>
                              <span className="font-bold text-[#063B78]">{j.experience || "Freshers / Any"}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">Qualification / Education</span>
                              <span className="font-bold text-[#063B78]">{j.qualification || "Not specified"}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">Job Type & Work Mode</span>
                              <span className="font-bold text-[#063B78]">{j.jobType} ({j.workMode || "On-site"})</span>
                            </div>
                          </div>

                          {/* Full Description */}
                          <div className="bg-[#F8FAFF] p-4 rounded-xl border border-[#DCE5F0] text-xs">
                            <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block mb-1">Full Job Description</span>
                            <p className="text-[#063B78] font-medium leading-relaxed whitespace-pre-line">{j.description || "No description provided."}</p>
                          </div>

                          {/* Skills & Benefits */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="bg-[#F8FAFF] p-3 rounded-xl border border-[#DCE5F0]">
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block mb-1.5">Required Skills</span>
                              {j.requiredSkills && j.requiredSkills.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {j.requiredSkills.map((sk, idx) => (
                                    <span key={idx} className="bg-white px-2 py-0.5 rounded border border-[#DCE5F0] text-[11px] font-bold text-[#063B78]">
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 font-semibold text-[11px]">None specified</span>
                              )}
                            </div>

                            <div className="bg-[#F8FAFF] p-3 rounded-xl border border-[#DCE5F0]">
                              <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block mb-1.5">Perks & Benefits</span>
                              {j.benefits && j.benefits.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {j.benefits.map((b, idx) => (
                                    <span key={idx} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-bold">
                                      {b}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 font-semibold text-[11px]">None specified</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Registered Users Section */}
          {activeTab === "users-directory" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stat Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E0E8F5] shadow-sm">
                  <div className="flex items-center justify-between mb-2 text-[#063B78]">
                    <span className="text-xs font-black uppercase tracking-wider text-[#5B6B7F]">Total Registered Users</span>
                    <Users className="size-5" />
                  </div>
                  <div className="text-3xl font-black text-[#063B78]">{allUsers.length}</div>
                  <p className="text-xs text-[#5B6B7F] mt-1">Platform wide accounts</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E0E8F5] shadow-sm">
                  <div className="flex items-center justify-between mb-2 text-emerald-600">
                    <span className="text-xs font-black uppercase tracking-wider text-[#5B6B7F]">Workers / Job Seekers</span>
                    <UserCheck className="size-5" />
                  </div>
                  <div className="text-3xl font-black text-[#063B78]">
                    {allUsers.filter(u => u.role === "worker").length}
                  </div>
                  <p className="text-xs text-[#5B6B7F] mt-1">Registered worker accounts</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E0E8F5] shadow-sm">
                  <div className="flex items-center justify-between mb-2 text-indigo-600">
                    <span className="text-xs font-black uppercase tracking-wider text-[#5B6B7F]">Employers / Companies</span>
                    <Building2 className="size-5" />
                  </div>
                  <div className="text-3xl font-black text-[#063B78]">
                    {allUsers.filter(u => u.role === "employer" || u.role === "admin").length}
                  </div>
                  <p className="text-xs text-[#5B6B7F] mt-1">Registered company accounts</p>
                </div>
              </div>

              {/* Search & Filter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border border-[#E0E8F5] shadow-sm gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DAEC5]" />
                  <input
                    type="text"
                    placeholder="Search user by name, email or mobile..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F8FAFF] border border-[#DCE5F0] text-xs font-bold text-[#063B78] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: "all", label: `All Users (${allUsers.length})` },
                    { id: "worker", label: `Workers (${allUsers.filter(u => u.role === "worker").length})` },
                    { id: "employer", label: `Employers (${allUsers.filter(u => u.role === "employer" || u.role === "admin").length})` },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setUserRoleFilter(btn.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        userRoleFilter === btn.id
                          ? "bg-[#063B78] text-white shadow-sm"
                          : "bg-[#F8FAFF] text-[#5B6B7F] hover:bg-[#E0E8F5]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                  {allUsers.length > 0 && (
                    <button
                      onClick={handleDeleteAllUsers}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-all flex items-center gap-1 ml-2"
                    >
                      <Trash2 className="size-3.5" /> Remove All Users
                    </button>
                  )}
                </div>
              </div>

              {/* Registered Users Table */}
              <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#063B78] text-white font-black uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-4">User Details</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Role / Type</th>
                        <th className="p-4">Mobile Number</th>
                        <th className="p-4">User ID</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E8F5] font-semibold text-[#10233F]">
                      {allUsers
                        .filter((u) => {
                          if (userRoleFilter === "worker") return u.role === "worker";
                          if (userRoleFilter === "employer") return u.role === "employer" || u.role === "admin";
                          return true;
                        })
                        .filter((u) => {
                          if (!userSearchQuery.trim()) return true;
                          const q = userSearchQuery.toLowerCase();
                          return (
                            u.fullName.toLowerCase().includes(q) ||
                            u.email.toLowerCase().includes(q) ||
                            (u.mobile || "").includes(q)
                          );
                        })
                        .length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#5B6B7F] font-bold">
                            No registered users match your search query.
                          </td>
                        </tr>
                      ) : (
                        allUsers
                          .filter((u) => {
                            if (userRoleFilter === "worker") return u.role === "worker";
                            if (userRoleFilter === "employer") return u.role === "employer" || u.role === "admin";
                            return true;
                          })
                          .filter((u) => {
                            if (!userSearchQuery.trim()) return true;
                            const q = userSearchQuery.toLowerCase();
                            return (
                              u.fullName.toLowerCase().includes(q) ||
                              u.email.toLowerCase().includes(q) ||
                              (u.mobile || "").includes(q)
                            );
                          })
                          .map((u) => (
                            <tr key={u.id} className="hover:bg-[#F8FAFF] transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="size-9 bg-gradient-to-br from-[#063B78] to-[#0A4F9E] text-white font-black rounded-xl flex items-center justify-center text-xs shadow-sm">
                                    {u.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <strong className="block font-black text-[#063B78]">{u.fullName}</strong>
                                    <span className="text-[10px] text-[#5B6B7F]">Registered User</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 font-bold text-[#063B78]">
                                <div className="flex items-center gap-1.5">
                                  <Mail className="size-3.5 text-[#5B6B7F]" />
                                  {u.email}
                                </div>
                              </td>
                              <td className="p-4">
                                {u.role === "employer" || u.role === "admin" ? (
                                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black inline-flex items-center gap-1">
                                    <Building2 className="size-3" /> Employer
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black inline-flex items-center gap-1">
                                    <UserCheck className="size-3" /> Worker / Seeker
                                  </span>
                                )}
                              </td>
                              <td className="p-4 font-bold text-[#5B6B7F]">
                                <div className="flex items-center gap-1.5">
                                  <Phone className="size-3.5 text-[#5B6B7F]" />
                                  {u.mobile || "Not provided"}
                                </div>
                              </td>
                              <td className="p-4 text-[11px] font-mono font-bold text-[#9DAEC5]">{u.id}</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Job Applications Audit Section */}
          {activeTab === "job-applications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stat Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E0E8F5] shadow-sm">
                  <span className="text-xs font-black uppercase tracking-wider text-[#5B6B7F]">Total Applications</span>
                  <div className="text-3xl font-black text-[#063B78] mt-2">{allApplications.length}</div>
                  <p className="text-xs text-[#5B6B7F] mt-1">Submitted on portal</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E0E8F5] shadow-sm">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700">Applied / Under Review</span>
                  <div className="text-3xl font-black text-amber-600 mt-2">
                    {allApplications.filter(a => a.status === "Applied" || a.status === "Viewed").length}
                  </div>
                  <p className="text-xs text-[#5B6B7F] mt-1">New applications</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E0E8F5] shadow-sm">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Shortlisted / Selected</span>
                  <div className="text-3xl font-black text-emerald-600 mt-2">
                    {allApplications.filter(a => a.status === "Shortlisted" || a.status === "Selected").length}
                  </div>
                  <p className="text-xs text-[#5B6B7F] mt-1">Accepted candidates</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E0E8F5] shadow-sm">
                  <span className="text-xs font-black uppercase tracking-wider text-red-700">Rejected Applications</span>
                  <div className="text-3xl font-black text-red-600 mt-2">
                    {allApplications.filter(a => a.status === "Rejected").length}
                  </div>
                  <p className="text-xs text-[#5B6B7F] mt-1">Declined applications</p>
                </div>
              </div>

              {/* Search & Filter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border border-[#E0E8F5] shadow-sm gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DAEC5]" />
                  <input
                    type="text"
                    placeholder="Search candidate name, email or job title..."
                    value={appSearchQuery}
                    onChange={(e) => setAppSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F8FAFF] border border-[#DCE5F0] text-xs font-bold text-[#063B78] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {["all", "Applied", "Shortlisted", "Selected", "Rejected"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setAppStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        appStatusFilter === st
                          ? "bg-[#063B78] text-white shadow-sm"
                          : "bg-[#F8FAFF] text-[#5B6B7F] hover:bg-[#E0E8F5]"
                      }`}
                    >
                      {st === "all" ? `All (${allApplications.length})` : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Applications Table */}
              <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#063B78] text-white font-black uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-4">Candidate Applicant</th>
                        <th className="p-4">Applied Job Title</th>
                        <th className="p-4">Company Name</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Applied Date</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E8F5] font-semibold text-[#10233F]">
                      {allApplications
                        .filter((a) => {
                          if (appStatusFilter !== "all" && a.status !== appStatusFilter) return false;
                          if (!appSearchQuery.trim()) return true;
                          const q = appSearchQuery.toLowerCase();
                          return (
                            a.candidateName.toLowerCase().includes(q) ||
                            a.candidateEmail.toLowerCase().includes(q) ||
                            a.jobTitle.toLowerCase().includes(q) ||
                            a.companyName.toLowerCase().includes(q)
                          );
                        })
                        .length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#5B6B7F] font-bold">
                            No job applications found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        allApplications
                          .filter((a) => {
                            if (appStatusFilter !== "all" && a.status !== appStatusFilter) return false;
                            if (!appSearchQuery.trim()) return true;
                            const q = appSearchQuery.toLowerCase();
                            return (
                              a.candidateName.toLowerCase().includes(q) ||
                              a.candidateEmail.toLowerCase().includes(q) ||
                              a.jobTitle.toLowerCase().includes(q) ||
                              a.companyName.toLowerCase().includes(q)
                            );
                          })
                          .map((a) => (
                            <tr key={a.id} className="hover:bg-[#F8FAFF] transition-colors">
                              <td className="p-4">
                                <strong className="block font-black text-[#063B78]">{a.candidateName}</strong>
                                <div className="text-[11px] text-[#5B6B7F] flex items-center gap-2 mt-0.5">
                                  <span><Mail className="size-3 inline mr-1" />{a.candidateEmail}</span>
                                  {a.candidateMobile && <span><Phone className="size-3 inline mr-1" />{a.candidateMobile}</span>}
                                </div>
                              </td>
                              <td className="p-4">
                                <strong className="block font-bold text-[#063B78]">{a.jobTitle}</strong>
                                <span className="text-[10px] text-[#5B6B7F]">{a.location}</span>
                              </td>
                              <td className="p-4 font-bold text-[#063B78]">{a.companyName}</td>
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1 ${
                                    a.status === "Selected"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : a.status === "Shortlisted"
                                      ? "bg-amber-100 text-amber-800"
                                      : a.status === "Rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {a.status}
                                </span>
                              </td>
                              <td className="p-4 font-bold text-[#5B6B7F]">{a.appliedDate}</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteApplication(a.id)}
                                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                  title="Delete Application"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "landing-page" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white p-6 rounded-2xl border border-[#E0E8F5] shadow-sm">
                <h3 className="text-lg font-black text-[#063B78] mb-6">Landing Page Settings</h3>
                
                <div>
                  <h4 className="text-sm font-black text-[#063B78] mb-4">Hero Banner Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {heroImages.map((img, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="relative rounded-xl overflow-hidden aspect-video border border-[#DCE5F0]">
                          <img src={img} alt={`Banner ${i}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer flex-1 flex items-center justify-center bg-[#F8FAFF] hover:bg-[#E0E8F5] text-[#063B78] border border-[#DCE5F0] text-xs font-bold py-1.5 rounded-lg transition-colors">
                            Edit Image
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const newImages = [...heroImages];
                                    newImages[i] = reader.result as string;
                                    setHeroImages(newImages);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                              const newImages = [...heroImages];
                              newImages.splice(i, 1);
                              setHeroImages(newImages);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <label className="border-2 border-dashed border-[#DCE5F0] hover:border-[#063B78] rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F8FAFF] hover:bg-[#E0E8F5]/50">
                      <span className="text-[#063B78] font-bold text-sm">+ Add Image</span>
                      <span className="text-[10px] sm:text-xs text-[#5B6B7F] mt-1 px-2 text-center">Click or Drag & Drop</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#E0E8F5] pt-6">
                  <h4 className="text-sm font-black text-[#063B78] mb-4">Platform Metrics Section</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {metrics.map((metric, i) => (
                      <div key={i} className="p-4 bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl space-y-3">
                        <div>
                          <label className="block text-[10px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">Value (e.g. 10,000+)</label>
                          <input 
                            type="text" 
                            className="w-full h-9 px-3 bg-white border border-[#DCE5F0] rounded-lg text-sm font-bold text-[#063B78]" 
                            value={metric.value}
                            onChange={(e) => {
                              const newMetrics = [...metrics];
                              if (newMetrics[i]) {
                                newMetrics[i].value = e.target.value;
                                setMetrics(newMetrics);
                              }
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">Label (e.g. Verified Workers)</label>
                          <input 
                            type="text" 
                            className="w-full h-9 px-3 bg-white border border-[#DCE5F0] rounded-lg text-sm font-bold text-[#063B78]" 
                            value={metric.label}
                            onChange={(e) => {
                              const newMetrics = [...metrics];
                              if (newMetrics[i]) {
                                newMetrics[i].label = e.target.value;
                                setMetrics(newMetrics);
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-[#E0E8F5] pt-6">
                  <h4 className="text-sm font-black text-[#063B78] mb-4">About Company Section</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-black text-[#5B6B7F] uppercase tracking-wider mb-2">Company Image</label>
                      <div className="flex flex-col gap-2 max-w-sm">
                        <div className="relative rounded-xl overflow-hidden aspect-video border border-[#DCE5F0]">
                          <img src={aboutData.image} alt="About Company" className="w-full h-full object-cover" />
                        </div>
                        <label className="cursor-pointer flex items-center justify-center bg-[#F8FAFF] hover:bg-[#E0E8F5] text-[#063B78] border border-[#DCE5F0] text-xs font-bold py-2 rounded-lg transition-colors">
                          Change Image
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleAboutImageUpload}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-[#5B6B7F] uppercase tracking-wider mb-2">Title</label>
                      <input 
                        type="text" 
                        className="w-full h-10 px-4 bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl text-sm font-semibold text-[#063B78] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                        value={aboutData.title}
                        onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-black text-[#5B6B7F] uppercase tracking-wider mb-2">Description</label>
                      <textarea 
                        className="w-full h-24 p-4 bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl text-sm font-semibold text-[#063B78] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none" 
                        value={aboutData.description}
                        onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#E0E8F5] pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-black text-[#063B78]">Popular Job Categories</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-dashed border-[#063B78]/30 text-[#063B78] font-bold text-xs hover:bg-[#063B78]/5"
                      onClick={() => setCategories([...categories, { label: "New Category", iconName: "Briefcase", theme: "blue" }])}
                    >
                      + Add Category
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat, i) => (
                      <div key={i} className="p-3 bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <label className="block text-[9px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">Label</label>
                          <input 
                            type="text" 
                            className="w-full h-8 px-2.5 bg-white border border-[#DCE5F0] rounded-lg text-xs font-bold text-[#063B78] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                            value={cat.label}
                            onChange={(e) => {
                              const newCat = [...categories];
                              newCat[i]!.label = e.target.value;
                              setCategories(newCat);
                            }}
                          />
                        </div>
                        <div className="flex items-end pt-3">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-8 px-2.5 text-[11px] font-bold"
                            onClick={() => {
                              const newCat = [...categories];
                              newCat.splice(i, 1);
                              setCategories(newCat);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                <div className="mt-8 pt-6 flex justify-end gap-4">
                  <Button 
                    onClick={() => {
                      localStorage.removeItem("cms_heroTitle");
                      localStorage.removeItem("cms_heroSubtitle");
                      localStorage.removeItem("cms_heroImages");
                      localStorage.removeItem("cms_metrics");
                      localStorage.removeItem("cms_aboutData");
                      localStorage.removeItem("cms_categories");
                      toast.success("CMS reset to defaults! Reloading...");
                      setTimeout(() => window.location.reload(), 1000);
                    }} 
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-6"
                  >
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSaveCMS} className="bg-gradient-to-r from-[#063B78] to-[#0A4F9E] text-white font-black px-8">Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: JOB PACKAGES & PRICING */}
          {activeTab === "packages" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Top Header */}
              <div className="bg-white rounded-2xl p-6 border border-[#E0E8F5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#063B78] flex items-center gap-2">
                    <span>💼 Dynamic Job Packages & Pricing Control</span>
                    <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 font-extrabold px-3 py-1 rounded-full">
                      Live Pricing Engine
                    </span>
                  </h2>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                    Super Admin can dynamically update prices, job credits, features, or add new packages for all employers.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => {
                      const newPkg: JobPackagePlan = {
                        id: `plan-${Date.now()}`,
                        name: "Custom Corporate Plan",
                        price: 500,
                        jobCount: 10,
                        badge: "PRO",
                        features: ["10 Active Job Listings", "Priority Listing", "Direct Candidates Contact"],
                      };
                      setDynamicPackages([...dynamicPackages, newPkg]);
                      toast.info("New package draft created. Click 'Save Packages' to apply.");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-sm"
                  >
                    + Add New Package
                  </Button>
                  <Button
                    onClick={handleSavePackages}
                    className="bg-[#063B78] hover:bg-[#082F63] text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md"
                  >
                    💾 Save Package Updates
                  </Button>
                </div>
              </div>

              {/* Packages Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dynamicPackages.map((pkg, idx) => (
                  <div key={pkg.id} className="bg-white rounded-2xl border-2 border-[#E0E8F5] shadow-sm p-5 space-y-4 flex flex-col justify-between hover:border-[#063B78] transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#063B78] tracking-widest">Plan #{idx + 1}</span>
                        <button
                          onClick={() => {
                            const filtered = dynamicPackages.filter(p => p.id !== pkg.id);
                            setDynamicPackages(filtered);
                            toast.info(`Removed ${pkg.name}`);
                          }}
                          className="text-xs text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕ Delete
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#5B6B7F] mb-1">Package Name</label>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => {
                            const updated = [...dynamicPackages];
                            updated[idx]!.name = e.target.value;
                            setDynamicPackages(updated);
                          }}
                          className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-[#5B6B7F] mb-1">Price (₹)</label>
                          <input
                            type="number"
                            value={pkg.price}
                            onChange={(e) => {
                              const updated = [...dynamicPackages];
                              updated[idx]!.price = Number(e.target.value) || 0;
                              setDynamicPackages(updated);
                            }}
                            className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-black text-[#063B78]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#5B6B7F] mb-1">Job Credits</label>
                          <input
                            type="number"
                            value={pkg.jobCount}
                            onChange={(e) => {
                              const updated = [...dynamicPackages];
                              updated[idx]!.jobCount = Number(e.target.value) || 1;
                              setDynamicPackages(updated);
                            }}
                            className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-black text-amber-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#5B6B7F] mb-1">Badge Tag</label>
                        <input
                          type="text"
                          value={pkg.badge || ""}
                          placeholder="e.g. BEST VALUE / UNLIMITED"
                          onChange={(e) => {
                            const updated = [...dynamicPackages];
                            updated[idx]!.badge = e.target.value;
                            setDynamicPackages(updated);
                          }}
                          className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-bold text-[#5B6B7F]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E0E8F5]">
                      <span className="text-[11px] font-bold text-[#063B78]">
                        ⚡ ₹{pkg.price} for {pkg.jobCount >= 999 ? "Unlimited" : `${pkg.jobCount} Job Credits`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Employer Package Purchases History */}
              <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-lg font-black text-[#063B78]">Employer Package Purchases History</h3>
                    <p className="text-xs font-semibold text-[#5B6B7F]">
                      All transactions and active package purchases made by registered employers.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
                      {packagePurchases.length} Total Transactions
                    </span>
                    {packagePurchases.length > 0 && (
                      <button
                        onClick={handleClearPackagePurchases}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-all flex items-center gap-1"
                      >
                        <Trash2 className="size-3.5" /> Clear History
                      </button>
                    )}
                  </div>
                </div>

                {packagePurchases.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-[#E0E8F5] rounded-xl bg-[#F8FAFF]">
                    <IndianRupee className="size-10 text-[#9DAEC5] mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#10233F]">No package purchases recorded yet</p>
                    <p className="text-xs text-[#5B6B7F] mt-1">Purchases completed by employers will appear here in real-time.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#F8FAFF] border-b border-[#E0E8F5] text-[#5B6B7F] font-black uppercase tracking-wider">
                          <th className="p-3">Transaction ID</th>
                          <th className="p-3">Employer / User</th>
                          <th className="p-3">Package Name</th>
                          <th className="p-3">Amount (₹)</th>
                          <th className="p-3">Credits Granted</th>
                          <th className="p-3">Payment Method</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E0E8F5] font-semibold text-[#10233F]">
                        {packagePurchases.map((tx) => (
                          <tr key={tx.id} className="hover:bg-[#F8FAFF] transition-colors">
                            <td className="p-3 font-mono text-[11px] text-[#063B78]">{tx.id}</td>
                            <td className="p-3 font-bold">{tx.userId}</td>
                            <td className="p-3">{tx.planName}</td>
                            <td className="p-3 font-black text-emerald-600">₹{tx.price}</td>
                            <td className="p-3 font-extrabold text-amber-600">{tx.jobCount >= 999 ? "Unlimited" : tx.jobCount}</td>
                            <td className="p-3 font-bold uppercase">{tx.paymentMethod}</td>
                            <td className="p-3 text-[#5B6B7F]">{tx.purchaseDate}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeletePackagePurchase(tx.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                title="Delete Transaction"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab !== "dashboard" && activeTab !== "landing-page" && activeTab !== "job-approvals" && activeTab !== "users-directory" && activeTab !== "job-applications" && activeTab !== "packages" && (
            <div className="h-full flex flex-col items-center justify-center text-[#9DAEC5] animate-in fade-in duration-500">
              <Settings className="size-16 mb-4 text-[#DCE5F0]" />
              <h2 className="text-xl font-black text-[#063B78] mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
              <p className="text-sm font-semibold text-[#5B6B7F]">This module is currently under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
