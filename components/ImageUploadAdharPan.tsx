"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

type ImageUploadAdharPanProps = {
  type: "pan" | "aadhaar";
  status: "pending" | "uploaded" | "verified";
  onFileUpload?: (
    type: "pan" | "aadhaar",
    file: File | null,
    imageData: string | null
  ) => void;
};

const ImageUploadAdharPan: React.FC<ImageUploadAdharPanProps> = ({
  type,
  status,
  onFileUpload = () => {},
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Load image from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem(`doc_${type}`);
    if (savedImage) {
      setPreview(savedImage);
      // Only call onFileUpload if status is still pending
      if (status === "pending" && onFileUpload) {
        onFileUpload(type, null, savedImage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const validateFile = useCallback((file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!file) {
      setError("No file selected");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image file (PNG, JPG, JPEG)");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size should be less than 5MB");
      return false;
    }

    if (file.size < 1024) {
      setError("File is too small. Please upload a valid document image");
      return false;
    }

    setError("");
    return true;
  }, []);

  const handleFileUpload = useCallback(
    (file: File) => {
      if (!validateFile(file)) {
        return;
      }

      setIsUploading(true);
      setError("");

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const imageData = e.target?.result as string;
          if (!imageData) {
            throw new Error("Failed to read file data");
          }

          // Validate the image data
          if (!imageData.startsWith("data:image/")) {
            throw new Error("Invalid image format");
          }

          // Save to localStorage
          localStorage.setItem(`doc_${type}`, imageData);
          setPreview(imageData);

          // Call parent handler
          if (onFileUpload) {
            onFileUpload(type, file, imageData);
          }
        } catch (error) {
          setError("Error processing file. Please try again.");
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setError("Error reading file. Please try again.");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    },
    [type, onFileUpload, validateFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
      // Reset the input value to allow selecting the same file again
      if (e.target) {
        e.target.value = "";
      }
    },
    [handleFileUpload]
  );

  const clearUpload = useCallback(() => {
    localStorage.removeItem(`doc_${type}`);
    setPreview(null);
    setError("");
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Notify parent that file was removed
    if (onFileUpload) {
      onFileUpload(type, null, null);
    }
  }, [type, onFileUpload]);

  const triggerFileSelect = useCallback(() => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  }, [isUploading]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  const documentName = type === "pan" ? "PAN Card" : "Aadhaar Card";
  const hasUpload = status === "uploaded" || status === "verified" || preview;

  return (
    <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-lg h-full">
      <div className="p-6">
        <div className="text-white flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-400" />
            {documentName}
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === "verified"
                ? "bg-[#00ffb4] text-gray-900"
                : status === "uploaded"
                ? "bg-yellow-400 text-gray-900"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {status === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
            {status === "uploaded" && <AlertCircle className="w-3 h-3 mr-1" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Upload your {documentName.toLowerCase()} for verification
        </p>
      </div>

      <div className="px-6 pb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
            error
              ? "border-red-500/50 bg-red-500/5"
              : hasUpload
              ? "border-[#00ffb4]/50 bg-[#00ffb4]/5"
              : "border-gray-700 hover:border-[#00ffb4]/50"
          }`}
        >
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Upload Success State */}
          {hasUpload && preview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt={`${type} preview`}
                  className="max-h-32 max-w-full mx-auto rounded-lg shadow-lg"
                  onError={() => {
                    setError("Failed to load image preview");
                    setPreview(null);
                  }}
                />
                <button
                  onClick={clearUpload}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  title="Remove document"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-[#00ffb4] font-medium">
                  Document uploaded successfully
                </p>
                <button
                  onClick={triggerFileSelect}
                  disabled={isUploading}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all duration-300 ${
                    isUploading
                      ? "border-gray-600 text-gray-400 cursor-not-allowed"
                      : "border-[#00ffb4]/30 text-[#00ffb4] hover:bg-[#00ffb4]/10 hover:border-[#00ffb4]/50"
                  }`}
                  type="button"
                >
                  {isUploading ? "Processing..." : "Replace Document"}
                </button>
              </div>
            </div>
          ) : (
            /* Upload Prompt State */
            <div className="space-y-4">
              <div
                className={`transition-all duration-300 ${
                  isUploading ? "animate-pulse" : ""
                }`}
              >
                <Upload
                  className={`w-12 h-12 mx-auto mb-3 ${
                    isUploading ? "text-[#00ffb4]" : "text-gray-400"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <p className="text-gray-300 font-medium">
                  {isUploading ? "Processing..." : `Upload ${documentName}`}
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={triggerFileSelect}
                  disabled={isUploading}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isUploading
                      ? "bg-[#02E8A6]/60 text-gray-900 opacity-70 cursor-not-allowed"
                      : "bg-[#00ffb4] hover:bg-[#00ffb4]/90 text-gray-900 hover:scale-105"
                  }`}
                  type="button"
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin mr-2"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#02E8A6"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          d="M4 12a8 8 0 018-8"
                          stroke="#02E8A6"
                          strokeWidth="4"
                          strokeLinecap="round"
                          className="opacity-75"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Choose File"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploadAdharPan;
