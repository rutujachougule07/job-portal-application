import { useState } from "react";
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
  "HR & Recruitment": [
    "HR Executive (एचआर एक्झिक्युटिव्ह)",
    "HR Manager (एचआर मॅनेजर)",
    "Recruiter / Talent Acquisition (भरती अधिकारी)",
    "Technical Recruiter (आयटी भरतीदार)",
    "Payroll Executive (पेरोल एक्झिक्युटिव्ह)",
    "HR Generalist",
  ],
  "IT & Software": [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "React Developer",
    "Java Developer",
    "Python Developer",
    "Software Developer",
    "Software Tester / QA",
    "Data Analyst",
    "DevOps Engineer",
    "UI/UX Designer",
  ],
  "Engineering": [
    "Mechanical Engineer",
    "Electrical Engineer",
    "Civil Engineer",
    "Electronics Engineer",
    "Production Engineer",
    "Automobile Engineer",
    "Quality Engineer",
  ],
  "Healthcare & Medical": [
    "Staff Nurse (परिचारिका)",
    "ICU Assistant",
    "Doctor",
    "Pharmacist (औषधनिर्माता)",
    "Lab Technician",
    "Medical Assistant",
  ],
  "Finance & Accounting": [
    "Accountant (लेखापाल)",
    "Finance Executive",
    "Banking Executive",
    "Auditor",
    "Tax Consultant / GST Executive",
  ],
  "Sales & Marketing": [
    "Sales Executive",
    "Business Development Executive",
    "Digital Marketing Specialist",
    "Telecaller / Customer Support",
    "Field Sales Officer",
  ],
  "Education": [
    "School Teacher (शिक्षक)",
    "Professor / Lecturer",
    "Online Tutor",
    "Academic Coordinator",
  ],
  "Design & Creative": [
    "Graphic Designer",
    "Video Editor",
    "Content Creator",
    "UI/UX Designer",
  ],
  "Legal": [
    "Lawyer / Advocate",
    "Legal Executive",
    "Compliance Officer",
  ],
  "Architecture & Design": [
    "Architect",
    "Interior Designer",
    "3D Visualizer / CAD Designer",
  ],
  "Factory Workers": [
    "CNC / VMC Machine Operator",
    "Assembly Line Worker",
    "Quality Inspector",
    "Factory Helper (कारखाना मदतनीस)",
    "Production Supervisor",
    "Welder (वेल्डर)",
  ],
  "Construction & Building": [
    "Construction Worker (बांधकाम कामगार)",
    "Mason (गवंडी)",
    "Helper (मदतनीस)",
    "Carpenter (सुतार)",
    "Painter (रंगारी)",
    "Plumber (प्लंबर)",
    "Electrician (इलेक्ट्रीशियन)",
    "Tile Worker",
    "Welder (वेल्डर)",
    "Steel Fixer",
    "Civil Engineer",
  ],
  "Technical Staff": [
    "Technician",
    "Maintenance Engineer",
    "Electrician",
    "Fitter / Turner",
    "Tool & Die Maker",
  ],
  "Logistics & Drivers": [
    "Driver (ड्रायव्हर)",
    "Heavy Commercial Truck Driver",
    "Tempo / Auto Driver",
    "Delivery Worker (डिलिव्हरी बॉय)",
    "Loader & Unloader (हमाल)",
  ],
  "Agriculture & Farming": [
    "Farm Worker (शेतमजूर)",
    "Tractor Operator (ट्रॅक्टर चालक)",
    "Harvesting Worker (काढणी कामगार)",
    "Gardener (माळी)",
    "Dairy Worker (दुग्धव्यवसाय कामगार)",
    "Poultry Worker (पोल्ट्री कामगार)",
    "Fruit Picker",
  ],
  "Skilled Workers": [
    "Senior Electrician",
    "Mason",
    "Welder",
    "Mechanic",
    "Fitter",
    "Plumber",
  ],
  "Unskilled Workers": [
    "General Helper (मदतनीस)",
    "Loading Worker",
    "Site Helper",
    "Cleaning Helper",
  ],
  "Electricians": [
    "Electrician (इलेक्ट्रीशियन)",
    "Panel Wireman",
    "Maintenance Technician",
    "AC / Repair Technician",
  ],
  "Warehouse Workers": [
    "Warehouse Helper",
    "Picker & Packer",
    "Inventory Controller",
    "Forklift Operator",
  ],
  "Hotel & Restaurant": [
    "Chef / Head Cook (आचारी)",
    "Assistant Cook (सहाय्यक आचारी)",
    "Waiter / Server",
    "Housekeeping Staff",
    "Receptionist / Counter Staff",
  ],
  "Security": [
    "Security Guard (सुरक्षा रक्षक)",
    "Security Supervisor",
    "CCTV Monitor",
  ],
  "Helpers": [
    "General Helper (मदतनीस)",
    "Housekeeping",
    "Office Boy / Peon",
    "Attendant",
  ],
};

export const Route = createFileRoute("/_authenticated/post-job")({
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
    skills: "Recruitment, Screening, Interviewing, Payroll",
    education: "MBA / Graduate",
    languages: "English, Hindi, Marathi",
    benefits: "Health Insurance, Annual Bonus",
    description: "",
    contactPerson: "",
    contactPhone: "",
  });

  const handleChange = (field: string, value: string) => {
    if (field === "category") {
      const subOptions = SUBCATEGORIES_MAP[value] || ["General Role"];
      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: subOptions[0] || "General Role",
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

    dataStore.createJob({
      employerId,
      title: formData.title,
      company: formData.company,
      category: formData.category,
      subcategory: formData.subcategory || formData.category,
      description: formData.description || `${formData.title} job posting for ${formData.company}.`,
      responsibilities: ["Execute daily operations and shopfloor targets", "Maintain site and safety standards"],
      requiredSkills: skillsArray,
      qualification: formData.education || "10th Pass",
      experience: formData.experience,
      salary: salaryString,
      ...(formData.salaryMin ? { salaryMin: parseInt(formData.salaryMin) } : {}),
      ...(formData.salaryMax ? { salaryMax: parseInt(formData.salaryMax) } : {}),
      salaryType: formData.salaryType === "Per Day" ? "Daily" : "Monthly",
      location: formData.location,
      jobType: (formData.jobType as any) || "Full Time",
      workMode: "On-site",
      vacancies: parseInt(formData.vacancies) || 5,
      benefits: benefitsArray,
      status: "Active",
      approvalStatus: "pending",
    });

    toast.success("⏳ नोकरी सबमिट झाली आहे! सुपर ॲडमिन मंजुरीनंतर (Super Admin approval) ही Job वेबसाईटवर दिसेल.");
    setTimeout(() => {
      navigate({ to: "/jobs" });
    }, 1800);
  };

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header Card */}
          <div className="bg-hero-overlay p-8 rounded-2xl text-white mb-8 shadow-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur mb-3">
              <Briefcase className="size-4" />
              नवीन नोकरी पोस्ट करा • Post Job
            </div>
            <h1 className="text-3xl font-black text-white">कामगारांसाठी नोकरी प्रसिद्ध करा</h1>
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
                    कामगार / नोकरी श्रेणी (Category) *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                  >
                    <optgroup label="💻 Professional & Corporate Categories (कॉर्पोरेट श्रेणी)">
                      <option value="IT & Software">IT & Software (आयटी व सॉफ्टवेअर)</option>
                      <option value="Engineering">Engineering (अभियांत्रिकी व तांत्रिक)</option>
                      <option value="Healthcare & Medical">Healthcare & Medical (वैद्यकीय व आरोग्य)</option>
                      <option value="Finance & Accounting">Finance & Accounting (वित्त व अकाऊंटिंग)</option>
                      <option value="Sales & Marketing">Sales & Marketing (विक्री व मार्केटिंग)</option>
                      <option value="Education">Education (शिक्षण व अध्यापन)</option>
                      <option value="HR & Recruitment">HR & Recruitment (एचआर व भरती)</option>
                      <option value="Design & Creative">Design & Creative (डिझाइन व आर्ट)</option>
                      <option value="Legal">Legal & Compliance (कायदेशीर)</option>
                      <option value="Architecture & Design">Architecture & Design (स्थापत्य डिझाइन)</option>
                    </optgroup>

                    <optgroup label="🛠️ Skilled & Worker Categories (कामगार व व्यवसाय श्रेणी)">
                      <option value="Factory Workers">Factory Workers (कारखाना कामगार)</option>
                      <option value="Construction & Building">Construction Workers (बांधकाम)</option>
                      <option value="Technical Staff">Technical Staff (तांत्रिक कामगार)</option>
                      <option value="Logistics & Drivers">Logistics & Drivers (ड्रायव्हर व वाहतूक)</option>
                      <option value="Agriculture & Farming">Agriculture & Farming (शेती व कृषी)</option>
                      <option value="Skilled Workers">Skilled Workers (कुशल कामगार)</option>
                      <option value="Unskilled Workers">Unskilled Workers (अकुशल कामगार)</option>
                      <option value="Electricians">Electricians & Maintenance (इलेक्ट्रीशियन व मेंटेनन्स)</option>
                      <option value="Warehouse Workers">Warehouse Workers (वेअरहाउस)</option>
                      <option value="Hotel & Restaurant">Hotel & Restaurant (हॉटेल व रेस्टॉरंट)</option>
                      <option value="Security">Security Guards (सुरक्षा रक्षक)</option>
                      <option value="Helpers">Helpers & Attendants (मदतनीस)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#10233F] mb-1.5 uppercase">
                    उपश्रेणी / पद (Subcategory / Role) *
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleChange("subcategory", e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                  >
                    {(SUBCATEGORIES_MAP[formData.category] || ["General Role"]).map((sub) => (
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
                    आवश्यक कौशल्ये (Required Skills, Comma Separated)
                  </label>
                  <Input
                    placeholder="उदा. Wiring, ITI Certificate, Panel Inspection"
                    value={formData.skills}
                    onChange={(e) => handleChange("skills", e.target.value)}
                    className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                </div>

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
                      संपर्क व्यक्ती व मोबाईल (Contact Person & Phone)
                    </label>
                    <Input
                      placeholder="उदा. HR Ramesh Pawar (+91 98220 11223)"
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
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="border-[#063B78] text-[#063B78] font-bold text-xs"
              >
                <Save className="size-4 mr-1.5" /> ड्राफ्ट सेव्ह करा (Save Draft)
              </Button>

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
                  <Send className="size-4 mr-1.5" /> नोकरी प्रसिद्ध करा (Publish Job)
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
