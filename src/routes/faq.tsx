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
  question: string;
  marathiQuestion: string;
  answer: string;
  marathiAnswer: string;
  category: "worker" | "employer" | "job" | "account";
};

const faqList: FAQItem[] = [
  {
    category: "worker",
    question: "How do I apply for jobs on REAL JOB?",
    marathiQuestion: "REAL JOB वर काम किंवा नोकरीसाठी अर्ज कसा करावा?",
    answer: "Simply search for jobs according to your skill or location, click on 'Apply Now' or 'Direct Call', and contact the employer directly without any middleman fees.",
    marathiAnswer: "तुमचे कौशल्य किंवा शहरानुसार नोकरी शोधा, 'Apply Now' किंवा 'कॉल करा' वर क्लिक करा आणि थेट मालकाशी विनामूल्य बोला.",
  },
  {
    category: "worker",
    question: "Is there any registration fee for job seekers?",
    marathiQuestion: "कामगारांसाठी नोंदणी शुल्क आहे का?",
    answer: "No! REAL JOB is 100% free for workers and job seekers. We never charge any commission or placement fees.",
    marathiAnswer: "नाही! कामगारांसाठी REAL JOB संपूर्ण मोफत आहे. आम्ही कोणतेही कमिशन किंवा फी घेत नाही.",
  },
  {
    category: "worker",
    question: "What types of jobs are available on REAL JOB?",
    marathiQuestion: "कोणत्या प्रकारच्या नोकऱ्या उपलब्ध आहेत?",
    answer: "We list factory operators, construction workers, electricians, turners, CNC machine operators, drivers, welders, masons, warehouse staff, security guards, and hotel/restaurant staff.",
    marathiAnswer: "कारखाना कामगार, बांधकाम कामगार, इलेक्ट्रीशियन, वेल्डर, फॅक्टरी ऑपरेटर, ड्रायव्हर, वेअरहाउस स्टाफ, सुरक्षा रक्षक व हॉटेल स्टाफच्या नोकऱ्या उपलब्ध आहेत.",
  },
  {
    category: "employer",
    question: "How can employers post a job on REAL JOB?",
    marathiQuestion: "मालक किंवा कंपन्या नोकरी कशी पोस्ट करू शकतात?",
    answer: "Register as an Employer, go to your dashboard, click 'Post Job', fill in the job details, requirements, and salary, and publish it instantly.",
    marathiAnswer: "मालक म्हणून नोंदणी करा, डॅशबोर्डवर 'Post Job' वर क्लिक करा, नोकरीची माहिती व पगार भरा आणि त्वरित पोस्ट करा.",
  },
  {
    category: "employer",
    question: "How do I search for verified workers directly?",
    marathiQuestion: "मी थेट सत्यापित कामगार कसे शोधू शकतो?",
    answer: "Navigate to the 'Find Workers' tab, filter by skill, experience, location, and expected salary, and view verified worker profile cards to request hire.",
    marathiAnswer: "'Find Workers' विभागामध्ये जाऊन कौशल्य, अनुभव आणि शहरानुसार कामगार फिल्टर करा आणि थेट फोनवर संपर्क साधा.",
  },
  {
    category: "employer",
    question: "What is Profile Verification?",
    marathiQuestion: "कामगार व्हॅलिडेशन (Profile Verification) म्हणजे काय?",
    answer: "Our team verifies worker mobile numbers, work experience, and trade certificates so employers get authentic, trustworthy talent.",
    marathiAnswer: "आम्ही कामगारांचे मोबाईल नंबर, कामाचा अनुभव व कागदपत्रे पडताळून पाहतो जेणेकरून मालकांना विश्वसनीय कामगार मिळतील.",
  },
  {
    category: "job",
    question: "How soon do employers respond after applying?",
    marathiQuestion: "अर्ज केल्यानंतर मालकांचा प्रतिसाद किती वेळात मिळतो?",
    answer: "Most employers call back candidates within 24 to 48 hours. You can also use the direct call button to reach out immediately.",
    marathiAnswer: "बहुतेक मालक 24 ते 48 तासांत संपर्क करतात. तुम्ही डायरेक्ट कॉल बटण वापरून लगेच बोलायला सुरुवात करू शकता.",
  },
  {
    category: "job",
    question: "Can I save jobs for applying later?",
    marathiQuestion: "मी नोकऱ्या सेव्ह (Save) करून ठेवू शकतो का?",
    answer: "Yes, click the bookmark icon on any job card to save it into your 'Saved Jobs' list in your worker dashboard.",
    marathiAnswer: "होय, कोणत्याही जॉब कार्डवरील बुकमार्क चिन्हावर क्लिक करून तुमच्या सेव्ह केलेल्या नोकऱ्यांच्या यादीत जतन करा.",
  },
  {
    category: "account",
    question: "How do I change my language preferences?",
    marathiQuestion: "मी भाषा बदलू शकतो का?",
    answer: "Use the language switcher dropdown in the header to switch anytime between Marathi, Hindi, English, and other regional languages.",
    marathiAnswer: "हेडरमधील 'Language' मेनू वापरून तुम्ही कधीही मराठी, हिंदी किंवा इंग्रजी भाषा निवडू शकता.",
  },
  {
    category: "account",
    question: "What should I do if I forget my password?",
    marathiQuestion: "पासवर्ड विसरल्यास काय करावे?",
    answer: "Click on 'Forgot Password?' on the Login page and enter your mobile number/email to receive an OTP reset link.",
    marathiAnswer: "लॉगिन पानावर 'Forgot Password' वर क्लिक करा आणि तुमचा मोबाईल नंबर टाकून OTP मिळवा.",
  },
];

export function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "worker" | "employer" | "job" | "account">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqList.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.marathiQuestion.includes(searchQuery) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.marathiAnswer.includes(searchQuery);
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
              सतत विचारले जाणारे प्रश्न
            </div>
            <h1 className="text-3xl font-black text-[#10233F] sm:text-4xl">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#5B6B7F]">
              REAL JOB बाबतच्या सर्व प्रश्नांची उत्तरे येथे शोधा
            </p>

            {/* Search Input */}
            <div className="mt-6 relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#5B6B7F]" />
              <Input
                type="text"
                placeholder="प्रश्न शोधा... Search FAQ..."
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
              सर्व प्रश्न (All FAQs)
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
              कामगारांचे प्रश्न (Workers)
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
              मालकांचे प्रश्न (Employers)
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
              नोकरीबाबत (Job Search)
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
              खाते व लॉगइन (Account)
            </button>
          </div>

          {/* Accordion list */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="card-realjob overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-[#10233F] hover:text-[#063B78]"
                    >
                      <div>
                        <span className="text-base block">{faq.marathiQuestion}</span>
                        <span className="text-xs font-semibold text-[#5B6B7F] block mt-0.5">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`size-5 text-[#063B78] shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-[#DCE5F0] bg-[#F5F8FC]">
                        <p className="text-sm font-bold text-[#082F63] leading-relaxed">
                          {faq.marathiAnswer}
                        </p>
                        <p className="text-xs font-semibold text-[#5B6B7F] leading-relaxed mt-2">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="card-realjob p-12 text-center">
                <HelpCircle className="mx-auto size-12 text-[#5B6B7F] mb-3" />
                <h3 className="text-lg font-black text-[#10233F]">कोणताही प्रश्न सापडला नाही</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
                  कृपया वेगळा शब्द शोधा किंवा थेट आमच्याशी संपर्क साधा.
                </p>
              </div>
            )}
          </div>

          {/* Still Have Questions? Card */}
          <div className="mt-12 card-realjob p-8 bg-hero-overlay text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#FFC400] font-black text-xs uppercase tracking-wider mb-1">
                <MessageSquare className="size-4" /> मदत हवी आहे? Need Support?
              </div>
              <h3 className="text-2xl font-black text-white">अजूनही प्रश्न आहेत?</h3>
              <p className="text-xs text-white/90 font-medium mt-1">
                आमचा सपोर्ट टीम तुम्हाला मार्गदर्शन करण्यास सदैव तत्पर आहे.
              </p>
            </div>
            <Button asChild className="btn-yellow font-extrabold text-sm px-6 py-3 shrink-0">
              <Link to="/contact">संपर्क साधा (Contact Us)</Link>
            </Button>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
