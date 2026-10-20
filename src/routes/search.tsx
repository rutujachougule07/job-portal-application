import { useState, useEffect, useMemo, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  Search,
  X,
  Mic,
  MicOff,
  Globe,
  Briefcase,
  Users,
  LayoutGrid,
  HelpCircle,
  FileText,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Clock,
  Building2,
  Award,
  ArrowRight,
} from "lucide-react";
import { jobs } from "@/components/portal/JobCard";
import { dataStore } from "@/lib/data-store";
import { PublicFooter } from "@/components/portal/PublicFooter";

const searchParamsSchema = z.object({
  q: z.string().optional().catch(""),
  tab: z.enum(["all", "jobs", "workers", "categories", "faq", "pages"]).optional().catch("all"),
});

export const Route = createFileRoute("/search")({
  validateSearch: (s) => searchParamsSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Search REAL JOB — Jobs, Workers & Services" },
      {
        name: "description",
        content: "Search verified factory jobs, skilled workers, company listings and workforce services across India on REAL JOB.",
      },
      { property: "og:title", content: "Search REAL JOB — Jobs, Workers & Services" },
      { property: "og:description", content: "Search verified factory jobs, skilled workers, company listings and workforce services on REAL JOB." },
      { property: "og:url", content: "https://realjob.online/search" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "canonical", href: "https://realjob.online/search" },
    ],
  }),
  component: GoogleSearchPage,
});

// Comprehensive Searchable Index
interface SearchResultItem {
  id: string;
  type: "page" | "job" | "worker" | "category" | "faq";
  title: string;
  url: string;
  breadcrumb: string;
  snippet: string;
  tags?: string[];
  sitelinks?: Array<{ title: string; url: string; desc: string }>;
  badge?: string;
  extraMeta?: string;
}

const STATIC_PAGES: SearchResultItem[] = [
  {
    id: "page-home",
    type: "page",
    title: "REAL JOB — India's Trusted Blue-Collar & Industrial Job Portal",
    url: "/",
    breadcrumb: "https://realjob.online",
    snippet:
      "Right Person • Right Job • Right Opportunity. REAL JOB connects verified blue-collar, ITI, factory workers and technicians with industrial employers across Maharashtra and India.",
    tags: ["real job", "realjob", "expertskill", "home", "portal", "jobs in pune", "factory jobs", "hiring"],
    sitelinks: [
      { title: "Find Jobs", url: "/jobs", desc: "Browse open industrial, factory, driver and technician vacancies." },
      { title: "Worker Directory", url: "/workers", desc: "Search thousands of verified skilled and helper candidate profiles." },
      { title: "About Us", url: "/about", desc: "Learn about REAL JOB's mission, staffing solutions and workforce platform." },
      { title: "Contact Support", url: "/contact", desc: "Get in touch with customer support via toll-free number or email." },
      { title: "FAQ & Help", url: "/faq", desc: "Frequently asked questions for job seekers and factory employers." },
      { title: "Employer Login", url: "/auth?role=employer&mode=login", desc: "Sign in to manage company attendance, payroll and job postings." },
    ],
  },
  {
    id: "page-jobs",
    type: "page",
    title: "Find Jobs — Factory, Driver, ITI, Welder & Operator Openings",
    url: "/jobs",
    breadcrumb: "https://realjob.online › jobs",
    snippet:
      "Search active verified job openings in Chakan, Bhosari, Talegaon, Ranjangaon, Pune and across India. Compare salaries, shift timings and employer benefits.",
    tags: ["jobs", "vacancies", "openings", "recruitment", "chakan", "pune", "iti", "welder", "cnc", "operator"],
  },
  {
    id: "page-workers",
    type: "page",
    title: "Verified Workers Directory — Hire Skilled Labour & Factory Staff",
    url: "/workers",
    breadcrumb: "https://realjob.online › workers",
    snippet:
      "Browse certified candidates across mechanical, electrical, fitting, driving, warehouse and construction trades. View verified experience and contact details.",
    tags: ["workers", "candidates", "staff", "technicians", "fitters", "electricians", "labour", "hire"],
  },
  {
    id: "page-categories",
    type: "page",
    title: "Job Categories & Industry Sectors — REAL JOB",
    url: "/categories",
    breadcrumb: "https://realjob.online › categories",
    snippet:
      "Explore 12+ industry categories including Manufacturing, CNC/VMC Machining, Automobile, Welding, Construction, Logistics, Housekeeping and Security.",
    tags: ["categories", "sectors", "industries", "manufacturing", "automotive", "construction", "logistics"],
  },
  {
    id: "page-about",
    type: "page",
    title: "About REAL JOB (Expertskill Technology) — Mission & Overview",
    url: "/about",
    breadcrumb: "https://realjob.online › about",
    snippet:
      "REAL JOB is an innovative recruitment and workforce management solution by Expertskill Technology, empowering over 50,000 workers and 10,000 employers with digital attendance and salary tracking.",
    tags: ["about", "company", "expertskill", "team", "mission", "workforce", "technology"],
  },
  {
    id: "page-contact",
    type: "page",
    title: "Contact Us — REAL JOB Support & Helpdesk",
    url: "/contact",
    breadcrumb: "https://realjob.online › contact",
    snippet:
      "Reach out to REAL JOB customer support. Call 9964216090 or toll-free 1800 200 3040. Email: realjobandhiring@realjob.online / support@realjob.in. Pune, Maharashtra.",
    tags: ["contact", "support", "phone", "email", "helpline", "toll free", "pune", "address"],
  },
  {
    id: "page-faq",
    type: "page",
    title: "Frequently Asked Questions (FAQ) — REAL JOB Help Center",
    url: "/faq",
    breadcrumb: "https://realjob.online › faq",
    snippet:
      "Find quick answers on candidate registration, job application process, employer verification, automated attendance punch, overtime calculation and E-Salary slips.",
    tags: ["faq", "help", "questions", "answers", "how to apply", "salary slip", "attendance"],
  },
  {
    id: "page-post-job",
    type: "page",
    title: "Post a Job — Hire Qualified Industrial Workers Fast",
    url: "/auth?role=employer&mode=register",
    breadcrumb: "https://realjob.online › post-job",
    snippet:
      "Create an employer account to post job openings, receive verified candidate applications and manage your factory workforce with automated attendance tools.",
    tags: ["post job", "hire", "employer", "registration", "staffing"],
  },
];

const STATIC_FAQS: SearchResultItem[] = [
  {
    id: "faq-1",
    type: "faq",
    title: "How do workers apply for jobs on REAL JOB?",
    url: "/faq#apply",
    breadcrumb: "https://realjob.online › faq › worker-application",
    snippet:
      "Workers can register with their mobile number, complete their profile with skill details, and click 'Apply Now' on any active job listing. No fees are charged to workers.",
    tags: ["apply", "worker", "registration", "process", "free"],
  },
  {
    id: "faq-2",
    type: "faq",
    title: "Is REAL JOB worker registration free?",
    url: "/faq#free",
    breadcrumb: "https://realjob.online › faq › free-registration",
    snippet:
      "Yes! Candidate registration and job applications on REAL JOB are 100% free for all job seekers and technicians. There are no hidden fees.",
    tags: ["free", "cost", "fees", "registration"],
  },
  {
    id: "faq-3",
    type: "faq",
    title: "How do employers track employee attendance and overtime?",
    url: "/faq#attendance",
    breadcrumb: "https://realjob.online › faq › attendance-overtime",
    snippet:
      "Employers can use the built-in Admin Calendar to log Present, Half-Day, Absent, and Overtime hours with automatic rate calculation and monthly salary generation.",
    tags: ["attendance", "overtime", "ot", "calendar", "employer", "salary slip"],
  },
  {
    id: "faq-4",
    type: "faq",
    title: "What is E-Salary Slip generator?",
    url: "/faq#salary",
    breadcrumb: "https://realjob.online › faq › e-salary-slip",
    snippet:
      "The E-Salary system automatically compiles daily attendance, overtime hours, advances, and deductions to generate professional, downloadable PDF salary slips.",
    tags: ["salary slip", "e-salary", "payslip", "pdf", "deductions"],
  },
];

function GoogleSearchPage() {
  const { q = "", tab = "all" } = Route.useSearch();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState(q);
  const [activeTab, setActiveTab] = useState(tab);
  const [isListening, setIsListening] = useState(false);
  const [searchTime, setSearchTime] = useState<number>(0.05);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state if url param changes
  useEffect(() => {
    setInputVal(q);
    const trimmed = q?.trim();
    document.title = trimmed
      ? `${trimmed} - Google Search Results | REAL JOB`
      : "Search REAL JOB — Jobs, Workers & Services";
  }, [q]);

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  // Voice Search Handler (Web Speech API)
  const handleVoiceSearch = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported on this browser. Please type your query.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInputVal(transcript);
          triggerSearch(transcript, activeTab);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const triggerSearch = (query: string, tabValue = activeTab) => {
    const trimmed = query.trim();
    navigate({
      to: "/search",
      search: {
        q: trimmed,
        tab: tabValue,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(inputVal, activeTab);
  };

  const handleTabClick = (newTab: "all" | "jobs" | "workers" | "categories" | "faq" | "pages") => {
    setActiveTab(newTab);
    navigate({
      to: "/search",
      search: {
        q: inputVal.trim(),
        tab: newTab,
      },
    });
  };

  const handleClear = () => {
    setInputVal("");
    searchInputRef.current?.focus();
  };

  // Compile full search results from data sources
  const allResults = useMemo(() => {
    const items: SearchResultItem[] = [...STATIC_PAGES];

    // 1. Add Jobs
    try {
      const liveJobs = dataStore.getAllJobs?.() || [];
      const combinedJobs = [...jobs, ...liveJobs];
      const seenJobIds = new Set<string>();

      combinedJobs.forEach((job) => {
        if (!job.id || seenJobIds.has(job.id)) return;
        seenJobIds.add(job.id);

        const jobType = ("jobType" in job ? job.jobType : (job as any).type) || "Full Time";

        items.push({
          id: `job-${job.id}`,
          type: "job",
          title: `${job.title} — ${job.company}`,
          url: `/jobs/${job.id}`,
          breadcrumb: `https://realjob.online › jobs › ${job.id}`,
          snippet: `Location: ${job.location || "Pune, Maharashtra"} | Salary: ${job.salary || "Best in Industry"} | Experience: ${job.experience || "Freshers / Experienced"} | Job Type: ${jobType}. Urgent opening for ${job.title} at ${job.company}.`,
          tags: [
            job.title,
            job.company,
            job.location,
            job.category,
            jobType,
            "job",
            "vacancy",
            "opening",
            "salary",
          ],
          badge: jobType,
          extraMeta: `${job.salary} • ${job.location}`,
        });
      });
    } catch {}

    // 2. Add Workers
    try {
      const workers = dataStore.getAllEmployerWorkers?.() || [];
      workers.slice(0, 30).forEach((w: any) => {
        items.push({
          id: `worker-${w.id}`,
          type: "worker",
          title: `${w.name} — ${w.trade || w.category || "Skilled Technician"}`,
          url: `/workers`,
          breadcrumb: `https://realjob.online › workers › ${w.id}`,
          snippet: `Trade: ${w.trade || w.category || "General Industrial"} | City: ${w.city || w.location || "Pune, Maharashtra"} | Status: Available | Verified candidate profile on REAL JOB platform.`,
          tags: [w.name, w.trade, w.category, w.city, w.location, "worker", "candidate", "technician"],
          badge: "Verified Candidate",
        });
      });
    } catch {}

    // 3. Add FAQs
    items.push(...STATIC_FAQS);

    return items;
  }, []);

  // Filtered & Ranked Results
  const filteredResults = useMemo(() => {
    const startTime = performance.now();
    const query = q.trim().toLowerCase();

    let list = allResults;

    // Apply tab filter
    if (activeTab === "jobs") {
      list = list.filter((item) => item.type === "job");
    } else if (activeTab === "workers") {
      list = list.filter((item) => item.type === "worker");
    } else if (activeTab === "faq") {
      list = list.filter((item) => item.type === "faq");
    } else if (activeTab === "pages") {
      list = list.filter((item) => item.type === "page");
    }

    if (!query) {
      // Default results: Show core site pages & top featured jobs
      setSearchTime(0.04);
      return list.slice(0, 15);
    }

    const words = query.split(/\s+/).filter(Boolean);

    // Score-based search
    const scored = list
      .map((item) => {
        let score = 0;
        const lowerTitle = item.title.toLowerCase();
        const lowerSnippet = item.snippet.toLowerCase();
        const lowerTags = (item.tags || []).join(" ").toLowerCase();

        // Exact match
        if (lowerTitle.includes(query)) score += 20;
        if (lowerTags.includes(query)) score += 15;
        if (lowerSnippet.includes(query)) score += 10;

        // Individual word matches
        words.forEach((w) => {
          if (lowerTitle.includes(w)) score += 8;
          if (lowerTags.includes(w)) score += 5;
          if (lowerSnippet.includes(w)) score += 3;
        });

        // Boost for official domain/brand query
        if (query.includes("real") || query.includes("job") || query.includes("expertskill")) {
          if (item.id === "page-home") score += 30;
          if (item.id === "page-about") score += 15;
        }

        return { item, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);

    const endTime = performance.now();
    setSearchTime(Math.max(0.02, Number(((endTime - startTime) / 1000).toFixed(2))));

    return scored;
  }, [allResults, q, activeTab]);

  // Determine if right-side Knowledge Panel should be highlighted
  const isBrandQuery = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return true; // Show knowledge graph by default on search landing
    return (
      query.includes("real") ||
      query.includes("job") ||
      query.includes("portal") ||
      query.includes("expertskill") ||
      query.includes("company") ||
      query.includes("organization") ||
      query.includes("online") ||
      query.includes("website") ||
      query.includes("contact")
    );
  }, [q]);

  return (
    <div className="min-h-screen bg-white text-[#202124] flex flex-col font-sans">
      {/* ── TOP SEARCH HEADER (Google Inspired) ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#dadce0] px-4 sm:px-8 pt-3 pb-0 shadow-2xs">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand Logo & Search Input Container */}
          <div className="flex items-center gap-4 sm:gap-6 w-full md:max-w-3xl">
            {/* Logo */}
            <Link to="/" className="shrink-0 group" title="REAL JOB Home">
              <img
                src="/logo.png"
                alt="REAL JOB"
                className="h-7 sm:h-9 object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Google-Style Pill Search Box */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex items-center bg-white rounded-full border border-[#dfe1e5] hover:border-transparent hover:shadow-md focus-within:shadow-md focus-within:border-transparent transition-all px-3 sm:px-4 py-2 sm:py-2.5 max-w-2xl"
            >
              <Search className="size-4 text-[#9aa0a6] shrink-0 mr-2.5" />

              <input
                ref={searchInputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search REAL JOB, jobs, workers, or keywords..."
                className="w-full text-sm sm:text-base text-[#202124] bg-transparent outline-none placeholder:text-[#80868b]"
              />

              {inputVal && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-[#70757a] hover:text-[#202124] transition-colors shrink-0 mr-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}

              <span className="h-4 w-px bg-[#dadce0] mx-1.5 hidden sm:inline-block" />

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-1.5 rounded-full transition-colors shrink-0 cursor-pointer ${
                  isListening ? "text-red-600 bg-red-50 animate-pulse" : "text-[#4285f4] hover:bg-slate-100"
                }`}
                title={isListening ? "Listening..." : "Search by voice"}
              >
                {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>

              <button
                type="submit"
                className="ml-2 px-3 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-full text-xs font-bold transition-colors cursor-pointer hidden sm:flex items-center gap-1 shadow-2xs"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Header Nav Links */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-[#5f6368]">
            <Link to="/jobs" className="hover:text-[#1a73e8] hover:underline">
              Find Jobs
            </Link>
            <Link to="/workers" className="hover:text-[#1a73e8] hover:underline">
              Workers
            </Link>
            <Link to="/about" className="hover:text-[#1a73e8] hover:underline">
              About
            </Link>
            <Link to="/contact" className="hover:text-[#1a73e8] hover:underline">
              Contact
            </Link>
            <Link
              to="/auth"
              className="px-3.5 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold transition-all shadow-xs"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* ── GOOGLE-STYLE NAVIGATION TABS ── */}
        <div className="max-w-[1280px] mx-auto mt-2 sm:mt-3 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar border-t border-transparent">
          {[
            { id: "all", label: "All", icon: Search },
            { id: "jobs", label: "Jobs", icon: Briefcase },
            { id: "workers", label: "Candidates / Workers", icon: Users },
            { id: "categories", label: "Categories", icon: LayoutGrid },
            { id: "faq", label: "FAQ & Help", icon: HelpCircle },
            { id: "pages", label: "Website Pages", icon: FileText },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabClick(t.id as any)}
                className={`flex items-center gap-1.5 py-2.5 px-2 text-xs sm:text-[13px] font-medium border-b-[3px] transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-[#1a73e8] text-[#1a73e8] font-semibold"
                    : "border-transparent text-[#5f6368] hover:text-[#202124]"
                }`}
              >
                <Icon className="size-3.5 sm:size-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── SEARCH STATS BAR ── */}
      <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-8 py-2.5 text-xs text-[#70757a]">
        {q ? (
          <span>
            About {filteredResults.length} results ({searchTime} seconds) for{" "}
            <strong className="text-[#202124]">"{q}"</strong>
          </span>
        ) : (
          <span>Showing all available website pages, jobs, and candidate categories</span>
        )}
      </div>

      {/* ── MAIN RESULTS & KNOWLEDGE PANEL LAYOUT ── */}
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Search Results (Google Style) */}
          <section className="lg:col-span-7 xl:col-span-8 space-y-7">
            {filteredResults.length > 0 ? (
              filteredResults.map((item) => (
                <article key={item.id} className="group max-w-2xl">
                  {/* Google Breadcrumb / Domain Row */}
                  <div className="flex items-center gap-2 text-xs text-[#202124] mb-1">
                    <div className="size-6 rounded-full bg-[#f1f3f4] border border-[#dadce0] flex items-center justify-center shrink-0 overflow-hidden">
                      {item.type === "job" ? (
                        <Briefcase className="size-3 text-[#1a73e8]" />
                      ) : item.type === "worker" ? (
                        <Users className="size-3 text-emerald-600" />
                      ) : item.type === "faq" ? (
                        <HelpCircle className="size-3 text-amber-600" />
                      ) : (
                        <img src="/logo_icon.png" alt="" className="size-3.5 object-contain" />
                      )}
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="font-medium text-[#202124] text-[11px] sm:text-xs">
                        {item.type === "job"
                          ? "REAL JOB Vacancy"
                          : item.type === "worker"
                          ? "REAL JOB Candidate"
                          : item.type === "faq"
                          ? "REAL JOB FAQ"
                          : "REAL JOB Official"}
                      </span>
                      <span className="text-[11px] text-[#4d5156] truncate max-w-md">
                        {item.breadcrumb}
                      </span>
                    </div>
                  </div>

                  {/* Title Link */}
                  <h2 className="text-lg sm:text-xl font-normal leading-snug">
                    <Link
                      to={item.url as any}
                      className="text-[#1a0dab] visited:text-[#609] hover:underline cursor-pointer block"
                    >
                      {item.title}
                    </Link>
                  </h2>

                  {/* Snippet / Description */}
                  <p className="mt-1 text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                    {item.extraMeta && (
                      <span className="font-semibold text-slate-700 mr-1.5">{item.extraMeta} —</span>
                    )}
                    {item.snippet}
                  </p>

                  {/* Google-style Sitelinks (for homepage/brand results) */}
                  {item.sitelinks && item.sitelinks.length > 0 && (
                    <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3 border-l-2 border-[#1a73e8]/20 bg-slate-50/50 p-2.5 rounded-r-xl">
                      {item.sitelinks.map((sl) => (
                        <div key={sl.url} className="space-y-0.5">
                          <Link
                            to={sl.url as any}
                            className="text-sm font-medium text-[#1a0dab] hover:underline block"
                          >
                            {sl.title}
                          </Link>
                          <p className="text-xs text-[#5f6368] line-clamp-1">{sl.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1a73e8] border border-blue-100">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </article>
              ))
            ) : (
              /* EMPTY STATE (Google Style) */
              <div className="py-12 max-w-xl text-[#202124]">
                <p className="text-base sm:text-lg mb-3">
                  Your search - <strong className="text-black">"{q}"</strong> - did not match any documents.
                </p>
                <div className="space-y-2 text-sm text-[#4d5156]">
                  <p className="font-semibold text-[#202124]">Suggestions:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Make sure all words are spelled correctly.</li>
                    <li>Try different or broader keywords (e.g. <em>"Welder", "Pune", "Jobs", "Salary"</em>).</li>
                    <li>Try fewer keywords.</li>
                    <li>
                      Or browse all available{" "}
                      <Link to="/jobs" className="text-[#1a73e8] hover:underline">
                        active job openings
                      </Link>{" "}
                      or{" "}
                      <Link to="/workers" className="text-[#1a73e8] hover:underline">
                        candidate directory
                      </Link>
                      .
                    </li>
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["CNC Operator", "Welder", "Pune", "Electrician", "Driver", "Salary Slip", "Attendance"].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setInputVal(tag);
                          triggerSearch(tag, activeTab);
                        }}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        Search "{tag}"
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </section>

          {/* RIGHT COLUMN: Google-Style Knowledge Panel / Organization Graph */}
          {isBrandQuery && (
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white rounded-2xl border border-[#dadce0] shadow-xs overflow-hidden sticky top-36">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#063B78] to-[#082F63] p-5 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xl font-bold tracking-tight">REAL JOB</h3>
                        <span title="Verified Official Entity" className="inline-flex items-center">
                          <ShieldCheck className="size-4 text-[#FFC400]" />
                        </span>
                      </div>
                      <p className="text-xs text-blue-100 mt-0.5">
                        Workforce & Employment Platform
                      </p>
                    </div>
                    <img
                      src="/logo_icon.png"
                      alt="REAL JOB Logo"
                      className="size-11 rounded-xl bg-white p-1 object-contain shadow-xs"
                    />
                  </div>
                </div>

                {/* Quick Action Buttons (Google Style) */}
                <div className="grid grid-cols-3 divide-x divide-[#dadce0] border-b border-[#dadce0] bg-[#f8f9fa] text-center">
                  <a
                    href="https://realjob.online"
                    className="py-3 px-2 flex flex-col items-center justify-center hover:bg-slate-100 transition-colors"
                  >
                    <Globe className="size-4 text-[#1a73e8] mb-1" />
                    <span className="text-[11px] font-bold text-[#1a73e8]">Website</span>
                  </a>
                  <a
                    href="tel:9964216090"
                    className="py-3 px-2 flex flex-col items-center justify-center hover:bg-slate-100 transition-colors"
                  >
                    <Phone className="size-4 text-[#1a73e8] mb-1" />
                    <span className="text-[11px] font-bold text-[#1a73e8]">Call</span>
                  </a>
                  <Link
                    to="/contact"
                    className="py-3 px-2 flex flex-col items-center justify-center hover:bg-slate-100 transition-colors"
                  >
                    <Mail className="size-4 text-[#1a73e8] mb-1" />
                    <span className="text-[11px] font-bold text-[#1a73e8]">Support</span>
                  </Link>
                </div>

                {/* About / Description */}
                <div className="p-5 space-y-4 text-xs text-[#3c4043]">
                  <p className="leading-relaxed">
                    <strong>REAL JOB</strong> (powered by <em>Expertskill Technology</em>) is a digital employment and workforce management portal connecting industrial employers with verified blue-collar workers, technicians, and factory staff across India.
                  </p>

                  <div className="border-t border-[#f1f3f4] pt-3 space-y-2.5">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#202124] min-w-[90px]">Customer care:</span>
                      <a href="tel:9964216090" className="text-[#1a73e8] hover:underline font-semibold">
                        9964216090 / 1800 200 3040
                      </a>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#202124] min-w-[90px]">Email:</span>
                      <a href="mailto:realjobandhiring@realjob.online" className="text-[#1a73e8] hover:underline truncate">
                        realjobandhiring@realjob.online
                      </a>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#202124] min-w-[90px]">Headquarters:</span>
                      <span>Pune, Maharashtra, India</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#202124] min-w-[90px]">Parent org:</span>
                      <span>Expertskill Technology</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#202124] min-w-[90px]">Services:</span>
                      <span>Factory Staffing, Job Matching, E-Salary Slips, Overtime & Attendance</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#202124] min-w-[90px]">Official URL:</span>
                      <a href="https://realjob.online" className="text-[#1a73e8] hover:underline font-semibold">
                        https://realjob.online
                      </a>
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      <span>Verified Verification Features</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-tight">
                      ✓ Instant OTP mobile verification<br />
                      ✓ Aadhaar / Photo-verified profiles<br />
                      ✓ Direct employer attendance & monthly slips
                    </p>
                  </div>

                  {/* Direct Action Links */}
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      to="/jobs"
                      className="w-full py-2 px-3 bg-[#063B78] hover:bg-[#082F63] text-white rounded-lg font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Briefcase className="size-3.5" />
                      <span>Search All 1,500+ Jobs</span>
                    </Link>
                    <Link
                      to="/auth"
                      search={{ role: "employer", mode: "register" }}
                      className="w-full py-2 px-3 border border-[#dadce0] hover:bg-slate-50 text-slate-800 rounded-lg font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Building2 className="size-3.5 text-[#063B78]" />
                      <span>Post a Job as Employer</span>
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t border-[#dadce0] bg-[#f2f2f2] text-xs text-[#70757a] py-4 px-4 sm:px-8">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span>India</span>
            <span className="size-1 rounded-full bg-[#dadce0]" />
            <span>Maharashtra • Pune</span>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/about" className="hover:text-[#202124]">
              About
            </Link>
            <Link to="/contact" className="hover:text-[#202124]">
              Contact
            </Link>
            <Link to="/faq" className="hover:text-[#202124]">
              FAQ
            </Link>
            <Link to="/jobs" className="hover:text-[#202124]">
              Browse Jobs
            </Link>
            <a href="https://realjob.online" className="hover:text-[#202124]">
              realjob.online
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
