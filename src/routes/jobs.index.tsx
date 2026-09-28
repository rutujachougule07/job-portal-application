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
import { JobCard, jobs, Job } from "@/components/portal/JobCard";
import { JobCardImage } from "@/components/portal/JobCardImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n, getCategoryTitle, getCategoryDesc } from "@/lib/i18n";

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

  const subCategoryMap: Record<string, {id: string, label: string}[]> = {
    "construction": [
      { id: "Civil Engineer", label: "Civil Engineer" },
      { id: "Site Engineer", label: "Site Engineer" },
      { id: "Architect", label: "Architect" },
      { id: "Site Supervisor", label: "Site Supervisor" },
      { id: "Quantity Surveyor", label: "Quantity Surveyor" },
      { id: "Project Manager", label: "Project Manager" },
      { id: "Safety Officer", label: "Safety Officer" }
    ],
    "it-software": [
      { id: "Software Developer", label: "Software Developer" },
      { id: "Web Developer", label: "Web Developer" },
      { id: "Full Stack Developer", label: "Full Stack Developer" },
      { id: "Frontend Developer", label: "Frontend Developer" },
      { id: "Backend Developer", label: "Backend Developer" },
      { id: "UI/UX Designer", label: "UI/UX Designer" },
      { id: "DevOps Engineer", label: "DevOps Engineer" },
      { id: "Data Analyst", label: "Data Analyst" },
      { id: "Cyber Security", label: "Cyber Security" }
    ],
    "engineering": [
      { id: "Mechanical Engineer", label: "Mechanical Engineer" },
      { id: "Electrical Engineer", label: "Electrical Engineer" },
      { id: "Civil Engineer", label: "Civil Engineer" },
      { id: "Electronics Engineer", label: "Electronics Engineer" },
      { id: "Production Engineer", label: "Production Engineer" },
      { id: "Automobile Engineer", label: "Automobile Engineer" },
      { id: "Quality Engineer", label: "Quality Engineer" }
    ],
    "healthcare-medical": [
      { id: "Doctor", label: "Doctor" },
      { id: "Nurse", label: "Nurse" },
      { id: "Pharmacist", label: "Pharmacist" },
      { id: "Lab Technician", label: "Lab Technician" },
      { id: "Medical Assistant", label: "Medical Assistant" },
      { id: "Hospital Administration", label: "Hospital Administration" }
    ],
    "finance-accounting": [
      { id: "Accountant", label: "Accountant" },
      { id: "Finance Executive", label: "Finance Executive" },
      { id: "Banking", label: "Banking" },
      { id: "Auditor", label: "Auditor" },
      { id: "Tax Consultant", label: "Tax Consultant" },
      { id: "Financial Analyst", label: "Financial Analyst" }
    ],
    "sales-marketing": [
      { id: "Sales Executive", label: "Sales Executive" },
      { id: "Business Development", label: "Business Development" },
      { id: "Digital Marketing", label: "Digital Marketing" },
      { id: "Marketing Executive", label: "Marketing Executive" },
      { id: "Sales Manager", label: "Sales Manager" },
      { id: "Telecaller", label: "Telecaller" }
    ],
    "education": [
      { id: "Teacher", label: "Teacher" },
      { id: "Professor", label: "Professor" },
      { id: "Lecturer", label: "Lecturer" },
      { id: "Tutor", label: "Tutor" },
      { id: "Academic Coordinator", label: "Academic Coordinator" },
      { id: "School Administrator", label: "School Administrator" }
    ],
    "manufacturing": [
      { id: "Production", label: "Production" },
      { id: "Quality Control", label: "Quality Control" },
      { id: "Machine Operator", label: "Machine Operator" },
      { id: "Maintenance Engineer", label: "Maintenance Engineer" },
      { id: "Production Manager", label: "Production Manager" }
    ],
    "hr-recruitment": [
      { id: "HR Executive", label: "HR Executive" },
      { id: "HR Manager", label: "HR Manager" },
      { id: "Recruiter", label: "Recruiter" },
      { id: "Talent Acquisition", label: "Talent Acquisition" },
      { id: "Payroll Executive", label: "Payroll Executive" }
    ],
    "hospitality-tourism": [
      { id: "Hotel Management", label: "Hotel Management" },
      { id: "Chef", label: "Chef" },
      { id: "Front Office", label: "Front Office" },
      { id: "Housekeeping", label: "Housekeeping" },
      { id: "Travel Executive", label: "Travel Executive" }
    ],
    "logistics-transport": [
      { id: "Logistics Executive", label: "Logistics Executive" },
      { id: "Warehouse Manager", label: "Warehouse Manager" },
      { id: "Delivery Executive", label: "Delivery Executive" },
      { id: "Supply Chain", label: "Supply Chain" },
      { id: "Transport Manager", label: "Transport Manager" }
    ],
    "government-public": [
      { id: "Government Jobs", label: "Government Jobs" },
      { id: "PSU Jobs", label: "PSU Jobs" },
      { id: "Administrative Jobs", label: "Administrative Jobs" },
      { id: "Public Services", label: "Public Services" }
    ],
    "legal": [
      { id: "Lawyer", label: "Lawyer" },
      { id: "Legal Advisor", label: "Legal Advisor" },
      { id: "Legal Executive", label: "Legal Executive" },
      { id: "Compliance Officer", label: "Compliance Officer" }
    ],
    "architecture-design": [
      { id: "Architect", label: "Architect" },
      { id: "Interior Designer", label: "Interior Designer" },
      { id: "3D Visualizer", label: "3D Visualizer" },
      { id: "CAD Designer", label: "CAD Designer" }
    ],
    "retail-ecommerce": [
      { id: "Store Manager", label: "Store Manager" },
      { id: "Retail Executive", label: "Retail Executive" },
      { id: "E-commerce Executive", label: "E-commerce Executive" },
      { id: "Customer Service", label: "Customer Service" }
    ],
    "customer-service-bpo": [
      { id: "Customer Support", label: "Customer Support" },
      { id: "Call Center", label: "Call Center" },
      { id: "BPO Executive", label: "BPO Executive" },
      { id: "Technical Support", label: "Technical Support" }
    ],
    "design-creative": [
      { id: "Graphic Designer", label: "Graphic Designer" },
      { id: "UI/UX Designer", label: "UI/UX Designer" },
      { id: "Video Editor", label: "Video Editor" },
      { id: "Content Creator", label: "Content Creator" },
      { id: "Photographer", label: "Photographer" }
    ],
    "media-communication": [
      { id: "Content Writer", label: "Content Writer" },
      { id: "Journalist", label: "Journalist" },
      { id: "Social Media Manager", label: "Social Media Manager" },
      { id: "PR Executive", label: "PR Executive" }
    ],
    "agriculture-farming": [
      { id: "Agricultural Engineer", label: "Agricultural Engineer" },
      { id: "Farm Manager", label: "Farm Manager" },
      { id: "Agronomist", label: "Agronomist" },
      { id: "Agriculture Officer", label: "Agriculture Officer" }
    ],
    "science-research": [
      { id: "Research Scientist", label: "Research Scientist" },
      { id: "Laboratory Researcher", label: "Laboratory Researcher" },
      { id: "Biotechnologist", label: "Biotechnologist" },
      { id: "Research Assistant", label: "Research Assistant" }
    ]
  };

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
    return jobs.filter((job) => {
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
        
        // Handle matching against main category or subcategories
        const subCats = subCategoryMap[normalizedFilter] || [];
        const isMainCategoryMatch = job.category?.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === normalizedFilter;
        const isSubCategoryMatch = subCats.some(sub => sub.id === job.category);

        if (isMainCategoryMatch || isSubCategoryMatch) {
          if (subCategoryFilter === "all") {
            matchesCategory = true;
          } else {
            matchesCategory = job.category === subCategoryFilter;
          }
        }
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
                  {subCategoryMap[categoryFilter] && (
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
                      {subCategoryMap[categoryFilter].map(sub => (
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
              {categoryFilter === "all" || !categoryFilter ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { key: 'construction', Icon: HardHat, jobsCount: "1,950" },
                    { key: 'it-software', Icon: Laptop, jobsCount: "3,420" },
                    { key: 'engineering', Icon: Wrench, jobsCount: "2,840" },
                    { key: 'healthcare-medical', Icon: Stethoscope, jobsCount: "1,680" },
                    { key: 'finance-accounting', Icon: Landmark, jobsCount: "2,110" },
                    { key: 'sales-marketing', Icon: TrendingUp, jobsCount: "4,150" },
                    { key: 'education', Icon: GraduationCap, jobsCount: "1,450" },
                    { key: 'manufacturing', Icon: Factory, jobsCount: "3,890" },
                    { key: 'hr-recruitment', Icon: UserPlus, jobsCount: "1,220" },
                    { key: 'hospitality-tourism', Icon: Hotel, jobsCount: "1,530" },
                    { key: 'logistics-transport', Icon: Truck, jobsCount: "2,760" },
                    { key: 'government-public', Icon: Building2, jobsCount: "980" },
                    { key: 'legal', Icon: Scale, jobsCount: "640" },
                    { key: 'architecture-design', Icon: Compass, jobsCount: "890" },
                    { key: 'retail-ecommerce', Icon: ShoppingBag, jobsCount: "2,350" },
                    { key: 'customer-service-bpo', Icon: Headphones, jobsCount: "3,100" },
                    { key: 'design-creative', Icon: Palette, jobsCount: "1,140" },
                    { key: 'media-communication', Icon: Radio, jobsCount: "780" },
                    { key: 'agriculture-farming', Icon: Sprout, jobsCount: "1,050" },
                    { key: 'science-research', Icon: FlaskConical, jobsCount: "740" }
                  ].map((cat) => {
                    const categoryTitle = getCategoryTitle(cat.key, lang);
                    const categoryDesc = getCategoryDesc(cat.key, lang);
                    return (
                      <div
                        key={cat.key}
                        onClick={() => {
                          setCategoryFilter(cat.key);
                          setSubCategoryFilter("all");
                        }}
                        className="group card-realjob p-6 flex flex-col justify-between cursor-pointer hover:border-[#063B78] hover:shadow-lg transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="size-12 rounded-xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center group-hover:bg-[#FFC400] group-hover:text-[#082F63] transition-colors">
                              <cat.Icon className="size-6" />
                            </div>
                            <span className="text-xs font-black bg-[#EBF1F8] text-[#063B78] px-2.5 py-1 rounded-full group-hover:bg-[#063B78] group-hover:text-white transition-colors">
                              {cat.jobsCount} {t("jobsCountText")}
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-[#10233F] group-hover:text-[#063B78] transition-colors">
                            {categoryTitle}
                          </h3>
                          <p className="mt-2 text-xs font-semibold text-[#5B6B7F] line-clamp-2">
                            {categoryDesc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#DCE5F0] flex items-center justify-between text-xs font-bold text-[#063B78] group-hover:text-[#125BB5]">
                          <span>{t("browseJobs")}</span>
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  {/* Jobs List */}
                  {filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {filteredJobs.map((job: Job) => (
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
                </>
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
