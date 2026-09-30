import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/portal/LanguageSwitcher";
import { Brand } from "@/components/portal/Brand";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@realjob.in");
  const [password, setPassword] = useState("admin123");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated && user) {
    if (user.role === "admin") navigate({ to: "/admin/dashboard" });
    else navigate({ to: "/user/dashboard" });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Login failed.");
      toast.error(res.error || "Login failed");
    } else {
      const stored = JSON.parse(localStorage.getItem("realjob_auth_user") || "{}");
      if (stored.role === "user") {
        setError("This account does not have Recruiter / Admin access.");
        toast.error("Access denied: User accounts cannot access Admin portal.");
        return;
      }
      toast.success("Welcome Recruiter! Admin Login Successful.");
      navigate({ to: "/admin/dashboard" });
    }
  };

  const fillDemoAdmin = () => {
    setEmail("admin@realjob.in");
    setPassword("admin123");
    toast.info("Demo Admin credentials filled: admin@realjob.in");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F8FC]">
      {/* ── LEFT HERO SIDEBAR (Dark Blue Employer Branding) ──────────────── */}
      <div className="lg:w-5/12 bg-gradient-to-br from-[#10233F] via-[#082F63] to-[#063B78] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFC400]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#125BB5]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Logo Badge */}
          <div className="inline-block bg-white p-2.5 rounded-2xl shadow-md">
            <Brand className="h-10 scale-95 origin-left" />
          </div>

          {/* Yellow Tagline Pill */}
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#FFC400]/20 border border-[#FFC400]/40 text-[#FFC400] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              ★ मालक • कंपनी • भरती पोर्टल
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
              कंपन्या व मालकांसाठी १ नंबर नोकरी व कामगार भरती मंचा
            </h1>
            <p className="text-white/80 text-xs sm:text-sm font-semibold leading-relaxed max-w-md">
              सर्वोत्कृष्ट कामगार व तांत्रिक मनुष्यबळाची झटपट भरती करा. थेट उमेदवारांशी संपर्क साधून मुलाखत घ्या.
            </p>
          </div>

          {/* Value Propositions List */}
          <div className="space-y-3 pt-2">
            {[
              "अमर्याद नोकरी जाहिराती पोस्ट करा",
              "सत्यापित कामगारांची थेट संपर्क माहिती",
              "उमेदवार ट्रॅकिंग व मुलाखत व्यवस्थापन",
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

        {/* Footer */}
        <div className="relative z-10 pt-8 mt-8 border-t border-white/10 text-[11px] font-semibold text-white/60">
          © 2026 REAL JOB Admin Portal. All rights reserved.
        </div>
      </div>

      {/* ── RIGHT LOGIN FORM AREA ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-10">
        {/* Top Header Navigation */}
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

        {/* Center Login Form Container */}
        <div className="mx-auto w-full max-w-md my-auto py-4">
          <div className="bg-white rounded-3xl border border-[#DCE5F0] p-6 sm:p-8 shadow-xl space-y-6">
            {/* Header Badge & Title */}
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 bg-[#FFC400]/20 text-[#082F63] text-[11px] font-black px-3 py-1 rounded-full">
                🛡️ मालक / ॲडमिन पोर्टल (Employer / Admin Portal)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#10233F]">
                कंपनी / ॲडमिन लॉगिन (Employer / Admin Login)
              </h2>
              <p className="text-xs font-semibold text-[#5B6B7F]">
                कंपन्या व रिक्रुटर्ससाठी: नवीन कामगार भरती आणि अर्ज व्यवस्थापनासाठी लॉगिन करा.
              </p>
            </div>

            {/* Login / Switch Role Tab */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F5F8FC] border border-[#DCE5F0]">
              <button
                type="button"
                className="py-2.5 rounded-xl font-black text-xs bg-[#063B78] text-white shadow-xs"
              >
                ॲडमिन लॉगिन (Admin)
              </button>
              <Link
                to="/user/login"
                className="py-2.5 rounded-xl font-bold text-xs text-[#5B6B7F] text-center hover:text-[#10233F] transition-colors"
              >
                युझर लॉगिन (User)
              </Link>
            </div>

            {/* Demo Shortcut Banner */}
            <div className="bg-[#FFC400]/15 border border-[#FFC400]/40 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-black text-[#082F63]">Demo Recruiter Credentials:</p>
                <p className="font-semibold text-[#5B6B7F]">admin@realjob.in / admin123</p>
              </div>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="bg-[#063B78] text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg hover:bg-[#082F63]"
              >
                Auto Fill
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#10233F] mb-1">
                  ॲडमिन ईमेल (Admin Email Address) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@realjob.in"
                  className="w-full h-11 px-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78] focus:ring-2 focus:ring-[#063B78]/20 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#10233F]">
                    पासवर्ड (Password) *
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info("Use demo password admin123")}
                    className="text-[11px] font-bold text-[#063B78] hover:underline"
                  >
                    पासवर्ड विसरलात? (Forgot?)
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 pr-10 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78] focus:ring-2 focus:ring-[#063B78]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6B7F] hover:text-[#10233F]"
                  >
                    {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember-admin"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 accent-[#063B78] rounded cursor-pointer"
                />
                <label htmlFor="remember-admin" className="text-xs font-semibold text-[#5B6B7F] cursor-pointer">
                  माझी माहिती लक्षात ठेवा (Remember me)
                </label>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#063B78] hover:bg-[#082F63] text-white font-black text-xs rounded-xl shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="size-4 text-[#FFC400]" />
                <span>{loading ? "प्रमाणित करत आहे..." : "ॲडमिन लॉगिन करा (Admin Sign In)"}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative text-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#DCE5F0]" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-bold text-[#5B6B7F]">
                किंवा (or)
              </span>
            </div>

            {/* Switch to User Login */}
            <Link
              to="/user/login"
              className="w-full h-11 border border-[#DCE5F0] bg-white hover:bg-[#F5F8FC] text-[#10233F] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <span>उमेदवार / कामगार आहात का? युझर लॉगिन करा →</span>
            </Link>
          </div>
        </div>

        <div />
      </div>
    </div>
  );
}
