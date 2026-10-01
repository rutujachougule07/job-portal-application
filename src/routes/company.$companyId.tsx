import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Gift,
  Globe,
  MapPin,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { JobCard, jobs, Job, companyDatabase, getCompanyMetadata, CompanyMetadata } from "@/components/portal/JobCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/company/$companyId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.companyId.replaceAll("-", " ").toUpperCase()} — Verified Company Hub | REAL JOB` },
      { name: "description", content: "Explore company background, active job openings, ratings, and employee benefits on REAL JOB." },
    ],
  }),
  component: CompanyPage,
});

export function CompanyPage() {
  const { t, n, lang } = useI18n();
  const { companyId } = useParams({ from: "/company/$companyId" });
  const defaultJob: Job = {
    id: "c-1",
    title: "Civil Engineer - Site Operations",
    company: "L&T Construction",
    location: "Mumbai, Maharashtra",
    salary: "₹35,000–50,000/mo",
    experience: "2–5 years",
    type: "Full-time",
    workMode: "On-site",
    posted: "1h ago",
    initials: "LT",
    category: "Construction",
  };

  // Map companyId slug back to company name or fallback
  const matchingJob: Job = (jobs.find((j) => {
    const slug = j.company.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return slug === companyId || companyId.includes(slug) || slug.includes(companyId);
  }) ?? jobs[0] ?? defaultJob);

  const companyMeta: CompanyMetadata = getCompanyMetadata(matchingJob);
  const companyJobs = jobs.filter((j) => j.company === matchingJob.company);

  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "culture" | "locations">("overview");
  const [following, setFollowing] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(lang === "mr" ? "कंपनी प्रोफाइल लिंक कॉपी झाली!" : "Company page link copied!");
    }
  };

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className="px-3.5 py-2 text-[#5B6B7F] hover:text-[#10233F] hover:bg-white rounded-xl flex items-center gap-1.5 text-xs font-black transition-all shadow-2xs border border-[#DCE5F0] bg-white"
            >
              <ArrowLeft className="size-4" /> {lang === "mr" ? "मागे जा" : "Back"}
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-[#5B6B7F]">
              <Link to="/" className="hover:text-[#063B78]">{t("home")}</Link>
              <span>/</span>
              <Link to="/jobs" className="hover:text-[#063B78]">{t("jobs")}</Link>
              <span>/</span>
              <span className="text-[#10233F]">{companyMeta.name}</span>
            </div>
          </div>

          {/* Company Hero Platform Header */}
          <div className="bg-white rounded-3xl border border-[#DCE5F0] shadow-md overflow-hidden mb-8">
            {/* Banner Cover Gradient */}
            <div className="h-44 sm:h-52 bg-gradient-to-r from-[#063B78] via-[#082F63] to-[#125BB5] p-6 text-white relative">
              <div className="absolute right-6 top-6 flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs h-9 px-3"
                >
                  <Share2 className="size-4 mr-1.5" /> {lang === "mr" ? "शेअर करा" : "Share"}
                </Button>
              </div>

              <div className="absolute bottom-4 left-6 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFC400] text-[#082F63] px-3 py-1 rounded-full shadow-sm">
                  {companyMeta.industry}
                </span>
                <span className="text-xs font-black text-emerald-300 flex items-center gap-1 bg-white/10 backdrop-blur px-3 py-1 rounded-full">
                  <ShieldCheck className="size-4 text-emerald-400" /> REAL JOB Verified Corporate Hub
                </span>
              </div>
            </div>

            {/* Profile Header Content */}
            <div className="p-6 sm:p-8 pt-0 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-12 sm:-mt-16 mb-6">
                
                {/* Logo & Company Name */}
                <div className="flex items-end gap-5">
                  <div className="grid size-24 sm:size-28 shrink-0 place-items-center rounded-3xl bg-white font-black text-[#063B78] text-4xl shadow-xl border-4 border-white ring-2 ring-[#063B78]/20">
                    {matchingJob.initials}
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#10233F]">
                      {companyMeta.name}
                    </h1>
                    <div className="flex items-center gap-3 text-xs font-bold text-[#5B6B7F] mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4 text-[#063B78]" /> {companyMeta.headquarters}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#082F63] bg-[#FFC400]/20 px-2.5 py-0.5 rounded-full border border-[#FFC400]/30 font-black">
                        <Star className="size-3.5 fill-[#FFC400] text-[#082F63]" /> {companyMeta.rating} / 5.0 ({companyMeta.reviewsCount})
                      </span>
                      <span>•</span>
                      <span>Est. {companyMeta.founded}</span>
                    </div>
                  </div>
                </div>

                {/* Follow & Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => {
                      setFollowing(!following);
                      toast.success(following ? `Unfollowed ${matchingJob.company}` : `Now following ${matchingJob.company}`);
                    }}
                    className={`h-11 px-6 font-black text-xs rounded-2xl shadow-sm ${
                      following
                        ? "bg-[#EBF1F8] text-[#063B78] hover:bg-[#DCE5F0]"
                        : "bg-[#063B78] text-white hover:bg-[#082F63]"
                    }`}
                  >
                    {following ? "✓ Following Company" : "+ Follow Company"}
                  </Button>

                  <a
                    href={companyMeta.website}
                    target="_blank"
                    rel="noreferrer"
                    className="h-11 px-5 rounded-2xl border border-[#DCE5F0] bg-white text-[#063B78] font-black text-xs inline-flex items-center justify-center hover:bg-[#F5F8FC] shadow-2xs gap-1.5"
                  >
                    <span>Website</span>
                    <ExternalLink className="size-4" />
                  </a>
                </div>

              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F5F8FC] border border-[#DCE5F0]/70">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-[#063B78]/10 text-[#063B78]">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">कर्मचारी संख्या</span>
                    <span className="text-xs sm:text-sm font-black text-[#10233F]">{companyMeta.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l sm:border-l border-[#DCE5F0] pl-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-[#FFC400]/20 text-[#082F63]">
                    <Briefcase className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">उपलब्ध नोकऱ्या</span>
                    <span className="text-xs sm:text-sm font-black text-[#063B78]">{companyJobs.length} Live Openings</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-[#DCE5F0] pl-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">कंपनी स्टेटस</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-700">Govt & GST Verified</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-[#DCE5F0] pl-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-[#063B78]/10 text-[#063B78]">
                    <Building className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">मुख्यालय</span>
                    <span className="text-xs sm:text-sm font-black text-[#10233F] truncate">{companyMeta.headquarters}</span>
                  </div>
                </div>
              </div>

              {/* Platform Navigation Tabs */}
              <div className="flex items-center gap-2 mt-6 border-b border-[#DCE5F0]">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 px-4 text-xs sm:text-sm font-black transition-all border-b-2 ${
                    activeTab === "overview"
                      ? "border-[#063B78] text-[#063B78]"
                      : "border-transparent text-[#5B6B7F] hover:text-[#10233F]"
                  }`}
                >
                  🏢 {lang === "mr" ? "कंपनी परिचय व माहिती" : "Company Overview"}
                </button>

                <button
                  onClick={() => setActiveTab("jobs")}
                  className={`pb-3 px-4 text-xs sm:text-sm font-black transition-all border-b-2 ${
                    activeTab === "jobs"
                      ? "border-[#063B78] text-[#063B78]"
                      : "border-transparent text-[#5B6B7F] hover:text-[#10233F]"
                  }`}
                >
                  💼 {lang === "mr" ? "सर्व नोकऱ्या" : "Active Openings"} ({companyJobs.length})
                </button>

                <button
                  onClick={() => setActiveTab("culture")}
                  className={`pb-3 px-4 text-xs sm:text-sm font-black transition-all border-b-2 ${
                    activeTab === "culture"
                      ? "border-[#063B78] text-[#063B78]"
                      : "border-transparent text-[#5B6B7F] hover:text-[#10233F]"
                  }`}
                >
                  🌟 {lang === "mr" ? "सुविधा आणि संस्कृती" : "Culture & Benefits"}
                </button>

                <button
                  onClick={() => setActiveTab("locations")}
                  className={`pb-3 px-4 text-xs sm:text-sm font-black transition-all border-b-2 ${
                    activeTab === "locations"
                      ? "border-[#063B78] text-[#063B78]"
                      : "border-transparent text-[#5B6B7F] hover:text-[#10233F]"
                  }`}
                >
                  📍 {lang === "mr" ? "कार्यालये" : "Office Locations"}
                </button>
              </div>

            </div>
          </div>

          {/* Tab Content Areas */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: About & Badges */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* About Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCE5F0] shadow-xs space-y-4">
                  <h3 className="text-lg font-black text-[#10233F] flex items-center gap-2">
                    <Building2 className="size-5 text-[#063B78]" />
                    {lang === "mr" ? "कंपनीबद्दल सविस्तर माहिती (About Corporate)" : "About Company"}
                  </h3>
                  <p className="text-sm font-semibold text-[#5B6B7F] leading-relaxed bg-[#F5F8FC] p-5 rounded-2xl border border-[#DCE5F0]/70">
                    {lang === "mr" ? companyMeta.aboutMr : companyMeta.aboutEn}
                  </p>

                  <div className="pt-4 border-t border-[#DCE5F0]">
                    <h4 className="text-xs font-black uppercase text-[#5B6B7F] tracking-wider mb-3">
                      {lang === "mr" ? "कंपनीची अधिकृत प्रमाणपत्रे व बॅजेस" : "Verification Badges"}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {companyMeta.trustBadges.map((badge, idx) => (
                        <span key={idx} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-black text-emerald-800 shadow-2xs">
                          <CheckCircle2 className="size-4 text-emerald-600" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Benefits & Perks */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCE5F0] shadow-xs space-y-4">
                  <h3 className="text-lg font-black text-[#10233F] flex items-center gap-2">
                    <Gift className="size-5 text-[#FFC400]" />
                    {lang === "mr" ? "कामगारांना मिळणाऱ्या सुविधा (Perks & Benefits)" : "Employee Benefits"}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {(lang === "mr" ? companyMeta.perksMr : companyMeta.perksEn).map((perk, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#EBF1F8] border border-[#063B78]/10 text-xs font-bold text-[#063B78]">
                        <Award className="size-5 text-[#063B78] shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Quick Stats & Job Openings Promo */}
              <div className="space-y-6">
                
                {/* Apply Directly Card */}
                <div className="bg-[#082F63] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFC400] text-[#082F63] px-2.5 py-1 rounded-full">
                      Direct Hiring Partner
                    </span>

                    <h3 className="text-xl font-black text-white">
                      {companyMeta.name} {lang === "mr" ? "मध्ये काम करायचे आहे?" : "Want to work here?"}
                    </h3>
                    <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                      {lang === "mr"
                        ? "कंपनीच्या थेट HR विभागाशी संपर्क साधा आणि सत्यापित नोकऱ्यांसाठी आजच अर्ज करा."
                        : "Connect directly with HR and apply for verified job openings today."}
                    </p>

                    <Button
                      onClick={() => setActiveTab("jobs")}
                      className="w-full btn-yellow h-11 font-black text-xs rounded-2xl shadow-md"
                    >
                      {lang === "mr" ? "सर्व नोकऱ्या पाहा आणि अर्ज करा" : "Browse & Apply for Jobs"}
                    </Button>
                  </div>
                </div>

                {/* Company Compliance Card */}
                <div className="bg-white p-6 rounded-3xl border border-[#DCE5F0] shadow-xs space-y-3 text-xs font-semibold text-[#5B6B7F]">
                  <h4 className="font-black text-[#10233F] text-sm flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    {lang === "mr" ? "कायदेशीर माहिती व सुरक्षा" : "Compliance & Safety"}
                  </h4>
                  <p>✓ 100% Verified GSTIN & Corporate Affairs Record.</p>
                  <p>✓ Zero-fee application for all candidates.</p>
                  <p>✓ Direct interview call from HR within 48 hours.</p>
                </div>

              </div>
            </div>
          )}

          {/* Tab 2: All Jobs List */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#10233F]">
                  {companyMeta.name} — {lang === "mr" ? "उपलब्ध नोकऱ्यांची यादी" : "Current Openings"}
                </h2>
                <span className="text-xs font-extrabold text-[#063B78] bg-[#063B78]/10 px-3 py-1 rounded-full">
                  {companyJobs.length} {lang === "mr" ? "नोकऱ्या उपलब्ध" : "Jobs Available"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companyJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Culture & Ratings */}
          {activeTab === "culture" && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCE5F0] shadow-xs space-y-6">
              <h3 className="text-xl font-black text-[#10233F]">
                {companyMeta.name} {lang === "mr" ? "कामगार पुनरावलोकने व कार्यसंस्कृती" : "Work Culture & Employee Ratings"}
              </h3>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#DCE5F0] text-center">
                  <span className="text-3xl font-black text-[#063B78]">4.6 ★</span>
                  <span className="text-xs font-bold text-[#5B6B7F] block mt-1">Work-Life Balance</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#DCE5F0] text-center">
                  <span className="text-3xl font-black text-[#063B78]">4.8 ★</span>
                  <span className="text-xs font-bold text-[#5B6B7F] block mt-1">Salary & Benefits</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#DCE5F0] text-center">
                  <span className="text-3xl font-black text-[#063B78]">4.7 ★</span>
                  <span className="text-xs font-bold text-[#5B6B7F] block mt-1">Job Security</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#DCE5F0] text-center">
                  <span className="text-3xl font-black text-[#063B78]">4.5 ★</span>
                  <span className="text-xs font-bold text-[#5B6B7F] block mt-1">Skill Growth</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Office Locations */}
          {activeTab === "locations" && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCE5F0] shadow-xs space-y-4">
              <h3 className="text-xl font-black text-[#10233F]">
                {companyMeta.name} {lang === "mr" ? "मुख्य आणि प्रादेशिक कार्यालये" : "Offices & Site Branches"}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#DCE5F0]">
                  <h4 className="font-black text-sm text-[#063B78] flex items-center gap-1.5">
                    <MapPin className="size-4" /> Head Office (मुख्यालय)
                  </h4>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-1">{companyMeta.headquarters}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#DCE5F0]">
                  <h4 className="font-black text-sm text-[#063B78] flex items-center gap-1.5">
                    <MapPin className="size-4" /> Maharashtra Regional Hub
                  </h4>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-1">MIDC Industrial Complex, Pune & Navi Mumbai</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <PublicFooter />
    </>
  );
}
