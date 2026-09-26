import { Link } from "@tanstack/react-router";
import { Briefcase, Home, MessageSquare, User, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function MobileBottomNav() {
  const { t } = useI18n();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DCE5F0] py-2 px-3 sm:hidden shadow-lg">
      <div className="grid grid-cols-5 gap-1">
        <Link
          to="/"
          className="flex flex-col items-center justify-center py-1 text-xs font-semibold text-[#5B6B7F] hover:text-[#063B78] aria-[current=page]:text-[#063B78]"
        >
          <Home className="size-5 mb-0.5" />
          <span>{t("home")}</span>
        </Link>

        <Link
          to="/jobs"
          className="flex flex-col items-center justify-center py-1 text-xs font-semibold text-[#5B6B7F] hover:text-[#063B78] aria-[current=page]:text-[#063B78]"
        >
          <Briefcase className="size-5 mb-0.5" />
          <span>{t("jobs")}</span>
        </Link>

        <Link
          to="/workers"
          className="flex flex-col items-center justify-center py-1 text-xs font-semibold text-[#5B6B7F] hover:text-[#063B78] aria-[current=page]:text-[#063B78]"
        >
          <Users className="size-5 mb-0.5" />
          <span>{t("workers")}</span>
        </Link>

        <Link
          to="/dashboard"
          className="flex flex-col items-center justify-center py-1 text-xs font-semibold text-[#5B6B7F] hover:text-[#063B78] aria-[current=page]:text-[#063B78]"
        >
          <MessageSquare className="size-5 mb-0.5" />
          <span>Chat</span>
        </Link>

        <Link
          to="/auth"
          search={{ mode: "login", role: "worker" }}
          className="flex flex-col items-center justify-center py-1 text-xs font-semibold text-[#5B6B7F] hover:text-[#063B78] aria-[current=page]:text-[#063B78]"
        >
          <User className="size-5 mb-0.5" />
          <span>Account</span>
        </Link>
      </div>
    </div>
  );
}
