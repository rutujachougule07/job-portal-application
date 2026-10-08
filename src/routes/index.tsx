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
  Sparkles,
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
import { LanguageGate } from "@/components/portal/LanguageGate";
import { LoginDropdown } from "@/components/portal/LoginDropdown";

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
    {
      id: "construction",
      label: "Construction",
      jobsCount: "1.5K+ Jobs",
      iconName: "HardHat",
      gradient: "from-amber-500/15 via-amber-400/5 to-transparent",
      iconBg: "bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white",
      hoverBorder: "group-hover:border-amber-400",
      badgeStyle: "bg-amber-50 text-amber-700 border-amber-200",
      btnStyle: "bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white"
    },
    {
      id: "technical",
      label: "Technical Staff",
      jobsCount: "2.8K+ Jobs",
      iconName: "Wrench",
      gradient: "from-blue-500/15 via-blue-400/5 to-transparent",
      iconBg: "bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white",
      hoverBorder: "group-hover:border-blue-400",
      badgeStyle: "bg-blue-50 text-blue-700 border-blue-200",
      btnStyle: "bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white"
    },
    {
      id: "logistics",
      label: "Transport & Logistics",
      jobsCount: "1.9K+ Jobs",
      iconName: "Truck",
      gradient: "from-emerald-500/15 via-emerald-400/5 to-transparent",
      iconBg: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
      hoverBorder: "group-hover:border-emerald-400",
      badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
      btnStyle: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white"
    },
    {
      id: "electrician",
      label: "Electrician",
      jobsCount: "1.1K+ Jobs",
      iconName: "Zap",
      gradient: "from-purple-500/15 via-purple-400/5 to-transparent",
      iconBg: "bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white",
      hoverBorder: "group-hover:border-purple-400",
      badgeStyle: "bg-purple-50 text-purple-700 border-purple-200",
      btnStyle: "bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white"
    },
    {
      id: "office",
      label: "Office Staff",
      jobsCount: "2.4K+ Jobs",
      iconName: "Briefcase",
      gradient: "from-rose-500/15 via-rose-400/5 to-transparent",
      iconBg: "bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white",
      hoverBorder: "group-hover:border-rose-400",
      badgeStyle: "bg-rose-50 text-rose-700 border-rose-200",
      btnStyle: "bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white"
    }
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
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          // Keep only first 5
          setCategories(parsed.slice(0, 5));
        }
      } catch (e) {
        // use default 5
      }
    }
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const [currentUser, setCurrentUser] = useState<any>(() => dataStore.getCurrentUser());

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(dataStore.getCurrentUser());
    };
    syncUser();
    window.addEventListener("realjob-auth-change", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("realjob-auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    dataStore.logout();
    setCurrentUser(null);
    toast.info("Logged out successfully!");
    if (typeof window !== "undefined") {
      window.location.replace("/");
    }
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
    navigate({ to: "/dashboard", search: { tab: "overview" }, replace: true });
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
      <LanguageGate />
      
      {/* LANDING HEADER */}
      <header className="absolute top-0 w-full z-50 bg-transparent p-3 sm:p-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <Brand className="h-12 sm:h-16 shrink-0" />

          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBF1F8] border border-[#B8D3F2] text-xs font-black text-[#063B78]">
                  <span>👤 {currentUser.fullName || currentUser.email?.split("@")[0]}</span>
                </div>
                <Button
                  onClick={() => navigate({ to: currentUser.role === "admin" || currentUser.role === "employer" ? "/admin" : "/dashboard" })}
                  size="sm"
                  className="bg-[#063B78] hover:bg-[#082F63] text-white font-extrabold text-xs px-3 h-9.5 rounded-lg shadow-xs"
                >
                  Dashboard (डॅशबोर्ड)
                </Button>
                <Button
                  onClick={handleLogout}
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-extrabold text-xs px-3 h-9.5 rounded-lg shadow-xs"
                >
                  Logout (लॉग आउट)
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Desktop view 3 inline buttons */}
                <div className="hidden lg:flex items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="bg-white border-[#063B78] text-[#063B78] font-extrabold hover:bg-[#063B78] hover:text-white text-xs px-3 h-9 rounded-lg shadow-xs whitespace-nowrap"
                  >
                    <Link to="/auth" search={{ mode: "login", role: "worker" }}>
                      <UserCheck className="size-4 mr-1.5" />
                      {t("seekerLogin")}
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="bg-white border-emerald-600 text-emerald-700 font-extrabold hover:bg-emerald-600 hover:text-white text-xs px-3 h-9 rounded-lg shadow-xs whitespace-nowrap"
                  >
                    <Link to="/auth" search={{ mode: "login", role: "employee" }}>
                      <Briefcase className="size-4 mr-1.5" />
                      {t("employeeLogin")}
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="bg-white border-[#063B78] text-[#063B78] font-extrabold hover:bg-[#063B78] hover:text-white text-xs px-3 h-9 rounded-lg shadow-xs whitespace-nowrap"
                  >
                    <Link to="/auth" search={{ mode: "login", role: "admin" }}>
                      <ShieldCheck className="size-4 mr-1.5 text-[#FFC400]" />
                      {t("adminLogin")}
                    </Link>
                  </Button>
                </div>

                {/* Mobile / Compact Single Hoverable Dropdown Menu on Top Right */}
                <div className="lg:hidden">
                  <LoginDropdown />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative isolate overflow-hidden h-[50vh] min-h-[350px] md:h-[75vh] md:min-h-[500px] flex items-center justify-center pt-20 pb-16 md:pb-24">
          {/* Background Image Slider */}
          <div className="absolute inset-0 z-0 bg-transparent">
            {images.map((img, index) => (
              <img
                key={img}
                src={img}
                alt="REAL JOB India Portal Background"
                className={`absolute inset-0 h-full w-full object-cover object-[70%_20%] transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}
            {/* Dark Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#021D3D]/90 via-[#021D3D]/60 to-[#021D3D]/90 mix-blend-multiply"></div>
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 mx-auto max-w-[1400px] px-4 w-full flex flex-col items-center text-center mt-12 sm:mt-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.2] max-w-3xl drop-shadow-2xl whitespace-pre-wrap">
              {heroTitle.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FDE047]">{line}</span> : line}
                </span>
              ))}
            </h1>
            
            <p className="mt-4 text-sm sm:text-base font-medium text-gray-200 max-w-xl drop-shadow-lg">
              {heroSubtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#F1C40F] hover:from-[#F1C40F] hover:to-[#D4AF37] text-[#021D3D] font-black text-sm sm:text-base px-8 h-12 sm:h-14 rounded-xl shadow-[0_10px_30px_rgba(212,175,55,0.4)] border-b-[3px] border-[#B8962E] transition-all hover:scale-105 active:scale-95"
              >
                <Link to="/auth" search={{ mode: "login", role: "worker" }}>
                  <Search className="size-5 mr-2" />
                  Find Jobs Now
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/30 text-white font-black text-sm sm:text-base px-8 h-12 sm:h-14 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <Link to="/auth" search={{ mode: "login", role: "employee" }}>
                  <Users className="size-5 mr-2" />
                  Hire Staff
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* METRICS & ADVANTAGES */}
        <section className="relative z-20 pt-8 pb-16 bg-white">
          <div className="w-full px-4 sm:px-8 lg:px-12">
            <div className="flex flex-wrap justify-center sm:justify-between items-center gap-6 sm:gap-4 bg-white rounded-[2rem] md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 md:p-8 mx-auto w-full max-w-[1400px] -mt-4">

              <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-center sm:justify-start">
                <div className="flex shrink-0 items-center justify-center size-12 md:size-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Users className="size-6 md:size-7 stroke-[2]" />
                </div>
                <div className="text-left">
                  <strong className="block text-2xl md:text-3xl font-black text-[#10233F] leading-tight">{metrics[0]?.value}</strong>
                  <span className="text-xs font-bold text-gray-500 block">{metrics[0]?.label}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-center sm:justify-start">
                <div className="flex shrink-0 items-center justify-center size-12 md:size-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Briefcase className="size-6 md:size-7 stroke-[2]" />
                </div>
                <div className="text-left">
                  <strong className="block text-2xl md:text-3xl font-black text-[#10233F] leading-tight">{metrics[1]?.value}</strong>
                  <span className="text-xs font-bold text-gray-500 block">{metrics[1]?.label}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-center sm:justify-start">
                <div className="flex shrink-0 items-center justify-center size-12 md:size-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Building2 className="size-6 md:size-7 stroke-[2]" />
                </div>
                <div className="text-left">
                  <strong className="block text-2xl md:text-3xl font-black text-[#10233F] leading-tight">{metrics[2]?.value}</strong>
                  <span className="text-xs font-bold text-gray-500 block">{metrics[2]?.label}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-center sm:justify-start">
                <div className="flex shrink-0 items-center justify-center size-12 md:size-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <ShieldCheck className="size-6 md:size-7 stroke-[2]" />
                </div>
                <div className="text-left">
                  <strong className="block text-2xl md:text-3xl font-black text-[#10233F] leading-tight">{metrics[3]?.value}</strong>
                  <span className="text-xs font-bold text-gray-500 block">{metrics[3]?.label}</span>
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
                    <div className="group bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/40 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="size-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#D4AF37] z-10">
                        <Target className="size-6 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="text-[14px] font-black text-[#082F63] mb-2 z-10 relative">Our Mission</h4>
                      <p className="text-[11px] font-semibold text-gray-500 leading-snug z-10 relative">
                        To provide the right employment opportunity to everyone.
                      </p>
                    </div>

                    {/* Vision */}
                    <div className="group bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/40 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="size-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#D4AF37] z-10">
                        <Eye className="size-6 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="text-[14px] font-black text-[#082F63] mb-2 z-10 relative">Our Vision</h4>
                      <p className="text-[11px] font-semibold text-gray-500 leading-snug z-10 relative">
                        To become the most trusted employment portal in India.
                      </p>
                    </div>

                    {/* Values */}
                    <div className="group bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/40 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="size-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#D4AF37] z-10">
                        <Users className="size-6 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="text-[14px] font-black text-[#082F63] mb-2 z-10 relative">Our Values</h4>
                      <p className="text-[11px] font-semibold text-gray-500 leading-snug z-10 relative">
                        Trust, transparency, quality, and consistent service.
                      </p>
                    </div>

                    {/* Belief */}
                    <div className="group bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/40 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="size-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#D4AF37] z-10">
                        <Handshake className="size-6 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="text-[14px] font-black text-[#082F63] mb-2 z-10 relative">Our Belief</h4>
                      <p className="text-[11px] font-semibold text-gray-500 leading-snug z-10 relative">
                        Right Person<br />Right Job<br />Right Opportunity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR JOB CATEGORIES */}
        <section className="relative py-14 bg-gradient-to-b from-[#F5F8FC] via-white to-[#F5F8FC] overflow-hidden">
          <div className="relative z-10 mx-auto max-w-[1600px] px-4 text-center">

            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF9E7] border border-[#FDE68A] text-[#B45309] font-black text-xs uppercase tracking-wider mb-3 shadow-sm hover:scale-105 transition-transform duration-300">
              <Briefcase className="size-4 text-[#D97706] animate-bounce" />
              EXPLORE BY CATEGORY
            </div>

            {/* Main Section Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#082F63] mb-2 tracking-tight">
              Popular Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FDE047] animate-pulse">Categories</span>
            </h2>

            {/* Subtitle with accent lines */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-[1.5px] w-12 md:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/60"></div>
              <p className="text-xs md:text-sm font-extrabold text-[#5B6B7F]">Right opportunity for you — in your field!</p>
              <div className="h-[1.5px] w-12 md:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/60"></div>
            </div>

            {/* INFINITE AUTO-SCROLLER CONTAINER */}
            <div className="relative w-full overflow-hidden py-6">
              
              {/* Fade masks for elegant left & right edge blending */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#F5F8FC] via-[#F5F8FC]/80 to-transparent z-20" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#F5F8FC] via-[#F5F8FC]/80 to-transparent z-20" />

              {/* Marquee Row */}
              <div className="animate-marquee-slow flex items-center gap-6 sm:gap-8 px-4">
                {[...categories, ...categories, ...categories, ...categories].map((catData, i) => {
                  const IconComponent = ICONS[catData.iconName] || Briefcase;
                  return (
                    <div
                      key={`${catData.id || i}-${i}`}
                      onClick={() => navigate({ to: '/jobs', search: { category: catData.id } })}
                      className={`group relative shrink-0 w-[220px] sm:w-[250px] h-[100px] sm:h-[110px] rounded-[1.5rem] border border-white/60 bg-white/40 backdrop-blur-md p-4 flex items-center justify-center gap-4 cursor-pointer transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] hover:-translate-y-2 hover:scale-[1.03] overflow-hidden`}
                    >
                      {/* Animated Border Gradient on Hover */}
                      <div className="absolute inset-0 rounded-[1.5rem] border-2 border-transparent bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                      {/* Radial Ambient Glow */}
                      <div className={`absolute -top-12 -left-12 size-36 rounded-full bg-gradient-to-br ${catData.gradient || "from-blue-500/20 to-transparent"} blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none group-hover:animate-pulse`} />

                      {/* Icon Box */}
                      <div className={`relative size-12 sm:size-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-sm group-hover:shadow-lg ${catData.iconBg || "bg-blue-600 text-white"}`}>
                        <IconComponent className="size-6 sm:size-7 stroke-[2.5]" />
                      </div>

                      {/* Category Title */}
                      <div className="flex-1 text-left flex flex-col justify-center overflow-hidden z-10">
                        <h3 className="font-black text-sm sm:text-base text-[#082F63] group-hover:text-[#125BB5] transition-colors truncate leading-tight">
                          {catData.label}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

