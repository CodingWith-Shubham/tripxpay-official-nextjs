"use client"
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
  } from "firebase/database";
  import { database } from "@/lib/firebase";
  
  // Enhanced function to upload documents with better structure
  export async function uploadDocuments(
    displayName,
    email,
    photoUrl,
    uid,
    msmeCertificate,
    gstCertificate,
    faceImage,
    isEmailVerified,
    address,
    profilePicture,
    phoneNumber,
    profession,
    fatherName,
    merchantRel
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
  
  export async function getUserInfo(uid) {
    try {
      const sanpshot = await get(ref(database, `users/${uid}`));
      if (sanpshot.exists()) {
        console.log("user foound");
        return sanpshot.val();
      } else {
        return {};
      }
    } catch (error) {
      console.log("error while getting the user", error);
    }
  }
  // export const pushData = async () => {
  //   const newUserRef = push(ref(database, "users"));
  //   await set(newUserRef, {
  //     name: "Jane Doe",
  //     email: "jane@example.com",
  //     age: 25,
  //   });
  //   console.log("New user ID:", newUserRef.key);
  // };
  // export const getUser = async (userId) => {
  //   const snapshot = await get(ref(database, `users/${userId}`));
  //   if (snapshot.exists()) {
  //     return snapshot.val();
  //   } else {
  //     throw new Error("User not found");
  //   }
  // };
  
  // // Get all users
  export const getAllUsers = async () => {
    const snapshot = await get(ref(database, "users"));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {};
    }
  };
  
  // // import { ref, update } from "firebase/database";
  
  // // Update specific fields
  // // const updateUser = async (userId, updates) => {
  // //   const userRef = ref(db, `users/${userId}`);
  // //   await update(userRef, {
  // //     ...updates,
  // //     lastUpdated: Date.now(),
  // //   });
  // // };
  
  // // // Batch update multiple paths
  // // const batchUpdate = async () => {
  // //   const updates = {};
  // //   updates[`users/user1/name`] = "Updated Name";
  // //   updates[`users/user1/lastSeen`] = Date.now();
  // //   updates[`posts/post1/title`] = "Updated Title";
  
  // //   await update(ref(db), updates);
  // // };
  
  export async function uploadMerchantDocuments(
    displayName,
    email,
    photoUrl,
    uid,
    msmeCertificate,
    gstCertificate,
    isEmailVerified,
    address,
    profilePicture,
    phoneNumber,
    companyName
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
  
import { remove } from "firebase/database";

export async function deleteUserInfo(uid) {
  try {
    await remove(ref(database, `users/${uid}`));
    return { success: true, error: "Your data deleted successfully" };
  } catch (error) {
    console.log("error while deleteing the user information ", error);
  }
}
