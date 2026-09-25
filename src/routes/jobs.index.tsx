import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Briefcase,
  Building2,
  ChevronDown,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { JobCard, jobs, Job } from "@/components/portal/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n, getCategoryTitle } from "@/lib/i18n";

export const Route = createFileRoute("/jobs/")({
  validateSearch: (search: Record<string, unknown>): { category?: string | undefined } => {
    return {
      category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Find Jobs — REAL JOB | Find Work | Find Workers" },
      { name: "description", content: "Browse verified factory, construction, driver, ITI and technical jobs across Maharashtra and India." },
    ],
  }),
  component: JobsListingPage,
});

export function JobsListingPage() {
  const { t, n, lang } = useI18n();
  const searchParams = Route.useSearch();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.category || "all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setLocationFilter("all");
    setSalaryFilter("all");
    setExperienceFilter("all");
    setTypeFilter("all");
    setSortBy("newest");
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        (job.category && job.category.toLowerCase().includes(term));

      const matchesCategory =
        categoryFilter === "all" ||
        !categoryFilter ||
        (job.category && job.category.toLowerCase().includes(categoryFilter.toLowerCase()));

      const matchesLocation =
        locationFilter === "all" || job.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesType = typeFilter === "all" || job.type.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesLocation && matchesType;
    });
  }, [searchTerm, categoryFilter, locationFilter, typeFilter]);

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Banner */}
          <div className="bg-hero-overlay p-8 rounded-2xl text-white mb-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur mb-3">
                <Briefcase className="size-3.5" />
                {t("jobs")}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {t("jobsInRegion")} <br />
                <span className="text-[#FFC400]">{t("directCompanyContact")}</span>
              </h1>

              <p className="mt-2 text-sm text-white/90 font-medium">
                {t("jobsSubtext")}
              </p>

              {/* Inline Search Bar */}
              <div className="mt-6 grid sm:grid-cols-[1fr_0.8fr_auto] gap-3 bg-white p-2.5 rounded-xl shadow-md border border-[#DCE5F0]">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 size-4 text-[#5B6B7F]" />
                  <Input
                    placeholder={t("searchJobPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-11 border-0 bg-transparent text-xs text-[#10233F] font-bold focus-visible:ring-0"
                  />
                </div>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 size-4 text-[#125BB5]" />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full h-11 border-0 bg-transparent text-xs font-bold text-[#10233F] pl-9 pr-3 focus:outline-none"
                  >
                    <option value="all">{t("allLocations")}</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="pune">Pune</option>
                    <option value="chakan">Chakan</option>
                    <option value="bengaluru">Bengaluru</option>
                  </select>
                </div>
                <Button className="btn-yellow h-11 font-black text-xs px-6">
                  {t("search")}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-[#DCE5F0] mb-5">
                <span className="font-black text-sm text-[#10233F] flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-[#063B78]" />
                  {t("filters")}
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-[#125BB5] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="size-3" /> {t("reset")}
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">
                  {t("jobCategory")}
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                >
                  <option value="all">{t("allCategories")}</option>
                  <option value="Factory Workers">{getCategoryTitle("factory-workers", lang)}</option>
                  <option value="Construction Workers">{getCategoryTitle("construction-workers", lang)}</option>
                  <option value="Technical Staff">{getCategoryTitle("technical-staff", lang)}</option>
                  <option value="Logistics & Drivers">{getCategoryTitle("logistics-drivers", lang)}</option>
                  <option value="Skilled Workers">{getCategoryTitle("skilled-workers", lang)}</option>
                  <option value="Electricians">{getCategoryTitle("electricians", lang)}</option>
                </select>
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">
                  {t("jobTypeLabel")}
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                >
                  <option value="all">{t("allTypes")}</option>
                  <option value="Full-time">{t("fullTime")}</option>
                  <option value="Part-time">{t("partTime")}</option>
                  <option value="Contract">{t("contract")}</option>
                </select>
              </div>
            </aside>

            {/* Main Content List */}
            <div>
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#DCE5F0] mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#10233F]">
                    {t("totalJobsCount")}: <span className="text-[#063B78]">{n(filteredJobs.length)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden text-xs font-bold border-[#063B78] text-[#063B78]"
                    onClick={() => setMobileFilterOpen(true)}
                  >
                    <Filter className="size-3.5 mr-1" /> {t("filters")}
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#5B6B7F] shrink-0">{t("sortByLabel")}:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="h-9 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                    >
                      <option value="newest">{t("newestFirst")}</option>
                      <option value="title">{t("byTitle")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              {filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="card-realjob p-12 text-center bg-white">
                  <Briefcase className="mx-auto size-14 text-[#5B6B7F] mb-4" />
                  <h3 className="text-xl font-black text-[#10233F]">{t("noJobsFound")}</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                    {t("noJobsFoundSub")}
                  </p>
                  <Button onClick={resetFilters} className="mt-5 btn-yellow text-xs font-bold px-6">
                    {t("resetFilters")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-[#082F63]/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#DCE5F0] mb-6">
                  <span className="font-black text-base text-[#10233F]">{t("filters")}</span>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#5B6B7F]">
                    <X className="size-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">{t("jobCategory")}</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold"
                    >
                      <option value="all">{t("allCategories")}</option>
                      <option value="Factory Workers">{getCategoryTitle("factory-workers", lang)}</option>
                      <option value="Construction Workers">{getCategoryTitle("construction-workers", lang)}</option>
                      <option value="Technical Staff">{getCategoryTitle("technical-staff", lang)}</option>
                      <option value="Logistics & Drivers">{getCategoryTitle("logistics-drivers", lang)}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#DCE5F0] grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={resetFilters} className="text-xs font-bold">
                  {t("reset")}
                </Button>
                <Button onClick={() => setMobileFilterOpen(false)} className="btn-yellow text-xs font-extrabold">
                  {t("continue")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <PublicFooter />
    </>
  );
}
