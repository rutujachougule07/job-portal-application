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
import { dataStore, JobRecord, isRemovedTestCategory } from "@/lib/data-store";

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

const getJobsPageText = (lang: string) => {
  const dict: Record<string, any> = {
    gu: {
      mainCategoriesTitle: "મુખ્ય નોકરી શ્રેણીઓ (Main Job Categories)",
      selectCategorySub: "તે વિભાગમાં નોકરીઓ જોવા માટે કોઈપણ શ્રેણી કાર્ડ પર ક્લિક કરો",
      jobs: "નોકરીઓ",
      activeListings: "સક્રિય લિસ્ટિંગ્સ",
      activeJobs: "સક્રિય નોકરીઓ",
      searchPlaceholder: "શ્રેણીમાં નોકરી શોધો...",
      selectedCategory: "પસંદ કરેલ શ્રેણી",
      jobsAvailable: "નોકરીઓ ઉપલબ્ધ",
      backToAll: "બધી શ્રેણીઓ પર પાછા જાઓ",
      filter: "ફિલ્ટર",
      expAll: "અનુભવ: બધા",
      fresher: "ફ્રેશર (Fresher)",
      years: "વર્ષ",
      salaryAll: "પગાર: બધા",
      typeAll: "પ્રકાર: બધા",
      fullTime: "ફુલ ટાઈમ (Full Time)",
      partTime: "પાર્ટ ટાઈમ (Part Time)",
      contract: "કરાર (Contract)",
      modeAll: "મોડ: બધા",
      wfh: "વર્ક ફ્રોમ હોમ (WFH)",
      onSite: "ઑન-સાઇટ (On-site)",
      hybrid: "હાઇબ્રિડ (Hybrid)",
      locationAll: "સ્થળ: બધા",
      reset: "રીસેટ",
      totalJobs: "કુલ નોકરીઓ:",
      sortBy: "ક્રમ:",
      newest: "નવીનતમ પ્રથમ",
      byTitle: "નામ મુજબ",
      noJobsDesc: "આ શ્રેણીમાં હજી સુધી કોઈ નવી નોકરી પોસ્ટ કરવામાં આવી નથી.",
      backBtn: "શ્રેણીઓ પર પાછા જાઓ",
      salaryLabel: "લઘુત્તમ પગાર",
      perMonth: "મહિનો",
    },
    hi: {
      mainCategoriesTitle: "मुख्य नौकरी श्रेणियां (Main Job Categories)",
      selectCategorySub: "उस अनुभाग में नौकरियां देखने के लिए किसी भी श्रेणी कार्ड पर क्लिक करें",
      jobs: "नौकरियां",
      activeListings: "सक्रिय लिस्टिंग",
      activeJobs: "सक्रिय नौकरियां",
      searchPlaceholder: "श्रेणी में नौकरी खोजें...",
      selectedCategory: "चयनित श्रेणी",
      jobsAvailable: "नौकरियां उपलब्ध",
      backToAll: "सभी श्रेणियों पर वापस जाएं",
      filter: "फ़िल्टर",
      expAll: "अनुभव: सभी",
      fresher: "फ्रेशर (Fresher)",
      years: "वर्ष",
      salaryAll: "वेतन: सभी",
      typeAll: "प्रकार: सभी",
      fullTime: "फुल टाइम (Full Time)",
      partTime: "पार्ट टाइम (Part Time)",
      contract: "अनुबंध (Contract)",
      modeAll: "मोड: सभी",
      wfh: "वर्क फ्रॉम होम (WFH)",
      onSite: "ऑन-साइट (On-site)",
      hybrid: "हाइब्रिड (Hybrid)",
      locationAll: "स्थान: सभी",
      reset: "रीसेट",
      totalJobs: "कुल नौकरियां:",
      sortBy: "क्रमबद्ध करें:",
      newest: "नवीनतम पहले",
      byTitle: "शीर्षक अनुसार",
      noJobsDesc: "इस श्रेणी में अभी तक कोई नई नौकरी पोस्ट नहीं की गई है।",
      backBtn: "श्रेणियों पर वापस जाएं",
      salaryLabel: "न्यूनतम वेतन",
      perMonth: "माह",
    },
    mr: {
      mainCategoriesTitle: "मुख्य नोकरी श्रेणी (Main Job Categories)",
      selectCategorySub: "नोकऱ्या पाहण्यासाठी खालील कोणत्याही श्रेणी कार्डवर क्लिक करा",
      jobs: "नोकऱ्या",
      activeListings: "सक्रिय नोकरी जाहिराती",
      activeJobs: "सक्रिय नोकऱ्या",
      searchPlaceholder: "नोकरी शोधा...",
      selectedCategory: "निवडलेली श्रेणी",
      jobsAvailable: "नोकऱ्या उपलब्ध",
      backToAll: "सर्व श्रेणींकडे जा",
      filter: "फिल्टर",
      expAll: "अनुभव: सर्व",
      fresher: "फ्रेशर (Fresher)",
      years: "वर्षे",
      salaryAll: "पगार: सर्व",
      typeAll: "प्रकार: सर्व",
      fullTime: "फुल टाईम (Full Time)",
      partTime: "पार्ट टाईम (Part Time)",
      contract: "कंत्राटी (Contract)",
      modeAll: "मोड: सर्व",
      wfh: "वर्क फ्रॉम होम (WFH)",
      onSite: "ऑन-साईट (On-site)",
      hybrid: "हायब्रिड (Hybrid)",
      locationAll: "ठिकाण: सर्व",
      reset: "रीसेट",
      totalJobs: "एकूण नोकऱ्या:",
      sortBy: "क्रमवारी:",
      newest: "नवीनतम प्रथम",
      byTitle: "नावानुसार",
      noJobsDesc: "या श्रेणीमध्ये अद्याप कोणतीही नवीन नोकरी पोस्ट केलेली नाही.",
      backBtn: "श्रेणींकडे परत जा",
      salaryLabel: "किमान पगार",
      perMonth: "महिना",
    },
    kn: {
      mainCategoriesTitle: "ಮುಖ್ಯ ಉದ್ಯೋಗ ವಿಭಾಗಗಳು (Main Job Categories)",
      selectCategorySub: "ಉದ್ಯೋಗಗಳನ್ನು ನೋಡಲು ಯಾವುದೇ ವರ್ಗದ ಕಾರ್ಡ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
      jobs: "ಉದ್ಯೋಗಗಳು",
      activeListings: "ಸಕ್ರಿಯ ಪಟ್ಟಿಗಳು",
      activeJobs: "ಸಕ್ರಿಯ ಉದ್ಯೋಗಗಳು",
      searchPlaceholder: "ವರ್ಗದಲ್ಲಿ ಉದ್ಯೋಗ ಹುಡುಕಿ...",
      selectedCategory: "ಆಯ್ಕೆಮಾಡಿದ ವರ್ಗ",
      jobsAvailable: "ಉದ್ಯೋಗಗಳು ಲಭ್ಯವಿದೆ",
      backToAll: "ಎಲ್ಲಾ ವರ್ಗಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
      filter: "ಫಿಲ್ಟರ್",
      expAll: "ಅನುಭವ: ಎಲ್ಲವೂ",
      fresher: "ಫ್ರೆಶರ್ (Fresher)",
      years: "ವರ್ಷಗಳು",
      salaryAll: "ವೇತನ: ಎಲ್ಲವೂ",
      typeAll: "ವಿಧ: ಎಲ್ಲವೂ",
      fullTime: "ಪೂರ್ಣ ಸಮಯ (Full Time)",
      partTime: "ಅರೆಕಾಲಿಕ (Part Time)",
      contract: "ಒಪ್ಪಂದ (Contract)",
      modeAll: "ಮೋಡ್: ಎಲ್ಲವೂ",
      wfh: "ಮನೆಯಿಂದ ಕೆಲಸ (WFH)",
      onSite: "ಆನ್-ಸೈಟ್ (On-site)",
      hybrid: "ಹೈಬ್ರಿಡ್ (Hybrid)",
      locationAll: "ಸ್ಥಳ: ಎಲ್ಲವೂ",
      reset: "ಮರುಹೊಂದಿಸಿ",
      totalJobs: "ಒಟ್ಟು ಉದ್ಯೋಗಗಳು:",
      sortBy: "ವಿಂಗಡಿಸಿ:",
      newest: "ಹೊಸತು ಮೊದಲು",
      byTitle: "ಶೀರ್ಷಿಕೆಯಂತೆ",
      noJobsDesc: "ಈ ವರ್ಗದಲ್ಲಿ ಇನ್ನೂ ಯಾವುದೇ ಉದ್ಯೋಗಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಲಾಗಿಲ್ಲ.",
      backBtn: "ವರ್ಗಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
      salaryLabel: "ಕನಿಷ್ಠ ವೇತನ",
      perMonth: "ತಿಂಗಳು",
    },
    te: {
      mainCategoriesTitle: "ప్రధాన ఉద్యోగ వర్గాలు (Main Job Categories)",
      selectCategorySub: "ఉద్యోగాలను చూడటానికి ఏదైనా వర్గం కార్డుపై క్లిక్ చేయండి",
      jobs: "ఉద్యోగాలు",
      activeListings: "యాక్టివ్ లిస్టింగ్‌లు",
      activeJobs: "యాక్టివ్ ఉద్యోగాలు",
      searchPlaceholder: "వర్గంలో ఉద్యోగం వెతకండి...",
      selectedCategory: "ఎంచుకున్న వర్గం",
      jobsAvailable: "ఉద్యోగాలు అందుబాటులో ఉన్నాయి",
      backToAll: "అన్ని వర్గాలకు తిరిగి వెళ్ళండి",
      filter: "ఫిల్టర్",
      expAll: "అనుభవం: అన్నీ",
      fresher: "ఫ్రెషర్ (Fresher)",
      years: "సంవత్సరాలు",
      salaryAll: "జీతం: అన్నీ",
      typeAll: "రకం: అన్నీ",
      fullTime: "పూర్తి సమయం (Full Time)",
      partTime: "పార్ట్ టైమ్ (Part Time)",
      contract: "కాంట్రాక్ట్ (Contract)",
      modeAll: "మోడ్: అన్నీ",
      wfh: "వర్క్ ఫ్రమ్ హోమ్ (WFH)",
      onSite: "ఆన్-సైట్ (On-site)",
      hybrid: "హైబ్రిడ్ (Hybrid)",
      locationAll: "ప్రాంతం: అన్నీ",
      reset: "రీసెట్",
      totalJobs: "మొత్తం ఉద్యోగాలు:",
      sortBy: "క్రమబద్ధీకరించు:",
      newest: "సరికొత్తది మొదట",
      byTitle: "పేరు ప్రకారం",
      noJobsDesc: "ఈ వర్గంలో ఇంకా ఎలాంటి ఉద్యోగాలు పోస్ట్ చేయలేదు.",
      backBtn: "వర్గాలకు తిరిగి వెళ్ళండి",
      salaryLabel: "కనీస వేతనం",
      perMonth: "నెల",
    },
    ta: {
      mainCategoriesTitle: "முக்கிய வேலை வகைகள் (Main Job Categories)",
      selectCategorySub: "வேலைகளைப் பார்க்க ஏதேனும் வகை அட்டை மீது கிளிக் செய்யவும்",
      jobs: "வேலைகள்",
      activeListings: "செயலில் உள்ள பட்டியல்கள்",
      activeJobs: "செயலில் உள்ள வேலைகள்",
      searchPlaceholder: "வகையில் வேலை தேடுங்கள்...",
      selectedCategory: "தேர்ந்தெடுக்கப்பட்ட வகை",
      jobsAvailable: "வேலைகள் உள்ளன",
      backToAll: "அனைத்து பிரிவுகளுக்கும் திரும்பு",
      filter: "வடிகட்டி",
      expAll: "அனுபவம்: அனைத்தும்",
      fresher: "புதியவர் (Fresher)",
      years: "ஆண்டுகள்",
      salaryAll: "சம்பளம்: அனைத்தும்",
      typeAll: "வகை: அனைத்தும்",
      fullTime: "முழு நேரம் (Full Time)",
      partTime: "பகுதி நேரம் (Part Time)",
      contract: "ஒப்பந்தம் (Contract)",
      modeAll: "முறை: அனைத்தும்",
      wfh: "வீட்டிலிருந்து வேலை (WFH)",
      onSite: "ஆன்-சைட் (On-site)",
      hybrid: "ஹைப்ரிட் (Hybrid)",
      locationAll: "இடம்: அனைத்தும்",
      reset: "மீட்டமை",
      totalJobs: "மொத்த வேலைகள்:",
      sortBy: "வரிசைப்படுத்து:",
      newest: "புதியது முதலில்",
      byTitle: "பெயர் அடிப்படையில்",
      noJobsDesc: "இந்த பிரிவில் இன்னும் எந்த வேலைகளும் இடுகையிடப்படவில்லை.",
      backBtn: "பிரிவுகளுக்கு திரும்பு",
      salaryLabel: "குறைந்தபட்ச சம்பளம்",
      perMonth: "மாதம்",
    },
    bn: {
      mainCategoriesTitle: "প্রধান চাকরির বিভাগসমূহ (Main Job Categories)",
      selectCategorySub: "চাকরি দেখতে যেকোনো ক্যাটাগরি কার্ডে ক্লিক করুন",
      jobs: "চাকরি",
      activeListings: "সক্রিয় তালিকা",
      activeJobs: "সক্রিয় চাকরি",
      searchPlaceholder: "ক্যাটাগরিতে চাকরি খুঁজুন...",
      selectedCategory: "নির্বাচিত বিভাগ",
      jobsAvailable: "চাকরি উপলব্ধ",
      backToAll: "সকল বিভাগে ফিরে যান",
      filter: "ফিল্টার",
      expAll: "অভিজ্ঞতা: সব",
      fresher: "ফ্রেশার (Fresher)",
      years: "বছর",
      salaryAll: "বেতন: সব",
      typeAll: "ধরন: সব",
      fullTime: "ফুল টাইম (Full Time)",
      partTime: "পার্ট টাইম (Part Time)",
      contract: "চুক্তিভিত্তিক (Contract)",
      modeAll: "মোড: সব",
      wfh: "ওয়ার্ক ফ্রম হোম (WFH)",
      onSite: "অন-সাইট (On-site)",
      hybrid: "হাইব্রিড (Hybrid)",
      locationAll: "অবস্থান: সব",
      reset: "রিসেট",
      totalJobs: "মোট চাকরি:",
      sortBy: "সাজান:",
      newest: "নতুনতম আগে",
      byTitle: "শিরোনাম অনুসারে",
      noJobsDesc: "এই বিভাগে এখনও কোনো নতুন চাকরি পোস্ট করা হয়নি।",
      backBtn: "বিভাগে ফিরে যান",
      salaryLabel: "সর্বনিম্ন বেতন",
      perMonth: "মাস",
    },
    en: {
      mainCategoriesTitle: "Main Job Categories",
      selectCategorySub: "Select any category card to view jobs in that section",
      jobs: "Jobs",
      activeListings: "Active Listings",
      activeJobs: "Active Jobs",
      searchPlaceholder: "Search in category...",
      selectedCategory: "Selected Category",
      jobsAvailable: "Jobs Available",
      backToAll: "Back to All Categories",
      filter: "Filter",
      expAll: "Experience: All",
      fresher: "Fresher",
      years: "Years",
      salaryAll: "Salary: All",
      typeAll: "Job Type: All",
      fullTime: "Full Time",
      partTime: "Part Time",
      contract: "Contract",
      modeAll: "Mode: All",
      wfh: "Work From Home",
      onSite: "On-site",
      hybrid: "Hybrid",
      locationAll: "Location: All",
      reset: "Reset",
      totalJobs: "Total Jobs:",
      sortBy: "Sort By:",
      newest: "Newest First",
      byTitle: "By Title",
      noJobsDesc: "No new jobs have been posted in this category yet.",
      backBtn: "Back to Categories",
      salaryLabel: "Minimum Salary",
      perMonth: "mo",
    },
  };
  const fallback = dict["en"]!;
  return dict[lang] || fallback;
};

function JobsListingPage() {
  const { t, n, lang } = useI18n();
  const jt = getJobsPageText(lang);
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
    const jobsList = dataStore.getActiveJobs();
    const catMap = new Map<string, { slug: string; name: string; count: number; iconName?: string }>();

    jobsList.forEach((job) => {
      if (job.category && job.category.trim()) {
        const name = job.category.trim();
        // Skip removed test categories
        if (isRemovedTestCategory(name)) return;

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
      showSalary: dj.showSalary ?? true,
      hideSalary: dj.hideSalary ?? false,
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
        (job.category && job.category.toLowerCase().includes(term)) ||
        (job.salary && job.salary.toLowerCase().includes(term));

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
                <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" /> {jt.backToAll}
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
                    {filteredJobs.length} {jt.activeJobs}
                  </p>
                </div>
              </div>
            </div>

            {/* Smaller Search Bar for Category Page */}
            <div className="w-full md:w-auto relative z-10">
              <div className="relative flex items-center w-full md:w-[320px] group">
                <Search className="absolute left-4 size-5 text-[#5B6B7F] group-focus-within:text-[#125BB5] transition-colors" />
                <Input
                  placeholder={jt.searchPlaceholder}
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
                {jt.mainCategoriesTitle}
              </h2>
              <p className="mt-2 text-sm font-bold text-[#5B6B7F]">
                {jt.selectCategorySub}
              </p>
            </div>

            {dynamicMainCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
                {/* Dynamic Main Category Cards */}
                {dynamicMainCategories.map(({ slug, name, count, iconName }) => {
                  let CategoryIcon = Briefcase;
                  const lc = name.toLowerCase();
                  if (iconName === 'Factory' || lc.includes('manufact') || lc.includes('factory')) CategoryIcon = Factory;
                  else if (iconName === 'HardHat' || lc.includes('construction') || lc.includes('builder') || lc.includes('civil')) CategoryIcon = HardHat;
                  else if (iconName === 'Wrench' || lc.includes('engineer') || lc.includes('tech') || lc.includes('mechanic')) CategoryIcon = Wrench;
                  else if (iconName === 'Truck' || lc.includes('logistic') || lc.includes('transport') || lc.includes('driver')) CategoryIcon = Truck;
                  else if (iconName === 'Zap' || lc.includes('electric')) CategoryIcon = Zap;
                  else if (iconName === 'Shield' || lc.includes('security') || lc.includes('guard')) CategoryIcon = ShieldCheck;
                  else if (iconName === 'Briefcase' || lc.includes('office') || lc.includes('staff')) CategoryIcon = Briefcase;
                  else if (iconName === 'Laptop' || lc.includes('software') || lc.includes('it')) CategoryIcon = Laptop;
                  else if (lc.includes('farm') || lc.includes('agri')) CategoryIcon = Sprout;
                  else if (lc.includes('health') || lc.includes('medic')) CategoryIcon = Stethoscope;
                  else if (lc.includes('financ') || lc.includes('account')) CategoryIcon = Landmark;
                  else if (lc.includes('sales') || lc.includes('market')) CategoryIcon = TrendingUp;
                  else if (lc.includes('educat') || lc.includes('teach')) CategoryIcon = GraduationCap;
                  else if (lc.includes('hotel') || lc.includes('restaurant')) CategoryIcon = Hotel;

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
                          {n(count)} {jt.jobs}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#10233F] group-hover:text-[#063B78] leading-tight">
                          {getCategoryTitle(name, lang) || name}
                        </h3>
                        <p className="text-xs font-bold text-[#5B6B7F] mt-2">
                          {n(count)} {jt.activeListings}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="card-realjob p-12 text-center bg-white rounded-3xl border border-[#DCE5F0] max-w-xl mx-auto">
                <Briefcase className="mx-auto size-14 text-[#5B6B7F] mb-4" />
                <h3 className="text-xl font-black text-[#10233F]">{t("noJobCategories")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  No jobs have been posted by the admin yet. Categories will appear here once jobs are posted.
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
                    {jt.selectedCategory}
                  </span>
                  <span className="text-xs font-extrabold text-[#5B6B7F]">
                    • {n(filteredJobs.length)} {jt.jobsAvailable}
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
                  {jt.backToAll}
                </button>
              </div>
            </div>

            {/* Compact Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#DCE5F0] shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-3.5 py-2 bg-[#063B78]/10 text-[#063B78] rounded-xl text-xs font-black mr-1">
                  <SlidersHorizontal className="size-3.5" />
                  <span>{jt.filter}</span>
                </div>

                {/* Experience Filter */}
                <div className="relative">
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="h-10 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] pl-3 pr-8 text-xs font-bold text-[#10233F] focus:border-[#063B78] appearance-none cursor-pointer"
                  >
                    <option value="all">🎓 {jt.expAll}</option>
                    <option value="Fresher">{jt.fresher}</option>
                    <option value="1-3">1-3 {jt.years}</option>
                    <option value="3-5">3-5 {jt.years}</option>
                    <option value="5+">5+ {jt.years}</option>
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
                    <option value="all">💰 {jt.salaryAll}</option>
                    <option value="10000">₹10,000+ / {jt.perMonth}</option>
                    <option value="15000">₹15,000+ / {jt.perMonth}</option>
                    <option value="20000">₹20,000+ / {jt.perMonth}</option>
                    <option value="25000">₹25,000+ / {jt.perMonth}</option>
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
                    <option value="all">💼 {jt.typeAll}</option>
                    <option value="Full Time">{jt.fullTime}</option>
                    <option value="Part Time">{jt.partTime}</option>
                    <option value="Contract">{jt.contract}</option>
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
                    <option value="all">🏢 {jt.modeAll}</option>
                    <option value="Work From Home">🏠 {jt.wfh}</option>
                    <option value="On-site">🏢 {jt.onSite}</option>
                    <option value="Hybrid">🔄 {jt.hybrid}</option>
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
                    <option value="all">📍 {jt.locationAll}</option>
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
                    {jt.reset}
                  </button>
                )}
              </div>

              {/* Total Count & Sort By */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-xs font-extrabold text-[#10233F] flex items-center gap-1.5">
                  <List className="size-3.5 text-[#063B78]" />
                  {jt.totalJobs} <span className="text-[#063B78] font-black text-sm">{n(filteredJobs.length)}</span>
                </span>

                <div className="flex items-center gap-1.5 bg-[#F5F8FC] rounded-xl p-1 border border-[#DCE5F0]/50">
                  <span className="text-xs font-bold text-[#5B6B7F] pl-2">{jt.sortBy}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-8 rounded-lg border-none bg-white shadow-xs px-2.5 text-xs font-bold text-[#10233F] focus:ring-0 appearance-none cursor-pointer"
                  >
                    <option value="newest">{jt.newest}</option>
                    <option value="title">{jt.byTitle}</option>
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
                <h3 className="text-xl font-black text-[#10233F]">{t("noJobsInCategory")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  {jt.noJobsDesc}
                </p>
                <Button onClick={() => { setCategoryFilter("all"); setSubCategoryFilter("all"); }} className="mt-5 btn-yellow text-xs font-bold px-6">
                  {jt.backBtn}
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
                  <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">{jt.expAll.replace(/.*:\s*/, '')}</label>
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold"
                  >
                    <option value="all">{jt.expAll}</option>
                    <option value="Fresher">{jt.fresher}</option>
                    <option value="1-3">1-3 {jt.years}</option>
                    <option value="3-5">3-5 {jt.years}</option>
                    <option value="5+">5+ {jt.years}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">{jt.salaryLabel}</label>
                  <select
                    value={salaryFilter}
                    onChange={(e) => setSalaryFilter(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold"
                  >
                    <option value="all">{jt.salaryAll}</option>
                    <option value="10000">₹10,000+ / {jt.perMonth}</option>
                    <option value="15000">₹15,000+ / {jt.perMonth}</option>
                    <option value="20000">₹20,000+ / {jt.perMonth}</option>
                    <option value="25000">₹25,000+ / {jt.perMonth}</option>
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
