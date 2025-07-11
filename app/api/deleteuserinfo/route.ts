import { database } from "@/lib/firebase";
import { get, ref, remove } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: "User data not found" },
        { status: 404 }
      );
    }
    await remove(userRef);
    return NextResponse.json(
      { message: "user data deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("error when deleting", (error as Error).message);
    return NextResponse.json(
      { message: "Internal server issue", success: false },
      { status: 500 }
    );
  }
}
