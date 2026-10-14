import React, { useState } from "react";
import { FileText, Calendar, Download, Eye, X } from "lucide-react";
import { dataStore, EmployerWorker } from "@/lib/data-store";
import SalarySlip from "@/components/SalarySlip";

function computeHoursFromTimes(startStr?: string, endStr?: string): number {
  if (!startStr || !endStr) return 9;
  const parseToMinutes = (str: string): number => {
    const s = str.trim().toUpperCase();
    const isPM = s.includes("PM");
    const isAM = s.includes("AM");
    const clean = s.replace(/(AM|PM)/g, "").trim();
    const parts = clean.split(":").map(p => parseInt(p, 10));
    let hours = parts[0] || 0;
    const mins = parts[1] || 0;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + mins;
  };
  const diff = parseToMinutes(endStr) - parseToMinutes(startStr);
  const diffHours = diff > 0 ? diff / 60 : (diff + 24 * 60) / 60;
  return Math.round(diffHours * 10) / 10 || 9;
}

interface SalarySlipsSectionProps {
  empIdentifier: string;
  companyName?: string;
  companyAddress?: string;
}

export const SalarySlipsSection: React.FC<SalarySlipsSectionProps> = ({
  empIdentifier,
  companyName = "REAL JOB Construction Pvt. Ltd.",
  companyAddress = "MIDC Industrial Area, Pune, Maharashtra 411026",
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("October");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [viewWorker, setViewWorker] = useState<EmployerWorker | null>(null);

  const workers = dataStore.getEmployerWorkers(empIdentifier);
  const allAtt = dataStore.getAllAttendance();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const mIndex = monthNames.indexOf(selectedMonth) >= 0 ? monthNames.indexOf(selectedMonth) : 9;
  const y = parseInt(selectedYear, 10) || 2026;
  const totalDays = new Date(y, mIndex + 1, 0).getDate();

  const startDate = `${y}-${String(mIndex + 1).padStart(2, '0')}-01`;
  const endDate = `${y}-${String(mIndex + 1).padStart(2, '0')}-${String(totalDays).padStart(2, '0')}`;

  const getMetrics = (worker: EmployerWorker) => {
    const workerRecords = allAtt.filter((r) => {
      const match = r.workerId === worker.id || (r.workerName && r.workerName.toLowerCase() === worker.name.toLowerCase());
      return match && r.date >= startDate && r.date <= endDate;
    });

    const shiftH = computeHoursFromTimes(worker.workShiftStart, worker.workShiftEnd) || 9;
    const effectiveOtRate = worker.overtimeRate !== undefined && worker.overtimeRate !== null && Number(worker.overtimeRate) > 0
      ? Number(worker.overtimeRate)
      : Math.round(worker.dailyRate / shiftH);

    let present = 0;
    let halfDay = 0;
    let absent = 0;
    let overtime = 0;
    let otHours = 0;
    let otPay = 0;

    workerRecords.forEach((r) => {
      if (r.status === "Present") present++;
      else if (r.status === "HalfDay") halfDay++;
      else if (r.status === "Absent") absent++;
      else if (r.status === "Overtime") {
        overtime++;
        const h = r.overtimeHours || 1;
        otHours += h;
        otPay += r.overtimePay || Math.round(effectiveOtRate * h);
      }
    });

    let weeklyOffCount = 0;
    for (let d = 1; d <= totalDays; d++) {
      if (new Date(y, mIndex, d).getDay() === 0) weeklyOffCount++;
    }

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const grid: Array<{ day: number; weekday: string; status: 'P' | 'A' | 'L' | 'WO' | 'HD' | '-' }> = [];
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(y, mIndex, d);
      const isSun = dateObj.getDay() === 0;
      const dateStr = `${y}-${String(mIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const rec = workerRecords.find((r) => r.date === dateStr);

      let st: 'P' | 'A' | 'L' | 'WO' | 'HD' | '-' = '-';
      if (isSun) st = 'WO';
      else if (rec) {
        if (rec.status === "Present" || rec.status === "Overtime") st = 'P';
        else if (rec.status === "HalfDay") st = 'HD';
        else if (rec.status === "Absent") st = 'A';
      }
      grid.push({ day: d, weekday: weekdays[dateObj.getDay()] || 'Mon', status: st });
    }

    const totalWorkDays = present + overtime + (halfDay * 0.5);
    const basic = (present + overtime) * worker.dailyRate + (halfDay * Math.round(worker.dailyRate / 2));
    const totalEarningsDays = totalWorkDays > 0 ? (totalWorkDays + weeklyOffCount) : 0;

    return {
      records: workerRecords,
      present,
      halfDay,
      absent,
      overtime,
      otHours,
      otPay,
      effectiveOtRate,
      weeklyOffCount,
      totalWorkDays,
      basic,
      totalEarningsDays,
      totalWorkHours: totalWorkDays * 8,
      grid,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#063B78]/10 text-[#063B78] text-xs font-black mb-2">
            <FileText className="size-3.5" />
            <span>E-Salary & Payslips Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#10233F]">
            Employee Salary Slips
          </h2>
          <p className="text-xs text-[#5B6B7F] font-semibold mt-1">
            Generate and download monthly salary slips with dynamic attendance grids and direct PDF export.
          </p>
        </div>

        {/* Month & Year Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-[#DCE5F0] rounded-xl text-xs font-black bg-white"
          >
            {monthNames.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-[#DCE5F0] rounded-xl text-xs font-black bg-white"
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>

      {/* Workers Salary Table */}
      <div className="bg-white rounded-2xl border border-[#DCE5F0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#063B78] text-white font-black uppercase">
              <tr>
                <th className="p-3.5">Employee Name</th>
                <th className="p-3.5">Designation</th>
                <th className="p-3.5">Daily Rate</th>
                <th className="p-3.5">Present / Paid Days</th>
                <th className="p-3.5">Net Wage</th>
                <th className="p-3.5 text-right">Official Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0] font-semibold text-[#10233F]">
              {workers.map((w) => {
                const met = getMetrics(w);
                return (
                  <tr key={w.id} className="hover:bg-[#F5F8FC]">
                    <td className="p-3.5">
                      <div className="font-black text-[#063B78]">{w.name}</div>
                      <div className="text-[11px] text-[#5B6B7F]">RJW-{w.id.slice(-6).toUpperCase()}</div>
                    </td>
                    <td className="p-3.5">{w.trade}</td>
                    <td className="p-3.5">₹{w.dailyRate}/day</td>
                    <td className="p-3.5">
                      <span className="font-black text-emerald-700">{met.present} Days</span>
                      {met.halfDay > 0 && <span className="text-purple-700"> + {met.halfDay} HD</span>}
                    </td>
                    <td className="p-3.5 font-black text-slate-900">
                      ₹{met.basic + met.otPay}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setViewWorker(w)}
                        className="px-3 py-1.5 rounded-lg bg-[#063B78] text-white font-bold text-xs hover:bg-[#084B96] transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye className="size-3.5" />
                        <span>View Slip</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {workers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#5B6B7F] font-bold">
                    No employees registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Slip Modal */}
      {viewWorker && (() => {
        const met = getMetrics(viewWorker);
        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 space-y-4 my-8 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <h3 className="font-black text-slate-800 text-lg">Official Payslip Preview</h3>
                <button
                  onClick={() => setViewWorker(null)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                >
                  <X className="size-5" />
                </button>
              </div>

              <SalarySlip
                companyName={companyName}
                companyAddress={companyAddress}
                employeeName={viewWorker.name}
                employeeId={`RJW-${viewWorker.id.slice(-6).toUpperCase()}`}
                mobile={viewWorker.mobile || "9876543210"}
                designation={viewWorker.trade || "Worker"}
                department={viewWorker.category || "Construction"}
                joiningDate={viewWorker.joiningDate || "01-08-2026"}
                month={selectedMonth}
                year={selectedYear}
                totalDaysInMonth={totalDays}
                presentDays={met.present + met.overtime}
                absentDays={met.absent}
                halfDays={met.halfDay}
                weeklyOffDays={met.weeklyOffCount}
                dailyRate={viewWorker.dailyRate}
                basicSalary={met.basic}
                overtimeHours={met.otHours}
                overtimeRate={met.effectiveOtRate}
                overtimePay={met.otPay}
                totalWorkHours={met.totalWorkHours}
                totalEarningsDays={met.totalEarningsDays}
                attendanceGrid={met.grid}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default SalarySlipsSection;
