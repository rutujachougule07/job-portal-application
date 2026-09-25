import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Headphones,
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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Job Seeker Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "Job Seeker Inquiry", message: "" });
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
                संपर्क साधा • Contact Support
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white">
                REAL JOB सपोर्ट टीमशी बोला <br />
                <span className="text-[#FFC400]">सर्व प्रश्नांची त्वरित उत्तरे</span>
              </h1>

              <p className="mt-3 text-sm sm:text-base font-medium text-white/90">
                काम शोधण्यासाठी, कामगार भरतीसाठी किंवा कोणत्याही मदतीसाठी आम्हाला थेट कॉल किंवा मेसेज करा.
              </p>
            </div>
          </div>

          {/* 3 Contact Info Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            <div className="card-realjob p-6">
              <div className="size-12 rounded-xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center mb-4">
                <Phone className="size-6 text-[#063B78]" />
              </div>
              <h3 className="font-black text-lg text-[#10233F]">टोल-फ्री हेल्पलाईन</h3>
              <p className="text-xs font-semibold text-[#5B6B7F] mt-1">सोमवार ते शनिवार (सकाळी ९ ते संध्याकाळी ७)</p>
              <a href="tel:18002003040" className="mt-3 block font-black text-[#063B78] text-lg hover:underline">
                +91 1800 200 3040
              </a>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> लाईव सपोर्ट सुरु आहे
              </span>
            </div>

            <div className="card-realjob p-6">
              <div className="size-12 rounded-xl bg-[#125BB5]/10 text-[#125BB5] flex items-center justify-center mb-4">
                <Mail className="size-6 text-[#125BB5]" />
              </div>
              <h3 className="font-black text-lg text-[#10233F]">ईमेलद्वारे संपर्क</h3>
              <p className="text-xs font-semibold text-[#5B6B7F] mt-1">२ तासांच्या आत प्रतिसाद मिळवा</p>
              <a href="mailto:support@realjob.in" className="mt-3 block font-black text-[#063B78] text-base hover:underline">
                support@realjob.in
              </a>
              <p className="text-xs font-bold text-[#5B6B7F] mt-1">मालकांसाठी: hire@realjob.in</p>
            </div>

            <div className="card-realjob p-6">
              <div className="size-12 rounded-xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center mb-4">
                <MapPin className="size-6 text-[#FFC400] text-[#082F63]" />
              </div>
              <h3 className="font-black text-lg text-[#10233F]">मुख्य कार्यालय (HQ Office)</h3>
              <p className="text-xs font-semibold text-[#5B6B7F] mt-1">पुणे एमआयडीसी (Chakan / Bhosari)</p>
              <address className="mt-2 text-xs font-bold not-italic text-[#10233F] leading-relaxed">
                प्लॉट नं. ४२, एमआयडीसी भोसरी इंडस्ट्रिअल एरिया, पुणे, महाराष्ट्र ४११०२६
              </address>
            </div>
          </div>

          {/* Main Form & Office Locations */}
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* Form */}
            <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-[#DCE5F0] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-xl bg-[#063B78] text-white flex items-center justify-center font-black">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#10233F]">आम्हाला मेसेज पाठवा</h2>
                  <p className="text-xs font-semibold text-[#5B6B7F]">खालील फॉर्म भरा आणि आमची टीम त्वरित संपर्क साधेल.</p>
                </div>
              </div>

              {submitted ? (
                <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800 space-y-3">
                  <CheckCircle2 className="mx-auto size-14 text-emerald-600 animate-bounce" />
                  <h3 className="text-xl font-black">मेसेज यशस्वीरीत्या पाठवला गेला!</h3>
                  <p className="text-xs font-semibold">
                    REAL JOB सपोर्ट टीम २४ तासांच्या आत तुमच्याशी संपर्क साधेल.
                  </p>
                  <Button onClick={() => setSubmitted(false)} className="btn-yellow text-xs font-bold mt-4">
                    दुसरा मेसेज पाठवा
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#10233F] mb-1">तुमचे नाव (Name) *</label>
                      <Input
                        required
                        placeholder="उदा. राहुल जाधव"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#10233F] mb-1">ईमेल (Email) *</label>
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
                      <label className="block text-xs font-extrabold text-[#10233F] mb-1">मोबाईल नंबर (Phone)</label>
                      <Input
                        type="tel"
                        placeholder="+91 98220 00000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#10233F] mb-1">विषय (Inquiry Subject) *</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                      >
                        <option value="Job Seeker Inquiry">कामगारांसाठी मदत (Worker Support)</option>
                        <option value="Employer / Hiring Inquiry">कामगार भरती / पोस्टिंग (Employer Hiring)</option>
                        <option value="Technical Support">तांत्रिक समस्या (Tech Support)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#10233F] mb-1">तुमचा मेसेज (Message) *</label>
                    <Textarea
                      required
                      rows={4}
                      placeholder="तुमची अडचण किंवा प्रश्न येथे सविस्तर लिहा..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <Button disabled={loading} type="submit" className="w-full btn-yellow font-black text-xs h-12">
                    {loading ? "पाठवत आहे..." : "मेसेज पाठवा (Send Message)"}
                  </Button>
                </form>
              )}
            </div>

            {/* Regional Offices */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs">
                <h3 className="text-lg font-black text-[#10233F] mb-4 flex items-center gap-2">
                  <Building2 className="size-5 text-[#063B78]" /> महाराष्ट्रातील प्रादेशिक कार्यालये
                </h3>

                <div className="space-y-4 text-xs font-bold text-[#10233F]">
                  <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#DCE5F0]">
                    <span className="text-xs font-extrabold text-[#063B78] block">पुणे (Chakan Office)</span>
                    <span className="text-[#5B6B7F]">इंडस्ट्रिअल हब, चाकण एमआयडीसी, पुणे.</span>
                  </div>
                  <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#DCE5F0]">
                    <span className="text-xs font-extrabold text-[#063B78] block">मुंबई (Thane / Navi Mumbai)</span>
                    <span className="text-[#5B6B7F]">वाशी सेक्टर १७, नवी मुंबई.</span>
                  </div>
                  <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#DCE5F0]">
                    <span className="text-xs font-extrabold text-[#063B78] block">छत्रपती संभाजीनगर (Aurangabad)</span>
                    <span className="text-[#5B6B7F]">वाळूज एमआयडीसी क्षेत्र, औरंगाबाद.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
