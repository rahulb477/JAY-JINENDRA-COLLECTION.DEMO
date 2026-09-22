import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { addresses } from "@/db/schema";
import { isDatabaseConfigured, databaseUnavailableResponse } from "@/lib/database";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function sessionUser(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifySession(token) : null;
}

export async function GET(req: NextRequest) {
  const user = sessionUser(req);
  if (!user) return NextResponse.json({ addresses: [] });
  if (!isDatabaseConfigured()) return NextResponse.json({ addresses: [], ...databaseUnavailableResponse() });
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ addresses: [], ...databaseUnavailableResponse() });
    const rows = await db.select().from(addresses).where(eq(addresses.userId, user.id)).orderBy(desc(addresses.id));
    return NextResponse.json({ addresses: rows, databaseConfigured: true });
  } catch {
    return NextResponse.json({ addresses: [], ...databaseUnavailableResponse() });
  }
}

export async function POST(req: NextRequest) {
  const user = sessionUser(req);
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });
  if (!isDatabaseConfigured()) {
    return NextResponse.json(databaseUnavailableResponse({ error: "Database is not configured yet." }), { status: 503 });
  }
  try {
    const db = getDb();
    if (!db) return NextResponse.json(databaseUnavailableResponse(), { status: 503 });
    const body = await req.json();
    const fullName = String(body.fullName ?? "").trim();
    const mobile = String(body.mobile ?? "").replace(/\D/g, "").slice(-10);
    const house = String(body.house ?? "").trim();
    const area = String(body.area ?? "").trim();
    const pincode = String(body.pincode ?? "").trim();
    if (!fullName || !/^[6-9]\d{9}$/.test(mobile) || !house || !area || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "Please complete a valid address." }, { status: 400 });
    }
    if (body.isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, user.id));
    }
    const inserted = await db.insert(addresses).values({
      userId: user.id,
      label: String(body.label ?? "Home").slice(0, 40),
      fullName,
      mobile,
      house,
      area,
      city: String(body.city ?? "Jodhpur"),
      state: String(body.state ?? "Rajasthan"),
      pincode,
      isDefault: body.isDefault !== false,
    }).returning();
    return NextResponse.json({ ok: true, address: inserted[0], databaseConfigured: true });
  } catch (e) {
    console.error("addresses", e);
    return NextResponse.json({ error: "Could not save address" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = sessionUser(req);
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: true, ...databaseUnavailableResponse() });
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ ok: true, ...databaseUnavailableResponse() });
    const { id } = await req.json();
    await db.delete(addresses).where(and(eq(addresses.id, Number(id)), eq(addresses.userId, user.id)));
    return NextResponse.json({ ok: true, databaseConfigured: true });
  } catch {
    return NextResponse.json({ error: "Could not delete address" }, { status: 500 });
  }
}
