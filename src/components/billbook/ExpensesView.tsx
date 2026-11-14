import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  MinusCircle,
  Trash2,
  X,
  CreditCard,
  Wallet,
  Receipt,
  Tag,
  Building,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import { dataStore, ExpenseEntry } from "@/lib/data-store";
import { toast } from "sonner";

interface ExpensesViewProps {
  employerId: string;
  companyName?: string;
  onBack: () => void;
  onOpenReport?: () => void;
}

const EXPENSE_CATEGORIES = [
  "Tea & Snacks",
  "Rent",
  "Electricity Bill",
  "Travel & Transport",
  "Raw Material / Purchase",
  "Wages & Salary",
  "Repairs & Maintenance",
  "Office & Stationery",
  "Mobile & Internet",
  "Other / Misc"
];

export function ExpensesView({ employerId, companyName = "Green Agro", onBack, onOpenReport }: ExpensesViewProps) {
  const [refreshTick, setRefreshTick] = useState(0);

  // Selected date state (defaults to today in YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0]!, []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Filters
  const [filterMode, setFilterMode] = useState<"ALL" | "CASH" | "ONLINE" | "UPI" | "BANK">("ALL");
  const [filterType, setFilterType] = useState<"ALL" | "PAID" | "REFUND">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryType, setEntryType] = useState<"PAID" | "REFUND">("PAID");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<"CASH" | "ONLINE" | "UPI" | "BANK">("CASH");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]!);
  const [customCategory, setCustomCategory] = useState("");
  const [note, setNote] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  // Navigate date previous / next day
  const handleShiftDate = (days: number) => {
    const current = new Date(selectedDate);
    if (isNaN(current.getTime())) return;
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split("T")[0]!);
  };

  // Formatted date label: e.g. "Today (12/11/2026)" or "Yesterday (11/11/2026)" or "10/11/2026"
  const formattedDateLabel = useMemo(() => {
    const d = new Date(selectedDate);
    if (isNaN(d.getTime())) return selectedDate;
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const pad = (n: number) => n.toString().padStart(2, "0");
    const dateFormatted = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

    if (isToday) return `Today (${dateFormatted})`;
    if (isYesterday) return `Yesterday (${dateFormatted})`;
    return dateFormatted;
  }, [selectedDate]);

  // Daily Totals for the selected date - 100% Real
  const dailyTotals = useMemo(() => {
    return dataStore.getExpenseTotals(employerId, selectedDate);
  }, [employerId, selectedDate, refreshTick]);

  // Overall totals across all dates - 100% Real
  const allTimeTotals = useMemo(() => {
    return dataStore.getExpenseTotals(employerId);
  }, [employerId, refreshTick]);

  // Entries filtered by selected date and UI filters - 100% Real
  const filteredEntries = useMemo(() => {
    let list = dataStore.getExpenseEntries(employerId, selectedDate);
    if (filterMode !== "ALL") {
      list = list.filter((e) => e.paymentMode === filterMode);
    }
    if (filterType !== "ALL") {
      list = list.filter((e) => e.type === filterType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          (e.category && e.category.toLowerCase().includes(q)) ||
          (e.note && e.note.toLowerCase().includes(q)) ||
          String(e.amount).includes(q)
      );
    }
    return list;
  }, [employerId, selectedDate, filterMode, filterType, searchQuery, refreshTick]);

  // Open modal for Paid vs Refund
  const openAddModal = (type: "PAID" | "REFUND") => {
    setEntryType(type);
    setAmount("");
    setPaymentMode("CASH");
    setCategory(EXPENSE_CATEGORIES[0]!);
    setCustomCategory("");
    setNote("");
    setIsModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const finalCategory = customCategory.trim() ? customCategory.trim() : category;

    dataStore.addExpenseEntry({
      employerId,
      type: entryType,
      amount: num,
      paymentMode,
      category: finalCategory,
      note: note.trim(),
      date: selectedDate
    });

    toast.success(
      entryType === "PAID"
        ? "Expense recorded successfully!"
        : "Refund received entry saved!"
    );
    setIsModalOpen(false);
    setRefreshTick((prev) => prev + 1);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Delete this expense record?")) {
      dataStore.deleteExpenseEntry(id);
      toast.success("Expense record deleted");
      setRefreshTick((prev) => prev + 1);
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
    <div className="flex flex-col min-h-[600px] w-full max-w-5xl lg:max-w-6xl mx-auto bg-[#F4F6F9] text-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
      {/* ── TOP NAVY APP BAR ── */}
      <div className="bg-[#003F7A] text-white p-4 flex items-center justify-between shadow-md">
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
            <div className="size-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-[#FFC400]">
              🧾
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Expenses Register
              </h2>
              <p className="text-[10px] text-white/70 font-semibold">
                Track Daily Business Spending • {companyName}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Help"
        >
          <HelpCircle className="size-5" />
        </button>
      </div>

      {/* ── TOP DATE SELECTOR & DAILY SUMMARY CARD ── */}
      <div className="bg-[#003F7A] px-3.5 pb-4 pt-1">
        {/* Date Selector Pill */}
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-xs rounded-2xl p-1.5 mb-3 text-white border border-white/15">
          <button
            type="button"
            onClick={() => handleShiftDate(-1)}
            className="p-1.5 rounded-xl hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-2 text-xs font-black">
            <Calendar className="size-3.5 text-[#FFC400]" />
            <span>{formattedDateLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => handleShiftDate(1)}
            className="p-1.5 rounded-xl hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Dual Summary Card (Daily Net vs All-Time Net) */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 text-slate-800">
          <div className="grid grid-cols-2 divide-x divide-slate-200">
            {/* Column 1: Selected Day's Expense */}
            <div className="pr-3 text-center sm:text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Selected Day Total
              </span>
              <div className="text-lg sm:text-2xl font-black mt-0.5 tracking-tight text-[#DE1836]">
                {formatRupee(dailyTotals.netExpense)}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Paid:</span>
                  <span className="font-bold text-[#DE1836]">{formatRupee(dailyTotals.totalPaid)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Refunds:</span>
                  <span className="font-bold text-[#0F814D]">{formatRupee(dailyTotals.totalRefund)}</span>
                </div>
              </div>
            </div>

            {/* Column 2: All-Time Net Expense */}
            <div className="pl-3 text-center sm:text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                All-Time Expenses
              </span>
              <div className="text-lg sm:text-2xl font-black mt-0.5 tracking-tight text-slate-800">
                {formatRupee(allTimeTotals.netExpense)}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="font-bold text-slate-700">{formatRupee(allTimeTotals.totalPaid)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Entries:</span>
                  <span className="font-bold text-slate-700">{allTimeTotals.entryCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* View Report Link */}
          {onOpenReport && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-center">
              <button
                type="button"
                onClick={onOpenReport}
                className="inline-flex items-center gap-2 text-xs font-black text-[#0050B3] hover:text-[#003F7A] transition-colors cursor-pointer active:scale-95 py-1 px-3 rounded-lg hover:bg-blue-50"
              >
                <FileSpreadsheet className="size-4 text-[#0050B3]" />
                <span>VIEW EXPENSES REPORT</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="p-3 sm:p-4 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category, note, amount..."
            className="w-full pl-3 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0050B3]"
          />
        </div>

        {/* Filter by Mode */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
          {(["ALL", "CASH", "ONLINE"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setFilterMode(m)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterMode === m ? "bg-white text-slate-800 shadow-2xs font-extrabold" : "text-slate-500"
              }`}
            >
              {m === "ALL" ? "All" : m === "CASH" ? "Cash" : "Online"}
            </button>
          ))}
        </div>

        {/* Filter by Type */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === "ALL" ? "bg-white text-slate-800 shadow-2xs font-extrabold" : "text-slate-500"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType("PAID")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === "PAID" ? "bg-[#DE1836] text-white shadow-2xs font-extrabold" : "text-slate-500"
            }`}
          >
            Paid (-)
          </button>
          <button
            type="button"
            onClick={() => setFilterType("REFUND")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === "REFUND" ? "bg-[#0F814D] text-white shadow-2xs font-extrabold" : "text-slate-500"
            }`}
          >
            Refund (+)
          </button>
        </div>
      </div>

      {/* ── EXPENSE ENTRIES LIST ── */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2">
        {filteredEntries.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="size-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              🧾
            </div>
            <h4 className="font-bold text-sm text-slate-700">
              No Expenses Recorded For This Date
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Click the buttons below to record your business expenses or refunds.
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isPaid = entry.type === "PAID";
            return (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      isPaid ? "bg-[#DE1836]/10 text-[#DE1836]" : "bg-[#0F814D]/10 text-[#0F814D]"
                    }`}
                  >
                    {isPaid ? "-" : "+"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-slate-800 truncate">
                        {entry.category}
                      </span>
                      {entry.note ? (
                        <span className="text-[11px] text-slate-500 font-medium truncate">
                          ({entry.note})
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-semibold flex-wrap">
                      <span>{entry.date}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                        {entry.paymentMode === "CASH" ? "💵 Cash" : "💳 " + entry.paymentMode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-sm sm:text-base font-black ${
                      isPaid ? "text-[#DE1836]" : "text-[#0F814D]"
                    }`}
                  >
                    {isPaid ? "- " : "+ "}
                    {formatRupee(entry.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteExpense(entry.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── BOTTOM DUAL ACTION BAR (RED PAID & GREEN REFUND) ── */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-3 shadow-md mt-auto">
        <button
          type="button"
          onClick={() => openAddModal("PAID")}
          className="flex-1 py-3 px-4 rounded-2xl bg-[#DE1836] hover:bg-[#C2142E] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
        >
          <MinusCircle className="size-5 shrink-0" />
          <span>- PAID EXPENSE</span>
        </button>

        <button
          type="button"
          onClick={() => openAddModal("REFUND")}
          className="flex-1 py-3 px-4 rounded-2xl bg-[#0F814D] hover:bg-[#0B673D] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
        >
          <PlusCircle className="size-5 shrink-0" />
          <span>+ REFUND</span>
        </button>
      </div>

      {/* ── ADD EXPENSE MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div
              className={`p-4 text-white flex items-center justify-between ${
                entryType === "PAID" ? "bg-[#DE1836]" : "bg-[#0F814D]"
              }`}
            >
              <div className="flex items-center gap-2 font-black text-base">
                {entryType === "PAID" ? (
                  <>
                    <MinusCircle className="size-5" />
                    <span>Record Paid Expense (-)</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-5" />
                    <span>Record Refund Received (+)</span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-5 space-y-4">
              {/* Amount */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                  Amount (₹) *
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-800 focus:outline-none focus:border-[#0050B3]"
                  />
                </div>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1.5 block uppercase tracking-wider">
                  Payment Mode *
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-black">
                  {(["CASH", "ONLINE", "UPI", "BANK"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMode(m)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMode === m
                          ? "bg-blue-50 border-[#0050B3] text-[#0050B3] shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0050B3]"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Category (Optional) */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                  Or Custom Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Packaging, Generator Fuel"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0050B3]"
                />
              </div>

              {/* Note / Remarks */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                  Note / Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid to Rahul for repairs"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0050B3]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-white font-black text-xs shadow-md transition-colors cursor-pointer ${
                    entryType === "PAID" ? "bg-[#DE1836] hover:bg-[#C2142E]" : "bg-[#0F814D] hover:bg-[#0B673D]"
                  }`}
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── HELP BOTTOM SHEET ── */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="size-5 text-[#0050B3]" />
                <h3 className="font-black text-base text-slate-800">
                  How Expenses Register Works
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 font-medium leading-relaxed">
              <p>
                <strong>1. Paid Expense (-):</strong>{" "}
                Record all business expenses such as rent, raw materials, tea & snacks, salary, and maintenance.
              </p>
              <p>
                <strong>2. Refund (+):</strong>{" "}
                Record any refund or returned money from previous expenses.
              </p>
              <p>
                <strong>3. Real-Time Math:</strong>{" "}
                All net expenses automatically tally and link to your business report.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 rounded-xl bg-[#003F7A] text-white font-black text-xs shadow-md cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
