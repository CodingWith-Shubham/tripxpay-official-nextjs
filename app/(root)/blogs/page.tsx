"use client";
import { useState, useEffect, useCallback } from "react";
import { getAllBlogs } from "../../Blogs";
import PageHeader from "@/components/PageHeader";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Blog from "@/components/Blog";
import { motion, Variants } from "framer-motion";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const containerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const UploadBlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const POSTS_PER_PAGE = 9;

  const categories: Category[] = [
    { id: "all", name: "All" },
    { id: "General Updates", name: "General Updates" },
    { id: "Events", name: "Events" },
    { id: "System Notices", name: "System Notices" },
    { id: "New Features", name: "New Features" },
  ];

  const fetchBlogs = useCallback(
    async (page = 1, category = "all", isLoadMore = false) => {
      try {
        if (!isLoadMore) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const result = await getAllBlogs({
          page,
          limit: POSTS_PER_PAGE,
          category: category === "all" ? null : category,
        });

        if (result) {
          const { blogs, total, hasMore, hasNextPage } = result;

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    fetchBlogs(1, activeCategory);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalPosts / POSTS_PER_PAGE)) {
      fetchBlogs(newPage, activeCategory);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loadingMore) {
      fetchBlogs(currentPage + 1, activeCategory, true);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setError(null);
  };

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[200px] md:h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[80px] md:blur-[120px] rounded-[30%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[300px] md:w-[550px] h-[200px] md:h-[300px] bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[80px] md:blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />

      <div className="relative z-10">
        <PageHeader
          title="TripxPay Announcements"
          description="Stay informed about the latest updates, features, and events."
        />

        <div className="flex-grow py-6 md:py-12 px-4 sm:px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={containerStagger}
              initial="hidden"
              animate="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8"
            >
              <motion.div
                custom={0}
                variants={fadeInUp}
                className="w-full overflow-x-auto pb-2 md:pb-0"
              >
                <div className="flex space-x-2 md:space-x-4 min-w-max">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium whitespace-nowrap ${
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
              </motion.div>

              <motion.button
              custom={1}
              variants={fadeInUp}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-1.5 md:p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center ${
                isRefreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Refresh blogs"
            >
              {isRefreshing ? (
                <LoadingSpinner size="medium" />
              ) : (
                <RefreshCw size={18} className="text-gray-300" />
              )}
            </motion.button>
          </motion.div>

            {loading ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center py-8 md:py-12"
              >
                <div className="inline-block w-6 h-6 md:w-8 md:h-8 border-3 md:border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-400">Loading blogs...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center py-8 md:py-12"
              >
                <p className="text-sm md:text-base text-red-400">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 md:mt-4 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : posts.length === 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center py-8 md:py-12"
              >
                <p className="text-sm md:text-base text-gray-400">
                  No announcements found in this category.
                </p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  variants={containerStagger}
                  initial="hidden"
                  animate="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
                >
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      custom={index % 3}
                      variants={fadeInUp}
                    >
                      <Blog post={post} onDelete={handleRefresh} />
                    </motion.div>
                  ))}
                </motion.div>

                {totalPages > 1 && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row justify-center items-center mt-8 md:mt-12 gap-3 sm:gap-4"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg transition-colors ${
                        currentPage === 1
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
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
                              className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-lg transition-colors ${
                                currentPage === pageNum
                                  ? "bg-teal-500 text-white"
                                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadBlogsPage;