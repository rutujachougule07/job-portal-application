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
import { dataStore, type EmployerWorker } from "@/lib/data-store";
import { uploadFileToFirebaseStorage, uploadDataUrlToFirebaseStorage } from "@/lib/storage-service";

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

  // SYNC_SEARCH_PARAMS_EFFECT
  useEffect(() => {
    if (search.mode && (search.mode === "login" || search.mode === "register" || search.mode === "forgot")) {
      setMode(search.mode as any);
    }
    if (search.role) {
      const r = search.role.toLowerCase();
      if (r === "admin" || r === "employer" || r === "poster") {
        setRole("admin");
      } else if (r === "employee") {
        setRole("employee");
      } else {
        setRole("worker");
      }
    }
  }, [search.mode, search.role]);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      let u = dataStore.getCurrentUser();
      if (!u) {
        const raw = localStorage.getItem("realjob-user") || localStorage.getItem("realjob_db_user");
        if (raw) u = JSON.parse(raw);
      }
      if (u && (u.id || u.email)) {
        const r = (u.role || "").toLowerCase();
        if (r === "employer" || r === "admin" || r === "poster") {
          navigate({ to: "/admin", replace: true });
        } else if (r === "employee") {
          navigate({ to: "/employee-dashboard" as any, replace: true });
        } else if (r === "worker" || r === "seeker" || r === "user") {
          navigate({ to: "/dashboard", search: { tab: "overview" }, replace: true });
        }
      }
    } catch {}
  }, [navigate]);
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

  const confirmCapturedPhoto = async () => {
    if (tempCaptured) {
      stopCamera();
      const tId = toast.loading("Uploading photo to Firebase Storage...");
      try {
        const res = await uploadDataUrlToFirebaseStorage(tempCaptured, "profile-photos", `cam_${Date.now()}.jpg`);
        setProfilePhoto(res.downloadUrl);
        toast.dismiss(tId);
        toast.success(lang === "mr" ? "फोटो कॅमेऱ्यातून यशस्वीरीत्या घेतला!" : "Photo captured & uploaded successfully!");
      } catch {
        toast.dismiss(tId);
        setProfilePhoto(tempCaptured);
        toast.success(lang === "mr" ? "फोटो कॅमेऱ्यातून घेतला!" : "Photo captured successfully!");
      }
    } else {
      stopCamera();
    }
  };

  // Worker registration extra fields
  const [workerName, setWorkerName] = useState("");
  const [workerPhone, setWorkerPhone] = useState("");

  // Employer registration extra fields
  const [companyName, setCompanyName] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");

  // OTP Registration Verification
  const [showOtpField, setShowOtpField] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const [inputOtp, setInputOtp] = useState("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB");
        return;
      }
      const tId = toast.loading("Uploading photo to Firebase Storage...");
      try {
        const res = await uploadFileToFirebaseStorage(file, "profile-photos", `${Date.now()}_${file.name}`);
        setProfilePhoto(res.downloadUrl);
        toast.dismiss(tId);
        toast.success(res.isFirebaseStorage ? "✅ Photo uploaded to Firebase Storage!" : "✓ Photo attached!");
      } catch (err) {
        toast.dismiss(tId);
        toast.error("Failed to upload photo");
      }
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

        if (!showOtpField) {
          if (!userMobile || userMobile.length !== 10) {
            toast.error("Please enter a valid 10-digit mobile number for OTP verification.");
            setBusy(false);
            return;
          }

          // Generate 6-digit OTP
          const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
          setServerOtp(generatedOtp);

          const username = "Experts";
          const authkey = "ba9dcdcdfcXX";
          const senderId = "EXTSKL";
          const accusage = "1";
          let message = `Your Verification Code for login is ${generatedOtp}. - Expertskill Technology.`;
          message = message.split(" ").join("%20");
          
          const url = `https://mobicomm.dove-sms.com/submitsms.jsp?user=${username}&key=${authkey}&mobile=+91${userMobile}&message=${message}&accusage=${accusage}&senderid=${senderId}`;

          try {
            fetch(url)
              .then(res => res.text())
              .then(text => {
                console.log("SMS API Response:", text);
                if (text.toLowerCase().includes("success")) {
                  toast.success(`OTP sent! (Testing OTP: ${generatedOtp})`);
                } else {
                  toast.error(`SMS API Error: ${text}`);
                }
              })
              .catch(err => {
                console.error("SMS Fetch Error", err);
                toast.success(`OTP sent (Simulated). Testing OTP: ${generatedOtp}`);
              });
          } catch (err) {
            console.error("SMS API Error", err);
          }

          setShowOtpField(true);
          setBusy(false);
          return;
        }

        if (showOtpField) {
          if (inputOtp !== serverOtp) {
            toast.error("Invalid OTP! Please try again.");
            setBusy(false);
            return;
          }
        }

        // Proceed to save user if OTP verified
        let finalEmail = email.trim().toLowerCase();
        if (!finalEmail && userMobile) {
          finalEmail = `${userMobile.replace(/\D/g, "")}@realjob.com`;
        }
        const nameString = (rawName && rawName.trim()) ? rawName.trim() : (finalEmail ? (finalEmail.split("@")[0] || "User") : "User");

        const { getAuth, createUserWithEmailAndPassword } = await import("firebase/auth");
        const { getFirestore, doc, setDoc } = await import("firebase/firestore");
        const auth = getAuth();
        const db = getFirestore();

        const credential = await createUserWithEmailAndPassword(auth, finalEmail, password);
        const uid = credential.user.uid;

        let finalPhoto = profilePhoto || "";
        if (finalPhoto && finalPhoto.startsWith("data:")) {
          try {
            const res = await uploadDataUrlToFirebaseStorage(finalPhoto, "profile-photos", `${uid}_profile.jpg`);
            finalPhoto = res.downloadUrl;
          } catch (e) {
            console.warn("Storage upload fallback", e);
          }
        }

        const userObj = {
          id: uid,
          email: finalEmail,
          password, // Optionally keeping this if needed for local compatibility
          role: role === "admin" ? "employer" : role,
          fullName: nameString,
          mobile: userMobile || "",
          profilePhoto: finalPhoto,
        };

        // Save to Firestore
        await setDoc(doc(db, "users", uid), userObj);

        // Also save to dataStore for backwards compatibility across the app
        dataStore.registerAccount(userObj);

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
      let enteredEmail = email.trim().toLowerCase();
      // If user entered only digits (a mobile number), append @realjob.com for Firebase Auth compatibility
      const justDigits = enteredEmail.replace(/\D/g, "");
      if (justDigits.length >= 10 && enteredEmail.replace(/[\s\-\+\(\)]/g, "") === justDigits) {
        enteredEmail = `${justDigits}@realjob.com`;
      }

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
         
         const deletedIds = new Set<string>(
           typeof window !== "undefined"
             ? JSON.parse(localStorage.getItem("realjob_deleted_worker_ids") || "[]")
             : []
         );
         deletedIds.add("empw-1791635953540");
         deletedIds.add("empw-1791785681836");

         let candidates = allEmployerWorkers.filter((w: any) => {
           const clean = (w.mobile || "").replace(/\D/g, "");
           return clean === searchMobile &&
             !deletedIds.has(w.id) &&
             w.status !== "Inactive" &&
             w.status !== "Deleted" &&
             !w.isDeleted;
         });

         // In case candidates not yet loaded into localStorage, check directly from Firestore
         if (candidates.length === 0) {
           try {
             const { getFirestore, collection, getDocs } = await import("firebase/firestore");
             const db = getFirestore();
             const qSnap = await getDocs(collection(db, "workers"));
             const fbCandidates: any[] = [];
             qSnap.forEach((docSnap) => {
               const data = docSnap.data() as EmployerWorker;
               const m = (data.mobile || "").replace(/\D/g, "");
               if (
                 m === searchMobile &&
                 !deletedIds.has(docSnap.id) &&
                 !deletedIds.has(data.id) &&
                 data.status !== "Inactive" &&
                 data.status !== "Deleted" &&
                 !data.isDeleted
               ) {
                 fbCandidates.push({ ...data, id: docSnap.id });
               }
             });
             if (fbCandidates.length > 0) {
               candidates = fbCandidates;
             }
           } catch {}
         }
         
         if (candidates.length === 0) {
            toast.error("❌ हा कर्मचारी सध्या सक्रिय नाही किंवा काढून टाकला आहे! (Employee not found or has been removed.)");
            setBusy(false);
            return;
         }

         // Sort newest first so most recently added profile matches
         candidates.sort((a: any, b: any) => (b.id || "").localeCompare(a.id || ""));

         existingAccount = candidates.find((c: any) => (c.pin || "1234") === password);
         
         if (!existingAccount) {
            toast.error("❌ चुकीचा पासकोड! (Wrong PIN. Please enter correct PIN.)");
            setBusy(false);
            return;
         }

         } else {
         const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
         const { getFirestore, doc, getDoc } = await import("firebase/firestore");
         const auth = getAuth();
         const db = getFirestore();
         
         try {
           const credential = await signInWithEmailAndPassword(auth, enteredEmail, password);
           const uid = credential.user.uid;
           const userDoc = await getDoc(doc(db, "users", uid));
           
           if (userDoc.exists()) {
             existingAccount = userDoc.data();
             // Keep local store in sync
             if (!dataStore.findRegisteredAccount(enteredEmail)) {
                dataStore.registerAccount(existingAccount as any);
             }
           } else {
             // Fallback to local store if they somehow exist locally but not in Firestore 
             // (e.g. legacy localhost accounts)
             existingAccount = dataStore.findRegisteredAccount(enteredEmail);
             if (existingAccount && existingAccount.password !== password) {
               toast.error("❌ चुकीचा पासवर्ड! (Wrong password. Please enter correct password.)");
               setBusy(false);
               return;
             }
           }
         } catch (firebaseErr: any) {
           // Fallback to local store for backward compatibility
           existingAccount = dataStore.findRegisteredAccount(enteredEmail);
           if (!existingAccount) {
              throw firebaseErr; // Throw back to outer catch block if not found locally
           }
           if (existingAccount.password !== password) {
             toast.error("❌ चुकीचा पासवर्ड! (Wrong password. Please enter correct password.)");
             setBusy(false);
             return;
           }
         }
      }

      if (existingAccount) {
        let resolvedEmpName = (existingAccount as any)?.employerName || "";
        if (!resolvedEmpName && existingAccount.employerId) {
          const accounts = (dataStore as any).getRegisteredUserAccounts ? (dataStore as any).getRegisteredUserAccounts() : [];
          const emp = accounts.find((a: any) =>
            a.id === existingAccount.employerId ||
            a.email === existingAccount.employerId ||
            a.fullName === existingAccount.employerId
          );
          if (emp) {
            resolvedEmpName = emp.companyName || emp.fullName || "";
          }
        }
        if (!resolvedEmpName && role === "employee") {
          resolvedEmpName = "Alpha Byte";
        }

        const userObj: any = {
          id: existingAccount.id,
          employerId: existingAccount.employerId || "",
          employerName: resolvedEmpName,
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
        toast.error("❌ चुकीचा पासवर्ड किंवा ईमेल! (Invalid Password or Email)");
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
        <div className="text-center space-y-1 mb-2.5">
          <h1 className="text-xl sm:text-2xl font-black text-[#0A3B7B] tracking-tight leading-tight">
            {role === "admin"
              ? mode === "register"
                ? "Job Poster Registration"
                : mode === "forgot"
                  ? "Reset Password"
                  : "Job Poster Login"
              : role === "employee"
                ? "Employee Login"
              : mode === "register"
                ? "Worker / User Registration"
                : mode === "forgot"
                  ? "Reset Password"
                  : "Worker / User Login"}
          </h1>

          <p className="text-xs sm:text-[13px] font-semibold text-gray-600 px-1 leading-snug">
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
          <div className="bg-gray-200/80 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-white/70 flex items-center shadow-inner mb-3">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-1.5 sm:py-2 rounded-full text-sm sm:text-[15px] font-black transition-all duration-200 flex items-center justify-center gap-2 ${mode === "login"
                ? "bg-[#0A3B7B] text-white shadow-md shadow-[#0A3B7B]/30"
                : "text-gray-700 hover:text-black font-extrabold"
                }`}
            >
              <User className="size-4 sm:size-4.5" /> Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-1.5 sm:py-2 rounded-full text-sm sm:text-[15px] font-black transition-all duration-200 flex items-center justify-center gap-2 ${mode === "register"
                ? "bg-[#0A3B7B] text-white shadow-md shadow-[#0A3B7B]/30"
                : "text-gray-700 hover:text-black font-extrabold"
                }`}
            >
              <UserPlus className="size-4 sm:size-4.5" /> Register
            </button>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">

          {/* WORKER REGISTRATION FIELDS */}
          {mode === "register" && role === "worker" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <Label className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    required
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Rahul Sharma"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    required
                    type="tel"
                    autoComplete="off"
                    placeholder="+91 98220 00000"
                    value={workerPhone}
                    onChange={(e) => setWorkerPhone(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* EMPLOYER REGISTRATION FIELDS */}
          {mode === "register" && (role === "employer" || role === "admin") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <Label className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">Company Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    required
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Tata Motors / L&T"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    required
                    type="tel"
                    autoComplete="off"
                    placeholder="+91 98220 00000"
                    value={employerPhone}
                    onChange={(e) => setEmployerPhone(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PROFILE / COMPANY PHOTO UPLOAD & LIVE CAMERA FIELD */}
          {mode === "register" && (
            <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-100 space-y-1.5">
              <div className="flex items-center gap-2.5">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile Preview" className="size-9 rounded-full object-cover ring-2 ring-[#0A3B7B] shadow-xs" />
                ) : (
                  <div className="size-9 rounded-full bg-[#0A3B7B]/10 text-[#0A3B7B] flex items-center justify-center shrink-0 border border-[#0A3B7B]/20">
                    <Camera className="size-4" />
                  </div>
                )}
                <div>
                  <p className="text-xs sm:text-[13px] font-extrabold text-[#0A3B7B]">
                    {role === "employer" || role === "admin" ? "Company Logo / Photo" : "Profile Photo (प्रोफाईल फोटो)"}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-bold">
                    {profilePhoto ? "✓ Photo Attached" : "Choose file or take live camera photo"}
                  </p>
                </div>
              </div>

              {/* Action Buttons: 1. Upload File 2. Live Camera */}
              <div className="flex items-center gap-2 pt-0.5">
                <label className="flex-1 py-1.5 px-2 rounded-lg bg-[#0A3B7B] text-white text-xs sm:text-[13px] font-black cursor-pointer hover:bg-[#072B5B] transition-colors shadow-xs flex items-center justify-center gap-1.5">
                  <Upload className="size-3.5" /> {profilePhoto ? "Change" : "Upload File"}
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
                  className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-700 text-white text-xs sm:text-[13px] font-black hover:bg-emerald-800 transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera className="size-3.5" /> {lang === "mr" ? "कॅमेरा उघडा" : "Take Photo"}
                </button>
              </div>
            </div>
          )}

          {/* EMAIL OR MOBILE FIELD */}
          <div>
            <Label htmlFor="email" className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">
              {role === "employee" 
                ? "Mobile Number (मोबाईल नंबर) *"
                : mode === "login" 
                  ? "Email Address or Mobile Number *" 
                  : "Email Address (Optional / ऐच्छिक)"}
            </Label>
            <div className="relative">
              {mode === "login" && /^\d+$/.test(email.replace(/\D/g, "")) && email.length >= 5 ? (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#0A3B7B]" />
              ) : (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              )}
              <input
                id="email"
                type={mode === "login" || role === "employee" ? "text" : "email"}
                required={mode === "login" || role === "employee"}
                autoComplete="off"
                placeholder={role === "employee" ? "e.g. 98220 00000" : mode === "login" ? "Email or Mobile (e.g. 98220 00000 / user@gmail.com)" : "name@example.com (Optional)"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password" className="text-xs sm:text-[13px] font-extrabold text-gray-800">
                  {role === "employee" ? "4-Digit PIN (पासकोड) *" : "Password *"}
                </Label>
                {mode === "login" && role !== "employee" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs sm:text-[13px] font-bold text-[#0A3B7B] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder={role === "employee" ? "e.g. 1234" : "••••••••"}
                  minLength={4}
                  maxLength={role === "employee" ? 4 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-9 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          )}

          {/* OTP FIELD FOR REGISTRATION */}
          {mode === "register" && showOtpField && (
            <div className="mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 animate-in fade-in zoom-in-95 duration-300">
              <Label htmlFor="otp" className="text-xs sm:text-[13px] font-extrabold text-emerald-800 mb-1 block">
                Enter 6-Digit OTP *
              </Label>
              <div className="relative">
                <input
                  id="otp"
                  type="text"
                  required
                  placeholder="Enter OTP sent to your mobile"
                  maxLength={6}
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-10 px-3 bg-white rounded-lg border border-emerald-300 text-sm font-bold text-center tracking-widest text-emerald-900 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-600 font-semibold mt-1 text-center">
                OTP sent successfully. Please check your SMS.
              </p>
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
                className="size-4 rounded border-gray-300 text-[#0A3B7B] focus:ring-[#0A3B7B] accent-[#0A3B7B] cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs sm:text-[13px] font-bold text-gray-700 cursor-pointer select-none">
                Remember me
              </label>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <Button
            disabled={busy}
            type="submit"
            className="w-full h-10.5 sm:h-11 bg-[#0A3B7B] hover:bg-[#072B5B] text-white font-black text-xs sm:text-sm rounded-lg shadow-md shadow-[#0A3B7B]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-1"
          >
            {busy ? (
              <Loader2 className="animate-spin size-4" />
            ) : mode === "register" ? (
              showOtpField ? (
                <>
                  <Check className="size-4" /> Verify OTP & Register
                </>
              ) : (
                <>
                  <UserPlus className="size-4" /> Send OTP to Register
                </>
              )
            ) : mode === "forgot" ? (
              "Send Reset Link"
            ) : (
              <>
                <LogIn className="size-4" /> Sign In
              </>
            )}
          </Button>
        </form>

        {/* BOTTOM REGISTER LINK */}
        {role !== "employee" && (
          <div className="mt-3.5 text-center text-xs sm:text-[13px] font-bold text-gray-600">
            {mode === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "register" ? "login" : "register")}
              className="text-[#0A3B7B] font-black hover:underline ml-1"
            >
              {mode === "register" ? "Sign In" : "Register"}
            </button>
          </div>
        )}
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
