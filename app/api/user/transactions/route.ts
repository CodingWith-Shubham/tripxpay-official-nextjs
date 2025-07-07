import { database } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ message: "uid is required" }, { status: 400 });
    }
    const transactionsRef = ref(database, `users/${uid}/transactions`);
    const snapshot = await get(transactionsRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ success: true, transactions: [] }, { status: 200 });
    }
    const data = snapshot.val();
    // Convert object to array with id, ensure value is an object
    const transactions = Object.entries(data).map(([id, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return { id, ...value };
      } else {
        return { id, value };
      }
    });
    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}