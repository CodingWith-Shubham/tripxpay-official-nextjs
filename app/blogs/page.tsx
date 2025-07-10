"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { RefreshCw } from "lucide-react";
import Blog from "@/components/Blog";
import { database } from "@/lib/firebase";

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

  // Cursor-based pagination states
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const categories: Category[] = [
    { id: "all", name: "All" },
    { id: "General Updates", name: "General Updates" },
    { id: "Events", name: "Events" },
    { id: "System Notices", name: "System Notices" },
    { id: "New Features", name: "New Features" },
  ];

  const fetchBlogs = async (reset = false) => {
    try {
      if (reset) {
        setIsRefreshing(true);
        setBlogs([]);
        setLastKey(null);
        setHasMore(true);
      }

      if (!hasMore && !reset) return;

      setLoading(true);

      const url = `/api/getallblogs?pageSize=9${
        lastKey && !reset ? `&lastkey=${lastKey}` : ""
      }${activeCategory !== "all" ? `&category=${activeCategory}` : ""}`;

      const res = await fetch(url, { method: "POST" });

      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await res.json();

      if (reset) {
        setBlogs(data.blogs);
      } else {
        setBlogs((prev) => [...prev, ...data.blogs]);
      }

      setLastKey(data.nextLastKey);
      setHasMore(data.blogs.length === 9);
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Failed to load blogs");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlogs(true);
  }, [activeCategory]);

  const handleRefresh = () => {
    fetchBlogs(true);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchBlogs();
    }
  };

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

              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      loading
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-teal-500 text-white hover:bg-teal-600"
                    }`}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UploadBlogsPage;
