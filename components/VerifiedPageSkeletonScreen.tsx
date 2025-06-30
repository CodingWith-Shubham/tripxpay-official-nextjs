"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { ChevronRight } from "lucide-react";
import Footer from "./Footer";

const shimmerBackground =
  "linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)";

const shimmerAnimate = {
  backgroundPosition: ["-200% 0", "200% 0"],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "linear" as const,
  },
};

const VerifiedPageSkeletonScreen: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-900">

        {/* Background gradients */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl" />
        </div>

        <main className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-white mb-8">Dashboard</h1>

            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-6 mb-6">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gray-800"
                    animate={shimmerAnimate}
                    style={{
                      background: shimmerBackground,
                      backgroundSize: "200% 100%",
                    }}
                  />
                  <div className="flex-1 space-y-3">
                    <motion.div
                      className="h-8 w-48 bg-gray-800 rounded"
                      animate={shimmerAnimate}
                      style={{
                        background: shimmerBackground,
                        backgroundSize: "200% 100%",
                      }}
                    />
                    <motion.div
                      className="h-4 w-32 bg-gray-800 rounded"
                      animate={shimmerAnimate}
                      style={{
                        background: shimmerBackground,
                        backgroundSize: "200% 100%",
                      }}
                    />
                    <motion.div
                      className="h-4 w-24 bg-gray-800 rounded"
                      animate={shimmerAnimate}
                      style={{
                        background: shimmerBackground,
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </div>
                  <motion.div
                    className="w-32 h-12 bg-gray-800 rounded-full ml-auto"
                    animate={shimmerAnimate}
                    style={{
                      background: shimmerBackground,
                      backgroundSize: "200% 100%",
                    }}
                  />
                </div>
              </div>

              {/* Document Section */}
              <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="w-full flex items-center justify-between p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-6 h-6 bg-gray-800 rounded"
                      animate={shimmerAnimate}
                      style={{
                        background: shimmerBackground,
                        backgroundSize: "200% 100%",
                      }}
                    />
                    <motion.div
                      className="h-6 w-48 bg-gray-800 rounded"
                      animate={shimmerAnimate}
                      style={{
                        background: shimmerBackground,
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </div>
              </div>

              {/* Verification Pending */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 backdrop-blur-sm rounded-2xl p-8 text-center">
                <motion.div
                  className="w-16 h-16 bg-yellow-500/50 rounded-full mx-auto mb-4"
                  animate={shimmerAnimate}
                  style={{
                    background: shimmerBackground,
                    backgroundSize: "200% 100%",
                  }}
                />
                <motion.div
                  className="h-8 w-64 bg-yellow-500/50 rounded mx-auto mb-3"
                  animate={shimmerAnimate}
                  style={{
                    background: shimmerBackground,
                    backgroundSize: "200% 100%",
                  }}
                />
                <motion.div
                  className="h-6 w-full max-w-sm bg-yellow-500/50 rounded mx-auto"
                  animate={shimmerAnimate}
                  style={{
                    background: shimmerBackground,
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <motion.div
                  className="flex-1 h-14 bg-gray-800 rounded-xl"
                  animate={shimmerAnimate}
                  style={{
                    background: shimmerBackground,
                    backgroundSize: "200% 100%",
                  }}
                />
                <motion.div
                  className="flex-1 h-14 bg-gray-800 rounded-xl"
                  animate={shimmerAnimate}
                  style={{
                    background: shimmerBackground,
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
