import { FileText, Bookmark, Eye, Calendar, Briefcase, Users, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface MetricCardItem {
  id: string;
  title: string;
  count: number | string;
  icon: any;
  bgColor: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
  linkTo: string;
  linkSearch?: Record<string, string>;
  onCardClick?: () => void;
}

interface DashboardMetricCardsProps {
  cards?: MetricCardItem[];
}

export function DashboardMetricCards({ cards }: DashboardMetricCardsProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const CardInner = (
          <div
            className={`p-4 sm:p-5 rounded-2xl border ${card.bgColor} ${card.borderColor} shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer`}
          >
            {/* Top row: Icon box & "View →" link */}
            <div className="flex items-center justify-between mb-3">
              <div
                className={`size-10 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shadow-2xs`}
              >
                <Icon className="size-5" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold ${card.textColor} group-hover:translate-x-0.5 transition-transform`}
              >
                <span>View</span>
                <ArrowRight className="size-3.5" />
              </div>
            </div>

            {/* Bottom row: Large Count & Title */}
            <div>
              <p className="text-2xl sm:text-3xl font-black text-[#10233F] tracking-tight">
                {card.count}
              </p>
              <h3 className="text-xs sm:text-[13px] font-bold text-slate-500 mt-1">
                {card.title}
              </h3>
            </div>
          </div>
        );

        if (card.onCardClick) {
          return (
            <div key={card.id} onClick={card.onCardClick}>
              {CardInner}
            </div>
          );
        }

        const linkProps = card.linkSearch
          ? { to: card.linkTo, search: card.linkSearch }
          : { to: card.linkTo };

        return (
          <Link key={card.id} {...(linkProps as any)} className="block focus:outline-none">
            {CardInner}
          </Link>
        );
      })}
    </div>
  );
}
