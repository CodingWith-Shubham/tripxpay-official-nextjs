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
    let queryConstraints = [limitToFirst(pageSize)];

    // Add startAfter if lastkey is provided
    if (lastkey && lastkey !== "null") {
      queryConstraints.push(orderByChild("timestamp"), startAfter(lastkey));
    }

    const invitesQuery = query(invitesRef, ...queryConstraints);
    const snapshot = await get(invitesQuery);

    const requests: any[] = [];
    let lastKey = null;

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const requestData = childSnapshot.val();
        requests.push({
          id: childSnapshot.key,
          ...requestData,
        });
        lastKey = requestData.timestamp;
      });
    }

    return NextResponse.json({
      data: requests,
      lastKey,
      hasMore: requests.length === pageSize,
    });
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
