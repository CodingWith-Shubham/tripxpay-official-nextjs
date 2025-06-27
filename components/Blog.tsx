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
      className={`blog-card ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="blog-header">
        <span className="blog-category">{post.category}</span>
        <span className="blog-date">{formatDate(post.creationDate)}</span>
      </div>
      <h3 className="blog-title">{post.title}</h3>
      <p className="blog-description">{post.description}</p>
      <div className="blog-footer">
        <span className="blog-author">{post.author}</span>
        <span className="blog-readtime">{readtime}</span>
      </div>

      <style jsx>{`
        .blog-card {
          background: rgba(31, 41, 55, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 0.5rem;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          letter-spacing: 0.025em;
          gap: 1rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(31, 41, 55, 0.5);
          cursor: pointer;
        }

        .blog-card.hovered {
          transform: translateY(-0.5rem);
          background: rgba(31, 41, 55, 0.9);
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
        }

        /* ... rest of the styles remain the same ... */
      `}</style>
    </div>
  );
};

export default Blog;
