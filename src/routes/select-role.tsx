import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useI18n } from "@/lib/i18n";
import { LogoIcon } from "@/components/portal/Brand";
import { UserRound, Building2, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/select-role")({
  validateSearch: z.object({
    redirectTo: z.string().optional().catch("/"),
  }),
  component: SelectRolePage,
});

function SelectRolePage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { redirectTo } = Route.useSearch();

  const handleBackToLanguage = () => {
    navigate({ to: "/select-language", search: { redirectTo } });
  };

  const handleSelectRole = (role: "user" | "admin") => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("karyam-gate-dismissed", "true");
      window.localStorage.setItem("realjob-role", role === "admin" ? "employer" : "worker");
      window.localStorage.setItem("realjob-gate-done", "true");
      window.localStorage.setItem("karyam-onboarding-done", "true");
      window.dispatchEvent(new Event("realjob-auth-change"));
    }

    if (role === "admin") {
      // Direct navigation to Job Poster Login page
      navigate({ to: "/auth", search: { mode: "login", role: "admin" } });
    } else {
      // Direct navigation to Worker / Job Seeker Login page
      navigate({ to: "/auth", search: { mode: "login", role: "worker" } });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/portal-bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border border-white/60 shadow-2xl p-6 sm:p-8 transition-all duration-300">
        {/* Back Button (Top Left) */}
        <button
          type="button"
          onClick={handleBackToLanguage}
          className="absolute top-4 sm:top-6 left-4 sm:left-6 text-gray-500 hover:text-[#0A3B7B] hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center transition-colors border border-gray-200 shadow-2xs cursor-pointer"
          title={t("backToLanguage")}
        >
          <ArrowLeft className="size-5" />
        </button>

        {/* Center Logo */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <LogoIcon className="h-14 sm:h-16 object-contain" />
        </div>

        {/* Headings */}
        <div className="text-center space-y-1 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A3B7B] tracking-tight">
            {t("selectRole")}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500">
            {t("roleSubtitle")}
          </p>
        </div>

        {/* 2 Profile Option Cards matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1: Worker (Job Seeker) */}
          <div
            onClick={() => handleSelectRole("user")}
            className="group relative cursor-pointer rounded-2xl border-2 border-slate-200/90 bg-white p-6 transition-all duration-300 hover:border-[#0A3B7B] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="size-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-[#0A3B7B] group-hover:text-white transition-colors">
                  <UserRound className="size-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200/70 text-[10px] font-black uppercase tracking-wider">
                  WORKER / JOB SEEKER
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0A3B7B] transition-colors mb-2">
                {t("jobSeeker")}
              </h3>

              <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-6">
                {t("jobSeekerDesc")}
              </p>
            </div>

            <div className="flex items-center font-bold text-xs text-[#0A3B7B] group-hover:underline gap-1.5 pt-3.5 border-t border-slate-100">
              <span>Enter Portal as Job Seeker</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Employer (Hirer) */}
          <div
            onClick={() => handleSelectRole("admin")}
            className="group relative cursor-pointer rounded-2xl border-2 border-slate-200/90 bg-white p-6 transition-all duration-300 hover:border-[#0A3B7B] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-[#0A3B7B] group-hover:text-white transition-colors">
                  <Building2 className="size-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 text-[10px] font-black uppercase tracking-wider">
                  JOB POSTER
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0A3B7B] transition-colors mb-2">
                {lang === "en" ? "Job Poster" : (t("jobProvider") || "Job Poster")}
              </h3>

              <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-6">
                {t("jobProviderDesc")}
              </p>
            </div>

            <div className="flex items-center font-bold text-xs text-[#0A3B7B] group-hover:underline gap-1.5 pt-3.5 border-t border-slate-100">
              <span>Enter Portal as Job Poster</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
