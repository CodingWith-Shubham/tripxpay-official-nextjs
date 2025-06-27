import { database } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json(
        { message: "uid must be required" },
        { status: 400 }
      );
    }
    const rtdbref = ref(database, `users/${uid}`);
    const snapshot = await get(rtdbref);
    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: "User data not found" },
        { status: 404 }
      );
    }
    const data = snapshot.val();
    return NextResponse.json(
      {
        success: true,
        data: {
          uid: data.uid,
          displayName: data.displayName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          photoURL: data.photoURL,
          status: data.status,
          isVerified: data.isVerified,
          creditedAmount: data.creditedAmount,
          merchantRel: data.merchantRel,
          documents: data.documents,
          faceAuth: data.faceAuth,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server issue" },
      { status: 500 }
    );
  }
}
