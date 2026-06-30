export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Only POST", { status: 405 });
  }
  const { messages } = await req.json();
  const apiKey = process.env.API_KEY;
  const apiUrl = "https://api.deepseek.com/v1/chat/completions";

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: messages
    })
  });
  const data = await res.json();
  return Response.json(data);
}
