import { useState, useEffect, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building,
  Building2,
  ChevronDown,
  Compass,
  Factory,
  Filter,
  FlaskConical,
  GraduationCap,
  HardHat,
  Headphones,
  Hotel,
  Landmark,
  Laptop,
  LayoutGrid,
  MapPin,
  PackageCheck,
  Palette,
  Radio,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sprout,
  Stethoscope,
  TrendingUp,
  Truck,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { PopularCategories } from "@/components/portal/PopularCategories";
import { JobCard, jobs, Job } from "@/components/portal/JobCard";
import { JobCardImage } from "@/components/portal/JobCardImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n, getCategoryTitle, getCategoryDesc } from "@/lib/i18n";
import { dataStore, JobRecord } from "@/lib/data-store";

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

function JobsListingPage() {
  const { t, n, lang } = useI18n();
  const searchParams = Route.useSearch();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.category || "all");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [workModeFilter, setWorkModeFilter] = useState("all");

  useEffect(() => {
    setCategoryFilter(searchParams.category || "all");
    setSubCategoryFilter("all");
  }, [searchParams.category]);

  const isInitialState = (!categoryFilter || categoryFilter === "all") && !searchTerm && (!locationFilter || locationFilter === "all") && (!typeFilter || typeFilter === "all") && (!workModeFilter || workModeFilter === "all") && (!experienceFilter || experienceFilter === "all") && (!salaryFilter || salaryFilter === "all");

  const dynamicSubCategories = useMemo(() => {
    if (!categoryFilter || categoryFilter === "all") return [];
    
    const jobsInCategory = dataStore.getActiveJobs().filter(j => 
      j.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === categoryFilter.toLowerCase() ||
      j.category.toLowerCase() === categoryFilter.toLowerCase()
    );

    const subs = new Set<string>();
    jobsInCategory.forEach(j => {
      if (j.subcategory) subs.add(j.subcategory);
    });

    return Array.from(subs).map(sub => ({ id: sub, label: sub }));
  }, [categoryFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setLocationFilter("all");
    setSalaryFilter("all");
    setExperienceFilter("all");
    setTypeFilter("all");
    setWorkModeFilter("all");
    setSortBy("newest");
    setSubCategoryFilter("all");
  };

  const filteredJobs = useMemo(() => {
    const dynamicJobs: Job[] = dataStore.getActiveJobs().map((dj) => ({
      id: dj.id,
      title: dj.title,
      company: dj.company,
      location: dj.location,
      salary: dj.salary,
      experience: dj.experience,
      type: dj.jobType,
      workMode: (dj.workMode as any) || "On-site",
      posted: dj.postedAgo || "Recently",
      initials: dj.initials || dj.company.slice(0, 2).toUpperCase(),
      category: dj.category,
      featured: dj.featured ?? false,
      openings: dj.vacancies ?? 1,
    }));
    return dynamicJobs.filter((job) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        (job.category && job.category.toLowerCase().includes(term));

      let matchesCategory = false;
      if (categoryFilter === "all" || !categoryFilter) {
        matchesCategory = true;
      } else {
        const normalizedFilter = categoryFilter.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        const jobCatNorm = (job.category || "").toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        
        matchesCategory = jobCatNorm === normalizedFilter || jobCatNorm.includes(normalizedFilter) || normalizedFilter.includes(jobCatNorm);
      }

      if (matchesCategory && subCategoryFilter !== "all" && subCategoryFilter) {
        const subClean = subCategoryFilter.toLowerCase();
        const titleClean = job.title.toLowerCase();
        const catClean = (job.category || "").toLowerCase();

        matchesCategory = 
          titleClean.includes(subClean) || 
          catClean.includes(subClean) ||
          subClean.includes(titleClean);
      }

      const matchesLocation =
        locationFilter === "all" || job.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesType = typeFilter === "all" || job.type.toLowerCase() === typeFilter.toLowerCase();

      const matchesWorkMode =
        workModeFilter === "all" || job.workMode.toLowerCase() === workModeFilter.toLowerCase();

      let matchesExp = true;
      if (experienceFilter !== "all") {
        const expStr = job.experience.toLowerCase();
        if (experienceFilter === "Fresher") {
          matchesExp = expStr.includes("fresher") || expStr.includes("0-2");
        } else if (experienceFilter === "1-3") {
          matchesExp = expStr.includes("1-3") || expStr.includes("1+") || expStr.includes("0-2") || expStr.includes("2-5");
        } else if (experienceFilter === "3-5") {
          matchesExp = expStr.includes("3+") || expStr.includes("2-5") || expStr.includes("3-5") || expStr.includes("5+");
        } else if (experienceFilter === "5+") {
          matchesExp = expStr.includes("5+");
        }
      }

      let matchesSalary = true;
      if (salaryFilter !== "all") {
        const minTarget = parseInt(salaryFilter);
        const match = job.salary.match(/\d+,\d+/);
        if (match) {
          const minSalary = parseInt(match[0].replace(',', ''));
          matchesSalary = minSalary >= minTarget;
        } else if (job.salary.includes("/day")) {
          // rough conversion for daily wages to monthly
          const dayMatch = job.salary.match(/\d+/);
          if (dayMatch) {
            const minSalary = parseInt(dayMatch[0]) * 26;
            matchesSalary = minSalary >= minTarget;
          }
        }
      }

      return matchesSearch && matchesCategory && matchesLocation && matchesType && matchesWorkMode && matchesExp && matchesSalary;
    });
  }, [searchTerm, categoryFilter, locationFilter, typeFilter, workModeFilter, subCategoryFilter, experienceFilter, salaryFilter, lang]);

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Banner */}
          {/* Hero Banner or Category Header */}
          {(!categoryFilter || categoryFilter === "all") ? (
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
          ) : (
            <div className="mb-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm">
              <div>
                <button 
                  onClick={() => { setCategoryFilter("all"); setSubCategoryFilter("all"); }} 
                  className="text-xs font-bold text-[#125BB5] mb-3 flex items-center gap-1 hover:underline"
                >
                  <ArrowLeft className="size-3" /> {lang === "mr" ? "सर्व नोकऱ्या पहा" : "All Jobs"}
                </button>
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-[#EBF1F8] to-[#DCE5F0] flex items-center justify-center text-[#063B78] shadow-inner">
                    <Briefcase className="size-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#082F63] capitalize">
                      {getCategoryTitle(categoryFilter, lang)}
                    </h1>
                    <p className="text-sm font-bold text-[#5B6B7F] mt-1">
                      {filteredJobs.length} {lang === "mr" ? "नोकऱ्या उपलब्ध" : "Jobs Available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Smaller Search Bar for Category Page */}
              <div className="w-full md:w-auto grid grid-cols-[1fr] gap-3">
                <div className="relative flex items-center w-full md:w-[280px]">
                  <Search className="absolute left-3 size-4 text-[#5B6B7F]" />
                  <Input
                    placeholder={lang === "mr" ? "नोकरी शोधा..." : "Search in category..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-12 border border-[#DCE5F0] bg-[#F5F8FC] rounded-xl text-xs text-[#10233F] font-bold focus-visible:ring-1 focus-visible:ring-[#125BB5]"
                  />
                </div>
              </div>
            </div>
          )}

          {(!categoryFilter || categoryFilter === "all") && (
            <div className="mb-8 bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs">
              <h2 className="text-xl font-black text-[#10233F] mb-6 flex items-center gap-2">
                <LayoutGrid className="size-5 text-[#063B78]" />
                {t("popularCategories")}
              </h2>
              <PopularCategories limit={20} hideHeader={true} />
            </div>
          )}

          {/* Main Grid Layout */}
          {!isInitialState && (
            <div className={`grid grid-cols-1 ${categoryFilter !== "all" && categoryFilter ? "lg:grid-cols-[280px_1fr]" : ""} gap-8 items-start`}>
              {/* Desktop Filters Sidebar */}
            {(categoryFilter !== "all" && categoryFilter) && (
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

              {/* Experience Filter */}
              <div className="mb-6">
                <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">
                  {t("experience")}
                </label>
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                >
                  <option value="all">{t("experience")}</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1-3">1-3 Years</option>
                  <option value="3-5">3-5 Years</option>
                  <option value="5+">5+ Years</option>
                </select>
              </div>

              {/* Salary Filter */}
              <div className="mb-6">
                <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">
                  {t("expectedSalary")}
                </label>
                <select
                  value={salaryFilter}
                  onChange={(e) => setSalaryFilter(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                >
                  <option value="all">{t("expectedSalary")}</option>
                  <option value="10000">₹10,000+ / mo</option>
                  <option value="15000">₹15,000+ / mo</option>
                  <option value="20000">₹20,000+ / mo</option>
                  <option value="25000">₹25,000+ / mo</option>
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

              {/* Work Mode Filter (WFH / On-site / Hybrid) */}
              <div className="mb-6">
                <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">
                  Work Mode / मोड
                </label>
                <select
                  value={workModeFilter}
                  onChange={(e) => setWorkModeFilter(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                >
                  <option value="all">All Modes / सर्व मोड</option>
                  <option value="Remote">🏠 Work From Home (WFH)</option>
                  <option value="On-site">🏢 On-site (Office / Site)</option>
                  <option value="Hybrid">🔄 Hybrid</option>
                </select>
              </div>
            </aside>
            )}

            {/* Main Content List */}
            <div className="w-full">
              {/* Toolbar */}
              {(categoryFilter !== "all" && categoryFilter) && (
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
              )}

              {/* Dynamic Trapeze Tabs and Sub-categories */}
              {(categoryFilter !== "all" && categoryFilter) && (
                <div className="mb-8">
                  {/* Trapeze Tabs - Exactly like Factory */}
                  <div className="flex border-b border-[#DCE5F0] mb-6 overflow-x-auto no-scrollbar items-end gap-2">
                    <button 
                      onClick={() => {
                        setCategoryFilter("all");
                        setSubCategoryFilter("all");
                      }}
                      className="px-3 py-2 text-[#5B6B7F] hover:text-[#10233F] hover:bg-[#F5F8FC] rounded-lg mb-1 ml-1 flex items-center gap-1.5 text-[13px] font-bold transition-colors shrink-0"
                    >
                      <ArrowLeft className="size-4" /> {t("viewWebsite")}
                    </button>
                    <div className="relative px-8 py-3 text-sm font-black text-[#10233F] bg-white border border-b-0 border-[#DCE5F0] rounded-t-[16px] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex items-center gap-2 shrink-0">
                      {categoryFilter === "factory-workers" ? <Factory className="size-4" /> :
                       categoryFilter === "construction-workers" ? <HardHat className="size-4" /> :
                       categoryFilter === "technical-staff" ? <Wrench className="size-4" /> :
                       categoryFilter === "logistics-drivers" ? <Truck className="size-4" /> :
                       categoryFilter === "skilled-workers" ? <UserCheck className="size-4" /> :
                       categoryFilter === "unskilled-workers" ? <Users className="size-4" /> :
                       categoryFilter === "helpers" ? <Headphones className="size-4" /> :
                       categoryFilter === "electricians" ? <Zap className="size-4" /> :
                       categoryFilter === "maintenance" ? <Building className="size-4" /> :
                       categoryFilter === "warehouse-workers" ? <PackageCheck className="size-4" /> :
                       categoryFilter === "hotel-restaurant" ? <Hotel className="size-4" /> :
                       categoryFilter === "security" ? <ShieldCheck className="size-4" /> :
                       <Briefcase className="size-4" />}
                      {getCategoryTitle(categoryFilter, lang) || categoryFilter}
                      {/* Trapeze slope effect on right side */}
                      <div className="absolute -right-3 bottom-0 w-3 h-full bg-white skew-x-[15deg] origin-bottom border-r border-[#DCE5F0]"></div>
                    </div>
                  </div>

                  {/* Sub-Category Pills */}
                  {dynamicSubCategories.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setSubCategoryFilter("all")}
                        className={`px-5 py-2.5 rounded-full text-[11px] font-black tracking-wide uppercase transition-all shadow-sm flex items-center gap-2 ${
                          subCategoryFilter === "all"
                            ? "bg-[#063B78] text-white shadow-md scale-105"
                            : "bg-white border border-[#DCE5F0] text-[#5B6B7F] hover:bg-[#F5F8FC] hover:text-[#10233F] hover:scale-105"
                        }`}
                      >
                        {t("allCategories")}
                      </button>
                      {dynamicSubCategories.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setSubCategoryFilter(sub.id)}
                          className={`px-5 py-2.5 rounded-full text-[11px] font-black tracking-wide uppercase transition-all shadow-sm flex items-center gap-2 ${
                            subCategoryFilter === sub.id
                              ? "bg-[#063B78] text-white shadow-md scale-105"
                              : "bg-white border border-[#DCE5F0] text-[#5B6B7F] hover:bg-[#F5F8FC] hover:text-[#10233F] hover:scale-105"
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Main Content Area */}
              {/* Main Content Area */}
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {filteredJobs.map((job: Job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="card-realjob p-12 text-center bg-white rounded-2xl border border-[#DCE5F0]">
                  <Briefcase className="mx-auto size-14 text-[#5B6B7F] mb-4" />
                  <h3 className="text-xl font-black text-[#10233F]">कोणतीही नोकरी उपलब्ध नाही (No Jobs Found)</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                    अद्याप कोणतीही नवीन नोकरी पोस्ट केलेली नाही. मालक / कंपनी नवीन नोकरी पोस्ट करतील तेव्हा ती येथे थेट दिसेल.
                  </p>
                  <Button onClick={resetFilters} className="mt-5 btn-yellow text-xs font-bold px-6">
                    {t("resetFilters")}
                  </Button>
                </div>
              )}
            </div>
          </div>
          )}
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
                    <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">{lang === "mr" ? "अनुभव" : "Experience"}</label>
                    <select
                      value={experienceFilter}
                      onChange={(e) => setExperienceFilter(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold"
                    >
                      <option value="all">{lang === "mr" ? "सर्व अनुभव" : "Any Experience"}</option>
                      <option value="Fresher">{lang === "mr" ? "फ्रेसर" : "Fresher"}</option>
                      <option value="1-3">1-3 {lang === "mr" ? "वर्षे" : "Years"}</option>
                      <option value="3-5">3-5 {lang === "mr" ? "वर्षे" : "Years"}</option>
                      <option value="5+">5+ {lang === "mr" ? "वर्षे" : "Years"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">{lang === "mr" ? "किमान पगार" : "Minimum Salary"}</label>
                    <select
                      value={salaryFilter}
                      onChange={(e) => setSalaryFilter(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold"
                    >
                      <option value="all">{lang === "mr" ? "कोणताही पगार" : "Any Salary"}</option>
                      <option value="10000">₹10,000+ / {lang === "mr" ? "महिना" : "mo"}</option>
                      <option value="15000">₹15,000+ / {lang === "mr" ? "महिना" : "mo"}</option>
                      <option value="20000">₹20,000+ / {lang === "mr" ? "महिना" : "mo"}</option>
                      <option value="25000">₹25,000+ / {lang === "mr" ? "महिना" : "mo"}</option>
                    </select>
                  </div>
                  {/* Job Type Filter */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">{t("jobTypeLabel")}</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold"
                    >
                      <option value="all">{t("allTypes")}</option>
                      <option value="Full-time">{t("fullTime")}</option>
                      <option value="Part-time">{t("partTime")}</option>
                      <option value="Contract">{t("contract")}</option>
                    </select>
                  </div>

                  {/* Work Mode Filter */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">Work Mode / मोड</label>
                    <select
                      value={workModeFilter}
                      onChange={(e) => setWorkModeFilter(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold"
                    >
                      <option value="all">All Modes / सर्व मोड</option>
                      <option value="Remote">🏠 Work From Home (WFH)</option>
                      <option value="On-site">🏢 On-site (Office / Site)</option>
                      <option value="Hybrid">🔄 Hybrid</option>
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
