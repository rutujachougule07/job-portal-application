import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Briefcase, Building2, Info, Mail, Menu, ShieldCheck, UserRound, Users, X } from "lucide-react";
import { Brand } from "./Brand";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function PublicHeader() {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#DCE5F0] bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Brand className="h-14 sm:h-16 scale-105 sm:scale-110 origin-left" />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
          <Link to="/" className="nav-link text-sm font-bold hover:text-[#063B78] transition-colors">
            {t("home")}
          </Link>
          <Link to="/jobs" className="nav-link text-sm font-bold hover:text-[#063B78] transition-colors">
            {t("jobs")}
          </Link>
          <Link to="/workers" className="nav-link text-sm font-bold hover:text-[#063B78] transition-colors">
            {t("workers")}
          </Link>
          <Link to="/categories" className="nav-link text-sm font-bold hover:text-[#063B78] transition-colors">
            {t("categories")}
          </Link>
          <Link to="/about" className="nav-link text-sm font-bold hover:text-[#063B78] transition-colors">
            {t("aboutUs")}
          </Link>
          <Link to="/contact" className="nav-link text-sm font-bold hover:text-[#063B78] transition-colors">
            {t("contactUs")}
          </Link>
        </nav>

        {/* Action Buttons & Utilities */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="hidden xl:block">
            <LanguageSwitcher label="Language" showCurrent={true} />
          </div>

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
              <LanguageSwitcher label="Language" showCurrent={true} />
            </div>

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
                to="/workers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-bold text-[#10233F] hover:bg-[#F5F8FC]"
              >
                <Users className="size-5 text-[#FFC400]" />
                {t("workers")}
              </Link>
              <Link
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-bold text-[#10233F] hover:bg-[#F5F8FC]"
              >
                <Building2 className="size-5 text-[#063B78]" />
                {t("categories")}
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

            <div className="pt-4 border-t border-[#DCE5F0] grid grid-cols-2 gap-2.5">
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
          </div>
        </div>
      )}
    </header>
  );
}
