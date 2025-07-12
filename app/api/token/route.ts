import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Create token payload
    const tokenPayload = {
      role: "consumer",
    };

    // Set cookie
    (await cookies()).set("tripxPay__token", JSON.stringify(tokenPayload), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ success: true, token: tokenPayload });
  } catch (error: any) {
    console.error("Error creating custom token:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
