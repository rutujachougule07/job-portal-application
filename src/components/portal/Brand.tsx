import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function LogoIcon({ className = "h-14" }: { className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`${className} aspect-square rounded-xl bg-gradient-to-br from-[#063B78] to-[#0A4F9E] flex items-center justify-center text-white font-black text-xs shadow-md border border-white/20 shrink-0 select-none`}>
        <span className="text-[#FFC400]">R</span>J
      </div>
    );
  }

  return (
    <img
      src="/logo_icon.png"
      alt="REAL JOB Emblem"
      className={`${className} object-contain shrink-0`}
      onError={() => setHasError(true)}
    />
  );
}

export function Brand({
  className = "h-7.5 xs:h-8.5 sm:h-11 md:h-13",
  to = "/",
}: {
  className?: string;
  compact?: boolean;
  showTagline?: boolean;
  titleText?: string;
  to?: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <Link
      to={(to || "/") as any}
      className="inline-flex items-center gap-2 group select-none shrink min-w-0 cursor-pointer"
      aria-label="REAL JOB Logo"
      title="REAL JOB"
    >
      {hasError ? (
        <div className="flex items-center gap-2">
          <div className="size-8 sm:size-10 rounded-xl bg-gradient-to-br from-[#063B78] to-[#0A4F9E] flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md border border-white/20 shrink-0">
            <span className="text-[#FFC400]">R</span>J
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-black text-base sm:text-xl tracking-tight text-[#063B78]">
              REAL <span className="text-[#FFC400]">JOB</span>
            </span>
            <span className="text-[9px] font-bold text-[#5B6B7F] tracking-widest uppercase">
              Find Work • Find Workers
            </span>
          </div>
        </div>
      ) : (
        <img
          src="/logo.png"
          alt="REAL JOB Logo"
          className={`${className} max-w-full w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
          onError={() => setHasError(true)}
        />
      )}
    </Link>
  );
}

