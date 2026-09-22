import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { runSeed } from "../src/lib/seed-db";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool);
  const result = await runSeed(db);
  console.log(JSON.stringify(result));
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
