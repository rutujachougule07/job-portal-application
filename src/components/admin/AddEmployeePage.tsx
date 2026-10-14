import React, { useState, useEffect } from "react";
import { UserPlus, Users, Edit, Trash2, CalendarCheck, ShieldCheck } from "lucide-react";
import { AddEmployeeModal } from "./AddEmployeeModal";
import { EmployerWorker } from "./types";
import { dataStore } from "@/lib/data-store";

export interface AddEmployeePageProps {
  empIdentifier?: string;
}

export const AddEmployeePage: React.FC<AddEmployeePageProps> = ({ empIdentifier }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<EmployerWorker | null>(null);

  const [workersList, setWorkersList] = useState<EmployerWorker[]>(() => {
    if (empIdentifier) {
      return (dataStore.getEmployerWorkers(empIdentifier) as unknown as EmployerWorker[]) || [];
    }
    return [
      {
        id: "emp-101",
        employerId: "admin-001",
        name: "Ramesh Pawar",
        mobile: "9822112233",
        trade: "General Worker",
        category: "💻 Software Developer / Engineer",
        dailyRate: 600,
        joiningDate: "2026-08-01",
        status: "Active",
        workShiftStart: "09:00",
        workShiftEnd: "18:00",
        dailyWorkingHours: 9,
        overtimeRate: 67,
        pin: "1234",
        customFields: [{ label: "Aadhaar Card ID", value: "1234-5678-9012" }],
      },
    ];
  });

  const loadData = () => {
    if (empIdentifier) {
      setWorkersList((dataStore.getEmployerWorkers(empIdentifier) as unknown as EmployerWorker[]) || []);
    }
  };

  useEffect(() => {
    loadData();
  }, [empIdentifier]);

  const handleSave = (savedData: Partial<EmployerWorker>) => {
    if (empIdentifier) {
      dataStore.saveEmployerWorker({
        ...savedData,
        employerId: empIdentifier,
      } as any);
      setIsModalOpen(false);
      setEditingWorker(null);
      loadData();
      return;
    }

    if (editingWorker) {
      setWorkersList((prev) =>
        prev.map((w) => (w.id === editingWorker.id ? ({ ...w, ...savedData } as EmployerWorker) : w))
      );
    } else {
      const newWorker: EmployerWorker = {
        id: "emp-" + Date.now(),
        employerId: "admin-001",
        name: savedData.name || "Employee",
        mobile: savedData.mobile || "",
        trade: savedData.trade || "Worker",
        category: savedData.category || "General",
        dailyRate: savedData.dailyRate || 600,
        joiningDate: savedData.joiningDate || new Date().toISOString().split("T")[0]!,
        status: "Active",
        workShiftStart: savedData.workShiftStart || "09:00",
        workShiftEnd: savedData.workShiftEnd || "18:00",
        dailyWorkingHours: savedData.dailyWorkingHours || 9,
        overtimeRate: savedData.overtimeRate || 67,
        pin: savedData.pin || "1234",
        customFields: savedData.customFields || [],
      };
      setWorkersList((prev) => [newWorker, ...prev]);
    }
    setIsModalOpen(false);
    setEditingWorker(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      if (empIdentifier) {
        dataStore.deleteEmployerWorker(id);
        loadData();
      } else {
        setWorkersList((prev) => prev.filter((w) => w.id !== id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 text-slate-800 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black mb-2">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>HR & Employee Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10233F]">
              Employee Management Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Click "Add New Employee" to open the interactive modal with custom fields, overtime & shift setup.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingWorker(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-[#063B78] hover:bg-[#0A4F9E] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="size-4" />
            <span>+ Add New Employee</span>
          </button>
        </div>

        {/* Employees Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workersList.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#063B78] transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-base text-[#10233F]">{worker.name}</h3>
                  <p className="text-xs font-bold text-[#063B78]">{worker.category}</p>
                  <p className="text-[11px] font-semibold text-slate-500">{worker.trade}</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-xs">
                  ₹{worker.dailyRate} / day
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Mobile</span>
                  <strong>{worker.mobile || "--"}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Login PIN</span>
                  <strong className="tracking-widest text-[#063B78]">{worker.pin || "1234"}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Shift</span>
                  <strong>{worker.workShiftStart} - {worker.workShiftEnd}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Overtime Rate</span>
                  <strong className="text-amber-700">₹{worker.overtimeRate} / hr</strong>
                </div>
              </div>

              {worker.customFields && worker.customFields.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {worker.customFields.map((cf, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {cf.label}: {cf.value || "--"}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setEditingWorker(worker);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="size-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(worker.id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}

          {workersList.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200">
              <Users className="size-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-700">No Employees Registered</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Click "+ Add New Employee" above to add your first team member.</p>
            </div>
          )}
        </div>

      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWorker(null);
        }}
        onSave={handleSave}
        initialData={editingWorker}
        empIdentifier={empIdentifier || "admin-001"}
      />
    </div>
  );
};

export const AddEmployeePageDemo = AddEmployeePage;
export default AddEmployeePage;
