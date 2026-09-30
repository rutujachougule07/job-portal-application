import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/unauthorized")({
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  const { user } = useAuth();

  const homeLink = user?.role === "admin"
    ? "/admin/dashboard"
    : user?.role === "user"
    ? "/user/dashboard"
    : "/";

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="size-24 rounded-3xl bg-red-100 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="size-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-[#10233F] mb-2">403</h1>
        <h2 className="text-xl font-black text-[#10233F] mb-3">Access Denied</h2>
        <p className="text-sm font-semibold text-[#5B6B7F] mb-8">
          You don't have permission to access this page. <br />
          Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-[#DCE5F0] bg-white text-[#10233F] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#F5F8FC] transition-all">
            <ArrowLeft className="size-4" /> Go Back
          </button>
          <Link to={homeLink}
            className="inline-flex items-center gap-2 bg-[#063B78] text-white font-black text-sm px-5 py-2.5 rounded-xl hover:bg-[#082F63] transition-all">
            <Home className="size-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
