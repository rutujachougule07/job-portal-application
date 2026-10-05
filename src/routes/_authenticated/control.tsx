import { createFileRoute } from "@tanstack/react-router";
import { GenericAdminPage } from "@/components/portal/Dashboards";

export const Route = createFileRoute("/_authenticated/control")({
  head: () => ({
    meta: [
      { title: "Platform Control — REAL JOB" },
      { name: "description", content: "Manage REAL JOB users, employers, jobs, payroll and system health." },
      { property: "og:title", content: "Platform Control — REAL JOB" },
      { property: "og:description", content: "REAL JOB platform administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <GenericAdminPage role="super" title="Platform Control" />,
});

