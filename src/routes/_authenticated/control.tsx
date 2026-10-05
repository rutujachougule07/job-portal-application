import { createFileRoute } from "@tanstack/react-router";
import { GenericAdminPage } from "@/components/portal/Dashboards";

export const Route = createFileRoute("/_authenticated/control")({
  head: () => ({
    meta: [
      { title: "Platform Control — Karyam" },
      { name: "description", content: "Manage Karyam users, employers, jobs, payroll and system health." },
      { property: "og:title", content: "Platform Control — Karyam" },
      { property: "og:description", content: "Karyam platform administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <GenericAdminPage role="super" title="Platform Control" />,
});

