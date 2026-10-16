import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
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
  Award,
  Heart,
  CheckCircle2,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  Factory,
  HardHat,
  Wrench,
  Truck,
  Zap,
  Shield,
  Briefcase,
  Users,
  Monitor,
  Building2,
  Search,
  Target,
  Award,
  Star,
  Heart,
  Crown,
  Sparkles,
  TrendingUp,
  CheckCircle2,
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
import { LanguageSwitcher } from "@/components/portal/LanguageSwitcher";
import { CATEGORY_TRANSLATIONS } from "@/components/portal/LandingCategoryFilterModal";
import { LoginDropdown } from "@/components/portal/LoginDropdown";

import { PublicFooter } from "@/components/portal/PublicFooter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { dataStore } from "@/lib/data-store";
import { isVideoMedia, getYouTubeEmbedUrl } from "@/lib/utils";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      if (window.location.search.includes("view=website")) {
        return;
      }
      try {
        let u: any = null;
        const raw = localStorage.getItem("realjob-user") || localStorage.getItem("realjob_db_user");
        if (raw) u = JSON.parse(raw);
        if (!u) {
          u = dataStore.getCurrentUser();
        }
        if (u && (u.id || u.email)) {
          const r = (u.role || "").toLowerCase();
          if (r === "employer" || r === "admin" || r === "poster") {
            throw redirect({ to: "/admin" });
          } else if (r === "employee") {
            throw redirect({ to: "/employee-dashboard" as any });
          } else if (r === "worker" || r === "seeker" || r === "user") {
            throw redirect({ to: "/dashboard", search: { tab: "overview" } });
          }
        }
      } catch (e) {
        if ((e as any)?.to) throw e;
      }
    }
  },
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
  "https://firebasestorage.googleapis.com/v0/b/job-portal-729b6.firebasestorage.app/o/hero_media%2F1792129049561_hero_video.mp4?alt=media&token=9b136576-8f2e-4144-8f75-532783dec98b",
  careerTeam,
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80",
];

export interface CompanyPillar {
  id: string;
  title: string;
  titleMr?: string;
  description: string;
  descriptionMr?: string;
  iconName: string;
}

const defaultCompanyPillars: CompanyPillar[] = [
  {
    id: "mission",
    title: "Our Mission",
    titleMr: "आमचे ध्येय",
    description: "To provide the right employment opportunity to everyone.",
    descriptionMr: "प्रत्येकाला रोजगाराची योग्य संधी मिळवून देणे.",
    iconName: "Target",
  },
  {
    id: "vision",
    title: "Our Vision",
    titleMr: "आमचे व्हिजन",
    description: "To become the most trusted employment portal in India.",
    descriptionMr: "भारतातील सर्वात विश्वासार्ह रोजगार मंच बनणे.",
    iconName: "Eye",
  },
  {
    id: "values",
    title: "Our Values",
    titleMr: "आमची मूल्ये",
    description: "Trust, transparency, quality, and consistent service.",
    descriptionMr: "विश्वास, पारदर्शकता, गुणवत्ता आणि निरंतर सेवा.",
    iconName: "Users",
  },
  {
    id: "belief",
    title: "Our Belief",
    titleMr: "आमचा विश्वास",
    description: "Right Person\nRight Job\nRight Opportunity",
    descriptionMr: "योग्य व्यक्ती\nयोग्य काम\nयोग्य संधी",
    iconName: "Handshake",
  },
];

const PILLAR_ICONS: Record<string, React.ElementType> = {
  Target,
  Eye,
  Users,
  Handshake,
  Star,
  Shield,
  Sparkles,
  TrendingUp,
  Building2,
  Award,
  CheckCircle2,
  Heart,
  Crown,
};

function LandingGatewayPage() {
  const { t, lang } = useI18n();
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
  const [companyPillars, setCompanyPillars] = useState<CompanyPillar[]>(defaultCompanyPillars);
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
    const savedPillars = localStorage.getItem("cms_companyPillars");

    if (savedTitle) setHeroTitle(savedTitle);
    if (savedSubtitle) setHeroSubtitle(savedSubtitle);
    if (savedImages) setImages(JSON.parse(savedImages));
    if (savedMetrics) setMetrics(JSON.parse(savedMetrics));
    if (savedAbout) setAboutData(JSON.parse(savedAbout));
    if (savedPillars) {
      try {
        setCompanyPillars(JSON.parse(savedPillars));
      } catch (e) {}
    }
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const CATEGORY_PALETTES = [
            { gradient: "from-blue-500/20 to-transparent", iconBg: "bg-blue-600 text-white" },
            { gradient: "from-amber-500/20 to-transparent", iconBg: "bg-amber-600 text-white" },
            { gradient: "from-purple-500/20 to-transparent", iconBg: "bg-purple-600 text-white" },
            { gradient: "from-emerald-500/20 to-transparent", iconBg: "bg-emerald-600 text-white" },
            { gradient: "from-orange-500/20 to-transparent", iconBg: "bg-orange-600 text-white" },
            { gradient: "from-rose-500/20 to-transparent", iconBg: "bg-rose-600 text-white" },
            { gradient: "from-cyan-500/20 to-transparent", iconBg: "bg-cyan-600 text-white" },
            { gradient: "from-indigo-500/20 to-transparent", iconBg: "bg-indigo-600 text-white" },
          ];

          const formatted = parsed.map((cat: any, idx: number) => {
            const palette = CATEGORY_PALETTES[idx % CATEGORY_PALETTES.length];
            return {
              id: cat.id || `cat_${idx}`,
              label: cat.label || `Category ${idx + 1}`,
              iconName: cat.iconName || "Briefcase",
              gradient: cat.gradient || palette?.gradient || "from-blue-500/20 to-transparent",
              iconBg: cat.iconBg || palette?.iconBg || "bg-[#063B78] text-white",
              ...cat,
            };
          });
          setCategories(formatted);
        }
      } catch (e) {
        console.error("Failed to load saved categories:", e);
      }
    }

    // Real-time live sync from Firestore Cloud so Mobile App, Vercel, and Domain see updates immediately
    let unsubscribeSnapshot: (() => void) | undefined;
    const syncFromCloud = async () => {
      try {
        const { db } = await import("@/firebase");
        const { doc, onSnapshot } = await import("firebase/firestore");
        unsubscribeSnapshot = onSnapshot(doc(db, "cms_settings", "landing_page"), (snap) => {
          if (snap.exists()) {
            const data: any = snap.data();
            if (Array.isArray(data.heroImages) && data.heroImages.length > 0) {
              setImages(data.heroImages);
              try { localStorage.setItem("cms_heroImages", JSON.stringify(data.heroImages)); } catch {}
            }
            if (data.heroTitle) setHeroTitle(data.heroTitle);
            if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
            if (data.metrics) setMetrics(data.metrics);
            if (data.aboutData) setAboutData(data.aboutData);
            if (data.companyPillars) setCompanyPillars(data.companyPillars);
            if (data.categories && Array.isArray(data.categories)) {
              const CATEGORY_PALETTES = [
                { gradient: "from-blue-500/20 to-transparent", iconBg: "bg-blue-600 text-white" },
                { gradient: "from-amber-500/20 to-transparent", iconBg: "bg-amber-600 text-white" },
                { gradient: "from-purple-500/20 to-transparent", iconBg: "bg-purple-600 text-white" },
                { gradient: "from-emerald-500/20 to-transparent", iconBg: "bg-emerald-600 text-white" },
                { gradient: "from-orange-500/20 to-transparent", iconBg: "bg-orange-600 text-white" },
                { gradient: "from-rose-500/20 to-transparent", iconBg: "bg-rose-600 text-white" },
                { gradient: "from-cyan-500/20 to-transparent", iconBg: "bg-cyan-600 text-white" },
                { gradient: "from-indigo-500/20 to-transparent", iconBg: "bg-indigo-600 text-white" },
              ];
              const formatted = data.categories.map((cat: any, idx: number) => {
                const palette = CATEGORY_PALETTES[idx % CATEGORY_PALETTES.length];
                return {
                  id: cat.id || `cat_${idx}`,
                  label: cat.label || `Category ${idx + 1}`,
                  iconName: cat.iconName || "Briefcase",
                  gradient: cat.gradient || palette?.gradient || "from-blue-500/20 to-transparent",
                  iconBg: cat.iconBg || palette?.iconBg || "bg-[#063B78] text-white",
                  ...cat,
                };
              });
              setCategories(formatted);
            }
          }
        }, (err) => {
          console.warn("Could not sync CMS settings from cloud:", err);
        });
      } catch (err) {
        console.warn("Could not setup Firestore onSnapshot:", err);
      }
    };
    syncFromCloud();

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  useEffect(() => {
    if (images.length <= 1 || isVideoMedia(images[currentImageIndex])) {
      return undefined;
    }

    // Only static posters / images advance on the 3-second timer.
    // Videos stay on screen until they finish playing (handled by onEnded on <video>).
    const timer = setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentImageIndex, images]);

  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("realjob-user") || localStorage.getItem("realjob_db_user");
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return dataStore.getCurrentUser();
  });

  useEffect(() => {
    const syncUser = () => {
      if (typeof window !== "undefined" && window.location.search.includes("view=website")) {
        return;
      }
      let u = dataStore.getCurrentUser();
      if (!u && typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("realjob-user") || localStorage.getItem("realjob_db_user");
          if (raw) u = JSON.parse(raw);
        } catch {}
      }
      setCurrentUser(u);
      if (u && (u.id || u.email)) {
        const r = (u.role || "").toLowerCase();
        if (r === "employer" || r === "admin" || r === "poster") {
          navigate({ to: "/admin", replace: true });
        } else if (r === "employee") {
          navigate({ to: "/employee-dashboard" as any, replace: true });
        } else if (r === "worker" || r === "seeker" || r === "user") {
          navigate({ to: "/dashboard", search: { tab: "overview" }, replace: true });
        }
      }
    };
    syncUser();
    window.addEventListener("realjob-auth-change", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("realjob-auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [navigate]);

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

  if (currentUser && typeof window !== "undefined" && !window.location.search.includes("view=website")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <LanguageGate />
      
      {/* LANDING HEADER */}
      <header className="absolute top-0 w-full z-50 bg-transparent p-2.5 sm:p-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2">
          <Brand className="h-7 xs:h-8 sm:h-11 md:h-13 max-w-[150px] xs:max-w-[185px] sm:max-w-none w-auto shrink object-contain" />

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <LanguageSwitcher />

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
                  {t("viewDashboard")}
                </Button>
                <Button
                  onClick={handleLogout}
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-extrabold text-xs px-3 h-9.5 rounded-lg shadow-xs"
                >
                  {t("logout")}
                </Button>
              </div>
            ) : (
              <LoginDropdown />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        {/* HERO SECTION */}
        <section className="relative isolate overflow-hidden h-[50vh] min-h-[350px] md:h-screen md:min-h-[600px] flex items-center justify-center pt-20 pb-16 md:pb-24">
          {/* Background Media Slider (Image / Video) */}
          <div className="absolute inset-0 z-0 bg-transparent">
            {images.map((mediaUrl, index) => {
              const isVideo = isVideoMedia(mediaUrl);
              const ytEmbed = isVideo ? getYouTubeEmbedUrl(mediaUrl) : null;
              const isActive = index === currentImageIndex;

              if (isVideo) {
                if (ytEmbed) {
                  return (
                    <div
                      key={mediaUrl + index}
                      className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-1000 ease-in-out ${
                        isActive ? "opacity-100 z-1" : "opacity-0"
                      }`}
                    >
                      <iframe
                        src={ytEmbed}
                        title="Hero Video Background"
                        className="w-full h-full object-cover border-0 pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  );
                }

                return (
                  <video
                    key={mediaUrl + index}
                    src={mediaUrl}
                    autoPlay
                    muted
                    loop={images.length <= 1}
                    playsInline
                    preload="auto"
                    ref={(el) => {
                      if (el && isActive) {
                        el.currentTime = 0;
                        el.play().catch(() => {});
                      }
                    }}
                    onEnded={() => {
                      if (images.length > 1) {
                        setCurrentImageIndex((prev) => (prev + 1) % images.length);
                      }
                    }}
                    onError={() => {
                      if (images.length > 1) {
                        setTimeout(() => {
                          setCurrentImageIndex((prev) => (prev + 1) % images.length);
                        }, 3000);
                      }
                    }}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                      isActive ? "opacity-100 z-1" : "opacity-0 pointer-events-none"
                    }`}
                  />
                );
              }

              return (
                <img
                  key={mediaUrl + index}
                  src={mediaUrl}
                  alt="REAL JOB India Portal Background"
                  className={`absolute inset-0 h-full w-full object-cover object-[70%_20%] transition-opacity duration-1000 ease-in-out ${
                    isActive ? "opacity-100 z-1" : "opacity-0 pointer-events-none"
                  }`}
                />
              );
            })}
          </div>

        </section>

        {/* METRICS & ADVANTAGES */}
        <section className="relative z-20 pt-4 sm:pt-6 lg:pt-8 pb-1 sm:pb-2 bg-[#f8f9fa]">
          <div className="w-full px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-between items-start sm:items-center gap-y-8 gap-x-2 sm:gap-4 bg-white rounded-[2rem] md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 md:p-8 mx-auto w-full max-w-[1400px]">

              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start">
                <div className="flex shrink-0 items-center justify-center size-10 sm:size-12 md:size-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Users className="size-5 sm:size-6 md:size-7 stroke-[2]" />
                </div>
                <div>
                  <strong className="block text-xl sm:text-2xl md:text-3xl font-black text-[#10233F] leading-tight">{metrics[0]?.value}</strong>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 block">{t("verifiedWorkersMetric")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start">
                <div className="flex shrink-0 items-center justify-center size-10 sm:size-12 md:size-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Briefcase className="size-5 sm:size-6 md:size-7 stroke-[2]" />
                </div>
                <div>
                  <strong className="block text-xl sm:text-2xl md:text-3xl font-black text-[#10233F] leading-tight">{metrics[1]?.value}</strong>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 block">{t("liveJobOpeningsMetric")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start">
                <div className="flex shrink-0 items-center justify-center size-10 sm:size-12 md:size-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Building2 className="size-5 sm:size-6 md:size-7 stroke-[2]" />
                </div>
                <div>
                  <strong className="block text-xl sm:text-2xl md:text-3xl font-black text-[#10233F] leading-tight">{metrics[2]?.value}</strong>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 block">{t("employersMetric")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start">
                <div className="flex shrink-0 items-center justify-center size-10 sm:size-12 md:size-14 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <ShieldCheck className="size-5 sm:size-6 md:size-7 stroke-[2]" />
                </div>
                <div>
                  <strong className="block text-xl sm:text-2xl md:text-3xl font-black text-[#10233F] leading-tight">{metrics[3]?.value}</strong>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 block">{t("zeroCommissionMetric")}</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ABOUT COMPANY */}
        <section className="relative bg-[#f8f9fa] pt-2 sm:pt-4 lg:pt-6 pb-10 lg:pb-12 overflow-hidden">
          <div className="relative z-10 mx-auto max-w-[1500px] px-4">
            <div className="bg-white rounded-[30px] border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.05)] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12">

                {/* Left Column: Image and Tagline Banner */}
                <div className="lg:col-span-5 relative bg-white pb-20 lg:pb-0">
                  {/* Image container with gold curved edge */}
                  <div className="relative h-[300px] lg:h-[450px] w-full pr-12 lg:pr-16 pt-8 pl-8">
                    <div className="w-full h-full rounded-tr-[60px] rounded-bl-[60px] overflow-hidden border-r-[8px] border-b-[8px] border-[#D4AF37] relative shadow-lg">
                      <img src={aboutData.image} alt="Company Overview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-[#082F63]/10 mix-blend-multiply"></div>
                    </div>
                  </div>

                  {/* Right Person • Right Job • Right Opportunity Banner (Language Responsive) */}
                  <div className="absolute bottom-0 left-0 right-0 lg:right-[-3.5rem] bg-gradient-to-r from-[#082F63] via-[#0D3B73] to-[#082F63] rounded-tr-[32px] rounded-tl-[32px] lg:rounded-tl-none p-5 lg:p-6 shadow-2xl border-t-[4px] border-[#D4AF37] z-20">
                    <div className="grid grid-cols-3 divide-x divide-white/15">
                      <div className="flex flex-col items-center text-center px-1 sm:px-2 group">
                        <div className="size-9 lg:size-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-110">
                          <UserCheck className="size-4 lg:size-5 text-[#D4AF37]" />
                        </div>
                        <span className="text-xs lg:text-sm font-black text-white leading-tight">
                          {t("rightPerson")}
                        </span>
                        {lang !== "en" && (
                          <span className="text-[9px] lg:text-[10px] text-[#D4AF37] font-semibold mt-0.5">{t("rightPerson")}</span>
                        )}
                      </div>

                      <div className="flex flex-col items-center text-center px-1 sm:px-2 group">
                        <div className="size-9 lg:size-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-110">
                          <Briefcase className="size-4 lg:size-5 text-[#D4AF37]" />
                        </div>
                        <span className="text-xs lg:text-sm font-black text-white leading-tight">
                          {t("rightJob")}
                        </span>
                        {lang !== "en" && (
                          <span className="text-[9px] lg:text-[10px] text-[#D4AF37] font-semibold mt-0.5">{t("rightJob")}</span>
                        )}
                      </div>

                      <div className="flex flex-col items-center text-center px-1 sm:px-2 group">
                        <div className="size-9 lg:size-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-110">
                          <Sparkles className="size-4 lg:size-5 text-[#D4AF37]" />
                        </div>
                        <span className="text-xs lg:text-sm font-black text-white leading-tight">
                          {t("rightOpportunity")}
                        </span>
                        {lang !== "en" && (
                          <span className="text-[9px] lg:text-[10px] text-[#D4AF37] font-semibold mt-0.5">{t("rightOpportunity")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Text and Cards */}
                <div className="lg:col-span-7 p-8 lg:p-16 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-[2px] w-8 bg-[#D4AF37]"></div>
                      <span className="text-xs font-black text-[#082F63] tracking-[0.1em] uppercase">{t("aboutRealJob")}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF9E7] border border-[#FDE68A] text-[#B45309] font-black text-[11px] shadow-2xs">
                      <Sparkles className="size-3 text-[#D97706]" />
                      <span>
                        {t("rightPerson")} • {t("rightJob")} • {t("rightOpportunity")}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-[#082F63] leading-[1.1] mb-6">
                    {aboutData.title === "About Our Company" ? t("aboutOurCompany") : aboutData.title}
                  </h2>

                  <p className="text-[15px] font-medium text-gray-600 leading-relaxed mb-10 max-w-3xl whitespace-pre-wrap">
                    {aboutData.description.includes("REAL JOB is a reliable employment portal") ? t("aboutRealJobDescription") : aboutData.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {companyPillars.map((pillar) => {
                      const IconComponent = PILLAR_ICONS[pillar.iconName] || Target;
                      // Display custom title and description directly if edited in Superadmin CMS
                      const isDefaultTitle = pillar.title === "Our Mission" || pillar.title === "Our Vision" || pillar.title === "Core Values" || pillar.title === "Our Belief";
                      const title = (!isDefaultTitle && pillar.title) ? pillar.title :
                                    (lang === "mr" && pillar.titleMr ? pillar.titleMr :
                                    (pillar.id === "mission" ? t("ourMission") :
                                     pillar.id === "vision" ? t("ourVision") :
                                     pillar.id === "values" ? t("ourValues") :
                                     pillar.id === "belief" ? t("ourBelief") : pillar.title));

                      const isDefaultDesc = !pillar.description || pillar.description.includes("To provide the right employment") || pillar.description.includes("To become India's most trusted") || pillar.description.includes("Transparency, trust") || pillar.description.includes("Right Person, Right Job");
                      const desc = (!isDefaultDesc && pillar.description) ? pillar.description :
                                   (lang === "mr" && pillar.descriptionMr ? pillar.descriptionMr :
                                   (pillar.id === "mission" ? t("missionDesc") :
                                    pillar.id === "vision" ? t("visionDesc") :
                                    pillar.id === "values" ? t("valuesDesc") :
                                    pillar.id === "belief" ? `${t("rightPerson")}\n${t("rightJob")}\n${t("rightOpportunity")}` : pillar.description));

                      return (
                        <div
                          key={pillar.id || pillar.title}
                          className="group bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/40 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="size-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#D4AF37] z-10">
                            <IconComponent className="size-6 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                          </div>
                          <h4 className="text-[14px] font-black text-[#082F63] mb-2 z-10 relative">
                            {title}
                          </h4>
                          <p className="text-[11px] font-semibold text-gray-500 leading-snug z-10 relative whitespace-pre-line">
                            {desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR JOB CATEGORIES */}
        <section className="relative pt-6 pb-14 bg-gradient-to-b from-[#F5F8FC] via-white to-[#F5F8FC] overflow-hidden">
          <div className="relative z-10 mx-auto max-w-[1600px] px-4 text-center">

            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF9E7] border border-[#FDE68A] text-[#B45309] font-black text-xs uppercase tracking-wider mb-3 shadow-sm hover:scale-105 transition-transform duration-300">
              <Briefcase className="size-4 text-[#D97706] animate-bounce" />
              {t("exploreByCategory")}
            </div>

            {/* Main Section Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#082F63] mb-2 tracking-tight">
              {t("popularJobCategories")}
            </h2>

            {/* Subtitle with accent lines */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-[1.5px] w-12 md:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/60"></div>
              <p className="text-xs md:text-sm font-extrabold text-[#5B6B7F]">{t("rightOpportunityField")}</p>
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
                      onClick={() => navigate({ to: '/auth', search: { mode: 'login', role: 'worker' } })}
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
                          {catData.label || CATEGORY_TRANSLATIONS[catData.id]?.[lang]}
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

