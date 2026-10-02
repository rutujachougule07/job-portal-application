import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  CreditCard,
  Building2,
  Sparkles,
  ArrowRight,
  Package,
  History,
  QrCode,
  Smartphone,
  BadgeCheck,
  Briefcase,
} from "lucide-react";

import { PublicHeader } from "@/components/portal/PublicHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dataStore, PackageTransaction } from "@/lib/data-store";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "जॉब पॅकेजेस आणि सबस्क्रिप्शन | Job Packages & Pricing — REAL JOB" },
      { name: "description", content: "१०० रुपयांत १ जॉब, २०० रुपयांत २ जॉब्स आणि इतर सर्व जॉब पॅकेजेस मिळवा." },
    ],
  }),
  component: PackagesPage,
});

interface Plan {
  id: string;
  nameMr: string;
  nameEn: string;
  price: number;
  jobCount: number;
  badge?: string;
  descriptionMr: string;
  descriptionEn: string;
  featuresMr: string[];
  featuresEn: string[];
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "plan-100",
    nameMr: "१ जॉब पॅकेज (Basic)",
    nameEn: "1 Job Starter Plan",
    price: 100,
    jobCount: 1,
    descriptionMr: "१०० रुपयांत १ जॉब पोस्ट करा किंवा प्रायॉरिटी अप्लाय करा",
    descriptionEn: "Post 1 job or get 1 priority application credit for ₹100",
    featuresMr: [
      "१ जॉब पोस्टिंग / प्रायॉरिटी क्रेडिट",
      "३० दिवस जॉब व्हॅलिडिटी",
      "डायरेक्ट कॅन्डिडेट कॉन्टॅक्ट",
      "२४/७ कस्टमर सपोर्ट",
    ],
    featuresEn: [
      "1 Job Posting / Priority Credit",
      "30 Days Job Validity",
      "Direct Candidate Contact",
      "24/7 Customer Support",
    ],
  },
  {
    id: "plan-200",
    nameMr: "२ जॉब्स पॅकेज (Popular)",
    nameEn: "2 Jobs Standard Plan",
    price: 200,
    jobCount: 2,
    badge: "मोस्ट पॉप्युलर (Best Value)",
    recommended: true,
    descriptionMr: "२०० रुपयांत २ जॉब्स पोस्ट करा किंवा २ प्रीमियम अप्लाय क्रेडिट्स मिळवा",
    descriptionEn: "Post 2 jobs or get 2 premium credits for ₹200",
    featuresMr: [
      "२ जॉब्स पोस्टिंग / प्रायॉरिटी क्रेडिट्स",
      "३० दिवस व्हॅलिडिटी",
      "हायलाइटेड जॉब बॅज",
      "कॅन्डिडेट व्हॉट्सॲप अलर्ट्स",
      "२४/७ कस्टमर सपोर्ट",
    ],
    featuresEn: [
      "2 Jobs Posting / Priority Credits",
      "30 Days Validity",
      "Highlighted Job Badge",
      "Candidate WhatsApp Alerts",
      "24/7 Customer Support",
    ],
  },
  {
    id: "plan-400",
    nameMr: "५ जॉब्स प्रो पॅकेज",
    nameEn: "5 Jobs Pro Growth Plan",
    price: 400,
    jobCount: 5,
    badge: "बचत ऑफर (Save ₹100)",
    descriptionMr: "४०० रुपयांत ५ जॉब्स (१०० रुपये बचत)",
    descriptionEn: "Get 5 jobs for ₹400 (Save ₹100)",
    featuresMr: [
      "५ जॉब्स पोस्टिंग क्रेडिट्स",
      "६० दिवस व्हॅलिडिटी",
      "टॉप सर्च रँकिंग",
      "बल्क कॅन्डिडेट रेझ्युमे डाउनलोड",
      "Dedicated सपोर्ट मॅनेजर",
    ],
    featuresEn: [
      "5 Jobs Posting Credits",
      "60 Days Validity",
      "Top Search Ranking",
      "Bulk Resume Downloads",
      "Dedicated Support Manager",
    ],
  },
  {
    id: "plan-999",
    nameMr: "अनलिमिटेड बिझनेस पॅकेज",
    nameEn: "Enterprise Unlimited Plan",
    price: 999,
    jobCount: 999,
    badge: "अनलिमिटेड (Unlimited)",
    descriptionMr: "९९९ रुपयांत ३० दिवसांसाठी अमर्याद जॉब्स",
    descriptionEn: "Unlimited Job Postings for 30 Days for ₹999",
    featuresMr: [
      "अमर्याद (Unlimited) जॉब्स",
      "३० दिवस व्हॅलिडिटी",
      "VIP व्हेरीफाईड एम्प्लॉयर टॅग",
      "इन्स्टंट मॅचिंग कॅन्डिडेट डेटाबेस",
      "VIP सपोर्ट सेवा",
    ],
    featuresEn: [
      "Unlimited Job Postings",
      "30 Days Validity",
      "VIP Verified Tag",
      "Instant Candidate Match Database",
      "VIP Support Service",
    ],
  },
];

function PackagesPage() {
  const navigate = useNavigate();
  const { lang } = useI18n();
  const isMr = lang === "mr";

  const [user, setUser] = useState<{ id?: string; email: string; fullName?: string; role?: string } | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [purchases, setPurchases] = useState<PackageTransaction[]>([]);

  useEffect(() => {
    const currentUser = dataStore.getCurrentUser();
    if (currentUser && currentUser.id) {
      setUser(currentUser);
      refreshUserData(currentUser.id);
    }
  }, []);

  const refreshUserData = (userId: string) => {
    const totalCredits = dataStore.getUserJobCredits(userId);
    const txs = dataStore.getUserPackages(userId);
    setUserCredits(totalCredits);
    setPurchases(txs);
  };

  const handleSelectPlan = (plan: Plan) => {
    const currentUser = user || dataStore.getCurrentUser();
    if (!currentUser) {
      toast.info(isMr ? "कृपया पॅकेज खरेदी करण्यासाठी प्रथम लॉगिन करा." : "Please login first to purchase a package.");
      navigate({ to: "/auth", search: { mode: "login", role: "employer" } });
      return;
    }
    setSelectedPlan(plan);
  };

  const handleConfirmPurchase = () => {
    if (!selectedPlan || !user || !user.id) return;

    if (paymentMethod === "upi" && !upiId.trim()) {
      setUpiId("user@upi"); // default fallback for fast demo checkout
    }

    const userId = user.id;

    setIsProcessing(true);
    setTimeout(() => {
      dataStore.addPackagePurchase({
        userId: userId,
        planId: selectedPlan.id,
        planName: isMr ? selectedPlan.nameMr : selectedPlan.nameEn,
        price: selectedPlan.price,
        jobCount: selectedPlan.jobCount,
        paymentMethod: paymentMethod.toUpperCase(),
      });

      setIsProcessing(false);
      setSelectedPlan(null);
      refreshUserData(userId);

      toast.success(
        isMr
          ? `🎉 अभिनंदन! ${selectedPlan.price} रुपयांचे पॅकेज (क्रेडिट्स: ${selectedPlan.jobCount}) यशस्वीरित्या ॲड झाले!`
          : `🎉 Success! ₹${selectedPlan.price} package added (${selectedPlan.jobCount} job credits)!`
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col font-sans">
      <PublicHeader />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#063B78] via-[#082F63] to-[#125BB5] text-white py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Package className="w-96 h-96" />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-yellow-300 text-xs font-black mb-4">
            <Sparkles className="size-4" />
            <span>{isMr ? "नवीन खास ऑफर्स" : "Special Pricing Offers"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            {isMr ? "योग्य पॅकेज निवडा आणि लगेच सुरू करा!" : "Choose Your Package & Get Started!"}
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto font-medium">
            {isMr
              ? "१०० रुपयांत १ जॉब, २०० रुपयांत २ जॉब्स आणि ५०० मध्ये प्रो पॅकेज. कोणताही छुपा खर्च नाही!"
              : "Post jobs & connect with candidates with flexible ₹100 & ₹200 budget plans!"}
          </p>

          {/* User Credits Status Badge */}
          {user && (
            <div className="mt-6 inline-flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/30 px-5 py-2.5 rounded-2xl text-white shadow-lg">
              <div className="bg-amber-400 p-2 rounded-xl text-[#063B78]">
                <Zap className="size-5 fill-current" />
              </div>
              <div className="text-left">
                <p className="text-xs text-blue-200 font-bold">{isMr ? "तुमची सध्याची शिल्लक क्रेडिट्स:" : "Your Current Job Credits:"}</p>
                <p className="text-lg font-black text-white">
                  {userCredits >= 999 ? "Unlimited (अमर्याद)" : `${userCredits} Job Credits`}
                </p>
              </div>
              <Button
                asChild
                size="sm"
                className="ml-3 bg-yellow-400 hover:bg-yellow-500 text-[#063B78] font-black text-xs h-8 rounded-lg"
              >
                <Link to={user.role === "admin" || user.role === "employer" ? "/admin" : "/jobs"}>
                  <Briefcase className="size-3.5 mr-1" />
                  {isMr ? "वापरा (Use Now)" : "Use Now"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Main Pricing Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-2xl ${
                plan.recommended
                  ? "border-[#063B78] ring-2 ring-[#063B78]/20 shadow-xl scale-105 z-10"
                  : "border-[#DCE5F0] hover:border-[#063B78]/50 shadow-md"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#063B78] text-yellow-300 text-[11px] font-black px-4 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="size-3" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-black text-[#063B78] mb-1">
                  {isMr ? plan.nameMr : plan.nameEn}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4 min-h-[32px]">
                  {isMr ? plan.descriptionMr : plan.descriptionEn}
                </p>

                {/* Price Display */}
                <div className="my-4 p-4 rounded-2xl bg-[#F4F7FB] border border-[#E2E8F0] text-center">
                  <span className="text-3xl font-black text-[#063B78]">₹{plan.price}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">
                    / {plan.jobCount === 999 ? "Month" : `${plan.jobCount} Job${plan.jobCount > 1 ? "s" : ""}`}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 my-6">
                  {(isMr ? plan.featuresMr : plan.featuresEn).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-6 rounded-2xl font-black text-sm transition-all shadow-md ${
                  plan.recommended
                    ? "bg-[#063B78] hover:bg-[#082F63] text-white"
                    : "bg-slate-900 hover:bg-[#063B78] text-white"
                }`}
              >
                <Package className="size-4 mr-2" />
                {isMr ? `₹${plan.price} मध्ये पॅकेज घ्या` : `Get Plan for ₹${plan.price}`}
              </Button>
            </div>
          ))}
        </div>

        {/* Transaction History Section */}
        {user && purchases.length > 0 && (
          <div className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE5F0] shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <History className="size-6 text-[#063B78]" />
              <h2 className="text-xl font-extrabold text-[#063B78]">
                {isMr ? "तुमचे खरेदी केलेले पॅकेजेस (Purchase History)" : "Your Purchased Packages"}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F4F7FB] text-slate-600 font-bold uppercase tracking-wider">
                    <th className="p-3 rounded-l-xl">Transaction ID</th>
                    <th className="p-3">Package Name</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Credits</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchases.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 font-medium text-slate-800">
                      <td className="p-3 font-mono text-slate-500">{tx.id}</td>
                      <td className="p-3 font-bold text-[#063B78]">{tx.planName}</td>
                      <td className="p-3 font-black text-emerald-700">₹{tx.price}</td>
                      <td className="p-3 font-bold">{tx.jobCount} Jobs</td>
                      <td className="p-3 text-slate-500">{tx.purchaseDate}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          <BadgeCheck className="size-3" />
                          <span>{tx.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal / Checkout Drawer */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-extrabold text-xl p-2 rounded-full hover:bg-slate-100"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-blue-50 text-[#063B78]">
                <Sparkles className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#063B78]">
                  {isMr ? "पेमेंट आणि पॅकेज कन्फर्मेशन" : "Payment & Package Confirmation"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {isMr ? selectedPlan.nameMr : selectedPlan.nameEn}
                </p>
              </div>
            </div>

            {/* Selected Plan Summary */}
            <div className="bg-[#F4F7FB] p-4 rounded-2xl border border-[#DCE5F0] my-4 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500">{isMr ? "एकूण रक्कम (Total Amount)" : "Total Amount"}</p>
                <p className="text-2xl font-black text-[#063B78]">₹{selectedPlan.price}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">{isMr ? "क्रेडिट्स (Job Credits)" : "Job Credits"}</p>
                <p className="text-lg font-extrabold text-emerald-700">+{selectedPlan.jobCount} Jobs</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4 my-4">
              <Label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                {isMr ? "पेमेंट पद्धत निवडा (Select Payment Method)" : "Select Payment Method"}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "upi"
                      ? "border-[#063B78] bg-blue-50/70 text-[#063B78] ring-2 ring-[#063B78]/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Smartphone className="size-5" />
                  <span>UPI / GPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "card"
                      ? "border-[#063B78] bg-blue-50/70 text-[#063B78] ring-2 ring-[#063B78]/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="size-5" />
                  <span>Debit / Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "netbanking"
                      ? "border-[#063B78] bg-blue-50/70 text-[#063B78] ring-2 ring-[#063B78]/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Building2 className="size-5" />
                  <span>NetBanking</span>
                </button>
              </div>

              {paymentMethod === "upi" && (
                <div className="pt-2">
                  <Label className="text-xs font-bold text-slate-600 mb-1 block">
                    {isMr ? "UPI ID प्रविष्ट करा (किंवा GPay / PhonePe द्वारे भरा)" : "Enter UPI ID (or pay via GPay)"}
                  </Label>
                  <Input
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="h-11 rounded-xl text-sm font-semibold border-slate-300"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    {isMr ? "उदा: 9876543210@paytm किंवा user@okaxis" : "e.g. 9876543210@paytm"}
                  </p>
                </div>
              )}
            </div>

            {/* Secure Payment Note */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 my-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>{isMr ? "100% सुरक्षित आणि इन्स्टंट क्रेडिट ॲड केले जाईल." : "100% Secure & instant credit allocation."}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-6 rounded-2xl font-bold border-slate-300"
              >
                {isMr ? "रद्द करा" : "Cancel"}
              </Button>
              <Button
                disabled={isProcessing}
                onClick={handleConfirmPurchase}
                className="flex-1 py-6 rounded-2xl font-black bg-[#063B78] hover:bg-[#082F63] text-white shadow-lg"
              >
                {isProcessing ? (
                  <span>{isMr ? "प्रोसेस होत आहे..." : "Processing..."}</span>
                ) : (
                  <span>{isMr ? `₹${selectedPlan.price} भरून ॲड करा` : `Pay ₹${selectedPlan.price} & Add`}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
