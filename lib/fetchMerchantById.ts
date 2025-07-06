import { get, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

export const fetchMerchantById = async (merchantId: string) => {
  try {
    const merchantRef = ref(database, `merchants/${merchantId}`);
    const snapshot = await get(merchantRef);

    if (snapshot.exists()) {
      return {
        id: merchantId,
        ...snapshot.val(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching merchant:", error);
    throw error;
  }
};

export const getRecommendedMerchants = async (limit = 5) => {
  try {
    const merchantsRef = ref(database, "merchants");
    const snapshot = await get(merchantsRef);
    if (snapshot.exists()) {
      const merchants: any[] = [];
      snapshot.forEach((childSnapshot) => {
        merchants.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      // Return random subset of merchants
      return merchants.sort(() => 0.5 - Math.random()).slice(0, limit);
    }
    return [];
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return [];
  }
};

export const sendConnectionRequest = async (
  merchantId: string,
  userId: string,
  userData: any
) => {
  try {
    const requestRef = ref(database, `merchantInvites/${merchantId}/${userId}`);
    await set(requestRef, {
      userId,
      userData,
      status: "pending",
      timestamp: Date.now(),
    });
    return true;
  } catch (error) {
    console.error("Error sending connection request:", error);
    return false;
  }
}; 