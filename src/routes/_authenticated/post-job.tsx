import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  MapPin,
  Plus,
  Save,
  Send,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

import { dataStore } from "@/lib/data-store";

const SUBCATEGORIES_MAP: Record<string, string[]> = {
  "IT & Software": [
    "Web Development",
    "Software Development",
    "Mobile App Development",
    "Testing & QA",
    "Data & Analytics",
    "Cyber Security",
    "DevOps & Cloud",
    "IT Support",
    "UI/UX Design"
  ],
  "Engineering": [
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Electronics Engineering",
    "Production Engineering",
    "Automobile Engineering"
  ],
  "Construction": [
    "Civil Engineering",
    "Site Engineering",
    "Architecture",
    "Project Management",
    "Construction Management",
    "Skilled Trades"
  ],
  "Manufacturing": [
    "CNC / Machine Operator",
    "Boiler Operator",
    "Turbine Operator",
    "Centrifugal Machine Operator",
    "Pan Man / Pan Boiler",
    "Evaporator Operator",
    "Mill House Operator",
    "Boiling House Operator",
    "Crane / Heavy Machine Operator",
    "Plant Operator",
    "Fitter / Turner",
    "Welder",
    "Wireman / Electrician",
    "Production",
    "Quality Control",
    "Maintenance",
    "Assembly",
    "Operations"
  ],
  "Healthcare & Medical": [
    "Nursing",
    "Doctor / Physician",
    "Pharmacy",
    "Medical Assistant",
    "Lab Technician",
    "Healthcare Support"
  ],
  "Sales & Marketing": [
    "Sales",
    "Digital Marketing",
    "Marketing",
    "Business Development",
    "Telecalling"
  ],
  "Human Resources": [
    "Recruitment",
    "HR Operations",
    "Payroll",
    "Talent Acquisition"
  ],
  "Accounting": [
    "Accounts & Finance",
    "Audit",
    "Taxation",
    "Billing"
  ],
  "Education & Teaching": [
    "School Teacher",
    "College / University",
    "Tutor",
    "Training & Development"
  ],
  "Banking & Finance": [
    "Banking Operations",
    "Investment Banking",
    "Financial Analyst",
    "Loan Officer"
  ],
  "Customer Service": [
    "Customer Support",
    "Client Relationship",
    "Technical Support"
  ],
  "BPO & Call Centre": [
    "Inbound",
    "Outbound",
    "Back Office",
    "Data Entry"
  ],
  "Retail & E-commerce": [
    "Store Manager",
    "Sales Associate",
    "Merchandising",
    "Supply Chain"
  ],
  "Hospitality & Hotel": [
    "Chef / Cook",
    "Housekeeping",
    "Front Desk",
    "Restaurant Manager"
  ],
  "Logistics & Supply Chain": [
    "Warehouse Management",
    "Supply Chain Execution",
    "Inventory Control"
  ],
  "Transport": [
    "Driver",
    "Delivery",
    "Fleet Management"
  ],
  "Government & Public Sector": [
    "Public Administration",
    "Defense",
    "Clerical"
  ],
  "Legal": [
    "Corporate Law",
    "Litigation",
    "Legal Documentation"
  ],
  "Design & Creative": [
    "Graphic Design",
    "Video Editing",
    "Animation",
    "Interior Design"
  ],
  "Media & Entertainment": [
    "Journalism",
    "Content Creation",
    "Production"
  ],
  "Security Services": [
    "Security Guard",
    "Security Management",
    "CCTV Operator"
  ],
  "Administration & Office": [
    "Office Admin",
    "Receptionist",
    "Personal Assistant"
  ],
  "Agriculture & Farming": [
    "Farming Operations",
    "Agri Business",
    "Dairy & Poultry"
  ],
  "Beauty & Wellness": [
    "Beautician",
    "Spa Therapist",
    "Fitness Trainer"
  ],
  "Telecom": [
    "Network Engineer",
    "Telecom Sales",
    "Installation"
  ],
  "Insurance": [
    "Insurance Agent",
    "Claims Processing",
    "Underwriting"
  ],
  "Pharmaceutical": [
    "Pharma Sales",
    "Clinical Research",
    "Quality Assurance"
  ],
  "Research & Development": [
    "Scientific Research",
    "Product R&D",
    "Market Research"
  ],
  "Real Estate": [
    "Property Sales",
    "Facility Management",
    "Real Estate Agent"
  ],
  "Other": [
    "Other"
  ]
};

const INDUSTRIES = [
  "Information Technology",
  "Sugar Factory",
  "Manufacturing & Heavy Machinery",
  "Automobile",
  "Healthcare & Pharmaceuticals",
  "Construction & Real Estate",
  "Education & E-Learning",
  "Banking & Financial Services",
  "Retail & FMCG",
  "Logistics & Transportation",
  "Hospitality & Tourism",
  "Media & Entertainment",
  "Telecommunications",
  "Agriculture & Agrotech",
  "Other Industry"
];

export const Route = createFileRoute("/_authenticated/post-job")({
  validateSearch: (search: Record<string, unknown>): { edit?: string } => {
    return {
      ...(search['edit'] ? { edit: search['edit'] as string } : {})
    };
  },
  head: () => ({
    meta: [
      { title: "Post a New Job — REAL JOB Employer Portal" },
      { name: "description", content: "Post jobs for factory workers, technicians, drivers, welders & general labor on REAL JOB." },
    ],
  }),
  component: PostJobPage,
});

function PostJobPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const { edit: editJobId } = Route.useSearch();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "HR & Recruitment",
    subcategory: "HR Executive (एचआर एक्झिक्युटिव्ह)",
    company: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    salaryType: "Per Month",
    experience: "1-3 Years",
    jobType: "Full-time",
    vacancies: "5",
    skills: "",
    education: "",
    languages: "",
    benefits: "",
    description: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    whatsappNumber: "",
    industry: "",
  });

  useEffect(() => {
    if (editJobId) {
      const job = dataStore.getJobById(editJobId);
      if (job) {
        setFormData({
          title: job.title || "",
          category: job.category || "HR & Recruitment",
          subcategory: job.subcategory || "",
          company: job.company || "",
          location: job.location || "",
          salaryMin: job.salaryMin ? job.salaryMin.toString() : "",
          salaryMax: job.salaryMax ? job.salaryMax.toString() : "",
          salaryType: job.salaryType === "Daily" ? "Per Day" : "Per Month",
          experience: job.experience || "1-3 Years",
          jobType: job.jobType || "Full-time",
          vacancies: job.vacancies ? job.vacancies.toString() : "5",
          skills: job.requiredSkills ? job.requiredSkills.join(", ") : "",
          education: job.qualification || "",
          languages: "",
          benefits: job.benefits ? job.benefits.join(", ") : "",
          description: job.description || "",
          contactPerson: job.contactPerson || "",
          contactPhone: job.contactPhone || "",
          contactEmail: job.contactEmail || "",
          whatsappNumber: job.whatsappNumber || "",
          industry: job.industry || "",
        });
      }
    } else {
      const user = dataStore.getCurrentUser();
      if (user) {
        setFormData((prev) => ({
          ...prev,
          company: (user as any).companyName || user.fullName || prev.company,
        }));
      }
    }
  }, [editJobId]);

  const handleChange = (field: string, value: string) => {
    if (field === "category") {
      let autoInd = "";
      if (value === "IT & Software") autoInd = "Information Technology";
      else if (value === "Engineering" || value === "Manufacturing") autoInd = "Manufacturing & Heavy Machinery";
      else if (value === "Healthcare & Medical") autoInd = "Healthcare & Pharmaceuticals";
      else if (value === "Construction") autoInd = "Construction & Real Estate";
      else if (value === "Education & Teaching") autoInd = "Education & E-Learning";
      else if (value === "Banking & Finance") autoInd = "Banking & Financial Services";
      else if (value === "Retail & E-commerce") autoInd = "Retail & FMCG";
      else if (value === "Logistics & Supply Chain") autoInd = "Logistics & Transportation";
      else if (value === "Hospitality & Hotel") autoInd = "Hospitality & Tourism";
      else if (value === "Media & Entertainment") autoInd = "Media & Entertainment";
      else if (value === "Telecom") autoInd = "Telecommunications";
      else if (value === "Agriculture & Farming") autoInd = "Agriculture & Agrotech";

      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: "", // Reset subcategory when category changes
        industry: autoInd || prev.industry
      }));
    } else if (field === "subcategory") {
      setFormData((prev) => ({
        ...prev,
        subcategory: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveDraft = () => {
    toast.success("Job draft saved successfully!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.location) {
      toast.error("Please fill in Job Title, Company and Location.");
      return;
    }

    const currentUser = dataStore.getCurrentUser();
    const employerId = currentUser ? (currentUser.id || currentUser.email) : formData.company;

    const cleanMin = formData.salaryMin ? formData.salaryMin.replace(/[^0-9]/g, '') : '';
    const cleanMax = formData.salaryMax ? formData.salaryMax.replace(/[^0-9]/g, '') : '';
    const salaryString = cleanMin && cleanMax 
      ? `₹${cleanMin}–₹${cleanMax} / ${formData.salaryType === "Per Day" ? "day" : "month"}`
      : cleanMin
      ? `₹${cleanMin} / ${formData.salaryType === "Per Day" ? "day" : "month"}`
      : "₹25,000–40,000 / month";

    const skillsArray = formData.skills ? formData.skills.split(",").map(s => s.trim()) : ["General Work"];
    const benefitsArray = formData.benefits ? formData.benefits.split(",").map(b => b.trim()) : ["Standard Allowance"];

    const jobPayload = {
      title: formData.title,
      company: formData.company,
      category: formData.category,
      subcategory: formData.subcategory,
      industry: formData.industry,
      description: formData.description || `${formData.title} job posting for ${formData.company}.`,
      responsibilities: ["Execute daily operations and shopfloor targets", "Maintain site and safety standards"],
      requiredSkills: skillsArray,
      qualification: formData.education || "10th Pass",
      experience: formData.experience,
      salary: salaryString,
      ...(formData.salaryMin ? { salaryMin: parseInt(formData.salaryMin) } : {}),
      ...(formData.salaryMax ? { salaryMax: parseInt(formData.salaryMax) } : {}),
      salaryType: formData.salaryType === "Per Day" ? "Daily" : "Monthly" as any,
      location: formData.location,
      jobType: (formData.jobType as any) || "Full Time",
      workMode: "On-site" as any,
      vacancies: parseInt(formData.vacancies) || 5,
      benefits: benefitsArray,
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      whatsappNumber: formData.whatsappNumber,
    };

    if (editJobId) {
      dataStore.updateJob(editJobId, jobPayload);
      toast.success("Job updated successfully!");
    } else {
      dataStore.createJob({
        ...jobPayload,
        employerId,
        status: "Active",
      });
      toast.success("Job published successfully on REAL JOB!");
    }

    setTimeout(() => {
      navigate({ to: "/employer/jobs" });
    }, 1500);
  };

  const getFilteredCategories = () => {
    if (!formData.title || formData.title.trim() === "") return Object.keys(SUBCATEGORIES_MAP);
    
    const titleLower = formData.title.toLowerCase().trim();
    
    // 1. Exact matches first
    const exactMatchCats = Object.keys(SUBCATEGORIES_MAP).filter(cat => {
      if (cat.toLowerCase().includes(titleLower) || titleLower.includes(cat.toLowerCase())) return true;
      return (SUBCATEGORIES_MAP[cat] || []).some(sub => 
        titleLower.includes(sub.toLowerCase()) || sub.toLowerCase().includes(titleLower)
      );
    });
    
    if (exactMatchCats.length > 0) return exactMatchCats;

    // 2. Fallback keyword matches
    const searchTerms = titleLower.split(" ").filter(t => t.length > 2);
    if (searchTerms.length === 0) return Object.keys(SUBCATEGORIES_MAP);

    const matches = Object.keys(SUBCATEGORIES_MAP).filter(cat => {
      if (searchTerms.some(term => cat.toLowerCase().includes(term))) return true;
      if ((SUBCATEGORIES_MAP[cat] || []).some(sub => searchTerms.some(term => sub.toLowerCase().includes(term)))) return true;
      return false;
    });

    return matches.length > 0 ? matches : Object.keys(SUBCATEGORIES_MAP);
  };

  const getFilteredSubcategories = (cat: string) => {
    if (!cat) return [];
    if (!formData.title || formData.title.trim() === "") return SUBCATEGORIES_MAP[cat] || [];

    const titleLower = formData.title.toLowerCase().trim();

    // 1. Exact matches
    const exactMatches = (SUBCATEGORIES_MAP[cat] || []).filter(sub => 
      titleLower.includes(sub.toLowerCase()) || sub.toLowerCase().includes(titleLower)
    );
    if (exactMatches.length > 0) return exactMatches;

    // 2. Keyword matches
    const searchTerms = titleLower.split(" ").filter(t => t.length > 2);
    if (searchTerms.length === 0) return SUBCATEGORIES_MAP[cat] || [];

    const matches = (SUBCATEGORIES_MAP[cat] || []).filter(sub => 
      searchTerms.some(term => sub.toLowerCase().includes(term))
    );

    return matches.length > 0 ? matches : (SUBCATEGORIES_MAP[cat] || []);
  };

  useEffect(() => {
    if (formData.title) {
      const filteredCats = getFilteredCategories();
      if (filteredCats.length === 1 && (!formData.category || !filteredCats.includes(formData.category))) {
        const cat = filteredCats[0];
        if (cat) {
          const filteredSubs = getFilteredSubcategories(cat);

          let autoInd = "";
          if (cat === "IT & Software") autoInd = "Information Technology";
          else if (cat === "Engineering" || cat === "Manufacturing") autoInd = "Manufacturing & Heavy Machinery";
          else if (cat === "Healthcare & Medical") autoInd = "Healthcare & Pharmaceuticals";
          else if (cat === "Construction") autoInd = "Construction & Real Estate";
          else if (cat === "Education & Teaching") autoInd = "Education & E-Learning";
          else if (cat === "Banking & Finance") autoInd = "Banking & Financial Services";
          else if (cat === "Retail & E-commerce") autoInd = "Retail & FMCG";
          else if (cat === "Logistics & Supply Chain") autoInd = "Logistics & Transportation";
          else if (cat === "Hospitality & Hotel") autoInd = "Hospitality & Tourism";
          else if (cat === "Media & Entertainment") autoInd = "Media & Entertainment";
          else if (cat === "Telecom") autoInd = "Telecommunications";
          else if (cat === "Agriculture & Farming") autoInd = "Agriculture & Agrotech";

          setFormData(prev => ({ 
            ...prev, 
            category: cat,
            subcategory: filteredSubs.length === 1 ? (filteredSubs[0] || "") : "",
            industry: prev.industry || autoInd
          }));
        }
      }
    }
  }, [formData.title]);

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate({ to: "/employer/jobs" })}
              className="text-[#063B78] hover:bg-[#063B78]/10 font-bold -ml-4"
            >
              ← मागे जा (Back)
            </Button>
          </div>

          {/* Header Card */}
          <div className="bg-hero-overlay p-8 rounded-2xl text-white mb-8 shadow-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur mb-3">
              <Briefcase className="size-4" />
              {editJobId ? "नोकरी एडिट करा • Edit Job" : "नवीन नोकरी पोस्ट करा • Post Job"}
            </div>
            <h1 className="text-3xl font-black text-white">{editJobId ? "नोकरीची माहिती अपडेट करा" : "कामगारांसाठी नोकरी प्रसिद्ध करा"}</h1>
            <p className="text-sm font-medium text-white/90 mt-1">
              कारखाने, बांधकाम व व्यवसाय क्षेत्रातील कामगारांपर्यंत तुमची नोकरी त्वरित पोहोचवा.
            </p>
          </div>

          {/* Post Job Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-8">
            {/* Section 1: Basic Information */}
            <div>
              <h2 className="text-lg font-black text-[#10233F] pb-3 border-b border-[#DCE5F0] mb-5 flex items-center gap-2">
                <Building2 className="size-5 text-[#063B78]" /> 1. नोकरीची प्राथमिक माहिती (Basic Details)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    नोकरीचे नाव (Job Title) *
                  </label>
                  <Input
                    required
                    placeholder="उदा. Senior CNC Operator / फॅक्टरी वेल्डर"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    कंपनीचे नाव (Company Name) *
                  </label>
                  <Input
                    required
                    placeholder="उदा. Tata Auto Components Ltd."
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    उद्योग / क्षेत्र (Industry)
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleChange("industry", e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                  >
                    <option value="">निवडा (Select Industry)</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    कामगार / नोकरी श्रेणी (Job Category) *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                  >
                    <option value="" disabled>निवडा (Select Category)</option>
                    {Object.keys(SUBCATEGORIES_MAP).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    उपश्रेणी (Job Subcategory) *
                  </label>
                  <select
                    required
                    disabled={!formData.category}
                    value={formData.subcategory}
                    onChange={(e) => handleChange("subcategory", e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F] disabled:opacity-50"
                  >
                    <option value="" disabled>निवडा (Select Subcategory)</option>
                    {formData.category && (SUBCATEGORIES_MAP[formData.category] || []).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    ठिकाण (Location / City) *
                  </label>
                  <Input
                    required
                    placeholder="उदा. Chakan, Pune"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    रिक्त जागांची संख्या (Vacancies)
                  </label>
                  <Input
                    type="number"
                    value={formData.vacancies}
                    onChange={(e) => handleChange("vacancies", e.target.value)}
                    className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Salary & Employment Type */}
            <div>
              <h2 className="text-lg font-black text-[#10233F] pb-3 border-b border-[#DCE5F0] mb-5 flex items-center gap-2">
                <Wallet className="size-5 text-[#125BB5]" /> 2. पगार व नोकरीचे स्वरूप (Salary & Type)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    किमान पगार (Min Salary ₹)
                  </label>
                  <Input
                    placeholder="18,000"
                    value={formData.salaryMin}
                    onChange={(e) => handleChange("salaryMin", e.target.value)}
                    className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    कमाल पगार (Max Salary ₹)
                  </label>
                  <Input
                    placeholder="25,000"
                    value={formData.salaryMax}
                    onChange={(e) => handleChange("salaryMax", e.target.value)}
                    className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    पगाराचा कालावधी (Salary Type)
                  </label>
                  <select
                    value={formData.salaryType}
                    onChange={(e) => handleChange("salaryType", e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                  >
                    <option value="Per Month">दरमहा (Per Month)</option>
                    <option value="Per Day">दररोज (Per Day)</option>
                    <option value="Per Year">वार्षिक (Per Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    आवश्यक अनुभव (Experience Required)
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                  >
                    <option value="Freshers Allowed">नवीन कामगार (Fresher Allowed)</option>
                    <option value="1-3 Years">1 ते 3 वर्षे (1-3 Years)</option>
                    <option value="3-5 Years">3 ते 5 वर्षे (3-5 Years)</option>
                    <option value="5+ Years">5 वर्षांपेक्षा जास्त (5+ Years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    नोकरीचा प्रकार (Job Type)
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => handleChange("jobType", e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                  >
                    <option value="Full-time">पूर्ण वेळ (Full-time)</option>
                    <option value="Part-time">अर्धा वेळ (Part-time)</option>
                    <option value="Contract">कंत्राटी (Contract)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Requirements & Description */}
            <div>
              <h2 className="text-lg font-black text-[#10233F] pb-3 border-b border-[#DCE5F0] mb-5 flex items-center gap-2">
                <FileText className="size-5 text-[#063B78]" /> 3. कामाचे स्वरूप व कौशल्ये (Details & Skills)
              </h2>

              <div className="space-y-5">


                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    कामाचे वर्णन व अटी (Job Description)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="कामाचे स्वरूप, वेळ आणि इतर नियम सविस्तर प्रविष्ट करा..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="w-full rounded-lg border border-[#DCE5F0] p-3 text-xs font-bold text-[#10233F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                      कंपनीचे फायदे (Benefits, e.g. PF, Canteen)
                    </label>
                    <Input
                      placeholder="उदा. Free Canteen, OT Allowance, Bus Facility"
                      value={formData.benefits}
                      onChange={(e) => handleChange("benefits", e.target.value)}
                      className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                      संपर्क व्यक्ती (Contact Person Name)
                    </label>
                    <Input
                      placeholder="उदा. HR Ramesh Pawar"
                      value={formData.contactPerson}
                      onChange={(e) => handleChange("contactPerson", e.target.value)}
                      className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                      मोबाईल / व्हॉट्सॲप नंबर (Mobile / WhatsApp)
                    </label>
                    <Input
                      placeholder="उदा. +91 98220 11223"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange("contactPhone", e.target.value)}
                      className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-6 border-t border-[#DCE5F0] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {editJobId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: "/employer/jobs" })}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold text-xs"
                  >
                    रद्द करा (Cancel)
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="border-[#063B78] text-[#063B78] font-bold text-xs"
                >
                  <Save className="size-4 mr-1.5" /> ड्राफ्ट सेव्ह करा (Save Draft)
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPreview(true)}
                  className="bg-[#EBF1F8] text-[#063B78] font-bold text-xs"
                >
                  <Eye className="size-4 mr-1.5" /> प्रीव्ह्यू (Preview)
                </Button>

                <Button type="submit" className="btn-yellow font-black text-xs px-8 py-3 h-11">
                  <Send className="size-4 mr-1.5" /> {editJobId ? "माहिती सेव्ह करा (Update Job)" : "नोकरी प्रसिद्ध करा (Publish Job)"}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-[#082F63]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl relative">
              <button onClick={() => setShowPreview(false)} className="absolute right-4 top-4 text-[#5B6B7F]">
                <X className="size-5" />
              </button>

              <h3 className="text-xl font-black text-[#10233F] mb-4">नोकरी प्रीव्ह्यू (Job Preview)</h3>

              <div className="card-realjob p-6 space-y-4">
                <div>
                  <h4 className="text-xl font-black text-[#063B78]">{formData.title || "Job Title"}</h4>
                  <p className="text-xs font-bold text-[#125BB5]">{formData.company} • {formData.location}</p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <Badge className="bg-[#FFC400] text-[#082F63]">
                    ₹{formData.salaryMin} - ₹{formData.salaryMax} {formData.salaryType}
                  </Badge>
                  <Badge variant="outline">{formData.experience}</Badge>
                  <Badge variant="outline">{formData.jobType}</Badge>
                </div>

                <p className="text-xs font-semibold text-[#5B6B7F]">
                  {formData.description || "Job description preview..."}
                </p>
              </div>

              <div className="mt-6 text-right">
                <Button onClick={() => setShowPreview(false)} className="btn-yellow text-xs font-bold">
                  बंद करा (Close)
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <PublicFooter />
    </>
  );
}
