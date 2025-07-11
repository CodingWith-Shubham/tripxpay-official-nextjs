"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Award,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  FileText,
  Shield,
  Image,
  CalendarDays,
  DollarSign,
  X,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar"; // Assuming you have a Navbar component
import Footer from "@/components/Footer"; // Assuming you have a Footer component
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// Add this interface at the top of the file
interface UserInfo {
  email?: string;
  isEmailVerified?: boolean;
  photoUrl?: string;
  displayName?: string;
  profession?: string;
  status?: string;
  isVerified?: boolean;
  phoneNumber?: string;
  address?: string;
  companyName?: string;
  fatherName?: string;
  submittedAt?: any;
  approvedAt?: any;
  creditedAmount?: number;
  merchantRel?: string;
  uid?: string;
  documents?: {
    pan?: { downloadURL?: string; uploadedAt?: any };
    aadhaar?: { downloadURL?: string; uploadedAt?: any };
  };
  faceAuth?: { downloadURL?: string; uploadedAt?: any; uploaded?: boolean };
}

// Add interface for selectedImage
interface SelectedImage {
  url: string;
  uploadTime: any;
}

// Skeleton Loading Component - YouTube/Instagram style
const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-10 lg:p-12 border border-gray-700">
          {/* Header Section Skeleton */}
          <div className="text-center mb-10 border-b border-gray-700 pb-8">
            {/* Profile Image Skeleton */}
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-600 shadow-lg mb-4 animate-pulse">
              <div className="w-full h-full bg-gray-700 animate-pulse"></div>
            </div>

            {/* Name Skeleton */}
            <div className="h-12 bg-gray-700 rounded-lg mb-2 animate-pulse max-w-xs mx-auto"></div>

            {/* Profession Skeleton */}
            <div className="h-6 bg-gray-700 rounded-lg mb-4 animate-pulse max-w-sm mx-auto"></div>

            {/* Status Badge Skeleton */}
            <div className="h-8 bg-gray-700 rounded-full animate-pulse max-w-32 mx-auto"></div>
          </div>

          {/* Personal Information Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-gray-700 pb-8">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Section Title */}
              <div className="h-8 bg-gray-700 rounded-lg animate-pulse max-w-48"></div>

              {/* Info Items */}
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse flex-1"></div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Section Title */}
              <div className="h-8 bg-gray-700 rounded-lg animate-pulse max-w-48"></div>

              {/* Info Items */}
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse flex-1"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Verification Skeleton */}
          <div className="mb-10 border-b border-gray-700 pb-8">
            {/* Section Title */}
            <div className="h-8 bg-gray-700 rounded-lg animate-pulse max-w-64 mb-6"></div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md"
                >
                  {/* Document Title */}
                  <div className="h-6 bg-gray-700 rounded animate-pulse mb-3 max-w-32"></div>

                  {/* Document Image Placeholder */}
                  <div className="w-full h-40 bg-gray-700 rounded-md mb-2 animate-pulse"></div>

                  {/* Upload Status */}
                  <div className="h-4 bg-gray-700 rounded animate-pulse max-w-40"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Enhanced Loading Spinner (keeping for fallback)
const LoadingSpinner = ({
  size = "medium",
  text = "",
}: {
  size?: "small" | "medium" | "large" | "xlarge";
  text?: string;
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
    xlarge: "w-12 h-12",
  } as const;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-2 border-gray-600 border-t-[#00FFB4] rounded-full animate-spin`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-[#00FFB4] rounded-full animate-pulse" />
        </div>
      </div>
      {text && <p className="text-sm text-gray-400 font-medium">{text}</p>}
    </div>
  );
};

const MerchantUser = () => {
  const { uid } = useParams();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [scale, setScale] = useState(1);

  const fetchMerchantInfo = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/getuserdata?uid=${uid}`, {
        method: "POST",
      });
      const { data } = await response.json();
      setUserInfo(data);
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError("Failed to fetch user information. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    fetchMerchantInfo();
  }, [fetchMerchantInfo]);

  const formatDate = (
    timestamp: string | number | Date | null | undefined
  ): string => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  };

  const handleImageClick = (imageUrl: string, uploadTime: any) => {
    setSelectedImage({ url: imageUrl, uploadTime });
    setScale(1);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setScale(1);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  // Keyboard and wheel event handlers
  useEffect(() => {
    const handleEscape = (e: any) => {
      if (e.key === "Escape") {
        handleCloseImage();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const handleWheelEvent = (e: any) => {
        if (e.ctrlKey) {
          e.preventDefault();
          const delta = e.deltaY;
          if (delta < 0) {
            setScale((prev) => Math.min(prev + 0.1, 3));
          } else {
            setScale((prev) => Math.max(prev - 0.1, 0.5));
          }
        }
      };

      window.addEventListener("wheel", handleWheelEvent, { passive: false });
    }
  }, [selectedImage]);

  // Show skeleton loader instead of spinner
  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
          <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </>
    );
  }

  if (!userInfo) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-gray-400 text-lg">No merchant data found.</div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Enhanced Background Effects - Copied from VerificationDashboard.jsx */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-500/20 rounded-full filter blur-3xl animate-pulse delay-500" />

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#00FFB4]/30 rounded-full animate-bounce delay-300" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-yellow-400/40 rounded-full animate-bounce delay-700" />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-bounce delay-1000" />
      </div>
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 my-2  bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go Back
        </button>
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-10 lg:p-12 border border-[#F9AE04]">
          {/* Header Section */}
          <div className="text-center mb-10 border-b border-[#1C2634] pb-8">
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#00FFB4] shadow-lg mb-4">
              <img
                src={userInfo.photoUrl || "/logo.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/logo.svg";
                }}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
              {userInfo.displayName || "N/A"}
            </h1>
            <p className="text-lg text-gray-400 mb-4">
              {userInfo.profession || "N/A"}
            </p>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold
                ${
                  userInfo.status?.toLowerCase() === "pending"
                    ? "bg-yellow-900/20 text-yellow-400 border border-yellow-500/30"
                    : userInfo.isVerified
                    ? "bg-[#00FFB4]/20 text-[#00FFB4] border border-[#00FFB4]/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }
              `}
            >
              {userInfo.status?.toLowerCase() === "pending" ? (
                <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
              ) : userInfo.isVerified ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span>Status: {userInfo.status || "N/A"}</span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-[#1C2634] pb-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[#00FFB4]" /> Personal
                Information
              </h2>
              <p className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-gray-500" />
                Email: {userInfo.email || "N/A"}
                {userInfo.isEmailVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00FFB4]" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </p>
              <p className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-gray-500" />
                Phone: {userInfo.phoneNumber || "N/A"}
              </p>
              <p className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-gray-500" />
                Address: {userInfo.address || "N/A"}
              </p>
              <p className="flex items-center gap-3 text-gray-300">
                <Briefcase className="w-5 h-5 text-gray-500" />
                Company Name: {userInfo.companyName || "N/A"}
              </p>
              <p className="flex items-center gap-3 text-gray-300">
                <Users className="w-5 h-5 text-gray-500" />
                Father's Name: {userInfo.fatherName || "N/A"}
              </p>
            </div>

            {/* Verification Status & Timestamps */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#00FFB4]" /> Verification
                Overview
              </h2>
              <div className="space-y-2">
                <p className="flex items-center gap-3 text-gray-300">
                  <CalendarDays className="w-5 h-5 text-gray-500" />
                  Submitted At: {formatDate(userInfo.submittedAt)}
                </p>
                <p className="flex items-center gap-3 text-gray-300">
                  <CalendarDays className="w-5 h-5 text-gray-500" />
                  Approved At: {formatDate(userInfo.approvedAt)}
                </p>
                <p className="flex items-center gap-3 text-gray-300">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  Credited Amount: ₹
                  {userInfo.creditedAmount !== undefined
                    ? userInfo.creditedAmount
                    : "N/A"}
                </p>
                <p className="flex items-center gap-3 text-gray-300">
                  <Award className="w-5 h-5 text-gray-500" />
                  Merchant Relation ID: {userInfo.merchantRel || "N/A"}
                </p>
                <p className="flex items-center gap-3 text-gray-300">
                  <Award className="w-5 h-5 text-gray-500" />
                  User ID (UID): {userInfo.uid || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Document Verification */}
          <div className="mb-10 border-b border-[#1C2634] pb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-[#00FFB4]" /> Document
              Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* PAN Card */}
              <div className="bg-gray-800 border border-[#0193BF] rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" /> PAN Card
                </h3>
                {userInfo.documents?.pan?.downloadURL ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() =>
                        handleImageClick(
                          userInfo.documents?.pan?.downloadURL?.replace(
                            /"/g,
                            ""
                          ) || "",
                          userInfo.documents?.pan?.uploadedAt
                        )
                      }
                    >
                      <img
                        src={userInfo.documents?.pan?.downloadURL?.replace(
                          /"/g,
                          ""
                        )}
                        alt="PAN Card"
                        className="w-full h-auto rounded-md mb-2 object-cover max-h-40 hover:opacity-80 transition-opacity"
                      />
                    </motion.div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00FFB4]" />
                      Uploaded:{" "}
                      {formatDate(userInfo.documents?.pan?.uploadedAt)}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" /> Not Uploaded
                  </p>
                )}
              </div>

              {/* Aadhaar Card */}
              <div className="bg-gray-800 border border-[#0193BF] rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" /> Aadhaar Card
                </h3>
                {userInfo.documents?.aadhaar?.downloadURL ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() =>
                        handleImageClick(
                          userInfo.documents?.aadhaar?.downloadURL?.replace(
                            /"/g,
                            ""
                          ) || "",
                          userInfo.documents?.aadhaar?.uploadedAt
                        )
                      }
                    >
                      <img
                        src={userInfo.documents?.aadhaar?.downloadURL?.replace(
                          /"/g,
                          ""
                        )}
                        alt="Aadhaar Card"
                        className="w-full h-auto rounded-md mb-2 object-cover max-h-40 hover:opacity-80 transition-opacity"
                      />
                    </motion.div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00FFB4]" />
                      Uploaded:{" "}
                      {formatDate(userInfo.documents?.aadhaar?.uploadedAt)}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" /> Not Uploaded
                  </p>
                )}
              </div>

              {/* Face Authentication */}
              <div className="bg-gray-800 border border-[#0193BF] rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Image className="w-5 h-5 text-green-400" /> Face
                  Authentication
                </h3>
                {userInfo.faceAuth?.downloadURL &&
                userInfo.faceAuth.uploaded ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() =>
                        handleImageClick(
                          userInfo.faceAuth?.downloadURL?.replace(/"/g, "") ||
                            "",
                          userInfo.faceAuth?.uploadedAt
                        )
                      }
                    >
                      <img
                        src={userInfo.faceAuth?.downloadURL?.replace(/"/g, "")}
                        alt="Face Auth"
                        className="w-full h-auto rounded-md mb-2 object-cover max-h-40 hover:opacity-80 transition-opacity"
                      />
                    </motion.div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00FFB4]" />
                      Verified: {formatDate(userInfo.faceAuth?.uploadedAt)}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" /> Not Verified
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {/* Image Popup Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={handleCloseImage}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Upload Time Info - Top center */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-800/80 text-white px-4 py-2 rounded-full text-sm">
                Uploaded: {formatDate(selectedImage.uploadTime)}
              </div>

              {/* Zoom Level Indicator - Bottom left */}
              <div className="absolute bottom-4 left-4 z-10 bg-gray-800/80 text-white px-3 py-1 rounded-full text-sm">
                {Math.round(scale * 100)}%
              </div>

              {/* Image Container */}
              <motion.div
                className="relative w-full aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden"
                style={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img
                  src={selectedImage?.url}
                  alt="Document preview"
                  className="w-full h-full object-contain select-none"
                  draggable="false"
                />
              </motion.div>

              {/* Main controls container - Bottom center */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleZoomIn}
                    className="bg-gray-800/80 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                  >
                    <ZoomIn className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleZoomOut}
                    className="bg-gray-800/80 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                  >
                    <ZoomOut className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseImage}
                  className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5 inline mr-2" />
                  Close
                </motion.button>
              </div>

              {/* Desktop Zoom Hint */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-gray-800/80 text-white px-4 py-2 rounded-full text-sm hidden md:block">
                Hold Ctrl + Scroll to zoom
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MerchantUser;
