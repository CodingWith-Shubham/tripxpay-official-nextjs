import { database } from "@/lib/firebase";
import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
} from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize")) || 9;
    const category = req.nextUrl.searchParams.get("category");

    const blogref = ref(database, "blogs");
    let queryRef;

    // Fetch all blogs (filter by category if needed)
    if (category && category !== "all") {
      queryRef = query(blogref, orderByChild("category"), equalTo(category));
    } else {
      queryRef = query(blogref, orderByChild("creationDate"));
    }

    const snapshot = await get(queryRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { blogs: [], totalCount: 0, nextLastKey: null },
        { status: 200 }
      );
    }

    // Collect all blogs
    const allBlogs: any[] = [];
    snapshot.forEach((childSnapshot: any) => {
      allBlogs.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    // Reverse blogs to get newest first
    allBlogs.reverse();

    // Apply manual pagination
    const totalCount = allBlogs.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const blogs = allBlogs.slice(start, end);

    // Determine the nextLastKey for the next page (not used now, but kept for compatibility)
    const nextLastKey =
      end < totalCount ? allBlogs[end - 1]?.creationDate || null : null;

    return NextResponse.json(
      { blogs, totalCount, nextLastKey },
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
