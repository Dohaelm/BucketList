import { redisSet } from "@/lib/upstash";

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Missing plan ID" }),
        { status: 400 }
      );
    }

    // Redis REST API doesn't support true deletion, so we set the value to null
    await redisSet(id, null);

    return Response.json({ success: true });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete plan" }),
      { status: 500 }
    );
  }
}
