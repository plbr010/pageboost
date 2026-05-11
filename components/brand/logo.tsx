"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/** Ícone da marca — gradiente e IDs únicos (evita colisão entre vários SVG na página). */
export function LogoMark({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gid = `pb-mark-grad-${uid}`;

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="6" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="0.45" stopColor="#6366f1" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gid})`} />
      {/* Folha / página + seta de impulso (forma única, minimalista) */}
      <path
        d="M12 28V14h7.2c2.4 0 3.8 1.35 3.8 3.25 0 1.35-.65 2.35-1.85 2.85L23.5 28h-3.2l-1.35-6.65h-3.45V28H12zm3.15-9.4h3.5c1.05 0 1.55-.45 1.55-1.2 0-.75-.5-1.2-1.55-1.2h-3.5v2.4z"
        fill="white"
      />
      <path
        d="M24.5 12.5L30 18h-3.25v5.5h-2.9V18H20l4.5-5.5z"
        fill="white"
        fillOpacity="0.92"
      />
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
  const icon = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const text =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl font-semibold tracking-tight" : "text-lg font-semibold tracking-tight";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={icon} />
      <span
        className={cn(
          "font-semibold tracking-tight",
          text,
          variant === "onDark" && "text-white",
          variant === "onLight" && "bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 bg-clip-text text-transparent",
        )}
      >
        PageBoost
      </span>
    </div>
  );
}
