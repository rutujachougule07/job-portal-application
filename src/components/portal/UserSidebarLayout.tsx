import { ReactNode, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { dataStore } from "@/lib/data-store";
import { useI18n } from "@/lib/i18n";
import {
  Bookmark,
  User,
  LogOut,
  FileText,
  BadgeCheck,
  Search,
  Home,
  Settings,
  Bell,
  Globe,
  ChevronDown
} from "lucide-react";

export function UserSidebarLayout({ children, activeTab }: { children: ReactNode, activeTab: string }) {
  const navigate = useNavigate();
  const user = dataStore.getCurrentUser();
  const { lang, setLang } = useI18n();

  if (!user) {
    return <>{children}</>;
  }

  const tabs = [
    { id: "overview", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "find-jobs", label: "Find Jobs", icon: Search, path: "/jobs" },
    { id: "applied", label: "Applied Jobs", icon: FileText, path: "/dashboard", search: { tab: "applied" } },
    { id: "saved", label: "Saved Jobs", icon: Bookmark, path: "/dashboard", search: { tab: "saved" } },
    { id: "profile", label: "My Profile", icon: User, path: "/dashboard", search: { tab: "profile" } },
    { id: "settings", label: "Settings", icon: Settings, path: "/dashboard", search: { tab: "settings" } },
  ];

  return (
    <div className="h-screen bg-[#F5F8FC] flex font-sans overflow-hidden">
      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dark Navy Left Sidebar */}
        <aside className="w-64 bg-[#051B38] text-white flex flex-col justify-between shrink-0 h-full p-4 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div>
            {/* User Profile Card */}
            <div className="pt-4 pb-6 px-2 text-center border-b border-white/10 mb-4">
              <div className="size-20 rounded-full bg-[#125BB5] text-white flex items-center justify-center font-black text-3xl mx-auto mb-3 shadow-lg ring-4 ring-white/10">
                {user.fullName?.charAt(0).toUpperCase() || "P"}
              </div>
              <h2 className="font-black text-lg text-white tracking-tight">{user.fullName || "payal"}</h2>
              <p className="text-xs font-semibold text-white/70 truncate px-2">{user.email || "payal@gmail.com"}</p>
              
              <div className="mt-3 inline-flex items-center gap-1.5 bg-[#FFC400]/20 border border-[#FFC400] text-[#FFC400] px-3 py-1 rounded-full text-[11px] font-black">
                <BadgeCheck className="size-3.5" /> Verified User
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
                    className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isActive 
                        ? "bg-[#0E356A] text-white shadow-md" 
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

          {/* Sign Out Action */}
          <div className="pt-4 border-t border-white/10">
            <button 
              onClick={() => {
                dataStore.logout();
                navigate({ to: "/" });
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="size-4.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Scrollable Content */}
        <main className="flex-1 bg-[#F5F8FC] p-6 overflow-y-auto h-full" style={{ scrollbarWidth: 'none' }}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
