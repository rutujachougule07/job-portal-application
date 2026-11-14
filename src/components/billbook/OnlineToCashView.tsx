import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Smartphone,
  X,
  CreditCard,
  Building2
} from "lucide-react";
import { toast } from "sonner";

interface OnlineToCashViewProps {
  employerId: string;
  companyName?: string;
  onBack: () => void;
  onOpenCashbook?: () => void;
}

export interface OnlineToCashRecord {
  id: string;
  amount: number;
  date: string;
  time: string;
  sourceNote: string;
  timestamp: number;
}

type FilterMode = "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "CUSTOM" | "ALL";

export function OnlineToCashView({
  employerId,
  companyName = "Green Agro",
  onBack,
  onOpenCashbook
}: OnlineToCashViewProps) {
  const [currentFilter, setCurrentFilter] = useState<FilterMode>("ALL");
  const [customDate, setCustomDate] = useState(() => new Date().toISOString().split("T")[0]!);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split("T")[0]!);
  const [newTime, setNewTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  });
  const [newSource, setNewSource] = useState("");

  const storageKey = `billbook_online_to_cash_${employerId}`;
  const [records, setRecords] = useState<OnlineToCashRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Strictly purge any legacy dummy entries (otc-1, otc-2, SBI ATM, HDFC, Marathi notes)
            const cleaned = parsed.filter(
              (r: any) =>
                r &&
                r.id &&
                !String(r.id).startsWith("otc-1") &&
                !String(r.id).startsWith("otc-2") &&
                !String(r.id).startsWith("otc-3") &&
                !/[\u0900-\u097F]/.test(String(r.sourceNote || "")) &&
                !String(r.sourceNote || "").includes("SBI ATM") &&
                !String(r.sourceNote || "").includes("HDFC")
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(records));
    }
  }, [records, storageKey]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0]!, []);

  // Filtered List - 100% Real
  const filteredList = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfWeekStr = startOfWeek.toISOString().split("T")[0]!;

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endOfWeekStr = endOfWeek.toISOString().split("T")[0]!;

    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    return records.filter((item) => {
      if (currentFilter === "TODAY") {
        return item.date === todayStr;
      } else if (currentFilter === "THIS_WEEK") {
        return item.date >= startOfWeekStr && item.date <= endOfWeekStr;
      } else if (currentFilter === "THIS_MONTH") {
        return item.date.startsWith(currentYearMonth);
      } else if (currentFilter === "CUSTOM") {
        return item.date === customDate;
      }
      return true;
    });
  }, [records, currentFilter, todayStr, customDate]);

  const totalTransferred = useMemo(() => {
    return filteredList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredList]);

  const filterTitleLabel = useMemo(() => {
    switch (currentFilter) {
      case "TODAY":
        return "Today's Transferred Cash";
      case "THIS_WEEK":
        return "This Week's Transferred Cash";
      case "THIS_MONTH":
        return "This Month's Transferred Cash";
      case "CUSTOM":
        return `Transferred Cash for ${customDate}`;
      case "ALL":
      default:
        return "Total All-Time Transferred to Cash";
    }
  }, [currentFilter, customDate]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const newRecord: OnlineToCashRecord = {
      id: `otc-${Date.now()}`,
      amount: amt,
      date: newDate || todayStr,
      time: newTime || "12:00 PM",
      sourceNote: newSource.trim() || "Bank / ATM Cash Withdrawal",
      timestamp: Date.now()
    };

    setRecords((prev) => [newRecord, ...prev]);
    toast.success("Transfer to Cash in Hand recorded successfully!");
    setNewAmount("");
    setNewSource("");
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, amount: number) => {
    if (window.confirm(`Delete ₹${amount} transfer entry?`)) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success("Transfer entry deleted!");
    }
  };

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="w-full max-w-5xl lg:max-w-6xl mx-auto space-y-4 pb-8 text-slate-800 animate-in fade-in duration-200 px-2 sm:px-4">
      {/* ── TOP NAVY APP BAR ── */}
      <div className="bg-[#003F7A] text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-white cursor-pointer"
            title="Back to Hub"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-[#00D4FF]">
              <Smartphone className="size-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Online to Cash
              </h2>
              <p className="text-[10px] text-white/70 font-semibold">
                Withdrawals into Cash in Hand • {companyName}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-white text-[#003F7A] font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>+ Add</span>
        </button>
      </div>

      {/* ── SUMMARY BANNER ── */}
      <div className="bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-sky-100 uppercase tracking-wider block">
            {filterTitleLabel}
          </span>
          <div className="text-2xl sm:text-3xl font-black mt-0.5 tracking-tight">
            {formatRupee(totalTransferred)}
          </div>
          <p className="text-[10px] text-sky-100/90 mt-1">
            Transferred from Bank / Online to Cash In Hand
          </p>
        </div>
        <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white">
          <Building2 className="size-6" />
        </div>
      </div>

      {/* ── FILTER CHIPS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
        {[
          { key: "ALL", label: "All Transfers" },
          { key: "TODAY", label: "Today" },
          { key: "THIS_WEEK", label: "This Week" },
          { key: "THIS_MONTH", label: "This Month" },
          { key: "CUSTOM", label: "Custom Date" }
        ].map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => setCurrentFilter(chip.key as FilterMode)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              currentFilter === chip.key
                ? "bg-[#003F7A] text-white shadow-xs font-black"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Custom Date Input */}
      {currentFilter === "CUSTOM" && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-2 text-xs">
          <Calendar className="size-4 text-[#0284C7]" />
          <span className="font-bold text-slate-600">Select Date:</span>
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-[#0284C7]"
          />
        </div>
      )}

      {/* ── RECORD LIST ── */}
      <div className="space-y-2">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 space-y-3">
            <div className="size-14 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto text-xl">
              <Smartphone className="size-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-700">
              No Online to Cash Transfers Found
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Record bank or ATM withdrawals into your register using the button below.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0284C7] text-white text-xs font-black shadow-xs hover:bg-[#0369A1] transition-all cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Record Transfer</span>
            </button>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-black text-sm shrink-0">
                  <Smartphone className="size-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-800 truncate">
                    {item.sourceNote}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm sm:text-base font-black text-[#0F814D]">
                  + {formatRupee(item.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.amount)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── ADD MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-[#003F7A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-base">
                <Smartphone className="size-5 text-[#00D4FF]" />
                <span>Record Online to Cash Transfer</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              {/* Amount */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                  Transfer Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    autoFocus
                    placeholder="0"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-800 focus:outline-none focus:border-[#003F7A]"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#003F7A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#003F7A]"
                  />
                </div>
              </div>

              {/* Source Note */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                  Source / ATM / Bank Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. SBI ATM withdrawal, Bank transfer"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#003F7A]"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#003F7A] text-white font-black text-xs shadow-md hover:bg-[#002D59] transition-colors cursor-pointer"
                >
                  Save Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
