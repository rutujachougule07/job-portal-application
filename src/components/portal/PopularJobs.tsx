import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Building2,
  Clock3,
  Code,
  GraduationCap,
  HeartPulse,
  Landmark,
  LayoutGrid,
  MapPin,
  MoreHorizontal,
  Wallet,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

import { dataStore } from "@/lib/data-store";

export function PopularJobs() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("all");
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filterTabs = [
    { id: "all", labelKey: "allJobsTab" as const, icon: LayoutGrid },
    { id: "tech", labelKey: "itSoftwareTab" as const, icon: Code },
    { id: "health", labelKey: "healthcareTab" as const, icon: HeartPulse },
    { id: "banking", labelKey: "bankingTab" as const, icon: Landmark },
    { id: "edu", labelKey: "educationTab" as const, icon: GraduationCap },
    { id: "mkt", labelKey: "marketingTab" as const, icon: Briefcase },
  ];

  const allJobsFromStore = dataStore.getActiveJobs();

  const jobsList = allJobsFromStore.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    salary: j.salary,
    posted: j.postedAgo || "Just now",
    type: j.jobType || "Full Time",
    exp: j.experience || "Any",
    mode: j.workMode || "On-site",
    featured: true,
    badgeColor: "bg-[#063B78]",
    btnColor: "bg-[#063B78] hover:bg-[#082F63] text-white",
    waveGlow: "from-[#063B78]/15 via-[#063B78]/5",
    logoSvg: (
      <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#063B78] text-white shadow-md font-black text-[#FFC400] text-sm">
        {j.initials || (j.company ? j.company.substring(0, 2).toUpperCase() : "RJ")}
      </div>
    ),
  }));

  return (
    <section className="relative bg-[#F8F7F4] py-20 sm:py-28 overflow-hidden">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#1F2937]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Top Eyebrow & Title */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col items-start text-left max-w-2xl">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#FFFDF5] px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1F2937] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              {t("popularJobsEyebrow")}
            </div>

            {/* Heading */}
            <h2 className="mt-4 font-display text-4xl font-bold text-[#111827] sm:text-5xl">
              {t("popularJobs")}
            </h2>

            {/* Subtitle */}
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#374151] sm:text-base">
              {t("popularJobsSubtitle")}
            </p>
          </div>

          {/* Right Action Button - Far Right Aligned */}
          <div className="relative shrink-0 sm:ml-auto sm:self-end pb-1">
            {/* Rays sparkle decoration */}
            <svg
              className="absolute -right-3 -top-5 size-7 text-[#D4AF37] opacity-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-full bg-[#1F2937] px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#D4AF37] hover:text-[#1F2937] hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>{t("browseJobs")}</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Filter Tabs Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 shadow-sm ${
                  isActive
                    ? "bg-[#1F2937] text-white shadow-md ring-2 ring-[#D4AF37]/50"
                    : "bg-white border border-[#E5E2DA] text-[#374151] hover:bg-[#F2EFEC] hover:border-[#1F2937]/30"
                }`}
              >
                <Icon className={`size-3.5 ${isActive ? "text-[#D4AF37]" : "text-[#374151]"}`} />
                <span>{t(tab.labelKey)}</span>
              </button>
            );
          })}

          <button className="inline-flex items-center justify-center size-8 rounded-full bg-white border border-[#E5E2DA] text-[#374151] hover:bg-[#F2EFEC]">
            <MoreHorizontal className="size-4" />
          </button>
        </div>

        {/* 4 Job Cards Grid (2x2) */}
        {jobsList.length === 0 ? (
          <div className="mt-8 p-12 text-center bg-white rounded-3xl border border-[#E5E2DA] shadow-sm">
            <Briefcase className="size-12 mx-auto text-[#063B78] mb-3 opacity-60" />
            <h3 className="text-lg font-black text-[#10233F]">अद्याप कोणतीही नोकरी जोडलेली नाही (No Jobs Posted Yet)</h3>
            <p className="text-xs font-bold text-[#5B6B7F] mt-1">ॲडमिन कंट्रोल पॅनेलवरून नवीन नोकऱ्या जोडल्यावर त्या येथे थेट दिसतील.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {jobsList.map((job) => {
            const isSaved = !!savedJobs[job.id];
            return (
              <div
                key={job.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E5E2DA] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D4AF37]/50 hover:shadow-xl"
              >
                {/* Top Corner Wave Background Glow */}
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-gradient-to-br ${job.waveGlow} to-transparent blur-xl`}
                />

                {/* Top Section */}
                <div className="relative z-10 flex items-start gap-4">
                  {/* Company Logo Badge */}
                  {job.logoSvg}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to="/jobs/$jobId"
                            params={{ jobId: job.id }}
                            className="font-display text-xl font-bold text-[#111827] transition-colors hover:text-[#D4AF37]"
                          >
                            {job.title}
                          </Link>
                          {job.featured && (
                            <span className="rounded-full border border-[#D4AF37]/40 bg-[#FFFDF5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#B59124]">
                              {t("featured")}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#374151]">
                          <Building2 className="size-3.5 text-muted-foreground" />
                          {job.company}
                        </p>
                      </div>

                      {/* Bookmark Save Button */}
                      <button
                        onClick={() => toggleSave(job.id)}
                        className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all shadow-sm ${
                          isSaved
                            ? "border-[#D4AF37] bg-[#FFFDF5] text-[#D4AF37]"
                            : "border-[#E5E2DA] bg-white text-[#374151] hover:bg-[#F2EFEC]"
                        }`}
                        aria-label="Save job"
                      >
                        <Bookmark className={`size-4 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {/* Metadata Row */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#374151]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#111827]">
                        <Wallet className="size-3.5 text-muted-foreground" />
                        {job.salary}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="size-3.5 text-muted-foreground" />
                        {job.posted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Badges + Apply Button */}
                <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#F2EFEC]">
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full ${job.badgeColor} px-3.5 py-1 text-xs font-bold text-white shadow-sm`}>
                      {(job.type as string) === "Full Time" || (job.type as string) === "Full-time" ? t("fullTime") : job.type}
                    </span>
                    <span className="rounded-full bg-[#F2EFEC] border border-[#E5E2DA] px-3.5 py-1 text-xs font-bold text-[#374151]">
                      {job.exp}
                    </span>
                    <span className="rounded-full bg-[#F2EFEC] border border-[#E5E2DA] px-3.5 py-1 text-xs font-bold text-[#374151]">
                      {job.mode === "On-site" ? t("onSite") : job.mode === "Hybrid" ? t("hybrid") : t("remote")}
                    </span>
                  </div>

                  <Link
                    to="/jobs/$jobId"
                    params={{ jobId: job.id }}
                    className={`inline-flex items-center gap-1.5 rounded-full ${job.btnColor} px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
                  >
                    <span>{t("apply")}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
