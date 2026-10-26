type LogoProps = { className?: string; withWordmark?: boolean };

/** Brand mark: a plan-view corner bracket around a solid foundation block. */
export function Logo({ className = "", withWordmark = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 shrink-0" fill="none">
        <path d="M3 13V3h10" stroke="currentColor" strokeWidth="2" />
        <path d="M29 19v10H19" stroke="currentColor" strokeWidth="2" />
        <rect x="9" y="9" width="14" height="14" fill="#E86B35" />
      </svg>
      {withWordmark && (
        <span className="font-sans text-[0.95rem] font-semibold tracking-[0.32em]">CONSTRUKT</span>
      )}
    </span>
  );
}
