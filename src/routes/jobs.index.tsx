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
  List,
  ArrowDownAZ
} from "lucide-react";
import { UserSidebarLayout } from "@/components/portal/UserSidebarLayout";
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
  const currentUser = dataStore.getCurrentUser();
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

  const dynamicMainCategories = useMemo(() => {
    const jobsList = dataStore.getAllJobs();
    const catMap = new Map<string, { slug: string; name: string; count: number }>();

    jobsList.forEach((job) => {
      if (job.category && job.category.trim()) {
        const name = job.category.trim();
        const slug = name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        if (!catMap.has(slug)) {
          catMap.set(slug, { slug, name, count: 1 });
        } else {
          catMap.get(slug)!.count += 1;
        }
      }
    });

    return Array.from(catMap.values());
  }, []);

  const dynamicLocations = useMemo(() => {
    const locSet = new Set<string>();
    dataStore.getActiveJobs().forEach((job) => {
      if (job.location) {
        locSet.add(job.location.trim());
      }
    });
    return Array.from(locSet);
  }, []);

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

  const pageContent = (
    <main className={`bg-[#F5F8FC] min-h-screen ${currentUser ? '' : 'py-8'}`}>
      <div className={`mx-auto ${currentUser ? 'w-full' : 'max-w-7xl px-4 sm:px-6 lg:px-8'}`}>
        {/* Hero Banner */}
        {/* Hero Banner or Category Header */}
        {(!categoryFilter || categoryFilter === "all") && !currentUser ? (
          <div className="relative p-10 sm:p-16 rounded-[2rem] text-white mb-10 shadow-2xl overflow-hidden bg-[#063B78]">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFC400]/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#FFC400] backdrop-blur-md mb-6 shadow-sm">
                <Briefcase className="size-4" />
                {t("jobs")}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-md">
                {t("jobsInRegion")} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC400] to-[#FDE047] filter drop-shadow-sm">{t("directCompanyContact")}</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-white/90 font-medium max-w-2xl text-center shadow-black/10">
                {t("jobsSubtext")}
              </p>

              {/* Inline Search Bar */}
              <div className="mt-10 w-full max-w-3xl grid sm:grid-cols-[1fr_0.8fr_auto] gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/20">
                <div className="relative flex items-center bg-white rounded-xl h-14 overflow-hidden">
                  <Search className="absolute left-4 size-5 text-[#5B6B7F]" />
                  <Input
                    placeholder={t("searchJobPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-full border-0 bg-transparent text-sm text-[#10233F] font-bold focus-visible:ring-0 rounded-none shadow-none"
                  />
                </div>
                <div className="relative flex items-center bg-white rounded-xl h-14 overflow-hidden">
                  <MapPin className="absolute left-4 size-5 text-[#125BB5]" />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full h-full border-0 bg-transparent text-sm font-bold text-[#10233F] pl-12 pr-10 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="all">{t("allLocations")}</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="pune">Pune</option>
                    <option value="chakan">Chakan</option>
                    <option value="bengaluru">Bengaluru</option>
                  </select>
                  <ChevronDown className="absolute right-4 size-5 text-[#5B6B7F] pointer-events-none" />
                </div>
                <Button className="btn-yellow h-14 font-black text-sm px-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  {t("search")}
                </Button>
              </div>
            </div>
          </div>
        ) : (!currentUser && categoryFilter && categoryFilter !== "all" ? (
          <div className="mb-10 bg-white p-6 sm:p-8 rounded-[2rem] border border-[#DCE5F0] shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5F8FC] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

            <div className="relative z-10 flex flex-col items-start gap-4">
              <button
                onClick={() => { setCategoryFilter("all"); setSubCategoryFilter("all"); }}
                className="px-4 py-2 rounded-full bg-[#F5F8FC] border border-[#DCE5F0] text-xs font-bold text-[#5B6B7F] flex items-center gap-2 hover:bg-[#10233F] hover:text-white transition-all shadow-sm group"
              >
                <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" /> {lang === "mr" ? "सर्व नोकऱ्या पहा" : "All Jobs"}
              </button>
              <div className="flex items-center gap-5">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-[#063B78] to-[#125BB5] flex items-center justify-center text-white shadow-lg shadow-[#063B78]/20">
                  <Briefcase className="size-7" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-[#082F63] capitalize tracking-tight">
                    {getCategoryTitle(categoryFilter, lang)}
                  </h1>
                  <p className="text-sm font-bold text-[#125BB5] mt-1.5 flex items-center gap-1.5">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {filteredJobs.length} {lang === "mr" ? "सक्रिय नोकऱ्या" : "Active Jobs"}
                  </p>
                </div>
              </div>
            </div>

            {/* Smaller Search Bar for Category Page */}
            <div className="w-full md:w-auto relative z-10">
              <div className="relative flex items-center w-full md:w-[320px] group">
                <Search className="absolute left-4 size-5 text-[#5B6B7F] group-focus-within:text-[#125BB5] transition-colors" />
                <Input
                  placeholder={lang === "mr" ? "नोकरी शोधा..." : "Search in category..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 border-2 border-[#DCE5F0] bg-[#F5F8FC] rounded-xl text-sm text-[#10233F] font-bold focus-visible:ring-0 focus-visible:border-[#125BB5] shadow-sm transition-all"
                />
              </div>
            </div>
          </div>
        ) : null)}

        {/* SECTION 1: Category Cards View (Displayed when no specific category card is clicked) */}
        {(!categoryFilter || categoryFilter === "all") ? (
          <div className="mb-10 w-full">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
              <div className="size-14 rounded-2xl bg-[#063B78] text-[#FFC400] flex items-center justify-center shadow-lg mb-3">
                <LayoutGrid className="size-7" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#10233F]">
                {lang === "mr" ? "मुख्य नोकरी श्रेणी (Main Job Categories)" : "Main Job Categories"}
              </h2>
              <p className="mt-2 text-sm font-bold text-[#5B6B7F]">
                {lang === "mr" ? "नोकऱ्या पाहण्यासाठी खालील कोणत्याही श्रेणी कार्डवर क्लिक करा" : "Select any category card to view jobs in that section"}
              </p>
            </div>

            {dynamicMainCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
                {/* Dynamic Main Category Cards */}
                {dynamicMainCategories.map(({ slug, name, count }) => {
                  let CategoryIcon = Briefcase;
                  const lc = name.toLowerCase();
                  if (lc.includes('construction') || lc.includes('builder') || lc.includes('civil')) CategoryIcon = HardHat;
                  else if (lc.includes('software') || lc.includes('it') || lc.includes('develop') || lc.includes('computer')) CategoryIcon = Laptop;
                  else if (lc.includes('engineer') || lc.includes('tech') || lc.includes('mechanic')) CategoryIcon = Wrench;
                  else if (lc.includes('health') || lc.includes('medic') || lc.includes('doctor') || lc.includes('nurse')) CategoryIcon = Stethoscope;
                  else if (lc.includes('financ') || lc.includes('account') || lc.includes('bank')) CategoryIcon = Landmark;
                  else if (lc.includes('sales') || lc.includes('market')) CategoryIcon = TrendingUp;
                  else if (lc.includes('educat') || lc.includes('teach') || lc.includes('school')) CategoryIcon = GraduationCap;
                  else if (lc.includes('manufact') || lc.includes('factory') || lc.includes('production') || lc.includes('industrial')) CategoryIcon = Factory;
                  else if (lc.includes('logistic') || lc.includes('transport') || lc.includes('driver') || lc.includes('delivery')) CategoryIcon = Truck;
                  else if (lc.includes('hotel') || lc.includes('restaurant') || lc.includes('hospitality')) CategoryIcon = Hotel;
                  else if (lc.includes('security') || lc.includes('guard')) CategoryIcon = ShieldCheck;

                  return (
                    <button
                      key={slug}
                      onClick={() => { setCategoryFilter(slug); setSubCategoryFilter("all"); }}
                      className="group p-6 rounded-3xl border border-[#DCE5F0] bg-white text-left transition-all duration-300 hover:border-[#063B78] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="size-14 rounded-2xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center group-hover:bg-[#063B78] group-hover:text-white transition-colors">
                          <CategoryIcon className="size-7" />
                        </div>
                        <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-[#EBF1F8] text-[#063B78] group-hover:bg-[#063B78] group-hover:text-white transition-colors">
                          {count} {lang === "mr" ? "नोकऱ्या" : "Jobs"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#10233F] group-hover:text-[#063B78] leading-tight">
                          {getCategoryTitle(name, lang) || name}
                        </h3>
                        <p className="text-xs font-bold text-[#5B6B7F] mt-2">
                          {lang === "mr" ? `${count} नोकरी जाहिराती उपलब्ध` : `${count} Active Listings`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="card-realjob p-12 text-center bg-white rounded-3xl border border-[#DCE5F0] max-w-xl mx-auto">
                <Briefcase className="mx-auto size-14 text-[#5B6B7F] mb-4" />
                <h3 className="text-xl font-black text-[#10233F]">कोणतीही नोकरी श्रेणी उपलब्ध नाही</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  अद्याप ॲडमिन कडून कोणतीही नोकरी पोस्ट केलेली नाही. ॲडमिन नोकरी पोस्ट करेल तेव्हा येथे श्रेणी दिसेल.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* SECTION 2: Jobs Listing inside selected category (Displayed ONLY when a category card is clicked) */
          <div className="w-full flex flex-col gap-6">
            {/* Selected Category Header */}
            <div className="bg-white p-6 rounded-3xl border border-[#DCE5F0] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider text-[#063B78] bg-[#EBF1F8] px-3 py-1 rounded-full border border-[#063B78]/10">
                    {lang === "mr" ? "निवडलेली श्रेणी" : "Selected Category"}
                  </span>
                  <span className="text-xs font-extrabold text-[#5B6B7F]">
                    • {filteredJobs.length} {lang === "mr" ? "नोकऱ्या उपलब्ध" : "Jobs Available"}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#10233F] mt-1.5 capitalize tracking-tight">
                  {getCategoryTitle(categoryFilter, lang) || categoryFilter}
                </h2>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => { setCategoryFilter("all"); setSubCategoryFilter("all"); }}
                  className="px-5 py-2.5 rounded-xl bg-[#063B78] text-white text-xs font-black hover:bg-[#082F63] transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                  {lang === "mr" ? "सर्व श्रेणी कडे जा (All Categories)" : "Back to All Categories"}
                </button>
              </div>
            </div>

            {/* Compact Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#DCE5F0] shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#063B78]/10 text-[#063B78] rounded-xl text-xs font-black mr-1">
                  <SlidersHorizontal className="size-3.5" />
                  <span>{t("filters")}</span>
                </div>

                {/* Experience Filter */}
                <div className="relative">
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="h-10 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] pl-3 pr-8 text-xs font-bold text-[#10233F] focus:border-[#063B78] appearance-none cursor-pointer"
                  >
                    <option value="all">🎓 {lang === "mr" ? "अनुभव (सर्व)" : "Experience: All"}</option>
                    <option value="Fresher">Fresher / फ्रेसर</option>
                    <option value="1-3">1-3 {lang === "mr" ? "वर्षे" : "Years"}</option>
                    <option value="3-5">3-5 {lang === "mr" ? "वर्षे" : "Years"}</option>
                    <option value="5+">5+ {lang === "mr" ? "वर्षे" : "Years"}</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#5B6B7F] pointer-events-none" />
                </div>

                {/* Salary Filter */}
                <div className="relative">
                  <select
                    value={salaryFilter}
                    onChange={(e) => setSalaryFilter(e.target.value)}
                    className="h-10 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] pl-3 pr-8 text-xs font-bold text-[#10233F] focus:border-[#063B78] appearance-none cursor-pointer"
                  >
                    <option value="all">💰 {lang === "mr" ? "पगार (सर्व)" : "Salary: All"}</option>
                    <option value="10000">₹10,000+ / mo</option>
                    <option value="15000">₹15,000+ / mo</option>
                    <option value="20000">₹20,000+ / mo</option>
                    <option value="25000">₹25,000+ / mo</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#5B6B7F] pointer-events-none" />
                </div>

                {/* Job Type Filter */}
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-10 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] pl-3 pr-8 text-xs font-bold text-[#10233F] focus:border-[#063B78] appearance-none cursor-pointer"
                  >
                    <option value="all">💼 {t("allTypes")}</option>
                    <option value="Full Time">{t("fullTime")}</option>
                    <option value="Part Time">{t("partTime")}</option>
                    <option value="Contract">{t("contract")}</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#5B6B7F] pointer-events-none" />
                </div>

                {/* Work Mode Filter */}
                <div className="relative">
                  <select
                    value={workModeFilter}
                    onChange={(e) => setWorkModeFilter(e.target.value)}
                    className="h-10 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] pl-3 pr-8 text-xs font-bold text-[#10233F] focus:border-[#063B78] appearance-none cursor-pointer"
                  >
                    <option value="all">🏢 {lang === "mr" ? "मोड (सर्व)" : "Mode: All"}</option>
                    <option value="Work From Home">🏠 WFH / Remote</option>
                    <option value="On-site">🏢 On-site</option>
                    <option value="Hybrid">🔄 Hybrid</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#5B6B7F] pointer-events-none" />
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="h-10 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] pl-3 pr-8 text-xs font-bold text-[#10233F] focus:border-[#063B78] appearance-none cursor-pointer"
                  >
                    <option value="all">📍 {t("allLocations")}</option>
                    {dynamicLocations.map((loc) => (
                      <option key={loc} value={loc.toLowerCase()}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#5B6B7F] pointer-events-none" />
                </div>

                {/* Reset Button */}
                {(experienceFilter !== "all" || salaryFilter !== "all" || typeFilter !== "all" || workModeFilter !== "all" || locationFilter !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="h-10 px-3.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                    {t("reset")}
                  </button>
                )}
              </div>

              {/* Total Count & Sort By */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-extrabold text-[#10233F] flex items-center gap-1.5">
                  <List className="size-3.5 text-[#063B78]" />
                  {t("totalJobsCount")}: <span className="text-[#063B78] font-black text-sm">{n(filteredJobs.length)}</span>
                </span>

                <div className="flex items-center gap-1.5 bg-[#F5F8FC] rounded-xl p-1 border border-[#DCE5F0]/50">
                  <span className="text-xs font-bold text-[#5B6B7F] pl-2">{t("sortByLabel")}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-8 rounded-lg border-none bg-white shadow-xs px-2.5 text-xs font-bold text-[#10233F] focus:ring-0 appearance-none cursor-pointer"
                  >
                    <option value="newest">{t("newestFirst")}</option>
                    <option value="title">{t("byTitle")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Job Cards Display */}
            {filteredJobs.length > 0 ? (
              <div className={`grid grid-cols-1 ${filteredJobs.length === 1 ? "" : "xl:grid-cols-2"} gap-6`}>
                {filteredJobs.map((job: Job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="card-realjob p-12 text-center bg-white rounded-3xl border border-[#DCE5F0]">
                <Briefcase className="mx-auto size-14 text-[#5B6B7F] mb-4" />
                <h3 className="text-xl font-black text-[#10233F]">या श्रेणीमध्ये कोणतीही नोकरी उपलब्ध नाही (No Jobs Found in this Category)</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  या श्रेणीमध्ये अद्याप कोणतीही नवीन नोकरी पोस्ट केलेली नाही. ॲडमिन ने नवीन नोकरी पोस्ट केल्यावर ती येथे दिसेल.
                </p>
                <Button onClick={() => { setCategoryFilter("all"); setSubCategoryFilter("all"); }} className="mt-5 btn-yellow text-xs font-bold px-6">
                  {lang === "mr" ? "सर्व श्रेणी कडे जा (Back to Categories)" : "Back to Categories"}
                </Button>
              </div>
            )}
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
  );

  if (currentUser) {
    return (
      <UserSidebarLayout activeTab="find-jobs">
        {pageContent}
      </UserSidebarLayout>
    );
  }

  return (
    <>
      <PublicHeader />
      {pageContent}
      <PublicFooter />
    </>
  );
}
