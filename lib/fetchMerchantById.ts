import { get, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

export const fetchMerchantById = async (merchantId: string) => {
  try {
    const res= await fetch(`api/fetchMerchantById?merchantId=${merchantId}`);
    const json = await res.json();
    console.log(`my API call : ${json.data}`);

    if (json.data) {
      return {
        id: merchantId,
        ...json.data,
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
    const res = await fetch(`api/merchantrecommendation?limit=${limit}`);
    const { merchants } = await res.json(); // Await the JSON parsing

    if (merchants && Array.isArray(merchants)) {
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