import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  Building2,
  Camera,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Phone,
  RotateCcw,
  Upload,
  User,
  UserPlus,
  X,
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
  const { lang } = useI18n();

  const [mode, setMode] = useState<"login" | "register" | "forgot">((search.mode as any) || "login");
  const [role, setRole] = useState<"worker" | "employer" | "admin" | "employee">((search.role as any) || "worker");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Common credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  // WebCam Camera state
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [tempCaptured, setTempCaptured] = useState<string | null>(null);

  // Clear inputs on mode or role change
  useEffect(() => {
    setEmail("");
    setPassword("");
    setProfilePhoto("");
    if (role === "employee") {
      setMode("login");
    }
  }, [mode, role]);

  // Handle live camera stream attachment when camera open
  useEffect(() => {
    if (cameraOpen && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [cameraOpen, mediaStream]);

  const startCamera = async () => {
    try {
      setTempCaptured(null);
      setCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      setMediaStream(stream);
    } catch (err) {
      toast.error(lang === "mr" ? "कॅमेरा उघडता आला नाही! कृपया कॅमेरा परवानगी तपासा." : "Could not open camera. Please check camera permissions.");
      setCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    setCameraOpen(false);
    setTempCaptured(null);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setTempCaptured(dataUrl);
      }
    }
  };

  const confirmCapturedPhoto = () => {
    if (tempCaptured) {
      setProfilePhoto(tempCaptured);
      toast.success(lang === "mr" ? "फोटो कॅमेऱ्यातून यशस्वीरीत्या घेतला!" : "Photo captured successfully!");
    }
    stopCamera();
  };

  // Worker registration extra fields
  const [workerName, setWorkerName] = useState("");
  const [workerPhone, setWorkerPhone] = useState("");

  // Employer registration extra fields
  const [companyName, setCompanyName] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          profilePhoto: profilePhoto || "",
        });

        const userObj = {
          id: registeredAccount.id,
          email: registeredAccount.email,
          role: registeredAccount.role,
          fullName: registeredAccount.fullName || "User",
          mobile: registeredAccount.mobile || userMobile || "",
          profilePhoto: registeredAccount.profilePhoto || profilePhoto || "",
        };

        window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
        dataStore.setCurrentUser(userObj);
        toast.success("✅ खाते यशस्वीरित्या तयार झाले! Welcome to REAL JOB.");
        if (role === "admin" || role === "employer") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/dashboard", search: { tab: "overview" }, replace: true });
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

      let existingAccount: any = undefined;
      
      if (role === "employee") {
         // for employee, enteredEmail is actually their mobile number
         const searchMobile = enteredEmail.replace(/\D/g, "");
         const allEmployerWorkers = (dataStore as any).getAllEmployerWorkers ? (dataStore as any).getAllEmployerWorkers() : [];
         
         // In employee login case, existingAccount becomes the EmployerWorker object
         existingAccount = allEmployerWorkers.find((w: any) => w.mobile?.replace(/\D/g, "") === searchMobile);
         
         if (existingAccount) {
            // Compare the entered password (PIN) with worker's PIN
            const workerPin = existingAccount.pin || "1234"; // fallback to 1234 if pin wasn't saved initially
            if (password !== workerPin) {
               toast.error("❌ चुकीचा पासकोड! (Wrong PIN. Please enter correct PIN.)");
               setBusy(false);
               return;
            }
         }
      } else {
         existingAccount = dataStore.findRegisteredAccount(enteredEmail);
         
         if (existingAccount) {
           // Strictly match password — even if stored password is empty, entered must match exactly
           if (existingAccount.password !== password) {
             toast.error("❌ चुकीचा पासवर्ड! (Wrong password. Please enter correct password.)");
             setBusy(false);
             return;
           }
         }
      }

      if (existingAccount) {
        const userObj: any = {
          id: existingAccount.id,
          employerId: existingAccount.employerId || "",
          email: existingAccount.email || `${existingAccount.mobile}@employee.local`,
          role: role === "employee" ? "employee" : (role === "admin" ? "employer" : role) as any,
          fullName: existingAccount.fullName || existingAccount.name || "User",
          mobile: existingAccount.mobile || "",
          profilePhoto: existingAccount.profilePhoto || "",
          locationType: existingAccount.locationType || "fixed",
          attendanceMode: existingAccount.attendanceMode || "punch",
        };

        window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
        dataStore.setCurrentUser(userObj);
        toast.success(`✅ स्वागत आहे, ${existingAccount.fullName}! Welcome back.`);
        const isEmpOrAdmin = userObj.role === "employer" || userObj.role === "admin" || role === "admin" || role === "employer";
        if (isEmpOrAdmin) {
          navigate({ to: "/admin" });
        } else if (userObj.role === "employee" || role === "employee") {
          navigate({ to: "/employee-dashboard" as any });
        } else {
          navigate({ to: "/dashboard", search: { tab: "overview" }, replace: true });
        }
      } else {
        toast.error("❌ खाते अस्तित्वात नाही! कृपया प्रथम नोंदणी (Register) करा.");
        setBusy(false);
        return;
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
          <Link to="/" hash="main" replace={true} onClick={() => window.scrollTo(0, 0)}>
            <ArrowLeft className="mr-1 size-3.5" /> Home
          </Link>
        </Button>
      </div>



      {/* Centered Frosted Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md sm:max-w-[420px] max-h-[92vh] overflow-y-auto bg-white/85 backdrop-blur-xl rounded-2xl border border-white/80 shadow-2xl px-5 py-4 sm:px-6 sm:py-5 transition-all duration-300">

        {/* Top Logo */}
        <div className="flex justify-center mb-1.5">
          <LogoIcon className="h-9 sm:h-10 object-contain" />
        </div>

        {/* Title Header (Strictly English) */}
        <div className="text-center space-y-0.5 mb-2">
          <h1 className="text-lg sm:text-xl font-black text-[#0A3B7B] tracking-tight leading-tight">
            {role === "admin"
              ? mode === "register"
                ? "Employer / Admin Registration"
                : mode === "forgot"
                  ? "Reset Password"
                  : "Employer / Admin Login"
              : role === "employee"
                ? "Employee Login"
              : mode === "register"
                ? "Worker / User Registration"
                : mode === "forgot"
                  ? "Reset Password"
                  : "Worker / User Login"}
          </h1>

          <p className="text-[10px] sm:text-[11px] font-semibold text-gray-600 px-1 leading-tight">
            {role === "admin"
              ? mode === "register"
                ? "For employers & companies: Register an account to find workers."
                : "For employers & admins: Login to post jobs and search candidates."
              : role === "employee"
                ? "For existing factory employees: Enter mobile number & PIN to punch in."
              : mode === "register"
                ? "For job seekers: Create a new profile and start finding jobs."
                : "Please enter your email and password to log in and find jobs."}
          </p>
        </div>

        {/* Mode Pill Toggle (Login / Register) */}
        {mode !== "forgot" && role !== "employee" && (
          <div className="bg-gray-200/80 backdrop-blur-md p-1 rounded-full border border-white/70 flex items-center shadow-inner mb-2.5">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-1 rounded-full text-[11px] font-black transition-all duration-200 flex items-center justify-center gap-1.5 ${mode === "login"
                ? "bg-[#0A3B7B] text-white shadow-md shadow-[#0A3B7B]/30"
                : "text-gray-700 hover:text-black font-bold"
                }`}
            >
              <User className="size-3.5" /> Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-1 rounded-full text-[11px] font-black transition-all duration-200 flex items-center justify-center gap-1.5 ${mode === "register"
                ? "bg-[#0A3B7B] text-white shadow-md shadow-[#0A3B7B]/30"
                : "text-gray-700 hover:text-black font-bold"
                }`}
            >
              <UserPlus className="size-3.5" /> Register
            </button>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-2.5">

          {/* WORKER REGISTRATION FIELDS */}
          {mode === "register" && role === "worker" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] sm:text-[11px] font-extrabold text-gray-800 mb-0.5 block">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    required
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Rahul Sharma"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    className="w-full h-8.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[10px] sm:text-[11px] font-extrabold text-gray-800 mb-0.5 block">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    required
                    type="tel"
                    autoComplete="off"
                    placeholder="+91 98220 00000"
                    value={workerPhone}
                    onChange={(e) => setWorkerPhone(e.target.value)}
                    className="w-full h-8.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* EMPLOYER REGISTRATION FIELDS */}
          {mode === "register" && (role === "employer" || role === "admin") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] sm:text-[11px] font-extrabold text-gray-800 mb-0.5 block">Company Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    required
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Tata Motors / L&T"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-8.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[10px] sm:text-[11px] font-extrabold text-gray-800 mb-0.5 block">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input
                    required
                    type="tel"
                    autoComplete="off"
                    placeholder="+91 98220 00000"
                    value={employerPhone}
                    onChange={(e) => setEmployerPhone(e.target.value)}
                    className="w-full h-8.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PROFILE / COMPANY PHOTO UPLOAD & LIVE CAMERA FIELD */}
          {mode === "register" && (
            <div className="bg-blue-50/80 p-2 sm:p-2.5 rounded-xl border border-blue-100 space-y-1.5">
              <div className="flex items-center gap-2">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile Preview" className="size-9 rounded-full object-cover ring-2 ring-[#0A3B7B] shadow-xs" />
                ) : (
                  <div className="size-9 rounded-full bg-[#0A3B7B]/10 text-[#0A3B7B] flex items-center justify-center shrink-0 border border-[#0A3B7B]/20">
                    <Camera className="size-4" />
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-extrabold text-[#0A3B7B]">
                    {role === "employer" || role === "admin" ? "Company Logo / Photo" : "Profile Photo (प्रोफाईल फोटो)"}
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold">
                    {profilePhoto ? "✓ Photo Attached" : "Choose file or take live camera photo"}
                  </p>
                </div>
              </div>

              {/* Action Buttons: 1. Upload File 2. Live Camera */}
              <div className="flex items-center gap-2 pt-0.5">
                <label className="flex-1 py-1 px-2 rounded-lg bg-[#0A3B7B] text-white text-[10px] sm:text-[11px] font-black cursor-pointer hover:bg-[#072B5B] transition-colors shadow-xs flex items-center justify-center gap-1">
                  <Upload className="size-3" /> {profilePhoto ? "Change" : "Upload File"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 py-1 px-2 rounded-lg bg-emerald-700 text-white text-[10px] sm:text-[11px] font-black hover:bg-emerald-800 transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Camera className="size-3" /> {lang === "mr" ? "कॅमेरा उघडा" : "Take Photo"}
                </button>
              </div>
            </div>
          )}

          {/* EMAIL OR MOBILE FIELD */}
          <div>
            <Label htmlFor="email" className="text-[10px] sm:text-[11px] font-extrabold text-gray-800 mb-0.5 block">
              {role === "employee" 
                ? "Mobile Number (मोबाईल नंबर) *"
                : mode === "login" 
                  ? "Email Address or Mobile Number *" 
                  : "Email Address (Optional / ऐच्छिक)"}
            </Label>
            <div className="relative">
              {mode === "login" && /^\d+$/.test(email.replace(/\D/g, "")) && email.length >= 5 ? (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#0A3B7B]" />
              ) : (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
              )}
              <input
                id="email"
                type={mode === "login" || role === "employee" ? "text" : "email"}
                required={mode === "login" || role === "employee"}
                autoComplete="off"
                placeholder={role === "employee" ? "e.g. 98220 00000" : mode === "login" ? "Email or Mobile (e.g. 98220 00000 / user@gmail.com)" : "name@example.com (Optional)"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-8.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-0.5">
                <Label htmlFor="password" className="text-[11px] font-extrabold text-gray-800">
                  {role === "employee" ? "4-Digit PIN (पासकोड) *" : "Password *"}
                </Label>
                {mode === "login" && role !== "employee" && (
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
                  placeholder={role === "employee" ? "e.g. 1234" : "••••••••"}
                  minLength={role === "employee" ? 4 : 6}
                  maxLength={role === "employee" ? 4 : undefined}
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

      {/* Live WebCam Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-[#051B38]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-white/40 flex flex-col items-center animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-[#0A3B7B]/10 text-[#0A3B7B] flex items-center justify-center">
                  <Camera className="size-4" />
                </div>
                <span className="font-black text-sm text-[#0A3B7B]">
                  {lang === "mr" ? "थेट फोटो काढा (Take Photo)" : "Live Camera Capture"}
                </span>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Video Stream or Captured Preview */}
            <div className="relative size-64 sm:size-72 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner border-2 border-[#0A3B7B]">
              {tempCaptured ? (
                <img src={tempCaptured} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full flex items-center justify-center gap-3 mt-5">
              {tempCaptured ? (
                <>
                  <button
                    type="button"
                    onClick={() => setTempCaptured(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="size-4" /> {lang === "mr" ? "पुन्हा काढा (Retake)" : "Retake"}
                  </button>
                  <button
                    type="button"
                    onClick={confirmCapturedPhoto}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="size-4" /> {lang === "mr" ? "फोटो वापरा (Use Photo)" : "Use Photo"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-3 rounded-full bg-[#0A3B7B] hover:bg-[#072B5B] text-white text-xs font-black shadow-lg shadow-[#0A3B7B]/30 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                >
                  <Camera className="size-4" /> 📷 {lang === "mr" ? "फोटो काढा (Snap Photo)" : "Snap Photo"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
