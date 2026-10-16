import React, { useRef, useState } from 'react';
import { Download, Loader2, Building2, User, Calendar, ShieldCheck, Wallet, CheckCircle, Clock, Umbrella, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
  payPeriod?: string | undefined;

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
    status: 'P' | 'A' | 'L' | 'WO' | 'HD' | 'OT' | '-';
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

  month = 'October',
  year = '2026',
  payPeriod,

  totalDaysInMonth = 31,
  presentDays,
  absentDays,
  halfDays,
  weeklyOffDays,
  publicHolidays,

  dailyRate = 600,
  basicSalary,
  da,
  hra,
  conveyance = 0,
  medicalAllowance = 0,
  specialAllowance = 0,
  otherAllowance = 0,
  overtimeHours = 0,
  overtimeRate = 150,
  overtimePay,

  providentFund = 0,
  esi = 0,
  professionalTax = 0,
  incomeTax = 0,
  otherDeductions = 0,

  uanNo = '123456789012',
  esicNo = '520012345678',

  leaveEntitlement = 12,
  leaveAvailed,
  leaveBalance,
  absentDatesText,
  halfDayDatesText,
  totalWorkHours,
  totalEarningsDays,
  attendanceGrid,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculated Days (Dynamic)
  const computedTotalDays = totalDaysInMonth || 31;
  const computedPresent = presentDays !== undefined ? presentDays : 0;
  const computedAbsent = absentDays !== undefined ? absentDays : 0;
  const computedHalfDays = halfDays !== undefined ? halfDays : 0;
  const computedWeeklyOff = weeklyOffDays !== undefined ? weeklyOffDays : 4;
  const computedHoliday = publicHolidays !== undefined ? publicHolidays : 0;

  // Earnings Computations matching payslip logic
  const computedRate = dailyRate || 600;
  const computedBasic = basicSalary !== undefined && basicSalary > 0
    ? basicSalary
    : (computedPresent * computedRate);

  const computedOtherAllowance = otherAllowance || (conveyance + medicalAllowance + specialAllowance);

  const computedOtPay = overtimePay !== undefined
    ? overtimePay
    : (overtimeHours * overtimeRate);

  const totalEarnings = computedBasic + computedOtPay + (computedOtherAllowance > 0 ? computedOtherAllowance : 0);

  // Deductions Computations (Only real deductions like Advance/Loan)
  const computedOtherDed = otherDeductions || 0;
  const totalDeductions = computedOtherDed;
  const netPay = Math.max(0, totalEarnings - totalDeductions);

  // Period String (Dynamic Month Resolution)
  const monthNameToNum: Record<string, string> = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12',
  };
  const mNum = monthNameToNum[month] || (month.length <= 2 ? month.padStart(2, '0') : '10');
  const resolvedPayPeriod = payPeriod || `01-${mNum}-${year} to ${computedTotalDays}-${mNum}-${year}`;

  // Work Summary
  const computedWorkHours = (totalWorkHours !== undefined && totalWorkHours > 0)
    ? totalWorkHours
    : (computedPresent * 8 + Math.round(computedHalfDays * 4) + (overtimeHours || 0));
  const computedEarningsDays = totalEarningsDays !== undefined
    ? totalEarningsDays
    : (computedPresent + computedWeeklyOff + computedHoliday + (computedHalfDays > 0 ? computedHalfDays * 0.5 : 0));
  const effectiveLeaveAvailed = leaveAvailed !== undefined ? leaveAvailed : computedAbsent;
  const computedLeaveBalance = leaveBalance !== undefined ? leaveBalance : Math.max(0, leaveEntitlement - effectiveLeaveAvailed);

  const resolvedAbsentText = absentDatesText !== undefined
    ? absentDatesText
    : (computedAbsent > 0 ? `(${computedAbsent} days absent)` : 'No absent days recorded');
  const resolvedHalfDayText = halfDayDatesText !== undefined
    ? halfDayDatesText
    : (computedHalfDays > 0 ? `(${computedHalfDays} half days)` : 'No half days recorded');

  // Generate realistic attendance calendar based on active month
  const resolvedAttendanceGrid = attendanceGrid || (() => {
    const daysArr: Array<{ day: number; weekday: string; status: 'P' | 'A' | 'L' | 'WO' | 'HD' | 'OT' | '-' }> = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const yNum = parseInt(year, 10) || new Date().getFullYear();
    const mIdx = parseInt(mNum, 10) - 1;

    for (let d = 1; d <= computedTotalDays; d++) {
      const dateObj = new Date(yNum, mIdx, d);
      const wd = weekdays[dateObj.getDay()] || 'Mon';
      const isSun = dateObj.getDay() === 0;
      let status: 'P' | 'A' | 'L' | 'WO' | 'HD' | 'OT' | '-' = '-';
      if (isSun) {
        status = 'WO';
      }
      daysArr.push({ day: d, weekday: wd, status });
    }
    return daysArr;
  })();

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById('salary-slip-content');
    if (!element) {
      toast.error('Salary slip element not found');
      return;
    }
    const cleanEmpName = (employeeName || 'Employee').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_');
    const fileName = `Salary_Slip_${cleanEmpName}_${month || 'Payroll'}_${year || '2026'}.pdf`;

    try {
      setIsDownloading(true);
      toast.info('Generating Salary Slip PDF...');

      const { toPng } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipFonts: true,
        imagePlaceholder: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
        style: {
          margin: '0',
          boxShadow: 'none',
        },
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 5; // 5mm margin
      const printableWidth = pageWidth - margin * 2; // 200mm
      const printableHeight = pageHeight - margin * 2; // 287mm

      const imgProps = pdf.getImageProperties(dataUrl);
      const renderedHeight = (imgProps.height * printableWidth) / imgProps.width;

      if (renderedHeight <= printableHeight) {
        // Fits on a single page
        pdf.addImage(dataUrl, 'PNG', margin, margin, printableWidth, renderedHeight, undefined, 'FAST');
      } else if (renderedHeight <= printableHeight * 1.25) {
        // Scale down cleanly to fit single A4 page
        const scale = printableHeight / renderedHeight;
        const scaledWidth = printableWidth * scale;
        const xOffset = margin + (printableWidth - scaledWidth) / 2;
        pdf.addImage(dataUrl, 'PNG', xOffset, margin, scaledWidth, printableHeight, undefined, 'FAST');
      } else {
        // Multiple pages
        let heightLeft = renderedHeight;
        let position = margin;

        pdf.addImage(dataUrl, 'PNG', margin, position, printableWidth, renderedHeight, undefined, 'FAST');
        heightLeft -= printableHeight;

        while (heightLeft > 0) {
          position = position - printableHeight;
          pdf.addPage();
          pdf.addImage(dataUrl, 'PNG', margin, position, printableWidth, renderedHeight, undefined, 'FAST');
          heightLeft -= printableHeight;
        }
      }

      pdf.save(fileName);
      toast.success(`Salary Slip downloaded: ${fileName}`);
    } catch (err) {
      console.error('PDF download error:', err);
      toast.error('PDF तयार करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsDownloading(false);
    }
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
            disabled={isDownloading}
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#063B78] hover:bg-[#082F63] disabled:opacity-60 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
            title="Download PDF Salary Slip"
          >
            {isDownloading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Download PDF</span>
              </>
            )}
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

        {/* ── 1. TOP HERO BANNER (Company Name Primary Header & REAL JOB Brand) ── */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-gradient-to-r from-[#FFFFFF] via-[#F4F8FD] to-[#EBF3FC] p-3.5 sm:p-4 flex items-center justify-between min-h-[96px] gap-3">
          {/* Left: Employer Company Name & Identity */}
          <div className="flex items-center gap-3 z-10 flex-1 min-w-0">
            <div className="size-14 sm:size-16 rounded-2xl bg-[#063B78] flex items-center justify-center p-1.5 shadow-md border-2 border-[#FFC400] shrink-0">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="size-8 text-[#FFC400]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[#063B78] tracking-tight uppercase leading-tight truncate">
                {companyName || "COMPANY NAME"}
              </h1>
              <div className="text-[11px] sm:text-xs font-black uppercase text-slate-600 tracking-wider leading-tight mt-0.5">
                {companyTagline || "EMPLOYMENT & CONTRACTOR SERVICES"}
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold truncate mt-0.5 leading-tight">
                {companyAddress || "Safe Work • Secure Future • Better Tomorrow"}
              </p>
            </div>
          </div>

          {/* Right: Powered by REAL JOB */}
          <div className="relative z-10 flex flex-col items-end shrink-0 pl-3 border-l border-slate-200">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Powered by
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-base sm:text-lg font-black text-[#063B78] tracking-tight">REAL</span>
              <span className="text-base sm:text-lg font-black text-[#FFC400] tracking-tight">JOB</span>
            </div>
            <span className="text-[8px] font-bold text-slate-400">India</span>
          </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] leading-snug">
              <div className="grid grid-cols-12">
                <span className="col-span-5 text-slate-500 font-semibold">Name</span>
                <span className="col-span-1 text-slate-400 font-bold">:</span>
                <span className="col-span-6 font-black text-[#10233F] truncate">{employeeName}</span>
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
              ATTENDANCE DETAILS ({payPeriod ? payPeriod : `${month} ${year}`})
            </h3>
          </div>

          {/* Calendar Day Grid (Supports any custom range e.g. 10 to 20 or full month) */}
          <div className="p-2 sm:p-2.5 overflow-x-auto">
            <div className="min-w-[500px] space-y-1">
              
              {resolvedAttendanceGrid.length <= 16 ? (
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-center py-1">
                  {resolvedAttendanceGrid.map((item) => (
                    <div key={item.day} className="flex flex-col items-center min-w-[32px] sm:min-w-[36px]">
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
                            : item.status === 'HD'
                            ? 'bg-[#C084FC] text-[#581C87] border border-[#A855F7]'
                            : item.status === 'OT'
                            ? 'bg-[#DDD6FE] text-[#6D28D9] border border-[#A78BFA]'
                            : 'bg-slate-100 text-slate-400 border border-slate-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
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
                              : item.status === 'HD'
                              ? 'bg-[#C084FC] text-[#581C87] border border-[#A855F7]'
                              : item.status === 'OT'
                              ? 'bg-[#DDD6FE] text-[#6D28D9] border border-[#A78BFA]'
                              : 'bg-slate-100 text-slate-400 border border-slate-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Row 2: Days 17 to end */}
                  <div className="grid grid-cols-16 gap-1 text-center pt-1.5 border-t border-slate-100">
                    {resolvedAttendanceGrid.slice(16).map((item) => (
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
                              : item.status === 'HD'
                              ? 'bg-[#C084FC] text-[#581C87] border border-[#A855F7]'
                              : item.status === 'OT'
                              ? 'bg-[#DDD6FE] text-[#6D28D9] border border-[#A78BFA]'
                              : 'bg-slate-100 text-slate-400 border border-slate-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                    {resolvedAttendanceGrid.length < 32 && (
                      <div className="flex flex-col items-center justify-center opacity-0">
                        <span className="text-[10px]">-</span>
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>

            {/* Attendance Legend */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-5 pt-2.5 mt-2 border-t border-slate-200 text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-[#8CE0A7] border border-[#64CF87] flex items-center justify-center text-[8px] font-black text-[#0A5726]">P</span>
                <span className="text-slate-700 font-black">P - Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-[#FCA5A5] border border-[#F87171] flex items-center justify-center text-[8px] font-black text-[#991B1B]">A</span>
                <span className="text-slate-700 font-black">A - Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-[#C084FC] border border-[#A855F7] flex items-center justify-center text-[8px] font-black text-[#581C87]">HD</span>
                <span className="text-slate-700 font-black">HD - Half Day</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-[#DDD6FE] border border-[#A78BFA] flex items-center justify-center text-[8px] font-black text-[#6D28D9]">OT</span>
                <span className="text-slate-700 font-black">OT - Overtime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-[#A2D4F8] border border-[#78BFF4] flex items-center justify-center text-[8px] font-black text-[#064A7E]">WO</span>
                <span className="text-slate-700 font-black">WO - Weekly Off</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-sm bg-slate-100 border border-slate-300 flex items-center justify-center text-[8px] font-black text-slate-400">-</span>
                <span className="text-slate-500 font-bold">- Not Marked</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. SUMMARY METRIC CARDS (Absent & Work Summary) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Card 1: ABSENT & HALF DAY DETAILS */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 shadow-2xs text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-900 font-black border-b border-rose-200/60 pb-1">
              <XCircle size={14} className="text-rose-600" />
              <span className="uppercase tracking-wider text-[10px]">ABSENT & HALF DAY DETAILS</span>
            </div>
            <div className="space-y-1 text-slate-700 font-semibold">
              <div>
                <div className="flex justify-between">
                  <span>Absent Days</span>
                  <strong className="text-rose-700">: {computedAbsent} Day{computedAbsent !== 1 ? 's' : ''}</strong>
                </div>
                <div className="text-[10px] text-slate-500 font-medium pl-1">{resolvedAbsentText}</div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Half Day</span>
                  <strong className="text-amber-700">: {computedHalfDays} Day{computedHalfDays !== 1 ? 's' : ''}</strong>
                </div>
                <div className="text-[10px] text-slate-500 font-medium pl-1">{resolvedHalfDayText}</div>
              </div>
            </div>
          </div>

          {/* Card 2: WORK SUMMARY */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 shadow-2xs text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-900 font-black border-b border-emerald-200/60 pb-1">
              <Clock size={14} className="text-emerald-600" />
              <span className="uppercase tracking-wider text-[10px]">WORK SUMMARY</span>
            </div>
            <div className="space-y-1 text-slate-700 font-semibold">
              <div className="flex justify-between">
                <span>Total Working Days</span>
                <strong className="text-slate-900">: {computedPresent + (computedHalfDays > 0 ? computedHalfDays * 0.5 : 0)} Days</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Work Hours</span>
                <strong className="text-slate-900">: {computedWorkHours} Hrs</strong>
              </div>
              <div className="flex justify-between">
                <span>Overtime Hours</span>
                <strong className="text-purple-700">: {overtimeHours} Hrs</strong>
              </div>
              <div className="flex justify-between">
                <span>Overtime Rate</span>
                <strong className="text-purple-700">: ₹{overtimeRate} / Hr</strong>
              </div>
              <div className="flex justify-between">
                <span>Overtime Pay</span>
                <strong className="text-emerald-700 font-black">: ₹{computedOtPay}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Earnings Days</span>
                <strong className="text-slate-900">: {computedEarningsDays} Days</strong>
              </div>
              <div className="flex justify-between border-t border-emerald-300 pt-1.5 mt-1">
                <span className="font-black text-slate-800 text-xs">Total Net Pay</span>
                <strong className="text-emerald-800 font-black text-sm">: ₹{netPay}</strong>
              </div>
            </div>
          </div>

        </div>





      </div>

    </div>
  );
};

export default SalarySlip;
