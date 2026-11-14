import { useState, useMemo } from "react";
import {
  ArrowLeft,
  HelpCircle,
  FileText,
  Search,
  PlusCircle,
  MinusCircle,
  Calendar,
  Wallet,
  CreditCard,
  Trash2,
  X,
  CheckCircle2,
  Tag,
  Clock
} from "lucide-react";
import { dataStore, CashbookEntry } from "@/lib/data-store";
import { toast } from "sonner";

interface CashbookViewProps {
  employerId: string;
  companyName?: string;
  onBack: () => void;
  onOpenReport?: () => void;
}

export function CashbookView({ employerId, companyName = "Green Agro", onBack, onOpenReport }: CashbookViewProps) {
  const [refreshTick, setRefreshTick] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "CASH" | "ONLINE">("ALL");
  const [filterType, setFilterType] = useState<"ALL" | "IN" | "OUT">("ALL");

  // Add Entry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryType, setEntryType] = useState<"IN" | "OUT">("IN");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<"CASH" | "ONLINE">("CASH");
  const [partyName, setPartyName] = useState("");
  const [category, setCategory] = useState("Sales");
  const [note, setNote] = useState("");
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split("T")[0]!);
  const [showHelp, setShowHelp] = useState(false);

  // Totals & Overview from dataStore
  const totals = useMemo(() => {
    return dataStore.getCashbookTotals(employerId);
  }, [employerId, refreshTick]);

  // Entries List - 100% Real
  const entries = useMemo(() => {
    let list = dataStore.getCashbookEntries(employerId);
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
          (e.note && e.note.toLowerCase().includes(q)) ||
          (e.category && e.category.toLowerCase().includes(q)) ||
          (e.partyName && e.partyName.toLowerCase().includes(q)) ||
          String(e.amount).includes(q)
      );
    }
    return list;
  }, [employerId, filterMode, filterType, searchQuery, refreshTick]);

  const openAddModal = (type: "IN" | "OUT") => {
    setEntryType(type);
    setAmount("");
    setPaymentMode("CASH");
    setPartyName("");
    setCategory(type === "IN" ? "Sales" : "Raw Material");
    setNote("");
    setEntryDate(new Date().toISOString().split("T")[0]!);
    setIsModalOpen(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    dataStore.addCashbookEntry({
      employerId,
      type: entryType,
      amount: num,
      paymentMode,
      partyName: partyName.trim(),
      category: category.trim() || (entryType === "IN" ? "Sales" : "General"),
      note: note.trim(),
      date: entryDate,
    });

    toast.success(
      entryType === "IN"
        ? "Cash In entry added successfully!"
        : "Cash Out entry recorded successfully!"
    );
    setIsModalOpen(false);
    setRefreshTick((prev) => prev + 1);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm("Delete this cashbook entry?")) {
      dataStore.deleteCashbookEntry(id);
      toast.success("Entry deleted");
      setRefreshTick((prev) => prev + 1);
    }
  };

  // Format currency
  const formatRupee = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Format header date (e.g., 12 NOV)
  const headerDateStr = useMemo(() => {
    const d = new Date();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  }, []);

  return (
    <div className="flex flex-col min-h-[600px] w-full max-w-5xl lg:max-w-6xl mx-auto bg-[#F4F6F9] text-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
      {/* ── TOP NAVY APP BAR ── */}
      <div className="bg-[#003F7A] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-white cursor-pointer"
            title="Back to More Hub"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-[#FFC400]">
              📖
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Cashbook
              </h2>
              <p className="text-[10px] text-white/70 font-semibold">
                Daily In & Out Cash Management • {companyName}
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

      {/* ── TOP DUAL SUMMARY CARD (Total Balance vs Today's Balance) ── */}
      <div className="bg-[#003F7A] px-3.5 pb-4 pt-1">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 text-slate-800">
          <div className="grid grid-cols-2 divide-x divide-slate-200">
            {/* Column 1: Total Balance */}
            <div className="pr-3 text-center sm:text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Balance
              </span>
              <div
                className={`text-lg sm:text-2xl font-black mt-0.5 tracking-tight ${
                  totals.totalBalance >= 0 ? "text-[#0F814D]" : "text-[#DE1836]"
                }`}
              >
                {formatRupee(totals.totalBalance)}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cash in Hand:</span>
                  <span className="font-bold text-slate-700">{formatRupee(totals.cashInHand)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Online:</span>
                  <span className="font-bold text-slate-700">{formatRupee(totals.onlineBalance)}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Today's Balance */}
            <div className="pl-3 text-center sm:text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Today's Balance
              </span>
              <div
                className={`text-lg sm:text-2xl font-black mt-0.5 tracking-tight ${
                  totals.todayBalance >= 0 ? "text-[#0F814D]" : "text-[#DE1836]"
                }`}
              >
                {formatRupee(totals.todayBalance)}
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cash in Hand:</span>
                  <span className="font-bold text-slate-700">{formatRupee(totals.todayCashInHand)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Online:</span>
                  <span className="font-bold text-slate-700">{formatRupee(totals.todayOnline)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* View Cashbook Report Link Button */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-center">
            <button
              type="button"
              onClick={onOpenReport}
              className="inline-flex items-center gap-2 text-xs font-black text-[#0050B3] hover:text-[#003F7A] transition-colors cursor-pointer active:scale-95 py-1 px-3 rounded-lg hover:bg-blue-50"
            >
              <FileText className="size-4 text-[#0050B3]" />
              <span>VIEW CASHBOOK REPORT</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── DAILY SUMMARY BANNER (e.g. 12 NOV | 2 Entries | OUT ₹ 0 | IN ₹ 0) ── */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs font-bold shadow-2xs">
        <div>
          <span className="text-sm font-black text-slate-800 tracking-wide">{headerDateStr}</span>
          <span className="text-[11px] text-slate-400 ml-2 font-medium">
            {totals.todayEntryCount} {totals.todayEntryCount === 1 ? "Entry" : "Entries"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold leading-none">OUT</span>
            <span className="text-xs font-black text-[#DE1836] leading-tight">
              {formatRupee(totals.todayTotalOut)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold leading-none">IN</span>
            <span className="text-xs font-black text-[#0F814D] leading-tight">
              {formatRupee(totals.todayTotalIn)}
            </span>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="p-3 sm:p-4 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search note, party, amount..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0050B3]"
          />
        </div>

        {/* Filter by Mode */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilterMode("ALL")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterMode === "ALL" ? "bg-white text-slate-800 shadow-2xs font-extrabold" : "text-slate-500"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("CASH")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterMode === "CASH" ? "bg-white text-slate-800 shadow-2xs font-extrabold" : "text-slate-500"
            }`}
          >
            Cash
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("ONLINE")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterMode === "ONLINE" ? "bg-white text-slate-800 shadow-2xs font-extrabold" : "text-slate-500"
            }`}
          >
            Online
          </button>
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
            onClick={() => setFilterType("IN")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === "IN" ? "bg-[#0F814D] text-white shadow-2xs font-extrabold" : "text-slate-500"
            }`}
          >
            IN (+)
          </button>
          <button
            type="button"
            onClick={() => setFilterType("OUT")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === "OUT" ? "bg-[#DE1836] text-white shadow-2xs font-extrabold" : "text-slate-500"
            }`}
          >
            OUT (-)
          </button>
        </div>
      </div>

      {/* ── TRANSACTION LIST ── */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2">
        {entries.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="size-16 rounded-3xl bg-blue-50 text-[#0050B3] flex items-center justify-center mx-auto text-2xl shadow-inner">
              📖
            </div>
            <h4 className="font-bold text-sm text-slate-700">
              No Cashbook Entries Yet
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Record your daily cash collections and expenses with the buttons below.
            </p>
          </div>
        ) : (
          entries.map((entry) => {
            const isIn = entry.type === "IN";
            return (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      isIn ? "bg-[#0F814D]/10 text-[#0F814D]" : "bg-[#DE1836]/10 text-[#DE1836]"
                    }`}
                  >
                    {isIn ? "+" : "-"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-slate-800 truncate">
                        {entry.note || entry.partyName || (isIn ? "Cash In" : "Cash Out")}
                      </span>
                      {entry.partyName && entry.note && (
                        <span className="text-[11px] text-slate-400">({entry.partyName})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-semibold flex-wrap">
                      <span>{entry.date}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                        {entry.paymentMode === "ONLINE" ? "💳 Online" : "💵 Cash"}
                      </span>
                      {entry.category && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-50 text-[#0050B3] font-bold text-[10px]">
                          🏷 {entry.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-sm sm:text-base font-black ${
                      isIn ? "text-[#0F814D]" : "text-[#DE1836]"
                    }`}
                  >
                    {isIn ? "+ " : "- "}
                    {formatRupee(entry.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Entry"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── BOTTOM DUAL ACTION BAR (RED OUT & GREEN IN) ── */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-3 shadow-md mt-auto">
        <button
          type="button"
          onClick={() => openAddModal("OUT")}
          className="flex-1 py-3 px-4 rounded-2xl bg-[#DE1836] hover:bg-[#C2142E] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
        >
          <MinusCircle className="size-5 shrink-0" />
          <span>OUT (Cash Out)</span>
        </button>

        <button
          type="button"
          onClick={() => openAddModal("IN")}
          className="flex-1 py-3 px-4 rounded-2xl bg-[#0F814D] hover:bg-[#0B673D] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
        >
          <PlusCircle className="size-5 shrink-0" />
          <span>IN (Cash In)</span>
        </button>
      </div>

      {/* ── ADD/EDIT ENTRY MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div
              className={`p-4 text-white flex items-center justify-between ${
                entryType === "IN" ? "bg-[#0F814D]" : "bg-[#DE1836]"
              }`}
            >
              <div className="flex items-center gap-2 font-black text-base">
                {entryType === "IN" ? (
                  <>
                    <PlusCircle className="size-5" />
                    <span>Add Cash In (+)</span>
                  </>
                ) : (
                  <>
                    <MinusCircle className="size-5" />
                    <span>Record Cash Out (-)</span>
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

            <form onSubmit={handleSaveEntry} className="p-5 space-y-4">
              {/* Amount Input */}
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

              {/* Payment Mode Selector: Cash vs Online */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1.5 block uppercase tracking-wider">
                  Payment Mode *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("CASH")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMode === "CASH"
                        ? "bg-blue-50 border-[#0050B3] text-[#0050B3] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <Wallet className="size-4" />
                    <span>💵 Cash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode("ONLINE")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMode === "ONLINE"
                        ? "bg-blue-50 border-[#0050B3] text-[#0050B3] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <CreditCard className="size-4" />
                    <span>💳 Online (UPI/Bank)</span>
                  </button>
                </div>
              </div>

              {/* Category Picker */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(entryType === "IN"
                    ? ["Sales", "Customer Payment", "Loan Received", "Refund", "Other"]
                    : ["Raw Material", "Salary", "Rent", "Office", "Transport", "Tea/Snacks", "Other"]
                  ).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        category === cat
                          ? "bg-[#003F7A] text-white border-[#003F7A]"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / Description */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                  Note / Remarks
                </label>
                <input
                  type="text"
                  placeholder="Description of transaction..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0050B3]"
                />
              </div>

              {/* Party / Customer Name (Optional) */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                  Party / Person Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patil"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0050B3]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-black text-slate-600 mb-1 block uppercase tracking-wider">
                  Date
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
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
                    entryType === "IN" ? "bg-[#0F814D] hover:bg-[#0B673D]" : "bg-[#DE1836] hover:bg-[#C2142E]"
                  }`}
                >
                  Save Entry
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
                  How Cashbook Works
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
                <strong>1. Cash In (+):</strong>{" "}
                Click the green 'IN' button to record cash or online money received into your business.
              </p>
              <p>
                <strong>2. Cash Out (-):</strong>{" "}
                Click the red 'OUT' button when paying for expenses, raw material, wages, or vendor bills.
              </p>
              <p>
                <strong>3. Automatic Tally:</strong>{" "}
                Cash in hand and online bank balances are tallied automatically in real time.
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
