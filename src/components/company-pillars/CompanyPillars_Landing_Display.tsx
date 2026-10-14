import React from "react";
import { Target } from "lucide-react";
import { CompanyPillar, PILLAR_ICONS } from "./types";

interface CompanyPillarsLandingDisplayProps {
  pillars: CompanyPillar[];
}

/**
 * Company Pillars Display Component for Public Landing Page
 * Dynamically displays the pillar cards in a responsive grid.
 */
export const CompanyPillarsLandingDisplay: React.FC<CompanyPillarsLandingDisplayProps> = ({
  pillars,
}) => {
  if (!pillars || pillars.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {pillars.map((pillar) => {
        const IconComponent = PILLAR_ICONS[pillar.iconName] || Target;

        return (
          <div
            key={pillar.id || pillar.title}
            className="group bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/40 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="size-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#D4AF37] z-10">
              <IconComponent className="size-6 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
            </div>
            <h4 className="text-[14px] font-black text-[#082F63] mb-2 z-10 relative">
              {pillar.title}
            </h4>
            <p className="text-[11px] font-semibold text-gray-500 leading-snug z-10 relative whitespace-pre-line">
              {pillar.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
