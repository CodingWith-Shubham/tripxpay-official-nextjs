import { database } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const rtdbref = ref(database, "merchants");
    const snapshot = await get(rtdbref);
    const merchants: any = [];
    snapshot.forEach((childsnapshot) => {
      if (merchants.length < 6) {
        merchants.push(childsnapshot.val());
      }
    });
    return NextResponse.json({ merchants }, { status: 200 });
  } catch (error) {
    console.log("error while getting the recommended merchant", error);
    return NextResponse.json(
      { message: "internal server issue" },
      { status: 500 }
    );
  }
}
