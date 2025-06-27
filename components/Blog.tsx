"use client";
import React, { useState, useEffect } from "react";

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  category: string;
  creationDate: string;
  author: string;
}

interface BlogProps {
  post: BlogPost;
  onDelete: () => void;
}

const Blog: React.FC<BlogProps> = ({ post }) => {
  const [readtime, setReadtime] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const calculateReadtime = (): void => {
      const now = new Date();
      const created = new Date(post.creationDate);
      const diffInMinutes = Math.floor(
        (now.getTime() - created.getTime()) / 60000
      );

      if (diffInMinutes < 60) {
        setReadtime(`${diffInMinutes} min ago`);
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        setReadtime(`${hours} hour${hours > 1 ? "s" : ""} ago`);
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        setReadtime(`${days} day${days > 1 ? "s" : ""} ago`);
      }
    };

    calculateReadtime();
    const interval = setInterval(calculateReadtime, 60000);
    return () => clearInterval(interval);
  }, [post.creationDate]);

  return (
<div 
    key={post.id} 
    className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 flex flex-col justify-between h-full tracking-wide space-y-4 transition-all duration-300 hover:translate-y-[-8px] hover:bg-gray-900/90 hover:shadow-2xl hover:shadow-teal-500/10 cursor-pointer group border border-gray-800/50 hover:border-teal-500/30 transform"
>
    <div className="flex items-center mb-3">
        <span className="text-xs font-medium md:text-[18px] text-teal-500 px-2 py-1 rounded">
             {post.category}
        </span>
        <span className="text-xs text-gray-400 ml-auto transition-colors duration-300 group-hover:text-gray-300">{formatDate(post.creationDate)}</span>
    </div>
    <h3 className="text-lg md:text-[22px] font-bold group-hover:text-teal-400 transition-colors duration-300">{post.title}</h3>
    <p className="text-gray-400 text-[19px] group-hover:text-gray-200 transition-colors duration-300">{post.description}</p>
    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800 group-hover:border-gray-700 transition-colors duration-300">
        <span className="text-xs text-gray-400 transition-colors duration-300 group-hover:text-white">{post.author}</span>
        <span className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-300">{readtime}</span>
    </div>
</div>
  );
};

export default Blog;
