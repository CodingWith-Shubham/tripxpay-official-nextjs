import { database } from "@/lib/firebase";
import { get, ref, remove, serverTimestamp, update } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const userid = req.nextUrl.searchParams.get("uid");
    const merchantid = req.nextUrl.searchParams.get("merchantid");
    if (!userid || !merchantid) {
      return NextResponse.json(
        { message: "Bad reques, uid must be required into the params" },
        { status: 400 }
      );
    }
    const invitesref = ref(database, `merchantInvites/${merchantid}/${userid}`);
    const userRef = ref(database, `users/${userid}`);
    const usersnapshot = await get(userRef);
    const inviteSnapshot = await get(invitesref);
    if (!usersnapshot.exists() || !inviteSnapshot.exists()) {
      return NextResponse.json(
        { message: "User data not foud" },
        { status: 404 }
      );
    }
    const updates = {
      merchantRel: merchantid,
    };
    await update(userRef, updates);
    await remove(invitesref);
    return NextResponse.json(
      { message: `Consumer request accepted` },
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
