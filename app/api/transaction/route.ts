import { database } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

interface Transaction {
  id: string;
  type: "credit_push" | "credit_pull";
  description?: string;
  timestamp: string;
  paidAmount?: number;
  creditedAmount?: number;
  amount?: number;
  date?: string;
}

export async function POST(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }
    const transactionsRef = ref(database, `users/${uid}/transactions`);

    const snapshot = await get(transactionsRef);
    const data = snapshot.val();

    const parsedTransactions: Transaction[] = Object.entries(data).map(
      ([key, value]: [string, any]) => ({
        id: key,
        ...value,
      })
    );

    // Sort by date (assuming `date` is in a format like "2025-06-12")
    parsedTransactions.sort(
      (a, b) =>
        new Date(b.date || b.timestamp).getTime() -
        new Date(a.date || a.timestamp).getTime()
    );
    return NextResponse.json(
      { data: Array.isArray(parsedTransactions) ? parsedTransactions : [] },
      { status: 200 }
    );
  } catch (error) {
    console.log((error as Error).message);
    return NextResponse.json(
      { message: "Internal server issue" },
      { status: 500 }
    );
  }
}
