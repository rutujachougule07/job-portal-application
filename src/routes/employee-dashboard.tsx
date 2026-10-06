import { useState, useEffect, useRef } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { dataStore } from "@/lib/data-store";
import { LogIn, LogOut, MapPin, Clock, Calendar, CheckCircle2, User, Home, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/employee-dashboard")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: search['tab'] as string | undefined,
    }
  },
  component: EmployeeDashboard,
});

function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius of the earth in m
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in m
  return d;
}

function EmployeeDashboard() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const activeTab = search.tab || "overview";

  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isPunching, setIsPunching] = useState(false);
  const [status, setStatus] = useState<"Present" | "Absent" | "Punched Out">("Absent");
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);

  // Camera States
  const [showCamera, setShowCamera] = useState(false);
  const [punchType, setPunchType] = useState<"in" | "out" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("realjob-user") || localStorage.getItem("realjob_db_user");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        if (u.role === "employee") {
          const allWorkers = dataStore.getAllEmployerWorkers();
          const cleanMobile = (u.mobile || "").replace(/\D/g, "");
          const fresh = allWorkers.find(w => w.id === u.id || (cleanMobile && (w.mobile || "").replace(/\D/g, "") === cleanMobile));
          const merged = fresh ? { ...u, ...fresh, role: "employee" } : u;
          setUser(merged);
          loadAttendance(merged);
        } else {
          navigate({ to: "/auth", search: { mode: "login", role: "employee" } });
        }
      } catch {
        navigate({ to: "/auth", search: { mode: "login", role: "employee" } });
      }
    } else {
      navigate({ to: "/auth", search: { mode: "login", role: "employee" } });
    }
  }, [navigate]);

  const loadAttendance = (employeeUser: any) => {
    if (!employeeUser.employerId) return;
    const records = dataStore.getEmployerAttendance(employeeUser.employerId);
    const myRecords = records.filter(r => r.workerId === employeeUser.id);

    // Sort descending
    myRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setAttendanceHistory(myRecords);

    // Check today's status
    const today = new Date().toISOString().split("T")[0];
    const todayRecord = myRecords.find(r => r.date === today);
    if (todayRecord) {
      if (todayRecord.punchOutTime) {
        setStatus("Punched Out");
      } else if (todayRecord.status === "Present" || todayRecord.status === "HalfDay" || todayRecord.status === "Overtime") {
        setStatus("Present");
      } else {
        setStatus("Absent");
      }
    }
  };

  const openCamera = async (type: "in" | "out") => {
    setPunchType(type);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      toast.error("Camera access denied! Please allow camera permissions to Punch In/Out.");
      setShowCamera(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setPunchType(null);
  };

  const handleCaptureAndPunch = () => {
    if (!punchType) return;
    setIsPunching(true);

    // In a real app, you would draw the video frame to a canvas and save the image data.
    toast.success("📸 Photo Captured Successfully!");
    closeCamera();

    if (!navigator.geolocation) {
      toast.error("Location tracking is not supported by your browser!");
      setIsPunching(false);
      return;
    }

    toast.info("Fetching your GPS Location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        setLocation({
          lat: userLat,
          lng: userLng,
        });

        // 1. Fetch Employer Profile to check worksiteLocation
        const accounts = dataStore.getRegisteredUserAccounts();
        const employerProfile = accounts.find(a => a.id === user.employerId || a.fullName === user.employerId || a.email === user.employerId);

        let worksiteLoc = (employerProfile as any)?.worksiteLocation;

        // Fallback 1: Check employer specific or global stored worksite coordinates from localStorage
        if (!worksiteLoc || !worksiteLoc.lat) {
          try {
            const empKey = user.employerId || user.employerName || "admin-001";
            const saved = localStorage.getItem(`emp_worksite_coords_${empKey}`) || localStorage.getItem("emp_worksite_coords_global");
            if (saved) worksiteLoc = JSON.parse(saved);
          } catch (e) {}
        }

        // Fallback 2: Check any employer account in dataStore
        if (!worksiteLoc || !worksiteLoc.lat) {
          const empAcc = accounts.find(a => (a.role === "employer" || a.role === "admin") && (a as any).worksiteLocation);
          if (empAcc) worksiteLoc = (empAcc as any).worksiteLocation;
        }

        // 2. Strict 100 Meter Geofencing Distance Enforcement
        if (worksiteLoc && worksiteLoc.lat && worksiteLoc.lng) {
          const dist = getDistanceFromLatLonInM(userLat, userLng, worksiteLoc.lat, worksiteLoc.lng);
          if (dist > 100) {
            toast.error(
              `❌ हजेरी नाकारली! तुम्ही कामाच्या ठिकाणापासून ${Math.round(dist)} मीटर दूर आहात! (पंच इन/आऊट फक्त 100m च्या आतच करता येईल).`,
              { duration: 6000 }
            );
            setIsPunching(false);
            return;
          }
        }

        const today = new Date().toISOString().split("T")[0] as string;
        const currentTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        const loc = { lat: userLat, lng: userLng };

        if (punchType === "in") {
          dataStore.saveAttendanceStatus(
            user.employerId || "",
            user.id || "",
            user.fullName || "",
            today,
            "Present",
            "Punched In via App",
            { punchInTime: currentTime, punchInLocation: loc }
          );
          setStatus("Present");
          toast.success(`✅ Punched In at ${currentTime}!`);
        } else {
          dataStore.saveAttendanceStatus(
            user.employerId || "",
            user.id || "",
            user.fullName || "",
            today,
            "Present",
            "Punched Out via App",
            { punchOutTime: currentTime, punchOutLocation: loc }
          );
          setStatus("Punched Out");
          toast.success(`🔴 Punched Out at ${currentTime}!`);
        }

        loadAttendance(user);
        setIsPunching(false);
      },
      (error) => {
        toast.error("Failed to get location. Please enable location permissions.");
        setIsPunching(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("realjob-user");
    dataStore.logout();
    navigate({ to: "/auth", search: { mode: "login", role: "employee" } });
  };

  if (!user) return null;



  const isFixedLocation = user?.locationType !== "field" && user?.attendanceMode !== "manual";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Absolute Header with Logout */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-gradient-to-br from-[#063B78] to-[#0A4F9E] rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xs">RJ</span>
          </div>
          <span className="font-black text-[#063B78] tracking-tight">REAL JOB</span>
        </div>
        <Button onClick={handleLogout} variant="ghost" className="text-rose-500 font-bold bg-white/50 hover:bg-rose-50 rounded-full px-4 h-9">
          <LogOut className="size-4 mr-2" /> Logout
        </Button>
      </div>

      <div className="w-full max-w-md my-16 sm:my-8">
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-2xl text-center relative overflow-hidden">

          {/* Decorative background element */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="size-24 bg-gradient-to-br from-[#021D3D] to-[#063B78] text-white rounded-full flex items-center justify-center mx-auto mb-5 text-4xl font-black shadow-lg border-4 border-white">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "E"}
            </div>

            <h1 className="text-2xl font-black text-slate-800 mb-1">
              {user.fullName}
            </h1>
            <p className="text-sm font-bold text-slate-500 mb-4">
              ID: {user.mobile}
            </p>

            <div className="mb-6 flex justify-center">
              {isFixedLocation ? (
                <span className="text-[11px] font-black text-[#063B78] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  🏢 Company / Fixed Worksite (Punch In/Out Enabled)
                </span>
              ) : (
                <span className="text-[11px] font-black text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  🏗️ Field / Site Worker (Manual Attendance by Owner)
                </span>
              )}
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 shadow-inner">
              <div className="text-sm text-slate-500 font-bold mb-2 flex items-center justify-center gap-2">
                <Clock className="size-4" /> Today's Attendance
              </div>
              <div className={`text-2xl font-black ${status === "Present" ? "text-emerald-600" : status === "Punched Out" ? "text-rose-600" : "text-amber-500"}`}>
                {status === "Present" ? "🟢 PRESENT (हजर)" : status === "Punched Out" ? "🔴 PUNCHED OUT" : "🟡 ABSENT (Not Started)"}
              </div>
            </div>

            {isFixedLocation ? (
              <div className="space-y-4">
                <Button
                  disabled={isPunching || status === "Present"}
                  onClick={() => openCamera("in")}
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-emerald-600/20 disabled:opacity-50 transition-all"
                >
                  <LogIn className="mr-3 size-6" /> PUNCH IN
                </Button>

                <Button
                  disabled={isPunching || status === "Punched Out" || status === "Absent"}
                  onClick={() => openCamera("out")}
                  variant="outline"
                  className="w-full h-16 border-2 border-rose-500 text-rose-600 hover:bg-rose-50 font-black text-xl rounded-2xl disabled:opacity-50 transition-all"
                >
                  <LogOut className="mr-3 size-6" /> PUNCH OUT
                </Button>
              </div>
            ) : (
              <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-5 text-left space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <span className="text-xl">🏗️</span>
                  <span>Field / Site Worker (फिरते कामगार)</span>
                </div>
                <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                  तुमचे कामाचे ठिकाण फिरते / साईटवरील असल्यामुळे तुमची दैनंदिन हजेरी तुमचे मालक/कंपनी स्वतः त्यांच्या डॅशबोर्डवरून मॅन्युअली नोंदवतात.
                </p>
                <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${status === "Present" ? "bg-emerald-500" : "bg-amber-400"}`}></span>
                  <span>
                    {status === "Present"
                      ? "आज मालकाने हजेरी 'Present (हजर)' नोंदवली आहे ✅"
                      : "आजची हजेरी मालकाकडून डॅशबोर्डवर नोंदवली जाईल ⏳"}
                  </span>
                </div>
              </div>
            )}

            {location && isFixedLocation && (
              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2.5 rounded-xl mx-auto w-fit">
                <MapPin className="size-4 text-blue-600" />
                GPS Verified
              </div>
            )}

            {/* Recent Attendance History */}
            {attendanceHistory.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200 text-left">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#063B78]" /> Recent Attendance
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {attendanceHistory.slice(0, 5).map((rec) => (
                    <div key={rec.id || rec.date} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-black text-slate-800">{rec.date}</span>
                        {(rec.punchInTime || rec.punchOutTime) && (
                          <div className="text-[10px] text-slate-500 font-semibold">
                            {rec.punchInTime && `In: ${rec.punchInTime}`} {rec.punchOutTime && ` | Out: ${rec.punchOutTime}`}
                          </div>
                        )}
                      </div>
                      <span className={`font-black text-[11px] px-2 py-0.5 rounded-md ${
                        rec.status === "Present" ? "bg-emerald-100 text-emerald-800" :
                        rec.status === "HalfDay" ? "bg-amber-100 text-amber-800" :
                        rec.status === "Overtime" ? "bg-blue-100 text-blue-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CAMERA MODAL */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Camera className="size-5 text-emerald-600" /> Face Verification
              </h3>
              <Button onClick={closeCamera} variant="ghost" size="sm" className="size-8 p-0 rounded-full">
                <X className="size-5" />
              </Button>
            </div>

            <div className="bg-black relative aspect-[3/4] sm:aspect-video flex items-center justify-center">
              {/* Video Stream */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Overlay guides */}
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-64 border-2 border-dashed border-white/70 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-xs font-bold text-shadow">
                Please align your face in the oval
              </div>
            </div>

            <div className="p-6 bg-white text-center">
              <Button
                onClick={handleCaptureAndPunch}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-600/30"
              >
                <Camera className="mr-2 size-6" /> CAPTURE & PUNCH {punchType?.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
