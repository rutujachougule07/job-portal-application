import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  ArrowUpDown,
  User,
  SlidersHorizontal,
  Info,
  Video,
  Camera,
  MapPin,
  Briefcase,
  Phone,
  MessageCircle,
  Send,
  X,
  Check,
  Building2,
  Building,
  ChevronDown,
  ChevronRight,
  ArrowLeftRight,
  Bell,
  Sparkles,
  CheckCircle2,
  Wallet,
  LogOut,
  Bookmark,
  Share2,
  Languages,
} from "lucide-react";
import { toast } from "sonner";
import { dataStore, JobRecord } from "@/lib/data-store";
import { DynamicApplicationForm } from "@/components/portal/DynamicApplicationForm";
import { getFallbackConfig } from "@/lib/applicationConfig";
import { useI18n, languages } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isVideoMedia } from "@/lib/utils";
import careerTeam from "@/assets/career-team.jpg";

const DEFAULT_LANDING_MEDIA = [
  careerTeam,
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80",
  "https://firebasestorage.googleapis.com/v0/b/job-portal-729b6.firebasestorage.app/o/hero_media%2F1792129049561_hero_video.mp4?alt=media&token=9b136576-8f2e-4144-8f75-532783dec98b",
];

interface UserDashboardFeedProps {
  currentUser: any;
  onJobApplied?: () => void;
}

interface FeedJobItem {
  id: string;
  title: string;
  company?: string;
  category?: string;
  subcategory?: string;
  location: string;
  salary: string;
  salaryNum?: number;
  experience?: string;
  image: string;
  phone: string;
  postedDate?: string;
  applicationConfig?: any;
  initials?: string;
  vacancies?: number;
}

export function UserDashboardFeed({ currentUser, onJobApplied }: UserDashboardFeedProps) {
  const navigate = useNavigate();
  const { lang = "mr", setLang } = useI18n();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"default" | "salary-high" | "salary-low" | "newest" | "nearest" | "skills" | "saved">("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activePill, setActivePill] = useState<"filter" | "switch" | "about" | "notifications">("filter");
  const [filterSearchQuery, setFilterSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedSalary, setSelectedSalary] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [selectedShift, setSelectedShift] = useState<string>("all");
  const [selectedFacility, setSelectedFacility] = useState<string>("all");
  const [selectedJobStatus, setSelectedJobStatus] = useState<string>("all");
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Media Modals
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Full Screen Application Modal matching Find Jobs (JobCard.tsx)
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState<FeedJobItem | null>(null);
  const [pendingAction, setPendingAction] = useState<"call" | "chat" | "apply">("apply");
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, any>>({});
  const [applied, setApplied] = useState(false);

  // Auto-refresh when jobs or storage change
  const [refreshKey, setRefreshKey] = useState(0);

  // Dynamic Landing Page Media list (shows ALL videos and photos from landing page)
  const mediaScrollRef = useRef<HTMLDivElement>(null);
  const bannerVideoRef = useRef<HTMLVideoElement | null>(null);
  const [landingMediaList, setLandingMediaList] = useState<string[]>(DEFAULT_LANDING_MEDIA);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Always show IMAGES first, and VIDEO at the very end
  const orderedMediaList = useMemo(() => {
    const images: string[] = [];
    const videos: string[] = [];

    landingMediaList.forEach((url) => {
      if (
        isVideoMedia(url) ||
        url.includes(".mp4") ||
        url.includes(".webm") ||
        url.includes("hero_media") ||
        url.includes("youtube.com") ||
        url.includes("youtu.be")
      ) {
        videos.push(url);
      } else {
        images.push(url);
      }
    });

    return [...images, ...videos];
  }, [landingMediaList]);

  const isAutoScrollingRef = useRef(false);

  // Scroll to slide smoothly
  const scrollToSlide = (index: number) => {
    if (!mediaScrollRef.current) return;
    isAutoScrollingRef.current = true;
    const width = mediaScrollRef.current.clientWidth;
    mediaScrollRef.current.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
    setActiveSlideIndex(index);
    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 700);
  };

  const handleNextSlide = () => {
    if (orderedMediaList.length <= 1) return;
    const next = (activeSlideIndex + 1) % orderedMediaList.length;
    scrollToSlide(next);
  };

  const handlePrevSlide = () => {
    if (orderedMediaList.length <= 1) return;
    const prevIdx = activeSlideIndex === 0 ? orderedMediaList.length - 1 : activeSlideIndex - 1;
    scrollToSlide(prevIdx);
  };

  // Sync scroll position when user swipes horizontally
  const handleContainerScroll = () => {
    if (isAutoScrollingRef.current || !mediaScrollRef.current) return;
    const { scrollLeft, clientWidth } = mediaScrollRef.current;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex >= 0 && newIndex < orderedMediaList.length && newIndex !== activeSlideIndex) {
        setActiveSlideIndex(newIndex);
      }
    }
  };

  // Auto-scroll logic like landing page:
  // Images auto-scroll every 3 seconds (3000ms).
  // Video at the end runs at its normal speed (1.0x) and ONLY advances after it has completely finished playing (onEnded)!
  useEffect(() => {
    if (orderedMediaList.length <= 1) return;

    const currentUrl = orderedMediaList[activeSlideIndex];
    const isVideo =
      isVideoMedia(currentUrl) ||
      currentUrl?.includes(".mp4") ||
      currentUrl?.includes(".webm") ||
      currentUrl?.includes("hero_media");

    if (!isVideo) {
      // Exactly 3 seconds (3000ms) for each image
      const timer = setTimeout(() => {
        handleNextSlide();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Normal video speed as requested (1.0x)
      if (bannerVideoRef.current) {
        bannerVideoRef.current.playbackRate = 1.0;
        bannerVideoRef.current.currentTime = 0;
        bannerVideoRef.current.play().catch(() => {});
      }
      return undefined;
    }
  }, [activeSlideIndex, orderedMediaList.length]);

  useEffect(() => {
    let unsubSnapshot: (() => void) | undefined;

    const syncMedia = async () => {
      setRefreshKey((k) => k + 1);
      // 1. Check local storage
      try {
        const saved = localStorage.getItem("cms_heroImages");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLandingMediaList(parsed);
          }
        }
      } catch {}

      // 2. Real-time sync with Firestore landing page CMS
      try {
        const { db } = await import("@/firebase");
        const { doc, onSnapshot } = await import("firebase/firestore");
        unsubSnapshot = onSnapshot(doc(db, "cms_settings", "landing_page"), (snap) => {
          if (snap.exists()) {
            const data: any = snap.data();
            if (Array.isArray(data.heroImages) && data.heroImages.length > 0) {
              setLandingMediaList(data.heroImages);
            }
          }
        });
      } catch {}
    };

    syncMedia();
    window.addEventListener("storage", syncMedia);
    window.addEventListener("focus", syncMedia);
    return () => {
      if (unsubSnapshot) unsubSnapshot();
      window.removeEventListener("storage", syncMedia);
      window.removeEventListener("focus", syncMedia);
    };
  }, []);

  // Dynamic store jobs directly from dataStore (Only REAL jobs)
  const realJobs: FeedJobItem[] = useMemo(() => {
    try {
      const activeList = dataStore.getActiveJobs();
      // If getActiveJobs is empty, also include any non-closed jobs from store
      const all = activeList.length > 0 ? activeList : dataStore.getAllJobs().filter((j) => j.status !== "Closed");
      if (!all || all.length === 0) return [];

      const registered = dataStore.getRegisteredUserAccounts() || [];

      return all.map((j) => {
        const isSalaryHidden = j.showSalary === false || j.hideSalary === true;
        const cleanSalary = isSalaryHidden ? "Best in Industry" : (j.salary || "Best in Industry");
        
        let jobThumb = "/career-team.jpg";
        const cat = (j.category || j.subcategory || "").toLowerCase();
        if (cat.includes("chem") || cat.includes("factory") || cat.includes("plant")) {
          jobThumb = "/thumb_chemical_factory.jpg";
        } else if (cat.includes("solar") || cat.includes("electr")) {
          jobThumb = "/thumb_solar_plant.jpg";
        }

        // Safe phone lookup
        let contactPhone = "+919964216090";
        try {
          const emp = registered.find(
            (u) => u.email === j.employerId || u.fullName === j.employerName || u.fullName === j.company
          );
          if (emp?.mobile) {
            contactPhone = emp.mobile;
          }
        } catch {
          contactPhone = "+919964216090";
        }

        return {
          id: j.id,
          title: j.title,
          company: j.company,
          category: j.category || j.subcategory,
          subcategory: j.subcategory,
          location: j.location || "Maharashtra",
          salary: cleanSalary,
          salaryNum: j.salaryMax || j.salaryMin || 0,
          experience: j.experience || "Freshers & Experienced",
          image: jobThumb,
          phone: contactPhone,
          postedDate: j.postedAgo || "Recently",
          applicationConfig: j.applicationConfig,
          initials: j.initials || (j.company || j.title || "RJ").slice(0, 2).toUpperCase(),
          vacancies: j.vacancies || 1,
        };
      });
    } catch (err) {
      console.error("Failed to load real jobs in feed:", err);
      return [];
    }
  }, [refreshKey]);

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSelectedJobType("all");
    setSelectedLocation("all");
    setSelectedSalary("all");
    setSelectedExperience("all");
    setSelectedShift("all");
    setSelectedFacility("all");
    setSelectedJobStatus("all");
    setSortOption("default");
    toast.success("Filters reset successfully!");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedJobType !== "all") count++;
    if (selectedLocation !== "all") count++;
    if (selectedSalary !== "all") count++;
    if (selectedExperience !== "all") count++;
    if (selectedShift !== "all") count++;
    if (selectedFacility !== "all") count++;
    if (selectedJobStatus !== "all") count++;
    if (sortOption !== "default") count++;
    return count;
  }, [
    selectedCategory,
    selectedJobType,
    selectedLocation,
    selectedSalary,
    selectedExperience,
    selectedShift,
    selectedFacility,
    selectedJobStatus,
    sortOption,
  ]);

  // Filter and sort jobs (ONLY real jobs)
  const displayedJobs = useMemo(() => {
    let list = [...realJobs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          (j.category && j.category.toLowerCase().includes(q)) ||
          j.location.toLowerCase().includes(q) ||
          (j.company && j.company.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((j) => j.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedJobType !== "all") {
      list = list.filter((j) => {
        const jt = ((j as any).jobType || "").toLowerCase();
        const t = (j.title || "").toLowerCase();
        const desc = ((j as any).description || "").toLowerCase();
        const wm = ((j as any).workMode || "").toLowerCase();
        const sel = selectedJobType.toLowerCase();

        if (sel === "permanent") {
          return jt.includes("permanent") || jt.includes("full") || desc.includes("permanent");
        }
        if (sel === "temporary") {
          return jt.includes("temporary") || jt.includes("temp") || desc.includes("temporary");
        }
        if (sel === "daily") {
          return jt.includes("daily") || jt.includes("wage") || desc.includes("daily wage") || desc.includes("daily");
        }
        if (sel === "wfh") {
          return wm.includes("remote") || jt.includes("home") || desc.includes("work from home") || desc.includes("wfh");
        }
        if (sel === "full") {
          return jt.includes("full") || t.includes("full");
        }
        if (sel === "part") {
          return jt.includes("part") || t.includes("part");
        }
        if (sel === "contract") {
          return jt.includes("contract") || desc.includes("contract");
        }
        return jt.includes(sel) || t.includes(sel) || desc.includes(sel);
      });
    }

    if (selectedLocation !== "all") {
      list = list.filter((j) => {
        const loc = (j.location || "").toLowerCase();
        const desc = ((j as any).description || "").toLowerCase();
        if (selectedLocation === "5km" || selectedLocation === "10km" || selectedLocation === "25km" || selectedLocation === "50km" || selectedLocation === "100km") {
          return true;
        }
        if (selectedLocation === "village") return loc.includes("village") || desc.includes("village") || loc.includes("गाव");
        if (selectedLocation === "city") return loc.includes("city") || loc.includes("pune") || loc.includes("mumbai") || loc.includes("kolhapur") || loc.includes("sangli") || loc.includes("ichalkaranji");
        if (selectedLocation === "district") return loc.length > 0;
        if (selectedLocation === "pincode") return /\d{6}/.test(loc) || /\d{6}/.test(desc);
        return loc.includes(selectedLocation.toLowerCase());
      });
    }

    if (selectedSalary !== "all") {
      list = list.filter((j) => {
        const salNum = j.salaryNum || 0;
        const salText = (j.salary || "").toLowerCase();
        if (selectedSalary === "daily") return salText.includes("day") || salText.includes("daily") || (salNum > 0 && salNum < 2000);
        if (selectedSalary === "weekly") return salText.includes("week");
        if (selectedSalary === "monthly") return salText.includes("month") || salText.includes("mo") || salNum >= 5000;
        if (selectedSalary === "up-to-10k") return salNum > 0 && salNum <= 10000;
        if (selectedSalary === "10k-15k") return salNum >= 10000 && salNum <= 15000;
        if (selectedSalary === "15k-20k") return salNum >= 15000 && salNum <= 20000;
        if (selectedSalary === "20k-30k") return salNum >= 20000 && salNum <= 30000;
        if (selectedSalary === "above-30k") return salNum >= 30000;
        return true;
      });
    }

    if (selectedExperience !== "all") {
      list = list.filter((j) => {
        const exp = (j.experience || "").toLowerCase();
        const desc = ((j as any).description || "").toLowerCase();
        if (selectedExperience === "fresher") return exp.includes("fresher") || exp.includes("0") || exp === "";
        if (selectedExperience === "up-to-6m") return exp.includes("6 month") || exp.includes("fresher") || exp.includes("0");
        if (selectedExperience === "6m-2y") return exp.includes("1") || exp.includes("2") || exp.includes("6 month");
        if (selectedExperience === "2y-5y") return exp.includes("2") || exp.includes("3") || exp.includes("4") || exp.includes("5");
        if (selectedExperience === "above-5y") return exp.includes("5") || exp.includes("6") || exp.includes("7") || exp.includes("10") || exp.includes("+");
        if (selectedExperience === "training") return desc.includes("training") || desc.includes("learn") || exp.includes("training");
        if (selectedExperience === "license") return desc.includes("license") || desc.includes("certificate") || desc.includes("iti") || ((j as any).skills || []).some((s: string) => s.toLowerCase().includes("license"));
        return exp.includes(selectedExperience.toLowerCase());
      });
    }

    if (selectedShift !== "all") {
      list = list.filter((j) => {
        const desc = ((j as any).description || "").toLowerCase();
        const shift = ((j as any).shift || "").toLowerCase();
        const type = ((j as any).type || "").toLowerCase();
        const s = selectedShift.toLowerCase();
        return desc.includes(s) || shift.includes(s) || type.includes(s);
      });
    }

    if (selectedFacility !== "all") {
      list = list.filter((j) => {
        const benefits = (((j as any).benefits || []) as string[]).join(" ").toLowerCase();
        const perks = (((j as any).perks || []) as string[]).join(" ").toLowerCase();
        const desc = ((j as any).description || "").toLowerCase();
        const allText = `${benefits} ${perks} ${desc}`;
        if (selectedFacility === "accommodation") return allText.includes("room") || allText.includes("accommodation") || allText.includes("निवास") || allText.includes("stay");
        if (selectedFacility === "food") return allText.includes("food") || allText.includes("canteen") || allText.includes("meal") || allText.includes("जेवण");
        if (selectedFacility === "travel") return allText.includes("travel") || allText.includes("transport") || allText.includes("bus") || allText.includes("वाहतूक");
        if (selectedFacility === "pf") return allText.includes("pf") || allText.includes("provident");
        if (selectedFacility === "esic") return allText.includes("esi") || allText.includes("esic") || allText.includes("insurance");
        if (selectedFacility === "bonus") return allText.includes("bonus") || allText.includes("बोनस");
        if (selectedFacility === "overtime") return allText.includes("overtime") || allText.includes("ओव्हरटाइम");
        return allText.includes(selectedFacility.toLowerCase());
      });
    }

    if (selectedJobStatus !== "all") {
      if (selectedJobStatus === "urgent") {
        list = list.filter((j) => ((j as any).description || "").toLowerCase().includes("urgent") || ((j as any).urgency || "").toLowerCase().includes("urgent") || (j.vacancies || 0) > 3);
      } else if (selectedJobStatus === "today") {
        list = list.filter((j) => (j.vacancies || 0) > 0);
      } else if (selectedJobStatus === "new") {
        list = [...list].sort((a, b) => new Date(b.postedDate || 0).getTime() - new Date(a.postedDate || 0).getTime());
      } else if (selectedJobStatus === "immediate") {
        list = list.filter((j) => {
          const desc = ((j as any).description || "").toLowerCase();
          return desc.includes("immediate") || desc.includes("urgent") || desc.includes("लगेच");
        });
      } else if (selectedJobStatus === "verified") {
        list = list.filter((j) => (j as any).verified !== false);
      }
    }

    if (sortOption === "salary-high") {
      list.sort((a, b) => (b.salaryNum || 0) - (a.salaryNum || 0));
    } else if (sortOption === "salary-low") {
      list.sort((a, b) => (a.salaryNum || 0) - (b.salaryNum || 0));
    } else if (sortOption === "newest") {
      list.sort((a, b) => new Date(b.postedDate || 0).getTime() - new Date(a.postedDate || 0).getTime());
    } else if (sortOption === "nearest") {
      const userCity = (currentUser?.worksiteLocationLink || "").toLowerCase();
      if (userCity) {
        list.sort((a, b) => {
          const aMatch = (a.location || "").toLowerCase().includes(userCity) ? 1 : 0;
          const bMatch = (b.location || "").toLowerCase().includes(userCity) ? 1 : 0;
          return bMatch - aMatch;
        });
      }
    } else if (sortOption === "skills") {
      list.sort((a, b) => {
        const aScore = selectedCategory !== "all" && (a.category || "").toLowerCase() === selectedCategory.toLowerCase() ? 1 : 0;
        const bScore = selectedCategory !== "all" && (b.category || "").toLowerCase() === selectedCategory.toLowerCase() ? 1 : 0;
        return bScore - aScore;
      });
    } else if (sortOption === "saved") {
      const seekerId = currentUser?.id || "guest";
      const savedIds = new Set(dataStore.getSavedJobs(seekerId).map((s: any) => s.jobId));
      list = list.filter((j) => savedIds.has(j.id));
    }

    return list;
  }, [
    realJobs,
    searchQuery,
    selectedCategory,
    selectedJobType,
    selectedLocation,
    selectedSalary,
    selectedExperience,
    selectedShift,
    selectedFacility,
    selectedJobStatus,
    sortOption,
  ]);

  const currentAppConfig = useMemo(() => {
    if (!selectedJobForModal) return null;
    return selectedJobForModal.applicationConfig || getFallbackConfig(selectedJobForModal.category || "General");
  }, [selectedJobForModal]);

  const getCandidateCredentials = () => {
    const user = currentUser || dataStore.getCurrentUser();
    const seekerId = user ? (user.id || user.email || "seeker-demo") : "candidate-guest";
    return { user, seekerId };
  };

  // Real company messages & updates for current job seeker (NO DUMMY DATA)
  const companyNotifications = useMemo(() => {
    try {
      const { user, seekerId } = getCandidateCredentials();
      const allApps = dataStore.getAllApplications ? dataStore.getAllApplications() : [];
      const userEmail = (user?.email || "").toLowerCase().trim();

      // Find all real applications belonging to this candidate
      const myApps = allApps.filter((a: any) => {
        if (!a) return false;
        if (a.jobSeekerId === seekerId) return true;
        if (userEmail && (a.candidateEmail?.toLowerCase().trim() === userEmail || a.jobSeekerId?.toLowerCase().trim() === userEmail)) return true;
        return false;
      });

      const list: Array<{
        id: string;
        companyName: string;
        jobTitle: string;
        message: string;
        status: string;
        date: string;
        isReply: boolean;
      }> = [];

      myApps.forEach((a) => {
        if (a.replyMessage && a.replyMessage.trim()) {
          list.push({
            id: `reply-${a.id}`,
            companyName: a.companyName || a.employerId || "Company Employer",
            jobTitle: a.jobTitle || "Job Application",
            message: a.replyMessage.trim(),
            status: a.status || "Replied",
            date: a.replyDate || a.appliedDate || "Recently",
            isReply: true,
          });
        } else if (a.status && a.status !== "Applied") {
          let msg = `Company updated status to ${a.status}.`;
          if (a.status === "Selected") msg = "अभिनंदन! कंपनीने तुमची या पदासाठी निवड केली आहे (Selected).";
          else if (a.status === "Interview") msg = "कंपनीने तुमच्यासाठी मुलाखत (Interview) निश्चित केली आहे.";
          else if (a.status === "Shortlisted") msg = "कंपनीने तुमचा अर्ज शॉर्टलिस्ट (Shortlisted) केला आहे.";
          else if (a.status === "Viewed") msg = "कंपनीने तुमचा जॉब अर्ज व प्रोफाईल पाहिले आहे (Viewed).";

          list.push({
            id: `status-${a.id}`,
            companyName: a.companyName || a.employerId || "Company Employer",
            jobTitle: a.jobTitle || "Job Application",
            message: msg,
            status: a.status,
            date: a.appliedDate || "Recently",
            isReply: false,
          });
        }
      });

      return list;
    } catch {
      return [];
    }
  }, [currentUser, refreshKey]);

  // Action handlers - exactly matching Find Jobs logic:
  // Must submit application form before calling or chatting!
  const handleCall = (job: FeedJobItem) => {
    const { user, seekerId } = getCandidateCredentials();
    const hasApplied = dataStore.hasAlreadyApplied(seekerId, job.id);

    if (!hasApplied) {
      setSelectedJobForModal(job);
      setPendingAction("call");
      setFieldValues({
        fullName: user?.fullName || "",
        email: user?.email || "",
        mobile: user?.mobile || "",
      });
      setCustomAnswers({});
      setApplied(false);
      setShowApplyModal(true);
      toast.info(lang === "mr" ? "कॉल जोडण्यासाठी आधी नोकरीचा अर्ज फॉर्म भरा." : "Please fill out the application form first to connect call.");
      return;
    }

    const cleanPhone = job.phone.replace(/[^0-9+]/g, "");
    toast.info(`Connecting call to ${job.title}...`, {
      description: `Dialing: ${cleanPhone}`,
    });
    window.open(`tel:${cleanPhone}`, "_self");
  };

  const handleChat = (job: FeedJobItem) => {
    const { user, seekerId } = getCandidateCredentials();
    const hasApplied = dataStore.hasAlreadyApplied(seekerId, job.id);

    if (!hasApplied) {
      setSelectedJobForModal(job);
      setPendingAction("chat");
      setFieldValues({
        fullName: user?.fullName || "",
        email: user?.email || "",
        mobile: user?.mobile || "",
      });
      setCustomAnswers({});
      setApplied(false);
      setShowApplyModal(true);
      toast.info(lang === "mr" ? "चॅट / WhatsApp करण्यासाठी आधी नोकरीचा अर्ज फॉर्म भरा." : "Please fill out the application form first to start chat.");
      return;
    }

    const cleanPhone = job.phone.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(`Hello, I have submitted my application for ${job.title} on REAL JOB portal.`);
    toast.success("Opening chat with employer...");
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, "_blank");
  };

  const handleApplyClick = (job: FeedJobItem) => {
    const { user, seekerId } = getCandidateCredentials();
    const hasApplied = dataStore.hasAlreadyApplied(seekerId, job.id);

    if (hasApplied) {
      toast.error(lang === "mr" ? "तुम्ही या नोकरीसाठी आधीच अर्ज भरला आहे!" : "You have already applied to this job!");
      return;
    }

    setSelectedJobForModal(job);
    setPendingAction("apply");
    setFieldValues({
      fullName: user?.fullName || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
    });
    setCustomAnswers({});
    setApplied(false);
    setShowApplyModal(true);
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForModal) return;

    const { user, seekerId } = getCandidateCredentials();
    const seekerName = fieldValues['fullName'] || fieldValues['candidateName'] || user?.fullName || "Candidate Applicant";
    const userAcc = seekerId ? dataStore.findRegisteredAccount(seekerId) : null;
    const userMobile = userAcc?.mobile || (user as any)?.mobile || "";
    const seekerMobile =
      fieldValues['mobile'] ||
      fieldValues['phone'] ||
      fieldValues['candidateMobile'] ||
      fieldValues['mobileNumber'] ||
      fieldValues['contactNumber'] ||
      fieldValues['phoneNo'] ||
      fieldValues['mobileNo'] ||
      userMobile;

    if (dataStore.hasAlreadyApplied(seekerId, selectedJobForModal.id)) {
      toast.error(lang === "mr" ? "तुम्ही या नोकरीसाठी आधीच अर्ज भरला आहे!" : "You have already applied to this job!");
      setShowApplyModal(false);
      return;
    }

    try {
      const existingProfile = seekerId ? dataStore.getJobSeekerProfile(seekerId) : null;
      const finalResume = fieldValues['resume'] || existingProfile?.resume || `${seekerName.replaceAll(" ", "_")}_Resume.pdf`;

      dataStore.createApplication({
        jobId: selectedJobForModal.id,
        employerId: selectedJobForModal.company || "Employer",
        jobSeekerId: seekerId,
        candidateName: seekerName,
        candidateEmail: fieldValues['email'] || user?.email || `${seekerId}@realjob.com`,
        candidateMobile: seekerMobile,
        jobTitle: selectedJobForModal.title,
        companyName: selectedJobForModal.company || selectedJobForModal.title,
        location: selectedJobForModal.location,
        salary: selectedJobForModal.salary,
        resume: finalResume,
        fieldValues,
        customAnswers,
        category: selectedJobForModal.category || "General",
      } as any);

      setApplied(true);
      toast.success(lang === "mr" ? "अर्ज यशस्वीरीत्या पाठवला!" : "Application submitted successfully!");
      if (onJobApplied) onJobApplied();

      const action = pendingAction;
      const targetJob = selectedJobForModal;

      setTimeout(() => {
        setShowApplyModal(false);
        setApplied(false);

        if (action === "call") {
          const cleanPhone = targetJob.phone.replace(/[^0-9+]/g, "");
          toast.info(`Connecting call to ${targetJob.title}...`, {
            description: `Dialing: ${cleanPhone}`,
          });
          window.open(`tel:${cleanPhone}`, "_self");
        } else if (action === "chat") {
          const cleanPhone = targetJob.phone.replace(/[^0-9]/g, "");
          const encodedText = encodeURIComponent(`Hello, I have submitted my application for ${targetJob.title} on REAL JOB portal.`);
          toast.success("Opening chat with employer...");
          window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, "_blank");
        }
      }, 1500);

    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    }
  };

  const handleShareJob = (job: FeedJobItem) => {
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/jobs` : "https://realjob.online/jobs";
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: job.title,
          text: `Check out ${job.title} at ${job.company} (${job.salary}) on REAL JOB!`,
          url: shareUrl,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success(lang === "mr" ? "नोकरीची लिंक कॉपी केली!" : "Job link copied to clipboard!");
    }
  };

  return (
    <div className="w-full space-y-3.5">
      {/* ================= 1. PILL BUTTONS ROW (Filter | Switch | About | Notification 🔔) ================= */}
      <div className="bg-white rounded-2xl border border-[#DCE5F0] p-1.5 shadow-xs flex items-center justify-between">
        {/* 1. Filter Pill */}
        <button
          onClick={() => {
            setActivePill("filter");
            setIsFilterModalOpen(true);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activePill === "filter" ? "text-[#0284C7] bg-blue-50/70 font-extrabold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <SlidersHorizontal className="size-3.5 sm:size-4 shrink-0" />
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-[#0284C7] text-white text-[10px] font-black rounded-full leading-none">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Vertical Divider Line | */}
        <div className="h-5 w-[1.5px] bg-[#CBD5E1] shrink-0 mx-0.5" />

        {/* 2. Switch Pill */}
        <button
          onClick={() => {
            setActivePill("switch");
            setIsSwitchModalOpen(true);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activePill === "switch" ? "text-[#0284C7] bg-blue-50/70 font-extrabold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ArrowLeftRight className="size-3.5 sm:size-4 shrink-0" />
          <span>Switch</span>
        </button>

        {/* Vertical Divider Line | */}
        <div className="h-5 w-[1.5px] bg-[#CBD5E1] shrink-0 mx-0.5" />

        {/* 3. About Pill */}
        <button
          onClick={() => {
            setActivePill("about");
            setIsAboutModalOpen(true);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activePill === "about" ? "text-[#0284C7] bg-blue-50/70 font-extrabold" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Info className="size-3.5 sm:size-4 shrink-0" />
          <span>About</span>
        </button>

        {/* Vertical Divider Line | */}
        <div className="h-5 w-[1.5px] bg-[#CBD5E1] shrink-0 mx-0.5" />

        {/* 4. Notification Bell Icon on the Right side of About */}
        <div className="relative flex items-center justify-center px-1.5 shrink-0" ref={notificationsDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setActivePill("notifications");
              setIsNotificationsOpen(!isNotificationsOpen);
            }}
            className={`relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              activePill === "notifications" || isNotificationsOpen
                ? "text-[#0284C7] bg-blue-50/70 font-extrabold"
                : "text-slate-600 hover:text-[#0284C7] hover:bg-slate-50"
            }`}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="size-4 sm:size-4.5" />
            {companyNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown Popup - Real Company Messages Only */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-1.5">
                  <Bell className="size-4 text-[#0284C7]" />
                  <span className="font-bold text-xs text-slate-800">
                    {lang === "mr" ? "कंपनी मेसेजेस व सूचना" : "Company Messages"}
                  </span>
                </div>
                {companyNotifications.length > 0 ? (
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {companyNotifications.length} {lang === "mr" ? "नवीन" : "New"}
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400">0</span>
                )}
              </div>

              {companyNotifications.length === 0 ? (
                <div className="py-6 px-3 text-center space-y-1.5">
                  <div className="size-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <MessageCircle className="size-4.5" />
                  </div>
                  <p className="font-bold text-xs text-slate-700">
                    {lang === "mr" ? "सध्या कोणताही कंपनी मेसेज नाही" : "No company messages yet"}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-normal max-w-xs mx-auto font-medium">
                    {lang === "mr"
                      ? "कंपनीने तुमच्या अर्जावर मेसेज किंवा रिप्लाय पाठवल्यावर तो येथे दिसेल."
                      : "When employers message or reply to your application, it will appear here."}
                  </p>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-2 pr-0.5" style={{ scrollbarWidth: "thin" }}>
                  {companyNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100/60 hover:bg-blue-50/80 transition-all text-left space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-slate-800 text-[11px] truncate flex items-center gap-1">
                          <Building className="size-3 text-[#0284C7] shrink-0" />
                          {notif.companyName}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                          {notif.date}
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-[#0284C7] truncate">
                        {notif.jobTitle}
                      </p>
                      <div className="p-2 rounded-lg bg-white border border-blue-100/50 text-[11px] font-medium text-slate-700 leading-snug">
                        💬 "{notif.message}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>



      {/* ================= 3. 16:9 MEDIA BANNER CAROUSEL (Images first, Video last, auto-scroll) ================= */}
      <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-[#DCE5F0] bg-slate-900 group">
        {/* Slides Container */}
        <div
          ref={mediaScrollRef}
          onScroll={handleContainerScroll}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {orderedMediaList.map((mediaUrl, idx) => {
            const isVideo =
              isVideoMedia(mediaUrl) ||
              mediaUrl.includes(".mp4") ||
              mediaUrl.includes(".webm") ||
              mediaUrl.includes("hero_media");

            return (
              <div
                key={mediaUrl + idx}
                onClick={() => {
                  window.location.href = "/?view=website";
                }}
                className="relative shrink-0 w-full h-full snap-start cursor-pointer group/slide flex items-center justify-center bg-black"
                title="Click to view on Landing Page"
              >
                {isVideo ? (
                  <video
                    ref={bannerVideoRef}
                    src={mediaUrl}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover pointer-events-none"
                    onEnded={() => {
                      handleNextSlide();
                    }}
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={`Landing Media ${idx + 1}`}
                    className="w-full h-full object-cover group-hover/slide:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Slide Pagination Dots at Bottom Center */}
        {orderedMediaList.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-auto bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/15">
            {orderedMediaList.map((mediaUrl, dotIdx) => (
              <button
                key={dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToSlide(dotIdx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === activeSlideIndex
                    ? "w-4 h-1.5 bg-white shadow-sm"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`Slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= 4. LIVE JOB CARDS (Share, Call, Chat, Apply) - Matching Drawing ================= */}
      <div className="space-y-3.5">
        {displayedJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl sm:rounded-3xl border border-[#DCE5F0] p-4 sm:p-5 shadow-xs hover:border-[#0284C7]/40 hover:shadow-md transition-all space-y-3.5"
          >
            {/* Top Details Row with Share Button matching Drawing */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <img
                  src={job.image}
                  alt={job.title}
                  className="size-18 sm:size-20 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-2xs"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-base sm:text-lg text-[#0A2540] truncate leading-tight">
                    {job.title}
                  </h3>
                  {job.category && (
                    <p className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                      <Briefcase className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.category}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                    <MapPin className="size-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </p>
                  <p className="flex items-center gap-1 font-black text-[#0284C7] text-sm sm:text-base mt-1">
                    <span>₹</span>
                    <span>{job.salary}</span>
                  </p>
                </div>
              </div>

              {/* Share Icon on Top-Right matching Drawing */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareJob(job);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-[#0284C7] hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                title="Share Job"
                aria-label="Share Job"
              >
                <Share2 className="size-4.5" />
              </button>
            </div>

            {/* Bottom 3 Action Buttons in 1 Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              {/* Call Button */}
              <button
                type="button"
                onClick={() => handleCall(job)}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white font-extrabold text-xs sm:text-sm py-2.5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Phone className="size-4 shrink-0 fill-current" />
                <span>Call</span>
              </button>

              {/* Chat Button */}
              <button
                type="button"
                onClick={() => handleChat(job)}
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-95 text-white font-extrabold text-xs sm:text-sm py-2.5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <MessageCircle className="size-4 shrink-0 fill-current" />
                <span>Chat</span>
              </button>

              {/* Apply Button */}
              <button
                type="button"
                onClick={() => handleApplyClick(job)}
                className="w-full bg-[#0284C7] hover:bg-[#0369A1] active:scale-95 text-white font-extrabold text-xs sm:text-sm py-2.5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Send className="size-4 shrink-0 fill-current" />
                <span>Apply</span>
              </button>
            </div>
          </div>
        ))}

        {displayedJobs.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Search className="size-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No jobs match your search "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-xs font-bold text-[#0284C7] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>


      {/* ================= VIDEO MODAL ================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl overflow-hidden w-full max-w-2xl border border-white/10 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="p-4 flex items-center justify-between border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <Video className="size-5 text-[#0284C7]" />
                <h4 className="font-black text-sm">Industrial Work & Solar Installation</h4>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src="/uploads/1791958510410_WhatsApp_Video_2026-10-14_at_11.44.38_AM.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= PHOTO MODAL ================= */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl overflow-hidden w-full max-w-3xl border border-white/10 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="p-4 flex items-center justify-between border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <Camera className="size-5 text-[#0284C7]" />
                <h4 className="font-black text-sm">Verified Workforce Photo Gallery</h4>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src="/banner_construction_photo.jpg"
                alt="Workforce team"
                className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= FULL SCREEN APPLICATION MODAL (Matching Find Jobs) ================= */}
      {showApplyModal && selectedJobForModal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto animate-in fade-in duration-200">
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#DCE5F0] bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3 sm:py-4 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="grid size-8 sm:size-10 place-items-center rounded-xl bg-[#063B78] font-black text-white text-base sm:text-lg shadow-sm">
                R
              </span>
              <span className="font-black text-[#082F63] text-lg sm:text-xl tracking-tight">
                JobPortal
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#F5F8FC] text-[#5B6B7F] hover:text-[#10233F] hover:bg-[#EBF1F8] font-bold text-xs sm:text-sm transition-colors border border-[#DCE5F0] cursor-pointer"
            >
              <X className="size-4" /> {lang === "mr" ? "बंद करा" : "Close"}
            </button>
          </div>

          <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Form Area */}
              <div className="flex-1 w-full bg-white rounded-3xl border border-[#DCE5F0] p-4 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
                    {pendingAction === "call" && (
                      <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <Phone className="size-3.5 fill-current" /> Call Connect Application
                      </span>
                    )}
                    {pendingAction === "chat" && (
                      <span className="flex items-center gap-1.5 text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                        <MessageCircle className="size-3.5 fill-current" /> WhatsApp Connect Application
                      </span>
                    )}
                    {pendingAction === "apply" && (
                      <span className="flex items-center gap-1.5 text-[#0284C7] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        <Send className="size-3.5 fill-current" /> Direct Job Application
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#082F63] mb-2">
                    {lang === "mr" ? "नोकरीसाठी अर्ज करा" : "Apply for Job"}
                  </h2>
                  <p className="text-[#5B6B7F] font-semibold text-xs sm:text-sm">
                    {lang === "mr"
                      ? "खालील माहिती काळजीपूर्वक भरा. अर्ज सादर केल्यावरच कंपनीशी थेट संपर्क साधता येईल."
                      : "Fill in the details below to apply for this job. Make sure all information is correct."}
                  </p>
                </div>

                {applied ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="size-20 text-[#063B78] mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-black text-[#10233F]">
                      {lang === "mr" ? "अर्ज यशस्वीरीत्या पाठवला!" : "Application Submitted!"}
                    </h3>
                    <p className="text-sm font-semibold text-[#5B6B7F] mt-2 max-w-md mx-auto">
                      {pendingAction === "call"
                        ? (lang === "mr" ? "अर्ज यशस्वीरीत्या सादर केला आहे. आता कंपनीला कॉल जोडला जात आहे..." : "Application submitted. Connecting call now...")
                        : pendingAction === "chat"
                        ? (lang === "mr" ? "अर्ज यशस्वीरीत्या सादर केला आहे. आता व्हॉट्सॲप चॅट उघडले जात आहे..." : "Application submitted. Opening WhatsApp chat now...")
                        : (lang === "mr" ? "तुमचा अर्ज कंपनीला पाठवण्यात आला आहे. ते लवकरच तुमच्याशी संपर्क साधतील." : "Your application has been sent to the employer. They will contact you shortly.")}
                    </p>
                    <Button onClick={() => setShowApplyModal(false)} className="btn-yellow h-12 px-8 font-black text-sm mt-8 rounded-xl cursor-pointer">
                      {lang === "mr" ? "मागे जा" : "Go Back"}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submitApplication} className="space-y-6">
                    <DynamicApplicationForm 
                      appConfig={currentAppConfig}
                      fieldValues={fieldValues}
                      setFieldValues={setFieldValues}
                      customAnswers={customAnswers}
                      setCustomAnswers={setCustomAnswers}
                      lang={lang}
                      category={selectedJobForModal.category || "General"}
                    />

                    <div className="pt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6 border-t border-[#DCE5F0]">
                      <Button
                        type="button"
                        onClick={() => setShowApplyModal(false)}
                        variant="outline"
                        className="h-12 w-full sm:w-auto px-6 font-bold text-sm rounded-xl border-[#DCE5F0] text-[#5B6B7F] cursor-pointer"
                      >
                        {lang === "mr" ? "रद्द करा" : "Cancel"}
                      </Button>
                      <Button
                        type="submit"
                        className="btn-yellow h-12 w-full sm:w-auto px-8 font-black text-sm shadow-md rounded-xl flex items-center justify-center cursor-pointer"
                      >
                        {pendingAction === "call"
                          ? (lang === "mr" ? "अर्ज सादर करा आणि कॉल करा" : "Submit & Call Employer")
                          : pendingAction === "chat"
                          ? (lang === "mr" ? "अर्ज सादर करा आणि WhatsApp उघडा" : "Submit & Open WhatsApp")
                          : (lang === "mr" ? "अंतिम अर्ज सादर करा" : "Submit Application")}
                        <Send className="ml-2 size-4" />
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Job Summary Card */}
              <div className="w-full lg:w-[400px] shrink-0 bg-white rounded-3xl border border-[#DCE5F0] p-6 shadow-sm sticky top-24 hidden lg:block">
                <div className="flex items-start justify-between mb-4">
                  <span className="grid size-14 place-items-center rounded-2xl bg-[#063B78] font-black text-white text-xl shadow-md">
                    {selectedJobForModal.initials || "RJ"}
                  </span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    Active
                  </Badge>
                </div>
                <h3 className="font-display text-2xl font-black text-[#10233F] mb-2">{selectedJobForModal.title}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-bold text-[#125BB5] flex items-center gap-2">
                    <Building className="size-4" /> {selectedJobForModal.company || "REAL JOB Partner"}
                  </p>
                  <p className="text-sm font-semibold text-[#5B6B7F] flex items-center gap-2">
                    <MapPin className="size-4" /> {selectedJobForModal.location}
                  </p>
                </div>
                
                <div className="inline-block px-3 py-1 bg-[#EBF1F8] text-[#125BB5] text-xs font-bold rounded-lg mb-6">
                  {selectedJobForModal.category || "General"}
                </div>

                <div className="space-y-5">
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-full bg-[#F5F8FC] flex items-center justify-center shrink-0">
                      <Briefcase className="size-4 text-[#5B6B7F]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#5B6B7F]">Experience</p>
                      <p className="text-sm font-black text-[#10233F]">{selectedJobForModal.experience || "Any"}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-full bg-[#F5F8FC] flex items-center justify-center shrink-0">
                      <Wallet className="size-4 text-[#5B6B7F]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#5B6B7F]">Salary</p>
                      <p className="text-sm font-black text-[#10233F]">₹ {selectedJobForModal.salary}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-full bg-[#F5F8FC] flex items-center justify-center shrink-0">
                      <User className="size-4 text-[#5B6B7F]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#5B6B7F]">Vacancies</p>
                      <p className="text-sm font-black text-[#10233F]">{selectedJobForModal.vacancies || 1}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FILTER MODAL ================= */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col border border-[#DCE5F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white sticky top-0 z-10 shrink-0">
              <h3 className="font-black text-xl text-[#0A2540] tracking-tight">Filter Jobs</h3>
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="size-5 text-[#0A2540]" />
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Search filters input matching latest screenshot */}
            <div className="px-4 pt-3.5 pb-1 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={filterSearchQuery}
                  onChange={(e) => setFilterSearchQuery(e.target.value)}
                  placeholder="Search filters..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-[#0A2540] placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:bg-white transition-all"
                />
                {filterSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setFilterSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Filter List with 100% English text */}
            <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
              {/* 1. Language */}
              {(!filterSearchQuery || "1. language english".includes(filterSearchQuery.toLowerCase())) && (
                <div className="rounded-2xl border border-slate-200/90 bg-white hover:border-[#0284C7]/50 shadow-xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 1 ? null : 1)}
                    className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-bold text-[14px] text-[#0A2540]">1. Language</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {lang !== "en" ? `Selected: ${lang.toUpperCase()}` : "12 options"}
                      </p>
                    </div>
                    <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          expandedSection === 1 ? "rotate-180 text-[#0284C7]" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expandedSection === 1 && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 grid grid-cols-2 gap-2 animate-in fade-in duration-150">
                      {[
                        { code: "en", name: "English" },
                        { code: "mr", name: "Marathi" },
                        { code: "hi", name: "Hindi" },
                        { code: "gu", name: "Gujarati" },
                        { code: "kn", name: "Kannada" },
                        { code: "te", name: "Telugu" },
                        { code: "ta", name: "Tamil" },
                        { code: "bn", name: "Bengali" },
                        { code: "pa", name: "Punjabi" },
                        { code: "ml", name: "Malayalam" },
                        { code: "or", name: "Odia" },
                        { code: "as", name: "Assamese" },
                      ].map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            setLang(l.code as any);
                            toast.success(`Language set to ${l.name}`);
                          }}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            lang === l.code
                              ? "bg-[#0284C7] text-white border-[#0284C7] shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span>{l.name}</span>
                          {lang === l.code && <Check className="size-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Job Category */}
              {(!filterSearchQuery || "2. job category worker category role construction factory industry electrician driver office data entry application developer web developer software developer mobile app developer other".includes(filterSearchQuery.toLowerCase())) && (
                <div className="rounded-2xl border border-slate-200/90 bg-white hover:border-[#0284C7]/50 shadow-xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 2 ? null : 2)}
                    className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-[#0A2540]">2. Job Category</p>
                        {selectedCategory !== "all" && (
                          <span className="size-2 rounded-full bg-[#0284C7]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedCategory !== "all" ? selectedCategory : "10 options"}
                      </p>
                    </div>
                    <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          expandedSection === 2 ? "rotate-180 text-[#0284C7]" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expandedSection === 2 && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-150">
                      {[
                        { id: "all", label: "All Categories" },
                        { id: "Construction", label: "Construction" },
                        { id: "Factory / Industry", label: "Factory / Industry" },
                        { id: "Electrician", label: "Electrician" },
                        { id: "Driver", label: "Driver" },
                        { id: "Office / Data Entry", label: "Office / Data Entry" },
                        { id: "Application Developer", label: "Application Developer" },
                        { id: "Web Developer", label: "Web Developer" },
                        { id: "Software Developer", label: "Software Developer" },
                        { id: "Mobile App Developer", label: "Mobile App Developer" },
                        { id: "Other", label: "Other" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedCategory(item.id)}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            selectedCategory.toLowerCase() === item.id.toLowerCase()
                              ? "bg-blue-50/80 border-[#0284C7] text-[#0284C7] font-bold shadow-xs"
                              : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              selectedCategory.toLowerCase() === item.id.toLowerCase()
                                ? "border-[#0284C7] bg-[#0284C7]"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {selectedCategory.toLowerCase() === item.id.toLowerCase() && (
                              <div className="size-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Job Type */}
              {(!filterSearchQuery || "3. job type work full time part time permanent temporary daily wage contract work from home".includes(filterSearchQuery.toLowerCase())) && (
                <div className="rounded-2xl border border-slate-200/90 bg-white hover:border-[#0284C7]/50 shadow-xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 3 ? null : 3)}
                    className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-[#0A2540]">3. Job Type</p>
                        {selectedJobType !== "all" && (
                          <span className="size-2 rounded-full bg-[#0284C7]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedJobType !== "all"
                          ? [
                              { id: "full", label: "Full Time" },
                              { id: "part", label: "Part Time" },
                              { id: "permanent", label: "Permanent" },
                              { id: "temporary", label: "Temporary" },
                              { id: "daily", label: "Daily Wage" },
                              { id: "contract", label: "Contract" },
                              { id: "wfh", label: "Work From Home" },
                            ].find((o) => o.id === selectedJobType)?.label || selectedJobType
                          : "7 options"}
                      </p>
                    </div>
                    <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          expandedSection === 3 ? "rotate-180 text-[#0284C7]" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expandedSection === 3 && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-150">
                      {[
                        { id: "all", label: "All Job Types" },
                        { id: "full", label: "Full Time" },
                        { id: "part", label: "Part Time" },
                        { id: "permanent", label: "Permanent" },
                        { id: "temporary", label: "Temporary" },
                        { id: "daily", label: "Daily Wage" },
                        { id: "contract", label: "Contract" },
                        { id: "wfh", label: "Work From Home" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedJobType(item.id)}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            selectedJobType === item.id
                              ? "bg-blue-50/80 border-[#0284C7] text-[#0284C7] font-bold shadow-xs"
                              : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              selectedJobType === item.id
                                ? "border-[#0284C7] bg-[#0284C7]"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {selectedJobType === item.id && <div className="size-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Location */}
              {(!filterSearchQuery || "4. location distance 5 km 10 km 25 km 50 km 100 km village city district pincode".includes(filterSearchQuery.toLowerCase())) && (
                <div className="rounded-2xl border border-slate-200/90 bg-white hover:border-[#0284C7]/50 shadow-xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 4 ? null : 4)}
                    className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-[#0A2540]">4. Location</p>
                        {selectedLocation !== "all" && (
                          <span className="size-2 rounded-full bg-[#0284C7]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedLocation !== "all"
                          ? [
                              { id: "5km", label: "5 km" },
                              { id: "10km", label: "10 km" },
                              { id: "25km", label: "25 km" },
                              { id: "50km", label: "50 km" },
                              { id: "100km", label: "100 km" },
                              { id: "village", label: "Village" },
                              { id: "city", label: "City" },
                              { id: "district", label: "District" },
                              { id: "pincode", label: "Pincode" },
                            ].find((o) => o.id === selectedLocation)?.label || selectedLocation
                          : "9 options"}
                      </p>
                    </div>
                    <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          expandedSection === 4 ? "rotate-180 text-[#0284C7]" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expandedSection === 4 && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-150">
                      {[
                        { id: "all", label: "All Locations" },
                        { id: "5km", label: "5 km" },
                        { id: "10km", label: "10 km" },
                        { id: "25km", label: "25 km" },
                        { id: "50km", label: "50 km" },
                        { id: "100km", label: "100 km" },
                        { id: "village", label: "Village" },
                        { id: "city", label: "City" },
                        { id: "district", label: "District" },
                        { id: "pincode", label: "Pincode" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedLocation(item.id)}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            selectedLocation === item.id
                              ? "bg-blue-50/80 border-[#0284C7] text-[#0284C7] font-bold shadow-xs"
                              : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              selectedLocation === item.id
                                ? "border-[#0284C7] bg-[#0284C7]"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {selectedLocation === item.id && (
                              <div className="size-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Salary */}
              {(!filterSearchQuery || "5. salary daily weekly monthly 10,000 15,000 20,000 30,000".includes(filterSearchQuery.toLowerCase())) && (
                <div className="rounded-2xl border border-slate-200/90 bg-white hover:border-[#0284C7]/50 shadow-xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 5 ? null : 5)}
                    className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-[#0A2540]">5. Salary</p>
                        {selectedSalary !== "all" && (
                          <span className="size-2 rounded-full bg-[#0284C7]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedSalary !== "all"
                          ? [
                              { id: "daily", label: "Daily" },
                              { id: "weekly", label: "Weekly" },
                              { id: "monthly", label: "Monthly" },
                              { id: "up-to-10k", label: "Up to ₹10,000" },
                              { id: "10k-15k", label: "₹10,000 - ₹15,000" },
                              { id: "15k-20k", label: "₹15,000 - ₹20,000" },
                              { id: "20k-30k", label: "₹20,000 - ₹30,000" },
                              { id: "above-30k", label: "More than ₹30,000" },
                            ].find((o) => o.id === selectedSalary)?.label || selectedSalary
                          : "8 options"}
                      </p>
                    </div>
                    <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          expandedSection === 5 ? "rotate-180 text-[#0284C7]" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expandedSection === 5 && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-150">
                      {[
                        { id: "all", label: "All Salaries" },
                        { id: "daily", label: "Daily" },
                        { id: "weekly", label: "Weekly" },
                        { id: "monthly", label: "Monthly" },
                        { id: "up-to-10k", label: "Up to ₹10,000" },
                        { id: "10k-15k", label: "₹10,000 - ₹15,000" },
                        { id: "15k-20k", label: "₹15,000 - ₹20,000" },
                        { id: "20k-30k", label: "₹20,000 - ₹30,000" },
                        { id: "above-30k", label: "More than ₹30,000" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedSalary(item.id)}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            selectedSalary === item.id
                              ? "bg-blue-50/80 border-[#0284C7] text-[#0284C7] font-bold shadow-xs"
                              : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              selectedSalary === item.id
                                ? "border-[#0284C7] bg-[#0284C7]"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {selectedSalary === item.id && (
                              <div className="size-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 6. Experience & Skills */}
              {(!filterSearchQuery || "6. experience skills fresher 6 months 2 years 5 years training license certificate".includes(filterSearchQuery.toLowerCase())) && (
                <div className="rounded-2xl border border-slate-200/90 bg-white hover:border-[#0284C7]/50 shadow-xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 6 ? null : 6)}
                    className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-[#0A2540]">6. Experience & Skills</p>
                        {selectedExperience !== "all" && (
                          <span className="size-2 rounded-full bg-[#0284C7]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedExperience !== "all"
                          ? [
                              { id: "fresher", label: "Fresher" },
                              { id: "up-to-6m", label: "Up to 6 Months" },
                              { id: "6m-2y", label: "6 Months - 2 Years" },
                              { id: "2y-5y", label: "2 - 5 Years" },
                              { id: "above-5y", label: "More than 5 Years" },
                              { id: "training", label: "Training Available" },
                              { id: "license", label: "License / Certificate" },
                            ].find((o) => o.id === selectedExperience)?.label || selectedExperience
                          : "7 options"}
                      </p>
                    </div>
                    <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          expandedSection === 6 ? "rotate-180 text-[#0284C7]" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expandedSection === 6 && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-150">
                      {[
                        { id: "all", label: "All Experience & Skills" },
                        { id: "fresher", label: "Fresher" },
                        { id: "up-to-6m", label: "Up to 6 Months" },
                        { id: "6m-2y", label: "6 Months - 2 Years" },
                        { id: "2y-5y", label: "2 - 5 Years" },
                        { id: "above-5y", label: "More than 5 Years" },
                        { id: "training", label: "Training Available" },
                        { id: "license", label: "License / Certificate" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedExperience(item.id)}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            selectedExperience === item.id
                              ? "bg-blue-50/80 border-[#0284C7] text-[#0284C7] font-bold shadow-xs"
                              : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              selectedExperience === item.id
                                ? "border-[#0284C7] bg-[#0284C7]"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {selectedExperience === item.id && (
                              <div className="size-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 7. Shift */}
              {(!filterSearchQuery || "7. shift timing day night rotational 8 hours 12 hours flexible timing overtime".includes(filterSearchQuery.toLowerCase())) && (
                <div className="rounded-2xl border border-slate-200/90 bg-white hover:border-[#0284C7]/50 shadow-xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 7 ? null : 7)}
                    className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-[#0A2540]">7. Shift</p>
                        {selectedShift !== "all" && (
                          <span className="size-2 rounded-full bg-[#0284C7]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedShift !== "all"
                          ? [
                              { id: "Day Shift", label: "Day Shift" },
                              { id: "Night Shift", label: "Night Shift" },
                              { id: "Rotational Shift", label: "Rotational Shift" },
                              { id: "8 Hours", label: "8 Hours" },
                              { id: "12 Hours", label: "12 Hours" },
                              { id: "Flexible Timing", label: "Flexible Timing" },
                              { id: "Overtime", label: "Overtime" },
                            ].find((o) => o.id === selectedShift)?.label || selectedShift
                          : "7 options"}
                      </p>
                    </div>
                    <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          expandedSection === 7 ? "rotate-180 text-[#0284C7]" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expandedSection === 7 && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-150">
                      {[
                        { id: "all", label: "All Shifts" },
                        { id: "Day Shift", label: "Day Shift" },
                        { id: "Night Shift", label: "Night Shift" },
                        { id: "Rotational Shift", label: "Rotational Shift" },
                        { id: "8 Hours", label: "8 Hours" },
                        { id: "12 Hours", label: "12 Hours" },
                        { id: "Flexible Timing", label: "Flexible Timing" },
                        { id: "Overtime", label: "Overtime" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedShift(item.id)}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            selectedShift === item.id
                              ? "bg-blue-50/80 border-[#0284C7] text-[#0284C7] font-bold shadow-xs"
                              : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              selectedShift === item.id
                                ? "border-[#0284C7] bg-[#0284C7]"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {selectedShift === item.id && (
                              <div className="size-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 8. Facilities */}
              {(!filterSearchQuery || "8. facilities accommodation food meals travel transport pf esic bonus overtime pay".includes(filterSearchQuery.toLowerCase())) && (
                <div className="rounded-2xl border border-slate-200/90 bg-white hover:border-[#0284C7]/50 shadow-xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 8 ? null : 8)}
                    className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-[#0A2540]">8. Facilities</p>
                        {selectedFacility !== "all" && (
                          <span className="size-2 rounded-full bg-[#0284C7]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedFacility !== "all"
                          ? [
                              { id: "accommodation", label: "Accommodation" },
                              { id: "food", label: "Food / Meals" },
                              { id: "travel", label: "Travel / Transport" },
                              { id: "pf", label: "PF" },
                              { id: "esic", label: "ESIC" },
                              { id: "bonus", label: "Bonus" },
                              { id: "overtime", label: "Overtime Pay" },
                            ].find((o) => o.id === selectedFacility)?.label || selectedFacility
                          : "7 options"}
                      </p>
                    </div>
                    <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          expandedSection === 8 ? "rotate-180 text-[#0284C7]" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expandedSection === 8 && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-150">
                      {[
                        { id: "all", label: "All Facilities" },
                        { id: "accommodation", label: "Accommodation" },
                        { id: "food", label: "Food / Meals" },
                        { id: "travel", label: "Travel / Transport" },
                        { id: "pf", label: "PF" },
                        { id: "esic", label: "ESIC" },
                        { id: "bonus", label: "Bonus" },
                        { id: "overtime", label: "Overtime Pay" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedFacility(item.id)}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            selectedFacility === item.id
                              ? "bg-blue-50/80 border-[#0284C7] text-[#0284C7] font-bold shadow-xs"
                              : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              selectedFacility === item.id
                                ? "border-[#0284C7] bg-[#0284C7]"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {selectedFacility === item.id && (
                              <div className="size-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 9. Job Status */}
              {(!filterSearchQuery || "9. job status availability work available today urgent hiring new jobs immediate joining verified company".includes(filterSearchQuery.toLowerCase())) && (
                <div className="rounded-2xl border border-slate-200/90 bg-white hover:border-[#0284C7]/50 shadow-xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 9 ? null : 9)}
                    className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-[#0A2540]">9. Job Status</p>
                        {selectedJobStatus !== "all" && (
                          <span className="size-2 rounded-full bg-[#0284C7]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedJobStatus !== "all"
                          ? [
                              { id: "today", label: "Work Available Today" },
                              { id: "urgent", label: "Urgent Hiring" },
                              { id: "new", label: "New Jobs" },
                              { id: "immediate", label: "Immediate Joining" },
                              { id: "verified", label: "Verified Company" },
                            ].find((o) => o.id === selectedJobStatus)?.label || selectedJobStatus
                          : "5 options"}
                      </p>
                    </div>
                    <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          expandedSection === 9 ? "rotate-180 text-[#0284C7]" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expandedSection === 9 && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-150">
                      {[
                        { id: "all", label: "All Job Status" },
                        { id: "today", label: "Work Available Today" },
                        { id: "urgent", label: "Urgent Hiring" },
                        { id: "new", label: "New Jobs" },
                        { id: "immediate", label: "Immediate Joining" },
                        { id: "verified", label: "Verified Company" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedJobStatus(item.id)}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            selectedJobStatus === item.id
                              ? "bg-blue-50/80 border-[#0284C7] text-[#0284C7] font-bold shadow-xs"
                              : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              selectedJobStatus === item.id
                                ? "border-[#0284C7] bg-[#0284C7]"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {selectedJobStatus === item.id && (
                              <div className="size-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 10. Sort By */}
              {(!filterSearchQuery || "10. sort by nearest highest salary newest matching my skills saved jobs".includes(filterSearchQuery.toLowerCase())) && (
                <div className="rounded-2xl border border-slate-200/90 bg-white hover:border-[#0284C7]/50 shadow-xs transition-all overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 10 ? null : 10)}
                    className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-[#0A2540]">10. Sort By</p>
                        {sortOption !== "default" && (
                          <span className="size-2 rounded-full bg-[#0284C7]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {sortOption !== "default"
                          ? [
                              { id: "nearest", label: "Nearest Work" },
                              { id: "salary-high", label: "Highest Salary" },
                              { id: "newest", label: "Newest Jobs" },
                              { id: "skills", label: "Matching My Skills" },
                              { id: "saved", label: "Saved Jobs" },
                            ].find((o) => o.id === sortOption)?.label || sortOption
                          : "5 options"}
                      </p>
                    </div>
                    <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          expandedSection === 10 ? "rotate-180 text-[#0284C7]" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {expandedSection === 10 && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 space-y-1.5 animate-in fade-in duration-150">
                      {[
                        { id: "default", label: "Default" },
                        { id: "nearest", label: "Nearest Work" },
                        { id: "salary-high", label: "Highest Salary" },
                        { id: "newest", label: "Newest Jobs" },
                        { id: "skills", label: "Matching My Skills" },
                        { id: "saved", label: "Saved Jobs" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSortOption(item.id as any)}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            sortOption === item.id
                              ? "bg-blue-50/80 border-[#0284C7] text-[#0284C7] font-bold shadow-xs"
                              : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div
                            className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              sortOption === item.id
                                ? "border-[#0284C7] bg-[#0284C7]"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {sortOption === item.id && (
                              <div className="size-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Action Footer */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/90 flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer text-center"
              >
                View Jobs {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ABOUT MODAL ================= */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Info className="size-5 text-[#0284C7]" />
                <h4 className="font-black text-base text-[#0A2540]">About REAL JOB</h4>
              </div>
              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4.5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              <strong>REAL JOB</strong> (Expertskill Technology) is India's trusted industrial recruitment, skilled blue-collar job portal, and workforce payroll platform.
            </p>
            <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 text-xs font-semibold text-[#0F3666] space-y-1">
              <p>📍 Location: Ichalkaranji & across Maharashtra / India</p>
              <p>📞 Helpline: +91-9964216090</p>
              <p>🛡️ 100% Verified Industrial Jobs — No Application Fees</p>
            </div>
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#0284C7] text-white font-extrabold text-xs cursor-pointer hover:bg-[#0369A1]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= SWITCH MODAL ================= */}
      {isSwitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-[#DCE5F0] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="size-5 text-[#0284C7]" />
                <h3 className="font-black text-base text-[#0A2540]">
                  {lang === "mr" ? "पोर्टल बदला (Switch)" : "Switch Portal"}
                </h3>
              </div>
              <button
                onClick={() => setIsSwitchModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* 1. Seeker (Job Finder) Option - Dashboard nko, Seeker hawa */}
              <button
                type="button"
                onClick={() => {
                  setIsSwitchModalOpen(false);
                  navigate({ to: "/auth", search: { mode: "login", role: "worker" } as any });
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/90 hover:border-[#0284C7] hover:bg-blue-50/40 transition-all text-left cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-2xl bg-[#E8F2FD] text-[#0284C7] flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform shadow-xs">
                    🔎
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#0A2540]">Seeker</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {lang === "mr" ? "नोकरी शोधणारा (Open Seeker Login)" : "Open Seeker Login"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-slate-400 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* 2. Employee (Punch In / Punch Out) Option */}
              <button
                type="button"
                onClick={() => {
                  setIsSwitchModalOpen(false);
                  navigate({ to: "/auth", search: { mode: "login", role: "employee" } as any });
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-2xl bg-[#DCFCE7] text-emerald-600 flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform shadow-xs">
                    👷
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#0A2540]">Employee</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {lang === "mr" ? "पंच इन आणि पंच आउट (Punch In & Out)" : "Open Employee Login"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* 3. Job Posted Option */}
              <button
                type="button"
                onClick={() => {
                  setIsSwitchModalOpen(false);
                  navigate({ to: "/auth", search: { mode: "login", role: "employer" } as any });
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/90 hover:border-purple-500 hover:bg-purple-50/40 transition-all text-left cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-2xl bg-[#F3E8FF] text-purple-600 flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform shadow-xs">
                    💼
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#0A2540]">Job Posted</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {lang === "mr" ? "जॉब पोस्ट करणारा (Employer Login)" : "Open Job Post / Employer Login"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
