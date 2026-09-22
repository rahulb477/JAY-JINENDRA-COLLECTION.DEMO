import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { isDatabaseConfigured, databaseUnavailableResponse } from "@/lib/database";
import { runSeed } from "@/lib/seed-db";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      databaseUnavailableResponse({ error: "Seeding requires DATABASE_URL. Demo mode already serves local data." }),
      { status: 503 }
    );
  }
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json(databaseUnavailableResponse({ error: "Database unavailable." }), { status: 503 });
    }
    const result = await runSeed(db);
    return NextResponse.json({ ...result, message: "Seeded", databaseConfigured: true });
  } catch (e) {
    console.error("seed", e);
    return NextResponse.json({ error: "Seed failed", detail: String(e) }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
