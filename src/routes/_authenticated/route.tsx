import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) return { user: data.user };
    } catch {
      // Fallthrough to demo/guest view if role selected
    }
    const role = typeof window !== "undefined" ? window.localStorage.getItem("karyam-role") : null;
    if (role) {
      return { user: { id: "demo-user", email: "demo@karyam.in", user_metadata: { role } } };
    }
    throw redirect({ to: "/auth", search: { mode: "login", role: "user" } });
  },
  component: () => <Outlet />,
});
