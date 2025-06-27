import { database } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const merchantid = req.nextUrl.searchParams.get("merchantid");
    if (!merchantid) {
      return NextResponse.json({ message: "Bad reqest" }, { status: 400 });
    }

    const dbref = ref(database, `merchants/${merchantid}`);
    const snapshot = await get(dbref);
    if (!snapshot.exists()) {
      return NextResponse.json({ success: false }, { status: 200 });
    }
    if (snapshot.exists()) {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    // Fallback return (should never be reached)
    return NextResponse.json({ success: false }, { status: 200 });
  } catch (error) {
    console.log("error while getting the merchant existence", error);
    return NextResponse.json(
      { message: "Internal server iss+ue" },
      { status: 500 }
    );
  }
}
