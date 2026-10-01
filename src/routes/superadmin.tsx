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
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/portal/LanguageSwitcher";

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

    // username field is used as email here
    const enteredEmail = username.trim().toLowerCase();

    if (enteredEmail !== SUPERADMIN_EMAIL) {
      toast.error("❌ Access Denied! Only the Super Admin can access this panel.");
      setLoginBusy(false);
      return;
    }

    try {
      const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, enteredEmail, password);
      setIsAuthenticated(true);
      toast.success("✅ Welcome, Super Administrator!");
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("❌ चुकीचा पासवर्ड! Wrong password. Please try again.");
      } else if (code === "auth/user-not-found") {
        toast.error("❌ User not found.");
      } else if (code === "auth/too-many-requests") {
        toast.error("⚠️ Too many attempts. Please try again later.");
      } else {
        toast.error(`Login Failed: ${err?.message || "Unknown error"}`);
      }
    } finally {
      setLoginBusy(false);
    }
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
    toast.success("Superadmin logged out.");
    navigate({ to: "/" });
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
            { id: "landing-page", label: "Landing Page", icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-[#D4AF37] text-[#021D3D] shadow-md shadow-[#D4AF37]/20"
                  : "text-[#9DAEC5] hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
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

                <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm p-6">
                  <h3 className="text-lg font-black text-[#063B78] mb-6">Active Admins</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Admin Alpha", role: "Verification Manager", status: "Online" },
                      { name: "Admin Beta", role: "Support Lead", status: "Online" },
                      { name: "System Bot", role: "Auto-Moderation", status: "Active" },
                    ].map((admin, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFF] transition-colors border border-transparent hover:border-[#E0E8F5]">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-[#E0E8F5] rounded-full flex items-center justify-center font-black text-[#063B78]">
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#063B78]">{admin.name}</p>
                            <p className="text-xs font-semibold text-[#5B6B7F]">{admin.role}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-700">
                          {admin.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-[#063B78] to-[#0A4F9E] hover:from-[#0A4F9E] hover:to-[#063B78] text-white font-bold border-b-[3px] border-[#021D3D] transition-all active:scale-95">Manage Admins</Button>
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
                  <h4 className="text-sm font-black text-[#063B78] mb-4">Popular Job Categories</h4>
                  <div className="space-y-4">
                    {categories.map((cat, i) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-3 p-4 bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl items-center">
                        <div className="flex-1 w-full">
                          <label className="block text-[10px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">Label</label>
                          <input 
                            type="text" 
                            className="w-full h-9 px-3 bg-white border border-[#DCE5F0] rounded-lg text-sm font-bold text-[#063B78]" 
                            value={cat.label}
                            onChange={(e) => {
                              const newCat = [...categories];
                              newCat[i]!.label = e.target.value;
                              setCategories(newCat);
                            }}
                          />
                        </div>
                        <div className="flex-1 w-full">
                          <label className="block text-[10px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">Icon</label>
                          <select 
                            className="w-full h-9 px-3 bg-white border border-[#DCE5F0] rounded-lg text-sm font-bold text-[#063B78]" 
                            value={cat.iconName}
                            onChange={(e) => {
                              const newCat = [...categories];
                              newCat[i]!.iconName = e.target.value;
                              setCategories(newCat);
                            }}
                          >
                            <option value="Factory">Factory</option>
                            <option value="HardHat">HardHat</option>
                            <option value="Wrench">Wrench</option>
                            <option value="Truck">Truck</option>
                            <option value="Zap">Zap</option>
                            <option value="Shield">Shield</option>
                            <option value="Briefcase">Briefcase</option>
                            <option value="Users">Users</option>
                            <option value="Monitor">Monitor</option>
                          </select>
                        </div>
                        <div className="flex-1 w-full">
                          <label className="block text-[10px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">Theme Color</label>
                          <select 
                            className="w-full h-9 px-3 bg-white border border-[#DCE5F0] rounded-lg text-sm font-bold text-[#063B78]" 
                            value={cat.theme}
                            onChange={(e) => {
                              const newCat = [...categories];
                              newCat[i]!.theme = e.target.value;
                              setCategories(newCat);
                            }}
                          >
                            <option value="blue">Blue</option>
                            <option value="yellow">Yellow</option>
                            <option value="purple">Purple</option>
                            <option value="green">Green</option>
                            <option value="orange">Orange</option>
                            <option value="red">Red</option>
                            <option value="pink">Pink</option>
                          </select>
                        </div>
                        <div className="flex items-end h-[56px]">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-9 text-xs"
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
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-[#DCE5F0] text-[#063B78] font-bold"
                      onClick={() => setCategories([...categories, { label: "New Category", iconName: "Briefcase", theme: "blue" }])}
                    >
                      + Add Category
                    </Button>
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

          {activeTab !== "dashboard" && activeTab !== "landing-page" && (
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
