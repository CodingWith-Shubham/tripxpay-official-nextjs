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

// Updated API endpoint
export async function POST(req: NextRequest) {
  try {
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize")) || 9;
    const lastkey = req.nextUrl.searchParams.get("lastkey");
    const category = req.nextUrl.searchParams.get("category");

    const blogref = ref(database, "blogs");
    let queryRef;

    // Build the query based on parameters
    if (category && category !== "all") {
      queryRef = query(
        blogref,
        orderByChild("category"),
        equalTo(category),
        limitToFirst(pageSize)
      );
    } else {
      if (lastkey) {
        queryRef = query(
          blogref,
          orderByChild("creationDate"),
          startAfter(lastkey),
          limitToFirst(pageSize)
        );
      } else {
        queryRef = query(
          blogref,
          orderByChild("creationDate"),
          limitToFirst(pageSize)
        );
      }
    }

    const snapshot = await get(queryRef);
    const blogs: any[] = [];

    snapshot.forEach((childsnapshot: any) => {
      blogs.push({
        id: childsnapshot.key,
        ...childsnapshot.val(),
      });
    });

    // Get total count for pagination (you'll need to implement this)
    const totalCount = await getTotalBlogCount(category);

    return NextResponse.json(
      {
        blogs,
        totalCount,
        nextLastKey:
          blogs.length > 0 ? blogs[blogs.length - 1].creationDate : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to get total count
async function getTotalBlogCount(category?: string | null) {
  const blogref = ref(database, "blogs");
  let queryRef;

  if (category && category !== "all") {
    queryRef = query(blogref, orderByChild("category"), equalTo(category));
  } else {
    queryRef = blogref;
  }

  const snapshot = await get(queryRef);
  return snapshot.size;
}
