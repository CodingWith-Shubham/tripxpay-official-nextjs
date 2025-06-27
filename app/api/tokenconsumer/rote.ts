import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { displayName, email } = await req.json();
    if (!displayName || !email) {
      return NextResponse.json({ message: "bad re" });
    }
    const tokenPayload = {
      displayName,
      email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, {
      issuer: "TripxPay",
    });

    (await cookies()).set("tripxPay__token", token, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7*24
    });
  } catch (error) {}
}
