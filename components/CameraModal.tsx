"use client";

import React, { RefObject } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface FaceAuth {
  status: "idle" | "capturing" | "processing" | "success" | "failed";
  attempts: number;
  image?: string;
}

interface CameraModalProps {
  showCamera: boolean;
  onClose: () => void;
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  faceAuth: FaceAuth;
  onCapture: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({
  showCamera,
  onClose,
  videoRef,
  canvasRef,
  faceAuth,
  onCapture,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            Face Verification
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#00ffb4] focus:ring-offset-2 focus:ring-offset-gray-900"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="absolute inset-0 border-2 border-[#00ffb4] rounded-lg pointer-events-none">
              <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[#00ffb4]"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-[#00ffb4]"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-[#00ffb4]"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-[#00ffb4]"></div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">
              Position your face within the frame and click capture
            </p>
            <button
              onClick={onCapture}
              disabled={faceAuth.status === "processing"}
              className={`inline-flex items-center px-4 py-2 bg-gradient-to-r bg-[#00DCAC]  text-gray-900 text-sm font-medium rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#00ffb4] focus:ring-offset-2 focus:ring-offset-gray-900 ${
                faceAuth.status === "processing"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              type="button"
            >
              {faceAuth.status === "processing" ? "Processing..." : "Capture"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CameraModal;
