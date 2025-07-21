"use client";
import { useState, useEffect } from "react";
import Blog from "@/components/Blog";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPost {
  id: string;
  author: string;
  category: string;
  description: string;
  title: string;
  creationDate: string;
  timestamp?: number;
}

interface Category {
  id: string;
  name: string;
}

export default function UploadBlogsClient({
  initialBlogs,
  initialTotalCount,
  initialLastKey,
}: {
  initialBlogs: BlogPost[];
  initialTotalCount: number;
  initialLastKey: string | null;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(initialTotalCount / 9)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [pageSize] = useState<number>(9);
  const [lastKeys, setLastKeys] = useState<{ [key: number]: string | null }>({
    1: initialLastKey,
  });

  const categories: Category[] = [
    { id: "all", name: "All" },
    { id: "General Updates", name: "General Updates" },
    { id: "Events", name: "Events" },
    { id: "System Notices", name: "System Notices" },
    { id: "New Features", name: "New Features" },
  ];

  const fetchBlogs = async (page: number) => {
    try {
      setLoading(true);
      const url = `/api/getallblogs?page=${page}&pageSize=${pageSize}${
        activeCategory !== "all" ? `&category=${activeCategory}` : ""
      }${lastKeys[page - 1] ? `&lastkey=${lastKeys[page - 1]}` : ""}`;

      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error("Failed to fetch blogs");

      const data = await res.json();
      setBlogs(data.blogs);
      setTotalPages(Math.ceil(data.totalCount / pageSize));

      if (data.nextLastKey) {
        setLastKeys((prev) => ({ ...prev, [page]: data.nextLastKey }));
      }

      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // if (activeCategory !== "all") {
      setCurrentPage(1);
      setLastKeys({});
      fetchBlogs(1);
    // }
  }, [activeCategory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setLastKeys({});
    fetchBlogs(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchBlogs(page);
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-lg transition-colors ${
            currentPage === i
              ? "bg-teal-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex-grow py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Categories and Refresh Button */}
        <div className="flex justify-between items-center gap-4 mb-8">
          <div className="overflow-x-auto scrollbar-hide flex-1">
            <div className="flex gap-3 px-1 w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 text-sm sm:text-base font-medium rounded-lg whitespace-nowrap transition-colors duration-150 ${
                    activeCategory === category.id
                      ? "bg-teal-600 text-white shadow-md"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="shrink-0 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Refresh blogs"
          >
            {isRefreshing ? (
              <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <RefreshCw size={18} className="text-gray-300" />
            )}
          </button>
        </div>

        {loading && blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading blogs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No announcements found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((post) => (
                <Blog key={post.id} post={post} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </button>
                <div className="flex items-center space-x-2">
                  {renderPaginationNumbers()}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
