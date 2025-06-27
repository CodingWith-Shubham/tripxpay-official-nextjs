import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get("tripxPay__token")?.value;
    if (!token) {
      return NextResponse.json({ role: null });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === "object" && decoded !== null && "role" in decoded) {
      return NextResponse.json({ role: (decoded as any).role });
    }
    return NextResponse.json({ role: null });
  } catch {
    return NextResponse.json({ role: null });
  }
}
