import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { isDatabaseConfigured } from "@/lib/database";
import { siteSettings } from "@/db/schema";
import { demoSettings } from "@/lib/demo-catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const fallback = demoSettings();
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ settings: fallback, databaseConfigured: false });
  }
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ settings: fallback, databaseConfigured: false });
    const rows = await db.select().from(siteSettings);
    const settings = { ...fallback, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
    return NextResponse.json({ settings, databaseConfigured: true });
  } catch {
    return NextResponse.json({ settings: fallback, databaseConfigured: false });
  }
}
