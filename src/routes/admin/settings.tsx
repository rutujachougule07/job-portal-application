import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, Users, BarChart2, Settings, Building2, Globe, Mail, Phone, MapPin, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/admin/applications", icon: <FileText className="size-4" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="size-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

function AdminSettingsPage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState(user?.name ? `${user.name} Hiring` : "RealJob Admin Portal");
  const [email, setEmail] = useState(user?.email || "admin@realjob.in");
  const [phone, setPhone] = useState(user?.mobile || "+91 98220 11223");
  const [website, setWebsite] = useState("https://realjob.in");
  const [location, setLocation] = useState("Mumbai, Maharashtra");
  const [industry, setIndustry] = useState("Technology & Recruitment");

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
    else if (user?.role === "user") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role === "user") return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: companyName, mobile: phone });
    toast.success("Recruiter profile updated successfully!");
  };

  return (
    <DashboardLayout navItems={adminNav} title="Company & Admin Settings" roleLabel="Admin">
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 space-y-4 shadow-xs">
          <h3 className="font-black text-[#10233F] text-sm flex items-center gap-2">
            <Building2 className="size-4 text-[#063B78]" /> Recruiter & Employer Profile
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Company / Recruiter Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Company Website</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Headquarters Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Industry Sector</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#063B78] text-white font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[#082F63] transition-colors"
            >
              <Save className="size-4" /> Save Profile Settings
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
