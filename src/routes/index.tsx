import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck,
  UserCheck,
  Briefcase,
  Building2,
  Users,
  Search,
  MapPin,
  Crown,
  Factory,
  HardHat,
  Wrench,
  Truck,
  Zap,
  Shield,
  LayoutDashboard,
  ArrowRight,
  Target,
  Eye,
  Handshake,
  TrendingUp,
  Quote,
  Star,
  Monitor,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  Factory, HardHat, Wrench, Truck, Zap, Shield, Briefcase, Users, Monitor
};

const THEMES: Record<string, any> = {
  blue: { iconColor: "text-[#3b82f6]", glowColor: "bg-[#93c5fd]", topColor: "bg-[#eff6ff]", bodyGradient: "from-[#dbeafe] to-[#bfdbfe]", textColor: "text-[#1e3a8a]", btnColor: "bg-[#2563eb]" },
  yellow: { iconColor: "text-[#eab308]", glowColor: "bg-[#fde047]", topColor: "bg-[#fefce8]", bodyGradient: "from-[#fef08a] to-[#fde047]", textColor: "text-[#713f12]", btnColor: "bg-[#eab308]" },
  purple: { iconColor: "text-[#a855f7]", glowColor: "bg-[#d8b4fe]", topColor: "bg-[#faf5ff]", bodyGradient: "from-[#f3e8ff] to-[#e9d5ff]", textColor: "text-[#581c87]", btnColor: "bg-[#a855f7]" },
  green: { iconColor: "text-[#22c55e]", glowColor: "bg-[#86efac]", topColor: "bg-[#f0fdf4]", bodyGradient: "from-[#dcfce7] to-[#bbf7d0]", textColor: "text-[#14532d]", btnColor: "bg-[#22c55e]" },
  orange: { iconColor: "text-[#f97316]", glowColor: "bg-[#fdba74]", topColor: "bg-[#fff7ed]", bodyGradient: "from-[#ffedd5] to-[#fed7aa]", textColor: "text-[#7c2d12]", btnColor: "bg-[#f97316]" },
  red: { iconColor: "text-[#ef4444]", glowColor: "bg-[#fca5a5]", topColor: "bg-[#fef2f2]", bodyGradient: "from-[#fee2e2] to-[#fecaca]", textColor: "text-[#7f1d1d]", btnColor: "bg-[#ef4444]" },
  pink: { iconColor: "text-[#ec4899]", glowColor: "bg-[#f9a8d4]", topColor: "bg-[#fdf2f8]", bodyGradient: "from-[#fce7f3] to-[#fbcfe8]", textColor: "text-[#831843]", btnColor: "bg-[#ec4899]" }
};
import careerTeam from "@/assets/career-team.jpg";
import { Brand } from "@/components/portal/Brand";

import { PublicFooter } from "@/components/portal/PublicFooter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { dataStore } from "@/lib/data-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REAL JOB — Portal Entrance | User Login & Admin Login" },
      { name: "description", content: "Select User Login to browse jobs & hire workers or Admin Login for platform administration." },
      { property: "og:title", content: "REAL JOB — Portal Entrance" },
      { property: "og:description", content: "योग्य माणूस • योग्य काम • योग्य संधी — Portal Entrance" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingGatewayPage,
});

const heroImages = [
  careerTeam,
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80",
];

function LandingGatewayPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Dynamic Landing Page CMS State
  const [heroTitle, setHeroTitle] = useState("Welcome to the\nREAL JOB Portal!");
  const [heroSubtitle, setHeroSubtitle] = useState("Right Person • Right Job • Right Opportunity");
  const [images, setImages] = useState(heroImages);
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
    if (savedImages) setImages(JSON.parse(savedImages));
    if (savedMetrics) setMetrics(JSON.parse(savedMetrics));
    if (savedAbout) setAboutData(JSON.parse(savedAbout));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const [currentUser, setCurrentUser] = useState(() => dataStore.getCurrentUser());

  const handleLogout = () => {
    window.localStorage.removeItem("realjob-user");
    dataStore.setCurrentUser(null);
    setCurrentUser(null);
    toast.info("Logged out successfully!");
  };

  const handleQuickUserEntry = () => {
    const userObj = {
      id: "seeker-demo",
      email: "user@realjob.com",
      role: "worker" as const,
      fullName: "Rutuja Pawar (Candidate)",
    };
    window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
    dataStore.setCurrentUser(userObj);
    setCurrentUser(userObj);
    toast.success("User Portal Ready! Redirecting to main website...");
    navigate({ to: "/home" });
  };

  const handleQuickAdminEntry = () => {
    const adminObj = {
      id: "admin-super",
      email: "admin@realjob.com",
      role: "admin" as const,
      fullName: "Platform Admin Manager",
    };
    window.localStorage.setItem("realjob-user", JSON.stringify(adminObj));
    dataStore.setCurrentUser(adminObj);
    setCurrentUser(adminObj);
    toast.success("Admin Portal Ready! Opening Admin Control Dashboard...");
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* LANDING HEADER */}
      <header className="absolute top-0 w-full z-50 bg-transparent p-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <Brand className="h-12 sm:h-16" />

          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBF1F8] border border-[#B8D3F2] text-xs font-black text-[#063B78]">
                  <span>👤 {currentUser.fullName || currentUser.email?.split("@")[0]}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-3 h-9.5 rounded-lg shadow-xs"
                >
                  Logout (लॉग आउट)
                </Button>
              </div>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#063B78] text-[#063B78] font-extrabold hover:bg-[#063B78] hover:text-white text-xs px-3 sm:px-4 h-9.5 rounded-lg shadow-2xs"
                >
                  <Link to="/auth" search={{ mode: "login", role: "worker" }}>
                    <UserCheck className="size-4 mr-1.5" />
                    {t("userLogin")}
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-[#063B78] hover:bg-[#082F63] text-white font-extrabold text-xs px-3 sm:px-4 h-9.5 rounded-lg shadow-xs"
                >
                  <Link to="/auth" search={{ mode: "login", role: "admin" }}>
                    <ShieldCheck className="size-4 mr-1.5 text-[#FFC400]" />
                    {t("adminLogin")}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative isolate overflow-hidden h-screen min-h-[600px] flex items-center pt-20 pb-24">
          {/* Background Image Slider */}
          <div className="absolute inset-0 z-0 bg-transparent">
            {images.map((img, index) => (
              <img
                key={img}
                src={img}
                alt="REAL JOB India Portal Background"
                className={`absolute inset-0 h-full w-full object-cover object-[70%_20%] transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

          </div>
        </section>

        {/* METRICS & ADVANTAGES */}
        <section className="relative z-20 pt-8 pb-16 bg-white">
          <div className="w-full px-4 sm:px-8 lg:px-12">
            <div className="flex flex-wrap justify-center md:justify-evenly xl:justify-around items-center gap-6 bg-white rounded-[2rem] md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 md:p-8 mx-auto w-full max-w-[1800px] -mt-4">
              
              <div className="flex items-center gap-4">
                <div className="text-[#D4AF37]"><Users className="size-12 fill-current" /></div>
                <div>
                  <strong className="block text-2xl md:text-3xl font-black text-[#10233F]">{metrics[0]?.value}</strong>
                  <span className="text-[10px] md:text-xs font-bold text-gray-500 leading-tight block">{metrics[0]?.label}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-[#D4AF37]"><Briefcase className="size-12 fill-current" /></div>
                <div>
                  <strong className="block text-2xl md:text-3xl font-black text-[#10233F]">{metrics[1]?.value}</strong>
                  <span className="text-[10px] md:text-xs font-bold text-gray-500 leading-tight block">{metrics[1]?.label}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-[#D4AF37]"><Building2 className="size-12 fill-current" /></div>
                <div>
                  <strong className="block text-2xl md:text-3xl font-black text-[#10233F]">{metrics[2]?.value}</strong>
                  <span className="text-[10px] md:text-xs font-bold text-gray-500 leading-tight block">{metrics[2]?.label}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-[#D4AF37]"><ShieldCheck className="size-12 fill-current" /></div>
                <div>
                  <strong className="block text-2xl md:text-3xl font-black text-[#10233F]">{metrics[3]?.value}</strong>
                  <span className="text-[10px] md:text-xs font-bold text-gray-500 leading-tight block">{metrics[3]?.label}</span>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* ABOUT COMPANY */}
        <section className="relative bg-[#f8f9fa] py-20 lg:py-28 overflow-hidden">
          <div className="relative z-10 mx-auto max-w-[1500px] px-4">
            <div className="bg-white rounded-[30px] border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.05)] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left Column: Image and Stats */}
                <div className="lg:col-span-5 relative bg-white pb-24 lg:pb-0">
                  {/* Image container with gold curved edge */}
                  <div className="relative h-[300px] lg:h-[450px] w-full pr-12 lg:pr-16 pt-8 pl-8">
                    <div className="w-full h-full rounded-tr-[60px] rounded-bl-[60px] overflow-hidden border-r-[8px] border-b-[8px] border-[#D4AF37] relative">
                      <img src={aboutData.image} alt="Company Overview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-[#082F63]/10 mix-blend-multiply"></div>
                    </div>
                  </div>

                  {/* Dark Blue Stats Bar */}
                  <div className="absolute bottom-0 left-0 right-0 lg:right-[-4rem] bg-[#082F63] rounded-tr-[40px] rounded-tl-[40px] lg:rounded-tl-none p-6 lg:p-8 flex justify-between items-center shadow-xl border-t-[4px] border-[#D4AF37] z-20">
                    <div className="flex flex-col items-center flex-1 border-r border-white/10 px-2">
                      <Users className="size-6 lg:size-8 text-[#D4AF37] mb-2" />
                      <span className="text-xl lg:text-2xl font-black text-white leading-none">10K+</span>
                      <span className="text-[10px] lg:text-[11px] text-gray-300 mt-1 font-medium text-center">Happy Workers</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 border-r border-white/10 px-2">
                      <Building2 className="size-6 lg:size-8 text-[#D4AF37] mb-2" />
                      <span className="text-xl lg:text-2xl font-black text-white leading-none">2.2K+</span>
                      <span className="text-[10px] lg:text-[11px] text-gray-300 mt-1 font-medium text-center">Trusted Employers</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 border-r border-white/10 px-2">
                      <Briefcase className="size-6 lg:size-8 text-[#D4AF37] mb-2" />
                      <span className="text-xl lg:text-2xl font-black text-white leading-none">5K+</span>
                      <span className="text-[10px] lg:text-[11px] text-gray-300 mt-1 font-medium text-center">Live Job Openings</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 px-2">
                      <Star className="size-6 lg:size-8 text-[#D4AF37] mb-2" />
                      <span className="text-xl lg:text-2xl font-black text-white leading-none">98%</span>
                      <span className="text-[10px] lg:text-[11px] text-gray-300 mt-1 font-medium text-center">Success Rate</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Text and Cards */}
                <div className="lg:col-span-7 p-8 lg:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] w-10 bg-[#D4AF37]"></div>
                    <span className="text-xs font-black text-[#082F63] tracking-[0.1em] uppercase">ABOUT REAL JOB</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black text-[#082F63] leading-[1.1] mb-6">
                    {aboutData.title.split(' ').slice(0, -1).join(' ')} <span className="text-[#D4AF37]">{aboutData.title.split(' ').pop()}</span>
                  </h2>
                  
                  <p className="text-[15px] font-medium text-gray-600 leading-relaxed mb-10 max-w-3xl whitespace-pre-wrap">
                    {aboutData.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Mission */}
                    <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                      <div className="size-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4">
                        <Target className="size-6 text-[#D4AF37]" />
                      </div>
                      <h4 className="text-[14px] font-black text-[#082F63] mb-2">Our Mission</h4>
                      <p className="text-[11px] font-semibold text-gray-500 leading-snug">
                        To provide the right employment opportunity to everyone.
                      </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                      <div className="size-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4">
                        <Eye className="size-6 text-[#D4AF37]" />
                      </div>
                      <h4 className="text-[14px] font-black text-[#082F63] mb-2">Our Vision</h4>
                      <p className="text-[11px] font-semibold text-gray-500 leading-snug">
                        To become the most trusted employment portal in India.
                      </p>
                    </div>

                    {/* Values */}
                    <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                      <div className="size-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4">
                        <Users className="size-6 text-[#D4AF37]" />
                      </div>
                      <h4 className="text-[14px] font-black text-[#082F63] mb-2">Our Values</h4>
                      <p className="text-[11px] font-semibold text-gray-500 leading-snug">
                        Trust, transparency, quality, and consistent service.
                      </p>
                    </div>

                    {/* Belief */}
                    <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                      <div className="size-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4">
                        <Handshake className="size-6 text-[#D4AF37]" />
                      </div>
                      <h4 className="text-[14px] font-black text-[#082F63] mb-2">Our Belief</h4>
                      <p className="text-[11px] font-semibold text-gray-500 leading-snug">
                        Right Person<br/>Right Job<br/>Right Opportunity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR JOB CATEGORIES */}
        <section className="relative py-24 bg-white overflow-hidden">
          <div className="relative z-10 mx-auto max-w-[1600px] px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-[#082F63] mb-3">
              Popular Job <span className="text-[#D4AF37]">Categories</span>
            </h2>
            <div className="flex items-center justify-center gap-4 mb-16">
              <div className="h-[1px] w-12 md:w-24 bg-[#D4AF37]/50"></div>
              <p className="text-xs md:text-sm font-bold text-gray-500">Right opportunity for you - in your field!</p>
              <div className="h-[1px] w-12 md:w-24 bg-[#D4AF37]/50"></div>
            </div>
            
            <div className="flex flex-wrap lg:flex-nowrap justify-center gap-6 xl:gap-10 w-full mt-16 px-4">
              {categories.map((catData, i) => {
                const IconComponent = ICONS[catData.iconName] || Briefcase;
                const cat = THEMES[catData.theme] || THEMES['blue'];
                return (
                <div 
                  key={i} 
                  className="relative flex flex-col items-center w-[160px] group cursor-pointer mt-10"
                  onClick={() => navigate({ to: '/auth', search: { mode: 'login', role: 'worker' } })}
                >
                  
                  {/* Background Glow Circle */}
                  <div className={`absolute top-[-30px] w-[140px] h-[140px] rounded-full ${cat.glowColor} opacity-50 blur-[20px] z-0 transition-opacity duration-500 group-hover:opacity-80`}></div>
                  
                  {/* Icon resting on pedestal */}
                  <div className="relative z-30 mb-[-15px] transform group-hover:-translate-y-4 transition-transform duration-500 drop-shadow-[0_15px_15px_rgba(0,0,0,0.2)]">
                    <IconComponent className={`size-[80px] ${cat.iconColor}`} strokeWidth={1.5} />
                  </div>

                  {/* Pedestal Container */}
                  <div className="relative w-full h-[150px] z-10">
                    {/* Pedestal Top (Ellipse) */}
                    <div className={`absolute top-0 left-0 w-full h-[35px] rounded-[50%] z-20 ${cat.topColor} shadow-[inset_0_-4px_10px_rgba(255,255,255,0.7),0_5px_15px_rgba(0,0,0,0.05)] border border-white/60`}></div>
                    
                    {/* Pedestal Body */}
                    <div 
                      className={`absolute top-[17.5px] left-0 w-full h-[130px] z-10 bg-gradient-to-b ${cat.bodyGradient} flex flex-col items-center justify-end pb-5 shadow-[0_15px_30px_rgba(0,0,0,0.08)] border-x border-white/30 transition-colors duration-500`}
                      style={{ borderBottomLeftRadius: '50% 20px', borderBottomRightRadius: '50% 20px' }}
                    >
                       <h4 className={`font-black text-[14px] text-center leading-[1.1] mb-3 px-3 ${cat.textColor}`}>
                         {catData.label.split(' ').map((word: string, idx: number) => (
                           <span key={idx} className="block">{word}</span>
                         ))}
                       </h4>
                       <div className={`size-7 rounded-full flex items-center justify-center text-white shadow-lg ${cat.btnColor} group-hover:scale-110 transition-transform`}>
                          <ArrowRight className="size-3.5" />
                       </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

