import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Building2, Check, Globe2, ShieldCheck, UserRound, Sparkles } from "lucide-react";
import { languages, useI18n, type LanguageCode } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/portal/Brand";
import { toast } from "sonner";

let hasShownGateThisSession = false;

export function LanguageGate() {
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined" && window.location.hash === "#main") {
      hasShownGateThisSession = true;
      return false;
    }
    if (!hasShownGateThisSession) {
      return true;
    }
    return false;
  });
  const location = useLocation();
  const [step, setStep] = useState<"language" | "role">(() => {
    if (typeof window !== "undefined" && window.location.hash === "#role") {
      return "role";
    }
    return "language";
  });
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(lang || "mr");

  useEffect(() => {
    if (lang) {
      setSelectedLang(lang);
    }
  }, [lang]);

  useEffect(() => {
    if (location.pathname === "/") {
      const hash = location.hash; // TanStack Router hash (without #)
      if (hash === "role") {
        setOpen(true);
        setStep("role");
      } else if (hash === "main") {
        setOpen(false);
      } else if (hash === "language") {
        setOpen(true);
        setStep("language");
      }
    }
  }, [location.hash, location.pathname]);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ step?: "language" | "role" }>;
      const targetStep = customEvent?.detail?.step || "role";
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
    if (typeof window !== "undefined") {
      // Set the Google Translate cookie
      document.cookie = `googtrans=/en/${code}; path=/`;
      document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname}`;
      
      // Defer the heavy Google Translate DOM manipulation so React can render the selection first
      setTimeout(() => {
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (select) {
          select.value = code;
          select.dispatchEvent(new Event("change"));
        }
      }, 50);
    }
  };

  const proceedToRole = () => {
    setLang(selectedLang);
    setStep("role");
    navigate({ to: "/", hash: "role" });
  };

  const handleSelectRole = (role: "user" | "admin") => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("realjob-role", role);
      window.localStorage.setItem("realjob-gate-done", "true");
      window.localStorage.setItem("karyam-onboarding-done", "true");
      window.dispatchEvent(new Event("realjob-auth-change"));
    }
    hasShownGateThisSession = true;
    setOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    if (role === "admin") {
      toast.success(
        selectedLang === "mr"
          ? "जॉब पोस्टर पोर्टलमध्ये आपले स्वागत आहे!"
          : "Welcome to Job Poster Portal!"
      );
      navigate({ to: "/", hash: "main" });
    } else {
      toast.success(
        selectedLang === "mr"
          ? "नोकरी शोधक पोर्टलमध्ये आपले स्वागत आहे!"
          : "Welcome to Job Seeker Portal!"
      );
      navigate({ to: "/", hash: "main" });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto animate-fade-in">
      {/* Blurred Poster Background */}
      <div
        className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{ backgroundImage: `url('/portal-bg.png')` }}
      />
      {/* Color Overlay for Readability */}
      <div className="fixed inset-0 z-[-1] bg-black/40" />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-white/40 overflow-hidden p-6 sm:p-10 transition-all duration-300">

        {/* Header Branding & Progress Bar */}
        <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
          <LogoIcon className="h-14 sm:h-16 object-contain" />
        </div>

        {step === "language" ? (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[#082F63] tracking-tight">
                {t("chooseLanguage")}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-gray-600">
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
                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 text-center cursor-pointer ${active
                        ? "border-[#063B78] bg-[#EBF1F8] shadow-md scale-[1.02] ring-2 ring-[#063B78]/20"
                        : "border-gray-200 bg-gray-50/70 hover:bg-white hover:border-[#063B78]/40 hover:shadow-xs"
                      }`}
                  >
                    {active && (
                      <div className="absolute top-2.5 right-2.5 size-5 rounded-full bg-[#063B78] text-white flex items-center justify-center">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    )}
                    <span className={`text-lg sm:text-xl font-black ${active ? "text-[#063B78]" : "text-gray-900"}`}>
                      {item.native}
                    </span>
                    <span className="text-xs font-bold text-gray-500 mt-0.5">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                onClick={proceedToRole}
                className="w-full h-12 bg-[#063B78] hover:bg-[#082F63] text-white font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>{t("continue")}</span>
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
        ) : (
          /* STEP 2: ROLE / PROFILE SELECTION */
          <div className="flex flex-col">
            {/* Back to Language Button (Moved to Top Left of Modal) */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
              <Button
                type="button"
                onClick={() => {
                  setStep("language");
                  navigate({ to: "/", hash: "language" });
                }}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-[#063B78] hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center transition-colors shadow-sm border border-transparent hover:border-gray-200"
                title={t("backToLanguage")}
              >
                <ArrowLeft className="size-5" />
              </Button>
            </div>

            <div className="text-center space-y-1 mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-[#082F63] tracking-tight">
                {t("selectRole")}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-gray-600">
                {t("roleSubtitle")}
              </p>
            </div>

            {/* 2 Profile Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Option 1: Job Seeker (Worker) */}
              <div
                onClick={() => handleSelectRole("user")}
                className="group relative cursor-pointer rounded-2xl border-2 border-[#DCE5F0] bg-white p-6 transition-all duration-300 hover:border-[#063B78] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 rounded-xl bg-[#EBF1F8] text-[#063B78] flex items-center justify-center group-hover:bg-[#063B78] group-hover:text-white transition-colors shadow-xs">
                      <UserRound className="size-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#EBF1F8] border border-[#B8D3F2] text-[10px] font-black text-[#063B78] uppercase">
                      Worker / Job Seeker
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#10233F] group-hover:text-[#063B78] transition-colors mb-2">
                    {t("jobSeeker")}
                  </h3>

                  <p className="text-xs font-semibold text-gray-600 leading-relaxed mb-6">
                    {t("jobSeekerDesc")}
                  </p>
                </div>

                <div className="flex items-center font-extrabold text-xs text-[#063B78] group-hover:underline gap-1.5 pt-2 border-t border-gray-100">
                  <span>Enter Portal as Job Seeker</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Option 2: Job Poster (Employer) */}
              <div
                onClick={() => handleSelectRole("admin")}
                className="group relative cursor-pointer rounded-2xl border-2 border-[#DCE5F0] bg-white p-6 transition-all duration-300 hover:border-[#063B78] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 rounded-xl bg-[#FEF9E7] text-[#B45309] flex items-center justify-center group-hover:bg-[#063B78] group-hover:text-white transition-colors shadow-xs">
                      <Building2 className="size-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#FEF9E7] border border-[#FDE68A] text-[10px] font-black text-[#B45309] uppercase">
                      Employer / Job Poster
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#10233F] group-hover:text-[#063B78] transition-colors mb-2">
                    {t("jobProvider")}
                  </h3>

                  <p className="text-xs font-semibold text-gray-600 leading-relaxed mb-6">
                    {t("jobProviderDesc")}
                  </p>
                </div>

                <div className="flex items-center font-extrabold text-xs text-[#063B78] group-hover:underline gap-1.5 pt-2 border-t border-gray-100">
                  <span>Enter Portal as Job Poster</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
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
