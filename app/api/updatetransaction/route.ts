import { database } from "@/lib/firebase";
import { push, ref, serverTimestamp, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userid = req.nextUrl.searchParams.get("userid");
    const { orderinfo } = await req.json();
    if (!userid || !orderinfo) {
      return NextResponse.json({ message: "bad request" }, { status: 400 });
    }
    const timestamp = serverTimestamp();
    const transactionWithTimestamp = {
      ...orderinfo,
      timestamp,
    };

    // Store under users/{userId}/transactions/{transactionId}
    const transactionsRef = ref(database, `users/${userid}/transactions`);
    const newTransactionRef = push(transactionsRef);

    await set(newTransactionRef, transactionWithTimestamp);

    return NextResponse.json(
      {
        success: true,
        transactionId: newTransactionRef.key,
        timestamp,
      },
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
// const timestamp = new Date().toISOString();

// const transactionWithTimestamp = {
//   ...orderInfo,
//   timestamp,
// };

// // Store under users/{userId}/transactions/{transactionId}
// const transactionsRef = ref(database, `users/${userId}/transactions`);
// const newTransactionRef = push(transactionsRef);

// console.log("Uploading transaction:", {
//   userId,
//   transactionId: newTransactionRef.key,
//   orderInfo: transactionWithTimestamp,
// });

// await set(newTransactionRef, transactionWithTimestamp);

// console.log("Transaction uploaded successfully");
// return {
//   success: true,
//   transactionId: newTransactionRef.key,
//   timestamp,
// };
