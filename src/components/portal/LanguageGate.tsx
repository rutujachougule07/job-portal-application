import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Building2, Check, Globe2, ShieldCheck, UserRound, Sparkles } from "lucide-react";
import { languages, useI18n, type LanguageCode } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/portal/Brand";
import { toast } from "sonner";

export function LanguageGate() {
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState<"language" | "role">("language");
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(lang || "mr");

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ step?: "language" | "role" }>;
      const targetStep = customEvent?.detail?.step || "role";
      setStep(targetStep);
      setOpen(true);
    };

    window.addEventListener("karyam-open-gate", handleOpen as EventListener);
    return () => window.removeEventListener("karyam-open-gate", handleOpen as EventListener);
  }, []);

  if (!open) return null;

  const handleLanguageSelect = (code: LanguageCode) => {
    setSelectedLang(code);
    setLang(code);
  };

  const proceedToRole = () => {
    setLang(selectedLang);
    setStep("role");
  };

  const handleSelectRole = (role: "user" | "admin") => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("realjob-role", role);
      window.localStorage.setItem("realjob-gate-done", "true");
      window.localStorage.setItem("karyam-onboarding-done", "true");
    }
    setOpen(false);

    if (role === "admin") {
      toast.success(
        selectedLang === "mr"
          ? "जॉब पोस्टर पोर्टलमध्ये आपले स्वागत आहे!"
          : "Welcome to Job Poster Portal!"
      );
      navigate({ to: "/auth", search: { mode: "login", role: "admin" } });
    } else {
      toast.success(
        selectedLang === "mr"
          ? "नोकरी शोधक पोर्टलमध्ये आपले स्वागत आहे!"
          : "Welcome to Job Seeker Portal!"
      );
      navigate({ to: "/" });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-[#082F63]/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-white/40 overflow-hidden my-auto p-6 sm:p-10 transition-all duration-300">
        
        {/* Header Branding & Progress Bar */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <LogoIcon className="h-12 sm:h-14 mb-3 object-contain" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1F8] border border-[#B8D3F2] text-[11px] font-black text-[#063B78] uppercase tracking-wider">
            <Sparkles className="size-3 text-[#D4AF37]" />
            {step === "language" ? "Step 1 of 2 • Language Selection / भाषा निवडा" : "Step 2 of 2 • Select Your Profile / भूमिका निवडा"}
          </div>
        </div>

        {/* STEP 1: LANGUAGE SELECTION */}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {languages.map((item) => {
                const active = selectedLang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleLanguageSelect(item.code)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 text-center cursor-pointer ${
                      active
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
          <div className="space-y-6">
            <div className="text-center space-y-1">
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

            {/* Back to Language Button */}
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                onClick={() => setStep("language")}
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-100 font-extrabold text-xs rounded-xl h-10 px-4 flex items-center gap-2"
              >
                <ArrowLeft className="size-4" />
                <span>{t("backToLanguage")}</span>
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
