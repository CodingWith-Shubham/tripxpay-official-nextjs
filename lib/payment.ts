import { ref, set, get, push } from "firebase/database";
import { database } from "@/lib/firebase";

export async function getUserInfo(uid: string) {
  try {
    const sanpshot = await get(ref(database, `users/${uid}`));
    if (sanpshot.exists()) {
      return sanpshot.val();
    } else {
      return {};
    }
  } catch (error) {
    console.log("error while getting the user", error);
    throw error;
  }
}

// Load Razorpay script (client-side only)
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = (error: any) => reject(new Error(`Failed to load Razorpay script: ${error.message}`));
      document.body.appendChild(script);
    } catch (error: any) {
      reject(new Error(`Error initializing Razorpay script: ${error.message}`));
    }
  });
};

// Get current credited amount
export const getCurrentCredit = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const creditRef = ref(database, `users/${userId}/creditedAmount`);
    const snapshot = await get(creditRef);
    return snapshot.exists() ? snapshot.val() : 0;
  } catch (error: any) {
    console.error('Error fetching user credit:', error);
    throw new Error(`Failed to get user credit: ${error.message}`);
  }
};

// Update credited amount
export const updateUserCreditAmount = async (userId: string, newAmount: number) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (typeof newAmount !== 'number' || isNaN(newAmount)) {
      throw new Error('Invalid amount provided');
    }
    const creditRef = ref(database, `users/${userId}/creditedAmount`);
    await set(creditRef, newAmount);
  } catch (error: any) {
    console.error('Error updating user credit:', error);
    throw new Error(`Failed to update user credit: ${error.message}`);
  }
};

// Upload transaction info
export const uploadTransactionInfo = async (userId: string, orderInfo: any) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!orderInfo || typeof orderInfo !== 'object') {
      throw new Error('Invalid order information provided');
    }

    // Create a timestamp for the transaction
    const timestamp = new Date().toISOString();
    const transactionWithTimestamp = {
      ...orderInfo,
      timestamp,
    };

    // Store under users/{userId}/transactions/{transactionId}
    const transactionsRef = ref(database, `users/${userId}/transactions`);
    const newTransactionRef = push(transactionsRef);

    await set(newTransactionRef, transactionWithTimestamp);

    return {
      success: true,
      transactionId: newTransactionRef.key,
      timestamp
    };
  } catch (error: any) {
    console.error('Error uploading transaction:', error);
    throw new Error(`Failed to upload transaction: ${error.message}`);
  }
}; 