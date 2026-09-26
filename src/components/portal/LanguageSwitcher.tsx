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
  label = "Languages",
  showCurrent = true,
}: {
  label?: string;
  showCurrent?: boolean;
}) {
  const { lang, setLang } = useI18n();
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
          className="h-9 gap-2 px-3 text-xs font-semibold bg-card border-border hover:bg-secondary transition-colors"
        >
          <Globe2 className="size-4 text-accent" />
          <span>{label}</span>
          {showCurrent && (
            <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[11px] font-bold text-accent-foreground">
              {currentItem.native}
            </span>
          )}
          <ChevronDown className="size-3.5 opacity-60 ml-0.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 p-1.5 shadow-xl border-border bg-popover text-popover-foreground z-50">
        <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2.5 py-1.5">
          Select Language • भाषा निवडा
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />

        <div className="max-h-64 overflow-y-auto space-y-0.5">
          {languages.map((item) => {
            const isSelected = item.code === lang;
            return (
              <DropdownMenuItem
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`flex items-center justify-between cursor-pointer px-2.5 py-2 text-sm rounded-md transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-secondary hover:text-foreground"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{item.native}</span>
                  <span className="text-[11px] text-muted-foreground">({item.name})</span>
                </div>
                {isSelected && <Check className="size-4 text-accent stroke-[2.5]" />}
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          onClick={openGate}
          className="cursor-pointer px-2.5 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/10 rounded-md flex items-center gap-2"
        >
          <UserCheck className="size-3.5 text-accent" />
          Change Profile (User / Admin)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
