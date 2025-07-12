import { database } from "@/lib/firebase";
import { get, ref, remove } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
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
    const inviteSnapshot = await get(invitesref);
    if (!inviteSnapshot.exists()) {
      return NextResponse.json(
        { message: "User data not foud" },
        { status: 404 }
      );
    }
    await remove(invitesref);
    return NextResponse.json(
      { message: "Consumer request rejected" },
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
