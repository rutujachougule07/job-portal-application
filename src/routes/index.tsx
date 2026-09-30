import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck,
  UserCheck,
  Briefcase,
  Building2,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe,
  PhoneCall,
  LayoutDashboard,
  Zap,
  HeartHandshake,
  Award
} from "lucide-react";
import careerTeam from "@/assets/career-team.jpg";
import { Brand } from "@/components/portal/Brand";
import { LanguageSwitcher } from "@/components/portal/LanguageSwitcher";
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

export function LandingGatewayPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleQuickUserEntry = () => {
    const userObj = {
      id: "seeker-demo",
      email: "user@realjob.com",
      role: "worker" as const,
      fullName: "Rutuja Pawar (Candidate)",
    };
    window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
    dataStore.setCurrentUser(userObj);
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
    toast.success("Admin Portal Ready! Opening Admin Control Dashboard...");
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col justify-between">
      {/* LANDING HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#DCE5F0] bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Brand className="h-14 sm:h-16 scale-105 origin-left" />

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher label={t("languageLabel")} showCurrent={true} />

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
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO HERO OVERLAY SECTION */}
        <section className="relative isolate overflow-hidden bg-hero-overlay py-16 sm:py-24 text-white">
          <img
            src={careerTeam}
            alt="REAL JOB India Portal"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-25"
          />
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FFC400] backdrop-blur">
              <Sparkles className="size-4" />
              भारतातील #१ कामगार व जॉब डिजिटल पोर्टल (Portal Entrance)
            </div>

            <h1 className="font-display text-3xl font-black leading-tight sm:text-5xl lg:text-6xl text-white">
              REAL JOB पोर्टल मध्ये आपले स्वागत आहे! <br />
              <span className="text-[#FFC400]">योग्य माणूस • योग्य काम • योग्य संधी</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg font-semibold text-white/90">
              पुढील पर्यायांमधून आपले पोर्टल निवडा — युजर लॉगिन द्वारे वेबसाईट वापरा किंवा ॲडमिन लॉगिन द्वारे डॅशबोर्ड नियंत्रित करा.
            </p>

            {/* QUICK ONE-CLICK ACCESS BAR */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/20 max-w-xl mx-auto backdrop-blur-md">
              <span className="text-xs font-black uppercase text-[#FFC400] w-full sm:w-auto">
                ⚡ झटपट चाचणी (Quick Access):
              </span>
              <Button
                onClick={handleQuickUserEntry}
                className="btn-yellow text-xs font-black h-9 px-4 shadow-sm"
              >
                👤 युजर पोर्टलवर जा (User Portal)
              </Button>
              <Button
                onClick={handleQuickAdminEntry}
                className="bg-white hover:bg-gray-100 text-[#063B78] text-xs font-black h-9 px-4 shadow-sm"
              >
                🛡️ ॲडमिन डॅशबोर्ड पहा (Admin Panel)
              </Button>
            </div>
          </div>
        </section>

        {/* DUAL PORTAL CARDS (MAIN USER REQUIREMENT) */}
        <section className="relative z-20 mx-auto -mt-10 max-w-6xl px-4 sm:px-6 mb-16">
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* CARD 1: USER PORTAL / LOGIN */}
            <div className="group rounded-3xl border-2 border-[#DCE5F0] bg-white p-8 shadow-xl transition-all duration-300 hover:border-[#063B78] hover:shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="grid size-16 place-items-center rounded-2xl bg-[#EBF1F8] text-[#063B78] group-hover:bg-[#063B78] group-hover:text-white transition-colors">
                    <UserCheck className="size-8" />
                  </span>
                  <span className="rounded-full bg-[#EBF1F8] px-3 py-1 text-xs font-black uppercase text-[#063B78]">
                    कामगार & मालक दालन
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#10233F] group-hover:text-[#063B78] transition-colors">
                  युजर लॉगिन / User Portal
                </h2>
                <p className="mt-2 text-sm font-semibold text-[#5B6B7F]">
                  नोकरी शोधक कामगार, कारागीर आणि काम देणाऱ्या कंपन्यांसाठी युजर लॉगिन आणि मुख्य जॉब वेबसाईट.
                </p>

                <div className="mt-6 space-y-3 pt-4 border-t border-[#DCE5F0]">
                  {[
                    "१०,०००+ सत्यापित कुशल कामगार व नोकऱ्या",
                    "कोणतेही मध्यस्थ किंवा कमिशन नाही (0% Commission)",
                    "थेट फोन अथवा व्हॉट्सॲपवर संपर्क करा",
                    "नवीन प्रोफाईल तयार करा & जॉब्स ट्रॅक करा",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-[#10233F]">
                      <CheckCircle2 className="size-4 text-[#063B78] shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-3 pt-6 border-t border-[#DCE5F0]">
                <Button
                  asChild
                  size="lg"
                  className="btn-navy h-12 w-full font-black text-sm shadow-md"
                >
                  <Link to="/auth" search={{ mode: "login", role: "worker" }}>
                    <UserCheck className="size-4 mr-2" />
                    युजर लॉगिन करा (User Login)
                    <ArrowRight className="ml-auto size-4 text-[#FFC400]" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 w-full border-[#063B78] text-[#063B78] font-black text-xs hover:bg-[#EBF1F8]"
                >
                  <Link to="/home">
                    🌐 मुख्य वेबसाईट पहा (Go to Main Website)
                  </Link>
                </Button>
              </div>
            </div>

            {/* CARD 2: ADMIN PORTAL / LOGIN */}
            <div className="group rounded-3xl border-2 border-[#DCE5F0] bg-white p-8 shadow-xl transition-all duration-300 hover:border-[#FFC400] hover:shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="grid size-16 place-items-center rounded-2xl bg-[#FFF8E1] text-[#082F63] group-hover:bg-[#FFC400] group-hover:text-[#082F63] transition-colors">
                    <ShieldCheck className="size-8" />
                  </span>
                  <span className="rounded-full bg-[#FFF8E1] px-3 py-1 text-xs font-black uppercase text-[#082F63]">
                    प्रशासकीय दालन (Control)
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#10233F] group-hover:text-[#082F63] transition-colors">
                  ॲडमिन लॉगिन / Admin Portal
                </h2>
                <p className="mt-2 text-sm font-semibold text-[#5B6B7F]">
                  प्लॅटफॉर्म व्यवस्थापक आणि प्रशासकांसाठी स्वतंत्र ॲडमिन डॅशबोर्ड आणि नियंत्रण दालन.
                </p>

                <div className="mt-6 space-y-3 pt-4 border-t border-[#DCE5F0]">
                  {[
                    "कामगार, कंपनी व युजर्सचे संपूर्ण नियंत्रण",
                    "नोकरी पोस्टिंग्स मंजुरी & स्टेटस मॅनेजमेंट",
                    "ई-पगार (E-Salary) & पेरोल पडताळणी",
                    "प्लॅटफॉर्म रिपोर्ट, विश्लेषण & सेटिंग्ज",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-[#10233F]">
                      <CheckCircle2 className="size-4 text-[#082F63] shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-3 pt-6 border-t border-[#DCE5F0]">
                <Button
                  asChild
                  size="lg"
                  className="btn-yellow h-12 w-full font-black text-sm shadow-md"
                >
                  <Link to="/auth" search={{ mode: "login", role: "admin" }}>
                    <ShieldCheck className="size-4 mr-2" />
                    ॲडमिन लॉगिन करा (Admin Login)
                    <ArrowRight className="ml-auto size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 w-full border-[#063B78] text-[#063B78] font-black text-xs hover:bg-[#EBF1F8]"
                >
                  <Link to="/admin">
                    🛡️ ॲडमिन डॅशबोर्ड पहा (Go to Admin Dashboard)
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </section>

        {/* METRICS & ADVANTAGES */}
        <section className="py-12 bg-white border-y border-[#DCE5F0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <strong className="block text-3xl sm:text-4xl font-black text-[#063B78]">१०,०००+</strong>
                <span className="text-xs font-bold text-[#5B6B7F]">सत्यापित कामगार (Verified Workers)</span>
              </div>
              <div className="p-4">
                <strong className="block text-3xl sm:text-4xl font-black text-[#063B78]">५,०००+</strong>
                <span className="text-xs font-bold text-[#5B6B7F]">सक्रिय नोकऱ्या (Live Job Openings)</span>
              </div>
              <div className="p-4">
                <strong className="block text-3xl sm:text-4xl font-black text-[#063B78]">१,२००+</strong>
                <span className="text-xs font-bold text-[#5B6B7F]">कारखाने व कंपन्या (Employers)</span>
              </div>
              <div className="p-4">
                <strong className="block text-3xl sm:text-4xl font-black text-[#063B78]">०%</strong>
                <span className="text-xs font-bold text-[#5B6B7F]">कमिशन नियम (Zero Commission)</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
