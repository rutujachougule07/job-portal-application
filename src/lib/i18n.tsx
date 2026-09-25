import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const languages = [
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
] as const;

const en = {
  brand: "REAL JOB",
  tagline: "Find Work | Find Workers",
  marathiTagline: "कामगार शोधा... काम मिळवा... सर्व काही ऑनलाइन!",
  marathiSubtagline: "योग्य माणूस • योग्य काम • योग्य संधी",
  chooseLanguage: "Choose Your Language",
  languageSubtitle: "Select your preferred language to continue",
  continue: "Continue",
  selectRole: "Select Your Profile",
  roleSubtitle: "Choose how you would like to use REAL JOB",
  jobSeeker: "Worker (Job Seeker)",
  jobSeekerDesc: "Find verified jobs, connect directly with employers and track applications.",
  jobProvider: "Employer (Hirer)",
  jobProviderDesc: "Search skilled workers, post jobs and hire instantly.",
  backToLanguage: "Change Language",
  viewWebsite: "View Website",
  viewDashboard: "Go to Dashboard",
  home: "Home",
  jobs: "Find Jobs",
  workers: "Find Workers",
  categories: "Categories",
  aboutUs: "About Us",
  contactUs: "Contact",
  faq: "FAQ",
  applications: "Applications",
  messages: "Messages",
  notifications: "Notifications",
  profile: "My Profile",
  settings: "Settings",
  signIn: "Login",
  register: "Register",
  logout: "Logout",
  heroTitle: "Find Work | Find Workers",
  heroSubtitle: "India's premier verified job marketplace for skilled, technical and general workforce.",
  findJob: " मला काम पाहिजे",
  hireTalent: " मला कामगार पाहिजे",
  browseJobs: "Browse Jobs",
  searchPlaceholder: "Job title, skill, profession, or keyword",
  location: "Location / City",
  search: "Search Now",
  popularJobs: "Featured Jobs",
  popularCategories: "Job Categories",
  viewAll: "View All",
  apply: "Apply Now",
  save: "Save Job",
  howWorks: "How REAL JOB Works",
  whyUs: "Why Choose REAL JOB",
  employers: "Trusted Employers",
  stories: "Success Stories",
  download: "Download Mobile App",
  seeker: "I Want Work",
  seekerDesc: "Find jobs near you with instant employer call.",
  employer: "I Want Workers",
  employerDesc: "Search 50,000+ verified workers & post jobs.",
  welcome: "Welcome to REAL JOB",
  email: "Email address or Mobile number",
  password: "Password",
  fullName: "Full Name",
  forgot: "Forgot Password?",
  google: "Continue with Google",
  noAccount: "New to REAL JOB?",
  hasAccount: "Already have an account?",
  authSubtitle: "Access jobs, hiring solutions and worker profiles in one platform.",
  dashboard: "Dashboard",
  applicants: "Applicants",
  employees: "Workers",
  reports: "Reports",
  users: "Users",
  adminManagement: "Admin Panel",
  activeJobs: "Active Jobs",
  totalJobs: "Total Jobs",
  shortlisted: "Shortlisted",
  interviews: "Interviews",
  selected: "Hired",
  totalUsers: "Total Workers",
  totalEmployers: "Total Employers",
};

const partial: Record<string, Partial<typeof en>> = {
  mr: {
    brand: "REAL JOB",
    tagline: "Find Work | Find Workers",
    chooseLanguage: "तुमची भाषा निवडा",
    languageSubtitle: "पुढे जाण्यासाठी तुमची पसंतीची भाषा निवडा",
    continue: "पुढे चला",
    selectRole: "तुमची भूमिका निवडा",
    roleSubtitle: "तुम्ही REAL JOB कसे वापरू इच्छिता ते निवडा",
    jobSeeker: "कामगार / नोकरी शोधणारे",
    jobSeekerDesc: "योग्य काम शोधा, मालकांशी थेट संपर्क साधा व त्वरित कामाला लागा.",
    jobProvider: "मालक / कामगार देणारे",
    jobProviderDesc: "कुशल व अकुशल कामगार शोधा, नोकरी पोस्ट करा व त्वरित भरती करा.",
    backToLanguage: "भाषा बदला",
    viewWebsite: "मुख्य पृष्ठ",
    viewDashboard: "डॅशबोर्ड",
    home: "मुख्य पृष्ठ",
    jobs: "काम शोधा",
    workers: "कामगार शोधा",
    categories: "श्रेणी",
    aboutUs: "आमच्याबद्दल",
    contactUs: "संपर्क",
    faq: "प्रश्नोत्तरे (FAQ)",
    heroTitle: "कामगार शोधा... काम मिळवा...",
    heroSubtitle: "योग्य माणूस • योग्य काम • योग्य संधी — सर्व काही ऑनलाइन!",
    findJob: "मला काम पाहिजे",
    hireTalent: "मला कामगार पाहिजे",
    searchPlaceholder: "नोकरीचे नाव, कौशल्य किंवा व्यवसाय",
    location: "शहर / ठिकाण",
    search: "शोधा",
    popularJobs: "नवीनतम नोकऱ्या",
    popularCategories: "कामगार श्रेणी",
    signIn: "लॉगिन",
    register: "रजिस्टर",
    welcome: "REAL JOB मध्ये आपले स्वागत आहे",
  },
  hi: {
    brand: "REAL JOB",
    tagline: "Find Work | Find Workers",
    chooseLanguage: "अपनी भाषा चुनें",
    languageSubtitle: "जारी रखने के लिए अपनी पसंदीदा भाषा चुनें",
    continue: "आगे बढ़ें",
    selectRole: "अपनी भूमिका चुनें",
    jobSeeker: "कर्मचारी / कामगार",
    jobProvider: "नियोक्ता / कंपनी",
    home: "होम",
    jobs: "काम खोजें",
    workers: "कामगार खोजें",
    categories: "श्रेणियां",
    aboutUs: "हमारे बारे में",
    contactUs: "संपर्क करें",
    faq: "सवाल और जवाब",
    heroTitle: "कामगार खोजें... काम पाएं...",
    heroSubtitle: "सही इंसान • सही काम • सही अवसर — सब कुछ ऑनलाइन!",
    findJob: "मुझे काम चाहिए",
    hireTalent: "मुझे कामगार चाहिए",
    search: "खोजें",
    signIn: "लॉगिन",
    register: "पंजीकरण करें",
  }
};

type I18nValue = { lang: string; setLang: (lang: string) => void; t: (key: keyof typeof en) => string };
const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState("mr");

  useEffect(() => {
    const stored = window.localStorage.getItem("realjob-language");
    if (stored) setLangState(stored);
  }, []);

  const setLang = (value: string) => {
    setLangState(value);
    window.localStorage.setItem("realjob-language", value);
  };

  const value = useMemo(() => ({ lang, setLang, t: (key: keyof typeof en) => partial[lang]?.[key] ?? en[key] }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("I18nProvider missing");
  return value;
}

