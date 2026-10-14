import { createFileRoute } from "@tanstack/react-router";
import AddEmployeePageDemo from "@/components/admin/AddEmployeePage";

export const Route = createFileRoute("/_authenticated/employer/employees")({
  head: () => ({
    meta: [
      { title: "Employees — REAL JOB Employer" },
      { name: "description", content: "Employer Employees management on REAL JOB." },
      { property: "og:title", content: "Employees — REAL JOB Employer" },
      { property: "og:description", content: "Professional employer management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ]
  }),
  component: AddEmployeePageDemo
});
