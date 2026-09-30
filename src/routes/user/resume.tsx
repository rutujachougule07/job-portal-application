import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Briefcase, Heart, FileText, User, Bell, Settings,
  Search, FileCheck, Upload, Download, Trash2, CheckCircle2, Star, FileCode
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { dataStore, UserResumeRecord } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/user/resume")({
  component: UserResumePage,
});

const userNav: NavItem[] = [
  { label: "Dashboard", href: "/user/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Browse Jobs", href: "/jobs", icon: <Search className="size-4" /> },
  { label: "My Applications", href: "/user/applications", icon: <FileText className="size-4" /> },
  { label: "Saved Jobs", href: "/user/saved-jobs", icon: <Heart className="size-4" /> },
  { label: "My Profile", href: "/user/profile", icon: <User className="size-4" /> },
  { label: "My Resume", href: "/user/resume", icon: <FileCheck className="size-4" /> },
  { label: "Notifications", href: "/user/notifications", icon: <Bell className="size-4" /> },
  { label: "Settings", href: "/user/settings", icon: <Settings className="size-4" /> },
];

function UserResumePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<UserResumeRecord[]>([]);
  const [uploading, setUploading] = useState(false);

  const loadResumes = () => {
    if (!user) return;
    const userRes = dataStore.getUserResumes(user.id);
    if (userRes.length === 0) {
      // Seed default resume for demo
      const seed: UserResumeRecord = {
        id: `res-demo-001`,
        userId: user.id,
        fileName: `${user.name.replaceAll(" ", "_")}_Resume.pdf`,
        fileSize: "1.2 MB",
        fileFormat: "PDF",
        uploadDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        isDefault: true,
        status: "Active",
      };
      setResumes([seed]);
    } else {
      setResumes(userRes);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/user/login" });
    else if (user?.role !== "user") navigate({ to: "/unauthorized" });
    else loadResumes();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "user") return null;

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".doc") && !file.name.endsWith(".docx")) {
      toast.error("Invalid file format. Please upload PDF, DOC, or DOCX files only.");
      return;
    }

    setUploading(true);
    setTimeout(() => {
      const extension = file.name.split(".").pop()?.toUpperCase() || "PDF";
      const newRes = dataStore.addUserResume({
        userId: user.id,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        fileFormat: extension,
        isDefault: resumes.length === 0,
        status: "Active",
      });
      setUploading(false);
      toast.success(`Uploaded ${file.name} successfully!`);
      loadResumes();
    }, 1200);
  };

  const handleDelete = (id: string) => {
    dataStore.deleteUserResume(id);
    toast.success("Resume deleted.");
    loadResumes();
  };

  return (
    <DashboardLayout navItems={userNav} title="Resume Manager" roleLabel="Worker">
      {/* Upload Banner */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-[#063B78]/30 p-8 text-center mb-6 hover:border-[#063B78] transition-colors">
        <div className="size-12 rounded-2xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center mx-auto mb-3">
          <Upload className="size-6" />
        </div>
        <h3 className="text-sm font-black text-[#10233F]">Upload your latest Resume</h3>
        <p className="text-xs font-semibold text-[#5B6B7F] mt-1 mb-4">
          Supported formats: <span className="font-bold text-[#063B78]">PDF, DOC, DOCX</span> (Max size: 5MB)
        </p>

        <label className="inline-flex items-center gap-2 bg-[#063B78] hover:bg-[#082F63] text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-all">
          <Upload className="size-4" />
          <span>{uploading ? "Uploading..." : "Select Resume File"}</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleSimulateUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Resumes List */}
      <div className="space-y-4">
        <h3 className="font-black text-[#10233F] text-sm">Your Resumes ({resumes.length})</h3>

        <div className="space-y-3">
          {resumes.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-[#DCE5F0] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-[#FFC400]/20 text-[#082F63] flex items-center justify-center font-black text-xs shrink-0">
                  {res.fileFormat}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-[#10233F]">{res.fileName}</p>
                    {res.isDefault && (
                      <span className="bg-[#FFC400]/20 text-[#082F63] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-semibold text-[#5B6B7F] mt-0.5">
                    Uploaded on {res.uploadDate} · {res.fileSize} · Status: <span className="text-green-600 font-bold">{res.status}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => toast.success(`Downloading ${res.fileName}...`)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#F5F8FC] hover:bg-[#EBF1F8] text-[#063B78] font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Download className="size-3.5" /> Download
                </button>

                <button
                  onClick={() => handleDelete(res.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete Resume"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
