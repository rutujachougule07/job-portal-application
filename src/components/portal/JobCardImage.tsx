import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Wallet, Users } from "lucide-react";
import { Job } from "./JobCard";
import { useI18n } from "@/lib/i18n";

export function JobCardImage({ job }: { job: Job }) {
  const { n } = useI18n();

  // Pick a random background image based on category
  const getBgImage = () => {
    const cats: Record<string, string> = {
      "Sugar Factory": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
      "Textile Factory": "https://images.unsplash.com/photo-1554900593-36cbce54497a?q=80&w=800&auto=format&fit=crop",
      "Chemical Pharma": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop",
      "Automobile Engineering": "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop",
      "Food Processing": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop",
      "Construction Workers": "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800&auto=format&fit=crop",
    };
    return cats[job.category] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop";
  };

  return (
    <Link
      to="/jobs/$jobId"
      params={{ jobId: job.id }}
      className="group relative block h-[280px] w-full overflow-hidden rounded-[24px] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Background Image */}
      <img
        src={getBgImage()}
        alt={job.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#10233F] via-[#10233F]/40 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-[#063B78]/20 mix-blend-multiply" />

      {/* Top Left Company Badge (Apna Style) */}
      <div className="absolute left-0 top-0 flex items-center gap-2 rounded-br-[24px] bg-white px-4 py-2.5 shadow-md">
        <span className="grid size-7 place-items-center rounded-full bg-[#063B78] font-display text-[10px] font-black text-white">
          {job.initials}
        </span>
        <span className="text-xs font-black text-[#10233F]">{job.company}</span>
      </div>

      {/* Featured Badge */}
      {job.featured && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#FFC400] px-2.5 py-1 text-[10px] font-black uppercase text-[#082F63] shadow-lg">
          <Sparkles className="size-3" /> Top Hiring
        </div>
      )}

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 w-full p-5 text-white">
        <h3 className="font-display text-xl font-black leading-tight group-hover:text-[#FFC400] transition-colors">
          {job.title}
        </h3>

        <div className="mt-3 flex items-center gap-4 text-xs font-bold text-white/90">
          <div className="flex items-center gap-1.5">
            <Wallet className="size-4 text-[#FFC400]" />
            <span>{n(job.salary)}</span>
          </div>
          {job.openings && (
            <div className="flex items-center gap-1.5">
              <Users className="size-4 text-[#FFC400]" />
              <span>{n(job.openings)}+ Openings</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Arrow (Bottom Right) */}
      <div className="absolute bottom-5 right-5 grid size-8 place-items-center rounded-full bg-white text-[#10233F] shadow-lg transition-transform group-hover:bg-[#FFC400] group-hover:scale-110">
        <ArrowRight className="size-4" />
      </div>
    </Link>
  );
}
