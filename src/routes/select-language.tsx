import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useI18n, languages, LanguageCode } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/portal/Brand";
import { Check } from "lucide-react";

export const Route = createFileRoute("/select-language")({
  validateSearch: z.object({
    redirectTo: z.string().optional().catch("/"),
  }),
  component: SelectLanguagePage,
});

function SelectLanguagePage() {
  const { lang: currentLang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const { redirectTo } = Route.useSearch();

  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentLang || "mr");

  const handleContinue = () => {
    console.log("Language selected:", selectedLang);
    console.log("Navigating to select-role with redirectTo:", redirectTo || "/");
    setLang(selectedLang);
    navigate({ to: "/select-role", search: { redirectTo: redirectTo || "/" } });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('/office_desk_bg.png')`,
      }}
    >
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-2xl border border-white/80 shadow-2xl px-6 py-6 sm:py-8 sm:px-10 transition-all duration-300">
        <div className="flex justify-center mb-4">
          <LogoIcon className="h-12 sm:h-14 object-contain" />
        </div>

        <div className="text-center space-y-1 mb-5">
          <h1 className="text-xl sm:text-2xl font-black text-[#0A3B7B] tracking-tight leading-tight">
            {t("chooseLanguage")}
          </h1>
          <p className="text-sm font-semibold text-gray-600 px-2">
            {t("languageSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => setSelectedLang(item.code)}
              className={`relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${selectedLang === item.code
                  ? "border-[#0A3B7B] bg-[#EBF1F8] shadow-md ring-2 ring-[#0A3B7B]/20"
                  : "border-white/60 bg-white/70 hover:bg-white hover:border-[#DCE5F0]"
                }`}
            >
              <div className="flex flex-col text-left">
                <span className={`text-sm sm:text-base font-bold ${selectedLang === item.code ? "text-[#0A3B7B]" : "text-gray-900"}`}>
                  {item.native}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {item.name}
                </span>
              </div>
              {selectedLang === item.code && (
                <div className="bg-[#1D4ED8] rounded-full p-1 text-white shrink-0 shadow-xs">
                  <Check className="size-3 stroke-[3]" />
                </div>
              )}
            </button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          className="w-full bg-[#0A3B7B] hover:bg-[#082F63] text-white font-black text-sm sm:text-base h-12 rounded-xl shadow-lg transition-all active:scale-95"
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
