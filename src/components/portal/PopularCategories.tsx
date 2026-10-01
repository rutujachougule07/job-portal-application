import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Compass,
  Factory,
  FlaskConical,
  GraduationCap,
  HardHat,
  Headphones,
  Hotel,
  Landmark,
  Laptop,
  Palette,
  Radio,
  Scale,
  ShoppingBag,
  Sprout,
  Stethoscope,
  TrendingUp,
  Truck,
  UserPlus,
  Wrench,
} from "lucide-react";
import { useI18n, getCategoryTitle, getCategoryDesc } from "@/lib/i18n";
import { dataStore } from "@/lib/data-store";

export function PopularCategories() {
  const { t, n, lang } = useI18n();

  const allJobs = dataStore.getAllJobs();

  const getCategoryJobCount = (catId: string) => {
    return allJobs.filter((j) => {
      const cat = (j.category || "").toLowerCase();
      const title = (j.title || "").toLowerCase();
      const query = catId.toLowerCase();
      if (cat.includes(query)) return true;
      if (catId === "construction") return cat.includes("construction") || cat.includes("building") || title.includes("construction") || title.includes("civil");
      if (catId === "it-software") return cat.includes("it") || cat.includes("software") || title.includes("developer") || title.includes("software");
      if (catId === "engineering") return cat.includes("engineering") || cat.includes("technical") || title.includes("engineer");
      if (catId === "healthcare-medical") return cat.includes("health") || cat.includes("medical") || cat.includes("nursing");
      if (catId === "finance-accounting") return cat.includes("finance") || cat.includes("accounting") || cat.includes("account");
      if (catId === "sales-marketing") return cat.includes("sales") || cat.includes("marketing");
      if (catId === "education") return cat.includes("education") || cat.includes("teaching");
      if (catId === "manufacturing") return cat.includes("manufacturing") || cat.includes("industrial") || cat.includes("factory") || title.includes("operator") || title.includes("mfg");
      return false;
    }).length;
  };

  const realJobCategories = [
    { id: "construction", icon: HardHat },
    { id: "it-software", icon: Laptop },
    { id: "engineering", icon: Wrench },
    { id: "healthcare-medical", icon: Stethoscope },
    { id: "finance-accounting", icon: Landmark },
    { id: "sales-marketing", icon: TrendingUp },
    { id: "education", icon: GraduationCap },
    { id: "manufacturing", icon: Factory },
  ];

  return (
    <section id="categories" className="relative bg-[#F5F8FC] py-16 sm:py-24 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full mb-12">
          <div className="flex flex-col items-start text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#063B78]/20 bg-[#063B78]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#063B78]">
              <span className="h-2 w-2 rounded-full bg-[#FFC400]" />
              {t("popularCategoriesEyebrow")}
            </div>

            <h2 className="mt-3 text-3xl font-black text-[#10233F] sm:text-4xl">
              {t("popularCategories")}
            </h2>

            <p className="mt-3 text-base font-semibold text-[#5B6B7F]">
              {t("popularCategoriesSubtitle")}
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-lg bg-[#063B78] px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#082F63] hover:shadow-lg"
          >
            <span>{t("viewAll")} ({n(allJobs.length)})</span>
            <ArrowRight className="size-4 text-[#FFC400]" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {realJobCategories.slice(0, 8).map((cat) => {
            const IconComponent = cat.icon;
            const categoryTitle = getCategoryTitle(cat.id, lang);
            const categoryDesc = getCategoryDesc(cat.id, lang);
            return (
              <Link
                key={cat.id}
                to="/jobs"
                search={{ category: cat.id }}
                className="group card-realjob p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 rounded-xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center group-hover:bg-[#FFC400] group-hover:text-[#082F63] transition-colors">
                      <IconComponent className="size-6" />
                    </div>
                    <span className="text-xs font-black bg-[#EBF1F8] text-[#063B78] px-2.5 py-1 rounded-full group-hover:bg-[#063B78] group-hover:text-white transition-colors">
                      {n(getCategoryJobCount(cat.id))} {t("jobsCountText")}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#10233F] group-hover:text-[#063B78] transition-colors">
                    {categoryTitle}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-[#5B6B7F] line-clamp-2">
                    {categoryDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DCE5F0] flex items-center justify-between text-xs font-bold text-[#063B78] group-hover:text-[#125BB5]">
                  <span>{t("apply")}</span>
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
