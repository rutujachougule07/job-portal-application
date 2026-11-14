import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  Printer,
  FileSpreadsheet,
  Download,
  Filter,
  Wallet,
  CreditCard,
  Receipt,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  FileText
} from "lucide-react";
import { dataStore, CashbookEntry, ExpenseEntry } from "@/lib/data-store";
import { toast } from "sonner";

interface MyReportViewProps {
  employerId: string;
  companyName?: string;
  onBack: () => void;
  onOpenCashbook?: () => void;
  onOpenExpenses?: () => void;
}

type DateRangeFilter = "TODAY" | "YESTERDAY" | "THIS_MONTH" | "LAST_MONTH" | "ALL_TIME" | "CUSTOM";

export function MyReportView({
  employerId,
  companyName = "Green Agro",
  onBack,
  onOpenCashbook,
  onOpenExpenses
}: MyReportViewProps) {
  // Date Filter State
  const [rangeFilter, setRangeFilter] = useState<DateRangeFilter>("THIS_MONTH");
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split("T")[0]!;
  });
  const [customEndDate, setCustomEndDate] = useState(() => new Date().toISOString().split("T")[0]!);

  // Active Detail Tab: "ALL" | "CASH" | "ONLINE" | "EXPENSES"
  const [activeTab, setActiveTab] = useState<"ALL" | "CASH" | "ONLINE" | "EXPENSES">("ALL");

  // Calculate start & end bounds for the filter
  const { startBound, endBound, label: rangeLabel } = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (rangeFilter === "TODAY") {
      const today = fmt(now);
      return { startBound: today, endBound: today, label: "Today's Report" };
    }

    if (rangeFilter === "YESTERDAY") {
      const y = new Date();
      y.setDate(now.getDate() - 1);
      const yStr = fmt(y);
      return { startBound: yStr, endBound: yStr, label: "Yesterday's Report" };
    }

    if (rangeFilter === "THIS_MONTH") {
      const start = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
      const end = fmt(now);
      return { startBound: start, endBound: end, label: "This Month" };
    }

    if (rangeFilter === "LAST_MONTH") {
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endLastMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        startBound: fmt(lastMonthDate),
        endBound: fmt(endLastMonthDate),
        label: "Last Month"
      };
    }

    if (rangeFilter === "CUSTOM") {
      return {
        startBound: customStartDate,
        endBound: customEndDate,
        label: `${customStartDate} to ${customEndDate}`
      };
    }

    return { startBound: "", endBound: "", label: "All Time" };
  }, [rangeFilter, customStartDate, customEndDate]);

  // Fetch Cashbook Entries filtered by date (100% Real)
  const filteredCashbook = useMemo(() => {
    const all = dataStore.getCashbookEntries(employerId);
    if (!startBound || !endBound) return all;
    return all.filter((e) => {
      if (!e.date) return false;
      return e.date >= startBound && e.date <= endBound;
    });
  }, [employerId, startBound, endBound]);

  // Fetch Expense Entries filtered by date (100% Real)
  const filteredExpenses = useMemo(() => {
    const all = dataStore.getExpenseEntries(employerId);
    if (!startBound || !endBound) return all;
    return all.filter((e) => {
      if (!e.date) return false;
      return e.date >= startBound && e.date <= endBound;
    });
  }, [employerId, startBound, endBound]);

  // Calculate Math Tally (matching MyReportActivity.java - 100% Real)
  const tally = useMemo(() => {
    let cashIn = 0;
    let cashOut = 0;
    let onlineIn = 0;
    let onlineOut = 0;

    filteredCashbook.forEach((e) => {
      const amt = Number(e.amount) || 0;
      if (e.paymentMode === "CASH") {
        if (e.type === "IN") cashIn += amt;
        else cashOut += amt;
      } else {
        if (e.type === "IN") onlineIn += amt;
        else onlineOut += amt;
      }
    });

    let expensePaid = 0;
    let expenseRefund = 0;
    filteredExpenses.forEach((e) => {
      const amt = Number(e.amount) || 0;
      if (e.type === "PAID") expensePaid += amt;
      else expenseRefund += amt;
    });

    const netExpense = expensePaid - expenseRefund;
    const cashBalance = cashIn - cashOut;
    const onlineBalance = onlineIn - onlineOut;
    const totalInflow = cashIn + onlineIn;
    const totalOutflow = cashOut + onlineOut;
    const grandNetTally = totalInflow - totalOutflow - netExpense;

    return {
      cashIn,
      cashOut,
      cashBalance,
      onlineIn,
      onlineOut,
      onlineBalance,
      expensePaid,
      expenseRefund,
      netExpense,
      totalInflow,
      totalOutflow,
      grandNetTally
    };
  }, [filteredCashbook, filteredExpenses]);

  // Print Statement Handler
  const handlePrintStatement = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked, please allow popups to print report");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Financial Report - ${companyName}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111; }
          .header { text-align: center; border-bottom: 2px solid #0066CC; padding-bottom: 12px; margin-bottom: 20px; }
          .header h1 { margin: 0; color: #0066CC; font-size: 24px; }
          .header p { margin: 4px 0 0 0; color: #555; font-size: 13px; }
          .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
          .card { border: 1px solid #ddd; padding: 12px; border-radius: 8px; background: #fafafa; }
          .card h4 { margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #666; }
          .card .val { font-size: 18px; font-weight: bold; }
          .green { color: #059669; }
          .red { color: #E11D48; }
          .blue { color: #0066CC; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; }
          .text-right { text-align: right; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${companyName}</h1>
          <p>Financial Statement (${rangeLabel})</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <div class="summary-grid">
          <div class="card">
            <h4>Cash Balance</h4>
            <div class="val blue">₹${tally.cashBalance.toLocaleString("en-IN")}</div>
            <small>In: ₹${tally.cashIn} | Out: ₹${tally.cashOut}</small>
          </div>
          <div class="card">
            <h4>Online Balance</h4>
            <div class="val blue">₹${tally.onlineBalance.toLocaleString("en-IN")}</div>
            <small>In: ₹${tally.onlineIn} | Out: ₹${tally.onlineOut}</small>
          </div>
          <div class="card">
            <h4>Net Expenses</h4>
            <div class="val red">₹${tally.netExpense.toLocaleString("en-IN")}</div>
            <small>Paid: ₹${tally.expensePaid}</small>
          </div>
          <div class="card" style="border: 2px solid #0066CC; background: #eff6ff;">
            <h4>Net Grand Total</h4>
            <div class="val ${tally.grandNetTally >= 0 ? "green" : "red"}">₹${tally.grandNetTally.toLocaleString("en-IN")}</div>
            <small>Final Tally</small>
          </div>
        </div>

        <h3>Transaction Details (${filteredCashbook.length + filteredExpenses.length} Records)</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category / Party</th>
              <th>Mode</th>
              <th>Type</th>
              <th>Remarks</th>
              <th class="text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${filteredCashbook.map(c => `
              <tr>
                <td>${c.date}</td>
                <td><strong>${c.partyName || c.category}</strong></td>
                <td>${c.paymentMode}</td>
                <td style="color: ${c.type === "IN" ? "#059669" : "#E11D48"}; font-weight: bold;">CASHBOOK ${c.type}</td>
                <td>${c.note || "-"}</td>
                <td class="text-right" style="color: ${c.type === "IN" ? "#059669" : "#E11D48"}; font-weight: bold;">
                  ${c.type === "IN" ? "+" : "-"} ₹${c.amount.toLocaleString("en-IN")}
                </td>
              </tr>
            `).join("")}
            ${filteredExpenses.map(e => `
              <tr>
                <td>${e.date}</td>
                <td><strong>${e.category}</strong></td>
                <td>${e.paymentMode}</td>
                <td style="color: ${e.type === "PAID" ? "#E11D48" : "#059669"}; font-weight: bold;">EXPENSE ${e.type}</td>
                <td>${e.note || "-"}</td>
                <td class="text-right" style="color: ${e.type === "PAID" ? "#E11D48" : "#059669"}; font-weight: bold;">
                  ${e.type === "PAID" ? "-" : "+"} ₹${e.amount.toLocaleString("en-IN")}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <div>Verified By: ___________________</div>
          <div>Authorized Signature: ___________________</div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="w-full max-w-5xl lg:max-w-6xl mx-auto space-y-4 pb-8 text-[#0A2540] px-2 sm:px-4">
      {/* ── TOP BLUE APP BAR ── */}
      <div className="bg-gradient-to-r from-[#0055B3] to-[#0066CC] text-white px-4 py-3 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
            title="Back to Hub"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">
              My Financial Report
            </h1>
            <p className="text-[11px] text-white/80 font-medium">
              {rangeLabel} • {companyName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintStatement}
            className="px-3 py-1.5 rounded-xl bg-white text-[#0066CC] hover:bg-white/90 font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Print or Export PDF"
          >
            <Printer className="size-4" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* ── DATE FILTER TABS ── */}
        <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-slate-200">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
            <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
              <Calendar className="size-3.5" />
              Period:
            </span>
            {(
              [
                { id: "TODAY", label: "Today" },
                { id: "YESTERDAY", label: "Yesterday" },
                { id: "THIS_MONTH", label: "This Month" },
                { id: "LAST_MONTH", label: "Last Month" },
                { id: "ALL_TIME", label: "All Time" },
                { id: "CUSTOM", label: "Custom Date" }
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRangeFilter(item.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                  rangeFilter === item.id
                    ? "bg-[#0066CC] text-white font-black shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Custom Date Pickers */}
          {rangeFilter === "CUSTOM" && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-bold">From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-bold">To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── 4 SUMMARY TALLY CARDS (2x2 Grid) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Card 1: Cash Balance */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cash In Hand
              </span>
              <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Wallet className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                ₹{tally.cashBalance.toLocaleString("en-IN")}
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold mt-1 pt-1 border-t border-slate-100">
                <span className="text-emerald-600 font-bold">In: ₹{tally.cashIn}</span>
                <span className="text-rose-600 font-bold">Out: ₹{tally.cashOut}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Online Balance */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Online / Bank
              </span>
              <div className="size-8 rounded-xl bg-blue-50 text-[#0066CC] flex items-center justify-center">
                <CreditCard className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                ₹{tally.onlineBalance.toLocaleString("en-IN")}
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold mt-1 pt-1 border-t border-slate-100">
                <span className="text-emerald-600 font-bold">In: ₹{tally.onlineIn}</span>
                <span className="text-rose-600 font-bold">Out: ₹{tally.onlineOut}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Net Expenses */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Net Expenses
              </span>
              <div className="size-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Receipt className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black text-rose-600">
                ₹{tally.netExpense.toLocaleString("en-IN")}
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold mt-1 pt-1 border-t border-slate-100">
                <span className="text-rose-600 font-bold">Paid: ₹{tally.expensePaid}</span>
                <span className="text-emerald-600 font-bold">Ref: ₹{tally.expenseRefund}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Net Grand Total (Business Tally) */}
          <div className="bg-gradient-to-br from-[#063B78] to-[#0A4F9E] text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Grand Net Tally
              </span>
              <div className="size-8 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center">
                <TrendingUp className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black text-white">
                ₹{tally.grandNetTally.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-slate-200 mt-1">
                Cash + Bank - Expenses
              </p>
            </div>
          </div>
        </div>

        {/* ── DETAIL TABS BAR ── */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              { id: "ALL", label: "All Records", count: filteredCashbook.length + filteredExpenses.length },
              { id: "CASH", label: "Cashbook Cash", count: filteredCashbook.filter(c => c.paymentMode === "CASH").length },
              { id: "ONLINE", label: "Cashbook Online", count: filteredCashbook.filter(c => c.paymentMode === "ONLINE").length },
              { id: "EXPENSES", label: "Expenses", count: filteredExpenses.length }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-[#063B78] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === t.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── TRANSACTIONS LIST ── */}
        <div className="space-y-2">
          {(() => {
            let items: Array<{
              id: string;
              date: string;
              title: string;
              subtitle?: string | undefined;
              mode: string;
              badge: string;
              amount: number;
              isIn: boolean;
            }> = [];

            if (activeTab === "ALL" || activeTab === "CASH") {
              filteredCashbook
                .filter((c) => activeTab === "ALL" || c.paymentMode === "CASH")
                .forEach((c) => {
                  items.push({
                    id: c.id,
                    date: c.date,
                    title: c.partyName || c.category,
                    subtitle: c.note || undefined,
                    mode: c.paymentMode,
                    badge: `CASHBOOK ${c.type}`,
                    amount: c.amount,
                    isIn: c.type === "IN"
                  });
                });
            }

            if (activeTab === "ALL" || activeTab === "ONLINE") {
              filteredCashbook
                .filter((c) => activeTab === "ONLINE" && c.paymentMode === "ONLINE")
                .forEach((c) => {
                  items.push({
                    id: c.id,
                    date: c.date,
                    title: c.partyName || c.category,
                    subtitle: c.note || undefined,
                    mode: c.paymentMode,
                    badge: `CASHBOOK ${c.type}`,
                    amount: c.amount,
                    isIn: c.type === "IN"
                  });
                });
            }

            if (activeTab === "ALL" || activeTab === "EXPENSES") {
              filteredExpenses.forEach((e) => {
                items.push({
                  id: e.id,
                  date: e.date,
                  title: e.category,
                  subtitle: e.note || undefined,
                  mode: e.paymentMode,
                  badge: `EXPENSE ${e.type}`,
                  amount: e.amount,
                  isIn: e.type === "REFUND"
                });
              });
            }

            // Sort newest first
            items.sort((a, b) => (b.date > a.date ? 1 : -1));

            if (items.length === 0) {
              return (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
                  <div className="size-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <FileText className="size-7" />
                  </div>
                  <h3 className="text-sm font-black text-slate-700">
                    No transactions found in this period
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add entries in Cashbook or Expenses to view your report.
                  </p>
                </div>
              );
            }

            return items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`size-10 rounded-2xl flex items-center justify-center font-black shrink-0 ${
                      item.isIn ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {item.isIn ? <ArrowDownLeft className="size-5" /> : <ArrowUpRight className="size-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-[#0066CC]">
                        {item.mode}
                      </span>
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      {item.date}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm sm:text-base font-black ${
                      item.isIn ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {item.isIn ? "+" : "-"} ₹{item.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
