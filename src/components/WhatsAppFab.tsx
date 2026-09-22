"use client";

import { MessageCircle } from "lucide-react";
import { STORE } from "@/lib/utils";
import { useCommerceSettings } from "@/lib/use-settings";

export default function WhatsAppFab() {
  const settings = useCommerceSettings();
  const num = (settings.store_whatsapp || STORE.phoneRaw).replace(/\D/g, "");
  const href = `https://wa.me/${num}?text=${encodeURIComponent("Hi Jai Jinendra Collection! I want to enquire about your collection.")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="hidden lg:grid fixed z-40 right-6 bottom-6 w-14 h-14 rounded-full bg-[#25D366] text-white place-items-center shadow-[0_12px_30px_-8px_rgba(37,211,102,0.8)] hover:scale-105 transition"
    >
      <MessageCircle size={26} />
    </a>
  );
}
