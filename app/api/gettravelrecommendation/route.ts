import { NextRequest, NextResponse } from "next/server";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const createRecommendationPrompt = (preferences: any) => {
  const countryInstruction =
    preferences.destinationCountry &&
    preferences.destinationCountry !== "Any Country"
      ? `- Specifically recommend destinations in ${preferences.destinationCountry}\n`
      : "";

  return `Act as an expert travel advisor. Based on the following preferences, recommend exactly 3 personalized travel destinations. Provide detailed, practical information for each destination. Set the default currency to INR. Respond based on the country selected otherwise give response on "any country".

Travel Preferences:
${countryInstruction}- Travel Dates: ${preferences.travelDates}
- Duration: ${preferences.duration}
- Budget: ${preferences.budget}
- Climate Preference: ${preferences.climatePreference}
- Travel Style: ${preferences.travelStyle}
- Interests: ${preferences.interests.join(", ")}

Please provide your response in this exact JSON format (ensure it's valid JSON):
{
  "recommendations": [
    {
      "destination": "City, Country",
      "reason": "Why this destination matches their preferences",
      "duration": "Recommended stay duration",
      "budget": "Estimated cost breakdown",
      "bestTime": "Best time to visit and why",
      "highlights": "Top 2 attractions and experiences",
      "activities": ["Activity 1", "Activity 2", "Activity 3", "Activity 4"]
    }
  ]
}

Important: 
- Provide exactly 3 recommendations
- Make sure all fields are filled with relevant information
- Keep descriptions very very concise and clear
- Include specific costs in budget field
- Activities should be an array of strings
${
  countryInstruction
    ? "- All recommendations must be in " + preferences.destinationCountry
    : ""
}`;
};

const createFallbackRecommendations = (text: string) => {
  // Create a basic recommendation structure when JSON parsing fails
  return [
    {
      destination: "Custom Travel Recommendation",
      reason: text.substring(0, 200) + "...",
      duration: "Flexible",
      budget: "As per your selection",
      bestTime: "Year-round (check seasonal variations)",
      highlights: "See full details in the description",
      activities: [
        "Explore local attractions",
        "Try local cuisine",
        "Cultural experiences",
        "Outdoor activities",
      ],
    },
  ];
};

const parseGeminiResponse = (response: any) => {
  try {
    // console.log("Full Gemini API response:", response);

    if (
      !response ||
      !response.candidates ||
      !response.candidates[0] ||
      !response.candidates[0].content ||
      !response.candidates[0].content.parts ||
      !response.candidates[0].content.parts[0] ||
      !("text" in response.candidates[0].content.parts[0])
    ) {
      console.error("Invalid Gemini API response structure:", response);
      throw new Error("Invalid response structure from Gemini API");
    }

    let text = response.candidates[0].content.parts[0].text;
    // console.log("Raw Gemini response text:", text);

    // Clean up the text - remove markdown formatting if present
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      // Try to parse the entire response as JSON
      const parsedResponse = JSON.parse(text);

      // Handle different response formats
      if (
        parsedResponse.recommendations &&
        Array.isArray(parsedResponse.recommendations)
      ) {
        return parsedResponse.recommendations.map((rec: any) => ({
          destination: rec.destination || "Unknown Destination",
          reason: rec.reason || "Great place to visit",
          duration: rec.duration || "Flexible",
          budget:
            typeof rec.budget === "object"
              ? JSON.stringify(rec.budget)
              : rec.budget || "Varies",
          bestTime: rec.bestTime || rec.bestTimeToVisit || "Year-round",
          highlights: Array.isArray(rec.highlights)
            ? rec.highlights.join(", ")
            : rec.highlights || "Various attractions",
          activities: Array.isArray(rec.activities)
            ? rec.activities
            : ["Sightseeing", "Local experiences", "Cultural activities"],
        }));
      }

      // If it's a single recommendation object
      if (typeof parsedResponse === "object") {
        return [
          {
            destination: parsedResponse.destination || "Unknown Destination",
            reason: parsedResponse.reason || "Great place to visit",
            duration: parsedResponse.duration || "Flexible",
            budget:
              typeof parsedResponse.budget === "object"
                ? JSON.stringify(parsedResponse.budget)
                : parsedResponse.budget || "Varies",
            bestTime:
              parsedResponse.bestTime ||
              parsedResponse.bestTimeToVisit ||
              "Year-round",
            highlights: Array.isArray(parsedResponse.highlights)
              ? parsedResponse.highlights.join(", ")
              : parsedResponse.highlights || "Various attractions",
            activities: Array.isArray(parsedResponse.activities)
              ? parsedResponse.activities
              : ["Sightseeing", "Local experiences", "Cultural activities"],
          },
        ];
      }

      // If we can't determine the structure, create a fallback
      return createFallbackRecommendations(text);
    } catch (jsonError) {
      console.log("Response is not pure JSON, trying to extract JSON...");

      // Try to extract JSON from text using regex
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          // Process the parsed response to ensure it's in the correct format
          if (
            parsedResponse.recommendations &&
            Array.isArray(parsedResponse.recommendations)
          ) {
            return parsedResponse.recommendations.map((rec: any) => ({
              destination: rec.destination || "Unknown Destination",
              reason: rec.reason || "Great place to visit",
              duration: rec.duration || "Flexible",
              budget:
                typeof rec.budget === "object"
                  ? JSON.stringify(rec.budget)
                  : rec.budget || "Varies",
              bestTime: rec.bestTime || rec.bestTimeToVisit || "Year-round",
              highlights: Array.isArray(rec.highlights)
                ? rec.highlights.join(", ")
                : rec.highlights || "Various attractions",
              activities: Array.isArray(rec.activities)
                ? rec.activities
                : ["Sightseeing", "Local experiences", "Cultural activities"],
            }));
          }

          // If it's a single object
          return [
            {
              destination: parsedResponse.destination || "Unknown Destination",
              reason: parsedResponse.reason || text.substring(0, 200) + "...",
              duration: parsedResponse.duration || "Flexible",
              budget:
                typeof parsedResponse.budget === "object"
                  ? JSON.stringify(parsedResponse.budget)
                  : parsedResponse.budget || "Varies",
              bestTime:
                parsedResponse.bestTime ||
                parsedResponse.bestTimeToVisit ||
                "Year-round",
              highlights: Array.isArray(parsedResponse.highlights)
                ? parsedResponse.highlights.join(", ")
                : parsedResponse.highlights || "Various attractions",
              activities: Array.isArray(parsedResponse.activities)
                ? parsedResponse.activities
                : ["Sightseeing", "Local experiences", "Cultural activities"],
            },
          ];
        } catch (nestedError) {
          console.error("Failed to parse extracted JSON:", nestedError);
          return createFallbackRecommendations(text);
        }
      }

      // If JSON parsing fails, create structured response from text
      console.log(
        "Could not parse response as JSON, creating structured response"
      );
      return createFallbackRecommendations(text);
    }
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return [
      {
        destination: "Error Generating Recommendations",
        reason: `Failed to generate recommendations: ${
          (error as Error).message
        }`,
        duration: "N/A",
        budget: "N/A",
        bestTime: "N/A",
        highlights: "Please try again",
        activities: [
          "Check your internet connection",
          "Verify API key",
          "Try again later",
        ],
      },
    ];
  }
};

export async function POST(req: NextRequest) {
  try {
    const { formData } = await req.json();

    const prompt = createRecommendationPrompt(formData);

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    };

    const response = await fetch(
      `${GEMINI_API_URL}?key=${process.env.NEXT_PUBLIC_REACT_APP_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      throw new Error("Invalid JSON response from Gemini API");
    }

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status}: ${
          responseData.error?.message || responseData.message || "Unknown error"
        }`
      );
    }

    const parsedResponse = parseGeminiResponse(responseData);
    return NextResponse.json({ parsedResponse }, { status: 200 });
  } catch (error) {
    console.log((error as Error).message);
    return NextResponse.json(
      { message: "Internal server issue" },
      { status: 500 }
    );
  }
}
