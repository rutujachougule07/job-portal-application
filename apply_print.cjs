const fs = require('fs');

const adminPath = 'c:\\job-portal-application-main\\src\\routes\\admin.tsx';
let content = fs.readFileSync(adminPath, 'utf8');

const startTag = '{/* Worker Report Summary Table */}';
const startIndex = content.indexOf(startTag);
if (startIndex === -1) {
  console.log("Start tag not found.");
  process.exit(1);
}

const endTag = '{/* VIEW 3: WORKER DIRECTORY */}';
const endIndex = content.indexOf(endTag);
if (endIndex === -1) {
  console.log("End tag not found.");
  process.exit(1);
}

const originalPart = content.substring(startIndex, endIndex);

const endDiv = '</div>\n                      </div>\n                    )}\n\n                    ';
let partToReplace = originalPart;
if (originalPart.endsWith(endDiv)) {
  partToReplace = originalPart.substring(0, originalPart.length - endDiv.length);
} else {
    // Find the last </div>\n                      </div>\n                    )}
    const match = originalPart.lastIndexOf('</div>\n                      </div>\n                    )}');
    if (match !== -1) {
        partToReplace = originalPart.substring(0, match);
    }
}


const replacement = `                        {/* ONSCREEN ONLY: Worker Report Summary Table */}
                        <div className="print:hidden rounded-2xl border border-[#DCE5F0] bg-white p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-5">
                            <div>
                              <h3 className="text-lg font-black text-[#10233F] flex items-center gap-2">
                                <span>📊 Employee Weekly & Monthly Payroll Summary</span>
                                <Badge className="bg-[#063B78] text-white font-bold text-xs uppercase">
                                  {reportTimeframe === "week" ? "Weekly Report" : reportTimeframe === "month" ? "Monthly Report" : "Custom Range"}
                                </Badge>
                              </h3>
                              <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                                Individual employee present days, half days, absent days, overtime, and calculated net wages:
                              </p>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[#EBF1F8] bg-[#F8FAFF] text-[11px] uppercase tracking-wider text-[#5B6B7F] font-black">
                                  <th className="p-4 rounded-l-xl">Employee Name</th>
                                  <th className="p-4">Department / Category</th>
                                  <th className="p-4">Daily Wage Rate</th>
                                  <th className="p-4 text-center text-emerald-700">Present Days</th>
                                  <th className="p-4 text-center text-amber-700">Half Days</th>
                                  <th className="p-4 text-center text-rose-700">Absent Days</th>
                                  <th className="p-4 text-center text-blue-700">Overtime Days</th>
                                  <th className="p-4 text-right rounded-r-xl">Net Payable Wages</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#EBF1F8] text-xs font-semibold">
                                {(() => {
                                  const filtered = workers.filter((w) => {
                                    if (selectedCategoryFilter === "ALL") return true;
                                    return (w.category || w.trade) === selectedCategoryFilter;
                                  });

                                  if (filtered.length === 0) {
                                    return (
                                      <tr>
                                        <td colSpan={8} className="p-8 text-center text-xs font-bold text-[#5B6B7F]">
                                          No employee attendance records found for the selected period.
                                        </td>
                                      </tr>
                                    );
                                  }

                                  return filtered.map((worker) => {
                                    const recs = reportAttendanceRecords.filter((r) => r.workerId === worker.id);
                                    let presentCount = 0;
                                    let halfCount = 0;
                                    let absentCount = 0;
                                    let otCount = 0;
                                    let totalWage = 0;

                                    recs.forEach((r) => {
                                      if (r.status === "Present") {
                                        presentCount++;
                                        totalWage += worker.dailyRate;
                                      } else if (r.status === "HalfDay") {
                                        halfCount++;
                                        totalWage += Math.round(worker.dailyRate / 2);
                                      } else if (r.status === "Absent") {
                                        absentCount++;
                                      } else if (r.status === "Overtime") {
                                        otCount++;
                                        totalWage += Math.round(worker.dailyRate * 1.5);
                                      }
                                    });

                                    return (
                                      <tr key={worker.id} className="hover:bg-[#F8FAFF]">
                                        <td className="p-4 font-black text-[#10233F]">
                                          <div className="text-sm font-black">{worker.name}</div>
                                          <div className="text-[10px] text-[#5B6B7F]">📞 {worker.mobile || "N/A"}</div>
                                        </td>

                                        <td className="p-4">
                                          <Badge className="bg-blue-50 text-[#063B78] border border-blue-200 font-extrabold text-[11px]">
                                            {formatCategoryName(worker.category || worker.trade)}
                                          </Badge>
                                        </td>

                                        <td className="p-4 font-black text-[#10233F]">
                                          ₹{worker.dailyRate} / day
                                        </td>

                                        <td className="p-4 text-center font-black text-emerald-600 text-sm">
                                          {presentCount}
                                        </td>

                                        <td className="p-4 text-center font-black text-amber-600 text-sm">
                                          {halfCount}
                                        </td>

                                        <td className="p-4 text-center font-black text-rose-600 text-sm">
                                          {absentCount}
                                        </td>

                                        <td className="p-4 text-center font-black text-blue-600 text-sm">
                                          {otCount}
                                        </td>

                                        <td className="p-4 text-right font-black text-emerald-700 text-base">
                                          ₹{totalWage.toLocaleString("en-IN")}
                                        </td>
                                      </tr>
                                    );
                                  });
                                })()}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* PRINT ONLY: Professional Report Layout */}
                        <div className="hidden print:block font-sans min-h-screen bg-white" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                          {/* Top Official Banner */}
                          <div className="bg-[#063B78] rounded-xl text-white p-6 mb-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-[#FFC400] text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                  <BriefcaseBusiness className="size-3.5" /> OFFICIAL WORKFORCE SALARY REPORT
                                </div>
                                <h1 className="text-2xl font-black uppercase tracking-tight leading-none mb-2">
                                  {currentUser?.fullName || "COMPANY NAME"}
                                </h1>
                                <div className="text-blue-100 text-xs font-semibold">
                                  Employer: {currentUser?.fullName || "Admin"} &bull; Work & Salary Settlement
                                </div>
                              </div>
                              <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-right shadow-inner">
                                <div className="text-[10px] text-blue-200 font-black uppercase tracking-wider mb-0.5">REPORT TYPE</div>
                                <div className="text-sm font-black text-white">
                                  {reportTimeframe === "week" ? "WEEKLY PAYROLL" : reportTimeframe === "month" ? "MONTHLY PAYROLL" : "CUSTOM PAYROLL"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Secondary Banner - Period Info */}
                          <div className="bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl p-4 mb-8 flex justify-between items-center shadow-xs">
                            <div>
                              <div className="text-[10px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">📅 REPORT TIMEFRAME</div>
                              <div className="text-sm font-black text-[#10233F]">
                                {reportTimeframe === "week" ? \`(Last 7 Days up to \${new Date().toLocaleDateString('en-IN')})\` : reportTimeframe === "month" ? \`(Current Month up to \${new Date().toLocaleDateString('en-IN')})\` : \`(From \${reportStartDate} to \${reportEndDate})\`}
                              </div>
                            </div>
                            <div className="text-right border-l border-[#DCE5F0] pl-6">
                              <div className="text-[10px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">🖨️ GENERATED DATE</div>
                              <div className="text-sm font-black text-[#10233F]">{new Date().toLocaleDateString('en-IN')}</div>
                            </div>
                          </div>

                          {/* Data Table */}
                          <div className="border border-[#CBD5E1] rounded-xl overflow-hidden mb-8 shadow-xs">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-[#063B78] text-white text-[10px] uppercase tracking-wider font-black">
                                  <th className="p-3.5 border-b border-blue-900 w-[20%]">Employee Name</th>
                                  <th className="p-3.5 border-b border-blue-900 w-[15%]">Department</th>
                                  <th className="p-3.5 border-b border-blue-900 text-center">Daily Wage</th>
                                  <th className="p-3.5 border-b border-blue-900 text-center text-emerald-300">Present</th>
                                  <th className="p-3.5 border-b border-blue-900 text-center text-amber-300">Half</th>
                                  <th className="p-3.5 border-b border-blue-900 text-center text-rose-300">Absent</th>
                                  <th className="p-3.5 border-b border-blue-900 text-center text-blue-300">OT</th>
                                  <th className="p-3.5 border-b border-blue-900 text-right w-[20%]">Earned Pay</th>
                                </tr>
                              </thead>
                              <tbody className="text-xs font-bold divide-y divide-[#E2E8F0] bg-white">
                                {(() => {
                                  const filtered = workers.filter((w) => {
                                    if (selectedCategoryFilter === "ALL") return true;
                                    return (w.category || w.trade) === selectedCategoryFilter;
                                  });

                                  let absoluteGrandTotal = 0;

                                  const rows = filtered.map((worker, i) => {
                                    const recs = reportAttendanceRecords.filter((r) => r.workerId === worker.id);
                                    let presentCount = 0;
                                    let halfCount = 0;
                                    let absentCount = 0;
                                    let otCount = 0;
                                    let totalWage = 0;

                                    recs.forEach((r) => {
                                      if (r.status === "Present") {
                                        presentCount++;
                                        totalWage += worker.dailyRate;
                                      } else if (r.status === "HalfDay") {
                                        halfCount++;
                                        totalWage += Math.round(worker.dailyRate / 2);
                                      } else if (r.status === "Absent") {
                                        absentCount++;
                                      } else if (r.status === "Overtime") {
                                        otCount++;
                                        totalWage += Math.round(worker.dailyRate * 1.5);
                                      }
                                    });

                                    absoluteGrandTotal += totalWage;

                                    return (
                                      <tr key={worker.id} className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                                        <td className="p-3.5 text-[#0F172A] font-black">{worker.name}</td>
                                        <td className="p-3.5 text-[#475569] text-[10px] uppercase font-bold">{formatCategoryName(worker.category || worker.trade)}</td>
                                        <td className="p-3.5 text-center text-[#64748B]">₹{worker.dailyRate}/day</td>
                                        
                                        <td className="p-3.5 text-center text-emerald-700 font-black">{presentCount}</td>
                                        <td className="p-3.5 text-center text-amber-700 font-black">{halfCount}</td>
                                        <td className="p-3.5 text-center text-rose-700 font-black">{absentCount}</td>
                                        <td className="p-3.5 text-center text-blue-700 font-black">{otCount}</td>
                                        
                                        <td className="p-3.5 text-right font-black text-emerald-700 text-sm">
                                          ₹{totalWage.toLocaleString("en-IN")}
                                        </td>
                                      </tr>
                                    );
                                  });

                                  return (
                                    <>
                                      {rows}
                                      {rows.length === 0 && (
                                        <tr><td colSpan={8} className="p-8 text-center text-[#64748B]">No records for this period.</td></tr>
                                      )}
                                      {rows.length > 0 && (
                                        <tr className="bg-emerald-50/50 border-t-2 border-emerald-500">
                                          <td colSpan={7} className="p-4 text-right font-black text-emerald-900 uppercase text-xs">
                                            GRAND TOTAL PAYABLE AMOUNT:
                                          </td>
                                          <td className="p-4 text-right font-black text-emerald-700 text-xl">
                                            ₹{absoluteGrandTotal.toLocaleString("en-IN")}
                                          </td>
                                        </tr>
                                      )}
                                    </>
                                  );
                                })()}
                              </tbody>
                            </table>
                          </div>

                          {/* Footer Signatures */}
                          <div className="mt-12 pt-6 border-t-2 border-dashed border-[#CBD5E1] flex justify-between items-end">
                            <div>
                               <div className="text-sm font-black text-[#063B78] uppercase">{currentUser?.fullName || "COMPANY NAME"}</div>
                               <div className="text-[10px] font-bold text-[#64748B] mt-1">Computer Generated Payroll Summary &bull; Verified</div>
                            </div>
                            <div className="text-center">
                               <div className="border-[1.5px] border-dashed border-[#94A3B8] text-[#063B78] px-6 py-1.5 rounded text-[10px] font-black inline-block mb-2 bg-[#F8FAFC]">
                                 ✔ OFFICIAL STAMP
                               </div>
                               <div className="w-48 border-t-2 border-[#063B78] pt-1.5 mt-4">
                                 <div className="text-[10px] font-black text-[#063B78]">AUTHORIZED EMPLOYER SIGNATURE</div>
                               </div>
                            </div>
                          </div>
                        </div>\n`;

content = content.replace(partToReplace, replacement);

fs.writeFileSync(adminPath, content);
console.log("Replaced successfully!");
