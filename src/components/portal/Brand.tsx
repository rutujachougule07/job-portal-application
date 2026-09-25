import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function LogoIcon({ className = "size-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-md shrink-0`}
    >
      <defs>
        {/* Navy Gradient Background */}
        <linearGradient id="realjobNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#082F63" />
          <stop offset="50%" stopColor="#063B78" />
          <stop offset="100%" stopColor="#125BB5" />
        </linearGradient>

        {/* Yellow Accent Gradient */}
        <linearGradient id="realjobYellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD21F" />
          <stop offset="100%" stopColor="#FFC400" />
        </linearGradient>

        <filter id="realjobShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Rounded Navy Container */}
      <rect width="100" height="100" rx="22" fill="url(#realjobNavyGrad)" />

      {/* Hardhat / Work Helmet + Briefcase Icon */}
      <g transform="translate(18, 16)">
        {/* Hard Hat Top Arc */}
        <path d="M 10 32 C 10 12, 54 12, 54 32 Z" fill="url(#realjobYellowGrad)" />
        {/* Helmet Brim */}
        <rect x="4" y="31" width="56" height="7" rx="3.5" fill="#FFFFFF" />
        {/* Badge Shield */}
        <path d="M 22 41 L 42 41 L 42 58 L 32 64 L 22 58 Z" fill="url(#realjobYellowGrad)" />
        {/* Checkmark in shield */}
        <path d="M 27 52 L 31 56 L 38 47" stroke="#082F63" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function Brand({
  compact = false,
  showTagline = true,
  titleText = "REAL JOB",
}: {
  compact?: boolean;
  showTagline?: boolean;
  titleText?: string;
}) {
  const { t } = useI18n();

  return (
    <Link to="/" className="inline-flex items-center gap-3 group select-none" aria-label="REAL JOB Logo">
      <LogoIcon className="size-11 transition-transform duration-200 group-hover:scale-105" />

      {!compact && (
        <div className="flex flex-col justify-center">
          <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none flex items-center gap-1.5">
            <span className="text-[#063B78]">REAL</span>
            <span className="bg-[#FFC400] text-[#082F63] px-2 py-0.5 rounded-md font-extrabold shadow-sm">
              JOB
            </span>
          </div>

          {showTagline && (
            <div className="mt-1 flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#125BB5] leading-tight">
                {t("tagline")}
              </span>
              <span className="text-[9.5px] font-bold text-[#5B6B7F] tracking-tight">
                {t("marathiTagline")}
              </span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
}

