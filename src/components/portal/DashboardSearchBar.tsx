import { useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface DashboardSearchBarProps {
  role?: "seeker" | "employer";
  defaultLocation?: string;
  onSearch?: (title: string, location: string) => void;
}

const LOCATIONS = [
  "Pune, Maharashtra",
  "Mumbai, Maharashtra",
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Delhi NCR",
  "Remote",
];

export function DashboardSearchBar({
  role = "seeker",
  defaultLocation = "Pune, Maharashtra",
  onSearch,
}: DashboardSearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(defaultLocation);
  const [showLocationList, setShowLocationList] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query, location);
    } else if (role === "seeker") {
      navigate({
        to: "/jobs",
        search: { q: query, location: location !== "Remote" ? location : undefined } as any,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-2 sm:p-2.5 transition-all">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
        {/* Left Search Input */}
        <div className="flex-1 flex items-center gap-3 px-3 sm:px-4 w-full h-11">
          <Search className="size-4.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              role === "employer"
                ? "Search candidate name, role, or skills..."
                : "Job title, skills, or company"
            }
            className="w-full bg-transparent border-none focus:outline-none text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Vertical divider on desktop */}
        <div className="hidden sm:block w-px h-7 bg-slate-200 mx-1"></div>

        {/* Location Dropdown selector */}
        <div className="relative w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowLocationList(!showLocationList)}
            className="flex items-center gap-2 px-3 sm:px-4 h-11 w-full sm:w-[220px] rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer"
          >
            <MapPin className="size-4 text-slate-400 shrink-0" />
            <span className="flex-1 text-xs sm:text-sm font-bold text-slate-800 truncate">
              {location}
            </span>
            <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
          </button>

          {showLocationList && (
            <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-full sm:w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setLocation(loc);
                    setShowLocationList(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-blue-50 transition-colors cursor-pointer ${
                    location === loc ? "text-[#125BB5] bg-blue-50/50" : "text-slate-700"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navy Search Button */}
        <button
          type="submit"
          className="w-full sm:w-auto h-11 px-6 sm:px-8 rounded-xl bg-[#051B38] hover:bg-[#092B57] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Search className="size-4" />
          <span>{role === "employer" ? "Search Candidates" : "Search Jobs"}</span>
        </button>
      </form>
    </div>
  );
}
