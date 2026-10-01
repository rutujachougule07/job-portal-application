import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  BadgeCheck,
  CheckCircle2,
  MapPin,
  PhoneCall,
  Share2,
  Star,
  User,
  X,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { workersList } from "@/components/portal/WorkerCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/workers/$workerId")({
  head: () => ({
    meta: [
      { title: "Worker Profile — REAL JOB" },
      { name: "description", content: "View verified worker details, trade experience, expected salary, and direct contact options on REAL JOB." },
    ],
  }),
  component: WorkerProfilePage,
});

export function WorkerProfilePage() {
  const { t, n, lang } = useI18n();
  const { workerId } = useParams({ from: "/workers/$workerId" });
  const worker = (workersList.find((w) => w.id === workerId) ?? workersList[0])!;

  const [showContactModal, setShowContactModal] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [employerName, setEmployerName] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const displayProfession =
    lang === "mr"
      ? worker.marathiProfession
      : lang === "hi"
      ? worker.hindiProfession || worker.profession
      : worker.profession;

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    toast.success(`Hire request sent to ${worker.name}! They will contact you shortly.`);
    setTimeout(() => {
      setShowContactModal(false);
      setRequestSubmitted(false);
    }, 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${worker.name} — ${worker.profession}`,
        text: `Check out ${worker.name} on REAL JOB: ${worker.profession} with ${worker.experience} experience.`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#5B6B7F] mb-6">
            <Link to="/" className="hover:text-[#063B78]">{t("home")}</Link>
            <span>/</span>
            <Link to="/workers" className="hover:text-[#063B78]">{t("workers")}</Link>
            <span>/</span>
            <span className="text-[#10233F]">{worker.name}</span>
          </div>

          {/* Profile Card Header */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE5F0] shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-5">
                <div className="relative shrink-0">
                  <img
                    src={worker.photoUrl}
                    alt={worker.name}
                    className="size-24 rounded-2xl object-cover border-4 border-[#063B78] shadow-md"
                  />
                  {worker.verified && (
                    <BadgeCheck className="size-7 text-[#FFC400] fill-[#063B78] absolute -bottom-2 -right-2" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#10233F]">{worker.name}</h1>
                    <Badge className="bg-[#FFC400] text-[#082F63] font-black text-xs px-2.5 py-0.5">
                      ★ {n(worker.rating)} ({n(worker.reviewsCount)} Reviews)
                    </Badge>
                  </div>

                  <p className="text-base font-extrabold text-[#063B78] mt-1">{displayProfession}</p>

                  <div className="mt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#5B6B7F]">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4 text-[#125BB5]" /> {worker.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="size-4 text-[#063B78]" /> {t("ageLabel")}: {n(worker.age)} {t("yearsOld")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col gap-3 w-full sm:w-auto shrink-0">
                <Button
                  onClick={() => setShowContactModal(true)}
                  className="btn-yellow flex-1 sm:flex-none font-black text-xs px-6 py-3 h-11"
                >
                  <PhoneCall className="size-4 mr-1.5" /> {t("hireWorker")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 sm:flex-none border-[#063B78] text-[#063B78] font-bold text-xs px-4 h-11"
                >
                  <Share2 className="size-4 mr-1.5" /> Share
                </Button>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F5F8FC] p-4 rounded-xl border border-[#DCE5F0]">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#5B6B7F] block">{t("experience")}</span>
                <span className="text-sm font-black text-[#10233F]">{n(worker.experience)}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-[#5B6B7F] block">{t("expectedSalary")}</span>
                <span className="text-sm font-black text-[#063B78]">{n(worker.expectedSalary)}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-[#5B6B7F] block">{t("availabilityLabel")}</span>
                <span className="text-sm font-black text-[#125BB5]">{worker.availability}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-[#5B6B7F] block">Languages</span>
                <span className="text-xs font-bold text-[#10233F]">{worker.languages.join(", ")}</span>
              </div>
            </div>
          </div>

          {/* Details Content Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column: Bio & Experience */}
            <div className="md:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCE5F0] shadow-xs">
                <h3 className="text-lg font-black text-[#10233F] mb-3 flex items-center gap-2">
                  <User className="size-5 text-[#063B78]" /> {t("aboutAndExp")}
                </h3>
                <p className="text-sm font-semibold text-[#5B6B7F] leading-relaxed">
                  {worker.about}
                </p>

                <div className="mt-6 pt-6 border-t border-[#DCE5F0]">
                  <h4 className="text-xs font-extrabold text-[#10233F] uppercase tracking-wider mb-3">
                    {t("skillsAndExpertise")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map((skill, i) => (
                      <Badge key={i} className="bg-[#EBF1F8] text-[#063B78] font-bold text-xs px-3 py-1 border-0">
                        ✓ {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Work History / Verification Badges */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DCE5F0] shadow-xs">
                <h3 className="text-lg font-black text-[#10233F] mb-4 flex items-center gap-2">
                  <BadgeCheck className="size-5 text-[#FFC400]" /> {t("verifiedStatus")}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3.5 bg-[#F5F8FC] rounded-xl border border-[#DCE5F0]">
                    <CheckCircle2 className="size-5 text-[#063B78] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-extrabold text-[#10233F] block">{t("aadhaarVerifiedPhone")}</span>
                      <span className="text-[11px] font-semibold text-[#5B6B7F]">
                        {worker.phone.replace(/(\d{3})\d{4}(\d{2})/, "$1****$2")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-[#F5F8FC] rounded-xl border border-[#DCE5F0]">
                    <CheckCircle2 className="size-5 text-[#063B78] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-extrabold text-[#10233F] block">{t("tradeCertVerified")}</span>
                      <span className="text-[11px] font-semibold text-[#5B6B7F]">Verified by REAL JOB Field Inspection Team</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Widget */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs sticky top-24">
                <h3 className="text-base font-black text-[#10233F] mb-3">{t("directHire")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mb-4">
                  {t("directHireDesc")}
                </p>

                <Button
                  onClick={() => setShowContactModal(true)}
                  className="w-full btn-yellow font-black text-xs py-3 h-11 mb-3"
                >
                  <PhoneCall className="size-4 mr-1.5" /> {t("callWorker")}
                </Button>

                <div className="text-[11px] font-bold text-[#5B6B7F] text-center">
                  {t("freeDirectContact")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Employer Request Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-50 bg-[#082F63]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute right-4 top-4 text-[#5B6B7F] hover:text-[#10233F]"
              >
                <X className="size-5" />
              </button>

              {requestSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="size-16 text-[#063B78] mx-auto mb-3 animate-bounce" />
                  <h3 className="text-xl font-black text-[#10233F]">{t("contactSent")}</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                    {t("contactSentDesc")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleHireSubmit} className="space-y-4">
                  <h3 className="text-lg font-black text-[#10233F]">
                    {t("contactWorkerTitle")}
                  </h3>
                  <p className="text-xs font-semibold text-[#5B6B7F]">
                    {t("enterDetails")}
                  </p>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("yourName")}</label>
                    <input
                      type="text"
                      required
                      placeholder="Rajesh Patil"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("phoneNumber")}</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98220 00000"
                      value={employerPhone}
                      onChange={(e) => setEmployerPhone(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("jobDescription")}</label>
                    <textarea
                      rows={3}
                      placeholder={t("jobDetailsPlaceholder")}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] p-3 text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <Button type="submit" className="w-full btn-yellow font-black text-xs py-3 h-11">
                    {t("sendRequest")}
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
