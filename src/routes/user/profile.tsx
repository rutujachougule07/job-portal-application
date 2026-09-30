import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, User, Bell, Settings, Heart, Search, Save, Camera, FileCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/user/profile")({
  component: UserProfilePage,
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

function UserProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    location: "Pune, Maharashtra",
    dob: "1998-05-14",
    gender: "Male",
    objective: "Passionate professional seeking challenging growth opportunities in top technology conglomerates.",
    skills: "React, Node.js, TypeScript, Tailwind CSS, SQL",
    experience: "3 Years",
    education: "B.Tech in Computer Science",
    certifications: "AWS Certified Developer, React Professional",
    languages: "English, Hindi, Marathi",
    currentSalary: "₹6,00,000 / Year",
    expectedSalary: "₹10,00,000 / Year",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/user/login" });
    else if (user?.role !== "user") navigate({ to: "/unauthorized" });
    else {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        mobile: user.mobile || "",
      }));
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "user") return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateUser({ name: form.name, mobile: form.mobile });
    setSaving(false);
    toast.success("Profile saved successfully!");
  };

  // Profile completion % calculation
  const fields = [
    form.name, form.mobile, user?.email, form.location, form.dob, form.gender,
    form.objective, form.skills, form.experience, form.education, form.certifications,
    form.languages, form.currentSalary, form.expectedSalary
  ];
  const filledCount = fields.filter((f) => Boolean(f && f.toString().trim())).length;
  const completion = Math.round((filledCount / fields.length) * 100);

  return (
    <DashboardLayout navItems={userNav} title="My Profile" roleLabel="Worker">
      <div className="max-w-3xl space-y-6">
        {/* Profile Completion Header Card */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="size-20 rounded-2xl bg-[#063B78] text-white font-black text-2xl flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={() => toast.info("Profile photo upload simulation.")}
                className="absolute -bottom-1 -right-1 size-7 rounded-lg bg-[#FFC400] flex items-center justify-center shadow-xs"
              >
                <Camera className="size-3.5 text-[#082F63]" />
              </button>
            </div>
            <div className="flex-1 w-full text-center sm:text-left">
              <h2 className="text-lg font-black text-[#10233F]">{user?.name}</h2>
              <p className="text-xs font-semibold text-[#5B6B7F]">{user?.email}</p>

              {/* Completion Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs font-bold text-[#5B6B7F] mb-1">
                  <span>Profile Strength & Completion</span>
                  <span className="text-[#063B78] font-black">{completion}%</span>
                </div>
                <div className="h-2.5 bg-[#EBF1F8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#063B78] via-[#125BB5] to-[#FFC400] rounded-full transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Personal Information */}
          <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 space-y-4 shadow-xs">
            <h3 className="font-black text-[#10233F] text-sm flex items-center gap-2 border-b border-[#DCE5F0] pb-3">
              <User className="size-4 text-[#063B78]" /> Personal Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Email (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] text-xs font-semibold text-[#5B6B7F] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Current Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Professional Information */}
          <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 space-y-4 shadow-xs">
            <h3 className="font-black text-[#10233F] text-sm flex items-center gap-2 border-b border-[#DCE5F0] pb-3">
              <Briefcase className="size-4 text-[#063B78]" /> Professional Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Career Objective / Summary</label>
              <textarea
                rows={2}
                value={form.objective}
                onChange={(e) => setForm({ ...form, objective: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Key Skills (comma separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Total Experience</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Highest Education</label>
                <input
                  type="text"
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Certifications</label>
                <input
                  type="text"
                  value={form.certifications}
                  onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Languages Spoken</label>
                <input
                  type="text"
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Current Salary</label>
                <input
                  type="text"
                  value={form.currentSalary}
                  onChange={(e) => setForm({ ...form, currentSalary: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Expected Salary</label>
                <input
                  type="text"
                  value={form.expectedSalary}
                  onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#063B78] text-white font-black text-xs px-6 py-3 rounded-xl hover:bg-[#082F63] transition-colors shadow-xs"
            >
              <Save className="size-4" /> {saving ? "Saving..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
