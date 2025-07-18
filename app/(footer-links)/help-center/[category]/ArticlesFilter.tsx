"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  publishedAt: string;
  featured?: boolean;
}

interface CategoryInfo {
  title: string;
  description: string;
  icon: string;
}

interface ArticlesFilterProps {
  articles: Article[];
  allTags: string[];
  normalizedCategory: string;
  categoryInfo: CategoryInfo;
}

export default function ArticlesFilter({ articles, allTags, normalizedCategory, categoryInfo }: ArticlesFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag =
        selectedTag === "all" || article.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [articles, searchQuery, selectedTag]);

  const featuredArticles = filteredArticles.filter((article) => article.featured);
  const regularArticles = filteredArticles.filter((article) => !article.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="py-3 sm:py-6 px-3 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-3 mb-4 sm:mb-8">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 pl-9 sm:pl-12 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              />
              <svg
                className="absolute left-3 top-2.5 sm:left-4 sm:top-3.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter dropdown */}
            <div className="relative">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none pr-8 sm:pr-10 text-sm sm:text-base"
              >
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag === "all"
                      ? "All Tags"
                      : tag
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-3 sm:top-4 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              Showing {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""}
              {searchQuery && (
                <span className="block sm:inline sm:ml-1 mt-1 sm:mt-0">
                  for "
                  <span className="text-teal-400 break-all">
                    {searchQuery}
                  </span>
                  "
                </span>
              )}
              {selectedTag !== "all" && (
                <span className="block sm:inline sm:ml-1 mt-1 sm:mt-0">
                  tagged with "
                  <span className="text-teal-400">
                    {selectedTag.replace("-", " ")}
                  </span>
                  "
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Articles Content */}
      <div className="flex-grow py-3 sm:py-6 px-3 sm:px-6 lg:px-12 pb-6 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold mb-2">
                No articles found
              </h3>
              <p className="text-gray-400 mb-4 text-sm px-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag("all");
                }}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors duration-300 text-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured Articles */}
              {featuredArticles.length > 0 && (
                <div className="mb-6 sm:mb-12">
                  <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Featured Articles
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
                    {featuredArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/help-center/${normalizedCategory}/${article.id}`}
                        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-lg p-3 sm:p-6 border border-yellow-500/20 transform transition-all duration-300 hover:translate-y-[-1px] sm:hover:translate-y-[-4px] hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/10 group cursor-pointer"
                      >
                        <div className="flex flex-col xs:flex-row xs:items-start justify-between mb-2 sm:mb-4 gap-2">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                              Featured
                            </span>
                            <span className="text-gray-400 text-xs">
                              {article.readTime}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-base sm:text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-yellow-400 line-clamp-2 break-words leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-gray-300 mb-3 line-clamp-3 transition-colors duration-300 group-hover:text-white text-sm sm:text-base leading-relaxed">
                          {article.excerpt}
                        </p>
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 sm:gap-3">
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {article.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full transition-colors duration-300 group-hover:bg-teal-500/20 group-hover:text-teal-400"
                              >
                                {tag.replace("-", " ")}
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-500 text-xs">
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Articles */}
              {regularArticles.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6">
                    All Articles
                  </h2>
                  <div className="space-y-3 sm:space-y-6">
                    {regularArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/help-center/${normalizedCategory}/${article.id}`}
                        className="block bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 sm:p-6 border border-gray-800/50 transform transition-all duration-300 hover:translate-y-[-1px] hover:bg-gray-900/90 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 group cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-4 gap-2">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-gray-400 text-xs">
                              {article.readTime}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {formatDate(article.publishedAt)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {article.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full transition-colors duration-300 group-hover:bg-teal-500/20 group-hover:text-teal-400"
                              >
                                {tag.replace("-", " ")}
                              </span>
                            ))}
                          </div>
                        </div>
                        <h3 className="text-base sm:text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-teal-400 break-words leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-gray-300 transition-colors duration-300 group-hover:text-white text-sm sm:text-base leading-relaxed mb-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center text-teal-500 group-hover:text-teal-400 transition-colors duration-300">
                          <span className="text-xs sm:text-sm font-medium">
                            Read article
                          </span>
                          <svg
                            className="w-3 h-3 ml-2 transform transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
