exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing API_KEY" }) };
  }

  // 新增空值判断，解决The string did not match报错
  if (!event.body || event.body.trim() === "") {
    return { statusCode: 400, body: JSON.stringify({ error: "Empty request body" }) };
  }

  try {
    const body = JSON.parse(event.body);
    const prompt = body.prompt;
    const payload = {
      model: "deepseek-chat",
      messages: [{ role: "user", content: `Paraphrase this text: ${prompt}` }],
      temperature: 0.7
    };
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(25000)
    });
    if (!res.ok) throw new Error("DeepSeek API request failed");
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
