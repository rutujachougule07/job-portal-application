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
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:pt-10 sm:pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 sm:gap-10">
          
          {/* Brand & Contact Info */}
          <div className="flex flex-col items-center sm:items-start space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="REAL JOB Logo"
                className="h-16 sm:h-20 object-contain bg-white/95 p-2 rounded-xl shadow-md transition-transform group-hover:scale-105"
              />
            </Link>

            <div className="space-y-1.5 text-center sm:text-left mt-2">
              <p className="text-sm font-semibold text-slate-300 flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[#FFC400]">✉</span> rjsgroup108@gmail.com
              </p>
              <p className="text-sm font-semibold text-slate-300 flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[#FFC400]">📞</span> 8722739355
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center sm:items-end">
            <h3 className="text-sm font-black text-white tracking-wide mb-3">
              Important Links
            </h3>
            
            <ul className="space-y-3 text-sm font-semibold text-slate-300 text-center sm:text-right">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#FFC400] transition-colors duration-150"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-[#FFC400] transition-colors duration-150"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

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
