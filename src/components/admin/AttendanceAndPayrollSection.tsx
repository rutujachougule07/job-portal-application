import React, { useState, useEffect } from "react";
import {
  CalendarCheck, Clock, CheckCircle2, XCircle, Zap, UserPlus,
  Trash2, Edit, Download, CalendarDays, Check, Search
} from "lucide-react";
import { dataStore, EmployerWorker, DailyAttendanceRecord } from "@/lib/data-store";
import { AddEmployeeModal } from "./AddEmployeeModal";

interface AttendanceAndPayrollSectionProps {
  empIdentifier: string;
}

export const AttendanceAndPayrollSection: React.FC<AttendanceAndPayrollSectionProps> = ({ empIdentifier }) => {
  const [workers, setWorkers] = useState<EmployerWorker[]>([]);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]!
  );
  const [dailyAttendanceRecords, setDailyAttendanceRecords] = useState<DailyAttendanceRecord[]>([]);
  const [attSubTab, setAttSubTab] = useState<"daily" | "reports" | "employees">("daily");
  
  // Worker modal state
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState<EmployerWorker | null>(null);

  const loadData = () => {
    const w = dataStore.getEmployerWorkers(empIdentifier);
    setWorkers(w);
    const recs = dataStore.getEmployerAttendance(empIdentifier, selectedAttendanceDate);
    setDailyAttendanceRecords(recs);
  };

  useEffect(() => {
    loadData();
  }, [empIdentifier, selectedAttendanceDate]);

  const handleMarkAttendance = (
    worker: EmployerWorker,
    status: "Present" | "HalfDay" | "Absent" | "Overtime",
    extraData?: { overtimeHours?: number; overtimePay?: number }
  ) => {
    const existingRec = dailyAttendanceRecords.find((r) => r.workerId === worker.id);
    if (existingRec && existingRec.status === status && !extraData?.overtimeHours) {
      dataStore.removeAttendanceStatus(worker.id, selectedAttendanceDate);
      loadData();
      return;
    }

    dataStore.saveAttendanceStatus(
      empIdentifier,
      worker.id,
      worker.name,
      selectedAttendanceDate,
      status,
      undefined,
      undefined,
      extraData
    );
    loadData();
  };

  const handleSaveWorker = (workerData: Partial<EmployerWorker>) => {
    dataStore.saveEmployerWorker({
      ...workerData,
      employerId: empIdentifier,
    } as any);

    setShowAddWorkerModal(false);
    setEditingWorker(null);
    loadData();
  };

  const handleDeleteWorker = (workerId: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      dataStore.deleteEmployerWorker(workerId);
      loadData();
    }
  };

  // Metrics
  const presentCount = dailyAttendanceRecords.filter(r => r.status === "Present" || r.status === "Overtime").length;
  const halfDayCount = dailyAttendanceRecords.filter(r => r.status === "HalfDay").length;
  const absentCount = dailyAttendanceRecords.filter(r => r.status === "Absent").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#063B78]/10 text-[#063B78] text-xs font-black mb-2">
            <CalendarCheck className="size-3.5" />
            <span>Employee Attendance & Payroll Register</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#10233F]">
            Attendance & Payroll Management
          </h2>
          <p className="text-xs text-[#5B6B7F] font-semibold mt-1">
            Manage worker attendance, track punch records, calculate overtime wages, and generate reports.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingWorker(null);
            setShowAddWorkerModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#063B78] text-white text-xs font-black flex items-center gap-2 hover:bg-[#084B96] transition-all shadow-sm"
        >
          <UserPlus className="size-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DCE5F0] pb-2">
        <button
          onClick={() => setAttSubTab("daily")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            attSubTab === "daily" ? "bg-[#063B78] text-white shadow-xs" : "text-[#5B6B7F] hover:bg-slate-100"
          }`}
        >
          📅 Daily Attendance
        </button>
        <button
          onClick={() => setAttSubTab("employees")}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            attSubTab === "employees" ? "bg-[#063B78] text-white shadow-xs" : "text-[#5B6B7F] hover:bg-slate-100"
          }`}
        >
          👥 Employees ({workers.length})
        </button>
      </div>

      {attSubTab === "daily" && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500">Total Employees</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{workers.length}</p>
            </div>
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800">Present Today</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{presentCount}</p>
            </div>
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800">Half Day Today</span>
              <p className="text-2xl font-black text-amber-700 mt-1">{halfDayCount}</p>
            </div>
            <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200">
              <span className="text-xs font-bold text-rose-800">Absent Today</span>
              <p className="text-2xl font-black text-rose-700 mt-1">{absentCount}</p>
            </div>
          </div>

          {/* Date Selector */}
          <div className="bg-white p-4 rounded-xl border border-[#DCE5F0] flex flex-wrap items-center gap-3">
            <span className="text-xs font-black text-slate-700">Select Date:</span>
            <input
              type="date"
              value={selectedAttendanceDate}
              onChange={(e) => setSelectedAttendanceDate(e.target.value)}
              className="px-3 py-1.5 border border-[#DCE5F0] rounded-lg text-xs font-bold focus:outline-none focus:border-[#063B78]"
            />
            <button
              onClick={() => setSelectedAttendanceDate(new Date().toISOString().split("T")[0]!)}
              className="px-3 py-1.5 rounded-lg bg-[#063B78] text-white text-xs font-bold hover:bg-[#084B96]"
            >
              Today
            </button>
          </div>

          {/* Daily Attendance Table */}
          <div className="bg-white rounded-2xl border border-[#DCE5F0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#063B78] text-white font-black uppercase">
                  <tr>
                    <th className="p-3.5">Employee Name</th>
                    <th className="p-3.5">Trade / Role</th>
                    <th className="p-3.5">Daily Rate</th>
                    <th className="p-3.5">Mark Attendance (Click to toggle)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F0] font-semibold text-[#10233F]">
                  {workers.map((worker) => {
                    const record = dailyAttendanceRecords.find((r) => r.workerId === worker.id);
                    const currentStatus = record?.status;

                    return (
                      <tr key={worker.id} className="hover:bg-[#F5F8FC] transition-colors">
                        <td className="p-3.5">
                          <div className="font-black text-[#063B78]">{worker.name}</div>
                          <div className="text-[11px] text-[#5B6B7F]">{worker.mobile}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                            {worker.trade}
                          </span>
                        </td>
                        <td className="p-3.5 font-black text-emerald-700">
                          ₹{worker.dailyRate}/day
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleMarkAttendance(worker, "Present")}
                              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 ${
                                currentStatus === "Present"
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                              }`}
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span>Present</span>
                            </button>

                            <button
                              onClick={() => handleMarkAttendance(worker, "HalfDay")}
                              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 ${
                                currentStatus === "HalfDay"
                                  ? "bg-purple-600 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                              }`}
                            >
                              <Clock className="size-3.5" />
                              <span>Half Day</span>
                            </button>

                            <button
                              onClick={() => handleMarkAttendance(worker, "Absent")}
                              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 ${
                                currentStatus === "Absent"
                                  ? "bg-rose-600 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                              }`}
                            >
                              <XCircle className="size-3.5" />
                              <span>Absent</span>
                            </button>

                            <button
                              onClick={() => {
                                const otRate = (worker.overtimeRate !== undefined && worker.overtimeRate !== null && Number(worker.overtimeRate) > 0)
                                  ? Number(worker.overtimeRate)
                                  : Math.round(worker.dailyRate / 9);
                                handleMarkAttendance(worker, "Overtime", { overtimeHours: 1, overtimePay: otRate });
                              }}
                              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 ${
                                currentStatus === "Overtime"
                                  ? "bg-[#063B78] text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#063B78]"
                              }`}
                            >
                              <Zap className="size-3.5 text-amber-400 fill-amber-400" />
                              <span>Overtime</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {workers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-[#5B6B7F] font-bold">
                        No employees registered. Click "Add Employee" above to add your team.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Employees Directory Tab */}
      {attSubTab === "employees" && (
        <div className="bg-white rounded-2xl border border-[#DCE5F0] overflow-hidden p-5 space-y-4">
          <h3 className="text-lg font-black text-[#10233F]">Registered Employees Directory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((w) => (
              <div key={w.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{w.name}</h4>
                    <span className="text-xs text-slate-500 font-semibold">{w.trade}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-700">₹{w.dailyRate}/day</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Mobile</span>
                    <strong>{w.mobile || "--"}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Login PIN</span>
                    <strong className="tracking-widest text-[#063B78]">{w.pin || "1234"}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Shift</span>
                    <strong>{w.workShiftStart || "09:00"} - {w.workShiftEnd || "18:00"}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Overtime Rate</span>
                    <strong className="text-amber-700">₹{w.overtimeRate || 67} / hr</strong>
                  </div>
                </div>

                {w.customFields && w.customFields.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {w.customFields.map((cf, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {cf.label}: {cf.value || "--"}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setEditingWorker(w);
                      setShowAddWorkerModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="size-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteWorker(w.id)}
                    className="px-2.5 py-1.5 rounded-lg border border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Worker Modal from Add_New_Employee_Page_Code */}
      <AddEmployeeModal
        isOpen={showAddWorkerModal}
        onClose={() => {
          setShowAddWorkerModal(false);
          setEditingWorker(null);
        }}
        onSave={handleSaveWorker}
        initialData={editingWorker}
        empIdentifier={empIdentifier}
      />
    </div>
  );
};

export default AttendanceAndPayrollSection;
