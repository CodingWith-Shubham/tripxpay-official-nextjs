"use client";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const handleback = () => router.back();
  return (
    <button
      onClick={handleback}
      className="inline-flex items-center text-teal-500 hover:text-teal-400 transition-colors mb-6"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to Home
    </button>
  );
};

export default BackButton;
