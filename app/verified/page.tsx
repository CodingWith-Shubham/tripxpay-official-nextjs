"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/Auth";
import {
  Check,
  X,
  Clock,
  Mail,
  AlertCircle,
  XCircle,
  ChevronRight,
  User,
  FileText,
  Camera,
  Shield,
  CreditCard,
  ZoomIn,
  ZoomOut,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import VerifiedPageSkeletonScreen from "@/components/VerifiedPageSkeletonScreen";
import PaymentBtn from "@/components/PaymentBtn";
import Footer from "@/components/Footer";
import TypewriterEffect from "@/components/TypewriterEffect";

// TypeScript interfaces
interface UserData {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoUrl?: string;
  status: "pending" | "approved" | "rejected";
  isVerified: boolean;
  creditedAmount: number;
  merchantRel?: string;
  documents?: {
    aadhaar?: {
      downloadURL: string;
    };
    pan?: {
      downloadURL: string;
    };
  };
  faceAuth?: {
    downloadURL: string;
  };
}

interface MerchantData {
  merchantId: string;
  id: string;
  companyName: string;
  displayName: string;
  photoUrl?: string;
  address?: string;
  phoneNumber: string;
}

interface Transaction {
  id: string;
  type: "credit_push" | "credit_pull";
  description?: string;
  timestamp: string;
  paidAmount?: number;
  creditedAmount?: number;
  amount?: number;
  date?: string;
}

interface ExpandedSections {
  [key: string]: boolean;
}

const Verified: React.FC = () => {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState<UserData[]>([]);
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>(
    {}
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [recommendedMerchants, setRecommendedMerchants] = useState<
    MerchantData[]
  >([]);
  const [showRecommendations, setShowRecommendations] =
    useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [hasUserBackendProfile, setHasUserBackendProfile] =
    useState<boolean>(false);
  const addressRef = useRef<HTMLSpanElement>(null);
  const [isAddressOverflowing, setIsAddressOverflowing] =
    useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const userId = currentUser?.uid;

  // Carousel settings
  const carouselSpeed = 3000; // 3 seconds per slide
  const mobilePauseDuration = 5000; // 5 seconds pause on mobile

  // Start the carousel
  const startCarousel = (): void => {
    if (recommendedMerchants.length <= 1) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) =>
        prev === recommendedMerchants.length - 1 ? 0 : prev + 1
      );
    }, carouselSpeed);
  };

  // Stop the carousel
  const stopCarousel = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Handle mobile touch
  const handleTouchStart = (): void => {
    stopCarousel();
    setTimeout(startCarousel, mobilePauseDuration);
  };

  useEffect(() => {
    if (showRecommendations && recommendedMerchants.length > 0) {
      startCarousel();
    }
    return () => stopCarousel();
  }, [showRecommendations, recommendedMerchants]);

  useEffect(() => {
    if (currentUser?.uid) {
      fetchUserDetails();
    } else {
      setLoading(false);
      setError("Please login to view verification status.");
      setUserData([]);
      setHasUserBackendProfile(false);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        handleCloseImage();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const handleWheelEvent = (e: WheelEvent): void => {
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

  useEffect(() => {
    if (addressRef.current) {
      const checkOverflow = (): void => {
        if (addressRef.current) {
          setIsAddressOverflowing(
            addressRef.current.scrollWidth > addressRef.current.clientWidth
          );
        }
      };
      checkOverflow();
      window.addEventListener("resize", checkOverflow);
      window.removeEventListener("resize", checkOverflow);
    }
  }, [recommendedMerchants, activeIndex]);

  const fetchTransaction = async () => {
    try {
      const { data } = await fetch(`/api/transaction?uid=${userId}`, {
        method: "POST",
      }).then((res) => res.json());
      setTransactions(data);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const getVerificationStatus = (
    user: UserData
  ): "unknown" | "pending" | "verified" | "rejected" => {
    if (!user) return "unknown";
    if (user.status === "pending" && user.isVerified === false)
      return "pending";
    if (user.status === "approved" && user.isVerified === true)
      return "verified";
    if (user.status === "rejected" && user.isVerified === false)
      return "rejected";
    return "unknown";
  };

  const getStatusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case "verified":
        return <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "verified":
        return "Your verification has been approved!";
      case "rejected":
        return "Your verification was rejected.";
      case "pending":
        return "Your verification is pending review.";
      default:
        return "Verification status : Not Verified";
    }
  };

  const formatDate = (
    timestamp: string | number | Date | null | undefined
  ): string => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleSection = (section: string): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const userProfile = userData[0];
  const currentStatus = userProfile
    ? getVerificationStatus(userProfile)
    : "unknown";

  useEffect(() => {
    if (userProfile?.merchantRel) {
      const fetchMerchant = async (): Promise<void> => {
        try {
          const response = await fetch(
            `/api/fetchbymerchantdata?merchantid=${userProfile.merchantRel}`,
            { method: "POST" }
          );
          const { data } = await response.json();
          setMerchantData(data);
        } catch (error) {
          console.error("Error fetching merchant data:", error);
        }
      };
      fetchMerchant();
    }
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile?.merchantRel && hasUserBackendProfile) {
      const fetchRecommendations = async (): Promise<void> => {
        const response = await fetch(`/api/merchantrecommendation?limit=${5}`, {
          method: "POST",
        });
        const { merchants } = await response.json();
        console.log("Fetched merchants:", merchants);
        setRecommendedMerchants(Array.isArray(merchants) ? merchants : []);
        setShowRecommendations(true);
      };
      fetchRecommendations();
    }
  }, [userProfile, hasUserBackendProfile]);

  const handleLogoutAndDeleteData = async (): Promise<void> => {
    try {
      setIsDeleting(true);

      if (currentUser?.uid) {
        const response = await fetch(
          `/api/deleteuserinfo?uid=${currentUser.uid}`,
          { method: "DELETE" }
        );

        const result = await response.json();

        if (result.success) {
          localStorage.removeItem(`verification_status_${currentUser.uid}`);
          localStorage.removeItem("doc_pan");
          localStorage.removeItem("doc_aadhaar");

          await logout();
          console.log("User data and localStorage items deleted successfully");
        } else {
          console.error("Failed to delete user data:", result.error);
        }
      }

      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } catch (error) {
      console.error("Logout failed:", (error as Error).message);
      router.replace("/");
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchUserDetails = async (): Promise<void> => {
    if (!currentUser?.uid) {
      console.error("currentUser or UID is not available.");
      setError("Authentication required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasUserBackendProfile(false);

      const result = await fetch(`/api/getuserdata?uid=${currentUser?.uid}`, {
        method: "POST",
      });
      const { data } = await result.json();

      if (data && Object.keys(data).length > 0) {
        setUserData([data as UserData]);
        setHasUserBackendProfile(true);
      } else {
        setUserData([]);
        setHasUserBackendProfile(false);
        console.warn(
          "No meaningful user data found in database. User needs to re-initiate verification."
        );
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch user details: " + (error as Error).message);
      setUserData([]);
      setHasUserBackendProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReapply = (): void => {
    if (currentUser?.uid) {
      localStorage.removeItem(`verification_data_${currentUser.uid}`);
      localStorage.removeItem(`verification_status_${currentUser.uid}`);
      localStorage.removeItem("doc_pan");
      localStorage.removeItem("doc_aadhaar");
      localStorage.removeItem("doc_faceAuth");
      localStorage.removeItem("verification_step");
      localStorage.removeItem("verification_progress");
    }

    toast.success("Starting new verification process...", {
      position: "top-right",
    });

    router.replace("/verificationdashboard");
  };

  const handleImageClick = (imageUrl: string): void => {
    setSelectedImage(imageUrl);
    setScale(1);
  };

  const handleCloseImage = (): void => {
    setSelectedImage(null);
    setScale(1);
  };

  const handleZoomIn = (): void => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (): void => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleWheel = (e: React.WheelEvent): void => {
    e.preventDefault();
    const delta = e.deltaY;
    if (delta < 0) {
      setScale((prev) => Math.min(prev + 0.1, 3));
    } else {
      setScale((prev) => Math.max(prev - 0.1, 0.5));
    }
  };

  const handleConnectionRequest = async (merchantId: string): Promise<void> => {
    try {
      setLoading(true);
      const responseconnection = fetch(`/api/sendrequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantId,
          userId: currentUser!.uid,
          userdata: {
            displayName: userProfile!.displayName,
            email: userProfile!.email,
            phoneNumber: userProfile!.phoneNumber,
          },
        }),
      });
      toast.promise(responseconnection, {
        loading: "sending connection request",
        error: "connection request failed",
        success: "connection request sent!",
        position: "top-right",
      });
      const response = await responseconnection;
      const success = await response.json();
      if (success.success) {
        setShowRecommendations(false);
      } else {
        toast.error("Failed to send request", { position: "top-right" });
      }
    } catch (error) {
      console.error("Connection request error:", error);
      toast.error("Error sending request", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTransaction();
  }, [userId, userProfile]);

  if (loading) {
    return <VerifiedPageSkeletonScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full filter blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-500/20 rounded-full filter blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-400">{error}</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-500/20 rounded-full filter blur-3xl" />
      </div>

      <main className="relative z-10 py-6 sm:py-8 md:py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-6 md:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TypewriterEffect
              key={userProfile?.displayName || "default"}
              texts={["Welcome", userProfile?.displayName || "User"]}
              className="inline-block"
            />
          </motion.h1>

          {merchantData && (
            <motion.div
              className="bg-gray-900/50 border border-gray-800 mb-4 sm:mb-5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-base sm:text-lg md:text-xl ml-20 font-semibold text-[#FAB609] mb-3 md:mb-4">
                Merchant Information
              </h3>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-6">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#5EEAD4] flex-shrink-0">
                  <img
                    src={merchantData.photoUrl || "/logo.svg"}
                    alt={merchantData.companyName || "Merchant"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/default-merchant.png";
                    }}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-white">
                    {merchantData.companyName}
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm md:text-base">
                    {merchantData.displayName}
                  </p>
                  <div className="mt-2 text-xs sm:text-sm text-gray-400">
                    <p>Merchant ID: {merchantData.id}</p>
                    {merchantData.address && (
                      <p className="mt-1 break-words">{merchantData.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {
            // Merchant Recommendations Carousel
            showRecommendations && recommendedMerchants.length > 0 && (
              <motion.div
                className="bg-gray-900/50 border mb-4 sm:mb-5 border-gray-800 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#00ffb4]" />
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                    Recommended Merchants
                  </h3>
                </div>

                <div
                  className="relative overflow-hidden"
                  onMouseEnter={() => {
                    setIsHovered(true);
                    stopCarousel();
                  }}
                  onMouseLeave={() => {
                    setIsHovered(false);
                    startCarousel();
                  }}
                  onTouchStart={handleTouchStart}
                  ref={carouselRef}
                >
                  {/* Adjusted height for better mobile responsiveness */}
                  <div className="relative h-90 sm:h-68 md:h-68 lg:h-60 w-full">
                    {recommendedMerchants.map((merchant, index) => (
                      <motion.div
                        key={merchant.id || `merchant-${index}`}
                        className={`absolute inset-0 w-full h-full p-1 sm:p-2 ${
                          index === activeIndex ? "z-10" : "z-0"
                        }`}
                        initial={{ opacity: 0, x: index === 0 ? 0 : 300 }}
                        animate={{
                          opacity: index === activeIndex ? 1 : 0.3,
                          x:
                            index === activeIndex
                              ? 0
                              : index < activeIndex
                              ? -300
                              : 300,
                          scale: index === activeIndex ? 1 : 0.9,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <div className="bg-gray-800/80 backdrop-blur-lg overflow-hidden rounded-lg border border-gray-700 h-full w-full p-4 sm:p-4 md:p-6 flex flex-col">
                          {/* Mobile-first layout adjustments */}
                          <div className="flex flex-col items-center gap-4 mb-4 sm:flex-row sm:items-start sm:gap-5 md:gap-6 sm:mb-4">
                            <motion.div
                              className="relative w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-[#5EEAD4] shadow-lg flex-shrink-0"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Image
                                width={500}
                                height={500}
                                src={merchant.photoUrl || "/logo.svg"}
                                alt={merchant.companyName}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                            
                            <div className="flex-1 text-center sm:text-left w-full">
                              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-2 line-clamp-1">
                                {merchant.companyName}
                              </h4>
                              
                              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-sm md:text-base text-gray-400 mb-3 sm:mb-3">
                                <User className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="break-all line-clamp-1">
                                  {merchant.displayName}
                                </span>
                              </div>
                              
                              {/* Better spacing and layout for contact info */}
                              <div className="text-sm sm:text-sm text-gray-400 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-center sm:justify-start gap-1 sm:gap-2">
                                  <span className="font-medium text-gray-200 flex-shrink-0">
                                    Address:
                                  </span>
                                  <span className="break-words line-clamp-2 text-center sm:text-left">
                                    {merchant.address}
                                  </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-1 sm:gap-2">
                                  <span className="font-medium text-gray-200 flex-shrink-0">
                                    Phone:
                                  </span>
                                  <span className="break-all text-center sm:text-left">
                                    {merchant.phoneNumber}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Button positioned at bottom with better mobile sizing */}
                          <div className="mt-auto">
                            <button
                              onClick={() => handleConnectionRequest(merchant.id)}
                              disabled={loading}
                              className="w-full px-4 py-1 sm:px-4 sm:py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-lg border border-teal-500/20 transition-colors text-sm sm:text-sm md:text-base font-medium"
                            >
                              {loading ? "Sending..." : "Request Connection"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Carousel indicators with better mobile spacing */}
                  <div className="flex justify-center mt-4 sm:mt-4 space-x-2 sm:space-x-2">
                    {recommendedMerchants.map((merchant, index) => (
                      <button
                        key={merchant.id || `indicator-${index}`}
                        onClick={() => {
                          setActiveIndex(index);
                          stopCarousel();
                          setTimeout(startCarousel, mobilePauseDuration);
                        }}
                        className={`w-2 h-2 sm:w-2 sm:h-2 rounded-full transition-all ${
                          index === activeIndex
                            ? "bg-teal-500 w-4 sm:w-4"
                            : "bg-gray-600"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          }

          {hasUserBackendProfile && userProfile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
              {/* User Profile Section */}
              <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
                  <motion.div
                    className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-[#5EEAD4] shadow-lg flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={userProfile.photoUrl || "/logo.svg"}
                      alt={userProfile.displayName || "User"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/logo.svg";
                      }}
                    />
                  </motion.div>

                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FAB609] mb-1 sm:mb-2">
                      {userProfile.displayName}
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm md:text-base text-gray-400 mb-2 sm:mb-3">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="break-all">
                        {userProfile.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-400">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="break-all">UID: {userProfile.uid}</span>
                    </div>
                  </div>

                  <motion.div
                    className={`inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border-2 flex-shrink-0 ${
                      currentStatus === "verified"
                        ? "bg-green-700/20 border-green-500 text-green-400"
                        : currentStatus === "rejected"
                        ? "bg-red-700/20 border-red-500 text-red-400"
                        : "bg-yellow-700/20 border-yellow-500 text-yellow-400"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {getStatusIcon(currentStatus)}
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm">
                        {currentStatus.charAt(0).toUpperCase() +
                          currentStatus.slice(1)}
                      </div>
                      <div className="text-[10px] sm:text-xs opacity-80 hidden sm:block">
                        {getStatusText(currentStatus)}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Conditional rendering based on verification status */}
              {currentStatus !== "verified" ? (
                <motion.div
                  className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <button
                    onClick={() => toggleSection("documents")}
                    className="w-full flex items-center justify-between text-left hover:bg-gray-800/50 p-2 sm:p-3 md:p-4 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#00ffb4]" />
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white">
                        Document Verification
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedSections.documents ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedSections.documents && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 sm:mt-3 space-y-2 sm:space-y-3 md:space-y-4"
                      >
                        {/* Aadhaar Card */}
                        <motion.div
                          className="bg-gray-800/50 border border-gray-700 p-3 sm:p-4 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                              <span className="text-white text-sm sm:text-base font-medium">
                                Aadhaar Card
                              </span>
                            </div>
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                          </div>
                          <div className="mt-2 sm:mt-3 flex flex-col items-center">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="cursor-pointer"
                              onClick={() => {
                                const url =
                                  userProfile.documents?.aadhaar?.downloadURL;
                                if (url) {
                                  handleImageClick(url);
                                }
                              }}
                            >
                              <Image
                                width={500}
                                height={500}
                                src={
                                  userProfile.documents?.aadhaar?.downloadURL
                                }
                                alt="Aadhaar Document"
                                className="w-full max-w-xs sm:max-w-md h-40 sm:h-48 object-contain rounded-lg border border-gray-600 hover:border-[#00ffb4] transition-colors"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                        {/* PAN Card */}
                        <motion.div
                          className="bg-gray-800/50 border border-gray-700 p-3 sm:p-4 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                              <span className="text-white text-sm sm:text-base font-medium">
                                PAN Card
                              </span>
                            </div>
                            {userProfile.documents?.pan?.downloadURL ? (
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                            )}
                          </div>
                          <div className="mt-2 sm:mt-3 flex flex-col items-center">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="cursor-pointer"
                              onClick={() => {
                                const url =
                                  userProfile.documents?.pan?.downloadURL;
                                if (url) {
                                  handleImageClick(url);
                                }
                              }}
                            >
                              <Image
                                width={500}
                                height={500}
                                src={userProfile.documents?.pan?.downloadURL}
                                alt="PAN Document"
                                className="w-full max-w-xs sm:max-w-md h-40 sm:h-48 object-contain rounded-lg border border-gray-600 hover:border-[#00ffb4] transition-colors"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                        {/* Face Verification */}
                        <motion.div
                          className="bg-gray-800/50 border border-gray-700 p-3 sm:p-4 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                              <span className="text-white text-sm sm:text-base font-medium">
                                Face Verification
                              </span>
                            </div>
                            {userProfile.faceAuth?.downloadURL ? (
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                            )}
                          </div>
                          <div className="mt-2 sm:mt-3 flex flex-col items-center">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="cursor-pointer"
                              onClick={() => {
                                const url = userProfile.faceAuth?.downloadURL;
                                if (url) {
                                  handleImageClick(url);
                                }
                              }}
                            >
                              <Image
                                width={500}
                                height={500}
                                src={userProfile.faceAuth?.downloadURL}
                                alt="Face Verification"
                                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border border-gray-600 hover:border-[#00ffb4] transition-colors"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-12">
                      {/* Credit Amount Section */}
                      <div className="w-full lg:w-auto text-center lg:text-left">
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2 flex items-center justify-center lg:justify-start">
                          Credit Spend
                        </h3>
                        <p className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#FAB609] mb-4 lg:mb-8">
                          {`₹${String(userProfile?.creditedAmount)}`}
                        </p>
                      </div>

                      {/* Buttons Section */}
                      <div className="w-full lg:w-auto">
                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 min-w-0 lg:min-w-[300px]">
                          <PaymentBtn
                            currentUserId={userProfile?.uid}
                            onCreditUpdate={(newCredit) => {
                              setUserData((prev) => {
                                if (!prev[0]) return prev;
                                return [
                                  {
                                    uid: prev[0].uid,
                                    displayName: prev[0].displayName,
                                    email: prev[0].email,
                                    phoneNumber: prev[0].phoneNumber,
                                    photoUrl: prev[0].photoUrl || "",
                                    status: prev[0].status,
                                    isVerified: prev[0].isVerified,
                                    creditedAmount: newCredit,
                                    merchantRel: prev[0].merchantRel || "",
                                    documents: prev[0].documents
                                      ? prev[0].documents
                                      : {
                                          aadhaar: { downloadURL: "" },
                                          pan: { downloadURL: "" },
                                        },
                                    faceAuth: prev[0].faceAuth
                                      ? prev[0].faceAuth
                                      : { downloadURL: "" },
                                  },
                                ];
                              });
                            }}
                          />
                          <motion.button
                            className="w-full sm:w-auto sm:min-w-[100px] lg:min-w-[120px] px-4 py-3 border rounded-lg bg-[#0193C0]/50 hover:bg-[#0193C0]/90 transition-all duration-300 text-sm md:text-base font-medium text-white"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            EMI
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  {/* Transaction History */}
                  <motion.div
                    className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 lg:mb-6">
                      <Wallet className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#00ffb4]" />
                      <h3 className="text-base md:text-lg lg:text-xl font-semibold text-white">
                        Latest Transactions
                      </h3>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      {(transactions || []).map((transaction, index) => (
                        <motion.div
                          key={transaction.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between p-2 md:p-3 lg:p-4 bg-gray-800/30 rounded-lg md:rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3 md:gap-4">
                            <div
                              className={`p-1 md:p-2 rounded-full ${
                                transaction.type === "credit_push"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {transaction.type === "credit_push" ? (
                                <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4" />
                              ) : (
                                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                              )}
                            </div>
                            <div className="max-w-[150px] md:max-w-none">
                              <p className="text-white font-medium text-sm md:text-base truncate md:whitespace-normal">
                                {transaction.description || `Amount Paid`}
                              </p>
                              <p className="text-gray-400 text-xs md:text-sm">
                                {formatDate(transaction.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold text-sm md:text-base ${
                                transaction.type === "credit_push"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {transaction.type === "credit_push" ? "+" : "-"}₹
                              {transaction.paidAmount ||
                                transaction.creditedAmount ||
                                (transaction.amount
                                  ? transaction.amount / 100
                                  : 0)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}

              {/* Status Messages */}
              <AnimatePresence>
                {currentStatus === "pending" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-yellow-900/20 border border-yellow-500/30 backdrop-blur-sm rounded-2xl p-8 text-center"
                  >
                    <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-yellow-400 font-bold text-2xl mb-3">
                      Verification Pending
                    </h3>
                    <p className="text-gray-300 text-lg">
                      Your verification is currently under review.
                    </p>
                  </motion.div>
                )}

                {currentStatus === "rejected" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-900/20 border border-red-500/30 backdrop-blur-sm rounded-2xl p-8 text-center"
                  >
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-red-400 font-bold text-2xl mb-3">
                      Verification Rejected
                    </h3>
                    <p className="text-red-300 mb-4 text-lg">
                      Your verification documents have been rejected. You are no
                      longer eligible to use TripX Pay facilities.
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      Please contact our support team if you believe this is an
                      error or if you would like to resubmit your documents.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {(currentStatus === "rejected" ||
                  currentStatus === "unknown") && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReapply}
                      className="flex-1 py-4 text-lg font-semibold text-gray-900 bg-gradient-to-r from-[#00FFB4] to-[#5EEAD4] rounded-xl hover:from-[#00FFB4]/90 hover:to-[#5EEAD4]/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00FFB4] focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
                    >
                      Reapply for Verification
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogoutAndDeleteData}
                      disabled={isDeleting}
                      className={`flex-1 py-4 text-lg font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg ${
                        isDeleting
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                      }`}
                    >
                      {isDeleting ? (
                        <span className="flex items-center justify-center">
                          <Clock className="animate-spin w-5 h-5 mr-2" />
                          Deleting Data...
                        </span>
                      ) : (
                        "Delete Your Data"
                      )}
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-2xl p-8 text-center text-gray-400"
            >
              <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-gray-400 font-bold text-xl mb-3">
                No User Data Found
              </h3>
              <p className="text-gray-400 mb-6">
                It looks like your verification data is missing or incomplete in
                our records. Please reapply to complete your verification
                process.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReapply}
                className="py-4 px-8 text-lg font-semibold text-gray-900 bg-gradient-to-r from-[#00FFB4] to-[#5EEAD4] rounded-xl hover:from-[#00FFB4]/90 hover:to-[#5EEAD4]/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00FFB4] focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
              >
                Reapply for Verification
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>

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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseImage}
                className="absolute -top-4 -right-4 z-10 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <div className="absolute bottom-4 right-4 z-10 flex gap-2">
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

              <div className="absolute bottom-4 left-4 z-10 bg-gray-800/80 text-white px-3 py-1 rounded-full text-sm">
                {Math.round(scale * 100)}%
              </div>

              <motion.div
                className="relative w-full aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden"
                style={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img
                  src={selectedImage}
                  alt="Document preview"
                  className="w-full h-full object-contain select-none"
                  draggable="false"
                />
              </motion.div>

              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-800/80 text-white px-4 py-2 rounded-full text-sm">
                Hold Ctrl + Scroll to zoom
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Verified;
