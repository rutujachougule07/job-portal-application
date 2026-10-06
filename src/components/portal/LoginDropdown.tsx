import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { UserRound, Briefcase, ShieldCheck, ChevronDown, LogIn } from "lucide-react";

export function LoginDropdown({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#063B78] hover:bg-[#082F63] text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer border border-[#125BB5]"
        aria-expanded={isOpen}
      >
        <LogIn className="size-4 text-[#FFC400]" />
        <span>Login</span>
        <ChevronDown className={`size-3.5 text-white/80 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Hover & Click Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-64 rounded-2xl bg-white border border-[#DCE5F0] p-2 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 origin-top-right"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5B6B7F]">Select Login Portal</span>
          </div>

          <div className="space-y-1">
            {/* 1. Worker / Seeker Login */}
            <Link
              to="/auth"
              search={{ mode: "login", role: "worker" }}
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#EBF1F8] transition-colors group"
            >
              <div className="p-2 rounded-lg bg-[#EBF1F8] text-[#063B78] group-hover:bg-[#063B78] group-hover:text-white transition-colors shrink-0">
                <UserRound className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#10233F] group-hover:text-[#063B78]">Seeker Login</span>
                <span className="text-[10px] font-bold text-gray-500">Find Jobs & Call Employers</span>
              </div>
            </Link>

            {/* 2. Employee Login */}
            <Link
              to="/auth"
              search={{ mode: "login", role: "employee" }}
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-emerald-50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <Briefcase className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#10233F] group-hover:text-emerald-700">Employee Login</span>
                <span className="text-[10px] font-bold text-gray-500">Attendance & Punch In / Out</span>
              </div>
            </Link>

            {/* 3. Employer / Admin Login */}
            <Link
              to="/auth"
              search={{ mode: "login", role: "admin" }}
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#063B78]/10 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-[#063B78]/10 text-[#063B78] group-hover:bg-[#063B78] group-hover:text-white transition-colors shrink-0">
                <ShieldCheck className="size-4 text-[#FFC400]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#10233F] group-hover:text-[#063B78]">Employer / Admin Login</span>
                <span className="text-[10px] font-bold text-gray-500">Post Jobs & Hire Workers</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
