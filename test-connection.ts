import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_VuKLy72UnFOb@ep-bold-mud-b12c3nuu-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false },
});

async function test() {
  for (let i = 0; i < 30; i++) {   // زودتها لـ 30 محاولة
    const start = Date.now();
    try {
      await pool.query("SELECT 1");
      console.log(`✅ محاولة ${i}: ${Date.now() - start}ms`);
    } catch (e) {
      console.log(`❌ محاولة ${i}:`, e instanceof Error ? e.message : e);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  await pool.end();
}
test();