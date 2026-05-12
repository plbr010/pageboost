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
      {/* Marcador minimalista: barras ascendentes (crescimento) */}
      <path
        d="M11 28V22h4v6h-4zm7 0V18h4v10h-4zm7 0V14h4v14h-4z"
        fill="white"
        fillOpacity="0.95"
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
          variant === "onDark" && "text-slate-50 drop-shadow-sm",
          variant === "onLight" &&
            "bg-gradient-to-r from-slate-900 via-indigo-800 to-violet-800 bg-clip-text text-transparent",
        )}
      >
        PageBoost
      </span>
    </div>
  );
}
