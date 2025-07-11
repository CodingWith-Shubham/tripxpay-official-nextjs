"use client";
import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { FaHandshake } from "react-icons/fa6";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  User,
  CreditCard,
  Upload,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/Auth";
import { toast } from "sonner";

import { database } from "@/lib/firebase";
import { MerchantCard } from "@/components/MerchantCard";
import TypewriterEffect from "@/components/TypewriterEffect";
import Link from "next/link";
import {
  equalTo,
  get,
  limitToFirst,
  orderByChild,
  query,
  ref,
  startAfter,
  update,
} from "firebase/database";

// Type definitions
type UserData = {
  uid: string;
  displayName?: string;
  email?: string;
  photoUrl?: string;
  phoneNumber?: string;
  status?: string;
  submittedAt?: number;
  merchantRel?: string;
  [key: string]: any;
};

type MerchantData = {
  uid: string;
  displayName: string;
  merchantId: string;
  photoUrl?: string;
  companyName?: string;
  isVerified: boolean;
  [key: string]: any;
};

type Customer = {
  userId: string;
  userData: UserData;
};

type ConnectionRequest = {
  id: string;
  status: string;
  timestamp?: number;
  userData: UserData;
};

const MerchantDashboard = () => {
  const { currentUser } = useAuth();
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customersLoading, setCustomersLoading] = useState<boolean>(true);
  const [connectionRequests, setConnectionRequests] = useState<
    ConnectionRequest[]
  >([]);
  const [requestsLoading, setRequestsLoading] = useState<boolean>(true);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [lastItemKey, setLastItemKey] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Invites pagination
  const [invitesPage, setInvitesPage] = useState<number>(1);
  const [invitesPerPage] = useState<number>(5);
  const [lastInviteKey, setLastInviteKey] = useState<number | null>(null);
  const [hasMoreInvites, setHasMoreInvites] = useState<boolean>(true);

  const fetchMerchant = async (): Promise<void> => {
    setLoading(true);
    try {
      if (currentUser?.uid) {
        const response = await fetch(
          `/api/getmerchantdata?merchantid=${currentUser?.uid}`,
          { method: "POST" }
        );
        const { data } = await response.json();
        setMerchantData({
          uid: currentUser?.uid,
          ...data,
        });
      }
    } catch (error) {
      console.error("Error fetching merchant info:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchantRelUser = async (
    reset: boolean = false
  ): Promise<void> => {
    setCustomersLoading(true);
    try {
      if (currentUser?.uid) {
        const response = await fetch("/api/getmerchantconsumer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            merchantid: currentUser.uid,
            pageSize: itemsPerPage,
            lastkey: reset ? null : lastItemKey,
          }),
        });

        const { data, lastKey, hasMore } = await response.json();

        if (reset) {
          setCustomers(data);
        } else {
          setCustomers((prev) => [...prev, ...data]);
        }

        setLastItemKey(lastKey);
        setHasMore(hasMore);
      }
    } catch (error) {
      console.error("Error fetching merchant related users:", error);
    } finally {
      setCustomersLoading(false);
    }
  };

  const handleNextPage = (): void => {
    if (hasMore) {
      setPage((prev) => prev + 1);
      fetchMerchantRelUser();
    }
  };

  const handlePrevPage = (): void => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      fetchMerchantRelUser(true);
    }
  };

  const getStatusDisplay = (status?: string): React.ReactNode => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
            <Check className="w-4 h-4 mr-1" /> Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
            <Clock className="w-4 h-4 mr-1" /> Pending
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
            <X className="w-4 h-4 mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-600/20 text-gray-400">
            Unknown
          </span>
        );
    }
  };

  const handleCoPy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(
        `${window.origin}/login?merchantRel=${currentUser?.uid}`
      );
      toast.success("link copied", {
        position: "top-right",
        style: { backgroundColor: "#172533", border: "#FBAE04", color: "#fff" },
      });
    } catch (error) {
      console.log("error while coppy the merchant link", error);
      toast.error("unable to copy", {
        position: "top-right",
        style: { backgroundColor: "#172533", border: "#FBAE04", color: "#fff" },
      });
    }
  };

  const fetchConnectionRequests = async (
    reset: boolean = false
  ): Promise<void> => {
    setRequestsLoading(true);
    try {
      if (currentUser?.uid) {
        let requestsQuery;

        if (reset) {
          requestsQuery = query(
            ref(database, `merchantInvites/${currentUser?.uid}`),
            limitToFirst(invitesPerPage)
          );
          setInvitesPage(1);
          setLastInviteKey(null);
          setHasMoreInvites(true);
        } else if (lastInviteKey) {
          requestsQuery = query(
            ref(database, `merchantInvites/${currentUser?.uid}`),
            orderByChild("timestamp"),
            startAfter(lastInviteKey),
            limitToFirst(invitesPerPage)
          );
        } else {
          requestsQuery = query(
            ref(database, `merchantInvites/${currentUser?.uid}`),
            limitToFirst(invitesPerPage)
          );
        }

        const snapshot = await get(requestsQuery);

        if (snapshot.exists()) {
          const requests: ConnectionRequest[] = [];
          let lastKey: number | null = null;

          snapshot.forEach((childSnapshot) => {
            requests.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            });
            lastKey = childSnapshot.val().timestamp;
          });

          if (reset) {
            setConnectionRequests(requests);
          } else {
            setConnectionRequests((prev) => [...prev, ...requests]);
          }

          setLastInviteKey(lastKey);

          if (requests.length < invitesPerPage) {
            setHasMoreInvites(false);
          }
        } else {
          if (reset) {
            setConnectionRequests([]);
          }
          setHasMoreInvites(false);
        }
      }
    } catch (error) {
      console.error("Error fetching connection requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleNextInvitesPage = (): void => {
    if (hasMoreInvites) {
      setInvitesPage((prev) => prev + 1);
      fetchConnectionRequests();
    }
  };

  const handlePrevInvitesPage = (): void => {
    if (invitesPage > 1) {
      setInvitesPage((prev) => prev - 1);
      fetchConnectionRequests(true);
    }
  };

  const handleApproveRequest = async (requestId: string): Promise<void> => {
    try {
      await update(ref(database, `users/${requestId}`), {
        merchantRel: currentUser?.uid,
      });

      await update(
        ref(database, `merchantInvites/${currentUser?.uid}/${requestId}`),
        {
          status: "approved",
        }
      );

      toast.success("Request approved!", {
        position: "top-right",
        style: { backgroundColor: "#172533", border: "#FBAE04", color: "#fff" },
      });
      fetchConnectionRequests();
      fetchMerchantRelUser();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request", {
        position: "top-right",
        style: { backgroundColor: "#172533", border: "#FBAE04", color: "#fff" },
      });
    }
  };

  const handleRejectRequest = async (requestId: string): Promise<void> => {
    try {
      await update(
        ref(database, `merchantInvites/${currentUser?.uid}/${requestId}`),
        {
          status: "rejected",
        }
      );

      toast.success("Request rejected", { position: "top-right" });
      fetchConnectionRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request", {
        position: "top-right",
        style: { backgroundColor: "#172533", border: "#FBAE04", color: "#fff" },
      });
    }
  };

  useEffect(() => {
    fetchMerchant();
    fetchMerchantRelUser(true);
    fetchConnectionRequests(true);
  }, [currentUser?.uid]);

  const merchantName = merchantData?.displayName || "Merchant Name";
  const merchantId = merchantData?.merchantId || "N/A";
  const photoUrl = merchantData?.photoUrl;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-500/20 rounded-full filter blur-3xl animate-pulse delay-500" />

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#00FFB4]/30 rounded-full animate-bounce delay-300" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-yellow-400/40 rounded-full animate-bounce delay-700" />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-bounce delay-1000" />
      </div>

      {merchantData?.isVerified && (
        <section className="relative z-10">
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b rounded-md border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    <TypewriterEffect
                      texts={[
                        "Welcome",
                        merchantData.companyName || "Merchant",
                      ]}
                      className="inline-block"
                    />
                  </h1>
                  <p className="text-gray-400">
                    Manage your merchant account and customer relationships
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-4 md:mt-0"
                >
                  <button
                    onClick={handleCoPy}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/20 transition-colors"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Copy Invite Link</span>
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="space-y-8">
              {/* Merchant Info Card */}
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl p-8 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-600/50 animate-pulse border-2 border-gray-600"></div>
                    <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="flex flex-col mb-4 md:mb-0">
                        <div className="h-6 bg-gray-600/50 rounded-md w-32 animate-pulse"></div>
                        <div className="h-4 bg-gray-700/50 rounded-md w-48 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-700/50 rounded-md w-16 animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl p-8"
                >
                  <div className="flex items-center gap-4">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#00FFB4]"
                      />
                    ) : (
                      <div className="p-3 rounded-full bg-[#00FFB4]/20 text-[#00FFB4]">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="flex flex-col mb-4 md:mb-0">
                        <div className="flex items-center">
                          <h3 className="text-xl font-bold text-white">
                            {merchantName}
                          </h3>
                          <MdVerified
                            className="text-blue-500 mx-1"
                            size={20}
                            title="You are verified merchant"
                          />
                        </div>
                        <span className="text-gray-500">
                          Company: {merchantData?.companyName}
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        ID: {merchantId}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Customer List */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Registered Customers
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      Page {page} • {customers.length}{" "}
                      {customers.length === 1 ? "Customer" : "Customers"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={page === 1 || customersLoading}
                        className={`p-2 rounded-lg ${
                          page === 1
                            ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={!hasMore || customersLoading}
                        className={`p-2 rounded-lg ${
                          !hasMore
                            ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {customersLoading && page === 1 ? (
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-gray-800/60 rounded-xl border border-gray-700 animate-pulse"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                        </div>
                        <div className="h-6 bg-gray-700 rounded-full w-24"></div>
                      </motion.div>
                    ))
                  ) : customers.length > 0 ? (
                    <>
                      {customers.map((customer) => (
                        <Link
                          href={`/merchantdashboard/${customer.userId}`}
                          key={customer.userId}
                        >
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col md:flex-row md:items-center mb-3 gap-4 p-4 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-teal-500/30 transition-colors"
                          >
                            <div className="flex-shrink-0">
                              {customer.userData.photoUrl ? (
                                <img
                                  src={customer.userData.photoUrl}
                                  alt={
                                    customer.userData.displayName || "Customer"
                                  }
                                  className="w-12 h-12 rounded-full object-cover border-2 border-[#00FFB4]"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                  <User className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-white">
                                {customer.userData.displayName || "N/A"}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {customer.userData.email || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500">
                                UID: {customer.userId}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              {getStatusDisplay(customer.userData.status)}
                            </div>
                          </motion.div>
                        </Link>
                      ))}

                      {customersLoading && page > 1 && (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-500 p-8">
                      No registered customers found.
                    </div>
                  )}
                </div>

                {!customersLoading && customers.length > 0 && (
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        page === 1
                          ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-400">Page {page}</span>
                    <button
                      onClick={handleNextPage}
                      disabled={!hasMore}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        !hasMore
                          ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Connection Requests */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Connection Requests
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      Page {invitesPage} • {connectionRequests.length} Pending
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevInvitesPage}
                        disabled={invitesPage === 1 || requestsLoading}
                        className={`p-2 rounded-lg ${
                          invitesPage === 1
                            ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextInvitesPage}
                        disabled={!hasMoreInvites || requestsLoading}
                        className={`p-2 rounded-lg ${
                          !hasMoreInvites
                            ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {requestsLoading && invitesPage === 1 ? (
                  <div className="space-y-4">
                    {Array.from({ length: invitesPerPage }).map((_, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-800/60 rounded-xl border border-gray-700 animate-pulse"
                      >
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : connectionRequests.length > 0 ? (
                  <div className="space-y-4">
                    {connectionRequests
                      .filter((request) => request.status === "pending")
                      .map((request) => (
                        <div
                          key={request.id}
                          className="p-4 bg-gray-800/60 rounded-xl border border-gray-700"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-white">
                                {request.userData.displayName}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {request.userData.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                {request.userData.phoneNumber}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/20 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                    {requestsLoading && invitesPage > 1 && (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 p-8">
                    No pending connection requests
                  </div>
                )}

                {!requestsLoading && connectionRequests.length > 0 && (
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                    <button
                      onClick={handlePrevInvitesPage}
                      disabled={invitesPage === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        invitesPage === 1
                          ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-400">
                      Page {invitesPage}
                    </span>
                    <button
                      onClick={handleNextInvitesPage}
                      disabled={!hasMoreInvites}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        !hasMoreInvites
                          ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}
      {!merchantData?.isVerified && (
        <>
          {loading ? (
            <div className="w-full min-h-screen flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            merchantData && (
              <section className="w-full min-h-screen pt-10 flex flex-col items-center justify-center">
                <div className="w-full flex flex-col items-center sm:items-stretch sm:flex-row sm:justify-center">
                  <MerchantCard
                    data={{
                      ...merchantData,
                      companyName: merchantData.companyName || "Company Name",
                      displayName: merchantData.displayName || "Display Name",
                    }}
                    photoUrl={merchantData?.photoUrl || "/logo.svg"}
                    key={merchantData?.uid}
                    status={!merchantData?.isVerified ? "pending" : "approved"}
                  />
                </div>
              </section>
            )
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

export default MerchantDashboard;
