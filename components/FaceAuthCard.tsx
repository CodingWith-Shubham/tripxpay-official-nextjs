"use client";

import React from "react";
import { Scan, User, CheckCircle } from "lucide-react";

interface FaceAuth {
  status: "idle" | "capturing" | "processing" | "success" | "failed";
  attempts: number;
  image?: string;
}

interface FaceAuthCardProps {
  faceAuth: FaceAuth;
  onStartFaceAuth: () => void;
}

const FaceAuthCard: React.FC<FaceAuthCardProps> = ({
  faceAuth,
  onStartFaceAuth,
}) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-lg h-full">
      <div className="p-6">
        <h3 className="text-white flex items-center gap-2 text-lg font-semibold">
          <Scan className="w-5 h-5 text-yellow-400" />
          Face Authentication
        </h3>
        <p className="text-gray-400 text-sm">
          Complete face verification for enhanced security
        </p>
      </div>
      <div className="px-6 pb-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700">
            {faceAuth.status === "success" ? (
              <CheckCircle className="w-12 h-12 text-[#00ffb4]" />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>

          <div>
            <h3 className="font-medium text-white mb-2">
              {faceAuth.status === "success"
                ? "Face Verification Complete"
                : "Face Verification Required"}
            </h3>
            <p className="text-sm text-gray-400">
              {faceAuth.status === "success"
                ? "Your identity has been successfully verified"
                : "Position your face in the camera frame and capture"}
            </p>
          </div>

          {faceAuth.status !== "success" && (
            <div className="flex justify-center">
              <button
                onClick={onStartFaceAuth}
                disabled={
                  faceAuth.status === "capturing" ||
                  faceAuth.status === "processing"
                }
                className={`inline-flex items-center px-4 py-2 bg-[#00DCAC] text-gray-900 text-sm font-medium rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#00ffb4] focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  faceAuth.status === "capturing" ||
                  faceAuth.status === "processing"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                type="button"
              >
                {faceAuth.status === "capturing"
                  ? "Camera Active..."
                  : faceAuth.status === "processing"
                  ? "Processing..."
                  : "Start Face Verification"}
              </button>
            </div>
          )}

          {faceAuth.attempts > 0 && (
            <p className="text-xs text-gray-500">
              Attempts: {faceAuth.attempts}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceAuthCard;
