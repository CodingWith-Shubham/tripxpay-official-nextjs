// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import {
//   loadRazorpayScript,
//   getCurrentCredit,
//   updateUserCreditAmount,
//   uploadTransactionInfo,
//   getUserInfo,
// } from "../services/payment";

// const PaymentBtn = ({ currentUserId, onCreditUpdate }) => {
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       if (!currentUserId) {
//         setError("User ID is required");
//         setIsLoading(false);
//         return;
//       }

//       try {
//         setIsLoading(true);
//         setError(null);
//         // console.log(`currentUserId : ${currentUserId}`);
//         const response = await getUserInfo(currentUserId);
//         // console.log(`response : ${response}`);

//         if (!response) {
//           throw new Error("No user data found");
//         }

//         console.log("Fetched user data:", response);
//         setUserData({ ...response, id: currentUserId });
//       } catch (error) {
//         console.error("Error fetching user info:", error);
//         setError(error.message || "Failed to load user info");
//         toast.error("Failed to load user info");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [currentUserId]);

//   const handlePayNowBtn = async () => {
//     // console.log(`userData : ${userData.id}`);
//     if (!userData) {
//       toast.error("User data not loaded");
//       return;
//     }

//     if (!userData.creditedAmount || userData.creditedAmount <= 0) {
//       toast.error("No credit amount to pay");
//       return;
//     }

//     try {
//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         toast.error("Failed to load Razorpay script");
//         return;
//       }

//       const amountToPay = userData.creditedAmount * 100;

//       const transactionInfo = {
//         name: userData.displayName || "User",
//         email: userData.email,
//         phone: userData.phoneNumber,
//         address: userData.address,
//         userId: userData.id,
//         date: new Date().toLocaleString("en-IN"),
//         amount: amountToPay,
//       };

//       const options = {
//         key: process.env.RAZORPAY_API_KEY || "rzp_test_2u2uO4phE3V6TC",
//         amount: amountToPay,
//         currency: "INR",
//         name: "TripXPay",
//         description: "TripXPay Credit Payment",
//         handler: async function (response) {
//           console.log("Razorpay handler response:", response);
//           try {
//             // Get the latest credit amount after payment
//             const currentCredit = await getCurrentCredit(userData.id);
//             const paidAmount = amountToPay / 100;
//             const newAmount = currentCredit - paidAmount;

//             await updateUserCreditAmount(userData.id, newAmount);

//             const orderInfo = {
//               ...transactionInfo,
//               paymentID: response.razorpay_payment_id ?? "",
//               orderID: response.razorpay_order_id ?? "",
//               signature: response.razorpay_signature ?? "",
//               paidAmount,
//               newCreditAmount: newAmount,
//               type: "payment",
//             };

//             // Upload transaction info and wait for response
//             console.log("Calling uploadTransactionInfo with:", {
//               userId: userData.id,
//               orderInfo,
//             });
//             const uploadResult = await uploadTransactionInfo(
//               userData.id,
//               orderInfo
//             );
//             if (!uploadResult.success) {
//               throw new Error("Failed to record transaction");
//             }

//             console.log("Transaction recorded successfully:", uploadResult);

//             // Fetch the latest user data to ensure we have the most up-to-date information
//             const updatedUserData = await getUserInfo(userData.id);
//             if (updatedUserData) {
//               setUserData({ ...updatedUserData, id: userData.id });
//             }

//             toast.success("Payment successful and credit updated");

//             if (onCreditUpdate) {
//               onCreditUpdate(newAmount);
//             }
//           } catch (err) {
//             console.error(err);
//             toast.error("Payment succeeded but credit update failed");
//           }
//         },
//         prefill: {
//           name: userData.displayName || "User",
//           email: userData.email,
//           contact: userData.phoneNumber,
//         },
//         theme: {
//           color: "#051726",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error("Error initiating payment:", error);
//       toast.error("Failed to initiate payment");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex">
//         <motion.button
//           disabled
//           className="mx-2 border w-fit h-fit p-3 rounded-xl bg-gray-400 cursor-not-allowed"
//         >
//           Loading...
//         </motion.button>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex">
//         <motion.button
//           disabled
//           className="mx-2 border w-fit h-fit p-3 rounded-xl bg-red-400 cursor-not-allowed"
//         >
//           Error
//         </motion.button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex w-full">
//       <motion.button
//         onClick={handlePayNowBtn}
//         className="w-full border px-4 py-3 md:px-6 md:py-3 rounded-lg bg-[#FAAE04]/70 hover:bg-[#FAAE04]/90 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap text-sm md:text-base"
//       >
//         Pay Now
//       </motion.button>
//     </div>
//   );
// };

// export default PaymentBtn;
import React from "react";

const PaymentBtn = () => {
  return <div>PaymentBtn</div>;
};

export default PaymentBtn;
