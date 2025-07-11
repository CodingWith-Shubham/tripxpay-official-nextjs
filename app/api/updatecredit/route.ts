import { database } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const amount = req.nextUrl.searchParams.get("amount");
    const userId = req.nextUrl.searchParams.get("userid");
    if (!amount || !userId) {
      return NextResponse.json({ message: "bad request" }, { status: 400 });
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return NextResponse.json({ message: "invalid amount" }, { status: 400 });
    }

    // Use update to set the creditedAmount field
    await update(ref(database, `users/${userId}`), {
      creditedAmount: numericAmount,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(
      "error while updating the credit amount",
      (error as Error).message
    );
    return NextResponse.json(
      { message: "Internal server issue " },
      { status: 500 }
    );
  }
}
