import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Building2, Check, Globe2, ShieldCheck, UserRound } from "lucide-react";
import { languages, useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LanguageGate() {
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"language" | "role">("language");
  const [selectedLang, setSelectedLang] = useState(lang);

  useEffect(() => {
    const done = window.localStorage.getItem("karyam-onboarding-done");
    if (!done) {
      setOpen(true);
    }
    const handler = () => {
      setStep("language");
      setOpen(true);
    };
    window.addEventListener("karyam-open-gate", handler);
    return () => window.removeEventListener("karyam-open-gate", handler);
  }, []);

  if (!open) return null;

  const proceedToRole = () => {
    setLang(selectedLang);
    setStep("role");
  };

  const handleSelectRole = (role: "user" | "admin") => {
    window.localStorage.setItem("karyam-role", role);
    window.localStorage.setItem("karyam-onboarding-done", "true");
    setOpen(false);

    if (role === "admin") {
      navigate({ to: "/employer" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-primary/95 text-primary-foreground backdrop-blur-md">
      <div className="language-pattern min-h-screen w-full px-4 py-10 sm:py-16 flex items-center justify-center">
        <div className="mx-auto w-full max-w-4xl text-center">
          <div className="mx-auto mb-4 flex justify-center text-3xl font-black tracking-tight">
            <span className="text-white">REAL</span>
            <span className="bg-[#FFC400] text-[#082F63] px-2 py-0.5 rounded-md font-extrabold shadow-sm ml-1.5">JOB</span>
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Job Portal • कार्याम</p>

          {step === "language" ? (
            <>
              <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t("chooseLanguage")}</h1>
              <p className="mt-3 text-sm sm:text-base text-primary-foreground/75 max-w-xl mx-auto">
                {t("languageSubtitle")}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {languages.map((item) => {
                  const active = selectedLang === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setSelectedLang(item.code);
                        setLang(item.code);
                      }}
                      className={`language-card transition-all duration-200 ${
                        active ? "language-card-active shadow-xl ring-2 ring-accent" : "hover:border-primary-foreground/40"
                      }`}
                    >
                      <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full border border-current">
                        {active && <Check className="size-3 text-accent" />}
                      </span>
                      <strong className="font-display text-2xl">{item.native}</strong>
                      <span className="mt-2 text-xs opacity-75">{item.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button
                  onClick={proceedToRole}
                  size="lg"
                  variant="champagne"
                  className="min-w-48 text-base font-semibold shadow-lg gap-2"
                >
                  {t("continue")} <ArrowRight className="size-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t("selectRole")}</h1>
              <p className="mt-3 text-sm sm:text-base text-primary-foreground/75 max-w-xl mx-auto">
                {t("roleSubtitle")}
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto text-left">
                {/* User / Job Seeker Option */}
                <div
                  onClick={() => handleSelectRole("user")}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-primary-foreground/15 hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground shadow-md">
                      <UserRound className="size-6" />
                    </span>
                    <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase">
                      User
                    </span>
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-bold text-primary-foreground">
                    {t("jobSeeker")}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/70">
                    {t("jobSeekerDesc")}
                  </p>
                  <div className="mt-6 flex items-center font-semibold text-accent group-hover:underline text-sm gap-2">
                    {t("viewWebsite")} <ArrowRight className="size-4" />
                  </div>
                </div>

                {/* Job Provider / Admin Option */}
                <div
                  onClick={() => handleSelectRole("admin")}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-primary-foreground/15 hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground shadow-md">
                      <Building2 className="size-6" />
                    </span>
                    <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase">
                      Admin
                    </span>
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-bold text-primary-foreground">
                    {t("jobProvider")}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/70">
                    {t("jobProviderDesc")}
                  </p>
                  <div className="mt-6 flex items-center font-semibold text-accent group-hover:underline text-sm gap-2">
                    {t("viewDashboard")} <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <Button
                  onClick={() => setStep("language")}
                  variant="outline"
                  size="sm"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2"
                >
                  <ArrowLeft className="size-4" /> {t("backToLanguage")}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
