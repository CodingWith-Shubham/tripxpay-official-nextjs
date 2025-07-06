import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_REACT_APP_GEMINI_API_KEY as string;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(req: NextRequest) {
  try {
    // Read the request body instead of search params
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
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
      return NextResponse.json(
        { errorData, message: "internal server issue" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Extract the response text
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts
    ) {
      return NextResponse.json(
        {
          response: data.candidates[0].content.parts[0].text, // Changed from 'text' to 'response'
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "error to get the data from the api" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server issue" },
      { status: 500 }
    );
  }
}