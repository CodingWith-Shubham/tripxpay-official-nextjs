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

    const usersRef = ref(database, "users");
    let queryConstraints = [
      orderByChild("submittedAt"),
      limitToFirst(pageSize + 10), // fetch a few extra in case some are filtered out
    ];

    if (lastkey && lastkey !== "null") {
      queryConstraints.push(startAfter(lastkey));
    }

    const usersQuery = query(usersRef, ...queryConstraints);
    const snapshot = await get(usersQuery);

    const consumers: any[] = [];
    let lastKey = null;

    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      if (userData.merchantRel === merchantid) {
        consumers.push({
          userId: childSnapshot.key,
          userData: userData,
        });
        lastKey = userData.submittedAt;
      }
    });

    // Only return up to pageSize
    const pagedConsumers = consumers.slice(0, pageSize);

    return NextResponse.json({
      data: pagedConsumers,
      lastKey,
      hasMore: pagedConsumers.length === pageSize,
    });
  } catch (error) {
    console.error("Error fetching merchant customers:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
