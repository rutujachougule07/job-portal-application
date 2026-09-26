import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building,
  Factory,
  HardHat,
  Headphones,
  Hotel,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  UserCheck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { Input } from "@/components/ui/input";

import { useI18n, getCategoryTitle, getCategoryDesc } from "@/lib/i18n";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Job Categories — REAL JOB | Find Work | Find Workers" },
      { name: "description", content: "Explore all worker and job categories on REAL JOB — Factory, Construction, Drivers, Electricians, Technicians & Security." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { t, n, lang } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "factory-workers", jobsCount: "2,480", icon: Factory },
    { id: "construction-workers", jobsCount: "1,950", icon: HardHat },
    { id: "technical-staff", jobsCount: "1,420", icon: Wrench },
    { id: "logistics-drivers", jobsCount: "1,830", icon: Truck },
    { id: "skilled-workers", jobsCount: "3,110", icon: UserCheck },
    { id: "unskilled-workers", jobsCount: "2,940", icon: Users },
    { id: "helpers", jobsCount: "2,150", icon: Headphones },
    { id: "electricians", jobsCount: "980", icon: Zap },
    { id: "maintenance", jobsCount: "1,120", icon: Building },
    { id: "warehouse-workers", jobsCount: "1,640", icon: PackageCheck },
    { id: "hotel-restaurant", jobsCount: "1,290", icon: Hotel },
    { id: "security", jobsCount: "1,530", icon: ShieldCheck },
  ];

  const filtered = categories.filter((c) => {
    const title = getCategoryTitle(c.id, lang).toLowerCase();
    const desc = getCategoryDesc(c.id, lang).toLowerCase();
    const term = searchTerm.toLowerCase();
    return title.includes(term) || desc.includes(term);
  });

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="bg-hero-overlay p-8 sm:p-12 rounded-2xl text-white mb-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur mb-3">
                <Sparkles className="size-3.5" />
                {t("catHeroEyebrow")}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white">
                {t("catHeroTitle")} <br />
                <span className="text-[#FFC400]">{t("catHeroSub")}</span>
              </h1>

              <p className="mt-3 text-sm sm:text-base font-medium text-white/90">
                {t("popularCategoriesSubtitle")}
              </p>

              {/* Search Bar */}
              <div className="mt-6 relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#5B6B7F]" />
                <Input
                  type="text"
                  placeholder={t("catSearchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 pl-12 bg-white border-0 text-xs font-bold text-[#10233F] rounded-xl shadow-md focus-visible:ring-[#FFC400]"
                />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((cat) => {
              const Icon = cat.icon;
              const title = getCategoryTitle(cat.id, lang);
              const desc = getCategoryDesc(cat.id, lang);
              return (
                <Link
                  key={cat.id}
                  to="/jobs"
                  search={{ category: title }}
                  className="card-realjob p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 rounded-xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center group-hover:bg-[#FFC400] group-hover:text-[#082F63] transition-colors">
                        <Icon className="size-6" />
                      </div>
                      <span className="text-xs font-black bg-[#EBF1F8] text-[#063B78] px-2.5 py-1 rounded-full group-hover:bg-[#063B78] group-hover:text-white transition-colors">
                        {n(cat.jobsCount)} {t("jobsCountText")}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-[#10233F] group-hover:text-[#063B78] transition-colors">
                      {title}
                    </h3>
                    <p className="mt-2 text-xs font-semibold text-[#5B6B7F] leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#DCE5F0] flex items-center justify-between text-xs font-bold text-[#063B78] group-hover:text-[#125BB5]">
                    <span>{t("browseJobs")}</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
