export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
  }

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "Missing API_KEY" }), { status: 400 });
  }

  const { prompt } = await req.json();

  const bodyData = {
    model: "deepseek‑chat",
    messages: [
      {
        role: "user",
        content: `Paraphrase this text: ${prompt}`
      }
    ],
    temperature: 0.7
  };

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content‑Type": "application/json"
      },
      body: JSON.stringify(bodyData),
      signal: AbortSignal.timeout(25000) // 25秒超时限制，防止一直卡住
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "API connect fail, Vercel cannot reach DeepSeek server" }),
      { status: 500 }
    );
  }
}
