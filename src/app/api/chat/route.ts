import OpenAI from "openai";



const client = new OpenAI({
  //1. Aqui se usa la key de groq
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 20000,
});

//1. ESte es el enpoint completo que meneja la consacion del chat
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: body.message,
        },
      ],
    });

    return Response.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log("FULL ERROR:");
    console.dir(error, { depth: null });

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}