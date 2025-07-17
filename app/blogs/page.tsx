"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Blog from "@/components/Blog";

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

const UploadBlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Pagination states
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(9); // Items per page
  const [lastKeys, setLastKeys] = useState<{ [key: number]: string | null }>(
    {}
  );

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

      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await res.json();

      setBlogs(data.blogs);
      setTotalPages(Math.ceil(data.totalCount / pageSize));

      // Store the last key for next page
      if (data.nextLastKey) {
        setLastKeys((prev) => ({ ...prev, [page]: data.nextLastKey }));
      }

      setError(null);
    } catch (err) {
      setError((err as Error).message || "Failed to load blogs");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setLastKeys({});
    fetchBlogs(1);
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

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background effects matching HomePage */}
      {/* Top-left glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />

      {/* Top-right spread glow */}
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />

      {/* Optional grid dots background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">
        <Navbar />

        <PageHeader
            title="TripxPay Announcements"
            description="Stay informed about the latest updates, features, and events."
        />

        <div className="flex-grow py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center gap-4 mb-8">
              {/* Scrollable Categories */}
              <div className="overflow-x-auto scrollbar-hide flex-1">
                <div className="flex gap-3 px-1 w-max">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 text-sm sm:text-base font-medium rounded-lg whitespace-nowrap transition-colors duration-150 ${
                        activeCategory === category.id
                          ? "bg-teal-600 text-white shadow-md"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Refresh Button - Circular and Compact */}
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
                <p className="text-gray-400">
                  No announcements found in this category.
                </p>
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
      </div>
        <Footer />
      </div>
  )
}
export default UploadBlogsPage;