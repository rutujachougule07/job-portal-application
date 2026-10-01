import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  Factory,
  Globe,
  HardHat,
  Headphones,
  HeartHandshake,
  MapPin,
  PhoneCall,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import careerTeam from "@/assets/career-team.jpg";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { PopularCategories } from "@/components/portal/PopularCategories";
import { PopularJobs } from "@/components/portal/PopularJobs";
import { WorkerCard, workersList } from "@/components/portal/WorkerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n, getCategoryTitle } from "@/lib/i18n";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "REAL JOB — Main Portal | Find Work | Find Workers | सर्व काही ऑनलाइन!" },
      { name: "description", content: "India's premier digital workforce platform connecting verified workers with top factory, construction & technical employers." },
      { property: "og:title", content: "REAL JOB — Find Work | Find Workers" },
      { property: "og:description", content: "योग्य माणूस • योग्य काम • योग्य संधी — सर्व काही ऑनलाइन!" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  const { t, lang } = useI18n();

  // Search tab state: 'job' or 'worker'
  const [searchTab, setSearchTab] = useState<"job" | "worker">("job");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("all");

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC]">
        {/* HERO SECTION */}
        <section className="relative isolate min-h-[640px] overflow-hidden">
          <img
            src={careerTeam}
            alt="REAL JOB India Workforce & Construction Workers"
            width={1600}
            height={1000}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-hero-overlay" />

          <div className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur">
                <Sparkles className="size-4" />
                {t("heroBadge")}
              </div>

              {/* Headlines */}
              <h1 className="font-display text-4xl font-black leading-[1.1] text-white sm:text-6xl lg:text-7xl">
                {t("heroTitleLine1")} <br />
                <span className="text-[#FFC400]">{t("heroTitleLine2")}</span> <br />
                {t("heroTitleLine3")}
              </h1>

              <p className="mt-4 text-lg sm:text-xl font-bold text-white/90">
                {t("heroSubtitle")}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="btn-yellow h-13 px-8 text-sm font-black shadow-md">
                  <Link to="/jobs">
                    {t("findJob")}
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>

                <Button asChild size="lg" className="btn-navy h-13 px-8 text-sm font-bold border border-white/30">
                  <Link to="/workers">
                    {t("hireTalent")}
                    <Users className="ml-1.5 size-4" />
                  </Link>
                </Button>
              </div>

              {/* Trust Features */}
              <div className="mt-10 flex flex-wrap gap-6 text-xs sm:text-sm font-bold text-white/90">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#FFC400]" />
                  {t("trustPhone")}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#FFC400]" />
                  {t("trustCommission")}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#FFC400]" />
                  {t("trustVerified")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH INTERFACE OVERLAY */}
        <section className="relative z-20 mx-auto -mt-12 max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl border border-[#DCE5F0] bg-white p-5 shadow-xl">
            {/* Search Tab Switcher: Job Search vs Worker Search */}
            <div className="flex items-center gap-2 mb-4 border-b border-[#DCE5F0] pb-3">
              <button
                onClick={() => setSearchTab("job")}
                className={`px-5 py-2 rounded-lg font-black text-xs transition-all ${
                  searchTab === "job"
                    ? "bg-[#063B78] text-white shadow-xs"
                    : "text-[#5B6B7F] hover:bg-[#F5F8FC]"
                }`}
              >
                {t("searchJobTab")}
              </button>
              <button
                onClick={() => setSearchTab("worker")}
                className={`px-5 py-2 rounded-lg font-black text-xs transition-all ${
                  searchTab === "worker"
                    ? "bg-[#063B78] text-white shadow-xs"
                    : "text-[#5B6B7F] hover:bg-[#F5F8FC]"
                }`}
              >
                {t("searchWorkerTab")}
              </button>
            </div>

            {/* Search Inputs */}
            <div className="grid gap-3 md:grid-cols-[1fr_0.8fr_0.8fr_auto]">
              <div className="relative flex items-center bg-[#F5F8FC] rounded-xl px-3 border border-[#DCE5F0]">
                <Search className="size-4 text-[#063B78] shrink-0" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-11 border-0 bg-transparent text-xs font-bold text-[#10233F] focus-visible:ring-0"
                />
              </div>

              <div className="relative flex items-center bg-[#F5F8FC] rounded-xl px-3 border border-[#DCE5F0]">
                <MapPin className="size-4 text-[#125BB5] shrink-0" />
                <Input
                  placeholder={t("location")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-11 border-0 bg-transparent text-xs font-bold text-[#10233F] focus-visible:ring-0"
                />
              </div>

              <div className="relative flex items-center bg-[#F5F8FC] rounded-xl px-3 border border-[#DCE5F0]">
                <Briefcase className="size-4 text-[#063B78] shrink-0" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 border-0 bg-transparent text-xs font-bold text-[#10233F] focus:outline-none"
                >
                  <option value="all">{t("allCategories")}</option>
                  <option value="construction">Construction</option>
                  <option value="it-software">IT & Software</option>
                  <option value="engineering">Engineering</option>
                  <option value="healthcare-medical">Healthcare & Medical</option>
                  <option value="finance-accounting">Finance & Accounting</option>
                  <option value="sales-marketing">Sales & Marketing</option>
                  <option value="education">Education</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="hr-recruitment">HR & Recruitment</option>
                  <option value="hospitality-tourism">Hospitality & Tourism</option>
                  <option value="logistics-transport">Logistics & Transport</option>
                  <option value="government-public">Government & Public Sector</option>
                  <option value="legal">Legal</option>
                  <option value="architecture-design">Architecture & Interior Design</option>
                  <option value="retail-ecommerce">Retail & E-commerce</option>
                  <option value="customer-service-bpo">Customer Service & BPO</option>
                  <option value="design-creative">Design & Creative</option>
                  <option value="media-communication">Media & Communication</option>
                  <option value="agriculture-farming">Agriculture & Farming</option>
                  <option value="science-research">Science & Research</option>
                </select>
              </div>

              <Button asChild size="lg" className="btn-yellow h-11 px-8 font-black text-xs">
                <Link
                  to={searchTab === "job" ? "/jobs" : "/workers"}
                  search={{
                    ...(category !== "all" ? { category } : {}),
                  }}
                >
                  {searchTab === "job" ? t("jobs") : t("workers")}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* POPULAR JOB CATEGORIES */}
        <PopularCategories />

        {/* FEATURED JOBS SECTION */}
        <PopularJobs />

        {/* FEATURED VERIFIED WORKERS SECTION */}
        <section className="py-16 sm:py-24 bg-white border-y border-[#DCE5F0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#063B78]/20 bg-[#063B78]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#063B78]">
                  <span className="h-2 w-2 rounded-full bg-[#FFC400]" />
                  {t("topWorkersTitle")}
                </div>
                <h2 className="mt-3 text-3xl font-black text-[#10233F] sm:text-4xl">
                  {t("topWorkersTitle")}
                </h2>
                <p className="mt-2 text-sm font-semibold text-[#5B6B7F]">
                  {t("topWorkersSubtitle")}
                </p>
              </div>

              <Button asChild className="btn-navy font-bold text-xs px-6 py-3 h-auto shrink-0">
                <Link to="/workers">
                  {t("viewAll")} ({workersList.length}) <ArrowRight className="ml-1.5 size-4 text-[#FFC400]" />
                </Link>
              </Button>
            </div>

            {/* Workers Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workersList.slice(0, 3).map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE REAL JOB */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-black uppercase tracking-wider text-[#125BB5] bg-[#EBF1F8] px-3 py-1 rounded-full">
                {t("whyUs")}
              </span>
              <h2 className="mt-3 text-3xl font-black text-[#10233F] sm:text-4xl">
                {t("whyUs")}
              </h2>
              <p className="mt-3 text-sm font-semibold text-[#5B6B7F]">
                {t("whyUsSubtitle")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-realjob p-6 text-center">
                <div className="size-14 rounded-2xl bg-[#063B78]/10 text-[#063B78] mx-auto flex items-center justify-center mb-4">
                  <ShieldCheck className="size-7" />
                </div>
                <h3 className="font-black text-lg text-[#10233F]">{t("step1Title")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  {t("step1Desc")}
                </p>
              </div>

              <div className="card-realjob p-6 text-center">
                <div className="size-14 rounded-2xl bg-[#FFC400]/20 text-[#082F63] mx-auto flex items-center justify-center mb-4">
                  <HeartHandshake className="size-7" />
                </div>
                <h3 className="font-black text-lg text-[#10233F]">{t("trustCommission")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  {t("step3Desc")}
                </p>
              </div>

              <div className="card-realjob p-6 text-center">
                <div className="size-14 rounded-2xl bg-[#125BB5]/10 text-[#125BB5] mx-auto flex items-center justify-center mb-4">
                  <Globe className="size-7" />
                </div>
                <h3 className="font-black text-lg text-[#10233F]">{t("chooseLanguage")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  {t("languageSubtitle")}
                </p>
              </div>

              <div className="card-realjob p-6 text-center">
                <div className="size-14 rounded-2xl bg-[#063B78]/10 text-[#063B78] mx-auto flex items-center justify-center mb-4">
                  <Zap className="size-7" />
                </div>
                <h3 className="font-black text-lg text-[#10233F]">{t("step3Title")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  {t("step3Desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MOBILE APP PROMOTION BANNER */}
        <section className="bg-hero-overlay text-white py-16 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#FFC400] bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {t("downloadTitle")}
                </span>
                <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl leading-tight">
                  {t("downloadTitle")} <br />
                  <span className="text-[#FFC400]">{t("downloadSubtitle")}</span>
                </h2>
                <p className="mt-4 text-sm font-semibold text-white/90 leading-relaxed">
                  {t("downloadSubtitle")}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button className="btn-yellow font-black text-xs px-6 py-3 h-12">
                    <Download className="size-4 mr-2" /> {t("playStore")}
                  </Button>
                  <Button variant="outline" className="border-white text-white font-bold text-xs px-6 py-3 h-12 hover:bg-white hover:text-[#063B78]">
                    {t("appStore")}
                  </Button>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="bg-white text-[#10233F] p-6 rounded-2xl shadow-2xl border-4 border-[#FFC400] text-center max-w-xs">
                  <QrCode className="size-36 mx-auto text-[#063B78]" />
                  <span className="block text-xs font-black text-[#063B78] mt-3">{t("downloadTitle")}</span>
                  <span className="block text-[10px] font-bold text-[#5B6B7F]">Scan QR to download REAL JOB App</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
