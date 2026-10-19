import { useState } from "react";
import { Briefcase, MapPin, Bookmark, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface JobItem {
  id: string;
  company: string;
  title: string;
  location: string;
  skills: string[];
  logoType: "google" | "infosys" | "tcs" | "accenture" | "custom";
  customLogo?: string;
  saved?: boolean;
}

const DEFAULT_RECOMMENDED_JOBS: JobItem[] = [
  {
    id: "rec-1",
    company: "Google",
    title: "Frontend Developer",
    location: "Pune, Maharashtra",
    skills: ["React", "JavaScript", "HTML"],
    logoType: "google",
  },
  {
    id: "rec-2",
    company: "Infosys",
    title: "Backend Developer",
    location: "Pune, Maharashtra",
    skills: ["Java", "Spring Boot", "MySQL"],
    logoType: "infosys",
  },
  {
    id: "rec-3",
    company: "TCS",
    title: "UI/UX Designer",
    location: "Pune, Maharashtra",
    skills: ["Figma", "UI/UX", "Design"],
    logoType: "tcs",
  },
  {
    id: "rec-4",
    company: "Accenture",
    title: "Data Analyst",
    location: "Pune, Maharashtra",
    skills: ["Python", "Data Analysis", "SQL"],
    logoType: "accenture",
  },
];

function CompanyLogo({ type }: { type: string }) {
  if (type === "google") {
    return (
      <svg className="size-6" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.34 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
    );
  }

  if (type === "infosys") {
    return (
      <span className="font-extrabold text-[#007CC3] tracking-tighter text-sm italic">
        Infosys
      </span>
    );
  }

  if (type === "tcs") {
    return (
      <div className="flex items-center">
        <span className="font-black text-[#E81D26] tracking-tighter text-base">t</span>
        <span className="font-black text-[#006699] tracking-tighter text-base">c</span>
        <span className="font-black text-[#F58220] tracking-tighter text-base">s</span>
      </div>
    );
  }

  if (type === "accenture") {
    return (
      <div className="flex items-center gap-0.5">
        <span className="font-black text-[#A100FF] text-base leading-none">&gt;</span>
        <span className="font-black text-[#10233F] text-xs lowercase tracking-tight">accenture</span>
      </div>
    );
  }

  return <Briefcase className="size-5 text-[#125BB5]" />;
}

export function DashboardRecommendedJobs({
  title = "Recommended Jobs for You",
  viewAllUrl = "/jobs",
  role = "seeker",
}: {
  title?: string;
  viewAllUrl?: string;
  role?: "seeker" | "employer";
}) {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedJobs((prev) => {
      const next = !prev[id];
      if (next) {
        toast.success("Job bookmarked successfully");
      } else {
        toast.info("Job removed from saved");
      }
      return { ...prev, [id]: next };
    });
  };

  const handleJobClick = (job: JobItem) => {
    navigate({
      to: "/jobs",
      search: { q: job.title } as any,
    });
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-[#051B38] text-white flex items-center justify-center">
            <Briefcase className="size-4" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#10233F] tracking-tight">
            {title}
          </h2>
        </div>

        <Link
          to={viewAllUrl as any}
          className="text-xs sm:text-sm font-bold text-[#125BB5] hover:text-[#092B57] flex items-center gap-1 group transition-colors"
        >
          <span>{role === "employer" ? "Manage All Jobs" : "View All Jobs"}</span>
          <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEFAULT_RECOMMENDED_JOBS.map((job) => {
          const isSaved = !!savedJobs[job.id];
          return (
            <div
              key={job.id}
              onClick={() => handleJobClick(job)}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer hover:border-blue-200"
            >
              {/* Top row: Company Logo & Bookmark */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shadow-2xs">
                    <CompanyLogo type={job.logoType} />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleSave(job.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#125BB5] hover:bg-slate-50 transition-colors cursor-pointer"
                    aria-label="Bookmark Job"
                  >
                    <Bookmark
                      className={`size-4.5 ${
                        isSaved ? "fill-[#125BB5] text-[#125BB5]" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Job Title & Company */}
                <h3 className="font-black text-sm sm:text-base text-[#10233F] group-hover:text-[#125BB5] transition-colors leading-snug">
                  {job.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {job.company}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-2.5">
                  <MapPin className="size-3 text-slate-400" />
                  <span>{job.location}</span>
                </div>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-[#EFF6FF] text-[#125BB5] text-[10px] font-bold px-2 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
