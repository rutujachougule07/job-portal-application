import React, { useState, useEffect } from "react";
import {
  UserPlus, Plus, X, Trash2, Clock, Zap, Edit3, Sparkles, ChevronDown
} from "lucide-react";
import { EmployerWorker, CustomField } from "./types";

export interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workerData: Partial<EmployerWorker>) => void;
  initialData?: EmployerWorker | null;
  empIdentifier?: string;
  attendanceMode?: "fixed" | "field";
}

// Time helpers
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

const DEFAULT_CATEGORIES = [
  "💻 Software Developer / Engineer",
  "🎨 UI/UX Designer",
  "📊 Data Analyst",
  "📞 BPO / Call Center Executive",
  "📈 Sales & Marketing",
  "👥 HR & Administration",
  "🛎️ System Admin / IT Support",
  "💼 Project Manager",
  "🌱 Plant Nursery & Care",
  "🚜 Tractor & Machinery",
  "⚡ Electrical & Wiring",
  "🧱 Masonry & Brickwork",
  "⚙️ Machine Operator",
  "📦 Packing & Warehouse",
  "💼 Office Staff & Admin",
];

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  empIdentifier = "admin-001",
  attendanceMode = "fixed",
}) => {
  const [workerForm, setWorkerForm] = useState({
    name: "",
    mobile: "",
    trade: "General Worker",
    category: "💻 Software Developer / Engineer",
    education: "",
    dailyRate: "600",
    joiningDate: new Date().toISOString().split("T")[0]!,
    workShiftStart: "09:00",
    workShiftEnd: "18:00",
    dailyWorkingHours: "9",
    overtimeRate: "67",
    overtimeRateMode: "auto" as "auto" | "manual",
    notes: "",
    pin: "1234",
    locationType: "fixed" as "fixed" | "field",
    attendanceMode: "punch" as "punch" | "manual",
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showAddFieldPrompt, setShowAddFieldPrompt] = useState(false);
  const [newFieldNameInput, setNewFieldNameInput] = useState("");
  const [removedStandardFields, setRemovedStandardFields] = useState<string[]>([]);

  // Category state
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`emp_custom_cats_${empIdentifier}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [removedCategories, setRemovedCategories] = useState<string[]>([]);
  const [showOtherCategoryInput, setShowOtherCategoryInput] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [newCustomCategoryInput, setNewCustomCategoryInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setWorkerForm({
        name: initialData.name || "",
        mobile: initialData.mobile || "",
        trade: initialData.trade || "General Worker",
        category: initialData.category || "💻 Software Developer / Engineer",
        education: initialData.education || "",
        dailyRate: initialData.dailyRate ? initialData.dailyRate.toString() : "600",
        joiningDate: initialData.joiningDate || new Date().toISOString().split("T")[0]!,
        workShiftStart: initialData.workShiftStart || "09:00",
        workShiftEnd: initialData.workShiftEnd || "18:00",
        dailyWorkingHours: initialData.dailyWorkingHours ? initialData.dailyWorkingHours.toString() : "9",
        overtimeRate: initialData.overtimeRate ? initialData.overtimeRate.toString() : "67",
        overtimeRateMode: initialData.overtimeRateMode || "auto",
        notes: initialData.notes || "",
        pin: initialData.pin || "1234",
        locationType: initialData.locationType || "fixed",
        attendanceMode: initialData.attendanceMode || "punch",
      });
      setCustomFields(initialData.customFields || []);
    } else {
      setWorkerForm({
        name: "",
        mobile: "",
        trade: "General Worker",
        category: "💻 Software Developer / Engineer",
        education: "",
        dailyRate: "600",
        joiningDate: new Date().toISOString().split("T")[0]!,
        workShiftStart: "09:00",
        workShiftEnd: "18:00",
        dailyWorkingHours: "9",
        overtimeRate: "67",
        overtimeRateMode: "auto",
        notes: "",
        pin: "1234",
        locationType: "fixed",
        attendanceMode: "punch",
      });
      setCustomFields([]);
      setRemovedStandardFields([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddCustomCategory = () => {
    const trimmed = newCustomCategoryInput.trim();
    if (!trimmed) return;
    const catName = trimmed.startsWith("✨") ? trimmed : `✨ ${trimmed}`;
    const updated = Array.from(new Set([...customCategories, catName]));
    setCustomCategories(updated);
    try {
      localStorage.setItem(`emp_custom_cats_${empIdentifier}`, JSON.stringify(updated));
    } catch {}
    setWorkerForm((p) => ({ ...p, category: catName }));
    setNewCustomCategoryInput("");
    setShowOtherCategoryInput(false);
  };

  const handleRemoveCategory = (catToRemove: string) => {
    const updatedCustom = customCategories.filter((c) => c !== catToRemove);
    setCustomCategories(updatedCustom);
    setRemovedCategories((prev) => [...prev, catToRemove]);
    if (workerForm.category === catToRemove) {
      setWorkerForm((p) => ({ ...p, category: DEFAULT_CATEGORIES[0] || "General Work" }));
    }
  };

  const handleRemoveStandardField = (fieldKey: string) => {
    setRemovedStandardFields((prev) => [...prev, fieldKey]);
  };

  const handleRestoreStandardField = (fieldKey: string) => {
    setRemovedStandardFields((prev) => prev.filter((k) => k !== fieldKey));
  };

  const handleOpenAddFieldPrompt = () => {
    setNewFieldNameInput("");
    setShowAddFieldPrompt(true);
  };

  const handleConfirmAddCustomField = (presetName?: string) => {
    const fieldName = (presetName || newFieldNameInput).trim();
    if (!fieldName) return;
    setCustomFields((prev) => [...prev, { label: fieldName, value: "" }]);
    setNewFieldNameInput("");
    setShowAddFieldPrompt(false);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCustomFieldChange = (index: number, val: string) => {
    setCustomFields((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index]!, value: val };
      }
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerForm.name.trim()) return;

    const baseHrsNum = computeHoursFromTimes(workerForm.workShiftStart, workerForm.workShiftEnd);
    const dailyWageNum = Number(workerForm.dailyRate) || 600;
    const workingHrsNum = Number(workerForm.dailyWorkingHours) || baseHrsNum;
    const autoOtRate = baseHrsNum > 0 ? Math.round(dailyWageNum / baseHrsNum) : 67;
    const otRateNum = Number(workerForm.overtimeRate) || autoOtRate;

    const payload: Partial<EmployerWorker> = {
      ...(initialData ? { id: initialData.id } : {}),
      employerId: empIdentifier,
      employerName: (initialData as any)?.employerName || "Alpha Byte",
      name: workerForm.name.trim(),
      mobile: workerForm.mobile.trim(),
      trade: workerForm.trade.trim() || "General Worker",
      category: workerForm.category.trim() || "General",
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
    };

    onSave(payload);
    onClose();
  };

  const baseShiftHrs = computeHoursFromTimes(workerForm.workShiftStart, workerForm.workShiftEnd);
  const dailyWageNum = Number(workerForm.dailyRate) || 600;
  const autoHourlyRate = baseShiftHrs > 0 ? Math.round(dailyWageNum / baseShiftHrs) : 67;
  const currentWorkingHrs = Number(workerForm.dailyWorkingHours) || baseShiftHrs;
  const addedOtHours = Math.max(0, Math.round((currentWorkingHrs - baseShiftHrs) * 10) / 10);
  const activeHourlyRate = workerForm.overtimeRateMode === "manual" && workerForm.overtimeRate
    ? (Number(workerForm.overtimeRate) || autoHourlyRate)
    : autoHourlyRate;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-extrabold text-xl p-2 rounded-full hover:bg-slate-100 transition-colors"
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
                  {initialData ? "Edit Employee Information" : "Add New Employee"}
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
              className="px-3.5 py-2.5 rounded-xl bg-[#063B78] hover:bg-[#0A4F9E] text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="size-4" /> Add Custom Field
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="text-xs font-extrabold text-slate-700 uppercase mb-1 block">
                EMPLOYEE NAME *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Ramesh Pawar / Vijay Patil"
                value={workerForm.name}
                onChange={(e) => setWorkerForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full h-11 px-3.5 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>

            {/* 2. DEPARTMENT / CATEGORY */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase block">
                  DEPARTMENT / CATEGORY *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryDropdownOpen(true);
                    setShowOtherCategoryInput(true);
                  }}
                  className="text-[#063B78] hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="size-3" /> Add Custom Category
                </button>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                  className="w-full h-11 px-3.5 rounded-xl text-xs font-bold border border-slate-300 bg-white text-[#10233F] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#063B78] shadow-xs cursor-pointer"
                >
                  <span className="truncate">{workerForm.category || "Select Category"}</span>
                  <ChevronDown className={`size-4 text-slate-400 transition-transform duration-200 ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 right-0 top-12 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto p-1.5 space-y-0.5">
                    {[...DEFAULT_CATEGORIES, ...customCategories]
                      .filter((c) => !removedCategories.includes(c))
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
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                              isSelected ? "bg-[#063B78] text-white" : "hover:bg-slate-100 text-[#10233F]"
                            }`}
                          >
                            <span className="truncate">{catName}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCategory(catName);
                              }}
                              className={`p-1 rounded-lg hover:bg-red-500 hover:text-white transition-colors ml-2 shrink-0 ${
                                isSelected ? "text-white/80 hover:text-white" : "text-slate-400 hover:text-red-600"
                              }`}
                              title={`Remove category "${catName}"`}
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        );
                      })}

                    {showOtherCategoryInput ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-blue-50/90 rounded-xl border border-blue-200 mt-1 flex items-center gap-1.5"
                      >
                        <input
                          autoFocus
                          type="text"
                          placeholder="Type new category..."
                          value={newCustomCategoryInput}
                          onChange={(e) => setNewCustomCategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustomCategory();
                            }
                          }}
                          className="flex-1 h-9 px-2 text-xs font-bold bg-white border border-blue-300 rounded-lg focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomCategory}
                          className="px-3 py-2 rounded-lg bg-[#063B78] hover:bg-[#0A4F9E] text-white font-extrabold text-xs shrink-0 cursor-pointer"
                        >
                          + Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowOtherCategoryInput(false)}
                          className="p-1 text-slate-400 hover:text-slate-700 text-xs font-bold shrink-0 cursor-pointer"
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
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black text-[#063B78] hover:bg-blue-50 transition-colors border-t border-slate-100 mt-1 cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>➕ Add New Custom Category...</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 3. ROLE / DESIGNATION & MOBILE NUMBER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!removedStandardFields.includes("trade") && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-extrabold text-slate-700 uppercase block">
                      ROLE / DESIGNATION
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveStandardField("trade")}
                      className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                      title="Remove Field"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="General Worker"
                    value={workerForm.trade}
                    onChange={(e) => setWorkerForm((p) => ({ ...p, trade: e.target.value }))}
                    className="w-full h-11 px-3.5 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                  />
                </div>
              )}

              {!removedStandardFields.includes("mobile") && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-extrabold text-slate-700 uppercase block">
                      MOBILE NUMBER
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveStandardField("mobile")}
                      className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                      title="Remove Field"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 9822112233"
                    value={workerForm.mobile}
                    onChange={(e) => setWorkerForm((p) => ({ ...p, mobile: e.target.value }))}
                    className="w-full h-11 px-3.5 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                  />
                </div>
              )}
            </div>

            {/* 4. WORK LOCATION & ATTENDANCE TYPE (AUTO-DETECTED) */}
            <div className="space-y-3 p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
              <label className="text-xs font-extrabold text-slate-800 uppercase block tracking-wider">
                WORK LOCATION & ATTENDANCE TYPE (AUTO-DETECTED)
              </label>

              {attendanceMode === "field" ? (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/90 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                    <span className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                    <span>🚜 Field / Site Worksite (Auto-Detected: Employer Attendance)</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 font-medium leading-relaxed">
                    Auto-detected from company name. Mobile GPS & selfie punch-in are not required. Daily attendance will be marked directly by employer.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 bg-blue-50/90 rounded-xl border border-blue-200/90 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-[#063B78]">
                    <span className="size-2 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
                    <span>📍 Fixed Location Worksite (Auto-Detected: App Punch In/Out)</span>
                  </div>
                  <p className="text-[11px] text-blue-900/90 font-medium leading-relaxed">
                    Auto-detected from company name. Employee punches in/out via mobile app (GPS + Camera).
                  </p>

                  <div className="pt-3 border-t border-blue-200/70">
                    <label className="text-xs font-extrabold text-slate-700 uppercase mb-1 block">
                      EMPLOYEE LOGIN 4-DIGIT PIN *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="1234"
                      maxLength={4}
                      minLength={4}
                      value={workerForm.pin}
                      onChange={(e) => setWorkerForm((p) => ({ ...p, pin: e.target.value.replace(/\D/g, "") }))}
                      className="h-10 w-44 px-3 rounded-xl text-xs font-black border border-slate-300 tracking-widest text-[#063B78] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                    />
                    <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                      Employee uses Mobile Number and this 4-digit PIN to login to the app.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 5. CUSTOM DAILY WAGE RATE & JOINING DATE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 uppercase mb-1 block">
                  CUSTOM DAILY WAGE RATE (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="600"
                  value={workerForm.dailyRate}
                  onChange={(e) => {
                    const val = e.target.value;
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
                  className="w-full h-11 px-3.5 rounded-xl text-xs font-black border border-slate-300 text-emerald-700 focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                />
              </div>

              {!removedStandardFields.includes("joiningDate") && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-extrabold text-slate-700 uppercase block">
                      JOINING DATE
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveStandardField("joiningDate")}
                      className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                      title="Remove Field"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                  <input
                    type="date"
                    value={workerForm.joiningDate}
                    onChange={(e) => setWorkerForm((p) => ({ ...p, joiningDate: e.target.value }))}
                    className="w-full h-11 px-3.5 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                  />
                </div>
              )}
            </div>

            {/* 6. WORK TIMING / SHIFT */}
            {!removedStandardFields.includes("shiftTimes") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 uppercase mb-1 flex items-center gap-1">
                    <Clock className="size-3.5 text-[#063B78]" /> Work Start Time (shift)
                  </label>
                  <input
                    type="time"
                    value={workerForm.workShiftStart}
                    onChange={(e) => {
                      const startVal = e.target.value;
                      setWorkerForm((p) => {
                        const next = { ...p, workShiftStart: startVal };
                        const newBaseHrs = computeHoursFromTimes(startVal, p.workShiftEnd);
                        next.dailyWorkingHours = newBaseHrs.toString();
                        if (p.overtimeRateMode === "auto") {
                          const rateNum = Number(p.dailyRate) || 600;
                          next.overtimeRate = newBaseHrs > 0 ? Math.round(rateNum / newBaseHrs).toString() : "67";
                        }
                        return next;
                      });
                    }}
                    className="w-full h-11 px-3.5 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-extrabold text-slate-700 uppercase flex items-center gap-1">
                      <Clock className="size-3.5 text-[#063B78]" /> Work End Time (shift)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveStandardField("shiftTimes")}
                      className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                      title="Remove Field"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                  <input
                    type="time"
                    value={workerForm.workShiftEnd}
                    onChange={(e) => {
                      const endVal = e.target.value;
                      setWorkerForm((p) => {
                        const next = { ...p, workShiftEnd: endVal };
                        const newBaseHrs = computeHoursFromTimes(p.workShiftStart, endVal);
                        next.dailyWorkingHours = newBaseHrs.toString();
                        if (p.overtimeRateMode === "auto") {
                          const rateNum = Number(p.dailyRate) || 600;
                          next.overtimeRate = newBaseHrs > 0 ? Math.round(rateNum / newBaseHrs).toString() : "67";
                        }
                        return next;
                      });
                    }}
                    className="w-full h-11 px-3.5 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                  />
                </div>
              </div>
            )}

            {/* 7. OVERTIME HOURLY RATE CONFIGURATION */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-blue-50/40 to-slate-50 border-2 border-amber-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    <Zap className="size-4 fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#10233F] uppercase tracking-wide flex items-center gap-1.5">
                      Overtime Hourly Rate (₹ / hr)
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-1.5 py-0 rounded">
                        {workerForm.overtimeRateMode === "auto"
                          ? `⚡ Auto (${dailyWageNum} ÷ ${baseShiftHrs}h = ₹${autoHourlyRate}/hr)`
                          : "✏️ Custom Manual Rate"}
                      </span>
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500">
                      Daily Wage (₹{dailyWageNum}) ÷ Shift ({baseShiftHrs}h) = ₹{autoHourlyRate}/hr default rate.
                    </p>
                  </div>
                </div>

                {/* Auto vs Manual Toggle */}
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
                      setWorkerForm((p) => ({ ...p, overtimeRateMode: "manual" }));
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
                <label className="text-[11px] font-extrabold text-slate-700 uppercase flex items-center justify-between">
                  <span>Overtime Rate (₹ / hr) *</span>
                  <span className="text-[10px] text-slate-500 font-bold lowercase">
                    (daily wage remains ₹{dailyWageNum}/day)
                  </span>
                </label>
                <div className="relative max-w-sm">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                    ₹
                  </span>
                  <input
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
                    className={`w-full h-11 pl-8 pr-16 rounded-xl text-sm font-black border ${
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

            {/* 8. DYNAMIC ADDED CUSTOM FIELDS */}
            {customFields.map((field, idx) => (
              <div key={idx} className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold text-slate-700 uppercase block flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-[#063B78]" /> {field.label || "CUSTOM FIELD"}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomField(idx)}
                    className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 hover:bg-rose-50 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    title="Remove Field"
                  >
                    <Trash2 className="size-3.5" /> Remove Field
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={`e.g. Enter ${field.label}...`}
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange(idx, e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                />
              </div>
            ))}

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-bold border border-slate-300 text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg text-xs transition-colors cursor-pointer"
              >
                {initialData ? "Update Employee" : "Save Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Child Dialog: Add Custom Field Prompt */}
      {showAddFieldPrompt && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 relative space-y-4">
            <button
              type="button"
              onClick={() => setShowAddFieldPrompt(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-extrabold text-lg p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
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
              <label className="text-xs font-extrabold text-slate-700 uppercase mb-1 block">
                Field Name / Title *
              </label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Aadhaar Card ID / Education / PF No"
                value={newFieldNameInput}
                onChange={(e) => setNewFieldNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmAddCustomField();
                  }
                }}
                className="w-full h-11 px-3.5 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:border-[#063B78]"
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
                    className="px-2.5 py-1 bg-slate-100 hover:bg-[#063B78] hover:text-white text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddFieldPrompt(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmAddCustomField()}
                className="flex-1 py-2.5 rounded-xl bg-[#063B78] hover:bg-[#0A4F9E] text-white font-black text-xs shadow-md transition-colors cursor-pointer"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmployeeModal;
