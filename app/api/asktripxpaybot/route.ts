import { NextRequest, NextResponse } from "next/server";
const GEMINI_API_KEY = process.env
  .NEXT_PUBLIC_REACT_APP_GEMINI_API_KEY as string;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { text: "Please provide a valid message" },
        { status: 400 }
      );
    }

    const prompt = `You are TripX Pay Bot, a helpful travel and payment assistant. Answer any question in a concise way. Always maintain a friendly, professional tone and relate your answers to travel or payments when relevant.

User Question: ${message}

Respond as TripX Pay Bot:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { 
          text: "I'm having technical difficulties. Please try again later.",
          error: errorData 
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Extract response text with robust error handling
    let responseText = "I couldn't understand that. Could you please rephrase?";
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = data.candidates[0].content.parts[0].text;
    } else {
      console.warn("Unexpected Gemini response structure:", data);
    }

    return NextResponse.json(
      { text: responseText },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { 
        text: "An unexpected error occurred. Our team has been notified.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}