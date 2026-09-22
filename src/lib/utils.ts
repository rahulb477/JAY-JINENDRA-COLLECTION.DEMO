export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatINR(n: number): string {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

export function discountPct(mrp: number, price: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);
}

export const SIZES_MEN = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
export const SIZES_KIDS = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];

export const PHONE_DISPLAY = "+91 94686 23457";
export const PHONE_RAW = "919468623457";
export const EMAIL = "jaijinendracollection@gmail.com";
export const FACEBOOK_URL = "https://www.facebook.com/122094872732010661";
export const INSTAGRAM_HANDLE = "@jai_jinendra_collection__";
export const INSTAGRAM_URL = "https://instagram.com/jai_jinendra_collection__";

export const BRAND = {
  name: "Jai Jinendra Collection",
  short: "JJC",
  category: "Men's Clothing Store",
  model: "Wholesale & Retail",
  delivery: "Delivery Across India",
  city: "Sarafa Bazaar, Jodhpur, Rajasthan",
};

export const STORE = {
  name: "Jai Jinendra Collection",
  short: "JJC",
  address1: "Sarafa Bazaar",
  address2: "Jodhpur, Rajasthan",
  city: "India",
  phone: PHONE_DISPLAY,
  phoneRaw: PHONE_RAW,
  email: EMAIL,
  facebook: FACEBOOK_URL,
  whatsapp: `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent("Hi JJC! I'd like to know more about your products, prices and delivery options.")}`,
  instagram: INSTAGRAM_URL,
  instagramHandle: INSTAGRAM_HANDLE,
  hours: "10:00 AM – 9:00 PM (All days)",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sarafa+Bazaar+Jodhpur+Rajasthan",
};

export function whatsappEnquiry(productName: string, price: number, size?: string): string {
  const sizeLine = size ? `, size ${size}` : "";
  const msg = encodeURIComponent(
    `Hi Jai Jinendra Collection, I'm interested in ${productName} (₹${Number(price).toLocaleString("en-IN")}${sizeLine}). Please share availability, price and delivery details.`
  );
  return `https://wa.me/${PHONE_RAW}?text=${msg}`;
}
