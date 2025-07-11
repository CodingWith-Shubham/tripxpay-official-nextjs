"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// TypeScript interfaces
interface UserData {
  id: string;
  displayName?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  creditedAmount: number;
}

interface PaymentBtnProps {
  currentUserId?: string | undefined;
  onCreditUpdate?: (newCredit: number) => void;
}

interface RazorpayResponse {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentBtn: React.FC<PaymentBtnProps> = ({
  currentUserId,
  onCreditUpdate,
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!currentUserId) {
        setError("User ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        // console.log(`currentUserId : ${currentUserId}`);
        const { data } = await fetch(`/api/getuserdata?uid=${currentUserId}`, {
          method: "POST",
        }).then((res) => res.json());
        // console.log(`response : ${response}`);

        if (!data) {
          throw new Error("No user data found");
        }

        // console.log("Fetched user data:", response);
        setUserData({ ...data, id: currentUserId });
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError((error as Error).message || "Failed to load user info");
        toast.error("Failed to load user info");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [currentUserId]);

  const handlePayNowBtn = async () => {
    // console.log(`userData : ${userData.id}`);
    if (!userData) {
      toast.error("User data not loaded");
      return;
    }

    if (!userData.creditedAmount || userData.creditedAmount <= 0) {
      toast.error("No credit amount to pay");
      return;
    }

    try {
      const amountToPay = userData.creditedAmount * 100;

      const transactionInfo = {
        name: userData.displayName || "User",
        email: userData.email,
        phone: userData.phoneNumber,
        address: userData.address,
        userId: userData.id,
        date: new Date().toLocaleString("en-IN"),
        amount: amountToPay,
      };

      const options = {
        key: process.env.RAZORPAY_API_KEY || "rzp_test_2u2uO4phE3V6TC",
        amount: amountToPay,
        currency: "INR",
        name: "TripXPay",
        description: "TripXPay Credit Payment",
        handler: async function (response: RazorpayResponse) {
          // console.log('Razorpay handler response:', response);
          try {
            // Get the latest credit amount after payment
            const { currentCredit } = await fetch(
              `/api/getcreditamount?uid=${userData?.id}`,
              { method: "POST" }
            ).then((res) => res.json());
            const paidAmount = amountToPay / 100;
            const newAmount = currentCredit - paidAmount;

            await fetch(
              `/api/updatecredit?amount=${newAmount}&userid=${userData.id}`,
              { method: "PUT" }
            );
            const orderInfo = {
              ...transactionInfo,
              paymentID: response.razorpay_payment_id ?? "",
              orderID: response.razorpay_order_id ?? "",
              signature: response.razorpay_signature ?? "",
              paidAmount,
              newCreditAmount: newAmount,
              type: "payment",
            };

            // Upload transaction info and wait for response
            // console.log('Calling uploadTransactionInfo with:', {
            //   userId: userData.id,
            //   orderInfo
            // });
            const uploadResult = await fetch(
              `/api/updatetransaction?userid=${userData.id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderinfo: orderInfo }),
              }
            ).then((res) => res.json());
            if (!uploadResult.success) {
              throw new Error("Failed to record transaction");
            }

            // console.log('Transaction recorded successfully:', uploadResult);

            // Fetch the latest user data to ensure we have the most up-to-date information
            const { data } = await fetch(
              `/api/getuserdata?uid=${userData.id}`,
              { method: "POST" }
            ).then((res) => res.json());
            if (data) {
              setUserData({ ...data, id: userData.id });
            }

            toast.success("Payment successful and credit updated");

            if (onCreditUpdate) {
              onCreditUpdate(newAmount);
            }
          } catch (err) {
            console.error(err);
            toast.error("Payment succeeded but credit update failed");
          }
        },
        prefill: {
          name: userData.displayName || "User",
          email: userData.email,
          contact: userData.phoneNumber,
        },
        theme: {
          color: "#051726",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment");
    }
  };

  if (isLoading) {
    return (
      <motion.button
        disabled
        className=" sm:w-auto sm:min-w-[100px] lg:min-w-[120px] px-4 py-3  mx-2 border w-fit h-fit p-3 rounded-xl bg-gray-400 cursor-not-allowed transition-all duration-300 text-sm md:text-base font-medium text-white"
      >
        Loading...
      </motion.button>
    );
  }

  if (error) {
    return (
      <motion.button
        disabled
        className=" sm:w-auto sm:min-w-[100px] lg:min-w-[120px] px-4 py-3   mx-2 border w-fit h-fit p-3 rounded-xl bg-gray-400 cursor-not-allowed transition-all duration-300 text-sm md:text-base font-medium text-white"
      >
        Error
      </motion.button>
    );
  }

  return (
    <motion.button
      className="w-full sm:w-auto sm:min-w-[100px] lg:min-w-[120px] px-4 py-3 border rounded-lg bg-[#FAB609]/50 hover:bg-[#0193C0]/90 transition-all duration-300 text-sm md:text-base font-medium text-white"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePayNowBtn}
    >
      Pay Now
    </motion.button>
  );
};

export default PaymentBtn;
