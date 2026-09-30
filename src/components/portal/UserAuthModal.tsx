import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Lock, Mail, User, Phone, CheckCircle2, Sparkles, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  redirectTo?: string | undefined;
}

export function UserAuthModal({ isOpen, onClose, initialMode = "login", redirectTo }: UserAuthModalProps) {
  const { login } = useAuth();
  const { lang } = useI18n();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("user@realjob.in");
  const [password, setPassword] = useState("user123");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || typeof window === "undefined") return null;

  const handleAutoFill = () => {
    setEmail("user@realjob.in");
    setPassword("user123");
    toast.success(lang === "mr" ? "डेमो माहिती भरली!" : "Demo credentials auto-filled!");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success(lang === "mr" ? "लॉगिन यशस्वी झाले!" : "Logged in successfully!");
        onClose();
        if (redirectTo) {
          navigate({ to: redirectTo as any });
        } else {
          navigate({ to: "/user/dashboard" });
        }
      } else {
        toast.error(res.error || (lang === "mr" ? "ईमेल किंवा पासवर्ड चुकीचा आहे." : "Invalid email or password."));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success(lang === "mr" ? "नोंदणी यशस्वी झाली! आता लॉगिन करत आहे..." : "Registration successful! Logging in...");
      // Auto login with demo
      login("user@realjob.in", "user123").then(() => {
        onClose();
        if (redirectTo) {
          navigate({ to: redirectTo as any });
        } else {
          navigate({ to: "/user/dashboard" });
        }
      });
    }, 600);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-[#082F63]/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col bg-white rounded-3xl border border-[#DCE5F0] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Modal Header Bar */}
        <div className="bg-gradient-to-r from-[#063B78] to-[#082F63] p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors cursor-pointer z-10"
          >
            <X className="size-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5 pr-8">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFC400] text-[#082F63] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="size-3" />
              {lang === "mr" ? "कामगार / युझर पोर्टल" : "Worker / User Portal"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white pr-8">
            {mode === "login"
              ? lang === "mr" ? "कामगार / युझर लॉगिन" : "Worker / User Login"
              : lang === "mr" ? "नवीन युझर नोंदणी" : "New Worker Registration"}
          </h2>
          <p className="text-xs font-semibold text-white/85 mt-1 pr-6 leading-relaxed">
            {lang === "mr"
              ? "नोकरी शोधण्यासाठी व अर्ज भरण्यासाठी लॉगिन करा."
              : "Login or register to browse jobs & apply directly."}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 mt-4 bg-black/20 p-1 rounded-xl backdrop-blur-xs border border-white/10">
            <button
              onClick={() => setMode("login")}
              className={`py-2 text-xs font-black rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white text-[#063B78] shadow-md scale-[1.02]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {lang === "mr" ? "लॉगिन (Login)" : "Login"}
            </button>
            <button
              onClick={() => setMode("register")}
              className={`py-2 text-xs font-black rounded-lg transition-all ${
                mode === "register"
                  ? "bg-[#FFC400] text-[#082F63] shadow-md scale-[1.02]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {lang === "mr" ? "रजिस्टर (Register)" : "Register"}
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Demo Fill Box */}
              <div className="p-3 bg-[#FFFDF0] border border-[#FFC400]/40 rounded-xl flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-black text-[#10233F]">Demo Seeker Credentials:</p>
                  <p className="text-[10px] font-semibold text-[#5B6B7F]">user@realjob.in / user123</p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="bg-[#063B78] hover:bg-[#082F63] text-white font-black text-[10px] px-3 py-1.5 rounded-lg shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  Auto Fill
                </button>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-black text-[#10233F] mb-1">
                  {lang === "mr" ? "ईमेल (Email Address) *" : "Email Address *"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#5B6B7F]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@realjob.in"
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] text-xs font-bold text-[#10233F] focus:outline-none focus:border-[#063B78] focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black text-[#10233F]">
                    {lang === "mr" ? "पासवर्ड (Password) *" : "Password *"}
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info(lang === "mr" ? "पासवर्ड रिसेट लिंक पाठवली आहे!" : "Password reset link sent!")}
                    className="text-[10px] font-bold text-[#125BB5] hover:underline"
                  >
                    {lang === "mr" ? "पासवर्ड विसरलात?" : "Forgot Password?"}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#5B6B7F]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-9 pr-10 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] text-xs font-bold text-[#10233F] focus:outline-none focus:border-[#063B78] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6B7F] hover:text-[#10233F]"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#DCE5F0] text-[#063B78] focus:ring-0"
                />
                <label htmlFor="remember" className="text-xs font-bold text-[#5B6B7F] cursor-pointer">
                  {lang === "mr" ? "माझी माहिती लक्षात ठेवा (Remember me)" : "Remember me"}
                </label>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#063B78] hover:bg-[#082F63] text-white font-black text-xs h-11 rounded-xl shadow-md transition-all cursor-pointer"
              >
                {loading ? "Logging in..." : lang === "mr" ? "लॉगिन करा (Sign In)" : "Sign In"}
              </Button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-[#DCE5F0] w-full" />
                <span className="bg-white px-3 text-[10px] font-bold text-[#5B6B7F] uppercase tracking-wider absolute">
                  {lang === "mr" ? "किंवा" : "or"}
                </span>
              </div>

              {/* Google login mock */}
              <button
                type="button"
                onClick={handleAutoFill}
                className="w-full border border-[#DCE5F0] bg-white hover:bg-[#F5F8FC] text-[#10233F] font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google द्वारे सुरू ठेवा</span>
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-[#10233F] mb-1">
                  {lang === "mr" ? "पूर्ण नाव (Full Name) *" : "Full Name *"}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#5B6B7F]" />
                  <input
                    type="text"
                    required
                    placeholder="Rahul Pawar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] text-xs font-bold text-[#10233F] focus:outline-none focus:border-[#063B78] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#10233F] mb-1">
                  {lang === "mr" ? "ईमेल (Email Address) *" : "Email Address *"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#5B6B7F]" />
                  <input
                    type="email"
                    required
                    placeholder="rahul@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] text-xs font-bold text-[#10233F] focus:outline-none focus:border-[#063B78] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#10233F] mb-1">
                  {lang === "mr" ? "मोबाईल नंबर (Mobile Number) *" : "Mobile Number *"}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#5B6B7F]" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98220 00000"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] text-xs font-bold text-[#10233F] focus:outline-none focus:border-[#063B78] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#10233F] mb-1">
                  {lang === "mr" ? "पासवर्ड (Password) *" : "Password *"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#5B6B7F]" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] text-xs font-bold text-[#10233F] focus:outline-none focus:border-[#063B78] focus:bg-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFC400] hover:bg-yellow-400 text-[#082F63] font-black text-xs h-11 rounded-xl shadow-md transition-all mt-2 cursor-pointer"
              >
                {loading ? "Creating Account..." : lang === "mr" ? "नोंदणी करा (Register Now)" : "Register Now"}
              </Button>
            </form>
          )}

          {/* Footer note */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#5B6B7F]">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>100% Verified & Safe • Zero Commission</span>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}
