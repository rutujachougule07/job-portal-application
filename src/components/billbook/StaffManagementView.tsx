import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
  Search,
  X,
  Trash2,
  DollarSign,
  UserCheck,
  UserX,
  Clock,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/data-store";

interface StaffManagementViewProps {
  employerId: string;
  companyName?: string;
  onBack: () => void;
}

export interface BillBookStaff {
  id: string;
  name: string;
  phone: string;
  designation: string;
  salaryType: "MONTHLY" | "DAILY";
  salary: number;
  joiningDate: string;
  attendanceHistory?: Record<string, "PRESENT" | "ABSENT" | "HALFDAY" | "OVERTIME">;
}

export function StaffManagementView({
  employerId,
  companyName = "Green Agro",
  onBack,
}: StaffManagementViewProps) {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]!);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDesignation, setNewDesignation] = useState("Sales Assistant");
  const [newSalaryType, setNewSalaryType] = useState<"MONTHLY" | "DAILY">("MONTHLY");
  const [newSalary, setNewSalary] = useState("");
  const [newJoiningDate, setNewJoiningDate] = useState(() => new Date().toISOString().split("T")[0]!);

  const storageKey = `billbook_staff_${employerId}`;

  const [staffList, setStaffList] = useState<BillBookStaff[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed: BillBookStaff[] = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Purge any legacy dummy staff
            const cleaned = parsed.filter(
              (s) =>
                s &&
                s.id &&
                !s.id.startsWith("staff-1") &&
                !s.id.startsWith("staff-2") &&
                !s.id.startsWith("staff-3")
            );
            if (cleaned.length !== parsed.length) {
              localStorage.setItem(storageKey, JSON.stringify(cleaned));
            }
            return cleaned;
          }
        } catch {}
      }
    }
    return [];
  });

  // Persist on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(staffList));
    }
  }, [staffList, storageKey]);

  // Date Shift Helpers
  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    const pad = (n: number) => n.toString().padStart(2, "0");
    setSelectedDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  };

  const isToday = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0]!;
    return selectedDate === todayStr;
  }, [selectedDate]);

  // Handle Mark Attendance
  const handleMarkAttendance = (
    staffId: string,
    status: "PRESENT" | "ABSENT" | "HALFDAY" | "OVERTIME"
  ) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id !== staffId) return s;
        const history = { ...(s.attendanceHistory || {}) };
        if (history[selectedDate] === status) {
          delete history[selectedDate];
        } else {
          history[selectedDate] = status;
        }
        return { ...s, attendanceHistory: history };
      })
    );
    toast.success(`Attendance updated: ${status}`);
  };

  // Add Staff Member
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSalary) {
      toast.error("Please fill required fields");
      return;
    }

    const newStaff: BillBookStaff = {
      id: `staff-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      designation: newDesignation.trim() || "Staff",
      salaryType: newSalaryType,
      salary: parseFloat(newSalary) || 0,
      joiningDate: newJoiningDate,
      attendanceHistory: {},
    };

    setStaffList([...staffList, newStaff]);
    toast.success("Staff member added successfully!");
    setIsAddModalOpen(false);
    setNewName("");
    setNewPhone("");
    setNewSalary("");
  };

  // Delete Staff Member
  const handleDeleteStaff = (id: string, name: string) => {
    if (window.confirm(`Remove ${name} from staff?`)) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      toast.success("Staff member removed");
    }
  };

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staffList;
    const q = searchQuery.toLowerCase();
    return staffList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.designation.toLowerCase().includes(q)
    );
  }, [staffList, searchQuery]);

  // Attendance Metrics for selectedDate
  const metrics = useMemo(() => {
    let p = 0;
    let a = 0;
    let hd = 0;
    let ot = 0;

    staffList.forEach((s) => {
      const status = s.attendanceHistory?.[selectedDate];
      if (status === "PRESENT") p++;
      else if (status === "ABSENT") a++;
      else if (status === "HALFDAY") hd++;
      else if (status === "OVERTIME") ot++;
    });

    const totalEstMonthlyPayroll = staffList.reduce((sum, s) => {
      if (s.salaryType === "MONTHLY") return sum + s.salary;
      return sum + s.salary * 26;
    }, 0);

    return {
      present: p,
      absent: a,
      halfDay: hd,
      overtime: ot,
      totalEstMonthlyPayroll,
    };
  }, [staffList, selectedDate]);

  return (
    <div className="w-full max-w-5xl lg:max-w-6xl mx-auto space-y-4 pb-8 text-[#0A2540] px-2 sm:px-4">
      {/* ── TOP NAVY APP BAR ── */}
      <div className="bg-[#002D62] text-white px-4 py-3.5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white cursor-pointer"
            title="Back to Hub"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-white/15 flex items-center justify-center text-sky-300">
              <Users className="size-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-tight">
                Staff Management
              </h1>
              <p className="text-[11px] text-white/80 font-medium">
                {companyName} • Daily Attendance &amp; Salary Register
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-sky-50 active:scale-95 text-[#002D62] font-black text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>+ Add Staff</span>
        </button>
      </div>

      {/* ── SUMMARY STATS ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Employees
          </span>
          <span className="text-2xl font-black text-slate-900 font-mono">
            {staffList.length} Staff
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Est. Monthly Payroll
          </span>
          <span className="text-2xl font-black text-[#0055B3] font-mono">
            {formatCurrency(metrics.totalEstMonthlyPayroll)}
          </span>
        </div>
      </div>

      {/* ── ATTENDANCE DATE PICKER BANNER ── */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => shiftDate(-1)}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-600"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex items-center gap-2 font-mono font-bold text-sm text-slate-900">
            <Calendar className="size-4 text-[#0055B3]" />
            <span>{selectedDate}</span>
            {isToday && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-sans font-black">
                Today
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => shiftDate(1)}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-600"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Daily Attendance Overview Chips */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold font-mono">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-2 rounded-xl">
            <span className="block text-[10px] uppercase font-sans">Present</span>
            <span className="text-base font-black">{metrics.present}</span>
          </div>
          <div className="bg-rose-50 text-rose-800 border border-rose-200 p-2 rounded-xl">
            <span className="block text-[10px] uppercase font-sans">Absent</span>
            <span className="text-base font-black">{metrics.absent}</span>
          </div>
          <div className="bg-amber-50 text-amber-800 border border-amber-200 p-2 rounded-xl">
            <span className="block text-[10px] uppercase font-sans">Half Day</span>
            <span className="text-base font-black">{metrics.halfDay}</span>
          </div>
          <div className="bg-blue-50 text-blue-800 border border-blue-200 p-2 rounded-xl">
            <span className="block text-[10px] uppercase font-sans">Overtime</span>
            <span className="text-base font-black">{metrics.overtime}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name, role or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0055B3] focus:outline-none bg-slate-50/50 focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── STAFF LIST ── */}
      <div className="space-y-2.5">
        {filteredStaff.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200/90 shadow-2xs space-y-3">
            <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Users className="size-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                No Staff Found
              </h3>
              <p className="text-xs text-slate-500">
                No employees registered yet. Click '+ Add Staff' to register an employee.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0055B3] text-white font-black text-xs hover:bg-[#004494] shadow-sm transition-all cursor-pointer"
            >
              <Plus className="size-4" />
              <span>+ Add First Employee</span>
            </button>
          </div>
        ) : (
          filteredStaff.map((staff) => {
            const currentStatus = staff.attendanceHistory?.[selectedDate];

            return (
              <div
                key={staff.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-sky-100 text-[#0055B3] font-black text-base flex items-center justify-center border-2 border-white shadow-2xs">
                      {staff.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                        {staff.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-bold text-slate-700">{staff.designation}</span>
                        <span>•</span>
                        <span className="font-mono">{staff.phone || "No phone"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Salary ({staff.salaryType})
                    </span>
                    <span className="font-black text-sm sm:text-base font-mono text-emerald-600">
                      {formatCurrency(staff.salary)}
                      <span className="text-[10px] font-normal text-slate-400 ml-0.5">
                        /{staff.salaryType === "MONTHLY" ? "mo" : "day"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 4 Attendance Toggle Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-500">Attendance:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMarkAttendance(staff.id, "PRESENT")}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentStatus === "PRESENT"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      P Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkAttendance(staff.id, "ABSENT")}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentStatus === "ABSENT"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-rose-50 text-rose-800 hover:bg-rose-100"
                      }`}
                    >
                      A Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkAttendance(staff.id, "HALFDAY")}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentStatus === "HALFDAY"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                      }`}
                    >
                      HD Half Day
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkAttendance(staff.id, "OVERTIME")}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentStatus === "OVERTIME"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                      }`}
                    >
                      OT Overtime
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStaff(staff.id, staff.name)}
                      className="p-1 rounded-lg text-slate-300 hover:text-rose-600 ml-1"
                      title="Remove Employee"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── MODAL: ADD NEW EMPLOYEE ── */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#002D62]">
                <Users className="size-5 text-[#0055B3]" />
                <h3 className="font-black text-base text-slate-900">
                  Add New Employee / Staff
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Employee Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055B3]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 9822112233"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055B3]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Role</label>
                <input
                  type="text"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  placeholder="e.g. Sales Assistant / Manager"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055B3]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary Type</label>
                  <select
                    value={newSalaryType}
                    onChange={(e) => setNewSalaryType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="DAILY">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Joining Date</label>
                <input
                  type="date"
                  value={newJoiningDate}
                  onChange={(e) => setNewJoiningDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002D62] hover:bg-[#001D42] text-white text-xs font-black shadow-md"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
