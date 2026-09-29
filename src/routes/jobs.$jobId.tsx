import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  Send,
  Share2,
  Wallet,
  X,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { JobCard, jobs } from "@/components/portal/JobCard";
import { JobCardImage } from "@/components/portal/JobCardImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

import { dataStore } from "@/lib/data-store";
import { notifyEmployerOnApplication } from "@/lib/notifications";

export const Route = createFileRoute("/jobs/$jobId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.jobId.replaceAll("-", " ")} — REAL JOB` },
      { name: "description", content: "Apply directly for verified factory, construction, driver and technical jobs on REAL JOB." },
    ],
  }),
  component: JobDetailPage,
});

function getJobDetails(jobId: string) {
  const storeJob = dataStore.getJobById(jobId);
  if (storeJob) {
    return {
      id: storeJob.id,
      title: storeJob.title,
      company: storeJob.company,
      location: storeJob.location,
      salary: storeJob.salary,
      experience: storeJob.experience,
      type: storeJob.jobType,
      workMode: (storeJob.workMode as any) || "On-site",
      posted: storeJob.postedAgo || "Recently",
      initials: storeJob.initials || storeJob.company.slice(0, 2).toUpperCase(),
      category: storeJob.category,
      featured: storeJob.featured,
      openings: storeJob.vacancies,
      description: storeJob.description,
      responsibilities: storeJob.responsibilities,
      requiredSkills: storeJob.requiredSkills,
      whatsappNumber: storeJob.whatsappNumber,
      contactEmail: storeJob.contactEmail,
    };
  }
  return (jobs.find((j) => j.id === jobId) ?? jobs[0])!;
}

export function JobDetailPage() {
  const { t, n, lang } = useI18n();
  const { jobId } = useParams({ from: "/jobs/$jobId" });
  const job = getJobDetails(jobId) as any;

  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantExp, setApplicantExp] = useState("3 Years");
  
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [mailtoUrl, setMailtoUrl] = useState("");

  const similarJobs = jobs.filter((j) => j.id !== job.id).slice(0, 3);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = dataStore.getCurrentUser();
    const seekerId = currentUser ? (currentUser.email || currentUser.id || "seeker-demo") : (applicantName ? `seeker-${applicantName}` : "candidate@realjob.com");
    const name = applicantName || currentUser?.fullName || "Candidate";

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
        candidateName: name,
        candidateEmail: seekerId,
        candidateMobile: applicantPhone || "+91 98220 11223",
        jobTitle: job.title,
        companyName: job.company,
        location: job.location,
        salary: job.salary,
        resume: `${name.replaceAll(" ", "_")}_Resume.pdf`,
        candidateExp: applicantExp,
      });

      const notifyUrls = notifyEmployerOnApplication({
        candidateName: name,
        candidateEmail: seekerId,
        candidateMobile: applicantPhone || "+91 98220 11223",
        candidateExp: applicantExp,
        jobTitle: job.title,
        companyName: job.company,
        employerEmail: (job as any).contactEmail,
        employerPhone: (job as any).whatsappNumber,
      });

      setWhatsappUrl(notifyUrls.whatsappUrl);
      setMailtoUrl(notifyUrls.mailtoUrl);
      setApplied(true);
      toast.success(`Application submitted for ${job.title}!`);
      
      // We don't auto-close the modal immediately so user can click the WhatsApp button
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this job opening on REAL JOB: ${job.title} (${job.salary})`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  };

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Top Navigation */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className="px-3 py-2 text-[#5B6B7F] hover:text-[#10233F] hover:bg-white rounded-lg flex items-center gap-1.5 text-[13px] font-bold transition-colors shrink-0 shadow-sm border border-[#DCE5F0] bg-white"
            >
              <ArrowLeft className="size-4" /> {lang === "mr" ? "मागे जा" : "Back"}
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-[#5B6B7F]">
              <Link to="/" className="hover:text-[#063B78]">{t("home")}</Link>
              <span>/</span>
              <Link to="/jobs" className="hover:text-[#063B78]">{t("jobs")}</Link>
              <span>/</span>
              <span className="text-[#10233F]">{job.title}</span>
            </div>
          </div>

          {/* Top Job Banner Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE5F0] shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#063B78] font-black text-2xl text-white shadow-md">
                  {job.initials}
                </span>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-[#FFC400] text-[#082F63] font-black text-xs px-2.5 py-0.5">
                      ✓ {t("verifiedCompany")}
                    </Badge>
                    <Badge variant="outline" className="border-[#063B78] text-[#063B78] font-bold text-xs">
                      {job.workMode}
                    </Badge>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-[#10233F] mt-1">{job.title}</h1>
                  <p className="text-sm font-extrabold text-[#125BB5] flex items-center gap-1.5 mt-1">
                    <Building2 className="size-4" /> {job.company}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-[#5B6B7F]">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4 text-[#063B78]" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-[#063B78]">
                      <Wallet className="size-4 text-[#FFC400]" /> {n(job.salary)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="size-4 text-[#5B6B7F]" /> {n(job.posted)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col gap-3 w-full sm:w-auto shrink-0">
                <Button
                  onClick={() => setShowApplyModal(true)}
                  className="btn-yellow flex-1 sm:flex-none font-black text-xs px-8 py-3 h-11"
                >
                  {t("applyNow")}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSaved(!saved)}
                    className={`flex-1 border-[#063B78] font-bold text-xs h-11 ${
                      saved ? "bg-[#EBF1F8] text-[#063B78]" : "text-[#063B78]"
                    }`}
                  >
                    {saved ? <BookmarkCheck className="size-4 mr-1 text-[#063B78]" /> : <Bookmark className="size-4 mr-1" />}
                    {saved ? t("save") : t("save")}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="border-[#063B78] text-[#063B78] font-bold text-xs h-11 px-3"
                  >
                    <Share2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCE5F0] shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-black text-[#10233F] mb-3">{t("jobDescription")}</h2>
                  <p className="text-sm font-semibold text-[#5B6B7F] leading-relaxed whitespace-pre-wrap">
                    {job.description || "माहिती उपलब्ध नाही (Description not provided)."}
                  </p>
                </div>

                  <h2 className="text-lg font-black text-[#10233F] mb-3">{t("requirements")} (पात्रता व कौशल्ये)</h2>
                  <ul className="space-y-2 text-sm font-semibold text-[#5B6B7F] list-disc pl-5">
                    <li><strong>शिक्षण (Education):</strong> {job.qualification || "Not specified"}</li>
                    <li><strong>अनुभव (Experience):</strong> {job.experience || "Not specified"}</li>
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <li><strong>कौशल्ये (Skills):</strong> {job.requiredSkills.join(", ")}</li>
                    )}
                    {job.benefits && job.benefits.length > 0 && (
                      <li><strong>फायदे (Benefits):</strong> {job.benefits.join(", ")}</li>
                    )}
                    <li><strong>रिक्त जागा (Vacancies):</strong> {job.vacancies || 1}</li>
                  </ul>


              </div>


            </div>

            {/* Right Sticky Sidebar */}
            <div>
              <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs sticky top-24 space-y-6">
                  <h3 className="text-lg font-black text-[#10233F]">{t("talkDirectlyToEmployer")}</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-1 mb-4">
                    {t("directContactDesc")}
                  </p>
                  
                  <div className="bg-[#EBF1F8] p-3 rounded-lg border border-[#DCE5F0] space-y-1.5 mb-2">
                    <p className="text-xs font-bold text-[#082F63] uppercase">संपर्क अधिकारी (Contact)</p>
                    <p className="text-sm font-black text-[#10233F]">{job.contactPerson || job.company}</p>
                    {job.contactPhone && (
                      <p className="text-xs font-bold text-[#5B6B7F] flex items-center gap-1.5">
                        📞 {job.contactPhone}
                      </p>
                    )}
                    {job.whatsappNumber && (
                      <p className="text-xs font-bold text-[#25D366] flex items-center gap-1.5">
                        💬 WhatsApp: {job.whatsappNumber}
                      </p>
                    )}
                  </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs font-bold text-[#10233F]">
                    <CheckCircle2 className="size-4 text-[#FFC400]" /> {t("freeApplication")}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#10233F]">
                    <CheckCircle2 className="size-4 text-[#FFC400]" /> {t("response24h")}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#10233F]">
                    <CheckCircle2 className="size-4 text-[#FFC400]" /> {t("verifiedCompany")}
                  </div>
                </div>

                <Button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full btn-yellow font-black text-xs py-3 h-11"
                >
                  <Send className="size-4 mr-1.5" /> {t("applyNow")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 bg-[#082F63]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
              <button onClick={() => setShowApplyModal(false)} className="absolute right-4 top-4 text-[#5B6B7F]">
                <X className="size-5" />
              </button>

              {applied ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="size-16 text-[#063B78] mx-auto mb-3 animate-bounce" />
                  <h3 className="text-xl font-black text-[#10233F]">{t("applicationSubmitted")}</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-2 mb-6">
                    तुमचा अर्ज यशस्वीरीत्या जमा झाला आहे. कंपनीला थेट सूचित करण्यासाठी खालील पर्यायांचा वापर करा.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      asChild 
                      className="bg-[#25D366] hover:bg-[#1DA851] text-white font-black text-xs py-3 h-11 w-full"
                    >
                      <a href={whatsappUrl} target="_blank" rel="noreferrer">
                        WhatsApp वर माहिती पाठवा
                      </a>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline"
                      className="border-[#063B78] text-[#063B78] font-black text-xs py-3 h-11 w-full"
                    >
                      <a href={mailtoUrl} target="_blank" rel="noreferrer">
                        Email द्वारे सूचित करा
                      </a>
                    </Button>
                    <button 
                      onClick={() => {
                        setShowApplyModal(false);
                        setApplied(false);
                      }}
                      className="text-xs font-bold text-[#5B6B7F] underline mt-3 hover:text-[#10233F]"
                    >
                      बंद करा
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <h3 className="text-lg font-black text-[#10233F]">{job.title}</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F]">{job.company} • {job.location}</p>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("yourName")} *</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Pawar"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("phoneNumber")} *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98220 00000"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("experience")}</label>
                    <select
                      value={applicantExp}
                      onChange={(e) => setApplicantExp(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="1-3 Years">1 - 3 Years</option>
                      <option value="3-5 Years">3 - 5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full btn-yellow font-black text-xs py-3 h-11">
                    {t("submitApplication")}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
      <PublicFooter />
    </>
  );
}
