import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ArrowLink({ to, children, testId, dark = false, className = "" }) {
  return (
    <Link
      data-testid={testId}
      to={to}
      className={`group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${dark ? "text-neutral-950 hover:text-neutral-700" : "text-neutral-50 hover:text-[#CCFF00]"} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
    </Link>
  );
}

export function CTAButton({ to, children, testId, variant = "lime", className = "" }) {
  const styles = variant === "lime"
    ? "bg-[#CCFF00] text-neutral-950 hover:bg-neutral-50"
    : "border border-neutral-700 bg-transparent text-neutral-50 hover:border-[#CCFF00] hover:text-[#CCFF00]";

  return (
    <Link
      data-testid={testId}
      to={to}
      className={`group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.16em] transition-colors duration-300 ${styles} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
    </Link>
  );
}

export function ScrollCue({ target = "#services-intro", testId }) {
  return (
    <a
      data-testid={testId}
      href={target}
      className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-neutral-400 transition-colors duration-300 hover:text-[#CCFF00]"
    >
      SEE WHAT WE DO
      <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true" />
    </a>
  );
}
