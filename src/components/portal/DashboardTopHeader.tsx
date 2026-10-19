import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Bell, ChevronDown, Check, LogOut, User, Briefcase, Settings } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { dataStore } from "@/lib/data-store";

interface DashboardTopHeaderProps {
  role?: "seeker" | "employer";
  userName?: string;
  userEmail?: string;
  userPhoto?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

const LOCATIONS = [
  "Pune, Maharashtra",
  "Mumbai, Maharashtra",
  "Nagpur, Maharashtra",
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Delhi NCR",
  "Remote / All India",
];

export function DashboardTopHeader({
  role = "seeker",
  userName,
  userEmail,
  userPhoto,
  searchPlaceholder = "Search jobs, companies, or skills...",
  onSearch,
}: DashboardTopHeaderProps) {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState("Pune, Maharashtra");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const locRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locRef.current && !locRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = userName || (role === "employer" ? "Employer" : "payal");
  const displayEmail = userEmail || (role === "employer" ? "employer@company.com" : "payal@gmail.com");
  const initial = displayName.charAt(0).toUpperCase() || "P";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else if (role === "seeker") {
      navigate({ to: "/jobs", search: { q: searchQuery } as any });
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 mb-6 transition-all">
      {/* Search Input Bar (Left) */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search className="size-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-[#F1F5F9] hover:bg-[#EAEFF5] focus:bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium rounded-xl pl-10 pr-4 py-2 border border-transparent focus:border-[#0E356A]/30 focus:outline-none transition-all shadow-2xs"
          />
        </div>
      </form>

      {/* Right Controls: Location, Notifications, Profile Pill */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Location Dropdown */}
        <div className="relative hidden md:block" ref={locRef}>
          <button
            type="button"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <MapPin className="size-3.5 text-slate-400" />
            <span className="truncate max-w-[140px]">{selectedLocation}</span>
            <ChevronDown className="size-3 text-slate-400 ml-0.5" />
          </button>

          {isLocationOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Location
              </div>
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setIsLocationOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-blue-50 text-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{loc}</span>
                  {selectedLocation === loc && <Check className="size-3.5 text-[#125BB5]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="size-4.5" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="font-bold text-xs text-slate-800">Notifications</span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100/50">
                  <p className="font-bold text-slate-800 text-[11px]">Application Viewed</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">Google viewed your Frontend Developer application.</p>
                  <span className="text-[9px] text-slate-400 font-semibold mt-1 block">10m ago</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100/50">
                  <p className="font-bold text-slate-800 text-[11px]">New Matching Job</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">Infosys posted Backend Developer role in Pune.</p>
                  <span className="text-[9px] text-slate-400 font-semibold mt-1 block">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Pill Button with Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={displayName}
                className="size-7 sm:size-8 rounded-full object-cover ring-2 ring-blue-500/20"
              />
            ) : (
              <div className="size-7 sm:size-8 rounded-full bg-[#125BB5] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {initial}
              </div>
            )}
            <span className="text-xs sm:text-sm font-bold text-slate-800 hidden sm:inline-block max-w-[100px] truncate">
              {displayName}
            </span>
            <ChevronDown className="size-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-bold text-xs text-slate-800 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
              </div>

              {role === "seeker" ? (
                <>
                  <Link
                    to="/dashboard"
                    search={{ tab: "profile" } as any}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="size-3.5 text-slate-400" /> My Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    search={{ tab: "applied" } as any}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Briefcase className="size-3.5 text-slate-400" /> Applied Jobs
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Briefcase className="size-3.5 text-slate-400" /> Employer Dashboard
                  </Link>
                </>
              )}

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (role === "seeker") {
                      dataStore.logout("worker");
                    } else {
                      dataStore.logout("employer");
                    }
                    navigate({ to: "/", replace: true });
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="size-3.5 text-rose-500" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
