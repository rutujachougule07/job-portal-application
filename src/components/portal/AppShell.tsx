import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  FileText,
  Globe2,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { Brand } from "./Brand";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useI18n, type TranslationKeys } from "@/lib/i18n";
import { LanguageGate } from "./LanguageGate";

type Role = "user" | "admin" | "super";

const menus: Record<Role, Array<{ label: string; icon: typeof LayoutDashboard; to: string }>> = {
  user: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Jobs", icon: BriefcaseBusiness, to: "/jobs" },
    { label: "Applications", icon: FileText, to: "/applications" },
    { label: "E-Salary", icon: WalletCards, to: "/salary" },
    { label: "Notifications", icon: Bell, to: "/notifications" },
    { label: "Profile", icon: Users, to: "/profile" },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/employer" },
    { label: "Jobs", icon: BriefcaseBusiness, to: "/employer/jobs" },
    { label: "Applicants", icon: Users, to: "/employer/applicants" },
    { label: "Employees", icon: Building2, to: "/employer/employees" },
    { label: "E-Salary", icon: WalletCards, to: "/employer/salary" },
    { label: "Reports", icon: BarChart3, to: "/employer/reports" },
  ],
  super: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/control" },
    { label: "Users", icon: Users, to: "/control/users" },
    { label: "Employers", icon: Building2, to: "/control/employers" },
    { label: "Jobs", icon: BriefcaseBusiness, to: "/control/jobs" },
    { label: "E-Salary", icon: WalletCards, to: "/control/salary" },
    { label: "Reports", icon: BarChart3, to: "/control/reports" },
    { label: "Languages", icon: Globe2, to: "/control/languages" },
    { label: "Settings", icon: Settings, to: "/control/settings" },
  ],
};

export function AppShell({ role, title, eyebrow, children }: { role: Role; title: string; eyebrow?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { t } = useI18n();

  const signOut = () => {
    window.localStorage.removeItem("realjob-user");
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <LanguageGate />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar p-4 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </div>

        <div className="my-7 rounded-md bg-primary px-4 py-3 text-primary-foreground">
          <p className="text-[10px] font-bold uppercase text-primary-foreground/65">
            {role === "admin" ? "Employer Admin" : role === "super" ? "Super Admin" : "User Portal"}
          </p>
          <p className="mt-1 text-sm font-semibold">
            {role === "user" ? "My Career" : role === "admin" ? "Nexa Systems" : "Platform Control"}
          </p>
        </div>

        <nav className="space-y-1">
          {menus[role].map((item) => {
            const active = path === item.to;
            const menuLabelKeyMap: Record<string, TranslationKeys> = {
              Dashboard: "dashboard",
              Jobs: "jobs",
              Applications: "applications",
              "E-Salary": "dashboard",
              Notifications: "notifications",
              Profile: "profile",
              Applicants: "applicants",
              Employees: "employees",
              Reports: "reports",
              Users: "users",
              Employers: "employers",
              Languages: "chooseLanguage",
              Settings: "settings",
            };
            const translationKey = menuLabelKeyMap[item.label];
            const displayLabel = translationKey ? t(translationKey) : item.label;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className={`size-4 ${active ? "text-accent-foreground" : ""}`} />
                {displayLabel}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs font-semibold gap-2 border-border"
          >
            <Link to="/">
              <Globe className="size-3.5 text-accent" />
              {t("viewWebsite")}
            </Link>
          </Button>

          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
          >
            <LogOut className="size-4" />
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu />
            </Button>
            <div>
              {eyebrow && <p className="text-[10px] font-bold uppercase text-accent-foreground">{eyebrow}</p>}
              <h1 className="font-display text-xl font-semibold sm:text-2xl">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-xs font-semibold">
              <Link to="/">{t("viewWebsite")}</Link>
            </Button>

            <div className="hidden sm:block">
              <LanguageSwitcher label="Languages" showCurrent={true} />
            </div>

            <Button size="icon" variant="outline" aria-label="Notifications">
              <Bell />
            </Button>

            <Button variant="ghost" className="gap-2 px-2">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                RJ
              </span>
              <ChevronDown className="hidden size-3 sm:block" />
            </Button>
          </div>
        </header>

        <main className="p-4 pb-24 sm:p-7">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border bg-card px-2 py-2 lg:hidden">
        {menus[role].slice(0, 5).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex min-w-14 flex-col items-center gap-1 text-[10px] ${
              path === item.to ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
