import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    (await cookies()).delete("tripxPay__token");
    return NextResponse.json(
      { message: "logout successfully " },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while logout ", error);
    return NextResponse.json(
      { message: "Internal server issue" },
      { status: 500 }
    );
  }
}
