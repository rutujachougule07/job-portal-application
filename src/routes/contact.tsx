import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { dataStore } from "@/lib/data-store";
import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — REAL JOB | Find Work | Find Workers" },
      { name: "description", content: "Contact REAL JOB support team for worker registration, employer hiring assistance, or job postings." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const user = dataStore.getCurrentUser();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.role === 'employer') {
        navigate({ to: '/admin' });
      } else {
        // @ts-ignore
        navigate({ to: '/dashboard' });
      }
    }
  }, [user, navigate]);

  if (user) return null; // Prevents flashing the page content before redirect
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "worker",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "worker", message: "" });
    }, 1000);
  };

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Contact Hero Banner */}
          <div className="bg-hero-overlay p-8 sm:p-12 rounded-2xl text-white mb-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur mb-3">
                <Sparkles className="size-3.5" />
                {t("contactSupportEyebrow")}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white">
                {t("contactTitle")}
              </h1>

              <p className="mt-3 text-sm sm:text-base font-medium text-white/90">
                {t("contactSubtitle")}
              </p>
            </div>
          </div>

          {/* 3 Contact Info Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            <div className="card-realjob p-6">
              <div className="size-12 rounded-xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center mb-4">
                <Phone className="size-6 text-[#063B78]" />
              </div>
              <h3 className="font-black text-lg text-[#10233F]">{t("tollFreeTitle")}</h3>
              <p className="text-xs font-semibold text-[#5B6B7F] mt-1">{t("tollFreeHours")}</p>
              <a href="tel:18002003040" className="mt-3 block font-black text-[#063B78] text-lg hover:underline">
                +91 1800 200 3040
              </a>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> {t("liveSupportActive")}
              </span>
            </div>

            <div className="card-realjob p-6">
              <div className="size-12 rounded-xl bg-[#125BB5]/10 text-[#125BB5] flex items-center justify-center mb-4">
                <Mail className="size-6 text-[#125BB5]" />
              </div>
              <h3 className="font-black text-lg text-[#10233F]">{t("emailSupportTitle")}</h3>
              <p className="text-xs font-semibold text-[#5B6B7F] mt-1">{t("emailResponseTime")}</p>
              <a href="mailto:support@realjob.in" className="mt-3 block font-black text-[#063B78] text-base hover:underline">
                support@realjob.in
              </a>
              <p className="text-xs font-bold text-[#5B6B7F] mt-1">{t("employerEmailNote")}</p>
            </div>

            <div className="card-realjob p-6">
              <div className="size-12 rounded-xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center mb-4">
                <MapPin className="size-6 text-[#082F63]" />
              </div>
              <h3 className="font-black text-lg text-[#10233F]">{t("hqTitle")}</h3>
              <address className="mt-2 text-xs font-bold not-italic text-[#10233F] leading-relaxed">
                {t("hqAddress")}
              </address>
            </div>
          </div>

          {/* Main Form */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#DCE5F0] shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center font-black">
                  <MessageSquare className="size-6 text-[#063B78]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#10233F]">{t("sendMessageTitle")}</h2>
                  <p className="text-xs font-semibold text-[#5B6B7F]">{t("sendMessageDesc")}</p>
                </div>
              </div>

              {submitted ? (
                <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800 space-y-3">
                  <CheckCircle2 className="mx-auto size-14 text-emerald-600 animate-bounce" />
                  <h3 className="text-xl font-black">{t("messageSentSuccess")}</h3>
                  <p className="text-xs font-semibold">
                    {t("messageSentDesc")}
                  </p>
                  <Button onClick={() => setSubmitted(false)} className="btn-yellow text-xs font-bold mt-4">
                    {t("sendAnotherMessage")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("yourName")} *</label>
                      <Input
                        required
                        placeholder="Rahul Pawar"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("emailAddress")} *</label>
                      <Input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("phoneNumber")}</label>
                      <Input
                        type="tel"
                        placeholder="+91 98220 00000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("inquirySubject")} *</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                      >
                        <option value="worker">{t("workerSupport")}</option>
                        <option value="employer">{t("employerHiring")}</option>
                        <option value="tech">{t("techSupport")}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">{t("yourMessage")} *</label>
                    <Textarea
                      required
                      rows={4}
                      placeholder={t("messagePlaceholder")}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <Button disabled={loading} type="submit" className="w-full bg-[#10233F] hover:bg-[#10233F]/90 text-white font-bold h-12 flex items-center justify-center gap-2 rounded-xl text-sm">
                    <Send className="size-4" />
                    {loading ? t("sending") : t("sendMessage")}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
