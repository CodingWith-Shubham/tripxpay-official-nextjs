"use client";
import { useState, useEffect, useCallback } from "react";
import { getAllBlogs } from "../../Blogs";
import PageHeader from "@/components/PageHeader";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Blog from "@/components/Blog";
import { motion } from "framer-motion";

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
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

const containerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

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

  const POSTS_PER_PAGE = 9; // Adjust based on your grid (3x3)

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

        // Pass pagination parameters to your service
        const result = await getAllBlogs({
          page,
          limit: POSTS_PER_PAGE,
          category: category === "all" ? null : category,
        });

        if (result) {
          const { blogs, total, hasMore, hasNextPage } = result;

          if (isLoadMore) {
            // Append new posts for "Load More" functionality
            setPosts((prevPosts) => [...prevPosts, ...blogs]);
          } else {
            // Replace posts for new page or category change
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
    // Reset to page 1 when category changes
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
    setError(null); // Clear any existing errors
  };

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />

      {/* Grid dots background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">
        <PageHeader
          title="TripxPay Announcements"
          description="Stay informed about the latest updates, features, and events."
        />

        <div className="flex-grow py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={containerStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex justify-between items-center mb-8"
            >
              {/*list of categories*/}
              <motion.div
                custom={0}
                variants={fadeInUp}
                className="overflow-x-auto"
              >
                <div className="flex space-x-4 min-w-max">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium md:text-[18px] whitespace-nowrap ${
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

              {/*refresh button*/}
              <motion.button
                custom={1}
                variants={fadeInUp}
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
              </motion.button>
            </motion.div>

            {/*showing blogs*/}
            {loading ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center py-12"
              >
                <div className="inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">Loading blogs...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center py-12"
              >
                <p className="text-red-400">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : posts.length === 0 ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center py-12"
              >
                <p className="text-gray-400">
                  No announcements found in this category.
                </p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  variants={containerStagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="flex justify-center items-center mt-12 space-x-4"
                  >
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
                      {/* Page numbers */}
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
                              className={`w-10 h-10 rounded-lg transition-colors ${
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
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      Next
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