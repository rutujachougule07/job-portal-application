export function IndianFlagIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`shrink-0 rounded-full overflow-hidden shadow-xs ring-1 ring-black/10 ${className}`}
      aria-hidden="true"
    >
      {/* Top Saffron Band */}
      <rect x="0" y="0" width="32" height="10.66" fill="#FF9933" />
      {/* Middle White Band */}
      <rect x="0" y="10.66" width="32" height="10.68" fill="#FFFFFF" />
      {/* Bottom Green Band */}
      <rect x="0" y="21.34" width="32" height="10.66" fill="#138808" />
      {/* Ashoka Chakra */}
      <circle cx="16" cy="16" r="4.3" fill="none" stroke="#000080" strokeWidth="0.8" />
      <circle cx="16" cy="16" r="1.1" fill="#000080" />
      {/* 24 Spokes (12 Diametrical Lines) */}
      {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map((deg) => (
        <line
          key={deg}
          x1={16 - 4.3 * Math.cos((deg * Math.PI) / 180)}
          y1={16 - 4.3 * Math.sin((deg * Math.PI) / 180)}
          x2={16 + 4.3 * Math.cos((deg * Math.PI) / 180)}
          y2={16 + 4.3 * Math.sin((deg * Math.PI) / 180)}
          stroke="#000080"
          strokeWidth="0.45"
        />
      ))}
    </svg>
  );
}
