import { NextResponse } from "next/server";
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const CRON_SECRET = process.env.CRON_SECRET;

async function pingRedis() {
  const timestamp = new Date().toISOString();
  const key = `keepalive:${timestamp}`;

  // SET key with TTL 60 seconds
  await fetch(`${REDIS_URL}/SET/${key}/"ping"?EX=60`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
    },
  });
}

export async function GET(req) {
  // Check secret header
  const secret = req.headers.get("x-cron-secret");
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await pingRedis();
    return NextResponse.json({ status: "success", timestamp: new Date() });
  } catch (err) {
    console.error("Keep-alive error:", err);
    return NextResponse.json({ status: "error", error: err.message }, { status: 500 });
  }
}