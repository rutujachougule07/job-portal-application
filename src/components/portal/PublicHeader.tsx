import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  HelpCircle,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  ShieldCheck,
  User,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Brand } from "./Brand";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { dataStore } from "@/lib/data-store";
import { toast } from "sonner";

export function PublicHeader() {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: any; fullName?: string; id?: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkUser = () => {
      setUser(dataStore.getCurrentUser());
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("realjob-user");
      window.localStorage.removeItem("realjob_current_user");
    }
    dataStore.setCurrentUser(null);
    setUser(null);
    toast.info("Logged out successfully!");
    if (typeof window !== "undefined") {
      window.location.replace("/#main");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#DCE5F0] bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Brand className="h-14 sm:h-16 scale-105 sm:scale-110 origin-left" />

        {/* Desktop Navigation */}
        {!user && (
          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
            <Link to="/" className="nav-link text-sm font-bold hover:text-[#063B78] transition-colors">
              {t("home")}
            </Link>
            <Link to="/jobs" className="nav-link text-sm font-bold hover:text-[#063B78] transition-colors">
              {t("jobs")}
            </Link>
            <Link to="/about" className="nav-link text-sm font-bold hover:text-[#063B78] transition-colors">
              {t("aboutUs")}
            </Link>
            <Link to="/contact" className="nav-link text-sm font-bold hover:text-[#063B78] transition-colors">
              {t("contactUs")}
            </Link>
          </nav>
        )}

        {/* Action Buttons & Utilities */}
        <div className="flex items-center gap-2 sm:gap-2.5">

          {user ? (
            <div className="flex items-center gap-2">
              {/* Logged in User Badge */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBF1F8] border border-[#B8D3F2] text-xs font-black text-[#063B78]">
                {(user as any).profilePhoto ? (
                  <img src={(user as any).profilePhoto} alt={user.fullName || "User"} className="size-5 rounded-full object-cover ring-1 ring-[#063B78]" />
                ) : (
                  <User className="size-3.5 text-[#063B78]" />
                )}
                <span>{user.fullName || user.email?.split("@")[0] || "User"}</span>
              </div>

              {/* Dashboard Link */}
              <Button asChild size="sm" className="bg-[#063B78] hover:bg-[#082F63] text-white font-extrabold text-xs h-9 px-3 rounded-lg shadow-xs">
                <Link to={user.role === "admin" || user.role === "employer" ? "/admin" : "/dashboard"}>
                  <LayoutDashboard className="size-3.5 mr-1" />
                  Dashboard
                </Link>
              </Button>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs h-9 px-3 rounded-lg shadow-xs flex items-center gap-1"
              >
                <LogOut className="size-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <>
              {/* User Login */}
              <Button asChild variant="outline" className="hidden sm:inline-flex border-[#063B78] text-[#063B78] font-extrabold hover:bg-[#063B78] hover:text-white text-xs px-3 sm:px-3.5 h-9.5 rounded-lg shadow-2xs">
                <Link to="/auth" search={{ mode: "login", role: "worker" }} className="inline-flex items-center gap-1.5">
                  <UserRound className="size-3.5" />
                  <span>{t("userLogin")}</span>
                </Link>
              </Button>

              {/* Admin Login */}
              <Button asChild className="hidden sm:inline-flex bg-[#063B78] hover:bg-[#082F63] text-white font-extrabold text-xs px-3 sm:px-3.5 h-9.5 rounded-lg shadow-xs">
                <Link to="/auth" search={{ mode: "login", role: "admin" }} className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-[#FFC400]" />
                  <span>{t("adminLogin")}</span>
                </Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden text-[#063B78]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-50 bg-[#082F63]/50 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="bg-white border-b border-[#DCE5F0] p-6 shadow-xl space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE5F0]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B6B7F]">Navigation</span>

            </div>

            {user && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#EBF1F8] border border-[#B8D3F2] text-xs font-black text-[#063B78]">
                <User className="size-4 text-[#063B78]" />
                <span>Logged in as: {user.fullName || user.email}</span>
              </div>
            )}

            {!user && (
              <nav className="grid gap-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-bold text-[#10233F] hover:bg-[#F5F8FC]"
                >
                  <Briefcase className="size-5 text-[#063B78]" />
                  {t("home")}
                </Link>
                <Link
                  to="/jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-bold text-[#10233F] hover:bg-[#F5F8FC]"
                >
                  <Briefcase className="size-5 text-[#125BB5]" />
                  {t("jobs")}
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-bold text-[#10233F] hover:bg-[#F5F8FC]"
                >
                  <Info className="size-5 text-[#125BB5]" />
                  {t("aboutUs")}
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-bold text-[#10233F] hover:bg-[#F5F8FC]"
                >
                  <Mail className="size-5 text-[#063B78]" />
                  {t("contactUs")}
                </Link>
              </nav>
            )}

            <div className="pt-4 border-t border-[#DCE5F0]">
              {user ? (
                <div className={`grid ${user.role === 'worker' ? 'grid-cols-1' : 'grid-cols-2'} gap-2.5`}>
                  {user.role !== "worker" && (
                    <Button asChild className="w-full bg-[#063B78] text-white font-extrabold text-xs">
                      <Link to={user.role === "admin" ? "/admin" : "/employer"} onClick={() => setMobileMenuOpen(false)}>
                        <LayoutDashboard className="size-3.5 mr-1" />
                        Dashboard
                      </Link>
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs"
                  >
                    <LogOut className="size-3.5 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Button asChild variant="outline" className="w-full border-[#063B78] text-[#063B78] font-extrabold text-xs">
                    <Link to="/auth" search={{ mode: "login", role: "worker" }} onClick={() => setMobileMenuOpen(false)}>
                      <UserRound className="size-3.5 mr-1" />
                      {t("userLogin")}
                    </Link>
                  </Button>

                  <Button asChild className="w-full bg-[#063B78] text-white font-extrabold text-xs">
                    <Link to="/auth" search={{ mode: "login", role: "admin" }} onClick={() => setMobileMenuOpen(false)}>
                      <ShieldCheck className="size-3.5 mr-1 text-[#FFC400]" />
                      {t("adminLogin")}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
