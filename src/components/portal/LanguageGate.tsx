import { useEffect, useState } from "react";
import { useNavigate, useLocation, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Building2, Check, UserRound, Loader2 } from "lucide-react";
import { languages, useI18n, type LanguageCode } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/portal/Brand";
import { toast } from "sonner";

export function LanguageGate() {
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();

  // Always open on initial load so user can choose language & profile
  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#main") return false;
      return true;
    }
    return true;
  });

  const [step, setStep] = useState<"language" | "role">(() => {
    if (typeof window !== "undefined" && window.location.hash === "#role") {
      return "role";
    }
    return "language";
  });

  const [selectedLang, setSelectedLang] = useState<LanguageCode>(lang || "mr");
  const [navigatingRole, setNavigatingRole] = useState<"user" | "admin" | null>(null);

  // Preload auth route and code bundles immediately for zero-lag instant transition
  useEffect(() => {
    try {
      import("@/routes/auth");
      if (router && typeof router.preloadRoute === 'function') {
        router.preloadRoute({ to: "/auth", search: { mode: "login", role: "worker" } });
        router.preloadRoute({ to: "/auth", search: { mode: "login", role: "admin" } });
      }
    } catch {}
  }, [router]);

  useEffect(() => {
    if (lang) {
      setSelectedLang(lang);
    }
  }, [lang]);

  useEffect(() => {
    if (location.pathname === "/") {
      const hash = location.hash;
      if (hash === "role") {
        setOpen(true);
        setStep("role");
      } else if (hash === "language") {
        setOpen(true);
        setStep("language");
      } else if (hash === "main") {
        setOpen(false);
      }
    }
  }, [location.hash, location.pathname]);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ step?: "language" | "role" }>;
      const targetStep = customEvent?.detail?.step || "language";
      setStep(targetStep);
      setOpen(true);
    };

    window.addEventListener("karyam-open-gate", handleOpen as EventListener);
    return () => {
      window.removeEventListener("karyam-open-gate", handleOpen as EventListener);
    };
  }, []);

  if (!open) return null;

  const handleLanguageSelect = (code: LanguageCode) => {
    setSelectedLang(code);
    setLang(code);
  };

  const proceedToRole = () => {
    setLang(selectedLang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("realjob-language", selectedLang);
      window.dispatchEvent(new Event("realjob-auth-change"));
    }
    // Smoothly transition inside the same modal to Step 2: Select Your Profile
    setStep("role");
  };

  const handleSelectRole = (role: "user" | "admin") => {
    // Show spinner on the clicked card immediately
    setNavigatingRole(role);

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("karyam-gate-dismissed", "true");
      window.localStorage.setItem("realjob-role", role === "admin" ? "employer" : "worker");
      window.localStorage.setItem("realjob-gate-done", "true");
      window.localStorage.setItem("karyam-onboarding-done", "true");
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // CRITICAL: Do NOT call setOpen(false)!
    // Keeping open = true ensures the modal remains completely on top of the landing page
    // until TanStack Router switches the route to /auth.
    // This permanently prevents the landing page from flashing/blinking for 2 seconds!
    const targetRole = role === "admin" ? "admin" : "worker";
    navigate({
      to: "/auth",
      search: { mode: "login", role: targetRole },
      replace: true,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto animate-fade-in">
      {/* Blurred Office / City Background */}
      <div
        className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{ backgroundImage: "url('/portal-bg.png')" }}
      />
      {/* Color Overlay for Readability */}
      <div className="fixed inset-0 z-[-1] bg-black/40 backdrop-blur-xs" />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-white/60 overflow-hidden p-6 sm:p-10 transition-all duration-300">

          {/* STEP 1: LANGUAGE SELECTION */}
          {step === "language" ? (
            <div className="space-y-6">
              {/* Header Branding */}
              <div className="flex flex-col items-center text-center mb-2">
                <LogoIcon className="h-14 sm:h-16 object-contain" />
              </div>

              <div className="text-center space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A3B7B] tracking-tight">
                  {t("chooseLanguage")}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-gray-500">
                  {t("languageSubtitle")}
                </p>
              </div>

              {/* Language Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 notranslate">
                {languages.map((item) => {
                  const active = selectedLang === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleLanguageSelect(item.code)}
                      className={`relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 text-center cursor-pointer ${
                        active
                          ? "border-[#0A3B7B] bg-[#EBF1F8] shadow-md scale-[1.02] ring-2 ring-[#0A3B7B]/20"
                          : "border-gray-200 bg-gray-50/70 hover:bg-white hover:border-[#0A3B7B]/40 hover:shadow-xs"
                      }`}
                    >
                      {active && (
                        <div className="absolute top-2.5 right-2.5 size-5 rounded-full bg-[#0A3B7B] text-white flex items-center justify-center">
                          <Check className="size-3 stroke-[3]" />
                        </div>
                      )}
                      <span className={`text-lg sm:text-xl font-black ${active ? "text-[#0A3B7B]" : "text-gray-900"}`}>
                        {item.native}
                      </span>
                      <span className="text-xs font-bold text-gray-500 mt-0.5">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Continue Button */}
              <div className="pt-2">
                <Button
                  onClick={proceedToRole}
                  className="w-full h-12 bg-[#0A3B7B] hover:bg-[#082F63] text-white font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{t("continue")}</span>
                  <ArrowRight className="size-5" />
                </Button>
              </div>
            </div>
          ) : (
            /* STEP 2: PROFILE / ROLE SELECTION - EXACT MATCH FOR USER SCREENSHOT */
            <div className="flex flex-col relative">
              {/* Back to Language Arrow Button (Top Left of Card) */}
              <button
                type="button"
                onClick={() => setStep("language")}
                className="absolute -top-1 -left-1 sm:-top-3 sm:-left-3 text-gray-500 hover:text-[#0A3B7B] hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center transition-colors border border-gray-200 shadow-2xs cursor-pointer"
                title={t("backToLanguage")}
              >
                <ArrowLeft className="size-5" />
              </button>

              {/* Logo in Center */}
              <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
                <LogoIcon className="h-14 sm:h-16 object-contain" />
              </div>

              {/* Title & Subtitle */}
              <div className="text-center space-y-1 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A3B7B] tracking-tight">
                  {t("selectRole")}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-gray-500">
                  {t("roleSubtitle")}
                </p>
              </div>

              {/* 2 Profile Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Card 1: Worker (Job Seeker) */}
                <div
                  onClick={() => !navigatingRole && handleSelectRole("user")}
                  className={`group relative cursor-pointer rounded-2xl border-2 border-slate-200/90 bg-white p-6 transition-all duration-300 hover:border-[#0A3B7B] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${
                    navigatingRole === "user" ? "border-[#0A3B7B] ring-2 ring-[#0A3B7B]/20 bg-blue-50/20" : ""
                  }`}
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
                    {navigatingRole === "user" ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-[#0A3B7B]" />
                        <span>Opening Seeker Login...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Portal as Job Seeker</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </div>
                </div>

                {/* Card 2: Employer (Hirer) */}
                <div
                  onClick={() => !navigatingRole && handleSelectRole("admin")}
                  className={`group relative cursor-pointer rounded-2xl border-2 border-slate-200/90 bg-white p-6 transition-all duration-300 hover:border-[#0A3B7B] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${
                    navigatingRole === "admin" ? "border-[#0A3B7B] ring-2 ring-[#0A3B7B]/20 bg-amber-50/20" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-[#0A3B7B] group-hover:text-white transition-colors">
                        <Building2 className="size-5" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 text-[10px] font-black uppercase tracking-wider">
                        EMPLOYER / JOB POSTER
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0A3B7B] transition-colors mb-2">
                      {t("jobProvider")}
                    </h3>

                    <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-6">
                      {t("jobProviderDesc")}
                    </p>
                  </div>

                  <div className="flex items-center font-bold text-xs text-[#0A3B7B] group-hover:underline gap-1.5 pt-3.5 border-t border-slate-100">
                    {navigatingRole === "admin" ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-[#0A3B7B]" />
                        <span>Opening Job Poster Login...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Portal as Job Poster</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
