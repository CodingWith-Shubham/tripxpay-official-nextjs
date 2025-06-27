"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Blog, { BlogPost } from "@/components/Blog";

interface Category {
  id: string;
  name: string;
}

interface BlogResponse {
  blogs: BlogPost[];
  total: number;
  hasMore: boolean;
  hasNextPage: boolean;
}

const UploadBlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const POSTS_PER_PAGE: number = 9;

  const categories: Category[] = [
    { id: "all", name: "All" },
    { id: "General Updates", name: "General Updates" },
    { id: "Events", name: "Events" },
    { id: "System Notices", name: "System Notices" },
    { id: "New Features", name: "New Features" },
  ];

  const fetchBlogs = useCallback(
    async (
      page: number = 1,
      category: string = "all",
      isLoadMore: boolean = false
    ): Promise<void> => {
      try {
        if (!isLoadMore) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        const result = await fetch(
          `/api/getallblogs?page=${page}&pagelimit=${POSTS_PER_PAGE}&category=${
            category === "all" ? null : category
          }`,
          { method: "POST" }
        );

        if (result) {
          const { blogs, total, hasMore, hasNextPage } = await result.json();

          if (isLoadMore) {
            setPosts((prevPosts) => [...prevPosts, ...blogs]);
          } else {
            setPosts(blogs);
          }

          setTotalPosts(total);
          setHasNextPage(hasMore || hasNextPage);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchBlogs(1, activeCategory);
  }, [activeCategory, fetchBlogs]);

  const handleRefresh = (): void => {
    setIsRefreshing(true);
    setCurrentPage(1);
    fetchBlogs(1, activeCategory);
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= Math.ceil(totalPosts / POSTS_PER_PAGE)) {
      fetchBlogs(newPage, activeCategory);
    }
  };

  const handleLoadMore = (): void => {
    if (hasNextPage && !loadingMore) {
      fetchBlogs(currentPage + 1, activeCategory, true);
    }
  };

  const handleCategoryChange = (categoryId: string): void => {
    setActiveCategory(categoryId);
    setError(null);
  };

  const totalPages: number = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <PageHeader
        title="TripxPay Announcements"
        description="Stay informed about the latest updates, features, and events."
      />

      <div className="flex-grow py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="overflow-x-auto">
              <div className="flex space-x-4 min-w-max">
                {categories.map((category: Category) => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium md:text-[18px] whitespace-nowrap transition-colors ${
                      activeCategory === category.id
                        ? "bg-teal-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors ${
                isRefreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Refresh blogs"
            >
              <RefreshCw
                size={20}
                className={`text-gray-300 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>

          {loading ? (
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
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No announcements found in this category.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.map((post: BlogPost) => (
                  <div key={post.id} className="animate-fadeIn">
                    <Blog post={post} onDelete={handleRefresh} />
                  </div>
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-teal-500 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
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

      <Footer />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UploadBlogsPage;
