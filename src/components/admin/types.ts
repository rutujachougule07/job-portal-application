export interface CustomField {
  label: string;
  value: string;
}

export interface EmployerWorker {
  id: string;
  employerId: string;
  name: string;
  mobile: string;
  trade: string;
  category?: string;
  education?: string;
  dailyRate: number;
  joiningDate: string;
  status: "Active" | "Inactive" | "Deleted";
  workShiftStart?: string;
  workShiftEnd?: string;
  dailyWorkingHours?: number;
  overtimeRate?: number;
  overtimeRateMode?: "auto" | "manual";
  customFields?: CustomField[];
  pin?: string;
  attendanceMode?: "punch" | "manual";
  locationType?: "fixed" | "field";
  notes?: string;
}
