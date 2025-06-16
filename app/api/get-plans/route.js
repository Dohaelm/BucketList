import { redisGet, redisGetList } from "@/lib/upstash";

export async function GET() {
  try {
    const rawPlanKeys = await redisGetList("plans");
    console.log("Raw plan keys from Redis:", rawPlanKeys);

    if (!rawPlanKeys || rawPlanKeys.length === 0) {
      return Response.json({ plans: [] });
    }

    // Parse keys to remove any extra quotes, JSON wrapping, or array wrapping
    const planKeys = rawPlanKeys.map(rawKey => {
      try {
        // If the key is JSON-wrapped like '{"value":"plan:123"}', extract the value
        if (typeof rawKey === 'string' && rawKey.startsWith('{"value"')) {
          const parsed = JSON.parse(rawKey);
          return parsed.value;
        }
        // If the key is array-wrapped like '["plan:123"]', extract the first element
        if (typeof rawKey === 'string' && rawKey.startsWith('["') && rawKey.endsWith('"]')) {
          const parsed = JSON.parse(rawKey);
          return parsed[0];
        }
        // If the key has extra quotes like '"plan:123"', remove them
        if (typeof rawKey === 'string' && rawKey.startsWith('"') && rawKey.endsWith('"')) {
          return rawKey.slice(1, -1); // Remove first and last character (quotes)
        }
        // If it's already a plain string, return as-is
        return rawKey;
      } catch (error) {
        console.error(`Error parsing key ${rawKey}:`, error);
        return rawKey; // Return as-is if parsing fails
      }
    });

    console.log("Parsed plan keys:", planKeys);

    const plans = await Promise.all(
      planKeys.map(async (key) => {
        try {
          const plan = await redisGet(key);
          console.log(`Fetched plan for key ${key}:`, plan);
          return plan;
        } catch (error) {
          console.error(`Error fetching plan for key ${key}:`, error);
          return null;
        }
      })
    );

    // Filter out null plans (failed fetches)
    const validPlans = plans.filter(plan => plan !== null);
    console.log("Valid plans:", validPlans);

    return Response.json({ plans: validPlans });
  } catch (error) {
    console.error("Error in GET /api/get-plans:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch plans" }),
      { status: 500 }
    );
  }
}