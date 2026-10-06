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
  const { t, n, lang } = useI18n();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#082F63] text-slate-200 overflow-hidden font-sans border-t border-[#125BB5]/40">
      {/* Top Yellow Gradient Glow */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#FFC400] to-transparent" />

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.8fr_1.5fr] items-start">
          
          {/* Col 1: REAL JOB Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="REAL JOB Logo"
                className="h-20 object-contain bg-white/95 p-2 rounded-xl shadow-md transition-transform group-hover:scale-105"
              />
            </Link>

            <p className="text-xs leading-relaxed text-slate-300 pr-2">
              Right Person • Right Job • Right Opportunity — Connecting Workers and Employers
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Youtube, label: "YouTube", href: "#" },
                { icon: Twitter, label: "X (Twitter)", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:border-[#FFC400] hover:bg-[#FFC400] hover:text-[#082F63] transition-all duration-200"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: For Candidates */}
          <div>
            <h3 className="text-sm font-black text-white tracking-wide">
              For Candidates
            </h3>
            <div className="mt-1.5 h-[2px] w-8 bg-[#FFC400] rounded-full mb-4" />

            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              {[
                { label: "Find Jobs" },
                { label: "Login / Register" },
              ].map(({ label }) => (
                <li key={label}>
                  <Link
                    to="/auth"
                    search={{ mode: "login", role: "worker" }}
                    className="inline-flex items-center gap-1 hover:text-[#FFC400] hover:translate-x-1 transition-all duration-150"
                  >
                    <ChevronRight className="size-3 text-[#FFC400] shrink-0" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: For Employers */}
          <div>
            <h3 className="text-sm font-black text-white tracking-wide">
              For Employers
            </h3>
            <div className="mt-1.5 h-[2px] w-8 bg-[#FFC400] rounded-full mb-4" />

            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              {[
                { label: "Search Workers" },
                { label: "Employer Login" },
              ].map(({ label }) => (
                <li key={label}>
                  <Link
                    to="/auth"
                    search={{ mode: "login", role: "employer" }}
                    className="inline-flex items-center gap-1 hover:text-[#FFC400] hover:translate-x-1 transition-all duration-150"
                  >
                    <ChevronRight className="size-3 text-[#FFC400] shrink-0" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div>
            <h3 className="text-sm font-black text-white tracking-wide">
              Categories
            </h3>
            <div className="mt-1.5 h-[2px] w-8 bg-[#FFC400] rounded-full mb-4" />

            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              {[
                { id: "factory-workers" },
                { id: "construction-workers" },
                { id: "technical-staff" },
                { id: "logistics-drivers" },
                { id: "electricians" },
                { id: "security" },
              ].map(({ id }) => {
                const label = getCategoryTitle(id, "en");
                return (
                  <li key={id}>
                    <Link
                      to="/auth"
                      search={{ mode: "login", role: "worker" }}
                      className="inline-flex items-center gap-1 hover:text-[#FFC400] hover:translate-x-1 transition-all duration-150"
                    >
                      <ChevronRight className="size-3 text-[#FFC400] shrink-0" />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 5: Company */}
          <div>
            <h3 className="text-sm font-black text-white tracking-wide">
              REAL JOB
            </h3>
            <div className="mt-1.5 h-[2px] w-8 bg-[#FFC400] rounded-full mb-4" />

            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              {[
                { label: "About Us" },
                { label: "Contact Us" },
                { label: "FAQ" },
              ].map(({ label }) => (
                <li key={label}>
                  <Link
                    to="/auth"
                    search={{ mode: "login", role: "worker" }}
                    className="inline-flex items-center gap-1 hover:text-[#FFC400] hover:translate-x-1 transition-all duration-150"
                  >
                    <ChevronRight className="size-3 text-[#FFC400] shrink-0" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 6: Stay Updated & Download */}
          <div className="lg:border-l lg:border-white/10 lg:pl-6 space-y-5">
            <div>
              <h3 className="text-lg font-black text-white tracking-wide">
                Download the REAL JOB App
              </h3>
              <p className="mt-1.5 text-xs font-medium text-slate-300">
                Find jobs from your mobile and talk directly to employers.
              </p>

              <form onSubmit={handleSubscribe} className="mt-3.5 flex items-center rounded-xl border border-white/20 bg-white/10 p-1 focus-within:border-[#FFC400] transition-all">
                <div className="relative flex-1 flex items-center">
                  <Mail className="ml-3 size-4 text-slate-300 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="Email or Mobile No."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 bg-transparent px-3 text-xs text-white placeholder-slate-300 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[#FFC400] text-[#082F63] font-black text-xs transition-colors shrink-0 shadow-sm hover:bg-[#FFD21F]"
                >
                  {subscribed ? "..." : "Continue"}
                </button>
              </form>
            </div>

            {/* App Promotion Widget */}
            <div className="p-3 rounded-xl border border-white/15 bg-white/5 flex items-center gap-3">
              <QrCode className="size-10 text-[#FFC400] shrink-0" />
              <div>
                <span className="text-xs font-black text-white block">REAL JOB Mobile App</span>
                <span className="text-[10px] font-bold text-slate-300">Google Play & App Store</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#063B78] py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs font-bold text-slate-300 sm:flex-row sm:px-6 lg:px-8">
          
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center sm:text-left">
            <span>© 2026 REAL JOB. All rights reserved.</span>
            <span className="hidden text-slate-400 sm:inline">|</span>
            <span>Find Workers | Get Jobs</span>
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
