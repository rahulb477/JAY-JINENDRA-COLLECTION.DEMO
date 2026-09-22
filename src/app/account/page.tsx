"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Package, Heart, User, LogOut, MapPin, Eye } from "lucide-react";
import { useStore } from "@/lib/store-context";
import { formatINR, cn } from "@/lib/utils";
import { readLocalOrders } from "@/lib/local-orders";

const STATUS_FLOW = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];
const STATUS_COLOR: Record<string, string> = {
  PLACED: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PACKED: "bg-violet-100 text-violet-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-700",
};

type Order = {
  id: number; orderNumber: string; status: string; total: number; createdAt: string;
  deliveryMethod: string; paymentMethod: string;
  items: { name: string; image: string | null; size: string | null; qty: number; price: number }[];
};

export default function AccountPage() {
  const { user, logout, wishlist } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<{ slug: string; name: string }[]>([]);
  const [lookupNo, setLookupNo] = useState("");
  const [lookupMobile, setLookupMobile] = useState("");
  const [lookupMsg, setLookupMsg] = useState("");
  const [addresses, setAddresses] = useState<{ id: number; label: string | null; fullName: string; mobile: string; house: string; area: string; city: string; pincode: string }[]>([]);
  const [addrForm, setAddrForm] = useState({ fullName: "", mobile: "", house: "", area: "", pincode: "", city: "Jodhpur" });

  useEffect(() => {
    const t = setTimeout(() => {
      setLocalOrders(readLocalOrders());
      try {
        const rv = JSON.parse(localStorage.getItem("nyc_recent") ?? "[]");
        setRecentlyViewed(rv);
      } catch {
        setRecentlyViewed([]);
      }
    }, 0);
    fetch("/api/orders").then((r) => r.json()).then((j) => setOrders(j.orders ?? [])).catch(() => {}).finally(() => setLoading(false));
    if (user) {
      fetch("/api/addresses").then((r) => r.json()).then((j) => setAddresses(j.addresses ?? [])).catch(() => {});
    }
    return () => clearTimeout(t);
  }, [user]);

  const visibleOrders = useMemo(() => {
    const seen = new Set(orders.map((o) => o.orderNumber));
    return [...orders, ...localOrders.filter((o) => !seen.has(o.orderNumber))];
  }, [orders, localOrders]);

  const lookupOrder = async () => {
    setLookupMsg("");
    const mobile = lookupMobile.replace(/\D/g, "").slice(-10);
    const number = lookupNo.trim();
    if (!number || !/^[6-9]\d{9}$/.test(mobile)) {
      setLookupMsg("Enter the order number and the 10-digit mobile used at checkout.");
      return;
    }
    const local = readLocalOrders().find((o) => o.orderNumber === number && o.mobile.endsWith(mobile));
    if (local) {
      setOrders((prev) => prev.some((o) => o.orderNumber === local.orderNumber) ? prev : [local, ...prev]);
      setLookupMsg("Order found on this device.");
      return;
    }
    const r = await fetch(`/api/orders?orderNumber=${encodeURIComponent(number)}&mobile=${mobile}`);
    const j = await r.json();
    if (j.orders?.length) {
      setOrders(j.orders);
      setLookupMsg("Order found.");
    } else {
      setLookupMsg("No matching order. Check the number and mobile.");
    }
  };

  const saveAddress = async () => {
    const r = await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(addrForm) });
    const j = await r.json();
    if (!r.ok) { setLookupMsg(j.error || "Could not save address"); return; }
    setAddresses((prev) => [j.address, ...prev]);
    setAddrForm({ fullName: user?.name ?? "", mobile: "", house: "", area: "", pincode: "", city: "Jodhpur" });
  };

  const tabs = [
    { id: "orders", label: "Orders", icon: <Package size={16} /> },
    { id: "wishlist", label: `Wishlist (${wishlist.length})`, icon: <Heart size={16} /> },
    { id: "profile", label: "Profile", icon: <User size={16} /> },
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-full bg-black text-[#e8c877] grid place-items-center font-display font-black text-lg">{(user?.name?.[0] ?? "G").toUpperCase()}</span>
          <div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl">{user ? `Hi, ${user.name.split(" ")[0]}` : "Track your order"}</h1>
            <p className="text-[12.5px] text-neutral-500">{user ? user.email : "Guest checkout orders stay on this device. Login to sync them."}</p>
          </div>
        </div>
        {user ? (
          <button onClick={async () => { await logout(); router.push("/"); }} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-neutral-200 text-[13px] font-bold hover:border-red-300 hover:text-red-600">
            <LogOut size={15} /> Logout
          </button>
        ) : (
          <Link href="/auth" className="px-5 py-2.5 rounded-xl bg-black text-[#e8c877] text-[13px] font-extrabold">LOGIN</Link>
        )}
      </div>

      <div className="flex gap-2 mt-6 border-b border-neutral-200 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 px-5 py-3 text-[13px] font-extrabold tracking-wide whitespace-nowrap border-b-2 -mb-px", tab === t.id ? "border-black text-black" : "border-transparent text-neutral-400")}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="mt-6 space-y-4">
          <div className="border border-neutral-200 rounded-2xl p-4 grid sm:grid-cols-[1fr_1fr_auto] gap-2">
            <input value={lookupNo} onChange={(e) => setLookupNo(e.target.value)} placeholder="Order number (JJC…)" className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm" />
            <input value={lookupMobile} onChange={(e) => setLookupMobile(e.target.value)} placeholder="Mobile used at checkout" inputMode="numeric" maxLength={10} className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm" />
            <button onClick={lookupOrder} className="px-5 py-2.5 rounded-xl bg-black text-[#e8c877] text-[12px] font-extrabold">TRACK</button>
            {lookupMsg && <p className="sm:col-span-3 text-[12.5px] font-semibold text-neutral-600">{lookupMsg}</p>}
          </div>
          {loading ? (
            <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-36 bg-neutral-100 rounded-2xl animate-pulse" />)}</div>
          ) : visibleOrders.length === 0 ? (
            <div className="text-center py-14 border border-dashed border-neutral-300 rounded-3xl">
              <Package size={36} className="mx-auto text-neutral-300" />
              <p className="font-bold text-lg mt-3">No orders yet</p>
              <p className="text-sm text-neutral-500">Your orders will appear here.</p>
              <Link href="/men" className="inline-block mt-4 px-8 py-3 rounded-xl bg-black text-[#e8c877] text-[13px] font-extrabold">START SHOPPING</Link>
            </div>
          ) : (
            visibleOrders.map((o) => (
              <div key={o.id} className="border border-neutral-200 rounded-3xl p-4 sm:p-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-extrabold text-[15px]">#{o.orderNumber}</p>
                    <p className="text-[12px] text-neutral-500">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {o.deliveryMethod === "STORE_PICKUP" ? "Store Pickup" : "Home Delivery"} · {o.paymentMethod}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[11px] font-extrabold px-3 py-1.5 rounded-full tracking-wide", STATUS_COLOR[o.status] ?? "bg-neutral-100")}>{o.status}</span>
                    <span className="font-extrabold">{formatINR(o.total)}</span>
                  </div>
                </div>
                {o.status !== "CANCELLED" && (
                  <div className="flex items-center gap-0 mt-4 mb-1">
                    {STATUS_FLOW.map((s, i) => {
                      const reached = STATUS_FLOW.indexOf(o.status) >= i;
                      return (
                        <div key={s} className="flex-1 flex items-center last:flex-none">
                          <div className="flex flex-col items-center">
                            <span className={cn("w-6 h-6 rounded-full grid place-items-center text-[10px] font-extrabold", reached ? "bg-black text-[#e8c877]" : "bg-neutral-100 text-neutral-400")}>{reached ? "✓" : i + 1}</span>
                            <span className="text-[8px] sm:text-[9px] font-bold mt-1 hidden sm:block">{s}</span>
                          </div>
                          {i < STATUS_FLOW.length - 1 && <span className={cn("flex-1 h-0.5 mx-1 mb-0 sm:mb-4", STATUS_FLOW.indexOf(o.status) > i ? "bg-black" : "bg-neutral-100")} />}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-2.5 mt-3">
                  {o.items.map((it, i) => (
                    <div key={i} className="flex gap-2.5 items-center bg-neutral-50 rounded-xl p-2">
                      <span className="w-11 h-14 rounded-lg overflow-hidden bg-neutral-200 relative shrink-0">
                        {it.image && <Image src={it.image} alt={it.name} fill className="object-cover" />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-bold truncate">{it.name}</p>
                        <p className="text-[11.5px] text-neutral-500">Size {it.size} · Qty {it.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "wishlist" && (
        <div className="mt-6 text-center py-10 border border-dashed border-neutral-300 rounded-3xl">
          <Heart size={32} className="mx-auto text-neutral-300" />
          <p className="font-bold mt-3">You have {wishlist.length} saved styles</p>
          <Link href="/wishlist" className="inline-block mt-4 px-8 py-3 rounded-xl bg-black text-[#e8c877] text-[13px] font-extrabold">OPEN WISHLIST</Link>
        </div>
      )}

      {tab === "profile" && !user && (
        <div className="mt-6 text-center py-12 border border-dashed border-neutral-300 rounded-3xl">
          <p className="font-bold">Create an account to save your profile and addresses.</p>
          <Link href="/auth" className="inline-block mt-4 px-8 py-3 rounded-xl bg-black text-[#e8c877] text-[13px] font-extrabold">SIGN UP</Link>
        </div>
      )}

      {tab === "profile" && user && (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="border border-neutral-200 rounded-3xl p-5">
            <h3 className="font-extrabold text-[14px]">PROFILE</h3>
            <div className="mt-3 space-y-2 text-[14px]">
              <p><span className="text-neutral-500 text-[12px] font-bold block">NAME</span>{user.name}</p>
              <p><span className="text-neutral-500 text-[12px] font-bold block">EMAIL</span>{user.email}</p>
            </div>
          </div>
          <div className="border border-neutral-200 rounded-3xl p-5">
            <h3 className="font-extrabold text-[14px] flex items-center gap-1.5"><MapPin size={15} /> STORE</h3>
            <p className="text-[13.5px] text-neutral-600 mt-3">Sarafa Bazaar, Sarafa Bazaar, Near PNB ATM, Jodhpur</p>
            <Link href="/store" className="inline-block mt-3 text-[12.5px] font-extrabold text-[#9a7420]">GET DIRECTIONS →</Link>
          </div>
          <div className="border border-neutral-200 rounded-3xl p-5 sm:col-span-2">
            <h3 className="font-extrabold text-[14px]">SAVED ADDRESSES</h3>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              {addresses.map((a) => (
                <div key={a.id} className="rounded-2xl bg-neutral-50 p-3 text-[13px]">
                  <p className="font-bold">{a.label || "Home"} · {a.fullName}</p>
                  <p className="text-neutral-600">{a.house}, {a.area}, {a.city} {a.pincode}</p>
                  <button onClick={async () => { await fetch("/api/addresses", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: a.id }) }); setAddresses((prev) => prev.filter((x) => x.id !== a.id)); }} className="text-[11px] font-extrabold text-red-600 mt-1">REMOVE</button>
                </div>
              ))}
              {addresses.length === 0 && <p className="text-sm text-neutral-500">No saved addresses yet.</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              <input value={addrForm.fullName} onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })} placeholder="Full name" className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm" />
              <input value={addrForm.mobile} onChange={(e) => setAddrForm({ ...addrForm, mobile: e.target.value })} placeholder="Mobile" inputMode="numeric" maxLength={10} className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm" />
              <input value={addrForm.house} onChange={(e) => setAddrForm({ ...addrForm, house: e.target.value })} placeholder="House / flat" className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm" />
              <input value={addrForm.area} onChange={(e) => setAddrForm({ ...addrForm, area: e.target.value })} placeholder="Area" className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm" />
              <input value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} placeholder="Pincode" inputMode="numeric" maxLength={6} className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm" />
              <button onClick={saveAddress} className="rounded-xl bg-black text-[#e8c877] text-[12px] font-extrabold">SAVE ADDRESS</button>
            </div>
          </div>
          {recentlyViewed.length > 0 && (
            <div className="border border-neutral-200 rounded-3xl p-5 sm:col-span-2">
              <h3 className="font-extrabold text-[14px] flex items-center gap-1.5"><Eye size={15} /> RECENTLY VIEWED</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {recentlyViewed.slice(0, 8).map((r) => (
                  <Link key={r.slug} href={`/product/${r.slug}`} className="px-4 py-2 rounded-full bg-neutral-100 text-[13px] font-semibold hover:bg-black hover:text-[#e8c877] transition">{r.name}</Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
