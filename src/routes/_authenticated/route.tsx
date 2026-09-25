import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      const userStr = window.localStorage.getItem("realjob-user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return { user };
        } catch {
          // ignore
        }
      }
      // Demo / fallback user session
      return { user: { id: "demo-user", email: "user@realjob.in" } };
    }
    return { user: { id: "demo-user", email: "user@realjob.in" } };
  },
  component: () => <Outlet />,
});
