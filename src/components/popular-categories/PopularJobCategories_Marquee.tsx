import React from "react";
import { Briefcase } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { JobCategory, CATEGORY_ICONS, CATEGORY_PALETTES } from "./types";

interface PopularJobCategoriesMarqueeProps {
  categories: JobCategory[];
  /** Custom navigation handler if not using TanStack router */
  onCategoryClick?: (category: JobCategory) => void;
}

/**
 * Popular Job Categories Infinite Auto-Scroller Component
 * 
 * Features:
 * 1. Infinite horizontal marquee smooth scrolling
 * 2. Left & right edge gradient blending masks
 * 3. Glassmorphic frosted cards with gold border glow on hover
 * 4. Clicking any category directly redirects to Seeker Login (/auth?mode=login&role=worker)
 */
export const PopularJobCategoriesMarquee: React.FC<PopularJobCategoriesMarqueeProps> = ({
  categories,
  onCategoryClick,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (catData: JobCategory) => {
    if (onCategoryClick) {
      onCategoryClick(catData);
      return;
    }
    // Default: Redirect to Job Seeker Login page
    navigate({ to: "/auth", search: { mode: "login", role: "worker" } });
  };

  if (!categories || categories.length === 0) return null;

  // Duplicate the array 4 times for seamless infinite loop
  const displayItems = [...categories, ...categories, ...categories, ...categories];

  return (
    <section className="relative pt-6 pb-14 bg-gradient-to-b from-[#F5F8FC] via-white to-[#F5F8FC] overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF9E7] border border-[#FDE68A] text-[#B45309] font-black text-xs uppercase tracking-wider mb-3 shadow-sm hover:scale-105 transition-transform duration-300">
          <Briefcase className="size-4 text-[#D97706] animate-bounce" />
          EXPLORE BY CATEGORY
        </div>

        {/* Main Section Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#082F63] mb-2 tracking-tight">
          Popular Job{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FDE047] animate-pulse">
            Categories
          </span>
        </h2>

        {/* Subtitle with accent lines */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-[1.5px] w-12 md:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
          <p className="text-xs md:text-sm font-extrabold text-[#5B6B7F]">
            Right opportunity for you — in your field!
          </p>
          <div className="h-[1.5px] w-12 md:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
        </div>

        {/* INFINITE AUTO-SCROLLER CONTAINER */}
        <div className="relative w-full overflow-hidden py-6">
          {/* Fade masks for elegant left & right edge blending */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#F5F8FC] via-[#F5F8FC]/80 to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#F5F8FC] via-[#F5F8FC]/80 to-transparent z-20" />

          {/* Marquee Row */}
          <div className="animate-marquee-slow flex items-center gap-6 sm:gap-8 px-4">
            {displayItems.map((catData, i) => {
              const IconComponent = CATEGORY_ICONS[catData.iconName] || Briefcase;
              const palette = CATEGORY_PALETTES[i % CATEGORY_PALETTES.length] ?? { gradient: "from-blue-600 to-indigo-600", iconBg: "bg-blue-50 text-blue-600" };
              const gradient = catData.gradient || palette.gradient;
              const iconBg = catData.iconBg || palette.iconBg;

              return (
                <div
                  key={`${catData.id || i}-${i}`}
                  onClick={() => handleCardClick(catData)}
                  className="group relative shrink-0 w-[220px] sm:w-[250px] h-[100px] sm:h-[110px] rounded-[1.5rem] border border-white/60 bg-white/40 backdrop-blur-md p-4 flex items-center justify-center gap-4 cursor-pointer transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] hover:-translate-y-2 hover:scale-[1.03] overflow-hidden"
                  title="Click to view jobs & login as candidate"
                >
                  {/* Animated Border Gradient on Hover */}
                  <div className="absolute inset-0 rounded-[1.5rem] border-2 border-transparent bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                  {/* Radial Ambient Glow */}
                  <div
                    className={`absolute -top-12 -left-12 size-36 rounded-full bg-gradient-to-br ${gradient} blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none group-hover:animate-pulse`}
                  />

                  {/* Icon Box */}
                  <div
                    className={`relative size-12 sm:size-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-sm group-hover:shadow-lg ${iconBg}`}
                  >
                    <IconComponent className="size-6 sm:size-7 stroke-[2.5]" />
                  </div>

                  {/* Category Title */}
                  <div className="flex-1 text-left flex flex-col justify-center overflow-hidden z-10">
                    <h3 className="font-black text-sm sm:text-base text-[#082F63] group-hover:text-[#125BB5] transition-colors truncate leading-tight">
                      {catData.label}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
