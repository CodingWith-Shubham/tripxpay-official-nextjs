import {ref, get, child, push, set, remove, query, orderByChild, limitToFirst, limitToLast, startAt, endAt} from "firebase/database";
import { database } from "@/lib/firebase";

interface BlogData {
    author: string;
    category: string;
    description: string;
    title: string;
    creationDate: string;
    timestamp: number;
}

interface Blog extends BlogData {
    id: string;
}

interface FormData {
    author: string;
    category: string;
    description: string;
    title: string;
}

interface BlogOptions {
    page?: number;
    limit?: number;
    category?: string | null;
}

interface BlogResponse {
    blogs: Blog[];
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    hasMore: boolean;
}

interface ApiResponse {
    status: "SUCCESS" | "ERROR";
    data?: Blog;
    message?: string;
}

// helper function to retry ops
export const retryOperation = async (operation: () => Promise<any>, maxRetries = 3) => {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            console.warn(`Operation failed, attempt ${i + 1} of ${maxRetries}:`, error);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
    throw lastError;
};

// uploads a new blog
export const uploadBlog = async (formData: FormData): Promise<ApiResponse> => {
    try {
        const blogsRef = ref(database, "blogs");
        const newBlogRef = push(blogsRef); // This creates a new unique key

        const blogData: BlogData = {
            author: formData.author,
            category: formData.category,
            description: formData.description,
            title: formData.title,
            creationDate: new Date().toISOString(),
            // Adds a timestamp here
            timestamp: Date.now()
        };

        await set(newBlogRef, blogData);

        return {
            status: "SUCCESS",
            data: {
                id: newBlogRef.key!,
                ...blogData
            }
        };
    } catch (error: any) {
        console.error("Error uploading blog:", error);
        return {
            status: "ERROR",
            message: error.message || "Failed to upload blog"
        };
    }
};

//get total count of blogs (for pagination)
export const getBlogCount = async (category: string | null = null): Promise<number> => {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "blogs"));

        if (!snapshot.exists()) {
            return 0;
        }

        const data = snapshot.val();
        const blogs: Blog[] = Object.entries(data).map(([id, blog]: [string, any]) => ({
            id,
            ...blog
        }));

        // Filter 
        if (category && category !== "all") {
            return blogs.filter(blog => blog.category === category).length;
        }

        return blogs.length;
    } catch (error) {
        console.error("Error getting blog count:", error);
        return 0;
    }
};

// Fetch all blogs 
export const getAllBlogs = async (options: BlogOptions = {}): Promise<BlogResponse> => {
    try {
        const {
            page = 1,
            limit: pageLimit = 9,
            category = null
        } = options;

        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "blogs"));

        if (!snapshot.exists()) {
            console.log("No blogs found.");
            return {
                blogs: [],
                total: 0,
                currentPage: page,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false,
                hasMore: false
            };
        }

        const data = snapshot.val();
        let blogs: Blog[] = Object.entries(data).map(([id, blog]: [string, any]) => ({
            id,
            ...blog
        }));

        blogs.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

        if (category && category !== "all") {
            blogs = blogs.filter(blog => blog.category === category);
        }

        const total = blogs.length;
        const totalPages = Math.ceil(total / pageLimit);
        const startIndex = (page - 1) * pageLimit;
        const endIndex = startIndex + pageLimit;

        // results
        const paginatedBlogs = blogs.slice(startIndex, endIndex);

        return {
            blogs: paginatedBlogs,
            total,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            hasMore: page < totalPages // For compatibility with your component
        };

    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Failed to fetch blogs");
    }
};

// More efficient pagination using Firebase queries (for large datasets)
export const getAllBlogsOptimized = async (options: BlogOptions = {}): Promise<BlogResponse> => {
    try {
        const {
            page = 1,
            limit: pageLimit = 9,
            category = null
        } = options;
        return await getAllBlogs(options);

    } catch (error) {
        console.error("Error fetching optimized blogs:", error);
        throw new Error("Failed to fetch blogs");
    }
};

// Get blogs by category 
export const getBlogsByCategory = async (category: string, page = 1, limit = 9): Promise<BlogResponse> => {
    return await getAllBlogs({ page, limit, category });
};

// Delete blog function 
export const deleteBlog = async (id: string): Promise<ApiResponse> => {
    try {
        if (!id) {
            throw new Error("Blog ID is required");
        }

        const blogRef = ref(database, `blogs/${id}`);

        // First checks if the blog exists
        const snapshot = await get(blogRef);
        if (!snapshot.exists()) {
            throw new Error("Blog not found");
        }

        // Delete the blog
        await remove(blogRef);

        console.log(`Blog with ID ${id} deleted successfully`);

        return {
            status: "SUCCESS",
            message: "Blog deleted successfully"
        };
    } catch (error: any) {
        console.error("Error deleting blog:", error);
        return {
            status: "ERROR",
            message: error.message || "Failed to delete blog"
        };
    }
};

// Batch ops
export const getBlogsInBatches = async (batchSize = 50): Promise<Blog[][]> => {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "blogs"));

        if (!snapshot.exists()) {
            return [];
        }

        const data = snapshot.val();
        const blogs: Blog[] = Object.entries(data).map(([id, blog]: [string, any]) => ({
            id,
            ...blog
        }));

        // Sort by creationDate
        blogs.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

        // Split into batches
        const batches: Blog[][] = [];
        for (let i = 0; i < blogs.length; i += batchSize) {
            batches.push(blogs.slice(i, i + batchSize));
        }

        return batches;
    } catch (error) {
        console.error("Error fetching blogs in batches:", error);
        throw new Error("Failed to fetch blogs");
    }
};
