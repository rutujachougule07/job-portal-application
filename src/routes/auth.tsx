import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  Check,
  Eye,
  EyeOff,
  HardHat,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { lovable } from "@/integrations/lovable";
import { Brand } from "@/components/portal/Brand";
import { LanguageSwitcher } from "@/components/portal/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

const searchSchema = z.object({
  mode: z.enum(["login", "register", "forgot"]).optional().default("login"),
  role: z.enum(["worker", "employer", "admin"]).optional().default("worker"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Login or Register — REAL JOB" },
      { name: "description", content: "Access worker profiles, post jobs, and manage job applications on REAL JOB." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  const [mode, setMode] = useState<"login" | "register" | "forgot">(search.mode || "login");
  const [role, setRole] = useState<"worker" | "employer" | "admin">(search.role || "worker");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Common credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Worker registration extra fields
  const [workerName, setWorkerName] = useState("");
  const [workerPhone, setWorkerPhone] = useState("");
  const [workerProfession, setWorkerProfession] = useState("Senior Electrician");
  const [workerLocation, setWorkerLocation] = useState("");
  const [workerExperience, setWorkerExperience] = useState("3-5 Years");
  const [workerSalary, setWorkerSalary] = useState("₹25,000 / month");
  const [workerAvailability, setWorkerAvailability] = useState("Available Now");

  // Employer registration extra fields
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");
  const [employerLocation, setEmployerLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    setTimeout(() => {
      setBusy(false);

      if (mode === "forgot") {
        toast.success("Password reset email sent! Check your inbox.");
        return;
      }

      if (mode === "register") {
        const fullName = role === "employer" ? contactPerson || companyName : workerName;
        window.localStorage.setItem(
          "realjob-user",
          JSON.stringify({ email, fullName, role, registeredAt: new Date().toISOString() })
        );
        toast.success("Account created successfully! Welcome to REAL JOB.");
        navigate({ to: role === "employer" || role === "admin" ? "/employer" : "/dashboard" });
        return;
      }

      // Login Mode
      window.localStorage.setItem(
        "realjob-user",
        JSON.stringify({ email, role, loggedInAt: new Date().toISOString() })
      );
      toast.success("Successfully logged in!");
      navigate({ to: role === "employer" || role === "admin" ? "/employer" : "/dashboard" });
    }, 1000);
  };

  const handleGoogleAuth = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: { prompt: "select_account" },
    });
    if (result.error) {
      toast.error(result.error.message);
      setBusy(false);
    } else if (!result.redirected) {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[0.85fr_1.15fr] bg-[#F5F8FC]">
      {/* Left Branding Column */}
      <section className="hidden bg-hero-overlay p-10 text-white lg:flex lg:flex-col justify-between relative overflow-hidden">
        <Brand showTagline={true} />

        <div className="my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur">
            ★ योग्य माणूस • योग्य काम • योग्य संधी
          </div>

          <h1 className="font-display text-4xl font-black leading-tight text-white">
            भारतातील १ नंबर कामगार व नोकरी मंच
          </h1>

          <p className="text-sm font-semibold text-white/90 leading-relaxed">
            हजारो कारखाने, बांधकाम कंपन्या आणि कामगारांशी थेट संपर्क साधा. कोणतेही कमिशन नाही.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "१००% सत्यापित कामगार व मालक प्रोफाईल",
              "थेट फोन किंवा व्हॉट्सॲपवर संपर्क",
              "मराठी, हिंदी व इंग्रजी भाषेत उपलब्ध",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-bold text-white">
                <span className="grid size-5 place-items-center rounded-full bg-[#FFC400] text-[#082F63]">
                  <Check className="size-3 stroke-[3]" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs font-bold text-white/70">
          © 2026 REAL JOB. All rights reserved.
        </div>
      </section>

      {/* Right Form Column */}
      <section className="relative flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="absolute left-4 top-4">
          <Button asChild variant="ghost" size="sm" className="font-bold text-[#063B78]">
            <Link to="/"><ArrowLeft className="mr-1.5 size-4" /> मुख्य पृष्ठ (Home)</Link>
          </Button>
        </div>

        <div className="absolute right-4 top-4">
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-lg bg-white p-8 rounded-2xl border border-[#DCE5F0] shadow-md my-8">
          <div className="mb-6 lg:hidden">
            <Brand />
          </div>

          {/* Title Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#10233F]">
              {mode === "register" ? "नवीन खाते तयार करा (Register)" : mode === "forgot" ? "पासवर्ड रीसेट करा" : "लॉगिन करा (Login)"}
            </h1>
            <p className="mt-1 text-xs font-semibold text-[#5B6B7F]">
              {mode === "register"
                ? "REAL JOB वर नवीन प्रोफाईल नोंदवा व कामाला सुरुवात करा."
                : "तुमचे ईमेल व पासवर्ड प्रविष्ट करून पुढे जा."}
            </p>
          </div>

          {/* Mode & Role Switchers */}
          {mode !== "forgot" && (
            <div className="mb-6 space-y-3">
              {/* Login / Register Toggle */}
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F5F8FC] p-1 border border-[#DCE5F0]">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`py-2 text-xs font-black rounded-lg transition-all ${
                    mode === "login" ? "bg-[#063B78] text-white shadow-xs" : "text-[#5B6B7F]"
                  }`}
                >
                  लॉगिन (Login)
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`py-2 text-xs font-black rounded-lg transition-all ${
                    mode === "register" ? "bg-[#063B78] text-white shadow-xs" : "text-[#5B6B7F]"
                  }`}
                >
                  रजिस्टर (Register)
                </button>
              </div>

              {/* Worker / Employer Role Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("worker")}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                    role === "worker"
                      ? "border-[#063B78] bg-[#EBF1F8] text-[#063B78]"
                      : "border-[#DCE5F0] text-[#5B6B7F]"
                  }`}
                >
                  <HardHat className="size-4 text-[#FFC400]" />
                  मला काम पाहिजे (Worker)
                </button>

                <button
                  type="button"
                  onClick={() => setRole("employer")}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                    role === "employer"
                      ? "border-[#063B78] bg-[#EBF1F8] text-[#063B78]"
                      : "border-[#DCE5F0] text-[#5B6B7F]"
                  }`}
                >
                  <Building2 className="size-4 text-[#125BB5]" />
                  मला कामगार पाहिजे (Employer)
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* WORKER REGISTRATION FIELDS */}
            {mode === "register" && role === "worker" && (
              <>
                <div>
                  <Label className="text-xs font-extrabold text-[#10233F]">पूर्ण नाव (Full Name) *</Label>
                  <Input
                    required
                    placeholder="उदा. रमेश मारुती पवार"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    className="mt-1 h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-extrabold text-[#10233F]">मोबाईल नंबर (Mobile) *</Label>
                    <Input
                      required
                      type="tel"
                      placeholder="+91 98220 00000"
                      value={workerPhone}
                      onChange={(e) => setWorkerPhone(e.target.value)}
                      className="mt-1 h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-extrabold text-[#10233F]">व्यवसाय (Profession) *</Label>
                    <select
                      value={workerProfession}
                      onChange={(e) => setWorkerProfession(e.target.value)}
                      className="mt-1 w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                    >
                      <option value="Senior Electrician">Electrician (इलेक्ट्रीशियन)</option>
                      <option value="CNC Operator">CNC / VMC Operator</option>
                      <option value="Welder">Welder (वेल्डर)</option>
                      <option value="Driver">Heavy Commercial Driver</option>
                      <option value="Mason">Mason / गवंडी</option>
                      <option value="Factory Helper">Factory Helper / मजूर</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-extrabold text-[#10233F]">ठिकाण (City / Location) *</Label>
                    <Input
                      required
                      placeholder="उदा. चाकण, पुणे"
                      value={workerLocation}
                      onChange={(e) => setWorkerLocation(e.target.value)}
                      className="mt-1 h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-extrabold text-[#10233F]">कामाचा अनुभव (Experience)</Label>
                    <select
                      value={workerExperience}
                      onChange={(e) => setWorkerExperience(e.target.value)}
                      className="mt-1 w-full h-11 rounded-lg border border-[#DCE5F0] bg-white px-3 text-xs font-bold text-[#10233F]"
                    >
                      <option value="Fresher">नवीन (Fresher)</option>
                      <option value="1-3 Years">1-3 वर्षे</option>
                      <option value="3-5 Years">3-5 वर्षे</option>
                      <option value="5+ Years">5+ वर्षे</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* EMPLOYER REGISTRATION FIELDS */}
            {mode === "register" && role === "employer" && (
              <>
                <div>
                  <Label className="text-xs font-extrabold text-[#10233F]">कंपनीचे नाव (Company Name) *</Label>
                  <Input
                    required
                    placeholder="उदा. ओम साई इंडस्ट्रीज लि."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-extrabold text-[#10233F]">संपर्क व्यक्तीचे नाव (Contact Person) *</Label>
                    <Input
                      required
                      placeholder="उदा. राजेश पाटील (HR)"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="mt-1 h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-extrabold text-[#10233F]">मोबाईल नंबर (Mobile) *</Label>
                    <Input
                      required
                      type="tel"
                      placeholder="+91 98900 11223"
                      value={employerPhone}
                      onChange={(e) => setEmployerPhone(e.target.value)}
                      className="mt-1 h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-extrabold text-[#10233F]">कंपनीचे ठिकाण (Company Location) *</Label>
                  <Input
                    required
                    placeholder="उदा. एमआयडीसी भोसरी, पुणे"
                    value={employerLocation}
                    onChange={(e) => setEmployerLocation(e.target.value)}
                    className="mt-1 h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                </div>
              </>
            )}

            {/* COMMON EMAIL FIELD */}
            <div>
              <Label htmlFor="email" className="text-xs font-extrabold text-[#10233F]">ईमेल (Email Address) *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-11 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
              />
            </div>

            {/* COMMON PASSWORD FIELD */}
            {mode !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="password" className="text-xs font-extrabold text-[#10233F]">पासवर्ड (Password) *</Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs font-bold text-[#125BB5] hover:underline"
                    >
                      पासवर्ड विसरलात? (Forgot?)
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 border-[#DCE5F0] text-xs font-bold text-[#10233F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6B7F]"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me Checkbox */}
            {mode === "login" && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#DCE5F0] text-[#063B78] accent-[#063B78]"
                />
                <label htmlFor="remember" className="text-xs font-bold text-[#5B6B7F]">
                  माझी माहिती लक्षात ठेवा (Remember me)
                </label>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <Button
              disabled={busy}
              type="submit"
              className="w-full btn-yellow font-black text-xs h-12 mt-2 shadow-sm"
            >
              {busy ? (
                <Loader2 className="animate-spin size-4" />
              ) : mode === "register" ? (
                "नोंदणी करा (Register Account)"
              ) : mode === "forgot" ? (
                "रीसेट लिंक पाठवा (Send Reset Link)"
              ) : (
                "लॉगिन करा (Sign In)"
              )}
            </Button>
          </form>

          {/* Social Auth */}
          {mode !== "forgot" && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-[#5B6B7F]">
                <span className="h-px flex-1 bg-[#DCE5F0]" />
                किंवा (or)
                <span className="h-px flex-1 bg-[#DCE5F0]" />
              </div>

              <Button
                disabled={busy}
                onClick={handleGoogleAuth}
                variant="outline"
                className="w-full h-11 border-[#063B78] text-[#063B78] font-bold text-xs hover:bg-[#EBF1F8]"
              >
                <span className="font-black text-[#FFC400] text-sm mr-2">G</span> Google द्वारे सुरू ठेवा
              </Button>
            </>
          )}

          {/* Bottom Switcher */}
          <div className="mt-6 text-center text-xs font-bold text-[#5B6B7F]">
            {mode === "register" ? "आधीच खाते आहे का?" : "नवीन अकाऊंट तयार करायचे आहे का?"}{" "}
            <button
              onClick={() => setMode(mode === "register" ? "login" : "register")}
              className="text-[#063B78] font-black hover:underline ml-1"
            >
              {mode === "register" ? "येथे लॉगिन करा" : "येथे रजिस्टर करा"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
