import { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { dataStore } from "@/lib/data-store";
import {
  Briefcase,
  Bookmark,
  User,
  LogOut,
  FileText,
  BadgeCheck,
  ChevronRight,
  Search,
  Home
} from "lucide-react";

export function UserSidebarLayout({ children, activeTab }: { children: ReactNode, activeTab: string }) {
  const navigate = useNavigate();
  const user = dataStore.getCurrentUser();

  if (!user) {
    return <>{children}</>; // Fallback if somehow rendered without user
  }

  const tabs = [
    { id: "overview", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "find-jobs", label: "Find Jobs", icon: Search, path: "/jobs" },
    { id: "applied", label: "Applied Jobs", icon: FileText, path: "/dashboard", search: { tab: "applied" } },
    { id: "saved", label: "Saved Jobs", icon: Bookmark, path: "/dashboard", search: { tab: "saved" } },
    { id: "profile", label: "My Profile", icon: User, path: "/dashboard", search: { tab: "profile" } },
  ];

  return (
    <div className="h-screen bg-[#F5F8FC] flex flex-col font-sans overflow-hidden">
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0 h-full overflow-y-auto lg:pr-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="bg-white rounded-2xl shadow-sm border border-[#DCE5F0] overflow-hidden">
              {/* User Profile Summary */}
              <div className="p-6 bg-gradient-to-br from-[#063B78] to-[#125BB5] text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 size-32 rounded-full bg-white/10 blur-2xl"></div>
                
                <div className="relative z-10 size-24 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner border border-white/30">
                  <span className="text-4xl font-black text-white drop-shadow-md">
                    {user.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="relative z-10 font-black text-xl leading-tight text-white drop-shadow-sm">
                  {user.fullName}
                </h3>
                <p className="relative z-10 text-sm font-semibold text-white/90 mt-1">
                  {user.email}
                </p>
                <div className="relative z-10 mt-4 inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FFC400] to-[#F59E0B] text-[#10233F] px-4 py-1.5 rounded-full text-xs font-black shadow-md">
                  <BadgeCheck className="size-4" /> Verified User
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4 space-y-1.5">
                {tabs.map((item) => {
                  // @ts-ignore
                  return <Link
                    key={item.id}
                    to={item.path}
                    search={item.search}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      activeTab === item.id 
                        ? "bg-[#EBF1F8] text-[#063B78] shadow-sm translate-x-1" 
                        : "text-[#5B6B7F] hover:bg-gray-50 hover:text-[#10233F]"
                    }`}
                  >
                    <item.icon className={`size-5 transition-colors ${activeTab === item.id ? "text-[#063B78]" : "text-gray-400"}`} />
                    {item.label}
                    {activeTab === item.id && <ChevronRight className="size-4 ml-auto" />}
                  </Link>
                })}
                
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      dataStore.logout();
                      navigate({ to: "/" });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all duration-300 hover:translate-x-1"
                  >
                    <LogOut className="size-5" />
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto pb-10 pr-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
