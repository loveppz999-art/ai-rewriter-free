export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
  }
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "Missing API_KEY" }), { status: 400 });
  }
  try {
    const { prompt } = await req.json();
    const payload = {
      model: "deepseek-chat",
      messages: [{role: "user", content: `Paraphrase this text: ${prompt}`}],
      temperature: 0.7
    };
    //备用代理方式
    const apiBody = JSON.stringify(payload);
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: apiBody,
      signal: AbortSignal.timeout(18000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status}, ${errorText}`);
    }
    const resultData = await response.json();
    return new Response(JSON.stringify(resultData), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({error: error.message}), {status: 500});
  }
}
