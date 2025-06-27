import { database } from "@/lib/firebase";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbref = ref(database, "merchants");
    const merchantsQuery = query(
      dbref,
      orderByChild("isVerified"),
      equalTo(false)
    );
    const snapshot = await get(merchantsQuery);
    const merchants: any = [];

    snapshot.forEach((childSnapshot) => {
      const merchantData = childSnapshot.val();
      // Only include merchants that aren't rejected
      if (!merchantData.rejected) {
        merchants.push(merchantData);
      }
    });
    return NextResponse.json(
      { data: merchants },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
}
