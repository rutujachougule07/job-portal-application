import { Check, ChevronDown, Globe2, UserCheck } from "lucide-react";
import { languages, useI18n } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher({
  label = "Language",
  showCurrent = true,
}: {
  label?: string;
  showCurrent?: boolean;
}) {
  const { lang, setLang, t } = useI18n();
  const currentItem = languages.find((item) => item.code === lang) || languages[0];

  const openGate = () => {
    window.dispatchEvent(new Event("karyam-open-gate"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 px-2.5 sm:px-3 text-xs font-bold bg-white border-[#DCE5F0] hover:bg-[#F5F8FC] transition-all shadow-2xs text-[#10233F]"
        >
          <Globe2 className="size-4 text-[#063B78] shrink-0" />
          <span className="hidden md:inline">{label}</span>
          {showCurrent && (
            <span className="rounded bg-[#063B78]/10 px-1.5 py-0.5 text-[11px] font-extrabold text-[#063B78]">
              {currentItem.native}
            </span>
          )}
          <ChevronDown className="size-3.5 opacity-60 ml-0.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-2 shadow-2xl border-[#DCE5F0] bg-white text-[#10233F] z-[60] rounded-xl">
        <DropdownMenuLabel className="text-[11px] font-black uppercase tracking-wider text-[#5B6B7F] px-2 py-1">
          {t("chooseLanguage")} • भाषा निवडा
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1.5 bg-[#DCE5F0]" />

        <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
          {languages.map((item) => {
            const isSelected = item.code === lang;
            return (
              <DropdownMenuItem
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`flex items-center justify-between cursor-pointer px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[#063B78] text-white font-bold"
                    : "hover:bg-[#F5F8FC] hover:text-[#063B78]"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">{item.native}</span>
                  <span className={`text-[11px] ${isSelected ? "text-slate-200" : "text-slate-500"}`}>
                    ({item.name})
                  </span>
                </div>
                {isSelected && <Check className="size-4 text-[#FFC400] stroke-[3]" />}
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="my-1.5 bg-[#DCE5F0]" />
        <DropdownMenuItem
          onClick={openGate}
          className="cursor-pointer px-3 py-2 text-xs font-bold text-[#063B78] hover:bg-[#F5F8FC] rounded-lg flex items-center gap-2"
        >
          <UserCheck className="size-4 text-[#063B78]" />
          {t("selectRole")} / Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

