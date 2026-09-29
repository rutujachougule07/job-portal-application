import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function StatCard({ label, value, change, icon: Icon, to }: { label: string; value: string; change: string; icon: LucideIcon; to?: string }) {
  const Card = (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-md bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-4 inline-flex items-center text-xs font-semibold text-success">
        <ArrowUpRight className="size-3" />
        {change}
      </p>
    </div>
  );

  return to ? <Link to={to}>{Card}</Link> : Card;
}
