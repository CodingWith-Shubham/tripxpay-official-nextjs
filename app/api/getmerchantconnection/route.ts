import { database } from "@/lib/firebase";
import {
  get,
  limitToFirst,
  orderByChild,
  query,
  ref,
  startAfter,
} from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { merchantid, pageSize, lastkey } = await req.json();

    if (!merchantid || !pageSize) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    const invitesRef = ref(database, `merchantInvites/${merchantid}`);
    if ((!lastkey && lastkey !== "null") || null) {
      const requestQuery = query(
        invitesRef,
        orderByChild("timestamp"),
        limitToFirst(pageSize)
      );
      const requests: any = [];
      let lastKey = null;
      const snapshot = await get(requestQuery);
      snapshot.forEach((childsnapshot) => {
        const data = childsnapshot.val();
        requests.push(data);
        lastKey = data.timestamp;
      });
      return NextResponse.json({
        data: requests,
        lastkey,
        hasMore: requests.length === pageSize,
      });
    } else {
      const requestQuery = query(
        invitesRef,
        orderByChild("timestamp"),
        startAfter(lastkey),
        limitToFirst(pageSize)
      );
      const requests: any = [];
      let lastKey = null;
      const snapshot = await get(requestQuery);
      snapshot.forEach((childsnapshot) => {
        const data = childsnapshot.val();
        requests.push(data);
        lastKey = data.timestamp;
      });
      return NextResponse.json({
        data: requests,
        lastkey,
        hasMore: requests.length === pageSize,
      });
    }
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
