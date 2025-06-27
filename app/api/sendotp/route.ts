import { auth } from "@/lib/firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const phoneNumber = req.nextUrl.searchParams.get("phoneNumber");
    console.log(phoneNumber);
    if (!phoneNumber) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }
    const user = await signInWithPhoneNumber(auth, phoneNumber);
  } catch (error) {}
}
