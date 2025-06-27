"use server";
import { cookies } from "next/headers";

export async function getUserInfo() {
  try {
    const token = (await cookies()).get("tripxPay__token")?.value;
    if (!token) {
      return null;
    }

    const decoded = JSON.parse(token);
    if (!decoded) {
      return null;
    }
    return decoded;
  } catch (error) {
    console.log("error to extract the info from the token", error);
    return null;
  }
}
