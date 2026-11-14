import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  TrendingDown,
  Printer,
  Calendar,
  ChevronRight,
  X,
  Inbox,
  Search,
} from "lucide-react";
import {
  dataStore,
  formatCurrency,
} from "@/lib/data-store";

interface FinancialReportsViewProps {
  onBack: () => void;
  employerId?: string;
  companyName?: string;
  initialCategory?: string;
}

interface ReportOptionItem {
  id: string;
  title: string;
  description: string;
  category: "Customer" | "GST" | "Day-wise" | "Inventory" | "Supplier" | "Expense";
  colorClass: string;
}

const REPORT_OPTIONS: ReportOptionItem[] = [
  // 1. Customer
  {
    id: "customer_statement",
    title: "Customer Transactions Report",
    description: "Summary of all customer transactions and ledger balance",
    category: "Customer",
    colorClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "customer_list_pdf",
    title: "Customer List PDF",
    description: "Complete list of customers with pending balances",
    category: "Customer",
    colorClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  // 2. GST
  {
    id: "gst_sales_report",
    title: "GSTR-1 Sales Report",
    description: "Summary of taxable sales and outward supplies",
    category: "GST",
    colorClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "gst_purchase_report",
    title: "GSTR-2 Purchase Report",
    description: "Summary of inward supplies and input tax credit (ITC)",
    category: "GST",
    colorClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "gst_3b_report",
    title: "GSTR-3B Monthly Return",
    description: "Summary of GST monthly return and net liability",
    category: "GST",
    colorClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  // 3. Day-wise
  {
    id: "daywise_sales",
    title: "Sales Day-wise Report",
    description: "Daily breakdown of cash and online sales transactions",
    category: "Day-wise",
    colorClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "daywise_purchase",
    title: "Purchase Day-wise Report",
    description: "Daily summary of all purchases and paid business expenses",
    category: "Day-wise",
    colorClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  // 4. Inventory
  {
    id: "stock_report",
    title: "Stock Valuation Summary",
    description: "Available quantity in warehouse and total inventory valuation",
    category: "Inventory",
    colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "low_stock_report",
    title: "Low Stock Alert Report",
    description: "Items that reached or fell below the minimum stock threshold",
    category: "Inventory",
    colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "profit_loss_report",
    title: "Profit & Loss (P&L) Report",
    description: "Net profit & loss analysis calculated from sales and expenses",
    category: "Inventory",
    colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  // 5. Supplier
  {
    id: "supplier_statement",
    title: "Supplier Transactions Report",
    description: "Summary of supplier invoices, payments, and credit balance",
    category: "Supplier",
    colorClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "supplier_list_pdf",
    title: "Supplier List PDF",
    description: "Complete list of registered suppliers with payable dues",
    category: "Supplier",
    colorClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  // 6. Expense
  {
    id: "cashbook_report",
    title: "Expense Report",
    description: "Detailed statement of operational and daily business expenses",
    category: "Expense",
    colorClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

export const FinancialReportsView: React.FC<FinancialReportsViewProps> = ({
  onBack,
  employerId = "default",
  companyName = "Green Agro",
  initialCategory = "All",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeReport, setActiveReport] = useState<ReportOptionItem | null>(null);
  const [dateRange, setDateRange] = useState<"ALL" | "THIS_MONTH" | "LAST_MONTH" | "TODAY">("THIS_MONTH");
  const [searchQuery, setSearchQuery] = useState("");

  // 100% REAL Overview Balances (matching ReportsActivity.java loadOverviewBalances)
  const overviewTotals = useMemo(() => {
    // 1. You'll Get = Actual pending customer dues
    const collections = dataStore.getCollectionReminders(employerId);
    const pendingDues = collections
      .filter((c) => c.status === "PENDING")
      .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

    // 2. You'll Give = Actual paid expenses + cashbook OUT
    const expenses = dataStore.getExpenseEntries(employerId);
    const paidExpenses = expenses
      .filter((e) => e.type === "PAID")
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const cashTx = dataStore.getCashbookEntries(employerId);
    const cashOut = cashTx
      .filter((t) => t.type === "OUT")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return {
      youllGet: pendingDues,
      youllGive: paidExpenses + cashOut,
    };
  }, [employerId]);

  // Date filtering helper
  const isDateInFilter = (dateStr?: string) => {
    if (!dateStr || dateRange === "ALL") return true;
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    if (dateRange === "TODAY") {
      return dateStr === todayStr;
    }

    const currentYearMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
    if (dateRange === "THIS_MONTH") {
      return dateStr.startsWith(currentYearMonth);
    }

    if (dateRange === "LAST_MONTH") {
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthStr = `${lastMonthDate.getFullYear()}-${pad(lastMonthDate.getMonth() + 1)}`;
      return dateStr.startsWith(lastMonthStr);
    }

    return true;
  };

  // Real report data calculation
  const reportData = useMemo(() => {
    if (!activeReport) return null;

    const allCash = dataStore.getCashbookEntries(employerId);
    const allExpenses = dataStore.getExpenseEntries(employerId);
    const allCollections = dataStore.getCollectionReminders(employerId);

    // Filter by date
    const dateFilteredCash = allCash.filter((e) => isDateInFilter(e.date));
    const dateFilteredExpenses = allExpenses.filter((e) => isDateInFilter(e.date));
    const dateFilteredCollections = allCollections.filter((c) => isDateInFilter(c.reminderDate));

    // Items from catalog
    let catalogItems: any[] = [];
    try {
      const raw = localStorage.getItem(`billbook_items_${employerId}`);
      if (raw) catalogItems = JSON.parse(raw);
    } catch {}

    // Compute real metrics
    const cashIn = dateFilteredCash
      .filter((e) => e.paymentMode === "CASH" && e.type === "IN")
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const onlineIn = dateFilteredCash
      .filter((e) => e.paymentMode !== "CASH" && e.type === "IN")
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const totalSales = cashIn + onlineIn;

    const expensePaid = dateFilteredExpenses
      .filter((e) => e.type === "PAID")
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const cashOut = dateFilteredCash
      .filter((e) => e.type === "OUT")
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const totalExpense = expensePaid + cashOut;
    const netProfit = totalSales - totalExpense;

    // Build specific rows depending on report category
    let rows: Array<{
      id: string;
      title: string;
      subtitle: string;
      date: string;
      amount: number;
      isPositive: boolean;
    }> = [];

    const cat = activeReport.category;

    if (cat === "Customer") {
      rows = dateFilteredCollections.map((c) => ({
        id: c.id,
        title: c.customerName,
        subtitle: c.customerPhone ? `Mobile: ${c.customerPhone}` : "Customer Due",
        date: c.reminderDate,
        amount: c.amount,
        isPositive: c.status === "RECEIVED",
      }));
    } else if (cat === "Expense") {
      rows = dateFilteredExpenses.map((e) => ({
        id: e.id,
        title: e.category || "Business Expense",
        subtitle: `${e.paymentMode} • ${e.note || "No note"}`,
        date: e.date,
        amount: e.amount,
        isPositive: e.type === "REFUND",
      }));
    } else if (cat === "Inventory") {
      rows = catalogItems.map((item: any) => ({
        id: item.id,
        title: item.name,
        subtitle: `Stock: ${item.stockQuantity || 0} ${item.unit || "Pcs"} • Rate: ${formatCurrency(item.price || 0)}`,
        date: item.createdAt ? item.createdAt.split("T")[0] : "-",
        amount: (item.price || 0) * (item.stockQuantity || 0),
        isPositive: (item.stockQuantity || 0) > 0,
      }));
    } else {
      // Sales, GST, Day-wise
      rows = dateFilteredCash.map((e) => ({
        id: e.id,
        title: e.partyName || e.category || (e.type === "IN" ? "Sales Inflow" : "Cash Outflow"),
        subtitle: `${e.paymentMode} • ${e.note || "Entry"}`,
        date: e.date,
        amount: e.amount,
        isPositive: e.type === "IN",
      }));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          r.date.includes(q)
      );
    }

    return {
      totalSales,
      cashIn,
      onlineIn,
      totalExpense,
      netProfit,
      rows,
    };
  }, [activeReport, dateRange, employerId, searchQuery]);

  const filteredReports = useMemo(() => {
    if (selectedCategory === "All") return REPORT_OPTIONS;
    return REPORT_OPTIONS.filter((r) => r.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory]);

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300 w-full max-w-5xl lg:max-w-6xl mx-auto px-2 sm:px-4">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
              title="Back to Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-200" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Financial Reports
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100 font-medium">
                {companyName} • Real-time Financial Statements &amp; Audit
              </p>
            </div>
          </div>
        </div>

        {/* You'll Get vs You'll Give Balance Banner (Matching ReportsActivity.java) */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-emerald-400/30">
            <span className="text-[11px] text-emerald-200 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              You'll Get
            </span>
            <span className="text-xl font-black text-emerald-300">
              {formatCurrency(overviewTotals.youllGet)}
            </span>
            <span className="text-[10px] text-emerald-100/80 block mt-0.5">
              Pending Customer Dues
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-rose-400/30">
            <span className="text-[11px] text-rose-200 font-semibold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              You'll Give
            </span>
            <span className="text-xl font-black text-rose-300">
              {formatCurrency(overviewTotals.youllGive)}
            </span>
            <span className="text-[10px] text-rose-100/80 block mt-0.5">
              Expenses &amp; Payables
            </span>
          </div>
        </div>
      </div>

      {/* Category Chips Bar (Matching scrollReportsChips in ReportsActivity.java) */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-sm overflow-x-auto scrollbar-none flex items-center gap-2">
        {[
          { id: "All", label: "All" },
          { id: "Customer", label: "Customer" },
          { id: "GST", label: "GST" },
          { id: "Day-wise", label: "Day-wise" },
          { id: "Inventory", label: "Inventory" },
          { id: "Supplier", label: "Supplier" },
          { id: "Expense", label: "Expense" },
        ].map((chip) => {
          const isActive = selectedCategory.toLowerCase() === chip.id.toLowerCase();
          return (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                isActive
                  ? "bg-indigo-700 text-white shadow-sm scale-[1.02]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Report Options List */}
      <div className="space-y-2.5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => setActiveReport(report)}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${report.colorClass}`}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{report.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all"
                title="View Report"
              >
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <ChevronRight className="w-5 h-5 text-slate-400 sm:hidden group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Report Detail Modal (Matching ReportDetailActivity.java) */}
      {activeReport && reportData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-200" />
                <div>
                  <h3 className="font-black text-base sm:text-lg">{activeReport.title}</h3>
                  <p className="text-xs text-indigo-100">{activeReport.description}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveReport(null);
                  setSearchQuery("");
                }}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Date Filter Chips */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Duration:
                </span>
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                  {[
                    { id: "ALL", label: "All" },
                    { id: "THIS_MONTH", label: "This Month" },
                    { id: "LAST_MONTH", label: "Last Month" },
                    { id: "TODAY", label: "Today" },
                  ].map((dr) => (
                    <button
                      key={dr.id}
                      onClick={() => setDateRange(dr.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        dateRange === dr.id
                          ? "bg-indigo-700 text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {dr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real Summary KPIs */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-indigo-50 rounded-xl p-2.5 border border-indigo-100">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase block">
                    Total Inflow / Sales
                  </span>
                  <span className="text-sm sm:text-base font-black text-indigo-900">
                    {formatCurrency(reportData.totalSales)}
                  </span>
                </div>
                <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-100">
                  <span className="text-[10px] font-bold text-rose-600 uppercase block">
                    Total Expenses / Outflow
                  </span>
                  <span className="text-sm sm:text-base font-black text-rose-900">
                    {formatCurrency(reportData.totalExpense)}
                  </span>
                </div>
                <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">
                    Net Balance
                  </span>
                  <span
                    className={`text-sm sm:text-base font-black ${
                      reportData.netProfit >= 0 ? "text-emerald-900" : "text-rose-900"
                    }`}
                  >
                    {formatCurrency(reportData.netProfit)}
                  </span>
                </div>
              </div>

              {/* Search Within Report */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in report (party name or date)..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Real Transactions List or Empty State */}
              {reportData.rows.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-2xl p-6 space-y-2">
                  <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">No Records Found</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    There are no recorded transactions for the selected duration.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 flex justify-between">
                    <span>Particulars ({reportData.rows.length} entries)</span>
                    <span>Amount</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {reportData.rows.map((r) => (
                      <div
                        key={r.id}
                        className="px-3 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{r.title}</p>
                          <p className="text-[11px] text-slate-400">
                            {r.subtitle} • {r.date}
                          </p>
                        </div>
                        <span
                          className={`font-black text-sm ${
                            r.isPositive ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {r.isPositive ? "+" : "-"}
                          {formatCurrency(r.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Print / Close Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setActiveReport(null);
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-indigo-700 text-white font-bold text-xs hover:bg-indigo-800 active:scale-95 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
