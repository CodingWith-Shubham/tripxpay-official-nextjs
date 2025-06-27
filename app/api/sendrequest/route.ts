import { database } from "@/lib/firebase";
import { ref, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(red: NextRequest) {
  try {
    const { merchantId, userId, userdata } = await red.json();
    if (!merchantId || !userId || !userdata) {
      return NextResponse.json({ message: "bad request" }, { status: 400 });
    }
    const requestRef = ref(database, `merchantInvites/${merchantId}/${userId}`);
    await set(requestRef, {
      userId,
      userdata,
      status: "pending",
      timestamp: Date.now(),
    });
    return NextResponse.json(
      {
        message: "successfuully send the request",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while sending request", (error as Error).message);
    return NextResponse.json(
      { message: "Internal server issue", success: false },
      { status: 500 }
    );
  }
}
