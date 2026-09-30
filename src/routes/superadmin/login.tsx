import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Crown, AlertCircle, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/superadmin/login")({
  component: SuperAdminLoginPage,
});

function SuperAdminLoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("superadmin@realjob.in");
  const [password, setPassword] = useState("superadmin123");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated && user?.role === "superadmin") {
    navigate({ to: "/superadmin/dashboard" });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) return setError(res.error || "Authentication failed.");
    const stored = JSON.parse(localStorage.getItem("realjob_auth_user") || "{}");
    if (stored.role !== "superadmin") {
      setError("Access denied. Super Admin credentials required.");
      return;
    }
    toast.success("Super Admin authenticated.");
    navigate({ to: "/superadmin/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#FFC400]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
              <Crown className="size-8 text-[#FFC400]" />
            </div>
            <h1 className="text-2xl font-black text-white">Super Admin</h1>
            <p className="text-xs font-semibold text-white/50 mt-1">System Level Access — Restricted</p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3 mb-6 text-xs font-semibold text-white/60">
            <Lock className="size-3.5 shrink-0" />
            This portal is not publicly accessible.
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl p-3 mb-5 text-xs font-semibold">
              <AlertCircle className="size-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-white/80 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/10 text-sm font-semibold text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-white/10 bg-white/10 text-sm font-semibold text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 disabled:opacity-60 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-purple-500/30 mt-2"
            >
              {loading ? "Authenticating..." : "Access System"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
