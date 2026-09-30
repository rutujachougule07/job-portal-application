import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, FileText, Users, BarChart2, Settings, Building2, Globe, Mail, Phone, MapPin, Save, Calendar, ShieldCheck, Share2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/company-profile")({
  component: AdminCompanyProfilePage,
});

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "Manage Jobs", href: "/admin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/admin/applications", icon: <FileText className="size-4" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="size-4" /> },
  { label: "Interviews", href: "/admin/interviews", icon: <Calendar className="size-4" /> },
  { label: "Company Profile", href: "/admin/company-profile", icon: <Building2 className="size-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "Notifications", href: "/admin/notifications", icon: <Share2 className="size-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
];

function AdminCompanyProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  const [company, setCompany] = useState({
    companyName: user?.name ? `${user.name} Engineering` : "L&T Infrastructure Corp",
    industry: "Engineering & Heavy Construction",
    companySize: "1,000 - 5,000 Employees",
    website: "https://www.larsentoubro.com",
    location: "Mumbai, Maharashtra",
    contactEmail: user?.email || "recruitment@larsentoubro.com",
    contactPhone: user?.mobile || "+91 98220 11223",
    about: "Premier infrastructure & technology engineering conglomerate building landmark infrastructure projects across India.",
    linkedin: "https://linkedin.com/company/lnt-construction",
    twitter: "https://twitter.com/lnt_corp",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/admin/login" });
    else if (user?.role === "user") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role === "user") return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateUser({ name: company.companyName, mobile: company.contactPhone });
      setSaving(false);
      toast.success("Company profile saved successfully! Updated info will reflect on all active job postings.");
    }, 500);
  };

  return (
    <DashboardLayout navItems={adminNav} title="Company Profile" roleLabel="Admin">
      <div className="max-w-3xl space-y-6">
        {/* Company Header Card */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-6 shadow-xs flex flex-col sm:flex-row items-center gap-5">
          <div className="size-20 rounded-2xl bg-[#063B78] text-[#FFC400] font-black text-2xl flex items-center justify-center shrink-0">
            {company.companyName.charAt(0)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-black text-[#10233F]">{company.companyName}</h2>
              <ShieldCheck className="size-4 text-[#063B78]" />
            </div>
            <p className="text-xs font-semibold text-[#5B6B7F]">{company.industry} · {company.location}</p>
            <p className="text-[10px] font-bold text-[#063B78] mt-1">{company.website}</p>
          </div>
        </div>

        {/* Company Profile Edit Form */}
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#DCE5F0] p-6 space-y-4 shadow-xs">
          <h3 className="font-black text-[#10233F] text-sm flex items-center gap-2 border-b border-[#DCE5F0] pb-3">
            <Building2 className="size-4 text-[#063B78]" /> Edit Organization Details
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Company / Recruiter Name *</label>
            <input
              type="text"
              required
              value={company.companyName}
              onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Industry Sector</label>
              <input
                type="text"
                value={company.industry}
                onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Company Size</label>
              <select
                value={company.companySize}
                onChange={(e) => setCompany({ ...company, companySize: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              >
                <option value="1 - 50 Employees">1 - 50 Employees</option>
                <option value="50 - 500 Employees">50 - 500 Employees</option>
                <option value="1,000 - 5,000 Employees">1,000 - 5,000 Employees</option>
                <option value="10,000+ Employees">10,000+ Employees</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Official Website</label>
              <input
                type="text"
                value={company.website}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Headquarters Location</label>
              <input
                type="text"
                value={company.location}
                onChange={(e) => setCompany({ ...company, location: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={company.contactEmail}
                onChange={(e) => setCompany({ ...company, contactEmail: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Contact Phone</label>
              <input
                type="text"
                required
                value={company.contactPhone}
                onChange={(e) => setCompany({ ...company, contactPhone: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B6B7F] mb-1">About Company</label>
            <textarea
              rows={3}
              value={company.about}
              onChange={(e) => setCompany({ ...company, about: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">LinkedIn Page</label>
              <input
                type="text"
                value={company.linkedin}
                onChange={(e) => setCompany({ ...company, linkedin: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5B6B7F] mb-1">Twitter / X Handle</label>
              <input
                type="text"
                value={company.twitter}
                onChange={(e) => setCompany({ ...company, twitter: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-white text-xs font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#063B78] text-white font-black text-xs px-6 py-2.5 rounded-xl hover:bg-[#082F63] transition-colors"
            >
              <Save className="size-4" /> {saving ? "Saving..." : "Save Company Profile"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
