"use client"
import { useState, useEffect } from "react";

interface BlogPost {
    id: string;
    author: string;
    category: string;
    description: string;
    title: string;
    creationDate: string;
    timestamp?: number;
}

interface BlogProps {
    post: BlogPost;
    onDelete?: () => void;
}

const Blog: React.FC<BlogProps> = ({ post, onDelete }) => {
    const [readtime, setReadtime] = useState<string>('');

    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    useEffect(() => {
        const trimReadtime = () => {
            const now = new Date();
            const created = new Date(post.creationDate);
            const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);

            if (diffInMinutes < 60) {
                setReadtime(`${diffInMinutes} min ago`);
            } else if (diffInMinutes < 1440) {
                const hours = Math.floor(diffInMinutes / 60);
                setReadtime(`${hours} hour${hours > 1 ? 's' : ''} ago`);
            } else {
                const days = Math.floor(diffInMinutes / 1440);
                setReadtime(`${days} day${days > 1 ? 's' : ''} ago`);
            }
        };

        trimReadtime();
    }, [post.creationDate]);

    // rounded corner
    const getCategoryStyle = (category: string) => {
        const baseStyle = "text-xs font-medium px-3 py-1 rounded-md"; // Changed from rounded-full to rounded-md
        
        switch (category) {
            case 'System Notices':
                return `${baseStyle} bg-purple-500/10 text-purple-400 border border-purple-500/20`;
            case 'New Features':
                return `${baseStyle} bg-blue-500/10 text-blue-400 border border-blue-500/20`;
            case 'Events':
                return `${baseStyle} bg-yellow-500/10 text-yellow-400 border border-yellow-500/20`;
            case 'General Updates':
                return `${baseStyle} bg-teal-500/10 text-teal-400 border border-teal-500/20`;
            default:
                return `${baseStyle} bg-gray-500/10 text-gray-400 border border-gray-500/20`;
        }
    };

    return (
        <div
        
            key={post.id}
            className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 flex flex-col justify-between h-full tracking-wide space-y-4 transition-all duration-300 hover:translate-y-[-8px] hover:bg-gray-900/90 hover:shadow-2xl hover:shadow-teal-500/10 cursor-pointer group border border-gray-800/50 hover:border-teal-500/30 transform"
            >
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-md border border-teal-500/20 backdrop-blur-sm bg-white/5 text-white">
                {post.category}
                </span>
                <span className="text-xs text-gray-400">
                {formatDate(post.creationDate)}
                </span>
            </div>

            <h3 className="text-lg md:text-[22px] font-bold group-hover:text-teal-400 transition-colors duration-300">
                {post.title}
            </h3>
            
            <p className="text-gray-400 text-[19px] group-hover:text-gray-200 transition-colors duration-300">
                {post.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800 group-hover:border-gray-700 transition-colors duration-300">
                <span className="text-xs text-gray-400 transition-colors duration-300 group-hover:text-white">
                    {post.author}
                </span>
                <span className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-300">
                    {readtime}
                </span>
            </div>
        </div>
    );
};

export default Blog;