import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  Send,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

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
};

export const jobs: Job[] = [
  {
    id: "senior-product-designer",
    title: "Senior Product Designer",
    company: "Aurora Fintech",
    location: "Mumbai, Maharashtra",
    salary: "₹18–24 LPA",
    experience: "4–6 years",
    type: "Full-time",
    workMode: "Hybrid",
    posted: "2h ago",
    initials: "AF",
    category: "Technology & IT",
    featured: true,
  },
  {
    id: "software-engineer",
    title: "Software Engineer II",
    company: "Nexa Systems",
    location: "Pune, Maharashtra",
    salary: "₹14–20 LPA",
    experience: "3–5 years",
    type: "Full-time",
    workMode: "Remote",
    posted: "5h ago",
    initials: "NS",
    category: "Technology & IT",
    featured: true,
  },
  {
    id: "healthcare-manager",
    title: "Healthcare Operations Manager",
    company: "Aarogya Care",
    location: "Bengaluru, Karnataka",
    salary: "₹10–14 LPA",
    experience: "5+ years",
    type: "Full-time",
    workMode: "On-site",
    posted: "1d ago",
    initials: "AC",
    category: "Healthcare & Pharma",
  },
  {
    id: "relationship-manager",
    title: "Relationship Manager",
    company: "Sampada Bank",
    location: "Ahmedabad, Gujarat",
    salary: "₹7–10 LPA",
    experience: "2–4 years",
    type: "Full-time",
    workMode: "On-site",
    posted: "1d ago",
    initials: "SB",
    category: "Banking & Finance",
  },
  {
    id: "digital-marketing-lead",
    title: "Digital Marketing Lead",
    company: "Zenith Media",
    location: "Delhi NCR",
    salary: "₹12–16 LPA",
    experience: "3–6 years",
    type: "Full-time",
    workMode: "Hybrid",
    posted: "2d ago",
    initials: "ZM",
    category: "Marketing & Media",
  },
  {
    id: "b2b-sales-manager",
    title: "B2B Enterprise Sales Manager",
    company: "Karyam Corp",
    location: "Mumbai, Maharashtra",
    salary: "₹15–22 LPA",
    experience: "4–7 years",
    type: "Full-time",
    workMode: "Hybrid",
    posted: "3d ago",
    initials: "KC",
    category: "Sales & Business Dev",
    featured: true,
  },
  {
    id: "senior-data-analyst",
    title: "Senior Data Analyst",
    company: "Quant Insights",
    location: "Bengaluru, Karnataka",
    salary: "₹16–22 LPA",
    experience: "3–5 years",
    type: "Full-time",
    workMode: "Remote",
    posted: "3d ago",
    initials: "QI",
    category: "Technology & IT",
  },
  {
    id: "talent-acquisition-specialist",
    title: "Talent Acquisition Specialist",
    company: "People First HR",
    location: "Hyderabad, Telangana",
    salary: "₹8–12 LPA",
    experience: "2–4 years",
    type: "Full-time",
    workMode: "Hybrid",
    posted: "4d ago",
    initials: "PF",
    category: "Management & HR",
  },
  {
    id: "academic-lecturer",
    title: "Senior Academic Lecturer",
    company: "EduVantage Academy",
    location: "Pune, Maharashtra",
    salary: "₹8–11 LPA",
    experience: "3–6 years",
    type: "Full-time",
    workMode: "On-site",
    posted: "4d ago",
    initials: "EA",
    category: "Education & Teaching",
  },
  {
    id: "mechanical-engineer",
    title: "Mechanical Design Engineer",
    company: "Apex Dynamics",
    location: "Mumbai, Maharashtra",
    salary: "₹10–15 LPA",
    experience: "3–5 years",
    type: "Full-time",
    workMode: "On-site",
    posted: "5d ago",
    initials: "AD",
    category: "Engineering & Mfg",
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Creative Designer",
    company: "Canvas Labs",
    location: "Bengaluru, Karnataka",
    salary: "₹12–18 LPA",
    experience: "2–5 years",
    type: "Full-time",
    workMode: "Remote",
    posted: "5d ago",
    initials: "CL",
    category: "Design & Creative",
  },
  {
    id: "bpo-support-lead",
    title: "Customer Support Manager",
    company: "Global Voice BPO",
    location: "Delhi NCR",
    salary: "₹6–9 LPA",
    experience: "2–4 years",
    type: "Full-time",
    workMode: "On-site",
    posted: "6d ago",
    initials: "GV",
    category: "Customer Support",
  },
  {
    id: "supply-chain-manager",
    title: "Fleet Logistics & Supply Lead",
    company: "SwiftExpress Logistics",
    location: "Mumbai, Maharashtra",
    salary: "₹9–14 LPA",
    experience: "3–6 years",
    type: "Full-time",
    workMode: "On-site",
    posted: "6d ago",
    initials: "SL",
    category: "Logistics & Supply",
  },
  {
    id: "civil-site-engineer",
    title: "Senior Civil Construction Engineer",
    company: "BuildTech Infra",
    location: "Pune, Maharashtra",
    salary: "₹11–16 LPA",
    experience: "4–8 years",
    type: "Full-time",
    workMode: "On-site",
    posted: "1w ago",
    initials: "BI",
    category: "Construction & Realty",
  },
];

export function JobCard({
  job,
  onApply,
}: {
  job: Job;
  onApply?: (job: Job) => void;
}) {
  const { t } = useI18n();
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);

  const toggleSave = () => {
    setSaved(!saved);
  };

  const handleApplyClick = () => {
    if (onApply) {
      onApply(job);
    } else {
      setShowApplyModal(true);
    }
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setShowApplyModal(false);
      setApplied(false);
    }, 2000);
  };

  return (
    <>
      <article className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-md">
        {job.featured && (
          <div className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#D4AF37]">
            <Sparkles className="size-3" /> Featured
          </div>
        )}

        <div className="flex items-start gap-4">
          {/* Company Avatar */}
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#1F2937] font-display text-lg font-bold text-white shadow-sm group-hover:bg-[#D4AF37] group-hover:text-[#1F2937] transition-colors">
            {job.initials}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2 pr-16">
              <div>
                <Link
                  to="/jobs/$jobId"
                  params={{ jobId: job.id }}
                  className="font-display text-xl font-bold text-foreground transition-colors hover:text-[#D4AF37]"
                >
                  {job.title}
                </Link>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Building2 className="size-3.5 text-primary" />
                  {job.company}
                </p>
              </div>

              {/* Bookmark Save Button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleSave}
                aria-label={saved ? "Remove Bookmark" : "Save Job"}
                className={`size-9 rounded-full transition-colors ${
                  saved
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37]/25"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {saved ? <BookmarkCheck className="size-4 fill-current" /> : <Bookmark className="size-4" />}
              </Button>
            </div>

            {/* Badges / Specs Row */}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-medium">
                <MapPin className="size-3.5 text-[#D4AF37]" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-foreground">
                <Wallet className="size-3.5 text-[#D4AF37]" />
                {job.salary}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3.5 text-muted-foreground" />
                {job.posted}
              </span>
            </div>

            {/* Tags & Active Apply Action */}
            <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-[11px] font-semibold">
                  {job.type}
                </Badge>
                <Badge variant="outline" className="text-[11px]">
                  {job.workMode}
                </Badge>
                <Badge variant="outline" className="text-[11px]">
                  {job.experience}
                </Badge>
                {job.category && (
                  <Badge variant="outline" className="bg-[#D4AF37]/10 text-[#1F2937] border-[#D4AF37]/30 text-[11px]">
                    {job.category}
                  </Badge>
                )}
              </div>

              <Button
                size="sm"
                onClick={handleApplyClick}
                className="bg-[#1F2937] hover:bg-[#D4AF37] hover:text-[#1F2937] font-semibold text-xs transition-colors px-4 h-9"
              >
                {t("apply")}
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Interactive Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>

            {applied ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="mx-auto size-14 text-emerald-600 animate-bounce" />
                <h3 className="font-display text-2xl font-bold text-primary">Application Submitted!</h3>
                <p className="text-xs text-muted-foreground">
                  Your profile and resume have been sent to <strong>{job.company}</strong> for the <strong>{job.title}</strong> role.
                </p>
              </div>
            ) : (
              <form onSubmit={submitApplication} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-[#1F2937] font-bold text-white">
                    {job.initials}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-primary">{job.title}</h3>
                    <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/80 p-3 text-xs space-y-1">
                  <span className="font-semibold text-foreground">Verified Direct Employer</span>
                  <p className="text-muted-foreground">Salary Band: {job.salary} | Mode: {job.workMode}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Upload / Select Resume</label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs shadow-sm">
                    <option>Payal_Wankar_Resume_2026.pdf (Verified)</option>
                    <option>Upload New Resume...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Short Cover Note (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly share why you are a great fit for this role..."
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <Button type="submit" className="w-full h-11 bg-[#1F2937] hover:bg-[#D4AF37] hover:text-[#1F2937] font-semibold text-xs">
                  Submit Application <Send className="ml-2 size-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
