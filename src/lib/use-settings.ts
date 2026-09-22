"use client";

import { useEffect, useState } from "react";

export type CommerceSettings = {
  announcement: string;
  delivery_charge: string;
  free_shipping_above: string;
  store_phone: string;
  store_whatsapp: string;
  store_address: string;
  store_hours: string;
  store_maps: string;
  instagram_url: string;
  cod_enabled: string;
};

export const DEFAULT_SETTINGS: CommerceSettings = {
  announcement: "FREE SHIPPING ON SELECTED ORDERS • EASY STORE PICKUP",
  delivery_charge: "49",
  free_shipping_above: "1499",
  store_phone: "+91 94686 23457",
  store_whatsapp: "919468623457",
  store_address: "Sarafa Bazaar, Jodhpur, Rajasthan, India",
  store_hours: "10:00 AM – 9:00 PM (All days)",
  store_maps: "https://www.google.com/maps/search/?api=1&query=Sarafa+Bazaar+Jodhpur+Rajasthan",
  instagram_url: "https://instagram.com/jai_jinendra_collection__",
  cod_enabled: "true",
};

let cache: CommerceSettings | null = null;
let inflight: Promise<CommerceSettings> | null = null;

export function useCommerceSettings() {
  const [settings, setSettings] = useState<CommerceSettings>(cache ?? DEFAULT_SETTINGS);

  useEffect(() => {
    if (!inflight) {
      inflight = fetch("/api/settings")
        .then((r) => r.json())
        .then((j) => {
          const next: CommerceSettings = { ...DEFAULT_SETTINGS, ...(j.settings ?? {}) };
          cache = next;
          return next;
        })
        .catch(() => DEFAULT_SETTINGS);
    }
    void inflight.then((s) => setSettings(s));
  }, []);

  return settings;
}

export function deliveryChargeFor(
  subtotal: number,
  method: string,
  settings: Pick<CommerceSettings, "delivery_charge" | "free_shipping_above">
) {
  if (method === "STORE_PICKUP" || subtotal <= 0) return 0;
  const freeAbove = Number(settings.free_shipping_above) || 1499;
  const charge = Number(settings.delivery_charge) || 0;
  return subtotal >= freeAbove ? 0 : charge;
}

export function freeShippingAbove(settings: Pick<CommerceSettings, "free_shipping_above">) {
  return Number(settings.free_shipping_above) || 1499;
}
