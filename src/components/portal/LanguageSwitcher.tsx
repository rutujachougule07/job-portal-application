import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { languages, useI18n, type LanguageCode } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Ordered languages list including English at the top:
// 1. English
// 2. मराठी (Marathi)
// 3. हिंदी (Hindi)
// 4. ગુજરાતી (Gujarati)
// 5. ಕನ್ನಡ (Kannada)
// 6. తెలుగు (Telugu)
// 7. தமிழ் (Tamil)
// 8. বাংলা (Bengali)
const orderedLanguageCodes: LanguageCode[] = [
  "en",
  "mr",
  "hi",
  "gu",
  "kn",
  "te",
  "ta",
  "bn",
];

export function LanguageSwitcher({
  variant = "pill",
  className = "",
}: {
  label?: string;
  showCurrent?: boolean;
  variant?: "pill" | "icon";
  className?: string;
}) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  // Starts as null so on every page refresh it always defaults to showing "Language"
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const handleSelect = (code: LanguageCode) => {
    setLang(code);
    setSelectedCode(code);
  };

  const currentLangObj = languages.find((l) => l.code === selectedCode);
  const displayText = selectedCode && currentLangObj?.native ? currentLangObj.native : "Language";

  const allLanguages = orderedLanguageCodes
    .map((code) => languages.find((l) => l.code === code))
    .filter(Boolean) as (typeof languages)[number][];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <button
            type="button"
            className={`h-9 w-9 p-1 rounded-xl bg-white border border-[#DCE5F0] hover:bg-[#F5F8FC] hover:border-[#063B78]/40 transition-all shadow-2xs cursor-pointer shrink-0 flex items-center justify-center ${className}`}
            title="Change Language • भाषा बदला"
            aria-label="Change Language"
          >
            <img
              src="/language-icon.png"
              alt="Language"
              className="size-7 rounded-lg object-contain"
            />
          </button>
        ) : (
          <button
            type="button"
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer font-semibold text-xs sm:text-sm shrink-0 select-none ${
              open
                ? "bg-[#EDF5FE] border-2 border-[#3B82F6] text-[#0F172A] shadow-xs"
                : "bg-[#EDF5FE] border border-[#3B82F6] text-[#0F172A] hover:bg-[#E3EFFD]"
            } ${className}`}
            title="Change Language • भाषा बदला"
            aria-label="Change Language"
          >
            <Globe className="size-4.5 sm:size-5 text-[#1D4ED8] stroke-[2.2] shrink-0" />
            <span className="font-semibold text-[#10233F]">{displayText}</span>
            {open ? (
              <ChevronUp className="size-4 text-[#1D4ED8] stroke-[2.5] shrink-0" />
            ) : (
              <ChevronDown className="size-4 text-[#1D4ED8] stroke-[2.5] shrink-0" />
            )}
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-[180px] p-1.5 shadow-2xl border border-slate-200/90 bg-white text-[#10233F] z-[100] rounded-2xl notranslate overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
      >
        <div className="space-y-0.5">
          {allLanguages.map((item) => {
            const isSelected = item.code === lang;
            return (
              <DropdownMenuItem
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className="flex items-center justify-between cursor-pointer px-2.5 py-2 rounded-xl transition-colors hover:bg-[#F0F6FF] text-[#0F172A] outline-none"
              >
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-sm text-[#0F172A]">{item.native}</span>
                  {item.code !== "en" && (
                    <span className="text-xs font-medium text-slate-500">
                      ({item.name})
                    </span>
                  )}
                </div>
                {isSelected && (
                  <div className="size-5 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
