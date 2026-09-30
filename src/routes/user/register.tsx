import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getAllUsers, saveUsers, useAuth } from "@/lib/auth-context";
import { LanguageSwitcher } from "@/components/portal/LanguageSwitcher";
import { Brand } from "@/components/portal/Brand";
import { toast } from "sonner";

export const Route = createFileRoute("/user/register")({
  component: UserRegisterPage,
});

function UserRegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    const users = getAllUsers();
    if (users.find((u) => u.email.toLowerCase() === form.email.toLowerCase())) {
      setLoading(false);
      return setError("An account with this email address already exists.");
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: form.email,
      password: form.password,
      name: form.name,
      mobile: form.mobile,
      role: "user" as const,
      createdAt: new Date().toISOString(),
      disabled: false,
    };
    saveUsers([...users, newUser]);

    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) {
      toast.success("Account created successfully! Welcome to REAL JOB.");
      navigate({ to: "/" });
    } else {
      setError(res.error || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F8FC]">
      {/* ── LEFT HERO SIDEBAR (Dark Blue Branding) ──────────────────────── */}
      <div className="lg:w-5/12 bg-gradient-to-br from-[#063B78] via-[#082F63] to-[#10233F] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFC400]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#125BB5]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="inline-block bg-white p-2.5 rounded-2xl shadow-md">
            <Brand className="h-10 scale-95 origin-left" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#FFC400]/20 border border-[#FFC400]/40 text-[#FFC400] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              ★ नवीन रजिस्ट्रेशन • मोफत नोकरी शोध
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
              कामाला लागा, आजच रजिस्ट्रेशन करा!
            </h1>
            <p className="text-white/80 text-xs sm:text-sm font-semibold leading-relaxed max-w-md">
              कारखाने, आयटी, सिव्हिल, ड्रायव्हिंग आणि सर्व क्षेत्रातील नोकऱ्यांसाठी मोफत अकाऊंट तयार करा.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              "१००% मोफत व त्वरित अकाऊंट निर्मिती",
              " थेट मालक आणि कंपन्यांशी संपर्क",
              "तुमच्या कौशल्यानुसार नोकरीच्या सूचना",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="size-5 rounded-full bg-[#FFC400] text-[#082F63] flex items-center justify-center font-black text-xs shrink-0">
                  ✓
                </div>
                <span className="text-xs sm:text-sm font-bold text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-8 mt-8 border-t border-white/10 text-[11px] font-semibold text-white/60">
          © 2026 REAL JOB. All rights reserved.
        </div>
      </div>

      {/* ── RIGHT REGISTER FORM AREA ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-10">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#063B78] hover:text-[#082F63] hover:underline"
          >
            <ArrowLeft className="size-4" />
            <span>मुख्य पृष्ठ (Home)</span>
          </Link>
          <div className="flex items-center">
            <LanguageSwitcher label="Language" showCurrent={true} />
          </div>
        </div>

        <div className="mx-auto w-full max-w-md my-auto py-4">
          <div className="bg-white rounded-3xl border border-[#DCE5F0] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 bg-[#FFC400]/20 text-[#082F63] text-[11px] font-black px-3 py-1 rounded-full">
                ⌂ कामगार रजिस्ट्रेशन (Worker Registration)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#10233F]">
                नवीन अकाऊंट तयार करा (Create Account)
              </h2>
              <p className="text-xs font-semibold text-[#5B6B7F]">
                तुमची माहिती भरून मोफत नोंदणी करा आणि नोकरी शोधा.
              </p>
            </div>

            {/* Login / Register Tab Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F5F8FC] border border-[#DCE5F0]">
              <Link
                to="/user/login"
                className="py-2.5 rounded-xl font-bold text-xs text-[#5B6B7F] text-center hover:text-[#10233F] transition-colors"
              >
                लॉगिन (Login)
              </Link>
              <button
                type="button"
                className="py-2.5 rounded-xl font-black text-xs bg-[#063B78] text-white shadow-xs"
              >
                रजिस्टर (Register)
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#10233F] mb-1">
                  पूर्ण नाव (Full Name) *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="तुमचे नाव प्रविष्ट करा"
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#10233F] mb-1">
                  ईमेल पत्ता (Email Address) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#10233F] mb-1">
                  मोबाइल नंबर (Mobile Number) *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="१० अंकी मोबाईल नंबर"
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#10233F] mb-1">
                    पासवर्ड (Password) *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#10233F] mb-1">
                    पासवर्ड पुष्टी करा *
                  </label>
                  <input
                    type="password"
                    name="confirm"
                    required
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#063B78] hover:bg-[#082F63] text-white font-black text-xs rounded-xl shadow-md transition-all disabled:opacity-60"
              >
                {loading ? "अकाऊंट तयार होत आहे..." : "मोफत नोंदणी करा (Register Free)"}
              </button>
            </form>

            <div className="text-center pt-2">
              <span className="text-xs font-semibold text-[#5B6B7F]">
                आधीच अकाऊंट आहे का?{" "}
              </span>
              <Link to="/user/login" className="text-xs font-black text-[#063B78] hover:underline">
                येथे लॉगिन करा
              </Link>
            </div>
          </div>
        </div>

        <div />
      </div>
    </div>
  );
}
