import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building,
  Factory,
  HardHat,
  Headphones,
  Hotel,
  PackageCheck,
  ShieldCheck,
  Truck,
  UserCheck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function PopularCategories() {
  const { t } = useI18n();

  const realJobCategories = [
    {
      id: "factory-workers",
      title: "Factory Workers",
      marathiTitle: "कारखाना कामगार",
      jobsCount: "2,480",
      icon: Factory,
      description: "Machine operators, assembly line, helpers & technicians.",
    },
    {
      id: "construction-workers",
      title: "Construction Workers",
      marathiTitle: "बांधकाम कामगार",
      jobsCount: "1,950",
      icon: HardHat,
      description: "Masons, carpenters, steel fixers & site labor.",
    },
    {
      id: "technical-staff",
      title: "Technical Staff",
      marathiTitle: "तांत्रिक कर्मचारी",
      jobsCount: "1,420",
      icon: Wrench,
      description: "CNC operators, ITI technicians & supervisors.",
    },
    {
      id: "logistics-drivers",
      title: "Logistics & Drivers",
      marathiTitle: "लॉजिस्टिक्स आणि ड्रायव्हर",
      jobsCount: "1,830",
      icon: Truck,
      description: "Heavy drivers, delivery staff, forklift operators.",
    },
    {
      id: "skilled-workers",
      title: "Skilled Workers",
      marathiTitle: "कुशल कामगार",
      jobsCount: "3,110",
      icon: UserCheck,
      description: "Welders, fitters, turners & certified craftsmen.",
    },
    {
      id: "unskilled-workers",
      title: "Unskilled Workers",
      marathiTitle: "अकुशल कामगार",
      jobsCount: "2,940",
      icon: Users,
      description: "General labor, loading/unloading & field staff.",
    },
    {
      id: "helpers",
      title: "Helpers & Attendants",
      marathiTitle: "हेल्पर्स / मदतनीस",
      jobsCount: "2,150",
      icon: Headphones,
      description: "Office boys, shop assistants, utility helpers.",
    },
    {
      id: "electricians",
      title: "Electricians",
      marathiTitle: "इलेक्ट्रीशियन",
      jobsCount: "980",
      icon: Zap,
      description: "Industrial, domestic & panel wiring electricians.",
    },
    {
      id: "maintenance",
      title: "Maintenance Staff",
      marathiTitle: "मेंटेनन्स / दुरुस्ती",
      jobsCount: "1,120",
      icon: Building,
      description: "Plumbers, AC technicians, plant maintenance.",
    },
    {
      id: "warehouse-workers",
      title: "Warehouse Workers",
      marathiTitle: "वेअरहाउस कामगार",
      jobsCount: "1,640",
      icon: PackageCheck,
      description: "Pickers, packers, inventory keepers & sorters.",
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
      description: "Security supervisors, bouncers & gate guards.",
    },
  ];

  return (
    <section id="categories" className="relative bg-[#F5F8FC] py-16 sm:py-24 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full mb-12">
          <div className="flex flex-col items-start text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#063B78]/20 bg-[#063B78]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#063B78]">
              <span className="h-2 w-2 rounded-full bg-[#FFC400]" />
              कामगार व नोकरी श्रेणी
            </div>

            <h2 className="mt-3 text-3xl font-black text-[#10233F] sm:text-4xl">
              लोकप्रिय <span className="text-[#063B78]">कामगार श्रेणी</span>
            </h2>

            <p className="mt-3 text-base font-semibold text-[#5B6B7F]">
              महाराष्ट्रातील व भारतातील सर्व प्रमुख कारखाने, बांधकाम व सेवा क्षेत्रातील कामगार शोधा किंवा नोकरी मिळवा.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-lg bg-[#063B78] px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#082F63] hover:shadow-lg"
          >
            <span>सर्व श्रेणी पहा ({realJobCategories.length})</span>
            <ArrowRight className="size-4 text-[#FFC400]" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {realJobCategories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.id}
                to="/jobs"
                search={{ category: cat.title }}
                className="group card-realjob p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 rounded-xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center group-hover:bg-[#FFC400] group-hover:text-[#082F63] transition-colors">
                      <IconComponent className="size-6" />
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
                  <p className="mt-2 text-xs font-semibold text-[#5B6B7F] line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DCE5F0] flex items-center justify-between text-xs font-bold text-[#063B78] group-hover:text-[#125BB5]">
                  <span>शोधा & Apply</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
