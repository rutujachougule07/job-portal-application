import { Check, UserCheck } from "lucide-react";
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
          size="icon"
          className="h-9 w-9 p-1 rounded-xl bg-white border-[#DCE5F0] hover:bg-[#F5F8FC] hover:border-[#063B78]/40 transition-all shadow-2xs cursor-pointer shrink-0"
          title="Change Language • भाषा बदला"
          aria-label="Change Language"
        >
          <img
            src="/language-icon.png"
            alt="Language"
            className="size-7 rounded-lg object-contain"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-2 shadow-2xl border-[#DCE5F0] bg-white text-[#10233F] z-[60] rounded-xl notranslate">
        <DropdownMenuLabel className="text-[11px] font-black uppercase tracking-wider text-[#5B6B7F] px-2 py-1 flex items-center gap-1.5">
          <img src="/language-icon.png" alt="Language" className="size-4 rounded-full object-contain" />
          <span>{t("chooseLanguage")} • भाषा निवडा</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1.5 bg-[#DCE5F0]" />

        <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
          {languages.map((item) => {
            const isSelected = item.code === lang;
            return (
              <DropdownMenuItem
                key={item.code}
                onClick={() => {
                  setLang(item.code);
                  if (typeof window !== "undefined") {
                    document.cookie = `googtrans=/en/${item.code}; path=/`;
                    document.cookie = `googtrans=/en/${item.code}; path=/; domain=${window.location.hostname}`;
                    
                    setTimeout(() => {
                      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
                      if (select) {
                        select.value = item.code;
                        select.dispatchEvent(new Event("change"));
                      }
                    }, 50);
                  }
                }}
                className={`flex items-center justify-between cursor-pointer px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors ${isSelected
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


