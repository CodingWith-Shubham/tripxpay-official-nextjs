import { database } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const merchantid = req.nextUrl.searchParams.get("merchantid");
    if (!merchantid) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }
    const rtdbref = ref(database, `merchants/${merchantid}`);
    const snapshot = await get(rtdbref);
    if (snapshot.exists()) {
      return NextResponse.json({ data: snapshot.val() }, { status: 200 });
    }
    return NextResponse.json(
      { message: "merchant data not found" },
      { status: 404 }
    );
  } catch (error) {
    console.log((error as Error).message);
    return NextResponse.json(
      { message: "Internal server issue " },
      { status: 500 }
    );
  }
}
