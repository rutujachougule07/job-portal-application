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

export type UserRole = "worker" | "employer" | "admin";

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
  createdAt: string;
};

export type EmployerProfile = {
  id: string;
  email: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  location: string;
  businessInfo: string;
  industry: string;
  size: string;
  createdAt: string;
};

export type SalaryType = "Daily" | "Monthly" | "Yearly";
export type JobType = "Full Time" | "Part Time" | "Contract" | "Internship" | "Daily Wage" | "Temporary";
export type WorkMode = "On-site" | "Work From Home" | "Hybrid";
export type JobStatus = "Active" | "Closed";

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

// INITIAL SEED DATA FOR REAL JOBS (Initially 100% empty; populated when employers post real jobs)
const INITIAL_JOBS: JobRecord[] = [];

class DataStoreManager {
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
    
    // Background sync from Firebase to LocalStorage
    fbSync(async () => {
      const jobsSnap = await getDocs(collection(db, "jobs"));
      if (!jobsSnap.empty) {
        const fbJobs = jobsSnap.docs.map(d => d.data());
        localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(fbJobs));
      }
      const appsSnap = await getDocs(collection(db, "applications"));
      if (!appsSnap.empty) {
        const fbApps = appsSnap.docs.map(d => d.data());
        localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify(fbApps));
      }
    });
  }

  public getRegisteredUsers(): Array<{ id: string; email: string; mobile?: string; role: UserRole; fullName: string }> {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("realjob_db_registered_users");
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // --- USER AUTHENTICATION & CURRENT SESSION ---
  public getCurrentUser(): { email: string; role: UserRole; fullName?: string; id?: string } | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(this.STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public setCurrentUser(userData: { email: string; role: UserRole; fullName?: string; id?: string } | null) {
    if (typeof window === "undefined") return;
    if (!userData) {
      localStorage.removeItem(this.STORAGE_KEYS.USER);
    } else {
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(userData));
    }
  }

  public logout() {
    this.setCurrentUser(null);
  }

  // --- JOBS COLLECTION ---
  public getAllJobs(): JobRecord[] {
    if (typeof window === "undefined") return INITIAL_JOBS;
    const raw = localStorage.getItem(this.STORAGE_KEYS.JOBS);
    if (!raw) return INITIAL_JOBS;
    try {
      const parsed: JobRecord[] = JSON.parse(raw);
      // Clean out legacy seed jobs and test entries (e.g. software company / alpha byete)
      const cleaned = parsed.filter(
        (j) =>
          !j.id.startsWith("job-c") &&
          !j.id.startsWith("job-it") &&
          !j.id.startsWith("job-eng") &&
          !j.id.startsWith("job-hc") &&
          !j.id.startsWith("job-tr") &&
          !j.id.startsWith("job-ag") &&
          !j.id.startsWith("job-fin") &&
          !j.id.startsWith("job-sm") &&
          !j.id.startsWith("job-edu") &&
          !j.id.startsWith("job-mfg") &&
          !j.id.startsWith("job-hr") &&
          !j.id.startsWith("job-hosp") &&
          !j.id.startsWith("job-log") &&
          !j.id.startsWith("job-gov") &&
          !j.id.startsWith("job-legal") &&
          !j.id.startsWith("job-arch") &&
          !j.id.startsWith("job-ret") &&
          !j.id.startsWith("job-bpo") &&
          !j.id.startsWith("job-des") &&
          !j.id.startsWith("c-") &&
          !j.id.startsWith("it-") &&
          !j.id.startsWith("eng-") &&
          !j.id.startsWith("hc-") &&
          !j.id.startsWith("fin-") &&
          !j.id.startsWith("sm-") &&
          !j.id.startsWith("edu-") &&
          !j.id.startsWith("mfg-") &&
          !j.id.startsWith("hr-") &&
          !j.id.startsWith("hosp-") &&
          !j.id.startsWith("log-") &&
          !j.id.startsWith("gov-") &&
          !j.id.startsWith("leg-") &&
          !j.id.startsWith("arch-") &&
          !j.id.startsWith("ret-") &&
          !j.id.startsWith("bpo-") &&
          !j.id.startsWith("des-") &&
          !j.id.startsWith("agri-") &&
          !j.id.startsWith("sci-") &&
          !j.id.startsWith("med-") &&
          j.company?.toLowerCase() !== "alpha byete" &&
          j.title?.toLowerCase() !== "software company"
      );
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return INITIAL_JOBS;
    }
  }

  public getActiveJobs(): JobRecord[] {
    return this.getAllJobs().filter((j) => j.status === "Active");
  }

  public getJobById(jobId: string): JobRecord | undefined {
    return this.getAllJobs().find((j) => j.id === jobId);
  }

  public createJob(jobData: Omit<JobRecord, "id" | "postedDate" | "postedAgo" | "initials">): JobRecord {
    const jobs = this.getAllJobs();
    const initials = (jobData.company || "Company").substring(0, 2).toUpperCase();
    const newJob: JobRecord = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString(),
      postedAgo: "Just now",
      initials,
    };
    jobs.unshift(newJob);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(jobs));
      
      fbSync(() => setDoc(doc(db, "jobs", newJob.id), newJob));
    }
    return newJob;
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
    if (!identifier) return [];
    const q = identifier.toLowerCase().trim();
    return jobs.filter((j) => {
      const empId = (j.employerId || "").toLowerCase();
      const comp = (j.company || "").toLowerCase();
      return (
        empId === q ||
        comp === q ||
        (empId && empId.includes(q)) ||
        (q && q.includes(empId)) ||
        (comp && comp.includes(q)) ||
        (q && q.includes(comp))
      );
    });
  }

  // --- COMMON APPLICATION SYSTEM ---
  public getAllApplications(): ApplicationRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(this.STORAGE_KEYS.APPLICATIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
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
    if (!identifier) return [];
    const q = identifier.toLowerCase().trim();
    return apps.filter((a) => {
      const empId = (a.employerId || "").toLowerCase();
      const comp = (a.companyName || "").toLowerCase();
      return (
        empId === q ||
        comp === q ||
        (empId && empId.includes(q)) ||
        (q && q.includes(empId)) ||
        (comp && comp.includes(q)) ||
        (q && q.includes(comp))
      );
    });
  }

  public getJobSeekerApplications(jobSeekerId: string): ApplicationRecord[] {
    const apps = this.getAllApplications();
    return apps.filter((a) => a.jobSeekerId === jobSeekerId || a.candidateEmail === jobSeekerId);
  }

  public updateApplicationStatus(applicationId: string, status: ApplicationStatus): ApplicationRecord | null {
    const apps = this.getAllApplications();
    const existing = apps.find((a) => a.id === applicationId);
    if (!existing) return null;

    const index = apps.findIndex((a) => a.id === applicationId);
    const updatedApp: ApplicationRecord = { ...existing, status };
    apps[index] = updatedApp;

    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      
      fbSync(() => updateDoc(doc(db, "applications", updatedApp.id), { status }));
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
}

export const dataStore = new DataStoreManager();

