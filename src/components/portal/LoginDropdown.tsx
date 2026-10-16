import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { User, Briefcase, ShieldCheck, ChevronDown } from "lucide-react";

export function LoginDropdown({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(false);

  // Close dropdown when clicking / touching outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside, { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    // If user recently touched the screen, ignore synthetic mouse events
    if (isTouchRef.current) return;
    // Only trigger hover on devices that support true hover with a fine pointer (desktop mouse)
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (isTouchRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 250);
    }
  };

  const handleTouchStart = () => {
    isTouchRef.current = true;
    setTimeout(() => {
      isTouchRef.current = false;
    }, 600);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Trigger Button: Circle Logo on mobile (< sm), Full Pill on desktop (sm+) ── */}
      <button
        type="button"
        onClick={toggleDropdown}
        onTouchStart={handleTouchStart}
        className="flex items-center gap-2 p-1.5 sm:px-4 sm:py-2 rounded-full bg-white hover:bg-slate-50 text-[#10233F] font-black text-sm border border-[#F5D8A8] shadow-[0_4px_14px_rgba(245,166,35,0.20)] hover:shadow-[0_6px_18px_rgba(245,166,35,0.30)] transition-all active:scale-95 cursor-pointer select-none ring-2 ring-amber-100/60"
        aria-expanded={isOpen}
        aria-label="Login as"
        title="Login as"
      >
        {/* Portal Emblem / Logo Icon */}
        <div className="size-7 sm:size-8 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src="/logo_icon.png"
            alt="Login"
            className="size-6 sm:size-7 object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = "none";
            }}
          />
        </div>

        {/* Text: hidden on mobile (< sm), shown on tablet & desktop (sm+) */}
        <span className="hidden sm:inline font-extrabold text-[#10233F] text-sm sm:text-[15px] whitespace-nowrap">
          Login as
        </span>

        {/* Chevron Icon: hidden on mobile (< sm), shown on tablet & desktop (sm+) */}
        <ChevronDown
          className={`hidden sm:inline size-4 text-[#10233F] stroke-[2.5] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Floating Popover Menu (Matching User Mockup Image) ── */}
      {isOpen && (
        <div
          className="absolute right-0 top-full pt-2 w-64 sm:w-72 max-w-[calc(100vw-1.5rem)] z-[9999] animate-in fade-in-50 zoom-in-95 origin-top-right"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Top Notch Pointer Arrow (aligned with button center) */}
          <div className="flex justify-end pr-3.5 sm:pr-8 -mb-2 relative z-0 pointer-events-none">
            <div className="w-3.5 h-3.5 bg-white rotate-45 border-t border-l border-slate-200 shadow-2xs"></div>
          </div>

          {/* Card Container */}
          <div className="relative z-10 rounded-3xl bg-white border border-slate-200/90 p-3 sm:p-3.5 shadow-2xl space-y-2.5">
            {/* 1. Seeker Login */}
            <Link
              to="/auth"
              search={{ mode: "login", role: "worker" }}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-[#EEF5FF] hover:bg-[#E0EEFF] active:scale-[0.98] transition-all group cursor-pointer"
            >
              <div className="size-11 rounded-full bg-[#D6E8FF] flex items-center justify-center text-[#1877F2] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <User className="size-5 stroke-[2.2]" />
              </div>
              <span className="text-sm font-black text-[#10233F] group-hover:text-[#1877F2]">
                Seeker Login
              </span>
            </Link>

            {/* 2. Job Poster Login */}
            <Link
              to="/auth"
              search={{ mode: "login", role: "admin" }}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-[#FFF6EA] hover:bg-[#FFEED8] active:scale-[0.98] transition-all group cursor-pointer"
            >
              <div className="size-11 rounded-full bg-[#FFE8CC] flex items-center justify-center text-[#D97706] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="size-5 stroke-[2.2]" />
              </div>
              <span className="text-sm font-black text-[#10233F] group-hover:text-[#D97706]">
                Job Poster Login
              </span>
            </Link>

            {/* 3. Employee Login */}
            <Link
              to="/auth"
              search={{ mode: "login", role: "employee" }}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-[#EDF9F2] hover:bg-[#DDF4E6] active:scale-[0.98] transition-all group cursor-pointer"
            >
              <div className="size-11 rounded-full bg-[#D1F3E0] flex items-center justify-center text-[#059669] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <Briefcase className="size-5 stroke-[2.2]" />
              </div>
              <span className="text-sm font-black text-[#10233F] group-hover:text-[#059669]">
                Employee Login
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
