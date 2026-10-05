import { useState, useEffect, Fragment } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  Building2,
  WalletCards,
  Plus,
  Trash2,
  Edit,
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/portal/Stats";
import { LanguageSwitcher } from "@/components/portal/LanguageSwitcher";
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

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Employer Portal & Control Dashboard — REAL JOB" },
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

  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "applications" | "attendance" | "profile">("overview");

  // Data states
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [appSearch, setAppSearch] = useState("");
  const [filterJobId, setFilterJobId] = useState<string | null>(null);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  // Attendance & Worker Management States
  const [workers, setWorkers] = useState<EmployerWorker[]>([]);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]!
  );
  const [dailyAttendanceRecords, setDailyAttendanceRecords] = useState<DailyAttendanceRecord[]>([]);
  const [workerSearch, setWorkerSearch] = useState("");
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);

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
    notes: "",
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
      text.includes("construction") ||
      text.includes("builder") ||
      text.includes("developer") ||
      text.includes("infrastructure") ||
      text.includes("बांधकाम") ||
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
      text.includes("रोपवाटिका")
    ) {
      return "agriculture";
    }

    return "general";
  };

  const getIndustryDefaultCategories = (): string[] => {
    const indType = detectEmployerIndustry();
    switch (indType) {
      case "construction":
        return [
          "🏗️ Construction & Site Work",
          "🧱 Masonry & Brickwork",
          "⚡ Electrical & Wiring",
          "🚰 Plumbing & Piping",
          "🪚 Carpentry & Woodwork",
          "🎨 Painting & Finishing",
          "🛠️ General Labour & Helper",
        ];
      case "factory":
        return [
          "⚙️ Machine Operator",
          "🔧 Assembly & Fitting",
          "🔩 Welding & Fabrication",
          "📦 Packing & Warehouse",
          "🔍 Quality Inspection",
          "🛠️ Helper & Maintenance",
          "🚚 Loading & Unloading",
        ];
      case "hospitality":
        return [
          "👨‍🍳 Cook & Kitchen Staff",
          "🍽️ Waiter & Food Service",
          "🧹 Housekeeping & Cleaning",
          "🛎️ Reception & Billing",
          "🛡️ Security & Support",
        ];
      case "healthcare":
        return [
          "🩺 Nursing & Patient Care",
          "💊 Pharmacy & Medical Support",
          "🔬 Lab & Testing Support",
          "🧹 Sanitation & Cleaning",
          "🛡️ Security & Maintenance",
        ];
      case "agriculture":
        return [
          "🌱 Plant Nursery & Care",
          "🚜 Tractor & Machinery",
          "✂️ Grafting & Propagation",
          "📦 Packing & Loading",
          "💧 Irrigation & Spraying",
          "🌿 Soil & Fertilizer",
          "🛠️ General Labour",
        ];
      default:
        return [
          "💼 Office Staff & Admin",
          "🏗️ Construction & Site Work",
          "🌱 Plant Nursery & Agriculture",
          "⚙️ Machine Operator & Factory",
          "🚚 Logistics & Transport",
          "🛠️ Skilled Labour",
          "🧹 Cleaning & Housekeeping",
          "🛡️ Security Guard",
        ];
    }
  };

  // Category display cleaner helper
  const formatCategoryName = (cat?: string) => {
    if (!cat) return getIndustryDefaultCategories()[0] || "General Work";
    return cat;
  };

  const getWorkerReportMetrics = (worker: EmployerWorker, period: "week" | "month" | "all") => {
    let startDate = "";
    const now = new Date();
    const endDate = now.toISOString().split("T")[0];

    if (period === "week") {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      startDate = d.toISOString().split("T")[0]!;
    } else if (period === "month") {
      const d = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = d.toISOString().split("T")[0]!;
    } else {
      startDate = worker.joiningDate || "2020-01-01";
    }

    if (worker.joiningDate && worker.joiningDate > startDate) {
      startDate = worker.joiningDate;
    }

    const rangeRecords = dataStore.getEmployerAttendanceRange(empIdentifier, startDate, endDate);
    const workerRecords = rangeRecords.filter((r) => r.workerId === worker.id);

    let present = 0;
    let halfDay = 0;
    let absent = 0;
    let overtime = 0;
    let netPay = 0;

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
        overtime++;
        netPay += Math.round(worker.dailyRate * 1.5);
      }
    });

    return {
      startDate,
      endDate,
      records: workerRecords,
      present,
      halfDay,
      absent,
      overtime,
      totalDays: workerRecords.length,
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
              <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #F59E0B; letter-spacing: 1.5px; margin-bottom: 4px;">🌱 OFFICIAL WORKFORCE SALARY SLIP</div>
              <h1 style="font-size: 20px; font-weight: 900; margin: 0; color: #FFFFFF; letter-spacing: -0.3px;">${companyTitle}</h1>
              <div style="font-size: 12px; margin-top: 6px; color: #DCE5F0;">
                Employer: <strong style="color: #FFFFFF;">${employerName}</strong> &bull; Work & Salary Settlement
              </div>
            </td>
            <td style="padding: 20px; text-align: right; vertical-align: middle; width: 190px;">
              <div style="background: rgba(255,255,255,0.15); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.25); text-align: right;">
                <div style="font-size: 9px; font-weight: bold; color: #E2E8F0; text-transform: uppercase;">SLIP REFERENCE</div>
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
              <span style="color: #64748B; font-weight: 600;">Employee Name:</span> <strong style="color: #0F172A; font-weight: 800;">${worker.name}</strong>
            </td>
            <td style="padding: 8px 16px; font-size: 12px; width: 50%; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">Work Organization / Firm:</span> <strong style="color: #063B78; font-weight: 800;">${companyTitle}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 16px; font-size: 12px; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">Department:</span> <strong style="color: #063B78; font-weight: 800; background: #DBEAFE; padding: 2px 6px; border-radius: 4px;">${catName}</strong>
            </td>
            <td style="padding: 8px 16px; font-size: 12px; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">Role / Designation:</span> <strong style="color: #0F172A; font-weight: 700;">${worker.trade || "General Worker"}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 16px; font-size: 12px; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">Mobile Number:</span> <strong style="color: #0F172A; font-weight: 700;">${worker.mobile || "N/A"}</strong>
            </td>
            <td style="padding: 8px 16px; font-size: 12px; border-bottom: 1px solid #E2E8F0;">
              <span style="color: #64748B; font-weight: 600;">Daily Rate:</span> <strong style="color: #059669; font-weight: 900; font-size: 13px;">₹${worker.dailyRate} / day</strong>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 8px 16px; font-size: 12px;">
              <span style="color: #64748B; font-weight: 600;">Report Timeframe:</span> <strong style="color: #0F172A; font-weight: 700;">${periodLabel} (${metrics.startDate} to ${metrics.endDate})</strong>
            </td>
          </tr>
        </table>

        <!-- Attendance Metrics Grid Table -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 6px 0; margin-bottom: 20px;">
          <tr>
            <td style="width: 20%; background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 8px; padding: 10px 4px; text-align: center;">
              <div style="font-size: 9px; font-weight: 800; color: #166534; text-transform: uppercase;">PRESENT</div>
              <div style="font-size: 20px; font-weight: 900; color: #15803D; margin-top: 2px;">${metrics.present}</div>
            </td>
            <td style="width: 20%; background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 8px; padding: 10px 4px; text-align: center;">
              <div style="font-size: 9px; font-weight: 800; color: #92400E; text-transform: uppercase;">HALF DAY</div>
              <div style="font-size: 20px; font-weight: 900; color: #B45309; margin-top: 2px;">${metrics.halfDay}</div>
            </td>
            <td style="width: 20%; background: #FFF1F2; border: 1.5px solid #FECDD3; border-radius: 8px; padding: 10px 4px; text-align: center;">
              <div style="font-size: 9px; font-weight: 800; color: #9F1239; text-transform: uppercase;">ABSENT</div>
              <div style="font-size: 20px; font-weight: 900; color: #BE123C; margin-top: 2px;">${metrics.absent}</div>
            </td>
            <td style="width: 20%; background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 8px; padding: 10px 4px; text-align: center;">
              <div style="font-size: 9px; font-weight: 800; color: #1E40AF; text-transform: uppercase;">OVERTIME</div>
              <div style="font-size: 20px; font-weight: 900; color: #1D4ED8; margin-top: 2px;">${metrics.overtime}</div>
            </td>
            <td style="width: 20%; background: #F3E8FF; border: 1.5px solid #E9D5FF; border-radius: 8px; padding: 10px 4px; text-align: center;">
              <div style="font-size: 9px; font-weight: 800; color: #6B21A8; text-transform: uppercase;">TOTAL DAYS</div>
              <div style="font-size: 20px; font-weight: 900; color: #7E22CE; margin-top: 2px;">${metrics.totalDays}</div>
            </td>
          </tr>
        </table>

        <!-- Attendance History Table -->
        <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #CBD5E1; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
          <thead>
            <tr style="background: #063B78; color: #FFFFFF; font-size: 11px; font-weight: 800; text-transform: uppercase;">
              <th style="padding: 10px 12px; text-align: left; width: 25%;">DATE</th>
              <th style="padding: 10px 12px; text-align: left; width: 30%;">ATTENDANCE STATUS</th>
              <th style="padding: 10px 12px; text-align: left; width: 25%;">DAILY RATE</th>
              <th style="padding: 10px 12px; text-align: right; width: 20%;">EARNED PAY</th>
            </tr>
          </thead>
          <tbody style="font-size: 12px; font-weight: 600;">
            ${metrics.records.length === 0
        ? `<tr><td colspan="4" style="text-align:center; padding: 16px; color:#64748B;">No attendance logs recorded for this period.</td></tr>`
        : metrics.records.map((r, i) => {
          let pay = worker.dailyRate;
          if (r.status === "HalfDay") pay = Math.round(worker.dailyRate / 2);
          if (r.status === "Absent") pay = 0;
          if (r.status === "Overtime") pay = Math.round(worker.dailyRate * 1.5);
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
              <div style="font-size: 10px; font-weight: 900; color: #047857; text-transform: uppercase; letter-spacing: 1px;">TOTAL EARNED SALARY SETTLEMENT</div>
              <div style="font-size: 12px; font-weight: 700; color: #065F46; margin-top: 2px;">Net payable wage amount calculated for ${worker.name}</div>
            </td>
            <td style="padding: 16px 20px; vertical-align: middle; text-align: right; width: 220px;">
              <div style="font-size: 10px; font-weight: 800; color: #047857; text-transform: uppercase;">NET PAYABLE AMOUNT</div>
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
              <div style="font-size: 9px; color: #94A3B8; margin-top: 2px;">Computer Generated Payroll Statement &bull; Verified</div>
            </td>
            <td style="vertical-align: bottom; text-align: right; padding-top: 14px;">
              <div style="display: inline-block; text-align: center;">
                <div style="border: 1.5px dashed #94A3B8; border-radius: 4px; padding: 4px 12px; margin-bottom: 6px; font-size: 9px; color: #063B78; font-weight: bold; background: #F8FAFC;">
                  ✔ OFFICIAL STAMP
                </div>
                <div style="border-top: 1.5px solid #063B78; width: 160px; padding-top: 4px; font-weight: bold; color: #063B78;">EMPLOYER SIGNATURE</div>
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

  // User Accounts for Admin View (Live Dynamic Data)
  const [registeredUsers, setRegisteredUsers] = useState<
    Array<{ id: string; name: string; role: string; mobile: string; city: string; trade: string; status: string; createdAt?: string | undefined }>
  >([]);
  const currentUser = dataStore.getCurrentUser("employer") || dataStore.getCurrentUser("admin");
  const isSuperAdmin = currentUser?.email?.toLowerCase() === "supera@gmail.com" || currentUser?.email?.toLowerCase() === "superadmin";
  const empIdentifier = currentUser?.fullName || currentUser?.email || "admin-001";

  // Profile Edit Form state
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || "",
    contactPerson: currentUser?.fullName || "",
    email: currentUser?.email || "",
    mobile: currentUser?.mobile || "",
    profilePhoto: currentUser?.profilePhoto || "",
    location: "Maharashtra",
    industry: "Plant Nursery & Workforce Services",
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm((prev) => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        email: currentUser.email || prev.email,
        mobile: currentUser.mobile || prev.mobile,
        profilePhoto: currentUser.profilePhoto || prev.profilePhoto,
      }));
    }
  }, [currentUser?.email]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      toast.error("Please enter company or full name");
      return;
    }
    const updatedUser = {
      email: profileForm.email.trim() || currentUser?.email || "",
      role: (currentUser?.role || "employer") as UserRole,
      fullName: profileForm.fullName.trim(),
      id: currentUser?.id || `usr-${Date.now()}`,
      mobile: profileForm.mobile.trim(),
      profilePhoto: profileForm.profilePhoto.trim(),
    };
    dataStore.setCurrentUser(updatedUser);
    dataStore.registerAccount(updatedUser);
    toast.success("🎉 Profile updated successfully!");
  };

  const refreshCredits = () => {
    if (currentUser?.id) {
      setUserCredits(dataStore.getUserJobCredits(currentUser.id));
    }
  };

  const loadAttendanceData = () => {
    const empWorkers = dataStore.getEmployerWorkers(empIdentifier);
    setWorkers(empWorkers);
    const attRecords = dataStore.getEmployerAttendance(empIdentifier, selectedAttendanceDate);
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
    const rangeRecords = dataStore.getEmployerAttendanceRange(empIdentifier, start, end);
    setReportAttendanceRecords(rangeRecords);
  };

  useEffect(() => {
    loadAttendanceData();
  }, [empIdentifier, selectedAttendanceDate, reportTimeframe, reportStartDate, reportEndDate]);

  const handleMarkAttendance = (
    worker: EmployerWorker,
    status: "Present" | "HalfDay" | "Absent" | "Overtime"
  ) => {
    dataStore.saveAttendanceStatus(
      empIdentifier,
      worker.id,
      worker.name,
      selectedAttendanceDate,
      status
    );
    loadAttendanceData();
    toast.success(`Attendance updated: ${worker.name} marked as ${status}`);
  };

  const handleOpenAddWorker = () => {
    setEditingWorkerId(null);
    setWorkerForm({
      name: "",
      mobile: "",
      trade: "General Worker",
      category: getIndustryDefaultCategories()[0] || "General Work",
      education: "",
      dailyRate: "500",
      joiningDate: new Date().toISOString().split("T")[0]!,
      workShiftStart: "09:00",
      workShiftEnd: "18:00",
      notes: "",
    });
    // Restore persistent custom fields & custom categories so they don't disappear when modal opens!
    setCustomCategories(getStoredCustomCats());
    setCustomFields(persistentCustomFields.map((f) => ({ label: f.label, value: "" })));
    setShowWorkerModal(true);
  };

  const handleOpenEditWorker = (w: EmployerWorker) => {
    setEditingWorkerId(w.id);
    setCustomCategories(getStoredCustomCats());
    setWorkerForm({
      name: w.name,
      mobile: w.mobile,
      trade: w.trade,
      category: w.category || w.trade || getIndustryDefaultCategories()[0] || "General Work",
      education: w.education || "",
      dailyRate: w.dailyRate.toString(),
      joiningDate: w.joiningDate || new Date().toISOString().split("T")[0]!,
      workShiftStart: w.workShiftStart || "09:00",
      workShiftEnd: w.workShiftEnd || "18:00",
      notes: w.notes || "",
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
    dataStore.saveEmployerWorker({
      ...(editingWorkerId ? { id: editingWorkerId } : {}),
      employerId: empIdentifier,
      name: workerForm.name.trim(),
      mobile: workerForm.mobile.trim(),
      trade: workerForm.trade.trim() || "General Worker",
      category: workerForm.category.trim() || "Plant Nursery & Care",
      education: workerForm.education.trim(),
      dailyRate: Number(workerForm.dailyRate) || 500,
      joiningDate: workerForm.joiningDate || new Date().toISOString().split("T")[0]!,
      status: "Active",
      workShiftStart: workerForm.workShiftStart,
      workShiftEnd: workerForm.workShiftEnd,
      notes: workerForm.notes.trim(),
      customFields: customFields.filter((f) => f.label.trim() !== ""),
    });
    setShowWorkerModal(false);
    setEditingWorkerId(null);
    loadAttendanceData();
    toast.success("Employee details saved successfully!");
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
    salaryMin: "", salaryMax: "", salaryType: "Monthly",
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
      salaryMin: "", salaryMax: "", salaryType: "Monthly",
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
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        price: selectedPlan.price,
        jobCount: selectedPlan.jobCount,
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
        salaryMin: "", salaryMax: "", salaryType: "Monthly",
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
      salaryMin: sMin,
      salaryMax: sMax,
      salaryType: job.salaryType || "Monthly",
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
      ? `₹${Number(jobForm.salaryMin).toLocaleString("en-IN")} - ₹${Number(jobForm.salaryMax).toLocaleString("en-IN")} / ${jobForm.salaryType === "Monthly" ? "Month" : "Year"}`
      : "Salary on Interview";

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
        salaryMin: Number(jobForm.salaryMin) || 0,
        salaryMax: Number(jobForm.salaryMax) || 0,
        salaryType: jobForm.salaryType as any,
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
        salaryMin: Number(jobForm.salaryMin) || 0,
        salaryMax: Number(jobForm.salaryMax) || 0,
        salaryType: jobForm.salaryType as any,
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

  const activeSelectedPlan = activeJobPackages.find((p) => p.id === selectedPlanId) || activeJobPackages[0]!;

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
              ← Back to Dashboard
            </button>
            <h1 className="text-base font-black text-white">
              {editingJobId ? "✏️ Edit Job Posting" : "💼 Post New Job"}
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
                <h2 className="text-sm font-black text-[#10233F]">Basic Job Details</h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Title *</label>
                  <Input
                    required
                    value={jobForm.title}
                    onChange={(e) => setJ("title", e.target.value)}
                    placeholder="e.g. Senior Software Engineer / Store Manager"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Company Name *</label>
                  <Input
                    required
                    value={jobForm.company}
                    onChange={(e) => setJ("company", e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Category *</label>
                  <Input
                    required
                    value={jobForm.category}
                    onChange={(e) => setJ("category", e.target.value)}
                    placeholder="e.g. Information Technology / Retail"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Location *</label>
                  <Input
                    required
                    value={jobForm.location}
                    onChange={(e) => setJ("location", e.target.value)}
                    placeholder="e.g. Mumbai, Pune, Hybrid"
                    className="text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFF] border-b border-[#E0E8F5]">
                <span className="size-7 rounded-xl bg-[#063B78] text-white flex items-center justify-center text-xs font-black">2</span>
                <h2 className="text-sm font-black text-[#10233F]">Salary & Work Mode</h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Min Salary (₹)</label>
                  <Input
                    type="number"
                    value={jobForm.salaryMin}
                    onChange={(e) => setJ("salaryMin", e.target.value)}
                    placeholder="e.g. 25000"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Max Salary (₹)</label>
                  <Input
                    type="number"
                    value={jobForm.salaryMax}
                    onChange={(e) => setJ("salaryMax", e.target.value)}
                    placeholder="e.g. 45000"
                    className="text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Salary Period</label>
                  <select
                    value={jobForm.salaryType}
                    onChange={(e) => setJ("salaryType", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Daily">Daily Wage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Type</label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJ("jobType", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F]"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Work Mode</label>
                  <select
                    value={jobForm.workMode}
                    onChange={(e) => setJ("workMode", e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F]"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Work From Home">Work From Home</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Vacancies</label>
                  <Input
                    type="number"
                    value={jobForm.vacancies}
                    onChange={(e) => setJ("vacancies", e.target.value)}
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
                <h2 className="text-sm font-black text-[#10233F]">Job Description & Requirements</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Job Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={jobForm.description}
                    onChange={(e) => setJ("description", e.target.value)}
                    placeholder="Enter detailed job description, duties, and candidate expectations..."
                    className="w-full p-3 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Required Qualification</label>
                    <Input
                      value={jobForm.education}
                      onChange={(e) => setJ("education", e.target.value)}
                      placeholder="e.g. Graduate / B.E. / Any Degree"
                      className="text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Required Experience</label>
                    <Input
                      value={jobForm.experience}
                      onChange={(e) => setJ("experience", e.target.value)}
                      placeholder="e.g. 1 - 3 Years"
                      className="text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-white rounded-2xl border border-[#E0E8F5] px-6 py-4 flex items-center justify-between sticky bottom-0 shadow-lg">
              <p className="text-[10px] text-[#9DAEC5] font-semibold">* Required fields must be filled before submitting</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowJobForm(false)} className="px-5 py-2.5 rounded-xl border border-[#DCE5F0] text-xs font-bold text-[#5B6B7F] hover:bg-[#F5F8FC] transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#063B78] to-[#0A4F9E] text-white font-black text-xs hover:opacity-90 transition-all shadow-md shadow-[#063B78]/20 flex items-center gap-1.5">
                  {editingJobId ? "✦ Update Job Posting" : "✦ Publish Job"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FA] flex font-sans">
      {/* ── LEFT DARK NAVY SIDEBAR ── */}
      <aside className="w-64 bg-[#021D3D] text-white flex flex-col hidden md:flex h-screen sticky top-0 shrink-0 border-r border-white/10 overflow-y-auto">
        {/* Logo / Company Name Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 bg-gradient-to-br from-[#FFC400] to-[#FFA500] rounded-xl flex items-center justify-center shadow-lg border-[2px] border-white/10 shrink-0">
              <Building2 className="size-5 text-[#021D3D]" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-black text-sm leading-tight tracking-tight uppercase truncate text-white" title={currentUser?.fullName || "Employer Portal"}>
                {currentUser?.fullName || "Company Portal"}
              </h1>
              <span className="text-[10px] text-[#FFC400] font-black uppercase tracking-widest block">Employer Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-black uppercase text-[#9DAEC5] tracking-widest px-3 mb-2">Main Navigation</div>
          {[
            { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
            { id: "jobs", label: "Job Listings", icon: BriefcaseBusiness, count: jobs.length },
            { id: "applications", label: "Job Applications", icon: FileText, count: applications.length },
            { id: "attendance", label: "Attendance & Payroll", icon: CalendarCheck, count: workers.length },
            { id: "profile", label: "My Profile", icon: User },
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
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              dataStore.logout("employer");
              toast.info("Logged out successfully");
              window.location.replace("/#main");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── RIGHT MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar Header */}
        <header className="h-20 bg-white border-b border-[#E0E8F5] flex items-center justify-between px-6 sm:px-8 sticky top-0 z-30 shadow-sm shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <h2 className="text-xl font-black text-[#063B78] whitespace-nowrap leading-tight">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "jobs" && "Job Listings"}
              {activeTab === "applications" && "Job Applications"}
              {activeTab === "attendance" && "Attendance & Payroll"}
              {activeTab === "profile" && "My Profile Settings"}
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Job Credits Indicator */}
            {!isSuperAdmin && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-black text-amber-800 shrink-0">
                <Zap className="size-4 fill-amber-400 text-amber-500" />
                <span>Credits: {userCredits >= 999 ? "Unlimited" : userCredits}</span>
                <button
                  onClick={() => setShowPackageModal(true)}
                  className="ml-1 bg-amber-400 hover:bg-amber-500 text-[#063B78] px-2 py-0.5 rounded text-[10px] font-black transition-all"
                >
                  + Add
                </button>
              </div>
            )}

            {/* Global Search input */}
            <div className="relative hidden md:block">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DAEC5]" />
              <input
                type="text"
                placeholder="Global search..."
                className="w-44 lg:w-56 h-10 pl-10 pr-4 rounded-full bg-[#F8FAFF] border border-[#DCE5F0] text-sm font-semibold focus:ring-2 focus:ring-[#FFC400]/50 focus:border-[#FFC400] outline-none transition-all text-[#063B78]"
              />
            </div>

            {/* Notification Bell */}
            <div className="size-10 bg-[#F8FAFF] border border-[#DCE5F0] rounded-full flex items-center justify-center relative cursor-pointer hover:bg-gray-100 transition-colors shrink-0">
              <Bell className="size-5 text-[#5B6B7F]" />
              <span className="absolute top-2 right-2 size-2 bg-[#FFC400] rounded-full border border-white"></span>
            </div>

            {/* Employer Profile Pill */}
            <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-[#E0E8F5] shrink-0">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-[#063B78]">{currentUser?.fullName || "Employer Account"}</div>
                <div className="text-[10px] font-bold text-amber-600 flex items-center justify-end gap-1">
                  <ShieldCheck className="size-3" /> Verified Employer
                </div>
              </div>
              {currentUser?.profilePhoto ? (
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.fullName || "Employer"}
                  className="size-10 rounded-xl object-cover shadow-md border-b-[2px] border-[#021D3D]"
                />
              ) : (
                <div className="size-10 bg-gradient-to-br from-[#063B78] to-[#0A4F9E] rounded-xl flex items-center justify-center text-white font-black shadow-md border-b-[2px] border-[#021D3D]">
                  {(currentUser?.fullName || "E").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Body Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Top 4 Stat Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card 1: Total Jobs */}
                <div
                  onClick={() => setActiveTab("jobs")}
                  className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm hover:shadow-md hover:border-[#063B78] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[#5B6B7F] uppercase tracking-wider">Total Posted Jobs</span>
                    <div className="size-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black group-hover:bg-[#063B78] group-hover:text-white transition-colors shrink-0">
                      <BriefcaseBusiness className="size-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#063B78] mb-2">{jobs.length}</div>
                  <div className="pt-2 border-t border-[#F0F4FA] text-xs">
                    <span className="inline-block font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {jobs.filter((j) => j.status === "Active").length} Active Jobs
                    </span>
                  </div>
                </div>

                {/* Card 2: Total Applications */}
                <div
                  onClick={() => setActiveTab("applications")}
                  className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm hover:shadow-md hover:border-[#063B78] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[#5B6B7F] uppercase tracking-wider">Total Applications</span>
                    <div className="size-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black group-hover:bg-[#063B78] group-hover:text-white transition-colors shrink-0">
                      <FileText className="size-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#063B78] mb-2">{applications.length}</div>
                  <div className="pt-2 border-t border-[#F0F4FA] text-xs">
                    <span className="inline-block font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      {new Set(applications.map((a) => a.jobSeekerId || a.candidateEmail)).size} Applicants
                    </span>
                  </div>
                </div>

                {/* Card 3: Total Registered Employees */}
                <div
                  onClick={() => setActiveTab("attendance")}
                  className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm hover:shadow-md hover:border-[#063B78] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[#5B6B7F] uppercase tracking-wider">Total Employees</span>
                    <div className="size-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black group-hover:bg-[#063B78] group-hover:text-white transition-colors shrink-0">
                      <Users className="size-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#063B78] mb-2">{workers.length}</div>
                  <div className="pt-2 border-t border-[#F0F4FA] text-xs">
                    <span className="inline-block font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                      Registered Staff
                    </span>
                  </div>
                </div>

                {/* Card 4: Today's Attendance Overview */}
                <div
                  onClick={() => setActiveTab("attendance")}
                  className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-sm hover:shadow-md hover:border-[#063B78] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[#5B6B7F] uppercase tracking-wider">Present Today</span>
                    <div className="size-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black group-hover:bg-[#063B78] group-hover:text-white transition-colors shrink-0">
                      <CalendarCheck className="size-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#063B78] mb-2">
                    {dailyAttendanceRecords.filter((r) => r.status === "Present" || r.status === "Overtime" || r.status === "HalfDay").length} / {workers.length}
                  </div>
                  <div className="pt-2 border-t border-[#F0F4FA] text-xs">
                    <span className="inline-block font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                      Attendance Shift
                    </span>
                  </div>
                </div>
              </div>

              {/* Overview Section 1: Recent Applications */}
              <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#10233F]">
                      📩 Recent Job Candidates & Applications
                    </h3>
                    <p className="text-xs font-semibold text-[#5B6B7F] mt-0.5">
                      Candidates who applied to your posted jobs on the portal.
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("applications")}
                    className="bg-[#063B78] text-white font-black text-xs hover:bg-[#0A4F9E]"
                  >
                    View All →
                  </Button>
                </div>

                {applications.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-[#E0E8F5] rounded-xl bg-[#F8FAFF]">
                    <FileText className="size-8 text-[#A0AEC0] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#10233F]">No candidate applications received yet</p>
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
                      👥 Registered Employees & Attendance Register
                    </h3>
                    <p className="text-xs font-semibold text-[#5B6B7F] mt-0.5">
                      Manage employee wage rates, daily attendance marking, and monthly payroll reports.
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("attendance")}
                    className="bg-[#063B78] text-white font-black text-xs hover:bg-[#0A4F9E]"
                  >
                    View All →
                  </Button>
                </div>

                {workers.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-[#E0E8F5] rounded-xl bg-[#F8FAFF]">
                    <Users className="size-8 text-[#A0AEC0] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#10233F]">No employees registered yet</p>
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
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">₹{worker.dailyRate}/day</span>
                          </div>
                          <p className="text-xs font-semibold text-[#5B6B7F]">Department: <span className="font-bold text-[#10233F]">{formatCategoryName(worker.category || worker.trade)}</span></p>
                          <p className="text-[11px] font-semibold text-[#5B6B7F]">Mobile: {worker.mobile || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: JOBS CONTROL */}
          {activeTab === "jobs" && (
            <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#10233F]">
                    All Platform Job Listings
                  </h2>
                  <p className="text-xs font-semibold text-[#5B6B7F]">
                    Total {jobs.length} job listings available. Manage or update job posts.
                  </p>
                </div>

                <div className="w-full sm:w-72 relative">
                  <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
                  <Input
                    placeholder="Search job title, company, or location..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="pl-9 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#DCE5F0]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#063B78] text-white font-black uppercase">
                    <tr>
                      <th className="p-3.5">Job Title</th>
                      <th className="p-3.5">Company</th>
                      <th className="p-3.5">Location & Salary</th>
                      <th className="p-3.5">Vacancies</th>
                      <th className="p-3.5">Approval</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE5F0] font-semibold text-[#10233F]">
                    {filteredJobs.map((j) => (
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
                          <div className="text-[#125BB5] font-bold">{j.salary}</div>
                        </td>
                        <td className="p-3.5 font-black text-[#063B78]">{j.vacancies || 5} Openings</td>
                        <td className="p-3.5">
                          {j.approvalStatus === "rejected" ? (
                            <Badge className="bg-red-600 text-white font-bold">❌ Rejected</Badge>
                          ) : j.approvalStatus === "approved" || !j.approvalStatus ? (
                            <Badge className="bg-emerald-600 text-white font-bold">✅ Approved</Badge>
                          ) : (
                            <Badge className="bg-amber-500 text-white font-bold">⏳ Pending Approval</Badge>
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
                            {j.status}
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
                              View Applications ({applications.filter((a) => a.jobId === j.id).length})
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditJobClick(j)}
                              className="font-extrabold text-[11px] border-[#063B78] text-[#063B78] hover:bg-[#F0F5FF]"
                            >
                              <Edit className="size-3.5 mr-1" /> Edit
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
            </div>
          )}

          {/* TAB 3: APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#10233F]">
                    Job Applications & Applicants
                  </h2>
                  <p className="text-xs font-semibold text-[#5B6B7F]">
                    Total {applications.length} candidates applied. Contact candidates directly or update application status.
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
                      placeholder="Search candidate name, job, or phone..."
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
                      <th className="p-3.5">Candidate Name</th>
                      <th className="p-3.5">Applied Job</th>
                      <th className="p-3.5">Direct Contact</th>
                      <th className="p-3.5">Applied Date</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Details</th>
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
                                <option value="Applied">📝 Applied</option>
                                <option value="Viewed">👀 Viewed</option>
                                <option value="Shortlisted">⭐ Shortlisted</option>
                                <option value="Interview">📅 Interview Scheduled</option>
                                <option value="Selected">✅ Selected / Hired</option>
                                <option value="Rejected">❌ Rejected</option>
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
                              <td colSpan={6} className="p-4 border-t border-[#DCE5F0]">
                                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                                  <h4 className="font-bold text-[#10233F] mb-4 border-b pb-2 flex items-center gap-2">
                                    <FileText className="size-4 text-[#063B78]" />
                                    Candidate Application Details
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {a.fieldValues && Object.entries(a.fieldValues).map(([key, value]) => (
                                      <div key={key} className="text-xs bg-[#F5F8FC] p-3 rounded-lg border border-[#DCE5F0]">
                                        <div className="font-bold text-[#5B6B7F] capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                        <div className="font-black text-[#10233F]">{value as string}</div>
                                      </div>
                                    ))}
                                    {a.customAnswers && Object.entries(a.customAnswers).map(([key, value]) => (
                                      <div key={key} className="text-xs bg-[#F5F8FC] p-3 rounded-lg border border-[#DCE5F0]">
                                        <div className="font-bold text-[#5B6B7F] capitalize mb-1">{key}</div>
                                        <div className="font-black text-[#10233F]">{value as string}</div>
                                      </div>
                                    ))}
                                    {(!a.fieldValues && !a.customAnswers) && (
                                      <div className="text-sm font-semibold text-[#5B6B7F]">No additional application details provided.</div>
                                     )}

                                   {/* Employer Reply / Message to Candidate Box */}
                                   <div className="mt-5 pt-4 border-t border-[#DCE5F0]">
                                     <label className="block text-xs font-black text-[#063B78] mb-2">
                                       💬 Candidate Reply / Employer Response (या उमेदवाराला संदेश / रिप्लाय पाठवा):
                                     </label>
                                     <div className="flex flex-col sm:flex-row gap-2">
                                       <input
                                         type="text"
                                         placeholder="e.g. Selected! Please bring original documents on Monday at 10 AM."
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
          )}

          {/* TAB 4: ATTENDANCE & WORKER MANAGEMENT */}
          {activeTab === "attendance" && (
            <div className="space-y-8 animate-fade-in">
              {/* Top Attendance Header Banner */}
              <div className="rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#063B78]/10 px-3.5 py-1 text-xs font-black text-[#063B78] mb-2">
                    <CalendarCheck className="size-4 text-[#063B78]" />
                    <span>Employee Attendance & Payroll Management</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#10233F]">
                    Employee Attendance & Payroll Register
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-[#5B6B7F] mt-1">
                    Manage employee details by department, set custom daily wage rates, mark daily attendance, and generate weekly/monthly payroll reports.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button
                    onClick={handleOpenAddWorker}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
                  >
                    <UserPlus className="size-4" />
                    <span>+ Add Employee</span>
                  </Button>
                </div>
              </div>

              {/* 2-Column Layout: Left Category Sidebar + Right Content Area */}
              {(() => {
                const defaultCategories = [
                  ...getIndustryDefaultCategories(),
                  "⚙️ Other / Custom",
                ];
                const customWorkerCats = workers.map((w) => w.category || w.trade || getIndustryDefaultCategories()[0] || "General Work");
                const allCategories = Array.from(new Set([...defaultCategories, ...customCategories, ...customWorkerCats]))
                  .filter((c) => !removedCategories.includes(c) || customWorkerCats.includes(c));

                const categoryCounts = new Map<string, number>();
                workers.forEach((w) => {
                  const cat = w.category || w.trade || "Plant Nursery & Care";
                  categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
                });

                return (
                  <div className="space-y-6 w-full">
                    {/* Attendance Sub-View Navigation Tabs + Department Dropdown Filter (Single Row at 100% Zoom) */}
                    <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-[#DCE5F0] shadow-sm overflow-hidden">
                      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto shrink-0">
                        {[
                          { id: "daily", label: "📋 Daily Attendance", icon: CalendarCheck },
                          { id: "reports", label: "📊 Reports", icon: PieChart },
                          { id: "directory", label: `👥 Employee Directory (${workers.length})`, icon: Users },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setAttendanceSubView(tab.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all ${attendanceSubView === tab.id
                              ? "bg-[#063B78] text-white shadow-md shadow-[#063B78]/20"
                              : "bg-[#F8FAFF] text-[#5B6B7F] border border-[#DCE5F0] hover:bg-[#EBF1F8] hover:text-[#063B78]"
                              }`}
                          >
                            <tab.icon className="size-4 shrink-0" />
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Department Filter Dropdown Selector */}
                        <div className="flex items-center gap-1.5 bg-[#F8FAFF] px-3 py-1.5 rounded-xl border border-[#DCE5F0] shrink-0">
                          <Layers className="size-4 text-[#063B78] shrink-0" />
                          <span className="text-xs font-black text-[#063B78] whitespace-nowrap">Department:</span>
                          <select
                            value={selectedCategoryFilter}
                            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                            className="bg-transparent font-bold text-xs text-[#10233F] focus:outline-none cursor-pointer outline-none max-w-[200px] truncate"
                          >
                            <option value="ALL">🌐 All Categories ({workers.length})</option>
                            {allCategories.map((cat) => {
                              const count = categoryCounts.get(cat) || 0;
                              const cleanName = formatCategoryName(cat);
                              return (
                                <option key={cat} value={cat}>
                                  {cleanName} ({count})
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
                            className="text-xs font-black border-[#063B78] text-[#063B78] hover:bg-blue-50 flex items-center gap-1.5 h-8 shrink-0"
                          >
                            <Printer className="size-3.5" />
                            <span>Print</span>
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
                            const st = rec?.status || "Present";
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
                            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] sm:text-xs font-bold text-[#5B6B7F] truncate" title="Total Employees">Total Employees</p>
                                  <h4 className="text-xl sm:text-2xl font-black text-[#10233F] mt-0.5">{filteredByCat.length}</h4>
                                </div>
                                <div className="p-2.5 bg-blue-50 text-[#063B78] rounded-xl shrink-0">
                                  <Users className="size-5" />
                                </div>
                              </div>

                              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] sm:text-xs font-bold text-emerald-700 truncate" title="Present Today">Present Today</p>
                                  <h4 className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">{pCount}</h4>
                                </div>
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                                  <UserCheck className="size-5" />
                                </div>
                              </div>

                              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] sm:text-xs font-bold text-amber-700 truncate" title="Half Day Today">Half Day Today</p>
                                  <h4 className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">{hCount}</h4>
                                </div>
                                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                                  <Clock className="size-5" />
                                </div>
                              </div>

                              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] sm:text-xs font-bold text-rose-700 truncate" title="Absent Today">Absent Today</p>
                                  <h4 className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5">{aCount}</h4>
                                </div>
                                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                                  <UserX className="size-5" />
                                </div>
                              </div>

                              <div className="p-3.5 sm:p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] sm:text-xs font-bold text-[#063B78] truncate" title="Today's Payable Wages">Payable Wages</p>
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
                              <span className="text-xs font-extrabold text-[#10233F] whitespace-nowrap">Select Date:</span>
                              <input
                                type="date"
                                value={selectedAttendanceDate}
                                onChange={(e) => setSelectedAttendanceDate(e.target.value)}
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
                              Today
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
                              Yesterday
                            </Button>
                          </div>

                          <div className="relative w-full sm:w-72 shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A0AEC0]" />
                            <Input
                              placeholder="Search employee name or role..."
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
                                <span>📅 Daily Attendance Sheet</span>
                                <Badge className="bg-[#063B78] text-white font-bold text-xs">
                                  {selectedAttendanceDate}
                                </Badge>
                              </h3>
                              <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                                {selectedCategoryFilter === "ALL"
                                  ? "Showing attendance records for all departments:"
                                  : `Showing attendance records for '${selectedCategoryFilter}' department:`}
                              </p>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[#EBF1F8] bg-[#F8FAFF] text-[11px] uppercase tracking-wider text-[#5B6B7F] font-black">
                                  <th className="p-4 rounded-l-xl">Employee Name</th>
                                  <th className="p-4">Department / Category</th>
                                  <th className="p-4">Role / Designation</th>
                                  <th className="p-4">Daily Wage Rate</th>
                                  <th className="p-4 text-center min-w-[390px]">Mark Attendance</th>
                                  <th className="p-4 text-right rounded-r-xl">Today's Pay</th>
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
                                        <td colSpan={6} className="py-12 text-center text-xs font-bold text-[#5B6B7F]">
                                          <div className="max-w-md mx-auto">
                                            <Users className="size-10 text-[#A0AEC0] mx-auto mb-3" />
                                            <p className="text-sm font-extrabold text-[#10233F]">
                                              {selectedCategoryFilter === "ALL"
                                                ? "No employees registered yet"
                                                : `No employees found in '${selectedCategoryFilter}' department`}
                                            </p>
                                            <p className="text-xs font-medium text-[#5B6B7F] mt-1 mb-4">
                                              Click the <span className="font-bold text-emerald-700">'+ Add Employee'</span> button above to register your first worker.
                                            </p>
                                            <Button
                                              onClick={handleOpenAddWorker}
                                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl"
                                            >
                                              <UserPlus className="size-4 mr-1.5" /> + Add Employee
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }

                                  return list.map((worker) => {
                                    const record = attMap.get(worker.id);
                                    const currentStatus = record?.status || "Present";

                                    let earnedAmount = worker.dailyRate;
                                    if (currentStatus === "HalfDay") earnedAmount = Math.round(worker.dailyRate / 2);
                                    if (currentStatus === "Absent") earnedAmount = 0;
                                    if (currentStatus === "Overtime") earnedAmount = Math.round(worker.dailyRate * 1.5);

                                    return (
                                      <tr key={worker.id} className="hover:bg-[#F8FAFF] transition-colors">
                                        <td className="p-4 font-black text-[#10233F]">
                                          <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-[#063B78]/10 text-[#063B78] font-black flex items-center justify-center text-sm shrink-0">
                                              {worker.name.slice(0, 1).toUpperCase()}
                                            </div>
                                            <div>
                                              <div className="text-sm font-black text-[#10233F]">{worker.name}</div>
                                              <div className="text-[10px] text-[#5B6B7F]">
                                                📞 {worker.mobile || "N/A"}
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

                                        <td className="p-4 text-center min-w-[390px]">
                                          <div className="inline-flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-inner whitespace-nowrap">
                                            <button
                                              type="button"
                                              onClick={() => handleMarkAttendance(worker, "Present")}
                                              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 ${currentStatus === "Present"
                                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]"
                                                : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80"
                                                }`}
                                            >
                                              <CheckCircle2 className="size-3.5" />
                                              <span>Present</span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => handleMarkAttendance(worker, "HalfDay")}
                                              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 ${currentStatus === "HalfDay"
                                                ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-[1.02]"
                                                : "text-slate-600 hover:text-amber-700 hover:bg-amber-50/80"
                                                }`}
                                            >
                                              <Clock className="size-3.5" />
                                              <span>Half Day</span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => handleMarkAttendance(worker, "Absent")}
                                              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 ${currentStatus === "Absent"
                                                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-[1.02]"
                                                : "text-slate-600 hover:text-rose-700 hover:bg-rose-50/80"
                                                }`}
                                            >
                                              <XCircle className="size-3.5" />
                                              <span>Absent</span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => handleMarkAttendance(worker, "Overtime")}
                                              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 ${currentStatus === "Overtime"
                                                ? "bg-[#063B78] text-white shadow-md shadow-[#063B78]/30 scale-[1.02]"
                                                : "text-slate-600 hover:text-[#063B78] hover:bg-blue-50/80"
                                                }`}
                                            >
                                              <Zap className="size-3.5 text-amber-400 fill-amber-400" />
                                              <span>Overtime</span>
                                            </button>
                                          </div>
                                        </td>

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
                              Report Period:
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
                              <span className="text-xs font-bold text-[#5B6B7F]">to</span>
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
                                  <p className="text-xs font-extrabold text-[#5B6B7F]">Total Recorded Days</p>
                                  <h4 className="text-2xl font-black text-[#10233F] mt-1">{reportAttendanceRecords.length}</h4>
                                </div>
                                <div className="p-3 bg-blue-50 text-[#063B78] rounded-xl">
                                  <CalendarDays className="size-5" />
                                </div>
                              </div>

                              <div className="p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-emerald-700">Total Present Days</p>
                                  <h4 className="text-2xl font-black text-emerald-600 mt-1">{totalPresentDays}</h4>
                                </div>
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                  <UserCheck className="size-5" />
                                </div>
                              </div>

                              <div className="p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-amber-700">Total Half Days</p>
                                  <h4 className="text-2xl font-black text-amber-600 mt-1">{totalHalfDays}</h4>
                                </div>
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                  <Clock className="size-5" />
                                </div>
                              </div>

                              <div className="p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-rose-700">Total Absent Days</p>
                                  <h4 className="text-2xl font-black text-rose-600 mt-1">{totalAbsentDays}</h4>
                                </div>
                                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                                  <UserX className="size-5" />
                                </div>
                              </div>

                              <div className="p-4 rounded-2xl border border-[#DCE5F0] bg-white shadow-sm flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-extrabold text-[#063B78]">Net Total Payroll</p>
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
                                <span>📊 Employee Weekly & Monthly Payroll Summary</span>
                                <Badge className="bg-[#063B78] text-white font-bold text-xs uppercase">
                                  {reportTimeframe === "week" ? "Weekly Report" : reportTimeframe === "month" ? "Monthly Report" : "Custom Range"}
                                </Badge>
                              </h3>
                              <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                                Individual employee present days, half days, absent days, overtime, and calculated net wages:
                              </p>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[#EBF1F8] bg-[#F8FAFF] text-[11px] uppercase tracking-wider text-[#5B6B7F] font-black">
                                  <th className="p-4 rounded-l-xl">Employee Name</th>
                                  <th className="p-4">Department / Category</th>
                                  <th className="p-4">Daily Wage Rate</th>
                                  <th className="p-4 text-center text-emerald-700">Present Days</th>
                                  <th className="p-4 text-center text-amber-700">Half Days</th>
                                  <th className="p-4 text-center text-rose-700">Absent Days</th>
                                  <th className="p-4 text-center text-blue-700">Overtime Days</th>
                                  <th className="p-4 text-right rounded-r-xl">Net Payable Wages</th>
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
                                          No employee attendance records found for the selected period.
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
                              <span>👥 Registered Employee Directory</span>
                              <Badge className="bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                                {workers.length} Employees Total
                              </Badge>
                            </h3>
                            <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                              Manage department employees, custom daily wage rates, mobile contacts, and designations.
                            </p>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-[#EBF1F8] bg-[#F8FAFF] text-[11px] uppercase tracking-wider text-[#5B6B7F] font-black">
                                <th className="p-4 rounded-l-xl">Employee Name</th>
                                <th className="p-4">Department / Category</th>
                                <th className="p-4">Role / Designation</th>
                                <th className="p-4">Mobile Number</th>
                                <th className="p-4">Daily Wage Rate</th>
                                <th className="p-4">Joining Date</th>
                                <th className="p-4 text-center rounded-r-xl">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EBF1F8] text-xs font-semibold">
                              {workers.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="p-8 text-center text-xs font-bold text-[#5B6B7F]">
                                    No employees registered yet.
                                  </td>
                                </tr>
                              ) : (
                                workers.map((w) => (
                                  <tr key={w.id} className="hover:bg-[#F8FAFF]">
                                    <td className="p-4">
                                      <div className="font-black text-[#10233F]">{w.name}</div>
                                      {(w.workShiftStart || w.workShiftEnd) && (
                                        <div className="text-[10px] text-[#063B78] font-bold mt-0.5 flex items-center gap-1">
                                          <Clock className="size-3 text-[#063B78]" />
                                          <span>Shift: {w.workShiftStart || "09:00"} - {w.workShiftEnd || "18:00"}</span>
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
                                          title="View Report & Print Slip"
                                        >
                                          <FileText className="size-3.5 mr-1 text-[#063B78]" /> Slip
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
                                          <Trash2 className="size-3.5 mr-1" /> Delete
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
          )}

          {/* TAB 5: MY PROFILE */}
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-5 border-b border-[#EBF1F8] mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#F0F4FA] rounded-xl text-[#063B78]">
                      <User className="size-6 text-[#063B78]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#10233F]">Employer Profile Settings</h2>
                      <p className="text-xs font-semibold text-[#5B6B7F]">Update your organization details, contact person, and profile photo</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-bold text-xs px-3 py-1">
                    ✓ Verified Employer
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
                      <h3 className="text-sm font-black text-[#10233F]">Profile Picture / Logo URL</h3>
                      <p className="text-xs text-[#5B6B7F]">Provide a valid photo or logo image URL</p>
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
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">Company / Organization Name *</label>
                      <Input
                        required
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        placeholder="e.g. Vikas Ropvatika & Nursery"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">Contact Person Name</label>
                      <Input
                        value={profileForm.contactPerson}
                        onChange={(e) => setProfileForm({ ...profileForm, contactPerson: e.target.value })}
                        placeholder="e.g. Vikas Patil"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">Email Address *</label>
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
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">Mobile / Phone Number *</label>
                      <Input
                        required
                        value={profileForm.mobile}
                        onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                        placeholder="e.g. 9822011223"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">Location / Address</label>
                      <Input
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="e.g. Pune, Maharashtra"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5B6B7F] mb-1.5">Business Industry / Sector</label>
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
                      <CheckCircle2 className="size-4" /> Save Profile Details
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

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
                    {editingWorkerId ? "Edit Employee Information" : "Add New Employee"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Enter employee details, designation, shift timings & custom fields.
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
                  placeholder="e.g. Ramesh Pawar / Vijay Patil"
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
                            placeholder="Type new category..."
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
                          <span>➕ Add New Custom Category...</span>
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
                        title="Remove Field"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                    <Input
                      placeholder="e.g. Tractor Driver / Grafting Specialist"
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
                        title="Remove Field"
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

              {/* 4. DAILY WAGE RATE & JOINING DATE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-extrabold text-slate-700 uppercase mb-1 block">
                    Custom Daily Wage Rate (₹) *
                  </Label>
                  <Input
                    type="number"
                    required
                    placeholder="500"
                    value={workerForm.dailyRate}
                    onChange={(e) => setWorkerForm((p) => ({ ...p, dailyRate: e.target.value }))}
                    className="h-11 rounded-xl text-xs font-bold border-slate-300 text-emerald-700"
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
                        title="Remove Field"
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
                      onChange={(e) => setWorkerForm((p) => ({ ...p, workShiftStart: e.target.value }))}
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
                        title="Remove Field"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                    <Input
                      type="time"
                      value={workerForm.workShiftEnd}
                      onChange={(e) => setWorkerForm((p) => ({ ...p, workShiftEnd: e.target.value }))}
                      className="h-11 rounded-xl text-xs font-bold border-slate-300"
                    />
                  </div>
                </div>
              ) : null}

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
                      title="Remove Field"
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
                placeholder="e.g. Aadhaar Card ID / Education / PF No"
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
              <span className="text-[11px] font-bold text-slate-500 uppercase">Quick Suggestions:</span>
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
                  Activate Job Posting Package
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  You need an active job posting package to post new job listings.
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
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{pkg.description || `${pkg.jobCount >= 999 ? "Unlimited Job Postings" : `${pkg.jobCount} Job Posting Credits`}`}</p>
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
                <p className="text-xs font-bold text-slate-500">Selected Plan</p>
                <p className="text-sm font-extrabold text-[#063B78]">{activeSelectedPlan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">Total Amount</p>
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
                  <span>UPI / GPay</span>
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
                  <span>Debit / Card</span>
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
                  <span>NetBanking</span>
                </button>
              </div>

              {paymentMethod === "upi" && (
                <div className="pt-2">
                  <Label className="text-xs font-bold text-slate-600 mb-1 block">
                    Enter UPI ID (or pay via PhonePe / GPay)
                  </Label>
                  <Input
                    placeholder="e.g. 9876543210@paytm"
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
                  <span>Activating...</span>
                ) : (
                  <span>Pay ₹{activeSelectedPlan.price} & Post Job</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── WORKER REPORT & SALARY SLIP MODAL ── */}
      {selectedWorkerReport && (
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
                  {selectedWorkerReport.name.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-[#10233F]">{selectedWorkerReport.name}</h3>
                    <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[10px]">
                      {formatCategoryName(selectedWorkerReport.category || selectedWorkerReport.trade)}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#5B6B7F] font-semibold mt-0.5">
                    📞 {selectedWorkerReport.mobile || "N/A"} • Role: <span className="font-bold text-[#063B78]">{selectedWorkerReport.trade || "General Worker"}</span> • Rate: <span className="font-extrabold text-emerald-700">₹{selectedWorkerReport.dailyRate} / day</span>
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
              const metrics = getWorkerReportMetrics(selectedWorkerReport, workerReportPeriod);
              return (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 text-center">
                      <p className="text-[10px] font-black uppercase text-emerald-800">Present</p>
                      <h4 className="text-xl font-black text-emerald-700 mt-1">{metrics.present} Days</h4>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/60 text-center">
                      <p className="text-[10px] font-black uppercase text-amber-800">Half Day</p>
                      <h4 className="text-xl font-black text-amber-700 mt-1">{metrics.halfDay} Days</h4>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/60 text-center">
                      <p className="text-[10px] font-black uppercase text-rose-800">Absent</p>
                      <h4 className="text-xl font-black text-rose-700 mt-1">{metrics.absent} Days</h4>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/60 text-center">
                      <p className="text-[10px] font-black uppercase text-blue-800">Overtime</p>
                      <h4 className="text-xl font-black text-blue-700 mt-1">{metrics.overtime} Days</h4>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-100/70 text-center col-span-2 sm:col-span-1">
                      <p className="text-[10px] font-black uppercase text-emerald-900">Total Wage</p>
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
                            <th className="p-2.5">Status</th>
                            <th className="p-2.5">Rate</th>
                            <th className="p-2.5 text-right">Earned Wage</th>
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
                              let pay = selectedWorkerReport.dailyRate;
                              if (r.status === "HalfDay") pay = Math.round(selectedWorkerReport.dailyRate / 2);
                              if (r.status === "Absent") pay = 0;
                              if (r.status === "Overtime") pay = Math.round(selectedWorkerReport.dailyRate * 1.5);

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
                                  <td className="p-2.5 text-slate-500">₹{selectedWorkerReport.dailyRate}</td>
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
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={() => handleDownloadPDFSalarySlip(selectedWorkerReport, workerReportPeriod)}
                      className="flex-1 bg-[#063B78] hover:bg-[#082F63] text-white font-extrabold text-xs py-5 rounded-xl shadow-md flex items-center justify-center gap-2"
                    >
                      <Download className="size-4" /> Download PDF Salary Slip
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleDownloadCSV(selectedWorkerReport, workerReportPeriod)}
                      className="flex-1 border-[#DCE5F0] text-[#063B78] hover:bg-blue-50 font-extrabold text-xs py-5 rounded-xl flex items-center justify-center gap-2"
                    >
                      <Download className="size-4" /> Export CSV Salary Data
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
