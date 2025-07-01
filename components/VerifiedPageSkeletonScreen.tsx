"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { ChevronRight } from "lucide-react";
import Footer from "./Footer";

const VerifiedPageSkeletonScreen: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-900">

        {/* Background gradients */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full filter blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-500/20 rounded-full filter blur-3xl" />
        </div>

        <main className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl font-bold text-center text-white mb-8">
              Dashboard
            </h1>

            {/* Content Skeleton */}
            <div className="space-y-6">
              {/* User Profile Section Skeleton */}
              <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-6 mb-6">
                  {/* Profile Picture Skeleton */}
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gray-800"
                    animate={{
                      backgroundPosition: ["0% 0", "200% 0"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      background:
                        "linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)",
                      backgroundSize: "200% 100%",
                    }}
                  />

                  {/* Profile Info Skeleton */}
                  <div className="flex-1 space-y-3">
                    <motion.div
                      className="h-8 w-48 bg-gray-800 rounded"
                      animate={{
                        backgroundPosition: ["0% 0", "200% 0"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        background:
                          "linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)",
                        backgroundSize: "200% 100%",
                      }}
                    />
                    <motion.div
                      className="h-4 w-32 bg-gray-800 rounded"
                      animate={{
                        backgroundPosition: ["0% 0", "200% 0"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        background:
                          "linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)",
                        backgroundSize: "200% 100%",
                      }}
                    />
                    <motion.div
                      className="h-4 w-24 bg-gray-800 rounded"
                      animate={{
                        backgroundPosition: ["0% 0", "200% 0"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        background:
                          "linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </div>

                  {/* Status Badge Skeleton */}
                  <motion.div
                    className="w-32 h-12 bg-gray-800 rounded-full ml-auto"
                    animate={{
                      backgroundPosition: ["0% 0", "200% 0"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      background:
                        "linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                </div>
              </div>

              {/* Document Verification Section Skeleton */}
              <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="w-full flex items-center justify-between text-left p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    {/* Icon Skeleton */}
                    <motion.div
                      className="w-6 h-6 bg-gray-800 rounded"
                      animate={{
                        backgroundPosition: ["0% 0", "200% 0"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        background:
                          "linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)",
                        backgroundSize: "200% 100%",
                      }}
                    />
                    {/* Text Skeleton */}
                    <motion.div
                      className="h-6 w-48 bg-gray-800 rounded"
                      animate={{
                        backgroundPosition: ["0% 0", "200% 0"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        background:
                          "linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </div>
                  {/* Chevron Icon */}
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </div>
              </div>

              {/* Verification Pending Status Card Skeleton */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 backdrop-blur-sm rounded-2xl p-8 text-center">
                {/* Clock Icon Skeleton */}
                <motion.div
                  className="w-16 h-16 bg-yellow-500/50 rounded-full mx-auto mb-4"
                  animate={{
                    backgroundPosition: ["0% 0", "200% 0"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)",
                    backgroundSize: "200% 100%",
                  }}
                />
                {/* Title Skeleton */}
                <motion.div
                  className="h-8 w-64 bg-yellow-500/50 rounded mx-auto mb-3"
                  animate={{
                    backgroundPosition: ["0% 0", "200% 0"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)",
                    backgroundSize: "200% 100%",
                  }}
                />
                {/* Description Skeleton */}
                <motion.div
                  className="h-6 w-full max-w-sm bg-yellow-500/50 rounded mx-auto"
                  animate={{
                    backgroundPosition: ["0% 0", "200% 0"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)",
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-4">
                <motion.div
                  className="flex-1 h-14 bg-gray-800 rounded-xl"
                  animate={{
                    backgroundPosition: ["0% 0", "200% 0"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)",
                    backgroundSize: "200% 100%",
                  }}
                />
                <motion.div
                  className="flex-1 h-14 bg-gray-800 rounded-xl"
                  animate={{
                    backgroundPosition: ["0% 0", "200% 0"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)",
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default VerifiedPageSkeletonScreen;
