import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building,
  Factory,
  HardHat,
  Headphones,
  Hotel,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  UserCheck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Job Categories — REAL JOB | Find Work | Find Workers" },
      { name: "description", content: "Explore all worker and job categories on REAL JOB — Factory, Construction, Drivers, Electricians, Technicians & Security." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      id: "factory-workers",
      title: "Factory Workers",
      marathiTitle: "कारखाना कामगार",
      jobsCount: "2,480",
      icon: Factory,
      description: "Machine operators, assembly line staff, technicians & factory labor.",
    },
    {
      id: "construction-workers",
      title: "Construction Workers",
      marathiTitle: "बांधकाम कामगार",
      jobsCount: "1,950",
      icon: HardHat,
      description: "Masons, carpenters, steel fixers, painters & site labor.",
    },
    {
      id: "technical-staff",
      title: "Technical Staff",
      marathiTitle: "तांत्रिक कर्मचारी",
      jobsCount: "1,420",
      icon: Wrench,
      description: "CNC machine operators, ITI technicians & plant supervisors.",
    },
    {
      id: "logistics-drivers",
      title: "Logistics & Drivers",
      marathiTitle: "लॉजिस्टिक्स आणि ड्रायव्हर",
      jobsCount: "1,830",
      icon: Truck,
      description: "Heavy truck drivers, delivery staff & forklift operators.",
    },
    {
      id: "skilled-workers",
      title: "Skilled Workers",
      marathiTitle: "कुशल कामगार",
      jobsCount: "3,110",
      icon: UserCheck,
      description: "ARC/TIG welders, fitters, turners & certified craftsmen.",
    },
    {
      id: "unskilled-workers",
      title: "Unskilled Workers",
      marathiTitle: "अकुशल कामगार",
      jobsCount: "2,940",
      icon: Users,
      description: "General labor, loading/unloading, field helpers & site workers.",
    },
    {
      id: "helpers",
      title: "Helpers & Attendants",
      marathiTitle: "हेल्पर्स / मदतनीस",
      jobsCount: "2,150",
      icon: Headphones,
      description: "Office boys, shop assistants, utility helpers & attendants.",
    },
    {
      id: "electricians",
      title: "Electricians",
      marathiTitle: "इलेक्ट्रीशियन",
      jobsCount: "980",
      icon: Zap,
      description: "Industrial wiring, domestic electricians, solar & panel maintenance.",
    },
    {
      id: "maintenance",
      title: "Maintenance Staff",
      marathiTitle: "मेंटेनन्स / दुरुस्ती",
      jobsCount: "1,120",
      icon: Building,
      description: "Plumbers, AC technicians, building maintenance & mechanics.",
    },
    {
      id: "warehouse-workers",
      title: "Warehouse Workers",
      marathiTitle: "वेअरहाउस कामगार",
      jobsCount: "1,640",
      icon: PackageCheck,
      description: "Pickers, packers, inventory keepers, sorters & loaders.",
    },
    {
      id: "hotel-restaurant",
      title: "Hotel & Restaurant",
      marathiTitle: "हॉटेल व रेस्टॉरंट स्टाफ",
      jobsCount: "1,290",
      icon: Hotel,
      description: "Cooks, chefs, waiters, stewards & housekeepers.",
    },
    {
      id: "security",
      title: "Security Guards",
      marathiTitle: "सुरक्षा रक्षक",
      jobsCount: "1,530",
      icon: ShieldCheck,
      description: "Industrial security guards, supervisors, bouncers & watchmen.",
    },
  ];

  const filtered = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.marathiTitle.includes(searchTerm) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="bg-hero-overlay p-8 sm:p-12 rounded-2xl text-white mb-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur mb-3">
                <Sparkles className="size-3.5" />
                कामगार व नोकरी श्रेणी • Categories
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white">
                सर्व प्रमुख कामगार श्रेणी <br />
                <span className="text-[#FFC400]">योग्य कामाची निवड करा</span>
              </h1>

              <p className="mt-3 text-sm sm:text-base font-medium text-white/90">
                महाराष्ट्रातील कारखाने, बांधकाम व सेवा क्षेत्रातील सर्व 12+ कामगार श्रेणी पहा.
              </p>

              {/* Search Bar */}
              <div className="mt-6 relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#5B6B7F]" />
                <Input
                  type="text"
                  placeholder="श्रेणी शोधा... (Search category by name)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 pl-12 bg-white border-0 text-xs font-bold text-[#10233F] rounded-xl shadow-md focus-visible:ring-[#FFC400]"
                />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to="/jobs"
                  search={{ category: cat.title }}
                  className="card-realjob p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 rounded-xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center group-hover:bg-[#FFC400] group-hover:text-[#082F63] transition-colors">
                        <Icon className="size-6" />
                      </div>
                      <span className="text-xs font-black bg-[#EBF1F8] text-[#063B78] px-2.5 py-1 rounded-full group-hover:bg-[#063B78] group-hover:text-white transition-colors">
                        {cat.jobsCount} नोकऱ्या
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-[#10233F] group-hover:text-[#063B78] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs font-extrabold text-[#125BB5] mt-0.5">
                      {cat.marathiTitle}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-[#5B6B7F] leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#DCE5F0] flex items-center justify-between text-xs font-bold text-[#063B78] group-hover:text-[#125BB5]">
                    <span>नोकऱ्या पहा (Browse Jobs)</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
