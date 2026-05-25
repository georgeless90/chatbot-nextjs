import OpenAI from "openai";
import pdf from "pdf-parse/lib/pdf-parse";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    // Obtener form data
    const formData = await req.formData();

    // Obtener PDF
    const file = formData.get("file") as File;

    // Obtener prompt opcional
    const question =
      (formData.get("question") as string) ||
      "Resume este documento";

    // Validar archivo
    if (!file) {
      return Response.json(
        {
          success: false,
          error: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    // Validar tipo
    if (file.type !== "application/pdf") {
      return Response.json(
        {
          success: false,
          error: "Only PDF files are allowed",
        },
        {
          status: 400,
        }
      );
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // Parse PDF
    const parsed = await pdf(buffer);

    // Limpiar texto
    const cleanText = parsed.text
      .replace(/\s+/g, " ")
      .trim();

    // Limitar tamaño
    const limitedText = cleanText.slice(0, 12000);

    // Llamar Groq
    const completion =
      await client.chat.completions.create({
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content: `
You are a helpful document assistant.

Use the following PDF content as context:

${limitedText}
            `,
          },
          {
            role: "user",
            content: question,
          },
        ],
      });

    // Respuesta final
    return Response.json({
      success: true,

      metadata: {
        fileName: file.name,
        totalPages: parsed.numpages,
      },

      extractedTextLength: limitedText.length,

      message:
        completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("UPLOAD + GROQ ERROR:", error);

    return Response.json(
      {
        success: false,
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}