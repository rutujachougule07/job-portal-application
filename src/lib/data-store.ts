/**
 * REAL JOB Unified Data Store & Management System
 * Handles Users, Employers, Jobs, Applications, SavedJobs, JobAlerts & Recommendations
 */

import { db } from "@/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

// Helper: fire-and-forget sync to Firebase
function fbSync(fn: () => Promise<unknown>) {
  if (typeof window !== "undefined") fn().catch(console.error);
}

export type UserRole = "worker" | "employer" | "admin" | "employee";

export type JobSeekerProfile = {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  profilePhoto?: string;
  education?: string;
  skills: string[];
  experience: string;
  currentLocation: string;
  preferredLocation: string;
  expectedSalary: string;
  category: string;
  subcategory: string;
  jobType: string;
  resume?: string;
  resumeName?: string;
  createdAt: string;
};

export type EmployerProfile = {
  id: string;
  email: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  location: string;
  worksiteLocation?: { lat: number; lng: number };
  businessInfo: string;
  industry: string;
  size: string;
  createdAt: string;
};

export type SalaryType = "Daily" | "Monthly" | "Yearly";
export type JobType = "Full Time" | "Part Time" | "Contract" | "Internship" | "Daily Wage" | "Temporary";
export type WorkMode = "On-site" | "Work From Home" | "Hybrid";
export type JobStatus = "Active" | "Closed";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export type JobRecord = {
  id: string;
  employerId: string;
  employerName?: string;
  title: string;
  company: string;
  category: string;
  subcategory: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  qualification: string;
  experience: string;
  salary: string;
  salaryMin?: number | undefined;
  salaryMax?: number | undefined;
  salaryType: SalaryType;
  showSalary?: boolean;
  hideSalary?: boolean;
  applicationConfig?: any;
  location: string;
  jobType: JobType;
  workMode: WorkMode;
  vacancies: number;
  benefits: string[];
  postedDate: string;
  postedAgo: string;
  initials: string;
  featured?: boolean;
  status: JobStatus;
  approvalStatus?: ApprovalStatus;
};

export type ApplicationStatus = "Applied" | "Viewed" | "Shortlisted" | "Interview" | "Selected" | "Rejected";

export type ApplicationRecord = {
  id: string;
  jobId: string;
  employerId: string;
  jobSeekerId: string;
  candidateName: string;
  candidateEmail: string;
  candidateMobile: string;
  jobTitle: string;
  companyName: string;
  location: string;
  salary: string;
  resume: string;
  appliedDate: string;
  status: ApplicationStatus;
  adminNotes?: string;
  replyMessage?: string;
  replyDate?: string;
  fieldValues?: Record<string, string>;
  customAnswers?: Record<string, string>;
};

export type SavedJobRecord = {
  id: string;
  jobSeekerId: string;
  jobId: string;
  savedDate: string;
};

export type JobAlertPreference = {
  id: string;
  jobSeekerId: string;
  category: string;
  subcategory: string;
  location: string;
  jobType: string;
  salaryMin?: number;
  skills: string[];
  createdAt: string;
};

export type InterviewRecord = {
  id: string;
  applicationId: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  interviewDate: string;
  interviewTime: string;
  type: "Online" | "Offline" | "Phone";
  meetingLink?: string;
  interviewer: string;
  notes?: string;
};

export type UserResumeRecord = {
  id: string;
  userId: string;
  fileName: string;
  fileSize: string;
  fileFormat: string;
  uploadDate: string;
  isDefault: boolean;
  status: string;
};

export type PackageTransaction = {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  companyName?: string;
  planId: string;
  planName: string;
  price: number;
  jobCount: number;
  workerCount?: number | string;
  purchaseDate: string;
  paymentMethod: string;
  status: "Completed" | "Pending";
};

export type JobPackagePlan = {
  id: string;
  name: string;
  price: number;
  jobCount: number;
  workerCount?: number | string;
  description?: string;
  popular?: boolean;
  features: string[];
  badge?: string;
};

export const DEFAULT_JOB_PACKAGES: JobPackagePlan[] = [
  {
    id: "plan-200",
    name: "Starter Package",
    price: 200,
    jobCount: 1,
    workerCount: 3,
    description: "1 Job Posting + 3 CRM Included",
    features: ["1 Active Job Posting", "Add up to 3 CRM Users", "Attendance Register Access", "Zero Commission"],
  },
  {
    id: "plan-300",
    name: "Growth Package",
    price: 300,
    jobCount: 2,
    workerCount: 6,
    popular: true,
    badge: "BEST VALUE",
    description: "2 Job Postings + 6 CRM Included",
    features: ["2 Active Job Postings", "Add up to 6 CRM Users", "Featured Badge on Listings", "Priority Support"],
  },
  {
    id: "plan-500",
    name: "Business Package",
    price: 500,
    jobCount: 5,
    workerCount: 15,
    description: "5 Job Postings + 15 CRM Included",
    features: ["5 Active Job Postings", "Add up to 15 CRM Users", "Highlighted Listings", "Direct WhatsApp & Call Connect"],
  },
  {
    id: "plan-999",
    name: "Enterprise Unlimited",
    price: 999,
    jobCount: 10,
    workerCount: 9999,
    badge: "UNLIMITED",
    description: "10 Job Postings + Unlimited CRM Included",
    features: ["10 Active Job Postings", "Unlimited CRM Users", "Top Priority Ranking", "Dedicated Account Manager"],
  },
];

// INITIAL SEED DATA FOR REAL JOBS (Only jobs added via Admin will exist)
export type EmployerWorker = {
  id: string;
  employerId: string;
  employerName?: string;
  name: string;
  mobile: string;
  trade: string;
  category?: string;
  education?: string;
  dailyRate: number;
  joiningDate: string;
  status: "Active" | "Inactive" | "Deleted";
  isDeleted?: boolean;
  workShiftStart?: string;
  workShiftEnd?: string;
  dailyWorkingHours?: number;
  overtimeRate?: number;
  overtimeRateMode?: "auto" | "manual";
  customFields?: Array<{ label: string; value: string }>;
  pin?: string;
  attendanceMode?: "punch" | "manual";
  locationType?: "fixed" | "field";
  notes?: string;
};

export type DailyAttendanceRecord = {
  id: string;
  employerId: string;
  workerId: string;
  workerName: string;
  date: string;
  status: "Present" | "HalfDay" | "Absent" | "Overtime";
  overtimeHours?: number;
  overtimePay?: number;
  punchInTime?: string;
  punchOutTime?: string;
  punchInLocation?: { lat: number; lng: number };
  punchOutLocation?: { lat: number; lng: number };
  notes?: string;
  punchLog?: Array<{ type: "in" | "out"; time: string; location: { lat: number; lng: number } }>;
  updatedAt: string;
};

export type SubAdminPermission =
  | "job-approvals"
  | "users-directory"
  | "job-applications"
  | "packages"
  | "landing-page";

export type SubAdmin = {
  id: string;
  fullName: string;
  username?: string;
  email: string;
  mobile: string;
  password?: string;
  role: "subadmin";
  designation: string;
  permissions: SubAdminPermission[];
  status: "active" | "inactive";
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
};

const INITIAL_SUBADMINS: SubAdmin[] = [
  {
    id: "subadmin_demo_1",
    fullName: "Rahul Patil",
    username: "rahul123",
    email: "rahul.subadmin@realjob.com",
    mobile: "9823456789",
    password: "subadmin123",
    role: "subadmin",
    designation: "Operations & Verification Admin",
    permissions: ["job-approvals", "users-directory", "job-applications"],
    status: "active",
    createdBy: "superadmin",
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "subadmin_demo_2",
    fullName: "Pooja Deshmukh",
    username: "pooja123",
    email: "pooja.subadmin@realjob.com",
    mobile: "9876543210",
    password: "subadmin123",
    role: "subadmin",
    designation: "Content & Portal Moderator",
    permissions: ["landing-page", "job-applications"],
    status: "active",
    createdBy: "superadmin",
    createdAt: "2026-03-15T14:30:00.000Z",
  }
];

export type RegisteredUser = {
  id: string;
  email: string;
  password?: string;
  mobile?: string;
  role: UserRole;
  fullName: string;
  profilePhoto?: string;
  createdAt?: string;
  worksiteLocation?: { lat: number; lng: number };
  worksiteLocationLink?: string;
};

export const DEFAULT_SUPERADMIN_CATEGORIES = [
  { label: "Factory Worker", iconName: "Factory", theme: "blue" },
  { label: "Construction", iconName: "HardHat", theme: "yellow" },
  { label: "Technical Staff", iconName: "Wrench", theme: "purple" },
  { label: "Transport & Logistics", iconName: "Truck", theme: "green" },
  { label: "Electrician", iconName: "Zap", theme: "orange" },
  { label: "Security Guard", iconName: "Shield", theme: "red" },
  { label: "Office Staff", iconName: "Briefcase", theme: "blue" },
];

const INITIAL_JOBS: JobRecord[] = [];

// Helper to determine if a job category is one of the removed test categories
export function isRemovedTestCategory(_cat?: string): boolean {
  return false;
}

export class DataStoreManager {
  private STORAGE_KEYS = {
    USER: "realjob_current_user",
    JOBS: "realjob_db_jobs",
    APPLICATIONS: "realjob_db_applications",
    SAVED_JOBS: "realjob_db_saved_jobs",
    JOB_ALERTS: "realjob_db_job_alerts",
    PROFILES: "realjob_db_profiles",
    EMPLOYERS: "realjob_db_employers",
    INTERVIEWS: "realjob_db_interviews",
    RESUMES: "realjob_db_resumes",
    PACKAGES: "realjob_db_packages",
    EMP_WORKERS: "realjob_db_emp_workers",
    ATTENDANCE: "realjob_db_attendance",
    SUBADMINS: "realjob_db_subadmins",
  };

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults() {
    if (typeof window === "undefined") return;

    if (!localStorage.getItem(this.STORAGE_KEYS.JOBS)) {
      localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify([]));
    } else {
      // Immediate cleanup of removed test categories from local storage
      try {
        const raw = localStorage.getItem(this.STORAGE_KEYS.JOBS) || "[]";
        const parsed: JobRecord[] = JSON.parse(raw);
        const cleaned = parsed.filter((j) => !isRemovedTestCategory(j.category));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(cleaned));
        }
      } catch {}
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.SAVED_JOBS)) {
      localStorage.setItem(this.STORAGE_KEYS.SAVED_JOBS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.JOB_ALERTS)) {
      localStorage.setItem(this.STORAGE_KEYS.JOB_ALERTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.EMP_WORKERS)) {
      localStorage.setItem(this.STORAGE_KEYS.EMP_WORKERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(this.STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.SUBADMINS)) {
      localStorage.setItem(this.STORAGE_KEYS.SUBADMINS, JSON.stringify(INITIAL_SUBADMINS));
    }
    
    // Bidirectional sync with Firebase
    fbSync(async () => {
      const jobsSnap = await getDocs(collection(db, "jobs"));
      const appsSnap = await getDocs(collection(db, "applications"));
      const usersSnap = await getDocs(collection(db, "users"));
      const workersSnap = await getDocs(collection(db, "workers"));
      const attendanceSnap = await getDocs(collection(db, "attendance"));

      if (!jobsSnap.empty) {
        // Firebase has jobs → use Firebase as source of truth while purging removed categories
        const fbJobs = jobsSnap.docs.map(d => d.data() as JobRecord);
        const validJobs: JobRecord[] = [];
        for (const docItem of jobsSnap.docs) {
          const jData = docItem.data() as JobRecord;
          if (isRemovedTestCategory(jData.category)) {
            // Delete removed test jobs from Firestore
            await deleteDoc(doc(db, "jobs", docItem.id)).catch(() => {});
          } else {
            validJobs.push(jData);
          }
        }
        localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(validJobs));
      } else {
        // Firebase empty → push local jobs to Firebase
        const localJobs: JobRecord[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.JOBS) || "[]");
        for (const job of localJobs) {
          if (!isRemovedTestCategory(job.category)) {
            await setDoc(doc(db, "jobs", job.id), job);
          }
        }
      }

      if (!appsSnap.empty) {
        const fbApps = appsSnap.docs.map(d => d.data());
        localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify(fbApps));
      } else {
        const localApps: ApplicationRecord[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.APPLICATIONS) || "[]");
        for (const app of localApps) {
          await setDoc(doc(db, "applications", app.id), app);
        }
      }

      if (!usersSnap.empty) {
        // Group docs by lowercase email (or mobile if email is absent)
        const emailToDocs = new Map<string, Array<{ id: string; data: RegisteredUser }>>();
        
        for (const docItem of usersSnap.docs) {
          const u = docItem.data() as RegisteredUser;
          const email = (u.email || "").trim().toLowerCase();
          const cleanMobile = (u.mobile || "").replace(/\D/g, "");
          const key = email || (cleanMobile ? `${cleanMobile}@realjob.com` : docItem.id);
          
          if (!emailToDocs.has(key)) {
            emailToDocs.set(key, []);
          }
          emailToDocs.get(key)!.push({ id: docItem.id, data: { ...u, id: u.id || docItem.id } });
        }

        const validUsers: RegisteredUser[] = [];

        for (const [key, docList] of emailToDocs.entries()) {
          if (docList.length === 1 && docList[0]) {
            validUsers.push(docList[0].data);
            continue;
          }

          // Multiple docs found for the same user -> Deduplicate!
          // Priority 1: Auth UID document (document id does NOT start with 'usr-')
          let primary = docList.find(d => !d.id.startsWith("usr-"));
          if (!primary && docList.length > 0) {
            // If all documents are usr- IDs, pick the latest one
            primary = docList[docList.length - 1];
          }

          if (!primary) continue;

          // Merge fields so no profile/mobile info is lost from duplicate entries
          let mergedData = { ...primary.data };
          for (const d of docList) {
            if (d.id !== primary.id) {
              mergedData = {
                ...d.data,
                ...mergedData,
                id: primary.id,
              };
            }
          }

          validUsers.push(mergedData);

          // Purge all duplicate documents from Firestore!
          for (const d of docList) {
            if (d.id !== primary.id) {
              console.log(`[Deduplicate] Purging duplicate Firestore user document: '${d.id}' for '${key}'`);
              deleteDoc(doc(db, "users", d.id)).catch(() => {});
            }
          }
        }

        localStorage.setItem("realjob_db_registered_users", JSON.stringify(validUsers));
      } else {
        const localUsers: RegisteredUser[] = JSON.parse(localStorage.getItem("realjob_db_registered_users") || "[]");
        for (const user of localUsers) {
          await setDoc(doc(db, "users", user.id), user).catch(() => {});
        }
      }

      if (!workersSnap.empty) {
        const deletedIds = new Set<string>(
          JSON.parse(localStorage.getItem("realjob_deleted_worker_ids") || "[]")
        );
        deletedIds.add("empw-1791635953540");
        deletedIds.add("empw-1791785681836");

        // Purge any deleted/inactive workers from Firestore
        for (const docItem of workersSnap.docs) {
          const dData = docItem.data() as EmployerWorker;
          if (deletedIds.has(docItem.id) || dData.status === "Deleted" || (dData as any).isDeleted || dData.status === "Inactive") {
            deletedIds.add(docItem.id);
            deleteDoc(doc(db, "workers", docItem.id)).catch(() => {});
          }
        }
        localStorage.setItem("realjob_deleted_worker_ids", JSON.stringify(Array.from(deletedIds)));

        const fbWorkers = workersSnap.docs
          .map(d => d.data() as EmployerWorker)
          .filter(w => !deletedIds.has(w.id) && w.status !== "Inactive" && w.status !== "Deleted" && !(w as any).isDeleted);

        const localWorkers: EmployerWorker[] = (
          JSON.parse(localStorage.getItem(this.STORAGE_KEYS.EMP_WORKERS) || "[]") as EmployerWorker[]
        ).filter(w => !deletedIds.has(w.id) && w.status !== "Inactive" && w.status !== "Deleted" && !(w as any).isDeleted);

        const map = new Map<string, EmployerWorker>();
        fbWorkers.forEach(w => { if (w.id) map.set(w.id, w); });
        localWorkers.forEach(w => { if (w.id) map.set(w.id, w); });
        const merged = Array.from(map.values()).filter(
          w => !deletedIds.has(w.id) && w.status !== "Inactive" && w.status !== "Deleted" && !(w as any).isDeleted
        );
        localStorage.setItem(this.STORAGE_KEYS.EMP_WORKERS, JSON.stringify(merged));

        const fbIds = new Set(fbWorkers.map(w => w.id));
        for (const w of localWorkers) {
          if (!fbIds.has(w.id) && !deletedIds.has(w.id)) {
            setDoc(doc(db, "workers", w.id), w, { merge: true }).catch(() => {});
          }
        }
      } else {
        const deletedIds = new Set<string>(
          JSON.parse(localStorage.getItem("realjob_deleted_worker_ids") || "[]")
        );
        deletedIds.add("empw-1791635953540");
        deletedIds.add("empw-1791785681836");
        const localWorkers: EmployerWorker[] = (
          JSON.parse(localStorage.getItem(this.STORAGE_KEYS.EMP_WORKERS) || "[]") as EmployerWorker[]
        ).filter(w => !deletedIds.has(w.id) && w.status !== "Inactive" && w.status !== "Deleted" && !(w as any).isDeleted);
        localStorage.setItem(this.STORAGE_KEYS.EMP_WORKERS, JSON.stringify(localWorkers));

        for (const w of localWorkers) {
          if (!deletedIds.has(w.id)) {
            await setDoc(doc(db, "workers", w.id), w, { merge: true }).catch(() => {});
          }
        }
      }

      if (!attendanceSnap.empty) {
        const fbAtt = attendanceSnap.docs.map(d => d.data() as DailyAttendanceRecord);
        const localAtt: DailyAttendanceRecord[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE) || "[]");
        const map = new Map<string, DailyAttendanceRecord>();
        fbAtt.forEach(a => { if (a.id) map.set(a.id, a); });
        localAtt.forEach(a => { if (a.id) map.set(a.id, a); });
        const merged = Array.from(map.values());
        localStorage.setItem(this.STORAGE_KEYS.ATTENDANCE, JSON.stringify(merged));

        const fbAttIds = new Set(fbAtt.map(a => a.id));
        for (const a of localAtt) {
          if (!fbAttIds.has(a.id)) {
            setDoc(doc(db, "attendance", a.id), a, { merge: true }).catch(() => {});
          }
        }
      } else {
        const localAtt: DailyAttendanceRecord[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE) || "[]");
        for (const a of localAtt) {
          await setDoc(doc(db, "attendance", a.id), a, { merge: true }).catch(() => {});
        }
      }

      try {
        const subadminsSnap = await getDocs(collection(db, "subadmins"));
        if (!subadminsSnap.empty) {
          const fbSub = subadminsSnap.docs.map(d => d.data());
          localStorage.setItem(this.STORAGE_KEYS.SUBADMINS, JSON.stringify(fbSub));
        } else {
          const localSub: SubAdmin[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SUBADMINS) || "[]");
          for (const s of localSub) {
            await setDoc(doc(db, "subadmins", s.id), s);
          }
        }
      } catch (e) {
        // Fallback gracefully if collection not initialized
      }
    });
  }

  // --- SUB-ADMIN MANAGEMENT ---
  public getSubAdmins(): SubAdmin[] {
    if (typeof window === "undefined") return INITIAL_SUBADMINS;
    const raw = localStorage.getItem(this.STORAGE_KEYS.SUBADMINS);
    if (!raw) return INITIAL_SUBADMINS;
    try {
      const list = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) {
        localStorage.setItem(this.STORAGE_KEYS.SUBADMINS, JSON.stringify(INITIAL_SUBADMINS));
        return INITIAL_SUBADMINS;
      }
      return list;
    } catch {
      return INITIAL_SUBADMINS;
    }
  }

  public findSubAdminByLogin(credential: string): SubAdmin | null {
    if (!credential) return null;
    const list = this.getSubAdmins();
    const clean = credential.trim().toLowerCase();
    return list.find(s => 
      s.email.toLowerCase() === clean || 
      (s.username && s.username.toLowerCase() === clean)
    ) || null;
  }

  public addSubAdmin(data: {
    fullName: string;
    username?: string;
    email: string;
    mobile: string;
    password?: string;
    designation: string;
    permissions: SubAdminPermission[];
    status?: "active" | "inactive";
    createdBy?: string;
  }): SubAdmin {
    const list = this.getSubAdmins();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = (data.username || cleanEmail.split("@")[0] || "subadmin").trim().toLowerCase().replace(/\s+/g, "_");
    const newSub: SubAdmin = {
      id: `subadmin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: data.fullName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      mobile: data.mobile.trim(),
      password: data.password || "subadmin123",
      role: "subadmin",
      designation: data.designation?.trim() || "Sub-Admin",
      permissions: data.permissions && data.permissions.length > 0 
        ? data.permissions 
        : ["job-approvals", "users-directory", "job-applications"],
      status: data.status || "active",
      createdBy: data.createdBy || "superadmin",
      createdAt: new Date().toISOString(),
    };
    list.unshift(newSub);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.SUBADMINS, JSON.stringify(list));
      fbSync(() => setDoc(doc(db, "subadmins", newSub.id), newSub));
    }
    return newSub;
  }

  public updateSubAdmin(id: string, updates: Partial<SubAdmin>): SubAdmin | null {
    const list = this.getSubAdmins();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const updated: SubAdmin = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    } as SubAdmin;
    list[idx] = updated;
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.SUBADMINS, JSON.stringify(list));
      fbSync(() => updateDoc(doc(db, "subadmins", id), updates));
    }
    return updated;
  }

  public deleteSubAdmin(id: string): boolean {
    let list = this.getSubAdmins();
    list = list.filter(s => s.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.SUBADMINS, JSON.stringify(list));
      fbSync(() => deleteDoc(doc(db, "subadmins", id)));
    }
    return true;
  }

  public toggleSubAdminStatus(id: string): SubAdmin | null {
    const list = this.getSubAdmins();
    const target = list.find(s => s.id === id);
    if (!target) return null;
    const nextStatus = target.status === "active" ? "inactive" : "active";
    return this.updateSubAdmin(id, { status: nextStatus });
  }

  /** Force-push all local data to Firebase (use from Admin panel) */
  public async pushAllToFirebase(): Promise<{ jobs: number; applications: number }> {
    const jobs: JobRecord[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.JOBS) || "[]");
    const apps: ApplicationRecord[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.APPLICATIONS) || "[]");

    for (const job of jobs) {
      await setDoc(doc(db, "jobs", job.id), job);
    }
    for (const app of apps) {
      await setDoc(doc(db, "applications", app.id), app);
    }
    return { jobs: jobs.length, applications: apps.length };
  }


  public getRegisteredUserAccounts(): RegisteredUser[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("realjob_db_registered_users");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return parsed.map((u: any) => ({
        ...u,
        fullName: u.fullName || u.email?.split("@")[0] || "User",
      }));
    } catch {
      return [];
    }
  }

  public getRegisteredUsers(): RegisteredUser[] {
    return this.getRegisteredUserAccounts();
  }

  public registerAccount(user: { id?: string; email: string; password?: string; mobile?: string; role: UserRole; fullName: string; profilePhoto?: string }): RegisteredUser {
    const list = this.getRegisteredUserAccounts();
    const cleanEmail = user.email.trim().toLowerCase();
    const existingIndex = list.findIndex(u => (u.email && u.email.toLowerCase() === cleanEmail) || (user.id && u.id === user.id));
    const fallbackName = cleanEmail.split("@")[0] || "User";
    
    const existing = existingIndex >= 0 ? list[existingIndex] : undefined;
    // Canonical ID: prefer given user.id (e.g. Firebase Auth UID) -> existing.id -> generate usr- timestamp
    const finalId = user.id || existing?.id || `usr-${Date.now()}`;

    let oldIdToDelete: string | null = null;
    if (existing && existing.id && existing.id !== finalId) {
      oldIdToDelete = existing.id;
    }

    const account: RegisteredUser = {
      id: finalId,
      email: cleanEmail,
      password: user.password !== undefined ? user.password : (existing?.password || ""),
      mobile: user.mobile !== undefined ? user.mobile : (existing?.mobile || ""),
      role: user.role || existing?.role || "worker",
      fullName: user.fullName || existing?.fullName || fallbackName,
      profilePhoto: user.profilePhoto !== undefined ? user.profilePhoto : (existing?.profilePhoto || ""),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      list[existingIndex] = account;
    } else {
      list.push(account);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("realjob_db_registered_users", JSON.stringify(list));
      if (oldIdToDelete) {
        fbSync(() => deleteDoc(doc(db, "users", oldIdToDelete!)).catch(() => {}));
      }
      fbSync(() => setDoc(doc(db, "users", account.id), account, { merge: true }).catch(() => {}));
    }
    return account;
  }

  public updateRegisteredAccount(userId: string, updates: Partial<RegisteredUser>): RegisteredUser | null {
    const list = this.getRegisteredUserAccounts();
    let index = list.findIndex(u => u.id === userId);
    if (index < 0 && updates.email) {
      index = list.findIndex(u => u.email.toLowerCase() === updates.email!.toLowerCase());
    }

    let updated: RegisteredUser;
    let oldIdToDelete: string | null = null;

    if (index >= 0 && list[index]) {
      const existing = list[index]!;
      const newId = updates.id || userId || existing.id;
      if (existing.id && existing.id !== newId) {
        oldIdToDelete = existing.id;
      }
      updated = { ...existing, ...updates, id: newId } as RegisteredUser;
      list[index] = updated;
    } else {
      updated = {
        id: userId || updates.id || `usr-${Date.now()}`,
        email: updates.email || "",
        password: updates.password || "",
        mobile: updates.mobile || "",
        role: updates.role || "employer",
        fullName: updates.fullName || "User",
        profilePhoto: updates.profilePhoto || "",
        createdAt: new Date().toISOString(),
        ...updates,
      } as RegisteredUser;
      list.push(updated);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("realjob_db_registered_users", JSON.stringify(list));
      if (oldIdToDelete) {
        fbSync(() => deleteDoc(doc(db, "users", oldIdToDelete!)).catch(() => {}));
      }
      fbSync(() => setDoc(doc(db, "users", updated.id), updated, { merge: true }).catch(() => {}));
      this.setCurrentUser(updated);
    }
    return updated;
  }

  public findRegisteredAccount(identifier: string) {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = clean.replace(/\D/g, "");
    const list = this.getRegisteredUserAccounts();
    return list.find((u) => {
      const emailMatch = u.email.toLowerCase() === clean;
      // Strict mobile match — digits must be exactly equal (no partial includes)
      const storedMobileDigits = (u.mobile || "").replace(/\D/g, "");
      const mobileMatch =
        cleanDigits.length >= 10 &&
        storedMobileDigits.length >= 10 &&
        storedMobileDigits === cleanDigits;
      return emailMatch || mobileMatch;
    });
  }

  public deleteRegisteredUser(userId: string): boolean {
    if (typeof window === "undefined") return false;
    let list = this.getRegisteredUserAccounts();
    list = list.filter((u) => u.id !== userId);
    localStorage.setItem("realjob_db_registered_users", JSON.stringify(list));
    fbSync(() => deleteDoc(doc(db, "users", userId)));
    return true;
  }

  public deleteAllRegisteredUsers(): boolean {
    if (typeof window === "undefined") return false;
    const users = this.getRegisteredUserAccounts();
    localStorage.setItem("realjob_db_registered_users", JSON.stringify([]));
    for (const u of users) {
      fbSync(() => deleteDoc(doc(db, "users", u.id)));
    }
    return true;
  }

  public deleteApplication(appId: string): boolean {
    if (typeof window === "undefined") return false;
    let apps = this.getAllApplications();
    apps = apps.filter((a) => a.id !== appId);
    localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    fbSync(() => deleteDoc(doc(db, "applications", appId)));
    return true;
  }

  public clearAllAdminData(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify([]));
    localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
    localStorage.setItem("realjob_db_registered_users", JSON.stringify([]));
    localStorage.setItem(this.STORAGE_KEYS.PACKAGES, JSON.stringify([]));
  }


  // --- USER AUTHENTICATION & CURRENT SESSION ---
  public getCurrentUser(rolePreference?: UserRole | "worker" | "employer" | "admin"): { email: string; role: UserRole; fullName?: string; id?: string; mobile?: string; profilePhoto?: string; worksiteLocation?: { lat: number; lng: number }; worksiteLocationLink?: string } | null {
    if (typeof window === "undefined") return null;

    const savedRole = localStorage.getItem("realjob-role");
    const activeRole = rolePreference || (savedRole === "admin" ? "employer" : savedRole === "user" || savedRole === "worker" ? "worker" : undefined);

    // 1. Check tab-specific session if present
    const sessionRaw = sessionStorage.getItem("realjob_tab_user");
    if (sessionRaw) {
      try {
        const u = JSON.parse(sessionRaw);
        if (
          !activeRole ||
          u.role === activeRole ||
          ((activeRole === "employer" || activeRole === "admin") && (u.role === "admin" || u.role === "employer"))
        ) {
          return u;
        }
      } catch {}
    }

    // 2. Role-specific storage lookup
    if (activeRole) {
      const prefKey = activeRole === "worker" ? "realjob-user-worker" : "realjob-user-admin";
      const roleRaw = localStorage.getItem(prefKey);
      if (roleRaw) {
        try {
          const u = JSON.parse(roleRaw);
          if (
            u &&
            u.email &&
            ((activeRole === "worker" && u.role === "worker") ||
              ((activeRole === "employer" || activeRole === "admin") && (u.role === "admin" || u.role === "employer")))
          ) {
            return u;
          }
        } catch {}
      }
    }

    // 3. Fallback to general storage lookup
    const raw = localStorage.getItem("realjob-user") || localStorage.getItem(this.STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      const u = JSON.parse(raw);
      if (activeRole) {
        if (
          (activeRole === "worker" && u.role === "worker") ||
          ((activeRole === "employer" || activeRole === "admin") && (u.role === "admin" || u.role === "employer"))
        ) {
          return u;
        }
        return null;
      }
      return u;
    } catch {
      return null;
    }
  }

  public setCurrentUser(
    userData: { email: string; role: UserRole; fullName?: string; id?: string; mobile?: string; profilePhoto?: string } | null,
    targetRole?: string
  ) {
    if (typeof window === "undefined") return;
    if (!userData) {
      localStorage.removeItem(this.STORAGE_KEYS.USER);
      localStorage.removeItem("realjob-user");
      localStorage.removeItem("realjob-user-worker");
      localStorage.removeItem("realjob-user-admin");
      localStorage.removeItem("realjob-user-employer");
      localStorage.removeItem("realjob-role");
      sessionStorage.removeItem("realjob_tab_user");
    } else {
      const str = JSON.stringify(userData);
      localStorage.setItem(this.STORAGE_KEYS.USER, str);
      localStorage.setItem("realjob-user", str);
      localStorage.setItem("realjob-role", userData.role);
      sessionStorage.setItem("realjob_tab_user", str);

      if (userData.role === "worker") {
        localStorage.setItem("realjob-user-worker", str);
      } else {
        localStorage.setItem("realjob-user-admin", str);
        localStorage.setItem("realjob-user-employer", str);
      }
    }
    window.dispatchEvent(new Event("realjob-auth-change"));
    window.dispatchEvent(new Event("storage"));
  }

  public logout(targetRole?: string) {
    this.setCurrentUser(null, targetRole);
  }

  public getExistingJobCategories(): string[] {
    const categoriesSet = new Set<string>();

    // 1. From all jobs
    const allJobs = this.getAllJobs();
    allJobs.forEach((job) => {
      if (job.category && job.category.trim()) {
        categoriesSet.add(job.category.trim());
      }
    });

    // 2. From saved custom categories pool in localStorage
    if (typeof window !== "undefined") {
      try {
        const custom = localStorage.getItem("realjob_custom_categories");
        if (custom) {
          const parsed = JSON.parse(custom);
          if (Array.isArray(parsed)) {
            parsed.forEach((c) => {
              if (typeof c === "string" && c.trim()) {
                categoriesSet.add(c.trim());
              }
            });
          }
        }
      } catch {}
    }

    return Array.from(categoriesSet);
  }

  public addCustomCategory(cat: string): void {
    if (!cat || !cat.trim()) return;
    const cleanCat = cat.trim();
    if (typeof window !== "undefined") {
      try {
        const custom = localStorage.getItem("realjob_custom_categories");
        const list: string[] = custom ? JSON.parse(custom) : [];
        if (!list.some((c) => c.toLowerCase() === cleanCat.toLowerCase())) {
          list.push(cleanCat);
          localStorage.setItem("realjob_custom_categories", JSON.stringify(list));
        }
      } catch {}
    }
  }

  public getSuperadminCategories(): Array<{ label: string; iconName: string; theme?: string }> {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_categories");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.filter((c: any) => !isRemovedTestCategory(c.label));
          }
        } catch {}
      }
    }
    return DEFAULT_SUPERADMIN_CATEGORIES;
  }

  // --- JOBS COLLECTION ---
  public getAllJobs(): JobRecord[] {
    if (typeof window === "undefined") return INITIAL_JOBS;
    const raw = localStorage.getItem(this.STORAGE_KEYS.JOBS);
    if (!raw) {
      localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    try {
      const parsed: JobRecord[] = JSON.parse(raw);
      // Clean up jobs belonging to removed test categories
      const filtered = parsed.filter((j) => !isRemovedTestCategory(j.category));
      let modified = filtered.length !== parsed.length;

      const updated = filtered.map((j) => {
        if (!j.approvalStatus) {
          modified = true;
          return { ...j, approvalStatus: "pending" as ApprovalStatus };
        }
        return j;
      });

      if (modified) {
        localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(updated));
      }
      return updated;
    } catch {
      return INITIAL_JOBS;
    }
  }

  public getActiveJobs(): JobRecord[] {
    return this.getAllJobs().filter(
      (j) => j.status === "Active" && j.approvalStatus === "approved"
    );
  }

  public getPendingJobs(): JobRecord[] {
    return this.getAllJobs().filter((j) => j.approvalStatus === "pending");
  }

  public getApprovedJobs(): JobRecord[] {
    return this.getAllJobs().filter((j) => j.approvalStatus === "approved");
  }

  public getRejectedJobs(): JobRecord[] {
    return this.getAllJobs().filter((j) => j.approvalStatus === "rejected");
  }

  public getJobById(jobId: string): JobRecord | undefined {
    return this.getAllJobs().find((j) => j.id === jobId);
  }

  public createJob(jobData: Omit<JobRecord, "id" | "postedDate" | "postedAgo" | "initials"> & { approvalStatus?: ApprovalStatus }): JobRecord {
    if (jobData.category) {
      this.addCustomCategory(jobData.category);
    }
    const jobs = this.getAllJobs();
    const initials = (jobData.company || "Company").substring(0, 2).toUpperCase();
    const newJob: JobRecord = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString(),
      postedAgo: "Just now",
      initials,
      approvalStatus: jobData.approvalStatus || "pending",
      status: jobData.status || "Active",
    };
    jobs.unshift(newJob);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(jobs));
      
      fbSync(() => setDoc(doc(db, "jobs", newJob.id), newJob));
    }
    return newJob;
  }

  public updateJobApprovalStatus(jobId: string, approvalStatus: ApprovalStatus): JobRecord | null {
    return this.updateJob(jobId, { approvalStatus });
  }

  public updateJob(jobId: string, updates: Partial<JobRecord>): JobRecord | null {
    const jobs = this.getAllJobs();
    const existing = jobs.find((j) => j.id === jobId);
    if (!existing) return null;

    const index = jobs.findIndex((j) => j.id === jobId);
    const updatedJob: JobRecord = { ...existing, ...updates } as JobRecord;
    jobs[index] = updatedJob;

    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(jobs));
      
      fbSync(() => setDoc(doc(db, "jobs", updatedJob.id), updatedJob));
    }
    return updatedJob;
  }

  public deleteJob(jobId: string): boolean {
    let jobs = this.getAllJobs();
    jobs = jobs.filter((j) => j.id !== jobId);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(jobs));
      
      fbSync(() => deleteDoc(doc(db, "jobs", jobId)));
    }
    return true;
  }

  public deleteAllJobs(): boolean {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify([]));
    }
    return true;
  }

  public getEmployerJobs(identifier: string): JobRecord[] {
    const jobs = this.getAllJobs();
    if (!identifier || !identifier.trim()) return [];
    const q = identifier.toLowerCase().trim();
    return jobs.filter((j) => {
      const empId = (j.employerId || "").toLowerCase().trim();
      const comp = (j.company || "").toLowerCase().trim();
      if (!empId && !comp) return false;
      return (
        empId === q ||
        comp === q ||
        (q.length >= 4 && (empId.includes(q) || comp.includes(q)))
      );
    });
  }

  // --- COMMON APPLICATION SYSTEM ---
  public getApplications(): ApplicationRecord[] {
    return this.getAllApplications();
  }

  public getAllApplications(): ApplicationRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.APPLICATIONS);
    if (!raw) return [];
    try {
      const apps: ApplicationRecord[] = JSON.parse(raw);
      let modified = false;
      const updated = apps.map((app) => {
        if (!app.candidateMobile || app.candidateMobile === "9822011223" || app.candidateMobile === "+91 98220 11223") {
          const reg = this.findRegisteredAccount(app.candidateEmail || app.jobSeekerId);
          if (reg?.mobile) {
            modified = true;
            return { ...app, candidateMobile: reg.mobile };
          }
        }
        return app;
      });
      if (modified) {
        localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      }
      return updated;
    } catch {
      return [];
    }
  }

  public hasAlreadyApplied(jobSeekerId: string, jobId: string): boolean {
    const apps = this.getAllApplications();
    return apps.some((a) => (a.jobSeekerId === jobSeekerId || a.candidateEmail === jobSeekerId) && a.jobId === jobId);
  }

  public createApplication(appData: Omit<ApplicationRecord, "id" | "appliedDate" | "status">): ApplicationRecord {
    const apps = this.getAllApplications();

    // Check duplicate
    if (this.hasAlreadyApplied(appData.jobSeekerId, appData.jobId)) {
      throw new Error("Already applied to this job");
    }

    const newApp: ApplicationRecord = {
      ...appData,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      status: "Applied",
    };

    apps.unshift(newApp);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      
      fbSync(() => setDoc(doc(db, "applications", newApp.id), newApp));
    }
    return newApp;
  }

  public getEmployerApplications(identifier: string): ApplicationRecord[] {
    const apps = this.getAllApplications();
    if (!identifier || !identifier.trim()) return [];
    const q = identifier.toLowerCase().trim();
    return apps.filter((a) => {
      const empId = (a.employerId || "").toLowerCase().trim();
      const comp = (a.companyName || "").toLowerCase().trim();
      if (!empId && !comp) return false;
      return (
        empId === q ||
        comp === q ||
        (q.length >= 4 && (empId.includes(q) || comp.includes(q)))
      );
    });
  }

  public getJobSeekerApplications(jobSeekerId: string): ApplicationRecord[] {
    const apps = this.getAllApplications();
    return apps.filter((a) => a.jobSeekerId === jobSeekerId || a.candidateEmail === jobSeekerId);
  }

  public updateApplicationStatus(applicationId: string, status: ApplicationStatus, replyMessage?: string): ApplicationRecord | null {
    const apps = this.getAllApplications();
    const existing = apps.find((a) => a.id === applicationId);
    if (!existing) return null;

    const index = apps.findIndex((a) => a.id === applicationId);
    const updatedApp: ApplicationRecord = {
      ...existing,
      status,
      ...(replyMessage !== undefined ? { replyMessage, replyDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) } : {})
    };
    apps[index] = updatedApp;

    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      
      fbSync(() => updateDoc(doc(db, "applications", updatedApp.id), updatedApp));
    }
    return updatedApp;
  }

  public updateApplicationReply(applicationId: string, replyMessage: string): ApplicationRecord | null {
    const apps = this.getAllApplications();
    const existing = apps.find((a) => a.id === applicationId);
    if (!existing) return null;

    const index = apps.findIndex((a) => a.id === applicationId);
    const updatedApp: ApplicationRecord = {
      ...existing,
      replyMessage,
      replyDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    };
    apps[index] = updatedApp;

    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      
      fbSync(() => updateDoc(doc(db, "applications", updatedApp.id), updatedApp));
    }
    return updatedApp;
  }

  // --- SAVED JOBS ---
  public getSavedJobs(jobSeekerId: string): SavedJobRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.SAVED_JOBS);
    if (!raw) return [];
    try {
      const all: SavedJobRecord[] = JSON.parse(raw);
      return all.filter((s) => s.jobSeekerId === jobSeekerId);
    } catch {
      return [];
    }
  }

  public saveJob(jobSeekerId: string, jobId: string): SavedJobRecord {
    const all = this.getSavedJobs(jobSeekerId);
    if (all.some((s) => s.jobId === jobId)) {
      return all.find((s) => s.jobId === jobId)!;
    }
    const newSaved: SavedJobRecord = {
      id: `save-${Date.now()}`,
      jobSeekerId,
      jobId,
      savedDate: new Date().toISOString(),
    };
    const raw = localStorage.getItem(this.STORAGE_KEYS.SAVED_JOBS);
    const existing: SavedJobRecord[] = raw ? JSON.parse(raw) : [];
    existing.push(newSaved);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.SAVED_JOBS, JSON.stringify(existing));
    }
    return newSaved;
  }

  public removeSavedJob(jobSeekerId: string, jobId: string): boolean {
    const raw = localStorage.getItem(this.STORAGE_KEYS.SAVED_JOBS);
    if (!raw) return true;
    let existing: SavedJobRecord[] = JSON.parse(raw);
    existing = existing.filter((s) => !(s.jobSeekerId === jobSeekerId && s.jobId === jobId));
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.SAVED_JOBS, JSON.stringify(existing));
    }
    return true;
  }

  // --- JOB RECOMMENDATIONS ALGORITHM ---
  public getRecommendedJobs(candidateSkills: string[], candidateCategory?: string): JobRecord[] {
    const allJobs = this.getActiveJobs();
    if (!candidateSkills.length && !candidateCategory) {
      return allJobs.slice(0, 4);
    }

    return allJobs
      .map((job) => {
        let score = 0;
        if (candidateCategory && job.category.toLowerCase().includes(candidateCategory.toLowerCase())) {
          score += 5;
        }
        candidateSkills.forEach((skill) => {
          if (
            job.requiredSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase())) ||
            job.title.toLowerCase().includes(skill.toLowerCase())
          ) {
            score += 3;
          }
        });
        return { job, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.job);
  }

  // --- ALIASES & INTERVIEWS & RESUMES ---
  public getApplicationsByJobSeeker(jobSeekerId: string): ApplicationRecord[] {
    return this.getJobSeekerApplications(jobSeekerId);
  }

  public getInterviews(): InterviewRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.INTERVIEWS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public scheduleInterview(data: Omit<InterviewRecord, "id">): InterviewRecord {
    const interviews = this.getInterviews();
    const newInt: InterviewRecord = {
      ...data,
      id: `int-${Date.now()}`,
    };
    interviews.unshift(newInt);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
    }
    return newInt;
  }

  public getUserResumes(userId: string): UserResumeRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.RESUMES);
    if (!raw) return [];
    try {
      const all: UserResumeRecord[] = JSON.parse(raw);
      return all.filter((r) => r.userId === userId);
    } catch {
      return [];
    }
  }

  public addUserResume(data: Omit<UserResumeRecord, "id" | "uploadDate"> & { uploadDate?: string }): UserResumeRecord {
    const raw = localStorage.getItem(this.STORAGE_KEYS.RESUMES);
    const existing: UserResumeRecord[] = raw ? JSON.parse(raw) : [];
    const newRes: UserResumeRecord = {
      ...data,
      id: `res-${Date.now()}`,
      uploadDate: data.uploadDate || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    };
    existing.unshift(newRes);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.RESUMES, JSON.stringify(existing));
    }
    return newRes;
  }

  public deleteUserResume(id: string): boolean {
    const raw = localStorage.getItem(this.STORAGE_KEYS.RESUMES);
    if (!raw) return true;
    try {
      let existing: UserResumeRecord[] = JSON.parse(raw);
      existing = existing.filter((r) => r.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(this.STORAGE_KEYS.RESUMES, JSON.stringify(existing));
      }
    } catch { }
    return true;
  }

  public getJobSeekerProfile(userId: string): JobSeekerProfile | null {
    if (typeof window === "undefined" || !userId) return null;
    const raw = localStorage.getItem(this.STORAGE_KEYS.PROFILES);
    if (!raw) return null;
    try {
      const profiles: JobSeekerProfile[] = JSON.parse(raw);
      const profile = profiles.find((p) => p.id === userId || p.email === userId) || null;
      if (profile) {
        // Clean legacy auto-generated seed values if present
        if (profile.category === "IT & Software" || profile.category === "General Candidate") {
          profile.category = "";
        }
        if (profile.experience === "2 Years" || profile.experience === "Fresher") {
          profile.experience = "";
        }
        if (profile.education === "B.Tech / Graduate" || profile.education === "Not Specified" || profile.education === "Graduate") {
          profile.education = "";
        }
        if (profile.expectedSalary === "₹ 4.5 LPA" || profile.expectedSalary === "As per standards") {
          profile.expectedSalary = "";
        }
        if (profile.currentLocation === "Pune, Maharashtra" || profile.currentLocation === "Pune") {
          profile.currentLocation = "";
        }
        if (profile.preferredLocation === "Pune, Mumbai, Chakan" || profile.preferredLocation === "Pune, Maharashtra" || profile.preferredLocation === "Pune") {
          profile.preferredLocation = "";
        }
        if (profile.skills?.includes("React") && profile.skills?.includes("JavaScript")) {
          profile.skills = [];
        }
        if (profile.resume?.includes("_resume.pdf")) {
          profile.resume = "";
        }
      }
      return profile;
    } catch {
      return null;
    }
  }

  public saveJobSeekerProfile(profile: Partial<JobSeekerProfile> & { id: string; email: string }): JobSeekerProfile {
    const raw = typeof window !== "undefined" ? localStorage.getItem(this.STORAGE_KEYS.PROFILES) : null;
    const profiles: JobSeekerProfile[] = raw ? JSON.parse(raw) : [];
    
    const existingIndex = profiles.findIndex((p) => p.id === profile.id || p.email === profile.email);
    const found = existingIndex >= 0 ? profiles[existingIndex] : undefined;

    const updatedProfile: JobSeekerProfile = {
      id: profile.id,
      email: profile.email,
      fullName: profile.fullName ?? found?.fullName ?? "User",
      mobile: profile.mobile ?? found?.mobile ?? "",
      education: profile.education ?? found?.education ?? "",
      skills: profile.skills ?? found?.skills ?? [],
      experience: profile.experience ?? found?.experience ?? "",
      currentLocation: profile.currentLocation ?? found?.currentLocation ?? "",
      preferredLocation: profile.preferredLocation ?? found?.preferredLocation ?? "",
      expectedSalary: profile.expectedSalary ?? found?.expectedSalary ?? "",
      category: profile.category ?? found?.category ?? "",
      subcategory: profile.subcategory ?? found?.subcategory ?? "",
      jobType: profile.jobType ?? found?.jobType ?? "Full Time",
      resume: profile.resume ?? found?.resume ?? "",
      resumeName: profile.resumeName ?? found?.resumeName ?? "",
      profilePhoto: profile.profilePhoto ?? found?.profilePhoto ?? "",
      createdAt: found?.createdAt ?? new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = updatedProfile;
    } else {
      profiles.push(updatedProfile);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      fbSync(() => setDoc(doc(db, "profiles", updatedProfile.id), updatedProfile));

      // Also update session user if full name, email, or profile photo changed
      const currentUser = this.getCurrentUser();
      if (currentUser && (currentUser.id === updatedProfile.id || currentUser.email === updatedProfile.email)) {
        this.setCurrentUser({
          ...currentUser,
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          profilePhoto: updatedProfile.profilePhoto || currentUser.profilePhoto || "",
        });
      }
    }
    return updatedProfile;
  }

  public getUserPackages(userId: string): PackageTransaction[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.PACKAGES);
    if (!raw) return [];
    try {
      const all: PackageTransaction[] = JSON.parse(raw);
      return all.filter((p) => p.userId === userId);
    } catch {
      return [];
    }
  }

  /**
   * Record package purchase transaction
   */
  public addPackagePurchase(data: Omit<PackageTransaction, "id" | "purchaseDate" | "status">): PackageTransaction {
    const raw = localStorage.getItem(this.STORAGE_KEYS.PACKAGES);
    const existing: PackageTransaction[] = raw ? JSON.parse(raw) : [];
    const newTx: PackageTransaction = {
      ...data,
      id: `pkg-${Date.now()}`,
      purchaseDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "Completed",
    };
    existing.unshift(newTx);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.PACKAGES, JSON.stringify(existing));
    }
    return newTx;
  }

  /**
   * Get available job credits count for user
   */
  public getUserJobCredits(userId: string): number {
    const packages = this.getUserPackages(userId);
    return packages.reduce((acc, p) => acc + (p.jobCount || 0), 0);
  }

  /**
   * Get dynamic job packages
   */
  public getJobPackages(): JobPackagePlan[] {
    if (typeof window === "undefined") return DEFAULT_JOB_PACKAGES;
    const raw = localStorage.getItem("realjob_db_dynamic_packages");
    if (!raw) return DEFAULT_JOB_PACKAGES;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((pkg: any) => ({
          ...pkg,
          description: pkg.description ? pkg.description.replace(/Employees Included/g, "CRM Included").replace(/Employees/g, "CRM") : pkg.description,
          features: Array.isArray(pkg.features) 
            ? pkg.features.map((f: string) => f.replace(/Employees Addition/g, "CRM Users").replace(/Employees/g, "CRM Users")) 
            : pkg.features
        }));
      }
      return DEFAULT_JOB_PACKAGES;
    } catch {
      return DEFAULT_JOB_PACKAGES;
    }
  }

  /**
   * Save dynamic job packages (SuperAdmin control)
   */
  public saveJobPackages(packages: JobPackagePlan[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("realjob_db_dynamic_packages", JSON.stringify(packages));
  }

  /**
   * Get all package purchases across platform (SuperAdmin view)
   */
  public getAllPackagePurchases(): PackageTransaction[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.PACKAGES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public deletePackagePurchase(txId: string): boolean {
    if (typeof window === "undefined") return false;
    let list = this.getAllPackagePurchases();
    list = list.filter((tx) => tx.id !== txId);
    localStorage.setItem(this.STORAGE_KEYS.PACKAGES, JSON.stringify(list));
    return true;
  }

  public clearPackagePurchases(): boolean {
    if (typeof window === "undefined") return false;
    localStorage.setItem(this.STORAGE_KEYS.PACKAGES, JSON.stringify([]));
    return true;
  }

  /**
   * Consume 1 credit when posting a job
   */
  public consumeJobCredit(userId: string): boolean {
    if (typeof window === "undefined") return false;
    const raw = localStorage.getItem(this.STORAGE_KEYS.PACKAGES);
    if (!raw) return false;
    try {
      const all: PackageTransaction[] = JSON.parse(raw);
      const activePkg = all.find((p) => p.userId === userId && p.jobCount > 0);
      if (!activePkg) return false;
      if (activePkg.jobCount < 999) {
        activePkg.jobCount -= 1;
      }
      localStorage.setItem(this.STORAGE_KEYS.PACKAGES, JSON.stringify(all));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get total allowed employee limit for employer based on active package purchases
   */
  public getUserWorkerCredits(userId: string): number {
    if (typeof window === "undefined" || !userId) return 0;
    try {
      const purchases = this.getAllPackagePurchases().filter((p: PackageTransaction) => p.userId === userId);
      if (!purchases || purchases.length === 0) {
        // Require active package purchase to add employees!
        return 0;
      }
      const livePackages = this.getJobPackages();
      let totalWorkerLimit = 0;
      purchases.forEach((p: PackageTransaction) => {
        if (typeof p.workerCount === "number" && p.workerCount > 0) {
          totalWorkerLimit += p.workerCount;
        } else if (typeof p.workerCount === "string") {
          totalWorkerLimit += isNaN(Number(p.workerCount)) ? 9999 : Number(p.workerCount);
        } else {
          const matchingPlan = livePackages.find(
            (dp) => dp.id === p.planId || dp.name.toLowerCase() === p.planName.toLowerCase()
          );
          if (matchingPlan && matchingPlan.workerCount) {
            totalWorkerLimit += typeof matchingPlan.workerCount === "string" ? (isNaN(Number(matchingPlan.workerCount)) ? 9999 : Number(matchingPlan.workerCount)) : matchingPlan.workerCount;
          } else {
            totalWorkerLimit += 3;
          }
        }
      });
      return totalWorkerLimit;
    } catch {
      return 0;
    }
  }

  // --- EMPLOYER WORKER & ATTENDANCE MANAGEMENT ---
  public getEmployerWorkers(employerId: string): EmployerWorker[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.EMP_WORKERS);
    if (!raw) return [];
    try {
      const deletedIds = new Set<string>(
        JSON.parse(localStorage.getItem("realjob_deleted_worker_ids") || "[]")
      );
      deletedIds.add("empw-1791635953540");
      deletedIds.add("empw-1791785681836");

      const all: EmployerWorker[] = (JSON.parse(raw) as EmployerWorker[]).filter(
        (w) =>
          !deletedIds.has(w.id) &&
          w.status !== "Inactive" &&
          w.status !== "Deleted" &&
          !(w as any).isDeleted
      );
      if (!employerId) return all;

      const currentUser = this.getCurrentUser();
      const validIdentifiers = new Set<string>();
      if (employerId) validIdentifiers.add(employerId.trim().toLowerCase());
      if (currentUser) {
        if (currentUser.id) validIdentifiers.add(currentUser.id.trim().toLowerCase());
        if (currentUser.email) validIdentifiers.add(currentUser.email.trim().toLowerCase());
        if (currentUser.fullName) validIdentifiers.add(currentUser.fullName.trim().toLowerCase());
      }

      const filtered = all.filter((w) => {
        if (!w.employerId) return false;
        const wEmp = w.employerId.trim().toLowerCase();
        return validIdentifiers.has(wEmp);
      });

      return filtered;
    } catch {
      return [];
    }
  }

  public getAllEmployerWorkers(): EmployerWorker[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.EMP_WORKERS);
    if (!raw) return [];
    try {
      const deletedIds = new Set<string>(
        JSON.parse(localStorage.getItem("realjob_deleted_worker_ids") || "[]")
      );
      deletedIds.add("empw-1791635953540");
      deletedIds.add("empw-1791785681836");

      const all: EmployerWorker[] = JSON.parse(raw);
      return all.filter(
        (w) =>
          !deletedIds.has(w.id) &&
          w.status !== "Inactive" &&
          w.status !== "Deleted" &&
          !(w as any).isDeleted
      );
    } catch {
      return [];
    }
  }

  public saveEmployerWorker(worker: Omit<EmployerWorker, "id"> & { id?: string }): EmployerWorker {
    const raw = typeof window !== "undefined" ? localStorage.getItem(this.STORAGE_KEYS.EMP_WORKERS) : null;
    const all: EmployerWorker[] = raw ? JSON.parse(raw) : [];
    const workerId = worker.id || `empw-${Date.now()}`;
    const newWorker: EmployerWorker = {
      ...worker,
      id: workerId,
      status: worker.status || "Active",
      isDeleted: false,
    };
    const index = all.findIndex((w) => w.id === workerId);
    if (index >= 0) {
      all[index] = newWorker;
    } else {
      all.unshift(newWorker);
    }
    if (typeof window !== "undefined") {
      try {
        const deletedIds: string[] = JSON.parse(localStorage.getItem("realjob_deleted_worker_ids") || "[]");
        const filtered = deletedIds.filter((id) => id !== workerId);
        localStorage.setItem("realjob_deleted_worker_ids", JSON.stringify(filtered));
      } catch {}
      localStorage.setItem(this.STORAGE_KEYS.EMP_WORKERS, JSON.stringify(all));
      fbSync(() => setDoc(doc(db, "workers", newWorker.id), newWorker, { merge: true }));
    }
    return newWorker;
  }

  public deleteEmployerWorker(workerId: string): boolean {
    if (typeof window === "undefined" || !workerId) return false;
    const raw = localStorage.getItem(this.STORAGE_KEYS.EMP_WORKERS);
    if (!raw) return false;
    try {
      // Add worker to deleted tombstone list
      try {
        const deletedIds: string[] = JSON.parse(localStorage.getItem("realjob_deleted_worker_ids") || "[]");
        if (!deletedIds.includes(workerId)) {
          deletedIds.push(workerId);
          localStorage.setItem("realjob_deleted_worker_ids", JSON.stringify(deletedIds));
        }
      } catch {}

      const all: EmployerWorker[] = JSON.parse(raw);
      const targetWorker = all.find((w) => w.id === workerId);
      const filtered = all.filter((w) => w.id !== workerId);
      localStorage.setItem(this.STORAGE_KEYS.EMP_WORKERS, JSON.stringify(filtered));

      // Clean up session if this employee is currently logged in on this machine
      try {
        const sessionUser = JSON.parse(localStorage.getItem("realjob-user") || "null");
        if (
          sessionUser &&
          (sessionUser.id === workerId ||
            (targetWorker?.mobile && (sessionUser.mobile || "").replace(/\D/g, "") === (targetWorker.mobile || "").replace(/\D/g, "")))
        ) {
          localStorage.removeItem("realjob-user");
        }
      } catch {}

      // Fire sync delete to Firestore
      fbSync(async () => {
        try {
          await setDoc(doc(db, "workers", workerId), { status: "Deleted", isDeleted: true }, { merge: true });
        } catch {}
        try {
          await deleteDoc(doc(db, "workers", workerId));
        } catch {}
      });
      return true;
    } catch {
      return false;
    }
  }

  public getAllAttendance(): DailyAttendanceRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as DailyAttendanceRecord[];
    } catch {
      return [];
    }
  }

  public getEmployerAttendance(employerId: string, date?: string): DailyAttendanceRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE);
    if (!raw) return [];
    try {
      const all: DailyAttendanceRecord[] = JSON.parse(raw);
      const currentUser = this.getCurrentUser();
      const validIdentifiers = new Set<string>();
      if (employerId) validIdentifiers.add(employerId.trim().toLowerCase());
      if (currentUser) {
        if (currentUser.id) validIdentifiers.add(currentUser.id.trim().toLowerCase());
        if (currentUser.email) validIdentifiers.add(currentUser.email.trim().toLowerCase());
        if (currentUser.fullName) validIdentifiers.add(currentUser.fullName.trim().toLowerCase());
      }

      let res = all.filter((a) => {
        if (!a.employerId) return true;
        return validIdentifiers.has(a.employerId.trim().toLowerCase());
      });
      if (res.length === 0 && all.length > 0) {
        res = all; // Fallback
      }
      if (date) {
        res = res.filter((a) => a.date === date);
      }
      return res.map(r => {
        if (r.punchInTime && r.punchOutTime) {
          const parseM = (t: string) => {
            const match = t.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
            if (!match || !match[1] || !match[2]) return null;
            let h = parseInt(match[1], 10);
            const min = parseInt(match[2], 10);
            if (match[3] === "PM" && h < 12) h += 12;
            if (match[3] === "AM" && h === 12) h = 0;
            return h * 60 + min;
          };
          const inM = parseM(r.punchInTime);
          const outM = parseM(r.punchOutTime);
          if (inM !== null && outM !== null && outM < inM) {
            const copy = { ...r };
            delete copy.punchOutTime;
            delete copy.punchOutLocation;
            return copy;
          }
        }
        return r;
      });
    } catch {
      return [];
    }
  }

  public getEmployerAttendanceRange(employerId: string, startDate?: string, endDate?: string): DailyAttendanceRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE);
    if (!raw) return [];
    try {
      const all: DailyAttendanceRecord[] = JSON.parse(raw);
      const currentUser = this.getCurrentUser();
      const validIdentifiers = new Set<string>();
      if (employerId) validIdentifiers.add(employerId.trim().toLowerCase());
      if (currentUser) {
        if (currentUser.id) validIdentifiers.add(currentUser.id.trim().toLowerCase());
        if (currentUser.email) validIdentifiers.add(currentUser.email.trim().toLowerCase());
        if (currentUser.fullName) validIdentifiers.add(currentUser.fullName.trim().toLowerCase());
      }

      let res = all.filter((a) => {
        if (!a.employerId) return true;
        return validIdentifiers.has(a.employerId.trim().toLowerCase());
      });
      if (res.length === 0 && all.length > 0) {
        res = all; // Fallback
      }
      if (startDate) {
        res = res.filter((a) => a.date >= startDate);
      }
      if (endDate) {
        res = res.filter((a) => a.date <= endDate);
      }
      return res;
    } catch {
      return [];
    }
  }

  public saveAttendanceStatus(
    employerId: string,
    workerId: string,
    workerName: string,
    date: string,
    status: "Present" | "HalfDay" | "Absent" | "Overtime",
    notes?: string,
    punchData?: {
      punchInTime?: string;
      punchOutTime?: string;
      punchInLocation?: { lat: number; lng: number };
      punchOutLocation?: { lat: number; lng: number };
    },
    overtimeHoursOrExtra?: number | { overtimeHours?: number; overtimePay?: number },
    extraDataParam?: { overtimeHours?: number; overtimePay?: number }
  ): DailyAttendanceRecord {
    const todayStr = new Date().toISOString().split("T")[0];
    if (date > todayStr) {
      console.warn(`[dataStore] Attendance cannot be marked for future date: ${date}`);
      return all.find((a) => a.id === `att-${workerId}-${date}`) || {
        id: `att-${workerId}-${date}`,
        employerId,
        workerId,
        workerName,
        date,
        status,
        punchInTime: undefined,
        punchOutTime: undefined,
        workDurationMinutes: 0,
        overtimeMinutes: 0,
      };
    }

    const recordId = `att-${workerId}-${date}`;
    const index = all.findIndex((a) => a.id === recordId || (a.workerId === workerId && a.date === date));

    const extraData = typeof overtimeHoursOrExtra === "object" ? overtimeHoursOrExtra : extraDataParam;
    const numericOtHours = typeof overtimeHoursOrExtra === "number" ? overtimeHoursOrExtra : extraData?.overtimeHours;
    
    let newRecord: DailyAttendanceRecord;
    
    // Create new punch log entry if punchData is provided
    const newPunchLogEntry = punchData?.punchInTime && punchData.punchInLocation 
      ? { type: "in" as const, time: punchData.punchInTime, location: punchData.punchInLocation } 
      : punchData?.punchOutTime && punchData.punchOutLocation 
        ? { type: "out" as const, time: punchData.punchOutTime, location: punchData.punchOutLocation }
        : null;
    
    if (index >= 0) {
      const existing = all[index] as DailyAttendanceRecord;
      const isRePunchIn = !!punchData?.punchInTime && !punchData?.punchOutTime;
      
      const updatedPunchLog = existing.punchLog ? [...existing.punchLog] : [];
      if (newPunchLogEntry) updatedPunchLog.unshift(newPunchLogEntry); // Keep newest at the top
      
      const finalOtHours = numericOtHours !== undefined
        ? numericOtHours
        : (status === "Overtime" ? (existing.overtimeHours || 2) : 0);
      const finalOtPay = extraData?.overtimePay !== undefined ? extraData.overtimePay : existing.overtimePay;

      newRecord = {
        ...existing,
        status: status,
        overtimeHours: finalOtHours,
        ...(finalOtPay !== undefined ? { overtimePay: finalOtPay } : {}),
        punchLog: updatedPunchLog,
        updatedAt: new Date().toISOString(),
      };
      const finalNotes = notes ? (existing.notes ? existing.notes + " | " + notes : notes) : existing.notes;
      if (finalNotes) newRecord.notes = finalNotes;
      const inTime = punchData?.punchInTime || existing.punchInTime;
      const inLoc = punchData?.punchInLocation || existing.punchInLocation;
      if (inTime) newRecord.punchInTime = inTime;
      if (inLoc) newRecord.punchInLocation = inLoc;
      if (isRePunchIn) {
        delete newRecord.punchOutTime;
        delete newRecord.punchOutLocation;
      } else {
        const outTime = punchData?.punchOutTime || existing.punchOutTime;
        const outLoc = punchData?.punchOutLocation || existing.punchOutLocation;
        if (outTime) newRecord.punchOutTime = outTime;
        if (outLoc) newRecord.punchOutLocation = outLoc;
      }
      all[index] = newRecord;
    } else {
      const finalOtHours = numericOtHours !== undefined
        ? numericOtHours
        : (status === "Overtime" ? 2 : 0);
      const finalOtPay = extraData?.overtimePay !== undefined ? extraData.overtimePay : undefined;

      newRecord = {
        id: recordId,
        employerId,
        workerId,
        workerName,
        date,
        status,
        overtimeHours: finalOtHours,
        ...(finalOtPay !== undefined ? { overtimePay: finalOtPay } : {}),
        notes: notes || "",
        punchInTime: punchData?.punchInTime,
        punchOutTime: punchData?.punchOutTime,
        punchInLocation: punchData?.punchInLocation,
        punchOutLocation: punchData?.punchOutLocation,
        punchLog: newPunchLogEntry ? [newPunchLogEntry] : [],
        updatedAt: new Date().toISOString(),
      } as DailyAttendanceRecord;
      all.push(newRecord);
    }
    
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
      const cleanRecord = JSON.parse(JSON.stringify(newRecord));
      fbSync(() => setDoc(doc(db, "attendance", newRecord.id), cleanRecord));
    }
    return newRecord;
  }

  public saveBulkAttendance(
    employerId: string,
    workerId: string,
    workerName: string,
    dates: string[],
    status: "Present" | "HalfDay" | "Absent" | "Overtime",
    overtimeHours?: number,
    notes?: string
  ): DailyAttendanceRecord[] {
    const raw = typeof window !== "undefined" ? localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE) : null;
    const all: DailyAttendanceRecord[] = raw ? JSON.parse(raw) : [];
    const savedRecords: DailyAttendanceRecord[] = [];

    const finalOtHours = overtimeHours !== undefined
      ? overtimeHours
      : (status === "Overtime" ? 2 : 0);

    const todayStr = new Date().toISOString().split("T")[0];
    const validDates = dates.filter((d) => d <= todayStr);

    validDates.forEach((date) => {
      const recordId = `att-${workerId}-${date}`;
      const index = all.findIndex((a) => a.id === recordId || (a.workerId === workerId && a.date === date));
      let record: DailyAttendanceRecord;

      if (index >= 0) {
        record = {
          ...all[index]!,
          status,
          overtimeHours: finalOtHours,
          updatedAt: new Date().toISOString(),
        };
        if (notes) record.notes = notes;
        all[index] = record;
      } else {
        record = {
          id: recordId,
          employerId,
          workerId,
          workerName,
          date,
          status,
          overtimeHours: finalOtHours,
          notes: notes || "",
          updatedAt: new Date().toISOString(),
        };
        all.push(record);
      }
      savedRecords.push(record);
      const cleanRecord = JSON.parse(JSON.stringify(record));
      fbSync(() => setDoc(doc(db, "attendance", record.id), cleanRecord));
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
    }
    return savedRecords;
  }
  public deleteAttendanceRecord(workerId: string, date: string): boolean {
    if (typeof window === "undefined") return false;
    const raw = localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE);
    if (!raw) return false;
    try {
      const all: DailyAttendanceRecord[] = JSON.parse(raw);
      const recordId = `att-${workerId}-${date}`;
      const filtered = all.filter(
        (a) => !(a.id === recordId || (a.workerId === workerId && a.date === date))
      );
      localStorage.setItem(this.STORAGE_KEYS.ATTENDANCE, JSON.stringify(filtered));
      // Also remove from Firestore
      fbSync(async () => {
        try { await deleteDoc(doc(db, "attendance", recordId)); } catch {}
      });
      return true;
    } catch {
      return false;
    }
  }

  public removeAttendanceStatus(workerId: string, date: string): boolean {
    return this.deleteAttendanceRecord(workerId, date);
  }

  public replyToApplication(applicationId: string, replyMessage: string): ApplicationRecord | null {
    return this.updateApplicationReply(applicationId, replyMessage);
  }
}

export const dataStore = new DataStoreManager();

function escapeHtmlStr(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function openApplicationDocument(
  app: Partial<ApplicationRecord>,
  fieldKey: string = "resume",
  rawValue: string = ""
): Promise<void> {
  if (typeof window === "undefined") return;

  const kLower = (fieldKey || "resume").toLowerCase();
  const fieldVals = (app.fieldValues || {}) as Record<string, any>;

  // Determine display file name
  let fileName =
    rawValue && !rawValue.startsWith("data:")
      ? rawValue.trim()
      : app.resume && !app.resume.startsWith("data:")
      ? app.resume.trim()
      : `${(app.candidateName || "Candidate").replace(/\s+/g, "_")}_${fieldKey}.pdf`;

  // Open target tab synchronously on user click so popup blocker never blocks it
  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Opening ${escapeHtmlStr(fileName)}...</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #525659; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; }
  </style>
</head>
<body>
  <div>Loading ${escapeHtmlStr(fileName)}...</div>
</body>
</html>`);

  // 1. Try to locate base64 data URL or direct URL in application/profile state
  let fileDataUrl = "";
  if (typeof fieldVals[`_file_${fieldKey}`] === "string" && fieldVals[`_file_${fieldKey}`]) {
    fileDataUrl = fieldVals[`_file_${fieldKey}`];
  } else if (typeof fieldVals[`${fieldKey}DataUrl`] === "string" && fieldVals[`${fieldKey}DataUrl`]) {
    fileDataUrl = fieldVals[`${fieldKey}DataUrl`];
  } else if (
    typeof rawValue === "string" &&
    (rawValue.startsWith("data:") || rawValue.startsWith("http://") || rawValue.startsWith("https://") || rawValue.startsWith("blob:"))
  ) {
    fileDataUrl = rawValue;
  } else if (kLower.includes("resume") || kLower.includes("cv")) {
    if (
      typeof app.resume === "string" &&
      (app.resume.startsWith("data:") || app.resume.startsWith("http://") || app.resume.startsWith("https://"))
    ) {
      fileDataUrl = app.resume;
    }
    if (!fileDataUrl) {
      const p1 = app.jobSeekerId ? dataStore.getJobSeekerProfile(app.jobSeekerId) : null;
      const p2 = !p1 && app.candidateEmail ? dataStore.getJobSeekerProfile(app.candidateEmail) : null;
      const prof = p1 || p2;
      if (prof?.resume && (prof.resume.startsWith("data:") || prof.resume.startsWith("http"))) {
        fileDataUrl = prof.resume;
        if (prof.resumeName && !rawValue) fileName = prof.resumeName;
      }
    }
    if (!fileDataUrl) {
      try {
        const allApps = dataStore.getAllApplications();
        const other = allApps.find(
          (oa) =>
            oa.fieldValues?.[`_file_${fieldKey}`]?.startsWith("data:") &&
            fileName &&
            oa.fieldValues?.[fieldKey] === fileName
        );
        if (other?.fieldValues?.[`_file_${fieldKey}`]) {
          fileDataUrl = other.fieldValues[`_file_${fieldKey}`] || "";
        }
      } catch {}
    }
  }

  // 2. If direct external URL or blob URL, navigate immediately
  if (
    fileDataUrl.startsWith("http://") ||
    fileDataUrl.startsWith("https://") ||
    fileDataUrl.startsWith("blob:")
  ) {
    win.location.replace(fileDataUrl);
    return;
  }

  // 3. Resolve actual file Blob (either from data: URL or from local server / uploads folder)
  let fileBlob: Blob | null = null;
  let mimeType = "";

  if (fileDataUrl.startsWith("data:")) {
    try {
      const commaIdx = fileDataUrl.indexOf(",");
      const header = commaIdx >= 0 ? fileDataUrl.slice(0, commaIdx) : "";
      const base64Data = commaIdx >= 0 ? fileDataUrl.slice(commaIdx + 1) : "";
      const mimeMatch = header.match(/data:([^;]+)/i);
      mimeType = (mimeMatch && mimeMatch[1]) ? mimeMatch[1].toLowerCase() : "";
      const binaryStr = atob(base64Data);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      fileBlob = new Blob([bytes], { type: mimeType || "application/octet-stream" });
    } catch (e) {
      console.error("Failed decoding data URL:", e);
    }
  }

  if (!fileBlob && fileName) {
    try {
      const res = await fetch(`/__local_file?name=${encodeURIComponent(fileName)}`);
      if (res.ok) {
        mimeType = (res.headers.get("content-type") || "").toLowerCase();
        fileBlob = await res.blob();
      } else {
        const fallbackRes = await fetch(`/uploads/${encodeURIComponent(fileName)}`);
        if (fallbackRes.ok) {
          mimeType = (fallbackRes.headers.get("content-type") || "").toLowerCase();
          fileBlob = await fallbackRes.blob();
        }
      }
    } catch (e) {
      console.warn("Local file fetch error:", e);
    }
  }

  if (!fileBlob) {
    win.document.open();
    win.document.write(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${escapeHtmlStr(fileName)}</title></head>
<body style="font-family:system-ui,sans-serif;padding:40px;text-align:center;background:#F8FAFC;color:#10233F;">
  <h2>File "${escapeHtmlStr(fileName)}" could not be found</h2>
  <p style="color:#5B6B7F;margin-top:8px;">Please re-upload the file to view it.</p>
</body>
</html>`);
    win.document.close();
    return;
  }

  const isPdf = mimeType.includes("pdf") || /\.pdf$/i.test(fileName);
  const isImage = mimeType.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(fileName);
  const isDocx =
    /\.docx$/i.test(fileName) ||
    mimeType.includes("officedocument.wordprocessingml.document");

  // 4. Native browser view for PDF and Images
  if (isPdf || isImage) {
    const typedBlob = new Blob([fileBlob], {
      type: isPdf ? "application/pdf" : mimeType || "image/png",
    });
    const blobUrl = URL.createObjectURL(typedBlob);
    win.location.replace(blobUrl);
    return;
  }

  // 5. Exact Word (.docx) document rendering in the opened tab using docx-preview
  if (isDocx) {
    const downloadUrl = URL.createObjectURL(
      new Blob([fileBlob], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
    );

    win.document.open();
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtmlStr(fileName)}</title>
  <style id="docx-styles">
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      background: #525659;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .viewer-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #323639;
      color: #f1f1f1;
      height: 48px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    }
    .viewer-title {
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .viewer-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .viewer-btn {
      background: #8ab4f8;
      color: #202124;
      border: none;
      border-radius: 4px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .viewer-btn.secondary {
      background: rgba(255,255,255,0.12);
      color: #fff;
    }
    #docx-container {
      min-height: calc(100vh - 48px);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 12px;
    }
    @media print {
      body { background: #fff; }
      .viewer-toolbar { display: none !important; }
      #docx-container { padding: 0; }
    }
  </style>
  <div id="docx-injected-styles"></div>
</head>
<body>
  <div class="viewer-toolbar">
    <div class="viewer-title">${escapeHtmlStr(fileName)}</div>
    <div class="viewer-actions">
      <a class="viewer-btn" href="${downloadUrl}" download="${escapeHtmlStr(fileName)}">⬇ Download</a>
    </div>
  </div>
  <div id="docx-container"></div>
</body>
</html>`);
    win.document.close();

    try {
      const { renderAsync } = await import("docx-preview");
      const container = win.document.getElementById("docx-container");
      const styleContainer = win.document.getElementById("docx-injected-styles") || undefined;
      if (container) {
        await renderAsync(fileBlob, container, styleContainer, {
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          useBase64URL: true,
        });
      }
    } catch (err) {
      console.error("docx-preview error:", err);
      win.location.replace(downloadUrl);
    }
    return;
  }

  // 6. Any other file format (.doc, etc.) -> open/download blob directly
  const blobUrl = URL.createObjectURL(fileBlob);
  win.location.replace(blobUrl);
}

