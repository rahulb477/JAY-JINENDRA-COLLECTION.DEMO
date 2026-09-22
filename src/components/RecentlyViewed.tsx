"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";

type Recent = { slug: string; name: string; image?: string; price?: number };

export default function RecentlyViewed() {
  const [items, setItems] = useState<Recent[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = JSON.parse(localStorage.getItem("nyc_recent") ?? "[]");
        if (Array.isArray(raw)) setItems(raw.slice(0, 8));
      } catch {
        setItems([]);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (!items.length) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <p className="text-[11px] font-bold tracking-[0.25em] text-[#9a7420]">PICK UP WHERE YOU LEFT OFF</p>
      <h2 className="font-display font-extrabold text-2xl sm:text-3xl mt-1">Recently Viewed</h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar mt-4 -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        {items.map((item) => (
          <Link key={item.slug} href={`/product/${item.slug}`} className="shrink-0 w-[132px] sm:w-[160px] group">
            <span className="block relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
              {item.image ? <Image src={item.image} alt={item.name} fill sizes="160px" className="object-cover group-hover:scale-105 transition duration-500" /> : null}
            </span>
            <span className="block text-[12.5px] font-semibold mt-2 clamp-2 group-hover:text-[#9a7420]">{item.name}</span>
            {!!item.price && <span className="block text-[12.5px] font-extrabold mt-0.5">{formatINR(item.price)}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}
