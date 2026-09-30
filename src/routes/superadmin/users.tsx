import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Users, ShieldCheck, Briefcase, FileText, BarChart2, Settings, Activity, UserX, UserCheck, Trash2, Plus, RefreshCw } from "lucide-react";
import { useAuth, getAllUsers, saveUsers, logActivity } from "@/lib/auth-context";
import { DashboardLayout, NavItem } from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/superadmin/users")({
  component: SuperAdminUsersPage,
});

const superAdminNav: NavItem[] = [
  { label: "Dashboard", href: "/superadmin/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { label: "User Management", href: "/superadmin/users", icon: <Users className="size-4" /> },
  { label: "Admin Management", href: "/superadmin/admins", icon: <ShieldCheck className="size-4" /> },
  { label: "Job Management", href: "/superadmin/jobs", icon: <Briefcase className="size-4" /> },
  { label: "Applications", href: "/superadmin/applications", icon: <FileText className="size-4" /> },
  { label: "Activity Logs", href: "/superadmin/activity-logs", icon: <Activity className="size-4" /> },
  { label: "Reports", href: "/superadmin/reports", icon: <BarChart2 className="size-4" /> },
  { label: "System Settings", href: "/superadmin/settings", icon: <Settings className="size-4" /> },
];

function SuperAdminUsersPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(getAllUsers().filter((u) => u.role === "user"));
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/superadmin/login" });
    else if (user?.role !== "superadmin") navigate({ to: "/unauthorized" });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "superadmin") return null;

  const refresh = () => setUsers(getAllUsers().filter((u) => u.role === "user"));

  const handleToggle = (id: string, disabled: boolean) => {
    const all = getAllUsers();
    const updated = all.map((u) => u.id === id ? { ...u, disabled: !disabled } : u);
    saveUsers(updated);
    logActivity(disabled ? "USER_ACTIVATED" : "USER_DISABLED", user!.id, user!.name, `User ID: ${id}`);
    refresh();
    toast.success(disabled ? "User activated." : "User disabled.");
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    const all = getAllUsers();
    saveUsers(all.filter((u) => u.id !== id));
    logActivity("USER_DELETED", user!.id, user!.name, `Deleted: ${name}`);
    refresh();
    toast.success("User deleted.");
  };

  const handleCreate = (e: React.FormEvent): void => {
    e.preventDefault();
    const all = getAllUsers();
    if (all.find((u) => u.email === form.email)) { toast.error("Email already exists."); return; }
    const newUser = { ...form, id: `user-${Date.now()}`, role: "user", createdAt: new Date().toISOString(), disabled: false };
    saveUsers([...all, newUser]);
    logActivity("USER_CREATED", user!.id, user!.name, `Created: ${form.name}`);
    setForm({ name: "", email: "", mobile: "", password: "" });
    setShowCreate(false);
    refresh();
    toast.success("User created successfully!");
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formFields: [string, string][] = [
    ["name", "Full Name"],
    ["email", "Email"],
    ["mobile", "Mobile"],
    ["password", "Password"],
  ];

  return (
    <DashboardLayout navItems={superAdminNav} title="User Management" roleLabel="Super Admin">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <input
          type="text" placeholder="Search users..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white text-sm font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78] transition-all"
        />
        <button onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-2 bg-[#063B78] text-white font-black text-xs px-4 py-2.5 rounded-xl hover:bg-[#082F63] transition-all shrink-0">
          <Plus className="size-4" /> Create User
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 mb-5">
          <h3 className="font-black text-[#10233F] text-sm mb-4">Create New User</h3>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-3">
            {formFields.map(([k, l]) => (
              <div key={k}>
                <label className="block text-xs font-black text-[#10233F] mb-1">{l}</label>
                <input type={k === "password" ? "password" : "text"} required
                  value={(form as Record<string, string>)[k]}
                  onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-[#DCE5F0] bg-[#F5F8FC] text-sm font-semibold text-[#10233F] focus:outline-none focus:border-[#063B78] transition-all" />
              </div>
            ))}
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="bg-[#FFC400] text-[#082F63] font-black text-xs px-5 py-2 rounded-xl hover:bg-yellow-300 transition-all">Create User</button>
              <button type="button" onClick={() => setShowCreate(false)} className="text-xs font-bold text-[#5B6B7F] px-4 py-2 rounded-xl border border-[#DCE5F0] hover:bg-[#F5F8FC] transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#DCE5F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DCE5F0] bg-[#F5F8FC]">
                {["User", "Email", "Mobile", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-black uppercase tracking-wide text-[#5B6B7F] px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F0]">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-xs font-semibold text-[#5B6B7F]">No users found.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#F5F8FC] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-lg bg-[#063B78] text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-xs font-black text-[#10233F]">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#5B6B7F]">{u.email}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#5B6B7F]">{u.mobile || "—"}</td>
                  <td className="px-4 py-3 text-[10px] font-semibold text-[#5B6B7F]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black ${u.disabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {u.disabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleToggle(u.id, u.disabled)}
                        className={`p-1.5 rounded-lg transition-colors ${u.disabled ? "text-green-600 hover:bg-green-50" : "text-orange-500 hover:bg-orange-50"}`}
                        title={u.disabled ? "Activate" : "Disable"}>
                        {u.disabled ? <UserCheck className="size-4" /> : <UserX className="size-4" />}
                      </button>
                      <button onClick={() => handleDelete(u.id, u.name)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
