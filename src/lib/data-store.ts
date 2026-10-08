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
  name: string;
  mobile: string;
  trade: string;
  category?: string;
  education?: string;
  dailyRate: number;
  joiningDate: string;
  status: "Active" | "Inactive";
  workShiftStart?: string;
  workShiftEnd?: string;
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
  punchInTime?: string;
  punchOutTime?: string;
  punchInLocation?: { lat: number; lng: number };
  punchOutLocation?: { lat: number; lng: number };
  notes?: string;
  updatedAt: string;
};

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

const INITIAL_JOBS: JobRecord[] = [];

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
  };

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults() {
    if (typeof window === "undefined") return;

    if (!localStorage.getItem(this.STORAGE_KEYS.JOBS)) {
      localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify([]));
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
    
    // Bidirectional sync with Firebase
    fbSync(async () => {
      const jobsSnap = await getDocs(collection(db, "jobs"));
      const appsSnap = await getDocs(collection(db, "applications"));

      if (!jobsSnap.empty) {
        // Firebase has jobs → use Firebase as source of truth
        const fbJobs = jobsSnap.docs.map(d => d.data());
        localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(fbJobs));
      } else {
        // Firebase empty → push local jobs to Firebase
        const localJobs: JobRecord[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.JOBS) || "[]");
        for (const job of localJobs) {
          await setDoc(doc(db, "jobs", job.id), job);
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
    });
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

  public registerAccount(user: { email: string; password?: string; mobile?: string; role: UserRole; fullName: string; profilePhoto?: string }): RegisteredUser {
    const list = this.getRegisteredUserAccounts();
    const cleanEmail = user.email.trim().toLowerCase();
    const existingIndex = list.findIndex(u => u.email.toLowerCase() === cleanEmail);
    const fallbackName = cleanEmail.split("@")[0] || "User";
    
    const account: RegisteredUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      password: user.password || "",
      mobile: user.mobile || "",
      role: user.role,
      fullName: user.fullName || fallbackName,
      profilePhoto: user.profilePhoto || "",
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...account };
    } else {
      list.push(account);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("realjob_db_registered_users", JSON.stringify(list));
      fbSync(() => setDoc(doc(db, "users", account.id), account));
    }
    return account;
  }

  public updateRegisteredAccount(userId: string, updates: Partial<RegisteredUser>): RegisteredUser | null {
    const list = this.getRegisteredUserAccounts();
    const index = list.findIndex(u => u.id === userId);
    if (index >= 0) {
      const updated = { ...list[index], ...updates } as RegisteredUser;
      list[index] = updated;
      if (typeof window !== "undefined") {
        localStorage.setItem("realjob_db_registered_users", JSON.stringify(list));
        fbSync(() => updateDoc(doc(db, "users", userId), updated));
      }
      return updated;
    }
    return null;
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
      let modified = false;
      const updated = parsed.map((j) => {
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
        } else {
          const matchingPlan = livePackages.find(
            (dp) => dp.id === p.planId || dp.name.toLowerCase() === p.planName.toLowerCase()
          );
          if (matchingPlan && matchingPlan.workerCount) {
            totalWorkerLimit += matchingPlan.workerCount;
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
    if (typeof window === "undefined" || !employerId) return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.EMP_WORKERS);
    if (!raw) return [];
    try {
      const all: EmployerWorker[] = JSON.parse(raw);
      return all.filter((w) => w.employerId === employerId);
    } catch {
      return [];
    }
  }

  public getAllEmployerWorkers(): EmployerWorker[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.EMP_WORKERS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
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
    };
    const index = all.findIndex((w) => w.id === workerId);
    if (index >= 0) {
      all[index] = newWorker;
    } else {
      all.unshift(newWorker);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.EMP_WORKERS, JSON.stringify(all));
    }
    return newWorker;
  }

  public deleteEmployerWorker(workerId: string): boolean {
    if (typeof window === "undefined" || !workerId) return false;
    const raw = localStorage.getItem(this.STORAGE_KEYS.EMP_WORKERS);
    if (!raw) return false;
    try {
      const all: EmployerWorker[] = JSON.parse(raw);
      const filtered = all.filter((w) => w.id !== workerId);
      localStorage.setItem(this.STORAGE_KEYS.EMP_WORKERS, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }

  public getEmployerAttendance(employerId: string, date?: string): DailyAttendanceRecord[] {
    if (typeof window === "undefined" || !employerId) return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE);
    if (!raw) return [];
    try {
      const all: DailyAttendanceRecord[] = JSON.parse(raw);
      let res = all.filter((a) => a.employerId === employerId);
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
    if (typeof window === "undefined" || !employerId) return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE);
    if (!raw) return [];
    try {
      const all: DailyAttendanceRecord[] = JSON.parse(raw);
      let res = all.filter((a) => a.employerId === employerId);
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
    }
  ): DailyAttendanceRecord {
    const raw = typeof window !== "undefined" ? localStorage.getItem(this.STORAGE_KEYS.ATTENDANCE) : null;
    const all: DailyAttendanceRecord[] = raw ? JSON.parse(raw) : [];
    const recordId = `att-${workerId}-${date}`;
    const index = all.findIndex((a) => a.id === recordId || (a.workerId === workerId && a.date === date));
    
    let newRecord: DailyAttendanceRecord;
    
    if (index >= 0) {
      const existing = all[index] as DailyAttendanceRecord;
      const isRePunchIn = !!punchData?.punchInTime && !punchData?.punchOutTime;
      newRecord = {
        ...existing,
        status: status,
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
      newRecord = {
        id: recordId,
        employerId,
        workerId,
        workerName,
        date,
        status,
        notes: notes || "",
        punchInTime: punchData?.punchInTime,
        punchOutTime: punchData?.punchOutTime,
        punchInLocation: punchData?.punchInLocation,
        punchOutLocation: punchData?.punchOutLocation,
        updatedAt: new Date().toISOString(),
      } as DailyAttendanceRecord;
      all.push(newRecord);
    }
    
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
    }
    return newRecord;
  }
}

export const dataStore = new DataStoreManager();

