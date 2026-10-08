import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ChevronUp,
  Instagram,
  Linkedin,
  Mail,
  QrCode,
  Twitter,
  Youtube,
} from "lucide-react";
import { useI18n, getCategoryTitle } from "@/lib/i18n";

export function PublicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#082F63] text-slate-200 overflow-hidden font-sans border-t border-[#125BB5]/40">
      {/* Top Yellow Gradient Glow */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#FFC400] to-transparent" />

      {/* Main Footer Content */}
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:pt-16 sm:pb-12 text-center">
        
        {/* Brand */}
        <Link to="/" className="inline-block group mb-6">
          <div className="bg-white/95 p-3 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 inline-flex items-center justify-center">
            <img
              src="/logo.png"
              alt="REAL JOB Logo"
              className="h-16 sm:h-20 object-contain"
            />
          </div>
        </Link>
        
        <p className="text-sm font-medium text-slate-300 max-w-md mx-auto mb-8">
          Right Person • Right Job • Right Opportunity<br />
          Connecting Workers and Employers across India
        </p>

        {/* Contact Info & Links Grid */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 pt-6 border-t border-white/10">
          
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-[#FFC400] transition-colors">
            <span className="flex items-center justify-center size-8 rounded-full bg-white/10 text-[#FFC400]">✉</span>
            rjsgroup108@gmail.com
          </div>
          
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-[#FFC400] transition-colors">
            <span className="flex items-center justify-center size-8 rounded-full bg-white/10 text-[#FFC400]">📞</span>
            8722739355
          </div>
          
          <div className="w-1 h-1 rounded-full bg-slate-500 hidden sm:block"></div>

          <Link to="/" className="text-sm font-semibold text-slate-200 hover:text-[#FFC400] transition-colors">
            Terms & Conditions
          </Link>
          
          <Link to="/" className="text-sm font-semibold text-slate-200 hover:text-[#FFC400] transition-colors">
            Privacy Policy
          </Link>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#063B78] py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs font-bold text-slate-300 sm:flex-row sm:px-6 lg:px-8">
          
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center sm:text-left">
            <span>© 2026 REAL JOB. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              Made with <span className="text-[#FFC400]">💛</span> in India.
            </span>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="grid size-8 place-items-center rounded-full bg-[#FFC400] text-[#082F63] transition-all shadow-md hover:scale-105 font-black"
            >
              <ChevronUp className="size-4 stroke-[3]" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
