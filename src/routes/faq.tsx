import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HelpCircle,
  ChevronDown,
  Building2,
  HardHat,
  Briefcase,
  UserCheck,
  Search,
  MessageSquare,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions (FAQ) — REAL JOB" },
      { name: "description", content: "Find answers to all questions about finding jobs, hiring workers, account setup, and verification on REAL JOB." },
    ],
  }),
  component: FAQPage,
});

type FAQItem = {
  category: "worker" | "employer" | "job" | "account";
  questions: Record<string, string>;
  answers: Record<string, string>;
};

const faqList: FAQItem[] = [
  {
    category: "worker",
    questions: {
      en: "How do I apply for jobs on REAL JOB?",
      mr: "REAL JOB वर काम किंवा नोकरीसाठी अर्ज कसा करावा?",
      hi: "REAL JOB पर नौकरी के लिए आवेदन कैसे करें?",
      gu: "REAL JOB પર કામ માટે અરજી કેવી રીતે કરવી?",
      kn: "REAL JOB ನಲ್ಲಿ ಕೆಲಸಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?",
      te: "REAL JOB లో పనికి దరఖాస్తు చేసుకోవడం ఎలా?",
      ta: "REAL JOB-ல் வேலைக்கு விண்ணப்பிப்பது எப்படி?",
      bn: "REAL JOB-এ কাজের জন্য আবেদন কীভাবে করবেন?",
    },
    answers: {
      en: "Simply search for jobs according to your skill or location, click on 'Apply Now' or 'Direct Call', and contact the employer directly without any middleman fees.",
      mr: "तुमचे कौशल्य किंवा शहरानुसार नोकरी शोधा, 'Apply Now' किंवा 'कॉल करा' वर क्लिक करा आणि थेट मालकाशी विनामूल्य बोला.",
      hi: "अपने कौशल या शहर के अनुसार नौकरी खोजें, 'आवेदन करें' या 'सीधा कॉल करें' पर क्लिक करें और नियोक्ताओं से मुफ्त में बात करें।",
      gu: "તમારા કૌશલ્ય અથવા શહેર મુજબ કામ શોધો, 'અરજી કરો' પર ક્લિક કરો અને સીધા માલિક સાથે વાત કરો.",
      kn: "ನಿಮ್ಮ ಕೌಶಲ್ಯ ಅಥವಾ ನಗರಕ್ಕೆ ತಕ್ಕಂತೆ ಕೆಲಸ ಹುಡುಕಿ, 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' ಕ್ಲಿಕ್ ಮಾಡಿ ಮತ್ತು ಮಾಲೀಕರೊಂದಿಗೆ ನೇರವಾಗಿ ಮಾತನಾಡಿ.",
      te: "మీ నైపుణ్యం లేదా నగరం ప్రకారం పనిని వెతికి, 'అప్లై చేయండి' పై క్లిక్ చేసి యజమానితో నేరుగా మాట్లాడండి.",
      ta: "உங்கள் திறமை அல்லது நகரத்திற்கு ஏற்ப வேலை தேடி, 'விண்ணப்பிக்கவும்' கிளிக் செய்து முதலாளியிடம் நேரடியாகப் பேசுங்கள்.",
      bn: "আপনার দক্ষতা বা শহর অনুযায়ী কাজ খুঁজুন, 'আবেদন করুন' বা 'সরাসরি কল' অপশনে ক্লিক করে কথা বলুন।",
    },
  },
  {
    category: "worker",
    questions: {
      en: "Is there any registration fee for job seekers?",
      mr: "कामगारांसाठी नोंदणी शुल्क आहे का?",
      hi: "क्या कामगारों के लिए कोई पंजीकरण शुल्क है?",
      gu: "શું કારીગરો માટે કોઈ રજિસ્ટ્રેશન ફી છે?",
      kn: "ಕಾರ್ಮಿಕರಿಗೆ ಯಾವುದೇ ನೋಂದಣಿ ಶುಲ್ಕವಿದೆಯೇ?",
      te: "కార్మికులకు ఏమైనా రిజిస్ట్రేషన్ ఫీజు ఉందా?",
      ta: "தொழிலாளர்களுக்கு ஏதேனும் பதிவுக் கட்டணம் உள்ளதா?",
      bn: "কর্মীদের জন্য কোনো রেজিস্ট্রেশন ফি আছে কি?",
    },
    answers: {
      en: "No! REAL JOB is 100% free for workers and job seekers. We never charge any commission or placement fees.",
      mr: "नाही! कामगारांसाठी REAL JOB संपूर्ण मोफत आहे. आम्ही कोणतेही कमिशन किंवा फी घेत नाही.",
      hi: "नहीं! कामगारों के लिए REAL JOB 100% मुफ्त है। हम कभी कोई कमीशन या फीस नहीं लेते।",
      gu: "ના! કારીગરો માટે REAL JOB ૧૦૦% મફત છે. અમે કોઈ કમિશન લેતા નથી.",
      kn: "ಇಲ್ಲ! ಕಾರ್ಮಿಕರಿಗೆ REAL JOB ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿದೆ. ನಾವು ಯಾವುದೇ ಕಮಿಷನ್ ಪಡೆಯುವುದಿಲ್ಲ.",
      te: "లేదు! కార్మికులకు REAL JOB 100% ఉచితం. మేము ఎలాంటి కమిషన్ తీసుకోము.",
      ta: "இல்லை! தொழிலாளர்களுக்கு REAL JOB 100% இலவசம். நாங்கள் எந்த கமிஷனும் வாங்குவதில்லை.",
      bn: "না! কর্মীদের জন্য REAL JOB ১০০% বিনামূল্যে। আমরা কোনো কমিশন নেই না।",
    },
  },
  {
    category: "worker",
    questions: {
      en: "What types of jobs are available on REAL JOB?",
      mr: "कोणत्या प्रकारच्या नोकऱ्या उपलब्ध आहेत?",
      hi: "REAL JOB पर किस प्रकार की नौकरियां उपलब्ध हैं?",
      gu: "REAL JOB પર કેવા પ્રકારના કામ ઉપલબ્ધ છે?",
      kn: "REAL JOB ನಲ್ಲಿ ಯಾವ ರೀತಿಯ ಕೆಲಸಗಳು ಲಭ್ಯವಿವೆ?",
      te: "REAL JOB లో ఎలాంటి పనులు అందుబాటులో ఉన్నాయి?",
      ta: "REAL JOB-ல் என்னென்ன வகையான வேலைகள் உள்ளன?",
      bn: "REAL JOB-এ কী ধরনের কাজ পাওয়া যায়?",
    },
    answers: {
      en: "We list factory operators, construction workers, electricians, turners, CNC machine operators, drivers, welders, masons, warehouse staff, security guards, and hotel/restaurant staff.",
      mr: "कारखाना कामगार, बांधकाम कामगार, इलेक्ट्रीशियन, वेल्डर, फॅक्टरी ऑपरेटर, ड्रायव्हर, वेअरहाउस स्टाफ, सुरक्षा रक्षक व हॉटेल स्टाफच्या नोकऱ्या उपलब्ध आहेत.",
      hi: "फैक्टरी ऑपरेटर, निर्माण मजदूर, इलेक्ट्रीशियन, वेल्डर, सीएनसी ऑपरेटर, ड्राइवर, सुरक्षा गार्ड और होटल स्टाफ की नौकरियां उपलब्ध हैं।",
      gu: "ફેક્ટરી કારીગર, બાંધકામ મજૂર, ઇલેક્ટ્રિશિયન, ડ્રાઇવર અને સિક્યુરિટી ગાર્ડના કામ ઉપલબ્ધ છે.",
      kn: "ಫ್ಯಾಕ್ಟರಿ ಕಾರ್ಮಿಕರು, ನಿರ್ಮಾಣ ಕಾರ್ಮಿಕರು, ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ಚಾಲಕರು ಮತ್ತು ಸೆಕ್ಯುರಿಟಿ ಗಾರ್ಡ್ ಕೆಲಸಗಳು ಲಭ್ಯವಿವೆ.",
      te: "ఫ్యాక్టరీ కార్మికులు, బిల్డింగ్ వర్కర్లు, ఎలక్ట్రీషియన్లు, డ్రైవర్లు మరియు సెక్యూరిటీ గార్డుల పనులు అందుబాటులో ఉన్నాయి.",
      ta: "ஃபேக்டரி ஊழியர்கள், கட்டுமானத் தொழிலாளர்கள், எலக்ட்ரீஷியன்கள், டிரைவர்கள் மற்றும் செக்யூரிட்டி கார்டு வேலைகள் உள்ளன.",
      bn: "ফ্যাক্টরি শ্রমিক, নির্মাণ শ্রমিক, ইলেকট্রিশিয়ান, ড্রাইভার ও সিকিউরিটি গার্ডের কাজ পাওয়া যায়।",
    },
  },
  {
    category: "employer",
    questions: {
      en: "How can employers post a job on REAL JOB?",
      mr: "मालक किंवा कंपन्या नोकरी कशी पोस्ट करू शकतात?",
      hi: "नियोक्ता या कंपनियां नौकरी कैसे पोस्ट कर सकती हैं?",
      gu: "માલિકો કામ કેવી રીતે પોસ્ટ કરી શકે છે?",
      kn: "ಮಾಲೀಕರು ಕೆಲಸವನ್ನು ಪ್ರಕಟಿಸುವುದು ಹೇಗೆ?",
      te: "యజమానులు పనిని ఎలా పోస్ట్ చేయవచ్చు?",
      ta: "முதலாளிகள் வேலையை எவ்வாறு பதிவிடலாம்?",
      bn: "নিয়োগকর্তারা কীভাবে কাজ পোস্ট করতে পারেন?",
    },
    answers: {
      en: "Register as an Employer, go to your dashboard, click 'Post Job', fill in the job details, requirements, and salary, and publish it instantly.",
      mr: "मालक म्हणून नोंदणी करा, डॅशबोर्डवर 'Post Job' वर क्लिक करा, नोकरीची माहिती व पगार भरा आणि त्वरित पोस्ट करा.",
      hi: "नियोक्ता के रूप में पंजीकरण करें, डैशबोर्ड पर जाएं, 'नौकरी पोस्ट करें' पर क्लिक करें और विवरण भरकर प्रकाशित करें।",
      gu: "માલિક તરીકે રજિસ્ટર કરો, ડેશબોર્ડ પર 'કામ પોસ્ટ કરો' પર ક્લિક કરો અને વિગતો ભરો.",
      kn: "ಮಾಲೀಕರಾಗಿ ನೋಂದಾಯಿಸಿ, ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ 'ಕೆಲಸ ಪ್ರಕಟಿಸಿ' ಕ್ಲಿಕ್ ಮಾಡಿ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
      te: "యజమానిగా రిజిస్టర్ అవ్వండి, డాష్‌బోర్డ్‌లో 'పని పోస్ట్ చేయండి' పై క్లిక్ చేసి వివరాలు నింపండి.",
      ta: "முதலாளியாக பதிவு செய்து, டாஷ்போர்டில் 'வேலையைப் பதிவிடு' கிளிக் செய்து వివరங்களை நிரப்பவும்.",
      bn: "নিয়োগকারী হিসেবে রেজিস্টার করুন, ড্যাশবোর্ডে 'কাজ পোস্ট করুন' এ ক্লিক করে বিবরণ প্রদান করুন।",
    },
  },
  {
    category: "employer",
    questions: {
      en: "How do I search for verified workers directly?",
      mr: "मी थेट सत्यापित कामगार कसे शोधू शकतो?",
      hi: "मैं सीधे सत्यापित कामगार कैसे खोज सकता हूं?",
      gu: "હું સીધા ચકાસાયેલ કારીગરો કેવી રીતે શોધી શકું?",
      kn: "ಪರಿಶೀಲಿಸಿದ ಕಾರ್ಮಿಕರನ್ನು ನೇರವಾಗಿ ಹುಡುಕುವುದು ಹೇಗೆ?",
      te: "ధృవీకరించబడిన కార్మికులను ನೇరుగా ఎలా వెతకవచ్చు?",
      ta: "சரிபார்க்கப்பட்ட தொழிலாளர்களை நேரடியாக ఎలా தேடுவது?",
      bn: "যাচাইকৃত কর্মী কীভাবে সরাসরি খুঁজবেন?",
    },
    answers: {
      en: "Navigate to the 'Find Workers' tab, filter by skill, experience, location, and expected salary, and view verified worker profile cards to request hire.",
      mr: "'Find Workers' विभागामध्ये जाऊन कौशल्य, अनुभव आणि शहरानुसार कामगार फिल्टर करा आणि थेट फोनवर संपर्क साधा.",
      hi: "'कामगार खोजें' सेक्शन में जाएं, कौशल और शहर के अनुसार फिल्टर करें और प्रोफाइल देखकर सीधा संपर्क करें।",
      gu: "'કારીગર શોધો' વિભાગમાં જઈને કૌશલ્ય અને શહેર મુજબ ફિલ્ટર કરો અને સીધો સંપર્ક કરો.",
      kn: "'ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಿ' ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ ಕೌಶಲ್ಯ ಮತ್ತು ನಗರಕ್ಕೆ ತಕ್ಕಂತೆ ಫಿಲ್ಟರ್ ಮಾಡಿ ನೇರವಾಗಿ ಮಾತನಾಡಿ.",
      te: "'కార్మికులను వెతకండి' విభాగానికి వెళ్లి నైపుణ్యం మరియు నగరం ప్రకారం ఫిల్టర్ చేసి మాట్లాడండి.",
      ta: "'தொழிலாளர்களை தேடுங்கள்' பகுதிக்குச் சென்று திறன் மற்றும் நகரம் வாரியாகத் தேடிப் பேசுங்கள்.",
      bn: "'কর্মী খুঁজুন' বিভাগে গিয়ে দক্ষতা ও শহর অনুসারে ফিল্টার করে সরাসরি কথা বলুন।",
    },
  },
  {
    category: "account",
    questions: {
      en: "How do I change my language preferences?",
      mr: "मी भाषा बदलू शकतो का?",
      hi: "मैं भाषा कैसे बदल सकता हूं?",
      gu: "હું ભાષા કેવી રીતે બદલી શકું?",
      kn: "ನಾನು ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸುವುದು ಹೇಗೆ?",
      te: "నేను భాషను ఎలా మార్చగలను?",
      ta: "நான் மொழியை எவ்வாறு மாற்றுவது?",
      bn: "আমি কীভাবে ভাষা পরিবর্তন করব?",
    },
    answers: {
      en: "Use the language switcher dropdown in the top header menu to switch anytime between Marathi, Hindi, English, Gujarati, Kannada, Telugu, Tamil, and Bengali.",
      mr: "हेडरमधील 'Language' मेनू वापरून तुम्ही कधीही मराठी, हिंदी किंवा इंग्रजी भाषा निवडू शकता.",
      hi: "ऊपरी हेडर मेनू में 'Language' ड्रॉपडाउन का उपयोग करके आप कभी भी हिंदी, मराठी या अंग्रेजी भाषा चुन सकते हैं।",
      gu: "હેડરમાં 'Language' મેનૂનો ઉપયોગ કરીને તમે ગમે ત્યારે ભાષા બદલી શકો છો.",
      kn: "ಹೆಡರ್‌ನಲ್ಲಿರುವ 'Language' ಮೆನುವನ್ನು ಬಳಸಿ ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬಹುದು.",
      te: "హెడర్‌లోని 'Language' మెనూని ఉపయోగించి మీరు ఎప్పుడైనా భాషను మార్చవచ్చు.",
      ta: "மேலே உள்ள 'Language' மெனுவைப் பயன்படுத்தி எப்போது வேண்டுமானாலும் மொழியை மாற்றலாம்.",
      bn: "উপরের 'Language' মেনু ব্যবহার করে আপনি যেকোনো সময় ভাষা পরিবর্তন করতে পারেন।",
    },
  },
];

function FAQPage() {
  const { t, lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<"all" | "worker" | "employer" | "job" | "account">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const getQuestion = (faq: FAQItem) => faq.questions[lang] || faq.questions["mr"] || faq.questions["en"] || "";
  const getAnswer = (faq: FAQItem) => faq.answers[lang] || faq.answers["mr"] || faq.answers["en"] || "";

  const filteredFaqs = faqList.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const q = getQuestion(item).toLowerCase();
    const a = getAnswer(item).toLowerCase();
    const matchesSearch = !searchQuery || q.includes(searchQuery.toLowerCase()) || a.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#063B78]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#063B78] mb-3">
              <HelpCircle className="size-4 text-[#FFC400]" />
              {t("faqEyebrow")}
            </div>
            <h1 className="text-3xl font-black text-[#10233F] sm:text-4xl">
              {t("faqHeading")}
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#5B6B7F]">
              {t("faqSubheading")}
            </p>

            {/* Search Input */}
            <div className="mt-6 relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#5B6B7F]" />
              <Input
                type="text"
                placeholder={t("searchFaqPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 bg-white border-[#DCE5F0] rounded-xl shadow-xs text-sm font-semibold focus-visible:ring-[#FFC400]"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                selectedCategory === "all"
                  ? "bg-[#063B78] text-white shadow-md"
                  : "bg-white text-[#10233F] border border-[#DCE5F0] hover:bg-[#EBF1F8]"
              }`}
            >
              {t("allFaqs")}
            </button>
            <button
              onClick={() => setSelectedCategory("worker")}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                selectedCategory === "worker"
                  ? "bg-[#063B78] text-white shadow-md"
                  : "bg-white text-[#10233F] border border-[#DCE5F0] hover:bg-[#EBF1F8]"
              }`}
            >
              <HardHat className="size-4 text-[#FFC400]" />
              {t("workerFaqs")}
            </button>
            <button
              onClick={() => setSelectedCategory("employer")}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                selectedCategory === "employer"
                  ? "bg-[#063B78] text-white shadow-md"
                  : "bg-white text-[#10233F] border border-[#DCE5F0] hover:bg-[#EBF1F8]"
              }`}
            >
              <Building2 className="size-4 text-[#125BB5]" />
              {t("employerFaqs")}
            </button>
            <button
              onClick={() => setSelectedCategory("job")}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                selectedCategory === "job"
                  ? "bg-[#063B78] text-white shadow-md"
                  : "bg-white text-[#10233F] border border-[#DCE5F0] hover:bg-[#EBF1F8]"
              }`}
            >
              <Briefcase className="size-4 text-[#063B78]" />
              {t("jobFaqs")}
            </button>
            <button
              onClick={() => setSelectedCategory("account")}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                selectedCategory === "account"
                  ? "bg-[#063B78] text-white shadow-md"
                  : "bg-white text-[#10233F] border border-[#DCE5F0] hover:bg-[#EBF1F8]"
              }`}
            >
              <UserCheck className="size-4 text-[#FFC400]" />
              {t("accountFaqs")}
            </button>
          </div>

          {/* Accordion list */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                const questionText = getQuestion(faq);
                const answerText = getAnswer(faq);
                return (
                  <div
                    key={index}
                    className="card-realjob overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-[#10233F] hover:text-[#063B78]"
                    >
                      <span className="text-base font-black block">{questionText}</span>
                      <ChevronDown
                        className={`size-5 text-[#063B78] shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-[#DCE5F0] bg-[#F5F8FC]">
                        <p className="text-sm font-bold text-[#082F63] leading-relaxed">
                          {answerText}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="card-realjob p-12 text-center">
                <HelpCircle className="mx-auto size-12 text-[#5B6B7F] mb-3" />
                <h3 className="text-lg font-black text-[#10233F]">{t("noFaqFound")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                  {t("noFaqFoundSub")}
                </p>
              </div>
            )}
          </div>

          {/* Still Have Questions? Card */}
          <div className="mt-12 card-realjob p-8 bg-hero-overlay text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#FFC400] font-black text-xs uppercase tracking-wider mb-1">
                <MessageSquare className="size-4" /> {t("needSupportEyebrow")}
              </div>
              <h3 className="text-2xl font-black text-white">{t("stillHaveQuestions")}</h3>
              <p className="text-xs text-white/90 font-medium mt-1">
                {t("supportTeamReady")}
              </p>
            </div>
            <Button asChild className="btn-yellow font-extrabold text-sm px-6 py-3 shrink-0">
              <Link to="/contact">{t("contactUsBtn")}</Link>
            </Button>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
