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
    // Parse both page number and page size
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize")) || 10; // Default to 10 items
    const lastkey = req.nextUrl.searchParams.get("lastkey");

    if (!page || page < 1) {
      return NextResponse.json(
        { message: "Invalid page number" },
        { status: 400 }
      );
    }

    const blogref = ref(database, "blogs");
    let blogs: any[] = [];
    let snapshot;

    // Pagination query
    if (lastkey && lastkey !== "null") {
      const paginationQuery = query(
        blogref,
        orderByChild("creationDate"),
        startAfter(Number(lastkey)),
        limitToFirst(pageSize) // Use pageSize here
      );
      snapshot = await get(paginationQuery);
    }
    // Initial load
    else {
      const intialloadquery = query(
        blogref,
        orderByChild("creationDate"),
        limitToFirst(pageSize) // Use pageSize here
      );
      snapshot = await get(intialloadquery);
    }

    snapshot.forEach((childsnapshot: any) => {
      blogs.push({
        id: childsnapshot.key,
        ...childsnapshot.val(),
      });
    });

    const nextLastKey =
      blogs.length > 0 ? blogs[blogs.length - 1].creationDate : null;

    return NextResponse.json(
      {
        blogs,
        nextLastKey,
        page,
        pageSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Pagination error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
