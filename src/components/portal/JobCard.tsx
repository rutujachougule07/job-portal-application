import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Globe,
  MapPin,
  Send,
  Sparkles,
  Users,
  Wallet,
  X,
  Award,
  ShieldCheck,
  Star,
  ExternalLink,
  Briefcase,
  BookOpen,
  Gift,
  Building,
  Share2,
  Check,
  User,
  FileText,
  CloudUpload,
  Info,
  ArrowLeft,
} from "lucide-react";
import { DynamicApplicationForm } from "@/components/portal/DynamicApplicationForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { dataStore } from "@/lib/data-store";
import { toast } from "sonner";
import { getFallbackConfig, groupFieldsBySection } from "@/lib/applicationConfig";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  type: string;
  workMode: "On-site" | "Remote" | "Hybrid";
  posted: string;
  initials: string;
  category: string;
  featured?: boolean;
  openings?: number;
};

export type CompanyMetadata = {
  name: string;
  industry: string;
  founded: string;
  size: string;
  headquarters: string;
  rating: string;
  reviewsCount: string;
  website: string;
  aboutMr: string;
  aboutEn: string;
  trustBadges: string[];
  perksMr: string[];
  perksEn: string[];
  jobDescMr: string;
  jobDescEn: string;
  skills: string[];
};

export const companyDatabase: Record<string, CompanyMetadata> = {
  "L&T Construction": {
    name: "Larsen & Toubro (L&T) Construction",
    industry: "Engineering & Heavy Construction",
    founded: "1938",
    size: "50,000+ Employees",
    headquarters: "Mumbai, Maharashtra",
    rating: "4.6",
    reviewsCount: "12,450+",
    website: "https://www.larsentoubro.com",
    aboutMr: "L&T Construction ही भारतातील सर्वात मोठी आणि जागतिक स्तरावरील अव्वल दर्जाची इन्फ्रास्ट्रक्चर व अभियांत्रिकी कंपनी आहे. कंपनी मेट्रो, पूल, हायवे आणि मोठ्या कमर्शियल प्रोजेक्ट्सचे काम करते.",
    aboutEn: "L&T Construction is India's largest infrastructure engineering & construction conglomerate with landmark global mega-projects.",
    trustBadges: ["GST Verified Employer", "ISO 9001 Certified", "Govt Infrastructure Partner", "Top Employer 2026"],
    perksMr: ["PF + ESIC वैद्यकीय विमा", "मोफत कॅन्टीन व वाहतूक सुविधा", "वार्षिक दिवाळी व परफॉर्मन्स बोनस", "साइट निवास व्यवस्था (Accommodation)"],
    perksEn: ["PF + ESIC Medical Insurance", "Subsidized Canteen & Transport", "Annual Performance Bonus", "Site Accommodation Provided"],
    jobDescMr: "साइट ऑपरेशन, क्वालिटी कंट्रोल, प्रोग्रेस ट्रॅकिंग आणि सुरक्षा नियमांचे पालन करून बांधकाम प्रकल्प वेळेत पूर्ण करण्याची जबाबदारी राहील.",
    jobDescEn: "Responsible for site execution, quality assurance, safety protocol compliance, and structural progress tracking.",
    skills: ["Civil Engineering", "Site Safety", "AutoCAD", "Project Management", "Quality Inspection"]
  },
  "Shapoorji Pallonji": {
    name: "Shapoorji Pallonji & Co. Ltd.",
    industry: "Real Estate & Construction",
    founded: "1865",
    size: "35,000+ Employees",
    headquarters: "Mumbai, Maharashtra",
    rating: "4.5",
    reviewsCount: "8,900+",
    website: "https://www.shapoorjipallonji.com",
    aboutMr: "१५० वर्षांपेक्षा जास्त समृद्ध वारसा असणारी Shapoorji Pallonji ग्रुप ही भारतातील प्रीमियर रिअल इस्टेट व कन्स्ट्रक्शन कंपनी आहे.",
    aboutEn: "Shapoorji Pallonji is a 150+ year old premier Indian conglomerate operating in construction, real estate, and infrastructure.",
    trustBadges: ["A+ Govt Rated", "GST Registered", "Safety Certified 2026"],
    perksMr: ["आरोग्य विमा", "ओव्हरटाइम अलाउन्स", "तांत्रिक प्रशिक्षण"],
    perksEn: ["Health Insurance", "Overtime Allowance", "Technical Training"],
    jobDescMr: "सिव्हिल स्ट्रक्चर तपासणे, साइट लेबर मॅनेजमेंट आणि मटेरियल ऑडिट करणे.",
    jobDescEn: "Site structural inspections, labor management, material audit and daily reporting.",
    skills: ["Site Supervision", "Structural Safety", "Labor Management", "Material Testing"]
  },
  "TCS": {
    name: "Tata Consultancy Services (TCS)",
    industry: "IT & Software Services",
    founded: "1968",
    size: "600,000+ Employees",
    headquarters: "Mumbai, Maharashtra",
    rating: "4.7",
    reviewsCount: "45,000+",
    website: "https://www.tcs.com",
    aboutMr: "टाटा समूहाची TCS ही जगातील अग्रगण्य आयटी सर्व्हिसेस, कन्सलटिंग आणि बिझनेस सोल्युशन्स देणारी कंपनी आहे.",
    aboutEn: "TCS is a global leader in IT services, consulting & business solutions partnering with top Fortune 500 enterprises.",
    trustBadges: ["Global Top Employer", "Tata Group Brand", "100% Tax Compliant"],
    perksMr: ["हायब्रिड / WFH पर्याय", "कुटुंब आरोग्य विमा (₹5 लाख)", "TCS Xplore लर्निंग कोर्सेस", "कॅब पिक & ड्रॉप"],
    perksEn: ["Hybrid / Remote Work", "Family Health Cover (₹5L)", "TCS Upskilling Programs", "Cab Drop Service"],
    jobDescMr: "एंटरप्राइज सॉफ्टवेअर डिझाइन करणे, रिॲक्ट/जावा कोडिंग, एपीआय इंटिग्रेशन आणि बग फिक्सिंग करणे.",
    jobDescEn: "Design and implement enterprise Web apps, React/Node microservices, API integrations, and code optimization.",
    skills: ["React", "Node.js", "Java / Python", "SQL / NoSQL", "Git"]
  },
  "Infosys": {
    name: "Infosys Limited",
    industry: "IT & Next-Gen Digital Services",
    founded: "1981",
    size: "300,000+ Employees",
    headquarters: "Bengaluru, Karnataka",
    rating: "4.6",
    reviewsCount: "38,000+",
    website: "https://www.infosys.com",
    aboutMr: "इन्फोसिस ही डिजिटल ट्रान्सफॉर्मेशन आणि सॉफ्टवेअर सोल्यूशन्स देणारी भारतातील अव्वल जागतिक कंपनी आहे.",
    aboutEn: "Infosys is a global leader in next-generation digital services and consulting.",
    trustBadges: ["Listed on NYSE", "Top Employer India", "Verified Recruiter"],
    perksMr: ["वर्क फ्रॉम होम फ्लेक्सिबिलिटी", "वार्षिक अप्र Appraisals", "इन्फोसिस स्प्रिंगबोर्ड लर्निंग"],
    perksEn: ["Work From Home Flexibility", "Annual Performance Appraisal", "Infosys Springboard Learning"],
    jobDescMr: "वेब व मोबाईल ॲप्लिकेशन डेव्हलपमेंट, फ्रंटएंड आणि युझर एक्सपिरियन्स डिझाइन.",
    jobDescEn: "Develop responsive web interfaces, frontend logic, component integration and cloud deployment.",
    skills: ["React.js", "TypeScript", "Tailwind CSS", "REST API", "UI Testing"]
  },
  "Tata Motors": {
    name: "Tata Motors Commercial & Passenger Vehicles",
    industry: "Automobile & Manufacturing",
    founded: "1945",
    size: "80,000+ Employees",
    headquarters: "Pune / Mumbai, Maharashtra",
    rating: "4.7",
    reviewsCount: "18,200+",
    website: "https://www.tatamotors.com",
    aboutMr: "टाटा मोटर्स ही भारतातील सर्वात मोठी ऑटोमोबाईल उत्पादक कंपनी असून EV (इलेक्ट्रिक व्हेईकल) क्षेत्रात क्रांती घडवत आहे.",
    aboutEn: "Tata Motors is India's pioneer automotive manufacturer leading the Electric Vehicle revolution.",
    trustBadges: ["Make in India Pioneer", "Tata Trust Certified", "ISO 14001 Compliant"],
    perksMr: ["कंपनी बस सेवा (पुणे/पिंपरी)", "कॅन्टीन भोजन सवलत", "मेडिक्लेम व ग्रॅच्युइटी"],
    perksEn: ["Free Factory Bus Service", "Subsidized Canteen Meals", "Mediclaim & Gratuity"],
    jobDescMr: "असेंब्ली लाईन प्रोडक्शन, मेकॅनिकल कंपोनंट टेस्टिंग आणि क्वालिटी अश्युरन्स तपासणे.",
    jobDescEn: "Assembly line oversight, mechanical testing, vehicle quality audit and production throughput.",
    skills: ["Mechanical Engineering", "Production Planning", "Quality Inspection", "AutoCAD / CATIA"]
  },
  "Ruby Hall Clinic": {
    name: "Grant Medical Foundation - Ruby Hall Clinic",
    industry: "Healthcare & Multispecialty Hospital",
    founded: "1959",
    size: "4,500+ Staff",
    headquarters: "Pune, Maharashtra",
    rating: "4.8",
    reviewsCount: "5,600+",
    website: "https://www.rubyhall.com",
    aboutMr: "रुबी हॉल क्लिनिक हे पुण्यातील सर्वात प्रख्यात आणि NABH मान्यताप्राप्त मल्टीस्पेशालिटी हॉस्पिटल आहे.",
    aboutEn: "Ruby Hall Clinic is a premier NABH-accredited multispecialty tertiary care hospital in Maharashtra.",
    trustBadges: ["NABH Accredited Hospital", "Govt Health Partner", "Top Healthcare Brand"],
    perksMr: ["कर्मचारी व कुटुंब मोफत रुग्णालय उपचार", "नाईट शिफ्ट अलाउन्स", "नर्सिंग क्वार्टर्स"],
    perksEn: ["Free Hospital Care for Staff", "Night Shift Allowance", "Nursing Quarters"],
    jobDescMr: "पेशंट केअर, आयसीयू ऑब्झर्व्हेशन, डॉक्टर असिस्टन्स आणि मेडिकल रेकॉर्ड्स मेंटेन करणे.",
    jobDescEn: "Patient nursing care, ICU monitoring, physician assistance, and clinical documentation.",
    skills: ["Patient Nursing", "ICU Care", "First Aid / CPR", "Medical Records"]
  },
  "KPMG": {
    name: "KPMG India",
    industry: "Financial Advisory, Audit & Tax",
    founded: "1993",
    size: "20,000+ Professionals",
    headquarters: "Mumbai, Maharashtra",
    rating: "4.6",
    reviewsCount: "9,100+",
    website: "https://home.kpmg/in",
    aboutMr: "केपीएमजी ही जगप्रसिद्ध बिग-४ मधील एक फायनान्शियल ऑडिट, टॅक्स सल्लागार आणि कॉर्पोरेट अकाऊंटिंग कंपनी आहे.",
    aboutEn: "KPMG is one of the Big Four global financial auditing, advisory and accounting firms.",
    trustBadges: ["Big 4 Financial Brand", "Certified Tax Consultants", "Top Corporate Firm"],
    perksMr: ["उच्च कॉर्पोरेट पगार", "वार्षिक इन्सेन्टिव्ह", "सीए व फायनान्स स्पॉन्सरशिप"],
    perksEn: ["High Corporate Pay", "Annual Performance Bonus", "Finance Certifications Cover"],
    jobDescMr: "जीएसटी रिटर्न्स, कॉर्पोरेट टॅक्स ऑडिट, बॅलन्स शीट फायनलायझेशन आणि फायनान्शियल प्लॅनिंग करणे.",
    jobDescEn: "Corporate tax auditing, GST compliance, balance sheet finalization and client risk assessment.",
    skills: ["Accounting", "GST / Income Tax", "Tally Prime", "Financial Audit", "Excel Mastery"]
  },
  "Reliance Industries": {
    name: "Reliance Industries & Digital Services",
    industry: "Conglomerate - Retail, Telecom & Energy",
    founded: "1958",
    size: "350,000+ Employees",
    headquarters: "Mumbai, Maharashtra",
    rating: "4.7",
    reviewsCount: "28,000+",
    website: "https://www.ril.com",
    aboutMr: "रिलायन्स इंडस्ट्रिज ही भारतातील सर्वात मोठी प्रायव्हेट कंपनी असून रिटेल, टेलिकॉम (Jio) आणि ऊर्जेमध्ये अग्रगण्य आहे.",
    aboutEn: "Reliance Industries Limited is India's largest private sector enterprise spanning Energy, Retail & Digital.",
    trustBadges: ["India #1 Fortune 500", "GST Registered", "Verified Enterprise"],
    perksMr: ["रिलायन्स रिटेल डिस्काऊंट", "मेडिकल इन्शुरन्स (₹4 लाख)", "कर्मचारी शेअर योजना"],
    perksEn: ["Reliance Store Discounts", "Comprehensive Medical Cover", "Employee Stock Options"],
    jobDescMr: "डिजिटल मार्केटिंग कॅम्पेन, सेल्स एक्झिक्युशन, बिझनेस डेव्हलपमेंट आणि कस्टमर ऑनबोर्डिंग.",
    jobDescEn: "Lead digital marketing drives, B2B/B2C sales execution, and market expansion campaigns.",
    skills: ["Sales Management", "Digital Marketing", "Business Development", "Client Relationship"]
  },
  "Bharat Forge": {
    name: "Bharat Forge Limited (Kalyani Group)",
    industry: "Heavy Engineering & Manufacturing",
    founded: "1961",
    size: "12,000+ Employees",
    headquarters: "Pune, Maharashtra",
    rating: "4.6",
    reviewsCount: "4,200+",
    website: "https://www.bharatforge.com",
    aboutMr: "भारत फोर्ज ही जगातील दुसऱ्या क्रमांकाची सर्वात मोठी ऑटोमोबाईल व एरोस्पेस फोर्जिंग उत्पादक कंपनी आहे.",
    aboutEn: "Bharat Forge is a global engineering leader manufacturing critical automotive & aerospace components.",
    trustBadges: ["Defense & Aerospace Approved", "ISO 45001", "Kalyani Group Brand"],
    perksMr: ["मोफत कॅन्टीन व चहा", "सुरक्षा किट व गणवेश", "वार्षिक बोनस व PF"],
    perksEn: ["Free Canteen & Refreshments", "Safety Gear & Uniform", "Annual Bonus & PF"],
    jobDescMr: "सीएनसी मशीन ऑपरेटिंग, मॅन्युफॅक्चरिंग लाईन सुपरव्हिजन आणि मेटल चाचणी करणे.",
    jobDescEn: "CNC machine operations, metallurgy quality check, and shopfloor production target management.",
    skills: ["CNC / VMC Operations", "Manufacturing Supervision", "Quality Assurance", "Plant Safety"]
  }
};

// Fallback metadata generator for any company not explicitly mapped
export function getCompanyMetadata(job: Job): CompanyMetadata {
  const found = companyDatabase[job.company];
  if (found) {
    return found;
  }

  return {
    name: job.company,
    industry: job.category || "General Industry",
    founded: "2010",
    size: "500+ Employees",
    headquarters: job.location || "Maharashtra, India",
    rating: "4.5",
    reviewsCount: "150+ Reviews",
    website: `https://www.google.com/search?q=${encodeURIComponent(job.company)}`,
    aboutMr: `${job.company} ही ${job.category} क्षेत्रातील अधिकृत आणि नोंदणीकृत कंपनी आहे. कंपनी उच्च दर्जाच्या सेवा आणि रोजगार संधी उपलब्ध करून देते.`,
    aboutEn: `${job.company} is a verified enterprise in the ${job.category} sector providing reliable products, services, and career opportunities.`,
    trustBadges: ["GST Registered Employer", "REAL JOB Verified", "Government Compliant"],
    perksMr: ["PF + ESIC सुविधा", "नियमित पगार व बोनस", "कामाचे सुरक्षित वातावरण"],
    perksEn: ["PF + ESIC Benefits", "Timely Salary & Bonus", "Safe Working Environment"],
    jobDescMr: `${job.title} या पदासाठी मुख्य जबाबदाऱ्यांमध्ये दैनिक कामकाज, टीम वर्क आणि दिलेल्या उद्दिष्टांची पूर्तता करणे समाविष्ट आहे.`,
    jobDescEn: `Primary duties for ${job.title} include daily operational execution, teamwork, and target milestone completion.`,
    skills: [job.category, "Teamwork", "Problem Solving", "Domain Expertise"]
  };
}

export const jobs: Job[] = [];

export function JobCard({
  job,
  onApply,
}: {
  job: Job;
  onApply?: (job: Job) => void;
}) {
  const { t, n, lang } = useI18n();
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"company" | "job" | "openings">("company");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (showApplyModal || showCompanyModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showApplyModal, showCompanyModal]);

  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, any>>({});

  const appConfig = (job as any).applicationConfig || getFallbackConfig(job.category);

  const handleFieldChange = (key: string, val: any) => setFieldValues(p => ({ ...p, [key]: val }));
  const handleCustomChange = (id: string, val: any) => setCustomAnswers(p => ({ ...p, [id]: val }));

  const companyMeta = getCompanyMetadata(job);

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(job);
    } else {
      setShowApplyModal(true);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCopied(true);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const openModalTab = (tab: "company" | "job" | "openings") => {
    setActiveModalTab(tab);
    setShowCompanyModal(true);
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = dataStore.getCurrentUser();
    const seekerId = currentUser ? (currentUser.email || currentUser.id || "seeker-demo") : "candidate@realjob.com";
    const seekerName = currentUser?.fullName || "Rutuja Pawar";

    // Duplicate Application Check
    if (dataStore.hasAlreadyApplied(seekerId, job.id)) {
      toast.error(lang === "mr" ? "तुम्ही या नोकरीसाठी आधीच अर्ज भरला आहे!" : "You have already applied to this job!");
      setShowApplyModal(false);
      return;
    }

    try {
      dataStore.createApplication({
        jobId: job.id,
        employerId: job.company,
        jobSeekerId: seekerId,
        candidateName: seekerName,
        candidateEmail: seekerId,
        candidateMobile: "+91 98220 11223",
        jobTitle: job.title,
        companyName: job.company,
        location: job.location,
        salary: job.salary,
        resume: fieldValues['resume'] || `${seekerName.replaceAll(" ", "_")}_Resume.pdf`,
        fieldValues,
        customAnswers,
        category: job.category
      } as any);

      setApplied(true);
      toast.success(lang === "mr" ? "अर्ज यशस्वीरीत्या पाठवला!" : "Application submitted successfully!");
      setTimeout(() => {
        setApplied(false);
        setShowApplyModal(false);
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    }
  };

  // Other jobs by the same company
  const companyJobs = jobs.filter((j) => j.company === job.company);

  return (
    <>
      <article className="card-realjob p-5 flex flex-col justify-between group relative overflow-hidden bg-white border border-[#DCE5F0] hover:border-[#063B78]/40 hover:shadow-lg transition-all rounded-2xl">
        {/* Top Badges & Utilities */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {job.featured && (
              <Badge className="bg-[#FFC400] text-[#082F63] font-black text-[10px] uppercase tracking-wider px-2 py-0.5 border-0">
                <Sparkles className="mr-1 size-3" /> {lang === "mr" ? "खास संधी" : "Featured"}
              </Badge>
            )}
            <Badge variant="outline" className="border-[#063B78]/20 text-[#063B78] font-bold text-[10px] bg-[#063B78]/5">
              <CheckCircle2 className="mr-1 size-3 text-emerald-600" /> GST Verified
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {/* Share Button */}
            <button
              onClick={handleShareClick}
              title={lang === "mr" ? "नोकरी शेअर करा" : "Share Job"}
              className="text-[#5B6B7F] hover:text-[#063B78] p-1.5 rounded-full hover:bg-[#F5F8FC] transition-colors relative"
            >
              {copied ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-fade-in">
                  <Check className="size-3" /> {lang === "mr" ? "कॉपी झाली!" : "Copied!"}
                </span>
              ) : (
                <Share2 className="size-4" />
              )}
            </button>

            {/* Save / Bookmark Button */}
            <button
              onClick={() => setSaved(!saved)}
              aria-label="Save Job"
              title={lang === "mr" ? "नोकरी सेव्ह करा" : "Save Job"}
              className="text-[#5B6B7F] hover:text-[#063B78] p-1.5 rounded-full hover:bg-[#F5F8FC] transition-colors"
            >
              {saved ? (
                <span className="text-[#063B78] font-bold text-xs flex items-center gap-1 bg-[#063B78]/10 px-2 py-0.5 rounded-full">
                  ★ Saved
                </span>
              ) : (
                <span className="text-[#5B6B7F] text-xs flex items-center gap-1 px-1.5">
                  ☆ Save
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Company Header Info */}
        <div className="flex items-start gap-3">
          {/* Logo Click -> Opens Official Company Website Directly */}
          <a
            href={companyMeta.website}
            target="_blank"
            rel="noopener noreferrer"
            title={`${companyMeta.name} ची अधिकृत वेबसाईट उघडा (${companyMeta.website})`}
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#063B78] to-[#082F63] font-black text-white text-base shadow-sm hover:scale-105 transition-transform"
          >
            {job.initials}
          </a>

          <div className="min-w-0 flex-1">
            {/* Job Title Click -> Opens Job Details (JD) */}
            <h3
              onClick={() => openModalTab("job")}
              title={lang === "mr" ? "नोकरीचे सविस्तर स्वरूप (Job Details) पाहा" : "View Full Job Details"}
              className="font-display text-base sm:text-lg font-black text-[#10233F] hover:text-[#063B78] hover:underline cursor-pointer transition-colors line-clamp-1"
            >
              {job.title}
            </h3>

            {/* Company Name Click -> Opens Official Company Website Directly */}
            <a
              href={companyMeta.website}
              target="_blank"
              rel="noopener noreferrer"
              title={`${companyMeta.name} ची अधिकृत वेबसाईट उघडा`}
              className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#125BB5] hover:underline"
            >
              <Building2 className="size-3.5 text-[#063B78]" />
              <span className="truncate">{job.company}</span>
              <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
              <span className="text-[10px] font-black text-[#FFC400] bg-[#082F63] px-1.5 py-0.2 rounded-full">
                ★ {companyMeta.rating}
              </span>
              <ExternalLink className="size-3 text-[#125BB5] shrink-0" />
            </a>

            <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-[#5B6B7F]">
              <button
                onClick={() => openModalTab("job")}
                className="inline-flex items-center gap-1 hover:text-[#063B78] hover:underline"
              >
                <MapPin className="size-3.5 text-[#063B78]" /> {job.location}
              </button>
            </div>
          </div>
        </div>

        {/* Salary and Openings Box */}
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#F5F8FC] p-3 border border-[#DCE5F0]/50">
          <div
            onClick={() => openModalTab("job")}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            title={lang === "mr" ? "पगार व नोकरीचे तपशील पाहा" : "View Salary Details"}
          >
            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#063B78]/10 text-[#063B78]">
              <Wallet className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase text-[#5B6B7F] truncate">
                {lang === "mr" ? "सुरुवातीचा पगार" : "Starting Salary"}
              </p>
              <p className="text-xs sm:text-sm font-black text-[#063B78] truncate">{n(job.salary)}</p>
            </div>
          </div>

          {job.openings && (
            <div
              onClick={() => openModalTab("openings")}
              className="flex items-center gap-2.5 border-l border-[#DCE5F0] pl-3 cursor-pointer hover:opacity-80 transition-opacity"
              title={lang === "mr" ? "या कंपनीतील इतर सर्व जागा पाहा" : "View Active Openings"}
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#FFC400]/20 text-[#082F63]">
                <Users className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase text-[#5B6B7F] truncate">
                  {lang === "mr" ? "एकूण जागा" : "Openings"}
                </p>
                <p className="text-xs sm:text-sm font-black text-[#10233F] truncate">
                  {n(job.openings)}+ {lang === "mr" ? "शिल्लक" : "Vacancies"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Clickable Tags & Skills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 relative z-0">
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#063B78]/5 px-2 py-1 text-[10px] sm:text-[11px] font-bold text-[#063B78] whitespace-nowrap">
            <Clock3 className="size-3" /> {job.type}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#063B78]/5 px-2 py-1 text-[10px] sm:text-[11px] font-bold text-[#063B78] whitespace-nowrap">
            {job.workMode}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#063B78]/5 px-2 py-1 text-[10px] sm:text-[11px] font-bold text-[#063B78] whitespace-nowrap">
            {lang === "mr" ? "अनुभव" : "Exp"}: {n(job.experience)}
          </span>

          {companyMeta.skills.slice(0, 2).map((skill, idx) => (
            <button
              key={idx}
              onClick={() => openModalTab("job")}
              title={`View ${skill} requirement details`}
              className="inline-flex items-center gap-1 rounded-lg bg-[#FFC400]/15 border border-[#FFC400]/30 hover:bg-[#FFC400] transition-colors px-2 py-1 text-[10px] sm:text-[11px] font-black text-[#082F63] whitespace-nowrap"
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#DCE5F0] pt-4 relative z-20">
          <Button
            asChild
            variant="outline"
            className="h-9 text-xs font-black border-[#063B78]/30 text-[#063B78] hover:bg-[#063B78] hover:text-white rounded-xl shadow-2xs px-3"
          >
            <a
              href={companyMeta.website}
              target="_blank"
              rel="noopener noreferrer"
              title={`${companyMeta.name} ची अधिकृत वेबसाईट उघडा (${companyMeta.website})`}
            >
              <Building className="mr-1.5 size-3.5" />
              {lang === "mr" ? "कंपनी वेबसाईट" : "Company Website"}
              <ExternalLink className="ml-1 size-3" />
            </a>
          </Button>

          <Button
            onClick={handleApplyClick}
            className="btn-yellow h-9 px-5 font-black text-xs shadow-sm rounded-xl"
          >
            {t("apply")} <Send className="ml-1.5 size-3" />
          </Button>
        </div>
      </article>

      {/* Naukri.com Style Company Profile & Job Details Modal */}
      {showCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082F63]/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl border border-[#DCE5F0] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#063B78] via-[#082F63] to-[#125BB5] p-6 text-white relative">
              <button
                onClick={() => setShowCompanyModal(false)}
                className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="size-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white font-black text-[#063B78] text-2xl shadow-lg border-2 border-[#FFC400]">
                  {job.initials}
                </div>

                <div className="space-y-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFC400] text-[#082F63] px-2 py-0.5 rounded-full">
                      {companyMeta.industry}
                    </span>
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="size-4" /> Real Job Verified Employer
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white truncate">
                    {companyMeta.name}
                  </h2>

                  <div className="flex items-center gap-3 text-xs font-bold text-slate-200 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#FFC400]" /> {companyMeta.headquarters}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#FFC400]">
                      <Star className="size-3.5 fill-[#FFC400]" /> {companyMeta.rating} / 5.0 ({companyMeta.reviewsCount})
                    </span>
                    <span>•</span>
                    <span>Est. {companyMeta.founded}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 mt-6 border-b border-white/20">
                <button
                  onClick={() => setActiveModalTab("company")}
                  className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-all border-b-2 ${
                    activeModalTab === "company"
                      ? "border-[#FFC400] text-[#FFC400]"
                      : "border-transparent text-white/70 hover:text-white"
                  }`}
                >
                  🏢 {lang === "mr" ? "कंपनी पार्श्वभूमी" : "Company Profile"}
                </button>

                <button
                  onClick={() => setActiveModalTab("job")}
                  className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-all border-b-2 ${
                    activeModalTab === "job"
                      ? "border-[#FFC400] text-[#FFC400]"
                      : "border-transparent text-white/70 hover:text-white"
                  }`}
                >
                  📋 {lang === "mr" ? "नोकरी सविस्तर माहिती" : "Job Details"}
                </button>

                <button
                  onClick={() => setActiveModalTab("openings")}
                  className={`pb-2.5 px-3 text-xs sm:text-sm font-black transition-all border-b-2 ${
                    activeModalTab === "openings"
                      ? "border-[#FFC400] text-[#FFC400]"
                      : "border-transparent text-white/70 hover:text-white"
                  }`}
                >
                  🚀 {lang === "mr" ? "इतर जागा" : "Active Openings"} ({companyJobs.length})
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#10233F]">
              
              {/* TAB 1: Company Profile */}
              {activeModalTab === "company" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Trust Badges */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-[#5B6B7F] tracking-wider mb-2">
                      {lang === "mr" ? "विश्वासार्हता आणि प्रमाणपत्रे" : "Verification Badges"}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {companyMeta.trustBadges.map((badge, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-black text-emerald-800">
                          <CheckCircle2 className="size-4 text-emerald-600" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* About Company */}
                  <div>
                    <h4 className="text-sm font-black text-[#063B78] mb-2 flex items-center gap-2">
                      <Building2 className="size-4 text-[#063B78]" />
                      {lang === "mr" ? "कंपनीबद्दल थोडक्यात (About Company)" : "About Company"}
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed text-[#5B6B7F] bg-[#F5F8FC] p-4 rounded-2xl border border-[#DCE5F0]">
                      {lang === "mr" ? companyMeta.aboutMr : companyMeta.aboutEn}
                    </p>
                  </div>

                  {/* Company Quick Facts */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#DCE5F0]">
                      <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">कर्मचारी संख्या</span>
                      <span className="text-xs font-black text-[#063B78]">{companyMeta.size}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#DCE5F0]">
                      <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">स्थापना वर्ष</span>
                      <span className="text-xs font-black text-[#063B78]">वर्ष {companyMeta.founded}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#DCE5F0]">
                      <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">मुख्यालय</span>
                      <span className="text-xs font-black text-[#063B78] truncate block">{companyMeta.headquarters}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#DCE5F0]">
                      <span className="text-[10px] font-bold text-[#5B6B7F] uppercase block">वेबसाईट</span>
                      <a href={companyMeta.website} target="_blank" rel="noreferrer" className="text-xs font-black text-[#125BB5] hover:underline flex items-center gap-1">
                        Visit Site <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>

                  {/* Employee Perks & Benefits */}
                  <div>
                    <h4 className="text-sm font-black text-[#063B78] mb-2 flex items-center gap-2">
                      <Gift className="size-4 text-[#FFC400]" />
                      {lang === "mr" ? "कामगारांना मिळणाऱ्या सुविधा (Employee Benefits & Perks)" : "Employee Perks"}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(lang === "mr" ? companyMeta.perksMr : companyMeta.perksEn).map((perk, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EBF1F8] text-xs font-bold text-[#063B78]">
                          <Award className="size-4 text-[#063B78] shrink-0" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: Job Details */}
              {activeModalTab === "job" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Role Overview */}
                  <div className="p-4 rounded-2xl bg-[#063B78]/5 border border-[#063B78]/15 space-y-2">
                    <h3 className="text-base font-black text-[#063B78]">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#5B6B7F]">
                      <span>💰 Salary: {job.salary}</span>
                      <span>📍 Location: {job.location}</span>
                      <span>💼 Exp: {job.experience}</span>
                      <span>🕒 Type: {job.type} ({job.workMode})</span>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <h4 className="text-sm font-black text-[#063B78] mb-2 flex items-center gap-2">
                      <Briefcase className="size-4 text-[#063B78]" />
                      {lang === "mr" ? "कामाचे स्वरूप आणि जबाबदाऱ्या" : "Job Description & Duties"}
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed text-[#5B6B7F] bg-[#F5F8FC] p-4 rounded-2xl border border-[#DCE5F0]">
                      {lang === "mr" ? companyMeta.jobDescMr : companyMeta.jobDescEn}
                    </p>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <h4 className="text-sm font-black text-[#063B78] mb-2 flex items-center gap-2">
                      <BookOpen className="size-4 text-[#063B78]" />
                      {lang === "mr" ? "आवश्यक कौशल्ये (Required Skills)" : "Required Skills"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {companyMeta.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl bg-[#063B78] text-white text-xs font-bold shadow-2xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: Active Openings */}
              {activeModalTab === "openings" && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="text-xs font-black uppercase text-[#5B6B7F] tracking-wider">
                    {companyMeta.name} {lang === "mr" ? "मधील इतर सर्व नोकऱ्या" : "Active Vacancies"}
                  </h4>

                  {companyJobs.map((cj) => (
                    <div key={cj.id} className="p-4 rounded-2xl border border-[#DCE5F0] bg-[#F5F8FC] flex items-center justify-between gap-3">
                      <div>
                        <h5 className="font-black text-sm text-[#10233F]">{cj.title}</h5>
                        <p className="text-xs font-semibold text-[#5B6B7F] mt-0.5">
                          {cj.location} • {cj.salary} • {cj.experience}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setShowCompanyModal(false);
                          setShowApplyModal(true);
                        }}
                        className="btn-yellow h-8 px-4 font-black text-xs rounded-xl shrink-0"
                      >
                        Apply <Send className="ml-1 size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Bottom Action Footer */}
            <div className="p-4 bg-[#F5F8FC] border-t border-[#DCE5F0] flex items-center justify-between gap-3">
              <div className="text-xs font-bold text-[#5B6B7F]">
                <span>{lang === "mr" ? "थेट HR पडताळणी पूर्ण झालेली कंपनी" : "Verified HR Direct Recruiter"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCompanyModal(false)}
                  className="h-10 text-xs font-bold px-4 rounded-xl border-[#DCE5F0]"
                >
                  {lang === "mr" ? "बंद करा" : "Close"}
                </Button>
                
                <Button
                  onClick={() => {
                    setShowCompanyModal(false);
                    setShowApplyModal(true);
                  }}
                  className="btn-yellow h-10 px-6 font-black text-xs rounded-xl shadow-md"
                >
                  {t("apply")} <Send className="ml-1.5 size-3.5" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Apply Full Page */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#F5F8FC] overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border-b border-[#DCE5F0] sticky top-0 z-10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-gradient-to-br from-[#125BB5] to-[#063B78] flex items-center justify-center text-white font-black shadow-md">
                J
              </div>
              <span className="font-black text-[#082F63] text-xl tracking-tight hidden sm:block">
                JobPortal
              </span>
            </div>
            <button
              onClick={() => setShowApplyModal(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F8FC] text-[#5B6B7F] hover:text-[#10233F] hover:bg-[#EBF1F8] font-bold text-sm transition-colors"
            >
              <X className="size-4" /> {lang === "mr" ? "बंद करा" : "Close"}
            </button>
          </div>

          <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
            <button onClick={() => setShowApplyModal(false)} className="flex items-center text-[#125BB5] font-bold text-sm mb-6 hover:underline">
              <ArrowLeft className="size-4 mr-1.5" /> {lang === "mr" ? "मागे जा" : "Back to Jobs"}
            </button>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Form Area */}
              <div className="flex-1 w-full bg-white rounded-3xl border border-[#DCE5F0] p-6 sm:p-10 shadow-sm">
                <h2 className="text-3xl font-black text-[#082F63] mb-2">{lang === "mr" ? "नोकरीसाठी अर्ज करा" : "Apply for Job"}</h2>
                <p className="text-[#5B6B7F] font-semibold text-sm mb-8">{lang === "mr" ? "खालील माहिती काळजीपूर्वक भरा." : "Fill in the details below to apply for this job. Make sure all information is correct."}</p>

                {applied ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="size-20 text-[#063B78] mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-black text-[#10233F]">{lang === "mr" ? "अर्ज यशस्वीरीत्या पाठवला!" : "Application Submitted!"}</h3>
                    <p className="text-sm font-semibold text-[#5B6B7F] mt-2 max-w-md mx-auto">
                      {lang === "mr" ? "तुमचा अर्ज कंपनीला पाठवण्यात आला आहे. ते लवकरच तुमच्याशी संपर्क साधतील." : "Your application has been sent to the employer. They will contact you shortly."}
                    </p>
                    <Button onClick={() => setShowApplyModal(false)} className="btn-yellow h-12 px-8 font-black text-sm mt-8 rounded-xl">
                      {lang === "mr" ? "मागे जा" : "Go Back"}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submitApplication} className="space-y-6">
                    <DynamicApplicationForm 
                      appConfig={appConfig}
                      fieldValues={fieldValues}
                      setFieldValues={setFieldValues}
                      customAnswers={customAnswers}
                      setCustomAnswers={setCustomAnswers}
                      lang={lang}
                      category={job.category}
                    />

                    <div className="pt-8 flex justify-end gap-4 mt-8">
                      <Button type="button" onClick={() => setShowApplyModal(false)} variant="outline" className="h-12 px-8 font-bold text-sm rounded-xl border-[#DCE5F0] text-[#5B6B7F]">
                        {lang === "mr" ? "रद्द करा" : "Cancel"}
                      </Button>
                      <Button type="submit" className="btn-yellow h-12 px-8 font-black text-sm shadow-md rounded-xl">
                        {lang === "mr" ? "अंतिम अर्ज सादर करा" : "Submit Application"} <Send className="ml-2 size-4" />
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Job Summary Card */}
              <div className="w-full lg:w-[400px] shrink-0 bg-white rounded-3xl border border-[#DCE5F0] p-6 shadow-sm sticky top-24 hidden lg:block">
                <div className="flex items-start justify-between mb-4">
                  <span className="grid size-14 place-items-center rounded-2xl bg-[#063B78] font-black text-white text-xl shadow-md">
                    {job.initials}
                  </span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    Active
                  </Badge>
                </div>
                <h3 className="font-display text-2xl font-black text-[#10233F] mb-2">{job.title}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-bold text-[#125BB5] flex items-center gap-2">
                    <Building className="size-4" /> {job.company}
                  </p>
                  <p className="text-sm font-semibold text-[#5B6B7F] flex items-center gap-2">
                    <MapPin className="size-4" /> {job.location}
                  </p>
                </div>
                
                <div className="inline-block px-3 py-1 bg-[#EBF1F8] text-[#125BB5] text-xs font-bold rounded-lg mb-6">
                  {job.category || "General"}
                </div>

                <div className="space-y-5">
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-full bg-[#F5F8FC] flex items-center justify-center shrink-0">
                      <Briefcase className="size-4 text-[#5B6B7F]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#5B6B7F]">Experience Required</p>
                      <p className="text-sm font-black text-[#10233F]">{job.experience}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-full bg-[#F5F8FC] flex items-center justify-center shrink-0">
                      <Wallet className="size-4 text-[#5B6B7F]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#5B6B7F]">Salary</p>
                      <p className="text-sm font-black text-[#10233F]">{job.salary}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-full bg-[#F5F8FC] flex items-center justify-center shrink-0">
                      <User className="size-4 text-[#5B6B7F]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#5B6B7F]">Vacancies</p>
                      <p className="text-sm font-black text-[#10233F]">{job.vacancies || 1}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 border-t border-[#DCE5F0] pt-6">
                   <Button className="w-full bg-[#063B78] hover:bg-[#082F63] h-12 rounded-xl font-bold">
                     Apply Now
                   </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
