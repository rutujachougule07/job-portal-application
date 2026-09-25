import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Briefcase,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  UserCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { WorkerCard, workersList, Worker } from "@/components/portal/WorkerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/workers/")({
  head: () => ({
    meta: [
      { title: "Find Verified Workers & Skilled Labor — REAL JOB" },
      { name: "description", content: "Hire skilled & semi-skilled workers, electricians, technicians, welders, CNC operators & drivers across Maharashtra and India." },
    ],
  }),
  component: WorkersListingPage,
});

export function WorkersListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [minExp, setMinExp] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "exp" | "salary">("rating");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter logic
  const filteredWorkers = useMemo(() => {
    return workersList.filter((worker) => {
      const matchesSearch =
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.marathiProfession.includes(searchQuery) ||
        worker.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation =
        !locationFilter || worker.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesProfession =
        professionFilter === "all" || worker.profession.toLowerCase().includes(professionFilter.toLowerCase());

      const matchesAvailability =
        availabilityFilter === "all" || worker.availability === availabilityFilter;

      const expNum = parseInt(worker.experience) || 0;
      const matchesExp = expNum >= minExp;

      return matchesSearch && matchesLocation && matchesProfession && matchesAvailability && matchesExp;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "exp") return (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0);
      return 0;
    });
  }, [searchQuery, locationFilter, professionFilter, availabilityFilter, minExp, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setProfessionFilter("all");
    setAvailabilityFilter("all");
    setMinExp(0);
    setSortBy("rating");
  };

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header & Title Banner */}
          <div className="bg-hero-overlay p-8 rounded-2xl text-white mb-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur mb-3">
                <Users className="size-3.5" />
                कामगार शोधा • Find Workers
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white">
                महाराष्ट्रातील सत्यापित कामगार <br />
                <span className="text-[#FFC400]">कुशल व अकुशल कामगारांची यादी</span>
              </h1>

              <p className="mt-2 text-sm text-white/90 font-medium">
                इलेक्ट्रीशियन, फॅक्टरी ऑपरेटर, ड्रायव्हर, वेल्डर आणि कन्स्ट्रक्शन सुपरवायझर थेट कामावर घ्या.
              </p>

              {/* Inline Search Bar */}
              <div className="mt-6 grid sm:grid-cols-[1fr_0.8fr_auto] gap-3 bg-white p-2.5 rounded-xl shadow-md border border-[#DCE5F0]">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 size-4 text-[#5B6B7F]" />
                  <Input
                    placeholder="कौशल्य किंवा व्यवसाय प्रविष्ट करा (Skill / Profession)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-11 border-0 bg-transparent text-xs text-[#10233F] font-bold focus-visible:ring-0"
                  />
                </div>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 size-4 text-[#125BB5]" />
                  <Input
                    placeholder="शहर / ठिकाण (City / Location)"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-9 h-11 border-0 bg-transparent text-xs text-[#10233F] font-bold focus-visible:ring-0"
                  />
                </div>
                <Button className="btn-yellow h-11 font-black text-xs px-6">
                  शोधा (Search)
                </Button>
              </div>
            </div>
          </div>

          {/* Main Layout: Sidebar Filters + Workers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-[#DCE5F0] mb-5">
                <span className="font-black text-sm text-[#10233F] flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-[#063B78]" />
                  फिल्टर्स (Filters)
                </span>
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-[#125BB5] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="size-3" /> रीसेट (Clear)
                </button>
              </div>

              {/* Filter: Profession */}
              <div className="mb-6">
                <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase tracking-wider">
                  व्यवसाय (Profession)
                </label>
                <select
                  value={professionFilter}
                  onChange={(e) => setProfessionFilter(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                >
                  <option value="all">सर्व व्यवसाय (All Professions)</option>
                  <option value="electrician">Electrician (इलेक्ट्रीशियन)</option>
                  <option value="cnc">CNC Operator (ऑपरेटर)</option>
                  <option value="driver">Driver (ड्रायव्हर)</option>
                  <option value="welder">Welder (वेल्डर)</option>
                  <option value="mason">Mason (गवंडी)</option>
                  <option value="plumber">Plumber (प्लंबर)</option>
                </select>
              </div>

              {/* Filter: Availability */}
              <div className="mb-6">
                <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase tracking-wider">
                  उपलब्धता (Availability)
                </label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                >
                  <option value="all">सर्व (All Status)</option>
                  <option value="Available Now">Available Now (सध्या उपलब्ध)</option>
                  <option value="Immediate">Immediate (त्वरित)</option>
                  <option value="1 Week Notice">1 Week Notice</option>
                </select>
              </div>

              {/* Filter: Min Experience */}
              <div className="mb-6">
                <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase tracking-wider">
                  किमान अनुभव (Min Exp): {minExp} Years
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={minExp}
                  onChange={(e) => setMinExp(Number(e.target.value))}
                  className="w-full accent-[#063B78]"
                />
                <div className="flex justify-between text-[10px] font-bold text-[#5B6B7F] mt-1">
                  <span>0 Yr</span>
                  <span>5 Yrs</span>
                  <span>10+ Yrs</span>
                </div>
              </div>

              {/* Verification Info Badge */}
              <div className="p-3.5 bg-[#EBF1F8] rounded-xl border border-[#063B78]/20 flex items-start gap-3">
                <BadgeCheck className="size-5 text-[#FFC400] fill-[#063B78] shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-[#063B78] leading-tight">
                  सर्व कामगारांचे आधार व अनुभव पत्रक पडताळलेले आहे.
                </p>
              </div>
            </aside>

            {/* Main Listing View */}
            <div>
              {/* Toolbar: Count & Sort & Mobile Filter Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#DCE5F0] mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#10233F]">
                    एकूण कामगार: <span className="text-[#063B78]">{filteredWorkers.length}</span>
                  </span>
                  {searchQuery && (
                    <Badge variant="secondary" className="text-xs font-bold bg-[#EBF1F8] text-[#063B78]">
                      "{searchQuery}"
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden text-xs font-bold border-[#063B78] text-[#063B78]"
                    onClick={() => setMobileFilterOpen(true)}
                  >
                    <Filter className="size-3.5 mr-1" /> फिल्टर्स
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#5B6B7F] shrink-0">क्रमवारी:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="h-9 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold text-[#10233F]"
                    >
                      <option value="rating">सर्वोच्च रेटिंग (Highest Rated)</option>
                      <option value="exp">जास्त अनुभव (Most Experienced)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Worker Cards Grid */}
              {filteredWorkers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredWorkers.map((worker) => (
                    <WorkerCard key={worker.id} worker={worker} />
                  ))}
                </div>
              ) : (
                <div className="card-realjob p-12 text-center bg-white">
                  <Users className="mx-auto size-14 text-[#5B6B7F] mb-4" />
                  <h3 className="text-xl font-black text-[#10233F]">कोणताही कामगार सापडला नाही</h3>
                  <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                    कृपया शोध शब्द किंवा फिल्टर्स बदलून पुन्हा प्रयत्न करा.
                  </p>
                  <Button onClick={clearFilters} className="mt-5 btn-yellow text-xs font-bold px-6">
                    सर्व फिल्टर्स रीसेट करा
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal/Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-[#082F63]/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#DCE5F0] mb-6">
                  <span className="font-black text-base text-[#10233F]">फिल्टर्स (Filters)</span>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#5B6B7F]">
                    <X className="size-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">व्यवसाय</label>
                    <select
                      value={professionFilter}
                      onChange={(e) => setProfessionFilter(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold"
                    >
                      <option value="all">सर्व व्यवसाय</option>
                      <option value="electrician">Electrician</option>
                      <option value="cnc">CNC Operator</option>
                      <option value="driver">Driver</option>
                      <option value="welder">Welder</option>
                      <option value="mason">Mason</option>
                      <option value="plumber">Plumber</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-2 uppercase">उपलब्धता</label>
                    <select
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[#DCE5F0] bg-[#F5F8FC] px-3 text-xs font-bold"
                    >
                      <option value="all">सर्व स्टेटस</option>
                      <option value="Available Now">Available Now</option>
                      <option value="Immediate">Immediate</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#DCE5F0] grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={clearFilters} className="text-xs font-bold">
                  रीसेट
                </Button>
                <Button onClick={() => setMobileFilterOpen(false)} className="btn-yellow text-xs font-extrabold">
                  लागू करा
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <PublicFooter />
    </>
  );
}
