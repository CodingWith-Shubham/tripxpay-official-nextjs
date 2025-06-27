import { database } from "@/lib/firebase";
import { child, get, ref } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("page");
    const pagelimit = req.nextUrl.searchParams.get("limit");
    const category = req.nextUrl.searchParams.get("category");
    if (!page || !pagelimit) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    const pageNum = parseInt(page);
    const pageLimit = parseInt(pagelimit);

    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "blogs"));

    if (!snapshot.exists()) {
      console.log("No blogs found.");
      return NextResponse.json({
        blogs: [],
        total: 0,
        currentPage: pageNum,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
        hasMore: false,
      });
    }

    const data = snapshot.val();
    let blogs = Object.entries(data).map(([id, blog]) => ({
      id,
      ...(blog as any),
    }));

    // Sort by creationDate (latest first)
    blogs.sort(
      (a, b) =>
        new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
    );

    // Filter by category if specified
    if (category && category !== "all") {
      blogs = blogs.filter((blog) => blog.category === category);
    }

    // Calculate pagination
    const total = blogs.length;
    const totalPages = Math.ceil(total / pageLimit);
    const startIndex = (pageNum - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;

    // Get paginated results
    const paginatedBlogs = blogs.slice(startIndex, endIndex);

    return NextResponse.json(
      {
        blogs: paginatedBlogs,
        total,
        currentPage: pageNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        hasMore: pageNum < totalPages, // For compatibility with your component
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export const getAllBlogs = async (options = {}) => {
  try {
      const {
          page = 1,
          limit: pageLimit = 9,
          category = null
      } = options;

      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "blogs"));

      if (!snapshot.exists()) {
          console.log("No blogs found.");
          return {
              blogs: [],
              total: 0,
              currentPage: page,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
              hasMore: false
          };
      }

      const data = snapshot.val();
      let blogs = Object.entries(data).map(([id, blog]) => ({
          id,
          ...blog
      }));

      // Sort by creationDate (latest first)
      blogs.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

      // Filter by category if specified
      if (category && category !== "all") {
          blogs = blogs.filter(blog => blog.category === category);
      }

      // Calculate pagination
      const total = blogs.length;
      const totalPages = Math.ceil(total / pageLimit);
      const startIndex = (page - 1) * pageLimit;
      const endIndex = startIndex + pageLimit;

      // Get paginated results
      const paginatedBlogs = blogs.slice(startIndex, endIndex);

      return {
          blogs: paginatedBlogs,
          total,
          currentPage: page,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          hasMore: page < totalPages // For compatibility with your component
      };

  } catch (error) {
      console.error("Error fetching blogs:", error);
      throw new Error("Failed to fetch blogs");
  }
};