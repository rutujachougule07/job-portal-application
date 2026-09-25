import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  Globe,
  MapPin,
  PhoneCall,
  Send,
  Share2,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { JobCard, jobs, Job } from "@/components/portal/JobCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs/$jobId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.jobId.replaceAll("-", " ")} — REAL JOB` },
      { name: "description", content: "Apply directly for verified factory, construction, driver and technical jobs on REAL JOB." },
    ],
  }),
  component: JobDetailPage,
});

export function JobDetailPage() {
  const { jobId } = useParams({ from: "/jobs/$jobId" });
  const job = (jobs.find((j) => j.id === jobId) ?? jobs[0])!;

  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantExp, setApplicantExp] = useState("3 Years");

  const similarJobs = jobs.filter((j) => j.id !== job.id).slice(0, 3);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    toast.success(`Application submitted for ${job.title}! ${job.company} will call you shortly.`);
    setTimeout(() => {
      setShowApplyModal(false);
      setApplied(false);
    }, 2000);
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
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#5B6B7F] mb-6">
            <Link to="/" className="hover:text-[#063B78]">मुख्य पृष्ठ (Home)</Link>
            <span>/</span>
            <Link to="/jobs" className="hover:text-[#063B78]">नोकऱ्या (Jobs)</Link>
            <span>/</span>
            <span className="text-[#10233F]">{job.title}</span>
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
                      ✓ verified Company
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
                      <Wallet className="size-4 text-[#FFC400]" /> {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="size-4 text-[#5B6B7F]" /> {job.posted}
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
                  अर्ज करा (Apply Now)
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
                    {saved ? "Saved" : "Save"}
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
                  <h2 className="text-lg font-black text-[#10233F] mb-3">कामाचे स्वरूप (Job Description)</h2>
                  <p className="text-sm font-semibold text-[#5B6B7F] leading-relaxed">
                    वी लव्ह आणि फॅक्टरी ऑपरेशन्ससाठी अनुभवी कामगारांची तातडीने गरज आहे. उमेदवाराकडे संबंधित कामाचा किमान अनुभव असावा. उत्कृष्ट काम करणाऱ्यांना ओव्हरटाईम व बोनस दिला जाईल.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-black text-[#10233F] mb-3">जबाबदाऱ्या (Responsibilities)</h2>
                  <ul className="space-y-2 text-sm font-semibold text-[#5B6B7F] list-disc pl-5">
                    <li>दररोजच्या मशिनरी व पॅनेलची योग्य देखभाल करणे.</li>
                    <li>सुरक्षेचे नियम पाळून दर्जेदार उत्पादन वेळेत पूर्ण करणे.</li>
                    <li>सुपरवायझरच्या सूचनेनुसार कामाचे नियोजन करणे.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-black text-[#10233F] mb-3">आवश्यक पात्रता (Requirements)</h2>
                  <ul className="space-y-2 text-sm font-semibold text-[#5B6B7F] list-disc pl-5">
                    <li>10 वी पास / ITI सर्टिफिकेट असणे आवश्यक.</li>
                    <li>कामाचा किमान 1 ते 3 वर्षांचा अनुभव.</li>
                    <li>शिस्तबद्धता आणि प्रामाणिकपणा.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-black text-[#10233F] mb-3">कंपनीचे फायदे (Benefits & Perks)</h2>
                  <div className="flex flex-wrap gap-2">
                    {["मोफत जेवण (Free Food)", "राहण्याची सोय (Free Room)", "ओव्हरटाईम भत्ता (OT Allowance)", "PF & ESIC वीमा"].map((b, i) => (
                      <Badge key={i} className="bg-[#EBF1F8] text-[#063B78] font-bold text-xs px-3 py-1 border-0">
                        ✓ {b}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Similar Jobs */}
              <div>
                <h3 className="text-xl font-black text-[#10233F] mb-4">सारख्याच इतर नोकऱ्या (Similar Jobs)</h3>
                <div className="space-y-4">
                  {similarJobs.map((simJob) => (
                    <JobCard key={simJob.id} job={simJob} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar */}
            <div>
              <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs sticky top-24 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#10233F]">थेट मालकाशी बोला</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                    कोणत्याही एजंटशिवाय कंपनीशी थेट संपर्क साधा.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs font-bold text-[#10233F]">
                    <CheckCircle2 className="size-4 text-[#FFC400]" /> 100% विनामूल्य अर्ज
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#10233F]">
                    <CheckCircle2 className="size-4 text-[#FFC400]" /> 24 तासांत प्रतिसाद
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#10233F]">
                    <CheckCircle2 className="size-4 text-[#FFC400]" /> सत्यापित कंपनी
                  </div>
                </div>

                <Button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full btn-yellow font-black text-xs py-3 h-11"
                >
                  <Send className="size-4 mr-1.5" /> आता अर्ज करा (Apply Now)
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
                  <h3 className="text-xl font-black text-[#10233F]">अर्ज यशस्वीरीत्या सादर झाला!</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                    {job.company} चे प्रतिनिधी तुमच्याशी लवकरच संपर्क करतील.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <h3 className="text-lg font-black text-[#10233F]">{job.title} साठी अर्ज</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F]">{job.company} • {job.location}</p>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">तुमचे नाव (Your Name) *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. राहुल पवार"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">मोबाईल नंबर (Mobile) *</label>
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
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">कामाचा अनुभव (Experience)</label>
                    <select
                      value={applicantExp}
                      onChange={(e) => setApplicantExp(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                    >
                      <option value="Fresher">नवीन (Fresher)</option>
                      <option value="1-3 Years">1 ते 3 वर्षे</option>
                      <option value="3-5 Years">3 ते 5 वर्षे</option>
                      <option value="5+ Years">5+ वर्षे</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full btn-yellow font-black text-xs py-3 h-11">
                    अर्ज सादर करा (Submit Application)
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
