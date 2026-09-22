"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/** JJC mark: gold hanger with "JJC" monogram (gold JJ, silver C). */
export function JJCMark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* hanger hook */}
      <circle cx="50" cy="15.5" r="5" stroke="#d9b45c" strokeWidth="3" />
      <path d="M50 20.5 V27" stroke="#d9b45c" strokeWidth="3" strokeLinecap="round" />
      {/* hanger shoulders + bar */}
      <path d="M19 47 L50 27 L81 47 Z" stroke="#d9b45c" strokeWidth="3.2" strokeLinejoin="round" />
      {/* JJC monogram */}
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fontSize="34"
        fontWeight="700"
        letterSpacing="1"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        <tspan fill="#d9b45c">JJ</tspan>
        <tspan fill="#dcdcdc">C</tspan>
      </text>
    </svg>
  );
}

export default function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="Jai Jinendra Collection home">
      <span
        className={cn(
          "relative grid place-items-center bg-[#050505] shrink-0 rounded-[6px]",
          compact ? "w-8 h-8" : "w-9 h-9 sm:w-11 sm:h-11"
        )}
      >
        <JJCMark className={compact ? "w-6 h-6" : "w-7 h-7 sm:w-8 sm:h-8"} title="Jai Jinendra Collection" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display font-bold tracking-[0.04em] whitespace-nowrap",
            compact ? "text-[13px]" : "text-[13px] sm:text-[16px]"
          )}
        >
          <span className={light ? "text-white" : "text-[#050505]"}>JAI JINENDRA</span>
          <span className={cn("ml-1.5", light ? "text-[#e8c877]" : "text-[#9a7420]")}>COLLECTION</span>
        </span>
        <span
          className={cn(
            "block font-semibold whitespace-nowrap",
            compact ? "text-[7px] tracking-[0.28em] mt-0.5" : "text-[7px] sm:text-[8px] tracking-[0.3em] mt-1"
          )}
        >
          <span className={cn("px-1", light ? "text-neutral-300 bg-white/10" : "text-neutral-500 bg-neutral-100")}>
            JJC · SARAFA BAZAAR, JODHPUR
          </span>
        </span>
      </span>
    </Link>
  );
}
