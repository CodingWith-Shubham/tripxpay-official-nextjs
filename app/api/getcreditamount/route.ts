import { database } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ message: "bad request" }, { status: 400 });
    }
    const creditRef = ref(database, `users/${uid}/creditedAmount`);
    const snapshot = await get(creditRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ currentCredit: 0 }, { status: 200 });
    }
    return NextResponse.json(
      { currentCredit: snapshot.val() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server issue" },
      { status: 500 }
    );
  }
}
