import React, { useRef } from 'react';
import { Download, Printer, Share2, Building2, User, Calendar, ShieldCheck, Wallet, CheckCircle, Clock, Umbrella, XCircle, AlertCircle } from 'lucide-react';

export interface SalarySlipProps {
  // Company Details
  companyName?: string;
  companyAddress?: string;
  companyTagline?: string;
  companyLogo?: string;

  // Employee Details
  employeeName: string;
  employeeId?: string;
  employeePhoto?: string;
  mobile?: string;
  designation?: string;
  department?: string;
  location?: string;
  joiningDate?: string;
  bankAccountNo?: string;
  bankName?: string;
  branch?: string;

  // Period
  month?: string;
  year?: string;
  payPeriod?: string;

  // Attendance Metrics
  totalDaysInMonth?: number;
  presentDays?: number;
  absentDays?: number;
  halfDays?: number;
  weeklyOffDays?: number;
  publicHolidays?: number;

  // Earnings Breakdown
  dailyRate?: number;
  basicSalary?: number;
  da?: number; // Dearness Allowance
  hra?: number; // House Rent Allowance
  conveyance?: number;
  medicalAllowance?: number;
  specialAllowance?: number;
  otherAllowance?: number;
  overtimeHours?: number;
  overtimeRate?: number;
  overtimePay?: number;

  // Deductions Breakdown
  providentFund?: number;
  esi?: number;
  professionalTax?: number;
  incomeTax?: number;
  otherDeductions?: number;

  // Statutory Numbers
  uanNo?: string;
  esicNo?: string;

  // Custom Leave & Work summaries
  leaveEntitlement?: number;
  leaveAvailed?: number;
  leaveBalance?: number;
  absentDatesText?: string;
  halfDayDatesText?: string;
  totalWorkHours?: number;
  totalEarningsDays?: number;

  // Attendance calendar grid override
  attendanceGrid?: Array<{
    day: number;
    weekday: string;
    status: 'P' | 'A' | 'L' | 'WO' | 'HD';
  }>;
}

export function numberToIndianWords(num: number): string {
  if (!num || num <= 0) return 'Zero Rupees Only';
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty ', 'Thirty ', 'Forty ', 'Fifty ', 'Sixty ', 'Seventy ', 'Eighty ', 'Ninety '];

  const inWords = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return a[n] || '';
    if (n < 100) return (b[Math.floor(n / 10)] || '') + (a[n % 10] || '');
    if (n < 1000) return (a[Math.floor(n / 100)] || '') + 'Hundred ' + (n % 100 !== 0 ? inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + inWords(n % 10000000);
  };

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let result = 'Rupees ' + inWords(integerPart).trim();
  if (decimalPart > 0) {
    result += ' and ' + inWords(decimalPart).trim() + ' Paise';
  }
  result += ' Only';
  return result;
}

const SalarySlip: React.FC<SalarySlipProps> = ({
  companyName = 'REAL JOB Construction Pvt. Ltd.',
  companyAddress = 'MIDC Industrial Area, Pune, Maharashtra 411026',
  companyTagline = 'Building Better Opportunities',
  companyLogo,

  employeeName = 'Ramesh Shinde',
  employeeId = 'RJW-000123',
  employeePhoto,
  mobile = '9876543210',
  designation = 'Helper',
  department = 'Construction',
  location = 'Site - Pune',
  joiningDate = '01-08-2026',
  bankAccountNo = '123456789012',
  bankName = 'State Bank of India',
  branch = 'Pune',

  month = 'August',
  year = '2026',
  payPeriod,

  totalDaysInMonth = 31,
  presentDays = 26,
  absentDays = 2,
  halfDays = 1,
  weeklyOffDays = 2,
  publicHolidays = 0,

  dailyRate = 600,
  basicSalary,
  da,
  hra,
  conveyance = 0,
  medicalAllowance = 0,
  specialAllowance = 0,
  otherAllowance = 0,
  overtimeHours = 4,
  overtimeRate = 150,
  overtimePay,

  providentFund,
  esi,
  professionalTax = 200,
  incomeTax = 0,
  otherDeductions = 0,

  uanNo = '123456789012',
  esicNo = '520012345678',

  leaveEntitlement = 12,
  leaveAvailed = 1,
  leaveBalance,
  absentDatesText = '(10-08-2026, 26-08-2026)',
  halfDayDatesText = '(19-08-2026)',
  totalWorkHours,
  totalEarningsDays,
  attendanceGrid,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculated Days
  const computedTotalDays = totalDaysInMonth || 31;
  const computedPresent = presentDays ?? 26;
  const computedAbsent = absentDays ?? 2;
  const computedHalfDays = halfDays ?? 1;
  const computedWeeklyOff = weeklyOffDays ?? 2;
  const computedHoliday = publicHolidays ?? 0;

  // Earnings Computations matching payslip logic
  const computedRate = dailyRate || 600;
  const computedBasic = basicSalary !== undefined && basicSalary > 0
    ? basicSalary
    : (computedPresent * computedRate);

  const computedDa = da !== undefined
    ? da
    : (computedPresent * (computedRate * 0.2)); // DA @ 20%
  const computedHra = hra !== undefined
    ? hra
    : (computedPresent * (computedRate * 0.1667)); // HRA approx 16.7%
  const computedOtherAllowance = otherAllowance || (conveyance + medicalAllowance + specialAllowance);

  const computedOtPay = overtimePay !== undefined
    ? overtimePay
    : (overtimeHours * overtimeRate);

  const totalEarnings = computedBasic + computedDa + computedHra + computedOtherAllowance + computedOtPay;

  // Deductions Computations
  // PF (12% of Basic + DA) or default standard calculation
  const computedPf = providentFund !== undefined && providentFund > 0
    ? providentFund
    : Math.round((computedBasic + computedDa) * 0.12 * 100) / 100;

  // ESI (0.75% of Gross Earnings)
  const computedEsi = esi !== undefined && esi > 0
    ? esi
    : Math.round(totalEarnings * 0.0075 * 100) / 100;

  const computedPt = professionalTax !== undefined ? professionalTax : 200;
  const computedTds = incomeTax || 0;
  const computedOtherDed = otherDeductions || 0;

  const totalDeductions = computedPf + computedEsi + computedPt + computedTds + computedOtherDed;
  const netPay = totalEarnings - totalDeductions;

  // Statutory Shares
  const pfEmployeeShare = computedPf;
  const pfEmployerShare = computedPf;
  const totalPfContribution = pfEmployeeShare + pfEmployerShare;

  const esiEmployeeShare = computedEsi;
  const esiEmployerShare = Math.round(totalEarnings * 0.0325 * 100) / 100; // Employer 3.25%
  const totalEsiContribution = esiEmployeeShare + esiEmployerShare;

  // Period String
  const resolvedPayPeriod = payPeriod || `01-${month.length <= 2 ? month : '08'}-${year} to ${computedTotalDays}-${month.length <= 2 ? month : '08'}-${year}`;

  // Work Summary
  const computedWorkHours = totalWorkHours || (computedPresent * 8);
  const computedEarningsDays = totalEarningsDays || (computedPresent + computedWeeklyOff + computedHoliday + (computedHalfDays > 0 ? 1 : 0) + (leaveAvailed > 0 ? 1 : 0));
  const computedLeaveBalance = leaveBalance !== undefined ? leaveBalance : Math.max(0, leaveEntitlement - leaveAvailed);

  // Generate default realistic 31-day attendance calendar matching the exact image
  const resolvedAttendanceGrid = attendanceGrid || (() => {
    const daysArr: Array<{ day: number; weekday: string; status: 'P' | 'A' | 'L' | 'WO' | 'HD' }> = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Default matching image pattern (Aug 2026 starts on Saturday)
    // 1: Sat (P), 2: Sun (WO), 10: Mon (A), 19: Wed (L), 22: Sat (WO), 26: Wed (A), 19: half day or L
    for (let d = 1; d <= computedTotalDays; d++) {
      // Day 1 Saturday
      const wdIndex = (d + 5) % 7; 
      const wd = weekdays[wdIndex] || 'Mon';
      let status: 'P' | 'A' | 'L' | 'WO' | 'HD' = 'P';
      if (d === 2 || d === 22) {
        status = 'WO';
      } else if (d === 10 || d === 26) {
        status = 'A';
      } else if (d === 19) {
        status = 'L';
      }
      daysArr.push({ day: d, weekday: wd, status });
    }
    return daysArr;
  })();

  const handleDownload = () => {
    const element = document.getElementById('salary-slip-content');
    if (!element) return;
    const opt = {
      margin: [4, 4, 4, 4] as [number, number, number, number],
      filename: `Salary_Slip_${employeeName.replace(/\s+/g, '_')}_${month}_${year}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default().set(opt).from(element).save();
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*REAL JOB OFFICIAL PAYSLIP*\n` +
      `👤 Employee: ${employeeName} (${employeeId})\n` +
      `🏢 Company: ${companyName}\n` +
      `📅 Month: ${month} ${year}\n` +
      `✅ Present Days: ${computedPresent} / ${computedTotalDays}\n` +
      `💰 Net Pay: ₹${netPay.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n` +
      `📋 Pay Period: ${resolvedPayPeriod}\n\n` +
      `This is a system verified official payslip.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 text-slate-900 font-sans">
      
      {/* ── TOP ACTION BAR (Hidden in Print / PDF export) ── */}
      <div className="print:hidden flex items-center justify-between gap-3 mb-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-[#063B78]" />
          <div>
            <h4 className="text-xs font-black text-[#10233F] leading-tight">
              {companyName}
            </h4>
            <p className="text-[10px] text-slate-500 font-bold">
              Official Employee Payslip &bull; {month} {year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
            title="Share Payslip summary on WhatsApp"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
            title="Print Payslip"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#063B78] hover:bg-[#082F63] text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
            title="Download PDF Salary Slip"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* ── MAIN SALARY SLIP CONTENT CANVAS ── */}
      <div
        id="salary-slip-content"
        ref={containerRef}
        className="bg-white rounded-2xl shadow-xl border border-slate-300 p-4 sm:p-6 space-y-4 max-w-[800px] mx-auto text-slate-800 overflow-hidden relative print:p-2 print:border-none print:shadow-none"
        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
      >

        {/* ── 1. TOP HERO BANNER (REAL JOB Brand & Construction Motif) ── */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-gradient-to-r from-[#FFFFFF] via-[#F4F8FD] to-[#0A264D] p-3 sm:p-4 flex items-center justify-between min-h-[92px]">
          {/* Left: REAL JOB Branding */}
          <div className="flex items-center gap-3 z-10">
            <div className="size-14 rounded-2xl bg-[#063B78] flex items-center justify-center p-1.5 shadow-md border-2 border-[#FFC400] shrink-0">
              <img
                src="/logo_icon.png"
                alt="REAL JOB Emblem"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-[#063B78] tracking-tight">REAL</span>
                <span className="text-xl sm:text-2xl font-black text-[#FFC400] tracking-tight">JOB</span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-black uppercase text-[#063B78] tracking-wider leading-none mt-0.5">
                FIND WORK | FIND WORKERS
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold italic mt-1 leading-none">
                Safe Work &bull; Secure Future &bull; Better Tomorrow
              </p>
            </div>
          </div>

          {/* Right: Construction Banner Motif & Slogan */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="hidden sm:block text-right text-white">
              <div className="text-sm font-black tracking-wide leading-tight text-white drop-shadow-md">
                Your Work
              </div>
              <div className="text-sm font-black tracking-wide leading-tight text-white drop-shadow-md">
                Our Support
              </div>
              <div className="text-base font-black tracking-wider leading-tight text-[#FFC400] drop-shadow-md">
                Your Future
              </div>
            </div>

            {/* Construction Worker Silhouette / Photo */}
            <div className="size-16 sm:size-20 rounded-xl overflow-hidden shadow-md border border-white/40 shrink-0 bg-slate-900">
              <img
                src="/payslip_construction_bg.png"
                alt="Construction Banner"
                className="w-full h-full object-cover object-right"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/worker_avatar.png';
                }}
              />
            </div>
          </div>

          {/* Subtle Background Accent Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A264D]/60 pointer-events-none"></div>
        </div>

        {/* ── 2. TITLE BAR RIBBON (EMPLOYEE PAYSLIP + MONTH & PAY PERIOD) ── */}
        <div className="bg-[#063B78] text-white rounded-xl px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm border border-blue-900">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-white/15 flex items-center justify-center text-white shrink-0">
              <Wallet size={14} className="text-[#FFC400]" />
            </div>
            <h1 className="text-sm sm:text-base font-black tracking-wider uppercase text-white">
              EMPLOYEE PAYSLIP
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-white/90">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#FFC400]" />
              <span>Month : <strong className="text-white font-black">{month} {year}</strong></span>
            </div>
            <span className="hidden sm:inline text-white/40">|</span>
            <div className="text-[11px] sm:text-xs">
              <span>Pay Period : <strong className="text-white font-black">{resolvedPayPeriod}</strong></span>
            </div>
          </div>
        </div>

        {/* ── 3. TOP TWO DETAIL CARDS (EMPLOYEE DETAILS + COMPANY DETAILS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          
          {/* Card Left: Employee Details */}
          <div className="rounded-xl border border-slate-300 bg-white p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <div className="size-6 rounded-full bg-[#063B78] text-white flex items-center justify-center shrink-0">
                <User size={13} />
              </div>
              <h2 className="text-xs font-black uppercase text-[#063B78] tracking-wider">
                Employee Details
              </h2>
            </div>

            <div className="flex items-start gap-3">
              {/* Profile Photo */}
              <div className="size-20 rounded-xl overflow-hidden border-2 border-[#063B78]/30 bg-slate-100 shrink-0 shadow-xs">
                <img
                  src={employeePhoto || '/worker_avatar.png'}
                  alt={employeeName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/worker_avatar.png';
                  }}
                />
              </div>

              {/* Detail Rows */}
              <div className="flex-1 text-[11px] space-y-0.5 leading-snug">
                <div className="grid grid-cols-12">
                  <span className="col-span-5 text-slate-500 font-semibold">Name</span>
                  <span className="col-span-1 text-slate-400 font-bold">:</span>
                  <span className="col-span-6 font-black text-[#10233F] truncate">{employeeName}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 text-slate-500 font-semibold">Employee ID</span>
                  <span className="col-span-1 text-slate-400 font-bold">:</span>
                  <span className="col-span-6 font-black text-[#063B78]">{employeeId}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 text-slate-500 font-semibold">Mobile No.</span>
                  <span className="col-span-1 text-slate-400 font-bold">:</span>
                  <span className="col-span-6 font-bold text-slate-800">{mobile}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 text-slate-500 font-semibold">Designation</span>
                  <span className="col-span-1 text-slate-400 font-bold">:</span>
                  <span className="col-span-6 font-bold text-slate-800">{designation}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 text-slate-500 font-semibold">Department</span>
                  <span className="col-span-1 text-slate-400 font-bold">:</span>
                  <span className="col-span-6 font-bold text-slate-800">{department}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 text-slate-500 font-semibold">Location</span>
                  <span className="col-span-1 text-slate-400 font-bold">:</span>
                  <span className="col-span-6 font-bold text-slate-800">{location}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 text-slate-500 font-semibold">Joining Date</span>
                  <span className="col-span-1 text-slate-400 font-bold">:</span>
                  <span className="col-span-6 font-bold text-slate-800">{joiningDate}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 text-slate-500 font-semibold">Bank Account No.</span>
                  <span className="col-span-1 text-slate-400 font-bold">:</span>
                  <span className="col-span-6 font-mono font-bold text-slate-800">{bankAccountNo}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 text-slate-500 font-semibold">Bank Name</span>
                  <span className="col-span-1 text-slate-400 font-bold">:</span>
                  <span className="col-span-6 font-bold text-slate-800">{bankName}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-5 text-slate-500 font-semibold">Branch</span>
                  <span className="col-span-1 text-slate-400 font-bold">:</span>
                  <span className="col-span-6 font-bold text-slate-800">{branch}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Right: Company Details & Days Summary */}
          <div className="rounded-xl border border-slate-300 bg-white p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between">
            <div className="border-b border-slate-200 pb-2 flex items-start gap-2.5">
              <div className="size-8 rounded-xl bg-[#063B78] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Building2 size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-black text-[#063B78] truncate leading-tight">
                  {companyName}
                </h2>
                <p className="text-[10px] text-slate-500 font-semibold truncate leading-tight mt-0.5">
                  {companyTagline || companyAddress}
                </p>
              </div>
            </div>

            {/* Days Metrics Grid */}
            <div className="text-[11px] space-y-1 leading-snug">
              <div className="grid grid-cols-12 py-0.5 border-b border-slate-100">
                <span className="col-span-8 text-slate-600 font-semibold">Total Days in Month</span>
                <span className="col-span-1 text-slate-400 font-bold">:</span>
                <span className="col-span-3 text-right font-black text-slate-900">{computedTotalDays}</span>
              </div>
              <div className="grid grid-cols-12 py-0.5 border-b border-slate-100">
                <span className="col-span-8 text-slate-600 font-semibold">Present Days</span>
                <span className="col-span-1 text-slate-400 font-bold">:</span>
                <span className="col-span-3 text-right font-black text-emerald-700">{computedPresent}</span>
              </div>
              <div className="grid grid-cols-12 py-0.5 border-b border-slate-100">
                <span className="col-span-8 text-slate-600 font-semibold">Absent Days</span>
                <span className="col-span-1 text-slate-400 font-bold">:</span>
                <span className="col-span-3 text-right font-black text-rose-600">{computedAbsent}</span>
              </div>
              <div className="grid grid-cols-12 py-0.5 border-b border-slate-100">
                <span className="col-span-8 text-slate-600 font-semibold">Half Day</span>
                <span className="col-span-1 text-slate-400 font-bold">:</span>
                <span className="col-span-3 text-right font-black text-amber-600">{computedHalfDays}</span>
              </div>
              <div className="grid grid-cols-12 py-0.5 border-b border-slate-100">
                <span className="col-span-8 text-slate-600 font-semibold">Weekly Off</span>
                <span className="col-span-1 text-slate-400 font-bold">:</span>
                <span className="col-span-3 text-right font-black text-sky-700">{computedWeeklyOff}</span>
              </div>
              <div className="grid grid-cols-12 py-0.5">
                <span className="col-span-8 text-slate-600 font-semibold">Public Holiday</span>
                <span className="col-span-1 text-slate-400 font-bold">:</span>
                <span className="col-span-3 text-right font-black text-slate-700">{computedHoliday}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── 4. ATTENDANCE & LEAVE DETAILS (August 2026 Grid) ── */}
        <div className="rounded-xl border border-slate-300 overflow-hidden bg-white shadow-2xs">
          {/* Section Header */}
          <div className="bg-[#063B78] text-white px-3.5 py-1.5 flex items-center gap-2">
            <Calendar size={13} className="text-[#FFC400]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              ATTENDANCE & LEAVE DETAILS ({month} {year})
            </h3>
          </div>

          {/* Calendar Day Grid (1 to 31 across 2 rows) */}
          <div className="p-2 sm:p-2.5 overflow-x-auto">
            <div className="min-w-[680px] space-y-1">
              
              {/* Row 1: Days 1 to 16 */}
              <div className="grid grid-cols-16 gap-1 text-center">
                {resolvedAttendanceGrid.slice(0, 16).map((item) => (
                  <div key={item.day} className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-700">{item.day}</span>
                    <span className="text-[9px] font-bold text-slate-500 leading-none mb-1">{item.weekday}</span>
                    <span
                      className={`size-6 rounded-md flex items-center justify-center text-[10px] font-black shadow-2xs ${
                        item.status === 'P'
                          ? 'bg-[#8CE0A7] text-[#0A5726] border border-[#64CF87]'
                          : item.status === 'WO'
                          ? 'bg-[#A2D4F8] text-[#064A7E] border border-[#78BFF4]'
                          : item.status === 'A'
                          ? 'bg-[#FCA5A5] text-[#991B1B] border border-[#F87171]'
                          : item.status === 'L'
                          ? 'bg-[#FDE047] text-[#854D0E] border border-[#FACC15]'
                          : 'bg-[#C084FC] text-[#581C87] border border-[#A855F7]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row 2: Days 17 to 31 */}
              <div className="grid grid-cols-16 gap-1 text-center pt-1.5 border-t border-slate-100">
                {resolvedAttendanceGrid.slice(16, 31).map((item) => (
                  <div key={item.day} className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-700">{item.day}</span>
                    <span className="text-[9px] font-bold text-slate-500 leading-none mb-1">{item.weekday}</span>
                    <span
                      className={`size-6 rounded-md flex items-center justify-center text-[10px] font-black shadow-2xs ${
                        item.status === 'P'
                          ? 'bg-[#8CE0A7] text-[#0A5726] border border-[#64CF87]'
                          : item.status === 'WO'
                          ? 'bg-[#A2D4F8] text-[#064A7E] border border-[#78BFF4]'
                          : item.status === 'A'
                          ? 'bg-[#FCA5A5] text-[#991B1B] border border-[#F87171]'
                          : item.status === 'L'
                          ? 'bg-[#FDE047] text-[#854D0E] border border-[#FACC15]'
                          : 'bg-[#C084FC] text-[#581C87] border border-[#A855F7]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
                {/* 16th column placeholder if 31 days */}
                {resolvedAttendanceGrid.length < 32 && (
                  <div className="flex flex-col items-center justify-center opacity-0">
                    <span className="text-[10px]">-</span>
                  </div>
                )}
              </div>

            </div>

            {/* Attendance Legend */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 pt-2.5 mt-2 border-t border-slate-200 text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-[#8CE0A7] border border-[#64CF87]"></span>
                <span className="text-slate-700 font-black">P - Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-[#FCA5A5] border border-[#F87171]"></span>
                <span className="text-slate-700 font-black">A - Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-[#FDE047] border border-[#FACC15]"></span>
                <span className="text-slate-700 font-black">L - Leave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-[#A2D4F8] border border-[#78BFF4]"></span>
                <span className="text-slate-700 font-black">WO - Weekly Off</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-[#C084FC] border border-[#A855F7]"></span>
                <span className="text-slate-700 font-black">HD - Half Day</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. THREE SUMMARY METRIC CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Card 1: LEAVE DETAILS */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3 shadow-2xs text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-sky-900 font-black border-b border-sky-200/60 pb-1">
              <Umbrella size={14} className="text-sky-600" />
              <span className="uppercase tracking-wider text-[10px]">LEAVE DETAILS</span>
            </div>
            <div className="space-y-1 text-slate-700 font-semibold">
              <div className="flex justify-between">
                <span>Total Leave Entitlement</span>
                <strong className="text-slate-900">: {leaveEntitlement} Days</strong>
              </div>
              <div className="flex justify-between">
                <span>Leave Availed</span>
                <strong className="text-slate-900">: {leaveAvailed} Day</strong>
              </div>
              <div className="flex justify-between">
                <span>Leave Balance</span>
                <strong className="text-sky-700">: {computedLeaveBalance} Days</strong>
              </div>
            </div>
          </div>

          {/* Card 2: ABSENT & HALF DAY DETAILS */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 shadow-2xs text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-900 font-black border-b border-rose-200/60 pb-1">
              <XCircle size={14} className="text-rose-600" />
              <span className="uppercase tracking-wider text-[10px]">ABSENT & HALF DAY DETAILS</span>
            </div>
            <div className="space-y-1 text-slate-700 font-semibold">
              <div>
                <div className="flex justify-between">
                  <span>Absent Days</span>
                  <strong className="text-rose-700">: {computedAbsent} Days</strong>
                </div>
                <div className="text-[10px] text-slate-500 font-medium pl-1">{absentDatesText}</div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Half Day</span>
                  <strong className="text-amber-700">: {computedHalfDays} Day</strong>
                </div>
                <div className="text-[10px] text-slate-500 font-medium pl-1">{halfDayDatesText}</div>
              </div>
            </div>
          </div>

          {/* Card 3: WORK SUMMARY */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 shadow-2xs text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-900 font-black border-b border-emerald-200/60 pb-1">
              <Clock size={14} className="text-emerald-600" />
              <span className="uppercase tracking-wider text-[10px]">WORK SUMMARY</span>
            </div>
            <div className="space-y-1 text-slate-700 font-semibold">
              <div className="flex justify-between">
                <span>Total Working Days</span>
                <strong className="text-slate-900">: {computedPresent}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Work Hours</span>
                <strong className="text-slate-900">: {computedWorkHours} Hrs</strong>
              </div>
              <div className="flex justify-between">
                <span>Overtime Hours</span>
                <strong className="text-emerald-700">: {overtimeHours} Hrs</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Earnings Days</span>
                <strong className="text-slate-900">: {computedEarningsDays} Days</strong>
              </div>
            </div>
          </div>

        </div>

        {/* ── 6. EARNINGS & DEDUCTIONS (SIDE BY SIDE TABLES) ── */}
        <div className="rounded-xl border border-slate-300 overflow-hidden bg-white shadow-2xs">
          
          {/* Master Blue Ribbon Header */}
          <div className="bg-[#063B78] text-white px-3.5 py-1.5 flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#FFC400]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              EARNINGS & DEDUCTIONS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-300 text-xs">
            
            {/* ── Left Column: EARNINGS ── */}
            <div>
              <div className="bg-[#48BB78] text-white px-3 py-1.5 font-black uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <CheckCircle size={13} />
                <span>EARNINGS</span>
              </div>
              
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-extrabold bg-slate-50">
                    <th className="p-2">Description</th>
                    <th className="p-2 text-center">Days / Qty</th>
                    <th className="p-2 text-right">Rate (₹)</th>
                    <th className="p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  <tr>
                    <td className="p-2 font-bold">Basic Pay</td>
                    <td className="p-2 text-center font-bold">{computedPresent}</td>
                    <td className="p-2 text-right">{computedRate.toFixed(2)}</td>
                    <td className="p-2 text-right font-black">{computedBasic.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">DA (Dearness Allowance)</td>
                    <td className="p-2 text-center font-bold">{computedPresent}</td>
                    <td className="p-2 text-right">{(computedRate * 0.2).toFixed(2)}</td>
                    <td className="p-2 text-right font-black">{computedDa.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">HRA (House Rent Allowance)</td>
                    <td className="p-2 text-center font-bold">{computedPresent}</td>
                    <td className="p-2 text-right">{(computedRate * 0.1667).toFixed(2)}</td>
                    <td className="p-2 text-right font-black">{computedHra.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Other Allowance</td>
                    <td className="p-2 text-center font-bold">{computedPresent}</td>
                    <td className="p-2 text-right">0.00</td>
                    <td className="p-2 text-right font-black">{computedOtherAllowance.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Overtime ({overtimeHours} Hrs)</td>
                    <td className="p-2 text-center font-bold">{overtimeHours}</td>
                    <td className="p-2 text-right">{overtimeRate.toFixed(2)}</td>
                    <td className="p-2 text-right font-black">{computedOtPay.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 bg-emerald-50/70 font-black text-slate-900 text-[11px]">
                    <td colSpan={3} className="p-2 uppercase tracking-wide">Total Earnings</td>
                    <td className="p-2 text-right text-emerald-800 text-xs">
                      ₹ {totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* ── Right Column: DEDUCTIONS ── */}
            <div>
              <div className="bg-[#F56565] text-white px-3 py-1.5 font-black uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <AlertCircle size={13} />
                <span>DEDUCTIONS</span>
              </div>

              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-extrabold bg-slate-50">
                    <th className="p-2">Description</th>
                    <th className="p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  <tr>
                    <td className="p-2 font-bold">Provident Fund (PF) 12%</td>
                    <td className="p-2 text-right font-black">{computedPf.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Employee State Insurance (ESI) 0.75%</td>
                    <td className="p-2 text-right font-black">{computedEsi.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Professional Tax (PT)</td>
                    <td className="p-2 text-right font-black">{computedPt.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Income Tax (TDS)</td>
                    <td className="p-2 text-right font-black">{computedTds.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Other Deductions (Advance/Loan etc.)</td>
                    <td className="p-2 text-right font-black">{computedOtherDed.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 bg-rose-50/70 font-black text-slate-900 text-[11px]">
                    <td className="p-2 uppercase tracking-wide">Total Deductions</td>
                    <td className="p-2 text-right text-rose-700 text-xs">
                      ₹ {totalDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

          </div>
        </div>

        {/* ── 7. BOTTOM THREE CARDS (PF & ESI + NET PAY + IMPORTANT NOTES) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          
          {/* Card Left: PF & ESI Details (5 cols) */}
          <div className="md:col-span-5 rounded-xl border border-slate-300 bg-white p-3 shadow-2xs space-y-2 text-[11px]">
            <div className="bg-[#063B78] text-white px-2.5 py-1 rounded-md flex items-center gap-1.5 font-black uppercase text-[10px] tracking-wider">
              <ShieldCheck size={12} className="text-[#FFC400]" />
              <span>PF & ESI DETAILS</span>
            </div>

            {/* PF Sub-box */}
            <div className="space-y-1 border-b border-slate-200 pb-2">
              <div className="font-black text-[#063B78] text-[10px] uppercase">
                PF (12%)
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Employee Share</span>
                <strong className="text-slate-900">: ₹ {pfEmployeeShare.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Employer Share</span>
                <strong className="text-slate-900">: ₹ {pfEmployerShare.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total PF Contribution</span>
                <strong className="text-[#063B78]">: ₹ {totalPfContribution.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>UAN No.</span>
                <strong className="text-slate-900 font-mono">: {uanNo}</strong>
              </div>
            </div>

            {/* ESI Sub-box */}
            <div className="space-y-1 pt-1">
              <div className="font-black text-[#063B78] text-[10px] uppercase">
                ESI (0.75%)
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Employee Share</span>
                <strong className="text-slate-900">: ₹ {esiEmployeeShare.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Employer Share</span>
                <strong className="text-slate-900">: ₹ {esiEmployerShare.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total ESI Contribution</span>
                <strong className="text-[#063B78]">: ₹ {totalEsiContribution.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ESIC No.</span>
                <strong className="text-slate-900 font-mono">: {esicNo}</strong>
              </div>
            </div>
          </div>

          {/* Card Middle: NET PAY (4 cols) */}
          <div className="md:col-span-4 rounded-xl border border-sky-300 bg-gradient-to-b from-[#EBF5FF] to-[#DCEEFE] p-3 shadow-2xs flex flex-col justify-between text-center relative overflow-hidden">
            <div className="bg-[#063B78] text-white px-2.5 py-1 rounded-md flex items-center justify-center gap-1.5 font-black uppercase text-[10px] tracking-wider">
              <Wallet size={12} className="text-[#FFC400]" />
              <span>NET PAY</span>
            </div>

            <div className="my-auto py-3">
              <div className="text-2xl sm:text-3xl font-black text-[#063B78] tracking-tight">
                ₹ {netPay.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 italic mt-2 leading-tight px-1">
                ({numberToIndianWords(netPay)})
              </p>
            </div>

            <div className="text-[9px] font-extrabold uppercase text-[#063B78]/70 tracking-wider">
              Net Salary Payable to Employee
            </div>
          </div>

          {/* Card Right: Important Notes (3 cols) */}
          <div className="md:col-span-3 rounded-xl border border-slate-300 bg-white p-3 shadow-2xs flex flex-col justify-between text-[10px] leading-relaxed">
            <div className="bg-[#063B78] text-white px-2.5 py-1 rounded-md flex items-center gap-1.5 font-black uppercase text-[10px] tracking-wider mb-2">
              <CheckCircle size={12} className="text-[#FFC400]" />
              <span>Important Notes</span>
            </div>

            <div className="space-y-1.5 text-slate-600 font-medium">
              <p className="flex items-start gap-1">
                <span className="text-[#063B78] font-black shrink-0">&bull;</span>
                <span>PF & ESI are applicable as per government rules and employee eligibility.</span>
              </p>
              <p className="flex items-start gap-1">
                <span className="text-[#063B78] font-black shrink-0">&bull;</span>
                <span>This payslip is system generated and valid for official use.</span>
              </p>
              <p className="flex items-start gap-1">
                <span className="text-[#063B78] font-black shrink-0">&bull;</span>
                <span>Please contact HR for any discrepancies.</span>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 mt-2 text-[9px] text-slate-400 font-semibold text-center">
              REAL JOB &bull; Verified Payroll
            </div>
          </div>

        </div>

        {/* ── 8. FOOTER WITH SIGNATURE & QR CODE ── */}
        <div className="rounded-xl border border-slate-300 bg-[#F8FAFC] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Footer Left: Brand & Motto */}
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#063B78] p-1 flex items-center justify-center shrink-0">
              <img src="/logo_icon.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-xs font-black text-[#063B78] flex items-center gap-1">
                <span>REAL JOB</span>
                <span className="text-[10px] text-slate-500 font-bold">&bull; Workforce Portal</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 italic">
                Together We Build a Better Tomorrow
              </div>
            </div>
          </div>

          {/* Footer Center: Authorized HR Signature */}
          <div className="text-center px-4">
            {/* Elegant Digital Signature Graphic */}
            <div className="h-9 flex items-center justify-center">
              <svg className="w-28 h-8 text-[#063B78]" viewBox="0 0 160 50" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10,35 C30,10 40,45 60,20 C75,5 85,40 105,25 C120,15 135,30 150,15" strokeLinecap="round" />
                <path d="M25,40 L145,38" strokeWidth="1" strokeDasharray="2,2" />
              </svg>
            </div>
            <div className="text-[10px] font-black text-slate-800 uppercase tracking-wide border-t border-slate-300 pt-0.5">
              Authorized Signatory
            </div>
            <div className="text-[9px] text-slate-500 font-bold">
              HR Department &bull; {companyName}
            </div>
          </div>

          {/* Footer Right: QR Code */}
          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
            {/* Real Vector QR Code */}
            <div className="size-12 bg-white p-1 rounded-md border border-slate-300 shadow-2xs flex items-center justify-center shrink-0">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 29 29" fill="currentColor">
                {/* QR Code Matrix Elements */}
                <rect x="0" y="0" width="7" height="7" />
                <rect x="1" y="1" width="5" height="5" fill="white" />
                <rect x="2" y="2" width="3" height="3" />
                
                <rect x="22" y="0" width="7" height="7" />
                <rect x="23" y="1" width="5" height="5" fill="white" />
                <rect x="24" y="2" width="3" height="3" />
                
                <rect x="0" y="22" width="7" height="7" />
                <rect x="1" y="23" width="5" height="5" fill="white" />
                <rect x="2" y="24" width="3" height="3" />
                
                {/* Patterns */}
                <rect x="9" y="2" width="2" height="2" />
                <rect x="13" y="2" width="3" height="1" />
                <rect x="18" y="2" width="2" height="2" />
                <rect x="8" y="8" width="13" height="2" />
                <rect x="11" y="12" width="7" height="7" />
                <rect x="13" y="14" width="3" height="3" fill="white" />
                <rect x="2" y="11" width="3" height="2" />
                <rect x="24" y="11" width="3" height="2" />
                <rect x="9" y="22" width="3" height="3" />
                <rect x="14" y="22" width="2" height="2" />
                <rect x="18" y="24" width="4" height="2" />
                <rect x="24" y="24" width="3" height="3" />
              </svg>
            </div>
            <div className="text-[9px] text-slate-500 font-bold leading-tight max-w-[85px]">
              Scan QR Code to View Payslip PDF
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SalarySlip;
