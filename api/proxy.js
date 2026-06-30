export default async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({error: "Method Not Allowed"})
    };
  }

  const API_KEY = process.env.API_KEY;
  if(!API_KEY){
    return {
      statusCode:400,
      body:JSON.stringify({error:"Missing API_KEY"})
    }
  }

  try {
    //改用Netlify标准读取方式，规避解析报错
    const body = JSON.parse(event.body);
    const prompt = body.prompt;

    const payload = {
      model:"deepseek-chat",
      messages:[{role:"user", content:`Paraphrase this text: ${prompt}`}],
      temperature:0.7
    };

    const res = await fetch("https://api.deepseek.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${API_KEY}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify(payload),
      signal:AbortSignal.timeout(25000)
    });

    if(!res.ok) throw new Error("DeepSeek API fail");
    const data = await res.json();

    return {
      statusCode:200,
      body:JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode:500,
      body:JSON.stringify({error:err.message})
    }
  }
}
