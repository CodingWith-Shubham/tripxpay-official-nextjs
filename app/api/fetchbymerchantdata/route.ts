import { database } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const merchantId = req.nextUrl.searchParams.get("merchantid");
    if (!merchantId) {
      return NextResponse.json({ message: "bad requst" }, { status: 400 });
    }

    const merchantRef = ref(database, `merchants/${merchantId}`);
    const snapshot = await get(merchantRef);

    if (snapshot.exists()) {
      return NextResponse.json(
        {
          data: {
            id: merchantId,
            ...snapshot.val(),
          },
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "merchant data not found" },
      { status: 404 }
    );
  } catch (error) {
    console.log(
      "error while fetching the merchantdata",
      (error as Error).message
    );
    return NextResponse.json(
      { message: "Internal server issue" },
      { status: 500 }
    );
  }
}
