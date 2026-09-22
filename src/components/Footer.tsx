"use client";

import Link from "next/link";
import { MessageCircle, Phone, MapPin, Clock, CreditCard, Truck, RotateCcw } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
  );
}
function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
  );
}
import Logo from "./Logo";
import { STORE } from "@/lib/utils";
import { useCommerceSettings } from "@/lib/use-settings";

export default function Footer() {
  const settings = useCommerceSettings();
  const phone = settings.store_phone || STORE.phone;
  const phoneRaw = (settings.store_whatsapp || STORE.phoneRaw).replace(/\D/g, "");
  const whatsapp = `https://wa.me/${phoneRaw}?text=${encodeURIComponent("Hi Jai Jinendra Collection! I want to enquire about your collection.")}`;
  const instagram = settings.instagram_url || STORE.instagram;
  const hours = settings.store_hours || STORE.hours;
  const address = settings.store_address || `${STORE.address1}, ${STORE.address2}, ${STORE.city}`;
  return (
    <footer className="bg-black text-neutral-300 mt-0 pb-[70px] lg:pb-0">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-3 gap-2 py-5 text-center">
          {[
            { icon: <Truck size={20} />, t: "Easy Delivery", s: "Across Jodhpur" },
            { icon: <RotateCcw size={20} />, t: "Easy Exchange", s: "At store" },
            { icon: <CreditCard size={20} />, t: "COD Available", s: "Pay on delivery" },
          ].map((x) => (
            <div key={x.t} className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span className="text-[#e8c877]">{x.icon}</span>
              <span className="text-left"><span className="block text-[12px] sm:text-sm font-bold text-white">{x.t}</span><span className="hidden sm:block text-[11px] text-neutral-400">{x.s}</span></span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-2">
          <Logo light />
          <p className="text-[11px] font-bold tracking-[0.3em] text-[#e8c877] mt-4">WHOLESALE • RETAIL · DELIVERY ACROSS INDIA</p>
          <p className="text-[13px] text-neutral-400 mt-2 max-w-sm leading-relaxed">
            JJC — Men&apos;s Clothing Store at Sarafa Bazaar, Jodhpur, Rajasthan. Wholesale &amp; retail shirts, t-shirts, jeans, cargos, polos &amp; combos. Delivery across India.
          </p>
          <p className="text-[12px] text-neutral-500 mt-3 leading-relaxed">
            Instagram <a href={STORE.instagram} target="_blank" rel="noreferrer" className="text-white font-semibold hover:text-[#e8c877]">{STORE.instagramHandle}</a>
            <span className="mx-2 text-neutral-700">·</span>
            Phone <a href={`tel:${STORE.phoneRaw}`} className="text-white font-semibold hover:text-[#e8c877]">{STORE.phone}</a>
            <br />
            Email <a href={`mailto:${STORE.email}`} className="text-white font-semibold hover:text-[#e8c877] break-all">{STORE.email}</a>
          </p>
          <div className="flex gap-2 mt-5">
            <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 grid place-items-center hover:bg-[#c9a24b] hover:text-black transition"><InstagramIcon size={18} /></a>
            <a href={STORE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 grid place-items-center hover:bg-[#c9a24b] hover:text-black transition"><FacebookIcon size={18} /></a>
            <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/10 grid place-items-center hover:bg-[#25D366] hover:text-white transition"><MessageCircle size={18} /></a>
            <a href={`mailto:${STORE.email}`} aria-label="Email" className="w-10 h-10 rounded-full bg-white/10 grid place-items-center hover:bg-[#c9a24b] hover:text-black transition"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg></a>
            <a href={`tel:${phoneRaw}`} aria-label="Call" className="w-10 h-10 rounded-full bg-white/10 grid place-items-center hover:bg-[#c9a24b] hover:text-black transition"><Phone size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-extrabold text-[12px] tracking-[0.18em] mb-4">SHOP</h4>
          <ul className="space-y-2.5 text-[13.5px]">
            <li><Link href="/men" className="hover:text-[#e8c877]">Men</Link></li>
            <li><Link href="/kids" className="hover:text-[#e8c877]">Kids</Link></li>
            <li><Link href="/new-arrivals" className="hover:text-[#e8c877]">New Arrivals</Link></li>
            <li><Link href="/trending" className="hover:text-[#e8c877]">Trending</Link></li>
            <li><Link href="/offers" className="hover:text-[#e8c877]">Offers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-extrabold text-[12px] tracking-[0.18em] mb-4">CUSTOMER CARE</h4>
          <ul className="space-y-2.5 text-[13.5px]">
            <li><Link href="/info/contact" className="hover:text-[#e8c877]">Contact Us</Link></li>
            <li><Link href="/info/shipping" className="hover:text-[#e8c877]">Shipping</Link></li>
            <li><Link href="/info/returns" className="hover:text-[#e8c877]">Returns & Exchange</Link></li>
            <li><Link href="/info/size-guide" className="hover:text-[#e8c877]">Size Guide</Link></li>
            <li><Link href="/info/faq" className="hover:text-[#e8c877]">FAQ</Link></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-2 lg:col-span-1">
          <h4 className="text-white font-extrabold text-[12px] tracking-[0.18em] mb-4">STORE</h4>
          <ul className="space-y-3 text-[13px]">
            <li className="flex gap-2"><MapPin size={16} className="text-[#e8c877] shrink-0 mt-0.5" /><span>{address}</span></li>
            <li className="flex gap-2"><Clock size={16} className="text-[#e8c877] shrink-0" /><span>{hours}</span></li>
            <li className="flex gap-2"><Phone size={16} className="text-[#e8c877] shrink-0" /><a href={`tel:${phoneRaw}`} className="hover:text-[#e8c877]">{phone}</a></li>
            <li><Link href="/store" className="inline-block mt-1 px-5 py-2.5 rounded-lg brand-bg text-black text-[12px] font-extrabold tracking-wide">VISIT STORE</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-neutral-500">
          <p>Copyright © {new Date().getFullYear()} Jai Jinendra Collection · Jodhpur, Rajasthan. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/info/returns" className="hover:text-neutral-300">Returns</Link>
            <Link href="/info/shipping" className="hover:text-neutral-300">Shipping</Link>
            <Link href="/admin" className="hover:text-neutral-300">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
