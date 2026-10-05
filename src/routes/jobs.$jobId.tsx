import { useState, useEffect } from "react";
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
  ShieldCheck,
  Wallet,
  X,
  Briefcase,
  User,
  Building,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { JobCard, jobs } from "@/components/portal/JobCard";
import { JobCardImage } from "@/components/portal/JobCardImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { DynamicApplicationForm } from "@/components/portal/DynamicApplicationForm";
import { dataStore } from "@/lib/data-store";
import { getFallbackConfig } from "@/lib/applicationConfig";

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
      vacancies: storeJob.vacancies,
      employerId: storeJob.employerId || storeJob.company,
      description: storeJob.description,
      responsibilities: storeJob.responsibilities,
      requiredSkills: storeJob.requiredSkills,
      applicationConfig: storeJob.applicationConfig,
    };
  }
  return (jobs.find((j) => j.id === jobId) ?? jobs[0])!;
}

function JobDetailPage() {
  const { t, n, lang } = useI18n();
  const { jobId } = useParams({ from: "/jobs/$jobId" });
  const job = getJobDetails(jobId);

  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!showApplyModal) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [showApplyModal]);
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantExp, setApplicantExp] = useState("3 Years");

  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, any>>({});

  const similarJobs = jobs.filter((j) => j.id !== job.id).slice(0, 3);

  const appConfig = (job as any).applicationConfig || getFallbackConfig(job.category);

  const handleFieldChange = (key: string, val: any) => setFieldValues(p => ({ ...p, [key]: val }));
  const handleCustomChange = (id: string, val: any) => setCustomAnswers(p => ({ ...p, [id]: val }));

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = dataStore.getCurrentUser();
    const seekerId = currentUser ? (currentUser.email || currentUser.id || "seeker-demo") : (applicantName ? `seeker-${applicantName}` : "candidate@realjob.com");
    const name = applicantName || currentUser?.fullName || "Candidate";
    const userAcc = seekerId ? dataStore.findRegisteredAccount(seekerId) : null;
    const userMobile = userAcc?.mobile || (currentUser as any)?.mobile || "";

    if (dataStore.hasAlreadyApplied(seekerId, job.id)) {
      toast.error(lang === "mr" ? "तुम्ही या नोकरीसाठी आधीच अर्ज भरला आहे!" : "You have already applied to this job!");
      setShowApplyModal(false);
      return;
    }

    const resolvedMobile =
      fieldValues['mobile'] ||
      fieldValues['phone'] ||
      fieldValues['candidateMobile'] ||
      fieldValues['mobileNumber'] ||
      fieldValues['contactNumber'] ||
      fieldValues['phoneNo'] ||
      fieldValues['mobileNo'] ||
      applicantPhone ||
      userMobile;

    try {
      dataStore.createApplication({
        jobId: job.id,
        employerId: job.company,
        jobSeekerId: seekerId,
        candidateName: fieldValues['fullName'] || name,
        candidateEmail: fieldValues['email'] || seekerId,
        candidateMobile: resolvedMobile,
        jobTitle: job.title,
        companyName: job.company,
        location: job.location,
        salary: job.salary,
        resume: fieldValues['resume'] || `${name.replaceAll(" ", "_")}_Resume.pdf`,
        fieldValues,
        customAnswers,
        category: job.category
      } as any);

      setApplied(true);
      toast.success(`Application submitted for ${job.title}! ${job.company} will call you shortly.`);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplied(false);
      }, 2000);
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
                    {(job as any).approvalStatus === "pending" && (
                      <Badge className="bg-amber-500 text-white font-black text-xs px-2.5 py-0.5">
                        ⏳ Pending Super Admin Approval
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-[#10233F] mt-1">{job.title}</h1>
                  <div className="flex items-center gap-3 flex-wrap mt-1">
                    <p className="text-sm font-extrabold text-[#125BB5] flex items-center gap-1.5">
                      <Building2 className="size-4" /> {job.company}
                    </p>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                      <User className="size-3.5" /> Job Poster: <strong>{(job as any).employerId || job.company}</strong>
                    </span>
                  </div>

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
                  disabled={(job as any).approvalStatus === "pending"}
                  onClick={() => setShowApplyModal(true)}
                  className="btn-yellow flex-1 sm:flex-none font-black text-xs px-8 py-3 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(job as any).approvalStatus === "pending" ? "⏳ Pending Approval" : t("applyNow")}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSaved(!saved)}
                    className={`flex-1 border-[#063B78] font-bold text-xs h-11 ${saved ? "bg-[#EBF1F8] text-[#063B78]" : "text-[#063B78]"
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
                  <p className="text-sm font-semibold text-[#5B6B7F] leading-relaxed">
                    Urgent requirement for skilled and experienced workforce in factory operations. The candidate should have relevant experience, willingness to work in shifts and maintain quality standards.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-black text-[#10233F] mb-3">{t("responsibilities")}</h2>
                  <ul className="space-y-2 text-sm font-semibold text-[#5B6B7F] list-disc pl-5">
                    <li>Perform day-to-day operations and maintenance.</li>
                    <li>Follow safety guidelines and complete production targets on time.</li>
                    <li>Coordinate with team supervisor and plant management.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-black text-[#10233F] mb-3">{t("requirements")}</h2>
                  <ul className="space-y-2 text-sm font-semibold text-[#5B6B7F] list-disc pl-5">
                    <li>10th / 12th Pass or ITI Trade Certificate.</li>
                    <li>1 to 5 years relevant trade experience.</li>
                    <li>Punctuality and dedication to work.</li>
                  </ul>
                </div>


              </div>


            </div>

            {/* Right Sticky Sidebar */}
            <div>
              <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs sticky top-24 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#10233F]">{t("talkDirectlyToEmployer")}</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                    {t("directContactDesc")}
                  </p>
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
                    <form onSubmit={handleApplySubmit} className="space-y-6">
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
                        <p className="text-sm font-black text-[#10233F]">{job.vacancies || job.openings || 1}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <PublicFooter />
    </>
  );
}
