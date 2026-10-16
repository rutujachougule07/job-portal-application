import { Link } from "@tanstack/react-router";

export function LogoIcon({ className = "h-14" }: { className?: string }) {
  return (
    <img
      src="/logo_icon.png"
      alt="REAL JOB Emblem"
      className={`${className} object-contain shrink-0`}
    />
  );
}

export function Brand({
  className = "h-14 sm:h-16",
  to = "/superadmin",
}: {
  className?: string;
  compact?: boolean;
  showTagline?: boolean;
  titleText?: string;
  to?: string;
}) {
  return (
    <Link
      to={to as any}
      className="inline-flex items-center gap-2 group select-none shrink-0 cursor-pointer"
      aria-label="REAL JOB Logo"
      title="REAL JOB — Super Admin Login"
    >
      <img
        src="/logo.png"
        alt="REAL JOB Logo"
        className={`${className} object-contain transition-transform duration-200 group-hover:scale-105`}
      />
    </Link>
  );
}

