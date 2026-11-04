import { ReactNode, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { dataStore } from "@/lib/data-store";
import { useI18n } from "@/lib/i18n";
import {
  Bookmark,
  User,
  FileText,
  BadgeCheck,
  Home,
  Menu,
  X,
  Briefcase,
  Search
} from "lucide-react";

export function UserSidebarLayout({ children, activeTab }: { children: ReactNode, activeTab: string }) {
  const navigate = useNavigate();
  const user = dataStore.getCurrentUser("worker");
  const { lang, setLang, t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) {
    return <>{children}</>;
  }

  const tabs = [
    { id: "overview", label: t("dashboard"), mobileLabel: lang === "mr" ? "डॅशबोर्ड" : "Home", icon: Home, path: "/dashboard" },
    { id: "find-jobs", label: t("jobs"), mobileLabel: lang === "mr" ? "नोकऱ्या" : "Jobs", icon: Briefcase, path: "/jobs" },
    { id: "applied", label: t("appliedJobsTab"), mobileLabel: lang === "mr" ? "माझे अर्ज" : "Applied", icon: FileText, path: "/dashboard", search: { tab: "applied" } },
    { id: "saved", label: t("savedJobsTab"), mobileLabel: lang === "mr" ? "सेव्ह" : "Saved", icon: Bookmark, path: "/dashboard", search: { tab: "saved" } },
    { id: "profile", label: t("myProfile"), mobileLabel: lang === "mr" ? "प्रोफाइल" : "Profile", icon: User, path: "/dashboard", search: { tab: "profile" } },
  ];

  return (
    <div className="h-screen bg-[#F5F8FC] flex flex-col md:flex-row font-sans max-w-full overflow-hidden">
      
      {/* ================= MOBILE TOP NAVBAR HEADER (Matching Sketch Structure) ================= */}
      <header className="md:hidden bg-[#051B38] text-white px-3 py-2 sticky top-0 z-40 flex items-center justify-between shadow-md border-b border-white/10 shrink-0 w-full gap-2">
        {/* Profile Avatar on top & Name below (Matching Drawing) */}
        <Link
          to="/dashboard"
          search={{ tab: "profile" }}
          className="flex flex-col items-center justify-center min-w-0 shrink-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all text-center pt-0.5"
          title="View Profile"
        >
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.fullName || "User"}
              className="size-8.5 rounded-full object-cover shadow-md ring-2 ring-white/20 border border-white shrink-0"
            />
          ) : (
            <div className="size-8.5 rounded-full bg-[#125BB5] text-white flex items-center justify-center font-black text-xs shadow-md ring-2 ring-white/20 shrink-0">
              {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "C"}
            </div>
          )}
          <span className="font-bold text-[10px] text-white truncate max-w-[55px] sm:max-w-[70px] leading-tight mt-0.5">
            {user.fullName || user.email?.split("@")[0] || "payal"}
          </span>
        </Link>

        {/* Search Bar in between Profile and Menu (Capsule Pill matching Drawing) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              navigate({ to: "/jobs", search: { q: searchQuery.trim() } as any });
            }
          }}
          className="flex-1 min-w-0 mx-1 sm:mx-2"
        >
          <div className="relative flex items-center">
            <Search className="size-3.5 text-white/50 absolute left-3 pointer-events-none shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-white/50 text-xs font-medium rounded-full pl-8.5 pr-3 py-1.5 border border-white/15 focus:border-white/30 focus:outline-none transition-all shadow-inner"
            />
          </div>
        </form>

        {/* Menu Hamburger Button [ ≡ ] */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="size-9 rounded-xl bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer border border-white/10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* ================= MOBILE SLIDE-OVER DRAWER MENU (Visible when hamburger is clicked) ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer Content */}
          <aside className="relative w-4/5 max-w-xs bg-[#051B38] text-white flex flex-col justify-between h-full p-5 shadow-2xl z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.fullName || "User"}
                      className="size-12 rounded-full object-cover shadow-md ring-2 ring-white/20"
                    />
                  ) : (
                    <div className="size-12 rounded-full bg-[#125BB5] text-white flex items-center justify-center font-black text-xl shadow-md">
                      {user.fullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-black text-sm text-white truncate">{user.fullName || "User"}</h2>
                    <p className="text-[11px] text-white/70 truncate">{user.email || ""}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {tabs.map((item) => {
                  const isActive = activeTab === item.id;
                  const linkProps = item.search ? { to: item.path, search: item.search } : { to: item.path };
                  return (
                    <Link
                      key={item.id}
                      {...(linkProps as any)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive
                          ? "bg-[#0E356A] text-white shadow-md font-extrabold"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#FFC400] rounded-r-full"></span>
                      )}
                      <item.icon className={`size-4 ${isActive ? "text-[#FFC400]" : "text-white/60"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* ================= DESKTOP LEFT NAVY SIDEBAR (Hidden on < 768px) ================= */}
      <aside className="hidden md:flex w-64 bg-[#051B38] text-white flex-col justify-between shrink-0 h-full px-4 py-4 overflow-y-auto border-r border-white/10" style={{ scrollbarWidth: 'none' }}>
        <div>
          {/* User Profile Card */}
          <div className="pt-1 pb-4 px-2 text-center border-b border-white/10 mb-4">
            <Link
              to="/dashboard"
              search={{ tab: "profile" }}
              className="block cursor-pointer hover:opacity-90 transition-opacity"
              title="View Profile"
            >
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.fullName || "User"}
                  className="size-20 rounded-full object-cover mx-auto mb-2 shadow-lg ring-4 ring-white/20 border-2 border-white"
                />
              ) : (
                <div className="size-20 rounded-full bg-[#125BB5] text-white flex items-center justify-center font-black text-3xl mx-auto mb-2 shadow-lg ring-4 ring-white/10">
                  {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <h2 className="font-black text-lg text-white tracking-tight">{user.fullName || user.email?.split("@")[0] || "User"}</h2>
              <p className="text-xs font-semibold text-white/70 truncate px-2">{user.email || ""}</p>
            </Link>

            <div className="mt-2.5 inline-flex items-center gap-1.5 bg-[#FFC400]/20 border border-[#FFC400] text-[#FFC400] px-3 py-0.5 rounded-full text-[11px] font-black">
              <BadgeCheck className="size-3.5" /> {t("verifiedUser")}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {tabs.map((item) => {
              const isActive = activeTab === item.id;
              const linkProps = item.search ? { to: item.path, search: item.search } : { to: item.path };
              return (
                <Link
                  key={item.id}
                  {...(linkProps as any)}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                      ? "bg-[#0E356A] text-white shadow-md font-extrabold"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#FFC400] rounded-r-full"></span>
                  )}
                  <item.icon className={`size-4.5 ${isActive ? "text-[#FFC400]" : "text-white/60"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ================= RIGHT MAIN SCROLLABLE CONTENT ================= */}
      <main className="flex-1 h-full bg-[#F5F8FC] p-3 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pb-20 md:pb-8 w-full" style={{ scrollbarWidth: 'none' }}>
        <div className="max-w-7xl mx-auto space-y-6 min-w-0 max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR (Visible on < 768px for easy thumb tapping) ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#051B38] text-white border-t border-white/10 z-40 px-1 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
        {tabs.map((item) => {
          const isActive = activeTab === item.id;
          const linkProps = item.search ? { to: item.path, search: item.search } : { to: item.path };
          return (
            <Link
              key={item.id}
              {...(linkProps as any)}
              className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                isActive ? "text-[#FFC400] bg-white/10" : "text-white/70 hover:text-white"
              }`}
            >
              <item.icon className={`size-4.5 ${isActive ? "text-[#FFC400]" : "text-white/70"}`} />
              <span className="truncate max-w-[68px] text-center">{item.mobileLabel || item.label}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
