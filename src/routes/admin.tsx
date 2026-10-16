import { useState, useEffect, Fragment, useMemo, useTransition } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import SalarySlip from "../components/SalarySlip";
import {
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  Building2,
  WalletCards,
  Plus,
  Trash2,
  Edit,
  Edit3,
  Search,
  BarChart3,
  FileText,
  Sparkles,
  Zap,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Package,
  Check,
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
  UserPlus,
  DollarSign,
  Calendar,
  Phone,
  User,
  XCircle,
  Layers,
  Filter,
  Download,
  Printer,
  PieChart,
  CalendarDays,
  Bell,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  ExternalLink,
  Menu,
  IndianRupee,
  MessageCircle,
  LocateFixed,
  Navigation,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseMapCoordinates } from "@/lib/location-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/portal/Stats";
import {
  dataStore,
  DataStoreManager,
  JobRecord,
  ApplicationRecord,
  EmployerWorker,
  DailyAttendanceRecord,
  UserRole,
} from "@/lib/data-store";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function parseTimeStringToMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (!match || !match[1] || !match[2]) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3];

  if (meridiem) {
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
  }
  return hours * 60 + minutes;
}

function formatTime12Hr(timeStr?: string): string {
  if (!timeStr) return "";
  const clean = timeStr.trim();
  if (!clean) return "";
  if (/AM|PM/i.test(clean)) return clean;
  const parts = clean.split(":");
  if (parts.length < 2) return clean;
  let hours = parseInt(parts[0]!, 10);
  const minutes = parts[1]!.padStart(2, "0");
  if (isNaN(hours)) return clean;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hoursStr = hours.toString().padStart(2, "0");
  return `${hoursStr}:${minutes} ${ampm}`;
}

function computeHoursFromTimes(startStr?: string, endStr?: string): number {
  if (!startStr || !endStr) return 9;
  const start = parseTimeStringToMinutes(startStr);
  const end = parseTimeStringToMinutes(endStr);
  if (start !== null && end !== null && end > start) {
    const diff = end - start;
    return Math.round((diff / 60) * 10) / 10;
  }
  return 9;
}

function calculateWorkAndOvertime(
  punchInTime?: string,
  punchOutTime?: string,
  standardShiftMinutes: number = 540 // Standard 9 hours (9:00 AM - 6:00 PM)
) {
  if (!punchInTime) {
    return {
      statusText: "Not Punched In",
      workedText: "--",
      overtimeText: null,
      totalMinutes: 0,
      overtimeMinutes: 0,
      isCurrentlyWorking: false,
    };
  }

  const inMins = parseTimeStringToMinutes(punchInTime);
  if (inMins === null) {
    return {
      statusText: "Invalid Punch In",
      workedText: "--",
      overtimeText: null,
      totalMinutes: 0,
      overtimeMinutes: 0,
      isCurrentlyWorking: false,
    };
  }

  let outMins: number | null = null;
  let isCurrentlyWorking = false;

  if (punchOutTime) {
    outMins = parseTimeStringToMinutes(punchOutTime);
  }

  // If punchOutTime is earlier than punchInTime (stale punchOut from re-punching in on same day), ignore stale punchOut
  if (outMins !== null && outMins < inMins) {
    outMins = null;
  }

  if (outMins === null) {
    const now = new Date();
    outMins = now.getHours() * 60 + now.getMinutes();
    isCurrentlyWorking = true;
  } else {
    isCurrentlyWorking = false;
  }

  const diffMins = Math.max(0, outMins - inMins);
  const workHrs = Math.floor(diffMins / 60);
  const workMins = diffMins % 60;

  let workedText = "";
  if (workHrs > 0 && workMins > 0) {
    workedText = `${workHrs} hr${workHrs > 1 ? "s" : ""} ${workMins} min${workMins > 1 ? "s" : ""}`;
  } else if (workHrs > 0) {
    workedText = `${workHrs} hr${workHrs > 1 ? "s" : ""}`;
  } else {
    workedText = `${workMins} min${workMins > 1 ? "s" : ""}`;
  }

  const otDiff = diffMins - standardShiftMinutes;
  let overtimeText: string | null = null;
  let overtimeMinutes = 0;

  if (otDiff > 0) {
    overtimeMinutes = otDiff;
    const otHrs = Math.floor(otDiff / 60);
    const otMins = otDiff % 60;
    if (otHrs > 0 && otMins > 0) {
      overtimeText = `${otHrs} hr${otHrs > 1 ? "s" : ""} ${otMins} min${otMins > 1 ? "s" : ""}`;
    } else if (otHrs > 0) {
      overtimeText = `${otHrs} hr${otHrs > 1 ? "s" : ""}`;
    } else {
      overtimeText = `${otMins} min${otMins > 1 ? "s" : ""}`;
    }
  }

  return {
    statusText: isCurrentlyWorking ? "Working Now (Active)" : "Shift Completed",
    workedText,
    overtimeText,
    totalMinutes: diffMins,
    overtimeMinutes,
    isCurrentlyWorking,
  };
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Employer Portal & Control Dashboard — REAL JOB" },
      { name: "description", content: "Employer dashboard, job control panel, candidate application manager, and hiring portal." },
    ],
  }),
  component: AdminDashboardPage,
});

const monthlyAnalytics = [
  { month: "May", workers: 0, jobs: 0, hires: 0 },
  { month: "Jun", workers: 0, jobs: 0, hires: 0 },
  { month: "Jul", workers: 0, jobs: 0, hires: 0 },
  { month: "Aug", workers: 0, jobs: 0, hires: 0 },
  { month: "Sep", workers: 0, jobs: 0, hires: 0 },
];



function formatWaNumber(phone: string): string {
  const raw = (phone || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "919822011223";
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return digits.length >= 10 ? digits : `91${digits}`;
}

function formatCallNumber(phone: string): string {
  const raw = (phone || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "+919822011223";
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  return raw.startsWith("+") ? raw : `+${digits}`;
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { t, n } = useI18n();

  const [activeTabState, setActiveTabState] = useState<"overview" | "jobs" | "applications" | "attendance" | "salary" | "packages" | "profile">("overview");
  const [isPendingTab, startTransitionTab] = useTransition();

  const activeTab = activeTabState;
  const setActiveTab = (tab: "overview" | "jobs" | "applications" | "attendance" | "salary" | "packages" | "profile" | any) => {
    startTransitionTab(() => {
      setActiveTabState(tab);
    });
  };

  // Data states
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [jobsPage, setJobsPage] = useState(1);
  const JOBS_PER_PAGE = 5;
  const [appSearch, setAppSearch] = useState("");
  const [filterJobId, setFilterJobId] = useState<string | null>(null);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [viewSlipWorker, setViewSlipWorker] = useState<EmployerWorker | null>(null);
  const [viewSlipPeriod, setViewSlipPeriod] = useState<"week" | "month">("month");

  // Attendance & Worker Management States
  const [workers, setWorkers] = useState<EmployerWorker[]>([]);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]!
  );
  const [dailyAttendanceRecords, setDailyAttendanceRecords] = useState<DailyAttendanceRecord[]>([]);
  const [workerSearch, setWorkerSearch] = useState("");
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationLinkInput, setLocationLinkInput] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);

  // Individual Worker Attendance Calendar Modal State
  const [calendarWorker, setCalendarWorker] = useState<EmployerWorker | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<number>(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(() => new Date().getFullYear());
  const [activeCalendarDate, setActiveCalendarDate] = useState<string | null>(null);
  const [customOtHoursInput, setCustomOtHoursInput] = useState<number>(2);
  const [overtimeModalDate, setOvertimeModalDate] = useState<string | null>(null);
  const [overtimeModalHours, setOvertimeModalHours] = useState<number>(3);
  const [showBulkFillSection, setShowBulkFillSection] = useState(false);
  const [bulkFillStatus, setBulkFillStatus] = useState<"Present" | "HalfDay" | "Absent" | "Overtime">("Present");
  const [bulkFillOtHours, setBulkFillOtHours] = useState<number>(2);
  const [bulkFillFromDate, setBulkFillFromDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split("T")[0]!;
  });
  const [bulkFillToDate, setBulkFillToDate] = useState<string>(() => new Date().toISOString().split("T")[0]!);
  const [bulkSkipSundays, setBulkSkipSundays] = useState<boolean>(true);

  // Category & Reports Sub-States
  const [attendanceSubView, setAttendanceSubView] = useState<"daily" | "reports" | "directory">("daily");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const [reportTimeframe, setReportTimeframe] = useState<"week" | "month" | "custom">("month");
  const [reportStartDate, setReportStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split("T")[0]!;
  });
  const [reportEndDate, setReportEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]!
  );
  const [reportAttendanceRecords, setReportAttendanceRecords] = useState<DailyAttendanceRecord[]>([]);

  // Worker Individual Report & Salary Slip states
  const [selectedWorkerReport, setSelectedWorkerReport] = useState<EmployerWorker | null>(null);
  const [workerReportPeriod, setWorkerReportPeriod] = useState<"week" | "month" | "all">("month");
  const [selectedSalaryWorkerId, setSelectedSalaryWorkerId] = useState<string | null>(null);
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState<string>(() => {
    return new Date().toLocaleDateString("en-US", { month: "long" });
  });
  const [selectedSalaryYear, setSelectedSalaryYear] = useState<string>(() => {
    return new Date().getFullYear().toString();
  });
  const [slipRangeStartDay, setSlipRangeStartDay] = useState<number>(10);
  const [slipRangeEndDay, setSlipRangeEndDay] = useState<number>(20);

  const [workerForm, setWorkerForm] = useState({
    name: "",
    mobile: "",
    trade: "General Worker",
    category: "Plant Nursery & Care",
    education: "",
    dailyRate: "500",
    joiningDate: new Date().toISOString().split("T")[0]!,
    workShiftStart: "09:00",
    workShiftEnd: "18:00",
    dailyWorkingHours: "9",
    overtimeRate: "56",
    overtimeRateMode: "auto" as "auto" | "manual",
    notes: "",
    pin: "1234",
    locationType: "fixed" as "fixed" | "field",
    attendanceMode: "punch" as "punch" | "manual",
  });

  // Dynamic Custom Fields State (With Persistence across sessions)
  const [persistentCustomFields, setPersistentCustomFields] = useState<Array<{ label: string; value: string }>>(() => {
    try {
      const saved = localStorage.getItem(`emp_custom_fields_tpl_${empIdentifier}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [customFields, setCustomFields] = useState<Array<{ label: string; value: string }>>([]);
  const [showAddFieldPrompt, setShowAddFieldPrompt] = useState(false);
  const [newFieldNameInput, setNewFieldNameInput] = useState("");
  const [removedStandardFields, setRemovedStandardFields] = useState<string[]>([]);

  // Custom Departments / Categories State (Persisted across sessions)
  const getStoredCustomCats = () => {
    try {
      const s1 = localStorage.getItem(`emp_custom_cats_${empIdentifier}`);
      const s2 = localStorage.getItem("emp_custom_cats_global");
      const set = new Set<string>();
      if (s1) JSON.parse(s1).forEach((c: string) => set.add(c));
      if (s2) JSON.parse(s2).forEach((c: string) => set.add(c));
      return Array.from(set);
    } catch {
      return [];
    }
  };

  const [customCategories, setCustomCategories] = useState<string[]>(getStoredCustomCats);

  // Removed Standard & Custom Categories State (Persisted)
  const getStoredRemovedCats = () => {
    try {
      const s1 = localStorage.getItem(`emp_removed_cats_${empIdentifier}`);
      const s2 = localStorage.getItem("emp_removed_cats_global");
      const set = new Set<string>();
      if (s1) JSON.parse(s1).forEach((c: string) => set.add(c));
      if (s2) JSON.parse(s2).forEach((c: string) => set.add(c));
      return Array.from(set);
    } catch {
      return [];
    }
  };

  const [removedCategories, setRemovedCategories] = useState<string[]>(getStoredRemovedCats);
  const [showOtherCategoryInput, setShowOtherCategoryInput] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [newCustomCategoryInput, setNewCustomCategoryInput] = useState("");

  const handleAddCustomCategory = () => {
    const trimmed = newCustomCategoryInput.trim();
    if (!trimmed) {
      toast.error("Please enter department / category name");
      return;
    }
    const catName = trimmed.startsWith("✨") || trimmed.startsWith("🌱") || trimmed.startsWith("🚜") || trimmed.startsWith("⚙️") ? trimmed : `✨ ${trimmed}`;
    const updated = Array.from(new Set([...customCategories, catName]));
    setCustomCategories(updated);
    setRemovedCategories((prev) => prev.filter((c) => c !== catName));
    try {
      localStorage.setItem(`emp_custom_cats_${empIdentifier}`, JSON.stringify(updated));
      localStorage.setItem("emp_custom_cats_global", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setWorkerForm((p) => ({ ...p, category: catName }));
    toast.success(`Category "${catName}" added & selected!`);
    setNewCustomCategoryInput("");
    setShowOtherCategoryInput(false);
  };

  const handleRemoveCategory = (catToRemove: string) => {
    if (customCategories.includes(catToRemove)) {
      const updatedCustom = customCategories.filter((c) => c !== catToRemove);
      setCustomCategories(updatedCustom);
      try {
        localStorage.setItem(`emp_custom_cats_${empIdentifier}`, JSON.stringify(updatedCustom));
        localStorage.setItem("emp_custom_cats_global", JSON.stringify(updatedCustom));
      } catch (e) {
        console.error(e);
      }
    } else {
      const updatedRemoved = Array.from(new Set([...removedCategories, catToRemove]));
      setRemovedCategories(updatedRemoved);
      try {
        localStorage.setItem(`emp_removed_cats_${empIdentifier}`, JSON.stringify(updatedRemoved));
        localStorage.setItem("emp_removed_cats_global", JSON.stringify(updatedRemoved));
      } catch (e) {
        console.error(e);
      }
    }

    if (workerForm.category === catToRemove) {
      const allPossible = [
        ...getIndustryDefaultCategories(),
        ...customCategories,
        "⚙️ Other / Custom",
      ];
      const remaining = allPossible.filter((c) => c !== catToRemove && !removedCategories.includes(c));
      setWorkerForm((p) => ({ ...p, category: remaining[0] || getIndustryDefaultCategories()[0] || "General Work" }));
    }
    toast.info(`Category "${catToRemove}" removed`);
  };

  const savePersistentCustomFields = (fields: Array<{ label: string; value: string }>) => {
    setPersistentCustomFields(fields);
    try {
      localStorage.setItem(`emp_custom_fields_tpl_${empIdentifier}`, JSON.stringify(fields.map(f => ({ label: f.label, value: "" }))));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveStandardField = (fieldKey: string) => {
    setRemovedStandardFields((prev) => [...prev, fieldKey]);
    toast.info("Field removed from form");
  };

  const handleRestoreStandardField = (fieldKey: string) => {
    setRemovedStandardFields((prev) => prev.filter((k) => k !== fieldKey));
    toast.success("Field restored to form");
  };

  const handleOpenAddFieldPrompt = () => {
    setNewFieldNameInput("");
    setShowAddFieldPrompt(true);
  };

  const handleConfirmAddCustomField = (presetName?: string) => {
    const fieldName = (presetName || newFieldNameInput).trim();
    if (!fieldName) {
      toast.error("Please enter a field title (e.g. Aadhaar Card ID)");
      return;
    }
    const updated = [...customFields, { label: fieldName, value: "" }];
    setCustomFields(updated);
    savePersistentCustomFields(updated);
    toast.success(`"${fieldName}" added to form!`);
    setNewFieldNameInput("");
    setShowAddFieldPrompt(false);
  };

  const handleRemoveCustomField = (index: number) => {
    const updated = customFields.filter((_, i) => i !== index);
    setCustomFields(updated);
    savePersistentCustomFields(updated);
    toast.info("Custom field removed");
  };

  const handleCustomFieldChange = (index: number, key: "label" | "value", val: string) => {
    setCustomFields((prev) => {
      const copy = [...prev];
      const existing = copy[index];
      if (existing) {
        copy[index] = { ...existing, [key]: val };
      }
      return copy;
    });
  };

  // Auto-detect employer's industry from company name or profile
  const detectEmployerIndustry = (): string => {
    const text = `${currentUser?.fullName || ""} ${currentUser?.email || ""} ${empIdentifier || ""} ${profileForm?.industry || ""}`.toLowerCase();

    if (
      text.includes("itpl") ||
      text.includes("software") ||
      text.includes("technology") ||
      text.includes("tech") ||
      text.includes("it ") ||
      text.includes(" bpo") ||
      text.includes("computer") ||
      text.includes("digital") ||
      text.includes("infosys") ||
      text.includes("tcs")
    ) {
      return "it_software";
    }

    if (
      text.includes("construction") ||
      text.includes("builder") ||
      text.includes("developer") ||
      text.includes("infrastructure") ||
      text.includes("कंत्राटदार") ||
      text.includes("कंत्राटदार") ||
      text.includes("vaje")
    ) {
      return "construction";
    }

    if (
      text.includes("factory") ||
      text.includes("manufacturing") ||
      text.includes("auto") ||
      text.includes("steel") ||
      text.includes("pipes") ||
      text.includes("engineering")
    ) {
      return "factory";
    }

    if (
      text.includes("hotel") ||
      text.includes("restaurant") ||
      text.includes("caterer") ||
      text.includes("resort") ||
      text.includes("food")
    ) {
      return "hospitality";
    }

    if (
      text.includes("hospital") ||
      text.includes("clinic") ||
      text.includes("medical") ||
      text.includes("pharma") ||
      text.includes("health")
    ) {
      return "healthcare";
    }

    if (
      text.includes("nursery") ||
      text.includes("ropvatika") ||
      text.includes("farm") ||
      text.includes("krushi") ||
      text.includes("agri") ||
      text.includes("plant") ||
      text.includes("कंत्राटदार")
    ) {
      return "agriculture";
    }

    return "general";
  };

  const getIndustryDefaultCategories = (): string[] => {
    const indType = detectEmployerIndustry();

    const categoriesMap: Record<string, string[]> = {
      construction: [
        "🧱 Masonry & Brickwork",
        "⚡ Electrical & Wiring",
        "🔧 Plumbing & Piping",
        "🪵 Carpentry & Woodwork",
        "🎨 Painting & Finishing",
        "👷 General Labour & Helper",
      ],
      factory: [
        "⚙️ Machine Operator",
        "🔧 Quality & Assembly",
        "📦 Packing & Warehouse",
        "👷 Helper & Maintenance",
        "🚛 Loading & Unloading",
      ],
      hospitality: [
        "👨‍🍳 Chef & Kitchen Staff",
        "🍽️ Waiter & Food Service",
        "🧹 Housekeeping & Cleaning",
        "🛎️ Reception & Billing",
        "🛡️ Security & Support",
      ],
      healthcare: [
        "🩺 Nursing & Patient Care",
        "💊 Pharmacy & Medical Support",
        "🔬 Lab Technician",
        "🧹 Sanitation & Cleaning",
        "🛡️ Security & Maintenance",
      ],
      it_software: [
        "💻 Software Developer / Engineer",
        "🎨 UI/UX Designer",
        "📊 Data Analyst",
        "📞 BPO / Call Center Executive",
        "📈 Sales & Marketing",
        "👥 HR & Administration",
        "🖥️ System Admin / IT Support",
        "💼 Project Manager",
      ],
      agriculture: [
        "🌱 Plant Nursery & Care",
        "🚜 Tractor & Machinery",
        "✂️ Grafting & Propagation",
        "📦 Packing & Loading",
        "💧 Irrigation & Spraying",
        "🌿 Soil & Fertilizer",
        "👷 General Labour",
      ]
    };

    const generalCategories = [
      "💼 Office Staff & Admin",
      "🚛 Logistics & Transport",
      "🧹 Cleaning & Housekeeping",
      "🛡️ Security Guard",
    ];

    let combinedResults: string[] = [];

    // 1. First, push the detected industry categories
    if (indType !== "general" && categoriesMap[indType]) {
      combinedResults.push(...categoriesMap[indType]);
    }

    // 2. Second, push the general categories
    combinedResults.push(...generalCategories);

    // 3. Finally, push ALL other categories so the user can just scroll down if detection was wrong!
    Object.keys(categoriesMap).forEach(key => {
      if (key !== indType) {
        combinedResults.push(...(categoriesMap[key] || []));
      }
    });

    // Remove duplicates just in case
    return Array.from(new Set(combinedResults));
  };

  // Category display cleaner helper
  const formatCategoryName = (cat?: string) => {
    if (!cat) return getIndustryDefaultCategories()[0] || "General Work";
    const cleaned = cat
      .replace(/[\u1000-\uFFFF]/g, "")
      .replace(/• /g, "")
      .trim();
    return cleaned || cat;

  };
  const getWorkerReportMetrics = (
    worker: EmployerWorker, 
    period: "week" | "month" | "all",
    targetMonthName?: string,
    targetYearStr?: string,
    customStartDate?: string,
    customEndDate?: string
  ) => {
    let startDate = "";
    let endDate = "";
    const now = new Date();

    const activeEmpId = currentUser?.id || currentUser?.fullName || currentUser?.email || empIdentifier;

    const monthMap: Record<string, number> = {
      January: 0, February: 1, March: 2, April: 3,
      May: 4, June: 5, July: 6, August: 7,
      September: 8, October: 9, November: 10, December: 11
    };

    const effectiveMonthName = targetMonthName || selectedSalaryMonth || now.toLocaleDateString("en-US", { month: "long" });
    const effectiveYearStr = targetYearStr || selectedSalaryYear || String(now.getFullYear());
    const mIdx = monthMap[effectiveMonthName] !== undefined ? monthMap[effectiveMonthName] : now.getMonth();
    const yVal = parseInt(effectiveYearStr, 10) || now.getFullYear();
    const daysInTargetMonth = new Date(yVal, mIdx + 1, 0).getDate();

    if (customStartDate && customEndDate) {
      startDate = customStartDate;
      endDate = customEndDate;
    } else if (period === "week") {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      startDate = d.toISOString().split("T")[0]!;
      endDate = now.toISOString().split("T")[0]!;
    } else if (period === "month") {
      startDate = `${yVal}-${String(mIdx + 1).padStart(2, "0")}-01`;
      endDate = `${yVal}-${String(mIdx + 1).padStart(2, "0")}-${String(daysInTargetMonth).padStart(2, "0")}`;
    } else {
      startDate = worker.joiningDate || "2020-01-01";
      endDate = `${yVal}-${String(mIdx + 1).padStart(2, "0")}-${String(daysInTargetMonth).padStart(2, "0")}`;
    }

    if (worker.joiningDate && period === "all" && worker.joiningDate > startDate) {
      startDate = worker.joiningDate;
    }

    const rangeRecords = dataStore.getEmployerAttendanceRange(activeEmpId, startDate, endDate);
    const workerRecords = rangeRecords.filter((r) => r.workerId === worker.id);

    let present = 0;
    let halfDay = 0;
    let absent = 0;
    let overtime = 0;
    let totalOvertimeHours = 0;
    let netPay = 0;
    const overtimeEntries: Array<{ date: string; day: number; overtimeHours: number }> = [];

    workerRecords.forEach((r) => {
      if (r.status === "Present") {
        present++;
        netPay += worker.dailyRate;
      } else if (r.status === "HalfDay") {
        halfDay++;
        netPay += Math.round(worker.dailyRate / 2);
      } else if (r.status === "Absent") {
        absent++;
      } else if (r.status === "Overtime") {
        present++; // Working overtime counts as Present on that day!
        overtime++;
        const otH = r.overtimeHours !== undefined ? Number(r.overtimeHours) : 2;
        totalOvertimeHours += otH;
        const dayNum = parseInt(r.date.split("-")[2] || "1", 10);
        overtimeEntries.push({ date: r.date, day: dayNum, overtimeHours: otH });
        const shiftH = computeHoursFromTimes(worker.workShiftStart, worker.workShiftEnd) || 9;
        const otHourlyRate = worker.overtimeRate !== undefined && worker.overtimeRate !== null && Number(worker.overtimeRate) > 0
          ? Number(worker.overtimeRate)
          : Math.round(worker.dailyRate / shiftH);
        netPay += Math.round(worker.dailyRate + (otH * otHourlyRate));
      }
    });

    overtimeEntries.sort((a, b) => a.day - b.day);

    return {
      startDate,
      endDate,
      records: workerRecords,
      present,
      halfDay,
      absent,
      overtime,
      overtimeEntries,
      totalOvertimeHours,
      totalDays: workerRecords.length,
      daysInMonth: daysInTargetMonth,
      netPay,
    };
  };

  const handleDownloadPDFSalarySlip = async (worker: EmployerWorker, period: "week" | "month" | "all") => {
    const metrics = getWorkerReportMetrics(worker, period);
    const periodLabel = period === "week" ? "Weekly (Last 7 Days)" : period === "month" ? "Monthly (Current Month)" : "All Time Records";
    const catName = formatCategoryName(worker.category || worker.trade);

    const employerName = currentUser?.fullName || currentUser?.email || "NURSERY & AGRICULTURAL SERVICES";
    const companyTitle = currentUser?.fullName
      ? `${currentUser.fullName.toUpperCase()} - NURSERY & WORKFORCE SERVICES`
      : "GREENWOOD PLANT NURSERY & WORKFORCE SERVICES";

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0px";
    container.style.width = "720px";
    container.style.background = "#FFFFFF";

    container.innerHTML = `
      <div style="width: 720px; padding: 24px; font-family: Arial, sans-serif; color: #1E293B; background: #FFFFFF; box-sizing: border-box; margin: 0 auto;">
        <!-- Company Banner Header -->
        <table style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #021D3D 0%, #063B78 60%, #0B52A8 100%); border-radius: 12px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 20px; vertical-align: middle;">
              <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #F59E0B; letter-spacing: 1.5px; margin-bottom: 4px;">🌱 {t("officialWorkforceSalarySlip")}</div>
              <h1 style="font-size: 20px; font-weight: 900; margin: 0; color: #FFFFFF; letter-spacing: -0.3px;">${companyTitle}</h1>
              <div style="font-size: 12px; margin-top: 6px; color: #DCE5F0;">
                Employer: <strong style="color: #FFFFFF;">${employerName}</strong> &bull; Work & Salary Settlement
              </div>
            </td>
            <td style="padding: 20px; text-align: right; vertical-align: middle; width: 190px;">
              <div style="background: rgba(255,255,255,0.15); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.25); text-align: right;">
                <div style="font-size: 9px; font-weight: bold; color: #E2E8F0; text-transform: uppercase;">{t("slipReference")}</div>
                <div style="font-size: 13px; font-weight: 900; color: #FFFFFF; font-family: monospace; margin-top: 2px;">PAY-${worker.id.slice(-6).toUpperCase()}</div>
              </div>
            </td>
          </tr>
        </table>

        <!-- Employee Contract & Workplace Info Table -->
        <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #CBD5E1; border-radius: 10px; background: #F8FAFC; margin-bottom: 20px;">
          <tr>
            <td colspan="2" style="padding: 10px 16px; font-size: 11px; font-weight: 900; color: #063B78; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #E2E8F0; background: #EFF6FF;">
              👤 EMPLOYEE CONTRACT & WORKPLACE DETAILS
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 16px; font-size: 12px; width: 50%; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">{t("employeeNameField")}</span> <strong style="color: #0F172A; font-weight: 800;">${worker.name}</strong>
            </td>
            <td style="padding: 8px 16px; font-size: 12px; width: 50%; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">{t("workOrgFirmField")}</span> <strong style="color: #063B78; font-weight: 800;">${companyTitle}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 16px; font-size: 12px; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">{t("departmentField")}</span> <strong style="color: #063B78; font-weight: 800; background: #DBEAFE; padding: 2px 6px; border-radius: 4px;">${catName}</strong>
            </td>
            <td style="padding: 8px 16px; font-size: 12px; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">{t("roleDesignationField")}</span> <strong style="color: #0F172A; font-weight: 700;">${worker.trade || "General Worker"}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 16px; font-size: 12px; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">{t("mobileNumberField")}</span> <strong style="color: #0F172A; font-weight: 700;">${worker.mobile || "N/A"}</strong>
            </td>
            <td style="padding: 8px 16px; font-size: 12px; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">{t("dailyRateField")}</span> <strong style="color: #059669; font-weight: 900; font-size: 13px;">₹${worker.dailyRate} / day</strong>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 8px 16px; font-size: 12px;">
              <span style="color: #64748B; font-weight: 600;">{t("reportTimeframeField")}</span> <strong style="color: #0F172A; font-weight: 700;">${periodLabel} (${metrics.startDate} to ${metrics.endDate})</strong>
            </td>
          </tr>
        </table>

        <!-- Attendance Metrics Grid Table -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 6px 0; margin-bottom: 20px;">
          <tr>
            <td style="width: 20%; background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 8px; padding: 10px 4px; text-align: center;">
              <div style="font-size: 9px; font-weight: 800; color: #166534; text-transform: uppercase;">{t("presentBadge")}</div>
              <div style="font-size: 20px; font-weight: 900; color: #15803D; margin-top: 2px;">${metrics.present}</div>
            </td>
            <td style="width: 20%; background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 8px; padding: 10px 4px; text-align: center;">
              <div style="font-size: 9px; font-weight: 800; color: #92400E; text-transform: uppercase;">{t("halfDayBadge")}</div>
              <div style="font-size: 20px; font-weight: 900; color: #B45309; margin-top: 2px;">${metrics.halfDay}</div>
            </td>
            <td style="width: 20%; background: #FFF1F2; border: 1.5px solid #FECDD3; border-radius: 8px; padding: 10px 4px; text-align: center;">
              <div style="font-size: 9px; font-weight: 800; color: #9F1239; text-transform: uppercase;">{t("absentBadge")}</div>
              <div style="font-size: 20px; font-weight: 900; color: #BE123C; margin-top: 2px;">${metrics.absent}</div>
            </td>
            <td style="width: 20%; background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 8px; padding: 10px 4px; text-align: center;">
              <div style="font-size: 9px; font-weight: 800; color: #1E40AF; text-transform: uppercase;">{t("overtimeBadge")}</div>
              <div style="font-size: 20px; font-weight: 900; color: #1D4ED8; margin-top: 2px;">${metrics.overtime}</div>
            </td>
            <td style="width: 20%; background: #F3E8FF; border: 1.5px solid #E9D5FF; border-radius: 8px; padding: 10px 4px; text-align: center;">
              <div style="font-size: 9px; font-weight: 800; color: #6B21A8; text-transform: uppercase;">{t("totalDaysBadge")}</div>
              <div style="font-size: 20px; font-weight: 900; color: #7E22CE; margin-top: 2px;">${metrics.totalDays}</div>
            </td>
          </tr>
        </table>

        <!-- Attendance History Table -->
        <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #CBD5E1; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
          <thead>
            <tr style="background: #063B78; color: #FFFFFF; font-size: 11px; font-weight: 800; text-transform: uppercase;">
              <th style="padding: 10px 12px; text-align: left; width: 25%;">{t("dateCol")}</th>
              <th style="padding: 10px 12px; text-align: left; width: 30%;">{t("attendanceStatusCol")}</th>
              <th style="padding: 10px 12px; text-align: left; width: 25%;">{t("dailyRateCol")}</th>
              <th style="padding: 10px 12px; text-align: right; width: 20%;">{t("earnedPayCol")}</th>
            </tr>
          </thead>
          <tbody style="font-size: 12px; font-weight: 600;">
            ${metrics.records.length === 0
        ? `<tr><td colspan="4" style="text-align:center; padding: 16px; color:#64748B;">{t("noAttendanceRecordsFound")}</td></tr>`
        : metrics.records.map((r, i) => {
          let pay = worker.dailyRate;
          if (r.status === "HalfDay") pay = Math.round(worker.dailyRate / 2);
          if (r.status === "Absent") pay = 0;
          if (r.status === "Overtime") {
            const otH = r.overtimeHours || 2;
            const shiftH = computeHoursFromTimes(worker.workShiftStart, worker.workShiftEnd) || 9;
            const otHourlyRate = worker.overtimeRate !== undefined && worker.overtimeRate !== null && Number(worker.overtimeRate) > 0
              ? Number(worker.overtimeRate)
              : Math.round(worker.dailyRate / shiftH);
            pay = worker.dailyRate + (otH * otHourlyRate);
          }
          const bg = i % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
          return `
                      <tr style="background: ${bg}; border-bottom: 1px solid #E2E8F0;">
                        <td style="padding: 8px 12px; font-weight: 700; color: #0F172A;">${r.date}</td>
                        <td style="padding: 8px 12px;">
                          <span style="font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px; ${r.status === "Present" ? "background:#DCFCE7; color:#15803D;" :
              r.status === "HalfDay" ? "background:#FEF3C7; color:#B45309;" :
                r.status === "Absent" ? "background:#FFE4E6; color:#BE123C;" : "background:#DBEAFE; color:#1D4ED8;"
            }">
                            ${r.status}
                          </span>
                        </td>
                        <td style="padding: 8px 12px; color: #64748B;">₹${worker.dailyRate} / day</td>
                        <td style="padding: 8px 12px; text-align: right; color:#059669; font-weight:900;">₹${pay}</td>
                      </tr>
                    `;
        }).join("")
      }
          </tbody>
        </table>

        <!-- Total Net Payable Settlement Table -->
        <table style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 2px solid #059669; border-radius: 10px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 16px 20px; vertical-align: middle;">
              <div style="font-size: 10px; font-weight: 900; color: #047857; text-transform: uppercase; letter-spacing: 1px;">{t("totalEarnedSalarySettlement")}</div>
              <div style="font-size: 12px; font-weight: 700; color: #065F46; margin-top: 2px;">Net payable wage amount calculated for ${worker.name}</div>
            </td>
            <td style="padding: 16px 20px; vertical-align: middle; text-align: right; width: 220px;">
              <div style="font-size: 10px; font-weight: 800; color: #047857; text-transform: uppercase;">{t("netPayableAmount")}</div>
              <div style="font-size: 28px; font-weight: 900; color: #047857; line-height: 1; margin-top: 2px;">₹${metrics.netPay.toLocaleString("en-IN")}</div>
            </td>
          </tr>
        </table>

        <!-- Official Signatures Footer Table -->
        <table style="width: 100%; border-collapse: collapse; border-top: 1.5px dashed #CBD5E1; padding-top: 14px; font-size: 11px; color: #64748B;">
          <tr>
            <td style="vertical-align: bottom; padding-top: 14px;">
              <div style="font-weight: bold; color: #063B78;">${companyTitle}</div>
              <div>Issued Date: ${new Date().toLocaleDateString("en-IN")}</div>
              <div style="font-size: 9px; color: #94A3B8; margin-top: 2px;">{t("computerGeneratedPayroll")}</div>
            </td>
            <td style="vertical-align: bottom; text-align: right; padding-top: 14px;">
              <div style="display: inline-block; text-align: center;">
                <div style="border: 1.5px dashed #94A3B8; border-radius: 4px; padding: 4px 12px; margin-bottom: 6px; font-size: 9px; color: #063B78; font-weight: bold; background: #F8FAFC;">
                   OFFICIAL STAMP
                </div>
                <div style="border-top: 1.5px solid #063B78; width: 160px; padding-top: 4px; font-weight: bold; color: #063B78;">{t("employerSignature")}</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `;

    document.body.appendChild(container);

    const fileName = `Salary_Slip_${worker.name.replace(/\s+/g, "_")}_${period}.pdf`;

    try {
      toast.info(`Generating high-quality PDF for ${worker.name}...`);
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const opt: any = {
        margin: [5, 5, 5, 5],
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 720 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      if (!container.firstElementChild) return;
      await html2pdf().set(opt).from(container.firstElementChild as HTMLElement).save();
      toast.success(`PDF downloaded: ${fileName}`);
    } catch (err) {
      console.error("PDF generation error, falling back", err);
      toast.error("Error creating PDF file.");
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  };

  const handleDownloadCSV = (worker: EmployerWorker, period: "week" | "month" | "all") => {
    const metrics = getWorkerReportMetrics(worker, period);
    let csv = `Date,Employee Name,Department,Daily Wage Rate (INR),Attendance Status,Calculated Pay (INR)\n`;

    metrics.records.forEach((r) => {
      let pay = worker.dailyRate;
      if (r.status === "HalfDay") pay = Math.round(worker.dailyRate / 2);
      if (r.status === "Absent") pay = 0;
      if (r.status === "Overtime") pay = Math.round(worker.dailyRate * 1.5);
      csv += `"${r.date}","${worker.name}","${formatCategoryName(worker.category || worker.trade)}",${worker.dailyRate},"${r.status}",${pay}\n`;
    });
    csv += `\nPERIOD SUMMARY,,,,,,\n`;
    csv += `Present Days,${metrics.present},,,,,,\n`;
    csv += `Half Days,${metrics.halfDay},,,,,,\n`;
    csv += `Absent Days,${metrics.absent},,,,,,\n`;
    csv += `Overtime Days,${metrics.overtime},,,,,,\n`;
    csv += `Net Total Payable Wages (INR),${metrics.netPay},,,,,,\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Salary_Slip_${worker.name.replace(/\s+/g, "_")}_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded salary slip for ${worker.name}`);
  };

  // Package & Credits states
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("plan-100");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessingPackage, setIsProcessingPackage] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User Accounts for Admin View (Live Dynamic Data)
  const [registeredUsers, setRegisteredUsers] = useState<
    Array<{ id: string; name: string; role: string; mobile: string; city: string; trade: string; status: string; createdAt?: string | undefined }>
  >([]);

  // Synchronous initialization prevents "admin-001" fallback during initial state setup
  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const fromStore = dataStore.getCurrentUser("employer") || dataStore.getCurrentUser("admin");
      if (fromStore) return fromStore;
      try {
        const backup = localStorage.getItem("realjob-employer-profile");
        if (backup) return JSON.parse(backup);
      } catch {}
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm((prev) => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        contactPerson: currentUser.contactPerson || currentUser.fullName || prev.fullName,
        email: currentUser.email || prev.email,
        mobile: currentUser.mobile || prev.mobile,
        profilePhoto: currentUser.profilePhoto || prev.profilePhoto,
        location: currentUser.location || prev.location,
        industry: currentUser.industry || prev.industry,
      }));
    }
  }, [currentUser]);

  // Authentication Guard - Redirect unauthenticated or non-employer users to Employer Login
  useEffect(() => {
    if (!currentUser || (currentUser.role !== "employer" && currentUser.role !== "admin")) {
      navigate({ to: "/auth", search: { mode: "login", role: "admin" }, replace: true });
    }
  }, [currentUser, navigate]);

  // Session revocation when navigating away or clicking back button without logging out
  useEffect(() => {
    const handlePopState = () => {
      dataStore.logout("employer");
      localStorage.removeItem("realjob-employer-profile");
      localStorage.removeItem("realjob-user-admin");
      localStorage.removeItem("realjob-user-employer");
      localStorage.removeItem("realjob-user");
      localStorage.removeItem("realjob-role");
      sessionStorage.removeItem("realjob_tab_user");
      window.location.replace("/auth?mode=login&role=admin");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      dataStore.logout("employer");
      localStorage.removeItem("realjob-employer-profile");
      localStorage.removeItem("realjob-user-admin");
      localStorage.removeItem("realjob-user-employer");
      localStorage.removeItem("realjob-user");
      localStorage.removeItem("realjob-role");
      sessionStorage.removeItem("realjob_tab_user");
    };
  }, []);

  const isSuperAdmin = currentUser?.email?.toLowerCase() === "supera@gmail.com" || currentUser?.email?.toLowerCase() === "superadmin";
  const empIdentifier = currentUser?.fullName || currentUser?.email || "admin-001";

  // Worksite Location persistent reactive state
  const [savedLocationLink, setSavedLocationLink] = useState<string>(() => {
    try {
      const direct = localStorage.getItem(`emp_worksite_link_${empIdentifier}`);
      if (direct) return direct;
      return (currentUser as any)?.worksiteLocationLink || "";
    } catch {
      return (currentUser as any)?.worksiteLocationLink || "";
    }
  });

  const [savedLocationCoords, setSavedLocationCoords] = useState<{ lat: number; lng: number } | null>(() => {
    try {
      const direct = localStorage.getItem(`emp_worksite_coords_${empIdentifier}`);
      if (direct) return JSON.parse(direct);
      return (currentUser as any)?.worksiteLocation || null;
    } catch {
      return (currentUser as any)?.worksiteLocation || null;
    }
  });

  // Keep location link in sync if currentUser updates externally
  useEffect(() => {
    if (currentUser) {
      const storedLink = localStorage.getItem(`emp_worksite_link_${empIdentifier}`) || (currentUser as any)?.worksiteLocationLink;
      if (storedLink && storedLink !== savedLocationLink) {
        setSavedLocationLink(storedLink);
      }

      const storedCoords = localStorage.getItem(`emp_worksite_coords_${empIdentifier}`);
      const coords = storedCoords ? JSON.parse(storedCoords) : (currentUser as any)?.worksiteLocation;
      if (coords && (!savedLocationCoords || coords.lat !== savedLocationCoords.lat)) {
        setSavedLocationCoords(coords);
      }
    }
  }, [currentUser, empIdentifier]);

  // Automatic Attendance Mode: Text Analysis of Company Name / Registered Business Name
  const attendanceMode: "fixed" | "field" = useMemo(() => {
    try {
      const text = `${currentUser?.fullName || ""} ${empIdentifier || ""}`.toLowerCase();
      const isField = [
        "farming", "farm", "agro", "agriculture", "nursery", "शेती", "शेत", "रोपवाटिका", "कृषी", "फार्मिंग",
        "construction", "site", "baukam", "बांधकाम", "साइट", "मजूर", "लेबर", "labour", "labor",
        "field", "driver", "moving", "delivery", "security", "guard", "हमाल"
      ].some(kw => text.includes(kw));

      return isField ? "field" : "fixed";
    } catch {
      return "fixed";
    }
  }, [currentUser?.fullName, empIdentifier]);

  // Profile Edit Form state
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    contactPerson: "",
    email: "",
    mobile: "",
    profilePhoto: "",
    location: "Maharashtra",
    industry: "Plant Nursery & Workforce Services",
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      toast.error("Please enter company or full name");
      return;
    }
    const updatedUser = {
      ...(currentUser || {}),
      id: currentUser?.id || `usr-${Date.now()}`,
      email: profileForm.email.trim() || currentUser?.email || "",
      role: (currentUser?.role || "employer") as UserRole,
      fullName: profileForm.fullName.trim(),
      contactPerson: profileForm.contactPerson?.trim() || "",
      mobile: profileForm.mobile.trim(),
      profilePhoto: profileForm.profilePhoto.trim(),
      location: profileForm.location.trim(),
      industry: profileForm.industry.trim(),
      worksiteLocation: (currentUser as any)?.worksiteLocation || savedLocationCoords || null,
      worksiteLocationLink: (currentUser as any)?.worksiteLocationLink || savedLocationLink || "",
    };

    // 1. Immediately update React state for instant UI re-render
    setCurrentUser(updatedUser);

    // 2. Persist in dataStore session & registered accounts
    dataStore.setCurrentUser(updatedUser);
    dataStore.updateRegisteredAccount(updatedUser.id, updatedUser);

    // 3. Permanent local storage backups
    try {
      localStorage.setItem("realjob-employer-profile", JSON.stringify(updatedUser));
      localStorage.setItem(`emp_profile_${updatedUser.id}`, JSON.stringify(updatedUser));
      if (updatedUser.email) localStorage.setItem(`emp_profile_${updatedUser.email.toLowerCase()}`, JSON.stringify(updatedUser));
    } catch {}

    toast.success("🎉 Profile updated successfully!");
  };

  const refreshCredits = () => {
    if (currentUser?.id) {
      setUserCredits(dataStore.getUserJobCredits(currentUser.id));
    }
  };

  const loadAttendanceData = () => {
    const activeEmpId = currentUser?.id || currentUser?.fullName || currentUser?.email || empIdentifier;
    const empWorkers = dataStore.getEmployerWorkers(activeEmpId);
    setWorkers(empWorkers);
    const attRecords = dataStore.getEmployerAttendance(activeEmpId, selectedAttendanceDate);
    setDailyAttendanceRecords(attRecords);

    // Calculate report range
    let start = reportStartDate;
    let end = reportEndDate;
    if (reportTimeframe === "week") {
      const now = new Date();
      const first = now.getDate() - now.getDay();
      start = new Date(now.setDate(first)).toISOString().split("T")[0]!;
      end = new Date().toISOString().split("T")[0]!;
    } else if (reportTimeframe === "month") {
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]!;
      end = new Date().toISOString().split("T")[0]!;
    }
    const rangeRecords = dataStore.getEmployerAttendanceRange(activeEmpId, start, end);
    setReportAttendanceRecords(rangeRecords);
  };

  useEffect(() => {
    loadAttendanceData();
  }, [currentUser?.id, currentUser?.fullName, empIdentifier, selectedAttendanceDate, reportTimeframe, reportStartDate, reportEndDate]);

  const handleMarkAttendance = (
    worker: EmployerWorker,
    status: "Present" | "HalfDay" | "Absent" | "Overtime",
    targetDate?: string,
    overtimeHours?: number
  ) => {
    const activeEmpId = currentUser?.id || currentUser?.fullName || currentUser?.email || empIdentifier;
    const dateToUse = targetDate || selectedAttendanceDate;
    const todayStr = new Date().toISOString().split("T")[0]!;
    if (dateToUse > todayStr) {
      toast.error("⚠️ आजनंतरच्या (भविष्यातील) तारखेची हजेरी नोंदवता येत नाही! (Cannot mark attendance for future dates)");
      return;
    }
    dataStore.saveAttendanceStatus(
      activeEmpId,
      worker.id,
      worker.name,
      dateToUse,
      status,
      undefined,
      undefined,
      overtimeHours
    );
    loadAttendanceData();
    const otText = status === "Overtime" ? ` (${overtimeHours || 2} तास OT)` : "";
    toast.success(`हजेरी नोंदवली: ${worker.name} - ${status}${otText} [${dateToUse}]`);
  };

  const handleBulkMarkAttendance = (
    worker: EmployerWorker,
    dates: string[],
    status: "Present" | "HalfDay" | "Absent" | "Overtime",
    overtimeHours?: number
  ) => {
    if (dates.length === 0) {
      toast.error("कोणतीही तारीख निवडलेली नाही! (No dates selected)");
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0]!;
    const validDates = dates.filter((d) => d <= todayStr);
    if (validDates.length === 0) {
      toast.error("⚠️ आजनंतरच्या (भविष्यातील) तारखेची हजेरी नोंदवता येत नाही! (Cannot mark attendance for future dates)");
      return;
    }
    const activeEmpId = currentUser?.id || currentUser?.fullName || currentUser?.email || empIdentifier;
    dataStore.saveBulkAttendance(
      activeEmpId,
      worker.id,
      worker.name,
      validDates,
      status,
      overtimeHours
    );
    loadAttendanceData();
    toast.success(`✅ ${validDates.length} दिवसांची हजेरी यशस्वीरीत्या नोंदवली! (${status})`);
  };

  const handleExportAttendanceCSV = () => {
    const headers = ["Employee Name", "Mobile", "Category", "Designation", "Date", "Punch In", "Punch Out", "Status", "Daily Wage (Rs)"];
    const rows: string[][] = [];

    workers.forEach(w => {
      const rec = dailyAttendanceRecords.find(r => r.workerId === w.id);
      rows.push([
        `"${w.name}"`,
        `"${w.mobile || 'N/A'}"`,
        `"${w.category || w.trade || 'General'}"`,
        `"${w.trade || 'Worker'}"`,
        `"${selectedAttendanceDate}"`,
        `"${rec?.punchInTime || '--'}"`,
        `"${rec?.punchOutTime || '--'}"`,
        `"${rec?.status || 'Absent'}"`,
        `"${w.dailyRate}"`
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_Report_${selectedAttendanceDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`📊 Attendance CSV Report Downloaded for ${selectedAttendanceDate}!`);
  };

  const handleOpenAddWorker = () => {
    const userId = currentUser?.id || currentUser?.email || empIdentifier;
    const allowedLimit = dataStore.getUserWorkerCredits(userId);
    if (allowedLimit === 0) {
      toast.error(
        "⚠️ Active package required to add employees! Please purchase a package to continue.",
        { duration: 6000 }
      );
      setShowPackageModal(true);
      return;
    }
    if (workers.length >= allowedLimit) {
      toast.error(
        `⚠️ Employee limit reached for your active package! (Current Limit: ${allowedLimit} employees). Please upgrade package to add more employees!`,
        { duration: 6000 }
      );
      setShowPackageModal(true);
      return;
    }

    const defStart = "09:00";
    const defEnd = "18:00";
    const defHours = computeHoursFromTimes(defStart, defEnd);
    const defDailyWage = 500;
    const defOtRate = Math.round(defDailyWage / defHours);

    setEditingWorkerId(null);
    setWorkerForm({
      name: "",
      mobile: "",
      trade: "General Worker",
      category: getIndustryDefaultCategories()[0] || "General Work",
      education: "",
      dailyRate: "500",
      joiningDate: new Date().toISOString().split("T")[0]!,
      workShiftStart: defStart,
      workShiftEnd: defEnd,
      dailyWorkingHours: defHours.toString(),
      overtimeRate: defOtRate.toString(),
      overtimeRateMode: "auto",
      notes: "",
      pin: "1234",
      locationType: attendanceMode === "field" ? "field" : "fixed",
      attendanceMode: attendanceMode === "field" ? "manual" : "punch",
    });
    // Restore persistent custom fields & custom categories so they don't disappear when modal opens!
    setCustomCategories(getStoredCustomCats());
    setCustomFields(persistentCustomFields.map((f) => ({ label: f.label, value: "" })));
    setShowWorkerModal(true);
  };

  const handleOpenEditWorker = (w: EmployerWorker) => {
    setEditingWorkerId(w.id);
    setCustomCategories(getStoredCustomCats());
    const locType = (w.locationType || (w.attendanceMode === "manual" ? "field" : "fixed")) as "fixed" | "field";
    const attMode = (w.attendanceMode || (locType === "field" ? "manual" : "punch")) as "punch" | "manual";
    const start = w.workShiftStart || "09:00";
    const end = w.workShiftEnd || "18:00";
    const calcHours = computeHoursFromTimes(start, end);
    const workerHours = w.dailyWorkingHours ?? calcHours;
    const mode = w.overtimeRateMode || (w.overtimeRate ? "manual" : "auto");
    const autoRate = calcHours > 0 ? Math.round(w.dailyRate / calcHours) : 56;
    const finalOtRate = w.overtimeRate !== undefined ? w.overtimeRate.toString() : autoRate.toString();

    setWorkerForm({
      name: w.name,
      mobile: w.mobile,
      trade: w.trade,
      category: w.category || w.trade || getIndustryDefaultCategories()[0] || "General Work",
      education: w.education || "",
      dailyRate: w.dailyRate.toString(),
      joiningDate: w.joiningDate || new Date().toISOString().split("T")[0]!,
      workShiftStart: start,
      workShiftEnd: end,
      dailyWorkingHours: workerHours.toString(),
      overtimeRate: finalOtRate,
      overtimeRateMode: mode,
      notes: w.notes || "",
      pin: (w as any).pin || "1234",
      locationType: locType,
      attendanceMode: attMode,
    });
    const existing = w.customFields || [];
    const merged = [...existing];
    persistentCustomFields.forEach((tpl) => {
      if (!merged.some((m) => m.label.toLowerCase() === tpl.label.toLowerCase())) {
        merged.push({ label: tpl.label, value: "" });
      }
    });
    setCustomFields(merged);
    setShowWorkerModal(true);
  };

  const handleSaveWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerForm.name.trim()) {
      toast.error("Please enter employee name");
      return;
    }
    const baseHrsNum = computeHoursFromTimes(workerForm.workShiftStart, workerForm.workShiftEnd);
    const dailyWageNum = Number(workerForm.dailyRate) || 500;
    const workingHrsNum = Number(workerForm.dailyWorkingHours) || baseHrsNum;
    const autoOtRate = baseHrsNum > 0 ? Math.round(dailyWageNum / baseHrsNum) : 50;
    const otRateNum = Number(workerForm.overtimeRate) || autoOtRate;

    const activeEmpId = currentUser?.id || currentUser?.fullName || currentUser?.email || empIdentifier;
    const empCompanyName = (currentUser as any)?.companyName || currentUser?.fullName || (currentUser as any)?.name || empIdentifier || "Alpha Byte";
    dataStore.saveEmployerWorker({
      ...(editingWorkerId ? { id: editingWorkerId } : {}),
      employerId: activeEmpId,
      employerName: empCompanyName,
      name: workerForm.name.trim(),
      mobile: workerForm.mobile.trim(),
      trade: workerForm.trade.trim() || "General Worker",
      category: workerForm.category.trim() || "Plant Nursery & Care",
      education: workerForm.education.trim(),
      dailyRate: dailyWageNum,
      joiningDate: workerForm.joiningDate || new Date().toISOString().split("T")[0]!,
      status: "Active",
      workShiftStart: workerForm.workShiftStart,
      workShiftEnd: workerForm.workShiftEnd,
      dailyWorkingHours: workingHrsNum,
      overtimeRate: otRateNum,
      overtimeRateMode: workerForm.overtimeRateMode,
      notes: workerForm.notes.trim(),
      pin: workerForm.pin || "1234",
      locationType: workerForm.locationType,
      attendanceMode: workerForm.attendanceMode,
      customFields: customFields.filter((f) => f.label.trim() !== ""),
    } as any);
    setShowWorkerModal(false);
    setEditingWorkerId(null);
    loadAttendanceData();
    toast.success(editingWorkerId ? "Employee details updated successfully!" : "Employee registered successfully!");
  };

  const handleDeleteWorker = (workerId: string, name: string) => {
    if (confirm(`Are you sure you want to delete employee '${name}'?`)) {
      dataStore.deleteEmployerWorker(workerId);
      loadAttendanceData();
      toast.success("Employee removed successfully!");
    }
  };

  const loadAllData = () => {
    if (isSuperAdmin) {
      setJobs(dataStore.getAllJobs());
      setApplications(dataStore.getAllApplications());
    } else {
      setJobs(dataStore.getEmployerJobs(empIdentifier));
      setApplications(dataStore.getEmployerApplications(empIdentifier));
    }
    const reg = dataStore.getRegisteredUsers();
    setRegisteredUsers(reg.map(u => ({
      id: u.id,
      name: u.fullName,
      role: u.role,
      mobile: u.mobile || "N/A",
      city: "Maharashtra",
      trade: u.role === "worker" ? "Worker" : u.role === "employer" ? "Employer" : "Admin",
      status: "Verified",
      createdAt: u.createdAt || undefined
    })));
    refreshCredits();
  };

  useEffect(() => {
    loadAllData();
  }, [empIdentifier]);

  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const handleUpdateAppStatus = (appId: string, status: any) => {
    dataStore.updateApplicationStatus(appId, status);
    loadAllData();
    toast.success(`Application status updated to '${status}'! Candidate can view this on their dashboard.`);
  };

  const handleSaveReply = (appId: string, replyText: string) => {
    if (!replyText || !replyText.trim()) {
      toast.error("Please enter a reply or note for the candidate");
      return;
    }
    dataStore.updateApplicationReply(appId, replyText.trim());
    loadAllData();
    toast.success("Reply saved & sent to candidate! They can now view it on their dashboard.");
  };

  // Job creation and edit form state
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState({
    title: "", company: "REAL JOB Platform", category: "", subcategory: "", location: "",
    salary: "",
    salaryMin: "", salaryMax: "", salaryType: "Monthly",
    showSalary: true,
    jobType: "Full Time", workMode: "On-site", vacancies: "5",
    education: "", experience: "", skills: "", description: "",
    responsibilities: "", benefits: "", status: "Active",
  });
  const setJ = (k: string, v: any) => setJobForm(p => ({ ...p, [k]: v }));

  const handleAddNewJobClick = () => {
    // Check if user has active credits or is super admin
    const credits = currentUser?.id ? dataStore.getUserJobCredits(currentUser.id) : 0;
    if (!isSuperAdmin && credits <= 0) {
      toast.info("Please select a Job Package to post new jobs.");
      setShowPackageModal(true);
      return;
    }

    setEditingJobId(null);
    setJobForm({
      title: "", company: currentUser?.fullName || "REAL JOB Platform", category: "", subcategory: "", location: "",
      salary: "",
      salaryMin: "", salaryMax: "", salaryType: "Monthly",
      showSalary: true,
      jobType: "Full Time", workMode: "On-site", vacancies: "5",
      education: "", experience: "", skills: "", description: "",
      responsibilities: "", benefits: "", status: "Active",
    });
    setShowJobForm(true);
  };

  const activeJobPackages = dataStore.getJobPackages();

  const handleActivatePackage = () => {
    if (!currentUser) {
      toast.error("User session expired. Please login again.");
      return;
    }
    const selectedPlan = activeJobPackages.find((p) => p.id === selectedPlanId) || activeJobPackages[0]!;
    const userId = currentUser.id || currentUser.email || "admin-001";

    setIsProcessingPackage(true);
    setTimeout(() => {
      dataStore.addPackagePurchase({
        userId: userId,
        userEmail: currentUser.email || "",
        userName: currentUser.fullName || currentUser.email || "Employer",
        companyName: currentUser.companyName || currentUser.fullName || "Employer",
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        price: selectedPlan.price,
        jobCount: selectedPlan.jobCount,
        workerCount: selectedPlan.workerCount || 3,
        paymentMethod: paymentMethod.toUpperCase(),
      });

      setIsProcessingPackage(false);
      setShowPackageModal(false);
      refreshCredits();

      toast.success(`🎉 ${selectedPlan.name} activated! You now have ${selectedPlan.jobCount} Job Credits.`);

      // Open Post New Job form immediately
      setEditingJobId(null);
      setJobForm({
        title: "", company: currentUser?.fullName || "REAL JOB Platform", category: "", subcategory: "", location: "",
        salary: "",
        salaryMin: "", salaryMax: "", salaryType: "Monthly",
        showSalary: true,
        jobType: "Full Time", workMode: "On-site", vacancies: "5",
        education: "", experience: "", skills: "", description: "",
        responsibilities: "", benefits: "", status: "Active",
      });
      setShowJobForm(true);
    }, 1000);
  };

  const handleEditJobClick = (job: JobRecord) => {
    setEditingJobId(job.id);
    let sMin = job.salaryMin ? String(job.salaryMin) : "";
    let sMax = job.salaryMax ? String(job.salaryMax) : "";
    if (!sMin && !sMax && job.salary) {
      const numbers = job.salary.match(/\d[\d,]*/g);
      if (numbers && numbers.length >= 2 && numbers[0] && numbers[1]) {
        sMin = numbers[0].replace(/,/g, "");
        sMax = numbers[1].replace(/,/g, "");
      }
    }
    setJobForm({
      title: job.title || "",
      company: job.company || "",
      category: job.category || "",
      subcategory: job.subcategory || "",
      location: job.location || "",
      salary: job.salary || (sMin && sMax ? `₹${sMin} - ₹${sMax}` : (sMin ? `₹${sMin}` : "")),
      salaryMin: sMin,
      salaryMax: sMax,
      salaryType: job.salaryType || "Monthly",
      showSalary: job.showSalary !== false && !job.hideSalary,
      jobType: job.jobType || "Full Time",
      workMode: job.workMode || "On-site",
      vacancies: job.vacancies ? String(job.vacancies) : "5",
      education: job.qualification || "",
      experience: job.experience || "",
      skills: (job.requiredSkills || []).join(", "),
      description: job.description || "",
      responsibilities: (job.responsibilities || []).join("\n"),
      benefits: (job.benefits || []).join(", "),
      status: job.status || "Active",
    });
    setShowJobForm(true);
  };

  const handlePublishJob = (e: React.FormEvent) => {
    e.preventDefault();
    const salaryText = jobForm.salaryMin && jobForm.salaryMax
      ? `₹${Number(jobForm.salaryMin).toLocaleString("en-IN")} - ₹${Number(jobForm.salaryMax).toLocaleString("en-IN")}`
      : jobForm.salaryMin
        ? `₹${Number(jobForm.salaryMin).toLocaleString("en-IN")}`
        : "Salary on Interview";

    const parsedMin = Number(jobForm.salaryMin) || 0;
    const parsedMax = Number(jobForm.salaryMax) || parsedMin;
    const isShowSalary = jobForm.showSalary !== false;

    if (editingJobId) {
      dataStore.updateJob(editingJobId, {
        title: jobForm.title,
        company: jobForm.company || currentUser?.fullName || "Company",
        category: jobForm.category || "General",
        subcategory: jobForm.subcategory || "",
        description: jobForm.description,
        qualification: jobForm.education,
        experience: jobForm.experience,
        salary: salaryText,
        salaryMin: parsedMin,
        salaryMax: parsedMax,
        salaryType: "Monthly",
        showSalary: isShowSalary,
        hideSalary: !isShowSalary,
        location: jobForm.location,
        jobType: jobForm.jobType as any,
        workMode: jobForm.workMode as any,
        vacancies: Number(jobForm.vacancies) || 1,
        status: jobForm.status as any,
      });
      toast.success("✅ Job posting updated successfully!");
    } else {
      const empId = currentUser?.email || currentUser?.fullName || currentUser?.id || "admin-001";
      const compName = jobForm.company || currentUser?.fullName || "Company";
      dataStore.createJob({
        employerId: empId,
        title: jobForm.title,
        company: compName,
        category: jobForm.category || "General",
        subcategory: jobForm.subcategory || "",
        description: jobForm.description,
        responsibilities: [],
        requiredSkills: [],
        qualification: jobForm.education,
        experience: jobForm.experience,
        salary: salaryText,
        salaryMin: parsedMin,
        salaryMax: parsedMax,
        salaryType: "Monthly",
        showSalary: isShowSalary,
        hideSalary: !isShowSalary,
        location: jobForm.location,
        jobType: jobForm.jobType as any,
        workMode: jobForm.workMode as any,
        vacancies: Number(jobForm.vacancies) || 1,
        benefits: [],
        status: jobForm.status as any,
        approvalStatus: "pending",
      });

      if (!isSuperAdmin && currentUser?.id) {
        dataStore.consumeJobCredit(currentUser.id);
        refreshCredits();
      }

      toast.success("🎉 New job posted successfully!");
    }
    setShowJobForm(false);
    setEditingJobId(null);
    loadAllData();
  };

  const handleToggleJobStatus = (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Closed" : "Active";
    dataStore.updateJob(jobId, { status: nextStatus as any });
    loadAllData();
    toast.success(`Job status updated to ${nextStatus}!`);
  };

  const handleDeleteJob = (jobId: string) => {
    dataStore.deleteJob(jobId);
    loadAllData();
    toast.success("Job posting removed!");
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase())
  );
  const totalJobPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const pagedJobs = filteredJobs.slice((jobsPage - 1) * JOBS_PER_PAGE, jobsPage * JOBS_PER_PAGE);

  const activeSelectedPlan = activeJobPackages.find((p) => p.id === selectedPlanId) || activeJobPackages[0]!;

  if (!currentUser || (currentUser.role !== "employer" && currentUser.role !== "admin")) {
    return null;
  }

  // ── FULL PAGE: Add / Edit Job Form ──
  if (showJobForm) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F0F4FA] overflow-y-auto flex flex-col font-sans">
        {/* Top Sticky Bar */}
        <div className="bg-[#021D3D] text-white px-6 py-4 flex items-center justify-between border-b border-[#0A4F9E] sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJobForm(false)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-1"
            >
               Back to Dashboard
            </button>
            <h1 className="text-base font-black text-white">
              {editingJobId ? "फार्मिंग" : "💼 Post New Job"}
            </h1>
          </div>
          <span className="text-xs font-bold text-[#FFC400] bg-white/10 px-3 py-1 rounded-full">
            Direct Hiring (Zero Commission)
          </span>
        </div>

        {/* Form Container */}
        <div className="max-w-5xl w-full mx-auto p-4 sm:p-8 flex-1">
          <form onSubmit={handlePublishJob} className="space-y-6 pb-12">
            {/* Section 1 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">1</span>
                <h2 className="text-sm font-black text-[#10233F]">{t("basicJobDetails")}</h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("jobTitleRequired")}</label>
                  <Input
                    required
                    value={jobForm.title}
                    onChange={(e) => setJ("title", e.target.value)}
                    placeholder={t("jobTitlePlaceholder")}
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("companyNameRequired")}</label>
                  <Input
                    required
                    value={jobForm.company}
                    onChange={(e) => setJ("company", e.target.value)}
                    placeholder={t("companyNamePlaceholder")}
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#5B6B7F]">{t("categoryRequired")}</label>
                    <span className="text-[10px] text-[#125BB5] font-bold">{t("pickExistingOrTypeNew")}</span>
                  </div>
                  <Input
                    list="admin-category-suggestions"
                    required
                    value={jobForm.category}
                    onChange={(e) => setJ("category", e.target.value)}
                    placeholder={t("categoryPlaceholder")}
                    className="text-xs font-semibold"
                  />
                  <datalist id="admin-category-suggestions">
                    {dataStore.getExistingJobCategories().map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("locationRequired")}</label>
                  <Input
                    required
                    value={jobForm.location}
                    onChange={(e) => setJ("location", e.target.value)}
                    placeholder={t("locationPlaceholder")}
                    className="text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">2</span>
                <h2 className="text-sm font-black text-[#10233F]">{t("salaryAndWorkMode")}</h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("minSalaryLabel")}</label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    required
                    value={jobForm.salaryMin}
                    onChange={(e) => setJ("salaryMin", e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 25000"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("maxSalaryLabel")}</label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    required
                    value={jobForm.salaryMax}
                    onChange={(e) => setJ("salaryMax", e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 45000"
                    className="text-xs font-semibold"
                  />
                </div>

                {/* Seeker Salary Visibility: Yes / No Option */}
                <div className="md:col-span-2 bg-[#F8FAFF] p-4 rounded-xl border border-[#DCE5F0] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#10233F]">
                        Show Salary to Job Seekers? *
                      </label>
                      <p className="text-[11px] font-semibold text-[#5B6B7F] mt-0.5">
                        {jobForm.showSalary ? (
                          <span className="text-emerald-700 font-bold">
                            ✅ 'Yes' selected — Salary will be visible to job seekers {jobForm.salaryMin ? `(e.g. ₹${Number(jobForm.salaryMin).toLocaleString('en-IN')}${jobForm.salaryMax ? ` - ₹${Number(jobForm.salaryMax).toLocaleString('en-IN')}` : ''})` : ''}
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold">
                            🔒 'No' selected — Salary will be hidden from job seekers ('Not Disclosed' will be shown).
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Yes / No Toggle Buttons */}
                    <div className="flex items-center gap-2 shrink-0 bg-white p-1 rounded-xl border border-[#DCE5F0] shadow-xs">
                      <button
                        type="button"
                        onClick={() => setJ("showSalary", true)}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                          jobForm.showSalary
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-[#5B6B7F] hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-sm">✓</span>
                        <span>{t("yesShowSalary")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setJ("showSalary", false)}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                          !jobForm.showSalary
                            ? "bg-rose-600 text-white shadow-sm"
                            : "text-[#5B6B7F] hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-sm">✕</span>
                        <span>{t("noHideSalary")}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("jobType")}</label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJ("jobType", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F]"
                  >
                    <option value="Full Time">{t("fullTimeJob")}</option>
                    <option value="Part Time">{t("partTimeJob")}</option>
                    <option value="Contract">{t("contractJob")}</option>
                    <option value="Internship">{t("internshipJob")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("workMode")}</label>
                  <select
                    value={jobForm.workMode}
                    onChange={(e) => setJ("workMode", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F]"
                  >
                    <option value="On-site">{t("onSiteMode")}</option>
                    <option value="Work From Home">{t("workFromHomeMode")}</option>
                    <option value="Hybrid">{t("hybridMode")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("vacancies")}</label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={jobForm.vacancies}
                    onChange={(e) => setJ("vacancies", e.target.value.replace(/\D/g, ""))}
                    placeholder="5"
                    className="text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">3</span>
                <h2 className="text-sm font-black text-[#10233F]">{t("jobDescriptionAndRequirements")}</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("jobDescriptionRequired")}</label>
                  <textarea
                    required
                    rows={4}
                    value={jobForm.description}
                    onChange={(e) => setJ("description", e.target.value)}
                    placeholder={t("jobDescriptionPlaceholder")}
                    className="w-full p-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("requiredQualificationLabel")}</label>
                    <Input
                      value={jobForm.education}
                      onChange={(e) => setJ("education", e.target.value)}
                      placeholder={t("qualificationPlaceholder")}
                      className="text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5B6B7F] mb-1">{t("requiredExperienceLabel")}</label>
                    <Input
                      value={jobForm.experience}
                      onChange={(e) => setJ("experience", e.target.value)}
                      placeholder={t("experiencePlaceholder")}
                      className="text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] px-6 py-4 flex items-center justify-between sticky bottom-0 shadow-lg">
              <p className="text-[10px] text-[#9DAEC5] font-semibold">*{t("requiredFieldsNote")}</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowJobForm(false)} className="px-5 py-2.5 rounded-xl border border-[#DCE5F0] text-xs font-bold text-[#5B6B7F] hover:bg-[#F5F8FC] transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#063B78] to-[#0A4F9E] text-white font-black text-xs hover:opacity-90 transition-all shadow-md shadow-[#063B78]/20 flex items-center gap-1.5">
                  {editingJobId ? "✨ Update Job Posting" : "✨ Publish Job"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0F4FA] flex flex-col md:flex-row font-sans w-full overflow-hidden">
      {/* ── MOBILE TOP NAVBAR HEADER (Visible on < md) ── */}
      <header className="md:hidden bg-[#021D3D] text-white px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-md border-b border-white/10 shrink-0 w-full">
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div className="size-9 bg-gradient-to-br from-[#FFC400] to-[#FFA500] rounded-xl flex items-center justify-center shadow-md border border-white/10 shrink-0">
            <Building2 className="size-5 text-[#021D3D]" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 suppressHydrationWarning className="font-black text-xs text-white truncate leading-tight">
              {currentUser?.fullName || t("employerPortal")}
            </h1>
            <span className="text-[10px] text-[#FFC400] font-black uppercase block tracking-wider leading-tight mt-0.5">
              {t("employerPortal")}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer shrink-0 ml-1"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* ── MOBILE DRAWER SLIDE-OVER MENU ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <aside className="relative w-4/5 max-w-xs bg-[#021D3D] text-white flex flex-col justify-between h-full p-5 shadow-2xl z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 bg-gradient-to-br from-[#FFC400] to-[#FFA500] rounded-xl flex items-center justify-center font-black text-[#021D3D] shrink-0">
                    <Building2 className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 suppressHydrationWarning className="font-black text-sm text-white truncate">
                      {currentUser?.fullName || "Employer"}
                    </h2>
                    <p className="text-[11px] text-[#FFC400] font-bold">{t("verifiedEmployer")}</p>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10">
                  <X className="size-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {[
                  { id: "overview", label: t("dashboardOverview"), icon: BarChart3 },
                  { id: "jobs", label: t("jobListings"), icon: BriefcaseBusiness, count: jobs.length },
                  { id: "applications", label: t("jobApplications"), icon: FileText, count: applications.length },
                  { id: "attendance", label: t("attendancePayroll"), icon: CalendarCheck, count: workers.length },
                  { id: "salary", label: t("eSalarySlips"), icon: FileText },
                  { id: "packages", label: t("myPackagesBilling"), icon: IndianRupee },
                  { id: "profile", label: t("myProfile"), icon: User },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive
                        ? "bg-[#FFC400] text-[#021D3D] font-extrabold shadow-md"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon className={`size-4 ${isActive ? "text-[#021D3D]" : "text-white/60"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${isActive ? "bg-[#021D3D] text-[#FFC400]" : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                          }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  dataStore.logout("employer");
                  localStorage.removeItem("realjob-employer-profile");
                  localStorage.removeItem("realjob-user-admin");
                  localStorage.removeItem("realjob-user-employer");
                  localStorage.removeItem("realjob-user");
                  localStorage.removeItem("realjob-role");
                  sessionStorage.removeItem("realjob_tab_user");
                  toast.info("Logged out successfully");
                  navigate({ to: "/auth", search: { mode: "login", role: "admin" }, replace: true });
                  if (typeof window !== "undefined") window.scrollTo(0, 0);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="size-4" />
                <span>{t("signOut")}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── LEFT DARK NAVY SIDEBAR (Visible on md+) ── */}
      <aside className="w-64 bg-[#021D3D] text-white flex flex-col justify-between hidden md:flex h-full shrink-0 border-r border-white/10 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {/* Logo / Company Name Header */}
        <div className="p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 bg-gradient-to-br from-[#FFC400] to-[#FFA500] rounded-xl flex items-center justify-center shadow-lg border-[2px] border-white/10 shrink-0">
              <Building2 className="size-5 text-[#021D3D]" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 suppressHydrationWarning className="font-black text-sm leading-tight tracking-tight uppercase truncate text-white" title={currentUser?.fullName || t("employerPortal")}>
                {currentUser?.fullName || t("employerPortal")}
              </h1>
              <span className="text-[10px] text-[#FFC400] font-black uppercase tracking-widest block">{t("employerPortal")}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="text-[10px] font-black uppercase text-[#9DAEC5] tracking-widest px-3 mb-2">{t("mainNavigation")}</div>
          {[
            { id: "overview", label: t("dashboardOverview"), icon: BarChart3 },
            { id: "jobs", label: t("jobListings"), icon: BriefcaseBusiness, count: jobs.length },
            { id: "applications", label: t("jobApplications"), icon: FileText, count: applications.length },
            { id: "attendance", label: t("attendancePayroll"), icon: CalendarCheck, count: workers.length },
            { id: "salary", label: t("eSalarySlips"), icon: FileText },
            { id: "packages", label: t("myPackagesBilling"), icon: IndianRupee },
            { id: "profile", label: t("myProfile"), icon: User },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${isActive
                  ? "bg-[#FFC400] text-[#021D3D] shadow-md shadow-[#FFC400]/20 font-extrabold"
                  : "text-[#9DAEC5] hover:bg-white/5 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1">
                  <item.icon className={`size-4 shrink-0 ${isActive ? "text-[#021D3D]" : ""}`} />
                  <span className="truncate text-left">{item.label}</span>
                </div>
                {item.count !== undefined ? (
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full shrink-0 ${isActive ? "bg-[#021D3D] text-[#FFC400]" : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                    }`}>
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Bottom Sign Out Action */}
        <div className="p-4 border-t border-white/10 shrink-0 mt-auto">
          <button
            onClick={() => {
              dataStore.logout("employer");
              localStorage.removeItem("realjob-employer-profile");
              localStorage.removeItem("realjob-user-admin");
              localStorage.removeItem("realjob-user-employer");
              localStorage.removeItem("realjob-user");
              localStorage.removeItem("realjob-role");
              sessionStorage.removeItem("realjob_tab_user");
              toast.info("Logged out successfully");
              navigate({ to: "/auth", search: { mode: "login", role: "admin" }, replace: true });
              if (typeof window !== "undefined") window.scrollTo(0, 0);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="size-4" />
            <span>{t("signOut")}</span>
          </button>
        </div>
      </aside>

      {/* ── RIGHT MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar Header */}
        <header className="h-16 sm:h-20 bg-white border-b border-[#E0E8F5] flex items-center justify-between px-3 sm:px-8 shrink-0 z-30 shadow-2xs min-w-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 mr-2">
            <h2 className="text-sm sm:text-xl font-black text-[#063B78] truncate leading-tight">
              {activeTab === "overview" && t("dashboardOverview")}
              {activeTab === "jobs" && t("jobListings")}
              {activeTab === "applications" && t("jobApplications")}
              {activeTab === "attendance" && t("attendancePayroll")}
              {activeTab === "packages" && t("myPackagesBilling")}
              {activeTab === "profile" && t("myProfile")}
              {activeTab === "salary" && t("employeeSalarySlipsTitle")}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Job Credits Indicator - Hidden on extra small mobile header */}
            {!isSuperAdmin && (
              <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-black text-amber-800 shrink-0">
                <Zap className="size-4 fill-amber-400 text-amber-500" />
                <span>{t("creditsLabel")} {userCredits >= 999 ? t("unlimitedLabel") : userCredits}</span>
                <button
                  onClick={() => setShowPackageModal(true)}
                  className="ml-1 bg-amber-400 hover:bg-amber-500 text-[#063B78] px-2 py-0.5 rounded text-[10px] font-black transition-all cursor-pointer"
                >
                  {t("addCreditsBtn")}
                </button>
              </div>
            )}


            {/* Employer Profile Pill */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-[#E0E8F5] shrink-0">
              <div className="text-right hidden sm:block">
                <div suppressHydrationWarning className="text-sm font-bold text-[#063B78]">{currentUser?.fullName || t("employerAccount")}</div>
                <div className="text-[10px] font-bold text-amber-600 flex items-center justify-end gap-1">
                  <ShieldCheck className="size-3" /> {t("verifiedEmployer")}
                </div>
              </div>
              {currentUser?.profilePhoto ? (
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.fullName || "Employer"}
                  className="size-8 sm:size-10 rounded-xl object-cover shadow-sm border-b-[2px] border-[#021D3D]"
                />
              ) : (
                <div className="size-8 sm:size-10 bg-gradient-to-br from-[#063B78] to-[#0A4F9E] rounded-xl flex items-center justify-center text-white font-black text-xs sm:text-base shadow-sm border-b-[2px] border-[#021D3D]">
                  {(currentUser?.fullName || "E").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Body Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pb-20 md:pb-8">

          {/* TAB 1: OVERVIEW */}
          <div className={activeTab === "overview" ? "block" : "hidden"}>
            <div className="space-y-6">
              {/* Active Package Banner */}
              {(() => {
                const userId = currentUser?.id || currentUser?.email || empIdentifier;
                const userPkgs = dataStore.getUserPackages(userId);
                const workerLimit = dataStore.getUserWorkerCredits(userId);
                const jobCredits = dataStore.getUserJobCredits(userId);
                const latestPkg = userPkgs.length > 0 ? userPkgs[0] : null;

                return (
                  <div className="bg-gradient-to-r from-[#021D3D] via-[#063B78] to-[#0A4F9E] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-amber-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 size-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="space-y-2.5 z-10 w-full md:w-auto">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] sm:text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-[#021D3D] px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                          {latestPkg ? `${t("activePlan")}: ${latestPkg.planName}` : t("noActivePackage")}
                        </span>
                        {latestPkg && (
                          <span className="text-[10px] sm:text-xs font-bold text-amber-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                            Purchased for ₹{n(latestPkg.price)} on {latestPkg.purchaseDate}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-black tracking-tight text-white leading-snug">
                        {latestPkg ? `${t("yourPackageIsActive").replace("Package", latestPkg.planName)}` : t("purchasePackageToStart")}
                      </h3>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 text-xs text-slate-200 font-semibold pt-1">
                        <span className="flex items-center justify-between sm:justify-start gap-1.5 bg-white/10 px-3 py-2 rounded-xl border border-white/15">
                          <span>💼 {t("jobPostCredits")}:</span>
                          <strong className="text-amber-300 text-xs sm:text-sm">{n(jobCredits)} {t("availableLabel")}</strong>
                        </span>
                        <span className="flex items-center justify-between sm:justify-start gap-1.5 bg-white/10 px-3 py-2 rounded-xl border border-white/15">
                          <span>👥 {t("employeeAdditionLimit")}:</span>
                          <strong className="text-emerald-300 text-xs sm:text-sm">{workerLimit === 0 ? "0" : (workerLimit >= 9999 ? t("unlimitedLabel") : `${n(workers.length)} / ${n(workerLimit)} ${t("addedLabel")}`)}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="z-10 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 shrink-0 w-full md:w-auto pt-2 sm:pt-0">
                      <Button
                        onClick={() => setShowPackageModal(true)}
                        className="w-full md:w-auto bg-gradient-to-r from-[#FFC400] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFC400] text-[#021D3D] font-black text-xs px-5 py-3 rounded-xl sm:rounded-2xl shadow-lg border-b-[3px] border-amber-600 transition-all active:scale-95 justify-center"
                      >
                        {userPkgs.length > 0 ? t("upgradePackageBtn") : t("buyPackageNowBtn")}
                      </Button>
                      {userPkgs.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("packages")}
                          className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl sm:rounded-2xl border-white/20 justify-center"
                        >
                          {t("viewBillingHistory")}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Top 4 Stat Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card 1: Total Jobs */}
                <div
                  onClick={() => setActiveTab("jobs")}
                  className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm hover:shadow-md hover:border-[#063B78] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[#5B6B7F] uppercase tracking-wider">{t("totalPostedJobs")}</span>
                    <div className="size-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black group-hover:bg-[#063B78] group-hover:text-white transition-colors shrink-0">
                      <BriefcaseBusiness className="size-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#063B78] mb-2">{n(jobs.length)}</div>
                  <div className="pt-2 border-t border-[#F0F4FA] text-xs">
                    <span className="inline-block font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {n(jobs.filter((j) => j.status === "Active").length)} {t("activeJobsLabel")}
                    </span>
                  </div>
                </div>

                {/* Card 2: Total Applications */}
                <div
                  onClick={() => setActiveTab("applications")}
                  className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm hover:shadow-md hover:border-[#063B78] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[#5B6B7F] uppercase tracking-wider">{t("totalApplications")}</span>
                    <div className="size-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black group-hover:bg-[#063B78] group-hover:text-white transition-colors shrink-0">
                      <FileText className="size-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#063B78] mb-2">{n(applications.length)}</div>
                  <div className="pt-2 border-t border-[#F0F4FA] text-xs">
                    <span className="inline-block font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      {n(new Set(applications.map((a) => a.jobSeekerId || a.candidateEmail)).size)} {t("applicantsLabel")}
                    </span>
                  </div>
                </div>

                {/* Card 3: Total Registered Employees */}
                <div
                  onClick={() => setActiveTab("attendance")}
                  className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm hover:shadow-md hover:border-[#063B78] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[#5B6B7F] uppercase tracking-wider">{t("totalEmployeesLabel")}</span>
                    <div className="size-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black group-hover:bg-[#063B78] group-hover:text-white transition-colors shrink-0">
                      <Users className="size-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#063B78] mb-2">{n(workers.length)}</div>
                  <div className="pt-2 border-t border-[#F0F4FA] text-xs">
                    <span className="inline-block font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                      {t("registeredStaff")}
                    </span>
                  </div>
                </div>

                {/* Card 4: Today's Attendance Overview */}
                <div
                  onClick={() => setActiveTab("attendance")}
                  className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm hover:shadow-md hover:border-[#063B78] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[#5B6B7F] uppercase tracking-wider">{t("presentToday")}</span>
                    <div className="size-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black group-hover:bg-[#063B78] group-hover:text-white transition-colors shrink-0">
                      <CalendarCheck className="size-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#063B78] mb-2">
                    {n(dailyAttendanceRecords.filter((r) => r.status === "Present" || r.status === "Overtime" || r.status === "HalfDay").length)} / {n(workers.length)}
                  </div>
                  <div className="pt-2 border-t border-[#F0F4FA] text-xs">
                    <span className="inline-block font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                      {t("attendanceShift")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Overview Section 1: Recent Applications */}
              <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#10233F]">
                      📥 {t("recentCandidatesTitle")}
                    </h3>
                    <p className="text-xs font-semibold text-[#5B6B7F] mt-0.5">
                      {t("recentCandidatesDesc")}
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("applications")}
                    className="bg-[#063B78] text-white font-black text-xs hover:bg-[#0A4F9E]"
                  >
                    {t("viewAllBtn")} →
                  </Button>
                </div>

                {applications.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-[#E0E8F5] rounded-xl bg-[#F8FAFF]">
                    <FileText className="size-8 text-[#A0AEC0] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#10233F]">{t("noApplicationsFound")}</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {applications.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setActiveTab("applications")}
                        className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] hover:bg-[#F0F4FA] transition-all cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-[#063B78] text-white font-black text-sm flex items-center justify-center shrink-0">
                            {(app.candidateName || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-[#10233F]">{app.candidateName}</h4>
                            <p className="text-[11px] font-semibold text-[#5B6B7F]">
                              💼 Applied for: <span className="font-bold text-[#063B78]">{app.jobTitle}</span> | 📞 {app.candidateMobile || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Overview Section 2: Employees Attendance & Payroll Register */}
              <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#10233F]">
                      👥 {t("registeredStaffRegister")}
                    </h3>
                    <p className="text-xs font-semibold text-[#5B6B7F] mt-0.5">
                      {t("registeredStaffRegisterSub")}
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("attendance")}
                    className="bg-[#063B78] text-white font-black text-xs hover:bg-[#0A4F9E]"
                  >
                    {t("viewAllArrow")}
                  </Button>
                </div>

                {workers.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-[#E0E8F5] rounded-xl bg-[#F8FAFF]">
                    <Users className="size-8 text-[#A0AEC0] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#10233F]">{t("noEmployeesRegistered")}</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {workers.slice(0, 3).map((worker) => (
                      <div
                        key={worker.id}
                        onClick={() => setActiveTab("attendance")}
                        className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] hover:bg-[#F0F4FA] transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-black text-[#063B78]">{worker.name}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">₹{worker.dailyRate}{t("dailyRateUnit")}</span>
                          </div>
                          <p className="text-xs font-semibold text-[#5B6B7F]">{t("departmentLabel")}: <span className="font-bold text-[#10233F]">{formatCategoryName(worker.category || worker.trade)}</span></p>
                          <p className="text-[11px] font-semibold text-[#5B6B7F]">{t("mobileLabel")}: {worker.mobile || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TAB 2: JOBS CONTROL */}
          <div className={activeTab === "jobs" ? "block" : "hidden"}>
            <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#10233F]">
                    {t("allPlatformJobListings")}
                  </h2>
                  <p className="text-xs font-semibold text-[#5B6B7F]">
                    {t("manageJobListingsSub")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleAddNewJobClick}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto shrink-0 cursor-pointer"
                  >
                    <Plus className="size-4" />
                    <span>{t("postNewJob")}</span>
                  </Button>

                  <div className="w-full sm:w-72 relative">
                    <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
                    <Input
                      placeholder={t("searchJobPlaceholder")}
                      value={jobSearch}
                      onChange={(e) => { setJobSearch(e.target.value); setJobsPage(1); }}
                      className="pl-9 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#DCE5F0]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#063B78] text-white font-black uppercase">
                    <tr>
                      <th className="p-3.5">{t("jobTitleTh")}</th>
                      <th className="p-3.5">{t("companyTh")}</th>
                      <th className="p-3.5">{t("locationSalaryTh")}</th>
                      <th className="p-3.5">{t("vacanciesTh")}</th>
                      <th className="p-3.5">{t("approvalTh")}</th>
                      <th className="p-3.5">{t("statusTh")}</th>
                      <th className="p-3.5 text-right">{t("actionsTh")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE5F0] font-semibold text-[#10233F]">
                    {pagedJobs.map((j) => (
                      <tr key={j.id} className="hover:bg-[#F5F8FC]">
                        <td className="p-3.5">
                          <strong className="block font-black text-[#063B78]">{j.title}</strong>
                          <span className="text-[11px] text-[#5B6B7F]">{j.category}</span>
                        </td>
                        <td className="p-3.5">
                          <strong className="block font-bold text-[#063B78]">{j.company}</strong>
                          <span className="text-[10px] text-indigo-700 font-bold block mt-0.5">👤 Posted by: {j.employerId || j.company}</span>
                        </td>
                        <td className="p-3.5">
                          <div>{j.location}</div>
                          <div className="text-[#125BB5] font-bold flex items-center gap-1.5 flex-wrap">
                            <span>{j.salary}</span>
                            {(j.showSalary === false || j.hideSalary) ? (
                              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-black">
                                🔒 {t("hiddenFromSeekers")}
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-black">
                                👁️ {t("visibleToSeekers")}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-black text-[#063B78]">{j.vacancies || 5} {t("openingsLabel")}</td>
                        <td className="p-3.5">
                          {j.approvalStatus === "rejected" ? (
                            <Badge className="bg-red-600 text-white font-bold">{t("rejectedStatusTh")}</Badge>
                          ) : j.approvalStatus === "approved" || !j.approvalStatus ? (
                            <Badge className="bg-emerald-600 text-white font-bold">✅ {t("approvedStatus")}</Badge>
                          ) : (
                            <Badge className="bg-amber-500 text-white font-bold">⏳ {t("pendingApprovalStatus")}</Badge>
                          )}
                        </td>
                        <td className="p-3.5">
                          <Badge
                            className={
                              j.status === "Active"
                                ? "bg-emerald-600 text-white font-bold"
                                : "bg-gray-500 text-white font-bold"
                            }
                          >
                            {j.status === "Active" ? t("activeStatus") : t("inactiveStatus")}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setFilterJobId(j.id);
                                setActiveTab("applications");
                              }}
                              className="bg-[#063B78] text-white font-extrabold text-[11px] hover:bg-[#0A4F9E]"
                            >
                              <Users className="size-3.5 mr-1" />
                              {t("viewApplicationsCount")} ({applications.filter((a) => a.jobId === j.id).length})
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditJobClick(j)}
                              className="font-extrabold text-[11px] border-[#063B78] text-[#063B78] hover:bg-[#F0F5FF]"
                            >
                              <Edit className="size-3.5 mr-1" /> {t("editBtn")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleJobStatus(j.id, j.status)}
                              className="font-extrabold text-[11px] border-gray-400 text-gray-700"
                            >
                              {j.status === "Active" ? "Close Job" : "Activate Job"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteJob(j.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredJobs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-xs font-bold text-[#5B6B7F] bg-[#F8FAFF]">
                          No job listings posted yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination Controls ── */}
              {totalJobPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#DCE5F0]">
                  <p className="text-xs font-bold text-[#5B6B7F]">
                    Showing {(jobsPage - 1) * JOBS_PER_PAGE + 1}—œ{Math.min(jobsPage * JOBS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length} jobs
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={jobsPage === 1}
                      onClick={() => setJobsPage((p) => p - 1)}
                      className="px-3 py-1.5 rounded-lg text-xs font-black border border-[#DCE5F0] bg-white text-[#063B78] hover:bg-[#EBF3FF] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                       Prev
                    </button>
                    {Array.from({ length: totalJobPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setJobsPage(pg)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${pg === jobsPage
                          ? "bg-[#063B78] text-white shadow-md"
                          : "border border-[#DCE5F0] bg-white text-[#063B78] hover:bg-[#EBF3FF]"
                          }`}
                      >
                        {pg}
                      </button>
                    ))}
                    <button
                      disabled={jobsPage === totalJobPages}
                      onClick={() => setJobsPage((p) => p + 1)}
                      className="px-3 py-1.5 rounded-lg text-xs font-black border border-[#DCE5F0] bg-white text-[#063B78] hover:bg-[#EBF3FF] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TAB 3: APPLICATIONS */}
          <div className={activeTab === "applications" ? "block" : "hidden"}>
            <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#10233F]">
                    {t("jobApplicationsTitle")}
                  </h2>
                  <p className="text-xs font-semibold text-[#5B6B7F]">
                    {t("jobApplicationsSubtitle").replace("{count}", String(applications.length))}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {filterJobId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFilterJobId(null)}
                      className="text-xs font-bold border-[#063B78] text-[#063B78]"
                    >
                      ✕ Show All Applications
                    </Button>
                  )}
                  <div className="w-full sm:w-64 relative">
                    <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
                    <Input
                      placeholder={t("searchCandidatePlaceholder")}
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      className="pl-9 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#DCE5F0]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#063B78] text-white font-black uppercase">
                    <tr>
                      <th className="p-3.5">{t("candidateNameTh")}</th>
                      <th className="p-3.5">{t("appliedForLabel")}</th>
                      <th className="p-3.5">{t("contactLabel")}</th>
                      <th className="p-3.5">{t("appliedDateCol")}</th>
                      <th className="p-3.5">{t("statusTh")}</th>
                      <th className="p-3.5 text-right">{t("actionsTh")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE5F0] font-semibold text-[#10233F]">
                    {applications
                      .filter((a) => !filterJobId || a.jobId === filterJobId)
                      .filter(
                        (a) =>
                          a.candidateName.toLowerCase().includes(appSearch.toLowerCase()) ||
                          a.jobTitle.toLowerCase().includes(appSearch.toLowerCase()) ||
                          a.candidateMobile.toLowerCase().includes(appSearch.toLowerCase())
                      )
                      .map((a) => (
                        <Fragment key={a.id}>
                          <tr className="hover:bg-[#F5F8FC]">
                            <td className="p-3.5 font-black text-[#063B78]">
                              <div>{a.candidateName}</div>
                              <div className="text-[11px] text-[#5B6B7F] font-normal">{a.candidateEmail}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-[#10233F]">{a.jobTitle}</div>
                              <div className="text-[11px] text-[#125BB5]">{a.companyName || "Company"} • {a.location}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${formatCallNumber(a.candidateMobile)}`}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-all flex items-center gap-1"
                                >
                                  📞 Call Candidate
                                </a>
                                <a
                                  href={`https://wa.me/${formatWaNumber(a.candidateMobile)}?text=${encodeURIComponent(`Hello ${a.candidateName}, regarding your application for ${a.jobTitle}.`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-green-600 text-white font-bold text-[10px] hover:bg-green-700 transition-all flex items-center gap-1"
                                >
                                  💬 WhatsApp
                                </a>
                              </div>
                            </td>
                            <td className="p-3.5 text-[#5B6B7F] font-bold">{a.appliedDate}</td>
                            <td className="p-3.5">
                              <select
                                value={a.status}
                                onChange={(e) => handleUpdateAppStatus(a.id, e.target.value as any)}
                                className="h-8 px-2 rounded-lg border border-[#DCE5F0] text-xs font-black focus:outline-none focus:border-[#063B78]"
                              >
                                <option value="Applied"> {t("applied")}</option>
                                <option value="Viewed"> {t("applicationViewed")}</option>
                                <option value="Shortlisted">⭐ {t("statusShortlisted")}</option>
                                <option value="Interview">📅 {t("interviewScheduled")}</option>
                                <option value="Selected">✅ {t("selectedHired")}</option>
                                <option value="Rejected"> {t("rejected")}</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setExpandedApp(expandedApp === a.id ? null : a.id)}
                                className="text-[10px] h-7 px-3 border-[#063B78] text-[#063B78] hover:bg-[#063B78] hover:text-white"
                              >
                                {expandedApp === a.id ? "Hide Details" : "View Details"}
                              </Button>
                            </td>
                          </tr>
                          {expandedApp === a.id && (
                            <tr className="bg-[#F8FAFC]">
                              <td colSpan={6} className="p-0 border-t border-[#DCE5F0]">
                                <div className="p-3 md:p-4">
                                  <div className="sticky left-0 md:static w-[88vw] sm:w-[90vw] md:w-full bg-white p-4 md:p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                                    <h4 className="font-bold text-[#10233F] mb-4 border-b pb-2 flex items-center gap-2">
                                      <FileText className="size-4 text-[#063B78]" />
                                      {t("candidateApplicationDetails")}
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                      {a.fieldValues && Object.entries(a.fieldValues)
                                        .filter(([key, value]) => key.trim() !== '' && value !== null && value !== undefined && value.toString().trim() !== '')
                                        .map(([key, value]) => (
                                          <div key={key} className="text-xs bg-[#F5F8FC] p-3 rounded-lg border border-[#DCE5F0]">
                                            <div className="font-bold text-[#5B6B7F] capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                            <div className="font-black text-[#10233F]">{value as string}</div>
                                          </div>
                                        ))}
                                      {a.customAnswers && Object.entries(a.customAnswers)
                                        .filter(([key, value]) => key.trim() !== '' && value !== null && value !== undefined && value.toString().trim() !== '')
                                        .map(([key, value]) => (
                                          <div key={key} className="text-xs bg-[#F5F8FC] p-3 rounded-lg border border-[#DCE5F0]">
                                            <div className="font-bold text-[#5B6B7F] capitalize mb-1">{key}</div>
                                            <div className="font-black text-[#10233F]">{value as string}</div>
                                          </div>
                                        ))}
                                      {(!a.fieldValues && !a.customAnswers) && (
                                        <div className="text-sm font-semibold text-[#5B6B7F]">{t("noAdditionalDetails")}</div>
                                      )}

                                    </div>
                                    {/* Employer Reply / Message to Candidate Box */}
                                    <div className="mt-5 pt-4 border-t border-[#DCE5F0]">
                                      <label className="block text-xs font-black text-[#063B78] mb-2">
                                        💬 Candidate Reply / Employer Response (या उमेदवाराला संदेश / रिप्लाय पाठवा):
                                      </label>
                                      <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                          type="text"
                                          placeholder={t("replyPlaceholder")}
                                          value={replyInputs[a.id] !== undefined ? replyInputs[a.id] : (a.replyMessage || "")}
                                          onChange={(e) => setReplyInputs(prev => ({ ...prev, [a.id]: e.target.value }))}
                                          className="flex-1 h-10 px-3.5 rounded-xl border border-[#DCE5F0] bg-[#F8FAFC] text-xs font-bold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                                        />
                                        <Button
                                          onClick={() => handleSaveReply(a.id, replyInputs[a.id] !== undefined ? replyInputs[a.id]! : (a.replyMessage || ""))}
                                          className="bg-[#063B78] hover:bg-[#082F63] text-white font-black text-xs px-5 h-10 rounded-xl shadow-xs shrink-0 cursor-pointer"
                                        >
                                          Save & Send Reply
                                        </Button>
                                      </div>
                                      {a.replyMessage && (
                                        <div className="mt-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl flex items-center justify-between">
                                          <span>✓ Sent Reply: "{a.replyMessage}"</span>
                                          {a.replyDate && <span className="text-[10px] text-emerald-600 font-semibold">{a.replyDate}</span>}
                                        </div>
                                      )}
                                    </div>

                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-xs font-bold text-[#5B6B7F] bg-[#F8FAFF]">
                          No job applications received yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* TAB 4: ATTENDANCE & WORKER MANAGEMENT */}
          <div className={activeTab === "attendance" ? "block" : "hidden"}>
            <div className="space-y-6 sm:space-y-8 animate-fade-in min-w-0">
              {/* Top Attendance Header Banner */}
              <div className="rounded-2xl border border-[#DCE5F0] bg-white p-4 sm:p-6 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-6 min-w-0 overflow-hidden flex-wrap">
                <div className="space-y-1.5 min-w-[280px] flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#063B78]/10 px-3 py-1 text-[11px] sm:text-xs font-black text-[#063B78] max-w-full truncate">
                    <CalendarCheck className="size-3.5 text-[#063B78] shrink-0" />
                    <span className="truncate">{t("employeeAttendancePayrollMgmt")}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#10233F] tracking-tight leading-snug break-words">
                    {t("employeeAttendancePayrollRegister")}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-[#5B6B7F] max-w-2xl leading-relaxed">
                    {t("manageEmployeeDetailsDesc")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap xl:flex-nowrap sm:items-center gap-2.5 shrink-0 w-full xl:w-auto min-w-0 max-w-full">
                  {/* Auto-Detected Attendance Mode Display */}
                  {attendanceMode === "field" ? (
                    <div
                      className="min-h-10 py-2 px-3.5 flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/40 rounded-xl text-[11px] sm:text-xs font-black text-amber-950 shadow-2xs w-full sm:w-auto min-w-0 max-w-full"
                      title={t("autoDetectedFieldWorksite")}
                    >
                      <span className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                      <span className="leading-snug flex-1 min-w-0 break-words">{t("fieldMovingWorksite")}</span>
                    </div>
                  ) : (
                    <div
                      className="min-h-10 py-2 px-3.5 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 rounded-xl text-[11px] sm:text-xs font-black text-[#063B78] shadow-2xs w-full sm:w-auto min-w-0 max-w-full"
                      title={t("autoDetectedFixedWorksite")}
                    >
                      <span className="size-2 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
                      <span className="leading-snug flex-1 min-w-0 break-words">{t("fixedWorksite")}</span>
                    </div>
                  )}

                  {attendanceMode === "fixed" && ((savedLocationLink || savedLocationCoords || (currentUser as any)?.worksiteLocationLink || (currentUser as any)?.worksiteLocation) ? (
                    <div className="h-10 flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-300 p-1 pl-3 rounded-xl shadow-2xs w-full sm:w-auto min-w-0 max-w-full">
                      <a
                        href={
                          (savedLocationLink || (currentUser as any)?.worksiteLocationLink)
                            ? ((savedLocationLink || (currentUser as any)?.worksiteLocationLink || "").startsWith("http")
                              ? (savedLocationLink || (currentUser as any)?.worksiteLocationLink || "")
                              : `https://${savedLocationLink || (currentUser as any)?.worksiteLocationLink}`)
                            : (savedLocationCoords || (currentUser as any)?.worksiteLocation)
                              ? `https://maps.google.com/?q=${(savedLocationCoords || (currentUser as any)?.worksiteLocation)?.lat},${(savedLocationCoords || (currentUser as any)?.worksiteLocation)?.lng}`
                              : "#"
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-900 hover:text-emerald-950 font-black text-xs flex items-center gap-1.5 max-w-[200px] sm:max-w-[280px] truncate group"
                        title={savedLocationLink || (currentUser as any)?.worksiteLocationLink || "View Worksite Location on Map"}
                      >
                        <MapPin className="size-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate underline underline-offset-2">
                          {savedLocationLink || (currentUser as any)?.worksiteLocationLink || `GPS: ${savedLocationCoords?.lat.toFixed(4)}, ${savedLocationCoords?.lng.toFixed(4)}`}
                        </span>
                        <ExternalLink className="size-3.5 text-emerald-600 shrink-0" />
                      </a>
                      <Button
                        onClick={() => {
                          setLocationLinkInput(savedLocationLink || (currentUser as any)?.worksiteLocationLink || "");
                          setShowLocationModal(true);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2.5 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 rounded-lg ml-1 shrink-0"
                        title={t("editWorksiteLocationLink")}
                      >
                        <Edit className="size-3.5 mr-1" />
                        <span>{t("editWorksiteLocation")}</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setLocationLinkInput(savedLocationLink || (currentUser as any)?.worksiteLocationLink || "");
                        setShowLocationModal(true);
                      }}
                      variant="outline"
                      className="h-10 border-[#DCE5F0] text-[#5B6B7F] hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 font-extrabold text-xs px-4 rounded-xl shadow-2xs flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer w-full sm:w-auto"
                    >
                      <MapPin className="size-4 text-emerald-600" />
                      <span>{t("setWorksiteLocation")}</span>
                    </Button>
                  ))}

                  <Button
                    onClick={handleOpenAddWorker}
                    className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer shrink-0"
                  >
                    <UserPlus className="size-4" />
                    <span>{t("addEmployeeBtn")}</span>
                  </Button>
                </div>
              </div>

              {/* Attendance Sub-View Navigation Tabs + Department Dropdown Filter */}
              {(() => {
                const categoryCounts = new Map<string, number>();
                workers.forEach((w) => {
                  const cat = w.category || w.trade || "Plant Nursery & Care";
                  categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
                });
                const allCategories = Array.from(categoryCounts.keys());

                return (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-2 sm:p-3 rounded-2xl border border-[#DCE5F0] shadow-sm min-w-0">
                      <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto sm:flex sm:items-center min-w-0">
                        {[
                          { id: "daily", fullLabel: t("dailyAttendanceSubTab"), shortLabel: t("dailyShortSubTab"), icon: CalendarCheck },
                          { id: "reports", fullLabel: t("reportsSubTab"), shortLabel: t("reportsSubTab"), icon: PieChart },
                          { id: "directory", fullLabel: `${t("employeesSubTab")} (${workers.length})`, shortLabel: `${t("employeesSubTab")} (${workers.length})`, icon: Users },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setAttendanceSubView(tab.id as any)}
                            className={`flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 rounded-xl font-extrabold text-[11px] sm:text-xs transition-all w-full sm:w-auto ${attendanceSubView === tab.id
                              ? "bg-[#063B78] text-white shadow-md shadow-[#063B78]/20"
                              : "bg-[#F8FAFF] text-[#5B6B7F] border border-[#DCE5F0] hover:bg-[#EBF1F8] hover:text-[#063B78]"
                              }`}
                          >
                            <tab.icon className="size-3.5 sm:size-4 shrink-0" />
                            <span className="hidden sm:inline">{tab.fullLabel}</span>
                            <span className="sm:hidden">{tab.shortLabel}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 min-w-0">
                        {/* Department Filter Dropdown Selector */}
                        <div className="flex items-center gap-1.5 bg-[#F8FAFF] px-3 py-2 rounded-xl border border-[#DCE5F0] w-full sm:w-auto min-w-0">
                          <Layers className="size-4 text-[#063B78] shrink-0" />
                          <span className="text-xs font-black text-[#063B78] whitespace-nowrap">{t("departmentFilterLabel")}</span>
                          <select
                            value={selectedCategoryFilter}
                            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                            className="bg-transparent font-bold text-xs text-[#10233F] focus:outline-none cursor-pointer outline-none w-full sm:max-w-[200px] truncate min-w-0"
                          >
                            <option value="ALL">{t("allCategoriesOption")} ({workers.length})</option>
                            {allCategories.map((cat) => {
                              const count = categoryCounts.get(cat) || 0;
                              return (
                                <option key={cat} value={cat}>
                                  {formatCategoryName(cat)} ({count})
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {attendanceSubView === "reports" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                            className="text-xs font-black border-[#063B78] text-[#063B78] hover:bg-blue-50 flex items-center gap-1.5 h-9 shrink-0 cursor-pointer"
                          >
                            <Printer className="size-3.5" />
                            <span>{t("printBtn")}</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* VIEW 1: DAILY ATTENDANCE SHEET */}
                    {attendanceSubView === "daily" && (
                      <div className="space-y-6">
                        {/* Attendance Quick Stats Overview */}
                        {(() => {
                          const attMap = new Map<string, DailyAttendanceRecord>();
                          dailyAttendanceRecords.forEach((r) => attMap.set(r.workerId, r));

                          let pCount = 0;
                          let hCount = 0;
                          let aCount = 0;
                          let otCount = 0;
                          let todayWageSum = 0;

                          const filteredByCat = workers.filter((w) => {
                            if (selectedCategoryFilter === "ALL") return true;
                            const cat = w.category || w.trade || "Plant Nursery / रोपवाटिका";
                            return cat === selectedCategoryFilter;
                          });

                          filteredByCat.forEach((w) => {
                            const rec = attMap.get(w.id);
                            const isFixed = w.locationType !== "field" && w.attendanceMode !== "manual";
                            let st: "Present" | "HalfDay" | "Absent" | "Overtime" = "Absent";
                            if (isFixed) {
                              if (rec?.punchInTime) {
                                st = rec.status || "Present";
                              } else {
                                st = "Absent";
                              }
                            } else {
                              st = rec?.status || "Present";
                            }

                            if (st === "Present") {
                              pCount++;
                              todayWageSum += w.dailyRate;
                            } else if (st === "HalfDay") {
                              hCount++;
                              todayWageSum += Math.round(w.dailyRate / 2);
                            } else if (st === "Absent") {
                              aCount++;
                            } else if (st === "Overtime") {
                              otCount++;
                              todayWageSum += Math.round(w.dailyRate * 1.5);
                            }
                          });

                          return (
                            <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
                              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] sm:text-xs font-bold text-[#5B6B7F] truncate" title={t("totalEmployeesLabel")}>{t("totalEmployeesLabel")}</p>
                                  <h4 className="text-xl sm:text-2xl font-black text-[#10233F] mt-0.5">{filteredByCat.length}</h4>
                                </div>
                                <div className="p-2.5 bg-blue-50 text-[#063B78] rounded-xl shrink-0">
                                  <Users className="size-5" />
                                </div>
                              </div>

                              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] sm:text-xs font-bold text-emerald-700 truncate" title={t("presentToday")}>{t("presentToday")}</p>
                                  <h4 className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">{pCount}</h4>
                                </div>
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                                  <UserCheck className="size-5" />
                                </div>
                              </div>

                              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] sm:text-xs font-bold text-amber-700 truncate" title={t("halfDayToday")}>{t("halfDayToday")}</p>
                                  <h4 className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">{hCount}</h4>
                                </div>
                                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                                  <Clock className="size-5" />
                                </div>
                              </div>

                              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] sm:text-xs font-bold text-rose-700 truncate" title={t("absentToday")}>{t("absentToday")}</p>
                                  <h4 className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5">{aCount}</h4>
                                </div>
                                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                                  <UserX className="size-5" />
                                </div>
                              </div>

                              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] sm:text-xs font-bold text-[#063B78] truncate" title={t("payableWages")}>{t("payableWages")}</p>
                                  <h4 className="text-lg sm:text-xl font-black text-[#063B78] mt-0.5">₹{todayWageSum.toLocaleString("en-IN")}</h4>
                                </div>
                                <div className="p-2.5 bg-indigo-50 text-[#063B78] rounded-xl shrink-0">
                                  <DollarSign className="size-5" />
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Date Selector & Search Bar */}
                        <div className="rounded-2xl border border-[#DCE5F0] bg-white p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-2 bg-[#F8FAFF] px-3 py-1.5 rounded-xl border border-[#DCE5F0]">
                              <Calendar className="size-4 text-[#063B78] shrink-0" />
                              <span className="text-xs font-extrabold text-[#10233F] whitespace-nowrap">{t("selectDateLabel")}:</span>
                              <input
                                type="date"
                                max={new Date().toISOString().split("T")[0]}
                                value={selectedAttendanceDate}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const todayStr = new Date().toISOString().split("T")[0]!;
                                  if (val > todayStr) {
                                    toast.error("⚠️ आजनंतरच्या (भविष्यातील) तारखेची हजेरी निवडता येत नाही! (Cannot select future date)");
                                    return;
                                  }
                                  setSelectedAttendanceDate(val);
                                }}
                                className="bg-transparent font-bold text-xs text-[#063B78] focus:outline-none cursor-pointer"
                              />
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAttendanceDate(new Date().toISOString().split("T")[0]!)}
                              className={`h-9 text-xs font-extrabold rounded-xl border-[#DCE5F0] shrink-0 ${selectedAttendanceDate === new Date().toISOString().split("T")[0]!
                                ? "bg-[#063B78] text-white hover:bg-[#063B78]"
                                : "bg-white text-[#5B6B7F]"
                                }`}
                            >
                              {t("todayBtn")}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const d = new Date();
                                d.setDate(d.getDate() - 1);
                                setSelectedAttendanceDate(d.toISOString().split("T")[0]!);
                              }}
                              className={`h-9 text-xs font-extrabold rounded-xl border-[#DCE5F0] shrink-0 ${selectedAttendanceDate ===
                                new Date(Date.now() - 86400000).toISOString().split("T")[0]!
                                ? "bg-[#063B78] text-white hover:bg-[#063B78]"
                                : "bg-white text-[#5B6B7F]"
                                }`}
                            >
                              {t("yesterdayBtn")}
                            </Button>
                          </div>

                          <div className="relative w-full sm:w-72 shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A0AEC0]" />
                            <Input
                              placeholder={t("searchEmployeePlaceholder")}
                              value={workerSearch}
                              onChange={(e) => setWorkerSearch(e.target.value)}
                              className="pl-9 h-9 text-xs font-semibold rounded-xl border-[#DCE5F0]"
                            />
                          </div>
                        </div>

                        {/* Daily Attendance Sheet Table */}
                        <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-5">
                            <div>
                              <h3 className="text-lg font-black text-[#10233F] flex items-center gap-2">
                                <span>{t("dailyAttendanceSheetTitle")}</span>
                                <Badge className="bg-[#063B78] text-white font-bold text-xs">
                                  {selectedAttendanceDate}
                                </Badge>
                              </h3>
                              <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                                {selectedCategoryFilter === "ALL"
                                  ? t("showingAttendanceAllDept")
                                  : `${t("showingAttendanceForDept")} '${selectedCategoryFilter}'`}
                              </p>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[#EBF1F8] bg-[#F8FAFF] text-[11px] uppercase tracking-wider text-[#5B6B7F] font-black">
                                  <th className="p-4 rounded-l-xl">{t("fullNameLabel")}</th>
                                  <th className="p-4">{t("departmentLabel")}</th>
                                  <th className="p-4">{t("jobTitleTh")}</th>
                                  <th className="p-4">{t("dailyWageRateLabel")}</th>
                                  {attendanceMode === "fixed" && <th className="p-4 text-center">{t("punchTimesTh")}</th>}
                                   {attendanceMode === "fixed" && <th className="p-4 text-center min-w-[200px]">{t("workDurationOvertimeTh")}</th>}
                                  <th className="p-4 text-right rounded-r-xl">{t("netSalaryLabel")}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#EBF1F8] text-xs font-semibold">
                                {(() => {
                                  const attMap = new Map<string, DailyAttendanceRecord>();
                                  dailyAttendanceRecords.forEach((r) => attMap.set(r.workerId, r));

                                  const list = workers.filter((w) => {
                                    if (selectedCategoryFilter !== "ALL") {
                                      const cat = w.category || w.trade || "Plant Nursery & Care";
                                      if (cat !== selectedCategoryFilter) return false;
                                    }
                                    const q = workerSearch.toLowerCase().trim();
                                    if (!q) return true;
                                    return (
                                      w.name.toLowerCase().includes(q) ||
                                      w.mobile.includes(q) ||
                                      w.trade.toLowerCase().includes(q) ||
                                      (w.category && w.category.toLowerCase().includes(q))
                                    );
                                  });

                                  if (list.length === 0) {
                                    return (
                                      <tr>
                                        <td colSpan={attendanceMode === "fixed" ? 7 : 5} className="py-12 text-center text-xs font-bold text-[#5B6B7F]">
                                          <div className="max-w-md mx-auto">
                                            <Users className="size-10 text-[#A0AEC0] mx-auto mb-3" />
                                            <p className="text-sm font-extrabold text-[#10233F]">
                                              {selectedCategoryFilter === "ALL"
                                                ? t("noEmployeesRegistered")
                                                : `${t("noEmployeesRegistered")} (${selectedCategoryFilter})`}
                                            </p>
                                            <p className="text-xs font-medium text-[#5B6B7F] mt-1 mb-4">
                                              {t("clickAddEmployeePrompt")}
                                            </p>
                                            <Button
                                              onClick={handleOpenAddWorker}
                                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl"
                                            >
                                              <UserPlus className="size-4 mr-1.5" /> {t("addEmployeeBtn")}
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }

                                  return list.map((worker) => {
                                    const record = attMap.get(worker.id);
                                    const isFixed = worker.locationType !== "field" && worker.attendanceMode !== "manual";

                                    const workInfo = calculateWorkAndOvertime(record?.punchInTime, record?.punchOutTime, 540);

                                    let currentStatus: "Present" | "HalfDay" | "Absent" | "Overtime" = "Absent";
                                    if (isFixed) {
                                      if (record?.punchInTime) {
                                        if (workInfo.overtimeMinutes > 0) {
                                          currentStatus = "Overtime";
                                        } else {
                                          currentStatus = record.status || "Present";
                                        }
                                      } else {
                                        currentStatus = "Absent";
                                      }
                                    } else {
                                      currentStatus = record?.status || "Present";
                                    }

                                    let earnedAmount = worker.dailyRate;
                                    if (currentStatus === "HalfDay") earnedAmount = Math.round(worker.dailyRate / 2);
                                    if (currentStatus === "Absent") earnedAmount = 0;
                                    if (currentStatus === "Overtime" || workInfo.overtimeMinutes > 0) {
                                      const baseRate = worker.dailyRate;
                                      if (workInfo.overtimeMinutes > 0) {
                                        const hourlyRate = baseRate / 9;
                                        const otPay = Math.round((workInfo.overtimeMinutes / 60) * hourlyRate * 1.5);
                                        earnedAmount = baseRate + otPay;
                                      } else {
                                        earnedAmount = Math.round(baseRate * 1.5);
                                      }
                                    }

                                    return (
                                      <tr key={worker.id} className="hover:bg-[#F8FAFF] transition-colors">
                                         <td className="p-4 font-black text-[#10233F] min-w-[200px] whitespace-nowrap">
                                           <div className="flex items-center gap-3">
                                             <div className="size-9 rounded-full bg-[#063B78]/10 text-[#063B78] font-black flex items-center justify-center text-sm shrink-0">
                                               {worker.name.slice(0, 1).toUpperCase()}
                                             </div>
                                             <div className="min-w-0">
                                               <div className="flex items-center gap-2">
                                                 <span className="text-sm font-black text-[#10233F] whitespace-nowrap">{worker.name}</span>
                                                 <button
                                                   type="button"
                                                   onClick={() => {
                                                     setCalendarWorker(worker);
                                                     setCalendarMonth(new Date().getMonth());
                                                     setCalendarYear(new Date().getFullYear());
                                                     setActiveCalendarDate(null);
                                                   }}
                                                   title={t("openAttendanceCalendar")}
                                                   className="size-7 rounded-lg bg-blue-50 hover:bg-[#063B78] text-[#063B78] hover:text-white border border-blue-200 flex items-center justify-center transition-all shadow-2xs hover:scale-110 cursor-pointer shrink-0"
                                                 >
                                                   <Calendar className="size-3.5 text-[#063B78] hover:text-white" />
                                                 </button>
                                               </div>
                                               <div className="flex items-center gap-1.5 text-xs text-[#5B6B7F] font-bold whitespace-nowrap mt-0.5">
                                                 <Phone className="size-3 text-slate-400 shrink-0" />
                                                 <span>{worker.mobile || "N/A"}</span>
                                               </div>
                                             </div>
                                           </div>
                                         </td>

                                        <td className="p-4">
                                          <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[11px]">
                                            {formatCategoryName(worker.category || worker.trade)}
                                          </Badge>
                                        </td>

                                        <td className="p-4 font-bold text-[#063B78]">
                                          {worker.trade || "General Worker"}
                                        </td>

                                        <td className="p-4 font-black text-[#10233F]">
                                          ₹{worker.dailyRate} <span className="text-[10px] font-semibold text-[#5B6B7F]">/ day</span>
                                        </td>

                                        {attendanceMode === "fixed" && (
                                          <td className="p-4 text-center">
                                            {isFixed && record?.punchInTime ? (
                                              <div className="flex flex-col gap-1 items-center justify-center text-[10px] font-black">
                                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-full text-center whitespace-nowrap">
                                                  IN: {record.punchInTime}
                                                </span>
                                                {!workInfo.isCurrentlyWorking && record.punchOutTime ? (
                                                  <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 w-full text-center whitespace-nowrap">
                                                    OUT: {record.punchOutTime}
                                                  </span>
                                                ) : (
                                                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-full text-center whitespace-nowrap">
                                                    Active (Working)
                                                  </span>
                                                )}
                                              </div>
                                            ) : (
                                              <span className="text-xs text-slate-400 font-extrabold">--</span>
                                            )}
                                          </td>
                                        )}

                                         {attendanceMode === "fixed" && (
                                           <td className="p-4 text-center min-w-[200px]">
                                             <div className="flex flex-col items-center justify-center gap-1.5">
                                               {record?.punchInTime ? (
                                                 <div className="flex flex-col items-center gap-1">
                                                   <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1 rounded-xl shadow-xs font-black text-xs">
                                                     <Clock className="size-3.5 text-emerald-600" />
                                                     <span>
                                                       {workInfo.isCurrentlyWorking ? `⏳ ${t("liveWorkLabel")} ` : `⏱️ ${t("workedLabel")} `}
                                                       <strong className="text-emerald-950 font-black">{workInfo.workedText}</strong>
                                                     </span>
                                                   </div>
                                                   {workInfo.overtimeText && (
                                                     <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-400 text-amber-950 px-3 py-1 rounded-xl shadow-xs font-black text-xs animate-pulse">
                                                       <Zap className="size-3.5 text-amber-600 fill-amber-500" />
                                                       <span>
                                                         {t("overtimeLabel")} <strong className="text-amber-950 font-black">{workInfo.overtimeText}</strong>
                                                       </span>
                                                     </div>
                                                   )}
                                                 </div>
                                               ) : (
                                                 <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 text-slate-600 px-3.5 py-1.5 rounded-2xl">
                                                   <Clock className="size-4 text-slate-400" />
                                                   <span className="font-extrabold text-xs">
                                                     {t("autoAbsentNotPunched")}
                                                   </span>
                                                 </div>
                                               )}
                                             </div>
                                           </td>
                                         )}

                                        <td className="p-4 text-right font-black text-emerald-700 text-sm">
                                          ₹{earnedAmount.toLocaleString("en-IN")}
                                        </td>
                                      </tr>
                                    );
                                  });
                                })()}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VIEW 2: WEEKLY & MONTHLY REPORTS */}
                    {attendanceSubView === "reports" && (
                      <div className="space-y-6">
                        {/* Timeframe Filter Bar */}
                        <div className="rounded-2xl border border-[#DCE5F0] bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black text-[#10233F] mr-1 flex items-center gap-1">
                              <CalendarDays className="size-4 text-[#063B78]" />
                              {t("reportPeriodLabel")}
                            </span>
                            <button
                              onClick={() => setReportTimeframe("week")}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${reportTimeframe === "week"
                                ? "bg-[#063B78] text-white shadow-md"
                                : "bg-[#F5F8FC] text-[#5B6B7F] border border-[#DCE5F0] hover:bg-[#EBF1F8]"
                                }`}
                            >
                              This Week
                            </button>

                            <button
                              onClick={() => setReportTimeframe("month")}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${reportTimeframe === "month"
                                ? "bg-[#063B78] text-white shadow-md"
                                : "bg-[#F5F8FC] text-[#5B6B7F] border border-[#DCE5F0] hover:bg-[#EBF1F8]"
                                }`}
                            >
                              This Month
                            </button>

                            <button
                              onClick={() => setReportTimeframe("custom")}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${reportTimeframe === "custom"
                                ? "bg-[#063B78] text-white shadow-md"
                                : "bg-[#F5F8FC] text-[#5B6B7F] border border-[#DCE5F0] hover:bg-[#EBF1F8]"
                                }`}
                            >
                              Custom Date Range
                            </button>
                          </div>

                          {reportTimeframe === "custom" && (
                            <div className="flex items-center gap-2">
                              <input
                                type="date"
                                value={reportStartDate}
                                onChange={(e) => setReportStartDate(e.target.value)}
                                className="bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl px-3 py-1.5 text-xs font-bold text-[#063B78]"
                              />
                              <span className="text-xs font-bold text-[#5B6B7F]">{t("toWord")}</span>
                              <input
                                type="date"
                                value={reportEndDate}
                                onChange={(e) => setReportEndDate(e.target.value)}
                                className="bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl px-3 py-1.5 text-xs font-bold text-[#063B78]"
                              />
                            </div>
                          )}
                        </div>

                        {/* Report Period Summary Cards */}
                        {(() => {
                          const filteredWorkers = workers.filter((w) => {
                            if (selectedCategoryFilter === "ALL") return true;
                            return (w.category || w.trade) === selectedCategoryFilter;
                          });

                          let totalPresentDays = 0;
                          let totalHalfDays = 0;
                          let totalAbsentDays = 0;
                          let totalOvertimeDays = 0;
                          let totalPeriodPayroll = 0;

                          filteredWorkers.forEach((w) => {
                            const workerRecs = reportAttendanceRecords.filter((r) => r.workerId === w.id);
                            workerRecs.forEach((r) => {
                              if (r.status === "Present") {
                                totalPresentDays++;
                                totalPeriodPayroll += w.dailyRate;
                              } else if (r.status === "HalfDay") {
                                totalHalfDays++;
                                totalPeriodPayroll += Math.round(w.dailyRate / 2);
                              } else if (r.status === "Absent") {
                                totalAbsentDays++;
                              } else if (r.status === "Overtime") {
                                totalOvertimeDays++;
                                totalPeriodPayroll += Math.round(w.dailyRate * 1.5);
                              }
                            });
                          });

                          return (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                              <div className="p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-[#5B6B7F]">{t("totalRecordedDays")}</p>
                                  <h4 className="text-2xl font-black text-[#10233F] mt-1">{reportAttendanceRecords.length}</h4>
                                </div>
                                <div className="p-3 bg-blue-50 text-[#063B78] rounded-xl">
                                  <CalendarDays className="size-5" />
                                </div>
                              </div>

                              <div className="p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-emerald-700">{t("totalPresentDays")}</p>
                                  <h4 className="text-2xl font-black text-emerald-600 mt-1">{totalPresentDays}</h4>
                                </div>
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                  <UserCheck className="size-5" />
                                </div>
                              </div>

                              <div className="p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-amber-700">{t("totalHalfDays")}</p>
                                  <h4 className="text-2xl font-black text-amber-600 mt-1">{totalHalfDays}</h4>
                                </div>
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                  <Clock className="size-5" />
                                </div>
                              </div>

                              <div className="p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-rose-700">{t("totalAbsentDays")}</p>
                                  <h4 className="text-2xl font-black text-rose-600 mt-1">{totalAbsentDays}</h4>
                                </div>
                                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                                  <UserX className="size-5" />
                                </div>
                              </div>

                              <div className="p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-[#063B78]">{t("netTotalPayroll")}</p>
                                  <h4 className="text-xl font-black text-[#063B78] mt-1">₹{totalPeriodPayroll.toLocaleString("en-IN")}</h4>
                                </div>
                                <div className="p-3 bg-indigo-50 text-[#063B78] rounded-xl">
                                  <DollarSign className="size-5" />
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Worker Report Summary Table */}
                        <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-5">
                            <div>
                              <h3 className="text-lg font-black text-[#10233F] flex items-center gap-2">
                                <span>📊 {t("payrollSummaryTitle")}</span>
                                <Badge className="bg-[#063B78] text-white font-bold text-xs uppercase">
                                  {reportTimeframe === "week" ? t("weeklyReportBadge") : reportTimeframe === "month" ? t("monthlyReportBadge") : t("customRangeBadge")}
                                </Badge>
                              </h3>
                              <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                                {t("payrollSummaryDesc")}
                              </p>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[#EBF1F8] bg-[#F8FAFF] text-[11px] uppercase tracking-wider text-[#5B6B7F] font-black">
                                  <th className="p-4 rounded-l-xl">{t("employeeName")}</th>
                                  <th className="p-4">{t("department")}</th>
                                  <th className="p-4">{t("dailyWageRate")}</th>
                                  <th className="p-4 text-center text-emerald-700">{t("presentDaysTh")}</th>
                                  <th className="p-4 text-center text-amber-700">{t("halfDaysTh")}</th>
                                  <th className="p-4 text-center text-rose-700">{t("absentDaysTh")}</th>
                                  <th className="p-4 text-center text-blue-700">{t("overtimeDaysTh")}</th>
                                  <th className="p-4 text-right rounded-r-xl">{t("netPayableWagesTh")}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#EBF1F8] text-xs font-semibold">
                                {(() => {
                                  const filtered = workers.filter((w) => {
                                    if (selectedCategoryFilter === "ALL") return true;
                                    return (w.category || w.trade) === selectedCategoryFilter;
                                  });

                                  if (filtered.length === 0) {
                                    return (
                                      <tr>
                                        <td colSpan={8} className="p-8 text-center text-xs font-bold text-[#5B6B7F]">
                                          {t("noEmployeeAttendanceRecords")}
                                        </td>
                                      </tr>
                                    );
                                  }

                                  return filtered.map((worker) => {
                                    const recs = reportAttendanceRecords.filter((r) => r.workerId === worker.id);
                                    let presentCount = 0;
                                    let halfCount = 0;
                                    let absentCount = 0;
                                    let otCount = 0;
                                    let totalWage = 0;

                                    recs.forEach((r) => {
                                      if (r.status === "Present") {
                                        presentCount++;
                                        totalWage += worker.dailyRate;
                                      } else if (r.status === "HalfDay") {
                                        halfCount++;
                                        totalWage += Math.round(worker.dailyRate / 2);
                                      } else if (r.status === "Absent") {
                                        absentCount++;
                                      } else if (r.status === "Overtime") {
                                        otCount++;
                                        totalWage += Math.round(worker.dailyRate * 1.5);
                                      }
                                    });

                                    return (
                                      <tr key={worker.id} className="hover:bg-[#F8FAFF]">
                                        <td className="p-4 font-black text-[#10233F]">
                                          <div className="text-sm font-black">{worker.name}</div>
                                          <div className="text-[10px] text-[#5B6B7F]">📞 {worker.mobile || "N/A"}</div>
                                        </td>

                                        <td className="p-4">
                                          <Badge className="bg-blue-50 text-[#063B78] border border-blue-200 font-extrabold text-[11px]">
                                            {formatCategoryName(worker.category || worker.trade)}
                                          </Badge>
                                        </td>

                                        <td className="p-4 font-black text-[#10233F]">
                                          ₹{worker.dailyRate} / day
                                        </td>

                                        <td className="p-4 text-center font-black text-emerald-600 text-sm">
                                          {presentCount}
                                        </td>

                                        <td className="p-4 text-center font-black text-amber-600 text-sm">
                                          {halfCount}
                                        </td>

                                        <td className="p-4 text-center font-black text-rose-600 text-sm">
                                          {absentCount}
                                        </td>

                                        <td className="p-4 text-center font-black text-blue-600 text-sm">
                                          {otCount}
                                        </td>

                                        <td className="p-4 text-right font-black text-emerald-700 text-base">
                                          ₹{totalWage.toLocaleString("en-IN")}
                                        </td>
                                      </tr>
                                    );
                                  });
                                })()}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VIEW 3: WORKER DIRECTORY */}
                    {attendanceSubView === "directory" && (
                      <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm space-y-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-black text-[#10233F] flex items-center gap-2">
                              <span>👥 {t("registeredEmployeeDirectory")}</span>
                              <Badge className="bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                                {workers.length} {t("employeesTotalBadge")}
                              </Badge>
                            </h3>
                            <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                              {t("manageEmployeesDesc")}
                            </p>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-[#EBF1F8] bg-[#F8FAFF] text-[11px] uppercase tracking-wider text-[#5B6B7F] font-black">
                                <th className="p-4 rounded-l-xl">{t("employeeName")}</th>
                                <th className="p-4">{t("department")}</th>
                                <th className="p-4">{t("roleDesignationTh")}</th>
                                <th className="p-4">{t("mobileNumberTh")}</th>
                                <th className="p-4">{t("dailyWageRate")}</th>
                                <th className="p-4">{t("joiningDateTh")}</th>
                                <th className="p-4 text-center rounded-r-xl">{t("actionsThDirectory")}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EBF1F8] text-xs font-semibold">
                              {workers.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="p-8 text-center text-xs font-bold text-[#5B6B7F]">
                                    {t("noEmployeesRegistered")}
                                  </td>
                                </tr>
                              ) : (
                                workers.map((w) => (
                                  <tr key={w.id} className="hover:bg-[#F8FAFF]">
                                    <td className="p-4">
                                      <div className="flex items-center gap-2">
                                        <div className="font-black text-[#10233F]">{w.name}</div>

                                      </div>
                                      {(w.workShiftStart || w.workShiftEnd) && (
                                        <div className="text-[10px] text-[#063B78] font-bold mt-0.5 flex items-center gap-1">
                                          <Clock className="size-3 text-[#063B78]" />
                                          <span>{t("shiftLabel")} {formatTime12Hr(w.workShiftStart || "09:00")} - {formatTime12Hr(w.workShiftEnd || "18:00")}</span>
                                        </div>
                                      )}
                                      {w.customFields && w.customFields.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {w.customFields.map((cf, i) => (
                                            <span key={i} className="text-[9px] font-black bg-blue-50 text-[#063B78] border border-blue-200 px-1.5 py-0.5 rounded">
                                              {cf.label}: {cf.value}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </td>
                                    <td className="p-4">
                                      <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[11px]">
                                        {formatCategoryName(w.category || w.trade)}
                                      </Badge>
                                    </td>
                                    <td className="p-4 font-bold text-[#063B78]">{w.trade}</td>
                                    <td className="p-4 text-[#5B6B7F]">{w.mobile || "N/A"}</td>
                                    <td className="p-4 font-black text-emerald-700">₹{w.dailyRate} / day</td>
                                    <td className="p-4 text-[#5B6B7F]">{w.joiningDate || "N/A"}</td>
                                    <td className="p-4 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setSelectedWorkerReport(w)}
                                          className="h-8 px-2.5 rounded-lg border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-xs font-bold text-[#063B78]"
                                          title={t("viewReportAndPrintSlip")}
                                        >
                                          <FileText className="size-3.5 mr-1 text-[#063B78]" /> {t("slipBtn")}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleOpenEditWorker(w)}
                                          className="h-8 px-2.5 rounded-lg border-[#DCE5F0] text-xs font-bold text-[#063B78]"
                                        >
                                          <Edit className="size-3.5 mr-1" /> Edit
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleDeleteWorker(w.id, w.name)}
                                          className="h-8 px-2.5 rounded-lg border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50"
                                        >
                                          <Trash2 className="size-3.5 mr-1" /> {t("deleteBtn")}
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* TAB 5: MY PROFILE */}
          <div className={activeTab === "profile" ? "block" : "hidden"}>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-5 border-b border-[#EBF1F8] mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#F0F4FA] rounded-xl text-[#063B78]">
                      <User className="size-6 text-[#063B78]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#10233F]">{t("employerProfileSettings")}</h2>
                      <p className="text-xs font-semibold text-[#5B6B7F]">{t("updateOrgDetailsDesc")}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-bold text-xs px-3 py-1">
                    ✓ {t("verifiedEmployer")}
                  </Badge>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Profile Photo Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-[#F8FAFF] border border-[#E0E8F5]">
                    <div className="relative shrink-0">
                      {profileForm.profilePhoto ? (
                        <img
                          src={profileForm.profilePhoto}
                          alt="Profile Avatar"
                          className="size-24 rounded-full object-cover shadow-md ring-4 ring-white border-2 border-[#063B78]"
                        />
                      ) : (
                        <div className="size-24 rounded-full bg-gradient-to-br from-[#063B78] to-[#125BB5] text-white font-black text-3xl flex items-center justify-center shadow-md ring-4 ring-white border-2 border-white">
                          {(profileForm.fullName || "E").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                      <h3 className="text-sm font-black text-[#10233F]">{t("profilePictureLogoUrl")}</h3>
                      <p className="text-xs text-[#5B6B7F]">{t("providePhotoUrlDesc")}</p>
                      <Input
                        type="url"
                        placeholder="https://example.com/logo.jpg"
                        value={profileForm.profilePhoto}
                        onChange={(e) => setProfileForm({ ...profileForm, profilePhoto: e.target.value })}
                        className="text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">{t("companyOrgName")}</label>
                      <Input
                        required
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        placeholder="e.g. Vikas Ropvatika & Nursery"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">{t("contactPersonName")}</label>
                      <Input
                        value={profileForm.contactPerson}
                        onChange={(e) => setProfileForm({ ...profileForm, contactPerson: e.target.value })}
                        placeholder="e.g. Vikas Patil"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">{t("emailAddress")}</label>
                      <Input
                        required
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="e.g. ropvatika@gmail.com"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">{t("mobilePhoneNumber")}</label>
                      <Input
                        required
                        value={profileForm.mobile}
                        onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                        placeholder="e.g. 9822011223"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">{t("locationAddress")}</label>
                      <Input
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="e.g. Pune, Maharashtra"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">{t("businessIndustrySector")}</label>
                      <Input
                        value={profileForm.industry}
                        onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                        placeholder="e.g. Plant Nursery & Agricultural Services"
                        className="text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBF1F8]">
                    <Button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#063B78] hover:bg-[#0A4F9E] text-white font-black text-xs shadow-md flex items-center gap-2"
                    >
                      <CheckCircle2 className="size-4" /> {t("saveProfileDetails")}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* TAB 6: MY PACKAGES & BILLING */}
          <div className={activeTab === "packages" ? "block" : "hidden"}>
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
              {(() => {
                const userId = currentUser?.id || currentUser?.email || empIdentifier;
                const userPkgs = dataStore.getUserPackages(userId);
                const workerLimit = dataStore.getUserWorkerCredits(userId);
                const jobCredits = dataStore.getUserJobCredits(userId);

                return (
                  <>
                    <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-black text-[#10233F] flex items-center gap-2">
                          <span>💳 {t("activePackageStatus")}</span>
                          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-3 py-0.5 rounded-full">
                            {userPkgs.length} {t("activePurchases")}
                          </span>
                        </h2>
                        <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                          {t("manageActiveCreditsDesc")}
                        </p>
                      </div>

                      <Button
                        onClick={() => setShowPackageModal(true)}
                        className="bg-[#063B78] hover:bg-[#0A4F9E] text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md shrink-0"
                      >
                        {t("buyUpgradePackage")}
                      </Button>
                    </div>

                    {/* Active Plan Overview Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-1">
                        <span className="text-[11px] font-black uppercase text-[#5B6B7F] tracking-wider">{t("currentJobCredits")}</span>
                        <div className="text-3xl font-black text-amber-600">{jobCredits} Available</div>
                        <p className="text-xs text-slate-500 font-medium">{t("jobPostingsRemaining")}</p>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-1">
                        <span className="text-[11px] font-black uppercase text-[#5B6B7F] tracking-wider">{t("employeeAdditionLimit")}</span>
                        <div className="text-3xl font-black text-indigo-700">
                          {workerLimit === 0 ? "0 Allowed" : (workerLimit >= 9999 ? "Unlimited" : `${workerLimit} Employees`)}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{workers.length} Employees Currently Added</p>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-1">
                        <span className="text-[11px] font-black uppercase text-[#5B6B7F] tracking-wider">{t("totalAmountSpent")}</span>
                        <div className="text-3xl font-black text-emerald-600">
                          ₹{userPkgs.reduce((sum, p) => sum + (p.price || 0), 0)}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Across {userPkgs.length} transaction(s)</p>
                      </div>
                    </div>

                    {/* Transaction History Table */}
                    <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 shadow-sm space-y-4">
                      <h3 className="text-base font-black text-[#10233F]">{t("packagePurchaseHistory")}</h3>

                      {userPkgs.length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed border-[#E0E8F5] rounded-xl bg-[#F8FAFF]">
                          <IndianRupee className="size-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-bold text-[#10233F]">{t("noPackagePurchasesFound")}</p>
                          <p className="text-xs text-slate-500 mt-1 mb-4">{t("clickToChoosePackageDesc")}</p>
                          <Button
                            onClick={() => setShowPackageModal(true)}
                            className="bg-[#063B78] text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md"
                          >
                            Choose Package Plan
                          </Button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-[#F8FAFF] border-b border-[#E0E8F5] text-[#5B6B7F] font-black uppercase tracking-wider text-[11px]">
                                <th className="p-3 whitespace-nowrap">{t("transactionIdCol")}</th>
                                <th className="p-3 whitespace-nowrap">{t("packageNameCol")}</th>
                                <th className="p-3 whitespace-nowrap">{t("pricePaidCol")}</th>
                                <th className="p-3 whitespace-nowrap">{t("jobCredits")}</th>
                                <th className="p-3 whitespace-nowrap">{t("employeeLimitCol")}</th>
                                <th className="p-3 whitespace-nowrap">{t("paymentMethodCol")}</th>
                                <th className="p-3 whitespace-nowrap">{t("purchaseDateCol")}</th>
                                <th className="p-3 whitespace-nowrap">{t("status")}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E0E8F5] font-semibold text-[#10233F]">
                              {userPkgs.map((tx) => (
                                <tr key={tx.id} className="hover:bg-[#F8FAFF] transition-colors">
                                  <td className="p-3 font-mono text-[11px] text-[#063B78] whitespace-nowrap">{tx.id}</td>
                                  <td className="p-3 whitespace-nowrap">
                                    <span className="px-3 py-1 rounded-xl bg-blue-50 text-[#063B78] border border-blue-200 font-black text-xs inline-block whitespace-nowrap shadow-2xs">
                                      {tx.planName}
                                    </span>
                                  </td>
                                  <td className="p-3 font-black text-emerald-700 text-sm whitespace-nowrap">₹{tx.price}</td>
                                  <td className="p-3 font-extrabold text-amber-700 whitespace-nowrap">{tx.jobCount >= 999 ? t("unlimitedLabel") : tx.jobCount}</td>
                                  <td className="p-3 font-extrabold text-indigo-700 whitespace-nowrap">{tx.workerCount ? (Number(tx.workerCount) >= 9999 ? t("unlimitedLabel") : `${tx.workerCount} ${t("employeesSubTab")}`) : `3 ${t("employeesSubTab")}`}</td>
                                  <td className="p-3 font-bold uppercase text-slate-600 whitespace-nowrap">{tx.paymentMethod}</td>
                                  <td className="p-3 text-[#5B6B7F] font-medium whitespace-nowrap">{tx.purchaseDate}</td>
                                  <td className="p-3 whitespace-nowrap">
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black inline-block whitespace-nowrap">
                                      {t("activeCompletedStatus")}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* TAB: E-SALARY / SLIPS */}
          <div className={activeTab === "salary" ? "block" : "hidden"}>
            <div className="space-y-6 sm:space-y-8 animate-fade-in min-w-0">

              {/* Top Salary Header Banner */}
              <div className="rounded-2xl border border-[#DCE5F0] bg-white p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0 overflow-hidden flex-wrap">
                <div className="space-y-1.5 min-w-[280px] flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#063B78]/10 px-3 py-1 text-[11px] sm:text-xs font-black text-[#063B78] max-w-full truncate">
                    <FileText className="size-3.5 text-[#063B78] shrink-0" />
                    <span className="truncate">{t("eSalaryPayslipsManagement")}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#10233F] tracking-tight leading-snug break-words">
                    {t("employeeSalarySlipsTitle")}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-[#5B6B7F] max-w-2xl leading-relaxed">
                    {t("employeeSalarySlipsDesc")}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={selectedSalaryMonth}
                    onChange={(e) => setSelectedSalaryMonth(e.target.value)}
                    className="h-10 px-3 bg-[#F8FAFF] rounded-xl border border-[#DCE5F0] text-xs font-black text-[#063B78] focus:outline-none cursor-pointer"
                  >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                      <option key={m} value={m}>{m} {selectedSalaryYear}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-4">
                <div className="overflow-x-auto rounded-xl border border-[#DCE5F0]">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-[#063B78] text-white font-black uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">{t("employeeName")}</th>
                        <th className="p-4">{t("positionCol")}</th>
                        <th className="p-4 text-center">{t("wageRateCol")}</th>
                        <th className="p-4 text-center">{t("present")}</th>
                        <th className="p-4 text-center">{t("absent")}</th>
                        <th className="p-4 text-right">{t("netEarnedCol")}</th>
                        <th className="p-4 text-center">{t("actionCol")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE5F0] font-semibold text-[#10233F]">
                      {workers.map((emp) => {
                        const metrics = getWorkerReportMetrics(emp, "month", selectedSalaryMonth, selectedSalaryYear);

                        return (
                          <tr key={emp.id} className="hover:bg-[#F5F8FC] transition-colors">
                            <td className="p-4">
                              <strong className="block font-black text-[#063B78]">{emp.name}</strong>
                              <span className="text-[10px] text-slate-400 font-medium">ID: RJW-{emp.id.slice(-6).toUpperCase()}</span>
                            </td>
                            <td className="p-4 text-[#5B6B7F] font-bold">{emp.trade || "Worker"}</td>
                            <td className="p-4 text-slate-600 font-bold text-center">₹{emp.dailyRate} / day</td>
                            <td className="p-4 text-emerald-600 font-black text-center">{metrics.present + metrics.halfDay * 0.5} Days</td>
                            <td className="p-4 text-rose-600 font-black text-center">{metrics.absent} Days</td>
                            <td className="p-4 text-right font-black text-emerald-700 text-sm">
                              ₹{metrics.netPay.toLocaleString("en-IN")}
                            </td>
                            <td className="p-4 text-center">
                              <Button
                                onClick={() => {
                                  setViewSlipPeriod("month");
                                  setViewSlipWorker(emp);
                                }}
                                size="sm"
                                className="bg-[#063B78] hover:bg-[#082F63] text-white text-xs font-black px-4 shadow-sm cursor-pointer"
                              >
                                View Slip
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                      {workers.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-xs font-bold text-[#5B6B7F] bg-[#F8FAFF]">
                            <p className="mb-2">{t("noRegisteredEmployeesFound")}</p>
                            <Button
                              onClick={handleOpenAddWorker}
                              size="sm"
                              className="bg-[#063B78] hover:bg-[#082F63] text-white font-black text-xs h-8"
                            >
                              + Add Employee
                            </Button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── SET WORKSITE LOCATION MODAL ── */}
      {showLocationModal && (() => {
        const handleUseCurrentLocation = () => {
          if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser / device.");
            return;
          }

          setIsDetectingLocation(true);
          toast.info("📍 Fetching your exact GPS location...");

          navigator.geolocation.getCurrentPosition(
            (position) => {
              setIsDetectingLocation(false);
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const accuracy = position.coords.accuracy ? Math.round(position.coords.accuracy) : null;

              const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
              const coordsObj = { lat, lng };

              setLocationLinkInput(mapsLink);
              setSavedLocationLink(mapsLink);
              setSavedLocationCoords(coordsObj);

              try {
                localStorage.setItem(`emp_worksite_link_${empIdentifier}`, mapsLink);
                localStorage.setItem(`emp_worksite_coords_${empIdentifier}`, JSON.stringify(coordsObj));
              } catch (e) { }

              if (currentUser) {
                const updated = (currentUser.id ? dataStore.updateRegisteredAccount(currentUser.id, {
                  worksiteLocation: coordsObj,
                  worksiteLocationLink: mapsLink,
                }) : null) || { ...currentUser, worksiteLocation: coordsObj, worksiteLocationLink: mapsLink };

                dataStore.setCurrentUser(updated);
                try {
                  sessionStorage.setItem("realjob_tab_user", JSON.stringify(updated));
                  localStorage.setItem("realjob-user", JSON.stringify(updated));
                  if (currentUser.role === "employer") localStorage.setItem("realjob-user-employer", JSON.stringify(updated));
                  if (currentUser.role === "admin") localStorage.setItem("realjob-user-admin", JSON.stringify(updated));
                } catch (e) { }
              }

              toast.success(`📍 Worksite Location set to Current GPS! (${lat.toFixed(5)}, ${lng.toFixed(5)}${accuracy ? `, ~${accuracy}m` : ""})`);
              setShowLocationModal(false);
            },
            (error) => {
              setIsDetectingLocation(false);
              console.error("GPS error:", error);
              if (error.code === error.PERMISSION_DENIED) {
                toast.error("Location permission denied. Please allow location access in your browser settings.");
              } else if (error.code === error.POSITION_UNAVAILABLE) {
                toast.error("Location information is currently unavailable.");
              } else if (error.code === error.TIMEOUT) {
                toast.error("Location request timed out. Please try again or paste a map link.");
              } else {
                toast.error("Unable to get current location. Please paste a map link below.");
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 12000,
              maximumAge: 0,
            }
          );
        };

        const handleSaveMapLink = () => {
          const rawInput = locationLinkInput.trim();
          if (!rawInput) {
            toast.error("Please enter or paste a map location link.");
            return;
          }

          setSavedLocationLink(rawInput);
          try {
            localStorage.setItem(`emp_worksite_link_${empIdentifier}`, rawInput);
          } catch (e) { }

          const parsed = parseMapCoordinates(rawInput);
          let coordsObj = parsed || { lat: 18.5204, lng: 73.8567 };

          if (parsed) {
            toast.info(` Recognized Location: ${parsed.lat.toFixed(6)}, ${parsed.lng.toFixed(6)}`);
          } else {
            toast.warning("Saved link for reference.");
          }

          setSavedLocationCoords(coordsObj);
          try {
            localStorage.setItem(`emp_worksite_coords_${empIdentifier}`, JSON.stringify(coordsObj));
          } catch (e) { }

          if (currentUser) {
            const updated = (currentUser.id ? dataStore.updateRegisteredAccount(currentUser.id, {
              worksiteLocation: coordsObj,
              worksiteLocationLink: rawInput,
            }) : null) || { ...currentUser, worksiteLocation: coordsObj, worksiteLocationLink: rawInput };

            dataStore.setCurrentUser(updated);
            try {
              sessionStorage.setItem("realjob_tab_user", JSON.stringify(updated));
              localStorage.setItem("realjob-user", JSON.stringify(updated));
              if (currentUser.role === "employer") localStorage.setItem("realjob-user-employer", JSON.stringify(updated));
              if (currentUser.role === "admin") localStorage.setItem("realjob-user-admin", JSON.stringify(updated));
            } catch (e) { }
          }

          toast.success("✅ Worksite Location Link Saved Successfully!");
          setShowLocationModal(false);
        };

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
              <button
                onClick={() => setShowLocationModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-extrabold text-xl p-2 rounded-full hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
                  <MapPin className="size-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#10233F]">
                    {t("setWorksiteTitle")}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {t("setWorksiteDesc")}
                  </p>
                </div>
              </div>

              {(savedLocationLink || savedLocationCoords) && (
                <div className="mb-4 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl">
                  <p className="text-[11px] font-black text-emerald-900 uppercase tracking-wide">
                    Current Saved Location:
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-xs font-bold text-emerald-800 truncate">
                      {savedLocationLink || `GPS: ${savedLocationCoords?.lat.toFixed(4)}, ${savedLocationCoords?.lng.toFixed(4)}`}
                    </span>
                    <a
                      href={
                        savedLocationLink
                          ? (savedLocationLink.startsWith("http") ? savedLocationLink : `https://${savedLocationLink}`)
                          : `https://maps.google.com/?q=${savedLocationCoords?.lat},${savedLocationCoords?.lng}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-emerald-700 hover:underline shrink-0 flex items-center gap-1"
                    >
                      Open Map <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* OPTION 1: USE CURRENT GPS LOCATION */}
                <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-emerald-50 border border-emerald-200 rounded-2xl shadow-2xs space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-sm">
                      <LocateFixed className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                        Option 1: Device GPS (चालू स्थान)
                      </h4>
                      <p className="text-[11px] text-emerald-800/80 font-medium leading-relaxed mt-0.5">
                        सध्या ऑफिस/साइटवर असाल तर 1-क्लिकमध्ये तुमचे चालू GPS लोकेशन सेव्ह करा.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isDetectingLocation}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    {isDetectingLocation ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>{t("detectingGps")}</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="size-4" />
                        <span>{t("useCurrentLocationBtn")}</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* DIVIDER */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white px-2">
                    OR Paste Map Link
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* OPTION 2: PASTE MAP LINK */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-bold text-[#10233F] mb-1">
                      Option 2: Paste Google Maps / Bing Maps Link
                    </label>
                    <p className="text-[11px] text-slate-500 font-semibold mb-2">
                      गुगल मॅप्स किंवा बिंग मॅप्सची लोकेशन लिंक खाली पेस्ट करा.
                    </p>
                    <div className="relative">
                      <Input
                        value={locationLinkInput}
                        onChange={(e) => setLocationLinkInput(e.target.value)}
                        placeholder={t("pasteMapsPlaceholder")}
                        className="text-xs font-semibold pr-8"
                      />
                      {locationLinkInput && (
                        <button
                          type="button"
                          onClick={() => setLocationLinkInput("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleSaveMapLink}
                    className="w-full h-10 bg-[#063B78] hover:bg-[#082F63] text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    Save Map Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── ADD / EDIT WORKER MODAL WITH CUSTOM FIELDS GENERATOR ── */}
      {showWorkerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowWorkerModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-extrabold text-xl p-2 rounded-full hover:bg-slate-100"
            >
              ✕
            </button>

            {/* Modal Header & TOP + Add Custom Field Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 pr-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
                  <UserPlus className="size-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#10233F]">
                    {editingWorkerId ? t("editEmployeeTitle") : t("addNewEmployeeTitle")}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {t("employeeFormSubtitle")}
                  </p>
                </div>
              </div>

              {/* TOP + ADD CUSTOM FIELD BUTTON */}
              <button
                type="button"
                onClick={handleOpenAddFieldPrompt}
                className="px-3.5 py-2.5 rounded-xl bg-[#063B78] hover:bg-[#0A4F9E] text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shrink-0 self-start sm:self-auto"
              >
                <Plus className="size-4" /> Add Custom Field
              </button>
            </div>

            <form onSubmit={handleSaveWorker} className="space-y-4">
              {/* Optional Restore Removed Fields Bar */}
              {removedStandardFields.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap p-2.5 bg-amber-50/80 rounded-2xl border border-amber-200/80 mb-2">
                  <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wide mr-1">
                    Restore Hidden Fields:
                  </span>
                  {removedStandardFields.includes("trade") && (
                    <button
                      type="button"
                      onClick={() => handleRestoreStandardField("trade")}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 shadow-2xs transition-all"
                    >
                      + Role / Designation
                    </button>
                  )}
                  {removedStandardFields.includes("mobile") && (
                    <button
                      type="button"
                      onClick={() => handleRestoreStandardField("mobile")}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 shadow-2xs transition-all"
                    >
                      + Mobile Number
                    </button>
                  )}
                  {removedStandardFields.includes("joiningDate") && (
                    <button
                      type="button"
                      onClick={() => handleRestoreStandardField("joiningDate")}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 shadow-2xs transition-all"
                    >
                      + Joining Date
                    </button>
                  )}
                  {removedStandardFields.includes("shiftTimes") && (
                    <button
                      type="button"
                      onClick={() => handleRestoreStandardField("shiftTimes")}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 shadow-2xs transition-all"
                    >
                      + Work Shift Times
                    </button>
                  )}
                </div>
              )}

              {/* 1. EMPLOYEE NAME */}
              <div>
                <Label className="text-xs font-extrabold text-slate-700 uppercase mb-1 block">
                  Employee Name *
                </Label>
                <Input
                  required
                  placeholder={t("workerNamePlaceholder")}
                  value={workerForm.name}
                  onChange={(e) => setWorkerForm((p) => ({ ...p, name: e.target.value }))}
                  className="h-11 rounded-xl text-xs font-bold border-slate-300"
                />
              </div>

              {/* 2. DEPARTMENT / CATEGORY */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-extrabold text-slate-700 uppercase block">
                    Department / Category *
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategoryDropdownOpen(true);
                      setShowOtherCategoryInput(true);
                    }}
                    className="text-[#063B78] hover:underline text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="size-3" /> Add Custom Category
                  </button>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                    className="w-full h-11 px-3 rounded-xl text-xs font-bold border border-slate-300 bg-white text-[#10233F] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#063B78] shadow-xs"
                  >
                    <span className="truncate">{workerForm.category || "Select Category"}</span>
                    <ChevronDown className={`size-4 text-slate-400 transition-transform duration-200 ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu Popup with ✕ delete buttons directly on custom category options! */}
                  {isCategoryDropdownOpen && (
                    <div className="absolute left-0 right-0 top-12 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto p-1.5 space-y-0.5 animate-fade-in">
                      {[
                        ...getIndustryDefaultCategories(),
                        ...customCategories,
                        "⚙️ Other / Custom",
                      ]
                        .filter((catName) => !removedCategories.includes(catName))
                        .map((catName) => {
                          const isSelected = workerForm.category === catName;
                          return (
                            <div
                              key={catName}
                              onClick={() => {
                                setWorkerForm((p) => ({ ...p, category: catName }));
                                setIsCategoryDropdownOpen(false);
                                setShowOtherCategoryInput(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${isSelected ? "bg-[#063B78] text-white" : "hover:bg-slate-100 text-[#10233F]"
                                }`}
                            >
                              <span className="truncate">{catName}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveCategory(catName);
                                }}
                                className={`p-1 rounded-lg hover:bg-red-500 hover:text-white transition-colors ml-2 shrink-0 ${isSelected ? "text-white/80 hover:text-white" : "text-slate-400 hover:text-red-600"
                                  }`}
                                title={`Remove category "${catName}"`}
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          );
                        })}

                      {/* Textbox inside the dropdown when adding a new custom category */}
                      {showOtherCategoryInput ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-blue-50/90 rounded-xl border border-blue-200 mt-1 flex items-center gap-1.5 animate-fade-in"
                        >
                          <Input
                            autoFocus
                            placeholder={t("typeNewCategoryPlaceholder")}
                            value={newCustomCategoryInput}
                            onChange={(e) => setNewCustomCategoryInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddCustomCategory();
                              }
                            }}
                            className="h-9 text-xs font-bold bg-white border-blue-300 focus:border-[#063B78]"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomCategory}
                            className="px-3 py-2 rounded-lg bg-[#063B78] hover:bg-[#0A4F9E] text-white font-extrabold text-xs shrink-0 shadow-xs"
                          >
                            + Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowOtherCategoryInput(false)}
                            className="p-1 text-slate-400 hover:text-slate-700 text-xs font-bold shrink-0"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowOtherCategoryInput(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black text-[#063B78] hover:bg-blue-50 transition-colors border-t border-slate-100 mt-1"
                        >
                          <Plus className="size-3.5" />
                          <span>{t("addNewCategoryPrompt")}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. ROLE / DESIGNATION & MOBILE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {!removedStandardFields.includes("trade") ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs font-extrabold text-slate-700 uppercase block">
                        Role / Designation
                      </Label>
                      <button
                        type="button"
                        onClick={() => handleRemoveStandardField("trade")}
                        className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors"
                        title={t("removeField")}
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                    <Input
                      placeholder={t("designationPlaceholder")}
                      value={workerForm.trade}
                      onChange={(e) => setWorkerForm((p) => ({ ...p, trade: e.target.value }))}
                      className="h-11 rounded-xl text-xs font-bold border-slate-300"
                    />
                  </div>
                ) : null}

                {!removedStandardFields.includes("mobile") ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs font-extrabold text-slate-700 uppercase block">
                        Mobile Number
                      </Label>
                      <button
                        type="button"
                        onClick={() => handleRemoveStandardField("mobile")}
                        className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors"
                        title={t("removeField")}
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                    <Input
                      placeholder="e.g. 9822112233"
                      value={workerForm.mobile}
                      onChange={(e) => setWorkerForm((p) => ({ ...p, mobile: e.target.value }))}
                      className="h-11 rounded-xl text-xs font-bold border-slate-300"
                    />
                  </div>
                ) : null}
              </div>

              {/* WORK LOCATION & ATTENDANCE MODE (Auto-Detected) */}
              <div className="space-y-3 p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
                <Label className="text-xs font-extrabold text-slate-800 uppercase block tracking-wider">
                  Work Location & Attendance Type (Auto-Detected)
                </Label>

                {attendanceMode === "field" ? (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/90 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                      <span className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                      <span>{t("fieldWorksiteOption")}</span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 font-medium leading-relaxed">
                      Auto-detected from company name. Mobile GPS & selfie punch-in are not required. Daily attendance will be marked directly by employer.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-blue-50/90 rounded-xl border border-blue-200/90 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-[#063B78]">
                      <span className="size-2 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
                      <span>{t("fixedWorksiteOption")}</span>
                    </div>
                    <p className="text-[11px] text-blue-900/90 font-medium leading-relaxed">
                      Auto-detected from company name. Employee punches in/out via mobile app (GPS + Camera).
                    </p>

                    <div className="pt-3 border-t border-blue-200/70">
                      <Label className="text-xs font-extrabold text-slate-700 uppercase mb-1 block">
                        Employee Login 4-Digit PIN *
                      </Label>
                      <Input
                        required
                        placeholder="1234"
                        maxLength={4}
                        minLength={4}
                        value={workerForm.pin}
                        onChange={(e) => setWorkerForm((p) => ({ ...p, pin: e.target.value.replace(/\D/g, "") }))}
                        className="h-10 w-44 rounded-xl text-xs font-black border-slate-300 tracking-widest text-[#063B78]"
                      />
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                        Employee uses Mobile Number and this 4-digit PIN to login to the app.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. DAILY WAGE RATE & JOINING DATE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-extrabold text-slate-700 uppercase mb-1 block">
                    Custom Daily Wage Rate (₹) *
                  </Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="500"
                    value={workerForm.dailyRate}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setWorkerForm((p) => {
                        const next = { ...p, dailyRate: val };
                        if (p.overtimeRateMode === "auto") {
                          const baseHrs = computeHoursFromTimes(p.workShiftStart, p.workShiftEnd);
                          const rateNum = Number(val) || 0;
                          next.overtimeRate = baseHrs > 0 ? Math.round(rateNum / baseHrs).toString() : "0";
                        }
                        return next;
                      });
                    }}
                    className="h-11 rounded-xl text-xs font-bold border-slate-300 text-emerald-700 font-black"
                  />
                </div>

                {!removedStandardFields.includes("joiningDate") ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs font-extrabold text-slate-700 uppercase block">
                        Joining Date
                      </Label>
                      <button
                        type="button"
                        onClick={() => handleRemoveStandardField("joiningDate")}
                        className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors"
                        title={t("removeField")}
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                    <Input
                      type="date"
                      value={workerForm.joiningDate}
                      onChange={(e) => setWorkerForm((p) => ({ ...p, joiningDate: e.target.value }))}
                      className="h-11 rounded-xl text-xs font-bold border-slate-300"
                    />
                  </div>
                ) : null}
              </div>

              {/* 5. WORK TIMING / SHIFT */}
              {!removedStandardFields.includes("shiftTimes") ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-extrabold text-slate-700 uppercase mb-1 flex items-center gap-1">
                      <Clock className="size-3.5 text-[#063B78]" /> Work Start Time (shift)
                    </Label>
                    <Input
                      type="time"
                      value={workerForm.workShiftStart}
                      onChange={(e) => {
                        const startVal = e.target.value;
                        setWorkerForm((p) => {
                          const next = { ...p, workShiftStart: startVal };
                          const newBaseHrs = computeHoursFromTimes(startVal, p.workShiftEnd);
                          const oldBaseHrs = computeHoursFromTimes(p.workShiftStart, p.workShiftEnd);
                          const prevTotal = Number(p.dailyWorkingHours) || oldBaseHrs;
                          const currentOt = Math.max(0, Math.min(4, Math.round((prevTotal - oldBaseHrs) * 10) / 10));
                          const nextTotal = newBaseHrs + currentOt;
                          next.dailyWorkingHours = nextTotal.toString();
                          if (p.overtimeRateMode === "auto") {
                            const rateNum = Number(p.dailyRate) || 500;
                            next.overtimeRate = newBaseHrs > 0 ? Math.round(rateNum / newBaseHrs).toString() : "50";
                          }
                          return next;
                        });
                      }}
                      className="h-11 rounded-xl text-xs font-bold border-slate-300"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs font-extrabold text-slate-700 uppercase flex items-center gap-1">
                        <Clock className="size-3.5 text-[#063B78]" /> Work End Time (shift)
                      </Label>
                      <button
                        type="button"
                        onClick={() => handleRemoveStandardField("shiftTimes")}
                        className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors"
                        title={t("removeField")}
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                    <Input
                      type="time"
                      value={workerForm.workShiftEnd}
                      onChange={(e) => {
                        const endVal = e.target.value;
                        setWorkerForm((p) => {
                          const next = { ...p, workShiftEnd: endVal };
                          const newBaseHrs = computeHoursFromTimes(p.workShiftStart, endVal);
                          const oldBaseHrs = computeHoursFromTimes(p.workShiftStart, p.workShiftEnd);
                          const prevTotal = Number(p.dailyWorkingHours) || oldBaseHrs;
                          const currentOt = Math.max(0, Math.min(4, Math.round((prevTotal - oldBaseHrs) * 10) / 10));
                          const nextTotal = newBaseHrs + currentOt;
                          next.dailyWorkingHours = nextTotal.toString();
                          if (p.overtimeRateMode === "auto") {
                            const rateNum = Number(p.dailyRate) || 500;
                            next.overtimeRate = newBaseHrs > 0 ? Math.round(rateNum / newBaseHrs).toString() : "50";
                          }
                          return next;
                        });
                      }}
                      className="h-11 rounded-xl text-xs font-bold border-slate-300"
                    />
                  </div>
                </div>
              ) : null}

              {/* 5.1 OVERTIME HOURLY RATE CONFIGURATION */}
              {(() => {
                const baseShiftHrs = computeHoursFromTimes(workerForm.workShiftStart, workerForm.workShiftEnd);
                const dailyWageNum = Number(workerForm.dailyRate) || 500;
                const autoHourlyRate = baseShiftHrs > 0 ? Math.round(dailyWageNum / baseShiftHrs) : 56;

                return (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-blue-50/40 to-slate-50 border-2 border-amber-200 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                          <Zap className="size-4 fill-white" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[#10233F] uppercase tracking-wide flex items-center gap-1.5">
                            Overtime Hourly Rate (₹ / hr)
                            <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-extrabold text-[10px] px-1.5 py-0">
                              {workerForm.overtimeRateMode === "auto"
                                ? `⚡ Auto (${dailyWageNum} ÷ ${baseShiftHrs}h = ₹${autoHourlyRate}/hr)`
                                : "✏️ Custom Manual Rate"}
                            </Badge>
                          </h4>
                          <p className="text-[10px] font-bold text-slate-500">
                            Daily Wage (₹{dailyWageNum}) ÷ Shift ({baseShiftHrs}h) = ₹{autoHourlyRate}/hr default rate.
                          </p>
                        </div>
                      </div>

                      {/* Mode Selector Toggle: Auto vs Manual */}
                      <div className="flex items-center bg-white p-0.5 rounded-xl border border-amber-300 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            setWorkerForm((p) => ({
                              ...p,
                              overtimeRateMode: "auto",
                              overtimeRate: autoHourlyRate.toString(),
                            }));
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                            workerForm.overtimeRateMode === "auto"
                              ? "bg-amber-500 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Zap className="size-3 fill-current" /> Auto Calculate
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setWorkerForm((p) => ({
                              ...p,
                              overtimeRateMode: "manual",
                            }));
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                            workerForm.overtimeRateMode === "manual"
                              ? "bg-[#063B78] text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Edit3 className="size-3" /> Manual Rate
                        </button>
                      </div>
                    </div>

                    {/* Overtime Rate Input Field */}
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-extrabold text-slate-700 uppercase flex items-center justify-between">
                        <span>{t("overtimeRateLabel")}</span>
                        <span className="text-[10px] text-slate-500 font-bold lowercase">
                          (daily wage remains ₹{dailyWageNum}/day)
                        </span>
                      </Label>
                      <div className="relative max-w-sm">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                          ₹
                        </span>
                        <Input
                          type="number"
                          placeholder={autoHourlyRate.toString()}
                          value={workerForm.overtimeRate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setWorkerForm((p) => ({
                              ...p,
                              overtimeRate: val,
                              overtimeRateMode: "manual",
                            }));
                          }}
                          className={`h-11 pl-8 pr-16 rounded-xl text-sm font-black border-slate-300 ${
                            workerForm.overtimeRateMode === "auto"
                              ? "bg-amber-50/60 text-amber-950 border-amber-300 font-extrabold"
                              : "bg-white text-emerald-800 border-emerald-400 ring-2 ring-emerald-400/20"
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">
                          / Hour
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">
                        💡 Note: Overtime hours (1h, 2h, etc.) are recorded per day in the Attendance Calendar. In Salary Slip, overtime will be calculated as: <strong>Total Overtime Hours × ₹{workerForm.overtimeRate || autoHourlyRate}/hr</strong>.
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* 6. DYNAMIC ADDED CUSTOM FIELDS (Rendered AT THE VERY BOTTOM OF ALL INPUT FIELDS) */}
              {customFields.map((field, idx) => (
                <div key={idx} className="animate-fade-in pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-extrabold text-slate-700 uppercase block flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-[#063B78]" /> {field.label || "CUSTOM FIELD"}
                    </Label>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(idx)}
                      className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 hover:bg-rose-50 px-2 py-0.5 rounded transition-colors"
                      title={t("removeField")}
                    >
                      <Trash2 className="size-3.5" /> Remove Field
                    </button>
                  </div>
                  <Input
                    placeholder={`e.g. Enter ${field.label || "detail"}...`}
                    value={field.value}
                    onChange={(e) => handleCustomFieldChange(idx, "value", e.target.value)}
                    className="h-11 rounded-xl text-xs font-bold border-slate-300"
                  />
                </div>
              ))}

              {/* 7. FORM ACTION BUTTONS */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowWorkerModal(false)}
                  className="flex-1 py-5 rounded-xl font-bold border-slate-300 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-5 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg text-xs"
                >
                  {editingWorkerId ? "Update Employee" : "Save Employee"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE ADD CUSTOM FIELD MODAL DIALOG ── */}
      {showAddFieldPrompt && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 relative space-y-4">
            <button
              type="button"
              onClick={() => setShowAddFieldPrompt(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-extrabold text-lg p-1.5 rounded-full hover:bg-slate-100"
            >
              ✕
            </button>

            <div>
              <h4 className="text-lg font-black text-[#10233F] flex items-center gap-2">
                <Sparkles className="size-5 text-[#063B78]" /> Add New Custom Field
              </h4>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Type the field name (e.g. Aadhaar Card ID, Education, PF Number).
              </p>
            </div>

            <div>
              <Label className="text-xs font-extrabold text-slate-700 uppercase mb-1 block">
                Field Name / Title *
              </Label>
              <Input
                autoFocus
                placeholder={t("customFieldPlaceholder")}
                value={newFieldNameInput}
                onChange={(e) => setNewFieldNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmAddCustomField();
                  }
                }}
                className="h-11 rounded-xl text-xs font-bold border-slate-300 focus:border-[#063B78]"
              />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">{t("quickSuggestionsLabel")}</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["Aadhaar Card ID", "Education", "Alternate Mobile", "Bank Details", "PF Number"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleConfirmAddCustomField(preset)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-[#063B78] hover:text-white text-slate-700 font-bold text-xs rounded-lg transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddFieldPrompt(false)}
                className="flex-1 py-4 rounded-xl font-bold text-xs border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => handleConfirmAddCustomField()}
                className="flex-1 py-4 rounded-xl font-black bg-[#063B78] hover:bg-[#0A4F9E] text-white text-xs shadow-md"
              >
                + Add to Form
              </Button>
            </div>
          </div>
        </div>
      )}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPackageModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-extrabold text-xl p-2 rounded-full hover:bg-slate-100"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-50 text-[#063B78]">
                <Package className="size-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#063B78]">
                  {t("activatePackageTitle")}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {t("activatePackageDesc")}
                </p>
              </div>
            </div>

            {/* Package Selector Cards */}
            <div className="space-y-3 my-5">
              {activeJobPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPlanId(pkg.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedPlanId === pkg.id
                    ? "border-[#063B78] bg-blue-50/60 ring-2 ring-[#063B78]/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center ${selectedPlanId === pkg.id ? "border-[#063B78] bg-[#063B78] text-white" : "border-slate-300"
                      }`}>
                      {selectedPlanId === pkg.id && <Check className="size-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#063B78]">{pkg.name}</span>
                        {pkg.badge && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${pkg.popular ? "bg-[#063B78] text-amber-300" : "bg-amber-100 text-amber-800"
                            }`}>
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        {pkg.description || `${pkg.jobCount >= 999 ? "Unlimited Jobs" : `${pkg.jobCount} Job Posting`} + ${pkg.workerCount ? (Number(pkg.workerCount) >= 9999 ? "Unlimited CRM" : `${pkg.workerCount} CRM`) : "3 CRM"}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-[#063B78]">₹{pkg.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Plan Summary */}
            <div className="bg-[#F4F7FB] p-4 rounded-2xl border border-[#DCE5F0] my-4 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500">{t("selectedPlanLabel")}</p>
                <p className="text-sm font-extrabold text-[#063B78]">{activeSelectedPlan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">{t("totalAmountLabel")}</p>
                <p className="text-2xl font-black text-emerald-700">₹{activeSelectedPlan.price}</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 my-4">
              <Label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Select Payment Method
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${paymentMethod === "upi"
                    ? "border-[#063B78] bg-blue-50/70 text-[#063B78] ring-2 ring-[#063B78]/20"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Smartphone className="size-5" />
                  <span>{t("paymentUpi")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${paymentMethod === "card"
                    ? "border-[#063B78] bg-blue-50/70 text-[#063B78] ring-2 ring-[#063B78]/20"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <CreditCard className="size-5" />
                  <span>{t("paymentCard")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${paymentMethod === "netbanking"
                    ? "border-[#063B78] bg-blue-50/70 text-[#063B78] ring-2 ring-[#063B78]/20"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Building2 className="size-5" />
                  <span>{t("paymentNetbanking")}</span>
                </button>
              </div>

              {paymentMethod === "upi" && (
                <div className="pt-2">
                  <Label className="text-xs font-bold text-slate-600 mb-1 block">
                    Enter UPI ID (or pay via PhonePe / GPay)
                  </Label>
                  <Input
                    placeholder={t("upiPlaceholder")}
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="h-11 rounded-xl text-sm font-semibold border-slate-300"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowPackageModal(false)}
                className="flex-1 py-6 rounded-2xl font-bold border-slate-300"
              >
                Cancel
              </Button>
              <Button
                disabled={isProcessingPackage}
                onClick={handleActivatePackage}
                className="flex-1 py-6 rounded-2xl font-black bg-[#063B78] hover:bg-[#082F63] text-white shadow-lg"
              >
                {isProcessingPackage ? (
                  <span>{t("activatingStatus")}</span>
                ) : (
                  <span>Pay ₹{activeSelectedPlan.price} & Post Job</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}



      {/* ── WORKER REPORT & SALARY SLIP MODAL ── */}
      {selectedWorkerReport && (() => {
        const w = selectedWorkerReport!;
        return (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedWorkerReport(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-extrabold text-xl p-2 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-[#063B78] text-white font-black flex items-center justify-center text-xl shadow-md">
                    {w.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-[#10233F]">{w.name}</h3>
                      <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[10px]">
                        {formatCategoryName(w.category || w.trade)}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#5B6B7F] font-semibold mt-0.5">
                      📞 {w.mobile || "N/A"} • Role: <span className="font-bold text-[#063B78]">{w.trade || "General Worker"}</span> • Rate: <span className="font-extrabold text-emerald-700">₹{w.dailyRate} / day</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Period selector */}
              <div className="flex items-center justify-between bg-[#F8FAFF] p-3 rounded-2xl border border-[#DCE5F0] mb-5">
                <span className="text-xs font-black text-[#10233F] flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-[#063B78]" /> Select Report Period:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWorkerReportPeriod("week")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${workerReportPeriod === "week"
                      ? "bg-[#063B78] text-white shadow-md"
                      : "bg-white text-[#5B6B7F] border border-[#DCE5F0] hover:bg-slate-50"
                      }`}
                  >
                    This Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkerReportPeriod("month")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${workerReportPeriod === "month"
                      ? "bg-[#063B78] text-white shadow-md"
                      : "bg-white text-[#5B6B7F] border border-[#DCE5F0] hover:bg-slate-50"
                      }`}
                  >
                    This Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkerReportPeriod("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${workerReportPeriod === "all"
                      ? "bg-[#063B78] text-white shadow-md"
                      : "bg-white text-[#5B6B7F] border border-[#DCE5F0] hover:bg-slate-50"
                      }`}
                  >
                    All Time
                  </button>
                </div>
              </div>

              {/* Calculated Metrics Cards */}
              {(() => {
                const metrics = getWorkerReportMetrics(w, workerReportPeriod);
                return (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 text-center">
                        <p className="text-[10px] font-black uppercase text-emerald-800">{t("present")}</p>
                        <h4 className="text-xl font-black text-emerald-700 mt-1">{metrics.present} Days</h4>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/60 text-center">
                        <p className="text-[10px] font-black uppercase text-amber-800">{t("halfDay")}</p>
                        <h4 className="text-xl font-black text-amber-700 mt-1">{metrics.halfDay} Days</h4>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/60 text-center">
                        <p className="text-[10px] font-black uppercase text-rose-800">{t("absent")}</p>
                        <h4 className="text-xl font-black text-rose-700 mt-1">{metrics.absent} Days</h4>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/60 text-center">
                        <p className="text-[10px] font-black uppercase text-blue-800">{t("overtime")}</p>
                        <h4 className="text-xl font-black text-blue-700 mt-1">{metrics.overtime} Days</h4>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-100/70 text-center col-span-2 sm:col-span-1">
                        <p className="text-[10px] font-black uppercase text-emerald-900">{t("totalWageLabel")}</p>
                        <h4 className="text-lg font-black text-emerald-800 mt-1">₹{metrics.netPay.toLocaleString("en-IN")}</h4>
                      </div>
                    </div>

                    {/* Attendance Log Table inside Modal */}
                    <div className="border border-[#DCE5F0] rounded-2xl overflow-hidden">
                      <div className="bg-[#F8FAFF] p-3 border-b border-[#DCE5F0] flex items-center justify-between">
                        <span className="text-xs font-black text-[#10233F]">📅 Attendance Log History ({metrics.records.length} records)</span>
                        <span className="text-[11px] font-bold text-[#5B6B7F]">{metrics.startDate} to {metrics.endDate}</span>
                      </div>

                      <div className="max-h-48 overflow-y-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[#EBF1F8] bg-slate-50 text-[10px] uppercase font-black text-[#5B6B7F]">
                              <th className="p-2.5">Date</th>
                              <th className="p-2.5">{t("status")}</th>
                              <th className="p-2.5">Rate</th>
                              <th className="p-2.5 text-right">{t("earnedWageLabel")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#EBF1F8] font-semibold">
                            {metrics.records.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="p-4 text-center text-slate-400 font-bold">
                                  No attendance records found for this timeframe.
                                </td>
                              </tr>
                            ) : (
                              metrics.records.map((r) => {
                                let pay = w.dailyRate;
                                if (r.status === "HalfDay") pay = Math.round(w.dailyRate / 2);
                                if (r.status === "Absent") pay = 0;
                                if (r.status === "Overtime") pay = Math.round(w.dailyRate * 1.5);

                                return (
                                  <tr key={r.id} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-[#10233F]">{r.date}</td>
                                    <td className="p-2.5">
                                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${r.status === "Present" ? "bg-emerald-100 text-emerald-800" :
                                        r.status === "HalfDay" ? "bg-amber-100 text-amber-800" :
                                          r.status === "Absent" ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800"
                                        }`}>
                                        {r.status}
                                      </span>
                                    </td>
                                    <td className="p-2.5 text-slate-500">₹{w.dailyRate}</td>
                                    <td className="p-2.5 text-right font-black text-emerald-700">₹{pay}</td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Print & Download Action Buttons */}
                    <div className="pt-2">
                      <Button
                        onClick={() => {
                          setViewSlipWorker(w);
                          setViewSlipPeriod(workerReportPeriod === "all" ? "month" : workerReportPeriod);
                        }}
                        className="w-full bg-[#063B78] hover:bg-[#082F63] text-white font-extrabold text-xs py-5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileText className="size-4" /> View & Download Payslip
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })()}


      {/* ── E-SALARY SLIP MODAL ── */}
      {viewSlipWorker && (() => {
        const v = viewSlipWorker!;
        return (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in print:bg-white print:p-0">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:rounded-none">
              <div className="print:hidden sticky top-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 z-10 rounded-t-3xl space-y-2.5">
                {/* Row 1: Modal Title + Close Button */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-7 sm:size-8 rounded-lg bg-[#063B78]/10 text-[#063B78] flex items-center justify-center shrink-0">
                      <FileText className="size-4" />
                    </div>
                    <h3 className="font-black text-[#10233F] text-base sm:text-lg truncate">
                      {t("employeeSalarySlipsTitle")}
                    </h3>
                  </div>

                  <button
                    onClick={() => setViewSlipWorker(null)}
                    className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm cursor-pointer shrink-0 transition-colors"
                    title={t("closeBtn")}
                  >
                    ✕
                  </button>
                </div>

                {/* Row 2: Filter Period, Month, Year & Date Range Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-slate-100 rounded-lg p-0.5 shrink-0">
                    <button
                      onClick={() => setViewSlipPeriod("week")}
                      className={`text-xs px-2.5 py-1 font-bold rounded-md transition-all cursor-pointer ${
                        viewSlipPeriod === "week" ? "bg-white shadow-xs text-[#063B78] font-black" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {t("salarySlipPeriodWeek")}
                    </button>
                    <button
                      onClick={() => setViewSlipPeriod("month")}
                      className={`text-xs px-2.5 py-1 font-bold rounded-md transition-all cursor-pointer ${
                        viewSlipPeriod === "month" ? "bg-white shadow-xs text-[#063B78] font-black" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {t("salarySlipPeriodMonth")}
                    </button>
                  </div>

                  {/* Month Selector */}
                  <select
                    value={selectedSalaryMonth}
                    onChange={(e) => setSelectedSalaryMonth(e.target.value)}
                    className="h-8 px-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs font-black text-[#063B78] focus:outline-none cursor-pointer shrink-0"
                  >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  {/* Year Selector */}
                  <select
                    value={selectedSalaryYear}
                    onChange={(e) => setSelectedSalaryYear(e.target.value)}
                    className="h-8 px-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs font-black text-[#063B78] focus:outline-none cursor-pointer shrink-0"
                  >
                    {["2023", "2024", "2025", "2026", "2027", "2028"].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>

                  {/* If Week is selected, show Date Range picker e.g. 10 to 20 */}
                  {viewSlipPeriod === "week" && (
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 text-xs shrink-0">
                      <span className="font-black text-slate-600 text-[10.5px]">{t("datesLabel")}</span>
                      <select
                        value={slipRangeStartDay}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setSlipRangeStartDay(v);
                          if (v > slipRangeEndDay) setSlipRangeEndDay(v);
                        }}
                        className="h-6 px-1 bg-white rounded border border-slate-200 text-xs font-black text-[#063B78] cursor-pointer"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={d}>Day {d}</option>
                        ))}
                      </select>
                      <span className="font-bold text-slate-400 text-[10px]">{t("toWord")}</span>
                      <select
                        value={slipRangeEndDay}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setSlipRangeEndDay(v);
                          if (v < slipRangeStartDay) setSlipRangeStartDay(v);
                        }}
                        className="h-6 px-1 bg-white rounded border border-slate-200 text-xs font-black text-[#063B78] cursor-pointer"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={d}>Day {d}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => { setSlipRangeStartDay(10); setSlipRangeEndDay(20); }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black cursor-pointer border ${
                          slipRangeStartDay === 10 && slipRangeEndDay === 20
                            ? "bg-[#063B78] text-white border-[#063B78]"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                        title="Set 10 to 20"
                      >
                        10-20
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Print Area */}
              <div className="bg-white overflow-hidden relative">
                {(() => {
                  const effectiveMonthName = selectedSalaryMonth || new Date().toLocaleDateString("en-US", { month: "long" });
                  const effectiveYearStr = selectedSalaryYear || String(new Date().getFullYear());
                  
                  const monthMap: Record<string, number> = {
                    January: 0, February: 1, March: 2, April: 3,
                    May: 4, June: 5, July: 6, August: 7,
                    September: 8, October: 9, November: 10, December: 11
                  };
                  const mIdx = monthMap[effectiveMonthName] !== undefined ? monthMap[effectiveMonthName] : new Date().getMonth();
                  const yVal = parseInt(effectiveYearStr, 10) || new Date().getFullYear();
                  const daysInTargetMonth = new Date(yVal, mIdx + 1, 0).getDate();

                  const isCustomRange = viewSlipPeriod === "week";
                  const startDay = isCustomRange ? Math.min(slipRangeStartDay, slipRangeEndDay, daysInTargetMonth) : 1;
                  const endDay = isCustomRange ? Math.min(Math.max(slipRangeStartDay, slipRangeEndDay), daysInTargetMonth) : daysInTargetMonth;

                  const customStartDate = `${yVal}-${String(mIdx + 1).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;
                  const customEndDate = `${yVal}-${String(mIdx + 1).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;
                  const customPayPeriod = `${String(startDay).padStart(2, "0")}-${String(mIdx + 1).padStart(2, "0")}-${yVal} to ${String(endDay).padStart(2, "0")}-${String(mIdx + 1).padStart(2, "0")}-${yVal}`;

                  const metrics = getWorkerReportMetrics(
                    v, 
                    viewSlipPeriod, 
                    effectiveMonthName, 
                    effectiveYearStr,
                    isCustomRange ? customStartDate : undefined,
                    isCustomRange ? customEndDate : undefined
                  );
                  const empCompanyName = currentUser?.fullName || (currentUser as any)?.companyName || "REAL JOB Construction Pvt. Ltd.";
                  const empCompanyAddress = currentUser?.location || "MIDC Industrial Area, Pune, Maharashtra 411026";
                  const empIndustry = currentUser?.industry || "Building Better Opportunities";

                  const rate = v.dailyRate || 600;
                  const pDays = metrics.present;
                  const hdDays = metrics.halfDay;
                  const aDays = metrics.absent;
                  const otDays = metrics.overtime;
                  const otHours = metrics.totalOvertimeHours;
                  const shiftH = computeHoursFromTimes(v.workShiftStart, v.workShiftEnd) || 9;
                  const effectiveOtRate = v.overtimeRate !== undefined && v.overtimeRate !== null && Number(v.overtimeRate) > 0
                    ? Number(v.overtimeRate)
                    : Math.round(rate / shiftH);
                  const basic = (pDays * rate) + Math.round(hdDays * (rate / 2));
                  const daAmt = Math.round(basic * 0.2);
                  const hraAmt = Math.round(basic * 0.1667);
                  const otAmt = Math.round(otHours * effectiveOtRate);
                  const pfAmt = Math.round((basic + daAmt) * 0.12);
                  const esiAmt = Math.round((basic + daAmt + hraAmt + otAmt) * 0.0075);

                  // Generate realistic attendance calendar based on actual saved attendance records
                  const recordsMap = new Map<string, DailyAttendanceRecord>();
                  metrics.records.forEach((r) => recordsMap.set(r.date, r));

                  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  const attendanceGrid: Array<{
                    day: number;
                    weekday: string;
                    status: 'P' | 'A' | 'L' | 'WO' | 'HD' | 'OT' | '-';
                  }> = [];

                  let weeklyOffCount = 0;
                  for (let d = startDay; d <= endDay; d++) {
                    const dateStr = `${yVal}-${String(mIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                    const dateObj = new Date(yVal, mIdx, d);
                    const wd = weekdays[dateObj.getDay()] || 'Mon';
                    const isSun = dateObj.getDay() === 0;
                    const rec = recordsMap.get(dateStr);

                    let status: 'P' | 'A' | 'L' | 'WO' | 'HD' | 'OT' | '-' = '-';
                    if (rec) {
                      if (rec.status === "Present") status = 'P';
                      else if (rec.status === "Absent") status = 'A';
                      else if (rec.status === "HalfDay") status = 'HD';
                      else if (rec.status === "Overtime") status = 'OT';
                    } else if (isSun) {
                      status = 'WO';
                      weeklyOffCount++;
                    }
                    attendanceGrid.push({ day: d, weekday: wd, status });
                  }

                  const totalDaysInSelection = endDay - startDay + 1;
                  const totalWorkHours = (pDays * 8) + (hdDays * 4) + otHours;
                  const totalEarningsDays = pDays + weeklyOffCount + (hdDays * 0.5);

                  const otDatesText = otDays > 0 && metrics.overtimeEntries && metrics.overtimeEntries.length > 0
                    ? metrics.overtimeEntries.map(e => `${String(e.day).padStart(2, "0")} ${effectiveMonthName.slice(0, 3)} (${e.overtimeHours}h OT)`).join(", ")
                    : undefined;

                  return (
                    <SalarySlip
                      companyName={empCompanyName}
                      companyAddress={empCompanyAddress}
                      companyTagline={empIndustry}
                      employeeName={v.name}
                      mobile={v.mobile || "9876543210"}
                      designation={v.trade || "Worker"}
                      department={v.category || "Construction"}
                      location={currentUser?.location || "Site - Pune"}
                      joiningDate={v.joiningDate || "01-08-2026"}
                      month={effectiveMonthName}
                      year={effectiveYearStr}
                      payPeriod={isCustomRange ? customPayPeriod : undefined}
                      totalDaysInMonth={totalDaysInSelection}
                      presentDays={pDays}
                      absentDays={aDays}
                      halfDays={hdDays}
                      weeklyOffDays={weeklyOffCount}
                      publicHolidays={0}
                      dailyRate={rate}
                      basicSalary={basic}
                      da={daAmt}
                      hra={hraAmt}
                      overtimeHours={otHours}
                      overtimeRate={effectiveOtRate}
                      overtimePay={otAmt}
                      providentFund={pfAmt}
                      esi={esiAmt}
                      professionalTax={200}
                      attendanceGrid={attendanceGrid}
                      absentDatesText={aDays > 0 ? `(${aDays} days absent)` : "No absent days recorded"}
                      halfDayDatesText={hdDays > 0 ? `(${hdDays} half days)` : "No half days recorded"}
                      overtimeDatesText={otDatesText}
                      overtimeEntries={metrics.overtimeEntries}
                      totalWorkHours={totalWorkHours}
                      totalEarningsDays={totalEarningsDays}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        );
      })()}

            {/* ── EMPLOYEE ATTENDANCE CALENDAR & BULK FILL MODAL ── */}
      {calendarWorker && (() => {
        const activeEmpId = currentUser?.id || currentUser?.fullName || currentUser?.email || empIdentifier;
        const monthNames = [
          "January", "February", "March", "April",
          "May", "June", "July", "August",
          "September", "October", "November", "December"
        ];
        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
        const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0 is Sunday

        const monthStartStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-01`;
        const monthEndStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

        // Get active up-to-date worker record
        const activeWorker = workers.find(w => w.id === calendarWorker.id) || calendarWorker;
        const shiftH = computeHoursFromTimes(activeWorker.workShiftStart, activeWorker.workShiftEnd) || 9;
        const effectiveOtRate = activeWorker.overtimeRate !== undefined && activeWorker.overtimeRate !== null && Number(activeWorker.overtimeRate) > 0
          ? Number(activeWorker.overtimeRate)
          : Math.round(activeWorker.dailyRate / shiftH);

        // Get all attendance records for this month
        const monthRangeRecords = dataStore.getEmployerAttendanceRange(activeEmpId, monthStartStr, monthEndStr)
          .filter(r => r.workerId === activeWorker.id);
        const recordsMap = new Map<string, DailyAttendanceRecord>();
        monthRangeRecords.forEach(r => recordsMap.set(r.date, r));

        // Calculate Month Summary
        let presentCount = 0;
        let halfDayCount = 0;
        let absentCount = 0;
        let overtimeCount = 0;
        let totalOvertimeHours = 0;
        let totalEarned = 0;
        const overtimeDetails: Array<{ date: string; hours: number }> = [];

        for (let d = 1; d <= daysInMonth; d++) {
          const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const rec = recordsMap.get(dateStr);
          if (rec) {
            if (rec.status === "Present") {
              presentCount++;
              totalEarned += activeWorker.dailyRate;
            } else if (rec.status === "HalfDay") {
              halfDayCount++;
              totalEarned += (activeWorker.dailyRate / 2);
            } else if (rec.status === "Absent") {
              absentCount++;
            } else if (rec.status === "Overtime") {
              presentCount++; // Working overtime counts as Present on that day!
              overtimeCount++;
              const otH = rec.overtimeHours !== undefined ? Number(rec.overtimeHours) : 1;
              totalOvertimeHours += otH;
              totalEarned += activeWorker.dailyRate + (otH * effectiveOtRate);
              overtimeDetails.push({ date: dateStr, hours: otH });
            }
          }
        }

        return (
          <div 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setActiveCalendarDate(null)}
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* MODAL HEADER */}
              <div className="bg-[#021D3D] text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="size-11 sm:size-12 rounded-2xl bg-[#063B78] border border-white/20 flex items-center justify-center text-lg sm:text-xl font-black text-amber-300 shadow-inner">
                    {activeWorker.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight">{activeWorker.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/80 mt-0.5">
                      <span className="flex items-center gap-1">✂️ {activeWorker.category || activeWorker.trade || "कर्मचारी"}</span>
                      <span>•</span>
                      <span>{activeWorker.trade || "General Worker"}</span>
                      {activeWorker.mobile && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-bold"><Phone className="size-3" /> {activeWorker.mobile}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCalendarWorker(null);
                      setActiveCalendarDate(null);
                      setOvertimeModalDate(null);
                    }}
                    className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-all cursor-pointer"
                    title={t("closeBtn")}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* MODAL BODY */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-white" onClick={() => setActiveCalendarDate(null)}>
                
                {/* Month Navigation & Controls */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (calendarMonth === 0) {
                          setCalendarMonth(11);
                          setCalendarYear(calendarYear - 1);
                        } else {
                          setCalendarMonth(calendarMonth - 1);
                        }
                        setActiveCalendarDate(null);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-all cursor-pointer"
                      title={t("previousMonthTitle")}
                    >
                      <ChevronLeft className="size-4" />
                    </button>

                    <div className="flex items-center gap-1.5 px-1">
                      <select
                        value={calendarMonth}
                        onChange={(e) => {
                          setCalendarMonth(Number(e.target.value));
                          setActiveCalendarDate(null);
                        }}
                        className="text-xs sm:text-sm font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 cursor-pointer focus:outline-none"
                      >
                        {monthNames.map((m, idx) => (
                          <option key={m} value={idx}>📅 {m}</option>
                        ))}
                      </select>
                      <select
                        value={calendarYear}
                        onChange={(e) => {
                          setCalendarYear(Number(e.target.value));
                          setActiveCalendarDate(null);
                        }}
                        className="text-xs sm:text-sm font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 cursor-pointer focus:outline-none"
                      >
                        {[2023, 2024, 2025, 2026, 2027, 2028].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (calendarMonth === 11) {
                          setCalendarMonth(0);
                          setCalendarYear(calendarYear + 1);
                        } else {
                          setCalendarMonth(calendarMonth + 1);
                        }
                        setActiveCalendarDate(null);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-all cursor-pointer"
                      title={t("nextMonthTitle")}
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>

                {/* ── 7-DAY CALENDAR GRID (Matches Design in Image 1) ── */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
                  {/* Day Names */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName, idx) => (
                    <div
                      key={dayName}
                      className={`text-center text-xs py-1.5 ${idx === 0 ? "text-rose-500 font-extrabold" : "text-slate-600 font-extrabold"}`}
                    >
                      {dayName}
                    </div>
                  ))}

                  {/* Leading empty spaces before 1st of month */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[72px] sm:min-h-[82px] rounded-2xl bg-slate-50/40 border border-slate-100/60"></div>
                  ))}

                  {/* Days of Month */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                    const rec = recordsMap.get(dateStr);
                    const isSelected = activeCalendarDate === dateStr;
                    const colIdx = (firstDayOfWeek + i) % 7;
                    const isSunday = colIdx === 0;
                    const todayStr = new Date().toISOString().split("T")[0]!;
                    const isFuture = dateStr > todayStr;

                    return (
                      <div
                        key={dateStr}
                        className={`relative min-h-[72px] sm:min-h-[82px] p-1.5 sm:p-2 rounded-2xl border flex flex-col justify-between transition-all ${
                          isFuture
                            ? "bg-slate-50/70 border-slate-100 opacity-40 cursor-not-allowed select-none"
                            : isSunday
                            ? "border-slate-100 bg-white hover:border-slate-300"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        } ${isSelected && !isFuture ? "ring-2 ring-[#7C3AED] shadow-lg z-30" : "shadow-2xs"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black ${isFuture ? "text-slate-400 font-semibold" : isSunday ? "text-rose-500 font-black" : "text-slate-800 font-extrabold"}`}>
                            {dayNum}
                          </span>
                        </div>

                        {/* Cell Attendance Status / Action Button */}
                        <div className="mt-auto relative">
                          {isFuture ? (
                            <div className="w-full flex items-center justify-center py-1 text-[11px] font-bold text-slate-300 select-none cursor-not-allowed" title={t("futureDateTitle")}>
                              --
                            </div>
                          ) : rec?.status === "Present" ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCalendarDate(isSelected ? null : dateStr);
                              }}
                              className="w-full flex items-center justify-center py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
                              title={t("clickToEditPresent")}
                            >
                              <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                <Check className="size-3.5 stroke-[3]" />
                              </div>
                            </button>
                          ) : rec?.status === "Absent" ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCalendarDate(isSelected ? null : dateStr);
                              }}
                              className="w-full flex items-center justify-center py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
                              title={t("clickToEditAbsent")}
                            >
                              <div className="size-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                                <X className="size-3.5 stroke-[3]" />
                              </div>
                            </button>
                          ) : rec?.status === "HalfDay" ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCalendarDate(isSelected ? null : dateStr);
                              }}
                              className="w-full flex items-center justify-center py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer"
                              title={t("clickToEditHalfDay")}
                            >
                              <div className="size-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs font-black text-[10px]">
                                ½
                              </div>
                            </button>
                          ) : rec?.status === "Overtime" ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCalendarDate(isSelected ? null : dateStr);
                              }}
                              className="w-full flex flex-col items-center justify-center py-1 px-0.5 sm:px-1 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer gap-0.5 overflow-hidden"
                              title={`Present + Overtime: ${rec.overtimeHours || 2} hours - Click to edit`}
                            >
                              <div className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0 font-black text-[10px]">
                                P
                              </div>
                              <span className="text-[9px] sm:text-[10px] font-black text-[#7C3AED] bg-purple-100/90 px-1 py-0.2 rounded truncate max-w-full">
                                +{rec.overtimeHours || 2}h OT
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCalendarDate(isSelected ? null : dateStr);
                              }}
                              className="text-[11px] font-bold text-slate-500 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl py-1 px-2 transition-all w-full text-center cursor-pointer shadow-2xs"
                            >
                              + Mark
                            </button>
                          )}

                          {/* ── DROPDOWN POPOVER FOR MARKING ATTENDANCE (Matches Image 1) ── */}
                          {isSelected && !isFuture && (
                            <div
                              className={`absolute bottom-full mb-2 w-44 bg-white rounded-2xl p-1.5 shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 ${
                                colIdx === 0
                                  ? "left-0"
                                  : colIdx === 6
                                  ? "right-0"
                                  : "left-1/2 -translate-x-1/2"
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  handleMarkAttendance(activeWorker, "Present", dateStr);
                                  setActiveCalendarDate(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 text-xs font-bold transition-all text-left cursor-pointer"
                              >
                                <div className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                  <Check className="size-3 stroke-[3]" />
                                </div>
                                <span>{t("present")}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleMarkAttendance(activeWorker, "Absent", dateStr);
                                  setActiveCalendarDate(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-800 hover:text-rose-700 text-xs font-bold transition-all text-left cursor-pointer"
                              >
                                <div className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                  <X className="size-3 stroke-[3]" />
                                </div>
                                <span>{t("absent")}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleMarkAttendance(activeWorker, "HalfDay", dateStr);
                                  setActiveCalendarDate(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-amber-700 text-xs font-bold transition-all text-left cursor-pointer"
                              >
                                <div className="size-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs font-black text-[10px]">
                                  ½
                                </div>
                                <span>{t("halfDay")}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveCalendarDate(null);
                                  setOvertimeModalDate(dateStr);
                                  setOvertimeModalHours(rec?.overtimeHours || 1);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-purple-50/70 hover:bg-purple-100 text-[#7C3AED] text-xs font-bold transition-all text-left cursor-pointer"
                              >
                                <div className="size-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                  <Clock className="size-3" />
                                </div>
                                <span>{t("overtime")} (हजर + OT)</span>
                              </button>

                              {rec && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    dataStore.deleteAttendanceRecord(activeWorker.id, dateStr);
                                    loadAttendanceData();
                                    setActiveCalendarDate(null);
                                    toast.success(`Cleared for ${dateStr}`);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 mt-1 border-t border-slate-100 text-slate-400 hover:text-rose-600 text-[11px] font-bold transition-all cursor-pointer"
                                >
                                  <Trash2 className="size-3" />
                                  <span>{t("clearAttendanceBtn")}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── 3. BOTTOM LEGEND (Matches Image 1) ── */}
                <div className="bg-[#FAF8FF] border border-purple-100 rounded-2xl p-3 sm:p-3.5 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-around gap-2.5 text-xs font-bold text-slate-700 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                      <Check className="size-3.5 stroke-[3]" />
                    </div>
                    <span className="font-extrabold text-slate-800">{t("present")}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-2xs">
                      <X className="size-3.5 stroke-[3]" />
                    </div>
                    <span className="font-extrabold text-slate-800">{t("absent")}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xs font-black text-[10px]">
                      ½
                    </div>
                    <span className="font-extrabold text-slate-800">{t("halfDay")}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 rounded-xl px-1.5 py-0.5 shadow-2xs">
                      <div className="size-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-[9px]">
                        P
                      </div>
                      <span className="text-[10px] font-black text-[#7C3AED] bg-purple-100 px-1 rounded">
                        +OT
                      </span>
                    </div>
                    <span className="font-extrabold text-slate-800">{t("overtime")} (हजर + OT)</span>
                  </div>
                </div>

                {/* ── 4. MONTHLY SUMMARY & PAYROLL CARD ── */}
                <div className="bg-gradient-to-br from-slate-900 to-[#063B78] text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-400">
                      {monthNames[calendarMonth]} {calendarYear} — Monthly Attendance Summary
                    </span>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold mt-1">
                      <span className="text-emerald-400">🟢 Present: {presentCount} days</span>
                      <span className="text-amber-400">🟠 Half Day: {halfDayCount} days</span>
                      <span className="text-rose-400">🔴 Absent: {absentCount} days</span>
                      <span className="text-purple-300">🟣 Overtime: {overtimeCount} days ({totalOvertimeHours} hrs)</span>
                    </div>
                    {overtimeDetails.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/15 text-xs">
                        <span className="text-purple-300 font-extrabold block mb-1">📅 Overtime Work Log (Date & Hours):</span>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {overtimeDetails.map((ot) => (
                            <span key={ot.date} className="px-2 py-0.5 rounded-md bg-purple-500/25 border border-purple-400/40 text-purple-200 text-[11px] font-bold">
                              {ot.date}: {ot.hours}h OT
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-4">
                    <div>
                      <div className="text-[10px] text-white/70 font-bold uppercase tracking-wider">{t("estTotalSalaryLabel")}</div>
                      <div className="text-xl sm:text-2xl font-black text-amber-300">
                        ₹{Math.round(totalEarned).toLocaleString("en-IN")}
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        const mName = monthNames[calendarMonth];
                        const yStr = String(calendarYear);
                        if (mName) setSelectedSalaryMonth(mName);
                        setSelectedSalaryYear(yStr);
                        setViewSlipPeriod("month");
                        setViewSlipWorker(activeWorker);
                        setCalendarWorker(null);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-md cursor-pointer"
                    >
                      🧾 View Salary Slip
                    </Button>
                  </div>
                </div>

              </div>
            </div>

            {/* ── OVERTIME HOURS INPUT MODAL (Matches Image 1) ── */}
            {overtimeModalDate && (
              <div
                className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
                onClick={() => setOvertimeModalDate(null)}
              >
                <div
                  className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 w-full max-w-sm space-y-4 animate-in zoom-in-95"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-sm">
                        <Clock className="size-4" />
                      </div>
                      <h4 className="text-base font-black text-slate-900">{t("overtimeHoursTitle")}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOvertimeModalDate(null)}
                      className="size-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-2">
                      Enter Hours
                    </label>
                    <div className="flex items-center border border-slate-200 rounded-2xl p-2.5 bg-slate-50/50 focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition-all">
                      <Clock className="size-5 text-slate-400 shrink-0 ml-1 mr-3" />
                      <input
                        type="number"
                        min={1}
                        max={16}
                        step={0.5}
                        value={overtimeModalHours}
                        onChange={(e) => setOvertimeModalHours(Math.max(1, Math.min(16, Number(e.target.value) || 1)))}
                        className="w-full font-black text-base bg-transparent outline-hidden text-slate-900"
                        autoFocus
                      />
                      <span className="text-xs font-bold text-slate-400 mr-2">{t("hoursWord")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setOvertimeModalDate(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleMarkAttendance(activeWorker, "Overtime", overtimeModalDate, overtimeModalHours);
                        setOvertimeModalDate(null);
                        toast.success(`Overtime (${overtimeModalHours} hrs) saved for ${overtimeModalDate}`);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs shadow-md transition-all cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        );
      })()}

{/* ── MOBILE BOTTOM NAVIGATION BAR (Visible on < md) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#021D3D] text-white border-t border-white/10 z-40 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {[
          { id: "overview", label: "Dashboard", icon: BarChart3 },
          { id: "jobs", label: "Jobs", icon: BriefcaseBusiness, count: jobs.length },
          { id: "applications", label: "Applications", icon: FileText, count: applications.length },
          { id: "salary", label: "E-Salary", icon: FileText },
          { id: "attendance", label: "Attendance", icon: CalendarCheck },
          { id: "profile", label: "Profile", icon: User },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all relative ${isActive ? "text-[#FFC400] bg-white/10" : "text-white/60 hover:text-white"
                }`}
            >
              <item.icon className={`size-4.5 ${isActive ? "text-[#FFC400]" : "text-white/60"}`} />
              <span className="truncate max-w-[68px]">{item.label}</span>
              {isActive && (
                <span className="absolute -top-1 size-1 bg-[#FFC400] rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
