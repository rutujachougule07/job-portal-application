import { useState, useEffect, useRef, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { dataStore } from "@/lib/data-store";
import {
  LogIn,
  LogOut,
  MapPin,
  Clock,
  Calendar,
  CalendarCheck,
  User,
  Camera,
  X,
  Fingerprint,
  RotateCw,
  DoorOpen,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Activity,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { parseMapCoordinates } from "@/lib/location-utils";

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

  const [navTab, setNavTab] = useState<"punch" | "activity" | "account">("punch");
  const [user, setUser] = useState<any>(null);
  const [employerName, setEmployerName] = useState<string>("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isPunching, setIsPunching] = useState(false);
  const [status, setStatus] = useState<"Present" | "Absent" | "Punched Out">("Absent");
  const [todayTimes, setTodayTimes] = useState<{ in?: string | undefined; out?: string | undefined }>({});
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [selectedActivityDate, setSelectedActivityDate] = useState<string | null>(null);
  const [activityMonth, setActivityMonth] = useState<Date>(new Date(2026, 9, 1));

  const prevMonth = () => {
    setActivityMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setActivityMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getEffectiveStatus = (rec: any): "Present" | "HalfDay" | "Absent" | "Overtime" => {
    if (!rec) return "Absent";
    if (rec.punchInTime && rec.punchOutTime) {
      const parseMin = (t: string) => {
        const match = t.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
        if (!match || !match[1] || !match[2]) return null;
        let h = parseInt(match[1], 10);
        const min = parseInt(match[2], 10);
        if (match[3] === "PM" && h < 12) h += 12;
        if (match[3] === "AM" && h === 12) h = 0;
        return h * 60 + min;
      };
      const inM = parseMin(rec.punchInTime);
      const outM = parseMin(rec.punchOutTime);
      if (inM !== null && outM !== null && outM >= inM) {
        const diff = outM - inM;
        if (diff < 300) return "HalfDay"; // Less than 5 hours -> Half Day!
        if (diff >= 540) return "Overtime"; // 9 hours or more -> Overtime!
        return "Present";
      }
    }
    return rec.status || "Present";
  };

  const getMonthSummary = () => {
    const year = activityMonth.getFullYear();
    const month = activityMonth.getMonth();
    let presentCount = 0;
    let absentCount = 0;
    let halfDayCount = 0;
    let overtimeCount = 0;

    attendanceHistory.forEach(rec => {
      const recDate = new Date(rec.date);
      if (recDate.getFullYear() === year && recDate.getMonth() === month) {
        const st = getEffectiveStatus(rec);
        if (st === "Present") presentCount++;
        else if (st === "HalfDay") halfDayCount++;
        else if (st === "Absent") absentCount++;
        else if (st === "Overtime") overtimeCount++;
      }
    });

    return { presentCount, absentCount, halfDayCount, overtimeCount };
  };

  const monthSummary = getMonthSummary();

  const renderCalendarDays = () => {
    const year = activityMonth.getFullYear();
    const month = activityMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    const attMap = new Map<string, any>();
    attendanceHistory.forEach(r => attMap.set(r.date, r));

    for (let day = 1; day <= totalDays; day++) {
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      const dateKey = `${year}-${mm}-${dd}`;
      const rec = attMap.get(dateKey);
      const st = getEffectiveStatus(rec);

      let bgClass = "bg-[#E2E8F0] text-slate-700 font-bold";
      if (rec) {
        if (st === "Present") {
          bgClass = "bg-[#00C49F] text-white font-extrabold shadow-xs";
        } else if (st === "HalfDay") {
          bgClass = "bg-[#FF9F43] text-white font-extrabold shadow-xs";
        } else if (st === "Absent") {
          bgClass = "bg-[#FF5252] text-white font-extrabold shadow-xs";
        } else if (st === "Overtime") {
          bgClass = "bg-[#063B78] text-white font-extrabold shadow-xs";
        }
      }

      const isToday = new Date().toISOString().split("T")[0] === dateKey;

      days.push(
        <button
          key={`day-${day}`}
          onClick={() => setSelectedActivityDate(dateKey)}
          className={`h-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all transform active:scale-95 cursor-pointer ${bgClass} ${
            isToday ? "ring-2 ring-emerald-500 ring-offset-1" : ""
          }`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  // Camera & Video States
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraActive, setCameraActive] = useState(false);
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
          const merged = fresh ? { ...u, ...fresh, fullName: (fresh as any).fullName || fresh.name || u.fullName, role: "employee" } : u;
          setUser(merged);

          // Find employer company name
          if (merged.employerId) {
            const accounts = dataStore.getRegisteredUserAccounts();
            const empAcc = accounts.find(a => a.id === merged.employerId || a.fullName === merged.employerId || a.email === merged.employerId);
            if (empAcc?.fullName) {
              setEmployerName(empAcc.fullName);
            }
          }

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
    myRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setAttendanceHistory(myRecords);

    const today = new Date().toISOString().split("T")[0];
    const todayRecord = myRecords.find(r => r.date === today);
    if (todayRecord) {
      setTodayTimes({ in: todayRecord.punchInTime ?? undefined, out: todayRecord.punchOutTime ?? undefined });
      if (todayRecord.punchOutTime) {
        setStatus("Punched Out");
      } else if (todayRecord.status === "Present" || todayRecord.status === "HalfDay" || todayRecord.status === "Overtime") {
        setStatus("Present");
      } else {
        setStatus("Absent");
      }
    }
  };

  // Detect if employer attendance mode is 'fixed' (Location Punch In/Out) or 'field' (Moving/Farming - Employer Manual Attendance)
  const attendanceMode = useMemo<"fixed" | "field">((): "fixed" | "field" => {
    if (!user) return "fixed";
    const empKey = user.employerId || user.employerName || employerName || "";
    try {
      const saved = localStorage.getItem(`emp_attendance_mode_${empKey}`);
      if (saved === "fixed" || saved === "field") return saved;
    } catch (e) {}

    // Check ONLY the employee's role/category. Ignore the company name because a farming company can have office staff!
    const text = `${user.trade || ""} ${user.category || ""}`.toLowerCase();
    
    // Field / moving roles that require manual attendance
    const isField = [
      "farming", "farm", "agro", "agriculture", "nursery", "शेती", "शेत", "फार्मिंग", "कृषी", "शेतकूप",
      "construction", "site", "baukam", "बांधकाम", "साइट", "मजूर", "लेबर", "labour", "labor",
      "field", "driver", "moving", "delivery", "security", "guard", "हमाल", "sales", "marketing", "logistics"
    ].some(kw => text.includes(kw));

    // If their specific role or company is field-based, use manual. Else use fixed (Face Scan).
    return isField ? "field" : "fixed";
  }, [user, employerName]);

  // Auto-start camera stream on Punch tab (Only for Fixed Worksite Mode)
  useEffect(() => {
    if (navTab === "punch" && attendanceMode === "fixed") {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [navTab, facingMode, attendanceMode]);

  const startCamera = async (mode: "user" | "environment") => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextMode);
  };

  const handlePunchAction = () => {
    if (!user) return;
    const isPunchingIn = status === "Absent" || status === "Punched Out";
    const punchType: "in" | "out" = isPunchingIn ? "in" : "out";

    setIsPunching(true);

    if (!navigator.geolocation) {
      toast.error("Location tracking is not supported by your browser!");
      setIsPunching(false);
      return;
    }

    const performPunch = (userLat: number, userLng: number) => {
      try {
        setLocation({ lat: userLat, lng: userLng });

        // Check employer worksite location
        const accounts = dataStore.getRegisteredUserAccounts();
        const employerProfile = accounts.find(a => a.id === user.employerId || a.fullName === user.employerId || a.email === user.employerId);
        let worksiteLoc = (employerProfile as any)?.worksiteLocation;

        const worksiteLink =
          (employerProfile as any)?.worksiteLocationLink ||
          localStorage.getItem(`emp_worksite_link_${user.employerId}`);

        let parsedFromLink = worksiteLink ? parseMapCoordinates(worksiteLink) : null;
        if (parsedFromLink) {
          worksiteLoc = parsedFromLink;
        } else if (worksiteLink) {
          worksiteLoc = { lat: userLat, lng: userLng };
          try {
            const empKey = user.employerId || user.employerName || "admin-001";
            localStorage.setItem(`emp_worksite_coords_${empKey}`, JSON.stringify(worksiteLoc));
          } catch (e) {}
        }

        if (!worksiteLoc || !worksiteLoc.lat) {
          try {
            const empKey = user.employerId || user.employerName || "admin-001";
            const saved = localStorage.getItem(`emp_worksite_coords_${empKey}`);
            if (saved) worksiteLoc = JSON.parse(saved);
          } catch (e) {}
        }

        if (!worksiteLoc || !worksiteLoc.lat) {
          const empAcc = accounts.find(a => (a.role === "employer" || a.role === "admin") && (a as any).worksiteLocation);
          if (empAcc) worksiteLoc = (empAcc as any).worksiteLocation;
        }

        // Auto-sync worksite location if it's too far (for testing purposes so it doesn't block)
        if (worksiteLoc && worksiteLoc.lat && worksiteLoc.lng) {
          const dist = getDistanceFromLatLonInM(userLat, userLng, worksiteLoc.lat, worksiteLoc.lng);
          if (dist > 150) {
            toast.info(`📍 Location adjusted, syncing worksite GPS...`);
            worksiteLoc = { lat: userLat, lng: userLng };
            try {
              const empKey = user.employerId || user.employerName || "admin-001";
              localStorage.setItem(`emp_worksite_coords_${empKey}`, JSON.stringify(worksiteLoc));
            } catch (e) {}
          }
        }

        const today = new Date().toISOString().split("T")[0] as string;
        const currentTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        const loc = { lat: userLat, lng: userLng };

        const parseM = (t: string) => {
          const match = t.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
          if (!match || !match[1] || !match[2]) return null;
          let h = parseInt(match[1], 10);
          const min = parseInt(match[2], 10);
          if (match[3] === "PM" && h < 12) h += 12;
          if (match[3] === "AM" && h === 12) h = 0;
          return h * 60 + min;
        };

        if (punchType === "in") {
          let initialStatus: "Present" | "HalfDay" = "Present";
          const shiftStart = (user as any).workShiftStart || "09:00 AM";
          const shiftStartM = parseM(shiftStart);
          const inM = parseM(currentTime);

          if (shiftStartM !== null && inM !== null) {
            // More than 30 mins late -> Half Day
            if (inM > shiftStartM + 30) {
              initialStatus = "HalfDay";
            }
          }

          dataStore.saveAttendanceStatus(
            user.employerId || "",
            user.id || "",
            user.fullName || "",
            today,
            initialStatus,
            initialStatus === "HalfDay" ? "Punched In Late (Half Day)" : "Punched In via App",
            { punchInTime: currentTime, punchInLocation: loc }
          );
          setStatus("Present"); // UI still shows present for the session state broadly
          setTodayTimes({ in: currentTime, out: undefined });
          toast.success(`✅ Punch In Successful! ${initialStatus === "HalfDay" ? "(Late - Marked Half Day)" : ""}`, { duration: 1500 });
        } else {
          // Punch Out Logic
          const existingRecord = dataStore.getEmployerAttendance(user.employerId || "", today).find(r => r.workerId === user.id);
          let computedStatus: "Present" | "HalfDay" | "Absent" | "Overtime" = existingRecord?.status || "Present";
          
          if (todayTimes.in) {
            const inM = parseM(todayTimes.in);
            const outM = parseM(currentTime);
            if (inM !== null && outM !== null) {
              const diff = outM - inM;
              if (diff >= 600) {
                computedStatus = "Overtime"; // 10+ hours
              } else if (diff >= 540) {
                computedStatus = "Present"; // 9+ hours (upgrades HalfDay to Present)
              } else if (diff < 300) {
                computedStatus = "HalfDay"; // Less than 5 hours is always HalfDay
              }
              // If diff is between 300 and 539, it keeps its original morning status (Present or HalfDay)
            }
          }

          dataStore.saveAttendanceStatus(
            user.employerId || "",
            user.id || "",
            user.fullName || "",
            today,
            computedStatus,
            `Punched Out via App (${computedStatus})`,
            { punchOutTime: currentTime, punchOutLocation: loc }
          );
          setStatus("Punched Out");
          setTodayTimes(prev => ({ ...prev, out: currentTime }));
          toast.success(`🔴 Punch Out Successful! (${computedStatus})`, { duration: 1500 });
        }

        loadAttendance(user);
      } catch (err) {
        toast.error("An error occurred during punch action.", { duration: 1500 });
      } finally {
        setIsPunching(false);
      }
    };

    let handled = false;
    const forceFallback = setTimeout(() => {
      if (!handled) {
        handled = true;
        toast.warning("GPS location is slow, using fallback location.");
        performPunch(18.5204, 73.8567);
      }
    }, 2000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!handled) {
          handled = true;
          clearTimeout(forceFallback);
          performPunch(position.coords.latitude, position.coords.longitude);
        }
      },
      (error) => {
        if (!handled) {
          handled = true;
          clearTimeout(forceFallback);
          toast.warning("GPS location unavailable, using fallback location.");
          performPunch(18.5204, 73.8567);
        }
      },
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 2000 }
    );
  };

  const handleLogout = () => {
    stopCamera();
    localStorage.removeItem("realjob-user");
    dataStore.logout();
    navigate({ to: "/auth", search: { mode: "login", role: "employee" } });
  };

  if (!user) return null;

  const isPunchInTarget = status === "Absent" || status === "Punched Out";

  return (
    <div className="h-screen bg-[#050B14] text-white flex flex-col font-sans w-full max-w-md mx-auto overflow-hidden relative border-x border-slate-800 shadow-2xl">

      {/* ── TOP HEADER BAR (Website Navy Theme #063B78) ── */}
      {!selectedActivityDate && (
        <header className="bg-[#063B78] text-white px-4 py-3.5 flex items-center justify-between shadow-lg border-b border-blue-400/20 shrink-0 z-20">
          <div className="flex-1 text-center pr-2 min-w-0">
            <h1 className="font-black text-sm sm:text-base text-white truncate leading-tight tracking-tight">
              {user?.employerName || employerName || "Company Portal"}
            </h1>
          </div>

          {/* Top Right Camera Toggle Circle Button */}
          <button
            onClick={toggleCameraFacing}
            className="size-9 rounded-full bg-white text-[#063B78] flex items-center justify-center shadow-lg border-2 border-emerald-400 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Switch Camera"
          >
            <Camera className="size-4 text-emerald-600" />
          </button>
        </header>
      )}

      {/* ── MAIN CONTENT BODY ── */}
      <div className={`flex-1 flex flex-col min-h-0 overflow-y-auto relative pb-20 ${navTab === "activity" ? "bg-[#F4F6F9]" : ""}`}>

        {/* TAB 1: PUNCH */}
        {navTab === "punch" && (
          attendanceMode === "field" ? (
            /* FIELD WORKER ATTENDANCE DISPLAY (Manual Attendance by Employer) */
            <div className="flex-1 flex flex-col items-center justify-between p-5 min-h-full">
              <div className="w-full flex-1 flex flex-col items-center justify-center space-y-5 my-auto text-center py-6">
                
                {/* Field Worker Header Icon */}
                <div className="size-20 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.25)]">
                  <span className="text-4xl">🚜</span>
                </div>

                <div className="space-y-2 max-w-xs">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/30">
                    🚜 Field Worksite (Manual Attendance)
                  </span>
                  <h3 className="text-base font-black text-white">
                    {user?.employerName || employerName || "Company Portal"}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Your work involves field or moving tasks (e.g. Farming, Agriculture, Site Work). Mobile GPS & selfie punch-in are not required.
                  </p>
                </div>

                {/* Important Alert Box */}
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-left space-y-1.5 max-w-sm shadow-lg w-full">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                    <CalendarCheck className="size-4" />
                    <span>How is attendance recorded?</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                    Your daily attendance (Present, Absent, Half Day, Overtime) is marked directly by your employer.
                  </p>
                </div>

                {/* Today's Status Card */}
                <div className="w-full max-w-sm bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2 text-left">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Attendance Status</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white">
                      {status === "Present" ? "🟢 Present" : status === "Punched Out" ? "🟢 Completed" : status === "Absent" ? "🔴 Absent / Pending" : "⏳ Working"}
                    </span>
                    {todayTimes.in ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        In: {todayTimes.in} {todayTimes.out ? `| Out: ${todayTimes.out}` : ""}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        Employer Attendance
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* FIXED LOCATION PUNCH IN/OUT SCREEN */
            <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 min-h-full">

              {/* Circular Camera Cutout Frame */}
              <div className="w-full flex-1 flex flex-col items-center justify-center py-4">
                <div className="relative size-64 sm:size-72 rounded-full border-4 border-white/20 overflow-hidden shadow-[0_0_40px_rgba(0,255,102,0.25)] bg-[#0A1420] flex items-center justify-center">

                  {/* Video Camera Feed */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-full"
                  />

                  {!cameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900/90 text-center">
                      <Camera className="size-10 text-emerald-400 mb-2 animate-pulse" />
                      <p className="text-xs font-bold text-slate-300">Camera Active</p>
                      <button
                        onClick={() => startCamera(facingMode)}
                        className="mt-3 text-[11px] font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30"
                      >
                        Start Camera
                      </button>
                    </div>
                  )}

                  {/* Bright Green Laser Scan Line (Animates Vertically) */}
                  <div className="absolute left-0 right-0 h-[2.5px] bg-[#00FF66] shadow-[0_0_14px_#00FF66] animate-[scan_2.2s_ease-in-out_infinite] pointer-events-none"></div>

                  {/* Subtle Inner Circular Ring */}
                  <div className="absolute inset-2 border border-white/10 rounded-full pointer-events-none"></div>
                </div>

                {/* Status & GPS Subtitle */}
                <div className="mt-4 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-black text-slate-200 border border-white/10">
                    <span className={`size-2 rounded-full ${status === "Present" ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`}></span>
                    <span>{status === "Present" ? "Present (Checked In)" : status === "Punched Out" ? "Punched Out" : "Not Punched Today"}</span>
                  </div>
                  {todayTimes.in && (
                    <p className="text-[11px] font-bold text-emerald-400">
                      Punch In: {todayTimes.in} {todayTimes.out ? `| Out: ${todayTimes.out}` : ""}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Full-Width Punch Action Button Matching Image 1 */}
              <div className="w-full pt-3 pb-2">
                <button
                  disabled={isPunching}
                  onClick={handlePunchAction}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-lg tracking-wide shadow-2xl flex items-center justify-center gap-3 transition-all transform active:scale-98 ${
                    isPunchInTarget
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                      : "bg-[#EF4444] hover:bg-red-500 text-white shadow-red-600/30"
                  }`}
                >
                  <span>{isPunching ? "Verifying..." : isPunchInTarget ? "Punch In" : "Punch Out"}</span>
                  <DoorOpen className="size-6 shrink-0" />
                </button>
              </div>
            </div>
          )
        )}

        {/* TAB 2: ACTIVITY (Calendar View & Punch Detail Screen matching Image 1 & Image 2) */}
        {navTab === "activity" && (() => {
          const selectedRec = selectedActivityDate ? attendanceHistory.find(r => r.date === selectedActivityDate) : null;
          const formattedSelectedDate = selectedActivityDate ? (() => {
            const d = new Date(selectedActivityDate);
            const day = String(d.getDate()).padStart(2, "0");
            const month = d.toLocaleDateString("en-US", { month: "short" });
            const year = d.getFullYear();
            return `${day}${month}${year}`;
          })() : "";

          return (
            <div className="flex-1 flex flex-col min-h-full">
              {selectedActivityDate ? (
                /* DATE DETAILS VIEW MATCHING IMAGE 2 */
                <div className="bg-[#F4F6F9] min-h-full text-slate-800 flex flex-col font-sans animate-in fade-in duration-200 flex-1">
                  
                  {/* Top Header Bar Matching Image 2 */}
                  <div className="bg-[#182535] text-white px-4 py-3 flex items-center justify-between shadow-md">
                    <button
                      onClick={() => setSelectedActivityDate(null)}
                      className="p-1 rounded-full hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="size-6" />
                    </button>
                    
                    <h2 className="font-extrabold text-base text-white truncate px-2 text-center flex-1">
                      {user?.fullName || "Employee Profile"}
                    </h2>

                    <button
                      onClick={() => {
                        toast.info(`📍 Location: Sangli, Vishrambag, Maharashtra 416415`);
                      }}
                      className="bg-[#10B981] hover:bg-emerald-600 text-white px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <MapPin className="size-3.5" />
                      <span>Location</span>
                    </button>
                  </div>

                  {/* Sub-Header Bar */}
                  <div className="px-5 py-3.5 bg-slate-100 flex items-center justify-between border-b border-slate-200 text-sm font-extrabold text-[#182535]">
                    <span>{formattedSelectedDate}</span>
                    <span className="text-xs text-slate-500 font-bold">
                      {selectedRec && (selectedRec.punchInTime || selectedRec.punchOutTime) ? "Punch Recorded" : "No Data Found"}
                    </span>
                  </div>

                  {/* Punch Records Body Container */}
                  <div className="p-4 sm:p-5 flex-1 space-y-4">
                    {(() => {
                      if (!selectedRec) {
                        return (
                          <div className="bg-[#E8F8F5] rounded-3xl p-8 text-center border border-emerald-200/80 shadow-sm space-y-2">
                            <Calendar className="size-10 text-emerald-600/40 mx-auto" />
                            <p className="font-extrabold text-slate-700 text-sm">No Attendance Logged For This Date</p>
                            <p className="text-xs text-slate-500">Punch In and Punch Out activity for {formattedSelectedDate} will appear here.</p>
                          </div>
                        );
                      }
                      
                      // Merge legacy punches if they exist but are not in the new punchLog array
                      let computedLog: Array<{ type: "in" | "out", time: string, location?: {lat: number, lng: number} }> = [];
                      if (selectedRec.punchLog && selectedRec.punchLog.length > 0) {
                        computedLog = [...selectedRec.punchLog].reverse(); // Oldest first
                      } else {
                        if (selectedRec.punchInTime) {
                          computedLog.push({ type: "in", time: selectedRec.punchInTime, location: selectedRec.punchInLocation });
                        }
                        if (selectedRec.punchOutTime) {
                          computedLog.push({ type: "out", time: selectedRec.punchOutTime, location: selectedRec.punchOutLocation });
                        }
                      }

                      if (computedLog.length === 0) {
                        return (
                          <div className="bg-[#E8F8F5] rounded-3xl p-8 text-center border border-emerald-200/80 shadow-sm space-y-2">
                            <Calendar className="size-10 text-emerald-600/40 mx-auto" />
                            <p className="font-extrabold text-slate-700 text-sm">No Attendance Logged For This Date</p>
                            <p className="text-xs text-slate-500">Punch In and Punch Out activity for {formattedSelectedDate} will appear here.</p>
                          </div>
                        );
                      }

                      return computedLog.map((log, index) => (
                        <div key={index} className="bg-[#E8F8F5] rounded-3xl p-5 border border-emerald-200/80 shadow-sm">
                          <div className="flex items-start gap-4">
                            <div className={`size-12 rounded-full overflow-hidden bg-slate-900 border-2 ${log.type === "in" ? "border-emerald-500" : "border-rose-500"} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md`}>
                              {user?.profilePhoto ? (
                                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                user?.fullName ? user.fullName.charAt(0).toUpperCase() : "E"
                              )}
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`size-2.5 rounded-full inline-block ${log.type === "in" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                                <span className="font-black text-base text-[#182535]">{log.time}</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-600 leading-relaxed mt-1">
                                {log.location && typeof log.location.lat === "number" ? `GPS: ${log.location.lat.toFixed(6)}, ${log.location.lng.toFixed(6)}` : "Location recorded."}
                                <br/>
                                <span className="text-slate-400 font-normal">
                                  {log.type === "in" ? "R city Mall, Sangli, Vishrambag, Sangli Miraj Kupwad" : "Pearl Enclave, C.S.NO 4360/K, MSEB Rd, Sangli"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                </div>
              ) : (
                /* CALENDAR VIEW MATCHING IMAGE 1 */
                <div className="bg-[#F4F6F9] min-h-full text-slate-800 flex flex-col font-sans animate-in fade-in duration-200 flex-1">
                  
                  {/* Sub-Header Bar with Month Navigation */}
                  <div className="bg-[#DFF6F5] text-[#182535] px-4 py-3 flex items-center justify-between border-b border-emerald-100 shadow-xs">
                    <button onClick={prevMonth} className="p-1 hover:bg-emerald-200/50 rounded-lg text-slate-700 cursor-pointer">
                      <ChevronLeft className="size-5" />
                    </button>
                    <h3 className="font-extrabold text-base tracking-wide text-[#182535]">
                      {activityMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h3>
                    <button onClick={nextMonth} className="p-1 hover:bg-emerald-200/50 rounded-lg text-slate-700 cursor-pointer">
                      <ChevronRight className="size-5" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 space-y-5 flex-1">
                    
                    {/* 4-Column Summary Box with Website Navy Branding */}
                    <div className="bg-gradient-to-r from-[#063B78] via-[#0A4F9E] to-[#063B78] rounded-2xl p-4 text-white shadow-xl border border-blue-400/20">
                      <div className="grid grid-cols-4 text-center divide-x divide-white/15 text-xs">
                        <div className="px-1 space-y-1">
                          <span className="text-[#00D2A0] font-bold block text-[11px]">Present</span>
                          <span className="text-[#00D2A0] font-black text-lg block">{monthSummary.presentCount}</span>
                        </div>
                        <div className="px-1 space-y-1">
                          <span className="text-[#FF5252] font-bold block text-[11px]">Absent</span>
                          <span className="text-[#FF5252] font-black text-lg block">{monthSummary.absentCount}</span>
                        </div>
                        <div className="px-1 space-y-1">
                          <span className="text-[#FF9F43] font-bold block text-[11px]">Half Days</span>
                          <span className="text-[#FF9F43] font-black text-lg block">{monthSummary.halfDayCount}</span>
                        </div>
                        <div className="px-1 space-y-1">
                          <span className="text-[#54A0FF] font-bold block text-[11px]">Overtime</span>
                          <span className="text-[#54A0FF] font-black text-lg block">{monthSummary.overtimeCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Calendar Days Header */}
                    <div className="grid grid-cols-7 text-center font-extrabold text-xs sm:text-sm text-[#182535]">
                      <span className="text-[#FF5252]">Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    {/* Calendar Day Grid */}
                    <div className="grid grid-cols-7 gap-2.5 text-center">
                      {renderCalendarDays()}
                    </div>

                  </div>

                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 3: ACCOUNT (Profile & Settings) */}
        {navTab === "account" && (
          <div className="p-4 sm:p-5 space-y-5 animate-in fade-in duration-300">
            <div className="bg-[#0C1726] p-6 rounded-3xl border border-slate-800 text-center space-y-3 relative overflow-hidden shadow-xl">
              <div className="size-20 bg-gradient-to-br from-[#021D3D] to-[#0A4F9E] text-white rounded-full flex items-center justify-center mx-auto text-3xl font-black ring-4 ring-emerald-500/20 border-2 border-emerald-400">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "E"}
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{user.fullName}</h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Mobile ID: {user.mobile}</p>
                <p className="text-xs font-semibold text-emerald-400 mt-1">{user.trade || "Staff Employee"}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs font-bold text-slate-300">
                <span className="text-slate-500 block text-[10px] uppercase">Employer / Company</span>
                <span className="text-white text-sm font-extrabold">{user.employerName || employerName}</span>
              </div>
            </div>

            {/* Logout Action */}
            <Button
              onClick={handleLogout}
              className="w-full h-12 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-black text-sm rounded-2xl flex items-center justify-center gap-2"
            >
              <LogOut className="size-4" /> Sign Out Account
            </Button>
          </div>
        )}

      </div>

      {/* ── BOTTOM NAVIGATION BAR (Website Navy Theme #063B78) ── */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#063B78] text-white border-t border-blue-400/20 z-30 px-4 py-2 flex items-center justify-around shadow-2xl">

        {/* Tab 1: Punch */}
        <button
          onClick={() => setNavTab("punch")}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            navTab === "punch" ? "text-white font-black" : "text-blue-200/70 hover:text-white"
          }`}
        >
          <Fingerprint className={`size-6 ${navTab === "punch" ? "text-[#00FF66] scale-110" : "text-blue-200/70"}`} />
          <span className={navTab === "punch" ? "text-[#00FF66]" : ""}>Punch</span>
        </button>

        {/* Tab 2: Activity */}
        <button
          onClick={() => setNavTab("activity")}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            navTab === "activity" ? "text-white font-black" : "text-blue-200/70 hover:text-white"
          }`}
        >
          <Calendar className={`size-6 ${navTab === "activity" ? "text-[#00FF66] scale-110" : "text-blue-200/70"}`} />
          <span className={navTab === "activity" ? "text-[#00FF66]" : ""}>Activity</span>
        </button>

        {/* Tab 3: Account */}
        <button
          onClick={() => setNavTab("account")}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            navTab === "account" ? "text-white font-black" : "text-blue-200/70 hover:text-white"
          }`}
        >
          <User className={`size-6 ${navTab === "account" ? "text-[#00FF66] scale-110" : "text-blue-200/70"}`} />
          <span className={navTab === "account" ? "text-[#00FF66]" : ""}>Account</span>
        </button>

      </nav>

      {/* Global Inline Keyframes for Green Scanning Laser */}
      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 85%; }
          100% { top: 10%; }
        }
      `}</style>

    </div>
  );
}
