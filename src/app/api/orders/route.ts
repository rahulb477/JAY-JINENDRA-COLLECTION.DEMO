import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { isDatabaseConfigured, databaseUnavailableResponse } from "@/lib/database";
import { orders, orderItems, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

function orderNo(prefix = "JJC") {
  const d = new Date();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${rand}`;
}

export async function GET(req: NextRequest) {
  const lookupNumber = req.nextUrl.searchParams.get("orderNumber")?.trim() ?? "";
  const lookupMobile = (req.nextUrl.searchParams.get("mobile") ?? "").replace(/\D/g, "").slice(-10);
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ orders: [], ...databaseUnavailableResponse() });
  }
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const u = token ? verifySession(token) : null;
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ orders: [], ...databaseUnavailableResponse() });
    if (lookupNumber && lookupMobile) {
      const found = await db.select().from(orders).where(eq(orders.orderNumber, lookupNumber)).limit(1);
      if (!found.length || found[0].mobile.replace(/\D/g, "").slice(-10) !== lookupMobile) {
        return NextResponse.json({ orders: [] });
      }
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, found[0].id));
      return NextResponse.json({ orders: [{ ...found[0], items }], databaseConfigured: true });
    }
    if (!u) return NextResponse.json({ orders: [] });
    const rows = await db.select().from(orders).where(eq(orders.userId, u.id)).orderBy(desc(orders.createdAt)).limit(50);
    const out = [];
    for (const o of rows) {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
      out.push({ ...o, items });
    }
    return NextResponse.json({ orders: out, databaseConfigured: true });
  } catch {
    return NextResponse.json({ orders: [], ...databaseUnavailableResponse() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const u = token ? verifySession(token) : null;
    const body = await req.json();
    const { customerName, mobile, email, address, deliveryMethod, paymentMethod, items, subtotal, discount, deliveryCharge, total } = body as {
      customerName: string; mobile: string; email?: string;
      address: Record<string, string>; deliveryMethod: string; paymentMethod: string;
      items: { productId: number; name: string; image: string; size: string; color: string; qty: number; price: number; mrp: number }[];
      subtotal: number; discount: number; deliveryCharge: number; total: number;
    };
    if (!customerName || !mobile || !items?.length) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10))) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
    }

    // ---- DEMO MODE: accept the order locally so checkout stays fully functional ----
    if (!isDatabaseConfigured()) {
      const number = orderNo("DEMO");
      return NextResponse.json({
        ok: true,
        orderNumber: number,
        id: Date.now(),
        ...databaseUnavailableResponse(),
      });
    }

    const db = getDb();
    if (!db) {
      const number = orderNo("DEMO");
      return NextResponse.json({ ok: true, orderNumber: number, id: Date.now(), ...databaseUnavailableResponse() });
    }
    const number = orderNo();
    const inserted = await db.insert(orders).values({
      orderNumber: number,
      userId: u?.id ?? null,
      customerName, mobile, email: email ?? u?.email ?? null,
      addressJson: address,
      deliveryMethod: deliveryMethod ?? "HOME_DELIVERY",
      paymentMethod: paymentMethod ?? "COD",
      subtotal, discount: discount ?? 0, deliveryCharge: deliveryCharge ?? 0, total,
      status: "PLACED",
    }).returning();
    const order = inserted[0];
    for (const it of items) {
      await db.insert(orderItems).values({
        orderId: order.id, productId: it.productId, name: it.name, image: it.image,
        size: it.size, color: it.color, qty: it.qty, price: it.price, mrp: it.mrp,
      });
      if (it.productId) {
        const [row] = await db.select({ stockTotal: products.stockTotal }).from(products).where(eq(products.id, it.productId)).limit(1);
        if (row) {
          await db.update(products).set({
            stockTotal: Math.max(0, (row.stockTotal ?? 0) - Math.max(1, Number(it.qty) || 1)),
          }).where(eq(products.id, it.productId));
        }
      }
    }
    return NextResponse.json({ ok: true, orderNumber: number, id: order.id, databaseConfigured: true });
  } catch (e) {
    console.error("orders", e);
    // Last-resort demo success so checkout never hard-crashes the demo site.
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ ok: true, orderNumber: orderNo("DEMO"), id: Date.now(), ...databaseUnavailableResponse() });
    }
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }
}
