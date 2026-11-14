import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Bell,
  Search,
  X,
  Phone,
  Calendar,
  CheckCircle2,
  Share2,
  Plus,
  Clock,
  AlertCircle,
  HelpCircle,
  Trash2,
  User,
} from "lucide-react";
import { dataStore, CollectionReminderEntry, formatCurrency } from "@/lib/data-store";
import { toast } from "sonner";

interface CollectionsListViewProps {
  employerId: string;
  companyName?: string;
  onBack: () => void;
  onOpenCashbook?: () => void;
}

type FilterChip = "ALL" | "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "CUSTOM" | "RECEIVED";

export function CollectionsListView({
  employerId,
  companyName = "Green Agro",
  onBack,
  onOpenCashbook,
}: CollectionsListViewProps) {
  const [activeChip, setActiveChip] = useState<FilterChip>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [customDate, setCustomDate] = useState(() => new Date().toISOString().split("T")[0]!);
  const [refreshKey, setRefreshKey] = useState(0);

  // Add Due Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [reminderDate, setReminderDate] = useState(() => new Date().toISOString().split("T")[0]!);
  const [reminderNote, setReminderNote] = useState("");

  // Reschedule Modal
  const [rescheduleItem, setRescheduleItem] = useState<CollectionReminderEntry | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState("");
  const [newRescheduleNote, setNewRescheduleNote] = useState("");

  // Fetch real totals from dataStore
  const totals = useMemo(() => {
    return dataStore.getCollectionTotals(employerId);
  }, [employerId, refreshKey]);

  // Fetch all real collection entries
  const allReminders = useMemo(() => {
    return dataStore.getCollectionReminders(employerId);
  }, [employerId, refreshKey]);

  // Filter entries based on active chip and search
  const filteredList = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    // Calculate start & end of this week (Monday to Sunday)
    const dayOfWeek = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const mondayStr = `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`;
    const sundayStr = `${sunday.getFullYear()}-${pad(sunday.getMonth() + 1)}-${pad(sunday.getDate())}`;

    // Current month prefix YYYY-MM
    const currentMonthPrefix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;

    return allReminders.filter((item) => {
      // 1. Filter by chip
      if (activeChip === "RECEIVED") {
        if (item.status !== "RECEIVED") return false;
      } else {
        // Pending only for normal date filter chips
        if (item.status === "RECEIVED") return false;

        if (activeChip === "TODAY") {
          if (item.reminderDate !== todayStr) return false;
        } else if (activeChip === "THIS_WEEK") {
          if (item.reminderDate < mondayStr || item.reminderDate > sundayStr) return false;
        } else if (activeChip === "THIS_MONTH") {
          if (!item.reminderDate.startsWith(currentMonthPrefix)) return false;
        } else if (activeChip === "CUSTOM") {
          if (item.reminderDate !== customDate) return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.customerName.toLowerCase().includes(q);
        const matchesPhone = item.customerPhone.includes(q);
        const matchesNote = (item.reminderNote || "").toLowerCase().includes(q);
        const matchesAmount = item.amount.toString().includes(q);
        if (!matchesName && !matchesPhone && !matchesNote && !matchesAmount) {
          return false;
        }
      }

      return true;
    });
  }, [allReminders, activeChip, customDate, searchQuery]);

  // Active filter chip description label
  const filterSummaryLabel = useMemo(() => {
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (activeChip === "TODAY") return `Showing reminders for Today (${todayStr})`;
    if (activeChip === "THIS_WEEK") return "Showing reminders for This Week";
    if (activeChip === "THIS_MONTH") return "Showing reminders for This Month";
    if (activeChip === "CUSTOM") return `Showing reminders for ${customDate}`;
    if (activeChip === "RECEIVED") return "Showing Collected / Received Payments";
    return "Showing All Customer Reminders & Dues";
  }, [activeChip, customDate]);

  // Handle Add New Collection Reminder
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    const amt = parseFloat(dueAmount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    dataStore.addCollectionReminder({
      employerId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      amount: amt,
      reminderDate: reminderDate || new Date().toISOString().split("T")[0]!,
      reminderNote: reminderNote.trim() || undefined,
    });

    toast.success("Collection reminder added successfully!");
    setIsAddModalOpen(false);
    setCustomerName("");
    setCustomerPhone("");
    setDueAmount("");
    setReminderNote("");
    setRefreshKey((k) => k + 1);
  };

  // Handle Mark as Received
  const handleMarkReceived = (item: CollectionReminderEntry) => {
    if (window.confirm(`Has ₹${item.amount.toLocaleString("en-IN")} been received from ${item.customerName}?`)) {
      dataStore.markCollectionReceived(item.id);
      toast.success(`✓ Payment of ${item.customerName} marked as Received!`);
      setRefreshKey((k) => k + 1);
    }
  };

  // Handle Reschedule
  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleItem || !newRescheduleDate) return;

    dataStore.rescheduleCollectionReminder(
      rescheduleItem.id,
      newRescheduleDate,
      newRescheduleNote.trim() || undefined
    );

    toast.success(`Updated reminder date for ${rescheduleItem.customerName}: ${newRescheduleDate}`);
    setRescheduleItem(null);
    setNewRescheduleDate("");
    setNewRescheduleNote("");
    setRefreshKey((k) => k + 1);
  };

  // Handle Delete Reminder
  const handleDeleteReminder = (id: string, name: string) => {
    if (window.confirm(`Delete reminder for ${name}?`)) {
      dataStore.deleteCollectionReminder(id);
      toast.success("Reminder deleted!");
      setRefreshKey((k) => k + 1);
    }
  };

  // Send WhatsApp Reminder
  const handleSendWhatsApp = (item: CollectionReminderEntry) => {
    const waReminderText = encodeURIComponent(
      `*${companyName}* - Payment Reminder\n\nDear ${item.customerName},\nThis is a friendly reminder that a pending balance of ₹${item.amount.toLocaleString("en-IN")} is due.\nKindly settle the dues at your earliest convenience.\n\nNote: ${item.reminderNote || "Invoice dues"}\nThank you!\n-${companyName}`
    );
    const phone = item.customerPhone.replace(/[^0-9]/g, "");
    const cleanPhone = phone.startsWith("91") ? phone : `91${phone}`;
    window.open(`https://wa.me/${cleanPhone}?text=${waReminderText}`, "_blank");
  };

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
            <div className="size-9 rounded-xl bg-white/15 flex items-center justify-center text-amber-300">
              <Bell className="size-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-tight">
                Collections &amp; Reminders
              </h1>
              <p className="text-[11px] text-white/80 font-medium">
                Track customer dues &amp; send payment reminders
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-[#002D62] font-black text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>+ Add Due</span>
        </button>
      </div>

      {/* ── TOTAL DUE SUMMARY CARD ── */}
      <div className="bg-gradient-to-br from-[#003B7A] to-[#0055B3] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-white/80 block uppercase tracking-wider">
              Total Amount To Collect
            </span>
            <div className="text-2xl sm:text-3xl font-black tracking-tight font-mono text-amber-300 mt-0.5">
              {formatCurrency(totals.totalDue)}
            </div>
            <span className="text-[11px] text-white/70 block mt-1">
              {totals.pendingCount} Pending Customer Reminders
            </span>
          </div>

          <div className="text-right bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/15">
            <span className="text-[10px] text-emerald-200 font-semibold block uppercase">
              Collected (Received)
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-300 font-mono">
              {formatCurrency(totals.totalReceived)}
            </span>
            <span className="text-[10px] text-white/70 block">
              {totals.receivedCount} Settled
            </span>
          </div>
        </div>
      </div>

      {/* ── FILTER CHIPS BAR (6 Tabs) ── */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "ALL", label: "All Dues" },
            { id: "TODAY", label: "Due Today" },
            { id: "THIS_WEEK", label: "This Week" },
            { id: "THIS_MONTH", label: "This Month" },
            { id: "CUSTOM", label: "Custom Date" },
            { id: "RECEIVED", label: "Received" },
          ].map((chip) => {
            const isActive = activeChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveChip(chip.id as FilterChip)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#0055B3] text-white shadow-xs scale-[1.02]"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Custom date picker if CUSTOM active */}
        {activeChip === "CUSTOM" && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <Calendar className="size-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-600">Select Date:</span>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 font-mono bg-slate-50 focus:bg-white outline-none"
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer by name or phone..."
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

        <p className="text-[11px] text-slate-400 font-medium px-1">
          {filterSummaryLabel} • {filteredList.length} Entries Found
        </p>
      </div>

      {/* ── REMINDERS LIST ── */}
      <div className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200/90 shadow-2xs space-y-3">
            <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <CheckCircle2 className="size-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                No Collections Due!
              </h3>
              <p className="text-xs text-slate-500">
                All customer balances are clear for the selected period. Click below to add a new collection reminder.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0055B3] text-white font-black text-xs hover:bg-[#004494] shadow-sm transition-all cursor-pointer"
            >
              <Plus className="size-4" />
              <span>+ Add Collection Reminder</span>
            </button>
          </div>
        ) : (
          filteredList.map((item) => {
            const isReceived = item.status === "RECEIVED";
            const todayStr = new Date().toISOString().split("T")[0]!;
            const isDueToday = item.reminderDate === todayStr && !isReceived;
            const isOverdue = item.reminderDate < todayStr && !isReceived;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-3.5 sm:p-4 border transition-all shadow-2xs hover:shadow-md space-y-3 ${
                  isReceived
                    ? "border-emerald-200/80 bg-emerald-50/20"
                    : isDueToday
                    ? "border-amber-300 ring-1 ring-amber-200/70"
                    : isOverdue
                    ? "border-rose-200 bg-rose-50/15"
                    : "border-slate-200/90"
                }`}
              >
                {/* Header Line */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isReceived
                          ? "bg-emerald-100 text-emerald-700"
                          : isDueToday
                          ? "bg-amber-100 text-amber-700"
                          : isOverdue
                          ? "bg-rose-100 text-rose-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <User className="size-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                          {item.customerName}
                        </h3>
                        {isReceived && (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ RECEIVED
                          </span>
                        )}
                        {isDueToday && (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                            ● DUE TODAY
                          </span>
                        )}
                        {isOverdue && (
                          <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                            ⚠️ OVERDUE
                          </span>
                        )}
                        {!isReceived && !isDueToday && !isOverdue && (
                          <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            ⏳ UPCOMING
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono">{item.customerPhone}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="size-3 text-slate-400" />
                          Due: {item.reminderDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Due Amount */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      {isReceived ? "Received" : "You'll get"}
                    </span>
                    <span
                      className={`font-black text-base sm:text-lg font-mono ${
                        isReceived ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>

                {/* Reminder Note */}
                {item.reminderNote && (
                  <div className="bg-slate-50 rounded-xl px-3 py-1.5 text-xs text-slate-600 border border-slate-100 flex items-center gap-1.5">
                    <span className="font-bold text-slate-400 shrink-0">Note:</span>
                    <span className="truncate">{item.reminderNote}</span>
                  </div>
                )}

                {/* Action Buttons Strip */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <div className="flex items-center gap-1.5 flex-1">
                    {/* Call Customer Button */}
                    {item.customerPhone && (
                      <a
                        href={`tel:${item.customerPhone}`}
                        className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs transition-colors shrink-0"
                      >
                        <Phone className="size-3.5 text-slate-600" />
                        <span>Call</span>
                      </a>
                    )}

                    {/* WhatsApp Reminder Button */}
                    {item.customerPhone && !isReceived && (
                      <button
                        type="button"
                        onClick={() => handleSendWhatsApp(item)}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs transition-all shadow-2xs shrink-0 cursor-pointer"
                        title="Send WhatsApp Reminder"
                      >
                        <Share2 className="size-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    )}

                    {/* Reschedule Date Button */}
                    {!isReceived && (
                      <button
                        type="button"
                        onClick={() => {
                          setRescheduleItem(item);
                          setNewRescheduleDate(item.reminderDate);
                          setNewRescheduleNote(item.reminderNote || "");
                        }}
                        className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                        title="Reschedule Reminder Date"
                      >
                        <Clock className="size-3.5 text-slate-500" />
                        <span>Reschedule</span>
                      </button>
                    )}
                  </div>

                  {/* Mark Received / Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isReceived ? (
                      <button
                        type="button"
                        onClick={() => handleMarkReceived(item)}
                        className="flex items-center gap-1 py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black text-xs transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        <span>Received</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" />
                        <span>Settled</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteReminder(item.id, item.customerName)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Reminder"
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

      {/* ── MODAL: ADD COLLECTION DUE REMINDER ── */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#002D62]">
                <Bell className="size-5 text-amber-500" />
                <h3 className="font-black text-base text-slate-900">
                  Add Collection Due Reminder
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

            <form onSubmit={handleAddReminder} className="space-y-3 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055B3]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9822012345"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055B3]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Due Amount (₹) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={dueAmount}
                  onChange={(e) => setDueAmount(e.target.value)}
                  placeholder="e.g. 8500"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reminder Date *</label>
                <input
                  type="date"
                  required
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055B3]/30 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reminder Note / Reason</label>
                <input
                  type="text"
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  placeholder="e.g. Fertilizer batch bill dues"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055B3]/30"
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
                  className="px-5 py-2 rounded-xl bg-[#0055B3] hover:bg-[#004494] text-white text-xs font-black shadow-md"
                >
                  Save Due Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: RESCHEDULE REMINDER ── */}
      {rescheduleItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setRescheduleItem(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                <Clock className="size-4 text-amber-500" />
                <span>Reschedule Collection Date</span>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleItem(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <p className="text-xs text-slate-600">
                Reschedule collection date for <strong>{rescheduleItem.customerName}</strong> ({formatCurrency(rescheduleItem.amount)}):
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Reminder Date *</label>
                <input
                  type="date"
                  required
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0055B3]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={newRescheduleNote}
                  onChange={(e) => setNewRescheduleNote(e.target.value)}
                  placeholder="e.g. Customer promised by Friday"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRescheduleItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0055B3] hover:bg-[#004494] text-white text-xs font-black shadow-md"
                >
                  Update Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
