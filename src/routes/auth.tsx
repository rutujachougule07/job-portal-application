import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Phone,
  User,
  UserPlus,
} from "lucide-react";
import { LogoIcon } from "@/components/portal/Brand";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { dataStore } from "@/lib/data-store";

const searchSchema = z.object({
  mode: z.string().optional().catch("login"),
  role: z.string().optional().catch("worker"),
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

  const [mode, setMode] = useState<"login" | "register" | "forgot">((search.mode as any) || "login");
  const [role, setRole] = useState<"worker" | "employer" | "admin">((search.role as any) || "worker");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Common credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Clear inputs on mode or role change
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, [mode, role]);

  // Worker registration extra fields
  const [workerName, setWorkerName] = useState("");
  const [workerPhone, setWorkerPhone] = useState("");

  // Employer registration extra fields
  const [companyName, setCompanyName] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      if (mode === "forgot") {
        const { getAuth, sendPasswordResetEmail } = await import("firebase/auth");
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent! Check your inbox.");
        setMode("login");
        setBusy(false);
        return;
      }

      if (mode === "register") {
        const rawName = role === "employer" || role === "admin" ? companyName : workerName;
        const userMobile = (role === "employer" || role === "admin") ? employerPhone : workerPhone;
        let finalEmail = email.trim().toLowerCase();
        if (!finalEmail && userMobile) {
          finalEmail = `${userMobile.replace(/\D/g, "")}@realjob.com`;
        }
        const nameString = (rawName && rawName.trim()) ? rawName.trim() : (finalEmail ? (finalEmail.split("@")[0] || "User") : "User");

        const registeredAccount = dataStore.registerAccount({
          email: finalEmail,
          password,
          role: role === "admin" ? "employer" : role,
          fullName: nameString,
          mobile: userMobile || "",
        });

        const userObj = {
          id: registeredAccount.id,
          email: registeredAccount.email,
          role: registeredAccount.role,
          fullName: registeredAccount.fullName || "User",
          mobile: registeredAccount.mobile || userMobile || "",
        };

        window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
        dataStore.setCurrentUser(userObj);
        toast.success("✅ खाते यशस्वीरित्या तयार झाले! Welcome to REAL JOB.");
        if (role === "admin" || role === "employer") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/home" });
        }
        setBusy(false);
        return;
      }

      // ── LOGIN MODE ──
      const enteredEmail = email.trim().toLowerCase();

      if (enteredEmail === "supera@gmail.com" || enteredEmail === "superadmin") {
        // Super Admin Master Account
        const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import("firebase/auth");
        const auth = getAuth();
        let uid = "superadmin-uid";

        try {
          const credential = await signInWithEmailAndPassword(auth, "supera@gmail.com", password);
          uid = credential.user.uid;
        } catch (signInErr: any) {
          const errCode = signInErr?.code || "";
          if ((errCode === "auth/user-not-found" || errCode === "auth/invalid-credential") && password === "supera123") {
            try {
              const newCred = await createUserWithEmailAndPassword(auth, "supera@gmail.com", password);
              uid = newCred.user.uid;
            } catch {
              // fallback
            }
          } else if (password !== "supera123") {
            toast.error("❌ चुकीचा पासवर्ड! Super Admin password is 'supera123'.");
            setBusy(false);
            return;
          }
        }

        const userObj = {
          id: uid,
          email: "supera@gmail.com",
          role: "admin" as const,
          fullName: "Super Admin",
        };

        window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
        dataStore.setCurrentUser(userObj);
        toast.success("✅ Super Admin Login Successful!");
        navigate({ to: "/superadmin" });
        setBusy(false);
        return;
      }

      // Regular Employer / Worker Login with registered Email & Password
      const existingAccount = dataStore.findRegisteredAccount(enteredEmail);

      if (existingAccount) {
        if (existingAccount.password && existingAccount.password !== password) {
          toast.error("❌ चुकीचा पासवर्ड! (Wrong password. Please enter correct password.)");
          setBusy(false);
          return;
        }

        const userObj = {
          id: existingAccount.id,
          email: existingAccount.email,
          role: (role === "admin" ? "employer" : role) as any,
          fullName: existingAccount.fullName || "User",
          mobile: existingAccount.mobile || "",
        };

        window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
        dataStore.setCurrentUser(userObj);
        toast.success(`✅ स्वागत आहे, ${existingAccount.fullName}! Welcome back.`);
        const isEmpOrAdmin = userObj.role === "employer" || userObj.role === "admin" || role === "admin" || role === "employer";
        if (isEmpOrAdmin) {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/home" });
        }
      } else {
        // Auto-register new user on first login with entered credentials
        const newAcc = dataStore.registerAccount({
          email: enteredEmail,
          password: password,
          role: role === "admin" ? "employer" : role,
          fullName: enteredEmail.split("@")[0] || "Company Admin",
        });

        const userObj = {
          id: newAcc.id,
          email: newAcc.email,
          role: newAcc.role,
          fullName: newAcc.fullName || "Company Admin",
          mobile: newAcc.mobile || "",
        };

        window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
        dataStore.setCurrentUser(userObj);
        toast.success("✅ लॉगिन यशस्वी झाले! Welcome to REAL JOB!");
        const isEmpOrAdmin = userObj.role === "employer" || userObj.role === "admin" || role === "admin" || role === "employer";
        if (isEmpOrAdmin) {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/home" });
        }
      }
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("❌ चुकीचा पासवर्ड! Superadmin password is 'supera123'.");
      } else if (code === "auth/user-not-found") {
        toast.error("❌ हा यूझर सापडला नाही. User not found.");
      } else if (code === "auth/too-many-requests") {
        toast.error("⚠️ जास्त प्रयत्न झाले. Too many attempts. Try later.");
      } else {
        toast.error(`Login Failed: ${err?.message || "Unknown error"}`);
      }
    } finally {
      setBusy(false);
    }
  };



  return (
    <div
      className="h-screen w-full overflow-hidden relative flex items-center justify-center bg-cover bg-center bg-no-repeat p-3 sm:p-4"
      style={{
        backgroundImage: `url('/office_desk_bg.png')`,
      }}
    >
      {/* Background Soft Dark Overlay */}
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px] pointer-events-none" />

      {/* Top Left Floating Home Button */}
      <div className="absolute left-4 top-3.5 z-20">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="bg-white/85 hover:bg-white text-[#0A3B7B] font-bold text-xs rounded-full shadow-md backdrop-blur-md px-3.5 py-1.5 h-8 border border-white/70"
        >
          <Link to="/">
            <ArrowLeft className="mr-1 size-3.5" /> Home
          </Link>
        </Button>
      </div>



      {/* Centered Frosted Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md sm:max-w-[430px] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/80 shadow-2xl px-6 py-5 sm:px-8 sm:py-6 transition-all duration-300">

        {/* Top Logo */}
        <div className="flex justify-center mb-2">
          <LogoIcon className="h-11 sm:h-12 object-contain" />
        </div>

        {/* Title Header (Strictly English) */}
        <div className="text-center space-y-0.5 mb-3">
          <h1 className="text-xl sm:text-2xl font-black text-[#0A3B7B] tracking-tight leading-tight">
            {role === "admin"
              ? mode === "register"
                ? "Employer / Admin Registration"
                : mode === "forgot"
                  ? "Reset Password"
                  : "Employer / Admin Login"
              : mode === "register"
                ? "Worker / User Registration"
                : mode === "forgot"
                  ? "Reset Password"
                  : "Worker / User Login"}
          </h1>

          <p className="text-[11px] font-semibold text-gray-600 mt-1 px-2 leading-tight">
            {role === "admin"
              ? mode === "register"
                ? "For employers & companies: Register an account to find workers."
                : "For employers & admins: Login to post jobs and search candidates."
              : mode === "register"
                ? "For job seekers: Create a new profile and start finding jobs."
                : "Please enter your email and password to log in and find jobs."}
          </p>
        </div>

        {/* Mode Pill Toggle (Login / Register) */}
        {mode !== "forgot" && (
          <div className="bg-gray-200/80 backdrop-blur-md p-1 rounded-full border border-white/70 flex items-center shadow-inner mb-3">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 ${mode === "login"
                  ? "bg-[#0A3B7B] text-white shadow-md shadow-[#0A3B7B]/30"
                  : "text-gray-700 hover:text-black font-bold"
                }`}
            >
              <User className="size-3.5" /> Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 ${mode === "register"
                  ? "bg-[#0A3B7B] text-white shadow-md shadow-[#0A3B7B]/30"
                  : "text-gray-700 hover:text-black font-bold"
                }`}
            >
              <UserPlus className="size-3.5" /> Register
            </button>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">

          {/* WORKER REGISTRATION FIELDS */}
          {mode === "register" && role === "worker" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <Label className="text-[11px] font-extrabold text-gray-800 mb-0.5 block">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    required
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Rahul Sharma"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-extrabold text-gray-800 mb-0.5 block">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    required
                    type="tel"
                    autoComplete="off"
                    placeholder="+91 98220 00000"
                    value={workerPhone}
                    onChange={(e) => setWorkerPhone(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* EMPLOYER REGISTRATION FIELDS */}
          {mode === "register" && (role === "employer" || role === "admin") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <Label className="text-[11px] font-extrabold text-gray-800 mb-0.5 block">Company Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    required
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Tata Motors / L&T"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-extrabold text-gray-800 mb-0.5 block">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    required
                    type="tel"
                    autoComplete="off"
                    placeholder="+91 98220 00000"
                    value={employerPhone}
                    onChange={(e) => setEmployerPhone(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* EMAIL OR MOBILE FIELD */}
          <div>
            <Label htmlFor="email" className="text-[11px] font-extrabold text-gray-800 mb-0.5 block">
              {mode === "login" ? "Email Address or Mobile Number *" : "Email Address *"}
            </Label>
            <div className="relative">
              {mode === "login" && /^\d+$/.test(email.replace(/\D/g, "")) && email.length >= 5 ? (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#0A3B7B]" />
              ) : (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
              )}
              <input
                id="email"
                type={mode === "login" ? "text" : "email"}
                required
                autoComplete="off"
                placeholder={mode === "login" ? "Email or Mobile (e.g. 98220 00000 / user@gmail.com)" : "name@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-0.5">
                <Label htmlFor="password" className="text-[11px] font-extrabold text-gray-800">
                  Password *
                </Label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] font-bold text-[#0A3B7B] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-9.5 pl-9 pr-9 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* REMEMBER ME CHECKBOX */}
          {mode === "login" && (
            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-3.5 rounded border-gray-300 text-[#0A3B7B] focus:ring-[#0A3B7B] accent-[#0A3B7B] cursor-pointer"
              />
              <label htmlFor="remember" className="text-[11px] font-bold text-gray-700 cursor-pointer select-none">
                Remember me
              </label>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <Button
            disabled={busy}
            type="submit"
            className="w-full h-10 bg-[#0A3B7B] hover:bg-[#072B5B] text-white font-black text-xs rounded-lg shadow-md shadow-[#0A3B7B]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-1"
          >
            {busy ? (
              <Loader2 className="animate-spin size-4" />
            ) : mode === "register" ? (
              <>
                <UserPlus className="size-3.5" /> Register Account
              </>
            ) : mode === "forgot" ? (
              "Send Reset Link"
            ) : (
              <>
                <LogIn className="size-3.5" /> Sign In
              </>
            )}
          </Button>
        </form>

        {/* BOTTOM REGISTER LINK */}
        <div className="mt-3 text-center text-[11px] font-bold text-gray-600">
          {mode === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "register" ? "login" : "register")}
            className="text-[#0A3B7B] font-black hover:underline ml-1"
          >
            {mode === "register" ? "Sign In" : "Register"}
          </button>
        </div>

      </div>
    </div>
  );
}
