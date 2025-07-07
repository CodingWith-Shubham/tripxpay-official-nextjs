import {
  get,
  ref,
  set,
  query,
  orderByChild,
  equalTo,
  push,
  serverTimestamp,
  onValue,
  off,
  update,
  remove,
} from "firebase/database";
import { database } from "@/lib/firebase";

// Enhanced function to upload documents with better structure
export async function uploadDocuments(
  displayName: string,
  email: string,
  photoUrl: string,
  uid: string,
  msmeCertificate: string,
  gstCertificate: string,
  faceImage: string,
  isEmailVerified: boolean,
  address: string,
  profilePicture: string,
  phoneNumber: string,
  profession: string,
  fatherName: string,
  merchantRel: string
) {
  try {
    const userData = {
      displayName,
      email,
      merchantRel: merchantRel || null,
      photoUrl: profilePicture || photoUrl,
      uid,
      phoneNumber,
      address,
      profession,
      fatherName,
      isEmailVerified,
      isVerified: false,
      creditedAmount: 0,
      submittedAt: serverTimestamp(),
      status: "pending",
      documents: {
        pan: msmeCertificate
          ? {
              downloadURL: msmeCertificate,
              type: "pan",
              uploadedAt: serverTimestamp(),
            }
          : null,
        aadhaar: gstCertificate
          ? {
              downloadURL: gstCertificate,
              type: "aadhaar",
              uploadedAt: serverTimestamp(),
            }
          : null,
      },
      faceAuth: faceImage
        ? {
            downloadURL: faceImage,
            uploaded: true,
            uploadedAt: serverTimestamp(),
          }
        : null,
    };

    await update(ref(database, `users/${uid}`), userData);
    console.log("User data saved successfully", `users/${uid}`);
    return { success: true };
  } catch (error) {
    console.log("Unable to save the data", error);
    throw error;
  }
}

export async function getUserInfo(uid: string) {
  try {
    const res = await fetch(`/api/user/getuserdata?uid=${uid}`);
    const json = await res.json();
    return json.data || {};
  } catch (error) {
    console.log("error while getting the user", error);
    throw error;
  }
}

// Get all users
export const getAllUsers = async () => {
  const snapshot = await get(ref(database, "users"));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return {};
  }
};

export async function uploadMerchantDocuments(
  displayName: string,
  email: string,
  photoUrl: string,
  uid: string,
  msmeCertificate: string,
  gstCertificate: string,
  isEmailVerified: boolean,
  address: string,
  profilePicture: string,
  phoneNumber: string,
  companyName: string
) {
  try {
    const merchantData = {
      displayName,
      email,
      photoUrl: profilePicture || photoUrl,
      merchantId: uid,
      phoneNumber,
      address,
      companyName,
      isEmailVerified,
      isVerified: false,
      submittedAt: serverTimestamp(),
      documents: {
        msmeCertificate: msmeCertificate
          ? {
              downloadURL: msmeCertificate,
              type: "msmeCertificate",
              uploadedAt: serverTimestamp(),
            }
          : null,
        gstCertificate: gstCertificate
          ? {
              downloadURL: gstCertificate,
              type: "gstCertificate",
              uploadedAt: serverTimestamp(),
            }
          : null,
      },
    };

    await set(ref(database, `merchants/${uid}`), merchantData);
    console.log("Merchant data saved successfully", `merchants/${uid}`);
    return { success: true };
  } catch (error) {
    console.log("Unable to save the merchant data", error);
    throw error;
  }
}

export async function deleteUserInfo(uid: string) {
  try {
    await remove(ref(database, `users/${uid}`));
    return { success: true, error: "Your data deleted successfully" };
  } catch (error) {
    console.log("error while deleting the user information ", error);
    throw error;
  }
} 