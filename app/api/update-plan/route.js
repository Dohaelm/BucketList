import { redisGet, redisSet } from "@/lib/upstash";

export async function PUT(req) {
  try {
    const { id, status, image } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing plan ID" }), { status: 400 });
    }

    let plan = await redisGet(id);
    if (!plan) {
      return new Response(JSON.stringify({ error: "Plan not found" }), { status: 404 });
    }

    // Parse the plan if it's a string (Redis sometimes returns stringified data)
    if (typeof plan === 'string') {
      try {
        plan = JSON.parse(plan);
      } catch (parseError) {
        console.error("Failed to parse plan data:", parseError);
        return new Response(JSON.stringify({ error: "Invalid plan data format" }), { status: 500 });
      }
    }

    // Always update image if provided
    if (image) {
      plan.image = image;
      plan.status = "achieved"; // Force status if image is provided
    } else if (status && ["achieved", "unachieved"].includes(status)) {
      plan.status = status;
    } else {
      return new Response(JSON.stringify({ error: "Invalid status or missing image" }), { status: 400 });
    }

    await redisSet(id, plan);
    return Response.json({ success: true, plan });
  } catch (error) {
    console.error("Failed to update plan:", error);
    return new Response(JSON.stringify({ error: "Failed to update plan" }), { status: 500 });
  }
}