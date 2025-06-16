import { redisSet, redisPushToList } from "@/lib/upstash";

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, author, image = null } = body;

    if (!title || !description || !author) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const id = `plan:${Date.now()}`;
    const plan = {
      id,
      title,
      description,
      author,
      image,
      createdAt: new Date().toISOString(),
      status: "unachieved",
    };

    await redisSet(id, plan);
    await redisPushToList("plans", id);

    return Response.json({ success: true, plan });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to add plan" }),
      { status: 500 }
    );
  }
}
