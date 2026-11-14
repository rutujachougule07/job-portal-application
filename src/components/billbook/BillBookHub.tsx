import { useState } from "react";
import {
  BookOpen,
  BarChart3,
  Receipt,
  FileSpreadsheet,
  Package,
  Users,
  ShoppingBag,
  Bell,
  Smartphone,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { CashbookView } from "./CashbookView";
import { ExpensesView } from "./ExpensesView";
import { MyReportView } from "./MyReportView";
import { CollectionsListView } from "./CollectionsListView";
import { StaffManagementView } from "./StaffManagementView";
import { CashOutView } from "./CashOutView";
import { OnlineToCashView } from "./OnlineToCashView";
import { ItemsCatalogView } from "./ItemsCatalogView";
import { MyOrdersView } from "./MyOrdersView";
import { FinancialReportsView } from "./FinancialReportsView";
import { useI18n } from "@/lib/i18n";

export type BillBookScreen =
  | "hub"
  | "cashbook"
  | "my_report"
  | "expenses"
  | "financial_reports"
  | "items"
  | "staff"
  | "orders"
  | "collections"
  | "online_to_cash"
  | "cash_out";

interface BillBookHubProps {
  employerId: string;
  companyName?: string;
  onEditProfile?: () => void;
  onOpenStaff?: () => void;
}

export function BillBookHub({
  employerId,
  companyName = "Green Agro",
  onEditProfile,
}: BillBookHubProps) {
  const { lang } = useI18n();

  // Active Screen: "hub" | all 10 tile view screens
  const [activeScreen, setActiveScreen] = useState<BillBookScreen>("hub");

  // ── 1. CASHBOOK VIEW ──
  if (activeScreen === "cashbook") {
    return (
      <CashbookView
        employerId={employerId}
        companyName={companyName}
        onBack={() => setActiveScreen("hub")}
        onOpenReport={() => setActiveScreen("my_report")}
      />
    );
  }

  // ── 2. MY REPORT VIEW ──
  if (activeScreen === "my_report") {
    return (
      <MyReportView
        employerId={employerId}
        companyName={companyName}
        onBack={() => setActiveScreen("hub")}
        onOpenCashbook={() => setActiveScreen("cashbook")}
        onOpenExpenses={() => setActiveScreen("expenses")}
      />
    );
  }

  // ── 3. EXPENSES VIEW ──
  if (activeScreen === "expenses") {
    return (
      <ExpensesView
        employerId={employerId}
        companyName={companyName}
        onBack={() => setActiveScreen("hub")}
        onOpenReport={() => setActiveScreen("my_report")}
      />
    );
  }

  // ── 4. FINANCIAL REPORTS VIEW ──
  if (activeScreen === "financial_reports") {
    return (
      <FinancialReportsView
        employerId={employerId}
        companyName={companyName}
        onBack={() => setActiveScreen("hub")}
      />
    );
  }

  // ── 5. ITEMS CATALOG VIEW ──
  if (activeScreen === "items") {
    return (
      <ItemsCatalogView
        employerId={employerId}
        companyName={companyName}
        onBack={() => setActiveScreen("hub")}
      />
    );
  }

  // ── 6. STAFF MANAGEMENT VIEW ──
  if (activeScreen === "staff") {
    return (
      <StaffManagementView
        employerId={employerId}
        companyName={companyName}
        onBack={() => setActiveScreen("hub")}
      />
    );
  }

  // ── 7. MY ORDERS VIEW ──
  if (activeScreen === "orders") {
    return (
      <MyOrdersView
        employerId={employerId}
        companyName={companyName}
        onBack={() => setActiveScreen("hub")}
      />
    );
  }

  // ── 8. COLLECTIONS LIST VIEW ──
  if (activeScreen === "collections") {
    return (
      <CollectionsListView
        employerId={employerId}
        companyName={companyName}
        onBack={() => setActiveScreen("hub")}
        onOpenCashbook={() => setActiveScreen("cashbook")}
      />
    );
  }

  // ── 9. ONLINE TO CASH VIEW ──
  if (activeScreen === "online_to_cash") {
    return (
      <OnlineToCashView
        employerId={employerId}
        companyName={companyName}
        onBack={() => setActiveScreen("hub")}
      />
    );
  }

  // ── 10. CASH OUT VIEW ──
  if (activeScreen === "cash_out") {
    return (
      <CashOutView
        employerId={employerId}
        companyName={companyName}
        onBack={() => setActiveScreen("hub")}
      />
    );
  }

  // Initials for avatar
  const initials = (companyName || "Green Agro")
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0] : ""))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "GA";

  return (
    <div className="w-full max-w-5xl lg:max-w-6xl mx-auto space-y-5 pb-8 text-slate-800 animate-in fade-in duration-200 px-2 sm:px-4">
      {/* ── TOP BLUE APP CARD (Cleanly rounded, fills comfortable width) ── */}
      <div className="bg-gradient-to-r from-[#0055B3] via-[#0066CC] to-[#0A84FF] text-white px-5 sm:px-6 py-3.5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* White rectangle shop icon */}
          <div className="size-5 bg-white rounded-md flex items-center justify-center shadow-2xs">
            <div className="size-2.5 bg-[#0066CC] rounded-xs" />
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-1.5">
            {companyName}
            <ChevronDown className="size-4 opacity-80" />
          </span>
        </div>

        <div className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full border border-white/25 backdrop-blur-xs">
          Reports & Ledger
        </div>
      </div>

      <div className="space-y-4">
        {/* ── SHOP PROFILE CARD WITH CIRCULAR AVATAR & EDIT BUTTON ── */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Circular Blue Avatar */}
            <div className="size-13 sm:size-14 rounded-2xl bg-[#0055B3] text-white font-extrabold text-lg flex items-center justify-center shadow-sm border-2 border-white shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                {companyName}
              </h2>
              <span className="text-xs font-medium text-slate-500">
                Official Merchant Register
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditProfile}
            className="px-5 py-2 rounded-xl border border-[#0055B3] text-[#0055B3] hover:bg-[#0055B3]/5 active:scale-95 text-xs font-black tracking-wide font-mono transition-all cursor-pointer shadow-2xs"
          >
            EDIT
          </button>
        </div>

        {/* ── 10 TILES RESPONSIVE GRID (2 cols on mobile, 3 on tablet, 5 on desktop) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pt-1">
          {/* TILE 1: Cashbook */}
          <div
            onClick={() => setActiveScreen("cashbook")}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0066CC]/40 transition-all flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 group"
          >
            <div className="size-12 sm:size-14 rounded-2xl bg-[#EBF3FF] flex items-center justify-center text-[#0066CC] group-hover:scale-110 transition-transform shadow-2xs">
              <BookOpen className="size-6 sm:size-7 text-[#0066CC]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                Cashbook
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Daily In & Out Cash
              </span>
            </div>
          </div>

          {/* TILE 2: My Report */}
          <div
            onClick={() => setActiveScreen("my_report")}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#E53E3E]/40 transition-all flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 group"
          >
            <div className="size-12 sm:size-14 rounded-2xl bg-[#FEECEC] flex items-center justify-center text-[#E53E3E] group-hover:scale-110 transition-transform shadow-2xs">
              <BarChart3 className="size-6 sm:size-7 text-[#E53E3E]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                My Report
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Financial Statement
              </span>
            </div>
          </div>

          {/* TILE 3: Expenses */}
          <div
            onClick={() => setActiveScreen("expenses")}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#D97706]/40 transition-all flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 group"
          >
            <div className="size-12 sm:size-14 rounded-2xl bg-[#FEF6E6] flex items-center justify-center text-[#D97706] group-hover:scale-110 transition-transform shadow-2xs">
              <Receipt className="size-6 sm:size-7 text-[#D97706]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                Expenses
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Daily Spending
              </span>
            </div>
          </div>

          {/* TILE 4: Financial Reports */}
          <div
            onClick={() => setActiveScreen("financial_reports")}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#9333EA]/40 transition-all flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 group"
          >
            <div className="size-12 sm:size-14 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#9333EA] group-hover:scale-110 transition-transform shadow-2xs">
              <FileSpreadsheet className="size-6 sm:size-7 text-[#9333EA]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                Financial Reports
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                GST, Sales & P&L
              </span>
            </div>
          </div>

          {/* TILE 5: Items */}
          <div
            onClick={() => setActiveScreen("items")}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#10B981]/40 transition-all flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 group"
          >
            <div className="size-12 sm:size-14 rounded-2xl bg-[#E6F8F3] flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform shadow-2xs">
              <Package className="size-6 sm:size-7 text-[#10B981]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                Items
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Stock & Products
              </span>
            </div>
          </div>

          {/* TILE 6: Staff */}
          <div
            onClick={() => setActiveScreen("staff")}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0284C7]/40 transition-all flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 group"
          >
            <div className="size-12 sm:size-14 rounded-2xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] group-hover:scale-110 transition-transform shadow-2xs">
              <Users className="size-6 sm:size-7 text-[#0284C7]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                Staff
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Attendance & Payroll
              </span>
            </div>
          </div>

          {/* TILE 7: My Order */}
          <div
            onClick={() => setActiveScreen("orders")}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#DB2777]/40 transition-all flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 group"
          >
            <div className="size-12 sm:size-14 rounded-2xl bg-[#FCE7F3] flex items-center justify-center text-[#DB2777] group-hover:scale-110 transition-transform shadow-2xs">
              <ShoppingBag className="size-6 sm:size-7 text-[#DB2777]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                My Order
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Sales & Invoicing
              </span>
            </div>
          </div>

          {/* TILE 8: Collections List */}
          <div
            onClick={() => setActiveScreen("collections")}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#D97706]/40 transition-all flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 group"
          >
            <div className="size-12 sm:size-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] group-hover:scale-110 transition-transform shadow-2xs">
              <Bell className="size-6 sm:size-7 text-[#D97706]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                Collections List
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Customer Dues
              </span>
            </div>
          </div>

          {/* TILE 9: Online to Cash */}
          <div
            onClick={() => setActiveScreen("online_to_cash")}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0284C7]/40 transition-all flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 group"
          >
            <div className="size-12 sm:size-14 rounded-2xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] group-hover:scale-110 transition-transform shadow-2xs">
              <Smartphone className="size-6 sm:size-7 text-[#0284C7]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                Online to Cash
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                Bank to Cash Draw
              </span>
            </div>
          </div>

          {/* TILE 10: Cash Out */}
          <div className="sm:col-start-2 lg:col-start-auto">
            <div
              onClick={() => setActiveScreen("cash_out")}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#E11D48]/40 transition-all flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 group h-full"
            >
              <div className="size-12 sm:size-14 rounded-2xl bg-[#FFE4E6] flex items-center justify-center text-[#E11D48] group-hover:scale-110 transition-transform shadow-2xs">
                <LogOut className="size-6 sm:size-7 text-[#E11D48]" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                  Cash Out
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  Counter Drawings
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
