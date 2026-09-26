import { Link } from "@tanstack/react-router";

export function LogoIcon({ className = "h-14" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="REAL JOB Logo"
      className={`${className} object-contain shrink-0`}
    />
  );
}

export function Brand({
  className = "h-14 sm:h-16",
}: {
  className?: string;
  compact?: boolean;
  showTagline?: boolean;
  titleText?: string;
}) {
  return (
    <Link to="/" className="inline-flex items-center gap-2 group select-none shrink-0" aria-label="REAL JOB Logo">
      <img
        src="/logo.png"
        alt="REAL JOB Logo"
        className={`${className} object-contain transition-transform duration-200 group-hover:scale-105`}
      />
    </Link>
  );
}

