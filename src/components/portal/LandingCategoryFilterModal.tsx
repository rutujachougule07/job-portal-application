import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  SlidersHorizontal,
  X,
  Check,
  Briefcase,
  HardHat,
  Wrench,
  Truck,
  Zap,
  Building2,
  Shield,
  UserCheck,
  Factory,
  ChevronRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { languages, useI18n, type LanguageCode } from "@/lib/i18n";
import { toast } from "sonner";

export const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  construction: {
    mr: "बांधकाम (Construction)",
    en: "Construction",
    hi: "निर्माण कार्य (Construction)",
    gu: "બાંધકામ (Construction)",
    kn: "ಕಟ್ಟಡ ನಿರ್ಮಾಣ (Construction)",
    te: "నిర్మాణ రంగం (Construction)",
    ta: "கட்டுமானம் (Construction)",
    bn: "নির্মাণ কাজ (Construction)",
  },
  technical: {
    mr: "तांत्रिक कर्मचारी (Technical)",
    en: "Technical Staff",
    hi: "तकनीकी कर्मचारी (Technical Staff)",
    gu: "ટેકનિકલ સ્ટાફ (Technical Staff)",
    kn: "ತಾಂತ್ರಿಕ ಸಿಬ್ಬಂದಿ (Technical Staff)",
    te: "సాంకేతిక సిబ్బంది (Technical Staff)",
    ta: "தொழில்நுட்ப பணியாளர்கள் (Technical)",
    bn: "প্রযুক্তিগত কর্মী (Technical Staff)",
  },
  logistics: {
    mr: "वाहतूक आणि लॉजिस्टिक्स (Logistics)",
    en: "Transport & Logistics",
    hi: "परिवहन और रसद (Logistics)",
    gu: "પરિવહન અને લોજિસ્ટિક્સ (Logistics)",
    kn: "ಸಾರಿಗೆ ಮತ್ತು ಲಾಜಿಸ್ಟಿಕ್ಸ್ (Logistics)",
    te: "రవాణా & లాజిస్టిక్స్ (Logistics)",
    ta: "போக்குவரத்து & தளவாடங்கள் (Logistics)",
    bn: "পরিবহন ও লজিস্টিকস (Logistics)",
  },
  electrician: {
    mr: "इलेक्ट्रिशियन (Electrician)",
    en: "Electrician",
    hi: "इलेक्ट्रीशियन (Electrician)",
    gu: "ઇલેક્ટ્રિશિયન (Electrician)",
    kn: "ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ (Electrician)",
    te: "ఎలక్ట్రీషియన్ (Electrician)",
    ta: "எலக்ட்ரீஷியன் (Electrician)",
    bn: "ইলেকট্রিশিয়ান (Electrician)",
  },
  office: {
    mr: "कार्यालयीन कर्मचारी (Office Staff)",
    en: "Office Staff",
    hi: "कार्यालय स्टाफ (Office Staff)",
    gu: "ઓફિસ સ્ટાફ (Office Staff)",
    kn: "ಕಚೇರಿ ಸಿಬ್ಬಂದಿ (Office Staff)",
    te: "కార్యాలయ సిబ్బంది (Office Staff)",
    ta: "அலுவலக பணியாளர்கள் (Office Staff)",
    bn: "অফিস কর্মী (Office Staff)",
  },
  factory: {
    mr: "कारखाना कामगार (Factory Worker)",
    en: "Factory Worker",
    hi: "फैक्ट्री कर्मचारी (Factory Worker)",
    gu: "ફેક્ટરી વર્કર (Factory Worker)",
    kn: "ಕಾರ್ಖಾನೆ ಕೆಲಸಗಾರ (Factory Worker)",
    te: "ఫ్యాక్టరీ కార్మికుడు (Factory Worker)",
    ta: "தொழிற்சாலை பணியாளர் (Factory)",
    bn: "কারখানার শ্রমিক (Factory Worker)",
  },
  security: {
    mr: "सुरक्षा रक्षक (Security Guard)",
    en: "Security Guard",
    hi: "सुरक्षा गार्ड (Security Guard)",
    gu: "સિક્યુરિટી ગાર્ડ (Security Guard)",
    kn: "ಭದ್ರತಾ ಸಿಬ್ಬಂದಿ (Security Guard)",
    te: "సెక్యూరిటీ గార్డు (Security Guard)",
    ta: "பாதுகாப்பு காவலர் (Security Guard)",
    bn: "নিরাপত্তা প্রহরী (Security Guard)",
  },
  driver: {
    mr: "ड्रायव्हर / चालक (Driver)",
    en: "Driver",
    hi: "चालक / ड्राइवर (Driver)",
    gu: "ડ્રાઈવર (Driver)",
    kn: "ಚಾಲಕ (Driver)",
    te: "డ్రైవర్ (Driver)",
    ta: "ஓட்டுநர் (Driver)",
    bn: "চালক / ড্রাইভার (Driver)",
  },
};

const CATEGORIES_LIST = [
  {
    id: "construction",
    icon: HardHat,
    jobsCount: "1.5K+ Jobs",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: "technical",
    icon: Wrench,
    jobsCount: "2.8K+ Jobs",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "logistics",
    icon: Truck,
    jobsCount: "1.9K+ Jobs",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: "electrician",
    icon: Zap,
    jobsCount: "1.1K+ Jobs",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "office",
    icon: Briefcase,
    jobsCount: "2.4K+ Jobs",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
  {
    id: "factory",
    icon: Factory,
    jobsCount: "3.2K+ Jobs",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    id: "security",
    icon: Shield,
    jobsCount: "1.7K+ Jobs",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  {
    id: "driver",
    icon: UserCheck,
    jobsCount: "2.1K+ Jobs",
    color: "bg-teal-100 text-teal-700 border-teal-200",
  },
];

export function LandingCategoryFilterModal() {
  const { lang, setLang } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [filterLang, setFilterLang] = useState<LanguageCode>(lang || "mr");

  const handleSelectLanguage = (code: LanguageCode) => {
    setFilterLang(code);
    setLang(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("realjob-language", code);
      window.dispatchEvent(new Event("realjob-auth-change"));
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setOpen(false);
    const catName = CATEGORY_TRANSLATIONS[categoryId]?.[filterLang] || categoryId;
    toast.info(
      filterLang === "mr"
        ? `सर्व माहिती पाहण्यासाठी कृपया लॉगिन करा (${catName})`
        : `Please login to view all information for ${catName}`
    );
    navigate({
      to: "/auth",
      search: { mode: "login", role: "worker" },
    });
  };

  return (
    <>
      {/* TRIGGER BUTTON (Placed in top-right header corner) */}
      <button
        type="button"
        onClick={() => {
          setFilterLang(lang || "mr");
          setOpen(true);
        }}
        className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/95 hover:bg-white text-[#0A3B7B] font-extrabold text-xs shadow-md border border-[#B8D3F2]/80 hover:shadow-lg hover:border-[#0A3B7B] transition-all cursor-pointer group active:scale-95"
        title="Filter Language & Job Categories"
      >
        <SlidersHorizontal className="size-3.5 sm:size-4 text-[#0A3B7B] group-hover:rotate-180 transition-transform duration-300" />
        <span className="font-extrabold tracking-wide">Filter</span>
      </button>

      {/* FILTER MODAL */}
      {open && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[92vh] z-10 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-gray-100 bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-[#0A3B7B] text-white flex items-center justify-center shadow-xs">
                  <SlidersHorizontal className="size-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#0A3B7B] leading-tight">
                    {filterLang === "mr" ? "भाषा आणि श्रेणी फिल्टर" : "Language & Category Filter"}
                  </h2>
                  <p className="text-[11px] sm:text-xs font-semibold text-gray-500">
                    {filterLang === "mr"
                      ? "भाषा निवडा आणि त्या भाषेतील सर्व उपलब्ध नोकरी श्रेणी पहा"
                      : "Select language to browse categories in your preferred language"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close filter"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 sm:p-7 space-y-6 overflow-y-auto">
              {/* STEP 1: SELECT LANGUAGE */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0A3B7B] flex items-center gap-1.5">
                    <span className="size-5 rounded-full bg-[#EBF1F8] text-[#0A3B7B] flex items-center justify-center text-[10px]">
                      1
                    </span>
                    {filterLang === "mr" ? "भाषा निवडा (Select Language)" : "Choose Language"}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">
                    {languages.length} Languages
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 notranslate">
                  {languages.map((item) => {
                    const active = filterLang === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleSelectLanguage(item.code)}
                        className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer ${
                          active
                            ? "border-[#0A3B7B] bg-[#EBF1F8] shadow-sm scale-[1.02] ring-2 ring-[#0A3B7B]/20"
                            : "border-gray-200 bg-gray-50/70 hover:bg-white hover:border-[#0A3B7B]/40"
                        }`}
                      >
                        {active && (
                          <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-[#0A3B7B] text-white flex items-center justify-center">
                            <Check className="size-2.5 stroke-[3]" />
                          </div>
                        )}
                        <span className={`text-sm sm:text-base font-black ${active ? "text-[#0A3B7B]" : "text-gray-900"}`}>
                          {item.native}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: CATEGORIES IN SELECTED LANGUAGE */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0A3B7B] flex items-center gap-1.5">
                    <span className="size-5 rounded-full bg-[#EBF1F8] text-[#0A3B7B] flex items-center justify-center text-[10px]">
                      2
                    </span>
                    {filterLang === "mr" ? "उपलब्ध नोकरी श्रेणी (Available Categories)" : "Available Job Categories"}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="size-2.5" />
                    {filterLang === "mr" ? "माहितीसाठी लॉगिन करा" : "Login to view all info"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CATEGORIES_LIST.map((cat) => {
                    const IconComponent = cat.icon;
                    const translatedName = CATEGORY_TRANSLATIONS[cat.id]?.[filterLang] || cat.id;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="group flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-white hover:border-[#0A3B7B] hover:shadow-md hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <div className={`size-10 rounded-xl border flex items-center justify-center shrink-0 ${cat.color} group-hover:scale-105 transition-transform`}>
                            <IconComponent className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-xs sm:text-sm text-gray-900 group-hover:text-[#0A3B7B] transition-colors truncate">
                              {translatedName}
                            </h4>
                            <span className="text-[10px] font-bold text-gray-400 block mt-0.5">
                              {cat.jobsCount}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#0A3B7B] shrink-0 group-hover:translate-x-1 transition-transform">
                          <span className="hidden sm:inline">
                            {filterLang === "mr" ? "माहिती पहा" : "View Info"}
                          </span>
                          <ChevronRight className="size-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-7 py-3 border-t border-gray-100 bg-[#F8FAFC] flex items-center justify-between text-[11px] font-bold text-gray-500">
              <span className="flex items-center gap-1">
                <Sparkles className="size-3.5 text-amber-500" />
                {filterLang === "mr"
                  ? "श्रेणीवर क्लिक केल्यावर सर्व माहिती पाहण्यासाठी थेट लॉगिन पेज उघडेल."
                  : "Clicking any category directly opens the login page to view complete information."}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-black text-[#0A3B7B] hover:underline cursor-pointer"
              >
                {filterLang === "mr" ? "बंद करा" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
