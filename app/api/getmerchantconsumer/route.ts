import { database } from "@/lib/firebase";
import {
  equalTo,
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

    const usersRef = ref(database, "users");
    let queryConstraints = [
      orderByChild("merchantRel"),
      equalTo(merchantid),
      limitToFirst(pageSize),
    ];

    // Add startAfter if lastkey is provided
    if (lastkey && lastkey !== "null") {
      queryConstraints.push(startAfter(lastkey));
    }

    const merchantQuery = query(usersRef, ...queryConstraints);
    const snapshot = await get(merchantQuery);

    const consumers: any[] = [];
    let lastKey = null;

    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      consumers.push({
        userId: childSnapshot.key,
        userData: userData,
      });
      lastKey = userData.submittedAt;
    });

    return NextResponse.json({
      data: consumers,
      lastKey,
      hasMore: consumers.length === pageSize,
    });
  } catch (error) {
    console.error("Error fetching merchant customers:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
