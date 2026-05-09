import { cn } from "@/lib/cn";

/** Marca PageBoost — símbolo + wordmark (SVG, escalável) */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="pb-logo-grad" x1="8" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#pb-logo-grad)" />
      <path
        d="M12 26V14h5.2c2.9 0 4.8 1.5 4.8 4 0 2.6-2 4-4.9 4H15.2v4H12zm3.2-7.2h2.1c1.3 0 2-.6 2-1.6 0-1-.7-1.6-2-1.6h-2.1v3.2z"
        fill="white"
      />
      <path d="M24 14h4l5 12h-3.2l-1-2.8h-5.4L22.2 26H19l5-12z" fill="white" fillOpacity="0.92" />
      <path d="M25.2 19.2l1.6 4.2h-3.2l1.6-4.2z" fill="#0b0f1a" fillOpacity="0.15" />
    </svg>
  );
}

export function LogoWordmark({
  className,
  size = "md",
  variant = "onLight",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "onLight" | "onDark";
}) {
  const icon =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const text =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl font-semibold" : "text-lg font-semibold";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={icon} />
      <span
        className={cn(
          "tracking-tight",
          text,
          variant === "onDark" &&
            "bg-gradient-to-r from-white via-indigo-100 to-violet-200 bg-clip-text text-transparent",
          variant === "onLight" && "text-slate-900 font-semibold",
        )}
      >
        PageBoost
      </span>
    </div>
  );
}
